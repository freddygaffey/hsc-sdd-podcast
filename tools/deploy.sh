#!/usr/bin/env bash
#
# Build a clean dist/ and deploy the static podcast app to Cloudflare Pages.
#
# Audio is NOT shipped here — it lives in Cloudflare R2 (see tools/upload-audio.sh).
# This bundles only the app shell + per-episode markdown/quiz, and regenerates the
# manifest so audio URLs point at your R2 origin.
#
# Usage:
#   AUDIO_BASE_URL=https://audio.example.com ./tools/deploy.sh
#   AUDIO_BASE_URL=https://audio.example.com PAGES_PROJECT=hsc-podcast ./tools/deploy.sh
#
# Prereqs: wrangler (npm i -g wrangler && wrangler login), ffprobe (brew install ffmpeg),
#          python3, rsync. The machine must have the local .m4a files (manifest build
#          probes them for durations).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PAGES_PROJECT="${PAGES_PROJECT:-hsc-podcast}"
DIST="${DIST:-dist}"

if [[ -z "${AUDIO_BASE_URL:-}" ]]; then
  echo "ERROR: set AUDIO_BASE_URL to your R2 public origin, e.g." >&2
  echo "       AUDIO_BASE_URL=https://audio.example.com ./tools/deploy.sh" >&2
  exit 1
fi

echo "==> Assembling $DIST/ (app shell + markdown/quiz, no audio)"
rm -rf "$DIST"
mkdir -p "$DIST"

# App shell — the only root files the running app needs. speed-engine.js powers the
# pitch-preserving playback-speed feature; index.html loads it, so it must ship.
cp index.html app.js auth.js speed-engine.js style.css service-worker.js app.webmanifest "$DIST/"

# Stamp a unique shell-cache version so every deploy updates atomically (install
# precaches the whole shell into a fresh cache; index.html + app.js never mismatch).
BUILD="$(date +%Y%m%d%H%M%S)"
sed "s/__BUILD__/$BUILD/g" "$DIST/service-worker.js" > "$DIST/service-worker.js.tmp" \
  && mv "$DIST/service-worker.js.tmp" "$DIST/service-worker.js"
echo "==> service-worker cache version: podcast-shell-$BUILD"

# Vendored libraries (marked + highlight.js + themes) the app loads locally so
# markdown/code rendering works offline. Must ship or the app 404s on them.
cp -r vendor "$DIST/"

# App icons (logo + install/home-screen icons).
cp -r icons "$DIST/"

# Cloudflare Pages header rules — forces no-cache on service-worker.js + manifest.json
# so the browser always revalidates them and can never get pinned to a stale worker.
cp _headers "$DIST/"

# Per-episode text the app fetches at runtime (script/supplementary/quiz only).
# Excludes *.m4a / *.wav and everything else; --prune-empty-dirs keeps dist tidy.
rsync -a --prune-empty-dirs \
  --include='*/' \
  --include='script.md' \
  --include='supplementary.md' \
  --include='quiz.json' \
  --exclude='*' \
  content/ "$DIST/content/"

echo "==> Generating $DIST/manifest.json with audio base: $AUDIO_BASE_URL"
AUDIO_BASE_URL="$AUDIO_BASE_URL" MANIFEST_OUTPUT="$DIST/manifest.json" \
  python3 tools/generate_manifest.py

# Safety net: make sure no audio snuck into the Pages bundle.
if find "$DIST" -name '*.m4a' -o -name '*.wav' | grep -q .; then
  echo "ERROR: audio files found in $DIST — aborting (audio belongs in R2)." >&2
  exit 1
fi

echo "==> dist size: $(du -sh "$DIST" | cut -f1) ($(find "$DIST" -type f | wc -l | tr -d ' ') files)"
echo "==> Deploying to Cloudflare Pages project: $PAGES_PROJECT"
wrangler pages deploy "$DIST" --project-name "$PAGES_PROJECT" --commit-dirty=true

echo "==> Done."
