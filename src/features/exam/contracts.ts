import { z } from 'zod'
import type { Json } from '../../lib/database.types'

const uuidSchema = z.string().uuid()

export const examOptionSchema = z
  .object({
    id: uuidSchema,
    side: z.enum(['a', 'b']),
    content_md: z.string().min(1),
  })
  .strict()

export const examItemSchema = z
  .object({
    item_id: uuidSchema,
    order_idx: z.number().int().positive(),
    question_id: uuidSchema,
    format: z.enum(['Y1', 'Y2', 'Y3']),
    stem_md: z.string().min(1),
    assets: z.array(z.unknown()),
    options: z.array(examOptionSchema),
    cognitive_level: z.enum(['knowledge', 'application', 'reasoning']).optional(),
    difficulty: z.number().int().min(1).max(5).optional(),
  })
  .strict()
  .superRefine((item, context) => {
    const leftCount = item.options.filter((option) => option.side === 'a').length
    const rightCount = item.options.filter((option) => option.side === 'b').length

    if (item.format === 'Y1' && (leftCount < 2 || rightCount !== 0)) {
      context.addIssue({
        code: 'custom',
        message: 'Y1 options contract is invalid',
      })
    }

    if (item.format === 'Y2' && (leftCount < 1 || rightCount < 1)) {
      context.addIssue({
        code: 'custom',
        message: 'Y2 options contract is invalid',
      })
    }

    if (item.format === 'Y3' && (leftCount < 2 || rightCount !== 0)) {
      context.addIssue({
        code: 'custom',
        message: 'Y3 options contract is invalid',
      })
    }
  })

export const examSessionSchema = z
  .object({
    exam_id: uuidSchema,
    kind: z.enum([
      'diagnostika',
      'mashq',
      'mavzu',
      'bolim',
      'mock',
      'takrorlash',
      'zaif',
    ]),
    duration_sec: z.number().int().positive().nullable(),
    started_at: z.string().refine((value) => Number.isFinite(Date.parse(value)), {
      message: 'started_at must be an ISO date',
    }),
    items: z.array(examItemSchema).min(1),
  })
  .strict()
  .transform((session) => ({
    ...session,
    items: [...session.items].sort((a, b) => a.order_idx - b.order_idx),
  }))

export const scoredSubmitAnswerResponseSchema = z
  .object({
    saved: z.literal(true),
    already_answered: z.boolean().optional(),
    correct: z.boolean(),
    explanation_md: z.string(),
  })
  .strict()

export const protectedSubmitAnswerResponseSchema = z.union([
  z
    .object({
      saved: z.literal(true),
      already_answered: z.boolean().optional(),
    })
    .strict(),
  z
    .object({
      error: z.enum(['sinov_tugagan', 'vaqt_tugadi']),
    })
    .strict(),
])

export const submitAnswerResponseSchema = z.union([
  protectedSubmitAnswerResponseSchema,
  scoredSubmitAnswerResponseSchema,
])

const breakdownItemSchema = z
  .object({
    group_code: z.string(),
    jami: z.number().int().nonnegative(),
    togri: z.number().int().nonnegative(),
  })
  .strict()

export const finishExamResponseSchema = z
  .object({
    exam_id: uuidSchema,
    total_score: z.number().int().nonnegative(),
    max_score: z.number().int().nonnegative(),
    passed: z.boolean().nullable(),
    breakdown: z.array(breakdownItemSchema).nullable(),
    already_finished: z.boolean(),
  })
  .strict()

export const examReviewItemSchema = z
  .object({
    order_idx: z.number().int().positive(),
    stem_md: z.string().min(1),
    format: z.enum(['Y1', 'Y2', 'Y3']),
    construct: z.string().optional(),
    construct_slug: z.string().optional(),
    user_answer: z.unknown(),
    is_correct: z.boolean(),
    key: z.unknown(),
    explanation_md: z.string().nullable(),
  })
  .strict()

export const examReviewResponseSchema = z.array(examReviewItemSchema)

export const dueReviewItemSchema = z
  .object({
    construct_id: z.string().uuid(),
    title_uz: z.string(),
    group_code: z.string(),
    due_at: z.string().nullable(),
    accuracy: z.number(),
  })
  .strict()

export const dueReviewResponseSchema = z.array(dueReviewItemSchema)

export type ExamReviewItem = z.infer<typeof examReviewItemSchema>
export type DueReviewItem = z.infer<typeof dueReviewItemSchema>
export type ExamOption = z.infer<typeof examOptionSchema>
export type ExamItem = z.infer<typeof examItemSchema>
export type ExamSession = z.infer<typeof examSessionSchema>
export type SubmitAnswerResponse = z.infer<
  typeof submitAnswerResponseSchema
>
export type FinishExamResponse = z.infer<typeof finishExamResponseSchema>

export type AnswerValue = string | Record<string, string> | string[]

export function encodeAnswer(item: ExamItem, value: AnswerValue): Json {
  if (item.format === 'Y1' && typeof value === 'string') {
    return { option_id: value }
  }

  if (
    item.format === 'Y2' &&
    typeof value === 'object' &&
    !Array.isArray(value)
  ) {
    return { pairs: value }
  }

  if (item.format === 'Y3' && Array.isArray(value)) {
    return { order: value }
  }

  throw new Error('answer_format_mismatch')
}

export function isAnswerComplete(
  item: ExamItem,
  value: AnswerValue | undefined
): boolean {
  if (item.format === 'Y1') {
    return (
      typeof value === 'string' &&
      item.options.some((option) => option.id === value)
    )
  }

  if (item.format === 'Y2') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false

    const leftIds = item.options
      .filter((option) => option.side === 'a')
      .map((option) => option.id)
    const rightIds = new Set(
      item.options
        .filter((option) => option.side === 'b')
        .map((option) => option.id)
    )
    const selected = leftIds.map((leftId) => value[leftId])

    return (
      selected.every((rightId) => rightIds.has(rightId)) &&
      new Set(selected).size === selected.length
    )
  }

  if (!Array.isArray(value)) return false

  const itemIds = item.options.map((option) => option.id)
  return (
    value.length === itemIds.length &&
    new Set(value).size === itemIds.length &&
    value.every((id) => itemIds.includes(id))
  )
}

function hashSeed(seed: string): number {
  let hash = 2166136261

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

export function stableShuffle<T>(values: readonly T[], seed: string): T[] {
  const result = [...values]
  let state = hashSeed(seed) || 1

  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const target = state % (index + 1)
    ;[result[index], result[target]] = [result[target], result[index]]
  }

  if (
    result.length > 1 &&
    result.every((value, index) => Object.is(value, values[index]))
  ) {
    result.push(result.shift() as T)
  }

  return result
}

export function initialAnswer(
  session: ExamSession,
  item: ExamItem
): AnswerValue | undefined {
  if (item.format !== 'Y3') return undefined

  return stableShuffle(
    item.options.map((option) => option.id),
    `${session.exam_id}:${item.question_id}:Y3`
  )
}
