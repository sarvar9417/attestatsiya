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
