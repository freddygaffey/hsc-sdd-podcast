---
title: "Supplementary Materials — Module Review: Software Engineering Project (and the whole course)"
module: SEE
lesson: "23–26"
script: script.md
---

# Supplementary Materials

Read-along reference for the capstone review. Nothing here is spoken (no new content). The narration
consolidates the whole SEE module (Ch 23–26), ties together all four Year 12 modules, runs a full
integrated stimulus, and flags the cross-module traps. These listings are the full mnemonic dump,
the integrated "do everything to one brief" method, and the cross-module trap table. COURSE COMPLETE.

### Listing 1 — The SEE mnemonic dump (the exam margin) (text)

```text
SOFTWARE ENGINEERING PROJECT — every mnemonic, Ch 23-26, for the margin

DEFINE (Ch 23)
  FUN vs PERF      functional (what) vs non-functional/performance (how well) — measurable!
  TECO             feasibility: Technical / Economic / Cost-and-schedule / Operational
  B-M-S            ideation: Brainstorm / Mind-map / Storyboard
  DiP-PP           implementation: Direct / Phased / Parallel / Pilot (Direct cheap+risky; Parallel safe+costly)
PLAN (Ch 24)
  Waterfall Falls once ; Agile Goes around ; WAgile = Waterfall gates + Agile sprints (the WHEN+HOW)
  Scope-Time-Cost  project triangle (quality in middle); Gantt + critical path (slip = whole project)
  I-F-N            communication: Involve+empower / enable Feedback / Negotiate
  PABT             ethics: Privacy / Accessibility / Bias / Transparency
  3C (+ C-U-P-S)   QA: Criteria(Correctness/Usability/Performance/Security) / Continual / Compliance
                   "QA prevents; testing detects"
PRODUCE (Ch 25)
  REFF             incremental build: Risk down / Early feedback / Flexibility / Frequent value
  S-R-I            quality while building: Standards / Review / continuous Integration
  T-B-E-D          present to: Technical / Business / End users / Decision makers
                   arc = Problem -> Solution -> Demo -> Benefits -> Next steps
  T-E-I-S          back-end: Technology / Error handling / Interfacing / Security (the security boundary)
  R-C-B-M-T        version control: Repository / Commit / Branch / Merge / Tag
  3-2-1            backup: 3 copies / 2 media / 1 off-site ; SemVer "Major breaks, Minor adds, Patch fixes"
  S-P-O            get unstuck: Self/Search / Peers / Outsource-escalate
  S-W-M-P / POUR   prototype fidelity (Sketch/Wireframe/Mockup/Prototype) / accessibility (WCAG)
TEST + EVALUATE (Ch 26)
  O-S-A-E-S        test plan: Objectives / Scope / Approaches / Environments / Schedule
  path + boundary  "test every road through (path/white-box), test the edges (boundary/black-box)"
  C-S-A            feedback: Collect / Synthesise / Act (by EVIDENCE, not the loudest voice)
  C-E-R            evaluation: Criteria / Evidence (actual vs expected + feedback) / Reflection

MODULE MARKER: justify, manage, document (SE-12-01/02/05/06/08/09) — NOT "I wrote code".
```

### Listing 2 — The OTHER three modules' marquee hooks (for integration) (text)

```text
THE WHOLE COURSE — make it WORK, make it SECURE, make it SMART, RUN the project well

PFW (make it work on the internet)
  "Dogs Take Tasty Hambones" = DNS -> TCP -> TLS -> HTTP (the request journey)
  Ports: 80 plain / 443 safe / 22 shell / 21 file ;  Front-Back-Store (web architecture)
SSA (make it trustworthy)
  CIA-AAA = Confidentiality/Integrity/Availability/Authentication/Authorisation/Accountability (DUMP IT)
  "Hash is one-way, Encrypt is two-way" ;  V-S-E = Validate/Sanitise/Errors
  Static=Source (SAST) / Dynamic=Doing (DAST)
SA (make it smart — and responsible)
  "AI is the goal, ML is one way" ;  S-H-L-M bias sources (Sampling/Historical/Labeler/Measurement)
  S-P-E-E impact (Safety/People/Efficiency-Environment/Economy) ;  "the algorithm isn't neutral"

INTEGRATED ANSWER = SEE process spine + reach into PFW (web) + SSA (secure) + SA (responsible AI).
```

### Listing 3 — The integrated "do everything to one brief" method (text)

```text
INTEGRATED EXAM METHOD — take ONE brief, walk the WHOLE course

1. PROCESS (SEE)   requirements (FUN/PERF + acceptance criteria) + feasibility (TECO) + boundaries;
                   implementation method (DiP-PP, match to risk); approach (Waterfall/Agile/WAgile +
                   when/how); Gantt + critical path + Scope-Time-Cost; I-F-N + PABT; QA 3C.
2. WORK (PFW)      request journey (DNS->TCP->TLS->HTTP); Front-Back-Store; back-end T-E-I-S;
                   relational schema from the data dictionary.
3. SECURE (SSA)    CIA-AAA; hash+salt ("one-way"); V-S-E + parameterised queries (no SQLi);
                   TLS in transit; shift-left (security as a requirement); SAST + DAST.
4. SMART (SA)      AI feature = ML ("AI goal, ML one way"); bias check S-H-L-M + per-group fairness;
                   HUMAN IN THE LOOP (decision support, not decision maker); transparency (PABT);
                   impact S-P-E-E.
5. BUILD+TEST+EVAL build incrementally (REFF) + quality (S-R-I) + VCS (R-C-B-M-T) + backup (3-2-1) +
                   rollback; test plan (O-S-A-E-S) + path/boundary + LOAD test; feedback (C-S-A);
                   evaluate (C-E-R; mirrors SSA M-A-I).

WORKED BRIEF (education portal: grades + interview booking + AI at-risk flag; minors, regulated,
18-mo fixed deadline, parent interface needs feedback): WAgile; pilot+parallel; CIA-AAA + V-S-E;
ML flag with bias check + human review; build/test (load!) + evaluate with C-E-R.
Breadth across modules = what the integrated extended response rewards.
```

### Listing 4 — Cross-module trap table (text)

```text
WHERE MARKS LEAK ACROSS THE WHOLE COURSE

Trap                                          Get it right
--------------------------------------------  ------------------------------------------------------
"Evaluation = it works"                        evaluation = C-E-R (criteria + evidence + reflection)
Untestable requirement ("be fast")             measurable + acceptance criteria (p95 < 300ms)
Phased = pilot = parallel (mixed up)           phased=by FEATURE; pilot=by USER group; parallel=BOTH
Direct cut-over for a high-risk system         match method to risk (Knight Capital / Denver)
"Waterfall always bad" / "Agile no docs"       both false; WAgile needs the WHEN + HOW
QA = testing                                   QA PREVENTS (process); testing DETECTS (activity)
"Hash is encryption"                           hash = ONE-WAY; encrypt = TWO-WAY
Trust the front end for security               back end is the security boundary (front end bypassable)
"The algorithm is neutral"                     ML mirrors its data (S-H-L-M); accuracy can hide unfairness
Optimise without measuring / skip load test    measure-optimise-measure; Healthcare.gov had no load test
Answer a 4-module scenario from ONE module     reach across: "where do the other 3 modules touch this?"
```

### Listing 5 — The three SEE case studies, mapped (text)

```text
THE THREE FAILURES — same lesson, three costumes (all failed in the PROCESS, not in clever code)

Denver airport baggage   unbounded scope + infeasible (TECO) + DIRECT big-bang cut-over (worst DiP-PP)
                         -> failed in DEFINING + PLANNING (16 months late, 100s of millions over)
Healthcare.gov           Waterfall + fixed deadline + frozen flawed requirements + late integration
                         + NO load test -> failed in DEFINING/PLANNING/TESTING (launch collapse)
Knight Capital           bad deploy: dead code left on 1 server + reused flag + NO rollback
                         -> version-control + back-end + deployment-hygiene failure (~$440M in 45 min)

THROUGH-LINE: get requirements, feasibility, methodology, testing, and deployment right and the
project succeeds; get them wrong and great code can't save it. Marker: justify, manage, document.

COURSE COMPLETE.
```
