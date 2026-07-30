import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initTheme } from './utils/theme'
import { setMonitoringProvider } from './lib/monitoring'
import { createSentryProvider, initSentry } from './lib/sentryProvider'

initTheme()

window.addEventListener('vite:preloadError', () => {
  const last = Number(sessionStorage.getItem('lastChunkReload') || 0)
  if (Date.now() - last > 10_000) {
    sessionStorage.setItem('lastChunkReload', String(Date.now()))
    window.location.reload()
  }
})

const dsn = import.meta.env.VITE_SENTRY_DSN
if (dsn && typeof dsn === 'string') {
  initSentry(dsn)
  setMonitoringProvider(createSentryProvider())
}

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason
  if (reason instanceof Error) {
    import('./lib/monitoring').then(({ monitoring }) =>
      monitoring.captureException(reason, { type: 'unhandledrejection' })
    ).catch(() => {
      console.error('[unhandledrejection]', reason)
    })
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
