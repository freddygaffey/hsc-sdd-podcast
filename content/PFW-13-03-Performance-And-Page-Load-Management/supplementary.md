---
title: "Supplementary Materials — Performance and Page-Load Management"
module: PFW
lesson: "13.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches
measure-first and the C-C-C-L toolkit (Cache, Compress, CDN, Lazy-load) plus bundling.

### Listing 1 — Caching with Cache-Control headers (the "C" — Cache)

```python
from flask import make_response

@app.route("/static/<path:filename>")
def static_asset(filename):
    resp = make_response(app.send_static_file(filename))
    # Versioned, immutable asset (e.g. app.4f2c.js): cache hard, for a year.
    resp.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    return resp

@app.route("/account")
def account():
    resp = make_response(render_account_page())
    # PRIVATE, per-user page: must NOT be stored in a shared/CDN cache. (The trap.)
    resp.headers["Cache-Control"] = "private, no-store"
    return resp
```

```text
Cache-Control quick reference:
  public, max-age=31536000   -> static assets: browser + CDN cache for a year
  private, no-store          -> per-user/sensitive: never share-cache (avoid data leak)
  no-cache                   -> may cache but must revalidate before reuse (avoid stale)
```

### Listing 2 — Compression (the "C" — Compress) + bundling/minification

```python
# gzip text responses: server compresses HTML/CSS/JS/JSON, browser decompresses.
from flask_compress import Compress
Compress(app)                       # sets Content-Encoding: gzip on compressible types
```

```text
# Before: 5 separate requests, unminified  ->  After: 1 bundle, minified + gzipped
  app.css  components.css  forms.css  ->  app.min.css   (bundled: fewer requests)
  app.js   widgets.js      charts.js  ->  app.min.js    (minified: whitespace/comments stripped)
# Fewer requests + fewer bytes. A heavy framework = a big bundle = a load cost (ties to 12-05).
```

### Listing 3 — CDN + lazy loading (the "C" — CDN, and the "L" — Lazy-load)

```html
<!-- CDN: static assets served from a nearby edge server (closer-to-the-user, like DNS/11-04). -->
<link rel="stylesheet" href="https://cdn.example.com/static/app.min.css?v=4f2c">
<script src="https://cdn.example.com/static/app.min.js?v=4f2c" defer></script>

<!-- LAZY LOAD: below-the-fold images load only as the user scrolls near them. -->
<img src="hero.jpg" alt="Featured product">                 <!-- above the fold: load now -->
<img src="review-1.jpg" alt="Customer review" loading="lazy"><!-- off-screen: defer -->
<img src="review-2.jpg" alt="Customer review" loading="lazy">
```

### Listing 4 — Measure first: the order of operations (avoid premature optimisation)

```text
BEGIN OptimisePage
    PROFILE page WITH developer tools     // Network panel = big/slow requests; Performance = slow JS
    bottleneck ← largest contributor to load time
    // Only NOW optimise the real bottleneck — not a guess:
    IF bottleneck is large assets   THEN COMPRESS + resize images, gzip text   ENDIF
    IF bottleneck is repeat fetches THEN add CACHE headers + serve via a CDN    ENDIF
    IF bottleneck is many/blocking files THEN BUNDLE + minify, LAZY-LOAD non-critical ENDIF
    RE-MEASURE to confirm the win
END OptimisePage
```
