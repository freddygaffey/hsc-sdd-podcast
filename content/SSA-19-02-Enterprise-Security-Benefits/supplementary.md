---
title: "Supplementary Materials — Enterprise Security Benefits"
module: SSA
lesson: "19.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the five
enterprise benefits of secure development practices — **PIP-PB: Products, Influence, Practices,
Productivity, Business interactivity** — as business outcomes, not technical ones, and uses the
Equifax breach as the counterfactual. These listings map each benefit to its mechanism, contrast
secure vs insecure outcomes, and give a simple prevention-vs-response cost calculation.

### Listing 1 — The five enterprise benefits, each as a BUSINESS outcome (text reference)

```text
PIP-PB — benefit to the ENTERPRISE (not "the code is safer"). Each: practice → business consequence.

P  Products/services improved   secure-by-design → reliable, trustworthy product →
                                security becomes a marketable part of the value proposition
I  Influence on future dev      lessons + reusable secure patterns + institutional knowledge →
                                every later project starts from a more secure baseline ("shift left", org-wide)
P  Practices improved           review / threat-modelling / documentation discipline →
                                lifts GENERAL engineering quality, faster onboarding
P  Productivity                 prevention << response + automated checks + fast audits →
                                time freed from firefighting/rework → ship MORE, not less (the "enabler" proof)
B  Business interactivity       trust → safe APIs, online transactions, partner integrations →
                                the enterprise can connect & transact (e.g. e-commerce only works if secure)

TRAP: a technical-only answer ("fewer bugs / data encrypted") MISSES this dot-point — land on the BUSINESS.
```

### Listing 2 — Secure enterprise vs insecure enterprise (Equifax as counterfactual) (text)

```text
BENEFIT (PIP-PB)        SECURE ENTERPRISE                 INSECURE ENTERPRISE (Equifax, 2017)
Products/services       trusted, marketable security      reputation for trustworthiness destroyed
Influence on future     secure patterns reused forward    future dev consumed by remediation
Work practices          disciplined review/threat-model   known patch left unapplied (undisciplined)
Productivity            time on features                  productivity cratered by incident response
Business interactivity  partners/customers integrate      partner & regulator confidence collapsed

Breach scale: ~147M records exposed via ONE unpatched framework vuln; hundreds of millions in
settlements/fines. Every PIP-PB benefit was a thing they LOST. Prevention << response.
```

### Listing 3 — Prevention-vs-response cost (Python, illustrative)

```python
# Why secure practices RAISE productivity: prevention is far cheaper than response.
def expected_cost(p_breach, breach_cost, prevention_cost):
    """Compare doing nothing vs investing in secure practices."""
    do_nothing = p_breach * breach_cost          # risk = likelihood x impact (14-01)
    invest     = prevention_cost + (p_breach * 0.3) * breach_cost  # practices cut breach risk ~70%
    return do_nothing, invest

# Illustrative figures (direct + indirect; indirect usually dominates):
do_nothing, invest = expected_cost(
    p_breach=0.15,            # 15% annual chance of a significant incident
    breach_cost=1_175_000,    # response: fines + forensics + recovery + churn + reputation
    prevention_cost=120_000,  # secure-by-design tooling, review, training, automation
)
# do_nothing  ≈ $176,250 expected annual loss
# invest      ≈ $172,875  (and you also GAIN PIP-PB: trust, productivity, interactivity)
# The dollar comparison alone roughly breaks even — the PIP-PB benefits are the real return.
```
