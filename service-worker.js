const CACHE_NAME = 'contratos-prevision-v1';
const ARCHIVOS_ESTATICOS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_ESTATICOS))
  );
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

  // El HTML principal: si ya hay una copia guardada, la mostramos de
  // inmediato y le damos máximo 2.5s a la red para traer una versión más
  // nueva (así la app abre rápido incluso con conexión lenta). Si la red
  // responde a tiempo, se usa esa y se actualiza la caché para la próxima
  // vez. Si no hay copia guardada todavía (primera vez), sí esperamos a la
  // red porque no hay nada más que mostrar.
  if (event.request.mode === 'navigate' || event.request.url.endsWith('index.html')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResp = await cache.match(event.request);
      const networkPromise = fetch(event.request)
        .then((resp) => { cache.put(event.request, resp.clone()); return resp; })
        .catch(() => null);

      if (!cachedResp) {
        const resp = await networkPromise;
        return resp || new Response('Sin conexión y sin copia guardada todavía.', { status: 503 });
      }

      const espera = new Promise((resolve) => setTimeout(() => resolve(null), 2500));
      const resp = await Promise.race([networkPromise, espera]);
      return resp || cachedResp;
    })());
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
