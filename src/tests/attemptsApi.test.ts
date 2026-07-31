import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  listAttempts,
  getAttemptDetail,
  examKindLabel,
} from '../features/admin/attemptsApi'

const EXAM_ID = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
const USER_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
const LESSON_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'

function okJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const fetchMock = vi.fn()

const summary = {
  exam_id: EXAM_ID,
  user_id: USER_ID,
  email: 'user@test.dev',
  display_name: 'Test Foydalanuvchi',
  kind: 'mavzu',
  lesson_id: LESSON_ID,
  lesson_slug: 'm01-02',
  started_at: '2026-07-31T09:20:00Z',
  finished_at: '2026-07-31T09:25:00Z',
  total_score: 12,
  max_score: 40,
  passed: false,
  answered_count: 8,
  breakdown: [{ jami: 20, togri: 6, group_code: 'S1.INFO' }],
}

describe('attemptsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', fetchMock)
  })

  it('listAttempts so‘rov parametrlarini to‘g‘ri yuboradi va javobni parse qiladi', async () => {
    fetchMock.mockResolvedValue(
      okJson({ items: [summary], total: 1, page: 1, page_size: 20 })
    )

    const result = await listAttempts({ kind: 'mavzu', lesson_id: 'M01.02', page: 2, page_size: 10 })

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('/api/admin/attempts?')
    expect(url).toContain('kind=mavzu')
    expect(url).toContain('lesson_id=M01.02')
    expect(url).toContain('page=2')
    expect(url).toContain('page_size=10')
    expect(result.total).toBe(1)
    expect(result.items[0].lesson_slug).toBe('m01-02')
    expect(result.items[0].answered_count).toBe(8)
  })

  it('listAttempts filter berilmasa ham default parametrlar bilan ishlaydi', async () => {
    fetchMock.mockResolvedValue(okJson({ items: [], total: 0, page: 1, page_size: 20 }))

    const result = await listAttempts()

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('page=1')
    expect(url).toContain('page_size=20')
    expect(result.items).toEqual([])
  })

  it('kontraktga mos bo‘lmagan javobda xato tashlaydi', async () => {
    fetchMock.mockResolvedValue(okJson({ items: [{ exam_id: 5 }], total: 'x' }))

    await expect(listAttempts()).rejects.toThrow('kontraktga mos emas')
  })

  it('getAttemptDetail to‘liq detalni qaytaradi (variant tartibi saqlanadi)', async () => {
    fetchMock.mockResolvedValue(
      okJson({
        exam_id: EXAM_ID,
        user_id: USER_ID,
        email: 'user@test.dev',
        display_name: 'Test Foydalanuvchi',
        kind: 'mavzu',
        lesson_id: LESSON_ID,
        lesson_slug: 'm01-02',
        started_at: '2026-07-31T09:20:00Z',
        finished_at: null,
        total_score: 0,
        max_score: 40,
        passed: false,
        breakdown: null,
        items: [
          {
            item_id: 'item-1',
            order_idx: 1,
            question_id: '11111111-1111-4111-8111-111111111111',
            group_code: 'S1.INFO',
            format: 'Y1',
            stem_md: 'Savol?',
            options: [
              { id: 'o-a', side: null, content_md: 'A' },
              { id: 'o-d', side: null, content_md: 'D' },
            ],
            user_answer: { option_id: 'o-a' },
            is_correct: true,
            score: 2,
            time_spent_sec: 10,
            flagged: false,
            answered_at: '2026-07-31T09:21:00Z',
            correct_option_id: 'o-a',
            explanation_md: 'Izoh',
          },
        ],
      })
    )

    const result = await getAttemptDetail(EXAM_ID)

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain(`/api/admin/attempts/${EXAM_ID}`)
    expect(result.items).toHaveLength(1)
    expect(result.items[0].options.map(o => o.content_md)).toEqual(['A', 'D'])
    expect(result.items[0].correct_option_id).toBe('o-a')
  })

  it('examKindLabel noma‘lum turni asli holicha qaytaradi', () => {
    expect(examKindLabel('mavzu')).toBe('Mavzu testi')
    expect(examKindLabel('mock')).toBe('Simulyatsiya')
    expect(examKindLabel('nomalum')).toBe('nomalum')
  })
})
