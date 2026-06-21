#!/usr/bin/env python3
"""Watch content/ and rebuild manifest.json whenever new episodes or audio files appear.

Run this while audio is being generated:
    python3 tools/watch_manifest.py

Polls every 5 seconds. Exits cleanly on Ctrl-C.
"""
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_manifest import CONTENT_DIR, FOLDER_RE, DurationCache, build_manifest, write_manifest

POLL_INTERVAL = 5  # seconds


def content_signature() -> str:
    """Cheap fingerprint of content/ — folder names + each file's mtime + size.
    Detects new folders, new .m4a files, and updated script/supplementary files."""
    parts: list[str] = []
    if not CONTENT_DIR.is_dir():
        return ""
    for folder in sorted(CONTENT_DIR.iterdir()):
        if not folder.is_dir() or not FOLDER_RE.match(folder.name):
            continue
        for f in sorted([*folder.glob("*.m4a"), folder / "script.md", folder / "supplementary.md"]):
            if f.exists():
                st = f.stat()
                parts.append(f"{folder.name}/{f.name}:{int(st.st_mtime)}:{st.st_size}")
    return "\n".join(parts)


def rebuild(cache: DurationCache) -> tuple[int, int]:
    manifest = build_manifest(cache)
    write_manifest(manifest)
    modules = manifest["modules"]
    return len(modules), sum(len(m["episodes"]) for m in modules)


def main() -> None:
    cache = DurationCache()
    last_sig = ""
    print(f"Watching {CONTENT_DIR} — press Ctrl-C to stop")

    # Do an initial build so the manifest is current before any loop runs.
    try:
        last_sig = content_signature()
        mods, eps = rebuild(cache)
        print(f"[init] {mods} modules, {eps} episodes")
    except Exception as exc:
        print(f"[init] failed: {exc}", file=sys.stderr)

    try:
        while True:
            time.sleep(POLL_INTERVAL)
            sig = content_signature()
            if sig == last_sig:
                continue

            # Something changed — figure out what for a helpful log line.
            old_lines = set(last_sig.splitlines())
            new_lines = set(sig.splitlines())
            added = sorted(new_lines - old_lines)
            removed = sorted(old_lines - new_lines)

            try:
                mods, eps = rebuild(cache)
                last_sig = sig
                if added:
                    print(f"[update] +{len(added)} file(s) → {mods} modules, {eps} episodes")
                    for line in added[:6]:
                        print(f"         + {line.split(':')[0]}")
                    if len(added) > 6:
                        print(f"         … and {len(added) - 6} more")
                if removed:
                    print(f"[update] -{len(removed)} file(s) removed")
            except Exception as exc:
                print(f"[error] rebuild failed: {exc}", file=sys.stderr)

    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
