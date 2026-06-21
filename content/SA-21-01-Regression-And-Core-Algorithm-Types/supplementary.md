---
title: "Supplementary Materials — Regression and the Core Algorithm Types"
module: SA
lesson: "21.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the core
algorithm types — L-L-K (Linear, Logistic, K-nearest) plus polynomial — built as fit/predict
OOP model classes, and the two ideas that matter most: overfitting and the train-test split
("linear predicts a number; logistic predicts a yes-or-no"). These listings show a LinearModel
class, logistic regression with the sigmoid, a KNN sketch, the NESA prediction loop, and a
train-test split that detects overfitting.

### Listing 1 — A LinearModel class with fit and predict (Python, OOP)

```python
class LinearModel:
    """y = m*x + b. fit() LEARNS m and b; predict() APPLIES them. Predicts a NUMBER."""
    def __init__(self):
        self.m = 0.0          # slope  (a learned parameter / weight)
        self.b = 0.0          # intercept

    def fit(self, xs, ys, lr=0.01, epochs=1000):
        n = len(xs)
        for _ in range(epochs):
            preds = [self.m * x + self.b for x in xs]
            dm = sum(2 * (p - y) * x for p, y, x in zip(preds, ys, xs)) / n
            db = sum(2 * (p - y)     for p, y    in zip(preds, ys))     / n
            self.m -= lr * dm     # nudge parameters to reduce error
            self.b -= lr * db

    def predict(self, x):
        return self.m * x + self.b        # apply the learned line -> a continuous value

model = LinearModel()
model.fit([50,75,100,125,150], [150,200,250,300,350])   # size -> price
print(model.predict(130))                                # predicted price (a NUMBER)
```

### Listing 2 — Logistic regression: classification via the sigmoid (Python, OOP)

```python
import math

class LogisticModel:
    """Despite the name, this CLASSIFIES (yes/no). Outputs a probability via the sigmoid."""
    def __init__(self):
        self.w = 0.0
        self.b = 0.0

    @staticmethod
    def sigmoid(z):
        z = max(-500, min(500, z))
        return 1 / (1 + math.exp(-z))          # squash any number to (0, 1) = a probability

    def fit(self, xs, ys, lr=0.1, epochs=1000):   # ys are 0/1 labels
        n = len(xs)
        for _ in range(epochs):
            preds = [self.sigmoid(self.w * x + self.b) for x in xs]
            self.w -= lr * sum((p - y) * x for p, y, x in zip(preds, ys, xs)) / n
            self.b -= lr * sum((p - y)     for p, y    in zip(preds, ys))     / n

    def predict(self, x):
        prob = self.sigmoid(self.w * x + self.b)
        return 1 if prob > 0.5 else 0          # THRESHOLD the probability -> a CLASS (yes/no)
```

### Listing 3 — K-nearest neighbour: predict by similarity (Python)

```python
from collections import Counter

def knn_predict(training, labels, new_point, k=5):
    """Find the k most similar known examples; let them VOTE. No line, no curve — comparison."""
    def distance(a, b):
        return sum((p - q) ** 2 for p, q in zip(a, b)) ** 0.5

    ranked = sorted(zip(training, labels), key=lambda pair: distance(pair[0], new_point))
    nearest_labels = [label for _, label in ranked[:k]]      # the k nearest neighbours
    return Counter(nearest_labels).most_common(1)[0][0]      # majority vote
```

### Listing 4 — NESA pseudocode: the prediction loop (exam style)

```text
BEGIN PredictAll(model, inputs)
    results ← []
    FOR each x IN inputs
        prediction ← model.Predict(x)        // linear -> number; logistic -> class
        APPEND prediction TO results
    NEXT x
    RETURN results
END PredictAll
```

### Listing 5 — Train-test split detects overfitting (Python, scikit-learn)

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline

# NEVER evaluate on the data you trained on — split off an unseen TEST set.
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

high = make_pipeline(PolynomialFeatures(degree=15), LinearRegression())   # very flexible
high.fit(X_train, y_train)

print("train score:", high.score(X_train, y_train))   # ~ very high (memorised)
print("test  score:", high.score(X_test,  y_test))    # ~ much lower  -> OVERFITTING
# A big train>>test gap = overfitting. Fix: lower the degree, get more data, regularise.
```
