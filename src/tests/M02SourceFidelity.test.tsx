import { describe, expect, it } from 'vitest'
import { MODULES } from '../data/contentTree'
import { getTopicContent } from '../data/topicContent'
import { M02_CANONICAL_GROUPS } from '../data/topics/m02Canonical'
import { M02_SOURCE_THEORY } from '../data/topics/m02SourceTheory'
import { paginateTheoryBlocks } from '../features/content/theoryPagination'

function markdownRows(markdown: string): string[][] {
  return markdown.trim().split('\n').slice(2).map(line =>
    line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim()),
  )
}

describe('M02 canonical source and lesson QA', () => {
  const ids = ['M02.01', 'M02.02', 'M02.03', 'M02.04']

  it('matches all four 2026 assessment constructs and retains nine old lessons in order', () => {
    const curriculum = MODULES.find(module => module.id === 'M02')
    expect(curriculum?.examQuestionCount).toBe(2)
    expect(curriculum?.subtopics.map(topic => topic.id)).toEqual(ids)
    expect(M02_CANONICAL_GROUPS.map(group => group.id)).toEqual(ids)
    expect(new Set(M02_CANONICAL_GROUPS.flatMap(group => group.legacyParts)).size).toBe(9)

    for (const group of M02_CANONICAL_GROUPS) {
      const lesson = getTopicContent(group.id)
      expect(lesson?.title).toBe(group.title)
      expect(lesson?.theory.length).toBeGreaterThan(group.legacyParts.length)
      expect(lesson?.theory.filter(block => block.type === 'heading').length)
        .toBeGreaterThanOrEqual(group.legacyParts.length)
      expect(lesson?.theory.at(-1)?.type).toBe('source')
      expect(lesson?.theory.at(-1)?.content).toBe(group.sourceHint)
      expect(lesson?.questions.length).toBeGreaterThan(0)
    }
  })

  it('preserves 34 valid single-choice fallbacks, never falsely renders Y2 matching', () => {
    const questions = ids.flatMap(id => getTopicContent(id)?.questions ?? [])
    expect(questions).toHaveLength(34)
    expect(new Set(questions.map(question => question.id)).size).toBe(34)

    for (const q of questions) {
      expect(q.type, q.id).toBe('Y1')
      expect(q.options, q.id).toHaveLength(4)
      expect(Number.isInteger(q.correctIndex), q.id).toBe(true)
      expect(q.correctIndex, q.id).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex, q.id).toBeLessThan(4)
    }
  })

  it('keeps each section heading with its following explanation without dropping text', () => {
    for (const id of ids) {
      const theory = getTopicContent(id)!.theory
      const pages = paginateTheoryBlocks(theory, 2, true)
      expect(pages.flat()).toEqual(theory)
      expect(pages.every(page => page.length > 0)).toBe(true)
      for (const page of pages.slice(0, -1)) {
        expect(page.at(-1)?.type, id).not.toBe('heading')
      }
    }
    const small = [
      { type: 'text' as const, content: 'Oldingi mavzu' },
      { type: 'heading' as const, content: 'Keyingi mavzu' },
      { type: 'text' as const, content: 'Izoh' },
    ]
    expect(paginateTheoryBlocks(small, 2, true).map(page => page.map(block => block.type)))
      .toEqual([['text'], ['heading', 'text']])
    expect(paginateTheoryBlocks(small)).toHaveLength(2)
  })

  it('keeps the full CLI/GUI and file-operation table text visible, not abbreviated rows', () => {
    for (const id of ['M02.02', 'M02.03']) {
      const table = M02_SOURCE_THEORY[id].find(block => block.type === 'table')
      expect(table?.headers?.length).toBeGreaterThan(1)
      expect(table?.rows).toEqual(markdownRows(table!.content))
    }
  })

  it('provides traceable and differentiated source-backed theory for all constructs', () => {
    for (const id of ids) {
      const blocks = M02_SOURCE_THEORY[id]
      expect(blocks.length, id).toBeGreaterThan(4)
      expect(blocks.some(block => block.type === 'definition'), id).toBe(true)
      expect(blocks.some(block => block.type === 'example' || block.type === 'case'), id).toBe(true)
      expect(blocks.some(block => /@@(?:ICT|Cambridge\+)/.test(block.content)), id).toBe(true)
    }
    const all = ids.map(id => getTopicContent(id)!.theory.map(block => block.content).join('\n')).join('\n')
    expect(all).toContain('NAND flash')
    expect(all).toContain('kataloglar daraxti')
    expect(all).not.toContain('Yaqqol xotira')
    expect(all).not.toContain('80%+ qurilmalar')
  })

  it('avoids ambiguous historical question and preserves the unchanged answer index', () => {
    const quiz = getTopicContent('M02.01')!.questions
    const eniac = quiz.find(question => question.id === 'M02.01-q1')!
    expect(eniac.text).toMatch(/ilk umumiy maqsadli elektron raqamli/)
    expect(eniac.options[eniac.correctIndex]).toBe('ENIAC')
  })
})
