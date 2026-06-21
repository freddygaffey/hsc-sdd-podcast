---
title: "Supplementary Materials — Big Data and Web Architectures"
module: PFW
lesson: "11.4"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
three Vs of big data, M-M-S (Mining, Metadata, Streaming), and the architecture patterns
(monolith / microservices / serverless) plus CDNs.

### Listing 1 — Content vs. metadata: a film record on a streaming catalogue

```json
{
  "id": 84021,
  "content": { "video_file": "s3://catalogue/84021/master.mp4" },   // the actual data

  "metadata": {                          // DATA ABOUT THE DATA — drives search & recs
    "title": "The Quiet Harbour",
    "genre": ["drama", "thriller"],
    "cast": ["A. Okafor", "M. Tan"],
    "release_year": 2023,
    "duration_minutes": 118,
    "language": "en",
    "maturity_rating": "M",
    "tags": ["slow-burn", "coastal", "mystery"]
  }
}
```

### Listing 2 — Data mining: discovering a pattern nobody queried for (Python)

```python
from collections import Counter
from itertools import combinations

# Each viewer's watch history (the "big data" — high volume/variety in reality)
histories = [
    ["The Quiet Harbour", "Edge of Dawn", "Saltwater"],
    ["The Quiet Harbour", "Saltwater"],
    ["Edge of Dawn", "Saltwater", "Nightfold"],
    ["The Quiet Harbour", "Saltwater", "Nightfold"],
]

# MINING = discovering co-watch patterns, not retrieving a known fact.
pairs = Counter()
for watched in histories:
    for a, b in combinations(sorted(set(watched)), 2):
        pairs[(a, b)] += 1

for (a, b), n in pairs.most_common(3):
    print(f"{n} viewers watched both '{a}' and '{b}'  ->  recommend one to fans of the other")
# Output reveals 'Saltwater' pairs with almost everything — a recommendation signal.
```

### Listing 3 — Streaming: bounded buffer that drops on overflow (NESA pseudocode)

```text
BEGIN ProcessStream
    buffer ← empty queue
    dropped ← 0
    MAX ← 50

    WHILE stream is active
        GET item FROM stream            // data arrives continuously (high velocity)
        IF length(buffer) ≥ MAX THEN
            dropped ← dropped + 1        // overflow: can't keep up, drop the item
        ELSE
            ENQUEUE item INTO buffer
        ENDIF

        IF buffer NOT empty THEN
            item ← DEQUEUE buffer
            PROCESS item                 // real-time processing
        ENDIF
    ENDWHILE

    DISPLAY "Dropped: ", dropped
END ProcessStream
```
