import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOnlineStatus } from '../useOnlineStatus'

describe('useOnlineStatus', () => {
  beforeEach(() => {
    // Default to online before each test
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function fireOnlineEvent(online: boolean) {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: online,
    })
    window.dispatchEvent(new Event(online ? 'online' : 'offline'))
  }

  it('returns true when navigator.onLine is true', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)
  })

  it('returns false when navigator.onLine is false', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false,
    })
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(false)
  })

  it('switches to false when offline event fires', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)

    act(() => {
      fireOnlineEvent(false)
    })

    expect(result.current).toBe(false)
  })

  it('switches to true when online event fires', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false,
    })
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(false)

    act(() => {
      fireOnlineEvent(true)
    })

    expect(result.current).toBe(true)
  })

  it('removes event listeners on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useOnlineStatus())

    // Should have added listeners for online and offline
    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))

    unmount()

    // Should have removed both listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('does not update after unmount (no memory leak)', () => {
    const { result, unmount } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)

    unmount()

    // Firing event after unmount should not cause state update
    act(() => {
      fireOnlineEvent(false)
    })
    // No assertion needed — just checking no React warning about state update on unmounted component
  })
})
