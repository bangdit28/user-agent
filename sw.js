// Service worker minimal untuk fungsionalitas PWA (installable)

self.addEventListener('install', (event) => {
  // Event install, bisa dikosongkan untuk sekarang
  console.log('Service Worker: Install');
});

self.addEventListener('fetch', (event) => {
  // Event fetch, cukup teruskan request ke network
  // Ini penting agar website tetap berfungsi normal
  event.respondWith(fetch(event.request));
});
