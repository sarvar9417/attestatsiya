// ═══════════════════════════════════════════════════════════════════════════
// weeklyLessonService.test.ts — haftalik dars servisi mantiq testlari
// ═══════════════════════════════════════════════════════════════════════════
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildQB } from '../../test/supabaseMock'

const { mockSupabase, mockToast } = vi.hoisted(() => ({
  mockSupabase: { from: vi.fn(), auth: { getUser: vi.fn() } } as Record<string, unknown>,
  mockToast: vi.fn(),
}))

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabase }))
vi.mock('../../utils/toastStore', () => ({ useToastStore: { getState: () => ({ toast: mockToast }) } }))

import {
  createUnit, updateUnit, deleteUnit, createLesson, updateLesson, deleteLesson,
  fetchUnitsWithLessons,
} from '../weeklyLessonService'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('requireAuthedUser — guest/empty rad etiladi', () => {
  const guestCalls: [string, () => Promise<unknown>][] = [
    ['createUnit', () => createUnit('guest', { week_no: 1, title: 'W1' })],
    ['updateUnit', () => updateUnit(1, { title: 'x' }, 'guest')],
    ['deleteUnit', () => deleteUnit(1, 'guest')],
    ['createLesson', () => createLesson('', { unit_id: 1, day_no: 1, title: 'L1' })],
    ['updateLesson', () => updateLesson(1, { title: 'x' }, 'guest')],
    ['deleteLesson', () => deleteLesson(1, 'guest')],
  ]
  for (const [name, fn] of guestCalls) {
    it(`${name} guest uchun xato tashlaydi va toast ko'rsatadi`, async () => {
      await expect(fn()).rejects.toThrow('Not authenticated')
      expect(mockToast).toHaveBeenCalled()
    })
  }
})

describe('fetchUnitsWithLessons — darslarni unit bo\'yicha guruhlaydi', () => {
  it('har unit o\'z darslarini oladi, bo\'sh unit [] oladi', async () => {
    const unitsQB = buildQB()
    unitsQB.setResult([
      { id: 10, user_id: 'u1', week_no: 1, title: 'W1', subtitle: null, objective: null, success_criteria: [], phase: null, start_date: null, end_date: null, status: 'active', created_at: '', updated_at: '' },
      { id: 20, user_id: 'u1', week_no: 2, title: 'W2', subtitle: null, objective: null, success_criteria: [], phase: null, start_date: null, end_date: null, status: 'planned', created_at: '', updated_at: '' },
    ])
    const lessonsQB = buildQB()
    lessonsQB.setResult([
      { id: 1, user_id: 'u1', unit_id: 10, day_no: 1, title: 'L1', objective: null, mode: 'green', duration_min: 90, blocks: [], status: 'todo', notes: null, completed_at: null, created_at: '', updated_at: '' },
      { id: 2, user_id: 'u1', unit_id: 10, day_no: 2, title: 'L2', objective: null, mode: 'yellow', duration_min: 45, blocks: [], status: 'done', notes: null, completed_at: null, created_at: '', updated_at: '' },
    ])
    ;(mockSupabase.from as ReturnType<typeof vi.fn>).mockImplementation((t: string) =>
      t === 'weekly_units' ? unitsQB.qb : lessonsQB.qb)

    const result = await fetchUnitsWithLessons('u1')
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe(10)
    expect(result[0].lessons).toHaveLength(2)   // ikkala dars ham unit 10 ga
    expect(result[1].id).toBe(20)
    expect(result[1].lessons).toHaveLength(0)    // unit 20 da dars yo'q → []
  })

  it('noto\'g\'ri blocks JSON bo\'sh massivga aylanadi (parseBlocks)', async () => {
    const unitsQB = buildQB(); unitsQB.setResult([])
    const lessonsQB = buildQB()
    lessonsQB.setResult([
      { id: 1, user_id: 'u1', unit_id: 10, day_no: 1, title: 'L1', objective: null, mode: 'green', duration_min: 90, blocks: 'not-an-array', status: 'todo', notes: null, completed_at: null, created_at: '', updated_at: '' },
    ])
    ;(mockSupabase.from as ReturnType<typeof vi.fn>).mockImplementation((t: string) =>
      t === 'weekly_units' ? unitsQB.qb : lessonsQB.qb)
    // units bo'sh → hech qanday unit qaytmaydi, lekin parseBlocks buzilmasligi kerak (throw yo'q)
    await expect(fetchUnitsWithLessons('u1')).resolves.toEqual([])
  })
})

describe('updateLesson — completed_at status ga bog\'liq', () => {
  const setup = () => {
    const qb = buildQB()
    qb.setResult({ id: 1, user_id: 'u1', unit_id: 10, day_no: 1, title: 'L1', objective: null, mode: 'green', duration_min: 90, blocks: [], status: 'done', notes: null, completed_at: null, created_at: '', updated_at: '' })
    ;(mockSupabase.from as ReturnType<typeof vi.fn>).mockReturnValue(qb.qb)
    return qb.qb
  }

  it("status 'done' bo'lsa completed_at o'rnatiladi", async () => {
    const qb = setup()
    await updateLesson(1, { status: 'done' }, 'u1')
    const payload = (qb.update as ReturnType<typeof vi.fn>).mock.calls[0][0] as Record<string, unknown>
    expect(payload.status).toBe('done')
    expect(payload.completed_at).toBeTruthy()
  })

  it("status 'todo' ga qaytsa completed_at null bo'ladi", async () => {
    const qb = setup()
    await updateLesson(1, { status: 'todo' }, 'u1')
    const payload = (qb.update as ReturnType<typeof vi.fn>).mock.calls[0][0] as Record<string, unknown>
    expect(payload.completed_at).toBeNull()
  })
})

describe('createUnit — dublikat hafta (23505) toast', () => {
  it("UNIQUE buzilsa ogohlantirish toast ko'rsatiladi", async () => {
    const qb = buildQB()
    qb.setResult(null, { code: '23505', message: 'duplicate' })
    ;(mockSupabase.from as ReturnType<typeof vi.fn>).mockReturnValue(qb.qb)
    await expect(createUnit('u1', { week_no: 1, title: 'W1' })).rejects.toBeTruthy()
    expect(mockToast).toHaveBeenCalledWith(expect.stringContaining('hafta'), 'warning')
  })
})
