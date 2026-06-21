---
title: "Supplementary Materials — Implementation Methods"
module: SEE
lesson: "23.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the four
implementation (changeover) methods — DiP-PP: Direct, Phased, Parallel, Pilot — with their risk
profiles and how to justify one for a context. These listings are reference tables.

### Listing 1 — The four implementation methods compared (text)

```text
DiP-PP — IMPLEMENTATION / CHANGEOVER METHODS

Method    What it is                         Risk    Cost    Key advantage         Key disadvantage
--------  ---------------------------------  ------  ------  --------------------  -----------------------
Direct    "Big bang" — switch off old +      HIGH    LOW     Fast + cheap;         No fallback if it
          on new in ONE changeover, all              (no     no duplicate systems  fails; total disruption
          users at once.                             dup)
Phased    Roll out the new system in STAGES  MED     MED     Manageable; learn     Longer timeline;
          BY FUNCTIONALITY (a feature at a            (per    between phases        coordinate old+new mix
          time) to everyone.                          phase)
Parallel  Run OLD and NEW SIMULTANEOUSLY     LOW     HIGH    Safety net + verify   Expensive (two full
          for a period, then decommission            (two    outputs vs known-good systems running/staffed)
          the old.                                    systems)
Pilot     Deploy the WHOLE system to a       LOW     MED     Issues contained;     Delays full rollout;
          small representative USER GROUP             (small  real-world feedback   brief two-tier UX
          first.                                      group)  before full commit

RISK ORDER (riskiest -> safest): Direct > Phased > Parallel > Pilot
EXAM PAIRING: "Direct is cheap and risky; Parallel is safe and costly."
DISTINCTIONS:  Phased = split by FEATURE (part of system to everyone)
               Pilot  = split by USER (whole system to part of users)
               Parallel = BOTH systems run at once
```

### Listing 2 — Matching method to scenario: risk-driven justification (text)

```text
RECOMMEND-AND-JUSTIFY — match risk profile to stakes, then weigh the trade-off

Scenario                         Recommend           Why (the justification shape)
-------------------------------  ------------------  ----------------------------------------------
Hospital patient records         Parallel (+ Pilot)  Safety-critical, 24/7, zero tolerance: need a
                                                     guaranteed fallback + verify outputs; cost of
                                                     two systems justified by catastrophic failure.
National bank core transactions  Parallel (+ Pilot)  Regulated, integrity-critical: fallback +
                                                     output verification; pilot limits blast radius.
Small startup consumer app       Direct              Low stakes, tight budget, speed-to-market;
                                                     brief failure tolerable; can't afford two systems.
Large org rolling new HR suite   Phased              Complex; roll out module by module, learn each
                                                     phase; no need to run two full systems.

CAUTIONARY TALES (direct cut-over of high-risk systems):
  Knight Capital 2012 — direct big-bang deploy, leftover code reactivated, NO rollback
                        -> ~$440M lost in 45 minutes (cashed in fully at SEE 25-04).
  Denver airport       — direct cut-over of a huge, never-fully-tested automated baggage system
                        -> opened 16 months late, hundreds of millions over.
```
