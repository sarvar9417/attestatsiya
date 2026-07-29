import { describe, it, expect, vi } from 'vitest'
import { isNetworkError, normalizeError, captureError, withErrorHandling, tryOrDefault } from '../errorService'
import { AppError, ERROR_CODES } from '../errors'

vi.mock('../monitoring', () => ({
  monitoring: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    identifyUser: vi.fn(),
    trackEvent: vi.fn(),
  },
}))

describe('errorService', () => {
  describe('isNetworkError', () => {
    it('detects TypeError Failed to fetch', () => {
      expect(isNetworkError(new TypeError('Failed to fetch'))).toBe(true)
    })
    it('detects AppError with NETWORK_ERROR code', () => {
      expect(isNetworkError(new AppError(ERROR_CODES.NETWORK_ERROR, 'msg'))).toBe(true)
    })
    it('detects network-related error messages', () => {
      expect(isNetworkError(new Error('network timeout'))).toBe(true)
      expect(isNetworkError(new Error('AbortError'))).toBe(true)
    })
    it('returns false for non-network errors', () => {
      expect(isNetworkError(new Error('Something else'))).toBe(false)
      expect(isNetworkError('string')).toBe(false)
    })
  })

  describe('normalizeError', () => {
    it('normalizes AppError', () => {
      const appErr = new AppError('CODE', 'User msg', 'warning')
      const result = normalizeError(appErr)
      expect(result.error).toBe(appErr)
      expect(result.userMessage).toBe('User msg')
    })
    it('normalizes regular Error', () => {
      const err = new Error('regular error')
      const result = normalizeError(err)
      expect(result.error).toBe(err)
      expect(result.userMessage).toBe('regular error')
    })
    it('normalizes unknown values', () => {
      const result = normalizeError('string error')
      expect(result.error).toBeInstanceOf(Error)
      expect(result.userMessage).toContain('Kutilmagan')
    })
  })

  describe('captureError', () => {
    it('captures error and returns normalized Error', () => {
      const err = new Error('test')
      const result = captureError(err, { component: 'test' })
      expect(result).toBeInstanceOf(Error)
    })
  })

  describe('tryOrDefault', () => {
    it('returns result on success', () => {
      expect(tryOrDefault(() => 42, 0)).toBe(42)
    })
    it('returns fallback on error', () => {
      expect(tryOrDefault(() => { throw new Error('fail') }, 'fallback')).toBe('fallback')
    })
  })

  describe('withErrorHandling', () => {
    it('returns result on success', async () => {
      const result = await withErrorHandling(async () => 'ok')
      expect(result).toBe('ok')
    })

    it('throws on failure without retry', async () => {
      await expect(
        withErrorHandling(async () => { throw new Error('fail') })
      ).rejects.toThrow('fail')
    })

    it('retries on failure', async () => {
      vi.useFakeTimers()
      let attempts = 0
      const promise = withErrorHandling(
        async () => {
          attempts++
          if (attempts < 3) throw new Error('fail')
          return 'ok'
        },
        { retry: { maxAttempts: 3, delay: 10 } }
      )
      // Advance past the retry delays
      await vi.advanceTimersByTimeAsync(1000)
      const result = await promise
      expect(result).toBe('ok')
      expect(attempts).toBe(3)
      vi.useRealTimers()
    })

    it('does not retry network errors', async () => {
      let attempts = 0
      await expect(
        withErrorHandling(
          async () => {
            attempts++
            throw new TypeError('Failed to fetch')
          },
          { retry: { maxAttempts: 3, delay: 10 } }
        )
      ).rejects.toThrow()
      expect(attempts).toBe(1)
    })

    it('calls onRetry callback', async () => {
      vi.useFakeTimers()
      const onRetry = vi.fn()
      let attempts = 0
      const promise = withErrorHandling(
        async () => {
          attempts++
          if (attempts < 3) throw new Error('fail')
          return 'ok'
        },
        { retry: { maxAttempts: 3, delay: 10, onRetry } }
      )
      await vi.advanceTimersByTimeAsync(1000)
      await promise
      expect(onRetry).toHaveBeenCalledTimes(2)
      vi.useRealTimers()
    })
  })
})
