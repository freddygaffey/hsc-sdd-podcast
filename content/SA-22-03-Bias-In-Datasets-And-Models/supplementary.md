---
title: "Supplementary Materials — Bias in Datasets and Models"
module: SA
lesson: "22.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the four
sources of bias — the hook S-H-L-M: Sampling, Historical, Labeler, Measurement — the mitigation
hook D-R-F: Diverse data, Reweight, Fairness metrics — and accountability via model cards and data
provenance. Listing 1 is a reference table of the sources (with the "tell" for each); Listing 2
measures class balance and per-group fairness (the key "high accuracy can still be unfair" point);
Listing 3 is a model-card template; Listing 4 is the diagnosis-and-mitigation flow in NESA pseudocode.

### Listing 1 — The four sources of bias: tell + example + entry point (text reference, S-H-L-M)

```text
SOURCE (S-H-L-M)     THE "TELL" (the question you ask)        EXAMPLE                          ENTERS AT
S  Sampling          Who is MISSING / under-counted?          face recognition trained mostly  data collection
                                                              on light-skinned faces
H  Historical        Is the data a faithful record of an      hiring model on a male-dominated  the world itself
                     UNJUST PAST? (more data won't fix it)     hiring history favours men
L  Labeler           WHO decided the "right answer", and       annotators flag a dialect as      labelling
                     what did they assume?                     "toxic" more often
M  Measurement       Is what we MEASURED actually what we      "arrests" used as a proxy for     the measure/proxy
                     care about, measured the same for all?    "crime" -> over-policed areas

Cousin (deployment): POPULATION DRIFT — the population shifts after training, so a once-representative
sample becomes biased; the model no longer matches who it serves -> monitor + retrain.

DEFINITION: bias = a SYSTEMATIC error producing unfair/skewed outcomes for particular groups.
KILL THE MYTH: the algorithm is NOT neutral — it mirrors and AMPLIFIES the biases in its data.
```

### Listing 2 — Detecting bias: class balance + per-group fairness (Python)

```python
# The crucial exam point: a model can have HIGH OVERALL ACCURACY and still be UNFAIR to a group.
# So measure per-group, not just overall.

import pandas as pd

def class_balance(df, group_col):
    """S (sampling): is any group missing or under-represented?"""
    return df[group_col].value_counts(normalize=True)   # proportions per group

def positive_rate_by_group(df, group_col, decision_col):
    """Demographic parity check: do groups get positive decisions at similar rates?"""
    return df.groupby(group_col)[decision_col].mean()    # approval rate per group

def error_rate_by_group(df, group_col, y_true, y_pred):
    """Equalised odds check: are error rates similar across groups?"""
    df = df.assign(_wrong=(df[y_true] != df[y_pred]).astype(int))
    return df.groupby(group_col)["_wrong"].mean()        # error rate per group

# Example: 96% overall accuracy can hide a 0.30 vs 0.12 approval gap between groups.
# A large gap in positive_rate_by_group OR error_rate_by_group is a fairness red flag,
# even when overall accuracy looks excellent.
```

### Listing 3 — A model card for accountability/transparency (text template)

```text
MODEL CARD — Loan Approval Model v2.3
-------------------------------------
Intended use      : assist (not replace) human loan officers; not for final automated denial
Training data     : 2019-2024 applications, Region X   [provenance + date documented]
Known limitations : under-represents rural applicants (sampling); trained on historical
                    decisions that may carry historical bias
Performance       : overall accuracy 0.94
  by group        : approval rate  Group A 0.31 | Group B 0.19   <-- disparity flagged
                    error rate     Group A 0.06 | Group B 0.11
Mitigations       : reweighting applied; demographic-parity monitored monthly
Accountability    : owner = ML team lead; decisions auditable via versioned data lineage

Why it matters: makes bias VISIBLE and ANSWERABLE = the accountability "A" of CIA-AAA, applied to AI.
```

### Listing 4 — NESA pseudocode: diagnose-and-mitigate bias (exam style)

```text
BEGIN AddressBias(dataset, model, groupAttribute)
    // DETECT
    balance ← ClassBalance(dataset, groupAttribute)          // S: anyone missing?
    FOR each group IN balance
        IF balance[group] < THRESHOLD THEN
            DISPLAY "sampling bias: " + group + " under-represented"
        ENDIF
    NEXT group

    parityGap ← MaxPositiveRate(model, groupAttribute) - MinPositiveRate(model, groupAttribute)
    IF parityGap > FAIRNESS_LIMIT THEN                         // F: per-group, NOT overall accuracy
        DISPLAY "fairness violation across groups"

        // MITIGATE — D-R-F
        dataset ← CollectMoreDiverseData(dataset)             // D: diverse data at the source
        weights ← Reweight(dataset, groupAttribute)           // R: reweight under-represented groups
        model   ← Retrain(dataset, weights)
    ENDIF

    // ACCOUNTABILITY
    PublishModelCard(model, perGroupPerformance, knownLimitations, dataProvenance)
    RETURN model
END AddressBias
```
