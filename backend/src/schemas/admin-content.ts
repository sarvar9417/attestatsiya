import { z } from 'zod'

export const adminContentStatusSchema = z.enum(['draft', 'review', 'published', 'archived'])
export const adminQuestionFormatSchema = z.enum(['Y1', 'Y2', 'Y3'])
export const adminCognitiveSchema = z.enum(['bilish', 'qollash', 'mulohaza'])

export const adminQuestionsQuerySchema = {
  querystring: z.object({
    status: adminContentStatusSchema.optional(),
    source: z.enum(['pedguli', 'pedagogy_pdf']).optional(),
    group_code: z.enum(['KS', 'PM.GEN', 'PM.MET']).optional(),
    query: z.string().trim().max(120).optional(),
    page: z.coerce.number().int().min(1).max(100000).default(1),
    page_size: z.coerce.number().int().min(1).max(100).default(25),
  }),
}

export const createAdminModuleSchema = z.object({
  code: z.string().trim().max(32).optional().nullable(),
  title_uz: z.string().trim().min(1).max(300),
  summary_uz: z.string().trim().max(2000).optional().nullable(),
  subject_id: z.string().uuid(),
})

export const transitionAdminQuestionSchema = z.object({
  status: adminContentStatusSchema,
})

export const adminQuestionOptionInputSchema = z.object({
  content_md: z.string().trim().min(1).max(4000),
})

export const saveAdminQuestionSchema = z
  .object({
    stem_md: z.string().trim().min(1).max(12000),
    format: adminQuestionFormatSchema,
    cognitive: adminCognitiveSchema,
    difficulty: z.number().int().min(1).max(5),
    construct_id: z.string().uuid(),
    options: z.array(adminQuestionOptionInputSchema).optional(),
    correct_index: z.number().int().min(0).max(3).optional(),
    explanation_md: z.string().trim().max(12000).optional().default(''),
  })
  .superRefine((value, ctx) => {
    if (value.format !== 'Y1') return

    if (!value.options || value.options.length !== 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['options'],
        message: 'Y1 savol uchun aynan 4 ta variant kerak',
      })
    }

    if (value.correct_index === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['correct_index'],
        message: 'Y1 savol uchun to‘g‘ri variant kerak',
      })
    }
  })

export type CreateAdminModuleInput = z.infer<typeof createAdminModuleSchema>
export type SaveAdminQuestionInput = z.infer<typeof saveAdminQuestionSchema>
export type AdminContentStatus = z.infer<typeof adminContentStatusSchema>

/** These values are assertions by a real admin reviewer, not AI-generated keys. */
export const savePedguliEditorialReviewSchema = z.object({
  answer_verified: z.boolean(),
  reference_verified: z.boolean(),
  wording_verified: z.boolean(),
  original_authorship_verified: z.boolean(),
  reviewer_notes: z.string().trim().min(20).max(4000),
}).strict()
export type SavePedguliEditorialReview = z.infer<typeof savePedguliEditorialReviewSchema>

/** A private source inbox, not public question content. */
export const pedagogyPdfSourceListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).default(1),
  page_size: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(['verified', 'accepted_general', 'rejected', 'needs_review']).optional(),
  source_year: z.coerce.number().int().min(2020).max(2100).optional(),
  unlinked_only: z.enum(['true','false']).transform(v => v === 'true').optional(),
})

export const stagePedagogyPdfQuestionSchema = z.object({
  stem_md: z.string().trim().min(15).max(12000),
  options: z.array(z.string().trim().min(2).max(4000)).length(4),
  correct_index: z.number().int().min(0).max(3),
  explanation_md: z.string().trim().min(12).max(12000),
}).strict()
export type StagePedagogyPdfQuestion = z.infer<typeof stagePedagogyPdfQuestionSchema>
