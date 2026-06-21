const CACHE = 'podcast-shell-v2';
const SHELL = ['/', '/index.html', '/app.js', '/speed-engine.js', '/style.css', '/app.webmanifest', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { pathname } = new URL(e.request.url);

  // Cache audio on demand (skip Range requests — serve from network)
  if (pathname.endsWith('.m4a')) {
    if (e.request.headers.get('Range')) return; // let browser handle range requests directly
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(e.request).then((cached) => {
          if (cached) return cached;
          return fetch(e.request).then((res) => {
            if (res.ok) c.put(e.request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // Shell files: cache-first
  if (SHELL.includes(pathname)) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
    return;
  }

  // Everything else (CDN scripts, markdown): network-first with cache fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
