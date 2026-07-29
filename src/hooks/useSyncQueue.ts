import { useState, useEffect, useCallback } from 'react'
import { getQueueLength } from '../lib/syncQueue'

/**
 * useSyncQueue — Sync queue holatini monitoring qiladi.
 * Offline vaqtda pending elementlar sonini ko'rsatadi.
 * Internet qaytganda avtomatik sync bo'ladi.
 */
export function useSyncQueue() {
  const [pending, setPending] = useState(0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const refresh = useCallback(async () => {
    try {
      const len = await getQueueLength()
      setPending(len)
    } catch {
      setPending(0)
    }
  }, [])

  useEffect(() => {
    // Check on mount
    refresh()

    // Poll every 5 seconds
    const interval = setInterval(refresh, 5000)

    const handleOnline = () => {
      setIsOnline(true)
      // Refresh after sync processes
      setTimeout(refresh, 2000)
    }
    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [refresh])

  return { pending, isOnline, refresh }
}
