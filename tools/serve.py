#!/usr/bin/env python3
"""Local dev server with correct audio MIME types and Range request support
(needed for iOS Safari, which requires 206 Partial Content before it'll play <audio>).

It also keeps manifest.json fresh automatically: every request for /manifest.json
re-scans content/ and rebuilds the manifest if anything changed, so new episodes
generated into content/ show up without anyone re-running generate_manifest.py.
The web app polls /manifest.json, so an open page picks them up on its own.
"""
import http.server
import mimetypes
import os
import re
import sys
import threading
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_manifest import (  # noqa: E402  (after sys.path tweak)
    CONTENT_DIR,
    FOLDER_RE,
    DurationCache,
    build_manifest,
    write_manifest,
)

mimetypes.add_type("audio/mp4", ".m4a")

ROOT = Path(__file__).resolve().parent.parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765

RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")

# --- automatic manifest regeneration -------------------------------------------------
# A cheap stat-based signature (no ffprobe) tells us when content/ changed; only then
# do we rebuild. The DurationCache means we re-probe just the new/changed audio files.
_manifest_lock = threading.Lock()
_duration_cache = DurationCache()
_last_signature: str | None = None


def content_signature() -> str:
    """Fast fingerprint of content/ — folder names plus each relevant file's
    name/mtime/size. Changes when an episode, script, or audio file is added or rewritten.
    Deliberately does NOT call ffprobe, so it is cheap to run on every request."""
    parts: list[str] = []
    if not CONTENT_DIR.is_dir():
        return ""
    for folder in sorted(CONTENT_DIR.iterdir()):
        if not folder.is_dir() or not FOLDER_RE.match(folder.name):
            continue
        files = sorted([*folder.glob("*.m4a"), folder / "script.md",
                        folder / "supplementary.md"], key=lambda p: p.name)
        for f in files:
            if f.exists():
                st = f.stat()
                parts.append(f"{folder.name}/{f.name}:{int(st.st_mtime)}:{st.st_size}")
    return "\n".join(parts)


def regenerate_if_changed() -> None:
    """Rebuild manifest.json iff content/ changed since the last build."""
    global _last_signature
    with _manifest_lock:
        signature = content_signature()
        if signature == _last_signature:
            return
        try:
            manifest = build_manifest(_duration_cache)
            write_manifest(manifest)
            _last_signature = signature
            episodes = sum(len(m["episodes"]) for m in manifest["modules"])
            print(f"[manifest] rebuilt: {len(manifest['modules'])} modules, "
                  f"{episodes} episodes", flush=True)
        except Exception as exc:  # keep serving the previous manifest on failure
            print(f"[manifest] regeneration failed ({exc}); serving previous version",
                  file=sys.stderr, flush=True)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        if not self.path.endswith(".m4a"):
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_head(self):
        # Keep the manifest current before serving it (covers both GET and HEAD).
        if self.path.split("?", 1)[0].rstrip("/") in ("/manifest.json", "/manifest"):
            regenerate_if_changed()

        range_header = self.headers.get("Range")
        if not range_header:
            return super().send_head()

        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().send_head()

        file_size = os.path.getsize(path)
        match = RANGE_RE.match(range_header)
        if not match:
            return super().send_head()

        start_str, end_str = match.groups()
        start = int(start_str) if start_str else 0
        end = int(end_str) if end_str else file_size - 1
        end = min(end, file_size - 1)
        length = end - start + 1

        f = open(path, "rb")
        f.seek(start)

        self.send_response(206)
        ctype = self.guess_type(path)
        self.send_header("Content-type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.send_header("Content-Length", str(length))
        self.end_headers()

        self._range_length = length
        return f

    def copyfile(self, source, outputfile):
        length = getattr(self, "_range_length", None)
        if length is None:
            return super().copyfile(source, outputfile)
        remaining = length
        bufsize = 64 * 1024
        while remaining > 0:
            chunk = source.read(min(bufsize, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


if __name__ == "__main__":
    regenerate_if_changed()  # warm the manifest (and the duration cache) before serving
    print(f"Serving {ROOT} on http://0.0.0.0:{PORT}", flush=True)
    http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
