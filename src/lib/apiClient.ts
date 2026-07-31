/**
 * API Client — backend Fastify serveriga HTTP so'rovlar yuborish
 *
 * Barcha so'rovlar avtomatik ravishda:
 * - Authorization header (sessionStore'dagi token) qo'shiladi
 * - 401 bo'lsa refresh token bilan yangi session olinadi va qayta uriniladi
 * - Xatoliklar qayta ishlanadi
 *
 * Session localStorage'da sessionStore orqali saqlanadi; browser
 * to'g'ridan-to'g'ri Supabase'ga ulanmaydi.
 */

import { sessionStore, emitSessionExpired } from '../features/auth/sessionStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code: string,
    readonly details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Backend tarmoq xatosi (NETWORK_ERROR) yoki transport darajasidagi
 * uzilishda ishlaydi.
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true
  if (error instanceof ApiError && error.code === 'NETWORK_ERROR') return true
  if (error instanceof Error && error.message.includes('Failed to fetch')) return true
  if (error instanceof Error && error.message.includes('NetworkError')) return true
  return false
}

const NO_REFRESH_PATHS = new Set([
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/register',
  '/api/auth/reset-password',
  '/api/auth/resend-confirmation',
])

let refreshPromise: Promise<{ outcome: RefreshOutcome; token: string | null }> | null = null

/**
 * Refresh natijasi:
 * - 'ok'      — yangi session olindi (access_token qaytadi)
 * - 'invalid' — refresh token rad etildi (session tozalanadi)
 * - 'network' — tarmoq xatosi (session SAQLANADI — foydalanuvchi
 *               vaqtincha uzilishda tizimdan chiqarib tashlanmaydi)
 */
type RefreshOutcome = 'ok' | 'invalid' | 'network'

async function tryRefreshSession(): Promise<{ outcome: RefreshOutcome; token: string | null }> {
  const session = sessionStore.get()
  if (!session?.refresh_token) {
    return { outcome: 'invalid', token: null }
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    })

    if (!response.ok) {
      sessionStore.clear()
      return { outcome: 'invalid', token: null }
    }

    const data = await response.json()
    sessionStore.set(data)
    return { outcome: 'ok', token: data.access_token as string }
  } catch {
    return { outcome: 'network', token: null }
  }
}

/**
 * Mutex bilan ishlaydigan refresh: bir vaqtning o'zida bitta refresh
 * chaqiruvi davom etadi; qolganlar o'sha natijani kutadi.
 */
function refreshSession(): Promise<{ outcome: RefreshOutcome; token: string | null }> {
  if (!refreshPromise) {
    refreshPromise = tryRefreshSession().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

async function doRequest(
  method: string,
  path: string,
  body?: unknown,
  token?: string
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const session = sessionStore.get()
  const initialToken = session?.access_token ?? undefined
  const canRefresh = initialToken !== undefined && !NO_REFRESH_PATHS.has(path)

  let response: Response
  try {
    response = await doRequest(method, path, body, initialToken)
  } catch (err) {
    throw new ApiError(
      'Server bilan aloqa yo\'q. Backend ishlayotganini tekshiring.',
      0,
      'NETWORK_ERROR',
      err instanceof TypeError ? err.message : undefined
    )
  }

  // 401 bo'lsa refresh qilib qayta urinamiz (faqat bir marta)
  if (response.status === 401 && canRefresh) {
    const result = await refreshSession()
    if (result.outcome === 'ok' && result.token) {
      try {
        response = await doRequest(method, path, body, result.token)
      } catch (err) {
        throw new ApiError(
          'Server bilan aloqa yo\'q. Backend ishlayotganini tekshiring.',
          0,
          'NETWORK_ERROR',
          err instanceof TypeError ? err.message : undefined
        )
      }
    } else if (result.outcome === 'invalid') {
      emitSessionExpired()
      throw new ApiError(
        'Session muddati tugagan. Qayta kirishingizni so\'raymiz.',
        401,
        'SESSION_EXPIRED'
      )
    } else {
      // Tarmoq uzilishi: session saqlanadi, foydalanuvchi chiqarib tashlanmaydi
      throw new ApiError(
        'Server bilan aloqa yo\'q. Backend ishlayotganini tekshiring.',
        0,
        'NETWORK_ERROR'
      )
    }
  }

  // Empty response (204 No Content)
  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json()

  if (!response.ok) {
    const errorData = data as { error?: { code?: string; message?: string; details?: unknown } }
    throw new ApiError(
      errorData.error?.message || 'Server xatosi',
      response.status,
      errorData.error?.code || 'UNKNOWN_ERROR',
      errorData.error?.details
    )
  }

  return data as T
}

// ─── Convenience methods ──────────────────────────────────────────
export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
