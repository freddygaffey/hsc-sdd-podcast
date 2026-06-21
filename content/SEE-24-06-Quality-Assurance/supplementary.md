---
title: "Supplementary Materials — Quality Assurance"
module: SEE
lesson: "24.6"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches quality
assurance as the three Cs (Criteria, Continual checking, Compliance), the QA-vs-testing
distinction, the quality criteria (C-U-P-S), and compliance/legislation. These listings are a QA
checklist and a compliance reference table.

### Listing 1 — QA checklist for a checkout feature: the 3 Cs (text)

```text
QA = the 3 Cs (Criteria + Continual checking + Compliance).
QA is the PROCESS that PREVENTS defects; TESTING is one ACTIVITY within it that DETECTS them.

C1 — CRITERIA (measurable, drawn from requirements; C-U-P-S):
  Correctness  order total = items + tax + shipping − discounts, exact (Decimal, not float)
               -> check: test cases vs known values
  Usability    checkout completes in ≤ 3 steps; error messages state what to fix
               -> check: usability testing
  Performance  checkout page p95 < 2 s at 200 concurrent users
               -> check: load testing
  Security     payment data over TLS, never stored plaintext; PCI handling; all txns logged
               -> check: security review / penetration test

C2 — CONTINUAL CHECKING (throughout the lifecycle, NOT a one-off end check = shift-left):
  [ ] requirements review (stakeholders)
  [ ] design review (senior dev + UX)
  [ ] code review + security specialist review (implementation)
  [ ] aligned testing: unit -> integration -> system -> acceptance
  [ ] acceptance-criteria tracking against the criteria above
  (= the M-A-I loop — Measure, Audit, Improve — from SSA 19-04, applied to quality)

C3 — COMPLIANCE (see Listing 2) — legally mandated, verified as part of C2.
```

### Listing 2 — Compliance and legislative requirements (text)

```text
COMPLIANCE — LEGALLY MANDATED quality criteria (NOT optional; can't trade against schedule)

Area            Law / standard (AU)                Requirement examples
--------------  ---------------------------------  ------------------------------------------
Privacy         Privacy Act 1988                   protect personal info; obtain consent;
                                                   allow data access/deletion; privacy-by-design
                                                   (= PER, SSA 16-02, as law)
Accessibility   Disability Discrimination Act      keyboard navigation; screen-reader support;
                1992 + WCAG                         ≥ 4.5:1 colour contrast; alt text
                                                   (= POUR, PFW 12-04, as law)
Healthcare      health-information privacy laws    audit trails for patient-record access;
                                                   backup/recovery procedures
Education       student-privacy protection         audit logs for administrative access;
                                                   age-appropriate content filtering

KEY POINT: a system that passes every functional test but breaches the Privacy Act or fails
WCAG is NOT high-quality. Compliance is a mandatory, designed-in criterion, verified continually.

DISTINCTION (most-asked Q): QA = the overall PROCESS framework that PREVENTS defects (criteria,
reviews, continual checking, compliance). TESTING = ONE activity within QA that DETECTS defects
in the built software. Testing is a tool QA uses; QA is bigger than testing.
```
