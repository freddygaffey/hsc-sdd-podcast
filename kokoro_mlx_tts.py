#!/usr/bin/env python3
"""Render a lecture script to speech with Kokoro re-hosted on Apple's MLX.

Apple-Silicon-native drop-in for kokoro_tts.py. Same two-voice script format
(NARRATOR: / QUESTION: / [pause]), same CLI, same af_heart / am_michael
defaults, same 24 kHz WAV output -- but Kokoro-82M runs through `mlx-audio`
on the M-series GPU instead of CPU/MPS torch. Same voices, faster synthesis.

Why this exists: the TTS research
(_research/2026-06-21_better-tts-models-vs-kokoro) found no model independently
beats Kokoro on quality, so the recommended upgrade is operational -- re-host
the SAME Kokoro voices on MLX for native Apple-Silicon speed. This is that
re-host; the script format and voice picker are untouched.

Install (one-time, into the existing venv). Use `python -m pip`, not the
venv's `pip` console script -- its shebang broke when the repo was relocated:
    ./.tts-venv/bin/python -m pip install mlx-audio

Usage:
    python3 kokoro_mlx_tts.py input.txt output.wav \
        [--voice af_heart] [--voice2 am_michael] [--speed 1.0] [--lang a] \
        [--model mlx-community/Kokoro-82M-bf16]
    python3 kokoro_mlx_tts.py --list-voices

Language: a = American English, b = British English (taken from the voice's
first letter; --lang is the fallback for any voice that isn't a*/b*).
"""

import argparse
import sys

import numpy as np
import soundfile as sf

# Reuse the exact two-voice parser + sample rate from the CPU script so the two
# renderers can never drift apart on script-format handling.
from kokoro_tts import SAMPLE_RATE, parse_segments

# Default MLX re-host of hexgrad/Kokoro-82M. Same weights, same voice names.
DEFAULT_MODEL = "mlx-community/Kokoro-82M-bf16"

# The English Kokoro voices (identical names on torch-Kokoro and mlx-audio).
# {lang}{gender}_{name}: a=American, b=British; f=female, m=male.
VOICES = {
    "American English — female (af_)": [
        "af_heart", "af_alloy", "af_aoede", "af_bella", "af_jessica",
        "af_kore", "af_nicole", "af_nova", "af_river", "af_sarah", "af_sky",
    ],
    "American English — male (am_)": [
        "am_adam", "am_echo", "am_eric", "am_fenrir", "am_liam",
        "am_michael", "am_onyx", "am_puck", "am_santa",
    ],
    "British English — female (bf_)": [
        "bf_alice", "bf_emma", "bf_isabella", "bf_lily",
    ],
    "British English — male (bm_)": [
        "bm_daniel", "bm_fable", "bm_george", "bm_lewis",
    ],
}


def list_voices() -> None:
    """Print the categorised English voice list."""
    print("Kokoro / mlx-audio English voices "
          f"({sum(len(v) for v in VOICES.values())} total):\n")
    for group, names in VOICES.items():
        print(f"  {group}")
        print("    " + "  ".join(names))
        print()
    print("Defaults: narrator af_heart, question am_michael.")
    print("(The full Kokoro-82M repo also ships non-English voices: "
          "e/f/h/i/j/p/z prefixes.)")


def lang_for(voice: str, fallback: str) -> str:
    """American (a*) / British (b*) accent from the voice prefix."""
    return voice[0] if voice[:1] in ("a", "b") else fallback


def _patch_mlx_vocoder() -> None:
    """Work around an off-by-one frame bug in mlx-audio's Kokoro vocoder.

    In mlx-audio 0.4.x, istftnet.SineGen.__call__ builds `sine_waves` with an
    internal upsample that can overshoot `uv` by exactly one frame, so the
    `noise_amp * normal(sine_waves.shape)` broadcast crashes on certain inputs
    (specific sentence/phoneme lengths -- intermittent, ~off-by-300-samples).
    Crop both to the common length before combining. Idempotent; safe to drop
    once upstream fixes it.
    """
    import mlx.core as mx
    from mlx_audio.tts.models.kokoro import istftnet

    if getattr(istftnet.SineGen, "_speed_patch", False):
        return

    def __call__(self, f0):
        fn = f0 * mx.arange(1, self.harmonic_num + 2)[None, None, :]
        sine_waves = self._f02sine(fn) * self.sine_amp
        uv = self._f02uv(f0)
        n = min(sine_waves.shape[1], uv.shape[1])  # _f02sine can overshoot by 1 frame
        sine_waves, uv = sine_waves[:, :n, :], uv[:, :n, :]
        noise_amp = uv * self.noise_std + (1 - uv) * self.sine_amp / 3
        noise = noise_amp * mx.random.normal(sine_waves.shape)
        sine_waves = sine_waves * uv + noise
        return sine_waves, uv, noise

    istftnet.SineGen.__call__ = __call__
    istftnet.SineGen._speed_patch = True


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input", nargs="?", help="script file (NARRATOR:/QUESTION: format)")
    ap.add_argument("output", nargs="?", help="output .wav")
    ap.add_argument("--voice", default="af_heart", help="narrator voice")
    ap.add_argument("--voice2", default="am_michael", help="question (second) voice")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--lang", default="a", help="a=American, b=British English")
    ap.add_argument("--model", default=DEFAULT_MODEL, help="mlx-audio Kokoro repo")
    ap.add_argument("--list-voices", action="store_true", help="print voices and exit")
    args = ap.parse_args()

    if args.list_voices:
        list_voices()
        return

    if not args.input or not args.output:
        ap.error("input and output are required (or pass --list-voices)")

    with open(args.input, "r", encoding="utf-8") as f:
        text = f.read().strip()
    if not text:
        print("No text to synthesise.", file=sys.stderr)
        sys.exit(1)

    voices = {"narrator": args.voice, "question": args.voice2}

    try:
        from mlx_audio.tts.utils import load_model
    except ImportError:
        print("mlx-audio not installed. Run:\n"
              "    ./.tts-venv/bin/python -m pip install mlx-audio", file=sys.stderr)
        sys.exit(2)

    _patch_mlx_vocoder()
    model = load_model(args.model)

    gap = np.zeros(int(SAMPLE_RATE * 0.3), dtype=np.float32)

    out = []
    seg_no = 0
    for item in parse_segments(text):
        if item[0] == "pause":
            out.append(np.zeros(int(SAMPLE_RATE * item[1]), dtype=np.float32))
            continue

        _, speaker, seg_text = item
        voice = voices[speaker]
        for result in model.generate(
            text=seg_text,
            voice=voice,
            speed=args.speed,
            lang_code=lang_for(voice, args.lang),
            verbose=False,
        ):
            out.append(np.asarray(result.audio, dtype=np.float32))
            out.append(gap)
            seg_no += 1
            print(f"  segment {seg_no} ({speaker})   ", end="\r", file=sys.stderr)

    if not out:
        print("Synthesis produced no audio.", file=sys.stderr)
        sys.exit(1)

    full = np.concatenate(out)
    sf.write(args.output, full, SAMPLE_RATE)
    dur = len(full) / SAMPLE_RATE
    print(f"\n  {seg_no} segments, {int(dur // 60)}m{int(dur % 60):02d}s "
          f"-> {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
