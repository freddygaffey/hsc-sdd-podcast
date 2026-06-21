---
title: "Supplementary Materials — Feedback Analysis"
module: SEE
lesson: "26.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches turning raw
user feedback into decisions via the collect-synthesise-act process (C-S-A), prioritising on an
impact-versus-effort matrix, and closing the loop — deciding by evidence, not by the loudest voice.

### Listing 1 — A feedback-to-action table (text)

```text
FEEDBACK -> ACTION (the documented response; prioritise by EVIDENCE, not volume)

Source(s)              Theme           Signal strength        Impact  Effort  Action
---------------------  --------------  ---------------------  ------  ------  -------------------
support logs (25)      reliability     25 tickets + crashes   high    low     IMMEDIATE fix
analytics              usability       60% abandon signup     high    med     next sprint
15 teachers (survey)   usability       grading too complex    med     high    following sprint
1 angry email          niche feature   single voice           low     med     backlog / explain

Triangulate (confirm across sources). Representative sampling (hear the whole user base, not the
vocal few = a fairness/bias duty, PABT-B). Close the loop: tell users how feedback changed things.
```

### Listing 2 — The impact-versus-effort matrix (text)

```text
IMPACT vs EFFORT MATRIX — prioritise feedback-driven changes

                 LOW EFFORT                 HIGH EFFORT
   HIGH IMPACT   QUICK WINS (do now)        MAJOR PROJECTS (plan)
   LOW  IMPACT   FILL-INS (if spare time)   QUESTIONABLE (usually skip)

Use this instead of "do whatever the loudest stakeholder demanded".
Example: notification do-not-disturb = high impact / low effort = QUICK WIN.
```

### Listing 3 — Reference table: C-S-A process + cross-links (text)

```text
FEEDBACK ANALYSIS — exam-margin summary

CORE IDEA: feedback analysis = making DECISIONS, not collecting opinions.

PROCESS = "C-S-A"
  C  Collect      diverse sources + TRIANGULATE + representative sampling
                  sources: surveys, interviews, usage analytics, support tickets, beta, error logs
  S  Synthesise   thematic + frequency + sentiment analysis; prioritise on IMPACT vs EFFORT
  A  Act          categorise: immediate / short-term / long-term / no-action (justified);
                  follow through + COMMUNICATE BACK (close the loop)

DECIDE BY: weight of EVIDENCE, not the loudest/most senior voice.

CROSS-LINKS
  I-F-N (24-05)    "enable Feedback" set up channels; C-S-A processes what flows through
  Prototype (25-06) prototype's purpose = generate early feedback -> run C-S-A on it
  Negotiate (24-05) feedback wanting too much scope -> negotiate the Scope-Time-Cost triangle
  Evaluation (26-03) synthesised feedback = the "report to synthesise feedback" + Evidence of C-E-R
  PABT-B / S-H-L-M  representative sampling = a fairness/bias duty (don't build only for the vocal)

TRAPS: acting on the LOUDEST voice; feedback with NO follow-through (worse than not asking).
```
