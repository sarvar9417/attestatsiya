import Dexie, { type Table } from 'dexie'
import type { DailyLesson } from '../data/dailyLessons'

// --- Jadval turlari ---

export interface PronunciationErrorRecord {
  id?: number
  soundId: string       // 'th-voiceless', 'w-v', etc.
  word: string          // xato qilingan so'z
  ipa: string           // to'g'ri IPA
  tip: string           // o'zbekcha maslahat
  score: number         // overall pronunciation score 0-100
  context: 'pronunciation' | 'shadow' | 'speaking-path'
  refId?: string        // phrase.id yoki chunk.id
  createdAt: number     // Date.now()
}

export interface Session {
  id?: number
  date: string            // 'YYYY-MM-DD'
  type: 'grammar' | 'vocabulary' | 'listening' | 'writing' | 'mock-test' | 'ai-chat'
  durationMinutes: number
  xpEarned: number
  notes?: string
  createdAt: number       // Date.now()
}

export interface VocabularyWord {
  id?: number
  word: string
  translation: string
  phonetic?: string
  exampleSentence?: string
  level: 'A2' | 'B1' | 'B2'
  category: string        // masalan: 'travel', 'business', 'daily'
  srsInterval: number     // Spaced repetition: soniyalarda keyingi takrorlash
  srsRepetitions: number
  srsEaseFactor: number   // SuperMemo SM-2
  nextReviewAt: number    // timestamp
  learnedAt: number
  masteryLevel: 0 | 1 | 2 | 3 | 4 | 5
}

export interface DailyProgress {
  id?: number
  date: string            // 'YYYY-MM-DD'
  day: number             // 1–90
  week: number            // 1–13
  totalMinutes: number
  grammarMinutes: number
  vocabMinutes: number
  listeningMinutes: number
  writingMinutes: number
  xpEarned: number
  streak: number
  grammarPct: number
  vocabPct: number
  listeningPct: number
  writingPct: number
  checklistCompleted: number  // 0–6
}

export interface Writing {
  id?: number
  date: string
  day: number
  prompt: string
  userText: string
  wordCount: number
  aiFeedback?: string
  score?: number          // 0–10
  correctedText?: string
  createdAt: number
}

export interface MockTest {
  id?: number
  date: string
  day: number
  week: number
  type: 'weekly' | 'monthly' | 'final'
  sections: {
    reading: number       // 0–100
    listening: number
    grammar: number
    writing: number
    speaking?: number
  }
  totalScore: number
  level: string           // 'A2+', 'B1', 'B1+', 'B2'
  durationMinutes: number
  feedback?: string
  createdAt: number
}

export interface LessonProgress {
  id?: number
  userId: string      // Added for user isolation
  lessonId: string
  date: string
  score: number       // 0–100
  correctCount: number
  totalExercises: number
  xpEarned: number
  completedAt: number // timestamp
}

export interface Stats {
  id?: number
  key: string             // 'total_words_learned', 'total_sessions', va h.k.
  value: number
  updatedAt: number
}

export type WordStatus = 'new' | 'learning' | 'known'

export interface CatalogEntry {
  word:           string    // primary key
  translation:    string
  phonetic:       string
  exampleSentence:string
  status:         WordStatus
  filledAt:       number    // when Claude generated the card
}

// ─── Sync Queue Item — offline->online sync uchun ─────────────────────────

export interface SyncQueueItem {
  id?: number
  /** Supabase table nomi */
  table: string
  /** Operatsiya turi */
  operation: 'upsert' | 'insert' | 'update' | 'delete'
  /** Supabase ga yuboriladigan data */
  data: Record<string, unknown>
  /** Conflict field (upsert uchun: onConflict) */
  conflictField?: string
  /** WHERE filter (update/delete uchun) */
  filterField?: string
  filterValue?: unknown
  /** Prioritet (yuqori = avval) */
  priority: number
  /** Urinishlar soni */
  retries: number
  /** Maksimal urinishlar */
  maxRetries: number
  /** Oxirgi xatolik */
  lastError: string | null
  /** Yaratilgan vaqt */
  createdAt: number
  /** Keyingi urinish vaqti */
  nextRetryAt: number
}

// --- Dexie DB ---

class EnglishPathDB extends Dexie {
  sessions!: Table<Session>
  vocabulary!: Table<VocabularyWord>
  dailyProgress!: Table<DailyProgress>
  writings!: Table<Writing>
  mockTests!: Table<MockTest>
  stats!: Table<Stats>
  catalog!: Table<CatalogEntry>
  lessonProgress!: Table<LessonProgress>
  cachedLessons!: Table<DailyLesson & { cached_at: string }>
  pronunciationErrors!: Table<PronunciationErrorRecord>
  syncQueue!: Table<SyncQueueItem>

  constructor() {
    super('EnglishPathDB')

    this.version(1).stores({
      sessions:      '++id, date, type, createdAt',
      vocabulary:    '++id, word, level, category, nextReviewAt, masteryLevel',
      dailyProgress: '++id, &date, day, week',
      writings:      '++id, date, day, createdAt',
      mockTests:     '++id, date, day, week, type, createdAt',
      stats:         '++id, &key, updatedAt',
    })

    this.version(2).stores({
      sessions:      '++id, date, type, createdAt',
      vocabulary:    '++id, word, level, category, nextReviewAt, masteryLevel',
      dailyProgress: '++id, &date, day, week',
      writings:      '++id, date, day, createdAt',
      mockTests:     '++id, date, day, week, type, createdAt',
      stats:         '++id, &key, updatedAt',
      catalog:       '&word, status',
    })

    this.version(3).stores({
      sessions:      '++id, date, type, createdAt',
      vocabulary:    '++id, word, level, category, nextReviewAt, masteryLevel',
      dailyProgress: '++id, &date, day, week',
      writings:      '++id, date, day, createdAt',
      mockTests:     '++id, date, day, week, type, createdAt',
      stats:         '++id, &key, updatedAt',
      catalog:       '&word, status',
      lessonProgress: '++id, lessonId, date, completedAt',
    })

    this.version(4).stores({
      sessions:      '++id, date, type, createdAt',
      vocabulary:    '++id, word, level, category, nextReviewAt, masteryLevel',
      dailyProgress: '++id, &date, day, week',
      writings:      '++id, date, day, createdAt',
      mockTests:     '++id, date, day, week, type, createdAt',
      stats:         '++id, &key, updatedAt',
      catalog:       '&word, status',
      lessonProgress: '++id, userId, lessonId, date, completedAt',
      cachedLessons: 'id, level, day, cached_at',
    })

    this.version(5).stores({
      sessions:      '++id, date, type, createdAt',
      vocabulary:    '++id, word, level, category, nextReviewAt, masteryLevel',
      dailyProgress: '++id, &date, day, week',
      writings:      '++id, date, day, createdAt',
      mockTests:     '++id, date, day, week, type, createdAt',
      stats:         '++id, &key, updatedAt',
      catalog:       '&word, status',
      lessonProgress: '++id, userId, lessonId, date, completedAt',
      cachedLessons: 'id, level, day, cached_at',
    })

    this.version(6).stores({
      sessions:      '++id, date, type, createdAt',
      vocabulary:    '++id, word, level, category, nextReviewAt, masteryLevel',
      dailyProgress: '++id, &date, day, week',
      writings:      '++id, date, day, createdAt',
      mockTests:     '++id, date, day, week, type, createdAt',
      stats:         '++id, &key, updatedAt',
      catalog:       '&word, status',
      lessonProgress: '++id, userId, lessonId, date, completedAt',
      cachedLessons: 'id, level, day, cached_at',
      pronunciationErrors: '++id, soundId, context, createdAt',
    })

    this.version(7).stores({
      sessions:      '++id, date, type, createdAt',
      vocabulary:    '++id, word, level, category, nextReviewAt, masteryLevel',
      dailyProgress: '++id, &date, day, week',
      writings:      '++id, date, day, createdAt',
      mockTests:     '++id, date, day, week, type, createdAt',
      stats:         '++id, &key, updatedAt',
      catalog:       '&word, status',
      lessonProgress: '++id, userId, lessonId, date, completedAt',
      cachedLessons: 'id, level, day, cached_at',
      pronunciationErrors: '++id, soundId, context, createdAt',
      syncQueue:     '++id, [priority+nextRetryAt], priority, nextRetryAt, createdAt',
    })
  }
}

export const db = new EnglishPathDB()

// --- Helper funksiyalar ---

export async function addSession(session: Omit<Session, 'id'>): Promise<number> {
  return db.sessions.add(session) as Promise<number>
}

export async function getTodaySessions(date: string): Promise<Session[]> {
  return db.sessions.where('date').equals(date).toArray()
}

export async function addVocabWord(word: Omit<VocabularyWord, 'id'>): Promise<number> {
  return db.vocabulary.add(word) as Promise<number>
}

export async function getWordsForReview(now = Date.now()): Promise<VocabularyWord[]> {
  return db.vocabulary.where('nextReviewAt').belowOrEqual(now).toArray()
}

export async function upsertDailyProgress(progress: Omit<DailyProgress, 'id'>): Promise<void> {
  const existing = await db.dailyProgress.where('date').equals(progress.date).first()
  if (existing?.id) {
    await db.dailyProgress.update(existing.id, progress)
  } else {
    await db.dailyProgress.add(progress)
  }
}

export async function getDailyProgressRange(
  startDate: string,
  endDate: string
): Promise<DailyProgress[]> {
  return db.dailyProgress
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray()
}

export async function addWriting(writing: Omit<Writing, 'id'>): Promise<number> {
  return db.writings.add(writing) as Promise<number>
}

export async function addMockTest(test: Omit<MockTest, 'id'>): Promise<number> {
  return db.mockTests.add(test) as Promise<number>
}

export async function upsertLessonProgress(progress: Omit<LessonProgress, 'id'>): Promise<void> {
  const existing = await db.lessonProgress
    .where('userId').equals(progress.userId)
    .and((lp) => lp.lessonId === progress.lessonId && lp.date === progress.date)
    .first()
  if (existing?.id) {
    await db.lessonProgress.update(existing.id, progress)
  } else {
    await db.lessonProgress.add(progress)
  }
}

export async function getLessonProgress(lessonId: string, date: string, userId: string): Promise<LessonProgress | undefined> {
  return db.lessonProgress
    .where('userId').equals(userId)
    .and((lp) => lp.lessonId === lessonId && lp.date === date)
    .first()
}

export async function getAllLessonProgress(userId: string, date?: string): Promise<LessonProgress[]> {
  if (date) {
    return db.lessonProgress
      .where('userId').equals(userId)
      .and((lp) => lp.date === date)
      .toArray()
  }
  return db.lessonProgress.where('userId').equals(userId).toArray()
}

export async function getBestLessonScore(lessonId: string, userId: string): Promise<number | null> {
  const rows = await db.lessonProgress
    .where('userId').equals(userId)
    .and((lp) => lp.lessonId === lessonId)
    .toArray()
  if (!rows.length) return null
  return Math.max(...rows.map(r => r.score))
}

export async function clearAllLessonProgress(): Promise<void> {
  await db.lessonProgress.clear()
}

/**
 * Foydalanuvchiga oid BARCHA local ma'lumotni tozalaydi (user almashganda /
 * chiqishda). Bu jadvallar userId bilan scoped emas, shuning uchun boshqa
 * foydalanuvchiga ko'rinib qolmasligi uchun to'liq tozalanadi.
 * (cachedLessons — bu user ma'lumoti emas, balki dars kontenti keshi — saqlanadi)
 */
export async function clearLocalUserData(): Promise<void> {
  await Promise.all([
    db.lessonProgress.clear(),
    db.vocabulary.clear(),
    db.sessions.clear(),
    db.dailyProgress.clear(),
    db.writings.clear(),
    db.mockTests.clear(),
    db.catalog.clear(),
    db.stats.clear(),
  ])
}

export async function getStat(key: string): Promise<number> {
  const row = await db.stats.where('key').equals(key).first()
  return row?.value ?? 0
}

// ─── Lesson cache (offline support) ──────────────────────────────────────

export async function cacheLesson(lesson: DailyLesson): Promise<void> {
  await db.cachedLessons.put({
    ...lesson,
    cached_at: new Date().toISOString(),
  })
}

export async function getCachedLesson(id: string): Promise<(DailyLesson & { cached_at: string }) | undefined> {
  return db.cachedLessons.get(id)
}

export async function getCachedLessons(): Promise<DailyLesson[]> {
  return db.cachedLessons.toArray()
}

export async function clearLessonCache(): Promise<void> {
  await db.cachedLessons.clear()
}

export async function incrementStat(key: string, by = 1): Promise<void> {
  const existing = await db.stats.where('key').equals(key).first()
  if (existing?.id) {
    await db.stats.update(existing.id, {
      value: (existing.value ?? 0) + by,
      updatedAt: Date.now(),
    })
  } else {
    await db.stats.add({ key, value: by, updatedAt: Date.now() })
  }
}
