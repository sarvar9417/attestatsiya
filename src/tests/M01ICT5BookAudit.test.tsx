import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import {
  ICT5_M01_PAGE_ADDENDA,
  ALL_M01_PAGE_ADDENDA,
  withVerifiedM01Additions,
} from '../data/topics/m01TextbookAudit'
import { splitSections } from '../components/learning/theory/BookReader'
import BookBlock from '../components/learning/theory/BookBlock'

describe('TASK-244 — ICT 5-sinf (2020) PDF-by-PDF-page M01 review', () => {
  it('maps six exact source-page additions to canonical M01 lessons', () => {
    expect(ICT5_M01_PAGE_ADDENDA).toHaveLength(6)
    expect(new Set(ICT5_M01_PAGE_ADDENDA.map(item => item.topicId)))
      .toEqual(new Set(['M01.02', 'M01.03', 'M01.04', 'M01.05']))
    for (const insertion of ICT5_M01_PAGE_ADDENDA) {
      expect(M01_CONTENT[insertion.topicId].theory.some(
        block => block.type === 'heading' && block.content === insertion.beforeHeading,
      )).toBe(true)
      expect(insertion.blocks.some(
        block => block.type === 'source' && /ICT 5-sinf, 2020, PDF \d+/.test(block.content),
      )).toBe(true)
    }
  })

  it('preserves every original handbook block exactly, in the original order', () => {
    for (const id of Object.keys(M01_CONTENT)) {
      const original = M01_CONTENT[id].theory
      const added = ALL_M01_PAGE_ADDENDA
        .filter(insertion => insertion.topicId === id)
        .flatMap(insertion => insertion.blocks)
      const learner = getTopicContent(id)!
      expect(learner.source).toBe(M01_CONTENT[id].source)
      expect(learner.theory.length).toBe(original.length + added.length)
      expect(learner.theory.filter(block => !added.includes(block))).toEqual(original)
      expect(splitSections(learner.theory).flatMap(section => section.blocks)).toEqual(learner.theory)
    }
  })

  it('keeps grade-5 storage calculation and binary-vs-decimal caveat together', () => {
    const content = getTopicContent('M01.05')!.theory
    const solved = content.find(block => block.type === 'solved' &&
      block.label?.includes('Darslikdagi hisobni tushunish'))!
    expect(solved).toBeDefined()
    const formulas = (solved.children ?? []).filter(block => block.type === 'keyformula')
    expect(formulas).toHaveLength(2)
    expect(formulas[0].content).toContain('384\\,000')
    expect(formulas[1].content).toContain('375')
    const note = solved.children?.find(block => block.type === 'note')?.content
    expect(note).toContain('375 KiB')
    expect(note).toContain('384 kB')
    expect(note).toContain('Unicode')
  })

  it('renders source-backed definitions and page references as actual learner cards', () => {
    const audit = ICT5_M01_PAGE_ADDENDA.find(
      insertion => insertion.topicId === 'M01.02',
    )!
    const table = audit.blocks.find(block => block.type === 'table')!
    const citation = audit.blocks.find(block => block.type === 'source')!
    const { container } = render(
      <>
        <BookBlock block={table} index={1} />
        <BookBlock block={citation} index={2} />
      </>,
    )
    expect(screen.getByRole('columnheader', { name: 'Tarkibiy yo‘nalish' })).toBeInTheDocument()
    expect(screen.getByText('Brainware')).toBeInTheDocument()
    expect(container.textContent).toContain('PDF 10–13')
  })

  it('fails explicitly if a future handbook regeneration moves the anchor', () => {
    expect(() => withVerifiedM01Additions(M01_CONTENT, [{
      topicId: 'M01.02',
      beforeHeading: 'NONEXISTENT',
      blocks: [{ type: 'text', content: 'not written' }],
    }])).toThrow('Manba joylashuvi topilmadi')
  })
})
