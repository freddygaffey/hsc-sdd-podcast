---
title: "Supplementary Materials — Cryptography and Data Protection (Part 2)"
module: SSA
lesson: "15.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches symmetric
vs asymmetric encryption ("Same key" vs "A pair"), the hybrid TLS handshake, key management
(Generate, Store, Rotate, Destroy), digital signatures ("sign with private, verify with public"),
and sandboxing. These listings show the real crypto operations and the NESA-style pseudocode for
signature verification and the handshake.

### Listing 1 — Symmetric encryption with AES/Fernet (Python)

```python
from cryptography.fernet import Fernet

# SYMMETRIC = the SAME key encrypts and decrypts. Fast → good for bulk data.
# The whole challenge is getting this one secret key to the other party safely.
key = Fernet.generate_key()          # keep this secret; both sides need the SAME value
cipher = Fernet(key)

ciphertext = cipher.encrypt(b"10 GB backup contents...")   # encrypt with the shared key
plaintext  = cipher.decrypt(ciphertext)                    # decrypt with the SAME key
assert plaintext == b"10 GB backup contents..."
```

### Listing 2 — Asymmetric encryption with an RSA key pair (Python)

```python
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# ASYMMETRIC = A PAIR. Public key is shared freely; private key is kept secret.
private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key = private_key.public_key()        # hand this out to the world

# Anyone can ENCRYPT to you with your PUBLIC key...
ciphertext = public_key.encrypt(
    b"a small secret (e.g. a session key)",   # RSA only handles small data → slow, limited
    padding.OAEP(mgf=padding.MGF1(hashes.SHA256()), algorithm=hashes.SHA256(), label=None),
)
# ...but only YOU can DECRYPT with your PRIVATE key.
plaintext = private_key.decrypt(
    ciphertext,
    padding.OAEP(mgf=padding.MGF1(hashes.SHA256()), algorithm=hashes.SHA256(), label=None),
)
```

### Listing 3 — Hybrid encryption: asymmetric to swap a symmetric session key (Python)

```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

# This is the TLS idea: use slow asymmetric ONCE to share a fast symmetric key.
def establish_session(server_public_key):
    session_key = Fernet.generate_key()              # 1. fresh SYMMETRIC session key
    wrapped = server_public_key.encrypt(             # 2. ASYMMETRIC-encrypt it to the server
        session_key,
        padding.OAEP(mgf=padding.MGF1(hashes.SHA256()), algorithm=hashes.SHA256(), label=None),
    )
    return Fernet(session_key), wrapped              # client keeps the cipher; sends `wrapped`

# After this, ALL bulk traffic uses the fast symmetric `session_key` — best of both.
```

### Listing 4 — Digital signature: sign with private, verify with public (Python)

```python
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

# SIGN with the PRIVATE key → authenticity + integrity + non-repudiation (NOT secrecy).
def sign(private_key, document: bytes) -> bytes:
    return private_key.sign(                          # internally: hash the doc, then sign the hash
        document,
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
        hashes.SHA256(),
    )

# VERIFY with the matching PUBLIC key. Raises if the doc changed or the signer is wrong.
def verify(public_key, document: bytes, signature: bytes) -> bool:
    try:
        public_key.verify(
            signature, document,
            padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
            hashes.SHA256(),
        )
        return True              # only the holder of the private key could have produced this
    except Exception:
        return False             # tampered document OR forged signature
```

### Listing 5 — Key management lifecycle: Generate, Store, Rotate, Destroy (Python)

```python
import secrets
from datetime import datetime, timedelta, timezone

class KeyManager:
    def __init__(self):
        self.keys = {}           # in production: a hardware security module / secrets manager

    def generate(self, key_id, expiry_days=90):
        self.keys[key_id] = {
            "value": secrets.token_bytes(32),                 # GENERATE from a secure RNG
            "created": datetime.now(timezone.utc),
            "expires": datetime.now(timezone.utc) + timedelta(days=expiry_days),
            "status": "active",
        }

    def rotate(self, old_id, new_id):
        self.generate(new_id)                                 # new key takes over
        self.keys[old_id]["status"] = "deprecated"            # keep briefly for decrypt-only
        # ROTATION limits the exposure window of any single key.

    def destroy(self, key_id):
        self.keys[key_id]["value"] = b"\x00" * 32             # overwrite, then drop
        del self.keys[key_id]
```

### Listing 6 — NESA pseudocode: verifying a digital signature

```text
BEGIN VerifySignature(document, signature, senderPublicKey)
    computedHash ← Hash(document)                       // hash the document ourselves
    signedHash   ← Decrypt(signature, senderPublicKey)  // undo the sign with the PUBLIC key
    IF computedHash = signedHash THEN
        DISPLAY "Valid: unchanged AND from the claimed sender (non-repudiation)"
        RETURN True
    ELSE
        DISPLAY "Invalid: tampered OR not from the claimed sender"
        RETURN False
    ENDIF
END VerifySignature
```

### Listing 7 — NESA pseudocode: the TLS handshake (hybrid encryption)

```text
BEGIN TLSHandshake(server)
    certificate ← server.SendCertificate()
    IF VerifyWithTrustedCA(certificate) = False THEN
        DISPLAY "Untrusted server — abort"
        RETURN
    ENDIF
    serverPublicKey ← certificate.PublicKey            // server now AUTHENTICATED
    sessionKey ← GenerateSymmetricKey()                // fresh fast key
    wrappedKey ← Encrypt(sessionKey, serverPublicKey)  // ASYMMETRIC to share it safely
    Send(wrappedKey)
    REPEAT
        message ← EncryptSymmetric(data, sessionKey)   // SYMMETRIC for all bulk traffic
        Send(message)
    UNTIL connectionClosed
END TLSHandshake
```
