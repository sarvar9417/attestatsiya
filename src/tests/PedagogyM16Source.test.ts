import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

const lesson = (id: string) => getTopicContent(id)?.theory ?? []
const allText = (id: string) => lesson(id).map(block => block.content).join('\n')

describe('TASK-252 professional informatics methodology source and quality', () => {
  it('covers three 2026 pedagogical-methodology constructs without client-side keys', () => {
    for (const id of ['M16.01', 'M16.02', 'M16.03']) {
      const topic = getTopicContent(id)
      expect(topic?.questions, id).toEqual([])
      expect(topic?.theory.some(block => block.type === 'source'), id).toBe(true)
      expect(topic?.theory.some(block => block.type === 'example'), id).toBe(true)
      expect(topic?.theory.some(block => block.type === 'table'), id).toBe(true)
    }
  })

  it('cites verified physical book pages but does not claim all 460 pages are checked', () => {
    for (const id of ['M16.01', 'M16.02', 'M16.03']) {
      const txt = allText(id)
      expect(txt).toContain('2026 informatika attestatsiyasi spetsifikatsiyasi')
      expect(txt).toContain('Mamarajabov')
      expect(txt).toContain('2023')
      expect(txt).toContain('https://turan-edu.uz/media/books/2024/05/22/1708324536.pdf')
      expect(txt).toMatch(/460/)
      expect(txt).toContain('audit')
    }
  })

  it('keeps chapter-specific physical PDF page locators traceable', () => {
    expect(allText('M16.01')).toContain('172–174')
    expect(allText('M16.02')).toContain('45–46')
    expect(allText('M16.03')).toContain('89–91')
  })

  it('contrasts curriculum content, pedagogy and spiral sequencing in M16.01', () => {
    const txt = allText('M16.01')
    expect(txt).toContain('«nima o‘qitiladi?»')
    expect(txt).toContain('«qanday o‘zlashtiriladi?»')
    expect(txt).toContain('Spiral yondashuv')
    expect(txt).toContain('Shart operatori')
  })

  it('distinguishes methodologies, ICT resources and graphical organizers in M16.02', () => {
    const txt = allText('M16.02')
    expect(txt).toContain('«Scratch», «Python» yoki «slayd»')
    expect(txt).toContain('Fishbone (Ishikava)')
    expect(txt).toContain('grafik tashkil etgichlar')
    expect(txt).toContain('darsning aniq maqsadi')
    expect(txt).not.toMatch(/70\s*%/)
    expect(txt).not.toMatch(/\bfishing\b/i)
  })

  it('evaluates informatics decisions with evidence, inclusion and safety in M16.03', () => {
    const txt = allText('M16.03')
    expect(txt).toContain('Python')
    expect(txt).toContain('range(1, n)')
    expect(txt).toContain('Kompyuterlar yetishmaydi')
    expect(txt).toContain('raqamli xavf')
    expect(txt).toContain('qat’iy yagona 5 bosqichli rasmiy algoritm emas')
  })

  it('does not score non-published teacher-methodology topics via static answer keys', () => {
    for (const id of ['M16.01', 'M16.02', 'M16.03']) {
      const topic = getTopicContent(id)
      expect(topic?.questions.length, id).toBe(0)
    }
  })
})
