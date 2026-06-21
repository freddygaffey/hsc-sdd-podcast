---
title: "Supplementary Materials — Module Review: Web Foundations and Design"
module: PFW
lesson: "12.99"
script: script.md
---

# Supplementary Materials

Read-along reference for the module review. Nothing here is spoken. Listing 1 is the
exam-dump cheat sheet of every mnemonic from Chapters 11–12; Listing 2 is the cross-topic
trap table. Use them as your first-sixty-seconds brain-dump in the exam.

### Listing 1 — Exam-dump cheat sheet (every Ch 11–12 mnemonic, one page)

```text
APPLICATIONS (11-01)
  I-E-P ............... Interactive, E-commerce, PWA   ("I Eat Pizza")
  MISO ............... Manifest, Installable, Service worker, Offline  (what makes a PWA)

DATA MOVEMENT (11-02 / 11-03)
  Dogs Take Tasty Hambones ... DNS -> TCP -> TLS -> HTTP  (the request journey)
  IPv4 ............... four numbers, 0–255, dots between
  name / number / translator . domain name / IP address / DNS
  Ports .............. "80 plain, 443 safe; 22 secure shell, 21 file"  (DNS = 53)
  Symmetric = Same key ;  Asymmetric = A pair
  Authentication = who you are ;  Authorisation = what you can do
  Hash is one-way ;  Encrypt is two-way

BIG DATA / ARCHITECTURE (11-04)
  3 Vs ............... Volume, Velocity, Variety  (definition of big data)
  M-M-S ............. Mining, Metadata, Streaming
  Architecture ...... "one block, many services, tiny functions" (monolith/microservices/serverless)
  CDN ............... cache content close to the user (= DNS-caching idea)

DESIGN (12-01 / 12-02 / 12-03 / 12-04)
  WIPS-M ............ WAI, Internationalisation, Privacy, Security, Machine-readable (W3C)
  POUR .............. Perceivable, Operable, Understandable, Robust  (WCAG)
  Front, Back, Store . client-side / server-side / database
  SQL = Spreadsheet of tables ;  NoSQL = Notebook of documents
  E-N-S-P ........... Elements, Network, Storage, Performance  (dev tools)
  4xx = request/permissions ; 5xx = server   (status-code triage)
  Structure, Style, Behaviour ... HTML / CSS / JS  (separation of concerns)
  C-FAN-H ........... Consistency, Feedback, Accessibility, Navigation, Hierarchy (UI/UX)

LIBRARIES / OPEN SOURCE (12-05 / 12-06)
  "You call a library; a framework calls you"  (inversion of control)
  F-T-C ............. Frameworks, Template engines, CSS classes  (3 library types)
  BUILD vs BUY ...... build = unique/perf/control ; buy = standard/tight timeline
  L-C-C ............. Licence, Community, Contribution  (open-source pillars)
  Permissive = Polite (MIT/Apache/BSD) ;  Copyleft = Contagious (GPL)
```

### Listing 2 — Cross-topic trap table (the marking boundaries the exam tests)

```text
CONCEPT A            vs   CONCEPT B            THE DISTINCTION THAT EARNS THE MARK
-------------------       ------------------   --------------------------------------------------
Client-side validation   Server-side          Only server-side can be trusted; client is bypassable
Hashing                  Encryption           Hash = one-way (no reverse); encrypt = two-way
SSL                      TLS                   TLS is the modern successor; don't treat as identical
Certificate encrypts     Certificate auths    A cert AUTHENTICATES + carries public key; KEYS encrypt
Authentication           Authorisation        Who you are  vs  what you are allowed to do
IP address               DNS name             The number  vs  the human label (DNS = the translator)
Packets arrive in order  (reality)            They don't — numbered + reassembled by sequence
Responsive site          PWA                  Responsive = appearance ; PWA = installable + offline
NoSQL                    SQL                   "Not only SQL" — a tool for a data shape, not a replacement
Framework always better  (reality)            Heavy framework on a simple page = over-engineering
W3C enforces             W3C recommends        It publishes Recommendations; adoption is voluntary
Open source = insecure   (reality)            Inspectable by many; "free" = freedom, not price
```

### Listing 3 — The whole module as one annotated trace (DNS -> CSS)

```text
1. USER enters https://shop.example.com/checkout
2. DNS        resolves shop.example.com -> server IP        (11-02; "name/number/translator")
3. TCP        opens a connection to that IP on port 443     (11-03; "443 safe")
4. TLS        handshake: CA-signed cert authenticates server, asymmetric agrees a session
              key, symmetric encrypts traffic -> cipher text (11-03; the HTTPS 5-marker)
5. HTTP(S)    GET /checkout reaches the BACK tier            (11-02 / 12-02; Front/Back/Store)
6. BACK       routes the request, runs business logic, validates SERVER-side, queries the
              STORE (SQL — structured, reliable transactions for orders)   (12-02)
7. RESPONSE   server renders HTML (template engine), returns it as packets reassembled in order
8. FRONT      browser parses HTML (Structure), applies CSS (Style), runs JS (Behaviour);
              responsive layout + WCAG/POUR accessibility                 (12-04)
9. PERF       served via a CDN, compressed, framework bundle kept small   (11-04 / 12-05 / 13-03)
   Diagnose any failure with dev tools: E-N-S-P; 4xx = request, 5xx = server  (12-03)
```
