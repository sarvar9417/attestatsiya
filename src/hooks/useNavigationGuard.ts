import { useEffect, useRef } from 'react'

export function useNavigationGuard(
  shouldBlock: boolean,
  message = 'Sahifani tark etishni xohlaysizmi? Kiritilgan ma\'lumotlar yo\'qolishi mumkin.'
) {
  const guardActive = useRef(false)

  // ── beforeunload (tab close / refresh) ──────────────────────────────
  useEffect(() => {
    if (!shouldBlock) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [shouldBlock])

  // ── popstate (browser back / forward) ───────────────────────────────
  useEffect(() => {
    if (!shouldBlock) return

    const handler = () => {
      const leave = confirm(message)
      if (!leave) {
        window.history.pushState(null, '', window.location.href)
      }
    }

    if (!guardActive.current) {
      window.history.pushState(null, '', window.location.href)
      guardActive.current = true
    }
    window.addEventListener('popstate', handler)

    return () => {
      window.removeEventListener('popstate', handler)
    }
  }, [shouldBlock, message])
}
