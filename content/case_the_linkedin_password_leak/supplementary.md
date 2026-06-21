---
title: "Supplementary Materials — The LinkedIn Password Leak"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the LinkedIn episode. Nothing here is spoken in the audio.

### Listing 1 — Timeline
```text
2012-06     6.5 million LinkedIn password hashes posted on a Russian forum
            Stored as UNSALTED SHA-1 — fast hash, no per-user salt
Within days Large proportion cracked back to plaintext passwords
2016-05     Full extent surfaces: ~117 million credentials from the same breach
Aftermath   Stolen pairs fuel CREDENTIAL-STUFFING attacks on other sites
            (working only because users reused passwords elsewhere)
```

### Listing 2 — The wrong way (what LinkedIn did) vs the right way
```python
import hashlib, os
from hashlib import scrypt   # a deliberately slow, salted password hash

# WRONG — fast, unsalted hash. "sunshine" always -> the SAME digest,
# so precomputed tables crack the whole database at once.
def store_password_wrong(password):
    return hashlib.sha1(password.encode()).hexdigest()

# RIGHT — unique random salt per user + a slow/expensive function.
def store_password_right(password):
    salt = os.urandom(16)                       # unique per user
    digest = scrypt(password.encode(), salt=salt,
                    n=2**15, r=8, p=1)           # n = work factor (slow on purpose)
    return salt.hex() + ":" + digest.hex()       # store salt WITH the hash

def verify(stored, attempt):
    salt_hex, digest_hex = stored.split(":")
    salt = bytes.fromhex(salt_hex)
    test = scrypt(attempt.encode(), salt=salt, n=2**15, r=8, p=1)
    return test.hex() == digest_hex
```

### Listing 3 — Secure password storage in NESA pseudocode
```text
BEGIN StorePassword
    salt   ← generate RANDOM value (unique per user)
    digest ← SLOW_HASH(password + salt)        // one-way, expensive on purpose
    SAVE (salt, digest)                         // never save the password itself
END StorePassword

BEGIN CheckPassword
    GET (salt, stored_digest) for this user
    test_digest ← SLOW_HASH(entered_password + salt)
    IF test_digest = stored_digest THEN
        GRANT access
    ELSE
        DENY access
    ENDIF
END CheckPassword
```

### Listing 4 — Why salt matters: two users, same password
```text
# UNSALTED (LinkedIn): identical passwords -> identical digests
  alice : sha1("sunshine")          = AAF4C61D...
  bob   : sha1("sunshine")          = AAF4C61D...   <- same! crack one, crack both

# SALTED: identical passwords -> completely different digests
  alice : slowhash("sunshine" + "x9$2") = 7B1E0C...
  bob   : slowhash("sunshine" + "Qm#7") = E4A902...  <- must attack each separately
```
