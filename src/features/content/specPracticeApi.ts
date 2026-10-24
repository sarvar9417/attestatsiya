import { z } from 'zod'
import { api } from '../../lib/apiClient'

/** Canonical sections in the official 2026 attestatsiya specification. */
export const SPEC_SECTIONS = [
  { code: 'S1', title: 'Axborot va raqamli savodxonlik asoslari' },
  { code: 'S2', title: 'Kompyuter tizimlari va dasturiy muhit' },
  { code: 'S3', title: 'Mantiqiy fikrlash va algoritmlash' },
  { code: 'S4', title: 'Dasturlash va ma’lumotlar bilan ishlash asoslari' },
  { code: 'S5', title: 'Grafika va veb-texnologiyalar' },
  { code: 'S6', title: 'Kompyuter tizimlari va tarmoqlari' },
  { code: 'S7', title: 'Axborot xavfsizligi va raqamli xizmatlar' },
  { code: 'KS', title: 'Kasb standarti' },
  { code: 'PM', title: 'Pedagogik mahorat' },
] as const

export type SpecCode = typeof SPEC_SECTIONS[number]['code']
const specCodeSchema = z.enum(['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'KS', 'PM'])
const optionSchema = z.object({
  id: z.string().uuid(),
  side: z.string(),
  order_idx: z.number().int(),
  content_md: z.string(),
})
const questionSchema = z.object({
  id: z.string().uuid(),
  group_code: z.string(),
  format: z.enum(['Y1', 'Y2', 'Y3']),
  stem_md: z.string(),
  assets: z.unknown(),
  options: z.array(optionSchema),
})
const sectionSchema = z.object({
  code: specCodeSchema,
  title: z.string(),
  count: z.number().int().nonnegative(),
})
const pageSchema = z.object({
  questions: z.array(questionSchema),
  next_cursor: z.string().uuid().nullable(),
  total: z.number().int().nonnegative(),
})
const submittedAnswerSchema = z.union([
  z.object({ option_id: z.string().uuid() }),
  z.object({ pairs: z.record(z.string(), z.string()) }),
  z.object({ order: z.array(z.string()) }),
])
const feedbackSchema = z.object({
  correct: z.boolean(),
  correct_answer: submittedAnswerSchema,
  explanation_md: z.string(),
})

export type SpecQuestion = z.infer<typeof questionSchema>
export type SpecPage = z.infer<typeof pageSchema>
export type SpecFeedback = z.infer<typeof feedbackSchema>
export type SpecAnswer = z.infer<typeof submittedAnswerSchema>

export async function getSpecSectionCounts() {
  const result = await api.get<unknown>('/api/content/spec-practice/sections')
  return z.array(sectionSchema).parse(result)
}

export async function getSpecQuestions(code: SpecCode, cursor?: string): Promise<SpecPage> {
  const suffix = cursor ? '?cursor=' + encodeURIComponent(cursor) : ''
  const result = await api.get<unknown>('/api/content/spec-practice/' + code + '/questions' + suffix)
  return pageSchema.parse(result)
}

export async function checkSpecAnswer(
  code: SpecCode,
  questionId: string,
  answer: SpecAnswer,
): Promise<SpecFeedback> {
  const result = await api.post<unknown>('/api/content/spec-practice/' + code + '/answer', {
    question_id: questionId,
    answer,
  })
  return feedbackSchema.parse(result)
}
