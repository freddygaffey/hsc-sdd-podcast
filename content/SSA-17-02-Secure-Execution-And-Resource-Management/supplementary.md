---
title: "Supplementary Materials — Secure Execution and Resource Management"
module: SSA
lesson: "17.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches secure
execution via **M-S-E: Memory, Session, Exception management** (plus resource limits), and the two
back-door attacks — **file attacks** (path traversal: "dot-dot-slash climbs out") and
**side-channel attacks** ("secret leaks through timing — use constant-time comparison"). These
listings show the safe vs leaky versions and NESA-style pseudocode.

### Listing 1 — Memory: validate length before reading (the Heartbleed lesson) (Python)

```python
# Heartbleed in miniature: trusting a client-supplied length before a memory read.
def read_payload_VULNERABLE(buffer: bytes, claimed_length: int) -> bytes:
    return buffer[:claimed_length]          # over-read: returns ADJACENT memory if too big

def read_payload_SAFE(buffer: bytes, claimed_length: int) -> bytes:
    actual = len(buffer)
    if claimed_length < 0 or claimed_length > actual:   # validate the length FIRST
        raise ValueError("invalid length")              # never trust a size from input
    return buffer[:claimed_length]

# Stream large input in chunks instead of loading it whole (resource exhaustion guard):
def hash_large_file(path, hasher):
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):   # bounded memory, not f.read()
            hasher.update(chunk)
    return hasher.hexdigest()
```

### Listing 2 — Resource limits & timeouts: prevent exhaustion / DoS-from-inside (Python)

```python
MAX_UPLOAD = 10 * 1024 * 1024        # cap input size
MAX_CONCURRENT = 50                  # cap concurrent operations
REQUEST_TIMEOUT = 5                  # seconds — no operation hangs forever

def accept_upload(data: bytes, active_ops: int):
    if len(data) > MAX_UPLOAD:
        raise ValueError("file too large")          # bound the resource
    if active_ops >= MAX_CONCURRENT:
        raise RuntimeError("server busy")           # fail securely under load
    # ... process with REQUEST_TIMEOUT applied to any blocking call ...
```

### Listing 3 — Exception management: log private, show generic, fail securely (Python)

```python
import logging
logger = logging.getLogger("security")

def transfer_funds(user, amount):
    try:
        check_authorised(user, "transfer")      # if this raises, we must FAIL CLOSED
        do_transfer(user, amount)
        return "ok", None
    except PermissionError:
        return None, "Action not permitted."     # generic; default to DENY, not allow
    except Exception as exc:
        logger.error("transfer failed user=%s err=%s", user.id, exc)  # full detail INTERNAL
        return None, "A temporary error occurred."   # NEVER return the stack trace
```

### Listing 4 — File attack: path traversal vs canonicalised allow-listed read (Python)

```python
import os

DOWNLOADS = "/srv/app/downloads"

def read_file_VULNERABLE(filename):
    return open(os.path.join(DOWNLOADS, filename)).read()
    # filename = "../../../etc/passwd"  → "dot-dot-slash climbs out" of DOWNLOADS

def read_file_SAFE(filename):
    base = os.path.basename(filename)                       # strip any path components
    full = os.path.realpath(os.path.join(DOWNLOADS, base))  # canonicalise to real absolute path
    if not full.startswith(DOWNLOADS + os.sep):             # verify it stays INSIDE DOWNLOADS
        raise ValueError("invalid path")
    return open(full).read()
```

### Listing 5 — Side-channel: timing-leaky vs constant-time comparison (Python)

```python
import secrets

# LEAKY: returns early on first mismatch → time reveals how many leading chars are correct.
def compare_LEAKY(a: str, b: str) -> bool:
    if len(a) != len(b):
        return False
    for x, y in zip(a, b):
        if x != y:
            return False        # early exit = timing side channel
    return True

# SAFE: constant-time — always inspects the whole input, leaking no timing information.
def compare_SAFE(a: str, b: str) -> bool:
    return secrets.compare_digest(a, b)
```

### Listing 6 — NESA pseudocode: path-traversal-safe file read

```text
BEGIN ReadUserFile(requestedName, baseDir)
    safeName ← BaseNameOnly(requestedName)            // remove ../ and path parts
    fullPath ← Canonicalise(baseDir + "/" + safeName) // resolve to real absolute path
    IF NOT StartsWith(fullPath, baseDir) THEN
        DISPLAY "Invalid file request"                // climbed out → reject
        RETURN
    ENDIF
    RETURN ReadFile(fullPath)
END ReadUserFile
```

### Listing 7 — NESA pseudocode: constant-time secret comparison

```text
BEGIN ConstantTimeEqual(a, b)
    IF Length(a) ≠ Length(b) THEN
        RETURN False
    ENDIF
    diff ← 0
    FOR i ← 0 TO Length(a) - 1
        diff ← diff OR (ByteAt(a, i) XOR ByteAt(b, i))   // never exit early
    NEXT i
    RETURN (diff = 0)                                     // same time regardless of match
END ConstantTimeEqual
```
