---
title: "Supplementary Materials — Security Testing Fundamentals"
module: SSA
lesson: "18.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the five
testing strategies — **Code Review, SAST, DAST, Vulnerability Assessment, Penetration testing** —
the rule **"Static = Source (not running); Dynamic = Doing (running)"**, and the survival lifecycle
**Harden / Breach-handle / Disaster-recover** within business continuity. These listings annotate
a SAST finding, a DAST probe, a review checklist, and the incident/DR plan.

### Listing 1 — A SAST-style finding: flaws in the SOURCE, app NOT running (Python)

```python
# SAST scans the source for dangerous PATTERNS — without ever executing the code.
import hashlib

def get_user(conn, name):
    q = "SELECT * FROM users WHERE name = '" + name + "'"   # SAST: HIGH — SQL injection
    return conn.execute(q)

API_KEY = "sk_live_9f8a7b6c5d4e3f21"                         # SAST: CRITICAL — hardcoded secret

def digest(pw):
    return hashlib.md5(pw.encode()).hexdigest()             # SAST: HIGH — weak crypto (MD5)

def run(expr):
    return eval(expr)                                       # SAST: CRITICAL — dangerous eval
# Strengths: early, exact line, all paths. Limits: can't see runtime; false positives.
```

### Listing 2 — A DAST-style probe: attacking the RUNNING app from outside (text)

```text
# DAST sends real malicious requests at the LIVE app and watches the response.

POST /login              payload: username = admin' OR '1'='1' --     → 200 + admin session?  (SQLi)
GET  /search?q=<script>alert(1)</script>                              → reflected unescaped?   (XSS)
GET  /download?file=../../../../etc/passwd                            → file contents returned? (traversal)
GET  /api/orders/1007    (as a user who owns order 1003)             → 200 OK?                 (broken access control)

# Strengths: real, exploitable, finds config/runtime flaws. Limits: needs running app; late; no line number.
```

### Listing 3 — A security-focused code-review checklist (text)

```text
HUMAN CODE REVIEW — catches LOGIC/INTENT that scanners miss:
[ ] Every input validated server-side (allow-list)?           (VSE)
[ ] All DB access parameterised (no string-built SQL)?
[ ] Output encoded before display (no XSS)?
[ ] AUTHORISATION checked per request, not just authentication? (broken access control)
[ ] Secrets in config/secrets manager, never hardcoded?
[ ] Errors fail securely (log private, show generic, default-deny)?
[ ] Strong, audited crypto (no MD5, no home-rolled)?
[ ] Business logic can't be abused (negative amounts, skipped steps, race windows)?
```

### Listing 4 — The five strategies & what each uniquely catches (text reference)

```text
METHOD                  RUNNING?  CATCHES UNIQUELY                         COST
Code Review (CR)         no       flawed logic / intent (xz backdoor)      slow, skill-dependent
SAST (Static)            no       insecure SOURCE patterns, by line, early false positives
DAST (Dynamic)           yes      exploitable runtime + config flaws       late, no line number
Vulnerability Assessment yes      KNOWN issues: unpatched libs (Equifax)   breadth, not depth
Penetration Test (PEN)   yes      real, CHAINED, demonstrated exploits     expensive, snapshot

Mnemonic: "Static = Source; Dynamic = Doing."   Order: cheap+broad → expensive+deep.
```

### Listing 5 — NESA pseudocode: the incident response + disaster recovery flow

```text
BEGIN SurviveIncident()
    // HARDEN (before anything happens) — shrink the attack surface
    PatchAll(); RemoveUnusedServices(); ApplyLeastPrivilege(); DisableVerboseErrors()

    // BREACH HANDLING (when an attack succeeds) — planned in advance
    IF BreachDetected() THEN
        Contain()                                  // stop the spread
        Eradicate()                                // remove the cause
        Recover()                                  // restore from clean state

        // DISASTER RECOVERY — restore the IT systems/data
        IF SystemsLost() THEN
            backup ← LoadLatestOffsiteBackup()     // tested, off-site, regular
            RestoreFrom(backup)                    // meet recovery objectives
        ENDIF

        ReviewAndImprove()                         // so it can't recur
    ENDIF
    // All of the above serves BUSINESS CONTINUITY: keep critical functions running throughout.
END SurviveIncident
```
