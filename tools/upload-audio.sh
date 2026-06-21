#!/usr/bin/env bash
#
# Sync all episode audio (content/**/*.m4a) to a Cloudflare R2 bucket.
#
# Objects land keyed as <episode-folder>/<voice>.m4a — exactly what the deployed
# manifest expects when AUDIO_BASE_URL points at this bucket's public origin.
# Idempotent and resumable: re-run after rendering new episodes; rclone only
# uploads what changed.
#
# Prereqs: rclone (brew install rclone) with an S3-compatible remote configured for
# R2. Configure once with `rclone config`:
#   name:     hsc-r2
#   type:     s3
#   provider: Cloudflare
#   access_key_id / secret_access_key:  from an R2 API token
#   endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
#
# Usage:
#   ./tools/upload-audio.sh                       # remote=hsc-r2 bucket=hsc-sdd-podcast
#   RCLONE_REMOTE=hsc-r2 R2_BUCKET=hsc-sdd-podcast ./tools/upload-audio.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

RCLONE_REMOTE="${RCLONE_REMOTE:-hsc-r2}"
R2_BUCKET="${R2_BUCKET:-hsc-sdd-podcast}"

echo "==> Uploading content/**/*.m4a -> ${RCLONE_REMOTE}:${R2_BUCKET}"
rclone copy content "${RCLONE_REMOTE}:${R2_BUCKET}" \
  --include '*.m4a' \
  --transfers 16 \
  --checkers 32 \
  --progress

echo "==> Done. Objects keyed as <episode>/<voice>.m4a"
