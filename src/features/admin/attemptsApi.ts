/**
 * Admin API — sinov urinishlari statistikasi (admin role talab qilinadi).
 *
 * Backend: GET /api/admin/attempts, GET /api/admin/attempts/:id
 * (backend/src/routes/admin.ts bilan sinxron).
 */
import { z } from 'zod'
import { api } from '../../lib/apiClient'

export const attemptSummarySchema = z
  .object({
    exam_id: z.string(),
    user_id: z.string(),
    email: z.string().nullable(),
    display_name: z.string().nullable(),
    kind: z.string(),
    lesson_id: z.string().nullable(),
    lesson_slug: z.string().nullable(),
    started_at: z.string(),
    finished_at: z.string().nullable(),
    total_score: z.number(),
    max_score: z.number(),
    passed: z.boolean(),
    answered_count: z.number().int(),
    breakdown: z.unknown().nullable(),
  })
  .strict()
export type AttemptSummary = z.infer<typeof attemptSummarySchema>

export const attemptItemSchema = z
  .object({
    item_id: z.string(),
    order_idx: z.number().int(),
    question_id: z.string(),
    group_code: z.string().nullable(),
    format: z.string().nullable(),
    stem_md: z.string().nullable(),
    options: z.array(
      z
        .object({
          id: z.string(),
          side: z.string().nullable(),
          content_md: z.string().nullable(),
        })
        .strict()
    ),
    user_answer: z.unknown().nullable(),
    is_correct: z.boolean().nullable(),
    score: z.number(),
    time_spent_sec: z.number().int().nullable(),
    flagged: z.boolean(),
    answered_at: z.string().nullable(),
    correct_option_id: z.string().nullable(),
    explanation_md: z.string().nullable(),
  })
  .strict()
export type AttemptItem = z.infer<typeof attemptItemSchema>

export const attemptDetailSchema = z
  .object({
    exam_id: z.string(),
    user_id: z.string(),
    email: z.string().nullable(),
    display_name: z.string().nullable(),
    kind: z.string(),
    lesson_id: z.string().nullable(),
    lesson_slug: z.string().nullable(),
    started_at: z.string(),
    finished_at: z.string().nullable(),
    total_score: z.number(),
    max_score: z.number(),
    passed: z.boolean(),
    breakdown: z.unknown().nullable(),
    items: z.array(attemptItemSchema),
  })
  .strict()
export type AttemptDetail = z.infer<typeof attemptDetailSchema>

export const listAttemptsResponseSchema = z
  .object({
    items: z.array(attemptSummarySchema),
    total: z.number().int(),
    page: z.number().int(),
    page_size: z.number().int(),
  })
  .strict()
export type ListAttemptsResponse = z.infer<typeof listAttemptsResponseSchema>

export interface AttemptFilters {
  kind?: string
  lesson_id?: string
  user_id?: string
  from?: string
  to?: string
  page?: number
  page_size?: number
}

export const EXAM_KIND_LABELS = {
  mavzu: 'Mavzu testi',
  bolim: 'Bo‘lim',
  mock: 'Simulyatsiya',
  takrorlash: 'Takrorlash',
  zaif: 'Zaif maydon',
  diagnostika: 'Diagnostika',
} as const
export type ExamKind = keyof typeof EXAM_KIND_LABELS

export function examKindLabel(kind: string): string {
  return EXAM_KIND_LABELS[kind as ExamKind] ?? kind
}

/**
 * GET /api/admin/attempts — urinishlar ro'yxati.
 */
export async function listAttempts(filters: AttemptFilters = {}): Promise<ListAttemptsResponse> {
  const params = new URLSearchParams()
  if (filters.kind) params.set('kind', filters.kind)
  if (filters.lesson_id) params.set('lesson_id', filters.lesson_id)
  if (filters.user_id) params.set('user_id', filters.user_id)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  params.set('page', String(filters.page ?? 1))
  params.set('page_size', String(filters.page_size ?? 20))

  const data = await api.get<unknown>(`/api/admin/attempts?${params.toString()}`)
  return parse(listAttemptsResponseSchema, data, 'list_attempts')
}

/**
 * GET /api/admin/attempts/:id — bitta urinishning to'liq detali.
 */
export async function getAttemptDetail(examId: string): Promise<AttemptDetail> {
  const data = await api.get<unknown>(`/api/admin/attempts/${encodeURIComponent(examId)}`)
  return parse(attemptDetailSchema, data, 'get_attempt_detail')
}

function parse<T>(
  schema: z.ZodType<T>,
  data: unknown,
  context: string
): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(`${context}: backend javobi kontraktga mos emas`)
  }
  return result.data
}
