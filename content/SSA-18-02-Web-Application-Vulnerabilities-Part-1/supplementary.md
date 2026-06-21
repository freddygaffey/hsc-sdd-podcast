---
title: "Supplementary Materials — Web Application Vulnerabilities (Part 1)"
module: SSA
lesson: "18.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the cross-site
family — **"XSS injects a Script; CSRF rides a Session"** — and the open-redirect (invalid
forwarding/redirecting). These listings show each vulnerable route next to its fix, plus
NESA-style pseudocode for a safe redirect.

### Listing 1 — Reflected XSS: vulnerable /search vs escaped fix (Python)

```python
from flask import Flask, request
from markupsafe import escape

app = Flask(__name__)

# ---- VULNERABLE (the PFW /search route): input echoed into HTML → browser RUNS it. ----
@app.route("/search")
def search_vuln():
    q = request.args.get("q", "")
    return f"<p>You searched for {q}</p>"     # q="<script>steal()</script>" executes

# ---- FIXED: output-encode/escape on the way into the page → browser shows it as TEXT. ----
@app.route("/search-safe")
def search_safe():
    q = request.args.get("q", "")
    return f"<p>You searched for {escape(q)}</p>"   # "<" → "&lt;" — inert text
```

### Listing 2 — Content Security Policy: second layer against XSS (Python)

```python
@app.after_request
def add_csp(response):
    # Even if injected, inline script is blocked: only same-origin scripts may run.
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'"
    return response
```

### Listing 3 — CSRF: vulnerable transfer vs anti-CSRF token + SameSite (Python)

```python
import secrets
from flask import session, request, abort

# ---- VULNERABLE: any authenticated browser request is accepted → forged request rides session. ----
def transfer_vuln():
    move_money(session["user"], request.form["to"], request.form["amount"])  # no token check

# ---- FIXED: require an unpredictable token the attacker's page CANNOT read. ----
def issue_csrf_token():
    token = secrets.token_urlsafe(32)
    session["csrf"] = token            # placed in the legitimate form
    return token

def transfer_safe():
    submitted = request.form.get("csrf_token")
    if not submitted or not secrets.compare_digest(submitted, session.get("csrf", "")):
        abort(403)                     # forged request has no valid token → rejected
    move_money(session["user"], request.form["to"], request.form["amount"])

# Reinforce at the browser: SameSite stops the session cookie being sent cross-site.
def session_cookie(response, sid):
    response.set_cookie("session", sid, httponly=True, secure=True, samesite="Strict")
```

### Listing 4 — Open redirect: vulnerable vs allow-listed safe redirect (Python)

```python
from flask import redirect, request

ALLOWED_PATHS = {"/dashboard", "/profile", "/settings"}    # allow-list of internal targets

# ---- VULNERABLE: redirects to a raw user-supplied URL → phishing springboard. ----
def login_redirect_vuln():
    return redirect(request.args.get("next"))   # next=https://evil.example sends victim away

# ---- FIXED: only allow known internal destinations. ----
def login_redirect_safe():
    target = request.args.get("next", "/dashboard")
    if target not in ALLOWED_PATHS:             # reject anything off the allow-list
        target = "/dashboard"
    return redirect(target)                     # only relative, known-good paths
```

### Listing 5 — NESA pseudocode: validate a redirect destination

```text
BEGIN SafeRedirect(requestedTarget, allowList, defaultTarget)
    IF requestedTarget IN allowList THEN
        Redirect(requestedTarget)               // known internal destination only
    ELSE
        Redirect(defaultTarget)                 // never trust a raw user-supplied URL
    ENDIF
END SafeRedirect
```

### Listing 6 — NESA pseudocode: anti-CSRF token check on a state-changing request

```text
BEGIN HandleTransfer(request, session)
    submittedToken ← request.form["csrf_token"]
    IF submittedToken = NULL OR submittedToken ≠ session.csrfToken THEN
        Respond(403, "CSRF validation failed")  // forged request can't supply the token
        RETURN
    ENDIF
    MoveMoney(session.user, request.to, request.amount)
END HandleTransfer
```
