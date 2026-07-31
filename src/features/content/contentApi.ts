/**
 * Content API — published kontent endpointlarining typed client'i
 *
 * Backend: GET /api/content/modules, /modules/:id, /lessons/:id,
 * /constructs (backend/src/routes/content.ts bilan sinxron).
 *
 * Learner oqimi static kontent (src/data/) ishlatadi; bu client
 * admin/preview va DB kontentiga kerak bo'lgan joylar uchun.
 */
import { z } from 'zod'
import { api } from '../../lib/apiClient'

export const moduleSummarySchema = z
  .object({
    id: z.string(),
    code: z.string().nullable(),
    title_uz: z.string(),
    summary_uz: z.string().nullable(),
    order_idx: z.number().int(),
    exam_section: z.string().nullable(),
    status: z.string(),
    exam_question_count: z.number().int().nonnegative(),
    lesson_count: z.number().int().nonnegative(),
  })
  .strict()
export type ModuleSummary = z.infer<typeof moduleSummarySchema>

export const constructRefSchema = z
  .object({
    id: z.string(),
    title_uz: z.string(),
    code: z.string(),
  })
  .strict()
export type ConstructRef = z.infer<typeof constructRefSchema>

export const lessonSummarySchema = z
  .object({
    id: z.string(),
    module_id: z.string(),
    title_uz: z.string(),
    slug: z.string(),
    body_mdx: z.string().nullable(),
    blocks: z.array(z.unknown()).nullable(),
    blocks_kind: z.string().nullable(),
    est_minutes: z.number().int(),
    order_idx: z.number().int(),
    status: z.string(),
    constructs: z.array(constructRefSchema),
  })
  .strict()
export type LessonSummary = z.infer<typeof lessonSummarySchema>

export const lessonQuestionOptionSchema = z
  .object({
    id: z.string(),
    content_md: z.string(),
    order_idx: z.number().int(),
  })
  .strict()
export type LessonQuestionOption = z.infer<typeof lessonQuestionOptionSchema>

export const lessonQuestionSchema = z
  .object({
    id: z.string(),
    group_code: z.string(),
    format: z.string(),
    cognitive: z.string(),
    difficulty: z.number().int(),
    stem_md: z.string(),
    options: z.array(lessonQuestionOptionSchema),
  })
  .strict()
export type LessonQuestion = z.infer<typeof lessonQuestionSchema>

export const checkAnswerResultSchema = z
  .object({
    correct: z.boolean(),
    correct_option_id: z.string(),
    explanation_md: z.string().nullable(),
  })
  .strict()
export type CheckAnswerResult = z.infer<typeof checkAnswerResultSchema>

export const moduleDetailSchema = z
  .object({
    id: z.string(),
    code: z.string().nullable(),
    title_uz: z.string(),
    summary_uz: z.string().nullable(),
    order_idx: z.number().int(),
    exam_section: z.string().nullable(),
    status: z.string(),
    exam_question_count: z.number().int().nonnegative(),
    lesson_count: z.number().int().nonnegative(),
    lessons: z.array(lessonSummarySchema),
  })
  .strict()
export type ModuleDetail = z.infer<typeof moduleDetailSchema>

export const constructSchema = z
  .object({
    id: z.string(),
    code: z.string(),
    title_uz: z.string(),
    description_uz: z.string().nullable(),
    group_code: z.string(),
    subject_id: z.string(),
  })
  .strict()
export type Construct = z.infer<typeof constructSchema>

export const moduleSection = z.enum([
  'specialty',
  'professional_standard',
  'pedagogy',
  'methodology',
])
export type ModuleSection = z.infer<typeof moduleSection>

const moduleListResponseSchema = z.array(moduleSummarySchema)
const moduleDetailResponseSchema = moduleDetailSchema
const lessonDetailResponseSchema = lessonSummarySchema
const constructListResponseSchema = z.array(constructSchema)
const lessonQuestionsResponseSchema = z.array(lessonQuestionSchema)

/**
 * Published modullar ro'yxati. Filtrlar ixtiyoriy.
 */
export async function listModules(
  section?: ModuleSection,
  status: 'published' | 'draft' | 'archived' = 'published'
): Promise<ModuleSummary[]> {
  const params = new URLSearchParams()
  if (section) params.set('section', section)
  params.set('status', status)

  const query = params.toString()
  const data = await api.get<unknown>(`/api/content/modules${query ? `?${query}` : ''}`)
  return parse(moduleListResponseSchema, data, 'list_modules')
}

/**
 * Bitta modul va uning published darslari (code yoki UUID qabul qiladi).
 */
export async function getModuleDetail(id: string): Promise<ModuleDetail> {
  const data = await api.get<unknown>(`/api/content/modules/${encodeURIComponent(id)}`)
  return parse(moduleDetailResponseSchema, data, 'get_module_detail')
}

/**
 * Bitta dars va uning konstruktlari (code yoki UUID qabul qiladi).
 */
export async function getLessonDetail(id: string): Promise<LessonSummary> {
  const data = await api.get<unknown>(`/api/content/lessons/${encodeURIComponent(id)}`)
  return parse(lessonDetailResponseSchema, data, 'get_lesson_detail')
}

/**
 * Darsga tegishli published savollar (kalitsiz).
 * Backend javobida question_keys hech qachon bo'lmaydi.
 */
export async function getLessonQuestions(id: string): Promise<LessonQuestion[]> {
  const data = await api.get<unknown>(`/api/content/lessons/${encodeURIComponent(id)}/questions`)
  return parse(lessonQuestionsResponseSchema, data, 'get_lesson_questions')
}

/**
 * Javobni serverda tekshiradi; to'g'ri variant va izoh qaytadi.
 * Scoring server-authoritative: kalit faqat serverda saqlanadi.
 */
export async function checkAnswer(
  questionId: string,
  optionId: string
): Promise<CheckAnswerResult> {
  const data = await api.post<unknown>('/api/content/questions/check', {
    question_id: questionId,
    option_id: optionId,
  })
  return parse(checkAnswerResultSchema, data, 'check_answer')
}

/**
 * Faol konstruktlar (kompetensiyalar), ixtiyoriy guruh filtri bilan.
 */
export async function listConstructs(groupCode?: string): Promise<Construct[]> {
  const query = groupCode ? `?group_code=${encodeURIComponent(groupCode)}` : ''
  const data = await api.get<unknown>(`/api/content/constructs${query}`)
  return parse(constructListResponseSchema, data, 'list_constructs')
}

function parse<T>(
  schema: z.ZodType<T>,
  payload: unknown,
  operation: string
): T {
  const parsed = schema.safeParse(payload)
  if (parsed.success) return parsed.data

  const issues = parsed.error.issues
    .map((i) => `${i.path.join('.')}: ${i.message}`)
    .join('; ')
  // eslint-disable-next-line no-console
  console.error(`[contentApi] Invalid response for ${operation}:`, issues)
  throw new Error(`Server javobi xavfsizlik tekshiruvidan o‘tmadi: ${issues}`)
}
