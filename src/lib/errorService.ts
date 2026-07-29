import { monitoring } from './monitoring'
import { AppError, ERROR_CODES } from './errors'

export type RetryOptions = {
  /** Max retry attempts (default: 3) */
  maxAttempts?: number
  /** Delay between retries in ms (default: 1000) */
  delay?: number
  /** Backoff multiplier (default: 2) */
  backoff?: number
  /** Callback when each retry fails */
  onRetry?: (attempt: number, error: Error) => void
}

/** Default retry options */
const DEFAULT_RETRY: Required<RetryOptions> = {
  maxAttempts: 3,
  delay: 1000,
  backoff: 2,
  onRetry: () => {},
}

/**
 * Check if an error is a network-related error (fetch failure, timeout, etc.)
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message === 'Failed to fetch') return true
  if (error instanceof AppError && error.code === ERROR_CODES.NETWORK_ERROR) return true
  if (error instanceof Error && /network|fetch|timeout|abort/i.test(error.message)) return true
  return false
}

/**
 * Normalize any thrown value into an Error with a user-friendly message.
 * Falls back to error codes from errors.ts when possible.
 */
export function normalizeError(error: unknown): { error: Error; userMessage: string } {
  if (error instanceof AppError) {
    return { error, userMessage: error.userMessage }
  }
  if (error instanceof Error) {
    return { error, userMessage: error.message || 'Kutilmagan xatolik yuz berdi.' }
  }
  return {
    error: new Error(String(error)),
    userMessage: 'Kutilmagan xatolik yuz berdi.',
  }
}

/**
 * Capture an error to monitoring with consistent context.
 * Returns the original Error for rethrowing.
 */
export function captureError(error: unknown, context?: Record<string, unknown>): Error {
  const { error: normalized } = normalizeError(error)
  monitoring.captureException(normalized, { ...context, capturedBy: 'errorService' })
  return normalized
}

/**
 * Wrap an async function with automatic error capture + optional retry.
 *
 * ```ts
 * const data = await withErrorHandling(
 *   () => fetchLessons(),
 *   { context: { component: 'LessonList' }, retry: { maxAttempts: 2 } }
 * )
 * ```
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    context?: Record<string, unknown>
    retry?: RetryOptions
    /** If true, re-throws the error after capturing (for callers that want to show UI) */
    rethrow?: boolean
  }
): Promise<T> {
  const { context, retry: retryOpts, rethrow } = options ?? {}

  if (!retryOpts) {
    try {
      return await fn()
    } catch (err) {
      const normalized = captureError(err, context)
      if (rethrow) throw err
      throw normalized
    }
  }

  // With retry logic
  const opts = { ...DEFAULT_RETRY, ...retryOpts }
  let lastError: Error = new Error('Unknown error')

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = captureError(err, { ...context, attempt, maxAttempts: opts.maxAttempts })

      // Don't retry network errors — they won't recover immediately
      if (isNetworkError(err)) {
        if (rethrow) throw lastError
        throw lastError
      }

      if (attempt < opts.maxAttempts) {
        opts.onRetry(attempt, lastError)
        await new Promise((resolve) => setTimeout(resolve, opts.delay * Math.pow(opts.backoff, attempt - 1)))
      }
    }
  }

  if (rethrow) throw lastError
  throw lastError
}

/**
 * Wrap a fallible value getter in try/catch and return null on error.
 * Useful for non-critical feature initialization.
 *
 * ```ts
 * const analytics = tryOrDefault(() => initAnalytics(), null)
 * ```
 */
export function tryOrDefault<T>(fn: () => T, fallback: T): T {
  try {
    return fn()
  } catch {
    return fallback
  }
}

/**
 * Mark a function as deprecated — logs a warning if called in dev.
 */
export function deprecated(message: string) {
  return <T, Args extends unknown[]>(fn: (...args: Args) => T): (...args: Args) => T => {
    return (...args: Args) => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn(`[DEPRECATED] ${message}`)
      }
      return fn(...args)
    }
  }
}
