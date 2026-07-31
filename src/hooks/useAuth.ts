import { useState, useEffect } from 'react'
import { authClient } from '../features/auth/authClient'
import { ApiError, isNetworkError } from '../lib/apiClient'
import { sessionStore, isExpired, type AuthSession, type AuthUser } from '../features/auth/sessionStore'

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

/**
 * URL hash'dan Supabase recovery tokenini oladi:
 * /reset-password#access_token=...&refresh_token=...&type=recovery
 */
function getRecoveryTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.hash.slice(1))
  return params.get('access_token')
}

export function useAuth(): AuthState & {
  signUp: (email: string, password: string, name: string) => Promise<AuthResult<{ user_id: string }>>
  signIn: (email: string, password: string) => Promise<AuthResult<null>>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResult<null>>
  updatePassword: (password: string) => Promise<AuthResult<null>>
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
          if (mounted) sessionStore.set(data)
        } catch (error) {
          // Tarmoq uzilishi (NETWORK_ERROR) sessionni saqlaydi; faqat
          // refresh token rad etilgan bo'lsa tozalaymiz. Ikki tab bir
          // vaqtda refresh qilsa, eski token bilan muvaffaqiyatsizlik
          // yangi session'ni buzmasligi uchun oxirgi token bilan tekshiramiz.
          const latest = sessionStore.get()
          if (
            mounted &&
            !isNetworkError(error) &&
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

  async function updatePassword(password: string): Promise<AuthResult<null>> {
    try {
      const recoveryToken = getRecoveryTokenFromUrl()
      const current = sessionStore.get()
      const token = recoveryToken ?? current?.access_token ?? null

      if (!token) {
        return { data: null, error: new Error('Yaroqli session topilmadi. Qayta kirish kerak.') }
      }

      // Recovery link holatida hash'ni tozalaymiz va session'ni saqlamaymiz
      if (recoveryToken) {
        await apiPostWithToken('/api/auth/update-password', { password }, recoveryToken)
      } else {
        await authClient.updatePassword(password)
      }

      if (recoveryToken && typeof window !== 'undefined') {
        window.location.hash = ''
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
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}${path}`, {
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
