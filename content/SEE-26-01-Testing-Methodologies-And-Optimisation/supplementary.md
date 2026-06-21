---
title: "Supplementary Materials — Testing Methodologies and Optimisation"
module: SEE
lesson: "26.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches test-plan
structure (O-S-A-E-S), test types (functional/integration/non-functional; black/white/grey box),
test-data selection via boundary and path testing, and a language-dependent optimisation
(memoisation) applied with measure-optimise-measure discipline.

### Listing 1 — A test-case template (text)

```text
TEST CASE TEMPLATE

  Test Case ID    TC_VALIDATE_001
  Title           Reject grade above 100
  Objective       Verify grade validation rejects out-of-range marks
  Prerequisites   grade-entry form accessible; test DB available
  Test data       grade = 101  (boundary: just above maximum)
  Steps           1) open grade entry  2) enter 101  3) submit
  Expected result rejected with "grade must be 0-100"; nothing written to DB
  Pass/fail       PASS if rejected with correct message AND no DB write

Each test case traces to a REQUIREMENT (23-01) + a QA criterion (24-06). QA = process that
PREVENTS; testing = the activity that DETECTS.
```

### Listing 2 — A function with boundary + path test data (Python)

```python
def validate_grade(grade) -> bool:
    """Accept an integer grade in [0, 100]; reject anything else."""
    if not isinstance(grade, int):     # path A: non-integer -> reject
        return False
    if grade < 0 or grade > 100:       # path B: out of range -> reject
        return False
    return True                        # path C: valid -> accept

# BOUNDARY test data (edges of 0..100) -- typically BLACK-BOX:
#   -1 -> False (just below min)   0 -> True (min)     1 -> True (just above min)
#   50 -> True (typical)          99 -> True          100 -> True (max)   101 -> False (above max)
#   "85" -> False (wrong type)   None -> False (empty)        <- type/special cases

# PATH test data (cover every branch) -- WHITE-BOX:
#   path A: validate_grade("85")  -> False   (non-integer branch)
#   path B: validate_grade(101)   -> False   (out-of-range branch)
#   path C: validate_grade(50)    -> True    (accept branch)
```

### Listing 3 — Before/after optimisation: memoisation (Python)

```python
import functools, time

# BEFORE — naive recursion recomputes sub-results: O(2^n), exponential.
def fib_slow(n):
    if n < 2:
        return n
    return fib_slow(n - 1) + fib_slow(n - 2)

# AFTER — language-dependent technique: one-line cache decorator => O(n), linear.
@functools.cache                       # Python's built-in memoisation
def fib_fast(n):
    if n < 2:
        return n
    return fib_fast(n - 1) + fib_fast(n - 2)

# RESPONSIBLE OPTIMISATION = measure -> optimise -> measure:
# t0 = time.perf_counter(); fib_slow(35); print(time.perf_counter() - t0)   # baseline (seconds)
# t0 = time.perf_counter(); fib_fast(35); print(time.perf_counter() - t0)   # confirm (milliseconds)
# State the BEFORE and AFTER numbers; never optimise without measuring (PFW 13-03).
```

### Listing 4 — A small test plan (text)

```text
TEST PLAN — "Assignment submission" feature (components = O-S-A-E-S)

OBJECTIVES   verify upload, confirmation, deadline rules + meets QA criteria (C-U-P-S)
SCOPE        in: upload/validate/store/notify;  out: grading workflow (tested separately)
APPROACHES   automated functional + integration; manual usability; performance (load) test
ENVIRONMENTS staging server; test DB; anonymised test data
SCHEDULE     unit (dev) -> integration -> system -> acceptance, across the final sprint

TEST TYPES (by purpose)            TEST DATA                           VISIBILITY
  Functional  = "what" it does      boundary: 0B, max-size, max+1 file  black box (spec-based)
  Integration = "together"          path: valid / invalid-type / oversize routes  white box
  Non-functnl = "how well"          LOAD test (peak users) <- Healthcare.gov skipped this!
```

### Listing 5 — The validation function in NESA pseudocode

```text
BEGIN ValidateGrade(grade)
    IF grade is NOT an integer THEN
        RETURN False
    ENDIF
    IF grade < 0 OR grade > 100 THEN
        RETURN False
    ENDIF
    RETURN True
END ValidateGrade
```

### Listing 6 — Reference table: testing + optimisation hooks (text)

```text
TESTING + OPTIMISATION — exam-margin summary

TEST PLAN ("O-S-A-E-S"):  Objectives / Scope / Approaches / Environments / Schedule
TEST TYPES (purpose):     Functional (what) / Integration (together) / Non-functional (how well)
TEST DATA:                "test every road through (PATH), and test the edges (BOUNDARY)" [Year 11]
                          boundary = edges: just-below / on / just-above each limit
                          path = every branch + loop at 0/1/many iterations
VISIBILITY:               Black sees nothing | White sees the code | Grey sees a bit
                          boundary = BLACK box ;  path = WHITE box
SECURITY (SSA 18-01):     SAST = source at rest (static/white) ; DAST = running app (dynamic/black)
TEST LEVELS [Year 11]:    unit -> integration -> system -> acceptance
OPTIMISATION (SE-12-08):  MEASURE -> optimise -> MEASURE; language-dependent (Python @cache,
                          list comprehension, set membership); memoisation: exp -> linear time

TRAPS: testing only the HAPPY PATH (Healthcare.gov had no real load test); optimising WITHOUT
       measuring (PFW 13-03). Forward: test plan + results = evidence in the evaluation (26-03).
```
