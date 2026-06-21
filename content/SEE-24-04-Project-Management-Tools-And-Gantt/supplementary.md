---
title: "Supplementary Materials — Project Management Tools and Gantt Charts"
module: SEE
lesson: "24.4"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
Scope-Time-Cost triangle, the Gantt chart, the critical path, dependencies, tracking, and
collaboration tools. These listings are a task/dependency table that maps to a Gantt and a
critical-path worked example (the spoken episode's stimulus).

### Listing 1 — Task/dependency table that maps to a Gantt chart (text)

```text
PROJECT SCHEDULE — task/dependency table (each row = a bar on the Gantt)

Task  Description           Duration  Depends on    Notes
----  -------------------   --------  -----------   -----------------------------------
A     Requirements          2 weeks   —             starts at week 0
B     Design                3 weeks   A             starts when A finishes
C     Build                 4 weeks   B             starts when B finishes
D     Write user manual     2 weeks   A             only needs requirements; runs parallel
E     Testing               2 weeks   C and D       needs BOTH C and D finished

Dependency type = finish-to-start (B can't START until A FINISHES) — the default.
On a Gantt: bars over time, ARROWS for these dependencies, milestones as diamonds,
shaded bars for % progress. Tasks with no dependency between them (e.g. C and D) overlap.
```

### Listing 2 — Critical-path worked example (text)

```text
CRITICAL PATH = the LONGEST chain of dependent tasks -> sets the MINIMUM project duration.
Critical-path tasks have ZERO SLACK. (Schedule from Listing 1.)

Path 1:  A -> B -> C -> E   =  2 + 3 + 4 + 2  = 11 weeks
Path 2:  A -> D -> E        =  2 + 2 + 2      =  6 weeks

CRITICAL PATH = Path 1 (A-B-C-E), 11 weeks  =>  project duration = 11 weeks.

SLACK:
  Task D (user manual) is on the 6-week path -> it has 5 weeks of slack.
    If D slips 2 weeks  -> NO effect on finish (E waits on C anyway). Still 11 weeks.
  Task C (build) is ON the critical path -> ZERO slack.
    If C slips 2 weeks  -> whole project slips to 13 weeks.

THE STIMULUS RULE: same-size slip, opposite consequence — the difference is whether the
slipped task is ON the critical path. ALWAYS check that first.
```

### Listing 3 — The project triangle and choosing a collaboration tool (text)

```text
PROJECT MANAGEMENT TRIANGLE (Scope–Time–Cost; QUALITY in the middle):
  change one constraint and another must move. "Pick two."
  + scope, fixed time  -> cost rises OR quality drops.
  (= TECO's economic + schedule corners from 23-01; the thing you NEGOTIATE around in 24-05.)

COLLABORATION / PM TOOLS — select + JUSTIFY per project:
  Tool             Best fit
  ---------------  --------------------------------------------------
  MS Project       large, structured projects; advanced Gantt + resources
  Primavera P6     enterprise-scale, complex projects
  Jira             Agile software teams (backlog, sprints, issues)
  Trello           small team; Kanban board (cards on columns)
  Version control  EVERY software project — Git: fork/branch/pull request;
                   a pull request IS a code-review/collaboration tool
                   (PFW 12-06 + Year 11; deep dive SEE 25-04)
```
