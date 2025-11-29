const cacheName = 'app-shell-v2';

const  APP_SHELL_ASSETS = ['/index.html','/html/about.html','/html/calendar.html','/html/form.html','/js/register.js', '/css/style.css']

const DYNAMIC_ASSETS_URLS = ['https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js', 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/main.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js','https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js','https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css'   
]

self.addEventListener('install', event =>{
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(
                    APP_SHELL_ASSETS
                )
            })
    )   
})

self.addEventListener('fetch', event =>{
    event.respondWith(
        caches.match(event.request)
            .then (response => {
                if (response) return response
            })
    )
})