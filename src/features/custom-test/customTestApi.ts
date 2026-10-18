import { z } from 'zod'
import { api } from '../../lib/apiClient'

export const customExamConfigSchema = z.object({
  total_count: z.number().int().min(1).max(100),
  topics: z.array(z.object({
    lesson_id: z.string().uuid(),
    count: z.number().int().min(1).max(100),
    difficulty_counts: z.array(z.object({
      difficulty: z.number().int().min(1).max(5),
      count: z.number().int().min(1).max(100),
    })),
  })).min(1).max(30),
  formats: z.array(z.enum(['Y1', 'Y2', 'Y3'])).min(1),
  exposure: z.enum(['all', 'unseen', 'incorrect']),
  mode: z.enum(['learning', 'exam', 'diagnostic', 'mistakes']),
  duration_sec: z.number().int().min(60).max(14400).nullable(),
})

export type CustomExamConfig = z.infer<typeof customExamConfigSchema>

const catalogLesson = z.object({
  id: z.string().uuid(),
  module_id: z.string().uuid(),
  slug: z.string(),
  title_uz: z.string(),
  order_idx: z.number().int(),
})
const catalogModule = z.object({
  id: z.string().uuid(),
  code: z.string(),
  title_uz: z.string(),
  order_idx: z.number().int(),
  lessons: z.array(catalogLesson),
})
export type CatalogModule = z.infer<typeof catalogModule>

const poolCell = z.object({
  lesson_id: z.string().uuid(),
  difficulty: z.number().int().min(1).max(5),
  requested: z.number().int().nonnegative(),
  available: z.number().int().nonnegative(),
})
const previewSchema = z.object({
  ready: z.boolean(),
  requested: z.number().int().nonnegative(),
  available: z.number().int().nonnegative(),
  gaps: z.array(poolCell),
  slots: z.array(poolCell),
})
export type CustomExamPreview = z.infer<typeof previewSchema>

export async function getCustomTestCatalog(): Promise<CatalogModule[]> {
  return z.array(catalogModule).parse(await api.get<unknown>('/api/custom-tests/catalog'))
}

export async function previewCustomTest(config: CustomExamConfig): Promise<CustomExamPreview> {
  return previewSchema.parse(
    await api.post<unknown>('/api/custom-tests/preflight', customExamConfigSchema.parse(config))
  )
}
