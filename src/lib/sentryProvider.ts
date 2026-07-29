import * as Sentry from '@sentry/react'
import type { MonitoringProvider } from './monitoring'

export function initSentry(dsn: string) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: import.meta.env.PROD ? 0.01 : 0.0,
    replaysOnErrorSampleRate: import.meta.env.PROD ? 0.1 : 0.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      ...(import.meta.env.PROD ? [Sentry.replayIntegration()] : []),
    ],
  })
}

const sentryLevelMap: Record<string, Sentry.SeverityLevel> = {
  info: 'info',
  warn: 'warning',
  error: 'error',
}

export function createSentryProvider(): MonitoringProvider {
  return {
    captureException(error, context) {
      Sentry.captureException(error, { extra: context })
    },
    captureMessage(message, level = 'info', context) {
      Sentry.captureMessage(message, {
        level: sentryLevelMap[level] ?? 'info',
        extra: context,
      })
    },
    identifyUser(userId, traits) {
      Sentry.setUser({ id: userId, ...traits })
    },
    trackEvent(name, properties) {
      Sentry.captureEvent({ message: name, extra: properties })
    },
  }
}
