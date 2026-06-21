---
title: "Supplementary Materials — The Optus Breach"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the case study. Nothing here is spoken in the audio. The
code listings are deliberately minimal and illustrative — they show the *shape* of
the vulnerability, not Optus's real code.

### Listing 1 — Timeline of the Optus breach
```text
~mid-2022    An API endpoint that returns customer details is reachable from the
             public internet. It requires no authentication, and customer records
             are addressed by a sequential, predictable identifier. Reportedly
             exposed for up to ~3 months.

2022-09-22   Optus publicly discloses a cyberattack. ~9.8 million customer records
             are affected — names, dates of birth, addresses, emails, phone numbers,
             and for ~2.1M people at least one ID document: ~150k passport numbers,
             tens of thousands of Medicare numbers, millions of licence numbers.

2022-09      An attacker posts a sample of the stolen data on a forum and demands a
             cryptocurrency ransom, threatening to release the rest. Amid intense
             attention and law-enforcement scrutiny, the poster withdraws the threat,
             deletes the posts, and apologises — but a real sample was already leaked.

2022 onward  Federal investigation; major public reckoning; Australian privacy law
             and breach-penalty regime sharpened in response.
```

### Listing 2 — The unauthenticated, incrementing-ID request (illustrative)
```text
# The attacker just changes one number and asks again. No login, no token, no check.

GET https://api.example-telco.com/customers/1000001
GET https://api.example-telco.com/customers/1000002
GET https://api.example-telco.com/customers/1000003
   ...
# Each request returns a different real customer's full record.
# This is an Insecure Direct Object Reference (IDOR): a raw identifier is used to
# reach a record with no check that the requester is allowed to have THAT record.
```

### Listing 3 — The endpoint that caused it vs. a secured one (illustrative Python/Flask)
```python
# VULNERABLE: no authentication, no authorisation, identifier trusted blindly.
@app.route("/customers/<int:customer_id>")
def get_customer(customer_id):
    return db.fetch_customer(customer_id)        # hands out ANY record to ANYONE

# SECURED: prove who is asking, then check they are allowed THIS record.
@app.route("/customers/<int:customer_id>")
@require_authenticated_user                       # authentication: who are you?
def get_customer_secured(customer_id):
    if customer_id != current_user.id:            # authorisation: are you allowed?
        abort(403)                                # refuse other people's records
    return db.fetch_customer(customer_id)
```

### Listing 4 — The access-control check every endpoint needs, in NESA pseudocode
```text
BEGIN HandleRecordRequest
    requester ← identity proven by the request's credentials
    IF requester IS NOT authenticated THEN
        RETURN error "401 Unauthorised"        // no proof of who is asking
    ENDIF

    record_id ← identifier supplied in the request
    IF record_id IS NOT owned by requester
       AND requester IS NOT an administrator THEN
        RETURN error "403 Forbidden"           // proven identity, but not allowed
    ELSE
        RETURN fetch record WITH record_id     // only now hand the data out
    ENDIF
END HandleRecordRequest
```
