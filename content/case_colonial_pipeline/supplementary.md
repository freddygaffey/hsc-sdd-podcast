---
title: "Supplementary Materials — Colonial Pipeline"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the Colonial Pipeline episode. Nothing here is spoken in the audio.

### Listing 1 — Timeline
```text
~2021-04-29  DarkSide gains access via a leaked password for an inactive VPN account
             The VPN account had NO multi-factor authentication
~2021-05-06  ~100 GB of data exfiltrated; ransomware deployed on IT/business systems
2021-05-07   Colonial shuts down the ENTIRE pipeline (~45% of US east-coast fuel)
             Panic buying and fuel shortages across the south-east US
2021-05-07   Colonial pays ~$4.4M ransom (Bitcoin); decryptor too slow, restores from backups
2021-05-12   Pipeline restarts
2021-06      FBI recovers a large portion of the ransom Bitcoin
```

### Listing 2 — Single-factor vs multi-factor login
```text
# What happened (single factor): one stolen secret = full access
    attacker has leaked password  ->  VPN lets them in   (no second check)

# With multi-factor authentication: the stolen password is not enough
    attacker has leaked password  ->  VPN asks for a SECOND factor
                                  ->  attacker has no phone/token  ->  DENIED
```

### Listing 3 — Multi-factor authentication, in NESA pseudocode
```text
BEGIN Authenticate
    IF password is correct THEN
        send one-time code to user's registered device   // something you HAVE
        GET code entered by user
        IF code is correct AND not expired THEN
            GRANT access
        ELSE
            DENY access            // stolen password alone is useless
        ENDIF
    ELSE
        DENY access
    ENDIF
END Authenticate
```

### Listing 4 — Account hygiene and recovery, in NESA pseudocode
```text
BEGIN AccountReview          // accountability: the dormant account problem
    FOR each account
        IF account is unused / belongs to a former purpose THEN
            DISABLE account
        ENDIF
        IF account has access to critical systems THEN
            REQUIRE multi-factor authentication
        ENDIF
    NEXT account
END AccountReview

BEGIN IncidentResponse        // business continuity
    DETECT intrusion
    CONTAIN (e.g. shut down / isolate affected systems)
    RESTORE from tested OFFLINE backups
    REVIEW and harden (enable MFA, remove stale accounts)
END IncidentResponse
```
