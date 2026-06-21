# Script Style Guide

How to write the `script.md` in each `content/<episode>/` folder so they sound consistent, sound good, and actually help in the exam. Read this before writing a script. Follow it.

---

## 1. Who you're writing for

One listener. Picture them clearly:

- **Year 12 HSC Software Engineering student.**
- **Already a strong programmer.** Comfortable with Python, Linux, and open-source tooling. Has built real things.
- **Weak spot is the HSC, not coding.** They don't know the *syllabus framing*, the official terminology, the way questions are marked, or the kind of examples markers want to see.

What this means for the writing:

- **Do not re-teach programming.** No "a variable stores a value", no "a loop repeats code". They know. Teaching them this is condescending and wastes their time.
- **Do teach the HSC-specific layer:** syllabus terms, what the dot-points actually mean, how concepts are *worded in exams*, and the examples/answers that earn marks.
- **Always be pointing at marks.** Every segment should leave them with something they could write in an exam answer.
- **Use real, precise technical language.** Name actual programming languages, real tools, real protocols, and the correct technical term for things — "a Python list comprehension", "an HTTP 401", "a hash collision", "polymorphism". The listener is a real programmer; correct terminology respects that and is exactly what earns marks. Don't water concepts down into vague paraphrases when the proper word exists. (You still *narrate* code rather than paste blocks — see §7 — but the vocabulary should be the real thing.)

If a sentence would be obvious to any competent programmer, cut it. If a sentence helps them get a better mark in the HSC, keep it.

---

## 2. The single goal of every script

> Teach the syllabus content **and** give the listener concrete, exam-ready examples and phrasing that get better marks.

A script is good if, after listening once, the student can answer a real HSC question on the topic better than before. That's the only test that matters.

---

## 3. Voices and format

**Mostly one narrator.** The default voice carries the lesson. Most of the script — easily 80%+ — is the narrator talking.

**A second voice appears only for Q&A.** When a natural question comes up — the kind a student would actually ask, or the kind an exam would ask — switch to the second voice to *pose the question*, then the narrator answers.

Use this when:

- A common point of confusion deserves to be voiced out loud.
- You want to model an exam question and then walk through a strong answer.
- The lesson needs a breather and a change of pace.

Don't overuse it. If every paragraph is a fake dialogue it gets annoying fast. A question or two per concept is plenty.

**The two voices are a speed anchor.** These episodes are listened to at **4–5× speed**. The change in voice between `NARRATOR:` and `QUESTION:` is one of the few cues that survives heavy time-compression — the ear still registers "different person" at 5×. So the Q&A format isn't just pacing; it's structural signposting. Keep it.

**Retrieval = "pause the player", not silent dead air.** The single best thing for memory is making the listener *try to recall* before hearing the answer (the testing effect). But a silent `[pause]` at 5× is a few milliseconds — useless. So when you genuinely want them to retrieve, the question must **tell them to pause the player**:

> QUESTION: Before I answer — what's the difference between authentication and authorisation? Pause now, work it out, then play.
>
> NARRATOR: Right. Authentication is...

Use this deliberately for the few highest-value questions per episode. For ordinary rhetorical questions, the narrator just answers straight on.

### 3.1 How to mark voices

Use plain **speaker labels** at the start of a line. Nothing fancy — the pipeline splits on these.

```
NARRATOR: ...the main teaching text goes here, in full sentences...

QUESTION: So how does this actually come up in an exam?

[pause]

NARRATOR: Good question. Usually it's phrased as...
```

Rules:

- Two labels only: `NARRATOR:` and `QUESTION:`.
- `QUESTION:` is the second voice. It **only asks** — it never explains. The narrator always answers.
- For real retrieval, the `QUESTION:` line tells the listener to **pause the player** (silent `[pause]` beats don't survive 4–5× playback). Don't rely on `[pause]` for thinking time.
- A label applies until the next label. Don't switch voices mid-line.
- If a script has no questions, it's just `NARRATOR:` throughout — that's fine.

---

## 4. Tone

- **Conversational and direct.** Like a sharp tutor who respects the student's time, not a textbook being read aloud.
- **Plain English, normal sentences.** Say it the way you'd say it out loud. The listener handles long, complex sentences comfortably at 4–5× speed, so don't artificially chop everything short — write natural, well-structured prose. Just keep it *clear*: one thought leading cleanly into the next.
- **No filler.** Cut "in this episode we will explore the fascinating world of...". Start teaching.
- **Confident, not hedgy.** "This is what the marker wants" beats "this might possibly be something to consider".
- **Occasional dry humour is fine.** Being a bit human keeps it listenable. Don't force jokes.

Assume intelligence, not knowledge. The listener is smart and technical — they just haven't seen *this syllabus content* before.

---

## 5. Structure of a script

Every script covers **one focused topic** (roughly one syllabus dot-point or sub-concept), but covers it thoroughly. Target **30–45 minutes** of audio. There's room to go deep — use it on examples, edge cases, and exam practice, not on padding.

**One home topic per episode — teach one thing.** Each episode has a single topic it actually *teaches*. Never split a lesson 50/50, where half teaches one concept and half teaches another. If you find yourself giving two things equal teaching time, they're two episodes.

- If a natural unit of content only needs ~10 minutes, **make a 10-minute episode.** Short is fine.
- If a unit is a bit much for one but you don't want to split it, **let the previous episode run to ~50 minutes** instead. The 30–45 target is a guide, not a fence — the real range is roughly **10–50 minutes**, dictated by where the topic naturally ends.

**Split big topics across numbered parts.** If a single topic is genuinely too large for one episode, break it into a sequence — `(1)`, `(2)`, `(3)` — rather than cramming or merging. Each part is still one coherent chunk; the numbering keeps the sequence easy to read and track. (See §8 for filenames.) Treat the parts as one continuous lesson: part `(2)`'s recap leads straight on from part `(1)`.

### Linking vs. teaching — the important distinction

You must connect related content, but there's a hard line between *linking* to something and *teaching* it.

- **Link freely — including across modules.** When the home topic genuinely touches another dot-point or even another module, reference it. This is essential, not optional. Example: while teaching **Programming for the Web** (designing a web app), you *should* say "one thing to be concerned about here is cross-site scripting" — pulling in a concept that's properly taught in **Secure Software Architecture**. That link makes both stick. A reference is a sentence or a quick example, not a detour.
- **Forward-reference with a prelude.** You can point at something not taught yet, as long as you give a one-line prelude so the listener isn't lost ("there's a thing called the same-origin policy — we cover it properly later — for now it just means a page can only talk to its own server").
- **Connect similar dot-points within a module deliberately.** When you teach dot-point two, reference dot-point one and show how they relate. Keep each dot-point's *teaching* in its own lesson, but weave the connections through.
- **Never merge two modules into one lesson.** Secure Software Architecture and Programming for the Web are separate syllabus things. You reference SSA *from* a PFW lesson — you do **not** make a lesson that's half PFW teaching and half SSA teaching. The home topic, and the module it belongs to, is always exactly one.

A reliable shape:

1. **Spaced-repetition recap (~5 minutes).** Open by revisiting the **last few lessons — up to the previous five**. Briefly re-explain the key ideas and terms from each, in plain language, so they get reinforced before new content lands. This is deliberate memory-building: the listener should hear the important points from recent episodes again and again over time. Keep it lively, not a dry list — connect the old material to where the new topic is going. (See §5.1.)
2. **Hook (1–2 sentences).** What today's topic is and why it matters *for the exam*. No throat-clearing.
3. **The core idea.** Explain the concept in plain terms. Connect it to something they already know as a programmer where it helps ("you've used this — the HSC just calls it X").
4. **The HSC framing.** The official terminology and how the syllabus/exam words it. This is the part they actually don't have.
5. **Worked example(s).** Concrete and exam-shaped. Go deep — several examples, with the strong-answer phrasing spelled out. This is where most of the 30–45 minutes should go.
6. **Interleaving throughout.** This isn't a single section — weave links to other syllabus topics through the whole episode. (See §5.2. At least two real cross-links per episode.)
7. **Questions** (second voice) scattered through, to test understanding and model exam questions. With a longer episode you have room for several.
8. **Recap (3–6 sentences).** The handful of things to remember from *today*. Phrase them the way they'd write them in an answer.
9. **Exam-style questions to finish.** End with a short set of the kind of questions the HSC would actually ask on this topic — see §5.6.

You don't have to label these sections — they're a skeleton, not headings to read aloud.

### 5.1 The spaced-repetition opener

The first ~5 minutes of every episode is a recap of recent lessons. The point is **spaced repetition**: the brain remembers things it meets repeatedly over spread-out intervals, so we re-surface old material on purpose.

How to write it:

- Cover the **most recent lessons, up to the last five.** More weight on the newest ones; lighter touches on the older ones (they've been recapped before).
- For each, give the **one or two ideas that actually matter** plus the **exact syllabus term**. Not a full re-teach — a sharp reminder. "Two episodes back we did data flow diagrams — remember, processes are circles, the marker wants the data labels on every arrow."
- **Lead into today.** End the recap by connecting the recent material to the new topic, so it feels like one continuous thread, not a quiz.
- Keep it spoken and warm. A good `QUESTION:` voice moment fits naturally here ("Wait, what was the difference between X and Y again?").
- If this is an early episode with little prior content, recap what exists and keep the opener proportionally shorter.

### 5.2 Interleave everything (no topic stands alone)

A topic taught in isolation is forgotten in isolation. The brain remembers things by their **connections**, so every episode must **interleave** today's topic with other parts of the syllabus. This is not optional flavour — it's the main mechanism for making the content stick.

The rule:

- **Link to at least two other syllabus topics in every episode.** When you explain something, actively reach for where else it shows up. "We're talking about X here — note this is the same idea you saw in Y, and it's exactly what Z relies on."
- **Connect fields to each other.** If two areas of the syllabus touch — a concept in one module that depends on or contrasts with one in another — say so out loud and explain the relationship. Don't let the listener think of each dot-point as a separate box.
- **Cross-reference both directions.** Point *back* ("remember from the data flow episode...") and *forward* ("you'll see this again when we get to security..."). Forward references prime the later lesson; backward ones reinforce the earlier one.
- **Use contrast as a teaching tool.** "This looks like X, but it's actually the opposite of it" is one of the most memorable structures you can use. The HSC loves "compare" and "distinguish" questions — interleaving is direct practice for them.
- **Make the web dense.** The more genuine links you draw between today's topic and the rest of the syllabus, the better. Aim for as much interlacing as the material honestly supports — but only real connections, never forced ones.

If an episode mentions a concept that lives elsewhere in the syllabus and *doesn't* connect it, that's a miss. Go back and weave it in.

### 5.3 Module review episodes

Every **five to ten episodes — wherever it makes topical sense** (usually at the end of a module or a coherent block) — write a dedicated **module review** episode.

A module review:

- **Steps back and ties the whole block together.** It's interleaving at full scale — the explicit job is to connect every topic in the module to every other, and to the modules around it.
- **Re-surfaces the key syllabus terms and mark-earning phrasing** from across the block, so the listener hears them all again in one pass.
- **Leans hard on exam questions.** Use the second voice heavily here: pose realistic exam questions that span multiple topics (the way real HSC questions do) and walk through strong, integrated answers.
- **Flags the traps** that come up across the module, especially places students confuse one topic for another.
- Can run to the longer end of the 30–45 minute range — there's a lot to pull together.

Name review files clearly so they're easy to spot (see §8).

### 5.4 Mnemonics & memory hooks (do this for every list)

**This is a top priority.** A huge amount of the HSC is "list the X" / "name the four Y" content, and a list of bare terms is the hardest thing to hold in memory — especially through audio at speed. So **every time the content has a list, set of steps, or group of terms the student must reproduce in an exam, give them an explicit memory hook.**

How to do it well:

- **Make an acronym or acrostic** from the first letters and say it out loud as a thing to remember. "The five are Confidentiality, Integrity, Availability, Authentication, Non-repudiation — remember it as *CIA-AN*." Then use the acronym again later in the episode and in future recaps.
- **Prefer a vivid or silly image** where you can — absurd, concrete, slightly rude images stick far better than dry ones. Spell the image out so the listener can *see* it.
- **Keep the hook stable.** Once you coin a mnemonic for a list, reuse the *exact same one* in every recap and review. Consistency is the whole point — the student should meet it again and again.
- **Tell them to write it down at the start of the exam.** "When you sit down, the first thing you dump on the page is CIA-AN." A hook they can offload onto paper in second one is worth real marks.
- **Don't force it.** If a list has a natural logic or order, teach *that* instead — a structure you understand beats an acronym you don't.

Treat a missing mnemonic on a memorisable list as a defect, the same as a missing syllabus term.

### 5.5 Other memory & retention techniques

Small things, backed by learning research, that make the episodes stick harder. Use them where they fit:

- **Pre-questions / objectives up front.** Right after the hook, pose the questions the episode answers: "By the end you'll be able to say exactly why hashing is not encryption." Hearing the question *first* primes attention and measurably improves what's retained.
- **Show a weak answer next to the strong one.** Don't only model the mark-earning answer — contrast it with the band-4 version. "A weak answer says *it stops hackers*. A strong answer says... — hear the difference?" Contrasting cases teach the marking boundary faster than a good example alone.
- **Teach through a story / real case.** Stories are remembered far better than abstract facts. Anchor a concept in a real event (a famous breach for a security dot-point, a real outage for automation). The student recalls the story in the exam and reconstructs the concept from it.
- **Expanding review, not just recent — but sparingly.** Beyond the §5.1 recap of the last five, *occasionally* call back something from much earlier for 20–30 seconds. Memory is strengthened most when material returns at *widening* intervals. Don't overdo it: one older callback now and then, not a second full recap. It should be a quick jog, not a tax on the episode's time.
- **Deliberate redundancy for the key point.** At 4–5× a single mention can slip past. Say the one thing that matters most **more than once, in different words** — once plainly, once as the exam phrasing, once in the recap. Redundancy that would feel like padding at 1× is doing real work at speed.

### 5.6 End every teaching episode with exam-style questions

After the recap, close with a short set of **the kind of questions the HSC would actually ask** on this topic. This is the listener's last impression and their self-test — make it count.

- **Match real exam style.** Use the genuine NESA verbs and formats — "Describe...", "Compare...", "Explain why...", "Evaluate...", and the occasional scenario/stimulus question. Mirror how this dot-point has historically been examined.
- **Range of difficulty.** A couple of quick recall ones, then one or two that demand application or a longer response — the marks are in the harder ones.
- **Use the `QUESTION:` voice, and make them retrieve.** Pose the question, tell them to pause the player and actually attempt an answer (§3), *then* the narrator gives a model answer with the mark-earning phrasing.
- **Keep it tight** — three to five questions. This is a sharp finish, not a second lesson.

This isn't optional flavour: it's the most direct exam practice in the episode, and it doubles as retrieval practice over everything just taught.

### 5.7 Case-study episodes (a different format on purpose)

Some episodes are **pure case studies**: one real story, told to be genuinely gripping. Think a Veritasium video on the xz/SSH backdoor — tension, stakes, a "how did they pull this off" arc. The goal is engagement and memory, not coverage.

These break the normal rules deliberately:

- **One case study per episode. One story, told well.** Not a list of three.
- **A full narrative documentary — roughly 25–35 minutes.** Give the story room: scene-setting, the people involved, the timeline beat by beat, the technical "how" woven into the drama, the tension and the payoff. Aim for the depth and craft of a Veritasium documentary. Don't pad with filler, but don't cut the story short either — earn the length with real detail and momentum, not repetition.
- **No spaced-repetition opener, no forced interleaving, no exam framing *during* the story.** Skip §5.1 and §5.2 here. Trying to bolt syllabus links onto the narrative kills it. Just tell the story.
- **It only has to be interesting.** Vivid, well-paced, a real narrative with a hook and a payoff. This is the one place where being *entertaining* is the primary job.
- **The syllabus tie-in happens later, in a separate episode.** A normal teaching episode down the line refers back to the case study ("remember the xz backdoor story? that's a supply-chain attack, which the syllabus calls...") and does the linking there. Don't do it inside the case study itself.
- Voices, pronunciation, and the appendix rules (§7) still apply — it's still a script for the same pipeline.

Because the payoff is deferred, **pick stories you can cash in later.** A case study is worth making if a future dot-point can point back to it. Name them so they're easy to find and reference (see §8).

---

## 6. Exam-focus rules (the important bit)

These are what make the scripts worth listening to:

- **Name the syllabus term explicitly.** If the dot-point says "data flow diagram", say "data flow diagram", not "a diagram showing how data moves". Markers reward the right vocabulary.
- **Mirror exam phrasing.** When you pose a question, word it like the HSC does ("Describe...", "Compare...", "Evaluate...", "Outline..."). Teach them what each verb is actually asking for.
- **Show mark-earning answers.** Don't just explain a concept — demonstrate a sentence or two that would *score*. "If you write it like this, that's the mark."
- **Flag common traps.** "Students lose marks here because they confuse X with Y." Call it out by name.
- **Tie back to the syllabus, not to general CS.** Interesting tangents are fine in moderation, but the spine of the script is the HSC content.

---

## 7. Writing for the text-to-speech engine

Scripts are read aloud by a TTS engine after `strip_markdown.py` cleans them, and then **listened to at 4–5× speed** in an app that also shows the script. Write **speakable prose**. The engine reads characters literally — if it looks weird written down, it'll sound weird — and a mispronounced term at 5× is unrecoverable, because there's no time to mentally reconstruct it. (Code and pseudocode aren't spoken; they live in the appendix — see §7.1.)

**Do:**

- Write full sentences in plain text.
- Spell out things the listener needs to hear: say "object-oriented programming, or OOP" the first time, then "OOP" after.
- Spell out symbols and operators in words when you mean them spoken: "less than", "equals", "and", "percent".
- **Make pronunciation bulletproof.** If a term, acronym, or name could trip the engine, write it the way it should *sound* (e.g. "SQL" → "sequel" or "ess-cue-ell", whichever you want said). At high speed there's no second chance to parse a garbled word.
- Use commas and full stops to control pacing within a sentence.

**Don't (in the spoken portion):**

- No code blocks in the spoken text. *Describe* code in English where you teach it — "a for-loop that counts from one to ten", not a literal listing. (The actual code lives in the appendix; see §7.1.)
- No markdown formatting in the spoken text — no `#` headings, `**bold**`, bullet lists, tables, or links. The stripper removes them, but you'll get garbled pacing.
- No raw URLs, file paths, or `CamelCase`/`snake_case` identifiers read literally — say them in words.
- No bare symbols you don't want spoken: `&`, `/`, `->`, `==`, etc. Write the word.
- Don't rely on silent `[pause]` markers for thinking time — they vanish at 4–5× playback. When you want the listener to stop and recall, have the `QUESTION:` voice tell them to pause the player (see §3).

Describe code by what it does, not by pasting it into the narration. This is a *format* rule, not a vocabulary one — use real languages and precise technical terms freely (§1); just say them aloud. Talk about "a for-loop using enumerate to get the index and value", not a literal `for i, x in enumerate(items)`.

### 7.1 The appendix: code & pseudocode (the reading companion)

The episodes are played in an app that shows the script alongside the audio, so the listener **can** see a screen — but might not be looking (4–5× on a commute). That gives us a strict split:

- **The spoken narration is primary and must be fully self-contained.** Everything needed to learn the topic is said in English. A listener with the screen in their pocket loses nothing. The appendix only ever *reinforces*.
- **Code and pseudocode are supplementary, and live in an appendix at the very bottom of the file** — after an `## Appendix` heading. The TTS pipeline stops there: nothing in the appendix is ever spoken. (No diagrams — see `SUPPLEMENTARY.md`.)

How to use it:

- **Put real code in the appendix as a labelled listing.** Use proper fenced code blocks with real, correct, runnable code in the actual language. Label each one ("Listing 1", "Listing 2").
- **Give exam-examinable algorithms in NESA pseudocode too.** When a topic could be examined as an algorithm, add a listing of it in the HSC's standard pseudocode style (`BEGIN/END`, `IF…THEN…ELSE…ENDIF`, `WHILE…ENDWHILE`, `FOR…NEXT`, `←` for assignment) so the student rehearses the exact form they'll write for marks. Showing the real code *and* the pseudocode side by side is itself a teaching point. (Format details in `SUPPLEMENTARY.md` §3.)
- **Reference it from the narration, but never depend on it.** "I've put the full version in Listing 1 if you want to read it later" is good. The spoken explanation must still stand alone — *don't* say "as you can see here" and trust they're looking.
- **Keep labels stable** so recaps and reviews can point back to "Listing 1 from the hashing episode".

---

## 8. File conventions

- One topic per **episode folder** under `content/`; the spoken script is `script.md`
  inside it (see `SUPPLEMENTARY.md` §1 for the full folder layout).
- **Folder name = the episode key.**
- **Naming pattern:** `MODULE-LL-Topic-Title`
  - `MODULE` — the module acronym (table below).
  - `LL` — two-digit lesson number **in teaching order**, zero-padded (`01`, `02`, …).
  - `Topic-Title` — `Title-Case-With-Hyphens`, human-readable.
  - Example: `content/SSA-03-Cross-Site-Scripting/`
- **Multi-part topics** (a topic split across episodes, §5) get a `-Part-N` suffix:
  `SSA-03-Cross-Site-Scripting-Part-1`, `SSA-03-Cross-Site-Scripting-Part-2`. Keep the
  same `LL` lesson number across all parts so they sort together in order.
- **Why the padded number matters:** alphabetical sort within a module must equal teaching
  order, because the spaced-repetition opener (§5.1) recaps "the last up-to-five lessons" and
  module reviews (§5.3) tie "a block" together — both rely on `ls content/` giving lessons in
  order. Never name a folder topic-first.

### Module acronyms

| Code | Module | Year |
|------|--------|------|
| `PF11` | Programming Fundamentals | 11 |
| `OOP11` | Object-Oriented Paradigm | 11 |
| `PM11` | Programming Mechatronics | 11 |
| `PFW` | Programming for the Web | 12 |
| `SSA` | Secure Software Architecture | 12 |
| `SA` | Software Automation | 12 |
| `SEE` | Software Engineering Project | 12 |

Year 11 modules carry the `11` suffix; Year 12 acronyms stand alone.

- **Module-review episodes (§5.3)** use a high `LL` so they sort to the end of their block,
  plus a clear marker: `SSA-99-Module-Review-Secure-Software-Architecture.md`.
- **Case-study episodes (§5.7)** are the one exception to the naming scheme: name them
  `case_descriptive_title.md` in lower snake_case — e.g. `case_the_xz_backdoor.md`,
  `case_the_cloudflare_outage.md`. They sit outside the teaching sequence (no module, no `LL`)
  and get tied in later; the `case_` prefix groups them together. Keep the title evocative, not
  syllabus-y.
- Keep all filenames in `Title-Case-With-Hyphens` — no spaces, no underscores.
- Don't put a spoken title line at the top unless you want it read aloud. The first line is the first thing the listener hears.

---

## 9. The quick checklist

Before a script is done, check:

- [ ] One focused topic, 30–45 minutes.
- [ ] Opens with a ~5-minute spaced-repetition recap of the last (up to five) lessons, leading into today.
- [ ] After the recap, gets teaching — no throat-clearing.
- [ ] Assumes a strong programmer — no basics re-taught.
- [ ] Uses the exact syllabus terminology.
- [ ] Contains at least one exam-shaped worked example with mark-earning phrasing.
- [ ] **Every memorisable list/set/steps has an explicit mnemonic or memory hook (§5.4).**
- [ ] Interleaves the topic with at least two other syllabus areas (links back and/or forward).
- [ ] Flags at least one common trap or marking pitfall (where relevant).
- [ ] If it's the 5th–10th episode of a block: it's a module-review episode (or one is scheduled soon).
- [ ] At least one high-value question uses "pause the player" retrieval (§3); second voice only asks, narrator only answers.
- [ ] Spoken narration is self-contained — learns fine audio-only; code/pseudocode are in the `## Appendix`, referenced by stable labels but never depended on (§7.1).
- [ ] Reads cleanly aloud — no code or markdown in the spoken part — and tricky terms are spelled for correct pronunciation.
- [ ] Recap leaves the listener with exam-ready takeaways.
- [ ] Ends with 3–5 exam-style questions in real NESA format, each with a model answer (§5.6).

If every box is ticked, ship it.
