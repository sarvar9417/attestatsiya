import { describe, it, expect } from 'vitest'
import { AppError, ERROR_CODES, USER_MESSAGES, toUserMessage, isError } from '../errors'

describe('errors', () => {
  describe('AppError', () => {
    it('creates error with code, message, and severity', () => {
      const err = new AppError('TEST_CODE', 'Test message', 'warning')
      expect(err.code).toBe('TEST_CODE')
      expect(err.userMessage).toBe('Test message')
      expect(err.severity).toBe('warning')
      expect(err.name).toBe('AppError')
      expect(err).toBeInstanceOf(Error)
    })

    it('defaults to error severity', () => {
      const err = new AppError('CODE', 'msg')
      expect(err.severity).toBe('error')
    })
  })

  describe('ERROR_CODES', () => {
    it('has all expected codes', () => {
      expect(ERROR_CODES.SUPABASE_FETCH).toBe('SUPABASE_FETCH')
      expect(ERROR_CODES.LESSON_NOT_FOUND).toBe('LESSON_NOT_FOUND')
      expect(ERROR_CODES.AUTH_REQUIRED).toBe('AUTH_REQUIRED')
      expect(ERROR_CODES.AI_UNAVAILABLE).toBe('AI_UNAVAILABLE')
      expect(ERROR_CODES.NETWORK_ERROR).toBe('NETWORK_ERROR')
    })
  })

  describe('USER_MESSAGES', () => {
    it('has a message for every error code', () => {
      for (const code of Object.keys(ERROR_CODES)) {
        expect(USER_MESSAGES[code as keyof typeof USER_MESSAGES]).toBeTruthy()
      }
    })
  })

  describe('toUserMessage', () => {
    it('returns userMessage for AppError', () => {
      const err = new AppError('CODE', 'Custom user msg')
      expect(toUserMessage(err)).toBe('Custom user msg')
    })

    it('returns network message for network errors', () => {
      expect(toUserMessage(new Error('Network error occurred'))).toBe(USER_MESSAGES.NETWORK_ERROR)
      expect(toUserMessage(new Error('fetch failed'))).toBe(USER_MESSAGES.NETWORK_ERROR)
      expect(toUserMessage(new Error('timeout'))).toBe(USER_MESSAGES.NETWORK_ERROR)
    })

    it('returns generic message for unknown errors', () => {
      expect(toUserMessage(new Error('Something weird'))).toContain('Kutilmagan')
    })

    it('returns generic message for non-Error values', () => {
      expect(toUserMessage('string error')).toContain('Kutilmagan')
      expect(toUserMessage(42)).toContain('Kutilmagan')
      expect(toUserMessage(null)).toContain('Kutilmagan')
    })
  })

  describe('isError', () => {
    it('returns true for Error instances', () => {
      expect(isError(new Error('test'))).toBe(true)
      expect(isError(new AppError('c', 'm'))).toBe(true)
    })
    it('returns false for non-Error values', () => {
      expect(isError('string')).toBe(false)
      expect(isError(null)).toBe(false)
      expect(isError(undefined)).toBe(false)
      expect(isError(42)).toBe(false)
    })
  })
})
