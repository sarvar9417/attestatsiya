import { z } from 'zod'

const difficultyCountSchema = z.object({
  difficulty: z.number().int().min(1).max(5),
  count: z.number().int().min(1).max(100),
}).strict()

/** Canonical PostgreSQL UUIDs include non-RFC imported/legacy identifiers. */
export const postgresUuidSchema = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  'PostgreSQL UUID shakli noto‘g‘ri'
)

const customTopicSchema = z.object({
  lesson_id: postgresUuidSchema,
  construct_id: postgresUuidSchema.optional(),
  count: z.number().int().min(1).max(100),
  difficulty_counts: z.array(difficultyCountSchema).min(1).max(5),
}).strict()

/**
 * A–E labels correspond to difficulty 1–5.
 * This is a contract only; source-backed question pool eligibility and actual
 * availability must be checked by the server before creating an attempt.
 */
export const customExamConfigSchema = z.object({
  total_count: z.number().int().min(1).max(100),
  topics: z.array(customTopicSchema).min(1).max(30),
  formats: z.array(z.enum(['Y1', 'Y2', 'Y3'])).min(1).max(3),
  exposure: z.enum(['all', 'unseen', 'incorrect']),
  mode: z.enum(['learning', 'exam', 'diagnostic', 'mistakes']),
  duration_sec: z.number().int().min(60).max(14_400).nullable(),
}).strict().superRefine((value, context) => {
  const lessonIds = new Set<string>()
  let total = 0

  for (const [topicIndex, topic] of value.topics.entries()) {
    if (lessonIds.has(topic.lesson_id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['topics', topicIndex, 'lesson_id'],
        message: 'Bitta mavzu faqat bir marta tanlanishi mumkin',
      })
    }
    lessonIds.add(topic.lesson_id)
    total += topic.count

    const levels = new Set<number>()
    let difficultyTotal = 0
    for (const [levelIndex, level] of topic.difficulty_counts.entries()) {
      if (levels.has(level.difficulty)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['topics', topicIndex, 'difficulty_counts', levelIndex, 'difficulty'],
          message: 'Bitta qiyinchilik darajasi takrorlangan',
        })
      }
      levels.add(level.difficulty)
      difficultyTotal += level.count
    }

    if (difficultyTotal !== topic.count) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['topics', topicIndex, 'difficulty_counts'],
        message: 'Darajalar bo‘yicha savollar yig‘indisi mavzu kvotasiga teng bo‘lishi kerak',
      })
    }
  }

  if (total !== value.total_count) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['total_count'],
      message: 'Mavzular bo‘yicha savollar yig‘indisi umumiy songa teng bo‘lishi kerak',
    })
  }

  if (new Set(value.formats).size !== value.formats.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['formats'],
      message: 'Savol formatlari takrorlanmasligi kerak',
    })
  }
})

export type CustomExamConfig = z.infer<typeof customExamConfigSchema>
export type CustomExamTopic = CustomExamConfig['topics'][number]
