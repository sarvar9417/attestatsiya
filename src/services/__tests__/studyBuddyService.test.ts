// ═══════════════════════════════════════════════════════════════════════════
// studyBuddyService.test.ts — Study buddy (email orqali juftlik) testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockSupabaseInstance } = vi.hoisted(() => ({
  mockSupabaseInstance: { from: vi.fn() } as Record<string, unknown>,
}))

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))

import { buildQB } from '../../test/supabaseMock'
import { addStudyBuddy, getStudyBuddy, checkDuoStreak } from '../studyBuddyService'

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

describe('addStudyBuddy', () => {
  it('returns false when buddy email not found', async () => {
    queueQB(null) // users lookup → null
    expect(await addStudyBuddy('u1', 'nobody@x.com')).toBe(false)
  })

  it('upserts pair and returns true on success', async () => {
    queueQB({ id: 'buddy-1' }) // users lookup
    const up = queueQB(null, null) // study_buddies upsert
    const ok = await addStudyBuddy('u1', 'buddy@x.com')
    expect(ok).toBe(true)
    expect(up.upsert).toHaveBeenCalledWith(expect.objectContaining({ user_id: 'u1', buddy_id: 'buddy-1' }))
  })

  it('returns false when upsert errors', async () => {
    queueQB({ id: 'buddy-1' })
    queueQB(null, { message: 'fail' })
    expect(await addStudyBuddy('u1', 'buddy@x.com')).toBe(false)
  })
})

describe('getStudyBuddy', () => {
  it('returns null when no buddy row', async () => {
    queueQB(null)
    expect(await getStudyBuddy('u1')).toBeNull()
  })

  it('returns buddy {id, name}', async () => {
    queueQB({ buddy_id: 'buddy-1' })          // study_buddies row
    queueQB({ id: 'buddy-1', name: 'Ali' })   // users row
    expect(await getStudyBuddy('u1')).toEqual({ id: 'buddy-1', name: 'Ali' })
  })

  it('falls back to id when name empty', async () => {
    queueQB({ buddy_id: 'buddy-1' })
    queueQB({ id: 'buddy-1', name: '' })
    expect(await getStudyBuddy('u1')).toEqual({ id: 'buddy-1', name: 'buddy-1' })
  })
})

describe('checkDuoStreak', () => {
  it('returns both_completed value', async () => {
    queueQB({ both_completed: true })
    expect(await checkDuoStreak('u1', 'buddy-1')).toBe(true)
  })

  it('defaults to false when no row', async () => {
    queueQB(null)
    expect(await checkDuoStreak('u1', 'buddy-1')).toBe(false)
  })
})
