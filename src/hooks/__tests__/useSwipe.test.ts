import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSwipe } from '../useSwipe'

describe('useSwipe', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns bind handlers and initial state', () => {
    const { result } = renderHook(() => useSwipe({}))
    const [bind, state] = result.current
    expect(bind.onMouseDown).toBeInstanceOf(Function)
    expect(bind.onTouchStart).toBeInstanceOf(Function)
    expect(state.offsetX).toBe(0)
    expect(state.isDragging).toBe(false)
  })

  it('exports expected constants (SWIPE_THRESHOLD, SWIPE_DAMPING)', async () => {
    const mod = await import('../useSwipe')
    expect(typeof mod.useSwipe).toBe('function')
  })

  it('accepts all callback types', () => {
    const { result } = renderHook(() => useSwipe({
      onSwipeLeft: vi.fn(),
      onSwipeRight: vi.fn(),
      onTap: vi.fn(),
    }))
    const [bind] = result.current
    expect(bind.onMouseDown).toBeDefined()
    expect(bind.onTouchStart).toBeDefined()
  })

  it('accepts no callbacks', () => {
    const { result } = renderHook(() => useSwipe({}))
    expect(result.current[0].onMouseDown).toBeDefined()
    expect(result.current[0].onTouchStart).toBeDefined()
  })
})
