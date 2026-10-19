import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { M01_CONTENT } from '../data/topics/m01'
import { MODULES } from '../data/contentTree'
import { BOOK_DIAGRAMS } from '../components/learning/theory/BookDiagrams'
import BookBlock from '../components/learning/theory/BookBlock'
import { splitSections } from '../components/learning/theory/BookReader'
import type { TheoryBlock } from '../data/topicContent'

function nestedBlocks(blocks: readonly TheoryBlock[]): TheoryBlock[] {
  return blocks.flatMap(block => [block, ...nestedBlocks(block.children ?? [])])
}

describe('M01 source and learner layout regression', () => {
  it('keeps all twelve canonical topics, the original source trace and ordered sections', () => {
    const ids = MODULES.find(module => module.code === 'M01')?.subtopics.map(topic => topic.id)
    expect(ids).toHaveLength(12)
    expect(Object.keys(M01_CONTENT).sort()).toEqual(ids?.slice().sort())
    for (const id of ids ?? []) {
      const topic = M01_CONTENT[id]
      expect(topic.source).toContain('I_qism_Axborot_va_raqamli_savodxonlik_yagona.tex')
      expect(topic.theory.length).toBeGreaterThan(0)
      const sections = splitSections(topic.theory)
      const recovered = sections.flatMap(section => section.blocks)
      expect(recovered).toEqual(topic.theory)
      expect(sections.length).toBeGreaterThan(0)
    }
  })

  it('has exactly ten mapped diagrams and none disappear silently', () => {
    const diagrams = Object.values(M01_CONTENT).flatMap(topic =>
      nestedBlocks(topic.theory).filter(block => block.type === 'diagram'),
    )
    expect(diagrams).toHaveLength(10)
    for (const diagram of diagrams) {
      expect(diagram.diagram).toBeTruthy()
      expect(BOOK_DIAGRAMS[diagram.diagram!]).toBeDefined()
    }
  })

  it('displays all ten named worked examples as formatted titles instead of braces or source chips', () => {
    const examples = Object.values(M01_CONTENT).flatMap(topic =>
      nestedBlocks(topic.theory).filter(block => block.type === 'solved' &&
        /==(?:Oddiy|O'rta|Murakkab|Bosqichli tahlil)==/.test(block.label ?? '')),
    )
    expect(examples).toHaveLength(10)
    for (const example of examples) {
      expect(example.label).not.toContain('@@')
      const firstChild = example.children?.[0]
      expect(firstChild?.type).toBe('text')
      expect(firstChild?.content).not.toMatch(/^\{(?:[123]-misol|Ishlangan usul)/)
    }
    const parity = examples.find(example => example.label?.includes('Juft parity bitini topish'))
    expect(parity).toBeDefined()
    const { container } = render(<BookBlock block={parity!} index={0} />)
    expect(screen.getByText('Oddiy').className).toContain('book-term')
    expect(screen.getByText(/Ma'lumot biti/)).toBeInTheDocument()
    expect(container.textContent).not.toContain('@@Oddiy@@')
  })

  it('renders the nested M01.12 source bibliography instead of dropping it', () => {
    const appendix = M01_CONTENT['M01.12']
    const source = appendix.theory.find(block => block.type === 'source' &&
      block.label === 'Birlashtirilgan fayllar')
    expect(source).toBeDefined()
    expect(source?.content).toBe('')
    expect(source?.children).toHaveLength(1)
    render(<BookBlock block={source!} index={0} />)
    expect(screen.getByText('Birlashtirilgan fayllar')).toBeInTheDocument()
    expect(screen.getByText(/Axborotlar_3_0/)).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('keeps source locators distinct from difficulty and preserves inline math', () => {
    const all = Object.values(M01_CONTENT).flatMap(topic => nestedBlocks(topic.theory))
    const content = all.map(block => [block.content, block.label ?? ''].join(' ')).join('\n')
    expect(content).not.toMatch(/@@(?:Oddiy|O'rta|Murakkab|Bosqichli tahlil)@@/)
    expect(content).toContain('@@ICT6, PDF 94–104@@')
    expect(content).toContain('$')
    expect(content).toContain('Unicode')
    expect(content).toContain('mualliflik huquqi')
  })
})
