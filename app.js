(() => {
  const PROGRESS_KEY = "podcast-progress";
  const THEME_KEY = "podcast-theme";
  const SPEED_KEY = "podcast-speed";
  const DEFAULT_VOICE_KEY = "podcast-default-voice";
  const DOWNLOADS_KEY = "podcast-downloads";          // localStorage index of downloaded episodes
  const DOWNLOAD_ALL_VOICES_KEY = "podcast-download-all-voices";
  const DOWNLOADS_CACHE = "podcast-downloads-v1";     // must match service-worker.js
  const SPEED_UNIT_KEY = "podcast-speed-unit";        // "mult" (×) | "sps" (syllables/sec)
  const LISTEN_LOG_KEY = "podcast-listen-log";        // { "YYYY-MM-DD": wall-clock secondsSpent }
  const VOICE_LOG_KEY = "podcast-voice-log";          // { voiceName: content-seconds actually played }

  // Speed is shown in syllables/second, not "×". BASE_SPS is the narration's
  // natural rate at 1× playback: this content runs ~140 wpm (modules)–177
  // (case studies) at ~1.5 syllables/word → ~3.75 syl/s. Tune BASE_WPM to taste.
  const BASE_WPM = 150;
  const SYLLABLES_PER_WORD = 1.5;
  const BASE_SPS = (BASE_WPM * SYLLABLES_PER_WORD) / 60;

  const SPEED_OPTIONS = [];
  for (let s = 0.25; s <= 16; s += 0.25) SPEED_OPTIONS.push(Math.round(s * 100) / 100);

  let manifest = null;
  let currentEpisode = null;
  let currentVoiceIndex = 0;
  let lastSavedAt = 0;
  let lastListenTick = 0;     // wall-clock ms of the previous timeupdate while playing
  let pendingListenSecs = 0;  // wall seconds, flushed to the daily log every few seconds
  let pendingContentSecs = 0; // content seconds played (wall × rate), flushed to the voice log
  let isSeeking = false;
  let showRemaining = false;
  let sleepIdx = 0;
  let sleepTimeout = null;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let queue = [];
  let advanceTimer = null;

  // --- DOM refs ---
  // Pitch-preserving speed engine (see speed-engine.js): a Web Audio time-stretch
  // player that stays audible all the way to 16x. Falls back to the raw <audio>
  // element (silent above 4x) if the browser lacks AudioWorklet.
  const audioEl = document.getElementById("audio");
  const audio = window.createSpeedAudio ? window.createSpeedAudio(audioEl) : audioEl;
  const viewLibrary = document.getElementById("view-library");
  const viewEpisode = document.getElementById("view-episode");
  const views = { library: viewLibrary, episode: viewEpisode };
  const btnBack = document.getElementById("btn-back");
  const btnTheme = document.getElementById("btn-theme");
  const btnSleep = document.getElementById("btn-sleep");
  const btnStats = document.getElementById("btn-stats");
  const btnQueue = document.getElementById("btn-queue");
  const queueOverlay = document.getElementById("queue-overlay");
  const queueListEl = document.getElementById("queue-list");
  const btnQueueClear = document.getElementById("btn-queue-clear");
  const qNowTitleEl = document.getElementById("q-now-title");
  const btnSettings = document.getElementById("btn-settings");
  const settingsOverlay = document.getElementById("settings-overlay");
  const btnSettingsClose = document.getElementById("btn-settings-close");
  const defaultVoiceSelect = document.getElementById("default-voice-select");
  const dlAllVoicesToggle = document.getElementById("dl-all-voices");
  const storageUsageEl = document.getElementById("storage-usage");
  const btnClearDownloads = document.getElementById("btn-clear-downloads");
  const btnInstall = document.getElementById("btn-install");
  const installHint = document.getElementById("install-hint");
  const queueBadge = document.getElementById("queue-badge");
  const playerTimeEl = document.querySelector(".player-time");
  const playerBar = document.getElementById("player-bar");
  const btnPlay = document.getElementById("btn-play");
  const btnRewind = document.getElementById("btn-rewind");
  const btnForward = document.getElementById("btn-forward");
  const progressBarEl = document.getElementById("progress-bar");
  const timeCurrent = document.getElementById("time-current");
  const timeTotal = document.getElementById("time-total");
  const themeColorMeta = document.getElementById("theme-color-meta");
  const voiceSelect = document.getElementById("voice-select");
  const speedSlider = document.getElementById("speed-slider");
  const speedInput = document.getElementById("speed-input");
  const btnSpeedDown = document.getElementById("btn-speed-down");
  const btnSpeedUp = document.getElementById("btn-speed-up");
  const speedUnitEl = document.getElementById("speed-unit");
  const speedUnitSelect = document.getElementById("speed-unit-select");
  const episodeTitleEl = document.getElementById("episode-title");
  const episodeContentEl = document.getElementById("episode-content");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const advanceToast = document.getElementById("advance-toast");
  const advanceTitleEl = document.getElementById("advance-title");
  const advanceCountdownEl = document.getElementById("advance-countdown");
  const btnAdvanceCancel = document.getElementById("btn-advance-cancel");
  const statsOverlay = document.getElementById("stats-overlay");
  const statsContent = document.getElementById("stats-content");
  const btnStatsClose = document.getElementById("btn-stats-close");
  const quizArea = document.getElementById("quiz-area");

  function setHidden(el, hidden) {
    if (hidden) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }

  // Dismiss a bottom-sheet overlay by swiping its panel down (when scrolled to top).
  function enableSheetDismiss(overlay) {
    const panel = overlay.querySelector(".stats-panel");
    if (!panel) return;
    let startY = 0, dy = 0, dragging = false;
    panel.addEventListener("touchstart", (e) => {
      if (panel.scrollTop > 0) { dragging = false; return; } // let content scroll first
      startY = e.touches[0].clientY; dy = 0; dragging = true;
    }, { passive: true });
    panel.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      dy = e.touches[0].clientY - startY;
      if (dy > 0) { panel.style.transition = "none"; panel.style.transform = `translateY(${dy}px)`; }
    }, { passive: true });
    panel.addEventListener("touchend", () => {
      if (!dragging) return;
      dragging = false;
      panel.style.transition = "";
      panel.style.transform = "";
      if (dy > 90) setHidden(overlay, true);
    }, { passive: true });
  }

  // --- Speed control ---
  const DEFAULT_SPEED_IDX = 3; // 1.0x

  function getCurrentSpeedIdx() { return parseInt(speedSlider.value, 10); }
  function getCurrentSpeed() { return SPEED_OPTIONS[getCurrentSpeedIdx()]; }

  // Display helpers — the speed is editable either as a playback multiplier ("×")
  // or as syllables/second, chosen in Settings (default: ×).
  function speedUnitMode() { return localStorage.getItem(SPEED_UNIT_KEY) === "sps" ? "sps" : "mult"; }
  function speedUnitLabel() { return speedUnitMode() === "sps" ? "syl/s" : "×"; }
  function speedNum(mult) {
    if (speedUnitMode() === "sps") {
      const v = BASE_SPS * mult;
      return v >= 10 ? Math.round(v).toString() : v.toFixed(1);
    }
    return (Math.round(mult * 100) / 100).toString(); // multiplier, e.g. 1.5
  }
  function fmtSpeed(mult) { return speedNum(mult) + (speedUnitMode() === "sps" ? " syl/s" : "×"); }

  function setSpeed(index) {
    const i = Math.max(0, Math.min(SPEED_OPTIONS.length - 1, index));
    speedSlider.value = i;
    const s = SPEED_OPTIONS[i];
    speedInput.value = speedNum(s);
    if (speedUnitEl) speedUnitEl.textContent = speedUnitLabel();
    audio.playbackRate = s;
    localStorage.setItem(SPEED_KEY, i);
    if (audio.duration) {
      timeTotal.textContent = fmtTime(audio.duration / s);
      updateTimeDisplay();
    }
  }

  function applySpeedInput() {
    const val = parseFloat(speedInput.value.replace(/[^0-9.]/g, ""));
    if (isNaN(val)) { speedInput.value = speedNum(getCurrentSpeed()); return; }
    // In × mode the typed value IS the multiplier; in syl/s mode convert it.
    const raw = speedUnitMode() === "sps" ? val / BASE_SPS : val;
    const mult = Math.max(0.25, Math.min(16, raw));
    const idx = SPEED_OPTIONS.reduce((best, s, i) =>
      Math.abs(s - mult) < Math.abs(SPEED_OPTIONS[best] - mult) ? i : best, 0);
    setSpeed(idx);
  }

  function initSpeed() {
    const stored = parseInt(localStorage.getItem(SPEED_KEY), 10);
    setSpeed(isNaN(stored) ? DEFAULT_SPEED_IDX : stored);
  }

  speedSlider.addEventListener("input", () => setSpeed(getCurrentSpeedIdx()));
  btnSpeedDown.addEventListener("click", () => setSpeed(getCurrentSpeedIdx() - 1));
  btnSpeedUp.addEventListener("click", () => setSpeed(getCurrentSpeedIdx() + 1));
  speedInput.addEventListener("focus", () => speedInput.select());
  speedInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { applySpeedInput(); speedInput.blur(); }
    if (e.key === "Escape") { speedInput.value = speedNum(getCurrentSpeed()); speedInput.blur(); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSpeed(getCurrentSpeedIdx() + 1); }
    if (e.key === "ArrowDown") { e.preventDefault(); setSpeed(getCurrentSpeedIdx() - 1); }
  });
  speedInput.addEventListener("blur", applySpeedInput);
  initSpeed();

  // --- Theme ---
  const HLJS_THEMES = {
    dark:  "vendor/github-dark-dimmed.min.css",
    light: "vendor/github.min.css",
  };

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    setHidden(btnTheme.querySelector(".icon-sun"), theme === "light");
    setHidden(btnTheme.querySelector(".icon-moon"), theme !== "light");
    themeColorMeta.content = theme === "light" ? "#ffffff" : "#121212";
    document.getElementById("hljs-theme").href = HLJS_THEMES[theme] || HLJS_THEMES.dark;
    episodeContentEl.querySelectorAll("pre code").forEach((el) => {
      el.removeAttribute("data-highlighted");
      if (window.hljs) hljs.highlightElement(el);
    });
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    const theme = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    applyTheme(theme);
  }

  btnTheme.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
  initTheme();

  // --- Progress storage ---
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
    catch { return {}; }
  }
  function getEpisodeProgress(id) {
    return loadProgress()[id] || { progressPct: 0, lastVoice: null, completed: false };
  }
  function saveEpisodeProgress(id, patch) {
    const all = loadProgress();
    all[id] = { ...all[id], ...patch };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    window.Sync && window.Sync.scheduleSync();
  }

  // --- Utils ---
  function fmtTime(secs) {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function fmtDuration(secs) {
    if (!secs || isNaN(secs) || secs <= 0) return "";
    if (secs < 60) return "<1m";
    const h = Math.floor(secs / 3600);
    const m = Math.round((secs % 3600) / 60);
    return h ? h + "h " + m + "m" : m + "m";
  }

  function cleanVoiceName(name) {
    const parts = name.split("_").slice(1);
    return parts.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || name;
  }

  // Shared play-triangle icon (same path as the player-bar button) so every
  // circular play button renders an identical, centered SVG instead of glyph
  // or CSS-border hacks.
  const playIcon = (s = 16) =>
    `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  const downloadIcon = (s = 15) =>
    `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor"><path d="M12 16l-5-5 1.4-1.4L11 12.2V4h2v8.2l2.6-2.6L17 11z"/><path d="M5 18h14v2H5z"/></svg>`;
  const checkIcon = (s = 15) =>
    `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>`;
  const pauseIcon = (s = 16) =>
    `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>`;
  // Three horizontal lines = "drag to reorder" (a ⋮ reads as a click-menu instead).
  const handleIcon = (s = 20) =>
    `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor"><rect x="4" y="7" width="16" height="2" rx="1"/><rect x="4" y="11" width="16" height="2" rx="1"/><rect x="4" y="15" width="16" height="2" rx="1"/></svg>`;
  const eqIcon = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="3" y="10" width="3" height="4" rx="1.5"/><rect x="8" y="7" width="3" height="10" rx="1.5"/><rect x="13" y="4" width="3" height="16" rx="1.5"/><rect x="18" y="9" width="3" height="6" rx="1.5"/></svg>`;

  function updateProgressFill(pct) {
    progressBarEl.style.setProperty("--pct", pct * 100 + "%");
  }

  // --- Sleep timer ---
  const SLEEP_MINUTES = [null, 15, 30, 45, 60];

  function updateSleepBtn() {
    const mins = SLEEP_MINUTES[sleepIdx];
    if (mins) {
      btnSleep.textContent = mins + "m";
      btnSleep.classList.add("sleep-active");
    } else {
      btnSleep.innerHTML = `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M21 10.78V8c0-1.65-1.35-3-3-3h-4c-.77 0-1.47.3-2 .78-.53-.48-1.23-.78-2-.78H6C4.35 5 3 6.35 3 8v2.78c-.61.55-1 1.34-1 2.22v6h2v-2h16v2h2v-6c0-.88-.39-1.67-1-2.22z"/></svg>`;
      btnSleep.classList.remove("sleep-active");
    }
  }

  btnSleep.addEventListener("click", () => {
    clearTimeout(sleepTimeout);
    sleepIdx = (sleepIdx + 1) % SLEEP_MINUTES.length;
    const mins = SLEEP_MINUTES[sleepIdx];
    if (mins) {
      sleepTimeout = setTimeout(() => {
        audio.pause();
        sleepIdx = 0;
        updateSleepBtn();
      }, mins * 60 * 1000);
    }
    updateSleepBtn();
  });

  // --- Time display (speed-adjusted) ---
  function updateTimeDisplay() {
    if (!audio.duration) return;
    const rate = audio.playbackRate || 1;
    if (showRemaining) {
      timeCurrent.textContent = "-" + fmtTime((audio.duration - audio.currentTime) / rate);
    } else {
      timeCurrent.textContent = fmtTime(audio.currentTime / rate);
    }
    timeTotal.textContent = fmtTime(audio.duration / rate);
  }

  playerTimeEl.addEventListener("click", () => {
    showRemaining = !showRemaining;
    updateTimeDisplay();
  });

  // --- Keyboard shortcuts ---
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (!currentEpisode) return;
    if (e.key === " ") { e.preventDefault(); audio.paused ? audio.play() : audio.pause(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); audio.currentTime = Math.max(0, audio.currentTime - 30); }
    if (e.key === "ArrowRight") { e.preventDefault(); audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 30); }
  });

  // --- Swipe right to go back ---
  viewEpisode.addEventListener("touchstart", (e) => {
    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
  }, { passive: true });
  viewEpisode.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - swipeStartX;
    const dy = Math.abs(e.changedTouches[0].clientY - swipeStartY);
    if (dx > 60 && dy < 60 && swipeStartX < 60) navigateToLibrary();
  }, { passive: true });

  // --- Queue ---
  function updateQueueBadge() {
    if (queue.length > 0) {
      queueBadge.textContent = queue.length;
      setHidden(btnQueue, false);
    } else {
      setHidden(btnQueue, true);
    }
  }

  // Sync the library's +/✓ queue buttons to the current queue, in place (no
  // re-render, so an open module stays open).
  function syncQueueButtons() {
    viewLibrary.querySelectorAll(".episode-row").forEach((row) => {
      const b = row.querySelector(".ep-queue-btn");
      if (!b) return;
      const inQ = queue.includes(row.dataset.epId);
      b.classList.toggle("in-queue", inQ);
      b.textContent = inQ ? "✓" : "+";
      b.setAttribute("aria-label", inQ ? "Remove from queue" : "Add to queue");
    });
  }

  // The queue button opens the "Up Next" panel (it no longer wipes the queue).
  btnQueue.addEventListener("click", () => { renderQueuePanel(); setHidden(queueOverlay, false); });
  queueOverlay.addEventListener("click", (e) => { if (e.target === queueOverlay) setHidden(queueOverlay, true); });
  enableSheetDismiss(queueOverlay);
  if (btnQueueClear) btnQueueClear.addEventListener("click", () => {
    queue = [];
    updateQueueBadge();
    syncQueueButtons();
    renderQueuePanel();
  });

  // A deterministic, on-brand colored art tile (no real per-episode artwork).
  function episodeModuleName(id) {
    if (!manifest) return "";
    for (const mod of manifest.modules) {
      if (mod.episodes.some((e) => e.id === id)) return GROUP_NAMES[mod.prefix] || mod.prefix;
    }
    return "";
  }
  function refreshNowRow() {
    const btn = queueListEl && queueListEl.querySelector(".q-now-row .q-pp");
    if (btn) btn.innerHTML = audio.paused ? playIcon(16) : pauseIcon(16);
  }

  function queueRowHTML(id, kind, num) {
    const ep = kind === "now" ? currentEpisode : findEpisode(id);
    const title = ep ? ep.title : id;
    const sub = ep ? episodeModuleName(ep.id) : "";
    const lead = kind === "now"
      ? `<span class="q-num q-num-now">${eqIcon}</span>`
      : `<span class="q-num">${num}</span>`;
    const ctrl = kind === "now"
      ? `<button class="q-pp" aria-label="Play or pause">${audio.paused ? playIcon(16) : pauseIcon(16)}</button>`
      : `<button class="q-del" aria-label="Remove from queue" title="Remove">&#10005;</button>
         <span class="q-handle" aria-label="Drag to reorder" title="Drag to reorder">${handleIcon(20)}</span>`;
    return `<div class="${kind === "now" ? "q-now-row" : "q-row"}" data-ep-id="${ep ? ep.id : id}">
      <div class="q-remove-bg"><span>Remove</span></div>
      <div class="q-fg">
        ${lead}
        <span class="q-text"><span class="q-title">${title}</span><span class="q-sub">${sub}</span></span>
        ${ctrl}
      </div>
    </div>`;
  }

  function renderQueuePanel() {
    if (!queueListEl) return;
    if (qNowTitleEl) qNowTitleEl.textContent = currentEpisode ? currentEpisode.title : "nothing";

    let html = currentEpisode ? queueRowHTML(currentEpisode.id, "now") : "";
    html += queue.map((id, i) => queueRowHTML(id, "queued", i + 1)).join("");
    if (!queue.length) {
      html += `<p class="setting-hint">Nothing queued. Add episodes with the + button, or Start a module.</p>`;
    }
    queueListEl.innerHTML = html;
    if (btnQueueClear) setHidden(btnQueueClear, !queue.length);

    const nowRow = queueListEl.querySelector(".q-now-row");
    if (nowRow) nowRow.querySelector(".q-pp").addEventListener("click", (e) => {
      e.stopPropagation();
      audio.paused ? audio.play() : audio.pause();
    });
    attachQueueGestures();
  }

  // Tap a row to play, swipe left to remove, drag the ≡ handle to reorder.
  function attachQueueGestures() {
    queueListEl.querySelectorAll(".q-row").forEach((row) => {
      const fg = row.querySelector(".q-fg");
      const handle = row.querySelector(".q-handle");
      const del = row.querySelector(".q-del");
      const id = row.dataset.epId;
      let sx = 0, sy = 0, dx = 0, swiping = false, active = false;

      // explicit remove button (works with a mouse on desktop)
      if (del) del.addEventListener("click", (e) => { e.stopPropagation(); removeFromQueue(id); });

      // tap-to-play + swipe-left-to-remove (anywhere on the row except the handle / ✕)
      fg.addEventListener("pointerdown", (e) => {
        if (handle.contains(e.target) || (del && del.contains(e.target))) return;
        active = true; swiping = false; dx = 0; sx = e.clientX; sy = e.clientY;
        try { fg.setPointerCapture(e.pointerId); } catch (_) {}
      });
      fg.addEventListener("pointermove", (e) => {
        if (!active) return;
        const mx = e.clientX - sx, my = e.clientY - sy;
        if (!swiping && Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my)) swiping = true;
        if (swiping) {
          dx = Math.min(0, mx);
          fg.style.transition = "none";
          fg.style.transform = `translateX(${dx}px)`;
          row.classList.toggle("q-will-remove", dx < -80);
        }
      });
      fg.addEventListener("pointerup", (e) => {
        if (!active) return;
        active = false;
        fg.style.transition = "";
        if (swiping) {
          if (dx < -80) { row.classList.add("q-removing"); setTimeout(() => removeFromQueue(id), 160); return; }
          fg.style.transform = "";
          row.classList.remove("q-will-remove");
        } else if (Math.abs((e.clientX || sx) - sx) < 8) {
          playFromQueue(id);
        }
      });
      fg.addEventListener("pointercancel", () => {
        active = false; fg.style.transition = ""; fg.style.transform = "";
        row.classList.remove("q-will-remove");
      });

      // drag handle → smooth float-and-drop reorder
      let startY = 0, rowH = 0, fromIndex = 0, dragging = false;
      handle.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        try { handle.setPointerCapture(e.pointerId); } catch (_) {}
        dragging = true;
        startY = e.clientY;
        rowH = row.offsetHeight || 64;
        fromIndex = queue.indexOf(id);
        row.classList.add("q-dragging");
      });
      handle.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const dy = e.clientY - startY;
        row.style.transition = "none";
        row.style.transform = `translateY(${dy}px)`;
      });
      const endDrag = (e) => {
        if (!dragging) return;
        dragging = false;
        const dy = (e.clientY || startY) - startY;
        row.classList.remove("q-dragging");
        row.style.transition = ""; row.style.transform = "";
        let to = fromIndex + Math.round(dy / rowH);
        to = Math.max(0, Math.min(queue.length - 1, to));
        if (to !== fromIndex && fromIndex >= 0) {
          queue.splice(fromIndex, 1);
          queue.splice(to, 0, id);
          syncQueueButtons();
        }
        renderQueuePanel();
      };
      handle.addEventListener("pointerup", endDrag);
      handle.addEventListener("pointercancel", endDrag);
    });
  }
  function removeFromQueue(id) {
    const i = queue.indexOf(id);
    if (i >= 0) queue.splice(i, 1);
    updateQueueBadge();
    syncQueueButtons();
    renderQueuePanel();
  }
  function playFromQueue(id) {
    const ep = findEpisode(id);
    if (!ep || !guardPlayable(ep)) return;
    const i = queue.indexOf(id);
    if (i >= 0) queue.splice(i, 1);
    updateQueueBadge();
    syncQueueButtons();
    setHidden(queueOverlay, true);
    loadEpisode(ep, { autoplay: true });
    navigateToEpisode(ep.id);
  }

  // --- Auto-advance ---
  function dismissAdvanceToast() {
    clearInterval(advanceTimer);
    advanceTimer = null;
    setHidden(advanceToast, true);
  }

  function showAdvanceToast(nextEp) {
    advanceTitleEl.textContent = nextEp.title;
    let countdown = 3;
    advanceCountdownEl.textContent = countdown;
    setHidden(advanceToast, false);
    advanceTimer = setInterval(() => {
      countdown--;
      advanceCountdownEl.textContent = countdown;
      if (countdown <= 0) {
        dismissAdvanceToast();
        loadEpisode(nextEp, { autoplay: true });
        navigateToEpisode(nextEp.id);
      }
    }, 1000);
  }

  btnAdvanceCancel.addEventListener("click", dismissAdvanceToast);

  function getNextEpisode(ep) {
    const flat = [];
    const groups = new Map();
    manifest.modules.forEach((mod) => {
      if (!groups.has(mod.prefix)) groups.set(mod.prefix, []);
      mod.episodes.forEach((e) => groups.get(mod.prefix).push({ ...e, _moduleNum: mod.moduleNum }));
    });
    groups.forEach((episodes) => {
      episodes.sort((a, b) => (a._moduleNum - b._moduleNum) || ((a.unit || 0) - (b.unit || 0)));
      episodes.forEach((e) => flat.push(e));
    });
    const idx = flat.findIndex((e) => e.id === ep.id);
    return idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
  }

  // --- Audio events ---
  audio.addEventListener("play", () => { setPlayState(true); lastListenTick = Date.now(); });
  audio.addEventListener("pause", () => { setPlayState(false); flushListenLog(); lastListenTick = 0; persistProgress(); });
  audio.addEventListener("ended", () => {
    if (currentEpisode) saveEpisodeProgress(currentEpisode.id, { progressPct: 1, completed: true });
    setPlayState(false);
    if (queue.length > 0) {
      const nextId = queue.shift();
      updateQueueBadge();
      if (!viewLibrary.hidden) renderLibrary();
      const nextEp = findEpisode(nextId);
      if (nextEp) { loadEpisode(nextEp, { autoplay: true }); navigateToEpisode(nextEp.id); }
      return;
    }
    const nextEp = getNextEpisode(currentEpisode);
    if (nextEp) showAdvanceToast(nextEp);
  });
  audio.addEventListener("loadedmetadata", () => {
    timeTotal.textContent = fmtTime(audio.duration / (getCurrentSpeed() || 1));
  });
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration || isSeeking) return;
    const pct = audio.currentTime / audio.duration;
    progressBarEl.value = pct;
    updateProgressFill(pct);
    updateTimeDisplay();
    const now = Date.now();
    // Accumulate real time spent listening into today's bucket (ignore the big
    // jump after a pause/seek via the <2s cap).
    if (!audio.paused && lastListenTick) {
      const dt = (now - lastListenTick) / 1000;
      if (dt > 0 && dt < 2) {
        pendingListenSecs += dt;
        pendingContentSecs += dt * (audio.playbackRate || 1); // content actually played
      }
    }
    lastListenTick = now;
    if (now - lastSavedAt > 5000) { lastSavedAt = now; flushListenLog(); persistProgress(); }
  });

  function setPlayState(playing) {
    setHidden(btnPlay.querySelector(".icon-play"), playing);
    setHidden(btnPlay.querySelector(".icon-pause"), !playing);
    if (queueOverlay && !queueOverlay.hidden) refreshNowRow();
  }

  // --- Controls ---
  btnPlay.addEventListener("click", () => {
    if (!currentEpisode) return;
    audio.paused ? audio.play() : audio.pause();
  });
  btnRewind.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 30);
  });
  btnForward.addEventListener("click", () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 30);
  });

  progressBarEl.addEventListener("mousedown", () => { isSeeking = true; });
  progressBarEl.addEventListener("touchstart", () => { isSeeking = true; }, { passive: true });
  progressBarEl.addEventListener("input", () => {
    const pct = parseFloat(progressBarEl.value);
    updateProgressFill(pct);
    if (audio.duration) { audio.currentTime = pct * audio.duration; updateTimeDisplay(); }
  });
  progressBarEl.addEventListener("change", () => {
    if (audio.duration) audio.currentTime = parseFloat(progressBarEl.value) * audio.duration;
    isSeeking = false;
  });
  progressBarEl.addEventListener("mouseup", () => { isSeeking = false; });
  progressBarEl.addEventListener("touchend", () => { isSeeking = false; });

  voiceSelect.addEventListener("change", () => {
    switchVoice(parseInt(voiceSelect.value, 10));
  });

  // --- Episode loading ---
  function findEpisode(id) {
    for (const mod of manifest.modules) {
      const ep = mod.episodes.find((e) => e.id === id);
      if (ep) return ep;
    }
    return null;
  }

  function loadEpisode(ep, { autoplay }) {
    currentEpisode = ep;
    const progress = getEpisodeProgress(ep.id);
    currentVoiceIndex = ep.voices.findIndex((v) => v.name === progress.lastVoice);
    if (currentVoiceIndex < 0) {
      const def = localStorage.getItem(DEFAULT_VOICE_KEY);
      currentVoiceIndex = def ? ep.voices.findIndex((v) => v.name === def) : -1;
      if (currentVoiceIndex < 0) currentVoiceIndex = 0;
    }

    playerBar.hidden = false;
    setHidden(btnSleep, false);
    updateSleepBtn();

    voiceSelect.innerHTML = "";
    ep.voices.forEach((v, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = cleanVoiceName(v.name);
      if (i === currentVoiceIndex) opt.selected = true;
      voiceSelect.appendChild(opt);
    });

    setAudioSource(ep.voices[currentVoiceIndex], progress.progressPct || 0, autoplay);
  }

  function setAudioSource(voice, resumePct, autoplay) {
    audio.src = voice.file;
    audio.load();
    audio.addEventListener("loadedmetadata", () => {
      if (resumePct && audio.duration) audio.currentTime = resumePct * audio.duration;
      audio.playbackRate = getCurrentSpeed();
      timeTotal.textContent = fmtTime(audio.duration / getCurrentSpeed());
      if (autoplay) audio.play();
    }, { once: true });
  }

  function switchVoice(index) {
    if (!currentEpisode || index === currentVoiceIndex) return;
    flushListenLog(); // attribute time played so far to the current voice first
    const pct = audio.duration ? audio.currentTime / audio.duration : 0;
    const wasPlaying = !audio.paused;
    currentVoiceIndex = index;
    voiceSelect.value = index;
    const voice = currentEpisode.voices[index];
    audio.src = voice.file;
    audio.load();
    audio.addEventListener("loadedmetadata", () => {
      if (audio.duration) audio.currentTime = pct * audio.duration;
      audio.playbackRate = getCurrentSpeed();
      timeTotal.textContent = fmtTime(audio.duration / getCurrentSpeed());
      if (wasPlaying) audio.play();
    }, { once: true });
    saveEpisodeProgress(currentEpisode.id, { lastVoice: voice.name });
    // Remember this voice globally so the next/fresh episode starts in it and
    // the Settings "Default voice" stays in sync.
    localStorage.setItem(DEFAULT_VOICE_KEY, voice.name);
    defaultVoiceSelect.value = voice.name;
  }

  function persistProgress() {
    if (!currentEpisode || !audio.duration) return;
    const pct = audio.currentTime / audio.duration;
    // Note: completion is NOT set from position — scrubbing to the end shouldn't
    // mark an episode done. Only the "ended" event (actually reaching the end)
    // marks it completed.
    saveEpisodeProgress(currentEpisode.id, {
      progressPct: pct,
      lastVoice: currentEpisode.voices[currentVoiceIndex].name,
      lastPlayed: new Date().toISOString(),
    });
  }

  // --- Daily listening log (wall-clock time spent, for the stats graph) ---
  function loadListenLog() {
    try { return JSON.parse(localStorage.getItem(LISTEN_LOG_KEY)) || {}; } catch { return {}; }
  }
  function loadVoiceLog() {
    try { return JSON.parse(localStorage.getItem(VOICE_LOG_KEY)) || {}; } catch { return {}; }
  }
  function flushListenLog() {
    if (pendingListenSecs <= 0 && pendingContentSecs <= 0) return;
    if (pendingListenSecs > 0) {
      const log = loadListenLog();
      const day = new Date().toISOString().substring(0, 10);
      log[day] = Math.round((log[day] || 0) + pendingListenSecs);
      localStorage.setItem(LISTEN_LOG_KEY, JSON.stringify(log));
    }
    // Attribute content actually played to the current voice (TTS model).
    if (pendingContentSecs > 0 && currentEpisode) {
      const name = currentEpisode.voices[currentVoiceIndex]?.name;
      if (name) {
        const vlog = loadVoiceLog();
        vlog[name] = Math.round((vlog[name] || 0) + pendingContentSecs);
        localStorage.setItem(VOICE_LOG_KEY, JSON.stringify(vlog));
      }
    }
    pendingListenSecs = 0;
    pendingContentSecs = 0;
    window.Sync && window.Sync.scheduleSync();
  }

  // --- Subject config (per-repo; restore these when mirroring to another subject) ---
  const REPO_URL = "https://github.com/freddygaffey/hsc-sdd-podcast";

  // --- Stats ---
  const GROUP_NAMES = {
    PFW: "Programming for the Web",
    SSA: "Software Security Applications",
    SA:  "Software Automation",
    SEE: "Software Engineering Project",
    CASE: "Case Studies",
  };

  function computeStats() {
    const progress = loadProgress();
    let totalListenedSecs = 0;
    let completedCount = 0;
    const days = new Set();
    const allEps = [];
    manifest.modules.forEach((mod) => mod.episodes.forEach((ep) => allEps.push(ep)));

    for (const ep of allEps) {
      const p = progress[ep.id];
      if (!p) continue;
      if (p.completed) completedCount++;
      if (p.lastPlayed) days.add(p.lastPlayed.substring(0, 10));
    }

    const sortedDays = [...days].sort().reverse();
    let streak = 0;
    if (sortedDays.length > 0) {
      const today = new Date().toISOString().substring(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().substring(0, 10);
      if (sortedDays[0] === today || sortedDays[0] === yesterday) {
        streak = 1;
        for (let i = 1; i < sortedDays.length; i++) {
          const diff = (new Date(sortedDays[i - 1]) - new Date(sortedDays[i])) / 86400000;
          if (diff <= 1) streak++;
          else break;
        }
      }
    }

    const groups = new Map();
    manifest.modules.forEach((mod) => {
      if (!groups.has(mod.prefix)) groups.set(mod.prefix, { total: 0, done: 0 });
      mod.episodes.forEach((ep) => {
        groups.get(mod.prefix).total++;
        if (progress[ep.id]?.completed) groups.get(mod.prefix).done++;
      });
    });

    // Per-voice breakdown + total content heard, from actual playback (immune to
    // scrubbing — only counts seconds the audio really played).
    const voiceSecs = loadVoiceLog();
    totalListenedSecs = Object.values(voiceSecs).reduce((a, b) => a + (b || 0), 0);

    // Daily time-spent log → totals for the graph + cards.
    const log = loadListenLog();
    const weekAgo = new Date(Date.now() - 6 * 86400000).toISOString().substring(0, 10);
    let timeSpentTotal = 0, thisWeekSecs = 0, bestDaySecs = 0;
    for (const [day, s] of Object.entries(log)) {
      timeSpentTotal += s;
      if (s > bestDaySecs) bestDaySecs = s;
      if (day >= weekAgo) thisWeekSecs += s;
    }

    return {
      totalListenedSecs, completedCount, totalCount: allEps.length, streak, groups,
      voiceSecs, log, timeSpentTotal, thisWeekSecs, bestDaySecs,
    };
  }

  function renderStats() {
    const stats = computeStats();
    const speed = getCurrentSpeed();

    function fmtStat(secs) {
      if (!secs || secs < 60) return "<1m";
      const h = Math.floor(secs / 3600);
      const m = Math.round((secs % 3600) / 60);
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    }

    const listenedStr = fmtStat(stats.totalListenedSecs);
    // Actual time saved by listening faster = content heard − wall time spent.
    const savedStr = fmtStat(Math.max(0, stats.totalListenedSecs - stats.timeSpentTotal));

    // Listening-over-time: last 30 days, time spent per day.
    const N = 30;
    const todayStr = new Date().toISOString().substring(0, 10);
    const days = [];
    let maxDay = 1;
    for (let i = N - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().substring(0, 10);
      const s = stats.log[d] || 0;
      days.push({ d, s });
      if (s > maxDay) maxDay = s;
    }
    const chartHTML = days.map(({ d, s }) => {
      const h = s > 0 ? Math.max(Math.round((s / maxDay) * 100), 6) : 0;
      const cls = "day-bar" + (d === todayStr ? " day-bar-today" : "") + (s > 0 ? "" : " day-bar-empty");
      return `<div class="day-col" title="${d} · ${Math.round(s / 60)} min"><div class="${cls}" style="height:${h}%"></div></div>`;
    }).join("");

    // By voice (TTS model) breakdown.
    const voiceEntries = Object.entries(stats.voiceSecs).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]);
    const maxVoice = voiceEntries.length ? voiceEntries[0][1] : 1;
    const voiceHTML = voiceEntries.length
      ? voiceEntries.map(([name, secs]) => `
        <div class="voice-row">
          <span class="voice-name">${cleanVoiceName(name)}</span>
          <div class="voice-track"><div class="voice-fill" style="width:${Math.max(Math.round((secs / maxVoice) * 100), 3)}%"></div></div>
          <span class="voice-time">${fmtStat(secs)}</span>
        </div>`).join("")
      : `<p class="setting-hint">Play an episode to see your voice breakdown.</p>`;

    let groupsHTML = "";
    stats.groups.forEach((g, prefix) => {
      const pct = g.total ? Math.round((g.done / g.total) * 100) : 0;
      groupsHTML += `
        <div class="stats-module">
          <div class="stats-module-header">
            <span>${GROUP_NAMES[prefix] || prefix}</span>
            <span class="stats-module-count">${g.done}/${g.total}</span>
          </div>
          <div class="stats-module-track"><div class="stats-module-fill" style="width:${pct}%"></div></div>
        </div>`;
    });

    statsContent.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">${fmtStat(stats.timeSpentTotal)}</div><div class="stat-label">Time spent</div></div>
        <div class="stat-card"><div class="stat-value">${stats.streak}🔥</div><div class="stat-label">Day streak</div></div>
        <div class="stat-card"><div class="stat-value">${fmtStat(stats.thisWeekSecs)}</div><div class="stat-label">This week</div></div>
        <div class="stat-card"><div class="stat-value">${stats.completedCount}/${stats.totalCount}</div><div class="stat-label">Episodes done</div></div>
        <div class="stat-card"><div class="stat-value">${listenedStr}</div><div class="stat-label">Content heard</div></div>
        <div class="stat-card"><div class="stat-value">${savedStr}</div><div class="stat-label">Time saved</div></div>
      </div>
      <h3 class="stats-section-title">Last 30 days</h3>
      <div class="day-chart">${chartHTML}</div>
      <h3 class="stats-section-title">By voice</h3>
      ${voiceHTML}
      <h3 class="stats-section-title">By module</h3>
      ${groupsHTML}`;
  }

  btnStats.addEventListener("click", () => {
    if (!manifest) return;
    renderStats();
    setHidden(statsOverlay, false);
  });
  statsOverlay.addEventListener("click", (e) => {
    if (e.target === statsOverlay) setHidden(statsOverlay, true);
  });
  enableSheetDismiss(statsOverlay);

  // --- Downloads ---
  // The DOWNLOADS cache (see service-worker.js) holds the bytes; this localStorage
  // index is the fast source of truth for the UI: { [epId]: { voices:[names], at } }.
  function loadDownloads() {
    try { return JSON.parse(localStorage.getItem(DOWNLOADS_KEY)) || {}; } catch { return {}; }
  }
  function saveDownloads(all) { localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(all)); }
  function isDownloaded(id) { return !!loadDownloads()[id]; }

  // The default voice for an episode = global default if this episode has it, else
  // the first voice. (Distinct from loadEpisode's resume logic, which prefers the
  // per-episode last-played voice.)
  function defaultVoiceForEpisode(ep) {
    const def = localStorage.getItem(DEFAULT_VOICE_KEY);
    return (def && ep.voices.find((v) => v.name === def)) || ep.voices[0];
  }
  function chosenVoiceNames(ep) {
    if (localStorage.getItem(DOWNLOAD_ALL_VOICES_KEY) === "1") return ep.voices.map((v) => v.name);
    const v = defaultVoiceForEpisode(ep);
    return v ? [v.name] : [];
  }
  function episodeAssets(ep, voiceNames) {
    const urls = voiceNames
      .map((n) => ep.voices.find((v) => v.name === n))
      .filter(Boolean)
      .map((v) => v.file);
    [ep.scriptPath, ep.supplementaryPath, ep.quizPath].forEach((p) => { if (p) urls.push(p); });
    return urls;
  }

  let persistRequested = false;
  async function downloadEpisode(ep, onProgress) {
    if (!persistRequested && navigator.storage && navigator.storage.persist) {
      persistRequested = true;
      try { await navigator.storage.persist(); } catch {}
    }
    const voiceNames = chosenVoiceNames(ep);
    const urls = episodeAssets(ep, voiceNames);
    const cache = await caches.open(DOWNLOADS_CACHE);
    let done = 0;
    if (onProgress) onProgress(0, urls.length);
    for (const url of urls) {
      if (!(await cache.match(url))) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        await cache.put(url, res);
      }
      done++;
      if (onProgress) onProgress(done, urls.length);
    }
    const all = loadDownloads();
    all[ep.id] = { voices: voiceNames, at: new Date().toISOString() };
    saveDownloads(all);
  }

  async function deleteEpisode(ep) {
    const all = loadDownloads();
    const voiceNames = all[ep.id]?.voices || ep.voices.map((v) => v.name);
    const cache = await caches.open(DOWNLOADS_CACHE);
    for (const url of episodeAssets(ep, voiceNames)) await cache.delete(url);
    delete all[ep.id];
    saveDownloads(all);
  }

  async function downloadModule(group, { onEpisodeState, onProgress } = {}) {
    const eps = group.episodes;
    let done = 0;
    for (const ep of eps) {
      if (!isDownloaded(ep.id)) {
        if (onEpisodeState) onEpisodeState(ep.id, "busy");
        await downloadEpisode(ep);
      }
      if (onEpisodeState) onEpisodeState(ep.id, "done");
      done++;
      if (onProgress) onProgress(done, eps.length);
    }
  }

  async function clearAllDownloads() {
    await caches.delete(DOWNLOADS_CACHE);
    localStorage.removeItem(DOWNLOADS_KEY);
  }

  async function storageUsage() {
    if (navigator.storage && navigator.storage.estimate) {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate();
      return { usage, quota };
    }
    return { usage: 0, quota: 0 };
  }

  function fmtBytes(n) {
    if (!n) return "0 MB";
    const mb = n / (1024 * 1024);
    return mb >= 1024 ? (mb / 1024).toFixed(1) + " GB" : Math.round(mb) + " MB";
  }

  // Reflect a download button's state (idle / busy / done) in place.
  function setDlState(btn, state) {
    if (!btn) return;
    btn.classList.remove("dl-busy", "dl-done");
    if (state === "busy") {
      btn.classList.add("dl-busy");
      btn.innerHTML = `<span class="dl-spinner"></span>`;
      btn.setAttribute("aria-label", "Downloading…");
    } else if (state === "done") {
      btn.classList.add("dl-done");
      btn.innerHTML = checkIcon(15);
      btn.setAttribute("aria-label", "Delete download");
    } else {
      btn.innerHTML = downloadIcon(15);
      btn.setAttribute("aria-label", "Download");
    }
  }

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    setHidden(el, false);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setHidden(el, true), 3200);
  }

  // Offline, only downloaded episodes can play. Block + explain otherwise.
  function guardPlayable(ep) {
    if (navigator.onLine || isDownloaded(ep.id)) return true;
    showToast("Not downloaded — connect to the internet to play this.");
    return false;
  }

  // --- Settings ---
  function getVoiceCatalog() {
    const names = [];
    if (!manifest) return names;
    manifest.modules.forEach((mod) => mod.episodes.forEach((ep) =>
      (ep.voices || []).forEach((v) => { if (!names.includes(v.name)) names.push(v.name); })));
    return names;
  }

  function populateDefaultVoiceSelect() {
    const names = getVoiceCatalog();
    const current = localStorage.getItem(DEFAULT_VOICE_KEY) || names[0] || "";
    defaultVoiceSelect.innerHTML = "";
    names.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = cleanVoiceName(name);
      if (name === current) opt.selected = true;
      defaultVoiceSelect.appendChild(opt);
    });
  }

  function refreshStorageUsage() {
    if (!storageUsageEl) return;
    storageUsageEl.textContent = "…";
    storageUsage().then(({ usage }) => { storageUsageEl.textContent = fmtBytes(usage); });
  }

  btnSettings.addEventListener("click", () => {
    if (!manifest) return;
    populateDefaultVoiceSelect();
    if (dlAllVoicesToggle) dlAllVoicesToggle.checked = localStorage.getItem(DOWNLOAD_ALL_VOICES_KEY) === "1";
    if (speedUnitSelect) speedUnitSelect.value = speedUnitMode();
    refreshStorageUsage();
    updateInstallUI();
    if (window.Sync) window.Sync.renderPanel();
    setHidden(settingsOverlay, false);
  });
  if (speedUnitSelect) speedUnitSelect.addEventListener("change", () => {
    localStorage.setItem(SPEED_UNIT_KEY, speedUnitSelect.value === "sps" ? "sps" : "mult");
    setSpeed(getCurrentSpeedIdx()); // refresh the player display + unit label
  });
  settingsOverlay.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) setHidden(settingsOverlay, true);
  });
  enableSheetDismiss(settingsOverlay);
  defaultVoiceSelect.addEventListener("change", () => {
    const name = defaultVoiceSelect.value;
    localStorage.setItem(DEFAULT_VOICE_KEY, name);
    if (currentEpisode) {
      const idx = currentEpisode.voices.findIndex((v) => v.name === name);
      if (idx >= 0) switchVoice(idx);
    }
  });
  if (dlAllVoicesToggle) dlAllVoicesToggle.addEventListener("change", () => {
    localStorage.setItem(DOWNLOAD_ALL_VOICES_KEY, dlAllVoicesToggle.checked ? "1" : "");
  });
  if (btnClearDownloads) btnClearDownloads.addEventListener("click", async () => {
    if (!confirm("Delete all downloaded episodes? They'll need to be downloaded again for offline use.")) return;
    await clearAllDownloads();
    refreshStorageUsage();
    if (!viewLibrary.hidden) renderLibrary();
    showToast("Downloads cleared.");
  });

  // --- Library ---
  function getLastPlayedEpisode() {
    const progress = loadProgress();
    let latestEp = null, latestTime = 0;
    for (const [id, p] of Object.entries(progress)) {
      if (p.lastPlayed && !p.completed) {
        const t = new Date(p.lastPlayed).getTime();
        if (t > latestTime) { latestTime = t; latestEp = findEpisode(id); }
      }
    }
    return latestEp;
  }

  // Start a whole module: resume the first unlistened episode (at its saved
  // position) and replace the queue with every episode after it.
  function startModule(group) {
    const eps = group.episodes;
    let idx = eps.findIndex((e) => !getEpisodeProgress(e.id).completed);
    if (idx < 0) idx = 0; // all completed → start from the top
    if (!guardPlayable(eps[idx])) return;
    queue = eps.slice(idx + 1).map((e) => e.id);
    updateQueueBadge();
    loadEpisode(eps[idx], { autoplay: true });
    navigateToEpisode(eps[idx].id);
  }

  // Find a rendered episode row's download button within a module element.
  function rowDlBtn(groupEl, epId) {
    const row = groupEl.querySelector(`.episode-row[data-ep-id="${CSS.escape(epId)}"]`);
    return row && row.querySelector(".ep-dl-btn");
  }

  // Download or remove an entire module, keeping the module's row buttons and the
  // module button in sync as it goes (no full re-render → the module stays open).
  async function handleModuleDownload(group, groupEl, mdlBtn) {
    if (mdlBtn.classList.contains("dl-busy")) return;
    const syncRow = (id, state) => {
      const b = rowDlBtn(groupEl, id);
      setDlState(b, state);
      const r = b && b.closest(".episode-row");
      if (r) r.classList.toggle("ep-downloaded", state === "done");
    };
    if (mdlBtn.classList.contains("dl-done")) {
      for (const ep of group.episodes) {
        await deleteEpisode(ep);
        syncRow(ep.id, "idle");
      }
      setDlState(mdlBtn, "idle");
      return;
    }
    setDlState(mdlBtn, "busy");
    try {
      await downloadModule(group, { onEpisodeState: syncRow });
      setDlState(mdlBtn, "done");
    } catch (err) {
      console.error("[download:module]", err);
      setDlState(mdlBtn, group.episodes.every((e) => isDownloaded(e.id)) ? "done" : "idle");
      showToast("Module download failed — check your connection.");
    }
  }

  function renderLibrary() {
    viewLibrary.innerHTML = "";

    const lastEp = getLastPlayedEpisode();
    if (lastEp) {
      const prog = getEpisodeProgress(lastEp.id);
      const pct = Math.round((prog.progressPct || 0) * 100);
      const banner = document.createElement("div");
      banner.className = "continue-banner";
      banner.innerHTML = `
        <div class="continue-info">
          <div class="continue-label">Continue listening</div>
          <div class="continue-title">${lastEp.title}</div>
          <div class="continue-track"><div class="continue-fill" style="width:${pct}%"></div></div>
        </div>
        <button class="continue-play" aria-label="Resume">${playIcon(18)}</button>`;
      banner.querySelector(".continue-play").addEventListener("click", (e) => {
        e.stopPropagation();
        if (!guardPlayable(lastEp)) return;
        loadEpisode(lastEp, { autoplay: true });
        navigateToEpisode(lastEp.id);
      });
      banner.addEventListener("click", () => navigateToEpisode(lastEp.id));
      viewLibrary.appendChild(banner);
    }

    const groups = new Map();
    manifest.modules.forEach((mod) => {
      if (!groups.has(mod.prefix)) groups.set(mod.prefix, { prefix: mod.prefix, episodes: [] });
      mod.episodes.forEach((ep) => groups.get(mod.prefix).episodes.push({ ...ep, _moduleNum: mod.moduleNum }));
    });

    groups.forEach((group) => {
      group.episodes.sort((a, b) => (a._moduleNum - b._moduleNum) || ((a.unit || 0) - (b.unit || 0)));

      const groupEl = document.createElement("div");
      groupEl.className = "module";

      const completed = group.episodes.filter((e) => getEpisodeProgress(e.id).completed).length;
      const name = GROUP_NAMES[group.prefix] || group.prefix;
      const allDl = group.episodes.every((e) => isDownloaded(e.id));
      const head = document.createElement("div");
      head.className = "module-head";
      head.innerHTML = `
        <button class="module-start" aria-label="Start ${name}">${playIcon(16)}</button>
        <button class="module-dl${allDl ? " dl-done" : ""}" aria-label="${allDl ? "Delete module download" : "Download module"}">${allDl ? checkIcon(16) : downloadIcon(16)}</button>
        <button class="module-toggle">
          <span class="module-name">${name}</span>
          <span class="module-meta">${completed}/${group.episodes.length} listened</span>
          <span class="module-chev">&#8250;</span>
        </button>`;
      head.querySelector(".module-toggle").addEventListener("click", () => groupEl.classList.toggle("open"));
      head.querySelector(".module-start").addEventListener("click", (e) => {
        e.stopPropagation();
        startModule(group);
      });
      const mdlBtn = head.querySelector(".module-dl");
      mdlBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleModuleDownload(group, groupEl, mdlBtn);
      });
      groupEl.appendChild(head);

      const progTrack = document.createElement("div");
      progTrack.className = "module-progress-track";
      progTrack.innerHTML = `<div class="module-progress-fill" style="width:${(completed / group.episodes.length) * 100}%"></div>`;
      groupEl.appendChild(progTrack);

      const episodesEl = document.createElement("div");
      episodesEl.className = "module-episodes";
      group.episodes.forEach((ep, i) => episodesEl.appendChild(renderEpisodeRow(ep, i + 1)));
      groupEl.appendChild(episodesEl);

      viewLibrary.appendChild(groupEl);
    });
  }

  function renderEpisodeRow(ep, index) {
    const row = document.createElement("div");
    row.dataset.epId = ep.id;
    const progress = getEpisodeProgress(ep.id);
    const done = progress.completed;
    const dl = isDownloaded(ep.id);
    row.className = "episode-row" + (done ? " ep-row-done" : "") + (dl ? " ep-downloaded" : "");
    const pct = Math.round((progress.progressPct || 0) * 100);
    const rawDur = ep.voices[0]?.duration;
    const durStr = rawDur ? fmtDuration(rawDur / getCurrentSpeed()) : "";
    const inQueue = queue.includes(ep.id);

    row.innerHTML = `
      <span class="ep-index${done ? " ep-done" : ""}">${done ? "&#10003;" : index}</span>
      <div class="ep-main">
        <div class="ep-title-row">
          <span class="ep-title">${ep.title}</span>
          ${durStr ? `<span class="ep-duration">${durStr}</span>` : ""}
        </div>
        <div class="ep-progress-track"><div class="ep-progress-fill" style="width:${pct}%"></div></div>
      </div>
      <button class="ep-dl-btn${dl ? " dl-done" : ""}" aria-label="${dl ? "Delete download" : "Download"}">${dl ? checkIcon(15) : downloadIcon(15)}</button>
      <button class="ep-queue-btn${inQueue ? " in-queue" : ""}" aria-label="${inQueue ? "Remove from queue" : "Add to queue"}">${inQueue ? "&#10003;" : "+"}</button>
      <button class="ep-play" aria-label="Play ${ep.title}">${playIcon(16)}</button>`;

    const dlBtn = row.querySelector(".ep-dl-btn");
    dlBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (dlBtn.classList.contains("dl-busy")) return;
      if (dlBtn.classList.contains("dl-done")) {
        await deleteEpisode(ep);
        setDlState(dlBtn, "idle");
        row.classList.remove("ep-downloaded");
        return;
      }
      setDlState(dlBtn, "busy");
      try {
        await downloadEpisode(ep);
        setDlState(dlBtn, "done");
        row.classList.add("ep-downloaded");
      } catch (err) {
        console.error("[download]", err);
        setDlState(dlBtn, "idle");
        showToast("Download failed — check your connection.");
      }
    });

    const qBtn = row.querySelector(".ep-queue-btn");
    qBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = queue.indexOf(ep.id);
      const adding = idx < 0;
      if (adding) queue.push(ep.id);
      else queue.splice(idx, 1);
      // Update the button in place rather than re-rendering, so the open module
      // stays open and you can keep adding episodes.
      qBtn.classList.toggle("in-queue", adding);
      qBtn.textContent = adding ? "✓" : "+";
      qBtn.setAttribute("aria-label", adding ? "Remove from queue" : "Add to queue");
      updateQueueBadge();
    });
    row.querySelector(".ep-play").addEventListener("click", (e) => {
      e.stopPropagation();
      if (!guardPlayable(ep)) return;
      loadEpisode(ep, { autoplay: true });
      navigateToEpisode(ep.id);
    });
    row.addEventListener("click", () => navigateToEpisode(ep.id));
    return row;
  }

  // --- Routing ---
  function navigateToEpisode(id) { window.location.hash = `#/episode/${id}`; }
  function navigateToLibrary() { window.location.hash = "#/"; }

  function handleRoute() {
    const hash = window.location.hash;
    const match = hash.match(/^#\/episode\/(.+)$/);
    if (match) {
      const ep = findEpisode(decodeURIComponent(match[1]));
      if (ep) { showView("episode", ep); return; }
    }
    showView("library");
  }

  function showView(route, episode) {
    Object.entries(views).forEach(([name, el]) => { el.hidden = name !== route; });
    window.scrollTo({ top: 0, behavior: "instant" });

    if (route === "library") {
      setHidden(btnBack, true);
      renderLibrary();
    } else if (route === "episode") {
      setHidden(btnBack, false);
      episodeTitleEl.textContent = episode.title;
      tabBtns.forEach((b) => b.classList.toggle("active", b.dataset.tab === "supplementary"));
      setHidden(episodeContentEl, false);
      setHidden(quizArea, true);
      quizState = null;
      renderMarkdownTab(episode, "supplementary");
      if (!currentEpisode || currentEpisode.id !== episode.id) {
        loadEpisode(episode, { autoplay: false });
      }
    }
  }

  // --- Markdown ---
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  }

  function enhanceCodeBlocks() {
    episodeContentEl.querySelectorAll("pre").forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code) return;
      if (window.hljs) hljs.highlightElement(code);
      if (pre.querySelector(".copy-btn")) return;
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", () => {
        copyToClipboard(code.textContent);
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 2000);
      });
      pre.appendChild(btn);
    });
  }

  async function renderMarkdownTab(ep, tab) {
    const path = tab === "script" ? ep.scriptPath : ep.supplementaryPath;
    if (!path) { episodeContentEl.innerHTML = "<p><em>Not available.</em></p>"; return; }
    episodeContentEl.innerHTML = "<p><em>Loading…</em></p>";
    try {
      const res = await fetch(path);
      const text = await res.text();
      const stripped = text.replace(/^---\n[\s\S]*?\n---\n?/, "");
      episodeContentEl.innerHTML = marked.parse(stripped);
      enhanceCodeBlocks();
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      episodeContentEl.innerHTML = navigator.onLine
        ? "<p><em>Failed to load.</em></p>"
        : "<p><em>Not available offline — download this episode to read it here.</em></p>";
    }
  }

  // === QUIZ ===
  const QUIZ_SR_KEY = "podcast-quiz-sr";
  let quizState = null;

  function loadSR() {
    try { return JSON.parse(localStorage.getItem(QUIZ_SR_KEY)) || {}; } catch { return {}; }
  }
  function saveSR(all) { localStorage.setItem(QUIZ_SR_KEY, JSON.stringify(all)); }
  function srKey(ep, q) { return `${ep.id}::${q.id}`; }

  function getCard(ep, q) {
    return loadSR()[srKey(ep, q)] || { interval: 1, ef: 2.5, reps: 0, due: 0, correct: 0, total: 0 };
  }

  function updateCard(ep, q, correct) {
    const all = loadSR();
    const k = srKey(ep, q);
    const c = all[k] || { interval: 1, ef: 2.5, reps: 0, due: 0, correct: 0, total: 0 };
    c.total++;
    if (correct) c.correct++;
    const quality = correct ? 4 : 1;
    if (quality < 3) {
      c.reps = 0;
      c.interval = 1;
    } else {
      if (c.reps === 0) c.interval = 1;
      else if (c.reps === 1) c.interval = 6;
      else c.interval = Math.round(c.interval * c.ef);
      c.reps++;
    }
    c.ef = Math.max(1.3, c.ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    c.due = Date.now() + c.interval * 86400000;
    all[k] = c;
    saveSR(all);
    window.Sync && window.Sync.scheduleSync();
  }

  function isDue(ep, q) {
    const card = getCard(ep, q);
    return card.reps === 0 || card.due <= Date.now();
  }

  async function renderQuizTab(ep) {
    quizArea.innerHTML = "";
    if (!ep.quizPath) {
      quizArea.innerHTML = `<div class="quiz-empty"><p>No quiz yet for this episode.</p></div>`;
      return;
    }
    quizArea.innerHTML = `<div class="quiz-empty"><p>Loading…</p></div>`;
    try {
      const data = await fetch(ep.quizPath).then((r) => r.json());
      quizState = { ep, allQuestions: data.questions, questions: [], current: 0, score: 0, answered: false, mode: null, missed: [] };
      renderQuizPicker();
    } catch {
      quizArea.innerHTML = `<div class="quiz-empty"><p>Failed to load quiz.</p></div>`;
    }
  }

  function renderQuizPicker() {
    const { ep, allQuestions } = quizState;
    const sr = loadSR();
    const dueCount = allQuestions.filter((q) => isDue(ep, q)).length;
    const totalAttempts = allQuestions.reduce((n, q) => n + (sr[srKey(ep, q)]?.total || 0), 0);
    const totalCorrect = allQuestions.reduce((n, q) => n + (sr[srKey(ep, q)]?.correct || 0), 0);
    const pct = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : null;

    quizArea.innerHTML = `
      <div class="quiz-picker">
        <div class="quiz-picker-stats">
          <span class="qps-count">${allQuestions.length} questions</span>
          ${pct !== null ? `<span class="qps-score">${pct}% accuracy</span>` : ""}
          ${dueCount > 0 ? `<span class="qps-due">${dueCount} due for review</span>` : ""}
        </div>
        <div class="quiz-modes">
          <button class="quiz-mode-btn" id="btn-quiz-practice">
            <div class="qmb-icon">📝</div>
            <div class="qmb-title">Practice</div>
            <div class="qmb-desc">All ${allQuestions.length} questions, shuffled</div>
          </button>
          <button class="quiz-mode-btn${dueCount === 0 ? " qmb-disabled" : ""}" id="btn-quiz-review"${dueCount === 0 ? " disabled" : ""}>
            <div class="qmb-icon">🔁</div>
            <div class="qmb-title">Spaced Review</div>
            <div class="qmb-desc">${dueCount > 0 ? `${dueCount} card${dueCount !== 1 ? "s" : ""} due now` : "Nothing due — check back later"}</div>
          </button>
        </div>
      </div>`;

    document.getElementById("btn-quiz-practice").addEventListener("click", () => startQuiz("practice"));
    const reviewBtn = document.getElementById("btn-quiz-review");
    if (reviewBtn && !reviewBtn.disabled) reviewBtn.addEventListener("click", () => startQuiz("review"));
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz(mode) {
    const { ep, allQuestions } = quizState;
    const pool = mode === "review"
      ? shuffle(allQuestions.filter((q) => isDue(ep, q)))
      : shuffle([...allQuestions]);
    quizState.questions = pool;
    quizState.current = 0;
    quizState.score = 0;
    quizState.answered = false;
    quizState.mode = mode;
    quizState.missed = [];
    renderQuestion();
  }

  function renderQuestion() {
    const { questions, current } = quizState;
    const q = questions[current];
    const total = questions.length;

    quizArea.innerHTML = `
      <div class="quiz-session">
        <div class="quiz-header">
          <button class="quiz-exit-btn" id="btn-quiz-exit">✕ Exit</button>
          <span class="quiz-progress-text">${current + 1} / ${total}</span>
        </div>
        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" style="width:${Math.round((current / total) * 100)}%"></div>
        </div>
        <div class="quiz-question-wrap">
          <p class="quiz-q-text">${q.q}</p>
          <div class="quiz-options">
            ${q.options.map((opt, i) => `<button class="quiz-option" data-index="${i}">${opt}</button>`).join("")}
          </div>
          <div class="quiz-feedback" id="quiz-feedback" hidden>
            <div class="quiz-feedback-inner" id="quiz-feedback-inner"></div>
            <button class="quiz-next-btn" id="btn-quiz-next">
              ${current + 1 < total ? "Next question →" : "See results"}
            </button>
          </div>
        </div>
      </div>`;

    document.getElementById("btn-quiz-exit").addEventListener("click", () => {
      quizState.mode = null;
      renderQuizPicker();
    });
    document.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => handleAnswer(parseInt(btn.dataset.index, 10)));
    });
    document.getElementById("btn-quiz-next").addEventListener("click", advanceQuiz);
  }

  function handleAnswer(chosen) {
    if (quizState.answered) return;
    quizState.answered = true;

    const { ep, questions, current } = quizState;
    const q = questions[current];
    const correct = chosen === q.answer;

    if (correct) quizState.score++;
    else quizState.missed.push(q);

    updateCard(ep, q, correct);

    document.querySelectorAll(".quiz-option").forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add("opt-correct");
      else if (i === chosen) btn.classList.add("opt-wrong");
      else btn.classList.add("opt-dim");
    });

    const inner = document.getElementById("quiz-feedback-inner");
    inner.innerHTML = `
      <div class="feedback-verdict ${correct ? "verdict-correct" : "verdict-wrong"}">
        ${correct ? "✓ Correct" : "✗ Incorrect"}
      </div>
      ${q.explanation ? `<p class="feedback-explanation">${q.explanation}</p>` : ""}`;
    setHidden(document.getElementById("quiz-feedback"), false);
  }

  function advanceQuiz() {
    if (quizState.current + 1 >= quizState.questions.length) {
      renderQuizSummary();
    } else {
      quizState.current++;
      quizState.answered = false;
      renderQuestion();
    }
  }

  function renderQuizSummary() {
    const { score, questions, missed } = quizState;
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚";

    quizArea.innerHTML = `
      <div class="quiz-summary">
        <div class="quiz-summary-score">
          <div class="summary-emoji">${emoji}</div>
          <div class="summary-fraction">${score}/${total}</div>
          <div class="summary-pct">${pct}% correct</div>
        </div>
        <div class="quiz-summary-actions">
          <button class="quiz-action-btn" id="btn-quiz-again">Practice again</button>
          ${missed.length > 0
            ? `<button class="quiz-action-btn quiz-action-secondary" id="btn-quiz-missed">Retry ${missed.length} missed</button>`
            : ""}
          <button class="quiz-action-btn quiz-action-ghost" id="btn-quiz-back">← Back to quiz menu</button>
        </div>
      </div>`;

    document.getElementById("btn-quiz-again").addEventListener("click", () => startQuiz("practice"));
    document.getElementById("btn-quiz-missed")?.addEventListener("click", () => {
      quizState.questions = shuffle(quizState.missed);
      quizState.current = 0;
      quizState.score = 0;
      quizState.answered = false;
      quizState.missed = [];
      renderQuestion();
    });
    document.getElementById("btn-quiz-back").addEventListener("click", () => {
      quizState.mode = null;
      renderQuizPicker();
    });
  }

  // === END QUIZ ===

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.toggle("active", b === btn));
      const match = window.location.hash.match(/^#\/episode\/(.+)$/);
      if (match) {
        const ep = findEpisode(decodeURIComponent(match[1]));
        if (!ep) return;
        if (btn.dataset.tab === "quiz") {
          setHidden(episodeContentEl, true);
          setHidden(quizArea, false);
          renderQuizTab(ep);
        } else {
          setHidden(episodeContentEl, false);
          setHidden(quizArea, true);
          renderMarkdownTab(ep, btn.dataset.tab);
        }
      }
    });
  });

  window.addEventListener("hashchange", handleRoute);
  btnBack.addEventListener("click", navigateToLibrary);

  // Escape closes an open overlay (keyboard / desktop).
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!statsOverlay.hidden) setHidden(statsOverlay, true);
    if (!settingsOverlay.hidden) setHidden(settingsOverlay, true);
    if (!queueOverlay.hidden) setHidden(queueOverlay, true);
  });

  // --- Footer repo link (per-subject) ---
  const repoLink = document.getElementById("repo-link");
  if (repoLink) repoLink.href = REPO_URL;

  // --- Offline state ---
  const offlineBanner = document.getElementById("offline-banner");
  function updateOnlineState() {
    document.body.classList.toggle("offline", !navigator.onLine);
    if (offlineBanner) setHidden(offlineBanner, navigator.onLine);
  }
  window.addEventListener("online", updateOnlineState);
  window.addEventListener("offline", updateOnlineState);
  updateOnlineState();

  // Ask the browser to keep our data (progress, stats, downloads) — makes it far
  // less likely to be evicted under storage pressure. Signing in is the real
  // backup; this protects local data in the meantime.
  if (navigator.storage && navigator.storage.persist) {
    persistRequested = true;
    navigator.storage.persist().catch(() => {});
  }

  // --- Install (Add to Home Screen) ---
  let deferredInstall = null;
  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }
  function updateInstallUI() {
    if (!btnInstall || !installHint) return;
    if (isStandalone()) {
      setHidden(btnInstall, true);
      installHint.textContent = "App installed ✓";
    } else if (deferredInstall) {
      setHidden(btnInstall, false);
      installHint.textContent = "Add this app to your home screen for full-screen, offline access.";
    } else {
      setHidden(btnInstall, true);
      installHint.textContent = /iphone|ipad|ipod/i.test(navigator.userAgent)
        ? "On iPhone/iPad: tap Share, then “Add to Home Screen”."
        : "In Chrome/Edge, use the install icon in the address bar to add the app.";
    }
  }
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstall = e;
    updateInstallUI();
  });
  window.addEventListener("appinstalled", () => { deferredInstall = null; updateInstallUI(); });
  if (btnInstall) btnInstall.addEventListener("click", async () => {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    await deferredInstall.userChoice.catch(() => {});
    deferredInstall = null;
    updateInstallUI();
  });
  updateInstallUI();

  // When a sync pulls remote changes, refresh the library if it's showing.
  window.addEventListener("sync-updated", () => { if (!viewLibrary.hidden) renderLibrary(); });

  // --- Service worker ---
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").then((reg) => {
      // Notify (don't force-reload) when an updated app version is installed.
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", () => {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            showToast("App updated — reload for the latest.");
          }
        });
      });
    }).catch(() => {});
  }

  // --- Init ---
  fetch("manifest.json")
    .then((r) => r.json())
    .then((data) => { manifest = data; handleRoute(); });
})();
