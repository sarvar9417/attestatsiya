import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useExamTimer } from '../useExamTimer'

describe('useExamTimer', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('initializes with the full duration and runs', () => {
    const { result } = renderHook(() =>
      useExamTimer({ duration: 60, storageKey: 'test1' })
    )
    expect(result.current.timeLeft).toBe(60)
    expect(result.current.isRunning).toBe(true)
    expect(result.current.isTimeUp).toBe(false)
  })

  it('does not auto-start when autoStart is false', () => {
    const { result } = renderHook(() =>
      useExamTimer({ duration: 60, storageKey: 'test2', autoStart: false })
    )
    expect(result.current.isRunning).toBe(false)
    expect(result.current.timeLeft).toBe(60)
  })

  it('counts down by 1 each second', () => {
    const { result } = renderHook(() =>
      useExamTimer({ duration: 60, storageKey: 'test3' })
    )
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.timeLeft).toBe(57)
  })

  it('calls onTimeUp once when reaching 0', () => {
    const onTimeUp = vi.fn()
    const { result } = renderHook(() =>
      useExamTimer({ duration: 3, storageKey: 'test4', onTimeUp })
    )
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.timeLeft).toBe(0)
    expect(result.current.isTimeUp).toBe(true)
    expect(result.current.isRunning).toBe(false)
    // Callback fires via queueMicrotask
    return Promise.resolve().then(() => {
      expect(onTimeUp).toHaveBeenCalledTimes(1)
    })
  })

  it('pause stops the countdown', () => {
    const { result } = renderHook(() =>
      useExamTimer({ duration: 60, storageKey: 'test5' })
    )
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    act(() => {
      result.current.pause()
    })
    const pausedAt = result.current.timeLeft
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.timeLeft).toBe(pausedAt)
    expect(result.current.isRunning).toBe(false)
  })

  it('resume continues from where pause left off', () => {
    const { result } = renderHook(() =>
      useExamTimer({ duration: 60, storageKey: 'test6' })
    )
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    act(() => {
      result.current.pause()
    })
    act(() => {
      vi.advanceTimersByTime(5000) // should not tick while paused
    })
    act(() => {
      result.current.resume()
    })
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.timeLeft).toBe(55) // 60 - 2 (initial) - 3 (after resume)
  })

  it('reset returns to full duration and stops', () => {
    const { result } = renderHook(() =>
      useExamTimer({ duration: 60, storageKey: 'test7' })
    )
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    act(() => {
      result.current.reset()
    })
    expect(result.current.timeLeft).toBe(60)
    expect(result.current.isRunning).toBe(false)
  })

  it('toggle flips running state', () => {
    const { result } = renderHook(() =>
      useExamTimer({ duration: 60, storageKey: 'test8' })
    )
    expect(result.current.isRunning).toBe(true)
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isRunning).toBe(false)
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isRunning).toBe(true)
  })

  it('persists state in localStorage', () => {
    renderHook(() =>
      useExamTimer({ duration: 60, storageKey: 'test9' })
    )
    const stored = localStorage.getItem('exam_timer:test9')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveProperty('startTime')
    expect(parsed.pausedAt).toBeNull()
    expect(parsed.pausedTotal).toBe(0)
  })

  it('clears localStorage on time-up', () => {
    renderHook(() =>
      useExamTimer({ duration: 1, storageKey: 'test10' })
    )
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    const stored = localStorage.getItem('exam_timer:test10')
    expect(stored).toBeNull()
  })

  it('clears localStorage on reset', () => {
    const { result } = renderHook(() =>
      useExamTimer({ duration: 60, storageKey: 'test11' })
    )
    act(() => {
      result.current.reset()
    })
    const stored = localStorage.getItem('exam_timer:test11')
    expect(stored).toBeNull()
  })
})
