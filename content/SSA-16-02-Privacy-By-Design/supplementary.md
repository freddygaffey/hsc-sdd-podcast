---
title: "Supplementary Materials — Privacy by Design"
module: SSA
lesson: "16.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches privacy by
design and its three principles — **PER: Proactive, Embed, Respect** — plus data minimisation
("collect less, keep less"), purpose limitation, and retention. These listings show an
over-collecting design next to a minimised one, privacy-by-default, and NESA-style pseudocode
for purpose-limited collection and retention-based deletion.

### Listing 1 — Data minimisation: over-collecting vs minimised user model (Python)

```python
from dataclasses import dataclass

# ---- WRONG: over-collecting. Every extra field is attack surface + liability. ----
@dataclass
class OverCollectingUser:
    email: str
    password_hash: str
    full_name: str
    date_of_birth: str        # not needed by a to-do app
    home_address: str         # not needed
    phone_number: str         # not needed
    gender: str               # not needed

# ---- RIGHT: collect only what the PURPOSE requires. ----
@dataclass
class MinimisedUser:
    email: str                # needed: login + account recovery
    password_hash: str        # needed: authentication
    # Nothing you never collect can ever be breached, misused, or leaked.
```

### Listing 2 — Embed privacy: privacy-protective DEFAULTS (Python)

```python
@dataclass
class PrivacySettings:
    # "Embed privacy into design": the protective option is the DEFAULT.
    # A user who changes nothing is still protected (secure default, easy right path).
    profile_public: bool = False        # OFF by default
    share_activity: bool = False        # OFF by default
    analytics_tracking: bool = False    # OFF by default → requires opt-IN
    marketing_emails: bool = False      # OFF by default → genuine consent only
```

### Listing 3 — Purpose limitation: only use data for its collected purpose (Python)

```python
ALLOWED_PURPOSES = {
    "email":   {"login", "account_recovery"},   # collected for these — and ONLY these
    "address": {"shipping"},
}

def use_field(field: str, purpose: str) -> bool:
    # Reject "purpose creep": e.g. using the login email for marketing.
    allowed = ALLOWED_PURPOSES.get(field, set())
    return purpose in allowed

# use_field("email", "login")      -> True
# use_field("email", "marketing")  -> False  (not the purpose it was collected for)
```

### Listing 4 — Retention: delete data when its purpose is done (Python)

```python
from datetime import datetime, timedelta, timezone

RETENTION = {                              # "keep less": a schedule, not "forever"
    "session_data":   timedelta(hours=24),
    "analytics":      timedelta(days=90),
    "account_data":   timedelta(days=2555),  # 7 yrs — a genuine legal obligation
}

def is_due_for_deletion(category: str, collected_at: datetime) -> bool:
    age = datetime.now(timezone.utc) - collected_at
    return age > RETENTION.get(category, timedelta(0))   # past its window → delete
```

### Listing 5 — NESA pseudocode: purpose-limited data collection

```text
BEGIN CollectData(field, value, statedPurpose)
    IF field IN NecessaryFieldsFor(statedPurpose) THEN
        Store(field, value, statedPurpose)          // collect ONLY what the purpose needs
        SetRetentionClock(field, statedPurpose)     // schedule its deletion now
    ELSE
        DISPLAY "Field not required for this purpose — not collected"
    ENDIF
END CollectData
```

### Listing 6 — NESA pseudocode: retention-based deletion sweep

```text
BEGIN RetentionSweep(allRecords)
    FOR each record IN allRecords
        IF Now() >= record.collectedAt + RetentionPeriod(record.category) THEN
            Delete(record)                          // data that's gone can't be breached
            WriteAuditLog("deleted", record.id)     // accountability
        ENDIF
    NEXT record
END RetentionSweep
```
