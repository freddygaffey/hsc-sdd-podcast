---
title: "Supplementary Materials — Neural Networks: Concepts and Implementation"
module: SA
lesson: "21.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
perceptron (weighted sum + bias + activation), the forward pass, and the training loop —
P-L-A: Predict, Loss, Adjust ("layers learn features"). These listings show a Perceptron class,
the training loop in NESA pseudocode, a hand-traceable forward pass, and a tiny multilayer
network in scikit-learn.

### Listing 1 — A Perceptron class: weighted sum + bias + activation, with fit/predict (Python, OOP)

```python
class Perceptron:
    """A single neuron. fit() LEARNS weights+bias (Predict-Loss-Adjust); predict() = forward pass."""
    def __init__(self, n_inputs, lr=0.1):
        self.weights = [0.0] * n_inputs
        self.bias = 0.0
        self.lr = lr

    def activate(self, z):
        return 1 if z >= 0 else 0                 # step activation

    def predict(self, inputs):                    # FORWARD PASS: multiply, sum, activate
        z = sum(x * w for x, w in zip(inputs, self.weights)) + self.bias
        return self.activate(z)

    def fit(self, X, y, epochs=20):
        for _ in range(epochs):                   # each epoch = one pass over the data
            for inputs, target in zip(X, y):
                prediction = self.predict(inputs)         # P: Predict
                error = target - prediction               # L: Loss (how wrong)
                for i in range(len(self.weights)):        # A: Adjust the weights
                    self.weights[i] += self.lr * error * inputs[i]
                self.bias += self.lr * error

# Learn the AND gate:
p = Perceptron(n_inputs=2)
p.fit([[0,0],[0,1],[1,0],[1,1]], [0,0,0,1])
print([p.predict(x) for x in [[0,0],[0,1],[1,0],[1,1]]])   # -> [0, 0, 0, 1]
```

### Listing 2 — NESA pseudocode: the P-L-A training loop (exam style)

```text
BEGIN TrainNetwork(network, trainingData, epochs)
    FOR epoch ← 1 TO epochs
        FOR each (inputs, target) IN trainingData
            prediction ← ForwardPass(network, inputs)     // PREDICT
            loss ← target - prediction                    // LOSS (how wrong)
            FOR each weight IN network
                weight ← weight + (learningRate * loss * relatedInput)   // ADJUST
            NEXT weight
        NEXT example
    NEXT epoch
END TrainNetwork
```

### Listing 3 — A hand-traceable forward pass (Python)

```python
def forward(inputs, weights, bias):
    z = sum(x * w for x, w in zip(inputs, weights)) + bias   # weighted sum + bias
    return 1 if z >= 0 else 0                                 # step activation

# weights [0.5, 0.5], bias -0.7  -> learns AND:
print(forward([1, 1], [0.5, 0.5], -0.7))   # 0.5+0.5-0.7 = 0.3  >= 0 -> 1
print(forward([1, 0], [0.5, 0.5], -0.7))   # 0.5-0.7    = -0.2 < 0  -> 0
print(forward([0, 1], [0.5, 0.5], -0.7))   # -0.2 < 0              -> 0
print(forward([0, 0], [0.5, 0.5], -0.7))   # -0.7 < 0              -> 0
# Multiply, sum, activate. That is the forward pass.
```

### Listing 4 — A tiny multilayer network (Python, scikit-learn)

```python
from sklearn.neural_network import MLPClassifier

# Input layer (2 features) -> hidden layers (4 then 3 neurons) -> output layer.
net = MLPClassifier(hidden_layer_sizes=(4, 3), max_iter=2000)

X = [[0,0],[0,1],[1,0],[1,1]]
y = [0, 1, 1, 0]                # XOR — needs HIDDEN layers (a single perceptron can't do it)
net.fit(X, y)                   # runs Predict-Loss-Adjust (backprop + gradient descent) internally
print(net.predict(X))           # -> [0, 1, 1, 0]
# A big network can OVERFIT like a high-degree polynomial -> validate on a held-out test set.
```
