---
title: "Supplementary Materials — Heartbleed"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the Heartbleed episode. Nothing here is spoken in the audio.

### Listing 1 — Timeline
```text
2011-12-31  Heartbleed bug introduced into OpenSSL (the heartbeat feature)
2012-03     Shipped in OpenSSL 1.0.1 — spreads to a huge share of web servers
2014-04-01  Bug independently found (Google's Neel Mehta; Codenomicon)
2014-04-07  Public disclosure as "Heartbleed", CVE-2014-0160; fixed in 1.0.1g
            Advice to the world: patch, then rotate ALL keys and passwords
Impact      Up to 64 KB of server memory leaked per request, no trace left:
            passwords, session tokens, and private TLS keys at risk
```

### Listing 2 — The bug: trusting the caller's length (the missing bounds check)
```c
/* Simplified illustration of the Heartbleed flaw. */

/* Attacker sends: payload = "hello" (5 bytes), but claims length = 65535 */
unsigned int payload_len = get_claimed_length(request);   /* attacker-controlled! */
char *payload            = get_payload(request);           /* only 5 real bytes  */

char *response = malloc(payload_len);      /* room for 65535 bytes              */
memcpy(response, payload, payload_len);    /* copies 65535 bytes from memory:   */
                                           /* 5 real + 65530 of WHATEVER was    */
                                           /* sitting next to it -> leaked back  */
send(response, payload_len);
```

### Listing 3 — The fix: check that the claimed length matches reality
```c
/* The real fix was a few lines: validate the length BEFORE copying. */

if (payload_len == 0) return 0;                 /* ignore empty heartbeats */
if (1 + 2 + payload_len + 16 > received_len)    /* claimed > what we got?  */
    return 0;                                   /* it's a lie — send nothing */

/* only now is it safe to echo `payload_len` bytes back */
```

### Listing 4 — The defensive rule in NESA pseudocode
```text
BEGIN HandleHeartbeat
    claimed_length ← length value SENT BY caller
    actual_length  ← number of bytes ACTUALLY received
    IF claimed_length > actual_length THEN
        REJECT heartbeat        // never read past what was really sent
    ELSE
        reply ← copy(payload, claimed_length)
        SEND reply
    ENDIF
END HandleHeartbeat
```
