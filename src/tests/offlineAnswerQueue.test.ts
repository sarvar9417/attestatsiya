import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sessionStore } from '../features/auth/sessionStore'
import { ApiError } from '../lib/apiClient'
import {
  clearPendingAnswers,
  enqueuePendingAnswer,
  flushPendingAnswers,
  listPendingAnswers,
} from '../features/exam/offlineAnswerQueue'
import type { SubmitAnswerInput } from '../features/exam/examGateway'

const firstAnswer: SubmitAnswerInput = {
  examId: '30000000-0000-4000-8000-000000000001',
  examKind: 'mock',
  questionId: '30000000-0000-4000-8000-000000000021',
  answer: { option_id: '30000000-0000-4000-8000-000000000031' },
  timeSpentSec: 12,
}

beforeEach(() => {
  sessionStore.set({ access_token: 'test-access', refresh_token: 'test-refresh', expires_at: Date.now() + 3600000,
    user: { id: 'queue-user', email: 'queue@example.invalid', display_name: null, role: 'user' } })
  clearPendingAnswers()
})

describe('offline answer queue', () => {
  it('localStorage yozish xatosida javob saqlandi deb xabar bermaydi', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage')
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: () => null,
        setItem: () => { throw new DOMException('Quota exceeded', 'QuotaExceededError') },
        removeItem: () => {},
      },
    })
    try {
      expect(() => enqueuePendingAnswer(firstAnswer)).toThrow('Javob qurilmada saqlanmadi.')
    } finally {
      if (original) Object.defineProperty(window, 'localStorage', original)
    }
    expect(listPendingAnswers()).toHaveLength(0)
  })

  it('localStorage o‘qish cheklansa ham mavjud onlayn testni yiqitmaydi', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage')
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: () => { throw new DOMException('Storage denied', 'SecurityError') },
        setItem: () => {},
        removeItem: () => {},
      },
    })
    try {
      expect(() => listPendingAnswers()).not.toThrow()
      expect(listPendingAnswers()).toEqual([])
    } finally {
      if (original) Object.defineProperty(window, 'localStorage', original)
    }
  })

  it('boshqa test turida birinchi offline urinishni immutable saqlaydi', () => {
    enqueuePendingAnswer({ ...firstAnswer, examKind: 'bolim' })
    enqueuePendingAnswer({
      ...firstAnswer,
      examKind: 'bolim',
      answer: { option_id: '30000000-0000-4000-8000-000000000032' },
      timeSpentSec: 99,
    })

    const queue = listPendingAnswers()
    expect(queue).toHaveLength(1)
    expect(queue[0].answer).toEqual(firstAnswer.answer)
    expect(queue[0].timeSpentSec).toBe(12)
  })

  it('mock tanlovi o‘zgarsa navbatdagi eng so‘nggi qiymat saqlanadi', () => {
    enqueuePendingAnswer(firstAnswer)
    enqueuePendingAnswer({ ...firstAnswer, answer: { option_id: 'latest' }, timeSpentSec: 40 })
    expect(listPendingAnswers()).toHaveLength(1)
    expect(listPendingAnswers()[0].answer).toEqual({ option_id: 'latest' })
  })

  it('serverga yuborilayotgan eski versiya yangisini o‘chirib yubormaydi', async () => {
    enqueuePendingAnswer(firstAnswer)
    const sender = vi.fn().mockImplementationOnce(async () => {
      enqueuePendingAnswer({ ...firstAnswer, answer: { option_id: 'newer', _client_revision: 22 } })
      return { saved: true }
    }).mockResolvedValue({ saved: true })
    const result = await flushPendingAnswers(sender)
    expect(sender).toHaveBeenCalledTimes(2)
    expect(result.remaining).toBe(0)
    expect((sender.mock.calls[1][0] as SubmitAnswerInput).answer).toEqual({
      option_id: 'newer', _client_revision: 22,
    })
  })

  it('muvaffaqiyatli reconnect flush navbatni tozalaydi', async () => {
    enqueuePendingAnswer(firstAnswer)
    const sender = vi.fn().mockResolvedValue({ saved: true as const })

    const result = await flushPendingAnswers(sender)

    expect(sender).toHaveBeenCalledWith(
      expect.objectContaining({
        examId: firstAnswer.examId,
        questionId: firstAnswer.questionId,
        answer: firstAnswer.answer,
      })
    )
    expect(result).toEqual({
      flushed: 1,
      remaining: 0,
      stoppedByNetwork: false,
    })
    expect(listPendingAnswers()).toHaveLength(0)
  })

  it('tarmoq yana uzilsa javobni jim yo‘qotmaydi', async () => {
    enqueuePendingAnswer(firstAnswer)
    const sender = vi.fn().mockRejectedValue(
      new ApiError('offline', 0, 'NETWORK_ERROR')
    )

    const result = await flushPendingAnswers(sender)

    expect(result).toEqual({
      flushed: 0,
      remaining: 1,
      stoppedByNetwork: true,
    })
    expect(listPendingAnswers()).toHaveLength(1)
  })

  it('server terminal holat qaytarsa navbatni qayta yubormaydi', async () => {
    enqueuePendingAnswer(firstAnswer)
    const sender = vi.fn().mockResolvedValue({ error: 'vaqt_tugadi' as const })

    const result = await flushPendingAnswers(sender)

    expect(result.flushed).toBe(1)
    expect(result.remaining).toBe(0)
    expect(listPendingAnswers()).toHaveLength(0)
  })
})
