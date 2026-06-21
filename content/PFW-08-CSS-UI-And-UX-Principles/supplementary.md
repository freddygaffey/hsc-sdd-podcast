---
title: "Supplementary Materials — CSS, UI and UX Principles"
module: PFW
lesson: "12.4"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches
separation of concerns (Structure/Style/Behaviour), maintainability via design tokens,
responsive design, the C-FAN-H principles, and accessibility techniques.

### Listing 1 — Design tokens: change a value once, it updates everywhere (maintainability)

```css
/* Define the design "atoms" ONCE as CSS custom properties (design tokens). */
:root {
  --color-primary: #2563eb;
  --color-text:    #1f2937;
  --space-md:      1rem;
  --radius:        0.375rem;
  --font-sans:     Inter, system-ui, sans-serif;
}

/* Reuse the tokens everywhere — rebranding is now a one-line change at the top. */
body        { font-family: var(--font-sans); color: var(--color-text); }
.btn-primary{ background: var(--color-primary); border-radius: var(--radius);
              padding: var(--space-md); }
.card       { border-radius: var(--radius); padding: var(--space-md); }

/* CONTRAST — the anti-pattern: inline styles scatter presentation through the content,
   so the same change means editing hundreds of elements by hand:
   <button style="background:#2563eb;border-radius:0.375rem;padding:1rem">  <- avoid */
```

### Listing 2 — Mobile-first responsive layout with media queries

```css
/* Base = smallest screen first: one column. */
.grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }

/* Tablet and up: add a second column. */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop and up: three columns. */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Responsive design = layout adapts to SCREEN SIZE (appearance).
   It is NOT what makes a site a PWA (installable + offline via a service worker = MISO). */
```

### Listing 3 — Accessibility techniques that fulfil WCAG / POUR

```css
/* OPERABLE: visible focus + large enough touch targets (min 44px). */
.btn, .form-input { min-height: 44px; }
.btn:focus, .form-input:focus { outline: 2px solid var(--color-primary); outline-offset: 2px; }

/* PERCEIVABLE: respect users who need reduced motion or higher contrast. */
@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; } }
@media (prefers-contrast: high)        { .btn { border: 2px solid currentColor; } }
```

```html
<!-- PERCEIVABLE: never rely on COLOUR ALONE — pair it with an icon + text. -->
<p class="error">
  <span aria-hidden="true">⚠</span>           <!-- icon -->
  <strong>Error:</strong> Email is required.    <!-- text, not just a red border -->
</p>

<!-- PERCEIVABLE: text alternatives for non-text content (the "audio, video" dot-point). -->
<img src="sales.png" alt="Bar chart: sales rose 20% from Q1 to Q2">
<video controls>
  <source src="demo.mp4" type="video/mp4">
  <track kind="captions" src="demo.en.vtt" srclang="en" label="English">  <!-- captions -->
</video>
```
