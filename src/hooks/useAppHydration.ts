import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import type { Level } from '../store/types'
import { getUserProfile } from '../lib/supabase'
import { loadUserState, loadTodayProgress, syncUserState } from '../services/stateSync'
import { monitoring } from '../lib/monitoring'
import type { Session } from '@supabase/supabase-js'

export function useAppHydration(session: Session | null) {
  const onboardingComplete = useStore((s) => s.onboardingComplete)
  const hydrated = useStore((s) => s._hydrated)
  const clearAllLessonProgress = useStore((s) => s.clearAllLessonProgress)
  const prevUserId = useStore((s) => s.prevUserId)

  // ── Clear lesson progress when user changes ──
  useEffect(() => {
    if (!session?.user?.id) return

    if (prevUserId && prevUserId !== session.user.id) {
      clearAllLessonProgress()
      import('../db/database').then(({ clearLocalUserData }) => clearLocalUserData()).catch((e: unknown) => {
        monitoring.captureMessage('clearLocalUserData on user switch failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      })
      try {
        for (const key of Object.keys(localStorage)) {
          if (key.includes('auth-token') || key === 'theme') continue
          localStorage.removeItem(key)
        }
      } catch (e) { monitoring.captureMessage('clearLocalUserData on user switch failed: ' + (e instanceof Error ? e.message : String(e)), 'warn') }
      useStore.setState({
        userName: '', userEmail: '',
        onboardingComplete: false, _hydrated: false, lessonsFetched: false,
        lessonProgress: {}, lessonSessions: {},
        currentLevel: 'A2+', currentDay: 1, currentWeek: 1, avatarId: 'scholar',
        streak: 0, totalXP: 0, totalWordsLearned: 0,
        todayMinutes: 0, todayXP: 0,
        todayGrammarPct: 0, todayVocabPct: 0, todayListeningPct: 0, todayReadingPct: 0,
        todaySpeakingPct: 0, todayWritingPct: 0, todayPhrasesPct: 0,
        prevUserId: session.user.id,
      })
    }
  }, [session?.user?.id, prevUserId, clearAllLessonProgress])

  // ── Hydrate store from Supabase ──
  useEffect(() => {
    if (!session || onboardingComplete || hydrated) return

    const hydrate = async () => {
      try {
        const profile = await getUserProfile(session.user.id)
        if (profile) {
          const patch: Record<string, unknown> = {
            userName: profile.name,
            userEmail: profile.email ?? '',
            onboardingComplete: true,
            currentLevel: profile.level as Level,
            currentDay: profile.current_day,
            currentWeek: profile.current_week,
            startDate: profile.start_date,
            targetDate: profile.target_date,
            totalXP: profile.total_xp,
            streak: profile.streak,
            lastActiveDate: profile.last_active ?? '',
            totalWordsLearned: profile.words_learned,
            _hydrated: true,
            prevUserId: session.user.id,
          }

          const savedState = await loadUserState()
          if (savedState) Object.assign(patch, savedState)

          const todayProgress = await loadTodayProgress()
          if (todayProgress) {
            const dp = todayProgress as Record<string, unknown>
            patch.todayMinutes = dp.total_minutes ?? 0
            patch.todayXP = dp.xp_earned ?? 0
            patch.todayGrammarPct = dp.grammar_pct ?? 0
            patch.todayVocabPct = dp.vocab_pct ?? 0
            patch.todayListeningPct = dp.listening_pct ?? 0
            patch.todayReadingPct = dp.reading_pct ?? 0
            patch.todaySpeakingPct = dp.speaking_pct ?? 0
            patch.todayWritingPct = dp.writing_pct ?? 0
            patch.todayPhrasesPct = dp.phrases_pct ?? 0
          }

          useStore.setState(patch)
        } else if (session.user.user_metadata?.name) {
          useStore.setState({
            userName: session.user.user_metadata.name as string,
            onboardingComplete: true,
            _hydrated: true,
            prevUserId: session.user.id,
          })
        }
      } catch (e) {
        monitoring.captureMessage('Failed to hydrate user state from Supabase: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      }
    }
    hydrate()
  }, [session, onboardingComplete, hydrated])

  // ── Sync store state to Supabase ──
  useEffect(() => {
    if (!session || !hydrated) return

    let timer: ReturnType<typeof setTimeout> | null = null
    const unsub = useStore.subscribe((state) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        const { lessons: _l, lessonsLoading: _ll, lessonsFetched: _lf, ...rest } = state
        syncUserState(rest as Record<string, unknown>)
      }, 3000)
    })
    return () => { unsub(); if (timer) clearTimeout(timer) }
  }, [session, hydrated])
}
