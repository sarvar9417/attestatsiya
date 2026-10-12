import { describe, expect, it } from 'vitest'
import {
  markdownToTheoryBlocks,
  overlayPublishedProfessionalLesson,
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
    expect(result[0].content).toBe('## Mavzu')
    expect(result[1].content).toContain('<strong>')
  })
  it('converts markdown tables to the existing table block content contract', () => {
    const theory=markdownToTheoryBlocks(lesson.body_mdx!)
    const table=theory.find(block=>block.type==='table')
    expect(table?.content).toContain('Metod|Belgisi\n---|---\nAkvarium|Kuzatuv')
    expect(table?.content).toContain('Jigsaw|Ekspert guruhi')
  })
  it('shows published M15 lessons and keeps only local fallback questions', () => {
    const result=overlayPublishedProfessionalLesson(fallback,lesson)
    expect(result.title).toContain('interfaol metodlar')
    expect(result.theory.length).toBeGreaterThan(3)
    expect(result.questions).toBe(fallback.questions)
    expect(result.theory.some(b=>b.type==='note')).toBe(true)
  })
  it('does not show unpublished or empty remote content', () => {
    expect(overlayPublishedProfessionalLesson(fallback,{...lesson,status:'draft'})).toBe(fallback)
    expect(overlayPublishedProfessionalLesson(fallback,{...lesson,body_mdx:'   '})).toBe(fallback)
  })
})
