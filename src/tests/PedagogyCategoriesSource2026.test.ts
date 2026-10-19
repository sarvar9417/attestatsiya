import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

const lessonText = (id: string) =>
  getTopicContent(id)?.theory.map(block => block.content).join('\n') ?? ''

describe('2026 pedagogika core terminology: original source cross-check', () => {
  it('keeps all ten Mirzayeva pedagogical categories instead of an incorrect four-term shortlist', () => {
    const text = lessonText('M15.01')
    for (const category of ['Shaxs', 'Tarbiya', 'Ta’lim', 'Bilim', 'Ko‘nikma', 'Malaka', 'Kompetensiya', 'Ma’lumot', 'Shakllantirish', 'Rivojlanish']) {
      expect(text, category).toContain(`| ${category} |`)
    }
    expect(text).not.toMatch(/\|\s*Bilim olish\s*\|/)
    expect(text).toContain('Mirzayeva')
  })

  it('distinguishes knowledge, ability, automatized skill and applied competence', () => {
    const text = lessonText('M15.01')
    expect(text).toContain('tizimlashtirilgan ma’lumotlar')
    expect(text).toContain('bajara olish layoqati')
    expect(text).toContain('avtomatlashgan')
    expect(text).toContain('amaliy vaziyatda qo‘llash')
  })

  it('restores civic education among nine general social-education directions', () => {
    const text = lessonText('M15.03')
    expect(text).toContain('| Fuqarolik |')
    for (const category of ['Aqliy', 'Axloqiy', 'Mehnat', 'Estetik', 'Jismoniy', 'Huquqiy', 'Ekologik', 'Iqtisodiy']) {
      expect(text).toContain(`| ${category} |`)
    }
  })

  it('does not call coercion a universally sourced instructional method', () => {
    const text = lessonText('M15.03')
    expect(text).not.toMatch(/majburlash/i)
    expect(text).toContain('yo‘nalishi')
    expect(text).toContain('metod')
  })

  it('retains review boundary and server-only test authority', () => {
    for (const topicId of ['M15.01', 'M15.03']) {
      const lesson = getTopicContent(topicId)
      expect(lesson?.questions, topicId).toEqual([])
      expect(lessonText(topicId)).toContain('fizik PDF beti')
    }
  })
})
