// Service worker mínimo: permite que la app sea instalable (PWA) y
// deja el shell disponible sin conexión. Los datos siempre se sincronizan
// en línea contra Google Sheets (Apps Script), esto solo cachea la interfaz.

const CACHE_NAME = 'fg-previsión-v1';
const ARCHIVOS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Las llamadas a la API de Apps Script siempre van a la red (nunca a caché).
  if (event.request.url.includes('script.google.com')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
