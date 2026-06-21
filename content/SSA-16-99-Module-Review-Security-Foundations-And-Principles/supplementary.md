---
title: "Supplementary Materials — Module Review: Security Foundations and Principles"
module: SSA
lesson: "14–16"
script: script.md
---

# Supplementary Materials

Read-along reference for this review. Nothing here is spoken. It consolidates Chapters 14–16:
the mnemonic master list to dump in the exam margin, the five distinctions the marker tests, and
one integrated "find every flaw" listing tying the whole block together.

### Listing 1 — The exam-margin dump (text reference)

```text
WRITE THESE DOWN IN THE FIRST 30 SECONDS OF THE EXAM:

CIA-AAA  Confidentiality Integrity Availability | Authentication Authorisation Accountability
         (what we protect)                       | (how we protect it)
D-A      protect Data, prevent Attacks                       (benefits of secure software)
SDLC     Really Smart Developers Don't Ignore Testing In Maintenance
         Requirements Specifications Design Development Integration Testing Installation Maintenance
STRIDE   Spoofing Tampering Repudiation Info-disclosure Denial-of-service Elevation-of-privilege
HASH/ENC "Hash is one-way, Encrypt is two-way"   →  hash to verify, encrypt to recover
PW       hash it, salt it, slow it               →  salt stops the rainbow
KEYS     Symmetric = Same key (fast, sharing problem) | Asymmetric = A pair (slow, solves sharing)
SIGN     sign with PRIVATE, verify with PUBLIC   →  authenticity + integrity + non-repudiation
VSE      Validate, Sanitise, handle Errors       →  allow-list beats block-list; never trust input
PER      Proactive, Embed, Respect               →  data minimisation: collect less, keep less
RULES    "secure default, easy right path"  /  Risk = Likelihood x Impact  /  shift left
```

### Listing 2 — The five distinctions the marker tests (text reference)

```text
1. Authentication  vs Authorisation   WHO you are        vs WHAT you may do   (auth first)
2. Confidentiality vs Integrity       READING the data   vs CHANGING the data (fail independently)
3. Hashing         vs Encryption      one-way / verify   vs two-way / recover
4. Validation      vs Sanitisation    REJECTS bad input  vs CLEANS/escapes input
5. Privacy         vs Security        should we HOLD it?  vs is access PROTECTED?
```

### Listing 3 — Integrated "find every flaw" (the audited online store) (Python)

```python
# Each line below is a DELIBERATE violation reviewed in the episode. Fixes in the comments.
import hashlib

def store_password(pw):
    return hashlib.sha256(pw.encode()).hexdigest()   # FLAW: fast, unsalted → hash it, SALT it, SLOW it

def search(conn, term):
    q = f"SELECT * FROM products WHERE name LIKE '%{term}%'"  # FLAW: SQL injection → parameterise
    return conn.execute(q).fetchall()

CHECKOUT_URL = "http://store.example/checkout"        # FLAW: plain HTTP → use HTTPS (TLS)

def register(form):
    return {                                          # FLAW: over-collection + "forever" retention
        "email": form["email"],
        "dob": form["dob"],          # not needed → data minimisation: collect less
        "phone": form["phone"],      # not needed → keep less; set a retention policy
    }

def on_error(exc):
    return f"<pre>{exc}</pre>"        # FLAW: stack trace to user → log private, show generic
```

### Listing 4 — NESA pseudocode: a fully defended secure action (the block, in one flow)

```text
BEGIN SecureRequest(sessionToken, action, target, rawInput, clientIP)
    user ← Authenticate(sessionToken)               // AUTHENTICATION (who)
    IF user = NULL THEN
        DISPLAY "Login required"                     // generic message
        RETURN
    ENDIF
    IF CheckAuthorisation(user, action) = False THEN // AUTHORISATION (what) + least privilege
        WriteAuditLog(user, action, "DENIED", clientIP)  // ACCOUNTABILITY
        DISPLAY "Not allowed"
        RETURN
    ENDIF
    IF NOT MatchesAllowList(rawInput) THEN           // VALIDATION (reject)
        DISPLAY "Invalid input"
        RETURN
    ENDIF
    safeValue ← Sanitise(rawInput)                   // SANITISATION (clean/escape)
    result ← ParameterisedQuery(target, safeValue)   // no SQL injection (data ≠ command)
    WriteAuditLog(user, action, "OK", clientIP)
    DISPLAY Encode(result)                            // output-encode → no XSS
END SecureRequest
```
