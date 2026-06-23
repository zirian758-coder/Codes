const CACHE_NAME = 'codes-cache-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './codes-192.png',
  './codes-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // azonnal aktiválja az új SW-t
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // azonnal átveszi az irányítást
});

// 🔥 NETWORK-FIRST → AUTOMATIKUS FRISSÍTÉS
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // friss verzió mentése cache-be
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // offline fallback
  );
});
