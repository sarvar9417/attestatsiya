import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import { saveSpeakingResult, saveChatResult, fetchSpeakingPrompts, getDailyPrompts } from '../speakingService'
import { SPEAKING_PROMPTS } from '../../data/speakingPrompts'
import { monitoring } from '../../lib/monitoring'
import type { SpeakingPrompt } from '../speakingService'

// ─── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockSupabaseInstance } = vi.hoisted(() => {
  const mockSupabaseInstance: { from: Mock; rpc: Mock } = {
    from: vi.fn(), rpc: vi.fn(),
  }
  return { mockSupabaseInstance }
})

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
}))

import { buildQB } from '../../test/supabaseMock'

// ─── Lifecycle ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T10:30:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// ═══════════════════════════════════════════════════════════════════════════════
//  saveSpeakingResult
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveSpeakingResult', () => {
  const baseParams = {
    userId: 'user-1',
    promptId: 'prompt-1',
    promptText: 'Describe your hometown',
    fluencyScore: 7,
    grammarScore: 6,
    vocabularyScore: 8,
    avgScore: 7.0,
    xpEarned: 70,
    feedback: 'Good fluency, but work on grammar.',
  }

  it('inserts into speaking_progress table', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveSpeakingResult(baseParams)

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('speaking_progress')
    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        date: '2026-06-15',
        prompt_id: 'prompt-1',
        prompt_text: 'Describe your hometown',
        fluency_score: 7,
        grammar_score: 6,
        vocabulary_score: 8,
        avg_score: 7.0,
        xp_earned: 70,
        feedback: 'Good fluency, but work on grammar.',
      }),
    )
  })

  it('truncates feedback to 2000 chars', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const longFeedback = 'y'.repeat(3000)

    await saveSpeakingResult({ ...baseParams, feedback: longFeedback })

    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        feedback: longFeedback.slice(0, 2000),
      }),
    )
  })

  it('logs error on insert failure', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('DB error'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    await saveSpeakingResult(baseParams)

    expect(spy).toHaveBeenCalledWith('saveSpeakingResult error: DB error', 'error')

    spy.mockRestore()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchSpeakingPrompts
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchSpeakingPrompts', () => {
  it('returns supabase data on success', async () => {
    const { qb, setResult } = buildQB()
    setResult([{ data: { id: 'db-1', category: 'hometown' } }], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchSpeakingPrompts()

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('speaking_prompts')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ id: 'db-1', category: 'hometown' })
  })

  it('falls back to local SPEAKING_PROMPTS on error', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('Network error'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchSpeakingPrompts()

    expect(result).toEqual(SPEAKING_PROMPTS)
  })

  it('falls back to local when data is empty', async () => {
    const { qb, setResult } = buildQB()
    setResult([], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await fetchSpeakingPrompts()

    expect(result).toEqual(SPEAKING_PROMPTS)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  saveChatResult
// ═══════════════════════════════════════════════════════════════════════════════

describe('saveChatResult', () => {
  const baseParams = {
    userId: 'user-1',
    promptId: 'chat_prompt-1',
    promptText: 'Describe your hometown',
    turnCount: 5,
    xpEarned: 15,
    feedback: '✅ Strength: Good fluency. 📌 Area: Work on grammar.',
    userScore: 7,
  }

  it('inserts into speaking_progress with chat prefix and prefixing feedback', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveChatResult(baseParams)

    expect(mockSupabaseInstance.from).toHaveBeenCalledWith('speaking_progress')
    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        date: '2026-06-15',
        prompt_id: 'chat_prompt-1',
        prompt_text: 'Describe your hometown',
        fluency_score: 0,
        grammar_score: 0,
        vocabulary_score: 0,
        avg_score: 7,
        xp_earned: 15,
        feedback: '[Chat Mode · 5 turns] ✅ Strength: Good fluency. 📌 Area: Work on grammar.',
      }),
    )
  })

  it('uses avg_score only for chat (dimension scores are zero)', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveChatResult({ ...baseParams, userScore: 8 })

    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        fluency_score: 0,
        grammar_score: 0,
        vocabulary_score: 0,
        avg_score: 8,
      }),
    )
  })

  it('handles userScore of 1 (minimum)', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveChatResult({ ...baseParams, userScore: 1 })

    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        fluency_score: 0,
        grammar_score: 0,
        vocabulary_score: 0,
        avg_score: 1,
      }),
    )
  })

  it('handles userScore of 10 (maximum)', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveChatResult({ ...baseParams, userScore: 10 })

    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        fluency_score: 0,
        grammar_score: 0,
        vocabulary_score: 0,
        avg_score: 10,
      }),
    )
  })

  it('truncates feedback to 1950 chars and adds chat prefix (total ≤ 2000)', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    // 1950 chars + prefix '[Chat Mode · 5 turns] ' (20 chars) = 1970 ≤ 2000
    const longFeedback = 'x'.repeat(1950)

    await saveChatResult({ ...baseParams, feedback: longFeedback })

    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        feedback: `[Chat Mode · 5 turns] ${longFeedback}`,
      }),
    )
  })

  it('truncates overflow feedback to 1950 chars to fit prefix within 2000 limit', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const longFeedback = 'y'.repeat(2200)

    await saveChatResult({ ...baseParams, feedback: longFeedback })

    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        feedback: `[Chat Mode · 5 turns] ${longFeedback.slice(0, 1950)}`,
      }),
    )
  })

  it('handles empty feedback string', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    await saveChatResult({ ...baseParams, feedback: '' })

    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        feedback: '[Chat Mode · 5 turns] ',
      }),
    )
  })

  it('logs error on insert failure', async () => {
    const { qb, setResult } = buildQB()
    setResult(null, new Error('DB error'))
    mockSupabaseInstance.from.mockReturnValue(qb)

    const spy = vi.spyOn(monitoring, 'captureMessage').mockImplementation(() => {})

    await saveChatResult(baseParams)

    expect(spy).toHaveBeenCalledWith('saveChatResult error: DB error', 'error')

    spy.mockRestore()
  })
})

describe('getDailyPrompts', () => {
  const makePrompt = (id: string, category: SpeakingPrompt['category']): SpeakingPrompt => ({
    id,
    category,
    prompt: `Prompt ${id}`,
    tips: ['Tip 1'],
    timeSeconds: 60,
  })

  // Each category has 2+ prompts so (dayNumber + i) % catPrompts.length actually rotates
  const prompts: SpeakingPrompt[] = [
    makePrompt('p1', 'personal'),
    makePrompt('p2', 'opinion'),
    makePrompt('p3', 'description'),
    makePrompt('p4', 'personal'),   // same category as p1
    makePrompt('p5', 'opinion'),    // same category as p2
  ]

  it('returns 3 prompts for day 1', () => {
    const result = getDailyPrompts(1, prompts)
    expect(result).toHaveLength(3)
  })

  it('selects one prompt per category', () => {
    const result = getDailyPrompts(1, prompts)
    const categories = result.map((p) => p.category)
    expect(new Set(categories).size).toBe(3)
  })

  it('rotates prompts based on day number', () => {
    const day1 = getDailyPrompts(1, prompts)
    const day2 = getDailyPrompts(2, prompts)

    const day1Ids = day1.map((p) => p.id).sort()
    const day2Ids = day2.map((p) => p.id).sort()
    expect(day1Ids).not.toEqual(day2Ids)
  })

  it('returns at most 3 prompts', () => {
    const singlePrompt: SpeakingPrompt[] = [makePrompt('p1', 'personal')]
    const result = getDailyPrompts(1, singlePrompt)
    expect(result).toHaveLength(1)
  })

  it('handles empty prompts array', () => {
    const result = getDailyPrompts(1, [])
    expect(result).toEqual([])
  })
})
