import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M14_PROFESSIONAL_STANDARD_GUIDE } from '../data/topics/m14ProfessionalStandardGuide'

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
      expect(getTopicContent(id)).toBeDefined()
      // A review draft does not replace the already-published learner curriculum.
      expect(getTopicContent(id)?.theory).not.toEqual(theory)
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

  it('5/6 sohasi va mediatsiya manbaviy tafovutini yashirmaydi', () => {
    expect(M14_PROFESSIONAL_STANDARD_GUIDE['M14.05'].at(-1)?.content).toContain('Xavfsiz')
    expect(M14_PROFESSIONAL_STANDARD_GUIDE['M14.06'].at(-1)?.content).toContain('kasbiy o‘sish')
    const mediation = M14_PROFESSIONAL_STANDARD_GUIDE['M14.05'].find(b => b.type === 'exam')?.content ?? ''
    expect(mediation).toContain('11-betida')
    expect(mediation).toContain('O‘RQ-482')
    expect(mediation).toContain('taraflar')
    expect(mediation).toContain('mediator')
    expect(mediation).toContain('Qonunning qo‘llanish')
  })

  it('ekspert ruxsatisiz amaldagi nashr qilingan dars o‘zgarmaydi', () => {
    for (const id of Object.keys(expected)) {
      const live = getTopicContent(id)
      expect(live).toBeDefined()
      expect(live?.theory).not.toEqual(M14_PROFESSIONAL_STANDARD_GUIDE[id])
      expect(live?.questions).toEqual([])
    }
  })
})
