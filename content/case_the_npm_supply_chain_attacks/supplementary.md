---
title: "Supplementary Materials — The npm Supply-Chain Attacks"
module: SSA
lesson: "case-study"
script: script.md
---

# Supplementary Materials

Read-along reference for the case study. Nothing here is spoken in the audio. The
code listings are deliberately minimal and illustrative — they show the *shape* of
each mechanism, not the real attackers' code.

### Listing 1 — Timeline of the npm supply-chain attacks
```text
2018-09  event-stream (the warning shot)
         Burned-out maintainer Dominic Tarr hands publish rights for the popular
         "event-stream" package to a friendly volunteer ("right9ctrl"). The new
         maintainer later adds a dependency, "flatmap-stream", carrying hidden,
         encrypted code that targets the Copay bitcoin wallet. Sits undetected for
         ~2 months and ~8M downloads; found only via a stray deprecation warning.

2025-09-08  The "Qix" phishing attack
   ~13:00 UTC  Maintainer "Qix" (Josh Junon) receives a 2FA-reset phishing email
               from a look-alike domain (npmjs.help). He enters username, password,
               and a live one-time code. Attacker takes over the account.
   13:16 UTC  Malicious versions of ~18 packages published: chalk, debug,
               ansi-styles, strip-ansi, color-convert, supports-color, wrap-ansi,
               ansi-regex, color-name, and more. Combined reach: 2B+ downloads/week.
               Payload = browser-side crypto-clipper / wallet-drainer.
   ~15:20 UTC  Community spots the malicious code; alarm raised.
   ~within 2h  Bad versions reverted / unpublished. Actual theft: a few hundred USD.
               Reach was unprecedented; damage was small only because it was fast-caught.

2025-09-14  "Shai-Hulud" — the self-replicating worm
               First known infected package published (patient zero). On install, the
               worm scans the machine for secrets (npm / GitHub / cloud tokens) using
               an off-the-shelf secret scanner, exfiltrates them, then uses the stolen
               npm token to auto-publish itself into the victim's other packages.
               No human, no command-and-control needed. ~180-200 packages in wave one.

2025-11-24  "Shai-Hulud 2.0"
               A more aggressive variant of the same self-propagating idea backdoors
               ~796 npm packages and exposes tens of thousands of repositories.
```

### Listing 2 — The shape of a browser crypto-clipper (illustrative, not the real payload)
```javascript
// Illustrative only: how a wallet-drainer hooks the browser's crypto bridge
// and silently rewrites a transaction's destination address.
const ATTACKER_ADDRESS = "0xATTACKER...";       // attacker-controlled wallet
const realRequest = window.ethereum.request;     // the genuine wallet API

window.ethereum.request = async function (payload) {
  // Watch for an outgoing transaction being set up...
  if (payload?.method === "eth_sendTransaction") {
    // ...and quietly swap where the money goes. The UI may still show the
    // address the user copied; the value that actually leaves is changed.
    payload.params[0].to = ATTACKER_ADDRESS;
  }
  return realRequest.call(this, payload);          // pass it on, looking normal
};
```

### Listing 3 — How a postinstall script + stolen token republishes a worm (illustrative)
```json
// package.json — a normal feature ("postinstall") abused to run code on install.
// This is the legitimate mechanism; the abuse is what the script does.
{
  "name": "some-popular-utility",
  "version": "1.4.2",
  "scripts": {
    "postinstall": "node ./bundle.js"
  }
}
```
```text
// bundle.js, in plain terms (illustrative): the self-propagation loop.
//   1. Scan this machine for secrets (npm token, code-host token, cloud keys).
//   2. Exfiltrate them to an attacker-controlled location.
//   3. With the stolen npm token, log in AS the victim and republish a poisoned
//      copy of every package the victim is allowed to publish.
// Each new victim who installs an infected package repeats steps 1-3 = a worm.
```

### Listing 4 — A "safe dependency update" / integrity check, in NESA pseudocode
```text
BEGIN SafeDependencyUpdate
    FOR EACH dependency IN project
        candidate ← latest available version
        IF candidate ≠ pinned_version THEN
            expected_hash ← integrity hash recorded in the lock file
            actual_hash ← compute hash of candidate package contents
            IF actual_hash ≠ expected_hash THEN
                REJECT candidate                  // contents do not match what we locked
                RAISE alert "integrity check failed"
            ELSE IF provenance NOT verified THEN
                HOLD candidate FOR manual code review
            ELSE
                pinned_version ← candidate         // accept, then re-lock
                UPDATE lock file WITH candidate, actual_hash
            ENDIF
        ENDIF
    NEXT dependency
END SafeDependencyUpdate
```
