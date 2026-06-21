# Supplementary Materials & Viewer Format

How an episode is packaged so a viewer app can play it and show its supplementary
materials — code listings and pseudocode. This is the **contract** between the script
author, the TTS pipeline, and the frontend. `STYLE.md` says *how to write the words*;
this says *what file format carries them and how the code is stored*.

Read `STYLE.md` first — especially §7.1 (the appendix) and §8 (file conventions).
This document never contradicts it; it makes the format machine-readable.

> **Generating episodes?** Use **`AUTHORING.md`** — it's the prescriptive, copy-the-
> template recipe for the two files you must write. This document is the *why* behind it.

There are **no diagrams**. They were considered and dropped — they fought the clean
text format and add little for this listener, who would rather read code. Supplementary
material is code and NESA-style pseudocode, nothing else.

---

## 1. One episode = one folder, always the same shape

Each episode is a **folder** under `content/`, named with the episode key (`STYLE.md`
§8: `MODULE-LL-Topic-Title`, or `case_descriptive_title` for case studies). **Every
episode folder has the same three kinds of file** — this uniformity is the whole point,
so a generator can emit hundreds of them mechanically:

| File | What it is | Played / shown by |
|------|------------|-------------------|
| `script.md` | The spoken script: frontmatter + lecture body. One file. | TTS (input) + the viewer (synced transcript). |
| `supplementary.md` | The read-along code listings + NESA pseudocode. One file. | The viewer, rendered as HTML. **Never spoken.** |
| `<voice>.m4a` | The audio, one file per selectable narrator voice. | The audio player / voice picker. |

```
content/
  SSA-03-Cross-Site-Scripting/
    script.md            ← spoken script (frontmatter + body)
    supplementary.md     ← code + pseudocode shown alongside, never narrated
    af_heart.m4a         ← audio, one per voice the listener can choose…
    bm_george.m4a
    …
```

The folder name is the episode key. The viewer loads `script.md` for the transcript,
`supplementary.md` for the listings, and lists the `*.m4a` files as the voice options
(each basename **is** the voice). Spoken text and supplementary material are **two
separate files** so the TTS pipeline reads one and the viewer renders the other — there
is nothing to truncate and nothing to accidentally narrate.

Code, pseudocode, and tables are **not** separate assets; they live inside
`supplementary.md` as text (see §3).

---

## 2. Why Markdown is the structured-text format

The "structured text file of some file ending" is **Markdown (`.md`)**. It's the right
pick for every constraint here:

- **It's already the script format.** The episode's `script.md` is Markdown, so
  `supplementary.md` uses the same format — same tooling, no conversion, easy to author.
- **It renders in any browser, including a phone, with no build step.** A tiny client
  (`marked.js` or equivalent) turns it into HTML. Add a highlighter (`highlight.js` /
  Shiki) for code. Both are static JS, CDN-droppable, mobile-friendly. No server, no
  compile, no native app needed.
- **It's open and text-based.** No proprietary binary, diffable in git, editable by
  hand, and trivially **AI-generatable** — a model can emit a complete valid episode
  file directly. The same is *not* true of `.docx`, PDF, or a Figma export.
- **It has a clean machine-parseable structure** (§4): frontmatter for metadata and
  speaker labels for the transcript in `script.md`; stable `### Listing N` headings over
  fenced code in `supplementary.md`.

So: **audio is `.m4a`, both text files are `.md`.** Don't introduce JSON, XML, or a
bespoke format — the frontend parses Markdown.

---

## 3. Appendix content: code and pseudocode

The appendix carries two things, both plain text in fenced code blocks — **no diagrams,
no images, no binary assets.** (Diagrams were considered and dropped: they fought the
clean text format and add little for this listener. If a process ever genuinely needs a
picture, describe it in words in the narration instead.)

**1. Real code.** Runnable, correct code in the actual language, in a language-tagged
fence so the viewer highlights it:

```python
@app.route("/search")
def search():
    q = request.args.get("q", "")
    return f"<p>You searched for {q}</p>"   # unescaped → XSS
```

Use real languages and tools (`STYLE.md` §1) — `python`, `javascript`, `sql`, `bash`,
etc. This is what the listener reads alongside the audio.

**2. Pseudocode — in NESA's style.** The HSC exam writes and reads algorithms in its own
**standard pseudocode / flowchart conventions**, and trial/exam answers are marked
against that style. So pseudocode examples must look like the exam's, not like Python:

- Use the NESA control-structure words — `BEGIN`/`END`, `IF … THEN … ELSE … ENDIF`,
  `WHILE … ENDWHILE`, `FOR … NEXT`, `REPEAT … UNTIL` — and `←` (or `=`) for assignment.
- Match the indentation and capitalisation the exam uses, so the student is rehearsing
  the exact thing they'll write under exam conditions.
- Put it in a plain (untagged) or ```` ```text ```` fence so the highlighter doesn't
  mangle it.

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

When a topic is examinable as an algorithm, show **both**: the real code (how it
actually works) *and* the NESA pseudocode (how to write it for marks). The contrast is
itself a teaching point.

---

## 4. Structure the frontend can parse

The two text files are each machine-recognisable.

**`script.md` — frontmatter then the spoken body:**

```markdown
---
title: Cross-Site Scripting
module: SSA
lesson: 3
duration_minutes: 38
kind: lesson            # lesson | case-study | module-review
supplementary: supplementary.md
---

NARRATOR: ...the entire spoken script, using NARRATOR: / QUESTION: labels...

QUESTION: ...

NARRATOR: ...
```

**`supplementary.md` — frontmatter then the labelled listings:**

```markdown
---
title: Supplementary Materials — Cross-Site Scripting
module: SSA
lesson: 3
script: script.md
---

# Supplementary Materials

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
```

### 4.1 Frontmatter (YAML, between `---` fences)

Both files carry it. Machine-readable metadata for the viewer — title, ordering,
duration, episode kind. `script.md` points at `supplementary: supplementary.md` and
`supplementary.md` points back at `script: script.md`. The frontend reads this to build
playlists, show duration, and badge case studies / reviews. Keep keys stable; add new
ones rather than renaming.

### 4.2 `script.md` body — the spoken transcript

Everything after the frontmatter. Uses the `NARRATOR:` / `QUESTION:` speaker labels from
`STYLE.md` §3.1. This is what the TTS pipeline reads and what the viewer shows as the
synced transcript. It must be **self-contained** — learnable audio-only (`STYLE.md`
§7.1). It contains **no** code or appendix; that lives in `supplementary.md`.

### 4.3 `supplementary.md` — read-only, never spoken

A separate file, so the TTS pipeline simply never opens it. After its frontmatter and a
`# Supplementary Materials` heading, each item is a `###` subheading using the stable
label convention in §5, followed by one fenced block (code or pseudocode).

---

## 5. Labelling and referencing supplementary materials

So the narration can point at a code sample without depending on it, every appendix item
has a **stable label** as its `###` heading:

- **Code and pseudocode** → `### Listing N — short description`

Rules:

- **Number within the episode**, in the order they're referenced: Listing 1, Listing 2,
  Listing 3.
- **Reference from the narration by label only**: "the full version is in Listing 1",
  "Listing 2 is the same thing in exam pseudocode". Never "as you can see here" — the
  listener may not be looking (`STYLE.md` §7.1).
- **Labels are stable and permanent.** Once "Listing 1" in the hashing episode exists,
  later recaps and module reviews can say "Listing 1 from the hashing episode" and mean
  it. Don't renumber.
- **Cross-episode references** name the episode and the label: *"Listing 2 in
  `SSA-04-Hashing`"*. The viewer can resolve this to a link because the folder name is
  the episode key (§1).

---

## 6. How the pipeline keeps the appendix out of the audio

Because supplementary material is its own file, the TTS pipeline **never opens
`supplementary.md`** — it only renders `script.md`. So code can't leak into the audio by
construction.

As a belt-and-braces guard, `strip_markdown.py` also (a) drops a leading YAML
frontmatter block and (b) stops at any `Appendix` heading, so even a `script.md` that
keeps an inline appendix renders cleanly. The spoken/seen split is the primary mechanism;
the stripper guard is the safety net.

---

## 7. Checklist for an episode's materials

- [ ] One folder under `content/`, named with the episode key (`STYLE.md` §8).
- [ ] It contains `script.md`, `supplementary.md`, and one `<voice>.m4a` per voice.
- [ ] `script.md` has YAML frontmatter with at least `title`, `module`, `lesson`,
      `kind`, and `supplementary: supplementary.md`.
- [ ] `script.md` body uses `NARRATOR:` / `QUESTION:`, is self-contained audio-only, and
      contains no code or appendix.
- [ ] `supplementary.md` has frontmatter (incl. `script: script.md`) and a
      `# Supplementary Materials` heading.
- [ ] Code is in a real, language-tagged fenced block; NESA pseudocode is in a plain/
      `text` fence and matches exam conventions (§3).
- [ ] Every supplementary item has a stable `### Listing N —` label.
- [ ] The narration references each listing by label and never depends on seeing it.
- [ ] No diagrams, images, or binary assets — everything is text in `supplementary.md`.
