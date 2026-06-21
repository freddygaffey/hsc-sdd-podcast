---
title: "Supplementary Materials — Models of Training Machine Learning"
module: SA
lesson: "20.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the four
training models — the hook S-U-S-R: Supervised (labelled), Unsupervised (find-structure),
Semi-supervised (few-labels), Reinforcement (reward). These listings show the supervised
fit/predict shape, the difference between labelled and unlabelled data, a partly-labelled
(semi-supervised) dataset, and the reinforcement learning loop.

### Listing 1 — Supervised learning: fit on labelled data, then predict (Python, scikit-learn)

```python
from sklearn.tree import DecisionTreeClassifier

# LABELLED data: each X row (features) is paired with a known y (the correct answer).
X = [[80, 8, 5], [60, 9, 6], [400, 1, 0], [350, 0, 1]]   # [word_count, exclamation_marks, links]
y = ["spam", "spam", "not_spam", "not_spam"]              # the LABELS (the answer key)

model = DecisionTreeClassifier()
model.fit(X, y)                                            # learn the input -> output mapping

print(model.predict([[90, 7, 4]]))                        # -> ["spam"]  predict a KNOWN category
# Supervised = learn from labelled pairs to predict the label of new, unseen inputs.
```

### Listing 2 — Labelled vs unlabelled data: the difference that decides the model (Python)

```python
# SUPERVISED needs this shape: features AND a label per row.
labelled = [
    {"features": [25, 70000, 90], "label": "high_value"},   # answer key present
    {"features": [60, 45000, 30], "label": "low_value"},
]

# UNSUPERVISED gets this shape: features ONLY — no label, no answer key.
unlabelled = [
    {"features": [25, 70000, 90]},                          # the model must FIND structure itself
    {"features": [60, 45000, 30]},
]
# The single question that picks the model: do you have labels?
#   labels -> supervised   |   no labels, want groups/patterns -> unsupervised
```

### Listing 3 — Semi-supervised: a few labels + a large unlabelled pool (Python)

```python
# Labelling is expensive (e.g. an expert tagging scans), so only a few rows carry a label.
dataset = [
    {"features": [5000, 80, 25], "label": "academic"},      # few, costly labels
    {"features": [400,   5,  0], "label": "informal"},
    {"features": [3200, 60, 18], "label": None},            # many cheap, UNLABELLED rows
    {"features": [600,  12,  1], "label": None},
    # ... thousands more unlabelled ...
]

labelled   = [r for r in dataset if r["label"] is not None]   # anchor the learning
unlabelled = [r for r in dataset if r["label"] is None]       # learn the broader structure
# Semi-supervised uses BOTH -> better than the few labels alone, without labelling everything.
```

### Listing 4 — Reinforcement learning: an agent learns from REWARDS, not labels (Python)

```python
# No labelled dataset. An AGENT acts in an ENVIRONMENT and learns from the REWARD it gets back.
import random

Q = {}                                  # learned value of each (state, action)

def choose(state, actions, epsilon=0.1):
    if random.random() < epsilon:       # EXPLORE: try something new (trial and error)
        return random.choice(actions)
    return max(actions, key=lambda a: Q.get((state, a), 0.0))   # EXPLOIT: best known so far

def learn(state, action, reward, lr=0.1):
    old = Q.get((state, action), 0.0)
    Q[(state, action)] = old + lr * (reward - old)   # reward STEERS the value — no "right answer" given

# The reward says how GOOD the outcome was, never what the correct action would have been.
# That is the key difference from supervised learning's labelled answer key.
```

### Listing 5 — NESA pseudocode: the reinforcement learning loop (exam style)

```text
BEGIN ReinforcementLearning(environment, episodes)
    FOR episode ← 1 TO episodes
        state ← environment.Start()
        WHILE NOT environment.Finished()
            action ← ChooseAction(state)          // explore or exploit
            reward, nextState ← environment.Step(action)
            UpdateValue(state, action, reward)    // learn from the reward, not a label
            state ← nextState
        ENDWHILE
    NEXT episode
END ReinforcementLearning
```
