import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { upsertLessonProgress as dbUpsert, cacheLesson, getCachedLessons, getCachedLesson } from '../db/database'
import { getTodayTashkent } from '../utils/tashkentDate'
import { monitoring } from '../lib/monitoring'
import { mergeLessonProgress, mergeLessonSession } from './conflictResolution'
import type { DailyLesson, SpecialCase, ReviewLesson, ReadingSection, WritingSection, ListeningSection } from '../data/dailyLessons'

interface LessonRow {
  id: string
  title: string
  subtitle: string
  level: string
  day: number
  category: string | null
  data: {
    formulas: { label: string; structure: string; color: string }[]
    rules: string[]
    vocabulary: { en: string; uz: string; example: string; rule: string }[]
    examples: { en: string; uz: string }[]
    specialCases: SpecialCase[]
    exercises: import('../data/dailyLessons').DailyExercise[]
    exerciseSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
    tests: import('../data/dailyLessons').DailyExercise[]
    testSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
  }
}

interface ReviewLessonRow {
  id: string
  title: string
  subtitle: string
  level: string
  after_day: number
  data: {
    coversDays: number[]
    coversTopics: string[]
    keyRules?: { topic: string; icon: string; color: string; rules: string[] }[]
    exercises: import('../data/dailyLessons').DailyExercise[]
    exerciseSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
    tests: import('../data/dailyLessons').DailyExercise[]
    testSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
  }
}

function castReviewLesson(row: ReviewLessonRow): ReviewLesson {
  return {
    id: row.id,
    type: 'review',
    title: row.title,
    subtitle: row.subtitle,
    level: row.level,
    afterDay: row.after_day,
    coversDays: row.data.coversDays ?? [],
    coversTopics: row.data.coversTopics ?? [],
    keyRules: row.data.keyRules,
    exercises: row.data.exercises ?? [],
    exerciseSections: row.data.exerciseSections ?? [],
    tests: row.data.tests ?? [],
    testSections: row.data.testSections ?? [],
  }
}

function castLesson(row: LessonRow): DailyLesson {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    level: row.level,
    day: row.day,
    category: row.category ?? undefined,
    formulas: row.data.formulas ?? [],
    rules: row.data.rules ?? [],
    vocabulary: row.data.vocabulary ?? [],
    examples: row.data.examples ?? [],
    specialCases: row.data.specialCases ?? [],
    exercises: row.data.exercises ?? [],
    exerciseSections: row.data.exerciseSections ?? [],
    tests: row.data.tests ?? [],
    testSections: row.data.testSections ?? [],
  }
}

let cachedLessons: (DailyLesson | ReviewLesson)[] | null = null

export function clearLessonCache(): void {
  cachedLessons = null
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number, label = 'Operation'): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout (${ms}ms)`)), ms)
    ),
  ])
}

export async function fetchLessons(): Promise<(DailyLesson | ReviewLesson)[]> {
  if (cachedLessons) return cachedLessons

  let data: any = null
  let error: any = null
  try {
    const result = await withTimeout(
      supabase.from('lessons').select('*').order('day', { ascending: true }),
      10_000,
      'Supabase lessons fetch'
    )
    data = result.data
    error = result.error
  } catch (e: any) {
    error = e
  }

  if (error) {
    monitoring.captureMessage('Supabase lessons fetch failed, trying cache: ' + error.message, 'warn')
    const cached = await getCachedLessons()
    if (cached.length > 0) {
      monitoring.captureMessage('Offline: lessons from cache', 'info')
      cachedLessons = cached
      return cached
    }
    monitoring.captureMessage('No cached lessons, using local fallback', 'warn')
    cachedLessons = await fallbackLessons()
    return cachedLessons
  }

  if (!data || data.length === 0) {
    monitoring.captureMessage('No lessons found in Supabase, using local fallback', 'warn')
    cachedLessons = await fallbackLessons()
    return cachedLessons
  }

  const { loadAllLessons } = await import('../data/dailyLessons')
  const DAILY_LESSONS = await loadAllLessons()
  const supabaseLessons = (Array.isArray(data) ? data : []).map(r => castLesson(db.cast<LessonRow>(r)))
  const localById = new Map(DAILY_LESSONS.map(l => [l.id, l]))
  const supabaseIds = new Set(supabaseLessons.map(l => l.id))
  // Darslar TO'PLAMI va TARTIBI lokal kurikulum bilan belgilanadi. Supabase faqat
  // lokalда MAVJUD darslar uchun manba bo'la oladi; Supabase'dagi eski/ortiqcha
  // (lokalда yo'q) darslar ko'rsatilmaydi — aks holda ular oxirgi darsdan keyin
  // tartibsiz (eski day qiymatlari bilan) qo'shilib ketadi.
  const localOverrideLessons = supabaseLessons
    .map(s => localById.get(s.id) ?? s)
    .filter(l => localById.has(l.id))
  const localExtraLessons = DAILY_LESSONS.filter(l => !supabaseIds.has(l.id))
  // Sort by original DAILY_LESSONS order (handles both DailyLesson and ReviewLesson)
  const orderMap = new Map(DAILY_LESSONS.map((l, i) => [l.id, i]))
  const mergedLessons = [...localOverrideLessons, ...localExtraLessons]
    .sort((a, b) => (orderMap.get(a.id) ?? 99999) - (orderMap.get(b.id) ?? 99999))

  for (const lesson of mergedLessons) {
    cacheLesson(lesson as DailyLesson).catch((e) => monitoring.captureMessage('cacheLesson (merged) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
  }
  monitoring.captureMessage(`Cached ${mergedLessons.length} lessons offline`, 'info')

  cachedLessons = mergedLessons
  return mergedLessons
}

export async function fetchReviewLessons(): Promise<ReviewLesson[]> {
  const { REVIEW_LESSONS } = await import('../data/daily/reviewLessons')

  try {
    const { data, error } = await supabase
      .from('review_lessons')
      .select('id')
      .order('after_day', { ascending: true })

    if (!error && data && data.length > 0) {
      const localIds = new Set(REVIEW_LESSONS.map(r => r.id))
      const supabaseOnlyIds = data.filter(r => !localIds.has(r.id)).map(r => r.id)
      if (supabaseOnlyIds.length > 0) {
        const { data: extra } = await supabase
          .from('review_lessons')
          .select('*')
          .in('id', supabaseOnlyIds)
        const extraReviews = (extra ?? []).map(r => castReviewLesson(r as ReviewLessonRow))
        const allReviews = [...REVIEW_LESSONS, ...extraReviews]
        for (const review of allReviews) {
          cacheLesson(db.cast<DailyLesson>(review)).catch((e) => monitoring.captureMessage('cacheLesson (review) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
        }
        return allReviews
      }
    }
  } catch {
    monitoring.captureMessage('Supabase review lessons fetch failed, trying cache', 'warn')
    const cached = await getCachedLessons()
    if (cached.length > 0) {
      monitoring.captureMessage('Offline: review lessons from cache', 'info')
      return db.cast<ReviewLesson[]>(cached)
    }
  }

  return REVIEW_LESSONS
}

export async function fetchLesson(id: string): Promise<(DailyLesson | ReviewLesson) | null> {
  let data: any = null
  let error: any = null
  try {
    const result = await withTimeout(
      supabase.from('lessons').select('*').eq('id', id).maybeSingle(),
      8_000,
      'Supabase lesson fetch'
    )
    data = result.data
    error = result.error
  } catch (e: any) {
    error = e
  }

  if (error || !data) {
    monitoring.captureMessage('Supabase lesson fetch failed, trying cache: ' + (error?.message ?? 'unknown'), 'warn')
    const cached = await getCachedLesson(id)
    if (cached) {
      monitoring.captureMessage('Offline: lesson from cache', 'info')
      return cached
    }
    const { loadAllLessons } = await import('../data/dailyLessons')
    const DAILY_LESSONS = await loadAllLessons()
    return DAILY_LESSONS.find(l => l.id === id) || null
  }

  if (!data || typeof data !== 'object') return null
  const lesson = castLesson(db.cast<LessonRow>(data))
  cacheLesson(lesson).catch((e) => monitoring.captureMessage('cacheLesson (single) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
  return lesson
}

export async function pushLessonProgress(
  lessonId: string,
  correctCount: number,
  totalExercises: number
): Promise<void> {
  const pct = totalExercises > 0 ? Math.round((correctCount / totalExercises) * 100) : 0
  const date = getTodayTashkent()
  const now = Date.now()

  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id ?? 'anonymous'
  
  if (session) {
    // Smart merge: fetch existing row and merge scores/counts
    const { data: existing } = await supabase
      .from('lesson_progress')
      .select('score, correct_count, total_exercises, xp_earned, completed_at')
      .eq('user_id', session.user.id)
      .eq('lesson_id', lessonId)
      .eq('date', date)
      .maybeSingle()

    let merged = { score: pct, correctCount, totalExercises, xpEarned: correctCount * 10, completedAt: now }
    if (existing) {
      merged = mergeLessonProgress({
        localScore: pct,
        remoteScore: existing.score ?? 0,
        localCorrectCount: correctCount,
        remoteCorrectCount: existing.correct_count ?? 0,
        localTotalExercises: totalExercises,
        remoteTotalExercises: existing.total_exercises ?? 0,
        localXpEarned: correctCount * 10,
        remoteXpEarned: existing.xp_earned ?? 0,
        localCompletedAt: now,
        remoteCompletedAt: new Date(existing.completed_at as string).getTime(),
      })
    }

    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: session.user.id,
        date,
        lesson_id: lessonId,
        score: merged.score,
        correct_count: merged.correctCount,
        total_exercises: merged.totalExercises,
        xp_earned: merged.xpEarned,
        completed_at: new Date(merged.completedAt).toISOString(),
      }, { onConflict: 'user_id,date,lesson_id' })

    if (error) monitoring.captureMessage('pushLessonProgress upsert error: ' + error.message, 'warn')
  }

  await dbUpsert({
    userId,
    lessonId,
    date,
    score: pct,
    correctCount,
    totalExercises,
    xpEarned: correctCount * 10,
    completedAt: now,
  })
}

export async function pushTestProgress(
  lessonId: string,
  _sectionTitle: string,
  correctCount: number,
  totalQuestions: number
): Promise<void> {
  const testLessonId = `${lessonId}__test`
  const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const date = getTodayTashkent()
  const now = Date.now()

  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id ?? 'anonymous'
  
  if (session) {
    // Smart merge: fetch existing row
    const { data: existing } = await supabase
      .from('lesson_progress')
      .select('score, correct_count, total_exercises, xp_earned, completed_at')
      .eq('user_id', session.user.id)
      .eq('lesson_id', testLessonId)
      .eq('date', date)
      .maybeSingle()

    let merged = { score: pct, correctCount, totalExercises: totalQuestions, xpEarned: correctCount * 10, completedAt: now }
    if (existing) {
      merged = mergeLessonProgress({
        localScore: pct,
        remoteScore: existing.score ?? 0,
        localCorrectCount: correctCount,
        remoteCorrectCount: existing.correct_count ?? 0,
        localTotalExercises: totalQuestions,
        remoteTotalExercises: existing.total_exercises ?? 0,
        localXpEarned: correctCount * 10,
        remoteXpEarned: existing.xp_earned ?? 0,
        localCompletedAt: now,
        remoteCompletedAt: new Date(existing.completed_at as string).getTime(),
      })
    }

    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: session.user.id,
        date,
        lesson_id: testLessonId,
        score: merged.score,
        correct_count: merged.correctCount,
        total_exercises: merged.totalExercises,
        xp_earned: merged.xpEarned,
        completed_at: new Date(merged.completedAt).toISOString(),
      }, { onConflict: 'user_id,date,lesson_id' })

    if (error) monitoring.captureMessage('pushTestProgress upsert error: ' + error.message, 'warn')
  }

  await dbUpsert({
    userId,
    lessonId: testLessonId,
    date,
    score: pct,
    correctCount,
    totalExercises: totalQuestions,
    xpEarned: correctCount * 10,
    completedAt: now,
  })
}

export async function getTestProgress(lessonId: string): Promise<number | null> {
  const testLessonId = `${lessonId}__test`
  return getLessonProgressRaw(testLessonId)
}

async function getLessonProgressRaw(lessonId: string): Promise<number | null> {
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id ?? 'anonymous'
  
  if (session) {
    // Barcha vaqtdagi eng yuqori natijani qaytaradi
    const { data } = await supabase
      .from('lesson_progress')
      .select('score')
      .eq('user_id', session.user.id)
      .eq('lesson_id', lessonId)
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) return data.score
  }

  // Local fallback — eng yuqori score
  const { getBestLessonScore } = await import('../db/database')
  return getBestLessonScore(lessonId, userId)
}

export async function getLessonProgress(lessonId: string): Promise<number | null> {
  return getLessonProgressRaw(lessonId)
}

export async function fetchAllLessonProgress(): Promise<Record<string, number>> {
  const result: Record<string, number> = {}

  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id ?? 'anonymous'
  
  if (session) {
    try {
      const { data } = await withTimeout(
        supabase
          .from('lesson_progress')
          .select('lesson_id, score')
          .eq('user_id', session.user.id)
          .order('completed_at', { ascending: false }),
        8_000,
        'fetchAllLessonProgress'
      )
      if (data) {
        for (const row of data) {
          if (!(row.lesson_id in result)) {
            result[row.lesson_id] = row.score
          }
        }
      }
    } catch {
      // timeout — local fallback below
    }
  }

  // Supabase ishlamasa — local Dexie fallback (eng so'nggi)
  const { getAllLessonProgress } = await import('../db/database')
  const localRows = await getAllLessonProgress(userId)
  for (const row of localRows) {
    if (!(row.lessonId in result)) {
      result[row.lessonId] = row.score
    }
  }

  return result
}

// ─── Lesson sessions (cross-device resume) ───────────────────────────────

interface SessionPayload {
  tab: string
  currentSection: number
  testSection: number
  completedSections: Record<number, number>
  completedTestSections: Record<number, number>
}

export async function saveLessonSessionToDB(
  lessonId: string,
  data: SessionPayload
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const now = Date.now()

  // Smart merge: fetch existing session and merge tab/section/progress
  const { data: existing } = await supabase
    .from('lesson_sessions')
    .select('tab, current_section, test_section, completed_sections, completed_test_sections, updated_at')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  if (existing) {
    const merged = mergeLessonSession({
      localTab: data.tab,
      remoteTab: existing.tab as string,
      localCurrentSection: data.currentSection,
      remoteCurrentSection: existing.current_section as number,
      localTestSection: data.testSection,
      remoteTestSection: existing.test_section as number,
      localCompletedSections: data.completedSections,
      remoteCompletedSections: db.jsonFrom<Record<number, number>>(existing.completed_sections) ?? {} as Record<number, number>,
      localCompletedTestSections: data.completedTestSections,
      remoteCompletedTestSections: db.jsonFrom<Record<number, number>>(existing.completed_test_sections) ?? {} as Record<number, number>,
      localUpdatedAt: now,
      remoteUpdatedAt: new Date(existing.updated_at as string).getTime(),
    })

    await supabase.from('lesson_sessions').upsert({
      user_id: session.user.id,
      lesson_id: lessonId,
      tab: merged.tab,
      current_section: merged.currentSection,
      test_section: merged.testSection,
      completed_sections: merged.completedSections,
      completed_test_sections: merged.completedTestSections,
      updated_at: new Date(merged.updatedAt).toISOString(),
    }, { onConflict: 'user_id,lesson_id' })
  } else {
    await supabase.from('lesson_sessions').upsert({
      user_id: session.user.id,
      lesson_id: lessonId,
      tab: data.tab,
      current_section: data.currentSection,
      test_section: data.testSection,
      completed_sections: data.completedSections,
      completed_test_sections: data.completedTestSections,
      updated_at: new Date(now).toISOString(),
    }, { onConflict: 'user_id,lesson_id' })
  }
}

export async function clearLessonSessionFromDB(lessonId: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  await supabase
    .from('lesson_sessions')
    .delete()
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
}

export interface LoadedLessonSession {
  tab: string
  currentSection: number
  testSection: number
  completedSections: Record<number, number>
  completedTestSections: Record<number, number>
  vocabDone?: boolean
  updatedAt: number
}

export async function loadLessonSessionFromDB(lessonId: string): Promise<LoadedLessonSession | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data } = await supabase
    .from('lesson_sessions')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  if (!data) return null

  return {
    tab: data.tab as string,
    currentSection: data.current_section as number,
    testSection: data.test_section as number,
    completedSections: db.jsonFrom<Record<number, number>>(data.completed_sections) ?? {} as Record<number, number>,
    completedTestSections: db.jsonFrom<Record<number, number>>(data.completed_test_sections) ?? {} as Record<number, number>,
    updatedAt: new Date(data.updated_at as string).getTime(),
  }
}

// ─── Local session cache (auth'siz / offline resume, refresh'da saqlanadi) ──
// Pozitsiya faqat Supabase'da bo'lsa, login qilmagan foydalanuvchi sahifani
// yangilaganda joyi yo'qoladi. Shu sabab har bir sessiya localStorage'ga ham
// yoziladi. Kalit user-switch/signOut'da App.tsx tomonidan avtomatik tozalanadi
// (auth-token va theme'dan tashqari hamma kalit o'chiriladi).
const LOCAL_SESSION_PREFIX = 'lesson-session-'

export function saveLessonSessionLocal(lessonId: string, data: SessionPayload, updatedAt: number = Date.now()): void {
  try {
    localStorage.setItem(LOCAL_SESSION_PREFIX + lessonId, JSON.stringify({ ...data, updatedAt }))
  } catch (e) { /* quota / SSR guard */
    monitoring.captureMessage('saveLessonSessionLocal failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
  }
}

export function loadLessonSessionLocal(lessonId: string): LoadedLessonSession | null {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_PREFIX + lessonId)
    if (!raw) return null
    const d = JSON.parse(raw)
    return {
      tab: d.tab ?? 'theory',
      currentSection: d.currentSection ?? 0,
      testSection: d.testSection ?? 0,
      completedSections: d.completedSections ?? {},
      completedTestSections: d.completedTestSections ?? {},
      updatedAt: d.updatedAt ?? 0,
    }
  } catch { return null }
}

export function clearLessonSessionLocal(lessonId: string): void {
  try { localStorage.removeItem(LOCAL_SESSION_PREFIX + lessonId) } catch (e) {
    monitoring.captureMessage('clearLessonSessionLocal failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
  }
}

export function loadAllLessonSessionsLocal(): Record<string, LoadedLessonSession> {
  const out: Record<string, LoadedLessonSession> = {}
  try {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith(LOCAL_SESSION_PREFIX)) continue
      const s = loadLessonSessionLocal(key.slice(LOCAL_SESSION_PREFIX.length))
      if (s) out[key.slice(LOCAL_SESSION_PREFIX.length)] = s
    }
  } catch (e) {
    monitoring.captureMessage('loadAllLessonSessionsLocal failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
  }
  return out
}

// ─── Exercise answers (per-exercise granularity) ─────────────────────────

export interface ExerciseAnswerPayload {
  exerciseId: number
  exerciseType: string
  answer: string[]
  isCorrect: boolean
}

export async function saveExerciseAnswersToDB(
  lessonId: string,
  sectionIndex: number,
  sectionType: 'exercise' | 'test' | 'drill',
  answers: ExerciseAnswerPayload[]
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  const rows = answers.map(a => ({
    user_id: session.user.id,
    lesson_id: lessonId,
    section_index: sectionIndex,
    exercise_id: a.exerciseId,
    exercise_type: a.exerciseType,
    section_type: sectionType,
    answer: JSON.stringify(a.answer),
    is_correct: a.isCorrect,
    submitted_at: new Date().toISOString(),
  }))

  if (rows.length === 0) return

  await supabase.from('lesson_exercise_answers').upsert(
    rows,
    { onConflict: 'user_id,lesson_id,exercise_id,section_type', ignoreDuplicates: false }
  )
}

// "Tozlash" — bitta bo'lim (section) javoblarini DB'dan butunlay o'chiradi, shunda
// foydalanuvchi mashqni noldan qayta bajara oladi (qayta yuklanganda tiklanmaydi).
export async function clearExerciseAnswersFromDB(
  lessonId: string,
  sectionIndex: number,
  sectionType: 'exercise' | 'test' | 'drill'
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  const { error } = await supabase.from('lesson_exercise_answers')
    .delete()
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .eq('section_index', sectionIndex)
    .eq('section_type', sectionType)

  if (error) monitoring.captureMessage('clearExerciseAnswersFromDB error: ' + error.message, 'warn')
}

export interface LoadedExerciseAnswer {
  exerciseId: number
  exerciseType: string
  answer: string[]
  isCorrect: boolean
  sectionIndex: number
  sectionType: string
}

export async function loadExerciseAnswersFromDB(lessonId: string): Promise<LoadedExerciseAnswer[]> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []

  const { data } = await supabase
    .from('lesson_exercise_answers')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .order('exercise_id', { ascending: true })

  if (!data) return []

  return (data as { exercise_id: number; exercise_type: string; answer: string; is_correct: boolean; section_index: number; section_type: string }[]).map(d => ({
    exerciseId: d.exercise_id,
    exerciseType: d.exercise_type,
    answer: typeof d.answer === 'string' ? JSON.parse(d.answer) : db.cast<string[]>(d.answer),
    isCorrect: d.is_correct,
    sectionIndex: d.section_index,
    sectionType: d.section_type,
  }))
}

// ─── Lesson vocab progress ───────────────────────────────────────────────

export interface VocabProgressPayload {
  wordIndex: number
  known: boolean
  quizCorrect: number
  quizWrong: number
}

export async function saveLessonVocabProgressToDB(
  lessonId: string,
  items: VocabProgressPayload[]
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  if (!items.length) return

  const rows = items.map((item) => ({
    user_id: session.user.id,
    lesson_id: lessonId,
    word_index: item.wordIndex,
    known: item.known,
    quiz_correct: item.quizCorrect,
    quiz_wrong: item.quizWrong,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from('lesson_vocab_progress').upsert(
    rows,   
    {
    onConflict: 'user_id,lesson_id,word_index',
    ignoreDuplicates: false,
  })
  if (error) monitoring.captureMessage('batch upsert lesson vocab failed: ' + error.message, 'error')
}

export interface LoadedVocabProgress {
  wordIndex: number
  known: boolean
  quizCorrect: number
  quizWrong: number
}

export async function loadLessonVocabProgressFromDB(lessonId: string): Promise<LoadedVocabProgress[]> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []

  const { data } = await supabase
    .from('lesson_vocab_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .order('word_index', { ascending: true })

  if (!data) return []

  return (data as { word_index: number; known: boolean; quiz_correct: number; quiz_wrong: number }[]).map(d => ({
    wordIndex: d.word_index,
    known: d.known,
    quizCorrect: d.quiz_correct,
    quizWrong: d.quiz_wrong,
  }))
}

// ─── Viewed tabs ─────────────────────────────────────────────────────────

export async function saveViewedTabsToDB(
  lessonId: string,
  viewedTabs: string[]
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  await supabase.from('lesson_viewed_tabs').upsert({
    user_id: session.user.id,
    lesson_id: lessonId,
    viewed_tabs: JSON.stringify(viewedTabs),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' })
}

async function fallbackLessons(): Promise<(DailyLesson | ReviewLesson)[]> {
  const { loadAllLessons } = await import('../data/dailyLessons')
  return loadAllLessons()
}

// ─── Lesson skills (reading/writing/listening) ─────────────────────────

import type { Json } from '../types/supabase'

interface LessonSkillsRow {
  lesson_id: string
  reading?: Json | null
  writing?: Json | null
  listening?: Json | null
}

export async function fetchLessonSkills(): Promise<Record<string, { reading?: ReadingSection; writing?: WritingSection; listening?: ListeningSection }>> {
  let data: any = null
  let error: any = null
  try {
    const result = await withTimeout(
      supabase.from('lesson_skills').select('*'),
      8_000,
      'fetchLessonSkills'
    )
    data = result.data
    error = result.error
  } catch (e: any) {
    error = e
  }

  type LessonSkillsMap = Record<string, { reading?: ReadingSection; writing?: WritingSection; listening?: ListeningSection }>

  if (error) {
    monitoring.captureMessage('Supabase lesson_skills fetch failed, using local fallback: ' + error.message, 'warn')
    const { LESSON_SKILLS } = await import('../data/lessonSkillsContent')
    return LESSON_SKILLS as LessonSkillsMap
  }

  if (!data || data.length === 0) {
    monitoring.captureMessage('No lesson_skills found in Supabase, using local fallback', 'warn')
    const { LESSON_SKILLS } = await import('../data/lessonSkillsContent')
    return LESSON_SKILLS as LessonSkillsMap
  }

  const result: LessonSkillsMap = {}
  for (const row of data as LessonSkillsRow[]) {
    const entry: { reading?: ReadingSection; writing?: WritingSection; listening?: ListeningSection } = {}
    if (row.reading) entry.reading = db.jsonFrom<ReadingSection>(row.reading) ?? undefined
    if (row.writing) entry.writing = db.jsonFrom<WritingSection>(row.writing) ?? undefined
    if (row.listening) entry.listening = db.jsonFrom<ListeningSection>(row.listening) ?? undefined
    result[row.lesson_id] = entry
  }

  // Merge with any local-only skills not in DB
  const { LESSON_SKILLS } = await import('../data/lessonSkillsContent')
  for (const [id, skills] of Object.entries(LESSON_SKILLS)) {
    if (!result[id]) {
      result[id] = skills as LessonSkillsMap[string]
      monitoring.captureMessage(`Lesson skill ${id} not in DB, using local fallback`, 'warn')
    }
  }

  return result
}

// Bitta darsning skillsini yuklaydi (tez — bitta qator)
export async function fetchSingleLessonSkill(lessonId: string): Promise<{ reading?: ReadingSection; writing?: WritingSection; listening?: ListeningSection } | null> {
  let data: any = null
  let error: any = null
  try {
    const result = await withTimeout(
      supabase
        .from('lesson_skills')
        .select('reading, writing, listening')
        .eq('lesson_id', lessonId)
        .maybeSingle(),
      5_000,
      'fetchSingleLessonSkill'
    )
    data = result.data
    error = result.error
  } catch {
    // timeout
    error = true
  }

  if (error || !data) {
    // Lokal fallback
    try {
      const { LESSON_SKILLS } = await import('../data/lessonSkillsContent')
      const local = (LESSON_SKILLS as Record<string, { reading?: ReadingSection; writing?: WritingSection; listening?: ListeningSection }>)[lessonId]
      return local ?? null
    } catch { return null }
  }

  const entry: { reading?: ReadingSection; writing?: WritingSection; listening?: ListeningSection } = {}
  if (data.reading) entry.reading = db.jsonFrom<ReadingSection>(data.reading) ?? undefined
  if (data.writing) entry.writing = db.jsonFrom<WritingSection>(data.writing) ?? undefined
  if (data.listening) entry.listening = db.jsonFrom<ListeningSection>(data.listening) ?? undefined
  return entry
}

export async function loadViewedTabsFromDB(lessonId: string): Promise<string[]> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []

  const { data } = await supabase
    .from('lesson_viewed_tabs')
    .select('viewed_tabs')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  if (!data) return []

  const tabs = typeof data.viewed_tabs === 'string'
    ? JSON.parse(data.viewed_tabs)
    : db.jsonFrom<string[]>(data.viewed_tabs)
  return Array.isArray(tabs) ? tabs : []
}
