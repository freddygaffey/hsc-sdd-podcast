# Podcast Plan — Software Automation (SA)

> **What this file is.** The episode-by-episode brief an AI agent uses to write each
> script for this module. Read `../../STYLE.md` and `../../SUPPLEMENTARY.md`
> first — seeds here, form there. Each entry is a brief, not a script. One home topic
> per episode; expand to ~30–45 min satisfying the STYLE.md §9 checklist.
>
> **Note:** episode 1, `content/SA-20-01-What-is-AI-vs-ML/`, already exists and is the
> reference example for the format (two-voice `script.md` + `supplementary.md`). Its
> brief below reflects what it should contain.

---

## Module facts

- **Module acronym (frontmatter `module:`):** `SA`
- **Outcomes in play (dominant):** SE-12-02, SE-12-03, SE-12-05.
- **Teaching-order position:** **3rd** of the four Year 12 modules (after PFW, SSA). Recap into both: ML feeds on big data (PFW 11-04), and ML pipelines have their own attack surface + privacy stakes (SSA 16-02, 19-03).
- **Textbook source:** `docs/Year12/SoftwareAutomation/` chapters 20–22.
- **Naming & layout:** episode folder = `content/SA-LL-Topic-Title/` (acronym in the folder name, e.g. `content/SA-20-02-ML-Training-Models/`); `module: SA` in `script.md` frontmatter; review `SA-22-99-…`; case studies `case_…`. Frontmatter template as in the PFW plan (swap `module: SA`); see `AUTHORING.md` for the two-file layout.

### Episode list (teaching order)

| # | Episode folder | Kind | Dot-point focus | Outcomes |
|---|----------|------|-----------------|----------|
| 1 | `SA-20-01-What-is-AI-vs-ML` | lesson | AI vs ML; RPA/BPA; DevOps | SE-12-03 |
| 2 | `SA-20-02-ML-Training-Models` | lesson | supervised…reinforcement | SE-12-03 |
| 3 | `SA-20-03-Common-ML-Applications` | lesson | forecasting, assistants, image | SE-12-03 |
| 4 | `SA-20-04-Decision-Trees-And-Neural-Networks` | lesson | design/analysis models | SE-12-02 |
| 5 | `SA-20-05-RPA-And-BPA-Practical-Considerations` | lesson | RPA/BPA implementation, ethics | SE-12-02, SE-12-05 |
| 6 | `SA-21-01-Regression-And-Core-Algorithm-Types` | lesson | linear/logistic/poly, KNN | SE-12-02 |
| 7 | `SA-21-02-Neural-Networks-Concepts-And-Implementation` | lesson | perceptron, MLP, training loop | SE-12-02 |
| 8 | `SA-22-01-Assessing-The-Impact-Of-Automation` | lesson | social/economic/environmental | SE-12-05 |
| 9 | `SA-22-02-Human-Behaviour-Patterns-And-ML-AI` | lesson | psychology, culture, beliefs | SE-12-05 |
| 10 | `SA-22-03-Bias-In-Datasets-And-Models` | lesson | bias sources & mitigation | SE-12-05 |
| 11 | `SA-22-99-Module-Review-Software-Automation` | module-review | whole module | all |

(~11 episodes — one final review is sufficient per STYLE §5.3; an optional mid-review after 20-05 may be added if Ch 20 runs long.)

**Case studies (write as `case_…`, story-first; cash in later):**
- `case_the_amazon_recruiting_ai` — Amazon's experimental hiring model learned to penalise CVs containing "women's", then was scrapped. Cashes into **22-03** (historical/label bias), **20-02** (supervised learning is only as good as its labels).
- `case_the_compas_recidivism` — a criminal-risk-scoring model accused of racial bias; the fairness/accuracy debate. Cashes into **22-03** (fairness metrics), **22-01** (impact on individuals/society), **22-02** (human/justice context).
- `case_zillow_offers` — Zillow's house-price ML over-bought and the iBuying unit collapsed (~$500M+). Cashes into **20-03** (forecasting) and **21-01** (regression overconfidence/overfitting).

### Module-wide mnemonics (coin once, reuse everywhere)

- **AI ⊃ ML** → **"AI is the goal (behave intelligently); ML is one way (learn from data)"** — keep the prototype episode's exact line.
- **Four training models** → **"SUSR"** = *Supervised, Unsupervised, Semi-supervised, Reinforcement*. Pair each with a one-line trigger: Supervised=labelled, Unsupervised=find-structure, Semi=few-labels, Reinforcement=reward.
- **RPA vs BPA** → **"RPA = a Robot doing a Task; BPA = redesigning a Process"** (keep the prototype's "task" vs "process" keywords).
- **ML algorithm types** → **"LLK"** = *Linear regression, Logistic regression, K-nearest neighbour* (+ polynomial as an extension).
- **Bias sources** → **"S-H-L-M"** = *Sampling, Historical, Labeler, Measurement* bias.
- **Impact dimensions** → **"S-P-E-E"** = *Safety/disability, People & skills (employment), Efficiency & Environment, Economy & wealth*.

---

## Episode briefs

### 20-01 — What is AI vs ML (and where RPA/BPA fit)
- **Source:** Ch 20 §20.1. **Outcomes:** SE-12-03.
- **Dot-points:** *Distinguish AI and ML; investigate how ML supports automation through DevOps, RPA and BPA.*
- **Teach:** the precise AI/ML distinction and where RPA/BPA/DevOps sit; how ML augments them.
- **§5.1 recap:** First SA episode — bridge from SSA: "we just spent a module making software *safe*; now we make it *smart* — and ML brings its own privacy/bias risks we'll keep flagging." Keep opener short.
- **Interleave:** backward → ML training data = the big data of PFW 11-04; forward → bias (22-03) and privacy (SSA 16-02); link → DevOps automation echoes SEE version control/CI (forward).
- **Mnemonics:** "AI is the goal; ML is one way"; "RPA = Robot/Task, BPA = redesign/Process".
- **Worked example seed:** keep the prototype's rule-based expert system vs ML classifier contrast (ticket sorting); add a "where does RPA/BPA fit" line.
- **Exam seeds:** "Distinguish between AI and ML." (3) / "Compare RPA and BPA." (4) / "Explain how ML can enhance an RPA workflow."
- **Appendix:** Listing 1 — rule-based classifier (Python); Listing 2 — ML classifier sketch; Listing 3 — NESA pseudocode for the rule engine.
- **Traps:** "AI = ML"; calling if-statements "AI"; RPA/BPA conflation.

### 20-02 — ML training models
- **Source:** Ch 20 §20.2. **Outcomes:** SE-12-03.
- **Dot-points:** *Models of training ML — supervised, unsupervised, semi-supervised, reinforcement learning.*
- **Teach:** the four paradigms — what data each needs, what each is for.
- **§5.1 recap:** AI vs ML (20-01); RPA/BPA keywords.
- **Interleave:** forward → supervised underpins regression (21-01) & the bias cases; story → seed `case_the_amazon_recruiting_ai` (supervised learning learns the labels' bias); link → reinforcement ↔ control loops (Year 11 mechatronics, backward).
- **Mnemonics:** **"SUSR"** with triggers (labelled / find-structure / few-labels / reward).
- **Worked example seed:** classify four real problems (spam filter, customer segmentation, game AI, fraud with few labels) into SUSR; justify.
- **Exam seeds:** "Distinguish supervised from unsupervised learning." (4) / "Identify the most appropriate training model for [scenario] and justify."
- **Appendix:** Listing 1 — labelled vs unlabelled dataset shape; Listing 2 — supervised fit/predict sketch.
- **Traps:** supervised/unsupervised confusion; thinking reinforcement = supervised.

### 20-03 — Common ML applications
- **Source:** Ch 20 §20.3. **Outcomes:** SE-12-03.
- **Dot-points:** *Common applications of key ML algorithms — data analysis and forecasting; virtual personal assistants; image recognition.*
- **Teach:** what ML is actually used for and which technique maps to which application.
- **§5.1 recap:** SUSR (20-02); AI vs ML.
- **Interleave:** story → seed `case_zillow_offers` (forecasting gone wrong); forward → forecasting = regression (21-01), image = neural nets (20-04/21-02); link → assistants ↔ NLP/big data (PFW 11-04).
- **Mnemonics:** application trio → **"F-A-I"** = *Forecasting, Assistants, Image recognition*.
- **Worked example seed:** map each application to its training model + algorithm family; one strong-answer sentence each.
- **Exam seeds:** "Describe two common applications of machine learning." / "Explain how ML supports demand forecasting."
- **Appendix:** Listing 1 — a tiny forecasting example (Python).
- **Traps:** treating ML as magic; ignoring data requirements per application.

### 20-04 — Decision trees and neural networks (design/analysis models)
- **Source:** Ch 20 §20.4. **Outcomes:** SE-12-02.
- **Dot-points:** *Models used to design and analyse ML — decision trees; neural networks.*
- **Teach:** how engineers *reason about* models — read/trace a decision tree; the neuron→network mental model.
- **§5.1 recap:** applications/F-A-I (20-03); SUSR.
- **Interleave:** forward → neural network *implementation* in 21-02; contrast → interpretable tree vs opaque network (ties to SSA "transparency"/accountability and 22-03 bias); link → trees echo the selection/branching logic of Year 11 algorithms (backward).
- **Mnemonics:** **"Tree = readable IF-questions; Net = weighted neurons"**. Tree terms → **"R-N-L"** = *Root, Node, Leaf*.
- **Worked example seed:** trace a small decision tree by hand to a prediction; sketch a 2-input neuron firing.
- **Exam seeds:** "Trace the given decision tree for the input …" (code/stimulus) / "Compare decision trees and neural networks for explainability." (4)
- **Appendix:** Listing 1 — decision tree as nested IFs (Python); Listing 2 — NESA pseudocode for tree traversal; Listing 3 — a neuron's weighted-sum + activation.
- **Traps:** thinking neural nets are "brains"; ignoring overfitting (deep trees memorise).

### 20-05 — RPA and BPA: practical considerations
- **Source:** Ch 20 §20.5. **Outcomes:** SE-12-02, SE-12-05.
- **Dot-points:** *Implementation examples and constraints for RPA and BPA* — use cases, tooling/low-code vs custom, when to re-engineer, ethical/security/maintainability considerations.
- **Teach:** how RPA/BPA are actually deployed and the engineering + ethical constraints.
- **§5.1 recap:** trees/nets (20-04); RPA=Robot/Task, BPA=Process (20-01).
- **Interleave:** backward → RPA "uses the UI like a human" depends on the web front/back-end split (PFW 12-02/13-01); link → automating workflows raises the security/privacy issues from SSA (input handling, secrets); forward → employment impact = 22-01.
- **Mnemonics:** decision rule → **"Automate the task (RPA) or rethink the process (BPA)?"**; RPA risks → **"BRITTLE"** (UI changes break the bot).
- **Worked example seed:** invoice-processing (RPA) vs onboarding (BPA) — keep the prototype's examples; add "when RPA is the wrong call".
- **Exam seeds:** "Evaluate the use of RPA for [scenario]." (extended, SE-12-05) / "Explain one maintainability risk of RPA."
- **Appendix:** Listing 1 — a pseudo-RPA script (Python, narrated); Listing 2 — NESA pseudocode for an approval workflow (BPA).
- **Traps:** RPA as permanent fix (brittle to UI change); ignoring security of automated credentials.

### 21-01 — Regression and core algorithm types
- **Source:** Ch 21 §21.1. **Outcomes:** SE-12-02.
- **Dot-points:** *Develop ML regression models (linear, polynomial, logistic) using OOP to predict values; types of ML algorithms — linear regression, logistic regression, K-nearest neighbour.*
- **Teach:** fitting and evaluating regression; logistic = classification; KNN; avoiding overfitting; explainability.
- **§5.1 recap:** trees/nets (20-04); F-A-I applications (forecasting = regression); SUSR (supervised).
- **Interleave:** story → `case_zillow_offers` (regression overconfidence/overfitting) pays off; backward → uses OOP from Year 11 OOP11 (classes for models); contrast → linear (continuous) vs logistic (probability/class).
- **Mnemonics:** **"LLK"** = Linear, Logistic, K-nearest (+ polynomial extension). **"Linear predicts a number; Logistic predicts a yes/no"**.
- **Worked example seed:** fit a line to predict a price; show overfitting with a high-degree polynomial; narrate train/test split.
- **Exam seeds:** "Distinguish linear from logistic regression." (4) / "Explain overfitting and one way to reduce it." / code-editor: complete a `fit`/`predict` method.
- **Appendix:** Listing 1 — a `LinearModel` class with fit/predict (Python, OOP); Listing 2 — logistic/sigmoid; Listing 3 — KNN sketch; Listing 4 — NESA pseudocode for the prediction loop.
- **Traps:** logistic "regression" is classification; fitting to noise (overfit); evaluating on training data.

### 21-02 — Neural networks: concepts and implementation
- **Source:** Ch 21 §21.2. **Outcomes:** SE-12-02.
- **Dot-points:** *Apply neural network models using OOP to make predictions.*
- **Teach:** perceptron → tiny multilayer network; forward pass and the *intuition* of training (loss → adjust weights).
- **§5.1 recap:** regression/LLK (21-01); neuron model from 20-04.
- **Interleave:** backward → builds directly on the neuron sketch (20-04) and OOP model class (21-01); contrast → network (opaque, powerful) vs regression (simple, explainable) — ties to 22-03 transparency.
- **Mnemonics:** training loop → **"P-L-A"** = *Predict, Loss, Adjust* (repeat). **"Layers learn features"**.
- **Worked example seed:** narrate a 2-input perceptron classifying AND/OR; one epoch of weight adjustment by hand.
- **Exam seeds:** "Describe the structure of a neural network." (4) / "Explain how a neural network learns from data."
- **Appendix:** Listing 1 — a `Perceptron`/tiny-MLP class (Python, OOP); Listing 2 — NESA pseudocode for the forward pass + weight update.
- **Traps:** hand-waving "it just learns"; confusing layers/neurons/weights.

### 22-01 — Assessing the impact of automation
- **Source:** Ch 22 §22.1. **Outcomes:** SE-12-05.
- **Dot-points:** *Impact of automation on individual, society and environment — safety of workers; people with disability; nature/skills for employment; production efficiency, waste, environment; economy and distribution of wealth.*
- **Teach:** structured impact analysis across the five dimensions, both upsides and downsides.
- **§5.1 recap:** neural nets (21-02); RPA/BPA employment angle (20-05).
- **Interleave:** story → `case_the_compas_recidivism` (impact on individuals/justice); link → accessibility (PFW 12-01/12-04, SSA 14-03); forward → bias amplifies these impacts (22-03).
- **Mnemonics:** **"S-P-E-E"** = Safety/disability, People & skills, Efficiency & Environment, Economy & wealth (coin/reuse). 
- **Worked example seed:** assess warehouse automation across S-P-E-E with one concrete point each; weak vs strong answer.
- **Exam seeds:** "Assess the impact of automation on employment." (extended) / "Explain one environmental benefit and one cost of automation."
- **Appendix:** none required (analysis-heavy) — optional impact matrix table.
- **Traps:** one-sided answers; vague "robots take jobs" without the skills-shift nuance.

### 22-02 — Human behaviour patterns and their influence on ML/AI
- **Source:** Ch 22 §22.2. **Outcomes:** SE-12-05.
- **Dot-points:** *How patterns in human behaviour influence ML/AI development — psychological responses; acute stress response; cultural protocols; belief systems.*
- **Teach:** how human behaviour shapes (and distorts) the data and design of ML/AI systems.
- **§5.1 recap:** impact/S-P-E-E (22-01); applications (assistants read human behaviour).
- **Interleave:** forward → behaviour-driven data is where bias enters (22-03); link → UX/psychology (PFW 12-04); link → cultural protocols echo the syllabus's ICIP/Indigenous engagement themes.
- **Mnemonics:** **"P-S-C-B"** = *Psychological responses, Stress response, Cultural protocols, Belief systems*.
- **Worked example seed:** how an assistant misreads stressed/short user inputs; how cultural norms change "correct" behaviour for a model.
- **Exam seeds:** "Explain how human behaviour patterns influence the design of an ML system." (6)
- **Appendix:** Listing 1 — a small example of behaviour-derived features (text/Python).
- **Traps:** treating users as uniform; ignoring cultural context in data.

### 22-03 — Bias in datasets and models
- **Source:** Ch 22 §22.3. **Outcomes:** SE-12-05.
- **Dot-points:** *Effect of human and dataset source bias in ML/AI* — sources of bias; provenance/missing groups/measurement; mitigation; transparency & accountability.
- **Teach:** where bias comes from, how to detect it, how to mitigate, and why transparency matters.
- **§5.1 recap:** behaviour/P-S-C-B (22-02); impact/S-P-E-E (22-01); supervised learning (20-02).
- **Interleave (heavy):** story → `case_the_amazon_recruiting_ai` **and** `case_the_compas_recidivism` both pay off here; backward → supervised learning's "garbage labels in, bias out" (20-02); link → transparency/accountability = SSA accountability (15-01); link → privacy/data provenance (SSA 16-02).
- **Mnemonics:** **"S-H-L-M"** = Sampling, Historical, Labeler, Measurement bias. Mitigation → **"D-R-F"** = *Diverse data, Reweight, Fairness metrics*. Accountability → "model cards + reproducibility".
- **Worked example seed:** diagnose bias in a hiring model (the Amazon story), trace it to historical/label bias, propose D-R-F fixes; weak vs strong answer.
- **Exam seeds:** "Explain how bias enters an ML system and one mitigation." (6) / "Evaluate the ethical responsibility of developers regarding dataset bias." (extended)
- **Appendix:** Listing 1 — measuring class balance / a fairness check (Python); Listing 2 — a model-card template (text).
- **Traps:** "the algorithm is neutral"; thinking more data alone fixes bias.

### 22-99 — Module review: Software Automation
- **Kind:** module-review. **Outcomes:** all SA.
- **Job:** weave definitions (20) → implementation (21) → impact/ethics (22). Re-surface every mnemonic: AI-goal/ML-way, SUSR, RPA-Task/BPA-Process, LLK, P-L-A, S-P-E-E, P-S-C-B, S-H-L-M, D-R-F. Heavy `QUESTION:` voice; integrated questions spanning technique + ethics (e.g. "design an ML hiring tool — pick the model, then evaluate its bias and societal impact"). Pull the three case studies together. Bridge forward into **Software Engineering Project** (the synthesis module).
- **Traps to consolidate:** AI=ML, supervised=unsupervised, logistic=regression-of-numbers, "algorithm is neutral".
- **Exam seeds:** one extended technique-plus-ethics question + a distinguish/identify round.
```
