import { describe, expect, it } from 'vitest'
import { getPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { getTopicContent } from '../data/topicContent'

describe('pedagogy source-based Bloom explanation', () => {
  const notes = getPedagogyStudyNotes('M15.02')
  const allText = notes.map(block => block.content).join('\n')

  it('contrasts the final levels of the 1956 and 2001 taxonomies correctly', () => {
    const comparison = notes.find(block => block.type === 'table' && block.content.includes('1956-yilgi'))
    expect(comparison).toBeDefined()
    expect(comparison?.content).toContain('| 5 | Sintez | Baholash |')
    expect(comparison?.content).toContain('| 6 | Baholash | Yaratish |')
    expect(comparison?.content).toContain('| 1 | Bilish | Eslash |')
  })

  it('provides a concrete computer-science learning example', () => {
    expect(allText).toContain('yangi algoritm')
    expect(allText).toContain('xato sababini')
    expect(allText).toContain('aniq mezonlar')
  })

  it('does not equate three attestation cognitive groups to six Bloom levels', () => {
    expect(allText).toContain('bilish / qo‘llash / mulohaza qilish')
    expect(allText).toContain('avtomatik 1:1 mos kelmaydi')
  })

  it('discloses secondary-source limitations and retains editorial provenance', () => {
    expect(allText).toContain('bet lokatori tekshirilmagan')
    expect(allText).toContain('Sarvar Drive')
    expect(allText).toContain('Cornell')
    expect(allText).toContain('barnoyevak ZIP')
  })

  it('uses the consistent perseptiv-ability terminology in M15.07', () => {
    const theory = getTopicContent('M15.07')?.theory.map(block => block.content).join('\n') ?? ''
    expect(theory).toContain('Perseptiv')
    expect(theory).not.toContain('Persiptiv')
  })

  it('distinguishes pedagogy research object and subject using the new source', () => {
    const first = getPedagogyStudyNotes('M15.01').map(block => block.content).join('\n')
    expect(first).toContain('yaxlit pedagogik jarayon')
    expect(first).toContain('ta’lim-tarbiyaning mazmuni')
    expect(first).toContain('Pedagogik tadqiqot usullari')
    expect(first).toContain('Mirzayeva')
  })

  it('contrasts observation, interview, questionnaire and experiment', () => {
    const first = getPedagogyStudyNotes('M15.01').map(block => block.content).join('\n')
    expect(first).toContain('kuzatish')
    expect(first).toContain('suhbat')
    expect(first).toContain('anketa')
    expect(first).toContain('eksperiment')
    expect(first).toContain('aniq fizik betlari hali tekshirilmagan')
  })

  it('uses all six didactic lesson types listed in the extracted source, not lesson formats', () => {
    const blocks = getTopicContent('M15.04')?.theory ?? []
    const table = blocks.find(block => block.type === 'table')?.content ?? ''
    expect(table).toContain('Aralash (kombinatsiyalashgan)')
    expect(table).toContain('Yangi bilimni o‘rganish')
    expect(table).toContain('Mustahkamlash va takrorlash')
    expect(table).toContain('Umumlashtirish va tizimlashtirish')
    expect(table).toContain('Ko‘nikma va malaka hosil qilish')
    expect(table).toContain('Bilimlarni tekshirish (nazorat)')
    expect(table).not.toContain('| Laboratoriya |')
    expect(table).not.toContain('| Ekskursiya |')
    expect(blocks.map(block => block.content).join('\n')).toContain('alohida didaktik maqsad')
  })

  it('keeps course-form and lesson-analysis categories distinct from lesson types', () => {
    const text = getTopicContent('M15.04')?.theory.map(block => block.content).join('\n') ?? ''
    expect(text).toContain('«dars tahlili turlari.pdf»')
    expect(text).toContain('didaktik maqsad tasnifi')
    expect(text).toContain('ikkilamchi konspekt')
  })

  it('describes inclusive education as meaningful participation rather than identical work', () => {
    const blocks = getTopicContent('M15.08')?.theory ?? []
    const text = blocks.map(block => block.content).join('\n')
    expect(text).toContain('teng imkoniyat')
    expect(text).toContain('mazmunli ishtirok')
    expect(text).toContain('hamma o‘quvchiga aynan bir xil topshiriq berish emas')
    expect(text).toContain('Qodirova')
    expect(text).toContain('2022')
  })
})
