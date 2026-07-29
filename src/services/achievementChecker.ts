import { monitoring } from '../lib/monitoring'
import { getSessionUserId } from '../lib/supabaseSync'
import type { MockResult } from '../store/types'

interface AchievementRequirement {
  type: string
  value: number
}

interface Achievement {
  id: string
  requirement: AchievementRequirement
}

interface ProgressState {
  currentDay: number
  totalXP: number
  streak: number
  totalWordsLearned: number
  lastMock: MockResult | null
  unlockedAchievements: string[]
}

export function evaluateAchievements(achievements: Achievement[], state: ProgressState): string[] {
  const newUnlocked: string[] = []

  for (const ach of achievements) {
    if (state.unlockedAchievements.includes(ach.id)) continue

    let earned = false
    switch (ach.requirement.type) {
      case 'day':
        earned = state.currentDay >= ach.requirement.value
        break
      case 'xp':
        earned = state.totalXP >= ach.requirement.value
        break
      case 'streak':
        earned = state.streak >= ach.requirement.value
        break
      case 'words':
        earned = state.totalWordsLearned >= ach.requirement.value
        break
      case 'games':
        break
      case 'mocktest':
        earned = state.lastMock !== null
        break
      case 'mocktest_score':
        earned = (state.lastMock?.score ?? 0) >= ach.requirement.value
        break
    }

    if (earned) {
      newUnlocked.push(ach.id)
    }
  }

  return [...new Set(newUnlocked.filter(id => !state.unlockedAchievements.includes(id)))]
}

export async function syncAchievementsToDB(trulyNew: string[]): Promise<void> {
  try {
    const userId = await getSessionUserId()
    if (!userId) return

    const { supabase } = await import('../lib/supabase')

    const { data: existing } = await supabase
      .from('achievements')
      .select('achievement_id')
      .eq('user_id', userId)

    const existingIds = new Set((existing ?? []).map((r: { achievement_id: string }) => r.achievement_id))

    const toInsert = trulyNew
      .filter(id => !existingIds.has(id))
      .map(id => ({
        user_id: userId,
        achievement_id: id,
        unlocked_at: new Date().toISOString(),
      }))

    if (toInsert.length > 0) {
      await supabase.from('achievements').upsert(toInsert, { onConflict: 'user_id,achievement_id', ignoreDuplicates: true })
    }
  } catch (e) {
    monitoring.captureMessage('Achievements sync failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
  }
}
