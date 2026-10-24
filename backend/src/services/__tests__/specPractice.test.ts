import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  getUser: vi.fn(),
}))

vi.mock('../../lib/supabase.js', () => ({
  createServiceClient: () => ({ auth: { getUser: mocks.getUser } }),
  supabase: { from: mocks.from },
}))

import { specPracticeService, SPEC_SECTIONS } from '../spec-practice.service.js'

const qid = 'a0000000-0000-0000-0000-000000000001'
const a = 'b0000000-0000-0000-0000-000000000001'
const b = 'b0000000-0000-0000-0000-000000000002'
const c = 'b0000000-0000-0000-0000-000000000003'
const d = 'b0000000-0000-0000-0000-000000000004'

function mockCheckQueries(
  question: Record<string, unknown> | null,
  key: Record<string, unknown> | null,
  options: Array<{ id: string; side: string }>,
) {
  const filters: Array<[string, string]> = []
  function query(data: unknown, rows = false) {
    const value = { data, error: null }
    const chain = {
      eq: (k: string, v: string) => { filters.push([k, v]); return chain },
      like: (k: string, v: string) => { filters.push([k, v]); return chain },
      maybeSingle: async () => value,
      then: (resolve: (response: { data: unknown; error: null }) => unknown) =>
        Promise.resolve({ data: rows ? options : data, error: null }).then(resolve),
    }
    return { select: () => chain }
  }
  mocks.from.mockImplementation((table: string) => {
    if (table === 'questions') return query(question)
    if (table === 'question_keys') return query(key)
    if (table === 'question_options') return query(options, true)
    throw new Error('Unexpected table ' + table)
  })
  return filters
}

describe('TASK-600: full published specification section practice', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'learner' } }, error: null })
  })

  it('uses exactly seven academic sections plus KS and PM', () => {
    expect(SPEC_SECTIONS.map(s => s.code)).toEqual([
      'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'KS', 'PM',
    ])
  })

  it('does not expose answers without an authenticated session', async () => {
    mocks.getUser.mockResolvedValueOnce({ data: { user: null }, error: null })
    await expect(specPracticeService.checkAnswer('S3', qid, { option_id: a }, 'bad')).rejects.toMatchObject({
      statusCode: 401,
    })
    expect(mocks.from).not.toHaveBeenCalled()
  })

  it('checks a published Y1 in the entire S3 section and explains a wrong attempt', async () => {
    const filters = mockCheckQueries(
      { id: qid, format: 'Y1' },
      { payload: { correct_option_id: b }, explanation_md: 'Yechim izohi' },
      [a, b, c, d].map(id => ({ id, side: 'a' })),
    )
    const result = await specPracticeService.checkAnswer('S3', qid, { option_id: a }, 'valid')
    expect(result).toEqual({
      correct: false,
      correct_answer: { option_id: b },
      explanation_md: 'Yechim izohi',
    })
    expect(filters).toContainEqual(['status', 'published'])
    expect(filters).toContainEqual(['group_code', 'S3.%'])
  })

  it('does not check an unpublished or out-of-section question', async () => {
    mockCheckQueries(null, null, [])
    await expect(specPracticeService.checkAnswer('S5', qid, { option_id: a }, 'valid')).rejects.toMatchObject({
      statusCode: 404,
    })
  })

  it('rejects an option ID belonging to another question', async () => {
    mockCheckQueries(
      { id: qid, format: 'Y1' },
      { payload: { correct_option_id: b }, explanation_md: 'Izoh' },
      [a, b, c, d].map(id => ({ id, side: 'a' })),
    )
    await expect(specPracticeService.checkAnswer('S1', qid,
      { option_id: 'f0000000-0000-0000-0000-000000000001' }, 'valid',
    )).rejects.toMatchObject({ statusCode: 422 })
  })

  it('supports Y2 matching and Y3 ordering without revealing their keys early', async () => {
    mockCheckQueries(
      { id: qid, format: 'Y2' },
      { payload: { pairs: { [a]: c, [b]: d } }, explanation_md: 'Juftlik izohi' },
      [{ id: a, side: 'a' }, { id: b, side: 'a' }, { id: c, side: 'b' }, { id: d, side: 'b' }],
    )
    const matching = await specPracticeService.checkAnswer('S4', qid,
      { pairs: { [a]: c, [b]: d } }, 'valid')
    expect(matching.correct).toBe(true)

    mockCheckQueries(
      { id: qid, format: 'Y3' },
      { payload: { order: [b, a] }, explanation_md: 'Tartib izohi' },
      [{ id: a, side: 'a' }, { id: b, side: 'a' }],
    )
    const ordering = await specPracticeService.checkAnswer('KS', qid,
      { order: [a, b] }, 'valid')
    expect(ordering.correct).toBe(false)
    expect(ordering.correct_answer).toEqual({ order: [b, a] })
  })
})
