import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

const ids = ['M16.01', 'M16.02', 'M16.03'] as const

describe('M16 methodology alignment with official 2026 specification', () => {
  for (const id of ids) {
    it(`${id} has three-task specification provenance without inventing official textbook page citations`, () => {
      const topic = getTopicContent(id)
      expect(topic?.questions).toEqual([])
      const text = topic?.theory.map(x => x.content).join('\n') ?? ''
      expect(text).toContain('Informatika Testlar spesifikatsiyasi.pdf')
      expect(text).toContain('1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ')
      expect(text).toContain('Mamarajabov')
      expect(text).toContain('sahifama-sahifa tekshiruvi')
    })
  }

  it('M16.01 does not mistake three allotted questions for one per chapter', () => {
    const text = getTopicContent('M16.01')?.theory.map(x => x.content).join('\n') ?? ''
    expect(text).toContain('har biridan aynan bittadan')
    expect(text).toContain('spiral')
  })

  it('M16.02 provides instructional-method choices with observable learning purpose', () => {
    const text = getTopicContent('M16.02')?.theory.map(x => x.content).join('\n') ?? ''
    expect(text).toContain('debugging')
    expect(text).toContain('Raqamli xavfsizlik')
    expect(text).toContain('Interfaol metod doim eng yaxshi')
  })

  it('M16.03 requires evidence, learner safety and evaluation rather than a universal correct method', () => {
    const text = getTopicContent('M16.03')?.theory.map(x => x.content).join('\n') ?? ''
    for (const item of ['Vaziyat dalillari', 'Maqsad va cheklovlar', 'Muqobil yechimlar', 'Natijani tekshirish']) {
      expect(text).toContain(item)
    }
    expect(text).toContain('shaxsiy ma’lumotni')
  })
})
