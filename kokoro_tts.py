#!/usr/bin/env python3
"""Render a lecture script to speech with the Kokoro local neural TTS model.

Runs fully offline (after the first run downloads the model weights) and
outputs a 24 kHz WAV file.

Supports the two-voice script format from STYLE.md:

    NARRATOR: main teaching text, spoken by the narrator voice...

    QUESTION: an exam-style question, spoken by the second voice.

    [pause]

    NARRATOR: ...and the narrator answers.

- Lines starting `NARRATOR:` use the narrator voice (--voice).
- Lines starting `QUESTION:` use the second voice (--voice2).
- A line that is just `[pause]` inserts a deliberate silent beat.
- A label applies until the next label; text before any label is narrator.

Usage:
    python3 kokoro_tts.py input.txt output.wav \
        [--voice af_heart] [--voice2 am_michael] [--speed 1.0] [--lang a] \
        [--device cpu]

Voices: af_heart, af_bella, am_michael, am_fenrir, bf_emma, bm_george, ...
Language: a = American English, b = British English.
"""

import argparse
import re
import sys

import numpy as np
import soundfile as sf

SAMPLE_RATE = 24000
LABEL_RE = re.compile(r"^\s*\**\s*(NARRATOR|QUESTION)\s*\**\s*:\s*(.*)$", re.I)
PAUSE_RE = re.compile(r"^\s*\[?\s*pause\s*\]?\s*$", re.I)


def parse_segments(text):
    """Yield (kind, payload) items in order.

    ("speech", speaker, text) where speaker is "narrator" or "question",
    ("pause", seconds).
    """
    speaker = "narrator"
    buf = []

    def flush():
        if buf:
            joined = " ".join(s.strip() for s in buf if s.strip())
            buf.clear()
            if joined:
                return ("speech", speaker, joined)
        return None

    for raw in text.splitlines():
        if PAUSE_RE.match(raw):
            seg = flush()
            if seg:
                yield seg
            yield ("pause", 0.7)
            continue

        m = LABEL_RE.match(raw)
        if m:
            seg = flush()
            if seg:
                yield seg
            speaker = "question" if m.group(1).lower() == "question" else "narrator"
            rest = m.group(2).strip()
            if rest:
                buf.append(rest)
            continue

        buf.append(raw)

    seg = flush()
    if seg:
        yield seg


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--voice", default="af_heart", help="narrator voice")
    ap.add_argument("--voice2", default="am_michael", help="question (second) voice")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--lang", default="a", help="a=American, b=British English")
    ap.add_argument(
        "--device", default="cpu",
        help="cpu (default) or mps (Apple GPU via Metal -- unofficial in "
             "Kokoro but works; faster per job, doesn't parallelize as well "
             "as CPU does across multiple jobs)",
    )
    args = ap.parse_args()

    with open(args.input, "r", encoding="utf-8") as f:
        text = f.read().strip()
    if not text:
        print("No text to synthesise.", file=sys.stderr)
        sys.exit(1)

    voices = {"narrator": args.voice, "question": args.voice2}

    from kokoro import KPipeline

    # Pick the accent (lang_code) from each voice's prefix: a*=American, b*=British.
    # Falls back to --lang for any voice that doesn't start a/b.
    def lang_for(voice):
        return voice[0] if voice[:1] in ("a", "b") else args.lang

    pipelines = {}

    def get_pipeline(voice):
        lang = lang_for(voice)
        if lang not in pipelines:
            # repo_id pinned explicitly to silence Kokoro's "Defaulting
            # repo_id" notice -- it gets printed once per pipeline per
            # process, so it multiplies fast under parallel JOBS/GPU_JOBS.
            pipelines[lang] = KPipeline(
                lang_code=lang, device=args.device, repo_id="hexgrad/Kokoro-82M"
            )
        return pipelines[lang]

    gap = np.zeros(int(SAMPLE_RATE * 0.3), dtype=np.float32)

    out = []
    seg_no = 0
    for item in parse_segments(text):
        if item[0] == "pause":
            out.append(np.zeros(int(SAMPLE_RATE * item[1]), dtype=np.float32))
            continue

        _, speaker, seg_text = item
        voice = voices[speaker]
        for _gs, _ps, audio in get_pipeline(voice)(seg_text, voice=voice, speed=args.speed):
            out.append(np.asarray(audio, dtype=np.float32))
            out.append(gap)
            seg_no += 1
            print(f"  segment {seg_no} ({speaker})   ", end="\r", file=sys.stderr)

    if not out:
        print("Synthesis produced no audio.", file=sys.stderr)
        sys.exit(1)

    full = np.concatenate(out)
    sf.write(args.output, full, SAMPLE_RATE)
    dur = len(full) / SAMPLE_RATE
    mins = int(dur // 60)
    print(f"\n  {seg_no} segments, {mins}m{int(dur % 60):02d}s -> {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
