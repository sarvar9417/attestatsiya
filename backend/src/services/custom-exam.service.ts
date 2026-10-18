import { getAuthedClient, supabase } from '../lib/supabase.js'
import { AppError } from '../lib/errors.js'
import { buildCustomExamPlan } from './custom-exam-planner.js'
import type { CustomExamConfig } from '../schemas/custom-exam.js'
import type { ExamStartResponse } from '../schemas/exam.js'

export interface CustomCatalogLesson {
  id: string
  module_id: string
  slug: string
  title_uz: string
  order_idx: number
  constructs: Array<{ id: string; code: string; title_uz: string }>
}

export interface CustomCatalogModule {
  id: string
  code: string
  title_uz: string
  order_idx: number
  lessons: CustomCatalogLesson[]
}

export interface CustomExamPreview {
  ready: boolean
  requested: number
  available: number
  gaps: Array<{ lesson_id: string; difficulty: number; requested: number; available: number }>
  slots: Array<{ lesson_id: string; difficulty: number; requested: number; available: number }>
}

function mapCustomExamError(error: { message: string }, operation: 'preview' | 'start'): never {
  if (error.message.includes('custom_pool_insufficient')) {
    throw new AppError('Tanlangan mavzu va darajadagi savollar yetarli emas', 409, 'CUSTOM_POOL_INSUFFICIENT')
  }
  if (error.message.includes('custom_lesson_unavailable')) {
    throw new AppError('Tanlangan mavzu mavjud emas yoki nashr etilmagan', 404, 'CUSTOM_LESSON_UNAVAILABLE')
  }
  if (error.message.includes('custom_config_invalid') || error.message.includes('invalid input syntax')) {
    throw new AppError('Test sozlamalari noto‘g‘ri', 400, 'CUSTOM_CONFIG_INVALID')
  }
  if (/function public\.(custom_exam_preflight|generate_custom_exam).*does not exist/i.test(error.message)) {
    throw new AppError('Shaxsiy test bazasi yangilanmagan', 503, 'CUSTOM_EXAM_UNAVAILABLE')
  }
  throw new AppError(
    operation === 'preview' ? 'Savollarni tekshirib bo‘lmadi' : 'Shaxsiy test yaratilmadi',
    503, 'CUSTOM_EXAM_UNAVAILABLE'
  )
}

export const customExamService = {
  async catalog(userToken: string): Promise<CustomCatalogModule[]> {
    const client = getAuthedClient(userToken)
    const { data: modules, error: moduleError } = await client
      .from('modules')
      .select('id, code, title_uz, order_idx')
      .eq('status', 'published')
      .order('order_idx', { ascending: true })

    if (moduleError) throw new AppError('Bo‘limlar ro‘yxati olinmadi', 503, 'CUSTOM_CATALOG_UNAVAILABLE')

    const publishedModules = modules ?? []
    if (!publishedModules.length) return []

    const { data: lessons, error: lessonError } = await client
      .from('lessons')
      .select('id, module_id, slug, title_uz, order_idx')
      .eq('status', 'published')
      .in('module_id', publishedModules.map(m => m.id))
      .order('order_idx', { ascending: true })

    if (lessonError) throw new AppError('Mavzular ro‘yxati olinmadi', 503, 'CUSTOM_CATALOG_UNAVAILABLE')
    const allLessons = lessons ?? []
    if (!allLessons.length) {
      return publishedModules.map(module => ({ ...module, code: module.code ?? '', lessons: [] }))
    }

    // Only public learning-objective metadata: never read question_keys here.
    const { data: links, error: linksError } = await supabase
      .from('lesson_constructs')
      .select('lesson_id, construct_id')
      .in('lesson_id', allLessons.map(lesson => lesson.id))
    if (linksError) throw new AppError('Kichik mavzular ro‘yxati olinmadi', 503, 'CUSTOM_CATALOG_UNAVAILABLE')

    const constructIds = [...new Set((links ?? []).map(link => link.construct_id))]
    const { data: constructs, error: constructsError } = constructIds.length
      ? await supabase.from('constructs').select('id, code, title_uz')
        .eq('is_active', true).in('id', constructIds)
      : { data: [], error: null }
    if (constructsError) throw new AppError('Kichik mavzular ro‘yxati olinmadi', 503, 'CUSTOM_CATALOG_UNAVAILABLE')

    const constructMap = new Map((constructs ?? []).map(item => [item.id, item]))
    const byLesson = new Map<string, Array<{ id: string; code: string; title_uz: string }>>()
    for (const link of links ?? []) {
      const construct = constructMap.get(link.construct_id)
      if (!construct) continue
      const existing = byLesson.get(link.lesson_id) ?? []
      if (!existing.some(item => item.id === construct.id)) existing.push(construct)
      byLesson.set(link.lesson_id, existing)
    }

    return publishedModules.map(module => ({
      ...module,
      code: module.code ?? '',
      lessons: allLessons.filter(lesson => lesson.module_id === module.id)
        .map(lesson => ({
          ...lesson,
          constructs: (byLesson.get(lesson.id) ?? []).sort((a, b) => a.code.localeCompare(b.code)),
        })),
    }))
  },

  async preview(config: CustomExamConfig, userToken: string): Promise<CustomExamPreview> {
    const validated = buildCustomExamPlan(config).config
    const client = getAuthedClient(userToken)
    const { data, error } = await client.rpc('custom_exam_preflight', { p_config: validated })
    if (error) return mapCustomExamError(error, 'preview')
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new AppError('Test qamrovini hisoblab bo‘lmadi', 503, 'CUSTOM_EXAM_UNAVAILABLE')
    }
    return data as unknown as CustomExamPreview
  },

  async active(userToken: string): Promise<unknown> {
    const client = getAuthedClient(userToken)
    const { data, error } = await client.rpc('get_active_custom_exam')
    if (error) throw new AppError('Davom ettiriladigan testni tekshirib bo‘lmadi', 503, 'CUSTOM_RESUME_UNAVAILABLE')
    return data
  },

  async analysis(examId: string, userToken: string): Promise<unknown> {
    const client = getAuthedClient(userToken)
    const { data, error } = await client.rpc('get_custom_exam_analysis', { p_exam_id: examId })
    if (error) {
      if (error.message.includes('custom_exam_not_found')) {
        throw new AppError('Shaxsiy test topilmadi', 404, 'CUSTOM_EXAM_NOT_FOUND')
      }
      if (error.message.includes('custom_exam_not_finished')) {
        throw new AppError('Test hali yakunlanmagan', 400, 'CUSTOM_EXAM_UNFINISHED')
      }
      throw new AppError('Shaxsiy test tahlilini olib bo‘lmadi', 503, 'CUSTOM_ANALYSIS_UNAVAILABLE')
    }
    return data
  },

  async start(config: CustomExamConfig, userToken: string): Promise<ExamStartResponse> {
    const validated = buildCustomExamPlan(config).config
    const client = getAuthedClient(userToken)
    const { data, error } = await client.rpc('generate_custom_exam', { p_config: validated })
    if (error) return mapCustomExamError(error, 'start')
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new AppError('Shaxsiy test yaratilmadi', 503, 'CUSTOM_EXAM_UNAVAILABLE')
    }
    return data as unknown as ExamStartResponse
  },
}
