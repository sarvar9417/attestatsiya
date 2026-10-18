import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { getTopicContent, type TheoryBlock } from '../data/topicContent'
import BookReader, { splitSections } from '../components/learning/theory/BookReader'

const topics = ['M05.01', 'M05.02', 'M05.03'] as const
const walk = (items: TheoryBlock[]): TheoryBlock[] =>
  items.flatMap(block => [block, ...walk(block.children ?? [])])

describe('M05: Sanoq sistemalari nazariyasining to‘liq integratsiyasi', () => {
  it('11 bobning barchasi uchta mavjud mavzuda saqlanadi', () => {
    const all = topics.flatMap(id => walk(getTopicContent(id)!.theory))
    const chapters = all.filter(b => b.type === 'goal' && /^\\d+-bob$/.test(b.label ?? ''))
    expect(chapters.map(b => b.label)).toEqual(
      Array.from({ length: 11 }, (_, index) => `${index + 1}-bob`),
    )
    expect(topics.map(id => splitSections(getTopicContent(id)!.theory).length))
      .toEqual([8, 14, 21])
  })

  it('formulalar, jadvallar, yechimli misollar va izohlar yo‘qolmagan', () => {
    const all = topics.flatMap(id => walk(getTopicContent(id)!.theory))
    expect(all.filter(b => b.type === 'solved').length).toBeGreaterThanOrEqual(30)
    expect(all.filter(b => b.type === 'table').length).toBeGreaterThanOrEqual(7)
    expect(all.filter(b => b.type === 'formula').length).toBeGreaterThanOrEqual(10)
    expect(all.some(b => b.content.includes('Gorner sxemasi'))).toBe(true)
    expect(all.some(b => b.content.includes('two\'s complement'))).toBe(true)
    expect(all.some(b => b.content.includes('davriy kasr'))).toBe(true)
    expect(all.some(b => b.content.includes('Noma’lum asos'))).toBe(true)
    expect(all.every(b => !/\\\\(?:bn|keyterm|source)\\b/.test(b.content))).toBe(true)
  })

  it('mavjud offline-testlar va kitob sahifalash rejimi saqlanadi', () => {
    for (const id of topics) {
      const content = getTopicContent(id)!
      expect(content.source).toContain('Sanoq_sistemalari_nazariya.tex')
      expect(content.kind).toBe('chapter')
      expect(content.questions.length).toBeGreaterThan(0)
    }

    const content = getTopicContent('M05.01')!
    render(<BookReader content={content} questionCount={20} onFinishReading={() => {}} />)
    expect(screen.getByText(/1\.1\. Asosiy atamalar/)).toBeInTheDocument()
    expect(screen.getByText(/Sanoq sistemasining mohiyati/)).toBeInTheDocument()
  })
})
