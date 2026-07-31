import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  checkQuestionAnswer,
  getLessonTestQuestions,
} from '../features/content/lessonContentGateway'
import { getTopicContent } from '../data/topicContent'

const lessonId = '00000000-0000-4000-8000-000000000001'
const optionA = '00000000-0000-4000-8000-000000000002'
const optionB = '00000000-0000-4000-8000-000000000003'

function okJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function backendQuestion() {
  return {
    id: lessonId,
    group_code: 'S1.INFO',
    format: 'Y1',
    cognitive: 'bilish',
    difficulty: 3,
    stem_md: 'Informatika nima?',
    options: [
      { id: optionA, content_md: 'Hisoblash fani', order_idx: 0 },
      { id: optionB, content_md: 'Tarix fani', order_idx: 1 },
    ],
  }
}

const fetchMock = vi.fn()

describe('lessonContentGateway', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', fetchMock)
  })

  it('backend savollarini TestQuestion shakliga o‘tkazadi (kalitsiz)', async () => {
    fetchMock.mockResolvedValue(okJson([backendQuestion()]))

    const result = await getLessonTestQuestions('M01.99')

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: lessonId,
      type: 'Y1',
      text: 'Informatika nima?',
      options: ['Hisoblash fani', 'Tarix fani'],
      optionIds: [optionA, optionB],
      correctIndex: -1,
      source: 'backend',
    })
  })

  it('backend bo‘sh qaytarsa statik kontentga tushadi', async () => {
    fetchMock.mockResolvedValue(okJson([]))

    const result = await getLessonTestQuestions('M01.02')

    const staticQs = getTopicContent('M01.02')?.questions ?? []
    expect(result).toEqual(staticQs)
    expect(staticQs.length).toBeGreaterThan(0)
  })

  it('tarmoq uzilishida statik kontent qaytaradi', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await getLessonTestQuestions('M01.02')

    const staticQs = getTopicContent('M01.02')?.questions ?? []
    expect(result).toEqual(staticQs)
  })

  it('server xatosida (404) statik kontent qaytaradi', async () => {
    fetchMock.mockResolvedValue(
      okJson({ error: { code: 'NOT_FOUND', message: 'Dars topilmadi' } }, 404)
    )

    const result = await getLessonTestQuestions('M01.02')

    const staticQs = getTopicContent('M01.02')?.questions ?? []
    expect(result).toEqual(staticQs)
  })

  it('checkQuestionAnswer server natijasini qaytaradi', async () => {
    fetchMock.mockResolvedValue(
      okJson({ correct: true, correct_option_id: optionB, explanation_md: 'Izoh' })
    )

    const question = {
      id: lessonId,
      type: 'Y1' as const,
      text: 'Informatika nima?',
      options: ['Hisoblash fani', 'Tarix fani'],
      optionIds: [optionA, optionB],
      correctIndex: -1,
      explanation: '',
      source: 'backend' as const,
    }

    const result = await checkQuestionAnswer(question, 1)

    expect(result).toEqual({ correct: true, correctIndex: 1, explanation: 'Izoh' })
  })

  it('checkQuestionAnswer server yiqilsa statik kalitga tushadi', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    const question = {
      id: 'S1.INFO.03-01',
      type: 'Y1' as const,
      text: 'Statik savol',
      options: ['A', 'B'],
      correctIndex: 0,
      explanation: 'Lokal izoh',
    }

    const result = await checkQuestionAnswer(question, 0)

    expect(result).toEqual({ correct: true, correctIndex: 0, explanation: 'Lokal izoh' })
  })

  it('checkQuestionAnswer backend savolida option id yo‘q bo‘lsa natija -1', async () => {
    const question = {
      id: lessonId,
      type: 'Y1' as const,
      text: 'Savol',
      options: ['A', 'B'],
      correctIndex: -1,
      explanation: '',
      source: 'backend' as const,
    }

    const result = await checkQuestionAnswer(question, 0)

    expect(result).toEqual({ correct: false, correctIndex: -1, explanation: '' })
  })
})
