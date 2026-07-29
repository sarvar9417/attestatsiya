import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'

const { mockSupabaseInstance } = vi.hoisted(() => {
  const mockSupabaseInstance: { from: Mock; rpc: Mock } = { from: vi.fn(), rpc: vi.fn() }
  return { mockSupabaseInstance }
})

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))

import { buildQB } from '../../test/supabaseMock'
import {
  getSpeakingProgress,
  saveSpeakingDayProgress,
  getUnlockedDay,
  enrollChunks,
  gradeChunk,
  getDueChunks,
  getSpeakingStats,
} from '../speakingPathService'
import type { SpeakingChunk } from '../../data/speakingPath/types'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T10:00:00Z'))
  mockSupabaseInstance.from.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('saveSpeakingDayProgress', () => {
  it('localStorage ga yozadi va supabase upsert chaqiradi (kamel→snake map)', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveSpeakingDayProgress('u1', {
      day: 1, completed: true, bestSpeakScore: 80, spokenSeconds: 120, completedAt: '2026-06-15T10:00:00Z',
    })

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('user_speaking_progress')
    expect(qb.upsert).toHaveBeenCalledWith({
      user_id: 'u1', day: 1, completed: true,
      best_speak_score: 80, spoken_seconds: 120, completed_at: '2026-06-15T10:00:00Z',
    })

    const cached = JSON.parse(localStorage.getItem('sp_progress_u1')!)
    expect(cached).toEqual([{ day: 1, completed: true, bestSpeakScore: 80, spokenSeconds: 120, completedAt: '2026-06-15T10:00:00Z' }])
  })
})

describe('getSpeakingProgress', () => {
  it('supabase satrlarini map qiladi (best_speak_score null → undefined)', async () => {
    const { qb, setResult } = buildQB()
    setResult([
      { day: 1, completed: true, best_speak_score: 90, spoken_seconds: 100, completed_at: '2026-06-15' },
      { day: 2, completed: false, best_speak_score: null, spoken_seconds: 0, completed_at: null },
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const res = await getSpeakingProgress('u1')
    expect(res).toEqual([
      { day: 1, completed: true, bestSpeakScore: 90, spokenSeconds: 100, completedAt: '2026-06-15' },
      { day: 2, completed: false, bestSpeakScore: undefined, spokenSeconds: 0, completedAt: undefined },
    ])
  })

  it('supabase xato bersa → localStorage fallback', async () => {
    localStorage.setItem('sp_progress_u1', JSON.stringify([{ day: 3, completed: true, spokenSeconds: 50 }]))
    const { qb, setResult } = buildQB()
    setResult(null, { message: 'boom' })
    mockSupabaseInstance.from.mockReturnValue(qb)

    const res = await getSpeakingProgress('u1')
    expect(res).toEqual([{ day: 3, completed: true, spokenSeconds: 50 }])
  })
})

describe('getUnlockedDay', () => {
  it('eng katta tugatilgan kun + 1', async () => {
    const { qb, setResult } = buildQB()
    setResult([
      { day: 1, completed: true, best_speak_score: null, spoken_seconds: 0, completed_at: null },
      { day: 2, completed: true, best_speak_score: null, spoken_seconds: 0, completed_at: null },
      { day: 3, completed: false, best_speak_score: null, spoken_seconds: 0, completed_at: null },
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    expect(await getUnlockedDay('u1')).toBe(3)
  })

  it('progress yo\'q bo\'lsa 1 qaytaradi', async () => {
    const { qb, setResult } = buildQB()
    setResult([], null)
    mockSupabaseInstance.from.mockReturnValue(qb)
    expect(await getUnlockedDay('u1')).toBe(1)
  })
})

describe('gradeChunk', () => {
  it('blokni baholaydi → FSRS holati localStorage + supabase upsert', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await gradeChunk('u1', 'sp-d1-c1', 'bildim')

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('user_speaking_chunks')
    const row = qb.upsert.mock.calls[0][0] as Record<string, unknown>
    expect(row.user_id).toBe('u1')
    expect(row.chunk_id).toBe('sp-d1-c1')
    expect(row.reps).toBe(1)

    const map = JSON.parse(localStorage.getItem('sp_srs_u1')!)
    expect(map['sp-d1-c1']).toBeDefined()
    // 'bildim' (grade 3) → keyingi takror kelajakda
    expect(map['sp-d1-c1'].due > '2026-06-15').toBe(true)
  })
})

describe('getDueChunks', () => {
  it('faqat due<=bugun bo\'lgan bloklarni qaytaradi', async () => {
    const chunks: SpeakingChunk[] = [
      { id: 'a', en: 'A', uz: 'a' },
      { id: 'b', en: 'B', uz: 'b' },
      { id: 'c', en: 'C', uz: 'c' },
    ]
    const { qb, setResult } = buildQB()
    setResult([
      { chunk_id: 'a', stability: 1, difficulty: 5, due: '2026-06-14', reps: 1, lapses: 0 }, // o'tgan → due
      { chunk_id: 'b', stability: 5, difficulty: 5, due: '2026-06-20', reps: 2, lapses: 0 }, // kelajak → emas
      // c — kiritilmagan → emas
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const due = await getDueChunks('u1', chunks)
    expect(due.map(c => c.id)).toEqual(['a'])
  })
})

describe('enrollChunks', () => {
  it('faqat yangi bloklarni kiritadi (ignoreDuplicates)', async () => {
    localStorage.setItem('sp_srs_u1', JSON.stringify({ x: { stability: 2, difficulty: 5, due: '2026-06-15', reps: 1, lapses: 0 } }))
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await enrollChunks('u1', ['x', 'y', 'z'])

    const rows = qb.upsert.mock.calls[0][0] as { chunk_id: string }[]
    expect(rows.map(r => r.chunk_id).sort()).toEqual(['y', 'z'])
    const opts = qb.upsert.mock.calls[0][1]
    expect(opts).toMatchObject({ onConflict: 'user_id,chunk_id', ignoreDuplicates: true })
  })

  it('barchasi mavjud bo\'lsa upsert chaqirmaydi', async () => {
    localStorage.setItem('sp_srs_u1', JSON.stringify({ x: { stability: 2, difficulty: 5, due: '2026-06-15', reps: 1, lapses: 0 } }))
    const { qb } = buildQB()
    mockSupabaseInstance.from.mockReturnValue(qb)

    await enrollChunks('u1', ['x'])
    expect(qb.upsert).not.toHaveBeenCalled()
  })
})

describe('getSpeakingStats', () => {
  it('todayMinutes va streak (ketma-ket kunlar) hisoblaydi', async () => {
    const progress = buildQB()
    progress.setResult([
      { day: 1, completed: true, best_speak_score: null, spoken_seconds: 600, completed_at: '2026-06-15T09:00:00Z' }, // bugun 10 daq
      { day: 2, completed: true, best_speak_score: null, spoken_seconds: 300, completed_at: '2026-06-14T09:00:00Z' }, // kecha
    ], null)
    const chunks = buildQB()
    chunks.setResult([], null)
    mockSupabaseInstance.from.mockImplementation((t: string) =>
      t === 'user_speaking_progress' ? progress.qb : chunks.qb)

    const s = await getSpeakingStats('u1', [])
    expect(s.currentDay).toBe(3)      // maxDay 2 + 1
    expect(s.totalCompleted).toBe(2)
    expect(s.todayMinutes).toBe(10)   // 600s
    expect(s.streakDays).toBe(2)      // 15 va 14 ketma-ket
    expect(s.dueCount).toBe(0)
  })
})
