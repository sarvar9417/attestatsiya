import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAsyncError } from '../useAsyncError'

describe('useAsyncError', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useAsyncError())
    expect(typeof result.current).toBe('function')
  })

  it('throwError throws Error when given Error', () => {
    const { result } = renderHook(() => useAsyncError())
    const err = new Error('test error')

    expect(() => {
      act(() => {
        result.current(err)
      })
    }).toThrow('test error')
  })

  it('throwError wraps non-Error values', () => {
    const { result } = renderHook(() => useAsyncError())

    expect(() => {
      act(() => {
        result.current('string error')
      })
    }).toThrow('string error')
  })

  it('throwError wraps null/undefined', () => {
    const { result } = renderHook(() => useAsyncError())

    expect(() => {
      act(() => {
        result.current(null)
      })
    }).toThrow()
  })
})
