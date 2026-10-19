import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

const sourceUrl = '1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ'

function blocks(id: string) {
  const topic = getTopicContent(id)
  expect(topic, id).toBeDefined()
  expect(topic?.questions, id).toEqual([])
  return topic?.theory ?? []
}

describe('M16 methodology from 2026 specification', () => {
  it.each(['M16.01', 'M16.02', 'M16.03'])('%s includes 2026 specification and source limitations', id => {
    const content = blocks(id)
    expect(content.some(b => b.type === 'table'), id).toBe(true)
    expect(content.some(b => b.type === 'example'), id).toBe(true)
    expect(content.some(b => b.type === 'trap'), id).toBe(true)
    const source = content.find(b => b.type === 'source' && b.content.includes(sourceUrl))
    expect(source, id).toBeDefined()
    expect(source?.content).toContain('Uchta metodik konstrukt')
  })

  it('separates approach, observable outcome and teaching tool for M16.01', () => {
    const t = blocks('M16.01').map(x => x.content).join('\n')
    for (const term of ['Kompetensiyaviy', 'Faoliyatli', 'Tizimli', 'Spiral', 'Shaxsga yo‘naltirilgan']) {
      expect(t).toContain(term)
    }
    expect(t).toContain('o‘quv natijasiga')
    expect(t).toContain('2020')
    expect(t).toContain('Cambridge 2023')
  })

  it('distinguishes method from digital environment for M16.02', () => {
    const t = blocks('M16.02').map(x => x.content).join('\n')
    expect(t).toContain('demonstratsiya')
    expect(t).toContain('Fishbone')
    expect(t).toContain('Venn diagrammasi')
    expect(t).toContain('Scratch yoki Python')
    expect(t).toContain('tasdiqlangan sabablar emas')
  })

  it('evaluates pedagogical decisions through evidence, safety and feedback for M16.03', () => {
    const t = blocks('M16.03').map(x => x.content).join('\n')
    for (const term of ['Maqsadga moslik', 'Dalil', 'Xavfsizlik va etika', 'Natija va qayta aloqa']) {
      expect(t).toContain(term)
    }
    expect(t).toContain('Darhol haydab chiqarish')
    expect(t).toContain('bevosita xavfsizlik tahdidi')
    expect(t).toContain('Jalilov')
  })

  it('preserves absence of private answer keys from all three M16 shipped fallback lessons', () => {
    for (const id of ['M16.01', 'M16.02', 'M16.03']) {
      const topic = getTopicContent(id)
      expect(topic?.questions).toEqual([])
    }
  })
})
