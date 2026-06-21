 Task: Generate the next podcast episode (find a gap, then write it)

You are an expert HSC Software Engineering tutor and scriptwriter. Your job is to
pick the next episode that hasn't been made yet and produce a complete, spec-compliant
episode for it, then report what you did.

Working root: `/Users/fred/Software-Engineering-HSC-Textbook`

## Step 0 — Read the rules and the plan (do this first, do not skip)

Read these in full before writing anything:
- `podcast/AUTHORING.md` — the exact files to produce (the episode folder, `script.md`,
  `supplementary.md`). This is the file-format recipe; follow it literally.
- `podcast/STYLE.md` — how scripts are written. This is binding. The §9 checklist is your gate.
- `podcast/SUPPLEMENTARY.md` — the full format contract behind AUTHORING.md.
- `podcast/content/_plans/README.md` — teaching order, conventions, case-study + mnemonic master lists.
- The four module plans `podcast/content/_plans/{PFW,SSA,SA,SEE}-PODCAST_PLAN.md` — the episode briefs.

If an explicit target was given (e.g. "do SSA 16-01"), skip Step 1 and use that. Otherwise:

## Step 1 — Find the gap (deterministic)

1. Build the planned episode list in **teaching order**: PFW → SSA → SA → SEE, reading the
   ordered episode tables in each `PODCAST_PLAN.md` (lessons, `-Part-N` splits, `XX-99`
   reviews, and `case_…` studies all count as episodes).
2. List what already exists: any `podcast/content/<EPISODE-KEY>/script.md` (an episode
   folder with a real `script.md`, not a plan file). `content/SA-20-01-What-is-AI-vs-ML/`
   already exists and is the reference example (skip unless told to redo).
3. **The gap = the first episode in teaching order that has no episode folder yet.**
   Pick exactly one. State which one and why before proceeding.

## Step 2 — Gather the material for that episode

- Open its brief in the relevant `PODCAST_PLAN.md` (dot-points, recap targets, interleaving,
  mnemonics, worked-example/exam seeds, appendix seeds, traps). This is your blueprint.
- Read the matching textbook source section under `docs/Year12/<Module>/Chapter-XX-*/XX-YY-*/index.md`
  (and `quiz.md` if present) for the actual content and correct technical detail.
- Confirm the exact syllabus dot-point wording in `podcast/resources/Software-Engineering-11-12-Syllabus.md`.
- For the spaced-repetition opener, read the **last up-to-5 entries** in
  `podcast/content/_plans/RECAP-LEDGER.md` (the compact per-episode terms + mnemonics) —
  **not** the full prior scripts. Reuse the listed mnemonics **verbatim**. Only open a
  specific prior `script.md` if you need a detail the ledger entry doesn't capture.

## Step 3 — Write the episode to spec

Produce **two Markdown files** in the episode folder (`script.md` + `supplementary.md`, per
AUTHORING.md). The `script.md` must satisfy every box in STYLE.md §9. Non-negotiables:
- **`script.md` YAML frontmatter** (`title, module, lesson, kind, supplementary: supplementary.md`).
- **Two voices only:** `NARRATOR:` (teaches) and `QUESTION:` (only ever asks). ~80%+ narrator.
- **~5-min spaced-repetition opener** recapping the last up-to-5 episodes, leading into today.
- One **focused home topic** (~30–45 min; case studies 10–20). Never teach two topics.
- Audience = strong programmer weak on HSC framing: **don't re-teach programming**; teach the
  syllabus terms, exam phrasing, and mark-earning answers. Name the exact syllabus terminology.
- **≥2 real interleaving links** (back and/or forward, including cross-module) with preludes.
- **A mnemonic/memory hook for every memorisable list** (coin new ones; reuse existing ones unchanged).
- **At least one "pause the player" retrieval** `QUESTION:` (silent `[pause]` doesn't survive 4–5×).
- **Worked example(s)** with weak-vs-strong answer contrast and the mark-earning phrasing spelled out.
- **3–5 exam-style questions to close**, in real NESA verb format, each with a model answer.
- **Speakable prose** in `script.md`: no code/markdown/symbols in the spoken body (none below
  `## Appendix` either — there is no appendix in `script.md`); spell tricky terms phonetically.
- **`supplementary.md`** carries all code: its own frontmatter (`…, script: script.md`), a
  `# Supplementary Materials` heading, then real language-tagged code as `### Listing N — …`,
  plus NESA-style pseudocode where the topic is algorithmically examinable. Reference listings
  from the narration by label only — never "as you can see here".

## Step 4 — Save it

Create the episode **folder** `podcast/content/<EPISODE-KEY>/` and write **two files** into
it: `script.md` and `supplementary.md` (per AUTHORING.md). The `<EPISODE-KEY>` is the planned
name with the **module acronym in the folder name** (`MODULE-LL-Title` per STYLE.md §8,
`…-Part-N`, `MODULE-99-Module-Review-…`, or `case_…`) — e.g.
`content/PFW-01-Applications-Of-Web-Programming/`, `content/SSA-14-01-…/`. The textbook
section (e.g. `11.1`) goes in the frontmatter `lesson:` field, not the folder name. Do **not**
create any `.m4a` files — the pipeline generates audio.

Then **append a four-line block** for this episode to `podcast/content/_plans/RECAP-LEDGER.md`
(in teaching order), using the template at the top of that file — so the next episode's
spaced-repetition opener can recap yours without re-reading the whole script.

Finally, **commit your work to git** in one small, focused commit — the new episode folder
plus the ledger change — e.g.
`git add content/<EPISODE-KEY> content/_plans/RECAP-LEDGER.md && git commit -m "Add <EPISODE-KEY> episode"`.
Commit **per episode**: lots of little commits, not one batch at the end (see the
"Version control" section in the root `AI_README.md`). Don't push unless asked.

## Step 5 — Output an episode report

After saving, print a short report:
- **Gap chosen** and why (its position in teaching order).
- **File written** (path) and target duration.
- **Syllabus dot-points + outcomes** covered (quote the dot-point).
- **Spaced-rep recap** targets used; **interleaving links** made (back/forward, which episodes/modules).
- **Mnemonics** coined vs reused; **Listings** added (code + pseudocode).
- **STYLE.md §9 checklist:** tick each box; flag any you couldn't fully satisfy and why.
- **Follow-ups:** e.g. case studies this episode now needs cashed in, or a `-Part-2` if it ran long.

Write the script, not a summary of one. If anything in the brief conflicts with STYLE.md,
STYLE.md wins.
