---
title: "Supplementary Materials — Evaluating the Software Solution"
module: SEE
lesson: "26.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches structured
evaluation via C-E-R (Criteria, Evidence, Reflection), the central comparing-actual-with-expected
technique, and how evaluation is the convergence point of requirements, QA, testing, and feedback.

### Listing 1 — An actual-vs-expected results table (text)

```text
ACTUAL vs EXPECTED OUTPUT — the core evidence technique (a discrepancy is a FINDING, not a hide)

Test (input)             Expected output                     Actual output                  Result
-----------------------  ----------------------------------  -----------------------------  -------
GPA calc (valid marks)   "3.75 GPA (A- average)"             "3.75 GPA (A- average)"        PASS
Boundary: grade = 101    rejected, "0-100 only"              rejected, "0-100 only"         PASS
Schedule conflict        "Conflict: Room 101 double-booked"  "No conflicts detected"        FAIL
Search response time     < 2.0 s                             3.1 s                          FAIL

DISCREPANCY ANALYSIS (for each FAIL): gap + severity + likely cause + recommendation
  Schedule conflict: missed conflict (HIGH) -> logic error in detection branch (path test gap)
  Search time:       +1.1 s over target (MED) -> un-indexed query -> add index (measure-opt-measure)
```

### Listing 2 — An evaluation rubric: criteria mapped to evidence (text)

```text
EVALUATION RUBRIC — "C-E-R" (Criteria / Evidence / Reflection)

CRITERIA (measurable; from requirements 23-01 + QA C-U-P-S 24-06)   EVIDENCE          JUDGEMENT
-----------------------------------------------------------------  ----------------  ----------
Correctness: booking saved + confirmed per spec                    test: actual=exp  MET
Usability:   complete booking in <= 3 steps                        test + feedback   MET (2 steps)
Performance: page load p95 < 2.0 s at 200 users                    load test         PARTIAL (2.3s)
Security:    auth + RBAC + parameterised queries + TLS             SAST/DAST review  MET

OVERALL: largely effective; performance criterion partially met (measurable margin).

REFLECTION (the third of C-E-R, often skipped):
  Maintainability  modular + documented (SE-12-09); error-handling test coverage = a gap
  Deployment       backups (3-2-1) + tagged release + rollback in place (25-04) -> ready
  Lessons learned  load-test the integration EARLIER next time (the Healthcare.gov lesson)
```

### Listing 3 — Evaluation logic in NESA pseudocode (criteria -> judgement)

```text
BEGIN EvaluateSolution(criteria, testResults, feedback)
    metCount <- 0
    FOR each c IN criteria
        evidence <- GatherEvidence(c, testResults, feedback)   // tests (actual vs expected) + feedback
        IF evidence meets c.target THEN
            c.status <- "MET"
            metCount <- metCount + 1
        ELSE
            c.status <- "NOT MET"
            RecordDiscrepancy(c, evidence)                     // gap + severity + likely cause
        ENDIF
    NEXT c
    judgement <- MakeJudgement(metCount, LENGTH(criteria))     // effective / partial / ineffective
    reflection <- Reflect(maintainability, deployment, lessons)
    RETURN Report(criteria, evidence, judgement, reflection)   // = C-E-R
END EvaluateSolution
```

### Listing 4 — Reference table: C-E-R + the module convergence (text)

```text
EVALUATION — exam-margin summary

CORE IDEA: evaluation = a JUSTIFIED JUDGEMENT against CRITERIA, with EVIDENCE + REFLECTION.
           NOT "it works". The NESA verb "evaluate" = weigh strengths/weaknesses + conclude.

"C-E-R"
  C  Criteria     measurable standards <- requirements (23-01) + QA C-U-P-S (24-06)
  E  Evidence     test plan + path/boundary results + ACTUAL vs EXPECTED (26-01)
                  + synthesised feedback (C-S-A, 26-02) -> objective + subjective, triangulated
  R  Reflection   maintainability (SE-12-09) + deployment readiness (25-04) + lessons learned

CENTRAL TECHNIQUE: compare ACTUAL output with EXPECTED output; analyse each discrepancy.

CONVERGENCE: requirements + QA + testing + feedback ALL flow into this one report.
CROSS-MODULE: C-E-R mirrors SSA 19-04 Measure-Audit-Improve (M-A-I) — same discipline, applied.
STORY: Healthcare.gov post-mortem = a real C-E-R (criteria=load+workflow; evidence=load tests +
       actual-vs-expected; reflection=frozen requirements + late integration + no load test).

TRAPS: "evaluation = it works"; no criteria/evidence; skipping the reflection.
```
