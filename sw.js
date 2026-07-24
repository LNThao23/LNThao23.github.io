// Service Worker for PDF Caching
// Cache name — bump this version string to force-refresh the cache when PDFs change
const CACHE_NAME = 'pdf-cache-v1';

// On install: activate immediately without waiting for old SW to die
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// On activate: claim all clients so this SW controls the page right away
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch handler: cache-first for PDFs, network-first for everything else
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const isPDF = url.pathname.endsWith('.pdf');

    if (isPDF) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
    }
});

// Listen for a message from the page asking us to pre-cache a specific PDF
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_PDF') {
        const pdfUrl = event.data.url;
        caches.open(CACHE_NAME).then((cache) => {
            cache.match(pdfUrl).then((existing) => {
                if (!existing) {
                    fetch(pdfUrl).then((response) => {
                        if (response && response.status === 200) {
                            cache.put(pdfUrl, response);
                        }
                    }).catch(() => {});
                }
            });
        });
    }
});
