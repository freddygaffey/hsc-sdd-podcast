# hsc-sdd-podcast — Lecture Audio

A standalone PWA that turns the HSC Software Engineering textbook into spoken lecture
recordings, fully local to generate — no cloud, no API keys. Deployed on Cloudflare
Pages (app) + R2 (audio); see **`DEPLOY.md`**.

> **Credits / source.** The lecture content is derived from the open
> [Eatham532/NSW-HSC-Software-Engineering-Textbook](https://github.com/Eatham532/NSW-HSC-Software-Engineering-Textbook)
> project. All credit for the underlying textbook material goes to that repository and
> its authors; this repo packages it into audio episodes and a listening app.

> **Writing or generating a new episode?** Read **`AUTHORING.md`** — it's the exact
> recipe (with fill-in templates) for the two files an author produces. `STYLE.md` covers
> how to write the words; `SUPPLEMENTARY.md` is the full format contract.

## Structure — one folder per episode

Every episode is a folder under `content/`, and **every episode has the same shape**:

```
content/
  SA-20-01-What-is-AI-vs-ML/
    script.md          # the spoken lecture (input to TTS)
    supplementary.md   # code listings + NESA pseudocode shown to the user (never spoken)
    af_heart.m4a       # one audio file per narrator voice the user can pick…
    am_onyx.m4a
    bf_isabella.m4a
    …
```

This is the canonical format — generate new episodes by creating another folder
with the same three kinds of file. See `SUPPLEMENTARY.md` for the file contract and
`STYLE.md` for how to write the words.

- `content/<episode>/script.md` — the spoken script. YAML frontmatter + the lecture body.
- `content/<episode>/supplementary.md` — read-along code/pseudocode, rendered to the user, never narrated.
- `content/<episode>/<voice>.m4a` — the audio, one file per selectable voice (the basename is the voice).
- `STYLE.md` — how to write the scripts (read it before writing).
- The `Year11-*.md` / `Year12-*.md` files are the full module bundles (raw textbook content).

## Generate audio

```bash
cd podcast
./generate_all_voices.sh                          # render every episode, every voice
./generate_all_voices.sh SA-20-01-What-is-AI-vs-ML   # render just one episode (folder name)
```

This is the only script you should run directly. It calls `_generate_audio.sh`
(the underscore marks it as an internal worker, not a direct entry point) once,
handing it the whole voice set so every episode-and-voice pair shares one job
pool — see the parallelism note below.

Output lands inside the episode folder as `<voice>.m4a`, AAC, small and plays everywhere.

### Run the whole batch overnight

```bash
cd podcast
nohup ./generate_all_voices.sh > run.log 2>&1 &
```

It re-renders every episode in `content/`, in every voice; check `run.log` for progress.
Roughly ~6× faster than real-time on Apple Silicon, so a 40-minute lecture
takes ~7 minutes to render. Already-made files are overwritten, so it's safe
to re-run after adding new scripts.

Every episode-and-voice pair goes through one shared job pool — 4 at a time by
default — so the render slots are always full no matter how the work splits: a
single new episode renders all its voices at once (up to `JOBS`), and a full
batch keeps every core busy. Already-rendered voices are skipped, so a re-run
only fills in what's missing. Raise `JOBS` if your CPU still has headroom (each
job loads its own copy of the model, so watch RAM):

```bash
JOBS=8 ./generate_all_voices.sh
```

## Voices (Kokoro)

The default engine is **Kokoro**, a high-quality local neural model.

- **Narrator** (main voice): `af_heart` — warm American female.
- **Question** (second voice, used for `QUESTION:` lines): `am_michael` — American male.

Change them per run:

```bash
KOKORO_VOICE=bm_george KOKORO_VOICE2=bf_emma ./_generate_audio.sh   # British pair
KOKORO_SPEED=1.1 ./_generate_audio.sh                               # a touch faster
```

Other voices: `af_bella`, `am_fenrir`, `bf_emma`, `bm_george`, and more.

## Two-voice script format

Scripts use plain speaker labels (see `STYLE.md` §3):

```
NARRATOR: The main teaching text goes here.

QUESTION: An exam-style question, in the second voice.

[pause]

NARRATOR: And the narrator answers.
```

- `NARRATOR:` → narrator voice. `QUESTION:` → second voice (only ever asks).
- `[pause]` on its own line → a short silent beat.
- A label applies until the next label; text before any label is the narrator.

## TTS engine

`_generate_audio.sh` defaults to **Kokoro** (neural) and fails with setup
instructions if it isn't installed — no silent fallback. Force **Piper** or
macOS **`say`** with `ENGINE=piper` / `ENGINE=say`. Note: the two-voice format
and `[pause]` are only honoured by the Kokoro engine.

## How it works

For each `content/<episode>/script.md`, `strip_markdown.py` cleans it (drops the
frontmatter, code blocks, headings, tables, links, and anything below an `Appendix`
heading) into speakable prose, then `kokoro_tts.py` renders it — parsing the speaker
labels and pauses — into `<voice>.m4a` next to the script.

## Setup (already done)

- Isolated Python 3.10 venv at `.tts-venv/` with `kokoro` + `soundfile`.
- `espeak-ng` and `ffmpeg` via Homebrew.

To recreate the venv:

```bash
~/.pyenv/versions/3.10.18/bin/python3 -m venv .tts-venv
.tts-venv/bin/pip install kokoro soundfile
```
