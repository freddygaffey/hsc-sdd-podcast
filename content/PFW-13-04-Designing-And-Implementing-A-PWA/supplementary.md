---
title: "Supplementary Materials — Designing and Implementing a PWA"
module: PFW
lesson: "13.4"
script: script.md
---

# Supplementary Materials

Read-along reference for this episode. Nothing here is spoken. The narration teaches MISO
(Manifest, Installable, Service worker, Offline), how the service worker provides offline
capability, the HTTPS requirement, and accessibility of the app shell.

### Listing 1 — The web app manifest (the "M" and "I" of MISO)

```json
// manifest.webmanifest — describes the app so the browser can INSTALL it.
{
  "name": "Field Notes",
  "short_name": "Notes",
  "start_url": "/",
  "display": "standalone",            // opens in its own window, no address bar = app-like
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

```html
<!-- Link the manifest + register the service worker. (Served over HTTPS — required.) -->
<link rel="manifest" href="/manifest.webmanifest">
<script>
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");
</script>
```

### Listing 2 — The service worker: cache the app shell, then serve it OFFLINE (the "S" and "O")

```javascript
// sw.js — a background script that INTERCEPTS every network request.
const CACHE = "field-notes-v1";
const APP_SHELL = ["/", "/static/app.css", "/static/app.js", "/icons/icon-192.png", "/offline.html"];

// INSTALL: cache the app shell on first load (same caching idea as 13-03 performance).
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)));
});

// FETCH: intercept requests. Cache-first -> works with NO network = offline capability.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => {
        // Network failed AND not cached: show the offline fallback page.
        if (event.request.mode === "navigate") return caches.match("/offline.html");
      });
    })
  );
});
```

### Listing 3 — Accessible offline feedback (apply C-FAN-H + POUR to the app shell)

```javascript
// FEEDBACK + ACCESSIBILITY: announce the offline/online state, incl. to screen readers.
const live = document.querySelector("#sr-status");   // <div id="sr-status" aria-live="polite" class="sr-only">

window.addEventListener("offline", () => {
  document.body.classList.add("is-offline");
  banner.textContent = "You are offline — changes will sync when reconnected.";  // visible
  live.textContent = "Connection lost. App is now offline.";                     // screen reader
});

window.addEventListener("online", () => {
  document.body.classList.remove("is-offline");
  live.textContent = "Connection restored. App is now online.";
  syncQueuedChanges();                                  // push offline-created data to the server
});
```

```text
MISO — what distinguishes a PWA from a standard website:
  M  Manifest      JSON describing name/icons/display -> enables install
  I  Installable   added to the home screen, launches standalone (app-like)
  S  Service worker  background proxy that intercepts network requests
  O  Offline       service worker serves cached app shell when no network
  (+ must be served over HTTPS; responsive != PWA — appearance vs capability)
```
