---
title: "Supplementary Materials — Stuxnet"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the case study. Nothing here is spoken in the audio. The
listings are deliberately minimal and illustrative — they show the *shape* of how
Stuxnet worked, not the real malware's code.

### Listing 1 — Timeline of Stuxnet
```text
~2005-2009   Stuxnet developed (widely attributed to a US/Israeli nation-state
             effort). Designed to physically damage uranium-enrichment centrifuges
             at the air-gapped Natanz facility in Iran.

via USB      Infects internet-connected machines of contractors/suppliers, then
             crosses the air gap when an infected USB drive is carried into the
             facility and plugged in. Uses FOUR zero-day Windows exploits to spread,
             plus stolen-but-valid digital certificates to look trustworthy.

selective    Spreads to ~200,000+ computers worldwide but stays dorment on almost
             all of them. Activates ONLY when it finds a specific Siemens S7 PLC
             driving variable-frequency drives in the centrifuge frequency range.

sabotage     Reprograms the PLC to spin centrifuges destructively (over/under speed
             over weeks) WHILE replaying recorded "normal" readings to operators.

~2010        Reportedly destroys ~1,000 centrifuges (~1/5 of Iran's). Discovered
             mid-2010 by VirusBlokAda (Belarus); analysed worldwide as the first
             true cyber-weapon.
```

### Listing 2 — The integrity attack: sabotage while reporting "normal" (illustrative)
```text
// Illustrative shape of what the malicious PLC logic did. Not the real code.

WHILE running:
    drive_centrifuges(destructive_speed_profile)   // really: over/under-speed
    report_to_control_room(prerecorded_normal_readings)  // lie: looks healthy

// The control room's screens show calm, green, normal numbers the whole time,
// because the data path that should tell the truth has been replaced with a
// recording. This is an INTEGRITY attack: the data no longer reflects reality.
```

### Listing 3 — How a target-check keeps a weapon dormant until armed (illustrative Python)
```python
# Illustrative: Stuxnet stayed asleep on almost every machine, waking only for an
# exact industrial-controller fingerprint. This sketch shows that selectivity.

def on_infected_host(host):
    plc = host.find_attached_plc()
    if plc is None:
        return                                   # ordinary PC: do nothing, stay hidden
    if plc.vendor != "Siemens" or plc.model not in TARGET_S7_MODELS:
        return                                   # wrong controller: stay dormant
    if not (807 <= plc.motor_frequency_hz <= 1210):
        return                                   # wrong machinery: stay dormant
    deploy_sabotage_payload(plc)                 # exact target found: ARM and strike
```

### Listing 4 — Verifying data integrity before trusting it, in NESA pseudocode
```text
// The defensive lesson: don't trust a reading just because it arrived. Check that
// it is genuine and consistent before acting on it.

BEGIN ReadSensorSafely
    reading ← value reported by the controller
    signature ← integrity tag attached to the reading

    IF signature IS NOT valid FOR reading THEN
        RAISE alarm "data may be tampered"        // integrity check failed
        ENTER safe shutdown
    ELSE IF reading IS outside physically plausible range THEN
        RAISE alarm "reading inconsistent with reality"
        ENTER safe shutdown
    ELSE
        ACT on reading                            // only trust verified, sane data
    ENDIF
END ReadSensorSafely
```
