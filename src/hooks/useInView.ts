import { useRef, useState, useCallback } from 'react'

/**
 * Returns a callback ref and a boolean `isInView` — becomes true once the
 * element first scrolls into the viewport (within the given rootMargin).
 *
 * Once true it stays true, so the animation only triggers once.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '0px 0px -80px 0px',
): { ref: (el: T | null) => void; isInView: boolean } {
  const [isInView, setIsInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((el: T | null) => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (!el || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observerRef.current = observer
    observer.observe(el)
  }, [isInView, rootMargin])

  return { ref, isInView }
}
