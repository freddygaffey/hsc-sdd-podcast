# Year 12 Podcast — Plan Index

This folder holds the **per-module episode plans** that drive script generation for the
Year 12 podcast, one file per module:

- [`PFW-PODCAST_PLAN.md`](PFW-PODCAST_PLAN.md) — PFW (chapters 11–13)
- [`SSA-PODCAST_PLAN.md`](SSA-PODCAST_PLAN.md) — SSA (chapters 14–19)
- [`SA-PODCAST_PLAN.md`](SA-PODCAST_PLAN.md) — SA (chapters 20–22)
- [`SEE-PODCAST_PLAN.md`](SEE-PODCAST_PLAN.md) — SEE (chapters 23–26)

Read `../../AUTHORING.md` (the file recipe), `../../STYLE.md` and `../../SUPPLEMENTARY.md`
before writing any script. A plan entry gives you the **seeds** (dot-points, recaps,
interleaving, mnemonics, examples, listings); STYLE.md gives you the **form** (two voices,
spaced-repetition opener, mnemonics, exam questions); AUTHORING.md gives you the **files**
(the episode folder, `script.md`, `supplementary.md`).

## Teaching order (Year 12)

**PFW → SSA → SA → SEE**, in textbook chapter order (11 → 26). This order is deliberate:

- PFW seeds security topics it explicitly defers ("…covered properly in Secure Software Architecture").
- **SSA cashes in every one of those PFW IOUs** (HTTPS/TLS, SQL injection, client/server validation, XSS).
- SA layers "smart" on top of "secure", and reuses PFW big-data + SSA privacy/accountability.
- SEE is the **synthesis module** — it re-uses all three (and Year 11) as the running spaced-repetition payoff.

> If you later prefer SSA before PFW (security-first), the per-module files are
> self-contained — only the cross-module recap/forward-reference wording needs flipping.

## Conventions (all modules)

- **Episode = textbook section = one folder.** `content/MODULE-LL-Title/` holds `script.md`,
  `supplementary.md`, and the generated `<voice>.m4a` files (AUTHORING.md). The **module
  acronym is in the folder name** (e.g. `content/SA-20-01-What-is-AI-vs-ML/`); the dotted
  textbook section goes in frontmatter `lesson:`.
- **Oversized sections split** into `-Part-1`, `-Part-2` (same lesson number). Currently planned:
  SSA `15-02` (crypto) and SSA `18-02` (web vulns); PFW `13-02` (SQL/ORM) flagged as optional.
- **Module reviews** (STYLE §5.3): `XX-99-Module-Review-…`. Mid-module reviews where a block exceeds
  ~8 episodes (PFW `12-99`, SSA `16-99`, SEE `24-99`) plus an end-of-module review each.
- **Case studies** (STYLE §5.7): `case_…`, story-first, 10–20 min, tied in later by a teaching episode.

## Case-study master list (write these alongside, cash in later)

| File | Story | Cashed in by |
|------|-------|--------------|
| `case_the_dyn_dns_ddos_2016` | Mirai botnet kills Dyn DNS | PFW 11-02; SSA availability; SA IoT |
| `case_the_cloudflare_2019_outage` | One regex melts the web | PFW 11-04, 13-03; SEE 26-01 |
| `case_the_xz_backdoor` | Supply-chain backdoor near-miss | SSA 14-02, 18-01, 19-01, 19-03; PFW 12-06 |
| `case_the_equifax_breach` | Unpatched Struts → 147M records | SSA 14-01, 18-01, 19-02, 19-03 |
| `case_heartbleed` | OpenSSL memory over-read | SSA 15-02-Part-2, 17-02, 18-01 |
| `case_the_amazon_recruiting_ai` | Hiring model learns gender bias | SA 20-02, 22-03 |
| `case_the_compas_recidivism` | Risk-score fairness debate | SA 22-01, 22-02, 22-03 |
| `case_zillow_offers` | ML house-pricing collapse | SA 20-03, 21-01 |
| `case_the_healthcare_gov_launch` | 2013 launch meltdown | SEE 23-01, 24-01, 26-01, 26-03 |
| `case_the_knight_capital_glitch` | $440M bad deploy in 45 min | SEE 25-04, 25-05, 26-01 |
| `case_the_denver_airport_baggage` | Automated baggage doom | SEE 23-01, 23-03 |

## Marquee mnemonics (shared across modules — keep wording identical everywhere)

- **PFW:** Dogs Take Tasty Hambones (DNS→TCP→TLS→HTTP) · 80 plain/443 safe/22 shell/21 file · Front-Back-Store · M-M-S.
- **SSA:** **CIA-AAA** (the exam-dump hook) · "Hash is one-way, Encrypt is two-way" · VSE (Validate/Sanitise/Errors) · Static=Source/Dynamic=Doing · BX-IR (vuln list).
- **SA:** "AI is the goal, ML is one way" · SUSR (training models) · RPA=Robot/Task, BPA=Process · LLK (algorithm types) · S-H-L-M (bias) · S-P-E-E (impact).
- **SEE:** DiP-PP (implementation methods) · Waterfall-Falls/Agile-Goes · Scope-Time-Cost · I-F-N (client comms) · C-E-R (evaluation).

## Status

- Plans: **all 4 Year 12 modules drafted** (this set).
- Reference episode: `content/SA-20-01-What-is-AI-vs-ML/` — the worked example of the
  two-file format (`script.md` + `supplementary.md`).
- Year 11 plans: **not yet written** (out of scope for this pass).
