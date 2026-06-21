---
title: "Supplementary Materials — The Equifax Breach"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the Equifax episode. Nothing here is spoken in the audio.

### Listing 1 — Timeline of the breach
```text
2017-03-07  Apache discloses CVE-2017-5638 in Struts AND ships the patch (same day)
2017-03-08  US Dept of Homeland Security notifies Equifax
2017-03-09  Internal Equifax email: "apply the critical patch"
2017-03-10  Attackers exploit the unpatched dispute portal — first foothold
2017-03-15  Equifax vulnerability scan runs — fails to flag the vulnerable server
2017-03 to 2017-07  Attackers move laterally, find plaintext credentials, exfiltrate data
                    (encrypted exfiltration unseen: monitoring cert expired ~19 months)
2017-07-29  Expired certificate renewed; monitoring lights up; suspicious traffic spotted
2017-07-30  Server taken offline; patch finally applied
2017-09-07  Public disclosure: ~147 million people affected
Aftermath   ~$700M+ settlement; CEO, CIO, CSO depart
```

### Listing 2 — The shape of the flaw: untrusted input becoming code
```python
# CVE-2017-5638 — simplified illustration of the idea, NOT the real exploit.
# A malformed Content-Type header was parsed as an expression and EVALUATED.

content_type = request.headers["Content-Type"]   # data from a stranger

# Vulnerable frameworks treated a crafted header as an instruction:
#   Content-Type: %{ (#cmd='whoami').(execute_this_on_the_server) ... }
# The server then RAN the attacker's command.  ->  remote code execution

# The fix: NEVER interpret untrusted input as code. Treat a header as inert text.
```

### Listing 3 — The defensive principle in NESA pseudocode
```text
BEGIN HandleRequest
    input ← GET request data from client
    IF input is NOT well-formed AND expected THEN
        REJECT request
        LOG security event
    ELSE
        treat input ONLY as inert data, never as a command
        process request
    ENDIF
END HandleRequest

BEGIN MaintenancePhase        // the part Equifax skipped
    FOR each system IN inventory
        IF a patch exists for a known vulnerability THEN
            APPLY patch promptly
            VERIFY patch was actually applied   // the scan must not lie
        ENDIF
    NEXT system
END MaintenancePhase
```
