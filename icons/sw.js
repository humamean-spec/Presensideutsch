/**
 * Presensi Deutsch — service worker.
 *
 * Goal: the app keeps working offline after it has been opened at least
 * once online. Strategy kept deliberately simple (no build-time asset
 * manifest / Workbox dependency):
 *
 *   - Navigation requests (loading the app itself): network first, so a
 *     teacher online always gets the latest build; falls back to the
 *     cached shell when offline.
 *   - Everything else (JS/CSS bundles, fonts, icons): cache first, with a
 *     background network request to refresh the cache for next time
 *     ("stale-while-revalidate"). Attendance data itself is never touched
 *     here — that's app state persisted via localStorage/IndexedDB-style
 *     storage (see src/lib/storage.js), not something a service worker
 *     caches.
 */

const CACHE_NAME = "presensi-deutsch-shell-v1";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL).catch(() => {
        // Best-effort: don't fail install if one shell URL can't be
        // pre-cached yet (e.g. first-ever deploy still propagating).
      })
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const isNavigation = request.mode === "navigate";

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
