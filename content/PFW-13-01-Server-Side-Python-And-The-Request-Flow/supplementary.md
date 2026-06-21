---
title: "Supplementary Materials — Server-Side Python and the Back-End Request Flow"
module: PFW
lesson: "13.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
back-end lifecycle (R-H-D-R), web-server-vs-framework, CRUD mapping, and the untrusted-input
seam into Secure Software Architecture.

### Listing 1 — A Flask `/search` route, annotated with R-H-D-R

```python
from flask import Flask, request, render_template
import sqlite3

app = Flask(__name__)

@app.route("/search")                      # R — ROUTE: URL -> this handler
def search():
    query = request.args.get("q", "")      # H — HANDLE: read input from the request object
    # !! query is UNTRUSTED user input — validate/sanitise; never trust it (see Listing 4).

    conn = sqlite3.connect("shop.db")
    rows = conn.execute(                    # D — DATA: query the Store (parameterised = safe)
        "SELECT name, price FROM products WHERE name LIKE ?", (f"%{query}%",)
    ).fetchall()
    conn.close()

    return render_template("results.html", results=rows)   # R — RESPOND: render HTML back
```

### Listing 2 — The same flow in NESA pseudocode

```text
BEGIN HandleSearchRequest
    GET query FROM request           // HANDLE: read user input
    VALIDATE query                   // never trust input — validate server-side
    IF query is invalid THEN
        RETURN errorResponse
    ENDIF

    results ← QueryDatabase(query)   // DATA: parameterised query
    response ← RenderTemplate(results)   // RESPOND: build HTML
    RETURN response
END HandleSearchRequest
```

### Listing 3 — Shell scripts as part of the dev toolkit (make dirs / search text)

```bash
#!/usr/bin/env bash
# Scaffold a project structure (make files and directories)...
mkdir -p myapp/{static,templates,logs}
touch myapp/app.py myapp/requirements.txt

# ...and search text (find every TODO and every error in the logs).
grep -rn "TODO" myapp/                    # search source for TODOs
grep -c "ERROR" myapp/logs/app.log        # count error lines in the log

# This command-line/scripting tooling sits alongside the application code —
# the same discipline that scales into CI/CD pipelines (SEE + Software Automation).
```

### Listing 4 — Why "never trust the request" matters (preview of 13-02 + SSA)

```python
# UNSAFE: gluing user input straight into SQL -> SQL injection.
q = request.args.get("q", "")
rows = conn.execute("SELECT * FROM products WHERE name = '" + q + "'")   # NEVER do this
# If q = x' OR '1'='1  the WHERE clause is rewritten and returns every row.

# UNSAFE: dropping user input straight into HTML -> cross-site scripting (XSS).
return f"<p>You searched for {q}</p>"      # if q contains <script>…</script> it executes

# SAFE: parameterised query (full treatment in 13-02) + escape on output (SSA).
rows = conn.execute("SELECT * FROM products WHERE name = ?", (q,))
# Client-side checks DON'T protect you: an attacker can POST straight to the endpoint.
```
