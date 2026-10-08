import { z } from 'zod'
import { api } from '../../lib/apiClient'

export const coverageIssueCodeSchema = z.enum([
  'no_published_questions',
  'published_without_source_reference',
  'published_without_source_lesson',
  'published_without_key',
  'group_mismatch',
  'source_lesson_construct_mismatch',
  'outside_active_blueprint',
])

export const constructCoverageSchema = z
  .object({
    construct_id: z.string(),
    construct_code: z.string(),
    group_code: z.string(),
    title_uz: z.string(),
    lesson_slugs: z.array(z.string()),
    question_count: z.number().int(),
    status_counts: z
      .object({
        draft: z.number().int(),
        review: z.number().int(),
        published: z.number().int(),
        archived: z.number().int(),
      })
      .strict(),
    format_counts: z
      .object({
        Y1: z.number().int(),
        Y2: z.number().int(),
        Y3: z.number().int(),
      })
      .strict(),
    cognitive_counts: z
      .object({
        bilish: z.number().int(),
        qollash: z.number().int(),
        mulohaza: z.number().int(),
      })
      .strict(),
    difficulty_counts: z.record(z.string(), z.number().int()),
    traceability: z
      .object({
        with_source_reference: z.number().int(),
        with_source_lesson: z.number().int(),
        with_key: z.number().int(),
      })
      .strict(),
    issues: z.array(coverageIssueCodeSchema),
  })
  .strict()

export const questionCoverageIssueSchema = z
  .object({
    question_id: z.string(),
    construct_code: z.string(),
    group_code: z.string(),
    source_lesson_slug: z.string().nullable(),
    stem_preview: z.string(),
    issues: z.array(coverageIssueCodeSchema),
  })
  .strict()

export const contentCoverageResponseSchema = z
  .object({
    module_code: z.string().nullable(),
    generated_at: z.string(),
    summary: z
      .object({
        construct_count: z.number().int(),
        question_count: z.number().int(),
        published_count: z.number().int(),
        issue_question_count: z.number().int(),
        no_published_construct_count: z.number().int(),
        published_without_source_reference: z.number().int(),
        published_without_source_lesson: z.number().int(),
        published_without_key: z.number().int(),
        group_mismatch: z.number().int(),
        source_lesson_construct_mismatch: z.number().int(),
        outside_active_blueprint: z.number().int(),
      })
      .strict(),
    constructs: z.array(constructCoverageSchema),
    question_issues: z.array(questionCoverageIssueSchema),
  })
  .strict()

export type ContentCoverageReport = z.infer<typeof contentCoverageResponseSchema>
export type CoverageIssueCode = z.infer<typeof coverageIssueCodeSchema>

export const COVERAGE_ISSUE_LABELS: Record<CoverageIssueCode, string> = {
  no_published_questions: 'Published savol yo‘q',
  published_without_source_reference: 'Manba reference yo‘q',
  published_without_source_lesson: 'Manba darsi yo‘q',
  published_without_key: 'Javob kaliti yo‘q',
  group_mismatch: 'Blueprint group mos emas',
  source_lesson_construct_mismatch: 'Dars–objective bog‘lanishi mos emas',
  outside_active_blueprint: 'Faol blueprint tashqarisida',
}

export async function getContentCoverage(
  moduleCode?: string
): Promise<ContentCoverageReport> {
  const params = new URLSearchParams()
  if (moduleCode) params.set('module_code', moduleCode)
  const suffix = params.size > 0 ? `?${params.toString()}` : ''
  const data = await api.get<unknown>(`/api/admin/content-coverage${suffix}`)
  const parsed = contentCoverageResponseSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error('content_coverage: backend javobi kontraktga mos emas')
  }
  return parsed.data
}
