import { useRef, useState, useCallback } from 'react'

interface SwipeCallbacks {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onTap?: () => void
}

interface SwipeState {
  offsetX: number
  isDragging: boolean
}

const SWIPE_THRESHOLD = 80 // px to trigger swipe
const SWIPE_DAMPING = 0.4 // drag resistance
const TAP_THRESHOLD = 10  // max px movement to still count as tap

/**
 * Touch/mouse swipe gesture hook for swipable cards.
 * Returns [bind, state] where bind goes on the draggable element.
 * State updates reactively to enable visual drag feedback.
 *
 * @example
 * ```tsx
 * const [bind, { offsetX, isDragging }] = useSwipe({
 *   onSwipeLeft: () => handleSkip(),
 *   onSwipeRight: () => handleKnow(),
 *   onTap: () => handleFlip(),
 * })
 * <div {...bind} style={{ transform: `translateX(${offsetX}px)` }} />
 * ```
 */
export function useSwipe(callbacks: SwipeCallbacks): [
  {
    onMouseDown: (e: React.MouseEvent) => void
    onTouchStart: (e: React.TouchEvent) => void
  },
  SwipeState,
] {
  const startX = useRef(0)
  const startY = useRef(0)
  const isDraggingRef = useRef(false)
  const offsetRef = useRef(0)

  const [state, setState] = useState<SwipeState>({
    offsetX: 0,
    isDragging: false,
  })

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startX.current = clientX
    startY.current = clientY
    isDraggingRef.current = true
    setState({ offsetX: 0, isDragging: true })
  }, [])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return

    const dx = clientX - startX.current
    const dy = clientY - startY.current

    // Only track horizontal swipes
    if (Math.abs(dx) > Math.abs(dy)) {
      offsetRef.current = dx * SWIPE_DAMPING
      setState({ offsetX: offsetRef.current, isDragging: true })
    }
  }, [])

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false

    const currentOffset = offsetRef.current
    const absOffset = Math.abs(currentOffset)

    if (absOffset > SWIPE_THRESHOLD) {
      if (currentOffset < 0 && callbacks.onSwipeLeft) {
        callbacks.onSwipeLeft()
      } else if (currentOffset > 0 && callbacks.onSwipeRight) {
        callbacks.onSwipeRight()
      }
    } else if (absOffset < TAP_THRESHOLD && callbacks.onTap) {
      callbacks.onTap()
    }

    offsetRef.current = 0
    setState({ offsetX: 0, isDragging: false })
  }, [callbacks])

  // Mouse events
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)

    const onMove = (ev: MouseEvent) => handleMove(ev.clientX, ev.clientY)
    const onUp = () => {
      handleEnd()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [handleStart, handleMove, handleEnd])

  // Touch events
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)

    const onMove = (ev: TouchEvent) => {
      const t = ev.touches[0]
      handleMove(t.clientX, t.clientY)
    }
    const onEnd = () => {
      handleEnd()
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }

    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd)
    window.addEventListener('touchcancel', onEnd)
  }, [handleStart, handleMove, handleEnd])

  return [
    { onMouseDown, onTouchStart },
    state,
  ]
}
