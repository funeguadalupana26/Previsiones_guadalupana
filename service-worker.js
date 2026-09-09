// Service worker mínimo: permite que la app sea instalable (PWA) y
// deja el shell disponible sin conexión. Los datos siempre se sincronizan
// en línea contra Google Sheets (Apps Script), esto solo cachea la interfaz.
//
// IMPORTANTE: cada vez que subas un index.html nuevo, sube TAMBIÉN este
// archivo con el número de CACHE_NAME incrementado (v2, v3, ...). Así el
// navegador detecta que el service worker cambió, borra la caché vieja y
// vuelve a descargar la app actualizada. Si solo subes index.html sin
// tocar este archivo, los celulares que ya instalaron la app seguirán
// viendo la versión anterior indefinidamente.

const CACHE_NAME = 'fg-previsión-v2';
const ARCHIVOS = ['./', './index.html', './manifest.json', './logo.png'];

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

  // El HTML principal: primero intenta la red (para traer cambios nuevos de
  // inmediato); si no hay conexión, usa la copia guardada como respaldo.
  if (event.request.mode === 'navigate' || event.request.url.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then((resp) => {
          const copia = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
