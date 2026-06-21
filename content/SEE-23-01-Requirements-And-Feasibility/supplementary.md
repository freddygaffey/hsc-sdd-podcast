---
title: "Supplementary Materials — Requirements and Feasibility"
module: SEE
lesson: "23.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches requirements
(FUN vs PERF, measurable with acceptance criteria), feasibility (TECO), the data dictionary, and
boundaries. These listings show a data dictionary, a requirements-spec excerpt, and the feasibility
dimensions as a reference table.

### Listing 1 — Data dictionary for an assignment-tracker (text)

```text
DATA DICTIONARY — Assignment entity

Field            Data type        Required  Constraints              Description
---------------  ---------------  --------  -----------------------  -------------------------------
assignment_id    Integer (PK)     Yes       Unique, > 0              Primary key
student_id       Integer (FK)     Yes       Refs Student.student_id  Owner of the assignment
title            String(200)      Yes       1–200 chars              Assignment name
subject          String(50)       Yes       Course/subject code      Subject this belongs to
due_date         Date             Yes       >= created_date          Submission deadline
priority         Integer          No        Range 1–5                Importance (1 low … 5 high)
completed        Boolean          Yes       Default False            Completion status
reminder_sent    Boolean          Yes       Default False            Prevents duplicate reminders
progress_notes   Text             No        —                        Free-text student notes

Type choices justified:
  due_date  -> Date     (enables date arithmetic, e.g. days-until-due; not String)
  priority  -> Integer  (bounded 1–5; enables sorting/filtering)
  a money field, if present -> Decimal(p,s), NEVER float (avoids currency rounding error)
```

### Listing 2 — Requirements specification excerpt (text)

```text
REQUIREMENTS SPECIFICATION — School grades portal (excerpt)

FUNCTIONAL REQUIREMENTS (what it does)
  FR-01  The system shall allow an authenticated teacher to record a grade for a
         student in their own class.
         Acceptance: a recorded grade is persisted and visible to the student within 24h;
                     each change is logged with teacher id + timestamp.
  FR-02  The system shall allow a student to view their own grades, but not modify them
         and not view other students' grades.
         Acceptance: a student requesting another student's record receives HTTP 403.
  FR-03  The system shall calculate a weighted average grade automatically.
         Acceptance: computed value matches the school's weighting formula for 20 test cases.

NON-FUNCTIONAL REQUIREMENTS (how well — "PERF" family)
  NFR-01 (Performance) p95 page-load < 300 ms with 200 concurrent users.
         Acceptance: verified by load test at 200 concurrent virtual users.
  NFR-02 (Security)    All passwords stored as salted, slow hashes; all traffic over TLS.
         Acceptance: verified by security review; no plaintext credential at rest or in transit.
  NFR-03 (Usability)   Interface meets WCAG 2.1 AA (POUR).
         Acceptance: passes automated + manual accessibility audit; 4.5:1 contrast minimum.

WEAK vs STRONG (the marking boundary)
  WEAK:   "The system should be fast and secure."           (untestable -> band 4)
  STRONG: "p95 < 300 ms at 200 users; passwords salted+hashed; all traffic over TLS."
                                                             (measurable -> band 6)
```

### Listing 3 — Feasibility dimensions: TECO (text)

```text
FEASIBILITY ASSESSMENT — TECO (go / no-go BEFORE committing)

T  Technical          Do we have the skills, tools, and technology? Is it achievable for THIS
                      team, now? (e.g. real-time ML fraud engine in 6 weeks by 2 part-timers = no)
E  Economic           Cost-benefit: dev cost + ongoing operational cost vs expected benefits.
                      Return on investment = (benefits - costs) / costs. Do benefits justify spend?
C  Cost-and-schedule  Can we deliver within budget and time? Resource availability, task
                      dependencies, + a RISK BUFFER (slack for the unexpected).
O  Operational        Once built, will it fit how people actually work, so they ADOPT it?
                      (a technically perfect system staff refuse to use has FAILED operationally)

DENVER AIRPORT (cautionary tale): unbounded scope + neither technically nor schedule-feasible,
but the honest go/no-go call was not made in time -> 16 months late, hundreds of millions over.
```
