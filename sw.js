const IDI_CACHE='idi-app-v5';
const CORE_ASSETS=[
  './',
  './index.html',
  './manifest.webmanifest',
  './styles.css',
  './mobile-webapp.css',
  './platform-universal.css?v=2',
  './app.js',
  './mobile-webapp.js',
  './platform-universal.js',
  './assets/idi-logo.jpg'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(IDI_CACHE).then(cache=>cache.addAll(CORE_ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==IDI_CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(IDI_CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
    return response;
  }).catch(()=>caches.match('./index.html'))));
});
