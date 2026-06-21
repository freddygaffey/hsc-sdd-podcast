---
title: "Supplementary Materials — Decision Trees and Neural Networks"
module: SA
lesson: "20.4"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the two
design/analysis models — "a Tree is readable IF-questions; a Net is weighted neurons" — the
tree parts (R-N-L: Root, Node, Leaf), tracing a tree to a prediction, and a neuron as a
weighted sum plus an activation. These listings show the email-priority tree as nested IFs, the
same traversal in NESA pseudocode, a single neuron, and a real scikit-learn decision tree.

### Listing 1 — A decision tree as nested IF-statements (Python)

```python
def classify_email(contains_urgent: bool, contains_meeting: bool, known_contact: bool) -> str:
    if not contains_urgent:                 # ROOT question
        return "medium"                     # LEAF
    else:                                    # urgent == True -> go right
        if contains_meeting:                # internal NODE
            return "high"                   # LEAF
        else:
            if known_contact:               # internal NODE
                return "medium"             # LEAF
            else:
                return "low"                # LEAF

# Trace: urgent=True, meeting=False, known_contact=True -> "medium"
# A tree is learned BRANCHING logic: same selection/if-then logic you already write,
# but the questions + their order are learned from data, not hand-written.
```

### Listing 2 — NESA pseudocode: tracing a decision tree to a prediction (exam style)

```text
BEGIN ClassifyEmail(containsUrgent, containsMeeting, knownContact)
    IF containsUrgent = False THEN
        RETURN "medium"                     // LEAF
    ELSE
        IF containsMeeting = True THEN
            RETURN "high"                   // LEAF
        ELSE
            IF knownContact = True THEN
                RETURN "medium"             // LEAF
            ELSE
                RETURN "low"                // LEAF
            ENDIF
        ENDIF
    ENDIF
END ClassifyEmail
```

### Listing 3 — A single neuron: weighted sum + activation (Python)

```python
import math

def neuron(inputs, weights, bias):
    # 1) WEIGHTED SUM: each input times its weight, all added up (+ a bias).
    z = sum(x * w for x, w in zip(inputs, weights)) + bias
    # 2) ACTIVATION: squash the sum to decide the neuron's output.
    return 1 / (1 + math.exp(-z))           # sigmoid activation -> output in (0, 1)

# Example: a 2-input neuron
out = neuron(inputs=[1.0, 0.0], weights=[0.8, -0.5], bias=0.1)
print(out)
# A neuron is JUST a weighted sum then an activation. A NETWORK = layers of these,
# joined by learned weights. It is maths, NOT a brain.
```

### Listing 4 — A real decision tree, fit and traced (Python, scikit-learn)

```python
from sklearn.tree import DecisionTreeClassifier, export_text

# Features: [contains_urgent, contains_meeting, known_contact]  (1 = yes, 0 = no)
X = [[0,0,0],[1,1,0],[1,0,1],[1,0,0],[0,1,1]]
y = ["medium","high","medium","low","medium"]

tree = DecisionTreeClassifier(max_depth=3)   # CAP depth -> avoid OVERFITTING (a too-deep tree memorises)
tree.fit(X, y)

print(export_text(tree, feature_names=["urgent","meeting","known_contact"]))  # readable rules!
print(tree.predict([[1,0,1]]))               # -> ["medium"]  (and you can read WHY)
# export_text prints the learned IF-questions -> the tree is INTERPRETABLE (unlike a neural net).
```
