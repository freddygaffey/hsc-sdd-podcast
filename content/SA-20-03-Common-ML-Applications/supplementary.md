---
title: "Supplementary Materials — Common Applications of Machine Learning"
module: SA
lesson: "20.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the three
application areas — the hook F-A-I: Forecasting (data analysis + forecasting), Assistants
(virtual personal assistants), Image recognition — and the technique underneath each. These
listings show a tiny forecasting model (supervised regression), the pseudocode for a
forecasting prediction loop, and a sketch of where each application's technique sits.

### Listing 1 — Forecasting = supervised regression on historical data (Python, pandas + scikit-learn)

```python
import pandas as pd
from sklearn.linear_model import LinearRegression

# Historical data: each row has features AND the KNOWN past demand (the label).
history = pd.DataFrame({
    "month":      [1, 2, 3, 4, 5, 6],
    "price":      [20, 19, 21, 18, 22, 20],
    "promo":      [0, 1, 0, 1, 0, 1],
    "demand":     [100, 140, 95, 150, 90, 145],   # <- the label (a continuous NUMBER)
})

X = history[["month", "price", "promo"]]
y = history["demand"]

model = LinearRegression()
model.fit(X, y)                                    # supervised: learn factors -> demand

future = pd.DataFrame({"month": [7], "price": [20], "promo": [1]})
print(model.predict(future))                       # forecast next month's demand (a number)
# Assumes the future resembles the past — when conditions shift, the forecast fails (cf. Zillow).
```

### Listing 2 — NESA pseudocode: a forecasting prediction loop (exam style)

```text
BEGIN Forecast(model, futureInputs)
    forecasts ← []
    FOR each input IN futureInputs
        predicted ← model.Predict(input)        // supervised regression -> a number
        APPEND predicted TO forecasts
    NEXT input
    RETURN forecasts
END Forecast
```

### Listing 3 — The three applications mapped to their technique + data (text reference)

```text
APPLICATION (F-A-I)        WHAT IT DOES                  TECHNIQUE UNDERNEATH        DATA IT NEEDS
Forecasting / data         predict future numeric        supervised regression       representative
  analysis                 values; find patterns         (+ clustering for analysis)   HISTORY
Assistants (virtual)       understand + respond to       supervised + NLP            vast, varied
                           human language                (speech recognition)          LANGUAGE data
Image recognition          interpret/classify visual     deep NEURAL NETWORKS        large LABELLED
                           content                       (often supervised)            image sets

Rule: name the application AND the technique AND the data it needs. ML is not magic —
each fails when its data is wrong, missing, biased, or no longer matches reality.
```

### Listing 4 — Image recognition as supervised classification (Python, scikit-learn sketch)

```python
from sklearn.neural_network import MLPClassifier

# Each image is flattened to pixel features; each carries a LABEL of what it contains.
X_pixels = [[0, 12, 255, 30, ...], [255, 240, 0, 5, ...]]   # image pixel vectors
labels   = ["cat", "stop_sign"]                              # large LABELLED image set

clf = MLPClassifier(hidden_layer_sizes=(64, 32))             # a small neural network
clf.fit(X_pixels, labels)                                    # supervised image classification

# print(clf.predict([new_image_pixels]))  -> e.g. ["cat"]
# Real systems use deep convolutional networks + millions of labelled images.
# Labelling is costly -> medical imaging often uses SEMI-supervised learning (few labels + many unlabelled).
```
