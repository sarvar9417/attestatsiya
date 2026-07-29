import { monitoring } from './monitoring'
import { db } from './db'

/**
 * Core Web Vitals budjeti (Google "good" chegaralari) — F3-10.
 * Metrika chegaradan oshsa monitoring'ga `warn` sifatida yoziladi (regressiya ko'rinadi).
 */
const WEB_VITALS_BUDGET = {
  LCP: 2500,   // ms — Largest Contentful Paint
  FID: 100,    // ms — First Input Delay
  CLS: 0.1,    // birliksiz — Cumulative Layout Shift
  FCP: 1800,   // ms — First Contentful Paint
} as const

/** Metrika budjetdan oshsa 'warn', aks holda 'info' qaytaradi. */
function vitalSeverity(metric: keyof typeof WEB_VITALS_BUDGET, value: number): 'info' | 'warn' {
  return value > WEB_VITALS_BUDGET[metric] ? 'warn' : 'info'
}

export function measureRenderTime(componentName: string): () => void {
  const start = performance.now()
  return () => {
    const duration = performance.now() - start
    if (duration > 100) {
      monitoring.captureMessage(`[Perf] ${componentName} rendered in ${duration.toFixed(1)}ms`, 'warn')
    }
  }
}

/** Track all Core Web Vitals — LCP, FID, CLS, FCP */
export function reportWebVitals() {
  if (typeof performance === 'undefined') return

  // FCP / FP
  if ('getEntriesByType' in performance) {
    const paint = performance.getEntriesByType('paint')
    paint.forEach(entry => {
      const sev = entry.name === 'first-contentful-paint' ? vitalSeverity('FCP', entry.startTime) : 'info'
      monitoring.captureMessage(`Web Vital: ${entry.name} = ${entry.startTime.toFixed(1)}ms`, sev)
    })
  }

  // LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const last = entries[entries.length - 1]
      monitoring.captureMessage(`LCP: ${last.startTime.toFixed(1)}ms`, vitalSeverity('LCP', last.startTime))
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch { /* unsupported browser */ }

  // FID (First Input Delay)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        const delay = (entry as PerformanceEventTiming).processingStart - entry.startTime
        monitoring.captureMessage(`FID: ${delay.toFixed(1)}ms`, vitalSeverity('FID', delay))
      })
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
  } catch { /* unsupported browser */ }

  // CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const clsEntry = db.cast<{ hadRecentInput: boolean; value: number }>(entry)
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value
        }
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })

    // Report final CLS when page visibility changes to hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && clsValue > 0) {
        clsObserver.disconnect()
        monitoring.captureMessage(`CLS: ${clsValue.toFixed(3)}`, vitalSeverity('CLS', clsValue), {
          clsEntries: 1,
          url: location.href,
        })
      }
    }, { once: true })
  } catch { /* unsupported browser */ }
}
