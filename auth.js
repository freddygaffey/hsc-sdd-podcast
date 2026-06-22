// auth.js — OPTIONAL end-to-end-encrypted sync for the podcast PWA.
//
// The app works fully without an account (guest, local-only — the default).
// Logging in adds cross-device sync of your PROGRESS and QUIZ results. Downloads
// are NOT synced (they mirror each device's local audio cache). Backend: auth-worker/.
//
// Crypto: password + salt --PBKDF2--> an AES-GCM key (encrypts blobs, never sent)
// and a separate authToken (sent as Bearer; the server stores only its SHA-256).
// The server sees only ciphertext, so it can't read your progress or password;
// and because writes are authenticated, nobody else can tamper with your data.
(() => {
  // Set after deploying auth-worker (e.g. https://hsc-podcast-auth.<acct>.workers.dev).
  const AUTH_API = "https://hsc-podcast-auth.fredgaffey08.workers.dev";

  const SUBJECT = location.hostname.includes("phy") ? "phy" : "se";
  const SESSION_KEY = "podcast-sync-session";
  const LASTID_KEY = "podcast-sync-lastid-" + SUBJECT;
  const PROGRESS_KEY = "podcast-progress";
  const QUIZ_KEY = "podcast-quiz-sr";

  const td = new TextDecoder();
  const te = new TextEncoder();
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  let session = null; // { username, salt, authToken, encKey(CryptoKey) }
  let syncTimer = null;
  let syncing = false;

  // --- crypto ---
  async function pbkdf2Bits(password, saltStr, bits) {
    const base = await crypto.subtle.importKey("raw", te.encode(password), "PBKDF2", false, ["deriveBits"]);
    return crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: te.encode(saltStr), iterations: 150000, hash: "SHA-256" }, base, bits);
  }
  async function deriveKeys(password, salt) {
    const rawEnc = await pbkdf2Bits(password, salt + "|enc", 256);
    const encKey = await crypto.subtle.importKey("raw", rawEnc, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
    const authToken = b64(await pbkdf2Bits(password, salt + "|auth", 256));
    return { encKey, authToken };
  }
  async function encryptJSON(obj, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, te.encode(JSON.stringify(obj)));
    return { iv: b64(iv), blob: b64(ct) };
  }
  async function decryptJSON({ iv, blob }, key) {
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(iv) }, key, unb64(blob));
    return JSON.parse(td.decode(pt));
  }

  // --- session persistence (so sync survives reloads without re-entering password) ---
  async function saveSession() {
    const jwk = await crypto.subtle.exportKey("jwk", session.encKey);
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      username: session.username, salt: session.salt, authToken: session.authToken, encKeyJwk: jwk,
    }));
  }
  async function loadSession() {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (!s) return null;
      const encKey = await crypto.subtle.importKey("jwk", s.encKeyJwk, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
      return { username: s.username, salt: s.salt, authToken: s.authToken, encKey };
    } catch { return null; }
  }

  // --- API ---
  async function api(path, { method = "GET", body, auth } = {}) {
    if (!AUTH_API) throw new Error("sync-not-configured");
    const headers = {};
    if (body) headers["Content-Type"] = "application/json";
    if (auth) { headers["Authorization"] = "Bearer " + session.authToken; headers["X-Username"] = session.username; }
    const res = await fetch(AUTH_API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    return res;
  }

  // --- local store helpers ---
  const readStore = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
  const writeStore = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const localState = () => ({ progress: readStore(PROGRESS_KEY), quiz: readStore(QUIZ_KEY) });

  // Merge a remote snapshot into local, newest-wins per entry.
  function mergeState(remote) {
    if (!remote) return;
    const prog = readStore(PROGRESS_KEY);
    for (const [id, r] of Object.entries(remote.progress || {})) {
      const l = prog[id];
      const lt = l && l.lastPlayed ? Date.parse(l.lastPlayed) : 0;
      const rt = r && r.lastPlayed ? Date.parse(r.lastPlayed) : 0;
      if (!l || rt >= lt) prog[id] = r;
    }
    writeStore(PROGRESS_KEY, prog);

    const quiz = readStore(QUIZ_KEY);
    for (const [key, r] of Object.entries(remote.quiz || {})) {
      const l = quiz[key];
      if (!l || (r.total || 0) >= (l.total || 0)) quiz[key] = r; // attempts are monotonic
    }
    writeStore(QUIZ_KEY, quiz);
  }

  // --- sync ---
  async function syncNow() {
    if (!session || !AUTH_API || syncing) return;
    syncing = true;
    try {
      const lastId = parseInt(localStorage.getItem(LASTID_KEY) || "0", 10) || 0;
      const res = await api(`/events?subject=${SUBJECT}&since=${lastId}`, { auth: true });
      if (res.status === 401) { signOut(); throw new Error("auth-expired"); }
      const { events = [] } = await res.json();
      let maxId = lastId, changed = false;
      for (const ev of events) {
        try { mergeState(await decryptJSON(ev, session.encKey)); changed = true; } catch {}
        if (ev.id > maxId) maxId = ev.id;
      }
      // Push current merged state as a new snapshot event.
      const enc = await encryptJSON(localState(), session.encKey);
      const pushRes = await api("/events", { method: "POST", auth: true, body: { subject: SUBJECT, events: [enc] } });
      if (pushRes.ok) { const { lastId: l } = await pushRes.json(); if (l > maxId) maxId = l; }
      localStorage.setItem(LASTID_KEY, String(maxId));
      if (changed) window.dispatchEvent(new CustomEvent("sync-updated"));
      return true;
    } finally { syncing = false; }
  }

  function scheduleSync() {
    if (!session || !AUTH_API) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => { syncNow().catch(() => {}); }, 4000);
  }

  // --- auth actions ---
  async function signUp(username, password) {
    username = username.toLowerCase();
    const salt = b64(crypto.getRandomValues(new Uint8Array(16)));
    const { encKey, authToken } = await deriveKeys(password, salt);
    const res = await api("/signup", { method: "POST", body: { username, salt, authToken } });
    if (res.status === 409) throw new Error("Username already taken.");
    if (!res.ok) throw new Error("Sign-up failed.");
    session = { username, salt, authToken, encKey };
    await saveSession();
    localStorage.setItem(LASTID_KEY, "0");
    await syncNow();
  }
  async function logIn(username, password) {
    username = username.toLowerCase();
    const saltRes = await api(`/salt?username=${encodeURIComponent(username)}`);
    if (saltRes.status === 404) throw new Error("No account with that username.");
    if (!saltRes.ok) throw new Error("Login failed.");
    const { salt } = await saltRes.json();
    const { encKey, authToken } = await deriveKeys(password, salt);
    session = { username, salt, authToken, encKey };
    // Verify credentials with an authed pull starting from 0.
    const check = await api(`/events?subject=${SUBJECT}&since=0`, { auth: true });
    if (check.status === 401) { session = null; throw new Error("Wrong password."); }
    if (!check.ok) { session = null; throw new Error("Login failed."); }
    await saveSession();
    localStorage.setItem(LASTID_KEY, "0");
    await syncNow();
  }
  function signOut() {
    session = null;
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LASTID_KEY);
  }

  const isLoggedIn = () => !!session;

  // --- Settings UI (rendered into #sync-panel) ---
  function suggestUsername() {
    const adj = ["calm", "bright", "swift", "keen", "bold", "lucid", "brave", "quiet"];
    const noun = ["otter", "comet", "delta", "quark", "raven", "cedar", "atom", "fox"];
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    return `${pick(adj)}-${pick(noun)}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  function renderPanel() {
    const el = document.getElementById("sync-panel");
    if (!el) return;
    if (!AUTH_API) {
      el.innerHTML = `<p class="setting-hint">Cloud sync isn't switched on yet.</p>`;
      return;
    }
    if (isLoggedIn()) {
      el.innerHTML = `
        <div class="setting-row"><span class="setting-label">Synced as</span><span class="setting-value">${session.username}</span></div>
        <div class="sync-actions"><button id="sync-now" class="setting-btn">Sync now</button><button id="sync-out" class="setting-btn-ghost">Sign out</button></div>
        <p class="setting-hint" id="sync-status">Your progress and quiz results sync across devices.</p>`;
      el.querySelector("#sync-now").addEventListener("click", async (e) => {
        const s = el.querySelector("#sync-status"); s.textContent = "Syncing…";
        try { await syncNow(); s.textContent = "Synced just now."; } catch { s.textContent = "Sync failed — try again."; }
      });
      el.querySelector("#sync-out").addEventListener("click", () => { signOut(); renderPanel(); });
    } else {
      el.innerHTML = `
        <p class="setting-hint">Optional — the app works fully without an account. Sign in to sync your progress and quiz results across devices.</p>
        <input id="sync-user" class="sync-input" placeholder="username" autocomplete="username" value="${suggestUsername()}">
        <input id="sync-pass" class="sync-input" type="password" placeholder="password" autocomplete="current-password">
        <div class="sync-actions"><button id="sync-login" class="setting-btn">Sign in</button><button id="sync-signup" class="setting-btn-ghost">Create account</button></div>
        <p class="setting-hint" id="sync-status"></p>`;
      const status = el.querySelector("#sync-status");
      const u = () => el.querySelector("#sync-user").value.trim();
      const p = () => el.querySelector("#sync-pass").value;
      const guard = () => {
        if (!/^[a-z0-9_-]{3,40}$/.test(u().toLowerCase())) { status.textContent = "Username: 3–40 chars, letters/numbers/-/_"; return false; }
        if (p().length < 6) { status.textContent = "Password must be at least 6 characters."; return false; }
        return true;
      };
      el.querySelector("#sync-login").addEventListener("click", async () => {
        if (!guard()) return; status.textContent = "Signing in…";
        try { await logIn(u(), p()); renderPanel(); window.dispatchEvent(new CustomEvent("sync-updated")); }
        catch (err) { status.textContent = err.message; }
      });
      el.querySelector("#sync-signup").addEventListener("click", async () => {
        if (!guard()) return; status.textContent = "Creating account…";
        try { await signUp(u(), p()); renderPanel(); }
        catch (err) { status.textContent = err.message; }
      });
    }
  }

  // --- init ---
  loadSession().then((s) => { session = s; if (s) syncNow().catch(() => {}); });

  window.Sync = { scheduleSync, syncNow, isLoggedIn, renderPanel };
})();
