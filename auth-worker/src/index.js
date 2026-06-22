// hsc-podcast-auth — shared sync backend for the SE + Physics podcast PWAs.
//
// Design (decided with the user): end-to-end encrypted, append-only event log.
//  - The client derives two things from password+salt (PBKDF2): an AES-GCM
//    encryption key that NEVER leaves the device, and an authToken that does.
//  - The server only ever sees: username, public salt, SHA-256(authToken), and
//    opaque AES-GCM ciphertext. It can't read your progress or your password.
//  - Integrity is the point: only someone who knows your password can append to
//    your log, so randoms can't modify/poison your data. Confidentiality is a
//    bonus. "Good enough to deter", not bank-grade.

const ALLOWED_ORIGINS = new Set([
  "https://se.pebnum.com",
  "https://phy.pebnum.com",
  "https://hsc-podcast.pages.dev",
  "https://hsc-phy-podcast.pages.dev",
  "http://localhost:8765",
]);
const SUBJECTS = new Set(["se", "phy"]);
const MAX_BLOB = 64 * 1024;        // per-event ciphertext cap (anti-abuse)
const MAX_EVENTS_PER_REQ = 200;

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Username",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}
function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors(origin) },
  });
}
async function sha256(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const validUsername = (u) => typeof u === "string" && /^[a-z0-9_-]{3,40}$/.test(u);

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    const url = new URL(req.url);

    try {
      // --- Public: salt lookup so a new device can derive keys ---
      if (req.method === "GET" && url.pathname === "/salt") {
        const username = (url.searchParams.get("username") || "").toLowerCase();
        if (!validUsername(username)) return json({ error: "bad username" }, 400, origin);
        const row = await env.DB.prepare("SELECT salt FROM users WHERE username=?").bind(username).first();
        return row ? json({ salt: row.salt }, 200, origin) : json({ error: "not found" }, 404, origin);
      }

      // --- Public: signup ---
      if (req.method === "POST" && url.pathname === "/signup") {
        const { username, salt, authToken } = await req.json();
        const u = (username || "").toLowerCase();
        if (!validUsername(u) || typeof salt !== "string" || typeof authToken !== "string")
          return json({ error: "bad input" }, 400, origin);
        const exists = await env.DB.prepare("SELECT 1 FROM users WHERE username=?").bind(u).first();
        if (exists) return json({ error: "taken" }, 409, origin);
        await env.DB.prepare(
          "INSERT INTO users (username, salt, auth_hash, created_at) VALUES (?,?,?,?)"
        ).bind(u, salt, await sha256(authToken), Date.now()).run();
        return json({ ok: true }, 201, origin);
      }

      // --- Everything below needs auth (username + Bearer authToken) ---
      const auth = await authenticate(req, url, env);
      if (!auth.ok) return json({ error: "unauthenticated" }, 401, origin);
      const username = auth.username;

      // Pull encrypted events newer than `since`
      if (req.method === "GET" && url.pathname === "/events") {
        const subject = url.searchParams.get("subject") || "";
        const since = parseInt(url.searchParams.get("since") || "0", 10) || 0;
        if (!SUBJECTS.has(subject)) return json({ error: "bad subject" }, 400, origin);
        const { results } = await env.DB.prepare(
          "SELECT id, iv, blob FROM events WHERE username=? AND subject=? AND id>? ORDER BY id LIMIT 2000"
        ).bind(username, subject, since).all();
        return json({ events: results || [] }, 200, origin);
      }

      // Append encrypted events
      if (req.method === "POST" && url.pathname === "/events") {
        const { subject, events } = await req.json();
        if (!SUBJECTS.has(subject)) return json({ error: "bad subject" }, 400, origin);
        if (!Array.isArray(events) || !events.length || events.length > MAX_EVENTS_PER_REQ)
          return json({ error: "bad batch" }, 400, origin);
        for (const e of events) {
          if (typeof e.iv !== "string" || typeof e.blob !== "string" || e.blob.length > MAX_BLOB)
            return json({ error: "bad event" }, 400, origin);
        }
        const now = Date.now();
        await env.DB.batch(events.map((e) =>
          env.DB.prepare("INSERT INTO events (username, subject, iv, blob, created_at) VALUES (?,?,?,?,?)")
            .bind(username, subject, e.iv, e.blob, now)));
        const last = await env.DB.prepare(
          "SELECT MAX(id) AS id FROM events WHERE username=? AND subject=?"
        ).bind(username, subject).first();
        return json({ ok: true, lastId: last?.id || 0 }, 200, origin);
      }

      return json({ error: "not found" }, 404, origin);
    } catch (err) {
      return json({ error: "server error" }, 500, origin);
    }
  },
};

async function authenticate(req, url, env) {
  const username = (req.headers.get("X-Username") || url.searchParams.get("username") || "").toLowerCase();
  const bearer = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!validUsername(username) || !bearer) return { ok: false };
  const row = await env.DB.prepare("SELECT auth_hash FROM users WHERE username=?").bind(username).first();
  if (!row) return { ok: false };
  return (await sha256(bearer)) === row.auth_hash ? { ok: true, username } : { ok: false };
}
