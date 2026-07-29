import type { StateCreator } from 'zustand'
import { getTodayTashkent } from '../utils/tashkentDate'
import { monitoring } from '../lib/monitoring'
import { syncUserField } from '../lib/supabaseSync'
import { evaluateAchievements, syncAchievementsToDB } from '../services/achievementChecker'
import type { DailyChecklist, MockResult } from './types'
import type { AppState } from './appState'
import { ACHIEVEMENTS } from '../data/achievements'
import { MAX_HEARTS, regenerateHearts, isPracticeMode } from '../data/hearts'

// ═══════════════════════════════════════════════════════════════════════════
// Streak Bonus Milestones
// ═══════════════════════════════════════════════════════════════════════════

export interface StreakMilestone {
  days:  number
  xp:    number
  icon:  string
  label: string
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3,   xp: 10,   icon: '🔥',   label: 'Boshlang\'ich' },
  { days: 7,   xp: 25,   icon: '🔥🔥', label: "O'n yo'l" },
  { days: 14,  xp: 50,   icon: '💪',   label: 'Mustahkam' },
  { days: 21,  xp: 75,   icon: '⚡',   label: 'Elektr' },
  { days: 30,  xp: 100,  icon: '⭐',   label: '1 oy' },
  { days: 60,  xp: 200,  icon: '💎',   label: '2 oy' },
  { days: 90,  xp: 500,  icon: '👑',   label: "EnglishPath Graduate" },
]

/** Return unclaimed milestones that the current streak qualifies for */
export function getPendingStreakMilestones(streak: number, claimed: number[]): StreakMilestone[] {
  return STREAK_MILESTONES.filter(m => streak >= m.days && !claimed.includes(m.days))
}

/** Return the next unclaimed milestone (for progress display) */
export function getNextStreakMilestone(streak: number, claimed: number[]): StreakMilestone | null {
  return STREAK_MILESTONES.find(m => !claimed.includes(m.days) && m.days > streak) ?? null
}

// ═══════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════

const EMPTY_CHECKLIST: DailyChecklist = {
  grammar: false,
  vocabulary: false,
  phrases: false,
  listening: false,
  reading: false,
  writing: false,
  speaking: false,
}

// ═══════════════════════════════════════════════════════════════════════════
// Slice Interface
// ═══════════════════════════════════════════════════════════════════════════

export interface ProgressSlice {
  levelUpPending: { from: string; to: string } | null
  clearLevelUp: () => void
  dailyGoalMinutes: number
  totalXP: number
  todayXP: number
  weeklyXP: number
  weekStartDate: string   // weeklyXP qaysi hafta uchun (almashganda 0 ga tushadi)
  // Hearts (jonlar) — o'yin rejimi tension
  hearts: number
  heartsLastLostAt: string
  streak: number
  lastActiveDate: string
  todayMinutes: number
  todayGrammarPct: number
  todayVocabPct: number
  todayListeningPct: number
  todayReadingPct: number
  todaySpeakingPct: number
  todayWritingPct: number
  todayPhrasesPct: number
  todayChecklist: DailyChecklist
  rewardedChecklistItems: (keyof DailyChecklist)[]
  totalWordsLearned: number
  lastMock: MockResult | null
  // Achievements
  unlockedAchievements: string[]
  lastUnlockedAchievement: string | null
  // Streak bonuses
  streakBonusesClaimed: number[]
  // Streak freeze
  streakFreezes: number
  monthlyFreezeIssued: string   // "YYYY-MM" — free freezes issued for this month
  addStreakFreeze: (n: number) => void
  useStreakFreeze: () => boolean   // returns true if freeze was consumed
  consumeStreakFreeze: () => boolean // for incrementStreak logic
  grantMonthlyFreezes: () => void    // called on app init — gives 2 free freezes per month
  // Game feel settings
  soundEnabled: boolean
  vibrationEnabled: boolean

  setSoundEnabled: (v: boolean) => void
  setVibrationEnabled: (v: boolean) => void

  addXP: (amount: number) => void
  syncWeeklyXP: () => void   // hafta almashganda weeklyXP'ni 0 ga tushiradi
  // Hearts
  loseHeart: () => number    // qolgan jonlar sonini qaytaradi
  refillHearts: () => void   // to'liq tiklash (do'kon/reward uchun)
  setHearts: (n: number) => void // to'g'ridan-to'g'ri o'rnatish (do'kon uchun)
  regenHearts: () => void    // vaqt o'tishi bilan tiklash (app yuklanganda)
  _syncStreakToDB: (newStreak: number) => void
  _syncDailyProgressToDB: () => void
  incrementStreak: () => void
  resetStreak: () => void
  setTodayMinutes: (minutes: number) => void
  updateSkillProgress: (skill: keyof Pick<ProgressSlice,
    'todayGrammarPct' | 'todayVocabPct' | 'todayPhrasesPct' | 'todayListeningPct' | 'todayReadingPct' | 'todaySpeakingPct' | 'todayWritingPct'
  >, pct: number) => void
  toggleChecklistItem: (item: keyof DailyChecklist) => void
  resetDailyProgress: () => void
  addLearnedWords: (count: number) => void
  setLastMock: (result: MockResult) => void
  checkAchievements: () => void
  clearLastUnlocked: () => void
  claimStreakBonuses: () => number[]  // returns array of claimed XP amounts
}

// ═══════════════════════════════════════════════════════════════════════════
// Slice Implementation
// ═══════════════════════════════════════════════════════════════════════════

export const createProgressSlice: StateCreator<AppState, [], [], ProgressSlice> = (set, get) => ({
  levelUpPending: null,
  clearLevelUp: () => set({ levelUpPending: null }),
  dailyGoalMinutes: 120,
  totalXP: 0,
  todayXP: 0,
  weeklyXP: 0,
  weekStartDate: '',
  hearts: 5,
  heartsLastLostAt: '',
  streak: 0,
  lastActiveDate: '',
  todayMinutes: 0,
  todayGrammarPct: 0,
  todayVocabPct: 0,
  todayListeningPct: 0,
  todayReadingPct: 0,
  todaySpeakingPct: 0,
  todayWritingPct: 0,
  todayPhrasesPct: 0,
  todayChecklist: { ...EMPTY_CHECKLIST },
  rewardedChecklistItems: [],
  totalWordsLearned: 0,
  lastMock: null,
  unlockedAchievements: [],
  lastUnlockedAchievement: null,
  streakBonusesClaimed: [],
  streakFreezes: 0,
  monthlyFreezeIssued: '',
  soundEnabled: true,
  vibrationEnabled: true,

  setSoundEnabled: (v) => set({ soundEnabled: v }),
  setVibrationEnabled: (v) => set({ vibrationEnabled: v }),

  addStreakFreeze: (n) => set((s) => ({ streakFreezes: s.streakFreezes + n })),

  grantMonthlyFreezes: () => {
    const now = new Date()
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const { monthlyFreezeIssued } = get()
    if (monthlyFreezeIssued === monthKey) return
    // Grant 2 free streak freezes for the new month
    set((s) => ({
      monthlyFreezeIssued: monthKey,
      streakFreezes: s.streakFreezes + 2,
    }))
    // Show toast notification
      import('../utils/toastStore').then(({ useToastStore }) => {
        useToastStore.getState().toast('❄️ 2 ta bepul Streak Freeze olindi!', 'success', 4000)
      }).catch((e) => monitoring.captureMessage('grantMonthlyFreezes toast import failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
  },

  useStreakFreeze: () => {
    const { streakFreezes } = get()
    if (streakFreezes <= 0) return false
    set((s) => ({ streakFreezes: s.streakFreezes - 1 }))
    return true
  },

  addXP: (amount) => {
    set((s) => ({
      totalXP: s.totalXP + amount,
      todayXP: s.todayXP + amount,
      weeklyXP: s.weeklyXP + amount,
    }))
    // Play XP tick sfx for small gains
    if (amount <= 10) {
      import('../lib/gameFeel').then(({ feelXpTick }) => feelXpTick()).catch((e) => monitoring.captureMessage('feelXpTick import failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
    }
    get().checkAchievements()
    syncUserField('total_xp', get().totalXP)
    // Weekly Duel XP sync (tandem pair uchun)
    if (amount > 0) {
      setTimeout(() => {
        import('../services/tandemService').then(({ updateWeeklyDuelXP }) => {
          import('../lib/supabase').then(({ supabase }) => {
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session?.user.id) {
                updateWeeklyDuelXP(session.user.id, amount)
              }
            })
          })
        })
      }, 500)
    }
  },

  syncWeeklyXP: () => {
    import('../data/leagues').then(({ getWeekStart }) => {
      const currentWeek = getWeekStart()
      if (get().weekStartDate !== currentWeek) {
        set({ weeklyXP: 0, weekStartDate: currentWeek })
      }
    }).catch((e) => monitoring.captureMessage('syncWeeklyXP failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
  },

  loseHeart: () => {
    // Practice Mode ("Ustida Ishlash") — darslarda hearts sarflanmaydi, faqat Challenge/Duel da
    if (isPracticeMode()) {
      return get().hearts  // hearts sarflanmaydi
    }
    const cur = get().hearts
    if (cur <= 0) return 0
    const next = cur - 1
    set({
      hearts: next,
      // Timer faqat to'liqdan tushganda boshlanadi
      heartsLastLostAt: cur === MAX_HEARTS ? new Date().toISOString() : get().heartsLastLostAt,
    })
    return next
  },

  refillHearts: () => set({ hearts: MAX_HEARTS, heartsLastLostAt: '' }),

  setHearts: (n: number) => set({ hearts: Math.min(MAX_HEARTS, Math.max(0, n)), heartsLastLostAt: n >= MAX_HEARTS ? '' : new Date().toISOString() }),

  regenHearts: () => {
    const { hearts, heartsLastLostAt } = get()
    const regen = regenerateHearts({ hearts, lastLostAt: heartsLastLostAt })
    if (regen.hearts !== hearts || regen.lastLostAt !== heartsLastLostAt) {
      set({ hearts: regen.hearts, heartsLastLostAt: regen.lastLostAt })
    }
  },

  _syncStreakToDB: (newStreak: number) => {
    syncUserField('streak', newStreak)
  },

  incrementStreak: () => {
    const today = getTodayTashkent()
    const { lastActiveDate, streak } = get()
    const d = new Date(today + 'T00:00:00Z')
    d.setUTCDate(d.getUTCDate() - 1)
    const yesterday = d.toISOString().split('T')[0]

    let newStreak = streak
    if (lastActiveDate === yesterday) {
      newStreak = streak + 1
      set({ streak: newStreak, lastActiveDate: today })
      setTimeout(() => get().checkAchievements(), 0)
      setTimeout(() => get()._syncStreakToDB(newStreak), 0)
    } else if (lastActiveDate !== today) {
      // Try to use a streak freeze before resetting
      const consumed = get().consumeStreakFreeze()
      if (consumed) {
        // Freeze consumed — keep the streak alive
        newStreak = streak
        set({ lastActiveDate: today })
        get()._syncStreakToDB(streak)
      } else {
        newStreak = 1
        set({ streak: 1, lastActiveDate: today })
        setTimeout(() => get()._syncStreakToDB(1), 0)
      }
    }

    if (newStreak !== streak) {
      setTimeout(() => {
        const claimed = get().claimStreakBonuses()
        if (claimed.length > 0) {
          const total = claimed.reduce((a, b) => a + b, 0)
          import('../utils/toastStore').then(({ useToastStore }) => {
            useToastStore.getState().toast(
              `🎉 Streak bonusi: +${total} XP!`,
              'success', 5000,
            )
          })
        }
      }, 100)

      // Tandem Juftlik Streak — ikkala do'st ham dars qilgan bo'lsa
      setTimeout(() => {
        import('../services/tandemService').then(({ updateTandemStreak }) => {
          updateTandemStreak()
        }).catch((e) => monitoring.captureMessage('updateTandemStreak failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
      }, 1500)
    }
  },

  resetStreak: () => set({ streak: 0, streakFreezes: 0 }),

  consumeStreakFreeze: () => {
    const { streakFreezes } = get()
    if (streakFreezes <= 0) return false
    const today = getTodayTashkent()
    set({
      streakFreezes: streakFreezes - 1,
      lastActiveDate: today,
    })
    return true
  },

  setTodayMinutes: (minutes) => {
    set({ todayMinutes: minutes })
    setTimeout(() => get()._syncDailyProgressToDB(), 0)
  },

  _syncDailyProgressToDB: () => {
    const s = get()
    import('../lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.user.id) return
        const today = getTodayTashkent()
        supabase.from('daily_progress').upsert({
          user_id:           session.user.id,
          date:              today,
          day:               s.currentDay,
          week:              Math.ceil(s.currentDay / 7),
          total_minutes:     s.todayMinutes,
          grammar_minutes:   s.todayMinutes,
          vocab_minutes:     s.todayMinutes,
          listening_minutes: s.todayMinutes,
          writing_minutes:   s.todayMinutes,
          xp_earned:         s.todayXP,
          streak:            s.streak,
          grammar_pct:       s.todayGrammarPct,
          vocab_pct:         s.todayVocabPct,
          listening_pct:     s.todayListeningPct,
          reading_pct:       s.todayReadingPct,
          speaking_pct:      s.todaySpeakingPct,
          writing_pct:       s.todayWritingPct,
          phrases_pct:       s.todayPhrasesPct,
          checklist_completed: [
            s.todayChecklist.grammar,
            s.todayChecklist.vocabulary,
            s.todayChecklist.phrases,
            s.todayChecklist.listening,
            s.todayChecklist.reading,
            s.todayChecklist.writing,
            s.todayChecklist.speaking,
          ].filter(Boolean).length,
        }, { onConflict: 'user_id,date' }).then(({ error }) => {
          if (error) monitoring.captureMessage('daily_progress sync error: ' + error.message, 'warn')
        }, (e) => monitoring.captureMessage('daily_progress network error: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
      }, (e) => monitoring.captureMessage('_syncDailyProgressToDB getSession error: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
    }, (e) => monitoring.captureMessage('_syncDailyProgressToDB supabase import error: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
  },

  updateSkillProgress: (skill, pct) => {
    set({ [skill]: Math.min(100, Math.max(0, pct)) })
    setTimeout(() => get()._syncDailyProgressToDB(), 0)
  },

  toggleChecklistItem: (item) => {
    set((s) => {
      const alreadyRewarded = s.rewardedChecklistItems.includes(item)
      const newChecklist = { ...s.todayChecklist, [item]: !s.todayChecklist[item] }
      if (alreadyRewarded) return { todayChecklist: newChecklist }
      return {
        todayChecklist: newChecklist,
        rewardedChecklistItems: [...s.rewardedChecklistItems, item],
        totalXP: s.totalXP + 50,
        todayXP: s.todayXP + 50,
        weeklyXP: s.weeklyXP + 50,
      }
    })
  },

  resetDailyProgress: () =>
    set({
      todayMinutes: 0,
      todayXP: 0,
      todayGrammarPct: 0,
      todayVocabPct: 0,
      todayListeningPct: 0,
      todayReadingPct: 0,
      todaySpeakingPct: 0,
      todayWritingPct: 0,
      todayPhrasesPct: 0,
      todayChecklist: { ...EMPTY_CHECKLIST },
      rewardedChecklistItems: [],
    }),

  addLearnedWords: (count) => {
    set((s) => ({ totalWordsLearned: s.totalWordsLearned + count }))
    get().checkAchievements()
    syncUserField('words_learned', get().totalWordsLearned)
  },

  setLastMock: (result) => {
    set({ lastMock: result })
    setTimeout(() => get().checkAchievements(), 0)
  },

  clearLastUnlocked: () => set({ lastUnlockedAchievement: null }),

  claimStreakBonuses: () => {
    const { streak, streakBonusesClaimed } = get()
    const pending = getPendingStreakMilestones(streak, streakBonusesClaimed)

    if (pending.length === 0) return []

    const totalBonus = pending.reduce((sum, m) => sum + m.xp, 0)
    const newClaimed = pending.map(m => m.days)

    // Fire streak milestone sound & haptic for the largest milestone claimed
    import('../lib/gameFeel').then(({ feelStreakMilestone }) => {
      const maxClaimed = Math.max(...newClaimed)
      feelStreakMilestone(maxClaimed)
    }).catch((e) => monitoring.captureMessage('feelStreakMilestone import failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))

    set((s) => ({
      streakBonusesClaimed: [...s.streakBonusesClaimed, ...newClaimed],
      totalXP: s.totalXP + totalBonus,
      todayXP: s.todayXP + totalBonus,
    }))

    syncUserField('total_xp', get().totalXP)

    return pending.map(m => m.xp)
  },

  checkAchievements: () => {
    const state = get()
    const trulyNew = evaluateAchievements(ACHIEVEMENTS, {
      currentDay: state.currentDay,
      totalXP: state.totalXP,
      streak: state.streak,
      totalWordsLearned: state.totalWordsLearned,
      lastMock: state.lastMock,
      unlockedAchievements: state.unlockedAchievements,
    })

    if (trulyNew.length > 0) {
      set((s) => ({
        unlockedAchievements: [...new Set([...s.unlockedAchievements, ...trulyNew])],
        lastUnlockedAchievement: trulyNew[0],
      }))
      syncAchievementsToDB(trulyNew)
    }
  },
})
