import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authClient } from '../features/auth/authClient'

function okJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const fetchMock = vi.fn()

const sessionPayload = {
  access_token: 'access-1',
  refresh_token: 'refresh-1',
  expires_at: 1750000000000,
  user: { id: 'user-1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
}

describe('authClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', fetchMock)
  })

  it('register: to\'g\'ri endpoint va payload yuboriladi', async () => {
    fetchMock.mockResolvedValue(
      okJson({ user_id: 'user-1', email: 'test@test.com', requires_confirmation: true }, 201)
    )

    const result = await authClient.register('test@test.com', 'secret123', 'Ali Valiyev')

    expect(result.requires_confirmation).toBe(true)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/auth/register')
    expect(JSON.parse(init.body as string)).toEqual({
      email: 'test@test.com',
      password: 'secret123',
      full_name: 'Ali Valiyev',
    })
  })

  it('login: session qaytaradi', async () => {
    fetchMock.mockResolvedValue(okJson(sessionPayload))

    const result = await authClient.login('test@test.com', 'secret123')

    expect(result.access_token).toBe('access-1')
    expect(result.user.role).toBe('user')
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/auth/login')
  })

  it('refresh: refresh_token payload bilan yuboriladi', async () => {
    fetchMock.mockResolvedValue(okJson(sessionPayload))

    await authClient.refresh('refresh-1')

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/auth/refresh')
    expect(JSON.parse(init.body as string)).toEqual({ refresh_token: 'refresh-1' })
  })

  it('logout: POST /api/auth/logout chaqiriladi', async () => {
    fetchMock.mockResolvedValue(okJson({ success: true }))

    const result = await authClient.logout()

    expect(result.success).toBe(true)
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/auth/logout')
  })

  it('me: foydalanuvchi ma\'lumotini qaytaradi', async () => {
    fetchMock.mockResolvedValue(okJson(sessionPayload.user))

    const result = await authClient.me()

    expect(result.display_name).toBe('Ali')
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/auth/me')
  })

  it('updateProfile: full_name bilan PATCH yuboriladi', async () => {
    fetchMock.mockResolvedValue(okJson({ ...sessionPayload.user, display_name: 'Bobur' }))

    const result = await authClient.updateProfile('Bobur Aliyev')

    expect(result.display_name).toBe('Bobur')
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/auth/profile')
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(init.body as string)).toEqual({ full_name: 'Bobur Aliyev' })
  })

  it('resetPassword: email bilan POST yuboriladi', async () => {
    fetchMock.mockResolvedValue(okJson({ sent: true }))

    const result = await authClient.resetPassword('test@test.com')

    expect(result.sent).toBe(true)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/auth/reset-password')
    expect(JSON.parse(init.body as string)).toEqual({ email: 'test@test.com' })
  })

  it('updatePassword: parol bilan POST yuboriladi', async () => {
    fetchMock.mockResolvedValue(okJson({ updated: true }))

    const result = await authClient.updatePassword('newsecret123')

    expect(result.updated).toBe(true)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/auth/update-password')
    expect(JSON.parse(init.body as string)).toEqual({ password: 'newsecret123' })
  })

  it('resendConfirmation: email bilan POST yuboriladi', async () => {
    fetchMock.mockResolvedValue(okJson({ sent: true }))

    const result = await authClient.resendConfirmation('test@test.com')

    expect(result.sent).toBe(true)
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/auth/resend-confirmation')
  })

  it('server xatoligida ApiError qaytaradi', async () => {
    fetchMock.mockResolvedValue(
      okJson({ error: { code: 'EMAIL_TAKEN', message: 'Bu email allaqachon ro\'yxatdan o\'tgan' } }, 409)
    )

    await expect(
      authClient.register('dup@test.com', 'secret123', 'Ali')
    ).rejects.toMatchObject({ code: 'EMAIL_TAKEN', statusCode: 409 })
  })
})
