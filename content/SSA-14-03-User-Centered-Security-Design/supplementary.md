---
title: "Supplementary Materials — User-Centred Security Design"
module: SSA
lesson: "14.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
security-usability paradox, how end users shape secure design, "secure default, easy right
path", and personas vs abuse cases.

### Listing 1 — A usable password check: passphrases + live guidance (Python)

```python
import re

# User-centred: REWARD long passphrases (easy to remember, hard to crack) instead of
# demanding cryptic complexity that drives sticky-note workarounds.
def assess_password(pw: str) -> dict:
    length = len(pw)
    issues = []
    if length < 12:
        issues.append("Use at least 12 characters — a short phrase of a few words works well.")
    if pw.lower() in COMMON_PASSWORDS:
        issues.append("That password is commonly used and easily guessed.")

    # Strength rises mainly with LENGTH (entropy), not with forced symbols.
    strength = "strong" if length >= 16 else "ok" if length >= 12 and not issues else "weak"
    return {
        "strength": strength,
        "issues": issues,                 # shown LIVE as the user types (contextual guidance)
        "hint": "Tip: four random words like 'otter-piano-cloud-ladder' is strong and memorable.",
    }
# Secure DEFAULT: combine with MFA so the password isn't the only line of defence,
# and offer safe recovery so a mistake isn't a permanent lockout.
```

### Listing 2 — Progressive security: match strength to the action's risk

```text
Action (frequency / risk)            Authentication required          Why
-----------------------------------  -------------------------------  ------------------------------
Check account balance (often/low)    PIN or biometric                 fast path for low-risk task
Upload a document (med/med)          password + SMS code              sensitive data involved
Large transfer / final submit (rare/high)  password + MFA + extra     irreversible, high impact

Principle: don't force heavy friction on every action — escalate only with risk.
"Secure default, easy right path": the safe option is on by default AND is the easy option.
```

### Listing 3 — User personas vs. abuse cases (model BOTH)

```text
USER PERSONA (legitimate use → keep security USABLE)
  Alex, student. Moderate skill. Phone + shared family PC, public WiFi. Simple passwords.
  Needs: protection that doesn't get in the way of schoolwork; clear recovery if locked out.

ABUSE CASE (malicious use → keep security EFFECTIVE)
  Attacker: failing student.   Method: change own grade via URL manipulation / session hijack.
  Impact: academic fraud.      Design response: authorisation checks + audit logging + validation.

  Attacker: identity thief.    Method: phishing / credential stuffing to harvest personal data.
  Impact: identity theft.      Design response: data minimisation + MFA + user education.

Trap: blaming users for a design failure ("just tell them not to write it down") fixes nothing.
      Treat bypasses as DESIGN problems. More friction != more secure.
```
