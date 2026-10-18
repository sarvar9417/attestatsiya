import { describe, expect, it } from 'vitest'
import { customExamConfigSchema, postgresUuidSchema } from '../../schemas/custom-exam.js'
import { allocateDifficultyCounts, buildCustomExamPlan } from '../custom-exam-planner.js'

const FIRST = '00000000-0000-4000-8000-000000000001'
const SECOND = '00000000-0000-4000-8000-000000000002'

const valid = {
  total_count: 12,
  topics: [
    { lesson_id: FIRST, count: 7, difficulty_counts: [
      { difficulty: 2, count: 3 }, { difficulty: 4, count: 4 },
    ] },
    { lesson_id: SECOND, count: 5, difficulty_counts: [
      { difficulty: 3, count: 5 },
    ] },
  ],
  formats: ['Y1', 'Y2'],
  mode: 'exam',
  exposure: 'unseen',
  duration_sec: 1800,
}

describe('TASK-210 custom exam configuration', () => {
  it('accepts multi-topic exact quotas and preserves every slot', () => {
    const { config, slots } = buildCustomExamPlan(valid)
    expect(config.total_count).toBe(12)
    expect(slots).toEqual([
      { lesson_id: FIRST, difficulty: 2, count: 3 },
      { lesson_id: FIRST, difficulty: 4, count: 4 },
      { lesson_id: SECOND, difficulty: 3, count: 5 },
    ])
    expect(slots.reduce((sum, slot) => sum + slot.count, 0)).toBe(12)
  })

  it('accepts canonical PostgreSQL legacy UUID but rejects malformed values', () => {
    const legacyLesson = '5ac78901-23ab-0dab-0123-56789abcdef0'
    const request = { ...valid, topics: [
      { ...valid.topics[0], lesson_id: legacyLesson }, valid.topics[1],
    ] }
    expect(customExamConfigSchema.safeParse(request).success).toBe(true)
    expect(buildCustomExamPlan(request).slots[0]?.lesson_id).toBe(legacyLesson)
    expect(postgresUuidSchema.safeParse('not-a-uuid').success).toBe(false)
    expect(postgresUuidSchema.safeParse('5ac78901-23ab-0dab-0123-56789abcdezz').success).toBe(false)
  })

  it('rejects duplicate topic, duplicate difficulty and invalid total', () => {
    expect(customExamConfigSchema.safeParse({
      ...valid, topics: [valid.topics[0], valid.topics[0]], total_count: 14,
    }).success).toBe(false)
    expect(customExamConfigSchema.safeParse({
      ...valid, topics: [
        { ...valid.topics[0], difficulty_counts: [
          { difficulty: 2, count: 3 }, { difficulty: 2, count: 4 },
        ] },
        valid.topics[1],
      ],
    }).success).toBe(false)
    expect(customExamConfigSchema.safeParse({ ...valid, total_count: 11 }).success).toBe(false)
  })

  it('rejects over-limit, unauthorized extra fields and repeated formats', () => {
    expect(customExamConfigSchema.safeParse({ ...valid, total_count: 101 }).success).toBe(false)
    expect(customExamConfigSchema.safeParse({ ...valid, admin: true }).success).toBe(false)
    expect(customExamConfigSchema.safeParse({ ...valid, formats: ['Y1', 'Y1'] }).success).toBe(false)
    expect(customExamConfigSchema.safeParse({ ...valid, duration_sec: -1 }).success).toBe(false)
  })

  it('allows exactly 1 item without timer, rejects 0 items', () => {
    const single = {
      ...valid, total_count: 1, topics: [{
        lesson_id: FIRST, count: 1,
        difficulty_counts: [{ difficulty: 5, count: 1 }],
      }], duration_sec: null,
    }
    expect(customExamConfigSchema.safeParse(single).success).toBe(true)
    expect(customExamConfigSchema.safeParse({ ...single, total_count: 0 }).success).toBe(false)
  })
})

describe('TASK-210 largest remainder quotas', () => {
  it('preserves sum and deterministic difficulty tie-breaking', () => {
    expect(allocateDifficultyCounts(7, [
      { difficulty: 2, percentage: 50 },
      { difficulty: 1, percentage: 50 },
    ])).toEqual([
      { difficulty: 1, count: 4 },
      { difficulty: 2, count: 3 },
    ])
    expect(allocateDifficultyCounts(11, [
      { difficulty: 1, percentage: 20 },
      { difficulty: 3, percentage: 30 },
      { difficulty: 5, percentage: 50 },
    ])).toEqual([
      { difficulty: 1, count: 2 },
      { difficulty: 3, count: 3 },
      { difficulty: 5, count: 6 },
    ])
  })

  it('omits zero-percentage levels and handles 100 items', () => {
    expect(allocateDifficultyCounts(100, [
      { difficulty: 1, percentage: 0 },
      { difficulty: 5, percentage: 100 },
    ])).toEqual([{ difficulty: 5, count: 100 }])
  })

  it('rejects invalid weights and counts', () => {
    expect(() => allocateDifficultyCounts(0, [{ difficulty: 3, percentage: 100 }])).toThrow()
    expect(() => allocateDifficultyCounts(101, [{ difficulty: 3, percentage: 100 }])).toThrow()
    expect(() => allocateDifficultyCounts(5, [{ difficulty: 3, percentage: 60 }])).toThrow()
    expect(() => allocateDifficultyCounts(5, [
      { difficulty: 3, percentage: 50 }, { difficulty: 3, percentage: 50 },
    ])).toThrow()
  })
})
