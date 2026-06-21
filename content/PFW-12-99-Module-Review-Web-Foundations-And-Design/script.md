---
title: "Module Review — Web Foundations and Design (Chapters 11–12)"
module: PFW
lesson: "12.99"
kind: module-review
supplementary: supplementary.md
---

NARRATOR: This is a module review. Ten lessons across chapters eleven and twelve, and today we add nothing new. We tie it together, re-surface every mnemonic in one pass, run the integrated exam questions the H-S-C actually asks — the ones spanning several topics at once — and flag the traps where students confuse one idea for another. Chapter eleven was how the web moves data; chapter twelve was how we design applications for it. Today we connect those halves into one picture: from a single packet on the wire up to an accessible, well-built, well-chosen web application. I'll use the second voice a lot, with pause-the-player retrieval, because testing yourself is what makes this stick. Get a pen, and dump mnemonics onto paper as they come up.

NARRATOR: The whole arc in one breath. A user types a web address. Their request travels the internet as packets, gets routed by I-P, resolved by D-N-S, carried by protocols over ports, secured by T-L-S. It arrives at a web application that is one of three types, built as three tiers, designed to standards, styled and made usable and accessible, possibly assembled from frameworks and open-source pieces or run on a content management system. That single sentence is the whole module. Now we pull it apart and test every piece.

NARRATOR: Chapter eleven, and we start where the user starts — episode one, the three types of web application.

QUESTION: Pause the player. Name the three application types and the mnemonic, and give the defining characteristic of each. Go.

NARRATOR: I-E-P — "I Eat Pizza" — Interactive, E-commerce, progressive web app. Interactive is dynamic, client-side content that updates without a full reload. E-commerce is defined by secure financial transactions and protection of sensitive data — security is its distinguishing requirement, because the asset is money and identity. A progressive web app is installable and offline-capable through a service worker — MISO: Manifest, Installable, Service worker, Offline. The trap, say it with me: a P-W-A is not just a mobile-friendly site — responsive is appearance, progressive is capability.

NARRATOR: Episode two — how the data moves. The request journey, and its mnemonic, is the spine of this whole module.

QUESTION: Pause. What's the order of the request journey, and the mnemonic for it? And what does D-N-S actually do?

NARRATOR: Dogs Take Tasty Hambones — D-N-S, T-C-P, T-L-S, H-T-T-P. D-N-S resolves the human-readable domain name into the server's I-P address by walking a hierarchy of name servers and caching under a time-to-live. Keep the triple straight: name, number, translator — the domain name is the label, the I-P address is the number, D-N-S is the translator between them. I-P version four is four numbers, zero to two-five-five, dots between. Data travels as numbered packets, and the trap is that they do not arrive in order; they're reassembled by sequence number. Confusing the I-P address with the D-N-S name is the classic error here.

NARRATOR: Episode three — protocols, ports, and secure transport. The Take-Tasty-Hambones tail of the journey, and it previews the entire security module.

QUESTION: Pause. Recite the port chant. Then: how does H-T-T-P-S secure data in transit?

NARRATOR: Eighty plain, four-four-three safe; twenty-two secure shell, twenty-one file. H-T-T-P on eighty, H-T-T-P-S on four-four-three, S-S-H and S-F-T-P on twenty-two, F-T-P on twenty-one — and D-N-S answers on fifty-three. H-T-T-P-S secures data through a T-L-S handshake: the server presents a certificate signed by a Certificate Authority, which authenticates its identity and carries its public key; asymmetric encryption agrees a session key; then symmetric encryption protects the bulk traffic — turning plain text into cipher text. Symmetric is the same key; asymmetric is a pair. Three traps live here, all H-S-C favourites: S-S-L versus T-L-S — T-L-S is the modern one; the certificate authenticates, it does not itself encrypt; and hashing is one-way while encryption is two-way. Also from this episode: authentication is who you are; authorisation is what you can do.

NARRATOR: Episode four — big data and web architectures, where scale reshapes everything.

QUESTION: Pause. Define big data properly — not "lots of data" — and name the three syllabus terms.

NARRATOR: Big data is the three Vs — Volume, Velocity, Variety. The three syllabus terms are M-M-S: data Mining discovers hidden patterns, Metadata is data about data that makes content findable, and Streaming management handles continuous real-time data. Scale reshapes architecture into monolith, microservices, serverless — one block, many services, tiny functions — and content delivery networks cache content close to users, the same idea as D-N-S caching from episode two. Traps: big data is not just "lots of rows", and data mining is discovery of patterns, not mere storage.

NARRATOR: That's chapter eleven — the data has reached an application. Chapter twelve is how that application is designed. Episode five, the W3C.

QUESTION: Pause. What does the W3C do — and the critical verb — and what are its five concerns?

NARRATOR: The W3C develops open web standards to keep the web interoperable and consistent — and it recommends, it does not enforce. That verb is a marking boundary. Its five concerns are WIPS-M: WAI accessibility, Internationalisation, Privacy, Security, Machine-readable data. Accessibility runs on the WCAG guidelines and the four principles POUR — Perceivable, Operable, Understandable, Robust. Internationalisation prepares software for many locales; localisation adapts it to one. Trap: accessibility is not "for blind users only" — it's far broader.

NARRATOR: Episode six — modelling the system. This is the anatomy mnemonic you'll lean on constantly.

QUESTION: Pause. Name the three tiers and what each does — and the one with the trust.

NARRATOR: Front, Back, Store. The Front, client-side, runs in the browser with H-T-M-L, C-S-S, JavaScript — presentation and interaction, and it's visible and tamperable. The Back, server-side, runs on the server with Python and Flask — routing, business logic, data access, and it's where trust lives. The Store, the database, persists data, and only the Back talks to it. S-Q-L is a Spreadsheet of structured tables; NoSQL is a Notebook of flexible documents. The headline trap of the whole module: never trust client-side validation alone — validate on the server, because the client can be bypassed.

NARRATOR: Episode seven — the browser and its developer tools.

QUESTION: Pause. Why can the same page behave differently across browsers, and name the dev-tool panels.

NARRATOR: Because each browser runs your code with its own rendering and JavaScript engines — Blink, Gecko, WebKit — so the same code can render differently, which forces cross-browser testing, feature detection, and progressive enhancement. The dev-tool panels are E-N-S-P: Elements for the live D-O-M and C-S-S, Network for every H-T-T-P request and its status code, Storage for client-side data, Performance for slow code. The status-code triage: four-x-x is the request or its permissions, five-x-x is the server. The trap: nothing client-side is hidden — everything is visible and editable through these tools, the same lesson as validate-on-the-server, seen from the attacker's side.

NARRATOR: Episode eight — C-S-S, U-I and U-X.

QUESTION: Pause. What does separation of concerns mean, and what are the U-I-slash-U-X principles?

NARRATOR: Separation of concerns is Structure, Style, Behaviour — H-T-M-L, C-S-S, JavaScript kept in separate layers — and it's what makes a site maintainable: define style once, change it once, it updates everywhere; inline styles wreck that. The U-I-slash-U-X principles are C-FAN-H: Consistency, Feedback, Accessibility, Navigation, Hierarchy. U-I is the look; U-X is the experience. Accessibility deepens POUR with real techniques — sufficient contrast at four-point-five to one, keyboard operability, never colour alone, text alternatives — designed in from the start. Trap: accessibility is not an afterthought.

NARRATOR: Episode nine — libraries and frameworks.

QUESTION: Pause. Distinguish a library from a framework, and name the build-versus-buy rule.

NARRATOR: You call a library; a framework calls you — that's inversion of control. The three types are F-T-C: Frameworks, Template engines, predesigned C-S-S classes. The decision is BUILD versus BUY: buy when needs are standard and the timeline is tight; build when needs are unique or performance-critical — always weighing bundle size, learning curve, and lock-in. Trap: a framework is not always better, and never ignore the download cost.

NARRATOR: Episode ten — open source and content management systems.

QUESTION: Pause. What are the open-source pillars, and the two licence families?

NARRATOR: L-C-C: Licence, Community, Contribution. Licences are permissive — M-I-T, Apache, B-S-D, Polite, use freely even in proprietary products — or copyleft — G-P-L, Contagious, your derivative must also be open source. The big risk is the software supply chain — trusting code you didn't write — which the xz backdoor exposed. A content management system lets non-technical people manage content; the decision is hosted, trading control for managed security, versus self-hosted, trading responsibility for control. Trap: open source is not "free or insecure", and never ignore licence obligations.

NARRATOR: Now the part a module review exists for — integrated questions that span the whole module, the way the H-S-C builds its bigger items. These are worth the most. Here's the marquee one.

QUESTION: Pause the player and really attempt this — it's a six-to-eight mark stimulus. "A user reports that an online store's checkout page is slow to load and shows a 'not secure' warning." Walk through everything from D-N-S to C-S-S that could be involved, using the correct terminology. Take a full minute, then play.

NARRATOR: Here's a strong, integrated answer touching the whole module. When the user enters the address, D-N-S resolves the domain to the server's I-P address — Dogs Take Tasty Hambones, the request journey. The "not secure" warning means the page is served over plain H-T-T-P on port eighty rather than H-T-T-P-S on port four-four-three — so there's no T-L-S, no valid certificate, and the checkout data would travel as plain text instead of cipher text. For an e-commerce page handling payment, that's a critical flaw, because e-commerce is defined by its security requirement. Diagnose the slowness in developer tools: the Network panel for large resources, too many requests, or slow timings — possibly an un-cached page or no content delivery network — and the Performance panel for slow JavaScript, perhaps a heavy front-end framework with a large bundle size. Fixes span the module: install a valid T-L-S certificate and force H-T-T-P-S; serve assets through a C-D-N and compress them; reconsider whether the framework's bundle is justified. One answer pulled in D-N-S, ports, T-L-S, e-commerce, dev tools, big-data architecture, and frameworks. That cross-topic reach is what turns a good answer into a top-band one.

QUESTION: One more integrated one — pause and attempt. "A school is building a portal where staff post content and students log in. Recommend an architecture and justify it, addressing data storage, security, accessibility, and whether to use a content management system." Plan it, then play.

NARRATOR: A strong answer: model it as three tiers — Front, Back, Store. The Front is built to web standards and made accessible per WCAG and POUR — sufficient contrast, keyboard operability, text alternatives — because a school portal must be inclusive. The Back handles routing and business logic in Python, and is where all authentication and authorisation happens — staff can post, students have read or limited access — and crucially all validation runs server-side, never trusting the client. The Store could be an S-Q-L database, a Spreadsheet of structured tables, because user accounts and their relationships are highly structured and need reliable transactions. Login must run over H-T-T-P-S with hashed passwords — hashing is one-way. Given the non-technical staff, a hosted content management system is sensible: it manages security updates and backups for them, trading some control for managed safety. That answer integrates the three tiers, security, accessibility, the database choice, and the C-M-S decision — every chapter, one question.

NARRATOR: Now the cross-topic traps in one place, because the exam deliberately tests the boundaries where students blur two ideas. Client-side versus server-side: validation must be server-side; the client is visible and tamperable. Hash versus encrypt: hashing is one-way, encryption is two-way. S-S-L versus T-L-S: T-L-S is the modern protocol. A certificate authenticates and carries a public key; it does not itself encrypt. Authentication versus authorisation: who you are versus what you can do. I-P address versus D-N-S name: the number versus the translator. Packets do not arrive in order. Responsive is not a P-W-A. NoSQL does not mean S-Q-L is obsolete. A framework is not always better. The W3C recommends, it does not enforce. Open source is not insecure or necessarily free. State each of those distinctions cleanly and you've covered the most common ways this module loses marks.

NARRATOR: And the forward bridge, because this module sets up the next. Across these ten episodes I kept saying "we cover the security properly later" — the T-L-S handshake, hashing versus encryption, digital signatures, the C-I-A triad, cross-site scripting on interactive pages, S-Q-L injection on the database, the validate-on-the-server rule, the supply-chain risk from the xz backdoor. Every one is cashed in by the next module, Secure Software Architecture. Programming for the Web showed you how the web is built; Secure Software Architecture shows you how it gets broken, and how to defend it. The hash-versus-encrypt line and the client-trust boundary you drilled here become central there. This isn't the end of these ideas — it's the launch pad.

NARRATOR: Close with your exam-dump checklist — the mnemonics to write on the page in the first sixty seconds, before you read a single question. I-E-P and MISO for applications. Dogs Take Tasty Hambones for the request journey. Eighty plain, four-four-three safe; twenty-two secure shell, twenty-one file for ports. Three Vs and M-M-S for big data. WIPS-M and POUR for standards and accessibility. Front, Back, Store for the tiers. E-N-S-P for dev tools. Structure, Style, Behaviour and C-FAN-H for design. F-T-C and BUILD-versus-BUY for libraries. L-C-C for open source. There's a consolidated cheat-sheet of all of them in Listing 1, and a cross-topic trap table in Listing 2. Dump those on the page and most of this module is already in front of you.

NARRATOR: A few quick-fire questions to finish, the recall kind the exam opens with. Pause on each, then play.

QUESTION: One. What does D-N-S do, in one sentence?

NARRATOR: It translates a human-readable domain name into the server's I-P address. Name, number, translator.

QUESTION: Two. Why must validation happen server-side?

NARRATOR: Because client-side code runs on the user's device and can be bypassed or altered, so only server-side validation can be trusted.

QUESTION: Three. Distinguish hashing from encryption.

NARRATOR: Hashing is one-way — it cannot be reversed; encryption is two-way — it is designed to be decrypted. Hash is one-way, encrypt is two-way.

QUESTION: Four. The exam asks you to "compare an interactive website with an e-commerce platform in terms of security." In one sentence, what's the core of a strong answer?

NARRATOR: That e-commerce requires comprehensive security — encryption, secure payment handling, authentication — because it processes money and sensitive data, where a breach causes direct financial and legal harm, whereas an interactive site needs only basic protection because its assets are lower-value. Drive it from the value of the asset and the consequence of failure.

NARRATOR: That's the module review for Web Foundations and Design. You can now trace the whole arc — packet to D-N-S to T-L-S to a three-tier, standards-based, accessible, well-chosen web application — with every mnemonic on one page and every trap named. Next we open Secure Software Architecture, and every security I-O-U this module wrote starts getting paid back. See you there.
