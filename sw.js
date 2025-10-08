const CACHE_NAME = 'talha-portfolio-v1';
const OFFLINE_URL = 'offline.html';

const PRECACHE_ASSETS = [
  '/',
  'index.html',
  'manifest.json',
  OFFLINE_URL,
  // You can add more assets you want cached upfront
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Optionally cache fetched files
        return caches.open(CACHE_NAME).then((cache) => {
          try {
            cache.put(event.request, response.clone());
          } catch (e) {
            // some requests can't be cached (opaque, cross-origin) — ignore
          }
          return response;
        });
      }).catch(() => {
        // If both cache and network fail, show offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
