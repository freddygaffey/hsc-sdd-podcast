// speed-engine.js — pitch-preserving variable-speed audio for the player.
//
// Why this exists:
//   The player used to drive speed with the HTML5 `<audio>.playbackRate`.
//   Browsers MUTE that audio path above ~4x (Chrome silences playbackRate > 4),
//   so the speed slider could go to 16x but produced silence past 4x. This
//   module replaces that path with a Web Audio time-scale-modification (TSM)
//   engine: it speeds audio up WITHOUT raising pitch and stays audible all the
//   way to 16x, on any of the existing voice files (no re-rendering).
//
//   Algorithm: WSOLA (Waveform Similarity Overlap-Add) running in an
//   AudioWorklet — the same family of TSM every podcast app uses for its speed
//   button. The whole episode is decoded once into memory and the worklet pulls
//   from it at the requested tempo, so the TTS is never re-run per speed.
//
// Integration:
//   `createSpeedAudio(fallbackEl)` returns an object that quacks like the subset
//   of the HTMLAudioElement API the player uses (src, load, play, pause, paused,
//   duration, currentTime, playbackRate, and loadedmetadata/play/pause/ended/
//   timeupdate events), so app.js swaps it in with a one-line change. If the
//   browser lacks AudioWorklet, it falls back to the real <audio> element
//   (which works fine up to 4x).

(function () {
  "use strict";

  // Decode at 24 kHz — Kokoro's native rate. Speech needs nothing above ~12 kHz,
  // and a lower rate halves the decoded-PCM memory footprint for long episodes.
  const TARGET_RATE = 24000;

  // The WSOLA time-stretcher, as an AudioWorklet processor. Defined as a string
  // and loaded from a Blob URL so there's no extra file to register/cache and it
  // stays offline-friendly. `sampleRate` is a global inside the worklet scope.
  const WORKLET_SRC = `
class StretchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.x = new Float32Array(0); // mono source samples
    this.srcLen = 0;
    this.tempo = 1;               // playback speed (output is this much faster)
    this.playing = false;
    this.ended = false;

    // Frame geometry. Synthesis hop is fixed at 50% overlap so Hann windows
    // reconstruct to unity gain; analysis hop scales with tempo.
    this.N = Math.round(sampleRate * 0.045) & ~1; // ~45 ms, even
    this.Hs = this.N >> 1;                          // synthesis hop (50%)
    this.tol = Math.round(sampleRate * 0.010);      // ±10 ms similarity search
    this.win = new Float32Array(this.N);
    for (let i = 0; i < this.N; i++) {
      this.win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (this.N - 1));
    }

    this.analysisPos = 0;  // source index (float) of the next analysis frame
    this.naturalNext = 0;  // source index of the ideal continuation (for WSOLA search)
    this.acc = new Float32Array(this.N); // overlap-add accumulator
    this.fifo = new Float32Array(this.N * 4); // output ring buffer
    this.fifoHead = 0; this.fifoTail = 0; this.fifoCount = 0;
    this.reportCtr = 0;

    this.port.onmessage = (e) => this.onMsg(e.data);
  }

  onMsg(m) {
    switch (m.type) {
      case "load":
        this.x = new Float32Array(m.buffer); // transferred ArrayBuffer
        this.srcLen = this.x.length;
        this.reset(0);
        break;
      case "tempo": this.tempo = Math.max(0.25, Math.min(16, m.value)); break;
      case "play":  if (!this.ended) this.playing = true; break;
      case "pause": this.playing = false; break;
      case "seek":  this.reset(Math.max(0, Math.min(this.srcLen - 1, Math.round(m.t * sampleRate)))); break;
    }
  }

  reset(pos) {
    this.analysisPos = pos;
    this.naturalNext = pos;
    this.acc.fill(0);
    this.fifoHead = this.fifoTail = this.fifoCount = 0;
    this.ended = false;
  }

  pushFifo(v) {
    if (this.fifoCount >= this.fifo.length) return; // ring full; drop (shouldn't happen)
    this.fifo[this.fifoTail] = v;
    this.fifoTail = (this.fifoTail + 1) % this.fifo.length;
    this.fifoCount++;
  }
  popFifo() {
    const v = this.fifo[this.fifoHead];
    this.fifoHead = (this.fifoHead + 1) % this.fifo.length;
    this.fifoCount--;
    return v;
  }

  // Produce one synthesis hop (Hs samples) of stretched audio into the FIFO.
  synthStep() {
    const { N, Hs, tol, win, x, srcLen } = this;
    if (this.analysisPos + N >= srcLen) { this.ended = true; this.playing = false; return; }

    // WSOLA: search ±tol around the analysis position for the frame whose
    // overlap region best matches the natural continuation of the last grain,
    // so periodic (voiced) structure stays aligned and phase jumps are avoided.
    let best = 0;
    const base = Math.round(this.analysisPos);
    if (this.analysisPos > 0 && this.naturalNext + (N - Hs) < srcLen) {
      let bestScore = -Infinity;
      for (let d = -tol; d <= tol; d++) {
        const p = base + d;
        if (p < 0 || p + N >= srcLen) continue;
        let score = 0;
        for (let i = 0; i < N - Hs; i += 2) score += x[p + i] * x[this.naturalNext + i];
        if (score > bestScore) { bestScore = score; best = d; }
      }
    }
    let start = base + best;
    if (start < 0) start = 0;
    if (start + N >= srcLen) start = srcLen - N - 1;

    // Window the chosen grain and overlap-add it into the accumulator.
    for (let i = 0; i < N; i++) this.acc[i] += win[i] * x[start + i];
    // The first Hs samples are now finished — emit them.
    for (let i = 0; i < Hs; i++) this.pushFifo(this.acc[i]);
    // Slide the accumulator left by Hs for the next grain's overlap.
    this.acc.copyWithin(0, Hs, N);
    this.acc.fill(0, N - Hs, N);

    this.naturalNext = start + Hs;
    this.analysisPos += Hs * this.tempo; // analysis hop = synthesis hop × speed
  }

  process(_inputs, outputs) {
    const out = outputs[0][0];
    if (!out) return true;

    if (!this.playing || this.srcLen === 0) { out.fill(0); return true; }

    for (let i = 0; i < out.length; i++) {
      while (this.fifoCount === 0 && !this.ended) this.synthStep();
      out[i] = this.fifoCount > 0 ? this.popFifo() : 0;
    }

    // Report playback position (~30 fps) and end-of-stream back to the main thread.
    if ((this.reportCtr++ & 7) === 0) {
      this.port.postMessage({ type: "pos", t: this.analysisPos / sampleRate });
    }
    if (this.ended && this.fifoCount === 0) {
      this.ended = false; // one-shot
      this.port.postMessage({ type: "ended" });
    }
    return true;
  }
}
registerProcessor("stretch-processor", StretchProcessor);
`;

  function createSpeedAudio(fallbackEl) {
    // Use `in` — do NOT read `AudioContext.prototype.audioWorklet`. It's a getter that
    // requires a real context as `this`; touching it on the prototype throws "Illegal
    // invocation" (Chrome/Safari/iOS), which previously crashed app init on load.
    const supported =
      typeof AudioContext !== "undefined" &&
      typeof AudioWorkletNode !== "undefined" &&
      "audioWorklet" in AudioContext.prototype;

    if (!supported) {
      if (fallbackEl) console.warn("[speed-engine] AudioWorklet unavailable — using <audio> (silent above 4x).");
      return fallbackEl; // native element already implements the same API
    }

    const listeners = {};
    function on(type, fn) { (listeners[type] || (listeners[type] = [])).push(fn); }
    function off(type, fn) { const a = listeners[type]; if (a) listeners[type] = a.filter((f) => f !== fn); }
    function fire(type) { (listeners[type] || []).forEach((fn) => { try { fn({ type }); } catch (e) { console.error(e); } }); }

    let ctx = null;
    let node = null;
    let loadToken = 0;
    let srcUrl = "";
    let _duration = 0;
    let _currentTime = 0;
    let _rate = 1;
    let _paused = true;
    let _ready = false;     // decoded + node wired
    let pendingPlay = false;

    function ensureContext() {
      if (ctx) return Promise.resolve();
      ctx = new AudioContext({ sampleRate: TARGET_RATE });
      const url = URL.createObjectURL(new Blob([WORKLET_SRC], { type: "application/javascript" }));
      return ctx.audioWorklet.addModule(url).then(() => URL.revokeObjectURL(url));
    }

    function load() {
      if (!srcUrl) return;
      const token = ++loadToken;
      _ready = false;
      _duration = 0;
      _currentTime = 0;

      ensureContext()
        .then(() => fetch(srcUrl))
        .then((r) => r.arrayBuffer())
        .then((buf) => ctx.decodeAudioData(buf))
        .then((audioBuf) => {
          if (token !== loadToken) return; // a newer src superseded this load

          // Downmix to mono (speech) — halves memory and simplifies the worklet.
          const ch = audioBuf.numberOfChannels;
          const len = audioBuf.length;
          const mono = new Float32Array(len);
          for (let c = 0; c < ch; c++) {
            const d = audioBuf.getChannelData(c);
            for (let i = 0; i < len; i++) mono[i] += d[i] / ch;
          }

          if (node) { try { node.disconnect(); } catch (e) {} }
          node = new AudioWorkletNode(ctx, "stretch-processor", { outputChannelCount: [1] });
          node.port.onmessage = (e) => {
            const m = e.data;
            if (m.type === "pos") { _currentTime = m.t; fire("timeupdate"); }
            else if (m.type === "ended") { _paused = true; _currentTime = _duration; fire("ended"); }
          };
          node.connect(ctx.destination);
          node.port.postMessage({ type: "tempo", value: _rate });
          node.port.postMessage({ type: "load", buffer: mono.buffer }, [mono.buffer]);

          _duration = len / audioBuf.sampleRate;
          _ready = true;
          fire("loadedmetadata");
          if (pendingPlay) { pendingPlay = false; play(); }
        })
        .catch((err) => console.error("[speed-engine] load failed:", err));
    }

    function play() {
      if (!_ready) { pendingPlay = true; return Promise.resolve(); }
      _paused = false;
      const p = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
      return p.then(() => { node.port.postMessage({ type: "play" }); fire("play"); });
    }

    function pause() {
      pendingPlay = false;
      if (!_paused) { _paused = true; if (node) node.port.postMessage({ type: "pause" }); fire("pause"); }
    }

    return {
      addEventListener: on,
      removeEventListener: off,
      load,
      play,
      pause,
      get paused() { return _paused; },
      get duration() { return _duration; },
      get currentTime() { return _currentTime; },
      set currentTime(t) {
        _currentTime = t;
        if (node) node.port.postMessage({ type: "seek", t });
        fire("timeupdate");
      },
      get playbackRate() { return _rate; },
      set playbackRate(r) {
        _rate = Math.max(0.25, Math.min(16, r));
        if (node) node.port.postMessage({ type: "tempo", value: _rate });
      },
      get src() { return srcUrl; },
      set src(v) { srcUrl = v; },
    };
  }

  window.createSpeedAudio = createSpeedAudio;
})();
