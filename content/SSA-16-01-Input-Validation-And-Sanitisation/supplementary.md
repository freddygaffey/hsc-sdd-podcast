---
title: "Supplementary Materials — Defensive Data Input Handling"
module: SSA
lesson: "16.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the three
defensive practices — **V-S-E: Validate, Sanitise, handle Errors** — plus parameterised queries
(stop SQL injection), output encoding (stop XSS), allow-list vs block-list, and safe errors.
These listings show the vulnerable code next to the hardened version, and NESA-style pseudocode
for validate-then-process.

### Listing 1 — SQL injection: vulnerable login vs parameterised fix (Python)

```python
import sqlite3

# ---- VULNERABLE: input concatenated into the query → input can BECOME SQL. ----
def login_vulnerable(conn, username, password):
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    #  username = "admin' OR '1'='1' --"  → comments out the password check, returns admin
    return conn.execute(query).fetchone()

# ---- HARDENED: parameterised query → value passed SEPARATELY, never executed as SQL. ----
def login_safe(conn, username, password_hash):
    return conn.execute(
        "SELECT id, username FROM users WHERE username = ? AND password_hash = ?",
        (username, password_hash),          # the ? values can NEVER alter the query structure
    ).fetchone()
```

### Listing 2 — Parameterised query with LIKE (the PFW /search route, fixed) (python)

```python
def search_users_safe(conn, term):
    # The fix for the unsanitised PFW search route: parameterise, and bound the result set.
    return conn.execute(
        "SELECT id, username FROM users WHERE username LIKE ? LIMIT 50",
        (f"%{term}%",),                     # `term` is data, not command — injection-proof
    ).fetchall()
```

### Listing 3 — Validation: allow-list beats block-list (Python)

```python
import re

# ---- WEAK: block-list. Evadable (comments, case, encoding) — you can't list every attack. ----
def is_safe_blocklist(text: str) -> bool:
    bad = ["drop table", "<script", "--", ";"]
    low = text.lower()
    return not any(b in low for b in bad)   # "uni/**/on sel/**/ect" and "ScRiPt" slip past

# ---- STRONG: allow-list. Define EXACTLY what's permitted; reject everything else. ----
USERNAME = re.compile(r"^[a-zA-Z0-9_]{3,50}$")    # letters, digits, underscore; 3–50 chars
POSTCODE = re.compile(r"^[0-9]{4}$")              # exactly four digits

def valid_username(text: str) -> bool:
    return bool(USERNAME.match(text))

def valid_postcode(text: str) -> bool:
    return bool(POSTCODE.match(text))             # any odd/malicious input fails automatically
```

### Listing 4 — Sanitisation: output encoding to stop XSS (Python)

```python
import html

# The fix for echoing user input into a page: ESCAPE on the way OUT.
def render_comment(user_comment: str) -> str:
    safe = html.escape(user_comment)              # "<" → "&lt;" so the browser shows, not runs
    return f"<p>{safe}</p>"

# render_comment("<script>steal()</script>")
#   → "<p>&lt;script&gt;steal()&lt;/script&gt;</p>"  (displayed as text, not executed)
```

### Listing 5 — Error handling: log private, show generic, fail securely (Python)

```python
import logging

logger = logging.getLogger("security")

def get_record(db, record_id, client_ip):
    try:
        return db.fetch(record_id), "ok"
    except Exception as exc:
        # ACCOUNTABILITY: full detail logged internally for developers/monitoring...
        logger.error("fetch failed id=%s ip=%s err=%s", record_id, client_ip, exc)
        # ...but the USER only ever sees a generic message — no stack trace, no DB structure.
        return None, "A temporary error occurred. Please try again later."
```

### Listing 6 — NESA pseudocode: validate-then-sanitise-then-process

```text
BEGIN HandleInput(rawInput, fieldRules)
    IF NOT MatchesAllowList(rawInput, fieldRules) THEN
        WriteAuditLog("rejected", rawInput)        // log privately
        DISPLAY "Input is invalid."                // generic message only
        RETURN
    ENDIF

    safeValue ← Sanitise(rawInput)                 // escape/clean what we keep
    result ← ParameterisedQuery(safeValue)         // data passed separately from command
    DISPLAY Encode(result)                          // output-encode before display
END HandleInput
```
