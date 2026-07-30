import { describe, expect, it } from 'vitest'
import {
  encodeAnswer,
  examSessionSchema,
  isAnswerComplete,
  protectedSubmitAnswerResponseSchema,
  stableShuffle,
  type ExamItem,
} from '../features/exam/contracts'

const questionId = '00000000-0000-4000-8000-000000000001'
const itemId = '00000000-0000-4000-8000-000000000002'
const examId = '00000000-0000-4000-8000-000000000003'
const leftId = '00000000-0000-4000-8000-000000000004'
const rightId = '00000000-0000-4000-8000-000000000005'

function y2Item(): ExamItem {
  return {
    item_id: itemId,
    order_idx: 1,
    question_id: questionId,
    format: 'Y2',
    stem_md: 'Moslang',
    assets: [],
    options: [
      { id: leftId, side: 'a', content_md: 'Chap' },
      { id: rightId, side: 'b', content_md: 'O‘ng' },
    ],
  }
}

describe('exam RPC contracts', () => {
  it('start payloadida javob kaliti yoki tushuntirishni rad etadi', () => {
    const payload = {
      exam_id: examId,
      kind: 'mock',
      duration_sec: 7200,
      started_at: new Date().toISOString(),
      items: [
        {
          ...y2Item(),
          key: { pairs: { [leftId]: rightId } },
        },
      ],
    }

    expect(examSessionSchema.safeParse(payload).success).toBe(false)
  })

  it('mock submit javobida scoring maydonlarini rad etadi', () => {
    expect(
      protectedSubmitAnswerResponseSchema.safeParse({
        saved: true,
        correct: true,
        explanation_md: 'sir',
      }).success
    ).toBe(false)
  })

  it('Y2 UUID juftligini tekshiradi va server payloadiga o‘raydi', () => {
    const item = y2Item()
    const value = { [leftId]: rightId }

    expect(isAnswerComplete(item, value)).toBe(true)
    expect(encodeAnswer(item, value)).toEqual({ pairs: value })
  })

  it('deterministik shuffle bir xil sessiyada barqaror', () => {
    const values = ['a', 'b', 'c', 'd', 'e']
    const first = stableShuffle(values, `${examId}:${questionId}`)
    const second = stableShuffle(values, `${examId}:${questionId}`)

    expect(first).toEqual(second)
    expect(first).not.toEqual(values)
    expect(first).toHaveLength(values.length)
    expect(new Set(first)).toEqual(new Set(values))
  })
})
