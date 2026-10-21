import { describe, expect, it } from 'vitest'
import { correctGroupAnswerLabel, visibleGroupFeedback, type GroupMockState } from './groupMockApi'

const A = '93470000-0000-4000-8000-000000000011'
const B = '93470000-0000-4000-8000-000000000012'
const QUESTION = '93470000-0000-4000-8000-000000000020'

const base: GroupMockState = {
  room_id: '93470000-0000-4000-8000-000000000010',
  code: 'A1B2C3D4',
  mode: 'manual',
  status: 'question',
  is_host: false,
  total_count: 1,
  current_idx: 1,
  members: [],
  messages: [],
  question: {
    item_id: '93470000-0000-4000-8000-000000000021',
    question_id: QUESTION,
    order_idx: 1,
    format: 'Y1',
    stem_md: 'Qaysi variant to‘g‘ri?',
    assets: [],
    options: [
      { id: A, side: 'a', content_md: 'To‘g‘ri' },
      { id: B, side: 'a', content_md: 'Noto‘g‘ri' },
    ],
  },
  my_answer: null,
  answered_count: 0,
  answers: [],
  correct_answer: null,
  explanation_md: null,
}

describe('group mock result contract', () => {
  it('must never render answers or explanations during lobby/question phases', () => {
    const unsafe = {
      ...base,
      correct_answer: { correct_option_id: A },
      explanation_md: 'Sensitive explanation',
      answers: [{
        user_id: '93470000-0000-4000-8000-000000000030',
        name: 'Birinchi', answer: { option_id: A }, is_correct: true,
      }],
    } satisfies GroupMockState
    expect(visibleGroupFeedback(unsafe)).toBeNull()
    expect(visibleGroupFeedback({ ...unsafe, status: 'lobby' })).toBeNull()
  })

  it('renders the server-revealed key and per-member result after reveal', () => {
    const revealed: GroupMockState = {
      ...base, status: 'reveal',
      correct_answer: { correct_option_id: A },
      explanation_md: 'Server izohi',
      answers: [{
        user_id: '93470000-0000-4000-8000-000000000030',
        name: 'Ishtirokchi', answer: { option_id: A }, is_correct: true,
      }],
    }
    expect(visibleGroupFeedback(revealed)?.answers).toHaveLength(1)
    expect(visibleGroupFeedback(revealed)?.explanation_md).toBe('Server izohi')
    expect(correctGroupAnswerLabel(revealed.question!, revealed.correct_answer!)).toBe('To‘g‘ri')
  })

  it('displays matching and ordering answers by option text', () => {
    const q = base.question!
    expect(correctGroupAnswerLabel({
      ...q, format: 'Y2',
      options: [
        { id: A, side: 'a', content_md: 'Savol' },
        { id: B, side: 'b', content_md: 'Javob' },
      ],
    }, { pairs: { [A]: B } })).toBe('Savol → Javob')
    expect(correctGroupAnswerLabel({
      ...q, format: 'Y3',
    }, { order: [B, A] })).toBe('Noto‘g‘ri → To‘g‘ri')
  })
})
