---
title: "Supplementary Materials — Security Fundamentals (CIA Triad & AAA)"
module: SSA
lesson: "15.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the six
foundational properties — the C-I-A triad (Confidentiality, Integrity, Availability) and
triple-A (Authentication, Authorisation, Accountability), the two confused pairs, and the
authenticate-authorise-act-log pipeline. These listings show the properties as real code and
as NESA-style pseudocode.

### Listing 1 — Confidentiality vs Integrity in code (Python)

```python
import hashlib
import hmac
from cryptography.fernet import Fernet

# CONFIDENTIALITY — encrypt at rest so a stolen file is unreadable (two-way: encrypt/decrypt).
cipher = Fernet(Fernet.generate_key())          # key must be stored securely, NOT beside the data

def store_confidential(record: str) -> bytes:
    return cipher.encrypt(record.encode())       # only a holder of the key can read it back

def read_confidential(blob: bytes) -> str:
    return cipher.decrypt(blob).decode()         # access control decides WHO may call this

# INTEGRITY — a keyed hash (HMAC) detects tampering (one-way: you verify, you don't "decrypt").
SECRET = b"server-side-integrity-key"

def sign(record: str) -> str:
    return hmac.new(SECRET, record.encode(), hashlib.sha256).hexdigest()

def is_untampered(record: str, tag: str) -> bool:
    expected = sign(record)
    return hmac.compare_digest(expected, tag)    # constant-time compare avoids a timing leak

# Confidentiality protects READING; integrity protects CHANGING. They fail independently:
# an encrypted-but-corrupted blob is confidential yet has lost integrity.
```

### Listing 2 — The AAA pipeline: authenticate → authorise → act → log (Python)

```python
from datetime import datetime, timezone

ROLE_PERMISSIONS = {                              # AUTHORISATION via role-based access control
    "student": {"read_own_grade"},
    "teacher": {"read_own_grade", "read_all_grades", "write_grade"},
    "admin":   {"read_all_grades", "write_grade", "manage_users"},
}

audit_log = []                                    # ACCOUNTABILITY — the traceable record

def update_grade(session_token, student_id, subject, new_grade, client_ip):
    # 1. AUTHENTICATION — prove who you are (valid, unexpired session = identity established).
    user = authenticate(session_token)
    if user is None:
        return False, "authentication failed"

    # 2. AUTHORISATION — what are you allowed to do? (role permission + ownership/least privilege)
    if "write_grade" not in ROLE_PERMISSIONS.get(user.role, set()):
        log(user.name, "write_grade", student_id, granted=False, ip=client_ip)
        return False, "not authorised"

    # 3. ACT — perform the operation, capturing the before/after for the trail.
    old_grade = read_grade(student_id, subject)
    write_grade(student_id, subject, new_grade)

    # 4. LOG — accountability: who did what, when, from where, and the value change.
    log(user.name, "write_grade", student_id, granted=True, ip=client_ip,
        change=f"{old_grade}->{new_grade}")
    return True, "grade updated"

def log(actor, action, target, granted, ip, change=""):
    audit_log.append({
        "actor": actor, "action": action, "target": target,
        "granted": granted, "ip": ip, "change": change,
        "when": datetime.now(timezone.utc).isoformat(),
    })
```

### Listing 3 — NESA pseudocode: a role-based authorisation check

```text
BEGIN CheckAuthorisation(user, action)
    permissions ← LookupPermissions(user.role)
    IF action IN permissions THEN
        RETURN True
    ELSE
        RETURN False
    ENDIF
END CheckAuthorisation
```

### Listing 4 — NESA pseudocode: the full Authenticate → Authorise → Act → Log flow

```text
BEGIN SecureAction(sessionToken, action, target, newValue, clientIP)
    user ← Authenticate(sessionToken)
    IF user = NULL THEN
        DISPLAY "authentication failed"
        RETURN
    ENDIF

    IF CheckAuthorisation(user, action) = False THEN
        WriteAuditLog(user.name, action, target, "DENIED", clientIP)
        DISPLAY "not authorised"
        RETURN
    ENDIF

    oldValue ← ReadValue(target)
    WriteValue(target, newValue)
    WriteAuditLog(user.name, action, target, "GRANTED " & oldValue & "->" & newValue, clientIP)
    DISPLAY "action completed"
END SecureAction
```
