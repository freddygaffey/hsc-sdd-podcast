---
title: "Supplementary Materials — What Is AI vs ML (and Where RPA and BPA Fit)"
module: SA
lesson: "20.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
A-I-versus-M-L distinction ("AI is the goal; ML is one way"), the three automation approaches
(DevOps, RPA = a Robot doing a Task, BPA = redesigning a Process), and how ML augments
rule-based automation by adding judgement. These listings contrast a rule-based classifier
with a learned one, and show where ML plugs into an RPA workflow.

### Listing 1 — Rule-based AI: a human writes the rules, nothing is learned (Python)

```python
# Classic AI (expert system): the rules are HAND-WRITTEN. It does not learn.
RULES = {
    "account": ["password", "login", "account", "access"],
    "billing": ["bill", "charge", "payment", "refund", "invoice"],
    "general": ["hours", "location", "contact"],
}

def classify_ticket(text: str) -> str:
    text = text.lower()
    scores = {cat: sum(word in text for word in words) for cat, words in RULES.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "general"

# Transparent and fixed: you can read exactly WHY it decided. It never improves on its own.
print(classify_ticket("I forgot my password and can't login"))   # -> "account"
```

### Listing 2 — Machine learning: the system LEARNS the rules from labelled data (Python, scikit-learn)

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# Past tickets a human already LABELLED with the correct category (the training data).
texts  = ["forgot my password", "account is locked", "wrong charge on my bill",
          "need a refund", "what are your hours", "how do I contact you"]
labels = ["account", "account", "billing", "billing", "general", "general"]

model = make_pipeline(CountVectorizer(), MultinomialNB())
model.fit(texts, labels)               # LEARN patterns from data — nobody wrote "password->account"

print(model.predict(["my password reset isn't working"]))   # -> ["account"]  (learned, not coded)
# ML is a subset of AI: it achieves intelligent behaviour by learning from data, not from hand-written rules.
```

### Listing 3 — NESA pseudocode: the rule-based classifier (exam style)

```text
BEGIN ClassifyTicket(text)
    text ← ToLowerCase(text)
    bestCategory ← "general"
    bestScore ← 0
    FOR each category IN RULES
        score ← 0
        FOR each keyword IN RULES[category]
            IF keyword IN text THEN
                score ← score + 1
            ENDIF
        NEXT keyword
        IF score > bestScore THEN
            bestScore ← score
            bestCategory ← category
        ENDIF
    NEXT category
    RETURN bestCategory
END ClassifyTicket
```

### Listing 4 — How ML augments an RPA workflow: rules do the plumbing, ML does the judgement (Python)

```python
# RPA = the mechanical hands (open, read, move, type). ML = the eyes and judgement.

def rpa_extract_fields(document):
    """Rule-based RPA: move data between systems (the structured plumbing)."""
    return {"vendor": read_field(document, "vendor"),
            "amount": read_field(document, "amount")}

def ml_classify(document) -> tuple[str, float]:
    """ML: identify document type + confidence, even when layout varies."""
    return ml_doc_model.predict(document)            # e.g. ("invoice", 0.94)

def ml_is_anomalous(fields) -> bool:
    """ML: flag a value outside the learned normal range (possible fraud)."""
    return ml_anomaly_model.score(fields["amount"]) > THRESHOLD

def process_invoice(document):
    doc_type, confidence = ml_classify(document)     # ML judgement
    fields = rpa_extract_fields(document)            # RPA plumbing
    if ml_is_anomalous(fields) or confidence < 0.80: # ML judgement
        route_to_human(fields)                       # exception -> human review
    else:
        rpa_enter_into_accounting(fields)            # RPA plumbing -> auto-processed
```

### Listing 5 — NESA pseudocode: a BPA approval workflow (process-level, with a human decision point)

```text
BEGIN OnboardEmployee(employee)
    IF NOT DocumentsValid(employee) THEN
        DISPLAY "documentation incomplete"
        RETURN
    ENDIF

    approval ← RequestApproval(employee.manager)     // human-in-the-loop (accountability)
    IF approval = "rejected" THEN
        WriteAuditLog(employee, "onboarding rejected")
        RETURN
    ENDIF

    CreateAccounts(employee)                          // deep system integration
    SetUpPayroll(employee)
    OrderEquipment(employee)
    SendWelcomeEmail(employee)
    WriteAuditLog(employee, "onboarding completed")   // audit trail through the whole process
END OnboardEmployee
```
