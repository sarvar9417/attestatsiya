import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initTheme } from './utils/theme'
import { setMonitoringProvider } from './lib/monitoring'
import { createSentryProvider, initSentry } from './lib/sentryProvider'

initTheme()

// A stale Vite chunk can fail after a deployment. Do NOT reload the page
// unexpectedly during reading or a timed exam: ask the user to update.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  window.dispatchEvent(new Event('attestatsiya:chunk-update-needed'))
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
    ).catch(() => undefined)
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
