---
title: "Supplementary Materials — The Waterfall Approach"
module: SEE
lesson: "24.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the Waterfall
approach — "Waterfall Falls once" — its linear phases, documents, advantages, disadvantages, and
fit. These listings are reference tables.

### Listing 1 — Waterfall phases, in order, with their key documents (text)

```text
WATERFALL — linear stage-gates ("the water falls once; going back up is expensive")

#  Phase                  Key activities                       Key document / artefact
-  ---------------------  -----------------------------------  ------------------------------------
1  Requirements analysis  Gather/validate all FUN + NFR        Requirements Specification Document
2  Design                 Architecture, DB, interface design   System Architecture Document; DB spec
3  Implementation         Code to the design; unit testing     Source code + documentation
4  Testing                Integration, system, UAT, perf, sec  Test plans, test results, defect logs
5  Deployment             Install in production, migrate, train Deployment guide; user manuals
6  Maintenance            Bug fixes, monitoring, enhancements  Change logs; support procedures

Each phase is COMPLETED and FORMALLY SIGNED OFF at a phase-gate review before the next begins.
(Same SDLC you know from Year 11 / SSA 14-02 "Really Smart Developers Don't Ignore Testing In
Maintenance" — here run STRICTLY linearly.)
```

### Listing 2 — Waterfall: advantages, disadvantages, and fit (text)

```text
WATERFALL — the balanced view (the marker wants BOTH sides)

ADVANTAGES                                  DISADVANTAGES
------------------------------------------  ------------------------------------------
Predictability + clear structure            Rigid to change (late change = expensive;
 (defined phases, milestones, roles)          model doesn't flow back up cheaply)
Comprehensive documentation + audit trail   Late feedback (client sees software only
 (vital for regulated projects)               near the END)
Quality via formal phase-gate reviews       Late integration + late testing (problems
 (catch issues before proceeding;             surface when they're most expensive)
  reduces scope creep)                       All-or-nothing delivery (no usable value
                                              until the end)

WELL-SUITED                                 POORLY-SUITED
------------------------------------------  ------------------------------------------
Stable, well-understood requirements        Uncertain / evolving requirements
Regulated / compliance (gov, medical)       Fast-moving market; needs early feedback
Mature, predictable technology              Innovative / experimental products
Risk-averse, predictability > speed         Startup apps; tight deadlines

CASE: Healthcare.gov (2013) — waterfall + FIXED deadline + frozen-flawed requirements +
late integration + NO load testing -> launch-day collapse. (Cashed in: SEE 26-01, 26-03.)
ANSWER SHAPE for "advantage/disadvantage": FEATURE + CONSEQUENCE (not "organised / slow").
```
