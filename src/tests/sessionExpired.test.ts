import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../lib/apiClient'
import { sessionStore, SESSION_EXPIRED_EVENT, type AuthSession } from '../features/auth/sessionStore'

function makeSession(): AuthSession {
  return {
    access_token: 'access-1',
    refresh_token: 'refresh-1',
    expires_at: Date.now() + 3600_000,
    user: { id: 'user-1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
  }
}

function errorResponse(message: string, code: string): Response {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('apiClient session expiry', () => {
  beforeEach(() => {
    sessionStore.clear()
    vi.restoreAllMocks()
  })

  it('refresh muvaffaqiyatsiz: session tozalanadi, SESSION_EXPIRED_EVENT yuboriladi', async () => {
    sessionStore.set(makeSession())
    const expiredHandler = vi.fn()
    window.addEventListener(SESSION_EXPIRED_EVENT, expiredHandler)

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(errorResponse('Token xato', 'INVALID_TOKEN'))
      .mockResolvedValueOnce(errorResponse('Refresh token xato', 'INVALID_TOKEN'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(api.get<unknown>('/api/content/modules')).rejects.toMatchObject({
      code: 'SESSION_EXPIRED',
    })
    expect(sessionStore.get()).toBeNull()
    expect(expiredHandler).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    window.removeEventListener(SESSION_EXPIRED_EVENT, expiredHandler)
    vi.unstubAllGlobals()
  })

  it('login endpointida refresh chaqirilmaydi va hodisa yuborilmaydi', async () => {
    const expiredHandler = vi.fn()
    window.addEventListener(SESSION_EXPIRED_EVENT, expiredHandler)

    const fetchMock = vi.fn().mockResolvedValue(errorResponse('Email yoki parol noto\'g\'ri', 'INVALID_CREDENTIALS'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      api.post<unknown>('/api/auth/login', { email: 'test@test.com', password: 'wrong' })
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' })
    expect(expiredHandler).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    window.removeEventListener(SESSION_EXPIRED_EVENT, expiredHandler)
    vi.unstubAllGlobals()
  })

  it('refresh tarmoq xatosida session saqlanadi, SESSION_EXPIRED yuborilmaydi', async () => {
    const session = makeSession()
    sessionStore.set(session)
    const expiredHandler = vi.fn()
    window.addEventListener(SESSION_EXPIRED_EVENT, expiredHandler)

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(errorResponse('Token xato', 'INVALID_TOKEN'))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(api.get<unknown>('/api/content/modules')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      statusCode: 0,
    })
    expect(sessionStore.get()).toEqual(session)
    expect(expiredHandler).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledTimes(2)

    window.removeEventListener(SESSION_EXPIRED_EVENT, expiredHandler)
    vi.unstubAllGlobals()
  })

  it('session bo\'lmasa 401 uchun refresh urinilmaydi', async () => {
    const expiredHandler = vi.fn()
    window.addEventListener(SESSION_EXPIRED_EVENT, expiredHandler)

    const fetchMock = vi.fn().mockResolvedValue(errorResponse('Avtorizatsiya talab qilinadi', 'UNAUTHORIZED'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(api.get<unknown>('/api/content/modules')).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(expiredHandler).not.toHaveBeenCalled()

    window.removeEventListener(SESSION_EXPIRED_EVENT, expiredHandler)
    vi.unstubAllGlobals()
  })
})
