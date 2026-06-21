---
title: "Supplementary Materials — Module Summary: Secure Software Architecture"
module: SSA
lesson: "14–19"
script: script.md
---

# Supplementary Materials

The one-page revision references for the whole Secure Software Architecture module. Nothing here is spoken in the audio. Listing 1 is the master mnemonic table; Listing 2 is the key-terms checklist by topic.

### Listing 1 — Master mnemonic table (every SSA mnemonic + full expansion)
```text
EXAM-DUMP HOOK (write FIRST, in second one):
  CIA-AAA = Confidentiality, Integrity, Availability | Authentication, Authorisation,
            Accountability   ("CIA = what we protect; AAA = how we protect it")
  + "Hash is one-way, Encrypt is two-way" · V-S-E · Static=Source/Dynamic=Doing · B-X-I-R

CH 14 — MINDSET (business case, SDLC, user-centred)
  D-A                = protect Data, prevent Attacks (the two business benefits)
  Risk = Likelihood x Impact
  "prevention is far cheaper than response" · "security is an enabler, not just a cost"
  Really Smart Developers Don't Ignore Testing In Maintenance =
      Requirements, Specifications, Design, Development, Integration,
      Testing&debugging, Installation, Maintenance (8 SDLC steps)
  shift left         = move security effort earlier (cheap to fix at design)
  STRIDE             = Spoofing, Tampering, Repudiation, Information disclosure,
                       Denial of service, Elevation of privilege (threat categories)
  "secure default, easy right path" · "difficult security = bypassed security"

CH 15 — PRINCIPLES (CIA-AAA + cryptography)
  CIA-AAA            = (above); triad one-word = secrecy / accuracy / access
  Know, Have, Are, plus Where = authentication factors
  "authenticate, authorise, act, log" = the AAA pipeline
  Hash is one-way, Encrypt is two-way
  Hash it, Salt it, Slow it = the 3-step password-storage recipe
  Salt stops the rainbow = salting defeats precomputed rainbow tables
  "password -> salt -> hash" (the order)
  Symmetric = Same key (fast, sharing problem); Asymmetric = A pair (slow, solves sharing)
  "encrypt with public, decrypt with private; sign with private, verify with public"
  Good Spies Rotate Disguises = Generate, Store, Rotate, Destroy (key-mgmt lifecycle)
  "a sandbox is a playpen the code can't climb out of"

CH 16 — DATA (input handling + privacy)
  V-S-E              = Validate, Sanitise, handle Errors
  "allow-list beats block-list" · "validation rejects, sanitisation cleans"
  "parameterise — pass the value separately so it can never become code"
  "log it private, show it generic" · "injection and XSS are the same disease"
  PER                = Proactive (not reactive), Embed privacy, Respect (privacy-by-design)
  "collect less, keep less" (data minimisation) · "privacy != security"

CH 17 — SYSTEMS (secure API + execution)
  A-A-R-T            = Authenticate, Authorise, Rate-limit, Transport-secure (API measures)
  "authenticated is NOT authorised" (broken access control)
  S-A-F-E sessions   = Strong IDs / Attributes (HttpOnly, Secure, SameSite) /
                       Fixed lifetime / re-issue on Escalation
  "CORS relaxes the same-origin policy — it is NOT access control"
  M-S-E              = Memory, Session, Exception management (secure execution)
  "../ climbs out" = path/directory traversal
  "the secret leaks through timing — compare in constant time" (side-channel)

CH 18 — TESTING + VULNERABILITIES
  CR-SAST-DAST-VA-PEN = Code Review, SAST, DAST, Vulnerability Assessment, Penetration test
  "Static = Source (not running); Dynamic = Doing (running)"
  "vulnerability assessment = breadth/list; penetration test = depth/exploit"
  H-B-D              = Harden / Breach-handle / Disaster-recover (within continuity)
  "an untested backup is a guess"
  B-X-I-R            = Broken auth/session, Cross-site (XSS/CSRF), Invalid redirect, Race
  "XSS injects a Script; CSRF rides a Session"
  TOCTOU             = Time-Of-Check to Time-Of-Use (race condition)
  "the server is always concurrent" · "hijacking steals a live session; fixation plants one"

CH 19 — CONTEXT (teams, enterprise, ethics, evaluation)
  V-D-Q              = Views (various points of view), Delegate by expertise, Quality
  PIP-PB             = Products/services, Influence on future dev, Practices, Productivity,
                       Business interactivity (5 enterprise benefits)
  E-D-P-C-I-D ("Ed Picid") = Employment, Data security, Privacy, Copyright,
                       Intellectual property, Digital disruption (6 ethical/legal issues)
  "copyright is ONE type of IP" · "responsible disclosure: report privately, publish after fix"
  M-A-I ("my")       = Measure, Audit, Improve (continuous evaluation loop)
  "measure outcomes, not activity" · "you can't grade your own homework"
```

### Listing 2 — Key-terms checklist by topic
```text
[ ] 14-01 Business case: justify (business language); D-A (protect data / prevent attacks);
        enabler-not-cost; direct vs indirect breach cost; prevention<<response;
        Risk=L x I; "too small to be targeted" myth
[ ] 14-02 Security in SDLC: 8 steps; security-by-design; shift-left; threat modelling
        (model->identify->assess(LxI)->countermeasure->validate); STRIDE
[ ] 14-03 User-centred security: security-usability paradox; usability IS a security
        requirement; "secure default, easy right path"; transparency/progressive/
        recoverable/contextual; user personas vs abuse cases (STRIDE on features)
[ ] 15-01 CIA + AAA: 6 properties (controls/threats each); authn factors (Know/Have/Are/
        Where); MFA; RBAC + least privilege; audit logging/non-repudiation; AAA pipeline;
        answer-shape property+control+effect
[ ] 15-02-P1 Crypto: encryption two-way (confidentiality) vs hashing one-way (integrity);
        hash properties (deterministic/fixed/avalanche); password storage = hash+salt+slow;
        rainbow tables; bcrypt/scrypt/Argon2; never roll your own crypto
[ ] 15-02-P2 Keys/TLS/signatures: symmetric vs asymmetric; hybrid (HTTPS); key lifecycle
        (Generate/Store/Rotate/Destroy); certificate authenticates (not encrypts);
        CA; TLS handshake; digital signature (hash-then-sign, non-repudiation); sandboxing
[ ] 16-01 Input handling: never trust input; validation (allow-list>block-list) vs
        sanitisation (escape/clean); SQL injection -> parameterised query; XSS -> output
        encoding + CSP; same disease; error handling (log private/show generic/fail securely);
        server-side validation
[ ] 16-02 Privacy by design: PER principles; privacy != security; PIA; privacy-by-default;
        consent (not theatre); data-subject rights; data minimisation; purpose limitation;
        retention policy; GDPR + Australian Privacy Principles/Privacy Act
[ ] 17-01 Secure API: every request untrusted; A-A-R-T; API key/JWT(signed not encrypted)/
        OAuth2; authorise per request (broken access control/IDOR); rate-limit (429);
        sessions S-A-F-E; same-origin policy; CORS (not access control)
[ ] 17-02 Secure execution: M-S-E; buffer overflow + over-read (Heartbleed = unvalidated
        length); managed langs still leak; session hijacking vs fixation; exception fail-
        closed (no stack trace); resource exhaustion + limits/timeouts; path traversal;
        side-channel/timing -> constant-time compare
[ ] 18-01 Security testing: CR/SAST/DAST/VA/PEN (cheap-broad -> expensive-deep);
        Static=Source / Dynamic=Doing; VA=breadth vs PEN=depth; HARDEN; breach handling
        (detect/contain/eradicate/recover/review); business continuity vs disaster recovery;
        tested off-site backups
[ ] 18-02 Vulnerabilities (B-X-I-R): XSS (reflected/stored/DOM; output encoding+CSP);
        CSRF (token + SameSite); XSS-injects-script vs CSRF-rides-session; broken auth/
        session (hijacking vs fixation); race conditions/TOCTOU/double-spend (atomic fix;
        server is concurrent); invalid redirect/open redirect; file + side-channel attacks
[ ] 19-01 Teams: V-D-Q benefits; solo can't review own blind spots; code review/pair
        programming; security champions; collaborative threat modelling; not-automatic
        (bystander effect -> 1 accountable reviewer; trust exploited = xz); structured
[ ] 19-02 Enterprise benefits: PIP-PB (organisational NOT technical); influence-on-future
        + business-interactivity (the abstract two); security raises productivity;
        Equifax counterfactual; land on the enterprise
[ ] 19-03 Ethics/legal: EVALUATE (weigh + judge); E-D-P-C-I-D; social/ethical/legal lenses;
        copyright = ONE type of IP; GDPR/APP; permissive vs copyleft; responsible disclosure
        (report private, never exploit, publish after fix); authorised pen-test
[ ] 19-04 Evaluating security: M-A-I loop; outcome metrics (MTTD/MTTR/remediation time/
        patch + review coverage); independent audit vs standard (ISO 27001/NIST/PCI-DSS);
        continuous improvement; vanity metrics trap (measure outcomes not activity)
```
