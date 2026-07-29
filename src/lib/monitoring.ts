type EventPayload = Record<string, unknown>

export interface MonitoringProvider {
  captureException(error: Error, context?: EventPayload): void
  captureMessage(message: string, level?: 'info' | 'warn' | 'error', context?: EventPayload): void
  identifyUser(userId: string, traits?: EventPayload): void
  trackEvent(name: string, properties?: EventPayload): void
}

const consoleProvider: MonitoringProvider = {
  captureException(error, context) {
    if (import.meta.env.DEV) {
      console.warn('[monitoring] Exception:', error.message, context ?? '')
    }
  },
  captureMessage(message, level = 'info', context) {
    if (import.meta.env.DEV) {
      const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
      fn('[monitoring]', message, context ?? '')
    }
  },
  identifyUser(_userId, _traits) {
    if (import.meta.env.DEV) {
      console.log('[monitoring] Identify:', _userId, _traits ?? '')
    }
  },
  trackEvent(name, properties) {
    if (import.meta.env.DEV) {
      console.log('[monitoring] Event:', name, properties ?? '')
    }
  },
}

let provider: MonitoringProvider = consoleProvider

export function setMonitoringProvider(p: MonitoringProvider) {
  provider = p
}

export const monitoring = {
  captureException(error: Error, context?: EventPayload) {
    provider.captureException(error, context)
  },
  captureMessage(message: string, level?: 'info' | 'warn' | 'error', context?: EventPayload) {
    provider.captureMessage(message, level, context)
  },
  identifyUser(userId: string, traits?: EventPayload) {
    provider.identifyUser(userId, traits)
  },
  trackEvent(name: string, properties?: EventPayload) {
    provider.trackEvent(name, properties)
  },
}
