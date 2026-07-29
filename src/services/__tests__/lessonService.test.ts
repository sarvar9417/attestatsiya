import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchLessons,
  fetchLesson,
  pushLessonProgress,
  pushTestProgress,
  getLessonProgress,
  saveLessonSessionToDB,
  clearLessonSessionFromDB,
  loadLessonSessionFromDB,
  saveExerciseAnswersToDB,
  loadExerciseAnswersFromDB,
  saveLessonVocabProgressToDB,
  loadLessonVocabProgressFromDB,
  saveViewedTabsToDB,
  loadViewedTabsFromDB,
} from '../lessonService'
import { monitoring } from '../../lib/monitoring'
// ─── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockSupabaseInstance } = vi.hoisted(() => {
  const mockSupabaseInstance = {
    from: vi.fn(), rpc: vi.fn(),
    auth: { getSession: vi.fn() },
  }
  return { mockSupabaseInstance }
})

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))

const mockDbUpsert = vi.fn()
const mockDbGet = vi.fn()
const mockDbGetBestScore = vi.fn()
const mockDbGetAllProgress = vi.fn()
const mockCacheLesson = vi.fn().mockResolvedValue(undefined)
const mockGetCachedLessons = vi.fn().mockResolvedValue([])
const mockGetCachedLesson = vi.fn().mockResolvedValue(undefined)
vi.mock('../../db/database', () => ({
  upsertLessonProgress: (...args: unknown[]) => mockDbUpsert(...args),
  getLessonProgress: (...args: unknown[]) => mockDbGet(...args),
  getBestLessonScore: (...args: unknown[]) => mockDbGetBestScore(...args),
  getAllLessonProgress: (...args: unknown[]) => mockDbGetAllProgress(...args),
  cacheLesson: (...args: unknown[]) => mockCacheLesson(...args),
  getCachedLessons: (...args: unknown[]) => mockGetCachedLessons(...args),
  getCachedLesson: (...args: unknown[]) => mockGetCachedLesson(...args),
}))

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
}))

// Mock DAILY_LESSONS for local fallback
const mockDailyLessons = [
  { id: 'local-day-1', title: 'Local Lesson 1', subtitle: '', level: 'A2', day: 1,
    formulas: [], rules: [], vocabulary: [], examples: [],
    specialCases: [], exercises: [], exerciseSections: [],
    tests: [], testSections: [] },
  { id: 'local-day-2', title: 'Local Lesson 2', subtitle: '', level: 'B1', day: 2,
    formulas: [], rules: [], vocabulary: [], examples: [],
    specialCases: [], exercises: [], exerciseSections: [],
    tests: [], testSections: [] },
]

vi.mock('../../data/dailyLessons', () => ({
  DAILY_LESSONS: mockDailyLessons,
  loadAllLessons: vi.fn().mockResolvedValue(mockDailyLessons),
}))

import { buildQB } from '../../test/supabaseMock'

// ─── Mock session ──────────────────────────────────────────────────────────────

function mockSession(userId = 'auth-user-1') {
  mockSupabaseInstance.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: userId } } },
  })
}

function mockNoSession() {
  mockSupabaseInstance.auth.getSession.mockResolvedValue({
    data: { session: null },
  })
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T10:30:00Z'))
  mockDbUpsert.mockReset()
  mockDbGet.mockReset()
  mockDbGetBestScore.mockReset()
  mockDbGetAllProgress.mockResolvedValue([])
})

afterEach(() => {
  vi.useRealTimers()
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchLessons
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchLessons', () => {
  it('shows only the local curriculum; supabase-only lessons are excluded', async () => {
    const { qb, setResult } = buildQB()
    setResult([
      // bu id lokal kurikulumda YO'Q — ko'rsatilmasligi kerak (aks holda oxirga
      // tartibsiz qo'shilib ketadi)
      { id: 'db-day-1', title: 'DB 1', subtitle: 'sub', level: 'A2', day: 1, data: {} },
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchLessons()

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('lessons')
    expect(qb.select).toHaveBeenCalledWith('*')
    expect(qb.order).toHaveBeenCalledWith('day', { ascending: true })
    // Faqat lokal darslar; lokalда yo'q supabase darsi (db-day-1) chiqarib tashlanadi
    expect(result).toHaveLength(2)
    expect(result.map(l => l.id)).toEqual(['local-day-1', 'local-day-2'])
    expect(result.find(l => l.id === 'db-day-1')).toBeUndefined()
  })

  it('returns local fallback on supabase error', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('Network error'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchLessons()

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('local-day-1')
  })

  it('returns local fallback when data is empty', async () => {
    const { qb, setResult } = buildQB()
    setResult([], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchLessons()

    expect(result).toHaveLength(2)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchLesson
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchLesson', () => {
  it('returns lesson from supabase by id', async () => {
    const { qb, setResult } = buildQB()
    setResult(
      { id: 'db-day-1', title: 'DB 1', subtitle: 'sub', level: 'A2', day: 1, data: {} },
      null,
    )
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchLesson('db-day-1')

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('lessons')
    expect(qb.eq).toHaveBeenCalledWith('id', 'db-day-1')
    expect(qb.maybeSingle).toHaveBeenCalled()
    expect(result).not.toBeNull()
    expect(result!.id).toBe('db-day-1')
  })

  it('falls back to local lessons when supabase fails', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('Not found'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchLesson('local-day-1')

    expect(result).not.toBeNull()
    expect(result!.id).toBe('local-day-1')
  })

  it('returns null when lesson not found anywhere', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('Not found'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchLesson('nonexistent')

    expect(result).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  pushLessonProgress / pushTestProgress / getLessonProgress
// ═══════════════════════════════════════════════════════════════════════════════

describe('pushLessonProgress', () => {
  it('upserts to supabase and local DB when authenticated', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    await pushLessonProgress('lesson-1', 8, 10)

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'auth-user-1',
        lesson_id: 'lesson-1',
        score: 80,
        correct_count: 8,
        total_exercises: 10,
        xp_earned: 80,
        date: '2026-06-15',
      }),
      { onConflict: 'user_id,date,lesson_id' },
    )
    expect(mockDbUpsert).toHaveBeenCalled()
  })

  it('still saves to local DB even when not authenticated', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockNoSession()

    await pushLessonProgress('lesson-1', 4, 5)

    // Local upsert should still be called
    expect(mockDbUpsert).toHaveBeenCalled()
    // Supabase upsert should NOT have been called (no session)
    expect(qb.upsert).not.toHaveBeenCalled()
  })
})

describe('pushTestProgress', () => {
  it('appends __test suffix to lesson_id', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    await pushTestProgress('lesson-1', 'Grammar', 7, 10)

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        lesson_id: 'lesson-1__test',
        score: 70,
      }),
      expect.any(Object),
    )
  })
})

describe('getLessonProgress', () => {
  it('returns score from supabase when available', async () => {
    const { qb, setResult } = buildQB()
    setResult({ score: 85 }, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    const result = await getLessonProgress('lesson-1')

    expect(result).toBe(85)
  })

  it('returns null when no progress found', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()
    mockDbGetBestScore.mockResolvedValue(null)

    const result = await getLessonProgress('lesson-1')

    expect(result).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Lesson sessions
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveLessonSessionToDB', () => {
  it('upserts session to lesson_sessions', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    await saveLessonSessionToDB('lesson-1', {
      tab: 'rules',
      currentSection: 2,
      testSection: 0,
      completedSections: { 1: 100 },
      completedTestSections: {},
    })

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('lesson_sessions')
    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'auth-user-1',
        lesson_id: 'lesson-1',
        tab: 'rules',
        current_section: 2,
      }),
      { onConflict: 'user_id,lesson_id' },
    )
  })

  it('does nothing when not authenticated', async () => {
    const { qb } = buildQB()
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockNoSession()

    await saveLessonSessionToDB('lesson-1', {
      tab: 'rules', currentSection: 1, testSection: 0,
      completedSections: {}, completedTestSections: {},
    })

    expect(qb.upsert).not.toHaveBeenCalled()
  })
})

describe('clearLessonSessionFromDB', () => {
  it('deletes session from lesson_sessions', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    await clearLessonSessionFromDB('lesson-1')

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('lesson_sessions')
    expect(qb.delete).toHaveBeenCalled()
    expect(qb.eq).toHaveBeenCalledWith('user_id', 'auth-user-1')
    expect(qb.eq).toHaveBeenCalledWith('lesson_id', 'lesson-1')
  })
})

describe('loadLessonSessionFromDB', () => {
  it('loads and transforms session data', async () => {
    const { qb, setResult } = buildQB()
    setResult({
      tab: 'exercises',
      current_section: 3,
      test_section: 1,
      completed_sections: { '1': 100 },
      completed_test_sections: {},
      updated_at: '2026-06-15T10:30:00.000Z',
    }, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    const result = await loadLessonSessionFromDB('lesson-1')

    expect(result).not.toBeNull()
    expect(result!.tab).toBe('exercises')
    expect(result!.currentSection).toBe(3)
    expect(result!.updatedAt).toBe(1781519400000) // timestamp for 2026-06-15T10:30:00Z
  })

  it('returns null when not authenticated', async () => {
    mockNoSession()
    const result = await loadLessonSessionFromDB('lesson-1')
    expect(result).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Exercise answers
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveExerciseAnswersToDB', () => {
  it('upserts multiple exercise answers', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    await saveExerciseAnswersToDB('lesson-1', 2, 'exercise', [
      { exerciseId: 1, exerciseType: 'fill', answer: ['hello'], isCorrect: true },
      { exerciseId: 2, exerciseType: 'choice', answer: ['B'], isCorrect: false },
    ])

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ user_id: 'auth-user-1', lesson_id: 'lesson-1', exercise_id: 1 }),
        expect.objectContaining({ user_id: 'auth-user-1', lesson_id: 'lesson-1', exercise_id: 2 }),
      ]),
      expect.objectContaining({ onConflict: 'user_id,lesson_id,exercise_id,section_type' }),
    )
  })

  it('skips upsert when no answers', async () => {
    const { qb } = buildQB()
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    await saveExerciseAnswersToDB('lesson-1', 0, 'drill', [])

    expect(qb.upsert).not.toHaveBeenCalled()
  })
})

describe('loadExerciseAnswersFromDB', () => {
  it('loads and parses answer JSON', async () => {
    const { qb, setResult } = buildQB()
    setResult([
      { exercise_id: 1, exercise_type: 'fill', answer: JSON.stringify(['hello']), is_correct: true, section_index: 0, section_type: 'exercise' },
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    const result = await loadExerciseAnswersFromDB('lesson-1')

    expect(result).toHaveLength(1)
    expect(result[0].exerciseId).toBe(1)
    expect(result[0].answer).toEqual(['hello'])
    expect(result[0].isCorrect).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Vocab progress
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveLessonVocabProgressToDB', () => {
  it('upserts vocabulary progress rows', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    await saveLessonVocabProgressToDB('lesson-1', [
      { wordIndex: 0, known: true, quizCorrect: 1, quizWrong: 0 },
      { wordIndex: 1, known: false, quizCorrect: 0, quizWrong: 2 },
    ])

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ word_index: 0, known: true }),
        expect.objectContaining({ word_index: 1, known: false }),
      ]),
      expect.objectContaining({ onConflict: 'user_id,lesson_id,word_index' }),
    )
  })

  it('skips upsert when items array is empty', async () => {
    const { qb } = buildQB()
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    await saveLessonVocabProgressToDB('lesson-1', [])

    expect(qb.upsert).not.toHaveBeenCalled()
  })

  it('logs error on failure', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('DB error'))
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    await saveLessonVocabProgressToDB('lesson-1', [
      { wordIndex: 0, known: true, quizCorrect: 1, quizWrong: 0 },
    ])

    expect(spy).toHaveBeenCalledWith('batch upsert lesson vocab failed: DB error', 'error')

    spy.mockRestore()
  })
})

describe('loadLessonVocabProgressFromDB', () => {
  it('loads and transforms vocab progress', async () => {
    const { qb, setResult } = buildQB()
    setResult([
      { word_index: 0, known: true, quiz_correct: 1, quiz_wrong: 0 },
      { word_index: 1, known: false, quiz_correct: 0, quiz_wrong: 2 },
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    const result = await loadLessonVocabProgressFromDB('lesson-1')

    expect(result).toHaveLength(2)
    expect(result[0].wordIndex).toBe(0)
    expect(result[0].known).toBe(true)
    expect(result[1].wordIndex).toBe(1)
    expect(result[1].quizWrong).toBe(2)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Viewed tabs
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveViewedTabsToDB', () => {
  it('upserts viewed tabs as JSON string', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    await saveViewedTabsToDB('lesson-1', ['rules', 'exercises'])

    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'auth-user-1',
        lesson_id: 'lesson-1',
        viewed_tabs: JSON.stringify(['rules', 'exercises']),
      }),
      { onConflict: 'user_id,lesson_id' },
    )
  })
})

describe('loadViewedTabsFromDB', () => {
  it('loads and parses viewed tabs JSON', async () => {
    const { qb, setResult } = buildQB()
    setResult({ viewed_tabs: JSON.stringify(['rules', 'exercises', 'tests']) }, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    const result = await loadViewedTabsFromDB('lesson-1')

    expect(result).toEqual(['rules', 'exercises', 'tests'])
  })

  it('returns empty array when no data', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    mockSession()

    const result = await loadViewedTabsFromDB('lesson-1')

    expect(result).toEqual([])
  })
})
