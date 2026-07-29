import { db, type PronunciationErrorRecord } from '../db/database'
import { classifySound, SOUND_CATEGORIES, getDrillLabel } from '../data/pronunciationSounds'
import type { PronunciationIssue } from '../lib/claude'

export interface SoundErrorCount {
  soundId: string
  label: string
  count: number
  drillCategory: string | undefined
}

export interface DrillSuggestion {
  categoryId: string
  label: string
  count: number
}

const SOUND_LABELS: Record<string, string> = {
  'th-voiceless': 'θ (voiceless th)',
  'th-voiced': 'ð (voiced th)',
  'w-v': 'w/v',
  'short-i': 'ɪ (short i)',
  'long-ee': 'iː (long ee)',
  'ae': 'æ (cat)',
  'ed-ending': '-ed qo\'shimchasi',
  'word-stress': 'So\'z urg\'usi',
  'silent-letters': 'Jim harflar',
  'ng': 'ŋ (ng)',
  'schwa': 'ə (schwa)',
  'other': 'Boshqa',
}

export async function trackPronunciationErrors(
  issues: PronunciationIssue[],
  score: number,
  context: PronunciationErrorRecord['context'],
  refId?: string
): Promise<void> {
  if (!issues.length) return

  const records: PronunciationErrorRecord[] = issues.map(issue => {
    const sound = classifySound(issue.ipa, issue.tip)
    return {
      soundId: sound.id,
      word: issue.word,
      ipa: issue.ipa,
      tip: issue.tip,
      score,
      context,
      refId,
      createdAt: Date.now(),
    }
  })

  await db.pronunciationErrors.bulkAdd(records)
}

export async function getFrequentErrors(limit = 5): Promise<SoundErrorCount[]> {
  const all = await db.pronunciationErrors.toArray()
  const grouped = new Map<string, number>()

  for (const err of all) {
    grouped.set(err.soundId, (grouped.get(err.soundId) ?? 0) + 1)
  }

  return [...grouped.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([soundId, count]) => {
      const cat = SOUND_CATEGORIES.find(c => c.id === soundId)
      return {
        soundId,
        label: SOUND_LABELS[soundId] ?? soundId,
        count,
        drillCategory: cat?.drillCategory,
      }
    })
}

export async function getErrorTrend(days = 7): Promise<{ date: string; count: number }[]> {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  const recent = await db.pronunciationErrors
    .where('createdAt')
    .above(cutoff)
    .toArray()

  const byDate = new Map<string, number>()
  for (const err of recent) {
    const date = new Date(err.createdAt).toISOString().slice(0, 10)
    byDate.set(date, (byDate.get(date) ?? 0) + 1)
  }

  const result: { date: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const dateStr = d.toISOString().slice(0, 10)
    result.push({ date: dateStr, count: byDate.get(dateStr) ?? 0 })
  }

  return result
}

export async function getDrillSuggestions(): Promise<DrillSuggestion[]> {
  const all = await db.pronunciationErrors.toArray()

  const byCategory = new Map<string, number>()
  for (const err of all) {
    const cat = SOUND_CATEGORIES.find(c => c.id === err.soundId)
    if (cat?.drillCategory) {
      byCategory.set(cat.drillCategory, (byCategory.get(cat.drillCategory) ?? 0) + 1)
    }
  }

  return [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([categoryId, count]) => ({
      categoryId,
      label: getDrillLabel(categoryId),
      count,
    }))
}

export async function clearPronunciationErrors(): Promise<void> {
  await db.pronunciationErrors.clear()
}
