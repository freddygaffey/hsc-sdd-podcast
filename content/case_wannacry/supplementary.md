---
title: "Supplementary Materials — WannaCry"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the WannaCry episode. Nothing here is spoken in the audio.

### Listing 1 — Timeline
```text
2017-03-14  Microsoft releases patch MS17-010, closing the SMB flaw EternalBlue uses
2017-04     The Shadow Brokers leak NSA tools, including EternalBlue, publicly
2017-05-12  WannaCry launches: ransomware + self-spreading worm via EternalBlue (SMB)
            Spreads to ~200,000 machines across ~150 countries within days
            UK NHS hit hard: cancelled surgeries, diverted ambulances
2017-05-12  Marcus Hutchins registers a hard-coded "kill switch" domain (~$10) — halts spread
Aftermath   Damage estimated in the billions; every infection was an UNPATCHED machine
```

### Listing 2 — Why a worm beats a phishing email: spread with no clicks
```text
# Ordinary ransomware: needs a human mistake, infects ONE machine
    user clicks malicious attachment  ->  1 machine encrypted

# WannaCry (worm): no human needed, infects the whole network
    1 infected machine
        -> scans local network for machines with the SMB flaw
        -> uses EternalBlue to run its code on each, no login required
        -> each new victim repeats the scan  ->  exponential spread
```

### Listing 3 — The kill switch, in NESA pseudocode
```text
BEGIN WannaCryStartup
    IF can connect to "long-nonsense-domain" THEN
        STOP            // do nothing (the accidental kill switch)
    ELSE
        ENCRYPT victim's files
        DEMAND ransom in Bitcoin
        SPREAD to other machines via the SMB flaw
    ENDIF
END WannaCryStartup
```

### Listing 4 — The defences that would have stopped it, in NESA pseudocode
```text
BEGIN PatchManagement
    FOR each machine IN organisation
        IF a security patch is available (e.g. MS17-010) THEN
            APPLY patch promptly       // would have closed the EternalBlue hole
        ENDIF
    NEXT machine
END PatchManagement

BEGIN RansomwareRecovery        // business continuity / disaster recovery
    IF files are encrypted by ransomware THEN
        WIPE infected machine
        RESTORE files FROM recent OFFLINE backup
        DO NOT pay the ransom
    ENDIF
END RansomwareRecovery
```
