---
title: "Supplementary Materials — Human Behaviour Patterns and Their Influence on ML and AI Development"
module: SA
lesson: "22.2"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the four
human behaviour patterns — the hook P-S-C-B: Psychological responses, acute Stress response,
Cultural protocols, Belief systems — and, for each, the design response an engineer makes ("explore
by implementation"). This is a concept-heavy lesson, so Listing 1 is a reference table mapping each
factor to its influence and design response; Listings 2 and 3 show the "by implementation" angle —
behaviour-derived features and a stress-aware design check; Listing 4 is the same logic in NESA pseudocode.

### Listing 1 — The four human behaviour patterns: factor, influence, design response (text reference, P-S-C-B)

```text
FACTOR (P-S-C-B)          HOW IT INFLUENCES THE SYSTEM            DESIGN RESPONSE (the marker's mark)
P  Psychological          trust needs transparency; users want   explain each decision; keep a
   responses             control; high cognitive load -> errors   human override; reduce clutter
S  acute Stress           stress -> less accurate/consistent      train on realistic high-stress data;
   response              behaviour; calm-only data fails the       detect stress indicators + adapt
                         stressed user when needed most            the interface (simplify, confirm)
C  Cultural protocols      norms of authority, communication,      localise; test with the target
                         decision-making, privacy vary; ICIP for   cultures; build with diverse teams;
                         Aboriginal & Torres Strait cultural data  don't assume one default is universal
B  Belief systems          tech-optimism, privacy-as-right, human  offer transparency + human oversight
                         agency, fairness demands decide ACCEPT    + CHOICE of automation level + data
                         vs REJECT of the same feature             minimisation

Thesis: successful AI ADAPTS TO human behaviour; it does not force humans to adapt to it.
Bridge: P-S-C-B (the human source) feeds straight into S-H-L-M (the bias that results) — next episode.
```

### Listing 2 — "By implementation": turning human behaviour into model features (Python)

```python
# The dot-point verb is "explore BY IMPLEMENTATION" — human behaviour becomes design + code decisions.
# Here, raw interaction signals are turned into behaviour-derived features a model can use,
# WITHOUT assuming every user behaves the same (the central trap).

def behaviour_features(session) -> dict:
    """Derive behavioural features from one user session."""
    return {
        # Psychological signal: did the user accept or override the system's suggestion?
        "override_rate": session.overrides / max(session.suggestions, 1),
        # Acute-stress signals: rushed, erratic, error-prone input under pressure.
        "avg_response_time": session.mean_response_time,      # very fast OR very slow can both = stress
        "input_error_rate": session.corrections / max(session.keystrokes, 1),
        "abandonment": session.abandoned_steps,
        # Belief signal (revealed preference): did the user opt into data collection / automation?
        "privacy_mode": session.user_settings.get("privacy_mode", False),
        "automation_level": session.user_settings.get("automation_level", "medium"),
    }

def adapt_to_user(features) -> dict:
    """Adapt the interface to the user's behaviour rather than forcing one default on everyone."""
    config = {"explain_decisions": True, "allow_override": True}   # psychology: trust + control by default
    if features["avg_response_time"] < 0.4 or features["input_error_rate"] > 0.15:
        config["simplify_ui"] = True          # stress detected -> reduce cognitive load, confirm actions
        config["confirm_before_submit"] = True
    if features["privacy_mode"]:
        config["collect_minimum_data"] = True # belief: privacy-as-fundamental -> data minimisation
    return config
```

### Listing 3 — Why "calm-only" training data fails stressed users (Python, the key implication)

```python
# The sharp exam point: a model trained ONLY on calm, happy-path data
# performs WORST exactly when users are stressed — i.e. when they need it most.

calm_training_data   = collect_interactions(stress_level="low")   # tidy, complete, consistent inputs
model = train(calm_training_data)

# Deployment reality: an exhausted clinician at 3am, typing fast, leaving fields blank.
stressed_input = {"symptom": "chst pain", "history": "", "typed_in_seconds": 4}

# The model meets behaviour it never saw in training -> low confidence, wrong, or brittle.
# FIX: train on data spanning realistic stress conditions, and route low-confidence cases to a human.
prediction, confidence = model.predict(stressed_input)
if confidence < 0.80:
    route_to_human(stressed_input)            # meaningful human oversight (accountability)
```

### Listing 4 — NESA pseudocode: adapt an AI system to user behaviour (exam style)

```text
BEGIN AdaptToUser(session)
    features ← DeriveBehaviourFeatures(session)        // P-S-C-B signals from real interaction

    config ← NewConfig()
    config.explainDecisions ← TRUE                     // P: trust through transparency
    config.allowOverride    ← TRUE                     // P: perceived control

    IF features.responseTime < THRESHOLD OR features.errorRate > THRESHOLD THEN
        config.simplifyInterface ← TRUE                // S: stress detected -> lower cognitive load
        config.confirmBeforeAction ← TRUE
    ENDIF

    IF features.locale ≠ defaultLocale THEN
        config ← Localise(config, features.locale)     // C: cultural protocols -> localisation
    ENDIF

    IF features.privacyMode = TRUE THEN
        config.collectMinimumData ← TRUE               // B: belief -> data minimisation
    ENDIF

    RETURN config                                      // adapt the system to the human, not the reverse
END AdaptToUser
```
