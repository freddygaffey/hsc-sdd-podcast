---
title: "Supplementary Materials — Web Application Vulnerabilities (Part 2)"
module: SSA
lesson: "18.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration completes **B-X-I-R**
with broken authentication/session management, **race conditions** (TOCTOU double-spend), file
attacks (path traversal) and side-channel attacks. These listings show the racy code next to the
atomic fix, plus NESA-style pseudocode for an atomic check-and-update.

### Listing 1 — Race condition: racy double-spend vs atomic update (Python)

```python
# ---- VULNERABLE: check-then-act with a GAP → two concurrent withdrawals both pass the check. ----
def withdraw_racy(db, account_id, amount):
    balance = db.execute("SELECT balance FROM accounts WHERE id=?", (account_id,)).fetchone()[0]
    if balance >= amount:                       # TIME-OF-CHECK
        # ...another request runs here, also passing the check...
        db.execute("UPDATE accounts SET balance = balance - ? WHERE id=?", (amount, account_id))
    # TIME-OF-USE: both deduct → account goes negative (double-spend)

# ---- FIXED: ONE atomic conditional update — the DB serialises concurrent requests. ----
def withdraw_atomic(db, account_id, amount):
    # Subtract ONLY IF sufficient funds, all in one indivisible statement.
    rows = db.execute(
        "UPDATE accounts SET balance = balance - ? WHERE id=? AND balance >= ?",
        (amount, account_id, amount),
    ).rowcount
    return rows == 1                            # 0 rows updated → insufficient funds, no overdraw
```

### Listing 2 — Broken auth/session fixes: regenerate on login, secure cookie, MFA gate (Python)

```python
import secrets

def on_login(response, user, otp_ok):
    if not otp_ok:                              # multi-factor: something you HAVE, not just KNOW
        raise PermissionError("second factor required")
    rotate_session_id()                         # REGENERATE on login → defeats session FIXATION
    sid = secrets.token_urlsafe(32)             # STRONG random ID → defeats guessing
    store_session(sid, user.id, ttl=1800)       # FIXED lifetime → limits a hijacked session
    response.set_cookie("session", sid,
        httponly=True,    # JS can't read it → XSS can't steal it (defeats one hijack path)
        secure=True,      # HTTPS only → no sniffing on the wire
        samesite="Strict")

def on_logout(sid):
    invalidate_session(sid)                     # actually destroy server-side, not just clear cookie
```

### Listing 3 — File attack: path-traversal-safe download (Python)

```python
import os

def download(requested_name, base_dir="/srv/wallet/statements"):
    safe = os.path.basename(requested_name)                 # strip "../" path parts
    full = os.path.realpath(os.path.join(base_dir, safe))   # canonicalise to real absolute path
    if not full.startswith(base_dir + os.sep):              # must stay INSIDE base_dir
        raise ValueError("invalid path")                    # "../" climbed out → reject
    return open(full, "rb").read()
```

### Listing 4 — Side-channel: constant-time token comparison (Python)

```python
import secrets

def token_valid(submitted: str, stored: str) -> bool:
    # Constant-time: same duration regardless of how many chars match → no timing leak.
    return secrets.compare_digest(submitted, stored)
```

### Listing 5 — NESA pseudocode: atomic check-and-update (prevents the race)

```text
BEGIN Withdraw(accountId, amount)
    BEGIN TRANSACTION                              // make check + act ATOMIC
        Lock(accountId)                            // serialise concurrent withdrawals
        balance ← GetBalance(accountId)
        IF balance >= amount THEN
            SetBalance(accountId, balance - amount)
            COMMIT
            RETURN True
        ELSE
            ROLLBACK
            RETURN False                           // never overdraw
        ENDIF
    END TRANSACTION
END Withdraw
```

### Listing 6 — B-X-I-R quick reference (text)

```text
B  Broken authentication & session mgmt   hijacking (steal live ID) / fixation (plant ID)
                                          fix: strong random IDs, HttpOnly/Secure/SameSite,
                                               timeout, REGENERATE ID on login, MFA
X  Cross-site (Part 1)                     XSS injects a Script / CSRF rides a Session
I  Invalid forwarding/redirect (Part 1)   open redirect → phishing; fix: allow-list destinations
R  Race conditions                        TOCTOU double-spend; fix: ATOMIC op / transaction+lock
+  File attacks                           path traversal ("../ climbs out"); fix: canonicalise+allow-list
+  Side-channel attacks                   timing leak; fix: constant-time comparison
```
