#!/usr/bin/env python3
"""Scan content/ and generate manifest.json describing modules, episodes, and voice files.

Importable: `build_manifest()` returns the manifest dict and is reused by serve.py to
keep the manifest fresh automatically as new episodes appear (see DurationCache)."""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content"
OUTPUT = ROOT / "manifest.json"

FOLDER_RE = re.compile(r"^([A-Z]+)-(\d+)(?:-(\d+))?-(.+)$")

# Case-study folders (content/case_<slug>/) don't follow the module-numbered naming
# scheme, so they're collected under one synthetic "Case Studies" module (prefix CASE).
CASE_RE = re.compile(r"^case_(.+)$")
_ACRONYMS = {"dns": "DNS", "ddos": "DDoS", "npm": "npm", "xz": "XZ", "ai": "AI", "ml": "ML"}


def case_title(slug: str) -> str:
    """case_the_equifax_breach -> 'The Equifax Breach' (with a few acronyms fixed up)."""
    return " ".join(_ACRONYMS.get(w.lower(), w.capitalize()) for w in slug.split("_"))

# Where the web app should fetch audio from. Defaults to the repo-relative "content"
# prefix, so local dev (serve.py) is unchanged. For a Cloudflare deploy that serves
# audio from R2, set AUDIO_BASE_URL to the bucket's public origin, e.g.
#   AUDIO_BASE_URL=https://audio.example.com
# which yields absolute audio URLs like https://audio.example.com/<episode>/<voice>.m4a
# (R2 keys omit the "content/" prefix). The trailing slash, if any, is trimmed.
AUDIO_BASE_URL = os.environ.get("AUDIO_BASE_URL", "content").rstrip("/")


def ffprobe_duration(path: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True, check=True,
    )
    return round(float(result.stdout.strip()), 1)


class DurationCache:
    """Memoises ffprobe durations keyed by (path, mtime, size) so unchanged audio is
    never re-probed. Lets serve.py rebuild the manifest cheaply on every request."""

    def __init__(self) -> None:
        self._cache: dict[str, tuple[float, int, float]] = {}

    def duration(self, path: Path) -> float:
        st = path.stat()
        key = str(path)
        cached = self._cache.get(key)
        if cached and cached[0] == st.st_mtime and cached[1] == st.st_size:
            return cached[2]
        dur = ffprobe_duration(path)
        self._cache[key] = (st.st_mtime, st.st_size, dur)
        return dur


def build_episode(folder: Path, title: str, unit: int | None,
                  cache: DurationCache | None) -> dict:
    probe = cache.duration if cache else ffprobe_duration
    voices = []
    for m4a in sorted(folder.glob("*.m4a")):
        try:
            duration = probe(m4a)
        except subprocess.CalledProcessError:
            # Corrupt/unreadable audio (e.g. truncated encode, missing moov atom).
            # Skip it rather than aborting the whole manifest build.
            print(f"WARN  skipping unreadable audio: content/{folder.name}/{m4a.name}",
                  file=sys.stderr)
            continue
        voices.append({
            "name": m4a.stem,
            "file": f"{AUDIO_BASE_URL}/{folder.name}/{m4a.name}",
            "duration": duration,
        })
    script_path = folder / "script.md"
    supplementary_path = folder / "supplementary.md"
    return {
        "id": folder.name,
        "title": title,
        "unit": unit,
        "scriptPath": f"content/{folder.name}/script.md" if script_path.exists() else None,
        "supplementaryPath": f"content/{folder.name}/supplementary.md" if supplementary_path.exists() else None,
        "quizPath": f"content/{folder.name}/quiz.json" if (folder / "quiz.json").exists() else None,
        "voices": voices,
    }


def build_manifest(cache: DurationCache | None = None) -> dict:
    """Scan content/ and return the manifest dict (modules → episodes → voices)."""
    modules: dict[str, dict] = {}
    for folder in sorted(CONTENT_DIR.iterdir()):
        if not folder.is_dir():
            continue
        if not (folder / "script.md").exists() and not any(folder.glob("*.m4a")):
            continue
        match = FOLDER_RE.match(folder.name)
        case = CASE_RE.match(folder.name)
        if match:
            prefix, module_num, unit_num, title_slug = match.groups()
            module_id = f"{prefix}-{module_num}"
            module = modules.setdefault(
                module_id,
                {"id": module_id, "prefix": prefix, "moduleNum": int(module_num), "episodes": []},
            )
            module["episodes"].append(
                build_episode(folder, title_slug.replace("-", " "),
                              int(unit_num) if unit_num else None, cache))
        elif case:
            module = modules.setdefault(
                "CASE-0",
                {"id": "CASE-0", "prefix": "CASE", "moduleNum": 0, "episodes": []},
            )
            module["episodes"].append(
                build_episode(folder, case_title(case.group(1)), None, cache))
        else:
            continue

    module_list = []
    for module in sorted(modules.values(), key=lambda m: (m["prefix"], m["moduleNum"])):
        module["episodes"].sort(key=lambda e: (e["unit"] or 0, e["title"]))
        module_list.append(module)

    return {"modules": module_list}


def write_manifest(manifest: dict, output: Path = OUTPUT) -> None:
    output.write_text(json.dumps(manifest, indent=2))


def main() -> None:
    # MANIFEST_OUTPUT lets a deploy build write the R2-flavoured manifest into a
    # staging dir (e.g. dist/manifest.json) without clobbering the repo's relative
    # manifest.json used by local dev.
    output = Path(os.environ["MANIFEST_OUTPUT"]).resolve() if os.environ.get("MANIFEST_OUTPUT") else OUTPUT
    manifest = build_manifest()
    write_manifest(manifest, output)
    modules = manifest["modules"]
    print(f"Wrote {output} with {len(modules)} modules, "
          f"{sum(len(m['episodes']) for m in modules)} episodes "
          f"(audio base: {AUDIO_BASE_URL})")


if __name__ == "__main__":
    main()
