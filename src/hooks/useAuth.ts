import { useState, useEffect } from 'react'
import { authClient } from '../features/auth/authClient'
import { API_BASE_URL, ApiError } from '../lib/apiClient'
import { sessionStore, isExpired, type AuthSession, type AuthUser } from '../features/auth/sessionStore'
import { clearRecoveryParamsFromUrl, readRecoveryAccessToken } from '../features/auth/recoveryUrl'

export interface AuthState {
  session: AuthSession | null
  user: AuthUser | null
  loading: boolean
}

type AuthResult<T> = { data: T | null; error: Error | null }

/**
 * Xatolikni saqlaydi; ApiError bo'lsa code (EMAIL_NOT_CONFIRMED va h.k.)
 * UI'da maxsus ishlov berish uchun o'zgarishsiz uzatiladi.
 */
function toError(error: unknown): Error {
  if (error instanceof ApiError) return error
  return error instanceof Error ? error : new Error('Noma\'lum xatolik yuz berdi')
}

export function useAuth(): AuthState & {
  signUp: (email: string, password: string, name: string) => Promise<AuthResult<{ user_id: string }>>
  signIn: (email: string, password: string) => Promise<AuthResult<null>>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResult<null>>
  updatePassword: (password: string, recoveryToken?: string | null) => Promise<AuthResult<null>>
  resendConfirmation: (email: string) => Promise<AuthResult<null>>
  updateProfile: (fullName: string) => Promise<AuthResult<null>>
  displayName: string | null
} {
  const [session, setSession] = useState<AuthSession | null>(() => sessionStore.get())
  const [user, setUser] = useState<AuthUser | null>(() => sessionStore.get()?.user ?? null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const refreshIfNeeded = async () => {
      const current = sessionStore.get()
      if (current && isExpired(current) && current.refresh_token) {
        try {
          const data = await authClient.refresh(current.refresh_token)
          // Do not resurrect an old session after logout or password recovery.
          if (mounted && sessionStore.get()?.refresh_token === current.refresh_token) {
            sessionStore.set(data)
          }
        } catch (error) {
          // Tarmoq uzilishi (NETWORK_ERROR) sessionni saqlaydi; faqat
          // refresh token rad etilgan bo'lsa tozalaymiz. Ikki tab bir
          // vaqtda refresh qilsa, eski token bilan muvaffaqiyatsizlik
          // yangi session'ni buzmasligi uchun oxirgi token bilan tekshiramiz.
          const latest = sessionStore.get()
          if (
            mounted &&
            error instanceof ApiError &&
            [400, 401, 403].includes(error.statusCode) &&
            latest?.refresh_token === current.refresh_token
          ) {
            sessionStore.clear()
          }
        }
      }
      if (mounted) setLoading(false)
    }

    refreshIfNeeded()

    const unsubscribe = sessionStore.subscribe((next) => {
      setSession(next)
      setUser(next?.user ?? null)
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  async function signUp(email: string, password: string, name: string): Promise<AuthResult<{ user_id: string }>> {
    try {
      const data = await authClient.register(email, password, name)
      return { data, error: null }
    } catch (error) {
      return { data: null, error: toError(error) }
    }
  }

  async function signIn(email: string, password: string): Promise<AuthResult<null>> {
    try {
      const data = await authClient.login(email, password)
      sessionStore.set(data)
      return { data: null, error: null }
    } catch (error) {
      return { data: null, error: toError(error) }
    }
  }

  async function signOut(): Promise<void> {
    try {
      await authClient.logout()
    } catch {
      // Tarmoq xatosi bo'lsa ham lokal session tozalanadi
    }
    sessionStore.clear()
  }

  async function resetPassword(email: string): Promise<AuthResult<null>> {
    try {
      await authClient.resetPassword(email)
      return { data: null, error: null }
    } catch (error) {
      return { data: null, error: toError(error) }
    }
  }

  async function updatePassword(
    password: string,
    recoveryToken?: string | null,
  ): Promise<AuthResult<null>> {
    try {
      // ResetPassword recovery tokenni birinchi renderda snapshot qiladi.
      // Optional fallback eski caller/testlar uchun URL'dan tokenni o'qiydi.
      const effectiveRecoveryToken =
        recoveryToken === undefined ? readRecoveryAccessToken() : recoveryToken
      const current = sessionStore.get()
      const token = effectiveRecoveryToken ?? current?.access_token ?? null

      if (!token) {
        return { data: null, error: new Error('Yaroqli session topilmadi. Qayta kirish kerak.') }
      }

      if (effectiveRecoveryToken) {
        await apiPostWithToken(
          '/api/auth/update-password',
          { password },
          effectiveRecoveryToken,
        )
      } else {
        await authClient.updatePassword(password)
      }

      if (effectiveRecoveryToken) {
        // Recovery oddiy login emas: avvalgi account sessionini tiklamaymiz.
        // URL tozalansa ham ResetPassword snapshot tokeni renderlar orasida saqlanadi.
        sessionStore.clear()
        clearRecoveryParamsFromUrl()
      }

      return { data: null, error: null }
    } catch (error) {
      return { data: null, error: toError(error) }
    }
  }

  async function resendConfirmation(email: string): Promise<AuthResult<null>> {
    try {
      await authClient.resendConfirmation(email)
      return { data: null, error: null }
    } catch (error) {
      return { data: null, error: toError(error) }
    }
  }

  async function updateProfile(fullName: string): Promise<AuthResult<null>> {
    try {
      const updated = await authClient.updateProfile(fullName)
      sessionStore.updateUser(updated)
      return { data: null, error: null }
    } catch (error) {
      return { data: null, error: toError(error) }
    }
  }

  const displayName = user?.display_name ?? null

  return {
    session,
    user,
    loading,
    displayName,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
    updateProfile,
  }
}

/**
 * Recovery token bilan to'g'ridan-to'g'ri so'rov yuboradi (authClient'dan
 * tashqari, chunki session'ga yozmasdan token alohida ishlatiladi).
 */
async function apiPostWithToken<T>(path: string, body: unknown, token: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  if (!response.ok) {
    const errorData = data as { error?: { code?: string; message?: string } }
    throw new Error(errorData.error?.message || 'Server xatosi')
  }
  return data as T
}
