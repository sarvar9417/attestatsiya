/**
 * Progress Gateway — user progress sync (backend orqali)
 *
 * Barcha progress amallari Fastify backend API orqali bajariladi;
 * browser Supabase'ga to'g'ridan-to'g'ri ulanmaydi.
 */
import { z } from 'zod'
import { api } from '../../lib/apiClient'
import { dueReviewResponseSchema, type DueReviewItem } from '../exam/contracts'

// ─── Contracts (backend/src/schemas/progress.ts bilan sinxron) ──────

export const syncProgressInputSchema = z.object({
  topics: z
    .array(
      z.object({
        subtopic_code: z.string().min(1),
        completed: z.boolean(),
        correct_count: z.number().int().nonnegative(),
        total_count: z.number().int().positive(),
        last_score: z.number().int().min(0).max(100),
      })
    )
    .optional(),
  module_scores: z
    .array(
      z.object({
        module_code: z.string().min(1),
        exam_score: z.number().int().nonnegative(),
      })
    )
    .optional(),
})
export type SyncProgressInput = z.infer<typeof syncProgressInputSchema>

const syncProgressResponseSchema = z.object({
  topics_synced: z.number().int().nonnegative(),
  modules_synced: z.number().int().nonnegative(),
  errors: z.array(z.string()),
})
export type SyncProgressResponse = z.infer<typeof syncProgressResponseSchema>

export const moduleProgressResponseSchema = z.object({
  module_id: z.string(),
  module_code: z.string(),
  module_title: z.string(),
  exam_best_score: z.number().int().nonnegative().nullable(),
  completed_at: z.string().nullable(),
  unlocked_at: z.string(),
  topic_count: z.number().int().nonnegative(),
  completed_topics: z.number().int().nonnegative(),
})
export type ModuleProgressResponse = z.infer<typeof moduleProgressResponseSchema>

const moduleProgressListSchema = z.array(moduleProgressResponseSchema)

// ─── Gateway ─────────────────────────────────────────────────────────

export const progressGateway = {
  /**
   * Client progress'ni serverga sinxronlash.
   */
  async sync(input: SyncProgressInput): Promise<SyncProgressResponse> {
    const data = await api.post<unknown>('/api/progress/sync', input)
    const parsed = syncProgressResponseSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error('Invalid sync response')
    }
    return parsed.data
  },

  /**
   * Foydalanuvchining barcha modullar bo'yicha progress'ini olish.
   */
  async getModuleProgress(): Promise<ModuleProgressResponse[]> {
    const data = await api.get<unknown>('/api/progress/modules')
    const parsed = moduleProgressListSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error('Invalid module progress response')
    }
    return parsed.data
  },

  /**
   * Interval takrorlashga yetilgan konstruktlar ro'yxati.
   */
  async getDueReviews(): Promise<DueReviewItem[]> {
    const data = await api.get<unknown>('/api/exam/due-reviews')
    const parsed = dueReviewResponseSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error('Invalid due reviews response')
    }
    return parsed.data
  },
}
