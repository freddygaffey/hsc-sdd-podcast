#!/usr/bin/env bash
#
# generate_all_voices.sh — render every episode in every selectable narrator
# voice. Each voice lands inside the episode folder as content/<episode>/<voice>.m4a,
# so the viewer can offer them as a voice picker.
# The question (second) voice is the same across all of them.
#
# Usage:  ./generate_all_voices.sh                       # all episodes, all voices
#         ./generate_all_voices.sh SA-20-01-What-is-AI-vs-ML   # one episode, all voices

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# The canonical set of narrator voices the user can choose between.
# (Matches the <voice>.m4a files that end up in each episode folder.)
NARRATORS=(af_heart am_onyx am_santa bf_isabella bm_daniel bm_george)

# Second voice used for QUESTION: lines in every version.
QUESTION_VOICE="bm_fable"

# Render the whole (episode × voice) grid in a single pass so one job pool can
# span every voice instead of one voice per sequential round. When only a few
# episodes are requested, the freed-up slots fill with the other voices rather
# than idling — e.g. one new episode renders all its voices at once (up to JOBS).
echo "═══ Rendering ${#NARRATORS[@]} narrator voices: ${NARRATORS[*]} ═══"
KOKORO_VOICES="${NARRATORS[*]}" \
KOKORO_VOICE2="$QUESTION_VOICE" \
  "$HERE/_generate_audio.sh" "$@"

# Also render the eSpeak NG formant "Eloquence" voice — the crisp-at-extreme-speed
# track for the high-speed / 16x listener (see generate_espeak_voice.sh).
echo "═══ Rendering formant high-speed voice: Eloquence (eSpeak NG) ═══"
"$HERE/generate_espeak_voice.sh" "$@"

echo "All voices done. Each episode folder now holds one .m4a per voice (incl. Eloquence)."
