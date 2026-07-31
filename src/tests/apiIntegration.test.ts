import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '../lib/apiClient'
import { sessionStore, type AuthSession } from '../features/auth/sessionStore'
import { backendGateway } from '../features/exam/backendGateway'
import { progressGateway } from '../features/progress/progressGateway'
import {
  getLessonDetail,
  getModuleDetail,
  listConstructs,
  listModules,
} from '../features/content/contentApi'

/**
 * Frontend API qatlami ↔ Backend (Fastify) kontrakti uchun integration test.
 *
 * Barcha backend endpointlar frontend client orqali haqiqiy backend
 * payload shakllari bilan tekshiriladi: URL, method, body, Authorization
 * header va zod xavfsizlik tekshiruvi.
 */

const uuid = (n: number) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`

const examId = uuid(1)
const questionId = uuid(2)
const optionA = uuid(3)
const optionB = uuid(4)
const itemId = uuid(5)
const moduleId = uuid(6)
const lessonId = uuid(7)
const constructId = uuid(8)
const subjectId = uuid(9)
const token = 'test-access-token'

function testSession(): AuthSession {
  return {
    access_token: token,
    refresh_token: 'test-refresh-token',
    expires_at: Date.now() + 3600_000,
    user: { id: 'user-1', email: 'test@test.com', display_name: null, role: 'user' },
  }
}

function okJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const fetchMock = vi.fn()

const sessionPayload = {
  exam_id: examId,
  kind: 'mock',
  duration_sec: 7200,
  started_at: '2026-07-30T10:00:00.000Z',
  items: [
    {
      item_id: itemId,
      order_idx: 1,
      question_id: questionId,
      format: 'Y1',
      stem_md: 'Savol matni',
      assets: [],
      options: [
        { id: optionA, side: 'a', content_md: 'Variant A' },
        { id: optionB, side: 'a', content_md: 'Variant B' },
      ],
      cognitive_level: 'knowledge',
      difficulty: 2,
    },
  ],
}

const finishPayload = {
  exam_id: examId,
  total_score: 4,
  max_score: 100,
  passed: false,
  breakdown: [{ group_code: 'S1.INFO', jami: 2, togri: 1 }],
  already_finished: false,
}

const reviewPayload = [
  {
    order_idx: 1,
    stem_md: 'Savol matni',
    format: 'Y1',
    construct: 'Axborot hajmi',
    construct_slug: 'axborot-hajmi',
    user_answer: { option_id: optionA },
    is_correct: false,
    key: { option_id: optionB },
    explanation_md: 'Izoh',
  },
]

const dueReviewsPayload = [
  {
    construct_id: constructId,
    title_uz: 'Axborot hajmi',
    group_code: 'S1.INFO',
    due_at: null,
    accuracy: 0.5,
  },
]

const moduleListPayload = [
  {
    id: moduleId,
    code: 'M01',
    title_uz: 'Axborot',
    summary_uz: null,
    order_idx: 1,
    exam_section: 'specialty',
    status: 'published',
    exam_question_count: 3,
    lesson_count: 3,
  },
]

const moduleDetailPayload = {
  id: moduleId,
  code: 'M01',
  title_uz: 'Axborot',
  summary_uz: null,
  order_idx: 1,
  exam_section: 'specialty',
  status: 'published',
  exam_question_count: 3,
  lesson_count: 1,
  lessons: [
    {
      id: lessonId,
      module_id: moduleId,
      title_uz: 'M01.01',
      slug: 'm01-01',
      body_mdx: null,
      blocks: null,
      blocks_kind: null,
      est_minutes: 5,
      order_idx: 1,
      status: 'published',
      constructs: [
        { id: constructId, title_uz: 'Axborot hajmi', code: 'S1.INFO' },
      ],
    },
  ],
}

const constructsPayload = [
  {
    id: constructId,
    code: 'S1.INFO',
    title_uz: 'Axborot hajmi',
    description_uz: null,
    group_code: 'S1',
    subject_id: subjectId,
  },
]

describe('frontend ↔ backend API integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', fetchMock)
    sessionStore.set(testSession())
  })

  afterEach(() => {
    sessionStore.clear()
  })

  it('GET /api/health — health check kontrakti', async () => {
    fetchMock.mockResolvedValue(
      okJson({
        status: 'healthy',
        timestamp: '2026-07-30T10:00:00.000Z',
        version: '1.0.0',
        checks: {
          database: { status: 'healthy', error: null },
        },
      })
    )

    const result = await api.get<{ status: string }>('/api/health')

    expect(result.status).toBe('healthy')
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/health')
    expect(init.method).toBe('GET')
    expect((init.headers as Record<string, string>).Authorization).toBe(
      `Bearer ${token}`
    )
  })

  it('POST /api/exam/start — mock imtihon sessiyasi', async () => {
    fetchMock.mockResolvedValue(okJson(sessionPayload))

    const session = await backendGateway.startMockExam()

    expect(session.exam_id).toBe(examId)
    expect(session.kind).toBe('mock')
    expect(session.items[0].format).toBe('Y1')
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/exam/start')
    expect(JSON.parse(init.body as string)).toEqual({ kind: 'mock' })
  })

  it('POST /api/exam/start — bo‘lim va mavzu kind lari', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(okJson(sessionPayload)))

    await backendGateway.startModuleExam('M01')
    expect(JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)).toEqual({
      kind: 'bolim',
      module_id: 'M01',
    })

    await backendGateway.startTopicExam('M01.01')
    expect(JSON.parse((fetchMock.mock.calls[1][1] as RequestInit).body as string)).toEqual({
      kind: 'mavzu',
      lesson_id: 'M01.01',
    })
  })

  it('previewTopicTest — 60 savolli dars uchun 20 savol · 40 daqiqa', async () => {
    fetchMock.mockResolvedValue(
      okJson(
        Array.from({ length: 60 }, (_, i) => ({
          id: uuid(100 + i),
          group_code: 'S1.INFO',
          format: 'Y1',
          cognitive: 'bilish',
          difficulty: 3,
          stem_md: `Savol ${i + 1}`,
          options: [
            { id: optionA, content_md: 'A', order_idx: 0 },
            { id: optionB, content_md: 'B', order_idx: 1 },
          ],
        }))
      )
    )

    const preview = await backendGateway.previewTopicTest?.('M01.02')

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('/api/content/lessons/M01.02/questions')
    expect(preview).toEqual({ questionCount: 20, durationSec: 2400 })
  })

  it('previewTopicTest — darsda 20 dan kam savol bo\'lsa haqiqiy son va vaqt', async () => {
    fetchMock.mockResolvedValue(
      okJson(
        Array.from({ length: 15 }, (_, i) => ({
          id: uuid(200 + i),
          group_code: 'S1.INFO',
          format: 'Y1',
          cognitive: 'bilish',
          difficulty: 3,
          stem_md: `Savol ${i + 1}`,
          options: [],
        }))
      )
    )

    const preview = await backendGateway.previewTopicTest?.('M01.03')

    expect(preview).toEqual({ questionCount: 15, durationSec: 1800 })
  })

  it('previewTopicTest — tarmoq xatosida null qaytaradi (fallback)', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    const preview = await backendGateway.previewTopicTest?.('M01.99')

    expect(preview).toBeNull()
  })

  it('POST /api/exam/submit — encoded javob payload', async () => {
    fetchMock.mockResolvedValue(okJson({ saved: true, already_answered: false }))

    const result = await backendGateway.submitAnswer({
      examId,
      examKind: 'mock',
      questionId,
      answer: { option_id: optionB },
      timeSpentSec: 12,
    })

    expect(result).toEqual({ saved: true, already_answered: false })
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/exam/submit')
    expect(JSON.parse(init.body as string)).toEqual({
      exam_id: examId,
      question_id: questionId,
      answer: { option_id: optionB },
      time_spent_sec: 12,
    })
  })

  it('POST /api/exam/finish — natija kontrakti', async () => {
    fetchMock.mockResolvedValue(okJson(finishPayload))

    const result = await backendGateway.finishExam(examId)

    expect(result.total_score).toBe(4)
    expect(result.breakdown?.[0].togri).toBe(1)
    expect(
      JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)
    ).toEqual({ exam_id: examId })
  })

  it('GET /api/exam/:id/review — tahlil kontrakti', async () => {
    fetchMock.mockResolvedValue(okJson(reviewPayload))

    const result = await backendGateway.getReview(examId)

    expect(result).toHaveLength(1)
    expect(result[0].is_correct).toBe(false)
    expect(result[0].format).toBe('Y1')
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe(`http://localhost:3001/api/exam/${examId}/review`)
  })

  it('GET /api/exam/due-reviews — takrorlash kontrakti', async () => {
    fetchMock.mockResolvedValue(okJson(dueReviewsPayload))

    const result = await backendGateway.getDueReviews()

    expect(result[0].group_code).toBe('S1.INFO')
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/exam/due-reviews')
  })

  it('POST /api/progress/sync — progress sinxronlash', async () => {
    fetchMock.mockResolvedValue(
      okJson({ topics_synced: 1, modules_synced: 1, errors: [] })
    )

    const result = await progressGateway.sync({
      topics: [
        {
          subtopic_code: 'M01.01',
          completed: true,
          correct_count: 2,
          total_count: 3,
          last_score: 66,
        },
      ],
      module_scores: [{ module_code: 'M01', exam_score: 42 }],
    })

    expect(result.topics_synced).toBe(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/progress/sync')
    expect(JSON.parse(init.body as string)).toMatchObject({
      module_scores: [{ module_code: 'M01', exam_score: 42 }],
    })
  })

  it('GET /api/content/modules — modul ro‘yxati', async () => {
    fetchMock.mockResolvedValue(okJson(moduleListPayload))

    const result = await listModules('specialty')

    expect(result[0].lesson_count).toBe(3)
  })

  it('GET /api/content/modules/:id — modul tafsiloti', async () => {
    fetchMock.mockResolvedValue(okJson(moduleDetailPayload))

    const result = await getModuleDetail('M01')

    expect(result.lessons[0].constructs[0].code).toBe('S1.INFO')
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/content/modules/M01')
  })

  it('GET /api/content/lessons/:id — dars tafsiloti', async () => {
    fetchMock.mockResolvedValue(
      okJson({
        id: lessonId,
        module_id: moduleId,
        title_uz: 'M01.01',
        slug: 'm01-01',
        body_mdx: null,
        blocks: null,
        blocks_kind: null,
        est_minutes: 5,
        order_idx: 1,
        status: 'published',
        constructs: [],
      })
    )

    const result = await getLessonDetail('M01.01')

    expect(result.id).toBe(lessonId)
  })

  it('GET /api/content/constructs — kompetensiya ro‘yxati', async () => {
    fetchMock.mockResolvedValue(okJson(constructsPayload))

    const result = await listConstructs()

    expect(result[0].subject_id).toBe(subjectId)
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/content/constructs')
  })

  it('error kontrakti: RATE_LIMIT_EXCEEDED xavfsiz tarzda chiqariladi', async () => {
    fetchMock.mockResolvedValue(
      okJson(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'So\'rovlar chegarasi oshib ketdi.',
          },
        },
        429
      )
    )

    await expect(api.get('/api/health')).rejects.toMatchObject({
      statusCode: 429,
      code: 'RATE_LIMIT_EXCEEDED',
    })
  })

  it('xavfsizlik: kalit yoki tushuntirishli start payload rad etiladi', async () => {
    const leaked = {
      ...sessionPayload,
      items: [
        { ...sessionPayload.items[0], key: { option_id: optionB } },
      ],
    }
    fetchMock.mockResolvedValue(okJson(leaked))

    await expect(backendGateway.startMockExam()).rejects.toThrow(
      /xavfsizlik tekshiruvidan o‘tmadi/
    )
  })

  it('401 bo\'lsa refresh orqali yangi token bilan qayta uriniladi', async () => {
    const refreshedSession = {
      ...testSession(),
      access_token: 'new-access-token',
    }

    fetchMock
      .mockResolvedValueOnce(okJson({ error: { code: 'UNAUTHORIZED', message: 'x' } }, 401))
      .mockResolvedValueOnce(okJson(refreshedSession))
      .mockResolvedValueOnce(okJson({ status: 'healthy' }))

    const result = await api.get<{ status: string }>('/api/health')

    expect(result.status).toBe('healthy')

    const urls = fetchMock.mock.calls.map(call => call[0] as string)
    expect(urls[0]).toBe('http://localhost:3001/api/health')
    expect(urls[1]).toBe('http://localhost:3001/api/auth/refresh')
    expect(urls[2]).toBe('http://localhost:3001/api/health')

    const refreshBody = JSON.parse((fetchMock.mock.calls[1][1] as RequestInit).body as string)
    expect(refreshBody).toEqual({ refresh_token: 'test-refresh-token' })

    const retryInit = fetchMock.mock.calls[2][1] as RequestInit
    expect((retryInit.headers as Record<string, string>).Authorization).toBe(
      'Bearer new-access-token'
    )
    expect(sessionStore.get()?.access_token).toBe('new-access-token')
  })

  it('refresh ham muvaffaqiyatsiz bo\'lsa SESSION_EXPIRED xatosi chiqadi', async () => {
    fetchMock
      .mockResolvedValueOnce(okJson({ error: { code: 'UNAUTHORIZED', message: 'x' } }, 401))
      .mockResolvedValueOnce(okJson({ error: { code: 'INVALID_REFRESH', message: 'x' } }, 401))

    await expect(api.get('/api/health')).rejects.toMatchObject({
      statusCode: 401,
      code: 'SESSION_EXPIRED',
    })
    expect(sessionStore.get()).toBeNull()
  })

  it('login 401 bo\'lsa refresh chaqirilmaydi (noto\'g\'ri parol)', async () => {
    fetchMock.mockResolvedValue(
      okJson({ error: { code: 'INVALID_CREDENTIALS', message: 'Email yoki parol noto\'g\'ri' } }, 401)
    )

    await expect(
      api.post('/api/auth/login', { email: 'a@b.c', password: 'wrong' })
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' })

    const refreshCalled = fetchMock.mock.calls.some(
      call => (call[0] as string) === 'http://localhost:3001/api/auth/refresh'
    )
    expect(refreshCalled).toBe(false)
  })
})
