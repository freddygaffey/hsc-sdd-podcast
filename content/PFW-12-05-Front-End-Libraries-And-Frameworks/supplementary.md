---
title: "Supplementary Materials — Front-End Libraries and Frameworks"
module: PFW
lesson: "12.5"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
three types (F-T-C), library-vs-framework (inversion of control), and BUILD vs BUY.

### Listing 1 — "You call a library; a framework calls you" (inversion of control)

```javascript
// LIBRARY: YOUR code is in control — you call the library when you want it.
import { format } from "date-fns";          // a library
const label = format(new Date(), "d MMM");  // you decide when/where to call it

// FRAMEWORK: the FRAMEWORK is in control — it calls YOUR code at points it defines.
// You don't call render(); React calls your component when it decides to re-render.
function CourseCard({ title, progress }) {   // a React component = your code…
  return <div className="card"><h4>{title}</h4><p>{progress}%</p></div>;
}                                            // …the framework decides when to invoke it
```

### Listing 2 — Template engine (Jinja, server-side rendering) — type "T" of F-T-C

```html
<!-- A template with placeholders + a loop. The engine fills it with real data on the
     SERVER, then sends finished HTML to the browser. Built for real in 13-01. -->
<h1>Welcome, {{ user.name }}</h1>
<ul>
  {% for course in courses %}
    <li>{{ course.title }} — {{ course.progress }}% complete</li>
  {% endfor %}
</ul>
```

```python
# Flask hands data to the Jinja template engine (server-side rendering).
from flask import Flask, render_template
app = Flask(__name__)

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html",
        user={"name": "Jane"},
        courses=[{"title": "Web Dev", "progress": 75}])
```

### Listing 3 — Same UI, vanilla vs. predesigned CSS classes — type "C" of F-T-C (BUILD vs BUY)

```html
<!-- BUILD: vanilla — full control, no dependency, but you write/maintain all the CSS. -->
<button style="padding:.5rem 1rem;border:none;border-radius:.375rem;
               background:#2563eb;color:#fff;min-height:44px">Save</button>

<!-- BUY: predesigned CSS classes (e.g. Bootstrap) — instant, consistent styling,
     at the cost of pulling in the framework's stylesheet (bundle size -> see 13-03). -->
<button class="btn btn-primary">Save</button>
```

```text
BUILD vs BUY — the decision rule the narration uses:
  BUY  (adopt a framework/library)  when: needs are STANDARD, timeline is TIGHT,
       team knows the tool  ->  speed, reliability, consistency, community support.
  BUILD (bespoke)                   when: needs are UNIQUE, full control or peak
       performance needed, overhead unjustified  ->  exact fit, no bloat, but slower.
  Cost to always weigh: bundle size, learning curve, lock-in.
```
