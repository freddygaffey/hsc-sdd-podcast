---
title: "Supplementary Materials — The Target Breach"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the Target episode. Nothing here is spoken in the audio.

### Listing 1 — Timeline / attack chain
```text
~2013-09/11  Attackers phish Fazio Mechanical (Target's HVAC vendor); steal its credentials
2013-11-15ish Attackers use the vendor login to enter Target's network
              Network is flat -> they pivot from building systems toward payment systems
~2013-11-27  Memory-scraping malware installed on point-of-sale (POS) registers
2013-11/12   ~40M card numbers + ~70M people's details exfiltrated over the holidays
2013-11/12   Security monitoring (FireEye) FIRES ALERTS — staff do not act in time
2013-12-15   Breach confirmed; malware removed
2013-12-19   Public disclosure
Aftermath    Hundreds of millions in costs; settlements; CEO resigns
```

### Listing 2 — The pivot: why a flat network was fatal
```text
# What SHOULD have been true (segmented network):
    [ Vendor / HVAC zone ] --X-- (no path) --X-- [ Payment / POS zone ]

# What WAS true at Target (flat-ish network):
    [ Vendor / HVAC zone ] -------- reachable -------- [ Payment / POS zone ]
            ^ stolen vendor login                            ^ card data here
    Result: a building-management credential reached the cash registers.
```

### Listing 3 — POS memory scraper (the idea, not real malware)
```text
# Card data must be briefly UNENCRYPTED in register memory to be processed.
# The malware grabbed it in that instant:

LOOP forever
    scan register's memory for a pattern that looks like a card number
    IF found THEN
        copy it to a hidden file
    ENDIF
    periodically send the hidden file to attacker's server
END LOOP
```

### Listing 4 — The defences, in NESA pseudocode
```text
BEGIN LeastPrivilege
    FOR each account (incl. third-party vendors)
        GRANT only the access needed for its job
        IF account requests something outside its role THEN
            DENY and LOG
        ENDIF
    NEXT account
END LeastPrivilege

BEGIN RespondToAlert        // the step Target skipped (accountability)
    alert ← monitoring system detects suspicious activity
    ASSIGN alert to a named responsible person
    person MUST investigate within set time
    IF malware confirmed THEN
        ISOLATE affected systems
        CONTAIN and remediate
    ENDIF
END RespondToAlert
```
