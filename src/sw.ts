/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setCatchHandler } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare const self: ServiceWorkerGlobalScope

// ─── Precache all build assets ─────────────────────────────────────────────
precacheAndRoute(self.__WB_MANIFEST)

// ─── Navigation (HTML pages) — Network First ───────────────────────────────
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
)

// ─── API calls — Network First with timeout ─────────────────────────────────
registerRoute(
  /^\/api\//,
  new NetworkFirst({
    cacheName: 'api',
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }),
    ],
  })
)

// ─── Static assets (images, fonts) — Cache First ──────────────────────────
registerRoute(
  /\.(?:png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot|ico)$/,
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
)

// ─── JS/CSS chunks (precached, but stale-while-revalidate as fallback) ────
registerRoute(
  /\.(?:js|css)$/,
  new StaleWhileRevalidate({
    cacheName: 'scripts-styles',
    plugins: [
      new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 }),
    ],
  })
)

// ─── Supabase data (lesson data, vocabulary, progress) — StaleWhileRevalidate ──
registerRoute(
  /supabase\.co\/rest\/v1\//,
  new StaleWhileRevalidate({
    cacheName: 'supabase-data',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 }),
    ],
  })
)

// ─── Offline fallback — serve offline.html for failed navigations ────────────
const OFFLINE_PAGE = '/offline.html'

setCatchHandler(async ({ request }) => {
  // Only handle navigation requests
  if (request.mode !== 'navigate') {
    return Response.error()
  }

  // Try to serve the offline page from cache
  const cache = await self.caches.open('offline-fallback')
  const cachedResponse = await cache.match(OFFLINE_PAGE)
  if (cachedResponse) {
    return cachedResponse
  }

  // If offline page isn't cached yet (first install), fetch it from network
  try {
    const response = await fetch(OFFLINE_PAGE)
    if (response.ok) {
      const cache = await self.caches.open('offline-fallback')
      await cache.put(OFFLINE_PAGE, response.clone())
      return response
    }
  } catch (e) { // eslint-disable-next-line no-console
    console.warn('[SW] offline fallback fetch failed:', e) }

  // Last resort: return a minimal inline response
  return new Response(
    '<!DOCTYPE html><html lang="uz"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Offline — EnglishPath</title><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f3f4f6;color:#374151;padding:24px;text-align:center}.card{background:#fff;border-radius:16px;padding:48px 32px;max-width:400px;box-shadow:0 4px 6px rgba(0,0,0,.1)}h1{font-size:20px;margin-bottom:12px}p{font-size:14px;color:#6b7280;margin-bottom:24px}.btn{display:inline-block;background:#1a56db;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600}</style></head><body><div class="card"><h1>📡 Internet yo\'q</h1><p>Iltimos, internetga ulaning va qayta urinib ko\'ring.</p><a class="btn" href="/">Bosh sahifa</a></div></body></html>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
})

// ─── Notification click — navigate to URL ─────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification
  notification.close()

  const urlToOpen = notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.focus()
          if (client.navigate) client.navigate(urlToOpen)
          return
        }
      }
      if (self.clients.openWindow) self.clients.openWindow(urlToOpen)
    })
  )
})

// ─── Install event — pre-cache the offline fallback page ──────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-fallback').then((cache) => {
      return cache.add(OFFLINE_PAGE)
    })
  )
})
