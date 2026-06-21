---
title: "Supplementary Materials — The WAgile Hybrid Approach"
module: SEE
lesson: "24.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches WAgile —
"Waterfall gates plus Agile sprints; plan big, build small" — and the "when" and "how" of applying
each intervention. These listings show a WAgile timeline and the when/how decision table.

### Listing 1 — A WAgile timeline: gates outside, sprints inside (text)

```text
WAGILE — 18-month citizen-services portal (Waterfall stage-gates + Agile sprints within)

MACRO (Waterfall): 4 formal STAGE-GATES = review + sign-off, govern the flow between phases
  Gate 1  Month 3   Requirements & Compliance approval
  Gate 2  Month 6   Design & Security approval (threat modelling signs off here = shift-left)
  Gate 3  Month 12  Core Implementation approval
  Gate 4  Month 16  Production Readiness approval

MICRO (Agile): inside EACH stage, 2-week sprints do the actual work with feedback
  e.g. inside the Requirements stage (before Gate 1):
    Sprint 1  stakeholder workshops -> high-level user stories
    Sprint 2  detailed story breakdown + acceptance criteria + NFRs
    Sprint 3  incorporate feedback -> final requirements document (-> Gate 1)

PER-COMPONENT EMPHASIS under shared gates (the "HOW"):
  Student/patient records module  -> Waterfall-heavy (regulated, legacy integration, sign-off)
  Parent/citizen-facing portal     -> Agile-heavy   (UX-critical, requirements evolve, feedback)
  Reporting dashboard              -> Balanced      (some fixed compliance, some evolving usability)

SCALES: small = 2–3 lightweight gates (sprint reviews = mini-gates);
        enterprise = 4–6 formal gates + executive review + heavier documentation.
```

### Listing 2 — The "when": which intervention dominates (text)

```text
WAGILE — the "WHEN" (the dot-point's key word): which need dominates this part of the work?

Apply WATERFALL behaviour when GOVERNANCE dominates:
  - regulatory compliance requires formal documentation
  - budget approval needs predictable milestones
  - integration with legacy systems needs detailed upfront planning
  - stakeholders need formal progress reporting
  - scope-creep risk is high

Apply AGILE behaviour when ADAPTABILITY dominates:
  - requirements are likely to change
  - user feedback is essential to getting it right
  - technology choices may evolve
  - the team needs flexibility to respond to blockers
  - innovation / experimentation is valued

ADVANTAGE: best of both — governance + adaptability; controls scope creep while allowing change.
DISADVANTAGE / TRAP: more complex to manage; done badly = WORST of both (bureaucracy +
unpredictability); gate delays can block sprints; overkill for small/simple projects.
ANSWER SHAPE: mechanism (gates + sprints) + the WHEN and HOW — NOT just "it combines both".
```
