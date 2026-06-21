---
title: "Module Review — Security Foundations and Principles (Chapters 14–16)"
module: SSA
lesson: "14–16"
kind: module-review
supplementary: supplementary.md
---

NARRATOR: This is a review episode — no new content. We've finished the foundations block of Secure Software Architecture: chapters fourteen, fifteen and sixteen. Today we weld it into one frame, re-surface every mnemonic in one pass, run integrated questions that span the whole block the way real exam questions do, and flag the confusions the marker exploits. There are a lot of questions — answering out loud is the point. Let's pull the eight episodes since the bridge from Programming for the Web into a single shape.

NARRATOR: The arc, in one breath. Chapter fourteen is the mindset — why security matters, how it threads through development, how it fits real people. Chapter fifteen is the principles — the six foundational properties and the cryptography that delivers them. Chapter sixteen is the practice on data — defensive input handling, and privacy by design. Why, before what, before how-with-data. Now let's walk it and reload every hook.

NARRATOR: Chapter fourteen. Episode one, the business case: security is an enabler, not just a cost; the two benefits are D-A — protect Data, prevent Attacks; prevention is far cheaper than response; and risk equals Likelihood times Impact. Episode two, the software development life cycle: security-by-design, built into every phase, not bolted on — shift left, because fixing flaws early is far cheaper. The eight steps were "Really Smart Developers Don't Ignore Testing In Maintenance" — Requirements, Specifications, Design, Development, Integration, Testing, Installation, Maintenance — and threat modelling used STRIDE: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege. Episode three, user-centred security design: the security-usability paradox — difficult security gets bypassed, so usability is a security requirement — captured as "secure default, easy right path."

NARRATOR: Chapter fifteen. Episode one, the conceptual heart and the single most valuable thing in the module: C-I-A-A-A. The C-I-A triad is what we protect — Confidentiality is secrecy, who can read it; Integrity is accuracy, whether it can be changed; Availability is access, whether you can reach it. Triple-A is how we protect it — Authentication is who you are; Authorisation is what you may do; Accountability is what you did. The exam move: dump C-I-A-A-A in the margin in second one, and answer every control question as property, control, effect. Episodes two and three, cryptography: hashing is one-way, encryption is two-way — encrypt when you need it back, hash when you only need to verify. Passwords get hashed, salted, slowed — salt stops the rainbow. Encryption splits into symmetric — the Same key, fast, sharing problem — and asymmetric — A pair, slow, solves sharing; H-T-T-P-S marries them as hybrid encryption after a certificate authenticates the server. A digital signature is sign-with-private, verify-with-public, giving non-repudiation. Keys are Generated, Stored, Rotated, Destroyed. And sandboxing isolates code so a compromise is contained.

NARRATOR: Chapter sixteen. Episode one, defensive input handling: never trust input; the three practices are V-S-E — Validate, Sanitise, handle Errors. Allow-list beats block-list. Parameterised queries kill S-Q-L injection by separating data from command; output encoding kills cross-site scripting; both are the same disease, input becoming code. Errors: log it private, show it generic. Episode two, privacy by design: privacy is not security; the three principles are PER — Proactive, Embed, Respect; and data minimisation means collect less, keep less, because the safest data is data you never held.

NARRATOR: That's the whole block, and every one of those hooks is dump-able on the exam page. Now the real work — integrated questions. The HSC doesn't test one episode at a time; it hands you a scenario and makes you reach across the block. Pause and attempt each before I answer.

QUESTION: Big one to start. Pause the player for this — it's worth the most. Here's the scenario: a small online store stores customer passwords as plain S-H-A two-fifty-six hashes with no salt; builds its product-search S-Q-L by concatenating the user's search text; serves its checkout over plain H-T-T-P; collects every customer's date of birth and phone number "for future use" and keeps them forever; and shows a full database stack trace when something goes wrong. Identify the violations across C-I-A-A-A and the foundations block, and propose a fix for each. Pause now, work through all five, then play.

NARRATOR: First, the marking boundary. A weak answer says "the site isn't secure — it should use better passwords and encryption." True, but vague, and it scores almost nothing. A strong answer names the property, the flaw, and the fix for each issue. Hear the difference as I take them one by one. One: unsalted fast hashes. That's a confidentiality weakness in credential storage — identical passwords hash identically and rainbow tables crack them fast. Fix: hash it, salt it, slow it — a unique salt per user and a slow algorithm like bcrypt or Argon-two. Two: S-Q-L built by concatenation. That's an integrity and confidentiality flaw — S-Q-L injection lets input become command and read or alter the whole database. Fix: parameterised queries, separating data from command, plus allow-list validation. Three: checkout over plain H-T-T-P. That's a confidentiality failure in transit — card numbers travel in clear text, open to eavesdropping. Fix: H-T-T-P-S, which is T-L-S — a certificate authenticates the server, then hybrid encryption protects the traffic. Four: collecting and keeping unnecessary data forever. That's a privacy failure — it violates data minimisation, retention limits, and respect for user privacy. Fix: collect only what's needed, set a retention policy, delete the rest — collect less, keep less. Five: the stack trace shown to users. That's an information-disclosure flaw and a failure of safe error handling — and it undermines accountability too. Fix: log it private, show it generic. Five flaws, five fixes, each tied to a named property — that's a band-six integrated response.

NARRATOR: Now the confusions. Half the marks lost in this module come from blurring two things that sound alike. Rapid distinguish questions — the exact format the HSC uses.

QUESTION: Distinguish authentication from authorisation. Pause, answer, then play.

NARRATOR: Authentication is verifying who you are — proving identity, and it comes first. Authorisation is determining what you're allowed to do — checking permission, and it comes second. Logging into the school portal is authentication; that you can see your own grades but not change them or see anyone else's is authorisation. The trap: "logged in is not allowed" — being authenticated doesn't mean you're authorised. We'll see that fail for real as broken access control in chapter eighteen.

QUESTION: Distinguish confidentiality from integrity. Pause, answer, then play.

NARRATOR: Confidentiality is about who can read the data — preventing unauthorised disclosure. Integrity is about whether the data can be changed — preventing unauthorised modification. They fail independently: a spy who reads but doesn't alter breaks confidentiality only; a vandal who scrambles but can't read breaks integrity only. Confidentiality is secrecy; integrity is trustworthiness. Don't blur them into "keeps data safe."

QUESTION: Distinguish hashing from encryption — and say which one you use for passwords and why. Pause, answer, then play.

NARRATOR: Hashing is one-way and irreversible — a fixed-size fingerprint, used to verify; encryption is two-way and reversible with a key, used when you need the data back. You hash passwords, not encrypt them, because you only ever verify a login, never recover the password — so a breach doesn't expose the passwords. Encryption's key would be a liability. Hash is one-way, encrypt is two-way — the most repeated line in the module.

QUESTION: Distinguish validation from sanitisation. Pause, answer, then play.

NARRATOR: Validation checks input against rules and rejects what doesn't conform — a gate. Sanitisation transforms, cleans or escapes input to make it safe to use, rather than rejecting it. Validation rejects; sanitisation cleans. You typically validate first to throw out clearly bad input, then sanitise what you keep before you use it.

QUESTION: Distinguish privacy from security. Pause, answer, then play.

NARRATOR: Security protects data from unauthorised access — keeping attackers out. Privacy governs whether you should collect personal data at all, and how you use, retain and consent to it. You can have perfect security and still violate privacy, by harvesting and selling data nobody breached. Security is about access; privacy is about appropriate handling.

QUESTION: And one more, the symmetric-asymmetric pair. Distinguish them and say why H-T-T-P-S uses both. Pause, answer, then play.

NARRATOR: Symmetric uses one shared key, is fast, and has the key-distribution problem; asymmetric uses a public-private key pair, solves distribution, but is slow and small-data only. H-T-T-P-S uses hybrid encryption: asymmetric once at the handshake to agree a symmetric session key, then symmetric for the bulk traffic — distribution solved, and fast. Symmetric is the Same key; asymmetric is A pair.

NARRATOR: One more integrated scenario — applying the mnemonics together is the skill that separates bands. A "design" question, the kind worth six or eight marks.

QUESTION: A start-up is building a telehealth app that stores patients' medical notes and lets doctors and patients message. Pause the player and plan: how would the foundations block — fourteen, fifteen, sixteen — guide its secure design? Pause now, structure an answer across the block, then play.

NARRATOR: Here's the integrated shape. From chapter fourteen: treat security as a business enabler and a legal necessity given the sensitive data; build it in across the whole life cycle with shift-left and threat modelling using STRIDE at design; and design for real users — secure default, easy right path — so doctors aren't tempted to bypass clunky security. From chapter fifteen: apply C-I-A-A-A directly — confidentiality with encryption at rest and T-L-S in transit; integrity with hashing and input validation on notes; availability with redundancy so the service is reachable; authentication with multi-factor for doctors; authorisation with role-based access and least privilege so a patient sees only their own records; and accountability with an audit log of every access to a medical note. Store credentials hashed, salted and slowed; sign critical records for non-repudiation. From chapter sixteen: defensive input handling with V-S-E and parameterised queries on every field; and privacy by design — PER — with strict data minimisation, because medical data is the most sensitive there is, plus retention limits and genuine consent. A response that reaches across all three chapters, names the mnemonics, and ties each to the telehealth context is full marks. That's the point of interleaving: the exam rewards the web, not the isolated fact.

NARRATOR: One more retrieval lap — rapid recall of the hooks. Writing them down fast in the exam is free marks. Quick fire: you answer, I confirm.

QUESTION: What does C-I-A-A-A stand for, and which group is "what we protect"? Pause, then play.

NARRATOR: Confidentiality, Integrity, Availability — that's the triad, what we protect. Authentication, Authorisation, Accountability — triple-A, how we protect it.

QUESTION: What are the three defensive input handling practices, and the three privacy-by-design principles? Pause, then play.

NARRATOR: Input handling is V-S-E — Validate, Sanitise, handle Errors. Privacy by design is PER — Proactive, Embed, Respect. Two tiny acronyms covering two whole dot-points.

QUESTION: Give me the password-storage recipe and the line about hashing versus encryption. Pause, then play.

NARRATOR: Hash it, salt it, slow it. And: hashing is one-way, encryption is two-way. If you can dump C-I-A-A-A, V-S-E, PER, "hash one-way encrypt two-way," D-A and "secure default easy right path" on the page in the first thirty seconds of the exam, you've armed yourself with most of this block before you've read a question.

NARRATOR: Lock in the whole block. The mindset: security is an enabler, built in across the life cycle, designed for real users. The principles: C-I-A-A-A, delivered by cryptography — hash one-way, encrypt two-way; symmetric same-key, asymmetric a-pair; sign-with-private. The practice on data: never trust input, V-S-E; and privacy by design, PER, collect less keep less. The traps the marker sets: authentication versus authorisation, confidentiality versus integrity, hash versus encrypt, validation versus sanitisation, and privacy versus security. Know those five distinctions cold and you've defended the most-targeted marks in the module.

NARRATOR: Exam-style finish — five questions spanning the block, recall up to extended response. Pause and attempt each before the model answer.

QUESTION: Question one. Outline two benefits of developing secure software. Pause, then play.

NARRATOR: Model answer: the two benefits are data protection — safeguarding the confidentiality and integrity of sensitive personal and financial data — and minimising cyber attacks and vulnerabilities, which reduces the likelihood and impact of breaches. Beyond these, secure software builds customer trust, meets regulatory compliance, and is far cheaper than responding to a breach. Naming the two syllabus benefits — protect Data, prevent Attacks — is the mark.

QUESTION: Question two. Explain why hashing, not encryption, is used to store passwords. Pause, then play.

NARRATOR: Model answer: passwords are hashed because hashing is one-way and irreversible, so a breach of the password store does not reveal the actual passwords. The system never needs to recover a password — at login it only verifies a match by hashing the entered password and comparing. Encryption would be reversible and require a key that turns the stored values back into real passwords; if that key were compromised too, every password would be exposed. Naming irreversibility, verify-not-recover, and the key-as-liability point is the mark.

QUESTION: Question three. Explain how parameterised queries prevent S-Q-L injection. Pause, then play.

NARRATOR: Model answer: S-Q-L injection occurs when user input is concatenated into a S-Q-L command, letting the input alter the query's structure. A parameterised query defines the query with placeholders and passes the user values separately; the database compiles the query first and treats the values purely as data, so input can never become part of the command. Naming the separation of query from data is the mark.

QUESTION: Question four. Distinguish between privacy and security, with an example showing one can fail while the other holds. Pause, then play.

NARRATOR: Model answer: security protects data from unauthorised access; privacy governs whether personal data should be collected and how it is used and retained. An app could encrypt all data and enforce strict access control — strong security — while continuously collecting and selling users' location data they never agreed to share — a serious privacy violation with no breach at all. Security held; privacy failed. Naming the access-versus-handling distinction with the example is the mark.

QUESTION: Question five, the extended one. A web application has a login, a user database, and a comment feature that displays user comments to others. Using the security principles from this module, explain how you would make it secure. Pause, plan a structured response, then play.

NARRATOR: Model answer: apply the C-I-A-A-A frame and the chapter-sixteen practices together. For the login: authenticate with multi-factor, store passwords hashed, salted and slowed, and serve everything over T-L-S for confidentiality in transit. For the database: use parameterised queries on every access to prevent S-Q-L injection, validate all input against an allow-list on the server, and apply least-privilege authorisation so users reach only their own data. For the comment feature: sanitise on output by H-T-M-L-escaping comments before display to prevent cross-site scripting. Across all of it: handle errors safely by logging detail privately and showing generic messages; log security-relevant actions for accountability; and apply privacy by design — minimise the personal data collected and stored. A strong response names the relevant properties from C-I-A-A-A, applies V-S-E, names specific mechanisms — salted slow hashing, parameterised queries, output encoding, least privilege, T-L-S — and integrates privacy. That's full marks.

NARRATOR: That closes the foundations block. You now hold the mindset, the six properties, the cryptography that delivers them, defensive input handling, and privacy by design — and you've drilled the five distinctions the marker tests. Next, chapter seventeen applies all of this to real systems, starting with secure A-P-I design, where the input-validation and authentication-and-authorisation ideas you just consolidated become the rules for exposing a safe interface to the world. The foundations are laid; now we build on them. See you there.
