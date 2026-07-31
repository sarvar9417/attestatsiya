import { beforeEach, describe, expect, it, vi } from 'vitest'
import { progressGateway } from '../features/progress/progressGateway'
import type { DueReviewItem } from '../features/exam/contracts'

const constructId = '00000000-0000-4000-8000-000000000011'
const moduleId = '00000000-0000-4000-8000-000000000012'

function okJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const fetchMock = vi.fn()

describe('progressGateway', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', fetchMock)
  })

  it('sync backend orqali yuboriladi va natija parse qilinadi', async () => {
    fetchMock.mockResolvedValue(
      okJson({ topics_synced: 1, modules_synced: 0, errors: [] })
    )

    const result = await progressGateway.sync({
      topics: [
        {
          subtopic_code: 'M01.01',
          completed: true,
          correct_count: 3,
          total_count: 3,
          last_score: 100,
        },
      ],
    })

    expect(result.topics_synced).toBe(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/progress/sync')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toMatchObject({
      topics: [{ subtopic_code: 'M01.01' }],
    })
  })

  it('sync biznes xatosi (VALIDATION_ERROR) qayta tashlanadi', async () => {
    fetchMock.mockResolvedValue(
      okJson(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'So\'rov ma\'lumotlari noto\'g\'ri',
          },
        },
        400
      )
    )

    await expect(
      progressGateway.sync({ module_scores: [] })
    ).rejects.toMatchObject({ code: 'VALIDATION_ERROR' })
  })

  it('sync tarmoq xatosi (NETWORK_ERROR) qayta tashlanadi (fallback yo\'q)', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(progressGateway.sync({})).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
    })
  })

  it('getModuleProgress backend javobini parse qiladi', async () => {
    fetchMock.mockResolvedValue(
      okJson([
        {
          module_id: moduleId,
          module_code: 'M01',
          module_title: 'Axborot',
          exam_best_score: 42,
          completed_at: null,
          unlocked_at: '2026-07-30T00:00:00.000Z',
          topic_count: 12,
          completed_topics: 3,
        },
      ])
    )

    const result = await progressGateway.getModuleProgress()

    expect(result).toHaveLength(1)
    expect(result[0].module_code).toBe('M01')
    expect(result[0].exam_best_score).toBe(42)
  })

  it('getModuleProgress noto\'g\'ri javobda xato beradi', async () => {
    fetchMock.mockResolvedValue(okJson([{ module_code: 'M01' }]))

    await expect(progressGateway.getModuleProgress()).rejects.toThrow(
      'Invalid module progress response'
    )
  })

  it('getDueReviews backend orqali olinadi va parse qilinadi', async () => {
    const due: DueReviewItem[] = [
      {
        construct_id: constructId,
        title_uz: 'Axborot hajmi',
        group_code: 'S1.INFO',
        due_at: '2026-08-01T00:00:00.000Z',
        accuracy: 0.5,
      },
    ]
    fetchMock.mockResolvedValue(okJson(due))

    const result = await progressGateway.getDueReviews()

    expect(result).toEqual(due)
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/exam/due-reviews')
  })
})
