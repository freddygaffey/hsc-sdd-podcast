#!/usr/bin/env bash
#
# generate_espeak_voice.sh — render each episode with the eSpeak NG formant
# synthesizer as an extra "Eloquence" voice, saved as content/<episode>/zz_eloquence.m4a.
#
# Why a formant synth as well as the neural Kokoro voices:
#   Research on high-speed listening (see _research/) found that at extreme
#   playback speeds, old formant synthesizers (Eloquence/DECtalk/eSpeak class)
#   stay crisp and intelligible where natural neural voices smear — it's what
#   screen-reader power users run at 18-22 syllables/second. So this is the voice
#   for the high-speed / 16x track. The neural voices remain the natural default.
#
# It auto-appears in the player's voice picker: generate_manifest.py discovers any
# <episode>/*.m4a, and the app's cleanVoiceName() renders "zz_eloquence" as
# "Eloquence" (the prefix is dropped) and sorts it last.
#
# Usage:
#   ./generate_espeak_voice.sh                       # every episode in content/
#   ./generate_espeak_voice.sh SA-20-01-What-is-AI-vs-ML   # one episode (folder name)
#
# Optional environment variables:
#   ESPEAK_VOICE  eSpeak NG voice/variant (e.g. en-us, en-gb)   (default: en-us)
#   ESPEAK_WPM    words/minute at 1x (the player applies speed)  (default: 175)
#   ESPEAK_PITCH  pitch 0-99                                      (default: 50)
#   ESPEAK_BIN    path to the espeak-ng binary                    (default: espeak-ng)

set -euo pipefail

ESPEAK_BIN="${ESPEAK_BIN:-espeak-ng}"
ESPEAK_VOICE="${ESPEAK_VOICE:-en-us}"
ESPEAK_WPM="${ESPEAK_WPM:-175}"
ESPEAK_PITCH="${ESPEAK_PITCH:-50}"
VOICE_FILE="zz_eloquence"   # -> picker label "Eloquence", sorted last

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTENT_DIR="$HERE/content"
STRIPPER="$HERE/strip_markdown.py"

if ! command -v "$ESPEAK_BIN" >/dev/null 2>&1; then
  cat >&2 <<EOF
Error: espeak-ng not found (ESPEAK_BIN=$ESPEAK_BIN).
Install it with:  brew install espeak-ng      (macOS)
                  sudo apt install espeak-ng   (Debian/Ubuntu)
EOF
  exit 1
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg not found (needed to encode .m4a)." >&2
  exit 1
fi

# --- Gather episodes (same selection rules as generate_audio.sh) -------------
shopt -s nullglob
EPISODES=()
if [[ $# -gt 0 ]]; then
  for arg in "$@"; do
    if   [[ -f "$arg" && "$(basename "$arg")" == "script.md" ]]; then EPISODES+=("$(dirname "$arg")")
    elif [[ -d "$arg" && -f "$arg/script.md" ]]; then EPISODES+=("$arg")
    elif [[ -f "$CONTENT_DIR/$arg/script.md" ]]; then EPISODES+=("$CONTENT_DIR/$arg")
    else echo "Skipping (no script.md found): $arg" >&2; fi
  done
else
  for dir in "$CONTENT_DIR"/*/; do
    [[ -f "$dir/script.md" ]] && EPISODES+=("${dir%/}")
  done
fi

if [[ ${#EPISODES[@]} -eq 0 ]]; then
  echo "No episodes found in $CONTENT_DIR." >&2
  exit 0
fi

echo "eSpeak NG voice '$ESPEAK_VOICE' @ ${ESPEAK_WPM} wpm -> <episode>/$VOICE_FILE.m4a"
echo "Rendering ${#EPISODES[@]} episode(s)…"

for ep in "${EPISODES[@]}"; do
  name="$(basename "$ep")"
  src="$ep/script.md"
  out="$ep/$VOICE_FILE.m4a"

  # Skip if up to date, so re-runs only touch changed episodes.
  if [[ -e "$out" && "$out" -nt "$src" ]]; then
    echo "  = $name/$VOICE_FILE.m4a up to date, skipping"
    continue
  fi

  tmp_txt="$(mktemp -t espeak.XXXXXX).txt"
  wav="$(mktemp -t espeak.XXXXXX).wav"

  # Clean markdown to prose, then drop the NARRATOR:/QUESTION: speaker labels and
  # [pause] markers (Kokoro consumes those; eSpeak should not read them aloud).
  python3 "$STRIPPER" "$src" | python3 -c '
import re, sys
t = sys.stdin.read()
t = re.sub(r"(?im)^\s*\**\s*(NARRATOR|QUESTION)\s*\**\s*:\s*", "", t)
t = re.sub(r"(?im)^\s*\[?\s*pause\s*\]?\s*$", "", t)
sys.stdout.write(t)
' > "$tmp_txt"

  if [[ ! -s "$tmp_txt" ]]; then
    echo "  ! $name/script.md produced no text, skipping"
    rm -f "$tmp_txt" "$wav"
    continue
  fi

  echo "  -> $name/$VOICE_FILE.m4a"
  "$ESPEAK_BIN" -v "$ESPEAK_VOICE" -s "$ESPEAK_WPM" -p "$ESPEAK_PITCH" -w "$wav" -f "$tmp_txt"

  ffmpeg -y -loglevel error -i "$wav" -c:a aac -b:a 96k \
    -metadata artist="eSpeak NG: $ESPEAK_VOICE" \
    -metadata album="Voice: Eloquence (formant, high-speed track)" \
    -metadata comment="engine=espeak-ng voice=$ESPEAK_VOICE wpm=$ESPEAK_WPM" \
    "$out"

  rm -f "$tmp_txt" "$wav"
done

echo "Done. Run tools/generate_manifest.py to surface the new voice in the app."
