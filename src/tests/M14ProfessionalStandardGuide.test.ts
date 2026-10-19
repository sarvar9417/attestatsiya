import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M14_PROFESSIONAL_STANDARD_GUIDE } from '../data/topics/m14ProfessionalStandardGuide'
import { overlayPublishedProfessionalLesson } from '../features/content/professionalLessonTheory'

const expected: Record<string, string> = {
  'M14.01': '2–3',
  'M14.02': '4–5',
  'M14.03': '6–7',
  'M14.04': '8–9',
  'M14.05': '10–11',
  'M14.06': '12',
  'M14.07': '13',
}

const sourceHash = '404bf773e4fd6daea75a96a45543ddbe5be9f94d2cf7e711be7917bb2d95d9b2'

describe('TASK-303 — 13-betlik kasbiy standartga tayangan M14 kitobi', () => {
  it('7/7 mavzu alohida birlamchi manba va sahifaga ega', () => {
    expect(Object.keys(M14_PROFESSIONAL_STANDARD_GUIDE).sort()).toEqual(Object.keys(expected).sort())
    for (const [id, pages] of Object.entries(expected)) {
      const theory = M14_PROFESSIONAL_STANDARD_GUIDE[id]
      expect(theory).toHaveLength(12)
      const source = theory.filter(block => block.type === 'source')
      expect(source).toHaveLength(1)
      expect(source[0].content).toContain(sourceHash)
      expect(source[0].content).toContain(`PDF ${pages}-bet`)
    }
  })

  it('vazifa, ko‘nikma va bilimlar kitob sahifalarida mantiqiy tartibda va takrorsiz ko‘rsatiladi', () => {
    for (const [id, theory] of Object.entries(M14_PROFESSIONAL_STANDARD_GUIDE)) {
      const headings = theory.filter(block => block.type === 'heading').map(block => block.content)
      expect(headings).toEqual([
        'Mehnat vazifalari: o‘qituvchi nimalarni bajaradi?',
        'Zarur ko‘nikmalar: qanday amalga oshiradi?',
        'Zarur bilimlar: nimalarni bilishi kerak?',
        'Informatika darsidan amaliy vaziyat',
        'Attestatsiya savolida farqlash',
      ])
      const lists = theory.filter(block => block.type === 'list')
      expect(lists).toHaveLength(3)
      for (const list of lists) {
        expect(list.items?.length).toBeGreaterThanOrEqual(2)
        expect(new Set(list.items).size).toBe(list.items?.length)
      }
      expect(theory.filter(block => block.type === 'example')).toHaveLength(1)
      expect(theory.filter(block => block.type === 'exam')).toHaveLength(1)
      expect(getTopicContent(id)?.theory).toEqual(theory)
      expect(getTopicContent(id)?.questions).toEqual([])
    }
  })

  it('PDFdagi noyob tushunchalar mavzuga mos saqlangan', () => {
    const page3 = M14_PROFESSIONAL_STANDARD_GUIDE['M14.03'].map(block => block.content).join(' ')
    const page5 = M14_PROFESSIONAL_STANDARD_GUIDE['M14.05'].map(block => block.content).join(' ')
    expect(page3).toContain('Diagnostik baholash')
    expect(page3).toContain('formativ')
    expect(page3).toContain('summativ')
    expect(page5).toContain('arbitraj')
    expect(page5).toContain('muzokara')
    expect(page5).toContain('mediatsiya')
  })

  it('nashr qilingan eski qisqa konspektni ko‘paytirmasdan yagona kitobni tayyorlaydi', () => {
    const base = getTopicContent('M14.01')
    expect(base).toBeDefined()
    if (!base) throw new Error('M14.01 missing')
    const lesson = {
      status: 'published',
      body_mdx: '## Maqsad\\n\\nEski qisqa konspekt\\n\\n## Kasb standarti: to‘liq nazariya xaritasi\\n\\nEski takror',
      title_uz: 'O‘quv jarayonini rejalashtirish',
    } as Parameters<typeof overlayPublishedProfessionalLesson>[1]
    const result = overlayPublishedProfessionalLesson(base, lesson)
    expect(result.theory).toEqual(M14_PROFESSIONAL_STANDARD_GUIDE['M14.01'])
    expect(result.theory.some(block => block.content.includes('Eski takror'))).toBe(false)
    expect(result.questions).toBe(base.questions)
  })

  it('nashr qilinmagan darsni foydalanuvchiga ochmaslik qoidasini saqlaydi', () => {
    const base = getTopicContent('M14.01')
    expect(base).toBeDefined()
    if (!base) throw new Error('M14.01 missing')
    const lesson = {
      status: 'review',
      body_mdx: '## Draft\\n\\nHali ekspert tasdig‘i yo‘q',
      title_uz: 'Draft',
    } as Parameters<typeof overlayPublishedProfessionalLesson>[1]
    expect(overlayPublishedProfessionalLesson(base, lesson)).toBe(base)
    expect(overlayPublishedProfessionalLesson(base, {
      ...lesson,
      status: 'published',
      body_mdx: '',
    })).toBe(base)
  })
})
