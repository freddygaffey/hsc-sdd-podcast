---
title: "Supplementary Materials — Prototype and UI Design"
module: SEE
lesson: "25.6"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken, and per the format there are no
diagrams — layouts are described in words. The narration teaches the fidelity ladder (S-W-M-P),
usability principles (Nielsen's heuristics), and accessibility (W-C-A-G / POUR), applied to
proposing and validating an innovative feature with a prototype.

### Listing 1 — The fidelity ladder and what each rung tests (text)

```text
FIDELITY LADDER — "S-W-M-P" (climb out of the SWAMP of vague ideas)

  S  Sketch      rough hand drawing; seconds to make; throwaway   -> align the team fast
  W  Wireframe   LOW fidelity: boxes/lines/placeholder text; NO styling -> tests STRUCTURE + FLOW
  M  Mockup      HIGH fidelity STATIC: real colours/fonts/brand; not interactive -> tests VISUALS
  P  Prototype   INTERACTIVE: clickable, simulates real flows -> tests the EXPERIENCE (user testing)

RULE: climb only as far as the QUESTION needs. Each rung tests a DIFFERENT thing.
TRAP: polishing a prototype like production (it's meant to be cheap + disposable).
WHY: shift-left for the user experience — learn cheaply BEFORE you build (cf. model-first 23-02).
```

### Listing 2 — Nielsen usability heuristics (the key ones) (text)

```text
USABILITY — Nielsen's heuristics (name the principle + a few; = PFW 12-04 UI/UX applied)

  Visibility of system status   always show what's happening (loading, confirmations)
  Match system <-> real world   user's language + familiar concepts, NOT jargon
  User control + freedom        clear UNDO + escape; cancel in progress
  Consistency + standards       same things behave the same way
  Error prevention              design so mistakes can't easily happen (confirm destructive acts)
  Recognition over recall       make options visible, don't make users remember
  Aesthetic / minimalist        remove clutter (= the slide-design minimalism, 25-02)
  Help users recover from errors clear, specific, actionable error messages

UX = the whole experience; UI = the interface delivering it; heuristics judge UI against UX.
```

### Listing 3 — A UI component spec (layout described in words) (text)

```text
COMPONENT SPEC — "Quick grade entry" panel (wireframe-level; no styling, structure only)

Layout (top to bottom, single column, mobile-first):
  [ Header bar ]        course name (left), current class (centre), Save status (right) <- visibility
  [ Class list ]        scrollable rows: student name (left) + mark input (right)
                        current row highlighted; tab/enter moves to next  <- keyboard operable (POUR-O)
  [ Mark input ]        numeric, validated 0-100 (boundary, 26-01); inline error if out of range
  [ Undo bar ]          "Undo last entry" always visible                  <- user control + freedom
  [ Footer ]            "Save all" (primary) + "Cancel" (secondary)       <- error prevention: confirm

Accessibility notes (designed in, not bolted on):
  - colour contrast >= WCAG AA 4.5:1; status NOT conveyed by colour alone   (POUR-Perceivable)
  - every input has an associated label; focus indicator visible           (POUR-Operable)
  - plain-language errors that say how to fix                              (POUR-Understandable)
  - semantic markup so a screen reader announces rows + status            (POUR-Robust)
```

### Listing 4 — Reference table: accessibility (POUR) + cross-links (text)

```text
ACCESSIBILITY — W-C-A-G principles = "POUR" (ethical AND legal: Disability Discrimination Act)
  P  Perceivable      alt text; colour contrast; captions; not colour-only
  O  Operable         full keyboard access; visible focus; enough time
  U  Understandable   clear language; predictable behaviour; helpful error messages
  R  Robust           semantic markup -> works with assistive tech (screen readers)

PROTOTYPE + UI DESIGN — cross-links
  PFW 12-04   UI/UX principles + accessibility (the home of this knowledge)
  PFW 13-04   PWA design (responsive, device-aware layouts)
  SSA 14-03   user-centred design + security-usability balance (design around real humans)
  QA 24-06    accessibility/WCAG = COMPLIANCE (a "high-quality" app that fails WCAG isn't)
  26-02       prototype's purpose = generate FEEDBACK you act on (collect-synthesise-act)

TRAPS: polishing a prototype like production; ignoring accessibility in mockups (retrofitting is hard).
```
