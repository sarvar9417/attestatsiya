// ═══════════════════════════════════════════════════════════════════════════
// adaptiveService.test.ts — Adaptiv kunlik reja generatori testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockSupabaseInstance } = vi.hoisted(() => ({
  mockSupabaseInstance: { from: vi.fn() } as Record<string, unknown>,
}))

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../lib/monitoring', () => ({ monitoring: { captureMessage: vi.fn() } }))

import { buildQB } from '../../test/supabaseMock'
import { generateAdaptivePlan, saveAdaptivePlan, loadAdaptivePlan } from '../adaptiveService'

beforeEach(() => {
  mockSupabaseInstance.from.mockReset()
})
afterEach(() => vi.clearAllMocks())

function queueQB(data: unknown, error: unknown = null) {
  const { qb, setResult } = buildQB()
  setResult(data, error)
  mockSupabaseInstance.from.mockReturnValueOnce(qb)
  return qb
}

describe('generateAdaptivePlan', () => {
  it('no grammar data → suggests a new topic + vocab review', async () => {
    queueQB([]) // grammar_progress bo'sh
    const plan = await generateAdaptivePlan('u1')
    const types = plan.tasks.map(t => t.type)
    expect(types).toContain('new-topic')
    expect(types).toContain('vocab-review')
    expect(types).not.toContain('review')
    expect(plan.focusArea).toBe('Grammar')
    expect(plan.totalXP).toBe(plan.tasks.reduce((s, t) => s + t.xp, 0))
  })

  it('weak topics → review tasks sorted weakest-first with correct priority/xp', async () => {
    queueQB([
      { topic_id: 't-weak', topic_title: 'X', score: 40, completed_at: '2026-06-10' },
      { topic_id: 't-mid', topic_title: 'Y', score: 65, completed_at: '2026-06-11' },
      { topic_id: 't-ok', topic_title: 'Z', score: 90, completed_at: '2026-06-12' },
    ])
    const plan = await generateAdaptivePlan('u1')

    const reviews = plan.tasks.filter(t => t.type === 'review')
    expect(reviews).toHaveLength(2) // 90% mavzu filtrlangan (>=80)
    // Eng zaif (40%) birinchi
    expect(reviews[0].topicId).toBe('t-weak')
    expect(reviews[0].priority).toBe('high')
    expect(reviews[0].xp).toBe(80)          // calculateXP(40)
    expect(reviews[1].topicId).toBe('t-mid')
    expect(reviews[1].priority).toBe('medium')
    expect(reviews[1].xp).toBe(60)          // calculateXP(65)

    // Zaif mavzu bor → new-topic taklif qilinmaydi
    expect(plan.tasks.map(t => t.type)).not.toContain('new-topic')
    expect(plan.focusReason).toContain('40%')
  })

  it('aggregates multiple attempts of same topic (avg)', async () => {
    queueQB([
      { topic_id: 't1', topic_title: 'X', score: 30, completed_at: '2026-06-10' },
      { topic_id: 't1', topic_title: 'X', score: 70, completed_at: '2026-06-09' },
    ])
    const plan = await generateAdaptivePlan('u1')
    const review = plan.tasks.find(t => t.type === 'review')!
    expect(review.detail).toContain('50%')  // avg(30,70)=50
    expect(review.detail).toContain('2 ta urinish')
  })

  it('returns default plan on DB error', async () => {
    queueQB(null, { message: 'db down' })
    const plan = await generateAdaptivePlan('u1')
    // Xato → fetchGrammarTopicScores [] qaytaradi → new-topic yo'li (default emas)
    // Lekin reja baribir yaroqli bo'lishi kerak
    expect(plan.tasks.length).toBeGreaterThan(0)
    expect(plan.totalXP).toBeGreaterThan(0)
  })
})

describe('save/load adaptive plan', () => {
  it('saveAdaptivePlan upserts with onConflict', async () => {
    const qb = queueQB(null, null)
    const plan = { date: '2026-06-15', tasks: [], totalEstimatedMinutes: 0, totalXP: 0, focusArea: 'Grammar', focusReason: '' }
    await saveAdaptivePlan('u1', plan)
    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'u1', date: '2026-06-15' }),
      expect.objectContaining({ onConflict: 'user_id,date' }),
    )
  })

  it('loadAdaptivePlan returns plan_data', async () => {
    queueQB({ plan_data: { date: '2026-06-15', focusArea: 'Grammar' } })
    const plan = await loadAdaptivePlan('u1', '2026-06-15')
    expect(plan?.focusArea).toBe('Grammar')
  })

  it('loadAdaptivePlan returns null when missing', async () => {
    queueQB(null)
    expect(await loadAdaptivePlan('u1', '2026-06-15')).toBeNull()
  })
})
