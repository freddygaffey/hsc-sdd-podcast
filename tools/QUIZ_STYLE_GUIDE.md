# Quiz Style Guide

Each episode can have a `quiz.json` file in its content folder. The player loads it automatically when the Quiz tab is opened.

## File location

```
content/{episode-folder}/quiz.json
```

Example: `content/PFW-01-Applications-Of-Web-Programming/quiz.json`

---

## Format

```json
{
  "questions": [
    {
      "id": "pfw01-q01",
      "q": "Question text, written in HSC exam style.",
      "options": [
        "Option A — plausible but wrong",
        "Option B — the correct answer",
        "Option C — plausible but wrong",
        "Option D — plausible but wrong"
      ],
      "answer": 1,
      "explanation": "Why option B is correct, and why the others are wrong. Reference specific content from the script."
    }
  ]
}
```

### Field reference

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique per episode. Use pattern `{prefix}{module}-q{nn}` e.g. `pfw01-q01` |
| `q` | string | The question. Use HSC verb: Identify, Outline, Distinguish, Compare, Explain, Justify, Recommend. |
| `options` | string[4] | Always exactly 4 options. All should be plausible — avoid obviously wrong distractors. |
| `answer` | number | Zero-based index of the correct option (0–3). |
| `explanation` | string | Shown after answering. Explain WHY correct, and address the most tempting wrong answers. |

---

## Writing good questions

### Use HSC exam verbs

Match the verb to the cognitive level:

| Verb | Meaning | Marks |
|---|---|---|
| **Identify / Name / State** | Simple recall | 1–2 |
| **Outline / Describe** | Name + one characteristic | 2–3 |
| **Explain** | Reason or mechanism | 3–4 |
| **Distinguish / Compare** | Similarities and/or differences | 3–5 |
| **Evaluate / Justify / Recommend** | Weigh up, reach a conclusion | 5–6 |

### Distractors (wrong options)

Good distractors are wrong for a specific, learnable reason:
- **Common misconception** — something students often confuse with the right answer
- **Partially correct** — true statement, but doesn't answer *this* question
- **Wrong word, right concept** — uses an informal term instead of the syllabus term
- **Out of scope** — true for a different topic, not this one

Avoid: obviously absurd options, trick wording, double negatives.

### Explanations

The explanation is the most valuable part. It should:
1. Confirm **why the correct answer is correct** using the same language as the script
2. Address the **most tempting wrong answer** specifically
3. Reference any **mnemonics or exam techniques** introduced in the episode (e.g. "I-E-P", "MISO")
4. Be 2–4 sentences — detailed enough to teach, short enough to read quickly

### Question distribution

Aim for a mix across cognitive levels per episode:

| Type | Target share |
|---|---|
| Recall (Identify/Name) | 20–30% |
| Describe/Outline | 30–40% |
| Compare/Distinguish | 20–30% |
| Evaluate/Scenario | 10–20% |

### Scenario questions (highest value)

Include at least 1–2 scenario questions per episode. These mirror the HSC exam format:

> *A school wants to build a platform where students submit work and teachers give written feedback. Recommend the most appropriate web application type and justify your answer.*

For the options, give 4 plausible recommendations, each with brief reasoning. The correct answer requires applying the episode's specific framework (e.g. "the defining requirement is X, which matches Y").

---

## AI generation prompt

Use this prompt with Claude or GPT-4 to generate `quiz.json` from a script:

```
You are writing multiple-choice quiz questions for an HSC Software Engineering podcast episode.

Episode script:
---
{PASTE FULL SCRIPT TEXT HERE}
---

Generate exactly 10 questions in this JSON format:

{
  "questions": [
    {
      "id": "{PREFIX}{MODULE_NUM}-q{NN}",
      "q": "Question text using HSC exam verbs (Identify, Outline, Distinguish, Compare, Explain, Recommend).",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Why the correct answer is correct. Address the most tempting wrong answer. Reference mnemonics from the script."
    }
  ]
}

Rules:
- All 4 options must be plausible — avoid obviously wrong distractors
- Include a mix: 2–3 recall questions, 3–4 describe/explain, 2–3 compare/scenario
- Include at least 1 scenario question that applies the episode's framework to a real situation
- Explanations should be 2–4 sentences
- Use exact syllabus terminology from the script
- The answer field is the zero-based index of the correct option
- IDs follow the pattern: episode prefix + module number + question number (e.g. pfw01-q01 for PFW module 1)

Output only valid JSON. No markdown fences, no commentary outside the JSON.
```

---

## Spaced repetition behaviour

The player implements **SM-2** (SuperMemo 2 algorithm):

- **New card**: shown immediately, interval = 1 day after correct answer
- **Correct answer**: interval grows (1 day → 6 days → calculated via ease factor)
- **Wrong answer**: card resets to interval 1, shown again tomorrow
- **Ease factor** (EF): starts at 2.5, adjusts per answer; minimum 1.3
- **Due**: a card is "due" when `Date.now() >= dueDate` or it has never been answered

Progress is stored in `localStorage` under key `podcast-quiz-sr`, keyed by `{episodeId}::{questionId}`.

---

## Checking which episodes have quizzes

```bash
find content -name "quiz.json" | sort
```

To see which episodes are missing quizzes:

```bash
python3 - <<'EOF'
import json, os
from pathlib import Path

manifest = json.loads(Path("manifest.json").read_text())
for mod in manifest["modules"]:
    for ep in mod["episodes"]:
        folder = Path("content") / ep["id"]
        has_quiz = (folder / "quiz.json").exists()
        if not has_quiz:
            print(f"MISSING  {ep['id']}")
EOF
```
