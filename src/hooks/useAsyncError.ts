import { useState, useCallback } from 'react'

/**
 * useAsyncError — async operatsiyalardagi error'larni eng yaqin
 * ErrorBoundary ga yuborish uchun hook.
 *
 * ```tsx
 * const throwError = useAsyncError()
 *
 * useEffect(() => {
 *   fetchData().catch(throwError)
 * }, [])
 * ```
 */
export function useAsyncError() {
  const [, setError] = useState<Error | null>(null)

  const throwError = useCallback((error: unknown) => {
    setError(() => {
      throw error instanceof Error ? error : new Error(String(error))
    })
  }, [])

  return throwError
}
