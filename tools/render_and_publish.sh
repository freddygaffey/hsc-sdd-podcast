#!/usr/bin/env bash
#
# render_and_publish.sh — the one command to (re)build all audio and publish it.
#
# Pipeline:
#   1. Neural voices  — Kokoro on the Apple-Silicon GPU (mlx-audio), full voice set
#   2. Eloquence      — eSpeak-NG formant synth, the high-speed / 16x track
#   3. Manifest       — regenerate manifest.json (durations + voice list for the app)
#   4. Push to R2     — sync content/**/*.m4a to the Cloudflare R2 bucket (rclone)
#
# Every stage is resumable: each skips files already up to date, so re-running
# after an interruption only does the work that's left. A few failed episodes in
# stages 1-2 do NOT abort the run — the manifest + push still happen for whatever
# rendered, and the next run retries the stragglers.
#
# Usage:
#   ./tools/render_and_publish.sh                 # all episodes, all voices, then publish
#   ./tools/render_and_publish.sh SA-20-01-...    # one episode (folder name), then publish
#   SKIP_PUSH=1 ./tools/render_and_publish.sh     # render + manifest only (no R2 push)
#
# Env knobs:
#   NARRATORS       space list of narrator voices (default: the 6 picker voices)
#   QUESTION_VOICE  second voice for QUESTION: lines           (default: bm_fable)
#   JOBS            concurrent MLX renders (single GPU; keep low) (default: 2)
#   RCLONE_REMOTE / R2_BUCKET  passed through to tools/upload-audio.sh
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

NARRATORS="${NARRATORS:-af_heart am_onyx am_santa bf_isabella bm_daniel bm_george}"
QUESTION_VOICE="${QUESTION_VOICE:-bm_fable}"
JOBS="${JOBS:-2}"

echo "═══════════════════════════════════════════════════════════════════"
echo " render_and_publish — narrators: $NARRATORS"
echo "                      question:  $QUESTION_VOICE   MLX jobs: $JOBS"
echo "═══════════════════════════════════════════════════════════════════"

echo "═══ [1/4] Neural voices (Kokoro via MLX / Apple GPU) ═══"
ENGINE=mlx KOKORO_VOICES="$NARRATORS" KOKORO_VOICE2="$QUESTION_VOICE" \
  JOBS="$JOBS" GPU_JOBS=0 ./_generate_audio.sh "$@" \
  || echo "WARN: some neural renders failed (see above) — continuing."

echo "═══ [2/4] Eloquence (eSpeak-NG formant, high-speed track) ═══"
./generate_espeak_voice.sh "$@" \
  || echo "WARN: some Eloquence renders failed (see above) — continuing."

echo "═══ [3/4] Regenerate manifest.json ═══"
python3 tools/generate_manifest.py

if [[ "${SKIP_PUSH:-0}" == "1" ]]; then
  echo "SKIP_PUSH=1 — not pushing. Audio is in content/; run ./tools/upload-audio.sh to publish."
  exit 0
fi

echo "═══ [4/4] Push audio to Cloudflare R2 ═══"
if ! command -v rclone >/dev/null 2>&1; then
  echo "ERROR: rclone not installed — audio rendered but NOT pushed." >&2
  echo "  Install:   brew install rclone" >&2
  echo "  Configure: rclone config  (remote 'hsc-r2', see tools/upload-audio.sh header)" >&2
  echo "  Then run:  ./tools/upload-audio.sh" >&2
  exit 1
fi
./tools/upload-audio.sh
echo "═══ Done: rendered + manifest updated + audio pushed to R2. ═══"
