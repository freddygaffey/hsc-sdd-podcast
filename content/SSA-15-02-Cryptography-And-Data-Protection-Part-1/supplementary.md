---
title: "Supplementary Materials — Cryptography and Data Protection (Part 1)"
module: SSA
lesson: "15.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
hashing-vs-encryption distinction ("hash is one-way, encrypt is two-way") and secure password
storage: **hash it, salt it, slow it**. These listings show the wrong way next to the right way,
plus the register/verify flow in NESA-style pseudocode.

### Listing 1 — Password storage: the wrong ways vs. the right way (Python)

```python
import hashlib
import secrets
from cryptography.fernet import Fernet

# ---- WRONG 1: plaintext. A breach instantly exposes every password. ----
def store_plaintext(pw: str) -> str:
    return pw                                   # never do this

# ---- WRONG 2: encryption. Reversible — the key turns it all back to plaintext. ----
_key = Fernet.generate_key()                    # this key must live somewhere…
_cipher = Fernet(_key)
def store_encrypted(pw: str) -> bytes:
    return _cipher.encrypt(pw.encode())         # breach of DB + key = all passwords revealed
# You never need to DECRYPT a password — you only need to VERIFY it. So don't make it recoverable.

# ---- WRONG 3: a single FAST hash, no salt. Rainbow-table-able; billions of guesses/sec. ----
def store_fast_unsalted(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()   # deterministic → identical pws identical hashes

# ---- RIGHT: hash it, salt it, slow it. (PBKDF2 here; bcrypt/scrypt/argon2 also fine.) ----
def register(pw: str) -> dict:
    salt = secrets.token_bytes(16)                          # SALT: unique & random per user
    digest = hashlib.pbkdf2_hmac(                           # SLOW: key stretching
        "sha256", pw.encode(), salt, iterations=600_000     # high iteration count = expensive guess
    )
    return {"salt": salt.hex(), "hash": digest.hex(), "iters": 600_000}

def verify(pw: str, record: dict) -> bool:
    candidate = hashlib.pbkdf2_hmac(
        "sha256", pw.encode(), bytes.fromhex(record["salt"]), record["iters"]
    )
    # CONSTANT-TIME compare so timing can't leak the hash (see 17-02 side-channels).
    return secrets.compare_digest(candidate.hex(), record["hash"])
```

### Listing 2 — NESA pseudocode: register and verify a password

```text
BEGIN RegisterPassword(password)
    salt ← GenerateRandomSalt()
    storedHash ← SlowHash(password & salt)      // combine password WITH salt, then hash
    Save(salt, storedHash)                       // salt is stored, not secret
END RegisterPassword

BEGIN VerifyPassword(enteredPassword)
    Load(salt, storedHash)
    candidateHash ← SlowHash(enteredPassword & salt)
    IF ConstantTimeEqual(candidateHash, storedHash) THEN
        RETURN True
    ELSE
        RETURN False
    ENDIF
END VerifyPassword
```

### Listing 3 — NESA pseudocode: hashing for file/message integrity

```text
BEGIN CheckIntegrity(data, expectedHash)
    currentHash ← Hash(data)                     // one-way fingerprint; no key needed
    IF currentHash = expectedHash THEN
        DISPLAY "Integrity intact — data unchanged"
    ELSE
        DISPLAY "Integrity FAILED — data was modified"
    ENDIF
END CheckIntegrity
```
