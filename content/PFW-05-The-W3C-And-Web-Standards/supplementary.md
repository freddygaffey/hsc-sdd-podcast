---
title: "Supplementary Materials — The W3C and Web Standards"
module: PFW
lesson: "12.1"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
W3C's role (recommends, not enforces), its five concerns (WIPS-M), WCAG accessibility
(POUR), and internationalisation vs localisation.

### Listing 1 — Inaccessible vs. accessible form (the worked example)

```html
<!-- INACCESSIBLE: no labels, no alt text, mouse-only, low contrast -->
<form>
  <img src="user.png">                          <!-- no alt: screen reader says nothing -->
  Name: <input type="text" name="n">             <!-- text isn't a real <label> -->
  <div onclick="submit()" style="color:#bbb">Go</div>  <!-- not keyboard-operable -->
</form>

<!-- ACCESSIBLE: labels, alt text, keyboard-operable, sufficient contrast -->
<form aria-labelledby="signup-heading">
  <h2 id="signup-heading">Sign up</h2>

  <img src="user.png" alt="">                     <!-- decorative -> empty alt (Perceivable) -->

  <label for="name">Full name</label>             <!-- label tied to input via for/id -->
  <input type="text" id="name" name="name"
         required aria-describedby="name-help">
  <p id="name-help">Enter your first and last name.</p>

  <button type="submit">Go</button>               <!-- real button: keyboard-operable -->
</form>
```

```css
/* Visible focus outline (Operable) + contrast >= 4.5:1 for normal text (Perceivable) */
input:focus, button:focus { outline: 2px solid #0066cc; outline-offset: 2px; }
body { color: #1a1a1a; background: #ffffff; }   /* ~16:1 — passes WCAG AA */
```

### Listing 2 — Machine-readable data: JSON-LD (the metadata-from-11.4 made into a standard)

```html
<!-- Embedded in the page <head>; search engines & assistants read it, users don't see it. -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Web Development Fundamentals",
  "provider": { "@type": "Organization", "name": "Tech Education Hub" },
  "instructor": { "@type": "Person", "name": "Jane Smith" },
  "courseMode": ["online", "self-paced"],
  "inLanguage": "en",
  "offers": { "@type": "Offer", "price": "99.00", "priceCurrency": "USD" }
}
</script>
<!-- This IS metadata (data about data) from 11.4, expressed in a W3C-aligned standard
     so machines can understand the page. -->
```

### Listing 3 — Internationalisation: one value, localised per locale (Python)

```python
from datetime import date

# i18n = the code is BUILT to switch locale; l10n = the actual per-locale output.
LOCALES = {
    "en-AU": {"currency": "A${:,.2f}", "date": "%d/%m/%Y", "welcome": "Welcome"},
    "de-DE": {"currency": "{:,.2f} €", "date": "%d.%m.%Y", "welcome": "Willkommen"},
    "ja-JP": {"currency": "¥{:,.0f}",  "date": "%Y/%m/%d", "welcome": "ようこそ"},
}

def render(locale, amount, when):
    cfg = LOCALES[locale]
    money = cfg["currency"].format(amount)
    if locale == "de-DE":                      # German swaps , and . as separators
        money = money.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{cfg['welcome']} — {money} — {when.strftime(cfg['date'])}"

for loc in LOCALES:
    print(loc, "->", render(loc, 1234.5, date(2024, 3, 4)))
# Same 03/04 date is read as 3 Apr (AU) vs differently formatted elsewhere — why i18n matters.
```
