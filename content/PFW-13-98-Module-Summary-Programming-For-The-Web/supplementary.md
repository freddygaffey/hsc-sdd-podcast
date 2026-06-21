---
title: "Supplementary Materials — Module Summary: Programming for the Web"
module: PFW
lesson: "11–13"
script: script.md
---

# Supplementary Materials

The one-page revision references for the whole Programming for the Web module. Nothing here is spoken in the audio — it's the read-along sheet. Listing 1 is the master mnemonic table; Listing 2 is the key-terms checklist by topic.

### Listing 1 — Master mnemonic table (every PFW mnemonic + full expansion)
```text
EXAM-DUMP MARQUEE HOOKS (write these first):
  I-E-P · MISO · Dogs Take Tasty Hambones · 80/443/22/21 · Front-Back-Store
  + Ch13 build hooks: R-H-D-R · So Few Workers Go Home On-time · C-C-C-L

CH 11 — TRANSMISSION & TRANSPORT
  I-E-P              = Interactive website / E-commerce / Progressive web app
  MISO               = Manifest, Installable, Service worker, Offline (PWA essentials)
  Dogs Take Tasty Hambones = DNS -> TCP -> TLS -> HTTP (request journey order)
  IPv4               = four numbers, 0-255, dots between
  name/number/translator = domain name / IP address / DNS (the translator)
  80/443/22/21       = 80 plain (HTTP), 443 safe (HTTPS), 22 secure shell (SSH/SFTP),
                       21 file (FTP)  [+ DNS 53]
  Symmetric=Same key; Asymmetric=A pair  (same key fast / key pair solves sharing)
  Authentication = who you are; Authorisation = what you can do
  Hash is one-way, Encrypt is two-way
  3 Vs               = Volume, Velocity, Variety (defines big data)
  M-M-S              = Mining, Metadata, Streaming
  one block / many services / tiny functions = monolith / microservices / serverless

CH 12 — STANDARDS, ARCHITECTURE & DESIGN
  WIPS-M             = WAI accessibility, Internationalisation, Privacy, Security,
                       Machine-readable data (W3C's five concerns)
  POUR               = Perceivable, Operable, Understandable, Robust (WCAG principles)
  i18n vs l10n       = internationalise = prepare; localise = adapt
  Front, Back, Store = client/front-end, server/back-end, database (the 3 tiers)
  SQL=Spreadsheet of tables; NoSQL=Notebook of documents
  E-N-S-P            = Elements, Network, Storage, Performance (dev-tool panels) [+Console]
  4xx/5xx            = 4xx the request/permissions; 5xx the server
  Structure, Style, Behaviour = HTML / CSS / JS (separation of concerns)
  C-FAN-H            = Consistency, Feedback, Accessibility, Navigation, Hierarchy (UI/UX)
  "you call a library; a framework calls you" = inversion of control
  F-T-C              = Frameworks, Template engines, predesigned CSS classes
  BUILD vs BUY       = bespoke/unique/perf/control  vs  standard/tight-timeline/known
  L-C-C              = Licence, Community, Contribution (open-source pillars)
  Permissive=Polite (use freely, attribute); Copyleft=Contagious (share-alike derivatives)

CH 13 — BUILDING THE BACK END, DATA, SPEED & PWA
  R-H-D-R            = Route, Handle, Data, Respond (back-end request lifecycle)
  CRUD               = Create/Read/Update/Delete = INSERT/SELECT/UPDATE/DELETE
                       = POST/GET/PUT/DELETE
  So Few Workers Go Home On-time = SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY
  INNER keeps matches in both; LEFT keeps everything on the left
  "parameterise — pass the value separately so it can never become code"
  C-C-C-L            = Cache, Compress, CDN, Lazy-load (the four speed levers)
  MISO (built here)  = Manifest, Installable, Service worker, Offline
```

### Listing 2 — Key-terms checklist by topic
```text
[ ] 11-01 Applications: interactive (dynamic, no reload) / e-commerce (secure $ + data)
        / PWA (installable + offline); match scenario's driving requirement
[ ] 11-02 Data movement: packets (numbered, reassembled by sequence, out-of-order);
        IP address; IPv4 vs IPv6 (exhaustion); DNS hierarchy (cache->resolver->root
        ->TLD->authoritative) + TTL; request order DNS->TCP->TLS->HTTP
[ ] 11-03 Protocols/ports/transport: protocol=rules; port=service doorway;
        ports 80/443/22/21/53; SSL(old) vs TLS(current); plaintext/ciphertext;
        symmetric vs asymmetric; TLS handshake (cert -> asymmetric -> symmetric);
        authn vs authz; hashing; digital signature (sign private/verify public)
[ ] 11-04 Big data/architecture: 3 Vs; data mining (pattern discovery); metadata;
        streaming mgmt (high-velocity real-time); monolith/microservices/serverless;
        CDN (edge caching)
[ ] 12-01 W3C/standards: recommends NOT enforces; W3C Recommendation; five concerns
        (WIPS-M); WCAG/POUR; contrast >=4.5:1; alt text/labels; keyboard+focus;
        i18n vs l10n; machine-readable (ARIA/microdata/JSON-LD)
[ ] 12-02 Modelling system: Front/Back/Store tiers; client untrusted vs server trusted
        -> validate server-side; SQL/relational + ACID vs NoSQL/documents; middleware;
        API as contract + security boundary
[ ] 12-03 Browser/dev tools: rendering + JS engines; cross-browser compatibility;
        feature detection; progressive enhancement; same-origin policy + CORS;
        panels E-N-S-P + Console; status triage 4xx/5xx
[ ] 12-04 CSS/UI/UX: separation of concerns (Structure/Style/Behaviour); external
        stylesheet + design tokens (maintainability); responsive/media queries/mobile-
        first (NOT a PWA); UI=look vs UX=experience; C-FAN-H; accessibility techniques
[ ] 12-05 Libraries/frameworks: inversion of control; F-T-C three types; SPA;
        server-side rendering (template engine on Back); BUILD vs BUY; adoption
        benefits (speed/tested/consistency/community) + costs (bundle/learning/lock-in)
[ ] 12-06 Open source/CMS: free-as-in-freedom; L-C-C pillars; permissive vs copyleft
        (MIT/Apache/BSD vs GPL); software supply chain (xz); CMS = DB+template+admin;
        hosted vs self-hosted
[ ] 13-01 Server-side Python: R-H-D-R lifecycle; web server (nginx) vs web framework
        (Flask); request/response/session; CRUD<->SQL<->HTTP; untrusted input ->
        injection/XSS; shell scripting
[ ] 13-02 Databases/SQL/ORM: clause order (So Few Workers Go Home On-time);
        WHERE vs HAVING; GROUP BY + aggregate; INNER vs LEFT JOIN; PK<->FK;
        SQL injection -> parameterised query/prepared statement; ORM (fit/predict
        mapping classes<->tables) + trade-offs; hybrid ORM+raw SQL
[ ] 13-03 Performance: measure-before-optimise (profile, no premature optimisation);
        C-C-C-L; Cache-Control; Redis; gzip/Brotli + minify; CDN edge; lazy-load;
        bundling; private vs public cache (no-store)
[ ] 13-04 PWA: MISO; manifest JSON; installable/standalone; service worker = network
        proxy intercepting requests; offline app shell + background sync; HTTPS
        required; apply C-FAN-H + POUR to app shell; PWA != responsive
```
