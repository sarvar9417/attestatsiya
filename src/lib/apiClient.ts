/**
 * API Client — backend Fastify serveriga HTTP so'rovlar yuborish
 *
 * Barcha so'rovlar avtomatik ravishda:
 * - Authorization header (Supabase token) qo'shiladi
 * - JSON formatiga o'tkaziladi
 * - Xatoliklar qayta ishlanadi
 */

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

let authToken: string | null = null

/**
 * Auth tokenni o'rnatish. Supabase auth state listener orqali chaqiriladi.
 */
export function setApiAuthToken(token: string | null) {
  authToken = token
}

/**
 * Asosiy so'rov yuborish funksiyasi
 */
async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new ApiError(
      'Server bilan aloqa yo\'q. Backend ishlayotganini tekshiring.',
      0,
      'NETWORK_ERROR',
      err instanceof TypeError ? err.message : undefined
    )
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
  delete: <T>(path: string) => request<T>('DELETE', path),
}
