---
title: "Supplementary Materials — The Agile Approach"
module: SEE
lesson: "24.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the Agile
approach — "Agile Goes around" — sprints, user stories, the P-S-R-R ceremonies, and method
tailoring. These listings show user stories with acceptance criteria and a Waterfall-vs-Agile
comparison table.

### Listing 1 — User stories with acceptance criteria (text)

```text
USER STORY FORMAT:  "As a [user type], I want [functionality], so that [benefit]."
Each story carries ACCEPTANCE CRITERIA = specific, testable conditions for "done".
Quality check = INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable).

STORY US-01  (Student login)
  As a high school student, I want to log into the school portal with my student ID,
  so that I can access my grades securely.
  Acceptance criteria:
    - valid ID + password redirects to the student dashboard
    - invalid credentials show a generic error ("invalid username or password")
    - failed logins are logged and limited to 3 per account per 15 minutes
  Estimate: 5 story points

STORY US-02  (Bulk grade entry)
  As a teacher, I want to enter grades for multiple students at once,
  so that I can efficiently update records after marking.
  Acceptance criteria:
    - all entered grades save together in one action
    - each change is logged with timestamp + teacher identity
    - a teacher can only enter grades for their own classes
  Estimate: 8 story points

STORY US-03  (Parent notification)
  As a parent, I want an email when my child's grades are updated,
  so that I can stay informed about their progress.
  Acceptance criteria:
    - email sent to the verified linked parent within 5 minutes of a saved grade
    - only verified parent accounts receive notifications
  Estimate: 3 story points
```

### Listing 2 — Waterfall vs Agile comparison (text)

```text
WATERFALL ("Falls once")          vs   AGILE ("Goes around")

Dimension        Waterfall                          Agile
---------------  ---------------------------------  ----------------------------------
Structure        Sequential phases                  Iterative time-boxed sprints (~2 wks)
Planning         All requirements up front          Incremental, per sprint
Requirements     Frozen after sign-off              User stories, evolve each sprint
Change           Resisted (expensive, no flow-back) Embraced every iteration
Feedback         Late (near the end)                Continuous (every sprint review)
Documentation    Heavy, comprehensive               Light, evolving, "just enough"
Delivery         All value at the end               Working increments throughout
Predictability   High (scope/time/cost)             Lower (scope/cost less certain)
Best fit         Stable, regulated, well-understood  Uncertain, fast-moving, user-facing

CEREMONIES (P-S-R-R):
  Plan    sprint planning — select + estimate stories (story points: 1,2,3,5,8,13)
  Standup daily 15-min — did / will / blockers (surface, don't solve)
  Review  demo to stakeholders + feedback        (the PRODUCT)
  Retro   improve the team's process             (the PROCESS)

TRAP: "Agile = no planning / no documentation" is FALSE. Agile plans EVERY sprint and
documents lightly + continuously. "Working software OVER comprehensive docs" ≠ "no docs".
```
