import { beforeEach, describe, expect, it, vi } from 'vitest'
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
  clearPendingAnswers()
})

describe('offline answer queue', () => {
  it('bir savol uchun birinchi offline urinishni immutable saqlaydi', () => {
    enqueuePendingAnswer(firstAnswer)
    enqueuePendingAnswer({
      ...firstAnswer,
      answer: { option_id: '30000000-0000-4000-8000-000000000032' },
      timeSpentSec: 99,
    })

    const queue = listPendingAnswers()
    expect(queue).toHaveLength(1)
    expect(queue[0].answer).toEqual(firstAnswer.answer)
    expect(queue[0].timeSpentSec).toBe(12)
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
