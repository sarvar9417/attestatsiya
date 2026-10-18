/**
 * Gibrid katalog (T-010)
 *
 * Statik contentTree (src/data/contentTree.ts) UI uchun yagona tuzilma
 * manbai bo'lib qoladi; backenddan kelgan published modullar (UUID schema)
 * meta-ma'lumotni qoplaydi. Natija: DB to'lguncha UI buzilmaydi, to'lgach
 * rasmiy ma'lumot ko'rsatiladi.
 *
 * Merge qoidalari:
 * - Modullar statik tartibda qoladi, `code` bo'yicha bog'lanadi.
 * - DB modul topilsa: title/description/section/examQuestionCount
 *   DB qiymati bilan qoplanadi; `uuid` va `lessonCount` saqlanadi.
 *   DB summary_uz null bo'lsa statik description saqlanadi.
 * - DB modul topilmasa (yoki API xato bo'lsa): statik qiymat saqlanadi.
 * - DB modul statikda bo'lmasa: qo'shilmaydi — subtopik tuzilmasi bo'lmagan
 *   modul UI'da ko'rinmaydi.
 * - Dars (subtopic) sathi statik qoladi; DB darslari backend resolveIds
 *   orqali code → UUID ga o'tkaziladi, shuning uchun UI UUID tashimaydi.
 */
import { type Module } from '../../data/contentTree'
import type { ModuleDetail } from './contentApi'
import { type ModuleSection, type ModuleSummary } from './contentApi'

export interface CatalogSubtopic {
  id: string
  code: string
  title: string
  description?: string
}

export interface CatalogModule {
  id: string
  code: string
  title: string
  description: string
  section: ModuleSection
  examQuestionCount: number
  subtopics: CatalogSubtopic[]
  uuid?: string
  lessonCount?: number
  source: 'db' | 'static'
}

const SECTION_NAMES = [
  'specialty',
  'professional_standard',
  'pedagogy',
  'methodology',
] as const

function isModuleSection(value: string | null): value is ModuleSection {
  return SECTION_NAMES.includes(value as (typeof SECTION_NAMES)[number])
}

/**
 * Statik modullarga backend meta-ma'lumotini qoplaydi (sof funksiya).
 */
export function mergeCatalog(staticModules: Module[], apiModules: ModuleSummary[]): CatalogModule[] {
  const byCode = new Map(apiModules.map(m => [m.code ?? '', m]))
  return staticModules.map(m => {
    const db = byCode.get(m.code)
    if (!db) {
      return {
        id: m.id,
        code: m.code,
        title: m.title,
        description: m.description,
        section: m.section,
        examQuestionCount: m.examQuestionCount,
        subtopics: m.subtopics.map(toCatalogSubtopic),
        source: 'static' as const,
      }
    }
    return {
      id: m.id,
      code: m.code,
      title: db.title_uz,
      description: db.summary_uz ?? m.description,
      section: isModuleSection(db.exam_section) ? db.exam_section : m.section,
      examQuestionCount: db.exam_question_count,
      subtopics: m.subtopics.map(toCatalogSubtopic),
      uuid: db.id,
      lessonCount: db.lesson_count,
      source: 'db' as const,
    }
  })
}

function toCatalogSubtopic(s: { id: string; title: string; description?: string }): CatalogSubtopic {
  return {
    id: s.id,
    code: s.id,
    title: s.title,
    ...(s.description ? { description: s.description } : {}),
  }
}

/**
 * TASK-220: Only switch the M12 learner catalog to the complete, independently
 * published ten-chapter V2 edition. The database remains the source of truth:
 * 10 draft lessons, a partial rollout, duplicate/missing chapters and an
 * offline API can never leak review-stage content to learners.
 */
export function selectPublishedNetworkV2Catalog(
  modules: CatalogModule[],
  detail: ModuleDetail,
): CatalogModule[] {
  if (detail.code !== 'M12') return modules
  const chapters = detail.lessons.filter(lesson =>
    /^tarmoq-v2-bob-(0[1-9]|10)$/.test(lesson.slug),
  )
  if (chapters.length !== 10 ||
      chapters.some(lesson => lesson.status !== 'published' || !lesson.body_mdx?.trim())) {
    return modules
  }
  const bySlug = new Map(chapters.map(lesson => [lesson.slug, lesson]))
  if (bySlug.size !== 10 ||
      Array.from({ length: 10 }, (_, index) => `tarmoq-v2-bob-${String(index + 1).padStart(2, '0')}`)
        .some(slug => !bySlug.has(slug))) {
    return modules
  }
  const canonical = Array.from({ length: 10 }, (_, index) =>
    bySlug.get(`tarmoq-v2-bob-${String(index + 1).padStart(2, '0')}`)!,
  )
  return modules.map(module => module.code === 'M12'
    ? {
        ...module,
        subtopics: canonical.map(lesson => ({
          id: lesson.id,
          code: lesson.slug,
          title: lesson.title_uz,
        })),
      }
    : module)
}
