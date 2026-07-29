import { monitoring } from '../lib/monitoring'
import { useState, useEffect, useCallback, useRef } from 'react'

export interface UseExamTimerOptions {
  /** Total duration in seconds. */
  duration: number
  /** Unique key for localStorage persistence. */
  storageKey: string
  /** Callback fired once when timer reaches 0. */
  onTimeUp?: () => void
  /** Auto-start timer on mount. Default: true. */
  autoStart?: boolean
}

export interface UseExamTimerReturn {
  /** Seconds remaining. */
  timeLeft: number
  /** Whether the timer is currently running. */
  isRunning: boolean
  /** True when time has run out. */
  isTimeUp: boolean
  /** Start the timer. */
  start: () => void
  /** Pause the timer. */
  pause: () => void
  /** Resume the timer after a pause. */
  resume: () => void
  /** Reset to the original duration and stop. */
  reset: () => void
  /** Toggle between running and paused. */
  toggle: () => void
}

interface PersistedState {
  startTime: number
  pausedAt: number | null
  pausedTotal: number
}

/**
 * Generic countdown timer with localStorage persistence and auto-submit.
 *
 * - Refresh-safe: the remaining time is calculated from `startTime` and total
 *   paused duration stored in localStorage.
 * - Calls `onTimeUp` exactly once when the timer reaches 0.
 * - Auto-cleans localStorage when reset or after time-up.
 */
export function useExamTimer({
  duration,
  storageKey,
  onTimeUp,
  autoStart = true,
}: UseExamTimerOptions): UseExamTimerReturn {
  const STORAGE_KEY = `exam_timer:${storageKey}`

  const loadPersisted = useCallback((): { remaining: number; isPaused: boolean } | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const state: PersistedState = JSON.parse(raw)
      const elapsedMs = Date.now() - state.startTime - state.pausedTotal
      const remaining = Math.max(0, duration - Math.floor(elapsedMs / 1000))
      return { remaining, isPaused: state.pausedAt !== null }
    } catch (e) {
      monitoring.captureMessage('loadPersisted (exam timer) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      return null
    }
  }, [STORAGE_KEY, duration])

  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(duration)
  const onTimeUpRef = useRef(onTimeUp)
  onTimeUpRef.current = onTimeUp

  // Initialize from localStorage on mount
  useEffect(() => {
    const persisted = loadPersisted()
    if (persisted) {
      setTimeLeft(persisted.remaining)
      setIsRunning(autoStart && !persisted.isPaused && persisted.remaining > 0)
    } else if (autoStart) {
      // Fresh start
      const startTime = Date.now()
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ startTime, pausedAt: null, pausedTotal: 0 } satisfies PersistedState)
        )
      } catch (e) {
        monitoring.captureMessage('exam timer localStorage init failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
        /* localStorage unavailable */
      }
      setTimeLeft(duration)
      setIsRunning(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist + tick
  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1
        if (next <= 0) {
          setIsRunning(false)
          try {
            localStorage.removeItem(STORAGE_KEY)
          } catch (e) {
            monitoring.captureMessage('exam timer removeItem failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
            /* ignore */
          }
          // Schedule callback outside of setState
          queueMicrotask(() => onTimeUpRef.current?.())
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, STORAGE_KEY])

  const start = useCallback(() => {
    const startTime = Date.now()
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ startTime, pausedAt: null, pausedTotal: 0 } satisfies PersistedState)
      )
    } catch (e) {
      monitoring.captureMessage('exam timer start failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      /* ignore */
    }
    setTimeLeft(duration)
    setIsRunning(true)
  }, [STORAGE_KEY, duration])

  const pause = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const state: PersistedState = JSON.parse(raw)
        state.pausedAt = Date.now()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      }
    } catch (e) {
      monitoring.captureMessage('exam timer pause failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      /* ignore */
    }
    setIsRunning(false)
  }, [STORAGE_KEY])

  const resume = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const state: PersistedState = JSON.parse(raw)
        if (state.pausedAt) {
          state.pausedTotal += Date.now() - state.pausedAt
          state.pausedAt = null
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        }
      }
    } catch (e) {
      monitoring.captureMessage('exam timer resume failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      /* ignore */
    }
    setIsRunning(true)
  }, [STORAGE_KEY])

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      monitoring.captureMessage('exam timer reset failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      /* ignore */
    }
    setTimeLeft(duration)
    setIsRunning(false)
  }, [STORAGE_KEY, duration])

  const toggle = useCallback(() => {
    if (isRunning) {
      pause()
    } else {
      resume()
    }
  }, [isRunning, pause, resume])

  return {
    timeLeft,
    isRunning,
    isTimeUp: timeLeft <= 0,
    start,
    pause,
    resume,
    reset,
    toggle,
  }
}
