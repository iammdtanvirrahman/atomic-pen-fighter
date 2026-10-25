const CACHE_NAME = 'pen-game-root-v1';
const APP_BASE = new URL('./', self.registration.scope);
const asset = (path) => new URL(path, APP_BASE).toString();
const PRECACHE_ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './public/icon.svg', './public/pwa-192x192.png', './public/pwa-512x512.png',
  './public/pwa-maskable-512x512.png', './public/apple-touch-icon.png',
  './public/favicon-32x32.png', './public/css/game.css',
  './public/js/pen-game.bundle.js', './public/js/pwa-install.js'
].map(asset);
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)); }
    return response;
  }).catch(() => caches.match(asset('index.html')))));
});
