import { z } from 'zod'

// ─── Module List ────────────────────────────────────────────────
export const moduleListSchema = {
  querystring: z.object({
    status: z.enum(['published', 'draft', 'archived']).optional(),
    section: z.enum(['specialty', 'professional_standard', 'pedagogy', 'methodology']).optional(),
  }),
}

// ─── Module Detail ──────────────────────────────────────────────
export const moduleDetailSchema = {
  params: z.object({
    id: z.string().min(1),  // UUID or contentTree code
  }),
}

// ─── Lesson Detail ──────────────────────────────────────────────
export const lessonDetailSchema = {
  params: z.object({
    id: z.string().min(1),  // UUID or contentTree code
  }),
}

// ─── Response Types ─────────────────────────────────────────────
export interface ModuleResponse {
  id: string
  code: string | null
  title_uz: string
  summary_uz: string | null
  order_idx: number
  exam_section: string | null
  status: string
  lesson_count: number
}

export interface LessonResponse {
  id: string
  module_id: string
  title_uz: string
  slug: string
  body_mdx: string | null
  est_minutes: number
  order_idx: number
  status: string
  constructs: { id: string; title_uz: string; code: string }[]
}

export interface ConstructResponse {
  id: string
  code: string
  title_uz: string
  description_uz: string | null
  group_code: string
  subject_id: string
}
