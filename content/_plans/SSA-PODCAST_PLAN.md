# Podcast Plan — Secure Software Architecture (SSA)

> **What this file is.** The episode-by-episode brief an AI agent uses to write each
> script for this module. Read `../../STYLE.md` and `../../SUPPLEMENTARY.md`
> first — this file supplies *seeds*; STYLE.md supplies *form*. Each entry is a brief,
> not a script: expand it into a ~30–45 min script that passes the STYLE.md §9 checklist.
> Never teach two home topics in one episode.

---

## Module facts

- **Module acronym (frontmatter `module:`):** `SSA`
- **Outcomes in play (dominant):** SE-12-01, SE-12-03, SE-12-04, SE-12-05, SE-12-06, SE-12-07.
- **Teaching-order position:** **2nd** of the four Year 12 modules (after PFW). PFW left a trail of *"we'll cover the security properly in Secure Software Architecture"* forward-references — **this module cashes them all in.** Open episode 14-01 by recapping the relevant PFW promises (HTTPS/TLS in 11-03, SQL injection in 13-02, client-vs-server validation in 12-02/13-01).
- **Textbook source:** `docs/Year12/SecureSoftwareArchitecture/` chapters 14–19.
- **Naming & layout:** episode folder = `content/SSA-LL-Topic-Title/` (acronym in the folder name, e.g. `content/SSA-15-02-Cryptography-And-Data-Protection-Part-1/`); `module: SSA` in `script.md` frontmatter; reviews `SSA-XX-99-…`; case studies `case_…`. See the PFW plan for the frontmatter template (swap `module: SSA`) and `AUTHORING.md` for the two-file layout.

### Episode list (teaching order)

| # | Episode folder | Kind | Dot-point focus | Outcomes |
|---|----------|------|-----------------|----------|
| 1 | `SSA-14-01-The-Business-Case-For-Security` | lesson | benefits of secure software | SE-12-01 |
| 2 | `SSA-14-02-Integrating-Security-Into-The-SDLC` | lesson | secure dev steps | SE-12-01 |
| 3 | `SSA-14-03-User-Centered-Security-Design` | lesson | end-user capability & design | SE-12-03 |
| 4 | `SSA-15-01-CIA-Triad-And-AAA` | lesson | confidentiality…accountability | SE-12-07 |
| 5 | `SSA-15-02-Cryptography-And-Data-Protection-Part-1` | lesson | hashing vs encryption, password storage | SE-12-07 |
| 6 | `SSA-15-02-Cryptography-And-Data-Protection-Part-2` | lesson | symmetric/asymmetric, keys, TLS/certs | SE-12-07 |
| 7 | `SSA-16-01-Input-Validation-And-Sanitisation` | lesson | validation, sanitisation, error handling | SE-12-07 |
| 8 | `SSA-16-02-Privacy-By-Design` | lesson | privacy-by-design principles | SE-12-04 |
| 9 | `SSA-16-99-Module-Review-Security-Foundations-And-Principles` | module-review | Ch 14–16 | all |
| 10 | `SSA-17-01-Secure-API-Design` | lesson | safe API, sessions, CORS | SE-12-07 |
| 11 | `SSA-17-02-Secure-Execution-And-Resource-Management` | lesson | memory/session/exception mgmt | SE-12-07 |
| 12 | `SSA-18-01-Security-Testing-Fundamentals` | lesson | code review, SAST, DAST, pen test | SE-12-06 |
| 13 | `SSA-18-02-Web-Application-Vulnerabilities-Part-1` | lesson | XSS, CSRF, invalid forwarding/redirect | SE-12-07 |
| 14 | `SSA-18-02-Web-Application-Vulnerabilities-Part-2` | lesson | broken auth/session, race conditions, file/side-channel | SE-12-07 |
| 15 | `SSA-19-01-Security-In-Development-Teams` | lesson | collaboration benefits | SE-12-06 |
| 16 | `SSA-19-02-Enterprise-Security-Benefits` | lesson | enterprise benefits | SE-12-06 |
| 17 | `SSA-19-03-Security-Ethics-And-Legal-Considerations` | lesson | social/ethical/legal | SE-12-05 |
| 18 | `SSA-19-04-Evaluating-Security-Programs` | lesson | evaluation, metrics | SE-12-06 |
| 19 | `SSA-19-99-Module-Review-Secure-Software-Architecture` | module-review | whole module | all |

**Case studies (write as `case_…`, story-first; cash in later):**
- `case_the_xz_backdoor` — the 2024 near-miss supply-chain backdoor in xz/liblzma via a patient social-engineering maintainer takeover. The Veritasium-style flagship. Cashes into **14-02** (SDLC/dependencies), **18-01** (code review caught it), **19-01** (team/maintainer trust), **19-03** (open-source ethics), and PFW **12-06** (open source).
- `case_the_equifax_breach` — 2017, an unpatched Apache Struts vulnerability → 147M records. Cashes into **18-01** (vulnerability assessment / patch management), **14-01** (business case), **19-02** (enterprise cost), **19-03** (legal).
- `case_heartbleed` — 2014 OpenSSL buffer over-read leaks memory (incl. private keys). Cashes into **15-02-Part-2** (TLS), **17-02** (memory management), **18-01** (testing).

### Module-wide mnemonics (coin once, reuse everywhere)

- **CIA + AAA** → **"CIA-AAA"** spoken *"see-eye-ay, triple-A"* = Confidentiality, Integrity, Availability + Authentication, Authorisation, Accountability. **Tell students to dump this on the page in second one of the exam** (STYLE §5.4).
- **Defensive input handling** → **"VSE"** = *Validate, Sanitise, handle Errors*.
- **Privacy by Design (7 principles, exam-condensed)** → **"Proactive, Default, Embedded, Positive-sum, End-to-end, Visible, Respect"** = **"PD-E-PEV-R"**; or teach the 3 the syllabus names: *Proactive not reactive; Embed privacy into design; Respect for user privacy* → **"PER"**.
- **Security testing methods** → **"CR-SAST-DAST-VA-PEN"** chant = Code Review, Static, Dynamic, Vulnerability Assessment, Penetration testing.
- **User-action vulnerabilities (syllabus list)** → **"BX-IR"** = *Broken auth/session, Cross-site (XSS/CSRF), Invalid forwarding/redirect, Race conditions*.
- **SAST vs DAST** → **"Static = Source (not running); Dynamic = Doing (running)"**.
- **Hash vs encrypt** → **"Hash is one-way, Encrypt is two-way"** (the single most repeated line in the module — say it plainly, as exam phrasing, and in every recap).

---

## Episode briefs

### 14-01 — The business case for security
- **Source:** Ch 14 §14.1. **Outcomes:** SE-12-01.
- **Dot-points:** *Benefits of developing secure software — data protection; minimising cyber attacks and vulnerabilities.*
- **Teach:** why security is a business decision, not a technical luxury — cost of breaches vs cost of prevention, trust, compliance.
- **§5.1 recap:** Bridge from PFW — recap the PFW security "IOUs" (HTTPS 11-03, SQL injection 13-02, client/server validation). Frame: "PFW kept saying *later* — this is later."
- **Interleave:** forward → every later SSA episode; link → e-commerce trust (PFW 11-01); story → seed `case_the_equifax_breach` (don't tell it fully — that's its own episode — just reference the stakes).
- **Mnemonics:** benefits → **"protect Data, prevent Attacks"** (D-A); introduce that CIA-AAA is coming.
- **Worked example seed:** quantify a breach (records × cost/record + fines + trust) vs a security budget; model a "justify investment in security" answer (SE-12-01 = *justifies*).
- **Exam seeds:** "Justify the investment in secure software development for an e-commerce business." (extended) / "Outline two benefits of secure software."
- **Appendix:** Listing 1 — a simple breach-cost calculation (Python). 
- **Traps:** treating security as pure cost; "we're too small to be targeted".

### 14-02 — Integrating security into the SDLC
- **Source:** Ch 14 §14.2. **Outcomes:** SE-12-01.
- **Dot-points:** *Interpret and apply fundamental software development steps to develop secure code — requirements, specifications, design, development, integration, testing & debugging, installation, maintenance.*
- **Teach:** security as a thread through every SDLC phase ("shift left"), with threat modelling at requirements.
- **§5.1 recap:** business case (14-01); D-A; the PFW SDLC echoes Year 11 software development (backward link).
- **Interleave:** backward → SDLC steps first met in Year 11 PF11 01-01 (same eight steps, security lens now); forward → testing phase = 18-01; story → `case_the_xz_backdoor` lives in the *dependencies/maintenance* phase.
- **Mnemonics:** the 8 steps → reuse the Year 11 hook if one exists; add **"shift left"** = fix it early/cheap.
- **Worked example seed:** take one feature (login) and name a security activity at each SDLC phase.
- **Exam seeds:** "Explain how security is addressed across the software development life cycle." (6)
- **Appendix:** Listing 1 — a threat-model table (STRIDE-lite, text); Listing 2 — NESA pseudocode for a secure-login flow at design stage.
- **Traps:** "bolt security on at the end"; equating testing with security.

### 14-03 — User-centred security design
- **Source:** Ch 14 §14.3. **Outcomes:** SE-12-03.
- **Dot-points:** *How the capabilities and experience of end users influence the secure design features of software.*
- **Teach:** security that fits the user (or gets bypassed) — usability/security balance, abuse cases, secure defaults.
- **§5.1 recap:** SDLC/shift-left (14-02); business case.
- **Interleave:** link → UI/UX & accessibility (PFW 12-04); forward → MFA/session UX returns in 17-01; contrast → "secure but unusable" vs "usable but insecure".
- **Mnemonics:** **"Secure default, easy right path"**.
- **Worked example seed:** redesign a password policy that users currently write on sticky notes; weak vs strong answer.
- **Exam seeds:** "Explain how end-user capability influences secure design choices."
- **Appendix:** Listing 1 — a usable password-strength check (Python).
- **Traps:** blaming users; "more friction = more secure".

### 15-01 — CIA triad and AAA
- **Source:** Ch 15 §15.1. **Outcomes:** SE-12-07.
- **Dot-points:** *Fundamental security concepts — confidentiality, integrity, availability, authentication, authorisation, accountability.*
- **Teach:** the six foundational properties, precisely defined and distinguished.
- **§5.1 recap:** user-centred design (14-03); SDLC; business case. This is the conceptual heart — flag it.
- **Interleave (heavy):** backward → authentication/authorisation first met in PFW 11-03 (now defined properly); forward → every vuln in 18-02 is a CIA-AAA property being broken; link → availability ties to PFW 11-04 architecture & `case_the_dyn_dns_ddos`.
- **Mnemonics:** **"CIA-AAA"** — coin it as the marquee hook; tell them to write it down first in the exam. Distinguish **authentication (who you are)** vs **authorisation (what you may do)** — the #1 confused pair.
- **Worked example seed:** for one scenario (online banking), name a control for each of the six properties.
- **Exam seeds:** "Distinguish between authentication and authorisation." (classic) / "For each element of the CIA triad, describe one threat and one control." (extended)
- **Appendix:** Listing 1 — access-control check + audit log (Python, hits authorisation + accountability); Listing 2 — NESA pseudocode for role-based access check.
- **Traps:** auth/authz confusion; conflating integrity with confidentiality.

### 15-02 — Cryptography and data protection — Part 1 (hashing vs encryption, password storage)
- **Source:** Ch 15 §15.2 (split). **Outcomes:** SE-12-07.
- **Dot-points (this part):** *Contribution of cryptography to 'security by design'* — hashing, password storage. (Keys/TLS in Part 2.)
- **Teach:** hashing vs encryption and how to store passwords (hash + salt, slow hashes).
- **§5.1 recap:** CIA-AAA (15-01); confidentiality/integrity.
- **Interleave:** backward → "hash values" mentioned in PFW 11-03 (now the real thing); forward → digital signatures & TLS in Part 2; link → integrity (15-01).
- **Mnemonics:** **"Hash is one-way, Encrypt is two-way"** (coin/reuse relentlessly). **"Salt stops the rainbow"** (salting defeats rainbow tables).
- **Worked example seed:** show the wrong way (plain-text / MD5) vs right way (salted bcrypt/argon2); weak vs strong answer phrasing.
- **Exam seeds:** "Explain why hashing, not encryption, is used to store passwords." (4) / "Describe the role of a salt." 
- **Appendix:** Listing 1 — insecure vs salted-hash password storage (Python); Listing 2 — NESA pseudocode for register/verify.
- **Traps:** "hashing is encryption"; reversible "encryption" of passwords; unsalted hashes.

### 15-02 — Cryptography and data protection — Part 2 (keys, symmetric/asymmetric, TLS, certificates)
- **Source:** Ch 15 §15.2 (split). **Outcomes:** SE-12-07.
- **Dot-points (this part):** symmetric/asymmetric encryption, encryption keys & key management, certificates/TLS, digital signatures; *sandboxing* contribution to security by design.
- **Teach:** how key pairs, certificates and TLS protect data in transit, and what sandboxing isolates.
- **§5.1 recap:** Part 1 (Hash one-way / Encrypt two-way); CIA-AAA.
- **Interleave:** backward → completes the PFW 11-03 TLS handshake promise; link → confidentiality + non-repudiation (15-01); story → seed `case_heartbleed` (TLS implementation bug); forward → secure transport assumed by APIs (17-01).
- **Mnemonics:** **"Symmetric = Same key (fast, sharing problem); Asymmetric = A pair (slow, solves sharing)"**. Digital signature → **"sign with private, verify with public"**. Sandbox → **"a playpen the code can't climb out of"**.
- **Worked example seed:** explain hybrid encryption (asymmetric to swap a symmetric session key) — exactly the HTTPS story at exam depth.
- **Exam seeds:** "Distinguish symmetric and asymmetric encryption." / "Explain how a digital signature provides non-repudiation." / "Describe how sandboxing contributes to security by design."
- **Appendix:** Listing 1 — symmetric encrypt/decrypt (Python); Listing 2 — sign/verify with a key pair; Listing 3 — NESA pseudocode for signature verification.
- **Traps:** certificate "encrypts" (it authenticates + carries public key); confusing signing with encrypting.

### 16-01 — Input validation and sanitisation
- **Source:** Ch 16 §16.1. **Outcomes:** SE-12-07.
- **Dot-points:** *Defensive data input handling — input validation, sanitisation, error handling.* (Marquee module dot-point.)
- **Teach:** never trust input — validate (allow-list), sanitise/escape, fail safely. This is the cash-in for the PFW SQL-injection forward-ref.
- **§5.1 recap:** crypto Parts 1–2; CIA-AAA; "Hash one-way / Encrypt two-way".
- **Interleave (heavy):** backward → **the unsanitised `/search` route and string-built SQL from PFW 13-01/13-02 — fix them here** (the big payoff); forward → XSS/CSRF detailed in 18-02 are input-handling failures; story → seed `case_the_equifax`? no — better: input-injection family (Log4Shell as optional mention).
- **Mnemonics:** **"VSE"** = Validate, Sanitise, handle Errors. **"Allow-list beats block-list"** (whitelist > blacklist).
- **Worked example seed:** registration form — show injection-vulnerable handler, then the validated + parameterised + safe-error version; weak vs strong answer.
- **Exam seeds:** "Explain the difference between validation and sanitisation." / "Describe how parameterised queries prevent SQL injection." / code-editor: "fix this vulnerable input handler."
- **Appendix:** Listing 1 — vulnerable vs hardened input handler (Python); Listing 2 — parameterised query (callback to PFW 13-02 Listing 2); Listing 3 — NESA pseudocode for validate-then-process.
- **Traps:** block-list thinking; leaking stack traces in error messages; client-side-only validation.

### 16-02 — Privacy by design
- **Source:** Ch 16 §16.2. **Outcomes:** SE-12-04.
- **Dot-points:** *'Privacy by design' approach — proactive not reactive; embed privacy into design; respect for user privacy.* Also data protection/regulatory compliance.
- **Teach:** designing systems that collect/keep the least, by default, with the user respected.
- **§5.1 recap:** VSE / input handling (16-01); CIA-AAA (confidentiality).
- **Interleave:** backward → PFW 12-01 W3C privacy (prelude paid off); forward → legal/ethical ramifications = 19-03; contrast → privacy (about data) vs security (about access).
- **Mnemonics:** **"PER"** = *Proactive, Embed, Respect* (the three named in the syllabus). Add **"collect less, keep less"** (data minimisation).
- **Worked example seed:** redesign a sign-up that over-collects (DOB, address, phone) down to what's needed; justify each cut.
- **Exam seeds:** "Explain the principle of privacy by design." / "Describe data minimisation and why it reduces risk."
- **Appendix:** Listing 1 — a data-minimising user model vs an over-collecting one.
- **Traps:** privacy = security (distinct); consent theatre; retaining data "just in case".

### 16-99 — Module review: Security foundations and principles (Ch 14–16)
- **Kind:** module-review. **Outcomes:** all SSA so far.
- **Job:** weld the *mindset* (14), the *principles* (15), and *input/privacy* (16) into one frame. Re-surface CIA-AAA, Hash-one-way, Symmetric/Asymmetric, VSE, PER. Heavy `QUESTION:` voice; integrated stimulus ("here's a vulnerable login + storage + form — find every CIA-AAA violation"). Flag the big confusions: auth vs authz, hash vs encrypt, validation vs sanitisation, privacy vs security.
- **Exam seeds:** one extended integrated question + several distinguish/define items.

### 17-01 — Secure API design
- **Source:** Ch 17 §17.1. **Outcomes:** SE-12-07.
- **Dot-points:** *Design, develop and implement a safe API to minimise software vulnerabilities.* Plus *session management* and user-action controls (broken auth/session — overlaps 18-02).
- **Teach:** how to expose a safe interface — authentication (API keys/OAuth/JWT), authorisation, rate limiting, secure sessions, CORS/same-origin.
- **§5.1 recap:** input handling (16-01 VSE); CIA-AAA; crypto (TLS assumed).
- **Interleave:** backward → CORS/same-origin previewed in PFW 12-03; backward → the API is the back-end boundary from PFW 13-01; forward → broken auth/session deep-dive in 18-02.
- **Mnemonics:** API hardening → **"A-A-R-T"** = *Authenticate, Authorise, Rate-limit, Transport-secure*.
- **Worked example seed:** secure a public `/api/orders` endpoint — add auth, scope authorisation, rate-limit, validate. Weak vs strong answer.
- **Exam seeds:** "Describe three measures to secure an API." (6) / "Explain the purpose of rate limiting."
- **Appendix:** Listing 1 — token-auth + rate-limit Flask route (Python); Listing 2 — NESA pseudocode for an auth+authorise gate.
- **Traps:** auth without authorisation (logged in ≠ allowed); secrets in URLs; relying on CORS as access control.

### 17-02 — Secure execution and resource management
- **Source:** Ch 17 §17.2. **Outcomes:** SE-12-07.
- **Dot-points:** *Efficient execution — memory management, session management, exception management.* Plus *protect file/hardware from file attacks and side-channel attacks*.
- **Teach:** keeping the running program safe — memory safety, session lifecycle, exception/secret handling, resisting resource-exhaustion, file & side-channel attacks.
- **§5.1 recap:** secure API / A-A-R-T (17-01); VSE.
- **Interleave:** story → `case_heartbleed` (memory over-read) pays off here; backward → exception handling echoes Year 11 error handling (PF11 04-07); forward → race conditions & side-channel detailed in 18-02-Part-2.
- **Mnemonics:** **"M-S-E"** = *Memory, Session, Exception* management. Side-channel → "the secret leaks through *timing/power/sound*, not the front door".
- **Worked example seed:** show an exception that leaks a stack trace + secret vs a safe handler; a constant-time comparison vs a leaky one.
- **Exam seeds:** "Explain how poor exception handling can create a vulnerability." / "Describe a side-channel attack."
- **Appendix:** Listing 1 — safe vs leaky exception handling (Python); Listing 2 — constant-time compare; Listing 3 — resource limit / timeout.
- **Traps:** leaking secrets in logs/errors; assuming high-level languages = no memory issues; ignoring timing leaks.

### 18-01 — Security testing fundamentals
- **Source:** Ch 18 §18.1. **Outcomes:** SE-12-06.
- **Dot-points:** *Strategies to manage security of code — code review, SAST, DAST, vulnerability assessment, penetration testing.* Plus *test and evaluate security/resilience — vulnerabilities, hardening, breach handling, business continuity, disaster recovery.*
- **Teach:** the toolbox for *finding* weaknesses and the lifecycle for *surviving* incidents.
- **§5.1 recap:** secure execution / M-S-E (17-02); A-A-R-T; VSE.
- **Interleave (heavy):** story → `case_the_xz_backdoor` (code review caught it) **and** `case_the_equifax_breach` (missed vulnerability assessment / patch) both pay off here; forward → 18-02 are the bugs these methods find; backward → testing types echo Year 11 OOP11 06-05/06-06 (black/white/grey box) — security lens.
- **Mnemonics:** **"CR-SAST-DAST-VA-PEN"** (coin/reuse). **"Static = Source; Dynamic = Doing"**. Incident lifecycle → **"H-B-D"** = *Harden, Breach-handle, Disaster-recover*.
- **Worked example seed:** for one app, say what SAST vs DAST vs pen testing each would catch that the others miss.
- **Exam seeds:** "Distinguish between SAST and DAST." (4) / "Explain the role of penetration testing." / "Outline a disaster recovery plan for a web service."
- **Appendix:** Listing 1 — a SAST-style lint finding annotated; Listing 2 — a DAST request probe (text).
- **Traps:** SAST/DAST confusion; "we tested it = it's secure"; no DR plan.

### 18-02 — Web application vulnerabilities — Part 1 (XSS, CSRF, invalid forwarding/redirect)
- **Source:** Ch 18 §18.2 (split). **Outcomes:** SE-12-07.
- **Dot-points (this part):** *Secure code to minimise vulnerabilities in user action controls — cross-site scripting (XSS) and cross-site request forgery (CSRF); invalid forwarding and redirecting.*
- **Teach:** the cross-site family — how XSS and CSRF work and the fixes (escaping/CSP; anti-CSRF tokens/SameSite); open-redirect abuse.
- **§5.1 recap:** testing methods (18-01 CR-SAST-DAST-VA-PEN); input handling VSE (16-01); CIA-AAA.
- **Interleave:** backward → the unescaped `/search` from PFW 13-01 **is** reflected XSS — close the loop loudly; backward → CSRF abuses the session/auth from 17-01; link → these are integrity/confidentiality breaks (15-01).
- **Mnemonics:** **"XSS = inject Script; CSRF = ride a Session"**. Part of the **"BX-IR"** list (Cross-site, Invalid redirect).
- **Worked example seed:** reflected XSS in a search route → fix by escaping + CSP; a CSRF money-transfer → fix with a token. Weak vs strong answer.
- **Exam seeds:** "Describe how XSS occurs and one mitigation." (4) / "Distinguish XSS from CSRF." (4)
- **Appendix:** Listing 1 — reflected XSS Flask route + escaped fix (Python); Listing 2 — CSRF token check; Listing 3 — safe-redirect allow-list.
- **Traps:** XSS/CSRF confusion (script injection vs forged request); open redirects as "harmless".

### 18-02 — Web application vulnerabilities — Part 2 (broken auth/session, race conditions, file & side-channel attacks)
- **Source:** Ch 18 §18.2 (split). **Outcomes:** SE-12-07.
- **Dot-points (this part):** *broken authentication and session management; race conditions;* and *protect user file and hardware vulnerabilities from file attacks and side-channel attacks.*
- **Teach:** session/auth failures, time-of-check/time-of-use race conditions, path-traversal/file attacks, side-channels.
- **§5.1 recap:** Part 1 (XSS inject / CSRF ride-session); A-A-R-T (17-01); M-S-E (17-02).
- **Interleave:** backward → secure sessions from 17-01; backward → side-channel/memory from 17-02 and `case_heartbleed`; link → race conditions echo concurrency (forward-link to any automation/threading content).
- **Mnemonics:** completes **"BX-IR"** (Broken-auth, Race). Race → **"TOCTOU"** = *Time-Of-Check to Time-Of-Use*. File attack → "../ climbs out — path traversal".
- **Worked example seed:** a double-spend race on a balance → fix with locking/atomic update; a path-traversal download → fix by canonicalising + allow-list.
- **Exam seeds:** "Explain how a race condition can be exploited." / "Describe a file-based attack and its mitigation."
- **Appendix:** Listing 1 — racy vs atomic balance update (Python); Listing 2 — path-traversal-safe file read; Listing 3 — NESA pseudocode for an atomic check-and-update.
- **Traps:** assuming single-threaded = no races; trusting filenames from users.

### 19-01 — Security in development teams
- **Source:** Ch 19 §19.1. **Outcomes:** SE-12-06.
- **Dot-points:** *Benefits of collaboration to develop safe and secure software — various points of view; delegating by expertise; quality of solution.*
- **Teach:** how teams produce more secure software (reviews, pairing, shared threat modelling, knowledge sharing).
- **§5.1 recap:** vulnerabilities (18-02 BX-IR); testing (18-01); the maintainer-trust angle of `case_the_xz_backdoor`.
- **Interleave:** story → `case_the_xz_backdoor` (a *trust*/team failure as much as technical); backward → collaboration & version control (PFW 12-06, Year 11); forward → SEE 24-05 (collaboration & communication) reuses this.
- **Mnemonics:** collaboration benefits → **"V-D-Q"** = *Views, Delegate-by-expertise, Quality*.
- **Worked example seed:** how a security code review with diverse reviewers catches what a solo dev misses.
- **Exam seeds:** "Explain how collaboration improves the security of software." (4–6)
- **Appendix:** Listing 1 — a security review checklist (text).
- **Traps:** "more people = automatically more secure"; bystander effect in reviews.

### 19-02 — Enterprise security benefits
- **Source:** Ch 19 §19.2. **Outcomes:** SE-12-06.
- **Dot-points:** *Benefits to an enterprise of safe/secure practices — improved products/services; influence on future development; improved work practices; productivity; business interactivity.*
- **Teach:** the organisational payoff of doing security well.
- **§5.1 recap:** team benefits (19-01 V-D-Q); business case (14-01) — explicit expanding-interval callback (STYLE §5.5).
- **Interleave:** backward → ties straight to 14-01 (open/close the business arc); story → `case_the_equifax_breach` cost as the counterfactual.
- **Mnemonics:** enterprise benefits → **"PIP-PB"** = *Products, Influence, Practices, Productivity, Business-interactivity*.
- **Worked example seed:** show how secure-by-default tooling raises team productivity (fewer incidents, faster audits).
- **Exam seeds:** "Explain three benefits to an enterprise of secure development practices." (6)
- **Appendix:** none required (concept-heavy) — optional metrics table.
- **Traps:** listing only technical benefits; ignoring productivity/trust.

### 19-03 — Security ethics and legal considerations
- **Source:** Ch 19 §19.3. **Outcomes:** SE-12-05.
- **Dot-points:** *Evaluate social, ethical and legal issues — employment, data security, privacy, copyright, intellectual property, digital disruption.*
- **Teach:** the human/legal fallout of (in)secure software; responsible disclosure; IP/copyright/open-source ethics.
- **§5.1 recap:** enterprise benefits (19-02); privacy by design (16-02 PER).
- **Interleave:** story → `case_the_xz_backdoor` (open-source ethics, disclosure) and `case_the_equifax_breach` (legal/regulatory); backward → privacy (16-02); forward → SEE 24-05 social/ethical issues.
- **Mnemonics:** SELL issues → **"E-D-P-C-I-D"** = *Employment, Data security, Privacy, Copyright, IP, Digital disruption*.
- **Worked example seed:** responsible disclosure dilemma — you find a vuln in a vendor's product; what's the ethical path? weak vs strong answer.
- **Exam seeds:** "Evaluate the social and legal implications of a major data breach." (extended, SE-12-05 = *explains/evaluates*)
- **Appendix:** none required.
- **Traps:** treating ethics as optional/soft; confusing copyright with IP broadly.

### 19-04 — Evaluating security programs
- **Source:** Ch 19 §19.4. **Outcomes:** SE-12-06.
- **Dot-points:** *Apply and evaluate strategies to manage security of code* (evaluation lens); measuring effectiveness, metrics, audits, continuous improvement.
- **Teach:** how you *measure* whether security is working and improve it.
- **§5.1 recap:** ethics/SELL (19-03); testing methods (18-01); enterprise benefits.
- **Interleave:** backward → ties metrics to the testing toolbox (18-01) and incident lifecycle (H-B-D); forward → SEE 26-03 evaluation reuses the "criteria + evidence" shape.
- **Mnemonics:** evaluation loop → **"M-A-I"** = *Measure, Audit, Improve*.
- **Worked example seed:** define 3 security KPIs for a web service and how you'd act on each.
- **Exam seeds:** "Describe how an organisation evaluates the effectiveness of its security program." (6)
- **Appendix:** Listing 1 — a metrics dashboard table (text).
- **Traps:** vanity metrics; measuring activity not outcomes.

### 19-99 — Module review: Secure Software Architecture
- **Kind:** module-review. **Outcomes:** all SSA.
- **Job:** the full-scale weave — from *why* (14), through *principles* (15), *input/privacy* (16), *systems/APIs* (17), *testing/vulns* (18), to *context/ethics* (19). Re-surface every mnemonic, especially **CIA-AAA** (the exam-dump hook). Heavy `QUESTION:` voice with integrated stimulus questions that span multiple chapters (e.g. "Here is a vulnerable web app — identify the CIA-AAA violations, name the OWASP-style flaws, propose fixes, and justify the testing strategy"). Pull all three case studies together. Bridge forward to **Software Automation** (next module).
- **Traps to consolidate:** auth vs authz, hash vs encrypt, validation vs sanitisation, SAST vs DAST, XSS vs CSRF, privacy vs security.
- **Exam seeds:** one large stimulus + a rapid-fire distinguish/define round mirroring objective-response items.
```
