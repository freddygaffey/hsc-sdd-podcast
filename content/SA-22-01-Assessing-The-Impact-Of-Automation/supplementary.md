---
title: "Supplementary Materials — Assessing the Impact of Automation"
module: SA
lesson: "22.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the five
impact dimensions — the hook S-P-E-E: Safety & access, People & skills, Efficiency &
Environment, Economy & wealth — assessed two-sidedly (upside vs downside) to a judgement. This
is an analysis-heavy lesson; the reference table below is for revision, and Listing 2 is a small
labelled tool for scoring an impact assessment.

### Listing 1 — The five impact dimensions, both sides (text reference, S-P-E-E)

```text
DIMENSION (S-P-E-E)            UPSIDE                              DOWNSIDE
S  Safety of workers          removes humans from hazardous       new hazards (struck by machinery,
                              tasks (lifting, toxic, mining)       over-reliance, monitoring strain)
S  People with disability     enabling: voice assistants,         excluding: inaccessible kiosks/
                              captions, screen readers, transport   touchscreens; AI fails atypical users
P  People & skills            new roles (build/run/maintain),     displaces routine jobs; skills gap;
   (employment)               frees from drudgery, productivity    reskilling burden -> "shift, not loss"
E  Efficiency & Environment   more output; less production waste;  hardware footprint + e-waste; large
                              optimise energy/logistics            ML training uses huge energy + water
E  Economy & wealth           grows economy; cheaper goods         gains concentrate with tech owners;
                                                                   displaced workers pay -> inequality

Method: ASSESS = both sides + a JUDGEMENT.  Trap: one-sided / "robots take jobs" with no nuance.
```

### Listing 2 — A small impact-assessment scoring tool (Python)

```python
from dataclasses import dataclass, field

@dataclass
class ImpactAssessment:
    """Force a TWO-SIDED assessment per dimension, then summarise — mirrors the exam method."""
    dimensions = ["safety", "disability", "employment", "efficiency_environment", "economy_wealth"]
    upsides: dict = field(default_factory=dict)
    downsides: dict = field(default_factory=dict)

    def record(self, dimension, upside, downside):
        assert dimension in self.dimensions, "must be an S-P-E-E dimension"
        self.upsides[dimension] = upside
        self.downsides[dimension] = downside

    def is_balanced(self):
        # A valid assessment has BOTH an upside AND a downside for each dimension considered.
        return all(d in self.upsides and d in self.downsides for d in self.upsides)

a = ImpactAssessment()
a.record("safety", "removes humans from hazardous lifting", "risk of being struck by machinery")
a.record("employment", "creates roles maintaining the robots", "displaces routine manual workers")
print("two-sided?", a.is_balanced())   # True only if every dimension has BOTH sides
```

### Listing 3 — NESA pseudocode: a two-sided assessment routine (exam style)

```text
BEGIN AssessAutomation(dimensions)
    FOR each dimension IN dimensions          // S-P-E-E
        upside   ← IdentifyBenefit(dimension)
        downside ← IdentifyCost(dimension)
        IF upside = NULL OR downside = NULL THEN
            DISPLAY "incomplete: assessment must weigh BOTH sides"
        ELSE
            RecordAssessment(dimension, upside, downside)
        ENDIF
    NEXT dimension
    judgement ← WeighUpsidesAgainstDownsides()  // reach a justified conclusion
    RETURN judgement
END AssessAutomation
```
