import type { StateCreator } from 'zustand'
import { getTodayTashkent } from '../utils/tashkentDate'
import { monitoring } from '../lib/monitoring'
import { db } from '../lib/db'
import type { Level } from './types'
import type { AppState } from './appState'
import type { Database } from '../types/supabase'

function addDays(date: string, days: number): string {
  const d = new Date(date + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().split('T')[0]
}

async function supabaseUpdate(table: string, values: Record<string, unknown>, matchField: string): Promise<void> {
  try {
    const { supabase } = await import('../lib/supabase')
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user.id) {
      const { error } = await supabase.from(table as keyof Database['public']['Tables']).update(db.cast<never>(values)).eq(matchField as string, session.user.id)
      if (error) monitoring.captureMessage(`supabaseUpdate ${table} error: ${error.message}`, 'error')
    }
  } catch (e) {
    monitoring.captureMessage(`supabaseUpdate ${table} failed: ${e instanceof Error ? e.message : String(e)}`, 'warn')
  }
}

export interface AuthSlice {
  userName: string
  userEmail: string
  onboardingComplete: boolean
  _hydrated: boolean
  startDate: string
  targetDate: string
  currentWeek: number
  currentDay: number
  currentLevel: Level
  avatarId: string
  prevUserId: string | null

  setUserName: (name: string) => void
  setUserEmail: (email: string) => void
  completeOnboarding: (name: string, level?: Level, startDay?: number) => void
  advanceDay: () => void
  setLevel: (level: Level) => void
  setAvatarId: (id: string) => void
}

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set, get) => {
  const today = getTodayTashkent()

  return {
    userName: '',
    userEmail: '',
    onboardingComplete: false,
    _hydrated: false,
    startDate: today,
    targetDate: addDays(today, 90),
    currentWeek: 1,
    currentDay: 1,
    currentLevel: 'A2+',
    avatarId: 'scholar',
    prevUserId: null,

    setUserName: (name) => {
      set({ userName: name })
      supabaseUpdate('users', { name }, 'id')
    },
    setUserEmail: (email) => set({ userEmail: email }),

    completeOnboarding: (name, level, startDay) => {
      const today = getTodayTashkent()
      const target = addDays(today, 90)
      const day = startDay ?? 1
      const week = Math.ceil(day / 7)
      const lvl = level ?? 'A2+'
      set({
        userName: name,
        currentLevel: lvl,
        currentDay: day,
        currentWeek: week,
        onboardingComplete: true,
        startDate: today,
        targetDate: target,
      })
      // Sync to Supabase so it persists across devices
      ;(async () => {
        try {
          const { supabase } = await import('../lib/supabase')
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user.id) {
              const { error } = await supabase.from('users').upsert({
                id: session.user.id,
                name,
                email: session.user.email ?? '',
                level: lvl,
                start_date: today,
                target_date: target,
                current_day: day,
                current_week: week,
              } as any, { onConflict: 'id' }) // eslint-disable-line @typescript-eslint/no-explicit-any
            if (error) monitoring.captureMessage('onboarding sync error: ' + error.message, 'error')
          }
        } catch (e) {
          monitoring.captureMessage('onboarding sync failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
        }
      })()
    },

    advanceDay: () => {
      const s = get()
      const day = s.currentDay + 1
      const week = Math.ceil(day / 7)
      set({ currentDay: day, currentWeek: week })
      s.resetDailyProgress?.()
      supabaseUpdate('users', { current_day: day, current_week: week }, 'id')
    },

    setLevel: (level) => {
      const prev = get().currentLevel
      if (prev && prev !== level) {
        set({ currentLevel: level, levelUpPending: { from: prev, to: level } })
      } else {
        set({ currentLevel: level })
      }
      supabaseUpdate('users', { level }, 'id')
    },

    setAvatarId: (avatarId) => {
      set({ avatarId })
      supabaseUpdate('users', { avatar_id: avatarId }, 'id')
    },
  }
}
