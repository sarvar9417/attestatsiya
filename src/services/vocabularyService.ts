import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { addDaysTashkent } from '../utils/tashkentDate'
import { useToastStore } from '../utils/toastStore'
import { monitoring } from '../lib/monitoring'
import { computeNextReviewFSRS, createDefaultFSRSState, type FSRSState } from '../lib/srs'
import { mergeVocabProgress } from './conflictResolution'
import { getConfusablePartnerWords } from '../data/confusable-pairs'
import { VocabularyProgressSchema, VocabularySessionSchema, FSRSWordInputSchema } from '../lib/validations'

export type WordLevel = 'A1' | 'A2' | 'B1' | 'B2'

/** Extends DailyWordRow with FSRS fields */
export interface DailyWordRowFSRS extends DailyWordRow {
  fsrs_stability?:  number
  fsrs_difficulty?: number
  fsrs_reps?:       number
  fsrs_lapses?:     number
}

export interface DailyWordRow {
  word_id:      number
  english:      string
  uzbek:        string
  level:        WordLevel
  box:          number
  next_review:  string
  is_learned:   boolean
  correct_count: number
  wrong_count:   number
  is_new:       boolean
  example?:    string
  phonetic?:   string
  last_rating?: string
}

export interface SessionWordResult {
  word_id:  number
  english:  string
  uzbek:    string
  level:    WordLevel
  box:      number
  result:   'correct' | 'wrong'
}

export type Rating = 'bildim' | 'qiynaldim' | 'bilmadim' | 'yodladim'

// SRS intervallar: Box 1→1kun, 2→3kun, 3→7kun, 4→14kun, 5→30kun, 6→90kun
const SRS_INTERVALS = [1, 3, 7, 14, 30, 90]
const MAX_BOX = 6

export function computeNextReview(
  box: number,
  rating: Rating
): { box: number; next_review: string; is_learned: boolean } {
  let newBox: number

  if (rating === 'yodladim') {
    newBox = Math.min(box + 2, MAX_BOX) // bir qadam o'tkazib yuborish
  } else if (rating === 'bildim') {
    newBox = Math.min(box + 1, MAX_BOX) // keyingi qadamga
  } else if (rating === 'qiynaldim') {
    newBox = Math.max(box, 1)           // shu qadamda qolish
  } else {
    newBox = 1                          // boshidan boshlash
  }

  const intervalDays = SRS_INTERVALS[newBox - 1]
  const isLearned = newBox >= MAX_BOX

  return { box: newBox, next_review: addDaysTashkent(intervalDays), is_learned: isLearned }
}

export async function upsertProgress(
  userId: string,
  wordId: number,
  box: number,
  nextReview: string,
  correctCount: number,
  wrongCount: number,
  isLearned: boolean
) {
  const validation = VocabularyProgressSchema.safeParse({ userId, wordId, box, nextReview, correctCount, wrongCount, isLearned })
  if (!validation.success) {
    monitoring.captureMessage(`Validation failed in upsertProgress: ${validation.error.message}`, 'warn')
  }

  // Smart merge: fetch existing row and merge box/correct/wrong counts
  // to prevent SRS regression (e.g. device A has box=3, device B has box=1)
  const { data: existing } = await supabase
    .from('vocabulary_progress')
    .select('box, correct_count, wrong_count, is_learned')
    .eq('user_id', userId)
    .eq('word_id', wordId)
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

  const { error } = await supabase.from('vocabulary_progress').upsert({
    user_id: userId,
    word_id: wordId,
    box: merged.box,
    next_review: nextReview,
    correct_count: merged.correctCount,
    wrong_count: merged.wrongCount,
    is_learned: merged.isLearned,
    last_reviewed: new Date().toISOString(),
  }, { onConflict: 'user_id,word_id' })

  if (error) {
    monitoring.captureMessage('upsertProgress error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast('So\'z ma\'lumotini saqlashda xatolik', 'error')
  }
}

export async function saveSession(
  userId: string,
  batchNumber: number,
  wordsJson: Record<string, Rating>,
  score: number,
  timeSpent: number,
  sessionDate?: string
) {
  const validation = VocabularySessionSchema.safeParse({ userId, batchNumber, wordsJson, score, timeSpent, sessionDate })
  if (!validation.success) {
    monitoring.captureMessage(`Validation failed in saveSession: ${validation.error.message}`, 'warn')
  }

  const dateToUse = sessionDate ?? new Date().toISOString().split('T')[0]

  const { error } = await supabase
    .from('vocabulary_sessions')
    .upsert({
      user_id: userId,
      session_date: dateToUse,
      batch_number: batchNumber,
      words_json: wordsJson,
      score,
      time_spent: timeSpent,
      completed: true,
    }, { onConflict: 'user_id,session_date,batch_number' })

  if (error) {
    monitoring.captureMessage('saveSession error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast('Sessiyani saqlashda xatolik', 'error')
  }
}

export interface DaySession {
  session_date: string
  completed_batches: number
  total_score: number
  total_words: number
  all_completed: boolean
}

// ─── SRS Multi-Mode ──────────────────────────────────────────────────────

export type ReviewMode = 'translation' | 'fill-blank' | 'type-answer' | 'definition'

export function getReviewMode(box: number): ReviewMode {
  if (box <= 1) return 'translation'
  if (box <= 3) return 'fill-blank'
  if (box <= 5) return 'type-answer'
  return 'definition'
}

export function buildFillBlank(example: string, english: string): string {
  const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\b${escaped}\\b`, 'i')
  const result = example.replace(regex, '_____')
  return result !== example ? result : `I _____ to complete this task.`
}

export async function fetchMonthSessions(
  userId: string,
  year: number,
  month: number
): Promise<Map<string, DaySession>> {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const endDateStr = month === 11
    ? `${year + 1}-01-01`
    : `${year}-${String(month + 2).padStart(2, '0')}-01`

  const { data, error } = await supabase
    .from('vocabulary_sessions')
    .select('id, session_date, batch_number, score, words_json')
    .gte('session_date', startDate)
    .lt('session_date', endDateStr)
    .eq('user_id', userId)
    .order('id', { ascending: true })

  if (error) {
    monitoring.captureMessage('fetchMonthSessions error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return new Map()
  }

  const byDayBatch = new Map<string, Map<number, (typeof data)['0']>>()
  for (const row of data ?? []) {
    const d = row.session_date
    if (!byDayBatch.has(d)) byDayBatch.set(d, new Map())
    const batchMap = byDayBatch.get(d)!
    if (row.batch_number != null) {
      batchMap.set(row.batch_number, row) // keeps last occurrence
    }
  }

  const result = new Map<string, DaySession>()
  for (const [d, batchMap] of byDayBatch) {
    let totalScore = 0
    let totalWords = 0
    for (const [, row] of batchMap) {
      totalScore += row.score ?? 0
      totalWords += row.words_json ? Object.keys(row.words_json as Record<string, unknown>).length : 0
    }
    const completedBatches = batchMap.size
    result.set(d, {
      session_date: d,
      completed_batches: completedBatches,
      total_score: totalScore,
      total_words: totalWords,
      all_completed: completedBatches >= 4,
    })
  }
  return result
}

export async function fetchProgressStats(userId: string) {
  const { data, error } = await supabase
    .from('vocabulary_progress')
    .select('word_id, box, is_learned, correct_count')
    .eq('user_id', userId)

  if (error) {
    monitoring.captureMessage('fetchProgressStats error: ' + (error instanceof Error ? error.message : String(error)), 'error')
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

export async function fetchLevelCounts(): Promise<LevelTotal[]> {
  const { data, error } = await db.rpc('get_word_counts_by_level')
  if (error) {
    monitoring.captureMessage('fetchLevelCounts error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }
  return data ?? []
}

// Har darajadagi jami yozuv soni (words yoki phrases katalogi) — deyarli statik,
// shuning uchun localStorage'ga keshlanadi (24 soat). Birinchi marta individual count
// so'rovlari PARALLEL yuboriladi (RPC'ga ishonmaymiz — alohida so'rovlar ishonchli,
// lekin endi ketma-ket emas).
const LEVEL_TOTALS_TTL = 24 * 60 * 60 * 1000

export async function getCachedLevelTotals(
  table: 'words' | 'phrases',
  levels: readonly string[],
): Promise<Record<string, number>> {
  const key = `level_totals_${table}_v1`
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const cached = JSON.parse(raw) as { ts: number; totals: Record<string, number> }
      if (Date.now() - cached.ts < LEVEL_TOTALS_TTL && levels.every(l => l in cached.totals)) {
        return cached.totals
      }
    }
  } catch (e) { /* keshda xato — yangidan olamiz */
    monitoring.captureMessage('getCachedLevelTotals localStorage read failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
  }

  const pairs = await Promise.all(levels.map(async (lvl) => {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq('level', lvl)
    return [lvl, count ?? 0] as const
  }))
  const totals = Object.fromEntries(pairs)
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), totals })) } catch (e) {
    monitoring.captureMessage('getCachedLevelTotals localStorage write failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
  }
  return totals
}

export async function fetchLearnedCounts(userId: string): Promise<LevelLearned[]> {
  const { data, error } = await db.rpc('get_learned_counts_by_level', { user_uuid: userId })
  if (error) {
    monitoring.captureMessage('fetchLearnedCounts error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }
  return data ?? []
}

// ─── Interleaving: SRS dan eski so'zlarni olish ───────────────────────────

export interface ReviewWord {
  wordId: number
  english: string
  uzbek: string
  example?: string
  phonetic?: string
  isReview: true
}

export async function getReviewWordsForLesson(
  userId: string,
  level: string,
  count: number = 3
): Promise<ReviewWord[]> {
  const sel = 'word_id, next_review, words!inner(english, uzbek, example, phonetic, level)'
  const nowIso = new Date().toISOString()

  // 1) Avval darsга MOS darajadagi muddati kelgan so'zlar (lesson-relevant)
  const { data, error } = await supabase
    .from('vocabulary_progress')
    .select(sel)
    .eq('user_id', userId)
    .eq('words.level', level)
    .lte('next_review', nowIso)
    .order('next_review', { ascending: true })
    .limit(count)

  if (error) {
    monitoring.captureMessage('getReviewWordsForLesson error: ' + (error instanceof Error ? error.message : String(error)), 'warn')
    return []
  }

  const rows = [...(data ?? [])]

  // 2) Yetarli bo'lmasa — istalgan darajadagi muddati kelganlar bilan to'ldiramiz
  if (rows.length < count) {
    const { data: more } = await supabase
      .from('vocabulary_progress')
      .select(sel)
      .eq('user_id', userId)
      .lte('next_review', nowIso)
      .order('next_review', { ascending: true })
      .limit(count)
    const seen = new Set(rows.map(r => r.word_id))
    for (const r of more ?? []) {
      if (rows.length >= count) break
      if (!seen.has(r.word_id)) rows.push(r)
    }
  }

  return db.cast<{ word_id: number; words: { english: string; uzbek: string; example?: string; phonetic?: string } }[]>(rows).map((d) => ({
    wordId: d.word_id,
    english: d.words.english,
    uzbek: d.words.uzbek,
    example: d.words.example,
    phonetic: d.words.phonetic,
    isReview: true as const,
  }))
}

export async function pushWordsToSRS(
  userId: string,
  words: { english: string; rating: Rating }[]
): Promise<void> {
  if (words.length === 0) return

  for (const w of words) {
    const validation = FSRSWordInputSchema.safeParse({ english: w.english, rating: w.rating })
    if (!validation.success) {
      monitoring.captureMessage(`Validation failed in pushWordsToSRS: ${validation.error.message}`, 'warn')
    }
  }

  // Batch: barcha word ID larni birdaniga olish
  const englishList = words.map(w => w.english)
  const { data: wordRows } = await supabase
    .from('words')
    .select('id, english')
    .in('english', englishList)

  const wordMap = new Map<string, number>()
  for (const row of wordRows ?? []) {
    wordMap.set(row.english, row.id)
  }

  // Batch: barcha progresslarni birdaniga upsert qilish
  const rows = words
    .filter(w => wordMap.has(w.english))
    .map(w => {
      const result = computeNextReview(1, w.rating)
      return {
        user_id: userId,
        word_id: wordMap.get(w.english)!,
        box: result.box,
        next_review: result.next_review,
        correct_count: 0,
        wrong_count: 0,
        is_learned: result.is_learned,
        last_rating: w.rating,
        last_reviewed: new Date().toISOString(),
      }
    })

  if (rows.length > 0) {
    await supabase.from('vocabulary_progress').upsert(rows, { onConflict: 'user_id,word_id' })
  }
}

// ─── FSRS-based SRS ────────────────────────────────────────────────────────

export interface PushWordInput {
  english: string
  rating: Rating
  uzbek?: string
  example?: string
  level?: string
}

/**
 * Push vocabulary progress using the FSRS-5 algorithm instead of the box system.
 * If a word doesn't exist in the `words` catalog, it is auto-inserted
 * so that no lesson vocabulary is ever dropped.
 */
export async function pushWordsToSRS_FSRS(
  userId: string,
  words: PushWordInput[]
): Promise<void> {
  if (words.length === 0) return

  for (const w of words) {
    const validation = FSRSWordInputSchema.safeParse({ english: w.english, rating: w.rating, uzbek: w.uzbek, example: w.example, level: w.level })
    if (!validation.success) {
      monitoring.captureMessage(`Validation failed in pushWordsToSRS_FSRS: ${validation.error.message}`, 'warn')
    }
  }

  const englishList = words.map(w => w.english)

  // 1) Batch: barcha word ID larni birdaniga olish
  const { data: existingWords } = await supabase
    .from('words')
    .select('id, english')
    .in('english', englishList)

  const wordMap = new Map<string, number>()
  for (const row of existingWords ?? []) {
    wordMap.set(row.english, row.id)
  }

  // 2) Topilmagan so'zlarni batch insert qilish
  const missing = words.filter(w => !wordMap.has(w.english))
  if (missing.length > 0) {
    const { data: inserted } = await supabase
      .from('words')
      .insert(missing.map(w => ({
        english: w.english,
        uzbek: w.uzbek ?? '',
        level: w.level ?? 'A1',
        example: w.example ?? '',
        phonetic: '',
      })))
      .select('id, english')

    for (const row of inserted ?? []) {
      wordMap.set(row.english, row.id)
    }
  }

  // 3) Batch: barcha mavjud FSRS state larni birdaniga olish
  const wordIds = words.map(w => wordMap.get(w.english)).filter(Boolean) as number[]
  const { data: existingProgress } = await supabase
    .from('vocabulary_progress')
    .select('word_id, fsrs_stability, fsrs_difficulty, fsrs_reps, fsrs_lapses, next_review')
    .eq('user_id', userId)
    .in('word_id', wordIds)

  const progressMap = new Map<number, typeof existingProgress extends (infer T)[] | null ? T : never>()
  for (const row of existingProgress ?? []) {
    progressMap.set(row.word_id, row)
  }

  // 4) Har bir so'z uchun FSRS hisoblash + batch upsert
  const upsertRows = []
  for (const w of words) {
    const wordId = wordMap.get(w.english)
    if (!wordId) continue

    const existing = progressMap.get(wordId)
    const currentState: FSRSState = existing
      ? {
          stability:  existing.fsrs_stability ?? 0,
          difficulty: existing.fsrs_difficulty ?? 5,
          due:        existing.next_review ?? new Date().toISOString().split('T')[0],
          reps:       existing.fsrs_reps ?? 0,
          lapses:     existing.fsrs_lapses ?? 0,
        }
      : createDefaultFSRSState()

    const { state } = computeNextReviewFSRS(currentState, w.rating)
    const box = Math.min(6, Math.max(1, state.stability > 30 ? 6 : state.stability > 14 ? 5 : state.stability > 7 ? 4 : state.stability > 3 ? 3 : state.stability > 1 ? 2 : 1))

    upsertRows.push({
      user_id: userId,
      word_id: wordId,
      box,
      next_review: state.due,
      correct_count: 0,
      wrong_count: w.rating === 'bilmadim' || w.rating === 'qiynaldim' ? 1 : 0,
      is_learned: state.stability >= 90,
      last_rating: w.rating,
      last_reviewed: new Date().toISOString(),
      fsrs_stability:  state.stability,
      fsrs_difficulty: state.difficulty,
      fsrs_reps:       state.reps,
      fsrs_lapses:     state.lapses,
    })
  }

  // 5) Batch upsert
  if (upsertRows.length > 0) {
    await supabase.from('vocabulary_progress').upsert(upsertRows, { onConflict: 'user_id,word_id' })
  }

  // Confusable partnerlarni kechiktirish
  const reviewedEnglish = words.map(w => w.english)
  await delayConfusablePartners(userId, reviewedEnglish)

  monitoring.captureMessage(`pushWordsToSRS_FSRS: ${words.length} words processed for user ${userId}`, 'info')
}

// ─── Confusable Pairs SRS kechiktirish ─────────────────────────────────────

const CONFUSABLE_DELAY_DAYS = 3

/**
 * Confusable pair'dagi sherik so'zlarning next_review ni kechiktiradi.
 * Bu bilan o'quvchi bir vaqtning o'zida chalkash so'zlarni o'rganmaydi.
 */
export async function delayConfusablePartners(
  userId: string,
  reviewedWords: string[]
): Promise<void> {
  // Barcha confusable partnerlarni yig'ish
  const allPartners = new Set<string>()
  for (const word of reviewedWords) {
    const partners = getConfusablePartnerWords(word)
    for (const p of partners) {
      if (!reviewedWords.some(rw => rw.toLowerCase() === p.toLowerCase())) {
        allPartners.add(p)
      }
    }
  }

  if (allPartners.size === 0) return

  const partnerList = Array.from(allPartners)

  // Batch: barcha partner word ID larni birdaniga olish
  const { data: wordRows } = await supabase
    .from('words')
    .select('id, english')
    .in('english', partnerList)

  if (!wordRows || wordRows.length === 0) return

  const wordIds = wordRows.map(r => r.id)
  const wordIdToEnglish = new Map<number, string>()
  for (const r of wordRows) {
    wordIdToEnglish.set(r.id, r.english)
  }

  // Batch: barcha progresslarni birdaniga olish
  const { data: progressRows } = await supabase
    .from('vocabulary_progress')
    .select('word_id, next_review')
    .eq('user_id', userId)
    .in('word_id', wordIds)

  if (!progressRows || progressRows.length === 0) return

  // Har birini kechiktirish
  const now = new Date()
  const updates: { word_id: number; next_review: string }[] = []

  for (const row of progressRows) {
    const currentDue = new Date(row.next_review + 'T00:00:00')
    const baseDate = currentDue > now ? currentDue : now
    baseDate.setDate(baseDate.getDate() + CONFUSABLE_DELAY_DAYS)
    const newDue = baseDate.toISOString().split('T')[0]

    updates.push({ word_id: row.word_id, next_review: newDue })
  }

  // Parallel individual UPDATE — bu yerda har bir partner uchun alohida qiymat
  // kerak (next_review har xil), shuning uchun batch upsert ishlamaydi
  // (upsert butun qatorni o'rniga yozadi, qolgan ustunlar yo'qoladi).
  // Promise.all orqali parallel ishga tushiriladi, ketma-ket emas.
  await Promise.all(updates.map(u =>
    supabase
      .from('vocabulary_progress')
      .update({ next_review: u.next_review })
      .eq('user_id', userId)
      .eq('word_id', u.word_id)
  ))

  monitoring.captureMessage(
    `delayConfusablePartners: ${updates.length} partners delayed (user ${userId.slice(0, 8)}...)`,
    'info'
  )
}
