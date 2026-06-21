---
title: "Supplementary Materials — Building the Solution"
module: SEE
lesson: "25.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches incremental
implementation (the REFF benefits), maintaining quality during the build (the S-R-I pillars:
Standards, Review, continuous Integration), and ties construction back to the models, requirements,
and security defined earlier in the course.

### Listing 1 — An increment plan with acceptance criteria (text)

```text
INCREMENT PLAN — library management system (build incrementally, NOT big-bang)

Increment 1 (2 weeks) — the spine: highest value, fewest dependencies
  Features:    user login; view book catalogue; basic search
  Acceptance:  users can register + log in; catalogue lists books; search returns matches

Increment 2 (3 weeks) — depends on Increment 1
  Features:    check out + return a book; due-date tracking; borrowing history
  Acceptance:  loans recorded; due dates correct; a user can view their history

Increment 3 (2 weeks) — depends on Increment 2
  Features:    overdue notifications; reservations; advanced search filters
  Acceptance:  overdue items flagged + notified; reservable when on loan; filters work

PLANNING RULES:  1) prioritise by VALUE   2) respect DEPENDENCIES
                 3) maintain INTEGRATION  4) keep increments SMALL (1-4 weeks)
Each increment is "done" only when its ACCEPTANCE CRITERIA pass (from requirements, 23-01).
```

### Listing 2 — A code-review checklist (continual checking + security gate) (text)

```text
CODE REVIEW CHECKLIST — run BEFORE integrating any increment (R in S-R-I)

[ ] Follows coding standards (naming, formatting, function length)   <- maintainability
[ ] One task per subroutine; mainline clean                          <- Year 11 OOP quality
[ ] Adequately documented (docstring/comments current)               <- SE-12-09 marker
[ ] Tests included and passing (unit + the acceptance criterion)     <- QA continual checking
[ ] Inputs validated + sanitised; DB access parameterised            <- SSA V-S-E / SQLi defence
[ ] Secrets not hard-coded; least privilege respected                <- SSA secure coding
[ ] No obvious security vulnerabilities                              <- shift-left

QA link: code review = the CONTINUAL CHECKING of the 3 Cs (24-06), applied at the keyboard.
```

### Listing 3 — A well-structured feature module (Python)

```python
# record_grade: one task per subroutine, validated, parameterised, documented.
# Builds the "teacher records a grade" requirement (23-01) as a small increment.

MIN_GRADE, MAX_GRADE = 0, 100  # boundary values -> drive the test data (Year 11 / 26-01)

def record_grade(db, teacher_id: int, student_id: int, subject: str, grade: int) -> bool:
    """Record one grade for a student. Returns True on success.

    Validates the grade is within [0, 100] and that the teacher is authorised
    for the student's class, then writes via a parameterised query (SQLi-safe).
    """
    if not (MIN_GRADE <= grade <= MAX_GRADE):
        raise ValueError(f"grade {grade} out of range {MIN_GRADE}-{MAX_GRADE}")
    if not teacher_authorised(db, teacher_id, student_id):   # authorisation = CIA-AAA
        raise PermissionError("teacher not authorised for this student")
    db.execute(
        "INSERT INTO grades (student_id, subject, grade) VALUES (?, ?, ?)",
        (student_id, subject, grade),                        # parameterised -> no SQL injection
    )
    return True
```

### Listing 4 — The same logic in NESA pseudocode

```text
BEGIN RecordGrade(db, teacherId, studentId, subject, grade)
    IF grade < 0 OR grade > 100 THEN
        RAISE error "grade out of range"
    ENDIF
    IF NOT TeacherAuthorised(db, teacherId, studentId) THEN
        RAISE error "not authorised"
    ENDIF
    EXECUTE parameterised INSERT of (studentId, subject, grade) INTO grades
    RETURN True
END RecordGrade
```

### Listing 5 — Reference table: incremental build, the REFF and S-R-I hooks (text)

```text
BUILDING THE SOLUTION — exam-margin summary

INCREMENTAL vs BIG-BANG
  Incremental = small, working, integrated, tested pieces; each adds to a running system.
  Big-bang    = build everything, integrate at the end (= the direct-cut-over trap; Healthcare.gov).

WHY INCREMENTAL — "REFF" (the referee keeps checking the play)
  R  Risk reduction    defects found EARLY = cheap to fix
  E  Early feedback    stakeholders test working features sooner (= I-F-N "enable feedback")
  F  Flexibility       refine requirements from what each increment teaches
  F  Frequent value    every increment = working software = real progress

QUALITY WHILE BUILDING — "S-R-I" (keep an eye on the build)
  S  Standards         consistent style + current docs (maintainability = SE-12-09)
  R  Review            peer check before integration (= QA continual checking + security caught early)
  I  Integration       continuous integration: auto build + test on every commit (= SA automation)

REUSES: PFW 13-01 back-end request flow; PFW 13-02 relational schema (from the data dictionary);
SSA 16-01 secure coding ("hash one-way, encrypt two-way"); Year 11 OOP code quality.
MARKER: justify the approach, manage the increments, document the code (NOT "it works").
```
