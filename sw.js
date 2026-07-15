const CACHE_NAME = 'venezuela-offline-v2'; // Cambiamos a v2 para que el teléfono se actualice
const ASSETS = [
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json',
  // Guardamos las librerías de QR en la memoria interna de la App
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://unpkg.com/html5-qrcode'
];

// 1. Instalamos y obligamos al Service Worker a activarse ya
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Guardando archivos y librerías QR en caché...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Tomamos el control de la app inmediatamente
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Borramos la versión vieja (v1) para usar la nueva (v2)
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Responder desde la caché
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).catch(() => {
        return new Response("Offline");
      });
    })
  );
});
