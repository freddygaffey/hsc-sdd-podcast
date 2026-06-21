---
title: "Supplementary Materials — Algorithms, Documentation and Back-End Engineering"
module: SEE
lesson: "25.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration covers maintaining
living development artefacts, documenting algorithms (code + NESA pseudocode + header), citing
libraries/licences, and the back-end contributions hook T-E-I-S (Technology, Error handling,
Interfacing, Security engineering).

### Listing 1 — Development-artefact lifecycle (text)

```text
DEVELOPMENT ARTEFACTS — keep them LIVING (current with the code), not write-once

Types: requirements specs; design docs; data dictionary; API specs; code docs (docstrings,
       README); test plans; test cases; bug reports; release notes.

Lifecycle:  CREATE  -> initial docs during planning/design
            UPDATE  -> revise as requirements + implementation evolve (version it)
            REVIEW  -> periodic check for accuracy + completeness
            ARCHIVE -> preserve historical versions for reference

Principles: living documentation; version control; accessible; standardised; generate-from-code
            where possible (docstring -> API docs).  Stale docs are WORSE than none (they mislead).
MARKER: "document" is half the dot-point — SE-12-06 / SE-12-09 reward managing + documenting.
```

### Listing 2 — A documented algorithm in real code (Python)

```python
def weighted_average(scores: list[float], weights: list[float]) -> float:
    """Return the weighted average of scores.

    Args:
        scores:  marks, e.g. [85, 92, 88]
        weights: weight per score, same length as scores, summing to > 0
    Returns:
        weighted mean = sum(score*weight) / sum(weight)
    Raises:
        ValueError: if lists differ in length or weights sum to zero.
    """
    if len(scores) != len(weights):
        raise ValueError("scores and weights must be the same length")
    total_weight = sum(weights)
    if total_weight == 0:
        raise ValueError("weights must not sum to zero")
    return sum(s * w for s, w in zip(scores, weights)) / total_weight
```

### Listing 3 — The same algorithm in NESA pseudocode

```text
BEGIN WeightedAverage(scores, weights)
    IF LENGTH(scores) <> LENGTH(weights) THEN
        RAISE error "length mismatch"
    ENDIF
    totalWeight <- 0
    weightedSum <- 0
    FOR i = 0 TO LENGTH(scores) - 1
        weightedSum <- weightedSum + (scores[i] * weights[i])
        totalWeight <- totalWeight + weights[i]
    NEXT i
    IF totalWeight = 0 THEN
        RAISE error "weights sum to zero"
    ENDIF
    RETURN weightedSum / totalWeight
END WeightedAverage
```

### Listing 4 — A dependency / library citation record (text)

```text
DEPENDENCY RECORD — cite every external library (legal + supply-chain security)

  Name:     Flask          Version: 3.0.0       License: BSD-3-Clause
  Purpose:  back-end web framework (routing, request handling)
  Security: track CVEs; update on advisories; scan with pip-audit / safety
  Compat:   BSD compatible with MIT/Apache project license; copyleft GPL needs review

WHY: 1) legal compliance (license obligations; GPL inside closed source = problem)
     2) integrity/credit;  3) supply-chain security (a CVE in a dep is YOUR problem —
        cf. the xz backdoor, SSA Ch 19). You can't patch what you didn't document.
```

### Listing 5 — Fail-securely error handling (Python)

```python
import logging

def get_student_record(db, student_id):
    """Fetch a record; fail SECURELY on error (E in V-S-E)."""
    try:
        return db.fetch_one(
            "SELECT * FROM students WHERE id = ?", (student_id,)  # parameterised -> no SQLi
        )
    except DatabaseError as exc:
        logging.error("DB error fetching student %s: %s", student_id, exc)  # detail -> private log
        raise UserFacingError("Sorry, something went wrong. Please try again.")  # generic -> user
        # NEVER return the raw exception / stack trace to the user (it's attacker recon).
```

### Listing 6 — Reference table: T-E-I-S back-end contributions (exam answer) (text)

```text
BACK-END ENGINEERING CONTRIBUTIONS — "T-E-I-S" (the back end TEASEs the front end into working)

T  Technology       servers / DBs / frameworks, chosen + justified (SE-12-06)
                    relational vs NoSQL by data; = PFW 13-01 request flow, 13-02 schema
E  Error handling   graceful + FAIL SECURELY: detail -> internal log, generic -> user
                    = Year 11 exceptions + E of V-S-E (SSA); leaked stack trace = attacker recon
I  Interfacing      clean, documented API contract -> front + back work in PARALLEL (eases dev)
                    = PFW front/back collaboration
S  Security eng.    auth/authorisation (CIA-AAA), validation, parameterised queries, hashing
                    ("hash one-way, encrypt two-way"), TLS. The back end IS the security boundary
                    (a front end can be bypassed) = SSA Ch 15-16.

STORY: Knight Capital (2012) — dead back-end code + a reused flag + NO error handling/rollback
       = ~$440M lost in 45 min. Back end is NOT invisible plumbing.
TRAPS: undocumented clever code; back end as "plumbing"; leaking error detail to the user.
```
