import { monitoring } from '../lib/monitoring'
import { useState, useEffect, useCallback } from 'react'

export interface PwaInstallState {
  /** Whether the app can be installed (beforeinstallprompt fired) */
  canInstall: boolean
  /** Whether the app has been installed */
  isInstalled: boolean
  /** Trigger the install prompt */
  promptInstall: () => Promise<boolean>
  /** Dismiss/decline the install prompt (will reappear after 24 hours) */
  dismiss: () => void
}

// Key for storing dismissal timestamp in localStorage
const DISMISSAL_KEY = 'pwa-install-dismissed-at'
// Hours before the prompt can show again after dismissal
const REENABLE_AFTER_HOURS = 24

export function usePwaInstall(): PwaInstallState {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  // Check if dismissed and if enough time has passed to re-enable
  const isDismissed = useCallback(() => {
    const dismissedAt = localStorage.getItem(DISMISSAL_KEY)
    if (!dismissedAt) return false
    const dismissedTime = Number(dismissedAt)
    const now = Date.now()
    const hoursPassed = (now - dismissedTime) / (1000 * 60 * 60)
    return hoursPassed < REENABLE_AFTER_HOURS
  }, [])

  useEffect(() => {
    // Check if already installed (display-mode: standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
      // Clear dismissal timestamp on successful install
      localStorage.removeItem(DISMISSAL_KEY)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false
    const promptEvent = deferredPrompt as Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

    try {
      await promptEvent.prompt()
      const choice = await promptEvent.userChoice
      setDeferredPrompt(null)
      setCanInstall(false)
      return choice.outcome === 'accepted'
    } catch (e) {
      monitoring.captureMessage('pwa promptInstall failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      setDeferredPrompt(null)
      return false
    }
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    // Store dismissal timestamp - prompt will reappear after 24 hours
    localStorage.setItem(DISMISSAL_KEY, String(Date.now()))
    setCanInstall(false)
  }, [])

  return {
    canInstall: canInstall && !isDismissed(),
    isInstalled,
    promptInstall,
    dismiss,
  }
}
