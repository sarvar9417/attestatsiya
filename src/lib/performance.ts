import { monitoring } from './monitoring'

const WEB_VITALS_BUDGET = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  FCP: 1800,
} as const

function vitalSeverity(metric: keyof typeof WEB_VITALS_BUDGET, value: number): 'info' | 'warn' {
  return value > WEB_VITALS_BUDGET[metric] ? 'warn' : 'info'
}

export function reportWebVitals() {
  if (typeof performance === 'undefined') return

  if ('getEntriesByType' in performance) {
    const paint = performance.getEntriesByType('paint')
    paint.forEach(entry => {
      const sev = entry.name === 'first-contentful-paint' ? vitalSeverity('FCP', entry.startTime) : 'info'
      monitoring.captureMessage(`Web Vital: ${entry.name} = ${entry.startTime.toFixed(1)}ms`, sev)
    })
  }

  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const last = entries[entries.length - 1]
      monitoring.captureMessage(`LCP: ${last.startTime.toFixed(1)}ms`, vitalSeverity('LCP', last.startTime))
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch { /* unsupported browser */ }

  try {
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        const delay = (entry as PerformanceEventTiming).processingStart - entry.startTime
        monitoring.captureMessage(`FID: ${delay.toFixed(1)}ms`, vitalSeverity('FID', delay))
      })
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
  } catch { /* unsupported browser */ }
}
