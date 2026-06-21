---
title: "Supplementary Materials — Module Review: Software Automation"
module: SA
lesson: "20–22"
script: script.md
---

# Supplementary Materials

Read-along reference for the Software Automation module review. Nothing here is spoken. This is the
one-page consolidation: Listing 1 is the full margin-dump of every SA mnemonic; Listing 2 is the
"distinguish" cheat-sheet for the trap pairs; Listing 3 is the integrated technique-plus-ethics
walkthrough applied to one scenario (the method the extended question rewards); Listing 4 is that
walkthrough as NESA pseudocode. All labels and mnemonics are reused unchanged from the SA episodes.

### Listing 1 — The whole module on one page: every mnemonic to dump in the exam margin (text reference)

```text
CH 20 — DEFINITIONS / LANDSCAPE
  "AI is the goal, ML is one way"   AI = behave intelligently (may/may not learn); ML = learns from data (subset)
  RPA = a Robot doing a Task        task-level, mimics human at the UI, BRITTLE (breaks on UI change)
  BPA = redesigning a Process       process-level, deep integration + human approvals + audit trail
  DevOps                            automate build-test-deploy pipeline (CI/CD)  -> bridges to SEE
  S-U-S-R ("suss-er")               Supervised(labelled) / Unsupervised(find-structure) /
                                    Semi(few labels) / Reinforcement(reward)
  F-A-I ("fie")                     Forecasting+analysis / Assistants / Image recognition
  "tree = readable IF-questions;    decision tree = interpretable (state the PATH, R-N-L Root/Node/Leaf)
   net = weighted neurons"          neural net = black box, powerful   -> explainability vs power
  L-L-K                             Linear / Logistic / K-nearest neighbour (+ polynomial = the curve = overfit)
                                    "Linear predicts a number; Logistic predicts a yes/no"

CH 21 — IMPLEMENTATION (OOP fit/predict; train-test split vs overfitting)
  P-L-A                             Predict -> Loss -> Adjust (training loop, many epochs)
                                    perceptron = weighted sum + bias, then activation; "layers learn features"

CH 22 — SIGNIFICANCE & IMPACT (all SE-12-05; verb ASSESS/EVALUATE = both sides + judgement)
  S-P-E-E ("spee")                  Safety & access / People & skills / Efficiency & Environment / Economy & wealth
  P-S-C-B                           Psychological / acute Stress / Cultural protocols / Belief systems
                                    "AI adapts to the human, not the human to the AI"
  S-H-L-M ("SHaLuM")                Sampling / Historical / Labeler / Measurement (the 4 bias sources)
                                    "the algorithm isn't neutral — it mirrors + amplifies its data"
  D-R-F                             Diverse data / Reweight / Fairness metrics (measure PER-GROUP)
                                    accountability = model cards + data provenance (the "A" of CIA-AAA)

ARC: definitions (20) -> implementation (21) -> impact & ethics (22).  Or: secure (SSA) -> smart (SA) -> is smart good?
```

### Listing 2 — The trap pairs: distinguish cheat-sheet (text reference)

```text
CONFUSED PAIR                       THE DISCRIMINATOR (what actually separates them)
AI vs ML                           ML is a SUBSET of AI; the line is LEARNING (rules vs learned-from-data)
Supervised vs Unsupervised         the ONLY question: do you have LABELS?
Reinforcement vs Supervised        reward AFTER acting != a labelled answer key
RPA vs BPA                         RPA = a Task at the UI (brittle); BPA = redesign the Process (integrated)
Linear vs Logistic regression      output type: NUMBER = linear; YES/NO (classification) = logistic
"the curve"                        polynomial is the curve (and how you OVERFIT), NOT logistic
Tree vs Neural network             tree = interpretable/less powerful; net = powerful/black box
Trace question                     give the PATH root->leaf, not just the leaf
Impact ("assess")                  BOTH sides + a JUDGEMENT; employment is SHIFTED not just subtracted
Bias myth                          "algorithm is neutral" -> NO (mirrors data); "more data fixes it" -> NO (if history biased)
```

### Listing 3 — The integrated method: one system, walked through the whole module (Python skeleton)

```python
# The extended-question method: take ONE system and walk it through technique -> human -> bias -> impact -> accountability.
# Scenario: automated job-applicant screening trained on 10 years of past hiring data.

def review_ml_system(system):
    # 1. TECHNIQUE  (S-U-S-R, L-L-K, OOP fit/predict, train-test split)
    training_model = "supervised"          # labelled history: applicant -> hired/not
    algorithm      = "logistic regression" # classification = yes/no  (L-L-K)
    model = LogisticModel().fit(system.train)   # fit learns, predict applies
    evaluate_on(system.test)               # NEVER on training data -> guard overfitting

    # 2. HUMAN FACTORS  (P-S-C-B)
    require(explainable_decisions=True, human_override=True)   # P: trust + control
    localise_and_test_across_cultures()                       # C: cultural protocols
    minimise_data_collection()                                # B: belief / privacy

    # 3. BIAS  (S-H-L-M -> mitigate D-R-F)
    # 10 years of own hiring history = HISTORICAL bias (+ SAMPLING if groups under-represented)
    data    = collect_diverse_contemporary_data(system.data)  # D
    weights = reweight_underrepresented(data)                 # R
    assert fairness_per_group(model, data) , "high overall accuracy can still be UNFAIR"  # F

    # 4. IMPACT  (S-P-E-E: People & skills + individual equity)  -> two-sided + judgement
    # 5. ACCOUNTABILITY  (model card + data provenance = the "A" of CIA-AAA)
    publish_model_card(model); keep_human_in_the_loop()
    return "justified ONLY if bias mitigated, transparent, and a human stays accountable"
```

### Listing 4 — NESA pseudocode: review any automated/ML system across the module (exam style)

```text
BEGIN ReviewAutomatedSystem(system)
    // 1. TECHNIQUE
    trainingModel ← ChooseFrom_SUSR(system)            // labels? how many? reward?
    algorithm     ← ChooseFrom_LLK(system.taskType)    // number -> linear ; yes/no -> logistic ; similarity -> KNN
    model         ← Fit(algorithm, system.trainingSet) // fit LEARNS
    Evaluate(model, system.testSet)                    // separate UNSEEN set -> overfitting guard

    // 2. HUMAN FACTORS (P-S-C-B)
    Require(explainDecisions, humanOverride)           // P
    AdaptForStress(system.context)                     // S
    Localise(system.cultures)                          // C
    MinimiseData(system)                               // B

    // 3. BIAS (S-H-L-M) then MITIGATE (D-R-F)
    FOR each source IN [Sampling, Historical, Labeler, Measurement]
        IF Detected(source, system.data) THEN
            ApplyMitigation([DiverseData, Reweight, FairnessMetrics])
        ENDIF
    NEXT source

    // 4. IMPACT (S-P-E-E) + 5. ACCOUNTABILITY
    judgement ← AssessImpact(system, dimensions = S_P_E_E)   // both sides + a conclusion
    PublishModelCard(model, dataProvenance)                  // visible + answerable
    RETURN judgement
END ReviewAutomatedSystem
```
