import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../lib/apiClient'
import { sessionStore, type AuthSession } from '../features/auth/sessionStore'

const { authClientMock } = vi.hoisted(() => ({
  authClientMock: {
    register: vi.fn(),
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    updateProfile: vi.fn(),
    resetPassword: vi.fn(),
    updatePassword: vi.fn(),
    resendConfirmation: vi.fn(),
  },
}))

vi.mock('../features/auth/authClient', () => ({
  authClient: authClientMock,
}))

function makeSession(overrides: Partial<AuthSession> = {}): AuthSession {
  return {
    access_token: 'access-1',
    refresh_token: 'refresh-1',
    expires_at: Date.now() + 3600_000,
    user: { id: 'user-1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
    ...overrides,
  }
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStore.clear()
  })

  it('boshlang\'ich holat: session bo\'lmasa loading false va user null', async () => {
    const { result } = renderHook(() => useAuth())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()
    expect(authClientMock.refresh).not.toHaveBeenCalled()
  })

  it('login muvaffaqiyatli bo\'lsa session storega yoziladi', async () => {
    const session = makeSession()
    authClientMock.login.mockResolvedValue(session)

    const { result } = renderHook(() => useAuth())

    let error: unknown
    await act(async () => {
      const res = await result.current.signIn('test@test.com', 'secret123')
      error = res.error
    })

    expect(error).toBeNull()
    expect(sessionStore.get()?.access_token).toBe('access-1')
    expect(authClientMock.login).toHaveBeenCalledWith('test@test.com', 'secret123')
  })

  it('login xatosida error qaytariladi va session yozilmaydi', async () => {
    authClientMock.login.mockRejectedValue(new Error('Email yoki parol noto\'g\'ri'))

    const { result } = renderHook(() => useAuth())

    const res = await act(async () => result.current.signIn('test@test.com', 'wrong'))

    expect(res.error?.message).toBe('Email yoki parol noto\'g\'ri')
    expect(sessionStore.get()).toBeNull()
  })

  it('muddati o\'tgan session bo\'lsa mount\'da refresh chaqiriladi', async () => {
    sessionStore.set(makeSession({ expires_at: Date.now() - 1000 }))
    const fresh = makeSession()
    authClientMock.refresh.mockResolvedValue(fresh)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(authClientMock.refresh).toHaveBeenCalledWith('refresh-1')
    expect(sessionStore.get()?.access_token).toBe('access-1')
  })

  it('refresh xatosida session tozalanadi', async () => {
    sessionStore.set(makeSession({ expires_at: Date.now() - 1000 }))
    authClientMock.refresh.mockRejectedValue(new Error('Session tugagan'))

    const { result } = renderHook(() => useAuth())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(sessionStore.get()).toBeNull()
    expect(result.current.user).toBeNull()
  })

  it('refresh xatosida boshqa tab yangi session yozgan bo\'lsa tozalanmaydi', async () => {
    let rejectRefresh: (error: Error) => void = () => undefined
    authClientMock.refresh.mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          rejectRefresh = reject
        })
    )
    sessionStore.set(makeSession({ expires_at: Date.now() - 1000 }))

    const { result } = renderHook(() => useAuth())

    // Refresh davom etayotganda boshqa tab yangi session yozdi
    sessionStore.set(makeSession({ refresh_token: 'refresh-2', expires_at: Date.now() + 3600_000 }))

    await act(async () => {
      rejectRefresh(new Error('Token ishlatilgan'))
    })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(sessionStore.get()?.refresh_token).toBe('refresh-2')
  })

  it('signOut: logout chaqiriladi va session tozalanadi (navigatsiya chaqiruvchida)', async () => {
    sessionStore.set(makeSession())
    authClientMock.logout.mockResolvedValue({ success: true })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signOut()
    })

    expect(authClientMock.logout).toHaveBeenCalled()
    expect(sessionStore.get()).toBeNull()
  })

  it('signOut: logout xatosida ham session tozalanadi', async () => {
    sessionStore.set(makeSession())
    authClientMock.logout.mockRejectedValue(new Error('Aloqa yo\'q'))

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signOut()
    })

    expect(sessionStore.get()).toBeNull()
  })

  it('signIn: ApiError code saqlanadi (EMAIL_NOT_CONFIRMED)', async () => {
    authClientMock.login.mockRejectedValue(
      new ApiError('Email tasdiqlanmagan. Xatni tekshiring.', 401, 'EMAIL_NOT_CONFIRMED')
    )

    const { result } = renderHook(() => useAuth())

    const res = await act(async () => result.current.signIn('test@test.com', 'secret123'))

    expect(res.error?.message).toContain('tasdiqlanmagan')
    expect((res.error as ApiError).code).toBe('EMAIL_NOT_CONFIRMED')
    expect(sessionStore.get()).toBeNull()
  })

  it('updatePassword: recovery token URL hash dan olinadi va tozalanadi', async () => {
    window.location.hash = '#access_token=recovery-token&type=recovery'
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ updated: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useAuth())

    let error: Error | null = null
    await act(async () => {
      const res = await result.current.updatePassword('newsecret123')
      error = res.error
    })

    expect(error).toBeNull()
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/auth/update-password')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer recovery-token')
    expect(JSON.parse(init.body as string)).toEqual({ password: 'newsecret123' })
    expect(window.location.hash).toBe('')
    vi.unstubAllGlobals()
  })

  it('updatePassword: session bo\'lmasa xato qaytariladi', async () => {
    window.location.hash = ''

    const { result } = renderHook(() => useAuth())

    const res = await act(async () => result.current.updatePassword('newsecret123'))

    expect(res.error?.message).toContain('Qayta kirish')
  })

  it('updateProfile: backend javobi sessionStore\'ga yoziladi', async () => {
    sessionStore.set(makeSession())
    authClientMock.updateProfile.mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      display_name: 'Bobur Aliyev',
      role: 'user',
    })

    const { result } = renderHook(() => useAuth())

    let error: Error | null = null
    await act(async () => {
      const res = await result.current.updateProfile('Bobur Aliyev')
      error = res.error
    })

    expect(error).toBeNull()
    expect(authClientMock.updateProfile).toHaveBeenCalledWith('Bobur Aliyev')
    expect(sessionStore.get()?.user.display_name).toBe('Bobur Aliyev')
  })

  it('signUp: register xatosida error qaytariladi', async () => {
    authClientMock.register.mockRejectedValue(new Error('Bu email allaqachon ro\'yxatdan o\'tgan'))

    const { result } = renderHook(() => useAuth())

    const res = await act(async () => result.current.signUp('dup@test.com', 'secret123', 'Ali'))

    expect(res.error?.message).toBe('Bu email allaqachon ro\'yxatdan o\'tgan')
    expect(authClientMock.register).toHaveBeenCalledWith('dup@test.com', 'secret123', 'Ali')
  })

  it('resetPassword va resendConfirmation backend\'ga uzatiladi', async () => {
    authClientMock.resetPassword.mockResolvedValue({ sent: true })
    authClientMock.resendConfirmation.mockResolvedValue({ sent: true })

    const { result } = renderHook(() => useAuth())

    let error: Error | null = null
    await act(async () => {
      const res = await result.current.resetPassword('test@test.com')
      error = res.error
    })
    expect(error).toBeNull()
    expect(authClientMock.resetPassword).toHaveBeenCalledWith('test@test.com')

    await act(async () => {
      const res = await result.current.resendConfirmation('test@test.com')
      error = res.error
    })
    expect(error).toBeNull()
    expect(authClientMock.resendConfirmation).toHaveBeenCalledWith('test@test.com')
  })
})
