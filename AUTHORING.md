# Authoring an Episode (read this if you are generating episodes)

This is the **instruction sheet for whoever — human or AI — writes a new episode.** It
tells you the exact files to create and gives you fill-in templates. Follow it literally
and the TTS pipeline and viewer will both just work.

- `STYLE.md` — *how to write the spoken words* (tone, structure, exam value).
- `SUPPLEMENTARY.md` — *the full format contract and the why* behind everything here.
- **This file** — *the minimum you must produce, as a copyable recipe.*

---

## What you produce: exactly TWO text files

To author an episode you create **one folder** and put **two Markdown files** in it:

```
content/<EPISODE-KEY>/
    script.md          ← you write this
    supplementary.md   ← you write this
```

**You do NOT create the `.m4a` audio files.** The audio is generated from `script.md`
by `generate_all_voices.sh`, which drops one `<voice>.m4a` into the folder per voice.
Never invent, reference, or hand-author audio files. Your entire job is the two `.md`
files above.

### The folder name (`<EPISODE-KEY>`)

`MODULE-LL-Topic-Title` (or `case_descriptive_title` for a case study). See `STYLE.md`
§8 for the module codes and rules. Examples:

```
content/SA-20-01-What-is-AI-vs-ML/
content/SSA-03-Cross-Site-Scripting/
```

The folder name has no extension and must match across the whole episode.

---

## File 1 — `script.md` (the spoken script)

Frontmatter, then the spoken body. **No code, no tables, no appendix in this file** —
anything you put here is read aloud by the TTS engine.

````markdown
---
title: "Cross-Site Scripting"
module: SSA
lesson: "3"
kind: lesson                       # lesson | case-study | module-review
supplementary: supplementary.md    # always this literal value
---

NARRATOR: The entire spoken script goes here, as natural prose. Plain paragraphs
are read in the narrator voice. Follow STYLE.md for tone and structure.

QUESTION: An exam-style question, asked in the second voice.

NARRATOR: ...and the narrator continues. Reference code only by its label, e.g.
"the full version is in Listing 1" — never "as you can see here", because the
listener may not be looking.
````

Rules for `script.md`:

- **Frontmatter is required** with at least `title`, `module`, `lesson`, `kind`, and
  `supplementary: supplementary.md`.
- The body uses `NARRATOR:` / `QUESTION:` speaker labels (`STYLE.md` §3.1). Text before
  any label is the narrator. `[pause]` on its own line is a silent beat.
- It must be **self-contained and learnable audio-only** — someone who only listens, and
  never looks at the screen, must still understand the whole lesson.
- **No fenced code, no Markdown tables, no `## Appendix`.** Those belong in
  `supplementary.md`. If the engine sees them it will read them aloud.

---

## File 2 — `supplementary.md` (the read-along listings)

Frontmatter, a `# Supplementary Materials` heading, then the labelled listings. This
file is **shown to the user but never spoken**.

````markdown
---
title: "Supplementary Materials — Cross-Site Scripting"
module: SSA
lesson: "3"
script: script.md                  # always this literal value
---

# Supplementary Materials

Code listings and NESA-style pseudocode for this episode. Nothing here is spoken in the
audio — it's the read-along reference.

### Listing 1 — Reflected XSS in a Flask route
```python
@app.route("/search")
def search():
    q = request.args.get("q", "")
    return f"<p>You searched for {q}</p>"   # unescaped → XSS
```

### Listing 2 — The same search loop in NESA pseudocode
```text
BEGIN Search
    GET query
    FOR each record IN database
        IF record matches query THEN
            DISPLAY record
        ENDIF
    NEXT record
END Search
```
````

Rules for `supplementary.md`:

- **Frontmatter is required** with at least `title`, `module`, `lesson`, and
  `script: script.md`. Keep `module`/`lesson` identical to `script.md`.
- Every item is a `### Listing N — short description` heading followed by **one** fenced
  block. Number listings `1, 2, 3…` in the order the narration references them.
- **Real code** goes in a language-tagged fence (` ```python `, ` ```javascript `,
  ` ```sql `, …) so the viewer highlights it.
- **NESA pseudocode** goes in a ` ```text ` fence and must use the exam's conventions —
  `BEGIN`/`END`, `IF … THEN … ELSE … ENDIF`, `WHILE … ENDWHILE`, `FOR … NEXT`,
  `REPEAT … UNTIL`, `←` for assignment (`SUPPLEMENTARY.md` §3).
- When a topic is examinable as an algorithm, give **both** — the real code and the NESA
  pseudocode version.
- **No images, diagrams, or binary assets.** Text only.

---

## Final checklist (every episode, every time)

- [ ] One folder `content/<EPISODE-KEY>/` named per `STYLE.md` §8.
- [ ] It contains **exactly two files you wrote**: `script.md` and `supplementary.md`.
- [ ] You did **not** create any `.m4a` file — the pipeline does that.
- [ ] `script.md`: required frontmatter incl. `supplementary: supplementary.md`;
      `NARRATOR:`/`QUESTION:` body; self-contained audio-only; **no code/tables/appendix**.
- [ ] `supplementary.md`: required frontmatter incl. `script: script.md`;
      `# Supplementary Materials` heading; `### Listing N —` items, each one fenced block.
- [ ] Code is language-tagged; pseudocode is `text`-fenced and matches NESA style.
- [ ] The narration references each listing by label and never depends on seeing it.
- [ ] Work committed to git in a small, focused commit (commit **per episode** — see the "Version control" section in the root `AI_README.md`).

A complete, real example of all of this is the `content/SA-20-01-What-is-AI-vs-ML/` folder.
