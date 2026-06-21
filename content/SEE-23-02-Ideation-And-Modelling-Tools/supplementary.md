---
title: "Supplementary Materials — Ideation and Modelling Tools"
module: SEE
lesson: "23.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches ideation
(B-M-S: Brainstorm, Mind-map, Storyboard), the data dictionary, algorithm design, and the build
toolkit (C-T-I-M). These listings show a data dictionary, the feature's algorithm in NESA
pseudocode and in real code, and a storyboard described in words (no diagrams, per the format).

### Listing 1 — Data dictionary for the reminder feature (text)

```text
DATA DICTIONARY — Assignment (reminder feature)

Field          Data type     Required  Constraints       Why this type
-------------  ------------  --------  ----------------  --------------------------------------
due_date       Date          Yes       >= created_date   Date type -> arithmetic (days until due)
title          String(200)   Yes       1–200 chars       Human-readable label
completed      Boolean       Yes       Default False      Two-state flag
reminder_sent  Boolean       Yes       Default False      Stops the SAME reminder firing twice

Model FIRST, then build. The data dictionary is a DESIGN tool used up front to remove ambiguity —
not paperwork written at the end.
```

### Listing 2 — Deadline-reminder algorithm in NESA pseudocode (text)

```text
BEGIN SendDeadlineReminders(assignments, today)
    FOR each assignment IN assignments
        days_until_due ← assignment.due_date - today
        IF days_until_due = 2 AND assignment.completed = False
           AND assignment.reminder_sent = False THEN
            SendReminder(assignment)
            assignment.reminder_sent ← True
        ENDIF
    NEXT assignment
END SendDeadlineReminders
```

### Listing 3 — The same reminder logic as real code (Python)

```python
from datetime import date

def send_deadline_reminders(assignments, today: date) -> None:
    """Fire a one-time reminder for each assignment due in exactly 2 days."""
    for a in assignments:
        days_until_due = (a.due_date - today).days
        if days_until_due == 2 and not a.completed and not a.reminder_sent:
            send_reminder(a)        # e.g. push/email — code generation handles the plumbing
            a.reminder_sent = True   # guard against duplicate sends (modelled in the data dict)
```

### Listing 4 — Storyboard for the reminder feature, in words (text)

```text
STORYBOARD — "Don't get ambushed by a deadline"  (described in words; no diagram)

Frame 1  MORNING, 8:00am
  Context: student wakes, glances at phone.
  Screen:  banner "History essay due in 2 days".
  Feeling: aware, slightly anxious — but prepared, not ambushed.

Frame 2  LUNCH, 12:30pm
  Context: between classes.
  Action:  taps "mark research done" -> progress bar advances.
  Feeling: accomplished, on track.

Frame 3  EVENING, 8:00pm
  Context: planning tomorrow.
  Screen:  "≈2 hours left to finish".
  Feeling: confident, organised.

Pain point caught EARLY (cheap to fix): if the reminder fired the night before, the student would
feel ambushed -> design rule: remind at 2 days, in the morning. Storyboarding = UX on paper.
```
