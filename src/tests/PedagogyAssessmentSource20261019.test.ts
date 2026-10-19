import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

function theory(id: string) {
  const topic = getTopicContent(id)
  expect(topic, id).toBeDefined()
  expect(topic?.questions, id).toEqual([])
  return topic?.theory ?? []
}

describe('pedagogika M14.03 and M15 source-and-safety reconciliation', () => {
  it('distinguishes assessment purpose from norm/criterion/ipsative comparison', () => {
    const blocks = theory('M14.03')
    const text = blocks.map(x => x.content).join('\n')
    for (const term of ['Diagnostik', 'Formativ', 'Summativ', 'Normaga mo‘ljallangan', 'Mezonga mo‘ljallangan', 'Ipsativ']) {
      expect(text).toContain(term)
    }
    expect(text).toContain('tahlil qilish mezonini farqlang')
    expect(text).toContain('bir xil emas')
  })

  it('connects domain, construct and validity to a genuinely source-traceable lesson', () => {
    const text = theory('M14.03').map(x => x.content).join('\n')
    expect(text).toContain('**Domen**')
    expect(text).toContain('**Validlik**')
    expect(text).toContain('Komil Jalilov')
    expect(text).toContain('1-l4tFRqNEBuDEtvIavoh8yYB2pYp1JFN')
    expect(text).toContain('Kasb-standarti.pdf')
    expect(text).toContain('fizik sahifalar')
    expect(text).not.toContain('O‘zbekistonda faqat 5 ballik tizim')
  })

  it('restores core pedagogical categories rather than treating learning activity as a substitute', () => {
    const blocks = theory('M15.01')
    const table = blocks.find(x => x.type === 'table')?.content ?? ''
    for (const row of ['| Shaxs |', '| Ta’lim |', '| Tarbiya |', '| Rivojlanish |', '| Bilim |', '| Ko‘nikma |', '| Malaka |', '| Kompetensiya |', '| Ma’lumot |']) {
      expect(table).toContain(row)
    }
    expect(table).not.toContain('| Bilim olish |')
    const text = blocks.map(x => x.content).join('\n')
    expect(text).toContain('yaxlit pedagogik jarayon')
    expect(text).toContain('1woZMas8dNbzk6yephzNH_XdmT19ess-l')
  })

  it('does not present coercion as an unqualified recommendation for upbringing', () => {
    const blocks = theory('M15.03')
    const methods = blocks.find(x => x.type === 'text')?.content ?? ''
    expect(methods).toContain('namuna')
    expect(methods).toContain('rag‘batlantirish')
    expect(methods).toContain('qadr-qimmatini')
    expect(methods).not.toContain('majburlash')
    const note = blocks.find(x => x.type === 'note')?.content ?? ''
    expect(note).toContain('«majburlash»')
    expect(note).toContain('zo‘ravonlik yoki kamsitishni')
  })

  it('qualifies example class documents instead of inventing an official universal list', () => {
    const blocks = theory('M15.05')
    const table = blocks.find(x => x.type === 'table')?.content ?? ''
    expect(table).toContain('Kundalik yoki elektron xizmat')
    expect(table).not.toContain('| Kundalik |')
    expect(blocks.map(x => x.content).join('\n')).toContain('alohida normativ')
  })

  it('explains historical authoritative ability vocabulary without justifying coercion', () => {
    const blocks = theory('M15.07')
    const text = blocks.map(x => x.content).join('\n')
    expect(text).toContain('«Avtoritar qobiliyat»')
    expect(text).toContain('muallif tasnifi')
    expect(text).toContain('zo‘ravonlik')
    expect(text).toContain('Xoliqov')
    expect(text).not.toContain('Didaktik qobiliyat — eng muhim')
  })

  it('uses original Mahmudov source to teach seven speech qualities without confusing them with voice volume', () => {
    const blocks = theory('M15.06')
    const table = blocks.find(x => x.type === 'table' && x.content.includes('Jo‘yalilik'))
    const source = blocks.find(x => x.type === 'source' && x.content.includes('Mahmudov'))
    expect(table).toBeDefined()
    for (const word of ['To‘g‘rilik', 'Aniqlik', 'Mantiqiylik', 'Soflik', 'Boylik', 'Jo‘yalilik', 'Ifodalilik']) {
      expect(table?.content).toContain(word)
    }
    expect(source?.content).toContain('1MUrT_uKKg-0jWwV16j97AzkcbU6LGpHL')
    expect(source?.content).toContain('OCR buzilishlari')
    expect(blocks.map(x => x.content).join('\n')).toContain('Ovozni balandlatishning o‘zi')
  })

  it('preserves civic upbringing as a separate direction in the extracted source', () => {
    const table = theory('M15.03').find(x => x.type === 'table')?.content ?? ''
    expect(table).toContain('| Fuqarolik |')
    expect(table).toContain('| Huquqiy |')
    expect(table).toContain('| Ekologik |')
  })

  it('preserves untouched lessons and the server-scored-only guard', () => {
    for (const id of ['M15.02', 'M15.04']) {
      expect(theory(id).length, id).toBeGreaterThan(0)
    }
  })
})
