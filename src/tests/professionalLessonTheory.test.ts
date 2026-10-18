import { describe, expect, it } from 'vitest'
import {
  markdownToTheoryBlocks,
  overlayPublishedProfessionalLesson,
  resolveLearnerTheoryContent,
} from '../features/content/professionalLessonTheory'
import type { TopicContent } from '../data/topicContent'
import type { LessonSummary } from '../features/content/contentApi'

const fallback: TopicContent = {
  subtopicId: 'M15.08', title: 'Ta’lim texnologiyalari',
  theory: [{ type: 'definition', content: 'Mahalliy nazariya' }],
  questions: [{
    id: 'local-1', text: 'Savol?', type: 'Y1', options: ['A','B','C','D'],
    correctIndex: 1, explanation: 'Izoh',
  }],
}

const lesson: LessonSummary = {
  id:'34ff738c-7bd9-466a-8a35-e74a630f2571',
  module_id:'bacf0e02-02a7-409c-b09c-680e6b09a42c',
  title_uz:'Ta’lim texnologiyalari — interfaol metodlar',
  slug:'talim-texnologiyalari-va-vaziyatga-mos-tanlov',
  body_mdx: [
    '## Akvarium va ajurli arra',
    '',
    'Akvariumda **ichki doira** muhokama qiladi.',
    '',
    '| Metod | Belgisi |',
    '|-------|---------|',
    '| Akvarium | Kuzatuv |',
    '| Jigsaw | Ekspert guruhi |',
    '',
    '1. Usulni tanlang',
    '2. Javobni asoslang',
    '',
    '**Manba izi:** M15 o‘quv darsi',
  ].join('\n'),
  blocks:null,blocks_kind:null,est_minutes:15,order_idx:8,
  status:'published',constructs:[],
}

describe('professional source-backed lesson to learner UI', () => {
  it('renders headings and paragraphs without executing HTML', () => {
    const result=markdownToTheoryBlocks('## Mavzu\n\n<strong>oddiy matn</strong>')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ type: 'heading', content: 'Mavzu' })
    expect(result[1].content).toContain('<strong>')
  })
  it('converts markdown tables to the existing table block content contract', () => {
    const theory=markdownToTheoryBlocks(lesson.body_mdx!)
    const table=theory.find(block=>block.type==='table')
    expect(table?.headers).toEqual(['Metod', 'Belgisi'])
    expect(table?.rows?.[0]).toEqual(['Akvarium', 'Kuzatuv'])
    expect(table?.rows?.[1]).toEqual(['Jigsaw', 'Ekspert guruhi'])
  })
  it('shows published M15 lessons and keeps only local fallback questions', () => {
    const result=overlayPublishedProfessionalLesson(fallback,lesson)
    expect(result.title).toContain('interfaol metodlar')
    expect(result.theory.length).toBeGreaterThan(3)
    expect(result.questions).toBe(fallback.questions)
    expect(result.theory.some(b=>b.type==='source')).toBe(true)
  })
  it('keeps source addenda separate from the easy-to-read core lesson', () => {
    const enriched = { ...lesson, body_mdx: [
      '## Maqsad',
      'Asosiy nazariyani tushunish.',
      '## Tushunchalar',
      '**Didaktika** — ta’lim nazariyasi.',
      '## Chuqurlashtirilgan nazariya — manba korpusi (2026-10-18)',
      '## Vaziyat',
      'O‘qituvchi misol keltiradi.',
    ].join('\n') }
    const result = overlayPublishedProfessionalLesson(fallback, enriched)
    expect(result.theory.some(block => block.content.includes('Chuqurlashtirilgan'))).toBe(false)
    expect(result.theory.find(block => block.type === 'goal')?.content).toContain('nazariyani')
    expect(result.supplementalTheory?.some(block => block.content.includes('O‘qituvchi'))).toBe(true)
    expect(result.questions).toBe(fallback.questions)
  })

  it('keeps the colorful original M15 lesson before and after canonical API loading', () => {
    const remote = overlayPublishedProfessionalLesson(fallback, lesson)
    expect(remote.theory).not.toBe(fallback.theory)
    const before = resolveLearnerTheoryContent('M15.08', fallback, null)
    const after = resolveLearnerTheoryContent('M15.08', fallback, remote)
    expect(before).toBe(fallback)
    expect(after).toBe(fallback)
    expect(after.theory[0].type).toBe('definition')
    expect(after.title).toBe('Ta’lim texnologiyalari')
    expect(after.questions).toBe(fallback.questions)
  })

  it('M02 preserves complete offline content and appends only the verified DB addendum', () => {
    const m02: TopicContent = {
      ...fallback,
      subtopicId: 'M02.01',
      title: 'Kompyuter qurilmalari',
      theory: [
        { type: 'heading', content: 'Asosiy darslik nazariyasi' },
        { type: 'definition', content: 'Sensorli ekran ikki yo‘nalishda ishlaydi.' },
      ],
    }
    const dbLesson: LessonSummary = {
      ...lesson,
      status: 'published',
      body_mdx: [
        '## Maqsad',
        'Qisqa maqsad matni.',
        '## Apparat qismlari',
        'Bu qisqa server konspekti, asosiy nazariyaning o‘rnini bosa olmaydi.',
        '## Tekshirilgan qo‘shimcha: vaziyatli qurilmalar',
        'OMR oldindan belgilangan javob katakchalarini tekshiradi.',
        '## Manba',
        'Cambridge+ 9-sinf, PDF 30.',
      ].join('\n'),
    }
    const remote = overlayPublishedProfessionalLesson(m02, dbLesson)
    const visible = resolveLearnerTheoryContent('M02.01', m02, remote)
    expect(visible.theory[0]).toEqual(m02.theory[0])
    expect(visible.theory[1]).toEqual(m02.theory[1])
    expect(visible.theory.some(block => block.content.includes('OMR oldindan'))).toBe(true)
    expect(visible.theory.some(block => block.content.includes('Bu qisqa server konspekti'))).toBe(false)
    expect(visible.questions).toBe(m02.questions)
    expect(resolveLearnerTheoryContent('M02.01', m02, null)).toBe(m02)
  })

  it('M02 never displays unmarked or unpublished DB summary instead of official theory', () => {
    const m02: TopicContent = { ...fallback, subtopicId: 'M02.02' }
    const noAddendum = overlayPublishedProfessionalLesson(
      m02, { ...lesson, status: 'published', body_mdx: '## Maqsad\nQisqa yangi konspekt.' },
    )
    expect(resolveLearnerTheoryContent('M02.02', m02, noAddendum)).toBe(m02)
    const draft = overlayPublishedProfessionalLesson(
      m02, { ...lesson, status: 'draft', body_mdx: '## Tekshirilgan qo‘shimcha: mumkin emas\nTahrir' },
    )
    expect(resolveLearnerTheoryContent('M02.02', m02, draft)).toBe(m02)
  })

  it('does not change M14/M16 canonical backend-first lesson policy', () => {
    const remote = overlayPublishedProfessionalLesson(fallback, lesson)
    expect(resolveLearnerTheoryContent('M14.01', fallback, remote)).toBe(remote)
    expect(resolveLearnerTheoryContent('M16.02', fallback, remote)).toBe(remote)
    expect(resolveLearnerTheoryContent('M14.01', fallback, null)).toBe(fallback)
  })

  it('does not show unpublished or empty remote content', () => {
    expect(overlayPublishedProfessionalLesson(fallback,{...lesson,status:'draft'})).toBe(fallback)
    expect(overlayPublishedProfessionalLesson(fallback,{...lesson,body_mdx:'   '})).toBe(fallback)
  })
})
