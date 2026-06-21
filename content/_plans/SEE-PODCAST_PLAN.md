# Podcast Plan — Software Engineering Project (SEE)

> **What this file is.** The episode-by-episode brief an AI agent uses to write each
> script for this module. Read `../../STYLE.md` and `../../SUPPLEMENTARY.md`
> first — seeds here, form there. One home topic per episode; expand to ~30–45 min
> against the STYLE.md §9 checklist.
>
> **Special character of this module.** SEE is the **synthesis module** — it is *about
> the process* of building software, and it deliberately re-uses every other module.
> So interleaving is unusually dense here: nearly every episode should call back to
> PFW, SSA, SA **and** Year 11. Treat the whole module as a running spaced-repetition
> exercise over the course. The SEE outcomes (esp. SE-12-09) reward *managing and
> documenting* a project — keep pointing at the marker.

---

## Module facts

- **Module acronym (frontmatter `module:`):** `SEE`
- **Outcomes in play (dominant):** SE-12-01, SE-12-05, SE-12-06, SE-12-08, SE-12-09 (with SE-12-02).
- **Teaching-order position:** **4th / last** of the four Year 12 modules. Recap into all three prior modules constantly.
- **Textbook source:** `docs/Year12/SoftwareEngineeringProject/` chapters 23–26.
- **Naming & layout:** episode folder = `content/SEE-LL-Topic-Title/` (acronym in the folder name, e.g. `content/SEE-24-04-Project-Management-Tools-And-Gantt/`); `module: SEE` in `script.md` frontmatter; reviews `SEE-XX-99-…`; case studies `case_…`. Frontmatter template as in the PFW plan (swap `module: SEE`); see `AUTHORING.md` for the two-file layout.

### Episode list (teaching order)

| # | Episode folder | Kind | Dot-point focus | Outcomes |
|---|----------|------|-----------------|----------|
| 1 | `SEE-23-01-Requirements-And-Feasibility` | lesson | requirements, feasibility, boundaries | SE-12-01 |
| 2 | `SEE-23-02-Ideation-And-Modelling-Tools` | lesson | brainstorm, data dictionaries, modelling | SE-12-06 |
| 3 | `SEE-23-03-Implementation-Methods` | lesson | direct/phased/parallel/pilot | SE-12-06 |
| 4 | `SEE-24-01-Waterfall-Approach` | lesson | waterfall lifecycle | SE-12-06 |
| 5 | `SEE-24-02-Agile-Approach` | lesson | agile, iterations, stories | SE-12-06 |
| 6 | `SEE-24-03-WAgile-Hybrid-Approach` | lesson | hybrid model | SE-12-06 |
| 7 | `SEE-24-04-Project-Management-Tools-And-Gantt` | lesson | scheduling, Gantt, tracking | SE-12-09 |
| 8 | `SEE-24-05-Social-Ethical-And-Communication-Issues` | lesson | stakeholders, ethics, feedback | SE-12-05 |
| 9 | `SEE-24-06-Quality-Assurance` | lesson | QA criteria, compliance | SE-12-06 |
| 10 | `SEE-24-99-Module-Review-Defining-And-Planning` | module-review | Ch 23–24 | all |
| 11 | `SEE-25-01-Building-The-Solution` | lesson | incremental build | SE-12-02 |
| 12 | `SEE-25-02-Presenting-The-Solution` | lesson | presentation, demo | SE-12-09 |
| 13 | `SEE-25-03-Algorithms-Documentation-And-Back-End-Engineering` | lesson | artefacts, back-end contribution | SE-12-06 |
| 14 | `SEE-25-04-Data-Backup-And-Version-Control` | lesson | backups, branching, releases | SE-12-06 |
| 15 | `SEE-25-05-Overcoming-Development-Difficulties` | lesson | blockers, escalation | SE-12-06 |
| 16 | `SEE-25-06-Prototype-And-UI-Design` | lesson | wireframes, usability | SE-12-06 |
| 17 | `SEE-26-01-Testing-Methodologies-And-Optimisation` | lesson | test plans, path/boundary | SE-12-08 |
| 18 | `SEE-26-02-Feedback-Analysis` | lesson | collect/synthesise feedback | SE-12-09 |
| 19 | `SEE-26-03-Evaluating-The-Software-Solution` | lesson | evaluation report, evidence | SE-12-06 |
| 20 | `SEE-26-99-Module-Review-Software-Engineering-Project` | module-review | whole module + whole year | all |

**Case studies (write as `case_…`, story-first; cash in later):**
- `case_the_healthcare_gov_launch` — the 2013 US Healthcare.gov launch meltdown: rushed requirements, waterfall under fixed deadline, no real load testing. Cashes into **23-01** (requirements/feasibility), **24-01** (waterfall risk), **26-01** (testing/load), **26-03** (evaluation).
- `case_the_knight_capital_glitch` — 2012: a bad deployment of leftover code lost ~$440M in 45 minutes. Cashes into **25-04** (version control/deployment hygiene/rollback), **26-01** (testing), **25-05** (difficulties).
- `case_the_denver_airport_baggage` — the automated baggage system that doomed an airport opening: scope, feasibility, integration. Cashes into **23-01** (feasibility/boundaries) and **23-03** (implementation method — big-bang/direct risk).

### Module-wide mnemonics (coin once, reuse everywhere)

- **Implementation methods** → **"DiP-PP"** = *Direct, Phased, Parallel, Pilot*. Pair each with a one-line risk profile (Direct=cheap/risky; Parallel=safe/costly).
- **Waterfall vs Agile** → **"Waterfall Falls once; Agile Goes around"** (linear stage-gates vs iterative loops).
- **Requirements types** → **"FUN vs PERF"** = *Functional* (what it does) vs *non-functional/Performance* (how well).
- **Project triangle** → **"Scope–Time–Cost"** (pick two / quality in the middle).
- **Communication with the client** → **"I-F-N"** = *Involve, enable Feedback, Negotiate*.
- **Evaluation** → **"C-E-R"** = *Criteria, Evidence, Reflection* (reuse SSA 19-04's Measure-Audit-Improve idea).
- **Testing data** → reuse Year 11's **path + boundary** hook; "test the edges and every road through".

---

## Episode briefs

### 23-01 — Requirements and feasibility
- **Source:** Ch 23 §23.1. **Outcomes:** SE-12-01.
- **Dot-points:** *Define and analyse requirements — needs/opportunities; scheduling & financial feasibility; functional & performance requirements; data structures & types; boundaries.*
- **Teach:** turning a fuzzy problem into bounded, testable requirements and a feasibility call.
- **§5.1 recap:** First SEE episode — bridge from SA/SSA/PFW: "you can now build smart, secure web software; this module is how you *run the project* that ships it." Keep opener short.
- **Interleave:** backward → data structures/types & data dictionaries = Year 11 PF11 03-02/03-03 (now as requirements); story → seed `case_the_denver_airport_baggage` (feasibility/scope failure); forward → requirements drive QA (24-06) and evaluation (26-03).
- **Mnemonics:** **"FUN vs PERF"** (functional vs non-functional); feasibility → **"TECO"** = *Technical, Economic, Cost/schedule, Operational*.
- **Worked example seed:** write 3 functional + 2 non-functional requirements for a given brief, with measurable acceptance criteria; weak ("it should be fast") vs strong ("p95 < 300ms").
- **Exam seeds:** "Distinguish functional from non-functional requirements." (4) / "Explain how feasibility is assessed for a software project." (6)
- **Appendix:** Listing 1 — a data dictionary table; Listing 2 — a requirements spec excerpt (text).
- **Traps:** vague/untestable requirements; ignoring boundaries (scope creep).

### 23-02 — Ideation and modelling tools
- **Source:** Ch 23 §23.2. **Outcomes:** SE-12-06.
- **Dot-points:** *Tools to develop ideas — brainstorming, mind-mapping, storyboards; data dictionaries; algorithm design; code generation; testing & debugging; installation; maintenance.*
- **Teach:** the toolkit for going from idea → modelled solution, and choosing the right tool.
- **§5.1 recap:** requirements/FUN-PERF (23-01); data dictionaries.
- **Interleave:** backward → algorithm design, pseudocode/flowcharts, structure charts = Year 11 PF11 02-x and OOP11 05-05 (reuse directly); forward → these models feed the build (25-01) and prototype (25-06).
- **Mnemonics:** ideation set → **"B-M-S"** = *Brainstorm, Mind-map, Storyboard*.
- **Worked example seed:** model one feature with a data dictionary + pseudocode + a storyboard frame.
- **Exam seeds:** "Describe two tools used to generate and develop software ideas." / "Explain the purpose of a data dictionary in project design."
- **Appendix:** Listing 1 — data dictionary; Listing 2 — NESA pseudocode for the feature; (no diagrams — describe storyboards in words, SUPPLEMENTARY §3).
- **Traps:** jumping to code before modelling; data dictionary as an afterthought.

### 23-03 — Implementation methods
- **Source:** Ch 23 §23.3. **Outcomes:** SE-12-06.
- **Dot-points:** *Software implementation methods — direct, phased, parallel, pilot.* (ModulePlan also folds WAgile context here; WAgile is taught fully in 24-03.)
- **Teach:** the four cut-over strategies and how to justify one for a context.
- **§5.1 recap:** modelling tools/B-M-S (23-02); requirements.
- **Interleave:** story → `case_the_knight_capital_glitch` (a direct/big-bang deployment disaster) and `case_the_denver_airport_baggage` (direct cut-over risk); forward → links to backup/rollback (25-04) and testing (26-01).
- **Mnemonics:** **"DiP-PP"** = Direct, Phased, Parallel, Pilot, each with its risk one-liner.
- **Worked example seed:** recommend an implementation method for a hospital system vs a small startup app; justify with risk/cost.
- **Exam seeds:** "Compare direct and parallel implementation methods." (4) / "Recommend and justify an implementation method for [scenario]." (extended)
- **Appendix:** Listing 1 — a comparison table of the four methods (text).
- **Traps:** direct cut-over for high-risk systems; confusing parallel with phased.

### 24-01 — Waterfall approach
- **Source:** Ch 24 §24.1. **Outcomes:** SE-12-06.
- **Dot-points:** *Waterfall — logical progression of steps; stages of 'falling water'; advantages/disadvantages; scale and types of developments.*
- **Teach:** the linear stage-gate lifecycle, where it shines, where it fails.
- **§5.1 recap:** implementation methods/DiP-PP (23-03); requirements (feasibility).
- **Interleave:** backward → waterfall vs agile first met in Year 11 PF11 01-04 (now in depth); story → `case_the_healthcare_gov_launch` (waterfall + fixed deadline + weak testing); forward → contrast set up for agile (24-02).
- **Mnemonics:** **"Waterfall Falls once"** (no going back up cheaply); stages reuse the 8 SDLC steps hook.
- **Worked example seed:** identify a project well-suited to waterfall (fixed scope, regulated) and one ill-suited; justify.
- **Exam seeds:** "Outline the stages of the waterfall model." / "Explain one advantage and one disadvantage of waterfall." (4)
- **Appendix:** Listing 1 — waterfall stages list (text).
- **Traps:** "waterfall is always bad"; ignoring its fit for fixed/regulated scope.

### 24-02 — Agile approach
- **Source:** Ch 24 §24.2. **Outcomes:** SE-12-06.
- **Dot-points:** *Agile — rate of developing a final solution; method tailoring; iteration workflow; scale and types of developments.*
- **Teach:** iterative/incremental delivery, ceremonies, user stories, tailoring.
- **§5.1 recap:** waterfall (24-01, "Falls once"); DiP-PP.
- **Interleave:** contrast → directly against waterfall (24-01); backward → DevOps/CI automation (SA 20-01) supports agile; forward → WAgile (24-03) combines the two.
- **Mnemonics:** **"Agile Goes around"** (iterate); ceremonies → **"P-S-R-R"** = *Plan, Standup, Review, Retro*.
- **Worked example seed:** turn a requirement into a user story ("As a … I want … so that …") with acceptance criteria; one iteration's flow.
- **Exam seeds:** "Compare waterfall and agile development." (extended) / "Explain method tailoring in agile."
- **Appendix:** Listing 1 — a user-story + acceptance-criteria example (text).
- **Traps:** "agile = no planning/docs"; cargo-cult ceremonies.

### 24-03 — WAgile hybrid approach
- **Source:** Ch 24 §24.3. **Outcomes:** SE-12-06.
- **Dot-points:** *WAgile — hybrid model; analysis of 'when'/'how' intervention is applied; scale and types of developments.*
- **Teach:** combining waterfall stage-gates with agile iterations, and when that's the right call.
- **§5.1 recap:** waterfall (Falls once) + agile (Goes around) — explicit contrast as the setup.
- **Interleave:** backward → both 24-01 and 24-02 (this episode only makes sense on top of them); link → real enterprise projects (SSA 19-x enterprise context).
- **Mnemonics:** **"WAgile = Waterfall gates + Agile sprints"**; "plan big, build small".
- **Worked example seed:** show where stage gates add value (regulatory sign-off) and where iterations add value (UI build) in one project.
- **Exam seeds:** "Explain how WAgile combines waterfall and agile." (4) / "Recommend an approach (waterfall/agile/WAgile) for [scenario] and justify." (extended)
- **Appendix:** Listing 1 — a WAgile timeline (text).
- **Traps:** WAgile as "worst of both"; not justifying the *when/how*.

### 24-04 — Project management tools and Gantt
- **Source:** Ch 24 §24.4. **Outcomes:** SE-12-09.
- **Dot-points:** *Apply project management — scheduling and tracking using a software tool incl. Gantt charts; using collaboration tools.*
- **Teach:** planning, dependencies, critical path, tracking — the SE-12-09 "manage the project" core.
- **§5.1 recap:** the three approaches (24-01/02/03).
- **Interleave:** backward → collaboration tools / version control (PFW 12-06, Year 11); link → scheduling feasibility (23-01); forward → tracking feeds feedback/evaluation (26-02/26-03).
- **Mnemonics:** **"Scope–Time–Cost"** triangle; Gantt → "bars over time, arrows for dependencies, the long chain is the critical path".
- **Worked example seed:** read a small Gantt — identify the critical path and the effect of a slipped task; this is a classic stimulus item.
- **Exam seeds:** "Describe how a Gantt chart supports project management." (4) / interpret-the-Gantt stimulus question.
- **Appendix:** Listing 1 — a task/dependency table that maps to a Gantt (text).
- **Traps:** Gantt without dependencies; ignoring critical path.

### 24-05 — Social, ethical and communication issues
- **Source:** Ch 24 §24.5. **Outcomes:** SE-12-05.
- **Dot-points:** *Social and ethical issues in project work (individual/collaborative/stakeholders); communication — involving and empowering the client, enabling feedback, negotiating.*
- **Teach:** working with people — stakeholders, ethics, and structured communication.
- **§5.1 recap:** PM tools (24-04); approaches.
- **Interleave:** backward → collaboration benefits (SSA 19-01 V-D-Q); backward → ethics/legal (SSA 19-03); link → human factors (SA 22-02 culture/behaviour).
- **Mnemonics:** **"I-F-N"** = *Involve, enable Feedback, Negotiate*.
- **Worked example seed:** a scope-negotiation with a client who keeps adding features; model the I-F-N response.
- **Exam seeds:** "Explain how a developer can effectively involve a client during development." (6) / "Describe an ethical issue that can arise in collaborative project work."
- **Appendix:** none required.
- **Traps:** treating communication as "soft/optional"; ignoring stakeholder feedback loops.

### 24-06 — Quality assurance
- **Source:** Ch 24 §24.6. **Outcomes:** SE-12-06.
- **Dot-points:** *How solutions are quality assured — defining criteria; continual checking process; compliance and legislative requirements.*
- **Teach:** QA as a continuous, criteria-driven process (distinct from one-off testing) + compliance.
- **§5.1 recap:** communication/I-F-N (24-05); requirements as quality criteria (23-01).
- **Interleave:** forward → QA criteria become the evaluation criteria (26-03 C-E-R) and the test plan (26-01); backward → security/privacy compliance (SSA 16-02, 19-03).
- **Mnemonics:** **"QA = Criteria + Continual Checking + Compliance"** = **"3C"**.
- **Worked example seed:** define quality criteria for a checkout feature (correctness, usability, performance, security) and the checks for each.
- **Exam seeds:** "Distinguish quality assurance from testing." (4) / "Explain how compliance requirements affect software quality."
- **Appendix:** Listing 1 — a QA checklist (text).
- **Traps:** conflating QA (process) with testing (activity); forgetting compliance.

### 24-99 — Module review: Defining and planning (Ch 23–24)
- **Kind:** module-review. **Outcomes:** all SEE so far.
- **Job:** tie *defining* (23) to *planning* (24). Re-surface FUN-PERF, TECO, DiP-PP, Waterfall-Falls/Agile-Goes, WAgile, Scope-Time-Cost, I-F-N, 3C. Heavy `QUESTION:` voice; one big scenario ("you're handed this brief — choose a methodology, plan it on a Gantt, define QA criteria, and justify"). Pull in `case_the_healthcare_gov_launch` and `case_the_denver_airport_baggage`.
- **Exam seeds:** one extended "plan this project" question + a comparison round (methods/approaches).

### 25-01 — Building the solution
- **Source:** Ch 25 §25.1. **Outcomes:** SE-12-02.
- **Dot-points:** *Design, construct and implement a solution using appropriate development approach(es).*
- **Teach:** turning the plan/models into working code, incrementally, without losing quality.
- **§5.1 recap:** approaches (24-x); modelling tools (23-02).
- **Interleave:** backward → everything technical: OOP (Year 11), web build (PFW 13-01), secure coding (SSA 16-01) — building "the right way" reuses it all; forward → testing (26-01) checks the build.
- **Mnemonics:** **"Mainline clean, one task per subroutine"** (reuse Year 11 OOP11 06-x quality hook).
- **Worked example seed:** build one feature end-to-end against its requirement; show incremental commits.
- **Exam seeds:** "Explain how an appropriate development approach guides construction of a solution." (6)
- **Appendix:** Listing 1 — a well-structured feature module (Python); Listing 2 — NESA pseudocode for the same.
- **Traps:** big-bang building; skipping the models from 23-02.

### 25-02 — Presenting the solution
- **Source:** Ch 25 §25.2. **Outcomes:** SE-12-09.
- **Dot-points:** *Present a software engineering solution using presentation software.*
- **Teach:** communicating a solution to an audience — narrative, demo, evidence.
- **§5.1 recap:** building (25-01); communication/I-F-N (24-05).
- **Interleave:** backward → involving/empowering the client (24-05); forward → presenting links to the evaluation report (26-03).
- **Mnemonics:** presentation arc → **"P-D-R"** = *Problem, Demo, Results*.
- **Worked example seed:** structure a 5-minute solution pitch for a client; what evidence earns trust.
- **Exam seeds:** "Describe features of an effective presentation of a software solution."
- **Appendix:** none required.
- **Traps:** demo with no narrative; tech jargon at non-technical stakeholders.

### 25-03 — Algorithms, documentation and back-end engineering
- **Source:** Ch 25 §25.3. **Outcomes:** SE-12-06.
- **Dot-points:** *Develop, construct and document algorithms; allocate resources;* and *contribution of back-end engineering — technology used; error handling; interfacing with front end; security engineering.*
- **Teach:** maintaining artefacts (documented algorithms) and why solid back-end engineering makes a project succeed.
- **§5.1 recap:** building (25-01); presenting.
- **Interleave (heavy):** backward → back-end request flow (PFW 13-01), error handling (Year 11 PF11 04-07), security engineering (SSA 16-01/17-x) — this episode is explicitly a synthesis of PFW + SSA; forward → documentation feeds evaluation (26-03).
- **Mnemonics:** back-end contribution → **"T-E-I-S"** = *Technology, Error-handling, Interfacing, Security*.
- **Worked example seed:** show a documented algorithm (code + NESA pseudocode + comment header) and a back-end error-handling strategy.
- **Exam seeds:** "Explain the contribution of back-end engineering to a software solution's success." (6)
- **Appendix:** Listing 1 — a documented function (Python, with docstring); Listing 2 — NESA pseudocode; Listing 3 — an error-handling pattern.
- **Traps:** undocumented "clever" code; treating back-end as invisible plumbing.

### 25-04 — Data backup and version control
- **Source:** Ch 25 §25.4. **Outcomes:** SE-12-06.
- **Dot-points:** *Demonstrate programmed data backup; implement version control.*
- **Teach:** backup strategy and version control as project safety nets (branching, tags, releases, rollback).
- **§5.1 recap:** back-end engineering/T-E-I-S (25-03); building.
- **Interleave:** story → `case_the_knight_capital_glitch` (deployment/rollback failure) — the marquee cash-in; backward → version control first met Year 11 + PFW 12-06; forward → release hygiene supports testing/deploy (26-01).
- **Mnemonics:** backup **"3-2-1"** rule (3 copies, 2 media, 1 offsite); VCS → "commit small, branch per feature, tag releases".
- **Worked example seed:** a feature-branch workflow with a tagged release and a rollback; why the Knight Capital deploy needed exactly this.
- **Exam seeds:** "Explain the role of version control in a software project." (4) / "Describe a data backup strategy and justify it."
- **Appendix:** Listing 1 — a git branch/tag command sequence (bash); Listing 2 — a programmed backup script (Python).
- **Traps:** "backup = it's on my laptop"; committing straight to main; no rollback plan.

### 25-05 — Overcoming development difficulties
- **Source:** Ch 25 §25.5. **Outcomes:** SE-12-06.
- **Dot-points:** *Strategies to respond to difficulties — looking for a solution online; collaboration with peers; outsourcing/escalation.*
- **Teach:** the professional toolkit for getting unstuck, and when to escalate vs persevere.
- **§5.1 recap:** version control safety net (25-04); collaboration (24-05).
- **Interleave:** backward → collaboration benefits (SSA 19-01 V-D-Q); link → using authoritative docs (PFW/SSA throughout); story → a brief callback to `case_the_knight_capital_glitch` (escalation under pressure).
- **Mnemonics:** escalation ladder → **"S-P-O"** = *Self/Search, Peers, Outsource/escalate*.
- **Worked example seed:** a blocker scenario — walk the S-P-O ladder; when to stop self-debugging and ask.
- **Exam seeds:** "Describe strategies a developer can use to overcome difficulties during development." (4–6)
- **Appendix:** none required.
- **Traps:** lone-wolf debugging for hours; copy-pasting unverified online code (security risk — link SSA).

### 25-06 — Prototype and UI design
- **Source:** Ch 25 §25.6. **Outcomes:** SE-12-06.
- **Dot-points:** *Propose an additional innovative solution using a prototype and UI design.*
- **Teach:** prototyping and UI design to explore/validate an idea before full build.
- **§5.1 recap:** difficulties (25-05); building.
- **Interleave:** backward → UI/UX & accessibility (PFW 12-04), PWA design (PFW 13-04); link → user-centred design (SSA 14-03); forward → prototype gets evaluated via feedback (26-02).
- **Mnemonics:** fidelity ladder → **"Sketch → Wireframe → Mockup → Prototype"** (S-W-M-P).
- **Worked example seed:** turn a feature idea into a wireframe-in-words then an interactive prototype; what each fidelity level tests.
- **Exam seeds:** "Explain the purpose of prototyping in software development." (4) / "Describe how UI design supports usability."
- **Appendix:** Listing 1 — a UI component spec (text; no diagrams per SUPPLEMENTARY §3 — describe layout in words).
- **Traps:** polishing a prototype like production; ignoring accessibility in mockups.

### 26-01 — Testing methodologies and optimisation
- **Source:** Ch 26 §26.1. **Outcomes:** SE-12-08.
- **Dot-points:** *Apply methodologies to test and evaluate code; use a language-dependent code optimisation technique; test plans; path and boundary testing.*
- **Teach:** building a real test plan (path + boundary, functional + non-functional) and one concrete optimisation.
- **§5.1 recap:** prototype (25-06); QA/3C (24-06) — QA criteria become the test plan.
- **Interleave (heavy):** backward → testing types black/white/grey box (Year 11 OOP11 06-06), security testing SAST/DAST (SSA 18-01), boundary/path test data (Year 11 PF11 04-06); story → `case_the_healthcare_gov_launch` (no load testing) and `case_the_knight_capital_glitch` (untested deploy).
- **Mnemonics:** reuse **path + boundary** ("every road through + the edges"); test levels → unit/integration/system (reuse Year 11 hook).
- **Worked example seed:** design test data for a function using boundary values + path coverage; show one optimisation (e.g. memoisation) with before/after.
- **Exam seeds:** "Develop a set of test data using boundary and path testing for [function]." (extended/code) / "Describe a code optimisation technique."
- **Appendix:** Listing 1 — a function + its test cases (Python); Listing 2 — before/after optimisation; Listing 3 — NESA pseudocode for the function under test.
- **Traps:** testing only the happy path; optimising without measuring (link PFW 13-03).

### 26-02 — Feedback analysis
- **Source:** Ch 26 §26.2. **Outcomes:** SE-12-09.
- **Dot-points:** *Analyse and respond to feedback.*
- **Teach:** collecting, synthesising, and acting on feedback — turning opinions into decisions.
- **§5.1 recap:** testing (26-01); communication/I-F-N (24-05).
- **Interleave:** backward → enabling feedback (24-05); forward → feedback feeds the evaluation report (26-03).
- **Mnemonics:** **"C-S-A"** = *Collect, Synthesise, Act*.
- **Worked example seed:** turn a pile of mixed user feedback into a prioritised, evidence-based action list.
- **Exam seeds:** "Explain how a developer analyses and responds to user feedback." (4–6)
- **Appendix:** Listing 1 — a feedback-to-action table (text).
- **Traps:** acting on the loudest voice; feedback with no follow-through.

### 26-03 — Evaluating the software solution
- **Source:** Ch 26 §26.3. **Outcomes:** SE-12-06.
- **Dot-points:** *Evaluate effectiveness — report synthesising feedback; test plan; path/boundary test data; compare actual vs expected output; reflect on maintainability/deployment/lessons.*
- **Teach:** the structured final evaluation — criteria, evidence (tests + feedback), reflection.
- **§5.1 recap:** feedback/C-S-A (26-02); testing (26-01); QA criteria (24-06).
- **Interleave:** backward → ties QA (24-06) + testing (26-01) + feedback (26-02) into one report; backward → mirrors SSA 19-04 evaluation (Measure-Audit-Improve); story → `case_the_healthcare_gov_launch` evaluation/post-mortem.
- **Mnemonics:** **"C-E-R"** = *Criteria, Evidence, Reflection*.
- **Worked example seed:** write an evaluation paragraph comparing actual vs expected output against stated criteria, with a maintainability reflection; weak vs strong answer.
- **Exam seeds:** "Evaluate the effectiveness of a software solution against its requirements." (extended) / "Explain how comparing actual and expected output supports evaluation."
- **Appendix:** Listing 1 — an actual-vs-expected results table (text).
- **Traps:** "evaluation = it works"; no criteria/evidence; skipping the reflection.

### 26-99 — Module review: Software Engineering Project (and the whole year)
- **Kind:** module-review (the **capstone**). **Outcomes:** all SEE + cross-module.
- **Job:** this is the final review of Year 12 — tie SEE's process spine to the technical content of PFW, SSA and SA. Re-surface every SEE mnemonic (FUN-PERF, DiP-PP, Waterfall/Agile/WAgile, Scope-Time-Cost, I-F-N, 3C, T-E-I-S, 3-2-1, C-S-A, C-E-R) **and** call back the marquee hooks from the other modules (CIA-AAA, Hash-one-way, SUSR, S-H-L-M, the request journey). Heaviest `QUESTION:` voice of the course: pose a full integrated HSC-style scenario ("here's a brief — plan, choose a methodology, design it securely, add an ML feature responsibly, build/test/evaluate it") and model an integrated, mark-earning answer. Pull all SEE case studies together and reference the others.
- **Exam seeds:** a full mixed set mirroring the real exam (objective-style rapid round + several short-answer + one extended integrated response).
```
