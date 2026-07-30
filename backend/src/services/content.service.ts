import { supabase } from '../lib/supabase.js'
import { resolveModuleUuid, resolveLessonUuid } from '../lib/resolveIds.js'
import { NotFoundError } from '../lib/errors.js'
import type { ModuleResponse, LessonResponse, ConstructResponse } from '../schemas/content.js'

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
      .select('id, code, title_uz, summary_uz, order_idx, exam_section, status')
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
      est_minutes: lesson.est_minutes,
      order_idx: lesson.order_idx,
      status: lesson.status,
      constructs: constructDetails,
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
