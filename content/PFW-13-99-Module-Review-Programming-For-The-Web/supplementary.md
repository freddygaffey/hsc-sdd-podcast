---
title: "Supplementary Materials — Module Review: Programming for the Web"
module: PFW
lesson: "13.99"
script: script.md
---

# Supplementary Materials

Read-along reference for the module-ending review. Nothing here is spoken. Listing 1 is the
full-module mnemonic master sheet; Listing 2 maps each deferred-security IOU to where it is
paid in Secure Software Architecture; Listing 3 is the whole-stack trace.

### Listing 1 — Full-module exam-dump master sheet (all of PFW, one page)

```text
APPLICATIONS        I-E-P (Interactive, E-commerce, PWA) · MISO (Manifest, Installable, Service worker, Offline)
DATA MOVEMENT       Dogs Take Tasty Hambones (DNS->TCP->TLS->HTTP) · IPv4 = four numbers 0–255 dots
                    · name/number/translator (domain/IP/DNS) · packets numbered & reassembled
PROTOCOLS/SECURITY  "80 plain, 443 safe; 22 secure shell, 21 file" (DNS 53)
                    · Symmetric=Same key / Asymmetric=A pair · Auth=who / Authz=what
                    · "Hash one-way, Encrypt two-way" · cert AUTHENTICATES (keys encrypt) · TLS>SSL
BIG DATA            3 Vs (Volume, Velocity, Variety) · M-M-S (Mining, Metadata, Streaming)
                    · monolith/microservices/serverless · CDN = cache near user
STANDARDS/DESIGN    WIPS-M (WAI, i18n, Privacy, Security, Machine-readable) · POUR (WCAG)
                    · Front, Back, Store · SQL=Spreadsheet / NoSQL=Notebook
                    · E-N-S-P (Elements/Network/Storage/Performance) · 4xx=request / 5xx=server
                    · Structure/Style/Behaviour · C-FAN-H (Consistency/Feedback/Accessibility/Navigation/Hierarchy)
LIBRARIES/OSS       "you call a library; a framework calls you" · F-T-C · BUILD vs BUY
                    · L-C-C (Licence/Community/Contribution) · Permissive=Polite / Copyleft=Contagious
BACK END/DATA       R-H-D-R (Route/Handle/Data/Respond) · CRUD = INSERT/SELECT/UPDATE/DELETE = POST/GET/PUT/DELETE
                    · "So Few Workers Go Home On-time" (SELECT/FROM/WHERE/GROUP BY/HAVING/ORDER BY)
                    · INNER=matches both / LEFT=keep left · parameterised query stops SQL injection
PERFORMANCE/PWA     measure first · C-C-C-L (Cache/Compress/CDN/Lazy-load) · MISO (built) · HTTPS required
```

### Listing 2 — Security IOUs from PFW → where they are paid in Secure Software Architecture

```text
PFW taught (the seed)                          SSA pays it off (the full tree)
---------------------------------------------  -----------------------------------------------
TLS handshake, keys, plain/cipher text (11-03) Cryptography in depth (SSA 15-01/15-02)
"Hash one-way, Encrypt two-way" (11-03)        Hashing, salting, secure storage; CIA-AAA triad
Digital signatures + certificates (11-03)      Signatures, PKI, integrity/non-repudiation
Authentication vs authorisation (11-03)        Access control as a discipline
SQL injection -> parameterised query (13-01/02) Full injection attack + defence (SSA 16-01)
XSS flagged on interactive pages (11-01/13-01) Cross-site scripting in full (SSA 18-x)
"Never trust the client; validate server-side" Validate-everything / secure-by-design core
Supply chain / open source trust (12-06)       Supply-chain security (case_the_xz_backdoor, 18-x/19-x)
Privacy-by-design (12-01)                       Privacy + accountability (SSA 16-02)
```

### Listing 3 — The whole module as one annotated stack trace (packet → installable app)

```text
1.  Enter https://shop.example.com/checkout
2.  DNS resolves name -> IP            (11-02; name/number/translator)
3.  TCP connect on port 443            (11-03; "443 safe")
4.  TLS: CA-signed cert authenticates, asymmetric agrees session key, symmetric encrypts (11-03)
5.  HTTPS request reaches the BACK tier (11-02/12-02; Front/Back/Store)
6.  R-H-D-R: Route -> Handle (VALIDATE server-side) -> Data (parameterised SQL) -> Respond (13-01/02)
7.  STORE: SQL for reliable orders; passwords stored as one-way HASHES (12-02/13-02/11-03)
8.  Response = HTML (template engine) returned as packets reassembled in order (12-05/11-02)
9.  FRONT: Structure/Style/Behaviour; responsive; WCAG/POUR accessibility; C-FAN-H (12-04)
10. PERFORMANCE: measure first, then C-C-C-L + bundling; CDN near user (13-03)
11. Optionally a PWA: MISO — installable + offline via service worker, over HTTPS (13-04)
    Diagnose anything with dev tools E-N-S-P; 4xx=request, 5xx=server (12-03)
=>  Everything marked "secure properly later" -> Secure Software Architecture (next module)
```
