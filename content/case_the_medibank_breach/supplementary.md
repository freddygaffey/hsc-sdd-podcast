---
title: "Supplementary Materials — The Medibank Breach"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the case study. Nothing here is spoken in the audio. The
code listings are deliberately minimal and illustrative — they show the *shape* of
the mechanism, not Medibank's real systems.

### Listing 1 — Timeline of the Medibank breach
```text
2022-08-07   An IT contractor's credentials — including ones reaching into Medibank's
             network — are stolen from their malware-infected personal device, where
             they had been saved in a browser.

2022-08      Attackers log in to Medibank's remote-access VPN using the stolen
             username + password ONLY. No multi-factor authentication is required, so
             the stolen password is enough to get in.

2022-08-24/25  Medibank's own EDR security tooling raises alerts about suspicious
             behaviour. The alerts are not triaged / acted on properly in time.

2022-08-25 → 10-13  Attackers move through the network and exfiltrate ~520 GB from the
             customer databases — names, DoB, addresses, Medicare and passport
             numbers, and highly sensitive health/claims data for ~9.7M people.

2022-10      Breach detected and disclosed. Attackers (linked to Russian ransomware)
             demand ~US$10M ransom and threaten to publish the data.

2022-11      Medibank refuses to pay (a position backed by the Australian government).
             Attackers begin leaking data on the dark web, including lists curated by
             condition (e.g. mental health, drug/alcohol, pregnancy terminations).

2024         Australian Privacy Commissioner's report criticises failures, centrally
             the lack of enforced MFA on the access used.
```

### Listing 2 — Why one factor fails and two factors hold (illustrative)
```text
SINGLE FACTOR (what Medibank's remote access used):
    login = correct_password ?            -> grant access
    Problem: a stolen password is indistinguishable from the real user.
    Stolen password  ==  full access.

MULTI-FACTOR (what should have been enforced):
    login = correct_password ?            -> first check passes
            AND valid second factor ?     -> e.g. one-time code / security key
                                             (something you HAVE, not just KNOW)
    Stolen password alone  ==  blocked, because the thief has no second factor.
```

### Listing 3 — Single-factor vs. MFA login check, in NESA pseudocode
```text
BEGIN AuthenticateUser
    GET username, password
    IF password DOES NOT match stored hash FOR username THEN
        DENY access
        RETURN
    ENDIF

    // Single-factor would STOP here and grant access — this is the gap.
    // Multi-factor adds a second, different proof:

    code ← prompt user for one-time code from their registered device
    IF code IS NOT valid FOR username
       AND WITHIN the time window THEN
        DENY access                       // password known, but device not held
    ELSE
        GRANT access                      // something you know + something you have
    ENDIF
END AuthenticateUser
```

### Listing 4 — The wider extortion / ransomware shape (illustrative, plain terms)
```text
DOUBLE-EXTORTION (data theft + threat to publish), as in Medibank:
    1. Gain access (here: stolen credentials, no MFA).
    2. Move laterally; locate the most sensitive data.
    3. Exfiltrate a copy quietly over weeks.
    4. Demand ransom; threaten to PUBLISH if unpaid.
    5. If unpaid -> leak the data (here: lists curated by condition).

    Note: classic ransomware ENCRYPTS your files and sells the key.
    Double-extortion's leverage is the harm of PUBLICATION, not loss of access.
    Refusing to pay avoids funding/rewarding crime, but cannot un-leak the data.
```
