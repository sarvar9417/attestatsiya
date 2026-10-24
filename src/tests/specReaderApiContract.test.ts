import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGet = vi.hoisted(() => vi.fn())
vi.mock('../lib/apiClient', () => ({
  api: { get: mockGet, put: vi.fn() },
}))

import { getReaderPage, getReaderState } from '../features/content/specReaderApi'

// Actual PostgreSQL IDs are 8-4-4-4-12, not 8-4-4-12.
const uuid = (i: number) => '11111111-2222-4333-8444-' + String(i).padStart(12, '0')
const options = (base: number, side = 'a') => [1, 2, 3, 4].map((n) => ({
  id: uuid(base + n), side, order_idx: n, content_md: 'Variant ' + n,
}))
const questions = [
  {
    id: uuid(1), group_code: 'S5.WEB', format: 'Y1', stem_md: 'Rastr nima?',
    options: options(100),
    correct_answer: { correct_option_id: uuid(102) },
    explanation_md: 'Rastr piksellardan tashkil topadi.',
  },
  {
    id: uuid(2), group_code: 'S5.WEB', format: 'Y2', stem_md: 'Moslashtiring',
    options: [...options(200), ...options(300, 'b')],
    correct_answer: {
      pairs: Object.fromEntries([1, 2, 3, 4].map(n => [uuid(200 + n), uuid(300 + n)])),
    },
    explanation_md: 'Har bir bandga mos element berilgan.',
  },
  {
    id: uuid(3), group_code: 'S5.WEB', format: 'Y3', stem_md: 'Tartibni toping',
    options: options(400),
    correct_answer: { order: [uuid(404), uuid(401), uuid(402), uuid(403)] },
    explanation_md: 'Ketma-ketlik to‘rt qadamdan iborat.',
  },
]

describe('TASK-602: live reader payload contract', () => {
  beforeEach(() => vi.resetAllMocks())

  it('accepts real 5-group UUIDs for Y1/Y2/Y3 questions, options and answer keys', async () => {
    mockGet.mockResolvedValue({ questions, total: 420, page: 1, page_size: 30 })
    const result = await getReaderPage('S5', {
      page: 1, pageSize: 30, search: '', reviewOnly: false,
    })
    expect(result.questions).toHaveLength(3)
    expect(result.questions[0].correct_answer).toEqual({ correct_option_id: uuid(102) })
    expect(result.questions[1].correct_answer).toEqual(questions[1].correct_answer)
    expect(result.questions[2].correct_answer).toEqual(questions[2].correct_answer)
    expect(mockGet).toHaveBeenCalledWith('/api/content/spec-reader/S5/page?page=1&page_size=30&q=&review_only=false')
  })

  it('rejects malformed UUIDs without rejecting valid canonical identifiers', async () => {
    mockGet.mockResolvedValue({ questions: [{ ...questions[0], id: '11111111-2222-3333-' + '123456789012' }], total: 1, page: 1, page_size: 30 })
    await expect(getReaderPage('S5', {
      page: 1, pageSize: 30, search: '', reviewOnly: false,
    })).rejects.toThrow()
  })

  it('accepts saved marks indexed by real PostgreSQL UUIDs', async () => {
    mockGet.mockResolvedValue({
      page: 2, page_size: 50, search: 'veb', review_only: true,
      marks: { [uuid(2)]: 'review', [uuid(3)]: 'memorized' },
    })
    const state = await getReaderState('S5')
    expect(state.marks[uuid(2)]).toBe('review')
    expect(state.page_size).toBe(50)
  })
})
