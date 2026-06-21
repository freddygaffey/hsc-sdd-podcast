---
title: "Supplementary Materials — Module Review: Defining and Planning (Ch 23–24)"
module: SEE
lesson: "23–24"
script: script.md
---

# Supplementary Materials

Read-along reference for this review. Nothing here is spoken. The narration consolidates chapters
23–24 (no new content), re-fires every mnemonic, runs an integrated "plan this project" scenario,
and flags the cross-topic traps. These listings are the full mnemonic dump, a cross-topic trap
table, and the integrated walk-one-brief-through-the-block method.

### Listing 1 — The Ch 23–24 mnemonic dump (the exam margin) (text)

```text
DEFINING + PLANNING — every mnemonic from Ch 23–24, for the exam margin

FUN vs PERF          functional (what it does) vs non-functional/performance (how well)
TECO                 feasibility: Technical / Economic / Cost-and-schedule / Operational
B-M-S                ideation: Brainstorm / Mind-map / Storyboard
DiP-PP               implementation methods: Direct / Phased / Parallel / Pilot
Waterfall Falls once linear stage-gates, no cheap going back
Agile Goes around    iterative time-boxed sprints, continuous feedback
P-S-R-R              Agile ceremonies: Plan / Standup / Review (product) / Retro (process)
WAgile = gates+sprints  Waterfall stage-gates outside + Agile sprints inside; "plan big, build small"
Scope-Time-Cost      project triangle (quality in the middle; pick two)
I-F-N                communication: Involve+empower / enable Feedback / Negotiate
PABT                 ethical issues: Privacy / Accessibility / Bias / Transparency
3C  (+ C-U-P-S)      QA: Criteria / Continual checking / Compliance
                     (Criteria = Correctness / Usability / Performance / Security)

ALSO reuse: acceptance criteria (measurable/testable); "Direct cheap+risky, Parallel safe+costly";
shift-left; CIA-AAA; WCAG/POUR; S-H-L-M; V-D-Q; M-A-I; PER/Privacy Act.
MODULE MARKER: justify, manage, document (SE-12-01/06/09) — not "I wrote code".
```

### Listing 2 — Cross-topic trap table (text)

```text
WHERE MARKS LEAK ACROSS DEFINING + PLANNING

Trap                                         Get it right
-------------------------------------------  ------------------------------------------------
Vague/untestable requirement ("be fast")     measurable + acceptance criteria (p95 < 300ms)
Code before modelling                         model first — fixes are cheap on paper (shift-left)
Phased = Parallel = Pilot (mixed up)          phased = by FEATURE; pilot = by USER group;
                                              parallel = BOTH systems at once
Direct cut-over for a high-risk system        match method to risk (Knight Capital / Denver)
"Waterfall is always bad"                     right for stable + regulated; give the balance
"Agile = no planning / no documentation"      plans EVERY sprint; documents lightly
WAgile "combines the good parts" (no detail)  explain the WHEN and HOW (band-4 otherwise)
Slip question, ignore the critical path       on critical path = whole project slips; in slack = no effect
Communication / ethics treated as optional    projects fail MORE from poor communication
QA = testing                                  QA = process that PREVENTS; testing = activity that DETECTS
```

### Listing 3 — The integrated method: walk one brief through the block (text)

```text
INTEGRATED "PLAN THIS PROJECT" METHOD — take one brief, walk DEFINE then PLAN

DEFINE (Ch 23)
  1. Requirements   separate FUN vs PERF; make every requirement measurable (acceptance criteria)
  2. Feasibility    TECO — Technical / Economic / Cost-and-schedule / Operational; go/no-go
  3. Boundaries     in / out / future — stop scope creep
  4. Ideation+model B-M-S; data dictionary (right data types); algorithm design in pseudocode
  5. Implementation DiP-PP — match method to the risk profile + justify the trade-off

PLAN (Ch 24)
  6. Approach       Waterfall / Agile / WAgile — recommend + justify (WAgile: the when AND how)
  7. Management     Gantt (bars/dependencies/milestones); critical path; track plan-vs-actual;
                    Scope-Time-Cost; collaboration tools (Jira/Trello/version control)
  8. People         I-F-N communication; PABT ethics; V-D-Q collaboration
  9. Quality        QA = 3 Cs (Criteria=C-U-P-S, Continual checking, Compliance)

WORKED BRIEF (health appointment + records portal, regulated, 18-month fixed deadline,
patient interface needs feedback): WAgile (records core Waterfall-heavy, booking Agile-heavy
under shared gates); implementation = Parallel + Pilot (safety-critical, zero tolerance);
Gantt with gates as milestones; I-F-N + PABT (health-data privacy); QA 3 Cs incl. Privacy Act
+ WCAG. Breadth across the block = what an extended question rewards.

CASES (both failed in DEFINING/PLANNING, before code was the problem):
  Denver airport     — unbounded scope + infeasible (TECO) + direct cut-over (worst DiP-PP)
  Healthcare.gov     — waterfall + fixed deadline + frozen requirements + late/no load testing
```
