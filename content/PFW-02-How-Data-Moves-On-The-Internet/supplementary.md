---
title: "Supplementary Materials — How Data Moves on the Internet"
module: PFW
lesson: "11.2"
script: script.md
---

# Supplementary Materials

Read-along code and pseudocode for this episode. Nothing here is spoken. The narration
teaches the request journey (Dogs Take Tasty Hambones = DNS → TCP → TLS → HTTP), the
IPv4 format, and DNS resolution; these listings let you see the concrete shapes.

### Listing 1 — Annotated `dig` / `nslookup` output (a real DNS answer)

```text
$ dig shop.example.com

;; QUESTION SECTION:
;shop.example.com.        IN    A          # asking for the A record (IPv4 address)

;; ANSWER SECTION:
shop.example.com. 3600   IN    A   93.184.216.34
                  ^^^^                ^^^^^^^^^^^^^
                  |                   the IP address DNS resolved the name to
                  TTL in seconds (3600 = cache this answer for 1 hour)

;; Query time: 28 msec          # first lookup walks the hierarchy; later ones hit cache

# nslookup shows the same name -> IP mapping in a simpler form:
$ nslookup shop.example.com
Name:    shop.example.com
Address: 93.184.216.34          # the "number" the human-friendly "name" maps to
```

### Listing 2 — Reassembling out-of-order packets, in NESA pseudocode

```text
BEGIN ReassembleMessage
    received ← {}                       // store packets keyed by sequence number
    highest ← 0

    WHILE more packets arriving
        GET packet
        received[packet.sequenceNumber] ← packet.payload
        IF packet.sequenceNumber > highest THEN
            highest ← packet.sequenceNumber
        ENDIF
    ENDWHILE

    message ← ""
    FOR n = 1 TO highest
        IF received[n] EXISTS THEN
            message ← message + received[n]     // rebuild in sequence order
        ELSE
            REQUEST resend OF packet n          // a gap = a lost packet
        ENDIF
    NEXT n

    RETURN message
END ReassembleMessage
```

### Listing 3 — Resolving a hostname to its IP address(es) in Python (what DNS does for you)

```python
import socket

hostname = "example.com"

# IPv4 (A records) — the "four numbers, 0-255, dots between" addresses
ipv4 = sorted({rec[4][0] for rec in socket.getaddrinfo(hostname, None, family=socket.AF_INET)})
print("IPv4:", ipv4)        # e.g. ['93.184.216.34']

# IPv6 (AAAA records) — the newer format that solves IPv4 address exhaustion
ipv6 = sorted({rec[4][0] for rec in socket.getaddrinfo(hostname, None, family=socket.AF_INET6)})
print("IPv6:", ipv6)        # e.g. ['2606:2800:220:1:248:1893:25c8:1946']

# socket.getaddrinfo() IS a DNS lookup: you hand it a name, it returns the IP address(es).
```
