import { describe, expect, it } from 'vitest'
import { checkAnswerSchema } from '../content.js'

describe('PostgreSQL-imported UUIDs in content check API', () => {
  it('accepts 128-bit MD5 question and option IDs saved in production', () => {
    const result = checkAnswerSchema.body.safeParse({
      question_id: '3488c43b-bc8e-b6b3-32bb-fb4b785dbdb5',
      option_id: 'ed6d69c6-e627-5a4a-b491-e30087e93923',
    })
    expect(result.success).toBe(true)
  })

  it('still rejects malformed values and arbitrary text', () => {
    for (const value of ['bad', '123', '3488c43b-bc8e-b6b3-32bb-fb4b785dbdb5;DROP']) {
      expect(checkAnswerSchema.body.safeParse({
        question_id: value,
        option_id: 'ed6d69c6-e627-5a4a-b491-e30087e93923',
      }).success).toBe(false)
    }
  })
})
