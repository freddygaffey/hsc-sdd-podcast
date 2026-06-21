---
title: "Supplementary Materials — The xz Backdoor"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the xz backdoor episode. Nothing here is spoken in the audio.

### Listing 1 — Timeline of a multi-year campaign
```text
2021-10-29  "Jia Tan" makes first contribution to xz Utils — builds trust slowly
2022        Sock-puppet accounts pressure lone maintainer to add co-maintainers
2023-01     Jia Tan's commits merged; gains release authority over the project
2024-02-23  Backdoor committed; hidden in the BUILD process, disguised as test data
2024-02-24  xz 5.6.0 released (backdoored)
2024-03-09  xz 5.6.1 released (backdoored); reaching testing branches of distros
2024-03-29  Andres Freund reports it after noticing SSH logins ~500ms vs ~100ms
            CVE-2024-3094 assigned; CVSS 10.0; distros revert before wide release
```

### Listing 2 — Why it hid: source looks clean, the BUILD injects the payload
```bash
# Simplified illustration of the technique (NOT the real exploit).
# Reviewers read source code. They rarely read build scripts or binary "test" files.

# Public source: nothing malicious visible here.

# Hidden inside the release's build step (a configure/make hook):
#   1. take an innocent-looking "corrupted test file"  (tests/files/bad-data.xz)
#   2. extract the REAL malicious code from it at build time
#   3. weave it into liblzma.so as it is compiled
# Result: the SHIPPED binary contains a backdoor the SOURCE never showed.
```

### Listing 3 — What the backdoor did, in NESA pseudocode
```text
BEGIN BackdooredSSHLogin
    request ← incoming SSH authentication attempt
    IF request CONTAINS attacker's secret cryptographic key THEN
        RUN attacker's command with full control   // bypass all checks
    ELSE
        perform normal authentication              // looks completely ordinary
    ENDIF
END BackdooredSSHLogin
```

### Listing 4 — Supply-chain defences, in NESA pseudocode
```text
BEGIN VerifyDependency
    FOR each component IN software supply chain
        CHECK who has authority to publish releases
        REVIEW not just source code BUT the build process
        VERIFY shipped binary is reproducible FROM reviewed source
        IF binary does NOT match source THEN
            REJECT the release
            RAISE alert
        ENDIF
    NEXT component
END VerifyDependency
```
