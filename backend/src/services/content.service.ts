import { supabase } from '../lib/supabase.js'
import { resolveModuleUuid, resolveLessonUuid } from '../lib/resolveIds.js'
import { NotFoundError, AppError } from '../lib/errors.js'
import type {
  ModuleResponse,
  LessonResponse,
  ConstructResponse,
  LessonQuestion,
  CheckAnswerResult,
} from '../schemas/content.js'

/**
 * Content Service
 *
 * Serves published curriculum content (modules, lessons, constructs).
 * Uses admin supabase client (bypasses RLS for read-only published data).
 */
export const contentService = {
  /**
   * List all published modules, optionally filtered by section.
   */
  async listModules(section?: string, status = 'published'): Promise<ModuleResponse[]> {
    let query = supabase
      .from('modules')
      .select('id, code, title_uz, summary_uz, order_idx, exam_section, status, exam_question_count')
      .eq('status', status)
      .order('order_idx', { ascending: true })

    if (section) {
      query = query.eq('exam_section', section)
    }

    const { data: modules } = await query
    if (!modules) return []

    // Get lesson counts
    const { data: lessons } = await supabase
      .from('lessons')
      .select('module_id')
      .eq('status', 'published')

    const lessonCountMap = new Map<string, number>()
    for (const lesson of lessons || []) {
      lessonCountMap.set(lesson.module_id, (lessonCountMap.get(lesson.module_id) || 0) + 1)
    }

    return modules.map(mod => ({
      id: mod.id,
      code: mod.code,
      title_uz: mod.title_uz,
      summary_uz: mod.summary_uz,
      order_idx: mod.order_idx,
      exam_section: mod.exam_section,
      status: mod.status,
      exam_question_count: mod.exam_question_count,
      lesson_count: lessonCountMap.get(mod.id) || 0,
    }))
  },

  /**
   * Get a single module with its lessons and constructs.
   */
  async getModule(id: string): Promise<ModuleResponse & { lessons: LessonResponse[] }> {
    // Resolve contentTree code to UUID if needed
    const resolvedId = await resolveModuleUuid(id)
    if (!resolvedId) throw new NotFoundError('Modul topilmadi')

    const { data: mod } = await supabase
      .from('modules')
      .select('*')
      .eq('id', resolvedId)
      .single()

    if (!mod) throw new NotFoundError('Modul topilmadi')

    const { data: lessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', resolvedId)
      .eq('status', 'published')
      .order('order_idx', { ascending: true })

    const lessonResponses: LessonResponse[] = []

    // Batch construct lookups to avoid N+1 queries
    const lessonIds = (lessons || []).map(l => l.id)
    const { data: allConstructLinks } = await supabase
      .from('lesson_constructs')
      .select('lesson_id, construct_id')
      .in('lesson_id', lessonIds)

    const constructIds = [...new Set(allConstructLinks?.map(c => c.construct_id) ?? [])]
    const { data: allConstructs } = await supabase
      .from('constructs')
      .select('id, title_uz, code')
      .in('id', constructIds)

    const constructMap = new Map((allConstructs || []).map(c => [c.id, c]))
    const constructsByLesson = new Map<string, { id: string; title_uz: string; code: string }[]>()
    for (const link of allConstructLinks || []) {
      const cons = constructsByLesson.get(link.lesson_id) ?? []
      const construct = constructMap.get(link.construct_id)
      if (construct) cons.push(construct)
      constructsByLesson.set(link.lesson_id, cons)
    }

    for (const lesson of lessons || []) {
      lessonResponses.push({
        id: lesson.id,
        module_id: lesson.module_id,
        title_uz: lesson.title_uz,
        slug: lesson.slug,
        body_mdx: lesson.body_mdx,
        blocks: null,
        blocks_kind: lesson.blocks_kind ?? null,
        est_minutes: lesson.est_minutes,
        order_idx: lesson.order_idx,
        status: lesson.status,
        constructs: constructsByLesson.get(lesson.id) ?? [],
      })
    }

    return {
      id: mod.id,
      code: mod.code,
      title_uz: mod.title_uz,
      summary_uz: mod.summary_uz,
      order_idx: mod.order_idx,
      exam_section: mod.exam_section,
      status: mod.status,
      exam_question_count: mod.exam_question_count,
      lesson_count: lessonResponses.length,
      lessons: lessonResponses,
    }
  },

  /**
   * Get a single lesson with constructs.
   */
  async getLesson(id: string): Promise<LessonResponse> {
    // Resolve contentTree code to UUID if needed
    const resolvedId = await resolveLessonUuid(id)
    if (!resolvedId) throw new NotFoundError('Dars topilmadi')

    const { data: lesson } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', resolvedId)
      .single()

    if (!lesson) throw new NotFoundError('Dars topilmadi')

    const { data: constructs } = await supabase
      .from('lesson_constructs')
      .select('construct_id')
      .eq('lesson_id', lesson.id)

    let constructDetails: { id: string; title_uz: string; code: string }[] = []
    if (constructs?.length) {
      const { data: cons } = await supabase
        .from('constructs')
        .select('id, title_uz, code')
        .in('id', constructs.map(c => c.construct_id))

      constructDetails = (cons || []).map(c => ({
        id: c.id,
        title_uz: c.title_uz,
        code: c.code,
      }))
    }

    return {
      id: lesson.id,
      module_id: lesson.module_id,
      title_uz: lesson.title_uz,
      slug: lesson.slug,
      body_mdx: lesson.body_mdx,
      blocks: lesson.blocks as unknown[] | null,
      blocks_kind: lesson.blocks_kind ?? null,
      est_minutes: lesson.est_minutes,
      order_idx: lesson.order_idx,
      status: lesson.status,
      constructs: constructDetails,
    }
  },

  /**
   * Darsga tegishli published savollar (kalitsiz, learner uchun xavfsiz).
   * Savol egasi darsga source_lesson_id orqali bog'langan.
   */
  async listLessonQuestions(id: string): Promise<LessonQuestion[]> {
    const resolvedId = await resolveLessonUuid(id)
    if (!resolvedId) throw new NotFoundError('Dars topilmadi')

    const { data: questions } = await supabase
      .from('questions')
      .select('id, group_code, format, cognitive, difficulty, stem_md')
      .eq('source_lesson_id', resolvedId)
      .eq('status', 'published')
      // KS/PM.GEN/PM.MET are shared with protected timed exams. These items
      // must never be listed by the immediate-feedback study API.
      .not('group_code', 'in', '(KS,PM.GEN,PM.MET)')
      .order('source_reference', { ascending: true })

    // Defense in depth: even if the database filter is altered, professional
    // exam items must not reach an immediate-feedback lesson endpoint.
    const safeQuestions = (questions ?? []).filter(
      q => !['KS', 'PM.GEN', 'PM.MET'].includes(q.group_code)
    )
    if (safeQuestions.length === 0) return []

    const questionIds = safeQuestions.map(q => q.id)
    const { data: options } = await supabase
      .from('question_options')
      .select('id, question_id, content_md, order_idx')
      .in('question_id', questionIds)
      .order('order_idx', { ascending: true })

    const optionsByQuestion = new Map<string, LessonQuestion['options']>()
    for (const opt of options || []) {
      const list = optionsByQuestion.get(opt.question_id) ?? []
      list.push({ id: opt.id, content_md: opt.content_md, order_idx: opt.order_idx })
      optionsByQuestion.set(opt.question_id, list)
    }

    return safeQuestions.map(q => ({
      id: q.id,
      group_code: q.group_code,
      format: q.format,
      cognitive: q.cognitive,
      difficulty: q.difficulty,
      stem_md: q.stem_md,
      options: optionsByQuestion.get(q.id) ?? [],
    }))
  },

  /**
   * Read-only authoritative readiness snapshot. Unlike counting lesson questions,
   * this uses the exact objective/construct, active taxonomy and keyed predicates
   * required by generate_topic_test(). No exam row is created here.
   * The service-role-only RPC never returns questions, keys or reviewer metadata.
   */
  async topicTestPreflight(id: string) {
    const resolvedId = await resolveLessonUuid(id)
    if (!resolvedId) throw new NotFoundError('Mavzu topilmadi')

    const { data, error } = await supabase.rpc('topic_test_preflight', {
      p_lesson_id: resolvedId,
    })
    if (error || !data || typeof data !== 'object' || Array.isArray(data)) {
      throw new AppError('Mavzu testi tayyorligini tekshirib bo‘lmadi', 503, 'TOPIC_PREFLIGHT_UNAVAILABLE')
    }
    const preflight = data as Record<string, unknown>
    if (preflight.reason === 'lesson_unavailable') {
      throw new NotFoundError('Mavzu nashr qilinmagan')
    }
    if (typeof preflight.ready !== 'boolean' ||
        typeof preflight.required !== 'number' ||
        typeof preflight.available !== 'number' ||
        typeof preflight.duration_sec !== 'number' ||
        typeof preflight.reason !== 'string' ||
        !Array.isArray(preflight.coverage) ||
        !Array.isArray(preflight.critical_objective_gaps) ||
        !Array.isArray(preflight.missing_required_objectives)) {
      throw new AppError('Mavzu testi tayyorligi noto‘g‘ri qaytdi', 503, 'TOPIC_PREFLIGHT_INVALID')
    }
    return {
      ready: preflight.ready,
      required: preflight.required,
      available: preflight.available,
      duration_sec: preflight.duration_sec,
      reason: preflight.reason,
      coverage: preflight.coverage,
      critical_objective_gaps: preflight.critical_objective_gaps,
      missing_required_objectives: preflight.missing_required_objectives,
    }
  },

  /**
   * Savol javobini server tomonda tekshiradi (question_keys client'ga chiqmaydi).
   */
  async checkAnswer(questionId: string, optionId: string): Promise<CheckAnswerResult> {
    const { data: question } = await supabase
      .from('questions')
      .select('id, group_code')
      .eq('id', questionId)
      .eq('status', 'published')
      .maybeSingle()
    if (!question || ['KS', 'PM.GEN', 'PM.MET'].includes(question.group_code)) {
      // Deliberately indistinguishable from a nonexistent question to avoid
      // using the correct_option_id endpoint as an exam-bank key oracle.
      throw new NotFoundError('Savol topilmadi')
    }

    const { data: option } = await supabase
      .from('question_options')
      .select('id, question_id')
      .eq('id', optionId)
      .eq('question_id', questionId)
      .maybeSingle()
    if (!option) throw new AppError('Javob varianti savolga tegishli emas', 400, 'INVALID_OPTION')

    const { data: key } = await supabase
      .from('question_keys')
      .select('payload, explanation_md')
      .eq('question_id', questionId)
      .maybeSingle()
    if (!key) throw new AppError('Savol uchun kalit topilmadi', 500, 'KEY_MISSING')

    const payload = key.payload as { correct_option_id?: string } | null
    const correctOptionId = payload?.correct_option_id ?? ''
    if (!correctOptionId) throw new AppError('Kalit noto‘g‘ri tuzilgan', 500, 'KEY_INVALID')

    return {
      correct: optionId === correctOptionId,
      correct_option_id: correctOptionId,
      explanation_md: key.explanation_md,
    }
  },

  /**
   * List constructs (competencies), optionally filtered by group.
   */
  async listConstructs(groupCode?: string): Promise<ConstructResponse[]> {
    let query = supabase
      .from('constructs')
      .select('*')
      .eq('is_active', true)
      .order('code', { ascending: true })

    if (groupCode) {
      query = query.eq('group_code', groupCode)
    }

    const { data } = await query
    return (data || []).map(c => ({
      id: c.id,
      code: c.code,
      title_uz: c.title_uz,
      description_uz: c.description_uz,
      group_code: c.group_code,
      subject_id: c.subject_id,
    }))
  },
}
