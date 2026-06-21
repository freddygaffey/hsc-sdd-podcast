---
title: "Supplementary Materials — Overcoming Development Difficulties"
module: SEE
lesson: "25.5"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches categorising
blockers (T-R-P), the three syllabus strategies as an escalation ladder (S-P-O), searching and
verifying online sources safely, and the judgement of when to persevere versus escalate.

### Listing 1 — Blocker types and the S-P-O escalation ladder (text)

```text
STEP 1 — NAME THE BLOCKER ("T-R-P")
  T  Technical   knowledge gaps, integration issues, performance bottlenecks, dependency conflicts
  R  Resource    missing access/permissions, unavailable tools, environment issues, budget limits
  P  Process     approval delays, unclear requirements, skill mismatches, timeline conflicts

STEP 2 — CLIMB THE LADDER ("S-P-O" = the 3 syllabus strategies)
  S  Self / Search    read OFFICIAL docs; search the EXACT error + tech + version; VERIFY sources
  P  Peers            pair programming (driver/navigator), code review, ask the expert  (= V-D-Q)
  O  Outsource/escal. up the chain (peer -> senior -> lead -> mgmt); vendors/consultants/experts

WHEN TO CLIMB: time-box each rung; climb FASTER if on the CRITICAL PATH (24-04) or stakes are high.
WHEN TO STAY:  problem is learnable in reasonable time AND not blocking others.
Decide triggers BEFORE the crisis (Knight Capital had no escalation path / kill switch under fire).
```

### Listing 2 — Searching + verifying online sources safely (text)

```text
SEARCH WELL                              VERIFY BEFORE YOU TRUST  (the security rule)
- copy the EXACT error message           - is it official docs / high-rep / RECENT?
- include technology + version            - READ every line of copied code
- try alternative phrasings               - validate against your requirements + TEST it
- filter for recent (old answers stale)   - never paste blindly

WHY: unverified online code can carry a vulnerability, malicious code, or a dependency with a
known CVE -> a SUPPLY-CHAIN risk (SSA Ch 19, the xz-backdoor lesson). Copy-paste != safe.
```

### Listing 3 — Reference table: difficulties strategy + cross-links (text)

```text
OVERCOMING DEVELOPMENT DIFFICULTIES — exam-margin summary

CORE IDEA: getting stuck is NORMAL; the marked skill is a SYSTEMATIC response.

THREE STRATEGIES (syllabus list) = the S-P-O ladder
  Self/Search  -> Peers  -> Outsource/escalate

OUTSOURCING DUTIES: verify credentials; cost-benefit vs internal time; plan integration;
                    ensure KNOWLEDGE TRANSFER (else you just relocate the problem).

CROSS-LINKS
  V-D-Q (SSA 19-01)   collaboration = various Views, Delegate by expertise, higher Quality
  Critical path (24-04) blocker on it -> escalate faster (delay slips the whole project)
  Version control (25-04) safety net: revert/branch/experiment freely when a change breaks things
  Documentation (25-03)  document the fix so it doesn't recur (manage + document marker)
  Negotiation (24-05)    last-resort fallback: simplify requirement / negotiate deadline (I-F-N)

TRAPS: lone-wolf debugging for hours; copy-pasting unverified online code.
```
