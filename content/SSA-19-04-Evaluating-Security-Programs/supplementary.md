---
title: "Supplementary Materials — Evaluating Security Programs"
module: SSA
lesson: "19.4"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
continuous evaluation loop — **M-A-I: Measure, Audit, Improve** — outcome-based security metrics
(K-P-Is) versus vanity metrics, and independent audits against a recognised standard. These
listings give a metrics/KPI table, the vanity-vs-useful contrast, and a pseudocode model of the loop.

### Listing 1 — Security metrics dashboard: actionable, OUTCOME-based KPIs (text reference)

```text
A good metric is ACTIONABLE · Relevant · Measurable · Timely · cost-effective. Measure OUTCOMES, not activity.

METRIC (KPI)                    WHAT IT TELLS YOU                          ACT WHEN IT...
Mean Time To Detect (MTTD)      avg time breach → noticed                 rises → improve monitoring/logging
Mean Time To Respond (MTTR)     avg time detect → contained/resolved      rises → rehearse incident response
Vuln remediation time           avg time known vuln stays unpatched       rises → fix patch process (Equifax!)
Patch coverage (%)              % of systems fully patched                falls → close the gap attackers use
Code-review coverage (%)        % of changes peer-reviewed                falls → enforce review (V-D-Q, 19-01)
Phishing-test failure rate (%)  % of staff who click test phish          rises → security training
```

### Listing 2 — Vanity metric vs useful metric (the big trap) (text)

```text
VANITY (activity — looks busy, says nothing)   USEFUL (outcome — are we SAFER?)
"5,000,000 attacks blocked this month"         MTTD dropped 30 days → 2 days
"200 scans run"                                vuln remediation time dropped 21 days → 3 days
"antivirus updated daily"                      patch coverage 78% → 96%

RULE: measure whether the organisation is genuinely more secure, NOT whether the team is busy.
```

### Listing 3 — NESA pseudocode: the continuous M-A-I evaluation loop

```text
BEGIN EvaluateSecurityProgram(program)
    REPEAT                                          // CONTINUOUS — threats never stop
        // MEASURE
        metrics ← Collect(MTTD, MTTR, RemediationTime, PatchCoverage)  // OUTCOMES, not activity
        trend ← CompareToPrevious(metrics)          // getting better or worse?

        // AUDIT (independent, against a standard)
        findings ← IndependentAudit(program, standard ← "ISO 27001" OR "NIST CSF")
        findings ← findings + Results(VulnerabilityAssessment, PenetrationTest)  // 18-01 = evidence

        // IMPROVE (close the gaps, feed back)
        FOR each gap IN findings DO
            RemediateGap(gap)                       // shorten flagged times, patch demonstrated weaknesses
        NEXT gap
        Update(program.controls, program.standards, program.training)  // lessons feed forward (PIP-PB)
    UNTIL never                                     // the loop is the point; a one-off audit is worthless
END EvaluateSecurityProgram
```
