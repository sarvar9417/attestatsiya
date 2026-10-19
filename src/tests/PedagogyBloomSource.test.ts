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

  it('teaches all five lesson-analysis lenses without mixing them with lesson types', () => {
    const notes = getPedagogyStudyNotes('M15.04')
    const text = notes.map(block => block.content).join('\n')
    for (const concept of ['Didaktik', 'Uslubiy', 'Metodologik', 'Psixologik', 'Pedagogik']) {
      expect(text).toContain(concept)
    }
    expect(text).toContain('Dars turi')
    expect(text).toContain('dars tahlili turi')
  })

  it('distinguishes perception, empathy and communication in teacher capabilities', () => {
    const notes = getPedagogyStudyNotes('M15.07')
    const text = notes.map(block => block.content).join('\n')
    expect(text).toContain('| Perseptiv |')
    expect(text).toContain('| Empatik |')
    expect(text).toContain('| Kommunikativ |')
    expect(text).toContain('«Avtoritar qobiliyat»')
    expect(text).toContain('qo‘pol munosabat')
  })

  it('reconciles all seven professional-standard fallback topics with a traceable source', () => {
    const standardTopics = Array.from({ length: 7 }, (_, i) => 'M14.' + String(i + 1).padStart(2, '0'))
    for (const id of standardTopics) {
      const topic = getTopicContent(id)
      expect(topic?.questions, id).toEqual([])
      expect(topic?.theory.some(block => block.type === 'source' && block.content.includes('Kasb-standarti.pdf')), id).toBe(true)
      expect(topic?.theory.some(block => block.type === 'example'), id).toBe(true)
      expect(topic?.theory.some(block => block.type === 'table'), id).toBe(true)
    }
  })

  it('requires measurable lesson outcomes rather than an equipment-only M14.01 plan', () => {
    const s = getTopicContent('M14.01')?.theory.map(x => x.content).join('\n') ?? ''
    expect(s).toContain('o‘lchanadigan')
    expect(s).toContain('baholash dalillariga')
    expect(s).toContain('jihoz')
  })

  it('keeps metacognitive planning separate from raw ICT use in M14.02', () => {
    const s = getTopicContent('M14.02')?.theory.map(x => x.content).join('\n') ?? ''
    expect(s).toContain('Metakognitsiya')
    expect(s).toContain('o‘zini baholash')
    expect(s).toContain('o‘z-o‘zidan samaradorlikning isboti emas')
  })

  it('does not assert an official 5-point assessment-only rule in M14.03', () => {
    const s = getTopicContent('M14.03')?.theory.map(x => x.content).join('\n') ?? ''
    expect(s).toContain('Diagnostik')
    expect(s).toContain('Formativ')
    expect(s).toContain('Summativ')
    expect(s).not.toContain('5 ballik tizim (O‘zbekiston)')
    expect(s).not.toContain('Balans')
  })

  it('recognizes upbringing during regular lessons in M14.04', () => {
    const s = getTopicContent('M14.04')?.theory.map(x => x.content).join('\n') ?? ''
    expect(s).toContain('darsning o‘zida')
    expect(s).toContain('Darsdagi tarbiya')
    expect(s).not.toContain('faqat sinf rahbari tomonidan')
  })

  it('includes equal participation, safety and media literacy in M14.05', () => {
    const s = getTopicContent('M14.05')?.theory.map(x => x.content).join('\n') ?? ''
    expect(s).toContain('Media va raqamli xavfsizlik')
    expect(s).toContain('Teng imkoniyat')
    expect(s).toContain('moslashtirish')
  })

  it('does not invent a universal teacher training interval in M14.06', () => {
    const s = getTopicContent('M14.06')?.theory.map(x => x.content).join('\n') ?? ''
    expect(s).toContain('Muntazam ravishda')
    expect(s).toContain('3–5 yilda bir marta')
    expect(s).toContain('universal interval berilmagan')
    expect(s).not.toContain('3-5 yilda bir marta, institutda')
  })

  it('prioritizes parent participation and confidentiality over messaging tools in M14.07', () => {
    const s = getTopicContent('M14.07')?.theory.map(x => x.content).join('\n') ?? ''
    expect(s).toContain('qarorlarda ishtirok')
    expect(s).toContain('shaxsiy ma’lumoti')
    expect(s).toContain('maxfiylikni')
  })

  it('distinguishes upbringing direction, method and organizational format in M15.03', () => {
    const text = getPedagogyStudyNotes('M15.03').map(block => block.content).join('\n')
    expect(text).toContain('Tarbiya yo‘nalishi')
    expect(text).toContain('Tarbiya metodi')
    expect(text).toContain('Tarbiya shakli')
    expect(text).toContain('Kasb-standarti.pdf')
  })

  it('protects parent participation and individual learner confidentiality in M15.05', () => {
    const text = getPedagogyStudyNotes('M15.05').map(block => block.content).join('\n')
    expect(text).toContain('Individual ta’lim trayektoriyasi')
    expect(text).toContain('maxfiylikni saqlagan')
    expect(text).toContain('fan o‘qituvchisi ham')
  })

  it('distinguishes pedagogical tact, speech culture, technique and reflection in M15.06', () => {
    const text = getPedagogyStudyNotes('M15.06').map(block => block.content).join('\n')
    for (const keyword of ['Pedagogik takt', 'Pedagogik texnika', 'Nutq madaniyati', 'Refleksiya', 'Pedagogik kreativlik']) {
      expect(text).toContain(keyword)
    }
    expect(text).toContain('N. Mahmudov')
    expect(text).toContain('N. Muslimov')
  })
})
