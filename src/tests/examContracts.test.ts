import { describe, expect, it } from 'vitest'
import {
  encodeAnswer,
  examSessionSchema,
  isAnswerComplete,
  protectedSubmitAnswerResponseSchema,
  stableShuffle,
  type ExamItem,
  postgresUuidSchema,
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
  it('pedagogik_15 session turini qat’iy tekshiradi va answer keyni rad etadi', () => {
    const base = {
      exam_id: examId, kind: 'pedagogik_15', duration_sec: 1800,
      started_at: new Date().toISOString(), items: [y2Item()],
    }
    expect(examSessionSchema.safeParse(base).success).toBe(true)
    expect(examSessionSchema.safeParse({ ...base, items: [{ ...y2Item(), key: {} }] }).success).toBe(false)
  })

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
  it('M05 importidagi PostgreSQL-valid MD5 UUIDlarni qabul qiladi, faqat qat’iy shakllarni tekshiradi', () => {
    // Production database'dan xavfsiz namunalar: ID formatlari haqiqiy,
    // lekin UUID version/variant bitlari RFC shaklida emas.
    const importedQuestion = '3488c43b-bc8e-b6b3-32bb-fb4b785dbdb5'
    const importedOptionA = '9ccb562f-aff1-bfd3-b1bc-a1ab023fa837'
    const importedOptionB = 'ed6d69c6-e627-5a4a-b491-e30087e93923'
    const response = {
      exam_id: examId,
      kind: 'mavzu',
      duration_sec: 2400,
      started_at: '2026-10-18T09:00:00.000Z',
      selection_meta: { selector_version: 'objective-complete-v1' },
      items: [{
        item_id: itemId,
        order_idx: 1,
        question_id: importedQuestion,
        format: 'Y1',
        stem_md: 'O‘nlik sonni boshqa asosga o‘tkazish usuli qaysi?',
        assets: [],
        options: [
          { id: importedOptionA, side: 'a', content_md: 'Teskari sanash' },
          { id: importedOptionB, side: 'a', content_md: 'Qoldiqli bo‘lish' },
        ],
      }],
    }
    const parsed = examSessionSchema.parse(response)
    expect(parsed.items[0].question_id).toBe(importedQuestion)
    expect(parsed.items[0].options[1].id).toBe(importedOptionB)

    // Non-UUID yoki UUIDga qo‘shimcha belgi qo‘shilgan qiymat rad etiladi.
    expect(postgresUuidSchema.safeParse('not-a-uuid').success).toBe(false)
    expect(postgresUuidSchema.safeParse(importedOptionA + '!').success).toBe(false)
    expect(examSessionSchema.safeParse({
      ...response, items: [{ ...response.items[0], question_id: 'bogus' }],
    }).success).toBe(false)
    // Test kalitini yuborishdagi xavfsizlik cheklovi saqlanadi.
    expect(examSessionSchema.safeParse({
      ...response, items: [{ ...response.items[0], key: { correct_option_id: importedOptionB } }],
    }).success).toBe(false)
  })

  it('MD5-UUID Y2 va Y3 variantlarni ham qabul qiladi', () => {
    const legacyOption = 'df66a383-8a17-7f9f-d776-262368be3fbb'
    const y2 = y2Item()
    const base = {
      exam_id: examId,
      kind: 'mavzu',
      duration_sec: 2400,
      started_at: '2026-10-18T09:00:00.000Z',
      items: [{ ...y2, options: [
        { id: legacyOption, side: 'a', content_md: 'Chap' },
        { id: rightId, side: 'b', content_md: 'O‘ng' },
      ] }],
    }
    expect(examSessionSchema.safeParse(base).success).toBe(true)
    expect(examSessionSchema.safeParse({
      ...base, items: [{ ...y2, format: 'Y3', options: [
        { id: legacyOption, side: 'a', content_md: 'Birinchi' },
        { id: rightId, side: 'a', content_md: 'Ikkinchi' },
      ] }],
    }).success).toBe(true)
  })

})
