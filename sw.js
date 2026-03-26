const CACHE = 'dramaluxe-v2';
const STATIC = [
  '/index.html',
  '/assets/style.css',
  '/js/catalog.js',
  '/js/player.js',
  '/js/ui.js',
  '/js/app.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC.map(u => new Request(u, {cache:'reload'}))))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Cache-first for own assets; network-first for CDN/media
  const isOwn = STATIC.some(p => url.pathname.endsWith(p.replace('/','')));
  if (isOwn) {
    e.respondWith(caches.match(e.request).then(r => r || fetchAndCache(e.request)));
  } else if (url.hostname.includes('youtube') || url.hostname.includes('img.youtube') || url.hostname.includes('font')) {
    e.respondWith(fetchAndCache(e.request));
  }
});

function fetchAndCache(req) {
  return fetch(req).then(res => {
    if (!res || !res.ok) return res;
    const clone = res.clone();
    caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
    return res;
  }).catch(() => caches.match(req));
}
