import { describe, it, expect, vi, beforeEach } from 'vitest'
import { monitoring, setMonitoringProvider } from '../monitoring'
import type { MonitoringProvider } from '../monitoring'

describe('monitoring', () => {
  let mockProvider: MonitoringProvider

  beforeEach(() => {
    mockProvider = {
      captureException: vi.fn(),
      captureMessage: vi.fn(),
      identifyUser: vi.fn(),
      trackEvent: vi.fn(),
    }
    setMonitoringProvider(mockProvider)
  })

  describe('captureException', () => {
    it('delegates to provider', () => {
      const err = new Error('test')
      monitoring.captureException(err, { key: 'value' })
      expect(mockProvider.captureException).toHaveBeenCalledWith(err, { key: 'value' })
    })
  })

  describe('captureMessage', () => {
    it('delegates to provider with level', () => {
      monitoring.captureMessage('hello', 'warn', { extra: 1 })
      expect(mockProvider.captureMessage).toHaveBeenCalledWith('hello', 'warn', { extra: 1 })
    })
    it('defaults level to info', () => {
      monitoring.captureMessage('hello')
      expect(mockProvider.captureMessage).toHaveBeenCalledWith('hello', undefined, undefined)
    })
  })

  describe('identifyUser', () => {
    it('delegates to provider', () => {
      monitoring.identifyUser('user-123', { plan: 'pro' })
      expect(mockProvider.identifyUser).toHaveBeenCalledWith('user-123', { plan: 'pro' })
    })
  })

  describe('trackEvent', () => {
    it('delegates to provider', () => {
      monitoring.trackEvent('page.view', { path: '/' })
      expect(mockProvider.trackEvent).toHaveBeenCalledWith('page.view', { path: '/' })
    })
  })
})
