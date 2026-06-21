---
title: "Supplementary Materials — Security Ethics and Legal Considerations"
module: SSA
lesson: "19.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the six
social, ethical and legal issues — **E-D-P-C-I-D ("Ed Picid"): Employment, Data security, Privacy,
Copyright, Intellectual property, Digital disruption** — and the "evaluate = weigh both sides + judge"
technique, with responsible disclosure as the through-line. These listings give an evaluation
framework, a copyright-vs-IP map, and a responsible-disclosure decision flow.

### Listing 1 — The six issues, each EVALUATED (both sides → judgement) (text reference)

```text
E-D-P-C-I-D ("Ed Picid"). EVALUATE = name issue → one side → other side → justified judgement.
Lenses: SOCIAL (effect on people/society) · ETHICAL (right vs wrong) · LEGAL (what the law requires).

E  Employment          + new security careers (engineers/pen-testers/privacy officers)
                       - automation displaces roles + demands constant reskilling
                       judgement: a SHIFT in the kind of work, not simply more/fewer jobs
D  Data security       ethical duty of care to those whose data you hold (identity theft/fraud if failed)
                       + legal: mandatory breach-notification laws + penalties (= CIA confidentiality/integrity)
P  Privacy             should you COLLECT it at all? right to control personal data (≠ data security)
                       law: GDPR (privacy-by-design legal requirement) + Australian Privacy Principles (Privacy Act)
                       judgement: balance monitoring/personalisation vs autonomy → DATA MINIMISATION (PER, 16-02)
C  Copyright           legal auto-protection of original works incl. SOURCE CODE; honoured via LICENCES
                       permissive (MIT = attribution) vs copyleft (GPL = derivatives must be open) [PFW 12-06]
I  Intellectual prop.  the BROADER category — copyright is ONE type (also patents/trademarks/trade secrets)
                       judgement: protect competitive advantage BUT balance vs openness/collaboration
D  Digital disruption  + enables new services (banking/e-commerce/telehealth)
                       - displaces old industries, concentrates power in data-holding platforms

THROUGH-LINE: RESPONSIBLE DISCLOSURE — report privately → fix window → then publish; never exploit
(unauthorised access can be illegal even with good intent → ethical hacking/pen-test must be AUTHORISED).
```

### Listing 2 — Copyright vs Intellectual Property (the marker's trap) (text)

```text
INTELLECTUAL PROPERTY (the whole category)
├── COPYRIGHT      → original works incl. source code; automatic; honoured via software licences
├── PATENTS        → inventions / novel processes
├── TRADEMARKS     → brand names, logos
└── TRADE SECRETS  → proprietary algorithms, internal crypto implementations (protect = confidentiality)

WRONG: "copyright and IP are the same."   RIGHT: "copyright is ONE TYPE of IP."
```

### Listing 3 — NESA pseudocode: responsible-disclosure decision flow

```text
BEGIN HandleFoundVulnerability(vuln, system)
    // NEVER exploit further — unauthorised access can be illegal even with good intent
    IF NOT Authorised(self, system) THEN
        DoNotExploit()                              // ethical + legal boundary (cf. pen test, 18-01)
    ENDIF

    ReportPrivatelyTo(vendor, detail ← reproducible)   // disclose to the vendor FIRST
    deadline ← AgreeRemediationWindow(vuln.severity)   // reasonable time to fix

    WHILE NOT Patched(vuln) AND Now() < deadline DO
        WaitAndAssist(vendor)                       // protect users during the fix
    ENDWHILE

    IF Patched(vuln) THEN
        PublishDetails(vuln)                        // public's right to know, AFTER the fix
    ELSE
        // vendor unresponsive + users still at risk
        CoordinatedDisclosureVia(regulator OR CERT) // balance public safety vs premature exposure
    ENDIF
END HandleFoundVulnerability
```
