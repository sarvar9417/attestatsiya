import { z } from 'zod'

/** Review inbox only. Never accepts a correct answer or a publish flag. */
export const pedguliCandidateInputSchema = z.object({
  message_id: z.number().int().positive(),
  source_url: z.string().regex(/^https:\/\/t\.me\/PedMahoratGuli\/[1-9]\d*$/),
  source_html: z.string().regex(/^messages(?:[2-9]|\d{2,})?\.html$/),
  date_local: z.string().trim().min(1).max(120),
  raw_text_private: z.string().trim().min(20).max(30000),
  suggested_constructs: z.array(z.string().regex(/^(?:KS|PM\.GEN|PM\.MET)\.\d{2}$/)).max(20),
  media_present: z.boolean(),
  key_marker_unverified: z.boolean(),
}).strict().superRefine((value, ctx) => {
  if (value.source_url !== 'https://t.me/PedMahoratGuli/' + value.message_id) {
    ctx.addIssue({ code: z.ZodIssueCode.custom,
      path: ['source_url'], message: 'Telegram URL va xabar ID mos emas' })
  }
})

export const pedguliCandidateImportSchema = z.object({
  items: z.array(pedguliCandidateInputSchema).min(1).max(50),
}).strict().superRefine((value, ctx) => {
  const ids = new Set<number>()
  for (const [i,item] of value.items.entries()) {
    if (ids.has(item.message_id)) ctx.addIssue({
      code: z.ZodIssueCode.custom, path: ['items',i,'message_id'],
      message: 'Bir import paketida xabar ID takrorlanmasligi kerak',
    })
    ids.add(item.message_id)
  }
})

export const pedguliCandidateListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(25),
  status: z.enum(['needs_review','needs_source','needs_rights','verified','rejected']).optional(),
  min_priority: z.coerce.number().int().min(1).max(3).optional(),
}).strict()

export type PedguliCandidateInput = z.infer<typeof pedguliCandidateInputSchema>
export type PedguliCandidateListQuery = z.infer<typeof pedguliCandidateListQuerySchema>
