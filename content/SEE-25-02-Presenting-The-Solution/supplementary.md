---
title: "Supplementary Materials — Presenting the Solution"
module: SEE
lesson: "25.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches knowing your
audience (T-B-E-D), the presentation narrative arc (Problem, Solution, Demo, Benefits, Next steps),
the central role of a scenario-based demo, and honest handling of questions and limitations.

### Listing 1 — Tailoring one solution to four audiences (text)

```text
SAME SOLUTION, FOUR AUDIENCES — attendance-tracking system ("T-B-E-D")

T  Technical (devs, IT)        cares about: architecture, security, maintenance
   message: "Python + SQLite, integrates via CSV export, on-prem, quarterly backups, full docs."

B  Business (principal, mgr)   cares about: cost, efficiency, ROI
   message: "Cuts attendance processing 70%; ensures departmental reporting compliance."

E  End users (teachers)        cares about: ease of use, time saved
   message: "Three taps instead of five minutes per class."

D  Decision makers (board)     cares about: strategy, risk, compliance
   message: "Saves $15k/yr; accuracy 87% -> 99.5%; eliminates manual entry errors."

Trap: ONE technical deck for everyone. Match the message to the audience.
```

### Listing 2 — The presentation narrative arc (text)

```text
NARRATIVE ARC — Problem -> Solution -> Demo -> Benefits -> Next steps

1. PROBLEM   (2-3 min)  QUANTIFY it; make them feel the pain.
             weak: "Today I'll present my Python app."
             strong: "50 teachers x 5 min/day = 20+ hours/week wasted."
2. SOLUTION  (3-5 min)  one-sentence what-it-is + how it works + what's different. High level.
3. DEMO      (~half)    THE biggest beat — decisions are made here.
             SHOW USER SCENARIOS, not features. Realistic data. Have a BACKUP (video/device).
4. BENEFITS  (3-5 min)  tie back to the problem with the SAME numbers ("20 hrs -> 2 hrs").
5. NEXT STEPS(2-3 min)  timeline, cost, training -> a clear DECISION; no "so what now?"

DEMO RULE — scenarios beat features:
  weak:   "First the DB schema, then the auth code..."   (lose the room)
  strong: "Follow Sarah, a Yr10 teacher, Monday morning: opens app, taps 3 names, done."
```

### Listing 3 — Handling questions and objections (text)

```text
QUESTIONS = ENGAGEMENT, not attacks. Response patterns:

Technical Q   answer directly + briefly; offer docs later; don't derail into detail.
Cost Q        give total cost of ownership + compare to current; frame as investment + ROI.
Risk Q        acknowledge the risk; state the mitigation; give data if you have it.
Skeptical Q   ("will they use it?") show pilot/user-testing evidence OR propose a pilot.
DON'T KNOW    "Great question — I'll research it and get back to you by Friday."  NEVER fabricate.
LIMITATIONS   state them proactively ("no biometric login yet — planned") = maturity, not weakness.

Demo fails -> acknowledge briefly + switch to backup IMMEDIATELY (don't fight connectivity live).
```

### Listing 4 — Reference table: effective-presentation features (exam answer) (text)

```text
FEATURES OF AN EFFECTIVE PRESENTATION (the "describe the features" answer)

Feature                         Why it works
------------------------------  --------------------------------------------------------------
Audience-tailored (T-B-E-D)     each stakeholder hears what THEY care about
Narrative arc (P-S-D-B-N)       a story is understood + remembered; opens on the PROBLEM
Demo-centred, scenario-based    proves it WORKS in real workflows; ~half the time
Backup for demo failure         risk-aware recovery builds MORE trust than a flawless run
Clean slides (1 idea/slide)     reduces cognitive load (= Nielsen minimalist, 25-06)
Honest Q&A + stated limits      credibility > appearing to know everything

LINKS: I-F-N "Involve+empower the client" (24-05); forward to the evaluation report (26-03);
slide minimalism = usability heuristics (25-06). Outcome SE-12-09 (manage + document).
```
