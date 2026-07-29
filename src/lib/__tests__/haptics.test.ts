import { describe, it, expect } from 'vitest'
import { hapticFeedback } from '../haptics'

describe('haptics', () => {
  it('hapticFeedback is a function', () => {
    expect(typeof hapticFeedback).toBe('function')
  })

  it('hapticFeedback does not throw', () => {
    expect(() => hapticFeedback('light')).not.toThrow()
    expect(() => hapticFeedback('medium')).not.toThrow()
    expect(() => hapticFeedback('heavy')).not.toThrow()
    expect(() => hapticFeedback()).not.toThrow()
  })
})
