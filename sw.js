const CACHE_NAME = "tracking-app-v3";
// How long to wait on the network before answering from cache instead.
const NETWORK_TIMEOUT_MS = 3000;
// Cached on install so the app works offline right after the first visit.
const APP_FILES = [
  "./",
  "index.html",
  "visualSettings.js",
  "manifest.json",
  "icon.png",
  "trainSchedule.json",
  "trainScheduleWeekend.json",
  "actions.json",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES.map((f) => new Request(f, { cache: "reload" }))))
      .catch(() => {})
  );
});

// Query strings are only cache-busters here (?v=, ?refresh=), so ignore them.
function fromCache(request) {
  return caches.match(request, { ignoreSearch: true });
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

function cacheResponse(request, response) {
  if (request.method === "GET" && response.ok) {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Google Fonts never change for a given URL: serve from cache when possible.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((r) => cacheResponse(request, r)))
    );
    return;
  }

  // App files: network first, revalidating past the browser's HTTP cache so
  // index.html and its scripts always come from the same deploy. Fall back to
  // the cached copy when offline or when the network is too slow.
  const network = (
    url.origin === self.location.origin
      ? fetch(url.href, { cache: "no-cache", credentials: "same-origin" })
      : fetch(request)
  ).then((r) => cacheResponse(request, r));
  event.respondWith(
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        fromCache(request).then((cached) => cached && resolve(cached));
      }, NETWORK_TIMEOUT_MS);
      network
        .then((r) => { clearTimeout(timer); resolve(r); })
        .catch(() => {
          clearTimeout(timer);
          fromCache(request).then((cached) => (cached ? resolve(cached) : reject(new Error("offline"))));
        });
    })
  );
});
