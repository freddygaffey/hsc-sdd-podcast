---
title: "Supplementary Materials — RPA and BPA Practical and Ethical Considerations"
module: SA
lesson: "20.5"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
RPA-vs-BPA decision ("automate the task with RPA, or rethink the process with BPA"), why RPA is
BRITTLE (it breaks when the user interface changes), and the security + ethical constraints.
These listings show a narrated pseudo-RPA bot, a BPA approval workflow in NESA pseudocode, and
why a stable API beats a screen-scraping bot.

### Listing 1 — A pseudo-RPA script: drive the UI like a human (Python, narrated)

```python
# RPA works through the USER INTERFACE — clicking, reading fields by label/position.
# This is exactly why it is BRITTLE: change the screen and these lookups fail.

def process_invoice_bot(email_app, accounting_app):
    email_app.open()
    invoice = email_app.read_field("inbox_table")        # screen-scrape (fragile)

    accounting_app.open()
    accounting_app.type_into("vendor_field",  invoice["vendor"])   # find field by NAME
    accounting_app.type_into("amount_field",  invoice["amount"])   # if renamed -> CRASH
    accounting_app.type_into("date_field",    invoice["due_date"])
    accounting_app.click_button("save_btn")              # find button by ID/position

    # No system change, no API: it MIMICS a human. Fast to build, brittle to maintain.
```

### Listing 2 — NESA pseudocode: a BPA approval workflow (process-level, with audit trail)

```text
BEGIN ProcessLoanApplication(application)
    valid ← ValidateAcrossSystems(application)          // deep integration, not screen-scraping
    IF valid = False THEN
        WriteAuditLog(application, "rejected: invalid")
        RETURN
    ENDIF

    approval ← RequestApproval(application.officer)      // human-in-the-loop (accountability)
    IF approval = "rejected" THEN
        WriteAuditLog(application, "rejected by officer")
        RETURN
    ENDIF

    CreateLoanRecord(application)                        // orchestrate end-to-end across systems
    NotifyApplicant(application)
    WriteAuditLog(application, "approved + created")     // audit trail through the whole process
END ProcessLoanApplication
```

### Listing 3 — Why an API beats a screen-scraping bot, and how to secure a bot (Python)

```python
import os

# STABLE: a real integration talks to the BACK end via an API (Front-Back-Store).
# An API contract changes far less often than a UI screen -> NOT brittle.
def post_invoice_via_api(client, invoice):
    return client.post("/invoices", json=invoice)        # stable interface, not a screen

# SECURE THE BOT (the security module applied to automation):
API_KEY = os.environ["ACCOUNTING_API_KEY"]   # never HARD-CODE keys (use a secrets manager)
# - least privilege: give the bot ONLY the permissions it needs (authorisation / RBAC)
# - validate every input it handles (VSE) — automated data is still untrusted
# - mind privacy of the data it moves (PER: collect less, keep less)
```

### Listing 4 — RPA risk reference: BRITTLE + the decision rule (text reference)

```text
DECISION:  automate the TASK (RPA)  |  rethink the PROCESS (BPA)
           quick, low-code, tactical |  integrated, redesigned, strategic

RPA = BRITTLE
  B  Breaks when the user interface changes
  R  no Real integration (sits on a moving surface, not an API)
  I  needs ongoing Inspection / maintenance
  T  Tied to specific screens (positions, labels)
  T  fails silently in hard-to-spot ways
  L  Lacks the resilience of a proper API / Back-end interface
  E  Erodes as the target applications evolve

EVALUATE shape: benefits  ->  costs/risks (brittleness, credentials, employment)  ->  judgement
```
