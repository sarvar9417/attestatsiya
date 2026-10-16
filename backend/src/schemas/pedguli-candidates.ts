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

/** Staff review does NOT license a channel, infer a key or publish to exams. */
export const pedguliCandidateReviewSchema = z.object({
  editorial_status: z.enum(['needs_review','needs_source','needs_rights','verified','rejected']),
  rights_status: z.enum(['not_cleared','permission_granted','not_reusable']),
  answer_key_status: z.enum(['unverified','needs_source','independently_verified']),
  historical_exam_claim_status: z.enum(['unverified','independently_verified','not_claimed']),
  suggested_constructs: z.array(z.string().regex(/^(?:KS|PM\.GEN|PM\.MET)\.\d{2}$/)).max(20),
  review_notes: z.string().trim().min(30).max(4000),
}).strict().superRefine((v,ctx)=>{
  if(v.editorial_status==='verified' && (
    v.rights_status!=='permission_granted' ||
    v.answer_key_status!=='independently_verified' ||
    v.suggested_constructs.length===0 ||
    v.review_notes.length<40
  )){
    ctx.addIssue({code:z.ZodIssueCode.custom,
      message:'Verified uchun manba huquqi, mustaqil javob, mavzu va dalilli izoh zarur'})
  }
})
export type PedguliCandidateReview = z.infer<typeof pedguliCandidateReviewSchema>

/**
 * Purely private Stage-4 machine/topic research. Assertions of human review,
 * publication status and reuse rights are intentionally absent from schema.
 */
export const pedguliStage4TopicSchema = z.object({
 telegram_message_id:z.number().int().positive(),
 suggested_construct:z.string().regex(/^(?:KS|PM\.GEN|PM\.MET)\.\d{2}$/).or(z.literal('')),
 suggestion_mode:z.enum(['model_high_margin','model_low_margin','media_blocked']),
 model_margin:z.number().min(0).max(8),
 second_choice:z.string().regex(/^(?:KS|PM\.GEN|PM\.MET)\.\d{2}$/),
 source_scope_warning:z.string().max(1000),
}).strict().superRefine((v,ctx)=>{
 if((v.suggestion_mode==='media_blocked')!==(v.suggested_construct==='')){
  ctx.addIssue({code:z.ZodIssueCode.custom,message:'Missing-media source may not receive a subject code'})
 }
})
export const pedguliStage4ReferenceSchema = z.object({
 telegram_message_id:z.number().int().positive(),
 proposed_correct_letter:z.enum(['A','B','C','D']),
 expected_concept:z.string().min(2).max(200),
 source_support_note:z.string().min(35).max(2000),
 source_title:z.string().min(5).max(250),
 source_url:z.string().url().refine(v=>v.startsWith('https://'), 'HTTPS source required'),
 proposed_construct:z.string().regex(/^(?:KS|PM\.GEN|PM\.MET)\.\d{2}$/),
}).strict()
export const pedguliStage4BatchSchema=z.object({
 topics:z.array(pedguliStage4TopicSchema).max(50),
 answer_references:z.array(pedguliStage4ReferenceSchema).max(10),
}).strict().superRefine((v,ctx)=>{
 if(v.topics.length+v.answer_references.length===0){
  ctx.addIssue({code:z.ZodIssueCode.custom,message:'Empty research batch'})
 }
 if(new Set(v.topics.map(x=>x.telegram_message_id)).size!==v.topics.length){
  ctx.addIssue({code:z.ZodIssueCode.custom,message:'Repeated source id in topic batch'})
 }
 if(new Set(v.answer_references.map(x=>x.telegram_message_id)).size!==v.answer_references.length){
  ctx.addIssue({code:z.ZodIssueCode.custom,message:'Repeated source id in answer evidence'})
 }
})
export type PedguliStage4Batch=z.infer<typeof pedguliStage4BatchSchema>
