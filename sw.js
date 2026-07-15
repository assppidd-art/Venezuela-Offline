const CACHE_NAME = 'sismored-offline-v1';
const ASSETS = [
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json'
];

// 1. Instalamos y guardamos los archivos esenciales en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 2. Eliminamos cachés antiguas y tomamos el control de la app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// 3. Estrategia offline: navegación cache-first y recursos estáticos cache-first
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put('index.html', networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => new Response('Offline', { headers: { 'Content-Type': 'text/plain' } }))
  );
});
