import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initTheme } from './utils/theme'
import { setMonitoringProvider } from './lib/monitoring'
import { createSentryProvider, initSentry } from './lib/sentryProvider'
import { initSyncQueueListener } from './lib/syncQueue'

initTheme()

// Yangi deploy'dan keyin eski chunk preload xatosi bo'lsa — sahifani yangilaymiz
window.addEventListener('vite:preloadError', () => {
  const last = Number(sessionStorage.getItem('lastChunkReload') || 0)
  if (Date.now() - last > 10_000) {
    sessionStorage.setItem('lastChunkReload', String(Date.now()))
    window.location.reload()
  }
})

// ─── Sentry initialization ────────────────────────────────────────────────
// VITE_SENTRY_DSN ni .env faylida belgilang.
// Sourcemap yuklash: npx sentry-cli sourcemaps inject ./dist && npx sentry-cli sourcemaps upload --release=<release> ./dist

const dsn = import.meta.env.VITE_SENTRY_DSN
if (dsn && typeof dsn === 'string') {
  initSentry(dsn)
  setMonitoringProvider(createSentryProvider())
}

// Global unhandled rejection handler — console'ga ham, monitoring'ga ham yozadi
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason
  if (reason instanceof Error) {
    import('./lib/monitoring').then(({ monitoring }) =>
      monitoring.captureException(reason, { type: 'unhandledrejection' })
    ).catch(() => {
      // monitoring module loaded bo'lmasa, hech bo'lmaganda console'ga yozamiz
      // eslint-disable-next-line no-console
      console.error('[unhandledrejection]', reason)
    })
  }
})

initSyncQueueListener()

// ─── Service Worker auto-register (via vite-plugin-pwa / Workbox) ─────────
// The VitePWA plugin injects SW registration during build.
// In dev mode, the SW is not registered (handled by the plugin).

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
