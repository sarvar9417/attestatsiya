// Speaking Path — Achievement checking service
// Har bir session yakunida chaqiriladi va yangi ochilgan yutuqlarni aniqlaydi

import { ACHIEVEMENTS } from '../data/achievements'
import { getSpeakingProgress, loadSrsMap } from './speakingPathService'
import { monitoring } from '../lib/monitoring'

export interface SpeakingAchievementResult {
  newlyUnlocked: string[]
  progress: {
    daysCompleted: number
    speakingStreak: number
    chunksMastered: number
    bestSpeakScore: number
    cefr: string
  }
}

/** Speaking Path bo'yicha yutuqlarni tekshiradi va yangilarini qaytaradi */
export async function checkSpeakingAchievements(
  userId: string,
  unlockedIds: string[],
  overrideStats?: {
    completedCount: number
    streakDays: number
    chunksMastered: number
    bestSpeakScore: number
    cefr: string
  },
): Promise<SpeakingAchievementResult> {
  // 1. Ma'lumotlarni yig'ish
  let daysCompleted = 0
  let speakingStreak = 0
  let chunksMastered = 0
  let bestSpeakScore = 0
  let cefr = 'A0'

  if (overrideStats) {
    daysCompleted = overrideStats.completedCount
    speakingStreak = overrideStats.streakDays
    chunksMastered = overrideStats.chunksMastered
    bestSpeakScore = overrideStats.bestSpeakScore
    cefr = overrideStats.cefr
  } else if (userId) {
    try {
      const progress = await getSpeakingProgress(userId)
      const completed = progress.filter(p => p.completed)
      daysCompleted = completed.length

      // Streak (kalendar kunlari ketma-ketligi)
      const dateSet = new Set(completed.map(p => (p.completedAt ?? '').slice(0, 10)).filter(Boolean))
      const todayStr = new Date().toISOString().split('T')[0]
      const cursor = new Date(todayStr + 'T00:00:00Z')
      if (!dateSet.has(todayStr)) cursor.setUTCDate(cursor.getUTCDate() - 1)
      while (dateSet.has(cursor.toISOString().split('T')[0])) {
        speakingStreak++
        cursor.setUTCDate(cursor.getUTCDate() - 1)
      }

      // Eng yaxshi ball
      bestSpeakScore = completed.reduce((m, p) => Math.max(m, p.bestSpeakScore ?? 0), 0)

      // SRS orqali o'zlashtirilgan chunk'lar
      const srsMap = await loadSrsMap(userId)
      chunksMastered = Object.values(srsMap).filter(st => st.stability >= 30).length

      // CEFR darajasi (eng katta kun bo'yicha)
      const maxDay = completed.reduce((m, p) => Math.max(m, p.day), 0)
      if (maxDay >= 64) cefr = 'B2'
      else if (maxDay >= 36) cefr = 'B1'
      else if (maxDay >= 19) cefr = 'A2'
      else if (maxDay >= 7) cefr = 'A1'
    } catch (e) {
      monitoring.captureMessage('checkSpeakingAchievements progress fetch failed (offline): ' + (e instanceof Error ? e.message : String(e)), 'warn')
      // offline — overrideStats bo'lmasa, bo'sh qaytaramiz
    }
  }

  // 2. Yutuqlarni tekshirish
  const speakingAchievements = ACHIEVEMENTS.filter(a => a.category === 'speaking')
  const newlyUnlocked: string[] = []

  for (const ach of speakingAchievements) {
    if (unlockedIds.includes(ach.id)) continue

    let earned = false
    switch (ach.requirement.type) {
      case 'speaking_days':
        earned = daysCompleted >= ach.requirement.value
        break
      case 'speaking_streak':
        earned = speakingStreak >= ach.requirement.value
        break
      case 'chunks_mastered':
        earned = chunksMastered >= ach.requirement.value
        break
      case 'speaking_perfect_day':
        earned = bestSpeakScore >= 90
        break
      case 'speaking_conversations':
        earned = daysCompleted >= ach.requirement.value
        break
      case 'speaking_cefr':
        earned = daysCompleted >= ach.requirement.value
        break
    }

    if (earned) {
      newlyUnlocked.push(ach.id)
    }
  }

  return {
    newlyUnlocked,
    progress: {
      daysCompleted,
      speakingStreak,
      chunksMastered,
      bestSpeakScore,
      cefr,
    },
  }
}

/** To'g'ridan-to'g'ri store'ni yangilaydi va yutuqlarni Supabase'ga yozadi */
export async function unlockSpeakingAchievements(
  userId: string | undefined,
  newlyUnlocked: string[],
): Promise<void> {
  if (newlyUnlocked.length === 0 || !userId) return

  // Store'ni yangilash
  try {
    const { useStore } = await import('../store/useStore')
    const store = useStore.getState()

    for (const id of newlyUnlocked) {
      if (!store.unlockedAchievements.includes(id)) {
        useStore.setState({
          unlockedAchievements: [...store.unlockedAchievements, id],
          lastUnlockedAchievement: id,
        })
      }
    }
  } catch (e) {
    monitoring.captureMessage('unlockSpeakingAchievements store update failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    // store import qilishda xato
  }

  // Supabase'ga yozish (non-blocking)
  try {
    const { supabase } = await import('../lib/supabase')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const toInsert = newlyUnlocked.map(id => ({
      user_id: session.user.id,
      achievement_id: id,
      unlocked_at: new Date().toISOString(),
    }))

    await supabase.from('achievements').upsert(toInsert, {
      onConflict: 'user_id,achievement_id',
      ignoreDuplicates: true,
    })
  } catch (e) {
    monitoring.captureMessage('unlockSpeakingAchievements Supabase upsert failed (offline): ' + (e instanceof Error ? e.message : String(e)), 'warn')
    // offline — keyingi safar sinxronlanadi
  }
}
