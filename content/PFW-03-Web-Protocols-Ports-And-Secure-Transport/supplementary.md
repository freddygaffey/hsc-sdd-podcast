---
title: "Supplementary Materials — Web Protocols, Ports and Secure Transport"
module: PFW
lesson: "11.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
port chant ("80 plain, 443 safe; 22 secure shell, 21 file"), the HTTPS/TLS handshake, and
the securing-the-web concepts that Secure Software Architecture later covers in full.

### Listing 1 — Protocol / port reference table

```text
Protocol   Purpose                         Default port   Secure?
--------   -----------------------------   ------------   -----------------------------
HTTP       Web pages (hypertext)           80             No  — plain text ("80 plain")
HTTPS      Web pages over TLS              443            Yes — encrypted ("443 safe")
SSH        Secure remote shell             22             Yes ("22 secure shell")
SFTP       File transfer over SSH          22             Yes (rides on SSH)
FTP        File transfer (legacy)          21             No  — plain text ("21 file")
DNS        Name -> IP resolution           53             Usually plain (DoH uses 443)
SMTP       Sending email                   25 (587 sub.)  STARTTLS / 465 for SMTPS
POP3       Retrieving email                110 (995 TLS)  POP3S on 995
IMAP       Retrieving/syncing email        143 (993 TLS)  IMAPS on 993

Mnemonic: "80 plain, 443 safe; 22 secure shell, 21 file."  (DNS answers on 53.)
```

### Listing 2 — Symmetric vs asymmetric encryption (Python, conceptual)

```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# --- Symmetric: ONE shared key encrypts AND decrypts ("Same key"). Fast. ---
key = Fernet.generate_key()
cipher = Fernet(key)
ct = cipher.encrypt(b"card number 4532...")   # plain text -> cipher text
pt = cipher.decrypt(ct)                        # same key reverses it
# Problem: both parties must already share `key` secretly.

# --- Asymmetric: a PAIR of keys ("A pair"). Public encrypts, private decrypts. Slow. ---
private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key = private_key.public_key()          # shareable openly

ct2 = public_key.encrypt(                       # anyone can encrypt with the public key
    b"shared session key",
    padding.OAEP(mgf=padding.MGF1(hashes.SHA256()), algorithm=hashes.SHA256(), label=None),
)
pt2 = private_key.decrypt(                       # only the private-key holder can decrypt
    ct2,
    padding.OAEP(mgf=padding.MGF1(hashes.SHA256()), algorithm=hashes.SHA256(), label=None),
)

# This is exactly what TLS does: use ASYMMETRIC once to agree a session key,
# then switch to fast SYMMETRIC encryption for the bulk traffic.
```

### Listing 3 — Verifying a digital signature, in NESA pseudocode

```text
BEGIN VerifySignature
    GET message, signature, senderPublicKey

    computedHash ← Hash(message)                  // hash the received content
    signedHash ← Decrypt(signature, senderPublicKey)  // undo the private-key signing

    IF computedHash = signedHash THEN
        DISPLAY "Valid — authentic and untampered"   // authenticity + non-repudiation
    ELSE
        DISPLAY "Invalid — forged or altered"
    ENDIF
END VerifySignature
```

### Listing 4 — Inspecting a real TLS certificate (Python stdlib)

```python
import ssl, socket

def show_certificate(hostname, port=443):
    ctx = ssl.create_default_context()
    with socket.create_connection((hostname, port), timeout=10) as sock:
        with ctx.wrap_socket(sock, server_hostname=hostname) as ssock:
            cert = ssock.getpeercert()
            subject = dict(x[0] for x in cert["subject"])
            issuer = dict(x[0] for x in cert["issuer"])
            print("Domain it is valid for:", subject.get("commonName"))
            print("Signed by (CA):       ", issuer.get("commonName"))  # the Certificate Authority
            print("Valid until:          ", cert["notAfter"])
            print("TLS version:          ", ssock.version())            # e.g. TLSv1.3

show_certificate("github.com")
# The certificate AUTHENTICATES the server and carries its public key —
# it does not itself encrypt the data; the negotiated keys do that.
```
