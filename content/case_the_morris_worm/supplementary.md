---
title: "Supplementary Materials — The Morris Worm"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the case study. Nothing here is spoken in the audio. The
listings are minimal and illustrative — they show the *shape* of the mechanisms,
not the worm's real code.

### Listing 1 — Timeline of the Morris worm
```text
1988-11-02   ~20:30. Robert Tappan Morris (23, Cornell grad student) releases his
   evening    worm onto the internet from an MIT machine (to obscure its origin).
             Intended as a census of the ~60,000 networked computers.

within hours The worm spreads out of control. It breaks in via (a) a buffer-overflow
             in the "fingerd" network service, (b) a debug feature left enabled in the
             "sendmail" mail program, and (c) guessing weak passwords from a built-in
             list of ~400 common ones plus username variations.

the flaw     To resist "fake immunity", the worm reinfects already-infected machines
             ~1 time in 7. Copies pile up, exhausting memory and CPU. Machines slow,
             freeze, and crash — an availability collapse, not data theft.

aftermath    ~10% of the internet (~6,000 of ~60,000 machines) affected. Sites cut
             themselves off the network in desperation.

1988-11      In direct response, the first CERT (Computer Emergency Response Team) is
             founded at Carnegie Mellon — the origin of coordinated incident response.

1990         Morris becomes the first person convicted under the US Computer Fraud
             and Abuse Act: 3 years probation, 400 hours community service, ~$10,050
             fine. He later becomes a respected computer-science professor.
```

### Listing 2 — A buffer overflow, in the style of the bug it exploited (illustrative C)
```c
/* Illustrative: the classic mistake the worm rode in on. gets() copies input with
   NO bounds check, so an over-long input spills past 'buffer' and overwrites
   adjacent memory — including the saved "what to run next" return address. */
#include <stdio.h>

void handle_request(void) {
    char buffer[64];        /* fixed-size space: 64 bytes reserved */
    gets(buffer);           /* DANGEROUS: writes as much as it's given, no limit */
    /* A crafted input > 64 bytes overflows 'buffer', overwrites the return
       address, and redirects execution into attacker-supplied code. */
}
```

### Listing 3 — The same idea done safely (illustrative C)
```c
/* The fix: never accept more input than the buffer can hold. Bound every copy. */
#include <stdio.h>

void handle_request(void) {
    char buffer[64];
    /* fgets caps the read at the buffer size, so input cannot overflow it. */
    if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
        /* safe: excess input is left unread instead of overwriting memory */
    }
}
```

### Listing 4 — Bounds-checked input handling, in NESA pseudocode
```text
// The memory-safety rule: reject or truncate input that exceeds the space reserved.

BEGIN ReadInputSafely
    capacity ← size of buffer
    input ← data received from the network        // UNTRUSTED, length unknown

    IF length of input > capacity THEN
        REJECT input                              // refuse — do not overflow
        RAISE alarm "input exceeds buffer size"
    ELSE
        COPY input INTO buffer                     // safe: it fits
        PROCESS buffer
    ENDIF
END ReadInputSafely
```
