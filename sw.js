const CACHE = 'prono-cdm26-v6';
const LOCAL = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(LOCAL)));
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
  const url = new URL(e.request.url);
  // Ne jamais intercepter les requêtes externes (CDN, Supabase, APIs)
  if (url.origin !== self.location.origin) return;
  // Pour les fichiers locaux : cache first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
