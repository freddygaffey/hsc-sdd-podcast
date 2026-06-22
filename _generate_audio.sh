#!/usr/bin/env bash
#
# generate_audio.sh — convert lecture scripts into audio recordings locally.
#
# Episodes live as folders under  podcast/content/<episode>/  and each holds:
#     script.md          the spoken script   (input)
#     supplementary.md   read-along listings  (NOT spoken)
#     <voice>.m4a         one audio file per narrator voice the user can pick
#
# This renders content/<episode>/script.md to content/<episode>/<voice>.m4a,
# where <voice> is the Kokoro narrator voice used. Render several voices at once
# with KOKORO_VOICES (see generate_all_voices.sh): every (episode, voice) pair
# goes through ONE shared job pool, so free slots are always filled — e.g. a
# single new episode renders all its voices at once instead of one per round.
#
# Uses a LOCAL text-to-speech engine — no cloud, no API keys. Defaults to
# Kokoro (a high-quality offline neural model); Piper and macOS `say` are
# only used if explicitly requested via ENGINE. There is no silent fallback:
# if the requested engine isn't set up, the script fails with setup
# instructions instead of quietly switching engines.
#
# Usage:
#   ./generate_audio.sh                       # every episode in content/
#   ./generate_audio.sh SA-20-01-What-is-AI-vs-ML   # one episode (folder name)
#   ENGINE=say  ./generate_audio.sh           # force the macOS engine
#   KOKORO_VOICE=bm_george ./generate_audio.sh   # render that voice
#
# Optional environment variables:
#   ENGINE        kokoro | piper | say              (default: kokoro)
#   KOKORO_VOICE  narrator voice, e.g. af_heart, bm_george (default: af_heart)
#   KOKORO_VOICES space/comma list of narrator voices to render in one pass,
#                 e.g. "af_heart bm_george". All (episode, voice) pairs share
#                 one job pool. Overrides KOKORO_VOICE.   (default: KOKORO_VOICE)
#   KOKORO_VOICE2 question (second) voice for QUESTION:     (default: am_michael)
#   KOKORO_SPEED  speaking speed multiplier, e.g. 1.0       (default: 1.0)
#   KOKORO_LANG   a=American / b=British English            (default: a)
#   PIPER_BIN     path to the piper binary           (default: piper)
#   PIPER_MODEL   path to a piper .onnx voice model   (required for piper)
#   SAY_VOICE     macOS voice name, e.g. "Daniel"     (default: system voice)
#   SAY_RATE      macOS words-per-minute, e.g. 180    (default: engine default)
#   JOBS          CPU-device episodes to render at once, in parallel (default: 4)
#                 Each job loads its own copy of the model, so raise it
#                 cautiously if you're short on RAM.
#   GPU_JOBS      Apple GPU (Metal/MPS)-device episodes to render at once,
#                 IN ADDITION to JOBS                              (default: 0)
#                 mps is not officially supported by Kokoro but works, and
#                 renders a single episode ~1.7x faster than cpu. It doesn't
#                 parallelize well though -- 2 concurrent mps jobs only give
#                 ~1.5x combined throughput vs. one, because they share the
#                 one GPU, whereas CPU jobs scale close to linearly with
#                 JOBS. So: JOBS=4 GPU_JOBS=1 uses both the CPU cores and the
#                 GPU at once (recommended); GPU_JOBS alone with JOBS=0 maxes
#                 out single-episode latency instead of batch throughput.

set -euo pipefail

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  VOICE SETTINGS — edit these to change the voices. That's it.             ║
# ╠══════════════════════════════════════════════════════════════════════════╣
# ║  Browse/preview all voices: https://huggingface.co/hexgrad/Kokoro-82M     ║
# ║  Female: af_heart af_bella af_nicole af_sarah bf_emma bf_isabella         ║
# ║  Male:   am_michael am_fenrir am_puck am_adam bm_george bm_lewis          ║
# ║  Prefix: a* = American English, b* = British English.                    ║
# ╚══════════════════════════════════════════════════════════════════════════╝

NARRATOR_VOICE="af_heart"      # main teaching voice (NARRATOR: lines)
QUESTION_VOICE="am_michael"    # second voice, asks questions (QUESTION: lines)
SPEAKING_SPEED="1.0"           # 1.0 = normal, 1.1 = a little faster, 0.9 = slower
ENGLISH="a"                    # a = American, b = British (match your voices)

# ── End of voice settings ───────────────────────────────────────────────────
# (Env vars still override, e.g.  KOKORO_VOICE=bm_george ./generate_audio.sh)
KOKORO_VOICE="${KOKORO_VOICE:-$NARRATOR_VOICE}"
KOKORO_VOICE2="${KOKORO_VOICE2:-$QUESTION_VOICE}"
KOKORO_SPEED="${KOKORO_SPEED:-$SPEAKING_SPEED}"
KOKORO_LANG="${KOKORO_LANG:-$ENGLISH}"

# One run can render several narrator voices. KOKORO_VOICES (space/comma list)
# takes precedence; otherwise we render the single KOKORO_VOICE. Rendering the
# whole set in one process lets a single job pool span every (episode, voice)
# pair, so free slots are always filled instead of one voice per sequential pass.
if [[ -n "${KOKORO_VOICES:-}" ]]; then
  read -ra VOICES <<< "${KOKORO_VOICES//,/ }"
else
  VOICES=("$KOKORO_VOICE")
fi

# Resolve paths relative to this script so it runs from anywhere.
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTENT_DIR="$HERE/content"
STRIPPER="$HERE/strip_markdown.py"

# Isolated venv that holds the Kokoro neural model (created during setup).
KOKORO_PY="$HERE/.tts-venv/bin/python"
KOKORO_DRIVER="$HERE/kokoro_tts.py"
KOKORO_MLX_DRIVER="$HERE/kokoro_mlx_tts.py"   # Apple-Silicon (MLX GPU) Kokoro

# --- Pick an engine ----------------------------------------------------------
# No silent fallback: each engine must be explicitly requested or correctly
# set up, otherwise the script stops and tells you how to fix it.
ENGINE="${ENGINE:-kokoro}"
PIPER_BIN="${PIPER_BIN:-piper}"

case "$ENGINE" in
  kokoro)
    if ! [[ -x "$KOKORO_PY" ]] || ! "$KOKORO_PY" -c "import kokoro" >/dev/null 2>&1; then
      cat >&2 <<EOF
Error: Kokoro TTS venv not found or broken at $HERE/.tts-venv

Set it up with:
  ~/.pyenv/versions/3.10.18/bin/python3 -m venv "$HERE/.tts-venv"
  "$HERE/.tts-venv/bin/pip" install kokoro soundfile

(See README.md "Setup" for details, or set ENGINE=piper / ENGINE=say to use a different engine.)
EOF
      exit 1
    fi
    ;;
  mlx)
    if ! [[ -x "$KOKORO_PY" ]] || ! "$KOKORO_PY" -c "import mlx_audio" >/dev/null 2>&1; then
      cat >&2 <<EOF
Error: mlx-audio not installed in $HERE/.tts-venv (needed for ENGINE=mlx).

Install it with:
  "$KOKORO_PY" -m pip install mlx-audio

(ENGINE=mlx runs the same Kokoro voices on the Apple-Silicon GPU via $KOKORO_MLX_DRIVER.)
EOF
      exit 1
    fi
    ;;
  piper)
    if ! command -v "$PIPER_BIN" >/dev/null 2>&1; then
      echo "Error: piper binary not found (PIPER_BIN=$PIPER_BIN). Install piper or fix PIPER_BIN." >&2
      exit 1
    fi
    if [[ -z "${PIPER_MODEL:-}" ]]; then
      echo "Error: PIPER_MODEL not set. Point it at a piper .onnx voice model." >&2
      exit 1
    fi
    ;;
  say)
    if ! command -v say >/dev/null 2>&1; then
      echo "Error: macOS 'say' command not found (ENGINE=say requires macOS)." >&2
      exit 1
    fi
    ;;
  *)
    echo "Error: unknown ENGINE '$ENGINE' (expected kokoro, piper, or say)." >&2
    exit 1
    ;;
esac

echo "TTS engine: $ENGINE"
[[ "$ENGINE" == "kokoro" || "$ENGINE" == "mlx" ]] && echo "Kokoro narrators: ${VOICES[*]}  question: $KOKORO_VOICE2  speed: $KOKORO_SPEED"

# --- Gather episodes to convert ---------------------------------------------
# An episode is any folder under content/ that contains a script.md.
shopt -s nullglob
EPISODES=()
if [[ $# -gt 0 ]]; then
  for arg in "$@"; do
    # Accept a folder name, a folder path, or a path to its script.md.
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
  echo "No episodes found in $CONTENT_DIR (each needs a <episode>/script.md)." >&2
  exit 0
fi

JOBS="${JOBS:-4}"
GPU_JOBS="${GPU_JOBS:-0}"
TOTAL=$(( ${#EPISODES[@]} * ${#VOICES[@]} ))
if [[ "$GPU_JOBS" -gt 0 ]]; then
  echo "Rendering $TOTAL file(s) — ${#EPISODES[@]} episode(s) × ${#VOICES[@]} voice(s): up to $JOBS on CPU + $GPU_JOBS on GPU (mps) at a time"
else
  echo "Rendering $TOTAL file(s) — ${#EPISODES[@]} episode(s) × ${#VOICES[@]} voice(s), $JOBS at a time"
fi

# --- Render one (episode, voice) pair (own subshell, possibly in parallel) --
# device is only used by the kokoro engine ("cpu" or "mps"); ignored otherwise.
render_one() {
  local ep="$1" voice="$2" device="$3" src name tmp_txt wav out say_args existing
  src="$ep/script.md"
  name="$(basename "$ep")"

  # Skip if this voice's output is already newer than script.md, so re-running
  # over all episodes/voices only re-renders the pairs that changed.
  case "$ENGINE" in
    kokoro|mlx|say) existing="$ep/$voice.m4a" ;;
    piper)          existing="$ep/$voice.wav" ;;
  esac
  if [[ -e "$existing" && "$existing" -nt "$src" ]]; then
    echo "  = $name/$(basename "$existing") up to date, skipping"
    return 0
  fi

  tmp_txt="$(mktemp -t tts.XXXXXX).txt"

  # Clean markdown into speakable prose (strips frontmatter + any appendix).
  python3 "$STRIPPER" "$src" > "$tmp_txt"

  if [[ ! -s "$tmp_txt" ]]; then
    echo "  ! $name/script.md produced no text, skipping"
    rm -f "$tmp_txt"
    return 0
  fi

  case "$ENGINE" in
    kokoro)
      wav="$ep/$voice.wav"
      out="$ep/$voice.m4a"
      echo "  -> $name/$voice.m4a [$device]"
      # Kokoro's per-segment progress + PyTorch deprecation warnings get
      # noisy and interleaved once several jobs run in parallel, so each
      # job's output goes to its own log instead of the shared terminal.
      # On success we just print the driver's one-line summary; on failure
      # we dump the whole log so the error is still visible.
      local kok_log
      kok_log="$(mktemp -t tts-kokoro.XXXXXX)"
      if ! PYTHONWARNINGS="ignore::UserWarning,ignore::FutureWarning" \
        "$KOKORO_PY" "$KOKORO_DRIVER" "$tmp_txt" "$wav" \
          --voice "$voice" \
          --voice2 "$KOKORO_VOICE2" \
          --speed "$KOKORO_SPEED" \
          --lang "$KOKORO_LANG" \
          --device "$device" > "$kok_log" 2>&1
      then
        echo "  ! $name/$voice failed:" >&2
        cat "$kok_log" >&2
        rm -f "$kok_log"
        return 1
      fi
      grep -E "segments?,.*->" "$kok_log" | tail -1
      rm -f "$kok_log"
      # Compress WAV -> m4a (small, plays everywhere); tag with the voice used.
      if command -v ffmpeg >/dev/null 2>&1; then
        ffmpeg -y -loglevel error -i "$wav" -c:a aac -b:a 96k \
          -metadata artist="Kokoro: $voice" \
          -metadata album="Voice: $voice / Q: $KOKORO_VOICE2" \
          -metadata comment="narrator=$voice question=$KOKORO_VOICE2 speed=$KOKORO_SPEED" \
          "$out" && rm -f "$wav"
      else
        echo "     (ffmpeg not found; left WAV at $wav)"
      fi
      ;;
    mlx)
      # Same Kokoro voices, rendered on the Apple-Silicon GPU via mlx-audio.
      # Always uses the GPU, so $device is ignored here.
      wav="$ep/$voice.wav"
      out="$ep/$voice.m4a"
      echo "  -> $name/$voice.m4a [mlx-gpu]"
      local mlx_log
      mlx_log="$(mktemp -t tts-mlx.XXXXXX)"
      if ! PYTHONWARNINGS="ignore::UserWarning,ignore::FutureWarning" \
        "$KOKORO_PY" "$KOKORO_MLX_DRIVER" "$tmp_txt" "$wav" \
          --voice "$voice" \
          --voice2 "$KOKORO_VOICE2" \
          --speed "$KOKORO_SPEED" \
          --lang "$KOKORO_LANG" > "$mlx_log" 2>&1
      then
        echo "  ! $name/$voice failed:" >&2
        cat "$mlx_log" >&2
        rm -f "$mlx_log"
        return 1
      fi
      grep -E "segments?,.*->" "$mlx_log" | tail -1
      rm -f "$mlx_log"
      if command -v ffmpeg >/dev/null 2>&1; then
        ffmpeg -y -loglevel error -i "$wav" -c:a aac -b:a 96k \
          -metadata artist="Kokoro-MLX: $voice" \
          -metadata album="Voice: $voice / Q: $KOKORO_VOICE2" \
          -metadata comment="engine=mlx narrator=$voice question=$KOKORO_VOICE2 speed=$KOKORO_SPEED" \
          "$out" && rm -f "$wav"
      else
        echo "     (ffmpeg not found; left WAV at $wav)"
      fi
      ;;
    piper)
      out="$ep/$voice.wav"
      echo "  -> $name/$voice.wav"
      "$PIPER_BIN" --model "$PIPER_MODEL" --output_file "$out" < "$tmp_txt"
      ;;
    say)
      # AAC in an .m4a container — small and plays everywhere. Named after the
      # narrator voice (not SAY_VOICE) so each voice gets its own file instead
      # of all voices overwriting a single "say.m4a".
      out="$ep/$voice.m4a"
      echo "  -> $name/$(basename "$out")"
      say_args=(-o "$out" --data-format=aac -f "$tmp_txt")
      [[ -n "${SAY_VOICE:-}" ]] && say_args=(-v "$SAY_VOICE" "${say_args[@]}")
      [[ -n "${SAY_RATE:-}"  ]] && say_args+=(-r "$SAY_RATE")
      say "${say_args[@]}"
      ;;
  esac

  rm -f "$tmp_txt"
}

# --- Run every (episode, voice) pair through a mixed CPU + GPU job pool ------
# Each pair is independent. We dispatch the whole episode×voice grid into ONE
# pool: up to $JOBS run on cpu and up to $GPU_JOBS on mps AT THE SAME TIME, so
# free slots are always filled regardless of how the work splits — a single
# episode renders all its voices at once instead of one voice per round, and a
# big batch keeps every core busy. Bash 3.2 (macOS default) has no `wait -n`,
# so slots are tracked with marker files in RUN_DIR instead of a built-in.
RUN_DIR="$(mktemp -d -t tts-jobs)"
FAIL_LOG="$(mktemp -t tts-failures.XXXXXX)"
trap 'rm -rf "$RUN_DIR"' EXIT

cpu_count() { find "$RUN_DIR" -name 'cpu-*' 2>/dev/null | wc -l; }
gpu_count() { find "$RUN_DIR" -name 'mps-*' 2>/dev/null | wc -l; }

# Episode outer, voice inner: a single requested episode immediately enqueues
# all its voices, and interrupted runs leave whole episodes finished.
for ep in "${EPISODES[@]}"; do
  for voice in "${VOICES[@]}"; do
    while true; do
      if [[ "$(gpu_count)" -lt "$GPU_JOBS" ]]; then device="mps"; break; fi
      if [[ "$(cpu_count)" -lt "$JOBS" ]]; then device="cpu"; break; fi
      sleep 0.2
    done
    marker="$RUN_DIR/$device-$$-$RANDOM"
    : > "$marker"
    (
      if ! render_one "$ep" "$voice" "$device"; then
        echo "$(basename "$ep")/$voice" >> "$FAIL_LOG"
      fi
      rm -f "$marker"
    ) &
  done
done
wait

if [[ -s "$FAIL_LOG" ]]; then
  echo "Failed to render:" >&2
  cat "$FAIL_LOG" >&2
  rm -f "$FAIL_LOG"
  exit 1
fi
rm -f "$FAIL_LOG"

echo "Done. Audio written into each episode folder under: $CONTENT_DIR"
