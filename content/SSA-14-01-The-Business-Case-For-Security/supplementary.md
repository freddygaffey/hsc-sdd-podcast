---
title: "Supplementary Materials — The Business Case for Security"
module: SSA
lesson: "14.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
two benefits (D-A), security-as-enabler, the cost-benefit justification, and risk = likelihood × impact.

### Listing 1 — Breach cost vs. prevention cost (the justify-investment calculation, Python)

```python
# The cost of a breach is DIRECT + INDIRECT — and indirect usually dominates.
direct = {
    "incident_response": 25_000,
    "forensics": 15_000,
    "system_rebuild": 20_000,
    "legal": 10_000,
    "customer_notification": 5_000,
    "regulatory_fines": 50_000,
    "credit_monitoring": 100_000,
}
indirect = {
    "lost_revenue_downtime": 10_000,
    "customer_churn": 500_000,        # 20% of customers leave — the biggest line, often forgotten
    "higher_insurance": 15_000,
    "extra_security_after": 50_000,
}
breach_cost = sum(direct.values()) + sum(indirect.values())   # ≈ $800,000

# Prevention is a small fraction of that:
prevention = {"secure_coding_training": 5_000, "code_review": 10_000, "scanning": 15_000}
prevention_cost = sum(prevention.values())                    # = $30,000

roi = (breach_cost - prevention_cost) / prevention_cost
print(f"Breach: ${breach_cost:,}  Prevention: ${prevention_cost:,}  ROI: {roi:.0%}")
# Breach: $800,000  Prevention: $30,000  ROI: 2,567%   -> "prevention is far cheaper than response"
```

### Listing 2 — Risk = Likelihood × Impact (prioritising a limited security budget)

```text
Threat                                   Likelihood(1-5)  Impact(1-5)  Risk  Action
--------------------------------------   ---------------  -----------  ----  ----------------------
SQL injection exposing customer records        4              5         20   FIX NOW (high/high)
Weak passwords -> account takeover             5              4         20   FIX NOW (high/high)
Unencrypted data theft                         2              5         10   Contingency plan
Session hijacking                              3              3          9   Monitor & manage
Denial of service during peak sale             3              2          6   Accept / monitor

Rule: Risk = Likelihood × Impact. Spend on the highest scores first
      -> most risk reduced per dollar.
```

### Listing 3 — The two benefits and the enabler reframe (exam scaffold)

```text
BENEFITS OF SECURE SOFTWARE (syllabus)         "D-A"
  D  Data protection ............. confidentiality + integrity of customer data
  A  Attack minimisation ........ fewer vulnerabilities -> fewer successful cyber attacks

SECURITY IS A BUSINESS ENABLER, NOT JUST A COST:
  Trust .......... customers only share data with software they trust
  Compliance ..... legally required controls let you operate in the market
  Differentiation  strong security = competitive advantage
  Risk mgmt ...... prevents costly breaches/downtime (prevention << response)

TRAPS: "security is pure cost"  ·  "we're too small to be targeted"
       (attacks are AUTOMATED + INDISCRIMINATE; small firms least able to survive one)
```
