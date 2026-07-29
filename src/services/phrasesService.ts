import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { addDaysTashkent } from '../utils/tashkentDate'
import { useToastStore } from '../utils/toastStore'
import { monitoring } from '../lib/monitoring'
import { mergeVocabProgress } from './conflictResolution'
import type { DailyPhraseRow, PhraseRating } from '../types/phrases'

const SRS_INTERVALS = [1, 3, 7, 14, 30, 90]
const MAX_BOX = 6

export type { PhraseRating }
export type { DailyPhraseRow }

export function computePhraseNextReview(
  box: number,
  rating: PhraseRating
): { box: number; next_review: string; is_learned: boolean } {
  let newBox: number

  if (rating === 'yodladim') {
    newBox = Math.min(box + 2, MAX_BOX)
  } else if (rating === 'bildim') {
    newBox = Math.min(box + 1, MAX_BOX)
  } else if (rating === 'qiynaldim') {
    newBox = Math.max(box, 1)
  } else {
    newBox = 1
  }

  const intervalDays = SRS_INTERVALS[newBox - 1]
  const isLearned = newBox >= MAX_BOX

  return { box: newBox, next_review: addDaysTashkent(intervalDays), is_learned: isLearned }
}

export async function fetchDailyPhrases(
  userId: string,
  level?: string,
  offset?: number,
  limit?: number
): Promise<DailyPhraseRow[]> {
  const { data, error } = await db.rpc('get_daily_phrases', {
    p_user_id: userId,
    p_level: level ?? undefined,
    p_offset: offset ?? 0,
    p_limit: limit ?? 60,
  })

  if (error) {
    monitoring.captureMessage('fetchDailyPhrases error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }

  return (data ?? []) as DailyPhraseRow[]
}

export async function fetchPhrasesForReview(userId: string): Promise<DailyPhraseRow[]> {
  const { data, error } = await db.rpc('get_phrases_for_review', {
    p_user_id: userId,
  })

  if (error) {
    monitoring.captureMessage('fetchPhrasesForReview error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }

  return (data ?? []) as DailyPhraseRow[]
}

export async function upsertPhraseProgress(
  userId: string,
  phraseId: number,
  box: number,
  nextReview: string,
  correctCount: number,
  wrongCount: number,
  isLearned: boolean,
  lastRating?: string
) {
  // Smart merge: fetch existing row to prevent SRS regression across devices
  const { data: existing } = await supabase
    .from('phrase_progress')
    .select('box, correct_count, wrong_count, is_learned')
    .eq('user_id', userId)
    .eq('phrase_id', phraseId)
    .maybeSingle()

  let merged = { box, correctCount, wrongCount, isLearned }
  if (existing) {
    merged = mergeVocabProgress({
      localBox: box,
      remoteBox: existing.box ?? 0,
      localCorrectCount: correctCount,
      remoteCorrectCount: existing.correct_count ?? 0,
      localWrongCount: wrongCount,
      remoteWrongCount: existing.wrong_count ?? 0,
      localIsLearned: isLearned,
      remoteIsLearned: existing.is_learned ?? false,
    })
  }

  const { error } = await supabase.from('phrase_progress').upsert({
    user_id: userId,
    phrase_id: phraseId,
    box: merged.box,
    next_review: nextReview,
    correct_count: merged.correctCount,
    wrong_count: merged.wrongCount,
    is_learned: merged.isLearned,
    last_rating: lastRating,
    last_reviewed: new Date().toISOString(),
  }, { onConflict: 'user_id,phrase_id' })

  if (error) {
    monitoring.captureMessage('upsertPhraseProgress error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast('Gap ma\'lumotini saqlashda xatolik', 'error')
  }
}

export async function savePhraseSession(
  userId: string,
  batchNumber: number,
  phrasesJson: Record<string, PhraseRating>,
  score: number,
  timeSpent: number,
  sessionDate?: string
) {
  const dateToUse = sessionDate ?? new Date().toISOString().split('T')[0]

  const { error } = await supabase
    .from('phrase_sessions')
    .upsert({
      user_id: userId,
      session_date: dateToUse,
      batch_number: batchNumber,
      phrases_json: phrasesJson,
      score,
      time_spent: timeSpent,
      completed: true,
    }, { onConflict: 'user_id,session_date,batch_number' })

  if (error) {
    monitoring.captureMessage('savePhraseSession error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast('Sessiyani saqlashda xatolik', 'error')
  }
}

export interface DaySession {
  session_date: string
  completed_batches: number
  total_score: number
  total_phrases: number
  all_completed: boolean
}

export async function fetchMonthPhraseSessions(
  userId: string,
  year: number,
  month: number
): Promise<Map<string, DaySession>> {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const endDateStr = month === 11
    ? `${year + 1}-01-01`
    : `${year}-${String(month + 2).padStart(2, '0')}-01`

  const { data, error } = await supabase
    .from('phrase_sessions')
    .select('id, session_date, batch_number, score, phrases_json')
    .gte('session_date', startDate)
    .lt('session_date', endDateStr)
    .eq('user_id', userId)
    .order('id', { ascending: true })

  if (error) {
    monitoring.captureMessage('fetchMonthPhraseSessions error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return new Map()
  }

  const byDayBatch = new Map<string, Map<number, (typeof data)['0']>>()
  for (const row of data ?? []) {
    const d = row.session_date
    if (!byDayBatch.has(d)) byDayBatch.set(d, new Map())
    const batchMap = byDayBatch.get(d)!
    if (row.batch_number != null) {
      batchMap.set(row.batch_number, row)
    }
  }

  const result = new Map<string, DaySession>()
  for (const [d, batchMap] of byDayBatch) {
    let totalScore = 0
    let totalPhrases = 0
    for (const [, row] of batchMap) {
      totalScore += row.score ?? 0
      totalPhrases += row.phrases_json ? Object.keys(row.phrases_json as Record<string, unknown>).length : 0
    }
    const completedBatches = batchMap.size
    result.set(d, {
      session_date: d,
      completed_batches: completedBatches,
      total_score: totalScore,
      total_phrases: totalPhrases,
      all_completed: completedBatches >= 3,
    })
  }
  return result
}

export async function fetchPhraseProgressStats(userId: string) {
  const { data, error } = await supabase
    .from('phrase_progress')
    .select('phrase_id, box, is_learned, correct_count')
    .eq('user_id', userId)

  if (error) {
    monitoring.captureMessage('fetchPhraseProgressStats error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }
  return data ?? []
}

export interface LevelTotal {
  level: string
  total: number
}

export interface LevelLearned {
  level: string
  learned: number
}

export async function fetchPhraseLevelCounts(): Promise<LevelTotal[]> {
  const { data, error } = await db.rpc('get_phrase_counts_by_level')
  if (error) {
    monitoring.captureMessage('fetchPhraseLevelCounts error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }
  return data ?? []
}

export async function fetchPhraseLearnedCounts(userId: string): Promise<LevelLearned[]> {
  const { data, error } = await db.rpc('get_learned_phrase_counts_by_level', {
    p_user_uuid: userId,
  })
  if (error) {
    monitoring.captureMessage('fetchPhraseLearnedCounts error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }
  return data ?? []
}
