import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  checkAnswer,
  getLessonDetail,
  getLessonQuestions,
  getModuleDetail,
  listConstructs,
  listModules,
} from '../features/content/contentApi'

const moduleId = '00000000-0000-4000-8000-000000000001'
const lessonId = '00000000-0000-4000-8000-000000000002'
const constructId = '00000000-0000-4000-8000-000000000003'
const subjectId = '00000000-0000-4000-8000-000000000004'

function okJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const fetchMock = vi.fn()

describe('contentApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', fetchMock)
  })

  it('listModules parametrlarni to‘g‘ri yuboradi va javobni parse qiladi', async () => {
    fetchMock.mockResolvedValue(
      okJson([
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
      ])
    )

    const result = await listModules('specialty')

    expect(result).toHaveLength(1)
    expect(result[0].code).toBe('M01')
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe(
      'http://localhost:3001/api/content/modules?section=specialty&status=published'
    )
  })

  it('getModuleDetail darslar va konstruktlar bilan qaytadi', async () => {
    fetchMock.mockResolvedValue(
      okJson({
        id: moduleId,
        code: 'M01',
        title_uz: 'Axborot',
        summary_uz: 'Kirish',
        order_idx: 1,
        exam_section: 'specialty',
        status: 'published',
        exam_question_count: 3,
        lesson_count: 1,
        lessons: [
          {
            id: lessonId,
            module_id: moduleId,
            title_uz: 'Axborot tushunchasi',
            slug: 'm01-01',
            body_mdx: '# Matn',
            blocks: null,
            blocks_kind: null,
            est_minutes: 10,
            order_idx: 1,
            status: 'published',
            constructs: [
              { id: constructId, title_uz: 'Axborot hajmi', code: 'S1.INFO' },
            ],
          },
        ],
      })
    )

    const result = await getModuleDetail('M01')

    expect(result.lessons).toHaveLength(1)
    expect(result.lessons[0].constructs[0].code).toBe('S1.INFO')
  })

  it('getLessonDetail code bilan ishlaydi (slug-encoded)', async () => {
    fetchMock.mockResolvedValue(
      okJson({
        id: lessonId,
        module_id: moduleId,
        title_uz: 'M01.01 mavzusi',
        slug: 'm01-01',
        body_mdx: null,
        blocks: null,
        blocks_kind: 'chapter',
        est_minutes: 5,
        order_idx: 1,
        status: 'published',
        constructs: [],
      })
    )

    const result = await getLessonDetail('M01.01')

    expect(result.slug).toBe('m01-01')
    expect(result.blocks_kind).toBe('chapter')
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/content/lessons/M01.01')
  })

  it('getLessonQuestions savollarni kalitsiz qaytaradi', async () => {
    fetchMock.mockResolvedValue(
      okJson([
        {
          id: '00000000-0000-4000-8000-000000000005',
          group_code: 'S1.INFO',
          format: 'Y1',
          cognitive: 'bilish',
          difficulty: 3,
          stem_md: 'Informatika nima?',
          options: [
            { id: '00000000-0000-4000-8000-000000000006', content_md: 'A', order_idx: 0 },
            { id: '00000000-0000-4000-8000-000000000007', content_md: 'B', order_idx: 1 },
          ],
        },
      ])
    )

    const result = await getLessonQuestions('M01.02')

    expect(result).toHaveLength(1)
    expect(result[0].stem_md).toBe('Informatika nima?')
    expect(result[0].options).toHaveLength(2)
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/content/lessons/M01.02/questions')
  })

  it('getLessonQuestions kalit maydonlarini rad etadi', async () => {
    fetchMock.mockResolvedValue(
      okJson([
        {
          id: 'q-1',
          group_code: 'S1.INFO',
          format: 'Y1',
          cognitive: 'bilish',
          difficulty: 3,
          stem_md: 'Savol',
          correct_option_id: 'secret-key',
          options: [],
        },
      ])
    )

    await expect(getLessonQuestions('M01.02')).rejects.toThrow(
      /xavfsizlik tekshiruvidan o‘tmadi/
    )
  })

  it('checkAnswer to‘g‘ri javobni qaytaradi va POST yuboradi', async () => {
    fetchMock.mockResolvedValue(
      okJson({
        correct: true,
        correct_option_id: '00000000-0000-4000-8000-000000000006',
        explanation_md: 'Izoh',
      })
    )

    const result = await checkAnswer(
      '00000000-0000-4000-8000-000000000005',
      '00000000-0000-4000-8000-000000000006'
    )

    expect(result.correct).toBe(true)
    expect(result.explanation_md).toBe('Izoh')
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:3001/api/content/questions/check')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({
      question_id: '00000000-0000-4000-8000-000000000005',
      option_id: '00000000-0000-4000-8000-000000000006',
    })
  })

  it('listConstructs guruh filtri bilan ishlaydi', async () => {
    fetchMock.mockResolvedValue(
      okJson([
        {
          id: constructId,
          code: 'S1.INFO',
          title_uz: 'Axborot hajmi',
          description_uz: null,
          group_code: 'S1',
          subject_id: subjectId,
        },
      ])
    )

    const result = await listConstructs('S1')

    expect(result).toHaveLength(1)
    expect(result[0].group_code).toBe('S1')
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe('http://localhost:3001/api/content/constructs?group_code=S1')
  })

  it('noto‘g‘ri javob formati rad etiladi', async () => {
    fetchMock.mockResolvedValue(
      okJson([{ id: moduleId, title_uz: 'code yo‘q' }])
    )

    await expect(listModules()).rejects.toThrow(
      /xavfsizlik tekshiruvidan o‘tmadi/
    )
  })

  it('server xatosi error kontrakti orqali chiqariladi', async () => {
    fetchMock.mockResolvedValue(
      okJson(
        {
          error: { code: 'NOT_FOUND', message: 'Modul topilmadi' },
        },
        404
      )
    )

    await expect(listModules()).rejects.toMatchObject({
      statusCode: 404,
      code: 'NOT_FOUND',
    })
  })
})
