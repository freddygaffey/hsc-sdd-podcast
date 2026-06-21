---
title: "Supplementary Materials — Secure API Design"
module: SSA
lesson: "17.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches securing an
API with **A-A-R-T: Authenticate, Authorise, Rate-limit, Transport-secure**, plus **S-A-F-E**
sessions and the CORS/same-origin distinction. These listings show a token-auth + authorisation +
rate-limited route, secure cookie attributes, and NESA-style pseudocode for the auth+authorise gate.

### Listing 1 — A secured Flask route: authenticate, authorise, rate-limit, validate (Python)

```python
from flask import Flask, request, jsonify
import time, jwt

app = Flask(__name__)
SECRET = "server-side-signing-key"           # used to VERIFY the JWT signature
_buckets = {}                                 # caller -> [timestamps] for rate limiting

def authenticate(req):                        # 1. AUTHENTICATE — who is calling?
    token = req.headers.get("Authorization", "").removeprefix("Bearer ")
    try:
        return jwt.decode(token, SECRET, algorithms=["HS256"])  # signed → trust contents
    except jwt.InvalidTokenError:
        return None

def within_rate_limit(caller, limit=100, window=60):  # 3. RATE-LIMIT — protect availability
    now = time.time()
    hits = [t for t in _buckets.get(caller, []) if now - t < window]
    hits.append(now); _buckets[caller] = hits
    return len(hits) <= limit

@app.route("/api/orders/<int:order_id>")
def get_order(order_id):
    user = authenticate(request)
    if user is None:
        return jsonify(error="authentication required"), 401     # fail securely, generic
    if not within_rate_limit(user["sub"]):
        return jsonify(error="too many requests"), 429
    order = db_lookup(order_id)
    # 2. AUTHORISE — authenticated is NOT authorised. Check ownership/role on THIS resource.
    if order is None or order["owner_id"] != user["sub"]:
        return jsonify(error="not found"), 404   # don't reveal it exists to non-owners
    return jsonify(order)
# 4. TRANSPORT-SECURE: this app is only ever served behind HTTPS/TLS.
```

### Listing 2 — Secure session cookie attributes: S-A-F-E sessions (Python)

```python
import secrets

def new_session_cookie(response, user_id):
    session_id = secrets.token_urlsafe(32)    # STRONG: cryptographically random, unguessable
    store_session(session_id, user_id, ttl_seconds=1800)  # FIXED lifetime → times out
    response.set_cookie(
        "session", session_id,
        httponly=True,    # ATTRIBUTE: JS can't read it → XSS can't steal the session
        secure=True,      # ATTRIBUTE: only sent over HTTPS
        samesite="Strict",# ATTRIBUTE: not sent on cross-site requests → anti-CSRF
        max_age=1800,
    )

def on_login(response, user_id):
    rotate_session_id()                       # ESCALATION: regenerate on login → no fixation
    new_session_cookie(response, user_id)
```

### Listing 3 — CORS: allow-list specific origins, never wildcard with credentials (Python)

```python
ALLOWED_ORIGINS = {"https://app.example.com"}     # allow-list — NOT "*"

@app.after_request
def apply_cors(response):
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:                 # CORS only relaxes the browser same-origin rule
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response
# NOTE: CORS is NOT access control. Non-browser clients ignore it entirely.
# Access control = authentication + authorisation (Listing 1), enforced server-side.
```

### Listing 4 — NESA pseudocode: the authenticate-then-authorise gate

```text
BEGIN HandleApiRequest(request)
    user ← Authenticate(request.token)              // verify identity (WHO)
    IF user = NULL THEN
        Respond(401, "authentication required")     // generic, fail securely
        RETURN
    ENDIF

    IF WithinRateLimit(user) = False THEN           // protect availability
        Respond(429, "too many requests")
        RETURN
    ENDIF

    IF Authorised(user, request.action, request.resource) = False THEN  // verify permission (WHAT)
        WriteAuditLog(user, request.action, "DENIED")
        Respond(404, "not found")                   // don't confirm the resource exists
        RETURN
    ENDIF

    IF NOT ValidInput(request.params) THEN          // VSE at the boundary
        Respond(400, "invalid input")
        RETURN
    ENDIF

    result ← PerformAction(request)
    Respond(200, result)
END HandleApiRequest
```
