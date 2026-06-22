// Two caches:
//   APP_SHELL  — the app itself (HTML/JS/CSS + vendored libs). Versioned; bumping the
//                version replaces it on the next activate. Precached on install.
//   DOWNLOADS  — content fetched for offline use: audio (.m4a) + script/supplementary
//                markdown + quiz JSON. Populated on demand (browsing) and by explicit
//                "download" actions from the page. NEVER wiped on a shell version bump,
//                so app updates don't delete the user's downloads.
const APP_SHELL = 'podcast-shell-v5';
const DOWNLOADS = 'podcast-downloads-v1';

const SHELL = [
  '/', '/index.html', '/app.js', '/auth.js', '/speed-engine.js', '/style.css', '/app.webmanifest',
  '/vendor/marked.min.js', '/vendor/highlight.min.js',
  '/vendor/github-dark-dimmed.min.css', '/vendor/github.min.css',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-180.png', '/icons/icon-32.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(APP_SHELL).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      // Drop only stale shell caches; keep DOWNLOADS (and the current shell).
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('podcast-shell-') && k !== APP_SHELL)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Build a 206 Partial Content response by slicing a fully-cached audio body. iOS
// Safari's <audio> element requests audio with a Range header; if we've downloaded
// the whole file we can satisfy those ranges from cache so playback works offline.
async function rangeFromCache(request) {
  const cache = await caches.open(DOWNLOADS);
  const cached = await cache.match(request.url); // match the full GET, ignoring Range
  if (!cached) return fetch(request);            // not downloaded → stream from network

  const buf = await cached.arrayBuffer();
  const total = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(request.headers.get('Range') || '');
  let start, end;
  if (m && m[1] === '' && m[2] !== '') {
    // Suffix range: "bytes=-N" → the last N bytes (MP4 players probe the tail).
    start = Math.max(0, total - parseInt(m[2], 10));
    end = total - 1;
  } else {
    start = m && m[1] ? parseInt(m[1], 10) : 0;
    end = m && m[2] ? parseInt(m[2], 10) : total - 1;
  }
  if (isNaN(start) || start < 0) start = 0;
  if (isNaN(end) || end >= total) end = total - 1;
  if (start > end) { start = 0; end = total - 1; }

  const slice = buf.slice(start, end + 1);
  return new Response(slice, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'audio/mp4',
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Content-Length': String(slice.byteLength),
      'Accept-Ranges': 'bytes',
    },
  });
}

// Cache-first against a named cache; on miss, fetch and store the result.
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone());
  return res;
}

// Return cache immediately if present, refresh it in the background; otherwise wait
// on the network and cache the result. Good for markdown/quiz that rarely change.
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => { if (res && res.ok) cache.put(request, res.clone()); return res; })
    .catch(() => null);
  return cached || network || fetch(request);
}

// Network-first: keep the cached copy fresh, fall back to it offline. Used for
// manifest.json so new episodes show up online but the app still loads offline.
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const path = url.pathname;

  // manifest.json — always try the network first so new content appears.
  if (sameOrigin && path.endsWith('/manifest.json')) {
    e.respondWith(networkFirst(req, APP_SHELL));
    return;
  }

  // Audio. Range requests (iOS <audio>) are served from a downloaded full body when
  // available; plain GETs (speed engine + downloads) are cache-first in DOWNLOADS.
  if (path.endsWith('.m4a')) {
    if (req.headers.get('Range')) e.respondWith(rangeFromCache(req));
    else e.respondWith(cacheFirst(req, DOWNLOADS));
    return;
  }

  // App shell — stale-while-revalidate: instant from cache, refreshed in the
  // background so code changes roll out on the next load without a version bump.
  if (sameOrigin && SHELL.includes(path)) {
    e.respondWith(staleWhileRevalidate(req, APP_SHELL));
    return;
  }

  // Other same-origin content (script/supplementary markdown, quiz JSON, etc.):
  // serve cached instantly, refresh in the background, and cache on first fetch so
  // it's available offline after being viewed or downloaded.
  if (sameOrigin) {
    e.respondWith(staleWhileRevalidate(req, DOWNLOADS));
    return;
  }

  // Cross-origin (shouldn't be much after vendoring): network, fall back to any cache.
  e.respondWith(fetch(req).catch(() => caches.match(req)));
});
