---
title: "Module Review — Programming for the Web (and the Bridge to Security)"
module: PFW
lesson: "13.99"
kind: module-review
supplementary: supplementary.md
---

NARRATOR: Final episode of Programming for the Web — the whole-module review. Fifteen lessons. The first review, at twelve-ninety-nine, tied chapters eleven and twelve together — how the web moves data and how we design for it. Today we pull in chapter thirteen — the back end, databases, performance, and the progressive web app — then connect everything, from a single packet on the wire to an installable, accessible, fast, secure application. And we build the bridge into the next module, Secure Software Architecture, because all through this module I kept saying "we'll cover the security properly later". Later is next. Consolidation plus launch. Get a pen — dump mnemonics as they come.

NARRATOR: The whole module in one arc. A user opens an app. Their request is packetised, addressed by I-P, resolved by D-N-S, carried by protocols over ports, secured by T-L-S. It reaches a back end that routes it, runs logic, safely queries a database, and responds. That response is a page built to standards, styled, made usable and accessible, optimised to load fast, and possibly installable to work offline. Fifteen lessons, one sentence. Now we test the chapter-thirteen half hard, then integrate.

NARRATOR: Chapter thirteen opened inside the back end — the request flow.

QUESTION: Pause the player. What are the four stages of the back-end request lifecycle, the mnemonic, and the difference between the web server and the web framework? Go.

NARRATOR: R-H-D-R — Route the U-R-L to a handler, Handle it with your logic, fetch or store Data, Respond. The web server software — nginx — accepts connections, serves static files, and handles T-L-S, then forwards dynamic requests to the web framework — Flask — where your routes and handlers live. Different layers. And the rule that becomes the spine of the next module: never trust input from the request — validate server-side. CRUD maps Create-Read-Update-Delete to INSERT-SELECT-UPDATE-DELETE and POST-GET-PUT-DELETE.

NARRATOR: Then the database.

QUESTION: Pause. Recite the S-Q-L clause order and its mnemonic. Then: how does a parameterised query stop S-Q-L injection?

NARRATOR: So Few Workers Go Home On-time — SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY. WHERE filters rows before grouping; HAVING filters groups after, on an aggregate. INNER JOIN keeps only matches in both tables; LEFT JOIN keeps everything on the left. And a parameterised query prevents S-Q-L injection by separating the command from the data — the value is passed separately and treated strictly as data, never executed as S-Q-L. The trap: never build S-Q-L by string concatenation. And the O-R-M maps classes to tables and objects to rows, trading performance for productivity but never removing the need to know S-Q-L.

NARRATOR: Then performance.

QUESTION: Pause. What's the rule before you optimise, and what are the four speed levers?

NARRATOR: Measure before you optimise — profile with developer tools, fix the real bottleneck, avoid premature optimisation. The levers are C-C-C-L: Caching stores data closer for reuse, Compression shrinks bytes with gzip, a C-D-N serves static assets from a nearby edge, Lazy loading defers non-critical resources. Plus bundling to cut requests. And never publicly cache private or stale-prone content.

NARRATOR: Then the progressive web app — the promise from episode one, finally built.

QUESTION: Pause. What four things make a web app a P-W-A, and how does the service worker make it work offline?

NARRATOR: MISO — Manifest, Installable, Service worker, Offline. The manifest describes the app so the browser can install it; the service worker is a background proxy that intercepts network requests and serves the cached app shell when there's no network — that's offline. It must run over H-T-T-P-S. And the trap that's haunted the whole module: a P-W-A is not just a responsive site — responsive is appearance, progressive is capability.

NARRATOR: Now let's integrate the entire module the way the H-S-C builds its biggest stimulus questions — one large scenario, one full answer that touches every part.

QUESTION: Pause the player and really attempt this — it's an eight-mark-plus stimulus. "A startup is building an online store. Describe how you would design, transmit, secure, and optimise it — taking a customer's request from typing the address through to a fast, accessible page — naming the technologies and techniques at each stage." Take a couple of minutes, then play.

NARRATOR: The integrated answer. First, the journey to the server — Dogs Take Tasty Hambones: D-N-S resolves the store's domain to an I-P address; a T-C-P connection opens on port four-four-three; T-L-S secures it with a Certificate-Authority-signed certificate, turning the customer's data into cipher text; and the H-T-T-P request arrives. Because this is e-commerce, defined by its security requirement, H-T-T-P-S is non-negotiable. Second, the back end — Front, Back, Store, and R-H-D-R: the framework routes the request, the handler validates all input server-side because the client can't be trusted, and queries the database using parameterised queries to prevent S-Q-L injection — storing orders in an S-Q-L database for reliable transactions, with passwords stored as one-way hashes, not encrypted. Third, the front end — built to W3C standards, separation of concerns with Structure, Style, Behaviour, responsive layout, and accessibility per WCAG and POUR, applying the U-X principles C-FAN-H. Fourth, performance — measure first, then C-C-C-L: cache and compress assets, serve them from a C-D-N, lazy-load images, keep the framework bundle small. Finally, make it an installable P-W-A with MISO so it works offline.

NARRATOR: Hear the marking boundary. A weak answer says: "The customer's data goes to the server, gets stored in a database, and the page loads. We'd make it secure and fast." That's band four — it names no technology, no protocol, no technique, and earns almost nothing. The strong answer names the mechanism at every stage — D-N-S, port four-four-three, T-L-S and a C-A certificate, server-side validation, parameterised queries, hashed passwords, W3C standards, WCAG, C-C-C-L, MISO — pulling in the request journey, ports, e-commerce security, the three tiers, hashing, accessibility, performance, and P-W-As in one pass. That density — a named technology and a justified reason at every stage — is what a top-band stimulus answer looks like.

NARRATOR: The traps, one final time, because the whole module's marks leak at these boundaries. Client versus server validation — validate server-side; the client is bypassable. Hash versus encrypt — hashing is one-way, encryption is two-way. S-S-L versus T-L-S — T-L-S is modern. A certificate authenticates, it doesn't encrypt. Authentication versus authorisation — who you are versus what you can do. I-P versus D-N-S — the number versus the translator. Packets don't arrive in order. NoSQL doesn't mean S-Q-L is obsolete. A framework isn't always better. The W3C recommends, not enforces. Open source isn't insecure or free. Never build S-Q-L by string concatenation. Don't optimise before measuring. And a P-W-A is not just a responsive site. Each is a sentence you can write to earn a mark and dodge a common error.

NARRATOR: Now the bridge — the most important part of this review. All through this module I deferred security. Here's the I-O-U list, every item paid back in Secure Software Architecture, which is next. The T-L-S handshake and how encryption keys really work — deferred to S-S-A crypto. Hashing versus encryption, and the C-I-A triad — you'll meet the exam-dump hook C-I-A-A-A there. Digital signatures and certificates in depth. Authentication and authorisation as a whole discipline. S-Q-L injection — we showed the parameterised-query defence; S-S-A teaches the full attack and mitigation. Cross-site scripting, which we flagged on interactive pages and in the back-end handler — taught in full there. The validate-everything, never-trust-the-client rule — the heart of secure design. And the software supply chain — the xz backdoor we previewed with open source. Programming for the Web taught you how the web is built; Secure Software Architecture teaches how it's attacked and defended. This module wrote the security cheques; the next one cashes them. You already have the seeds — next module they become the whole tree.

NARRATOR: Here's the complete exam-dump checklist for this module — every mnemonic, to write down in the first ninety seconds of the exam. I-E-P and MISO for applications. Dogs Take Tasty Hambones for the request journey; name-number-translator for D-N-S. Eighty plain, four-four-three safe; twenty-two secure shell, twenty-one file for ports. Symmetric-same, asymmetric-a-pair; hash one-way, encrypt two-way. Three Vs and M-M-S for big data. WIPS-M and POUR for standards and accessibility. Front, Back, Store; S-Q-L-spreadsheet, NoSQL-notebook. E-N-S-P for dev tools; four-x-x request, five-x-x server. Structure, Style, Behaviour; C-FAN-H for design. F-T-C and BUILD-versus-BUY for libraries; L-C-C for open source. R-H-D-R and CRUD for the back end. So Few Workers Go Home On-time for S-Q-L; INNER-matches, LEFT-keeps-left. C-C-C-L for performance. MISO for P-W-As. That's the whole module on one page. The master sheet is in Listing 1, the security-I-O-U-to-S-S-A map is in Listing 2, and the full whole-stack trace is in Listing 3.

NARRATOR: A few quick-fire questions to finish — the recall kind the exam opens with. Pause on each.

QUESTION: One. Trace, naming the protocols in order, what happens from entering a secure web address to the page loading.

NARRATOR: D-N-S resolves the domain to an I-P address; T-C-P connects on port four-four-three; T-L-S secures the connection; H-T-T-P-S sends the request; the server responds and the page renders from packets reassembled in order. Dogs Take Tasty Hambones.

QUESTION: Two. Why must a web application validate input on the server, and how does that protect the database?

NARRATOR: Because client-side checks can be bypassed, so the server must re-validate all input; combined with parameterised queries, which separate command from data, this prevents S-Q-L injection. Never trust the client.

QUESTION: Three. Distinguish a progressive web app from a responsive website.

NARRATOR: A responsive website adapts its layout to screen size — appearance; a progressive web app is additionally installable via a manifest and works offline via a service worker — capability. MISO.

QUESTION: Four, the integrating one. Name one concept from this module that you now know will be "covered properly" in Secure Software Architecture, and state what we taught about it here.

NARRATOR: Any of several — for example, S-Q-L injection: here we taught that parameterised queries prevent it by separating data from the command; Secure Software Architecture teaches the full attack and defence. Or hashing versus encryption: here, hash is one-way and encrypt is two-way; there, it becomes central to secure storage. Naming the seed and where it grows is the point of the bridge.

NARRATOR: That's Programming for the Web — done. You can trace the whole arc, from a packet to an installable, accessible, fast, secured application, and you have every mnemonic on one page. Every "we'll secure it later" is about to be paid. Next module: Secure Software Architecture — how software gets broken into, and how to build it so it doesn't. The first thing they'll hand you is the C-I-A triad and the dump hook C-I-A-A-A — and you'll recognise every threat it defends against, because you met them here first. See you in the next module.
