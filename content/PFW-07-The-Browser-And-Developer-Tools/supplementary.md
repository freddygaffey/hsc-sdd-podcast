---
title: "Supplementary Materials — The Browser and Developer Tools"
module: PFW
lesson: "12.3"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches the
browser's rendering/JS engines, cross-browser techniques, and the dev-tool panels (E-N-S-P).

### Listing 1 — Feature detection vs. browser detection (the cross-browser fix)

```javascript
// BRITTLE: browser detection — guesses capability from the User-Agent string. Avoid.
if (navigator.userAgent.includes("Chrome")) {
  useFancyFeature();          // breaks when other browsers add the feature, or Chrome changes UA
}

// ROBUST: feature detection — test for the capability itself, then fall back.
if ("IntersectionObserver" in window) {
  useLazyLoading();           // progressive ENHANCEMENT: layer this on where supported
} else {
  loadAllImagesEagerly();     // baseline that works everywhere
}
```

### Listing 2 — Reading the Network panel: what each status code localises

```text
Method  URL                    Status  Meaning / where the problem is
------  ---------------------  ------  --------------------------------------------------
GET     /api/data              200     OK — success
GET     /api/itme              404     Not Found — wrong URL / missing endpoint (REQUEST side)
GET     /api/account           401     Unauthorised — not authenticated (log in)        -> ep.3
GET     /api/admin             403     Forbidden — authenticated but not authorised      -> ep.3
POST    /api/orders            500     Server Error — back-end code threw (SERVER side, not you)
GET     https://other.com/x    (CORS)  Blocked by same-origin policy unless CORS allows  -> SSA

# Triage rule: 4xx -> the request or its permissions;  5xx -> the server's own code.
```

### Listing 3 — The Console + Storage: inspecting the live DOM and client-side data

```javascript
// Everything below runs in the browser Console — and is fully visible/editable to ANY user.
// (That visibility is the point: never hide secrets or security checks in client-side code.)

// Elements/Console: inspect and tweak the live DOM
const title = document.querySelector("#book-title");
console.log("Current title text:", title.textContent);
title.style.outline = "2px solid red";     // temporary visual debug

// Storage: what the site has persisted in this browser
console.log("localStorage:", { ...localStorage });   // e.g. cached data, preferences
console.log("cookies:", document.cookie);            // visible unless HttpOnly is set

// Network (programmatic): read a failing request's status to localise the fault
const res = await fetch("/api/data");
console.log("status:", res.status, res.ok ? "OK" : "FAILED");
```
