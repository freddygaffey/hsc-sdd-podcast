---
title: "Supplementary Materials — The 2016 Dyn DNS DDoS"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the Dyn / Mirai episode. Nothing here is spoken in the audio.

### Listing 1 — Timeline of 21 October 2016
```text
~07:00 ET  First wave hits Dyn's DNS infrastructure; east-coast users affected
~09:30 ET  First attack mitigated
Midday     Second, larger wave; outages spread more widely (incl. Europe)
Afternoon  Third wave; Dyn continues mitigation
Evening    Attack subsides; service restored
Attack     Distributed denial-of-service via the Mirai IoT botnet
Peak       Reported in the region of 1+ terabit/second of junk traffic
Effect     Twitter, Netflix, Reddit, Spotify, GitHub, PayPal and many more
           became unreachable — their own servers were fine; DNS lookups failed
```

### Listing 2 — How Mirai built its army: guessing factory-default passwords
```text
# Mirai roamed the internet and tried a short list of default credentials
# against IoT devices (cameras, DVRs, routers). A few of the ~60 it tried:

    admin     : admin
    root      : root
    root      : password
    root      : 123456
    admin     : (blank)
    support   : support
    guest     : guest
    root      : xc3511        # a common factory default on certain DVRs

# If a device still had its factory password, Mirai logged in, installed
# itself, and recruited the device — then used it to scan for the next one.
```

### Listing 3 — The fix at the device, in NESA pseudocode
```text
BEGIN DeviceFirstBoot
    IF password IS still the factory default THEN
        REFUSE to operate normally
        FORCE user to set a new, strong password      // secure = the default
    ENDIF
    DISABLE remote login unless explicitly enabled
END DeviceFirstBoot
```

### Listing 4 — Designing against a single point of failure, in NESA pseudocode
```text
BEGIN ResolveName
    answer ← ASK primary DNS provider
    IF primary DNS provider is unreachable THEN
        answer ← ASK secondary DNS provider     // redundancy, no single point
    ENDIF
    RETURN answer
END ResolveName
```
