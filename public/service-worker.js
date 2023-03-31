// Set a name for the current cache
const cacheName = 'v1';

// Default files to always cache
const cacheAssets = [
  './index.html',
  './static/js/bundle.js',
  './static/css/main.css',
  // Add any other assets you want to cache here
];

// Call Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Make a copy/clone of the response
        const responseClone = response.clone();
        // Open the cache
        caches.open(cacheName).then((cache) => {
          // Add the response to the cache
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request).then((response) => response))
  );
});
