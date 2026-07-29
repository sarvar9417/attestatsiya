import { useState, useEffect } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface AuthState {
  session: Session | null
  user:    User    | null
  loading: boolean
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user,    setUser]    = useState<User    | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    if (!error && data.user) {
      // Upsert into public.users so the trigger or RLS-protected insert lands
      await supabase.from('users').upsert(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { id: data.user.id, email, name } as any,
        { onConflict: 'id' }
      )
    }
    return { error }
  }

  async function resendConfirmation(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    return { error }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    // Boshqa foydalanuvchi shu brauzerda kirsa, eski profil/progress/hearts/league
    // ko'rinmasligi uchun BARCHA local ma'lumotni tozalaymiz (to'liq izolyatsiya).
    try {
      localStorage.clear()  // profil, progress, hearts, league XP, SRS, AI kesh — hammasi
      // IndexedDB'dagi BARCHA user ma'lumotini tozalaymiz (vocabulary, sessions,
      // dailyProgress, writings, mockTests, lessonProgress, catalog, stats)
      const { clearLocalUserData } = await import('../db/database')
      await clearLocalUserData()
    } catch { /* ignore */ }
    // To'liq toza holatda qayta yuklash
    window.location.href = '/'
  }

  const displayName =
    user?.user_metadata?.name as string | undefined

  return { session, user, loading, displayName, signUp, signIn, resetPassword, updatePassword, signOut, resendConfirmation }
}
