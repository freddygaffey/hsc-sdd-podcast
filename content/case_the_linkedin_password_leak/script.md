---
title: "Six Million Locked Doors, One Key"
module: SSA
lesson: "case-study"
kind: case-study
supplementary: supplementary.md
---

NARRATOR: In June two thousand twelve, a file showed up on a Russian hacking forum. A plain list — millions of long, scrambled strings of letters and numbers. Six and a half million of them, to begin with. To the untrained eye it looked like gibberish, rows and rows of nonsense. But to the people on that forum, it was treasure. Those strings were passwords — or rather, the scrambled fingerprints of passwords — belonging to the users of LinkedIn, the professional networking site where hundreds of millions of people keep their careers, their contacts, and their working identities.

NARRATOR: Now, before you assume LinkedIn had done the obviously stupid thing and stored everyone's password in plain readable text — they hadn't. Not quite. To understand both what they got right and what they got catastrophically wrong, you need to know how passwords are supposed to be stored. This is the centre of the whole story.

NARRATOR: When you create an account on a well-built website, the site does not save your actual password. That would be reckless — anyone who stole the database, or any employee who peeked at it, would instantly have every password. Instead, the site runs your password through a hash function. A hash function is a one-way scrambler. You feed it your password, and out comes a fixed-length fingerprint — a unique-looking string. The crucial word is one-way. You can turn the password into the fingerprint, but you cannot turn the fingerprint back into the password. No reverse gear. So the site stores only the fingerprint. Next time you log in, it hashes whatever you typed and checks whether that fingerprint matches the stored one. If they match, you're in — and the site never had to keep your real password anywhere.

NARRATOR: That's the idea, and LinkedIn was doing it — storing hashed fingerprints, not plain passwords. So far, so responsible. The problem was how. They made two mistakes — two — that together turned a leaked database from an inconvenience into a massacre.

NARRATOR: The first mistake was the hash function they chose: one called S-H-A-one. S-H-A-one does produce a one-way fingerprint, so technically it's a hash. But it was designed to be fast — blisteringly fast, churning through enormous numbers of inputs per second. And for storing passwords, fast is exactly the wrong thing to want.

QUESTION: Why on earth would you ever want your password scrambler to be slow? Slow sounds like a defect. What's the logic?

NARRATOR: Here's the logic, and it's beautiful once it clicks. The fingerprint can't be reversed. So how does an attacker, holding only fingerprints, recover the actual passwords? They guess. They take a candidate password — say, "password one two three" — run it through the very same hash function, and check whether the resulting fingerprint appears in the stolen list. If it does, they've found someone whose password is "password one two three." They don't reverse the hash; they run it forwards, over and over, against an enormous dictionary of likely passwords, looking for matches. Now — if your hash function is fast, the attacker can try billions of guesses per second. If it's deliberately slow, say a tenth of a second per guess, trying billions would take centuries. Slowness is the defence. A purpose-built password hash is expensive on purpose, so guessing becomes hopelessly impractical. LinkedIn used a fast, general-purpose hash, so the attackers could guess at ferocious speed.

NARRATOR: And then the second mistake, which was the truly fatal one. LinkedIn's hashes were unsalted.

NARRATOR: Let me explain salt, the hero this story was missing. A salt is a small chunk of random data — different for every single user — that you mix into the password before you hash it. So even if two people both choose "sunshine," their salts differ, and their fingerprints come out completely different. Why does that matter so much? Because of a trick attackers love called a precomputed table. Ahead of time, an attacker takes a giant dictionary of common passwords and hashes every one, building a huge lookup table of "this password produces this fingerprint." Then, when they steal a database, they do no guessing at all — they just look up each stolen fingerprint in their pre-built table. Instant matches, for millions of accounts, in moments.

NARRATOR: Salt destroys that trick. Because each user has a unique random salt mixed in, the pre-built table is worthless — none of its fingerprints match, because none of them included your particular salt. The attacker is forced to attack each account individually, redoing all the work for every single user. Salt doesn't make any one password uncrackable, but it makes the bulk, crack-them-all-at-once approach impossible. And LinkedIn had no salt. None. Every "sunshine" in their database hashed to the exact same fingerprint as every other "sunshine."

NARRATOR: So put the two mistakes together. A fast hash, and no salt — the worst of both worlds. The attackers fed the stolen list straight into their cracking tools, and against fast, unsalted S-H-A-one, the passwords fell like dominoes. Within days, a huge proportion of those six and a half million were cracked — the common ones almost instantly, the weaker ones in hours. People's actual, plaintext passwords, laid bare.

NARRATOR: And it didn't stop there. Years later, in twenty-sixteen, the full scale finally surfaced: not six and a half million accounts, but around a hundred and seventeen million. The twenty-twelve leak had been just the tip. Over a hundred million LinkedIn credentials, the full set, out in the wild.

QUESTION: So a hundred million LinkedIn passwords get cracked. That's bad for LinkedIn — but here's the question that makes it bad for everyone. Why should you care about a leak from one website you might not even use much?

NARRATOR: Because of password reuse — the part that turns one company's breach into your problem. Most people use the same password, or small variations, across many sites — email, bank, shopping. So once an attacker has your LinkedIn password in plaintext, they don't stop at LinkedIn. They take your email address and that password and try them on site after site — your Gmail, your PayPal, your Amazon — betting that you reused it. This technique is called credential stuffing, and the LinkedIn dump, with a handful of other big leaks from the same era, became fuel for exactly that: vast automated campaigns trying stolen username-and-password pairs across the whole internet, breaking into accounts on services that were never breached at all, simply because their users had reused a password that leaked somewhere else.

[pause]

NARRATOR: So let's draw out what this teaches — one of the most precise, examinable lessons in all of security: the right way to store a password.

NARRATOR: First, and most fundamentally: passwords must be stored using a one-way hash, never reversible encryption. People mix these up constantly, so hold the distinction firmly. Encryption is two-way — whoever holds the key can decrypt the data and get the original back. That's what you want for a message that needs reading later. It is exactly what you do not want for a password, because if the data can be decrypted, a stolen key or a careless insider gets every password back in plaintext. Hashing is one-way — no key, no reverse gear, by design. The site can check a password without ever being able to recover it. So the rule, the one to carry into any exam or any real system: you hash passwords, you don't encrypt them.

NARRATOR: Second: every password gets a unique salt. Random, per-user, mixed in before hashing — its job is to defeat precomputed attacks, those pre-built lookup tables, and to ensure two people with the same password don't share a fingerprint. Salt forces an attacker to crack each account separately instead of all at once. Unsalted hashing was the single biggest reason the LinkedIn breach was so devastating.

NARRATOR: Third: the hash must be slow and expensive on purpose. A general-purpose hash like S-H-A-one is built for speed — wonderful for verifying a file, terrible for storing a password. For passwords you use a deliberately slow, deliberately costly algorithm designed for the job, so each guess takes real time, an attacker's billions of guesses per second collapses to a handful, and brute-forcing the list becomes economically hopeless. Slow is a feature.

NARRATOR: One-way hashing, a unique salt per user, a deliberately slow function. Get those three right and a stolen password database is a minor embarrassment instead of a catastrophe — the attacker has the fingerprints but can't turn them back into passwords at any useful scale. LinkedIn got the first idea half-right and the other two completely wrong, and a hundred million people paid for it.

NARRATOR: And the last lesson is yours to act on tonight. The breach didn't stay inside LinkedIn — it leaked outward through password reuse, into accounts on sites that did nothing wrong. The defence isn't something a website can do for you. It's a different password everywhere, ideally held in a password manager, so one site's bad day can never become the key to your whole digital life. Every reused password is a spare copy of your house key, scattered across the internet, waiting for one of those houses to be robbed.
