import { describe, it, expect } from 'vitest'
import { MODULES } from '../data/contentTree'
import { mergeCatalog, publishedScratchLogoSubtopics } from '../features/content/catalog'
import type { ModuleSummary, LessonSummary } from '../features/content/contentApi'

const SUMMARY: ModuleSummary = {
  id: 'uuid-m01',
  code: 'M01',
  title_uz: 'DB: Axborot va raqamli savodxonlik',
  summary_uz: 'DB: Rasmiy qisqacha izoh',
  order_idx: 1,
  exam_section: 'specialty',
  status: 'published',
  exam_question_count: 3,
  lesson_count: 3,
}

function apiModule(overrides: Partial<ModuleSummary> = {}): ModuleSummary {
  return { ...SUMMARY, ...overrides }
}

describe('mergeCatalog', () => {
  it('API bo\'sh bo\'lsa statik modullarni qaytaradi (source=static)', () => {
    const merged = mergeCatalog(MODULES, [])
    expect(merged).toHaveLength(MODULES.length)
    expect(merged[0].title).toBe(MODULES[0].title)
    expect(merged[0].source).toBe('static')
    expect(merged[0].uuid).toBeUndefined()
  })

  it('DB modul topilganda meta-ma\'lumotni qoplaydi va uuid saqlaydi', () => {
    const merged = mergeCatalog(MODULES, [apiModule()])
    const m01 = merged[0]
    expect(m01.title).toBe('DB: Axborot va raqamli savodxonlik')
    expect(m01.description).toBe('DB: Rasmiy qisqacha izoh')
    expect(m01.uuid).toBe('uuid-m01')
    expect(m01.lessonCount).toBe(3)
    expect(m01.source).toBe('db')
    expect(m01.examQuestionCount).toBe(SUMMARY.exam_question_count)
  })

  it('DB summary_uz null bo\'lsa statik description saqlanadi', () => {
    const merged = mergeCatalog(MODULES, [apiModule({ summary_uz: null })])
    expect(merged[0].description).toBe(MODULES[0].description)
  })

  it('DB modul topilmagan kodlar uchun statik qiymat saqlanadi', () => {
    const merged = mergeCatalog(MODULES, [apiModule({ code: 'M99' })])
    expect(merged[0].source).toBe('static')
    expect(merged[1].source).toBe('static')
    expect(merged[0].title).toBe(MODULES[0].title)
  })

  it('DB\'da bor bo\'lgan qo\'shimcha modullar statik tuzilmani kengaytirmaydi', () => {
    const merged = mergeCatalog(MODULES, [
      apiModule(),
      apiModule({ code: 'M17', id: 'uuid-m17', title_uz: 'Mavjud emas' }),
    ])
    expect(merged).toHaveLength(MODULES.length)
    expect(merged.some(m => m.code === 'M17')).toBe(false)
  })

  it('statik modul tartibi va subtopik tuzilmasi saqlanadi', () => {
    const merged = mergeCatalog(MODULES, [apiModule()])
    expect(merged.map(m => m.code)).toEqual(MODULES.map(m => m.code))
    expect(merged[0].subtopics).toHaveLength(MODULES[0].subtopics.length)
    expect(merged[0].subtopics[0].code).toBe(MODULES[0].subtopics[0].id)
  })

  it('DB exam_section noaniq bo\'lsa statik section saqlanadi', () => {
    const merged = mergeCatalog(MODULES, [apiModule({ exam_section: null })])
    expect(merged[0].section).toBe(MODULES[0].section)
  })

  it('DB exam_section mavjud bo\'lsa qoplanadi', () => {
    const merged = mergeCatalog(MODULES, [
      apiModule({ code: 'M14', exam_section: 'professional_standard' }),
    ])
    expect(merged.find(m => m.code === 'M14')?.section).toBe('professional_standard')
  })
})


describe('published Scratch/LOGO M07 catalog', () => {
  const lessons: LessonSummary[] = Array.from({ length: 12 }, (_, index) => ({
    id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
    module_id: '00000000-0000-0000-0000-000000001007',
    title_uz: `M07 lesson ${index + 1}`,
    slug: index === 5 || index === 11 ? `logo-lesson-${index + 1}` : `scratch-lesson-${index + 1}`,
    body_mdx: '# Intro\\n\\n## One\\nContent\\n\\n## Two\\nContent',
    blocks: null, blocks_kind: null, est_minutes: 12,
    order_idx: index + 1, status: 'published', constructs: [],
  }))

  it('shows all twelve source-backed lessons, not six legacy static summaries', () => {
    const result = publishedScratchLogoSubtopics([...lessons].reverse())
    expect(result).toHaveLength(12)
    expect(result?.[0].title).toBe('M07 lesson 1')
    expect(result?.[11].title).toBe('M07 lesson 12')
    expect(result?.[0].id).toBe(lessons[0].id)
  })

  it('fails closed for incomplete, unpublished or contentless chapters', () => {
    expect(publishedScratchLogoSubtopics(lessons.slice(0, 6))).toBeNull()
    expect(publishedScratchLogoSubtopics(lessons.map((l, i) => i === 6 ? { ...l, status: 'review' } : l))).toBeNull()
    expect(publishedScratchLogoSubtopics(lessons.map((l, i) => i === 3 ? { ...l, body_mdx: null } : l))).toBeNull()
  })
})
