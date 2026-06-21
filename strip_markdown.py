#!/usr/bin/env python3
"""Convert a markdown lecture script into clean, speakable plain text.

Reads markdown from a file (or stdin) and writes narration-ready text to
stdout. Removes code blocks, markdown syntax, tables, images and links so a
text-to-speech engine reads natural prose instead of symbols.

Usage:
    python3 strip_markdown.py input.md > output.txt
    cat input.md | python3 strip_markdown.py
"""

import re
import sys


def strip_markdown(text: str) -> str:
    lines = text.splitlines()

    # Drop a leading YAML frontmatter block (--- ... ---) so its keys are never
    # spoken. Every episode script.md starts with one.
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() in ("---", "..."):
                lines = lines[i + 1 :]
                break

    out = []
    in_code = False

    for line in lines:
        stripped = line.strip()

        # Stop at an appendix heading: everything below is read-only listings,
        # never narrated. (Supplementary material lives in supplementary.md, but
        # guard here too in case a script keeps an inline appendix.)
        if re.match(r"^#{1,6}\s+Appendix\b", stripped, flags=re.IGNORECASE):
            break

        # Toggle fenced code blocks (``` or ~~~) and skip their contents.
        if stripped.startswith("```") or stripped.startswith("~~~"):
            in_code = not in_code
            continue
        if in_code:
            continue

        # Drop YAML front matter fences and markdown table rows.
        if stripped == "---" or stripped == "...":
            out.append("")
            continue
        if set(stripped) <= {"|", "-", ":", " "} and "|" in stripped:
            continue  # table separator row
        if stripped.startswith("|") and stripped.endswith("|"):
            # Read table cells as a sentence.
            cells = [c.strip() for c in stripped.strip("|").split("|")]
            out.append(", ".join(c for c in cells if c) + ".")
            continue

        out.append(line)

    text = "\n".join(out)

    # Images: ![alt](url) -> drop entirely.
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)
    # Links: [label](url) -> label.
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    # Headings: leading # symbols.
    text = re.sub(r"^\s{0,3}#{1,6}\s*", "", text, flags=re.MULTILINE)
    # Blockquote markers.
    text = re.sub(r"^\s*>\s?", "", text, flags=re.MULTILINE)
    # List bullets -> nothing (keep the text).
    text = re.sub(r"^\s*[-*+]\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+\.\s+", "", text, flags=re.MULTILINE)
    # Bold/italic/inline-code markers.
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"__([^_]+)__", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    # Horizontal rules.
    text = re.sub(r"^\s*([-*_])\1{2,}\s*$", "", text, flags=re.MULTILINE)
    # Collapse 3+ blank lines to a paragraph break.
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip() + "\n"


def main() -> None:
    if len(sys.argv) > 1:
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            raw = f.read()
    else:
        raw = sys.stdin.read()
    sys.stdout.write(strip_markdown(raw))


if __name__ == "__main__":
    main()
