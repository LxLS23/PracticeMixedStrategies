const STATIC_CACHE = 'app-shell-v2';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

const APP_SHELL_ASSETS = [
    '/index.html',
    '/html/about.html',
    '/html/calendar.html',
    '/html/form.html',
    '/js/register.js',
    '/css/style.css'
];

const DYNAMIC_ASSETS_URLS = [
    'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js',
    'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/main.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css'
];

// ===== INSTALACIÓN: Cache Only para App Shell =====
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(APP_SHELL_ASSETS))
    );
});

// ===== ACTIVACIÓN: Limpia versiones viejas si deseas (opcional) =====
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// ===== FETCH: Implementación de ambas estrategias =====
self.addEventListener('fetch', event => {
    const requestUrl = event.request.url;

    // Estrategia 1: Cache First, Network Fallback para recursos dinámicos (CDNs)
    if (DYNAMIC_ASSETS_URLS.includes(requestUrl)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse; // Devuelve caché si está
                }

                // Si no está en caché, ve a la red y guarda una copia
                return fetch(event.request).then(networkResponse => {
                    return caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request, networkResponse.clone()); // Guarda en caché
                        return networkResponse;
                    });
                }).catch(() => {
                    // Si está offline y no estaba en caché, puedes devolver algo personalizado
                });
            })
        );
    }

    // Estrategia 2: Cache Only para App Shell
    else if (APP_SHELL_ASSETS.includes(new URL(requestUrl).pathname)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request); // Siempre intenta caché primero
            })
        );
    }

    // Otros recursos (opcional: red directa)
    else {
        // Aquí podrías dejar pasar otras peticiones (opcional)
    }
});
