import { z } from 'zod'
import { api } from '../../lib/apiClient'
import { postgresUuidSchema } from '../exam/contracts'

export const customExamConfigSchema = z.object({
  total_count: z.number().int().min(1).max(100),
  topics: z.array(z.object({
    lesson_id: postgresUuidSchema,
    construct_id: postgresUuidSchema.optional(),
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
  id: postgresUuidSchema,
  module_id: postgresUuidSchema,
  slug: z.string(),
  title_uz: z.string(),
  order_idx: z.number().int(),
  constructs: z.array(z.object({
    id: postgresUuidSchema,
    code: z.string(),
    title_uz: z.string(),
  })).default([]),
})
const catalogModule = z.object({
  id: postgresUuidSchema,
  code: z.string(),
  title_uz: z.string(),
  order_idx: z.number().int(),
  lessons: z.array(catalogLesson),
})
export type CatalogModule = z.infer<typeof catalogModule>

const poolCell = z.object({
  lesson_id: postgresUuidSchema,
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
  const payload = await api.get<unknown>('/api/custom-tests/catalog')
  const validated = z.array(catalogModule).safeParse(payload)
  if (!validated.success) {
    // Never render a giant raw Zod issue array on the learner's page.
    throw new Error('Mavzular ro‘yxati serverdan noto‘g‘ri formatda keldi. Qayta urinib ko‘ring.')
  }
  return validated.data
}

export async function previewCustomTest(config: CustomExamConfig): Promise<CustomExamPreview> {
  return previewSchema.parse(
    await api.post<unknown>('/api/custom-tests/preflight', customExamConfigSchema.parse(config))
  )
}

export const customPresetSchema = z.object({
  id: postgresUuidSchema,
  name: z.string().min(2).max(60),
  config: customExamConfigSchema,
  created_at: z.string(),
  updated_at: z.string(),
})
export type CustomPreset = z.infer<typeof customPresetSchema>

export async function listCustomTestPresets(): Promise<CustomPreset[]> {
  return z.array(customPresetSchema).parse(
    await api.get<unknown>('/api/custom-tests/presets')
  )
}

export async function saveCustomTestPreset(name: string, config: CustomExamConfig): Promise<CustomPreset> {
  return customPresetSchema.parse(
    await api.post<unknown>('/api/custom-tests/presets', {
      name, config: customExamConfigSchema.parse(config),
    })
  )
}

export async function updateCustomTestPreset(
  id: string,
  patch: { name?: string; config?: CustomExamConfig }
): Promise<CustomPreset> {
  return customPresetSchema.parse(
    await api.patch<unknown>(`/api/custom-tests/presets/${id}`, patch)
  )
}

export async function deleteCustomTestPreset(id: string): Promise<void> {
  z.object({ deleted: z.literal(true) }).parse(
    await api.delete<unknown>(`/api/custom-tests/presets/${id}`)
  )
}

const analysisCountSchema = z.object({
  total: z.number().int().nonnegative(),
  answered: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
})
export const customExamAnalysisSchema = analysisCountSchema.extend({
  exam_id: z.string().uuid(),
  by_lesson: z.array(analysisCountSchema.extend({
    lesson_id: postgresUuidSchema,
    lesson_title: z.string(),
  })),
  by_difficulty: z.array(analysisCountSchema.extend({ difficulty: z.number().int().min(1).max(5) })),
  by_format: z.array(analysisCountSchema.extend({ format: z.enum(['Y1', 'Y2', 'Y3']) })),
})
export type CustomExamAnalysis = z.infer<typeof customExamAnalysisSchema>

export async function getCustomExamAnalysis(examId: string): Promise<CustomExamAnalysis> {
  return customExamAnalysisSchema.parse(
    await api.get<unknown>(`/api/custom-tests/${encodeURIComponent(examId)}/analysis`)
  )
}

const activeCustomSessionSchema = z.object({
  exam_id: z.string().uuid(),
  kind: z.literal('custom'),
  duration_sec: z.number().int().positive().nullable(),
  started_at: z.string(),
  selection_meta: z.object({ config: customExamConfigSchema }).passthrough(),
  items: z.array(z.unknown()).min(1),
  answered_question_ids: z.array(postgresUuidSchema),
  saved_answers: z.record(z.string(),z.unknown()),
})
export type ActiveCustomSession = z.infer<typeof activeCustomSessionSchema>

export async function getActiveCustomSession(): Promise<ActiveCustomSession | null> {
  const value = await api.get<unknown>('/api/custom-tests/active')
  return activeCustomSessionSchema.nullable().parse(value)
}
