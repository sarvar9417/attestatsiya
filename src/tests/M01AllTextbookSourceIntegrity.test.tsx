import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M01_CONTENT } from '../data/topics/m01'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'

/**
 * Final thirteen-book textbook source integration gate.
 * The official 2026 specification covers seven M01 constructs;
 * its separate content crosswalk is documented in docs/TASK244_M01_2026_SPEC_CROSSWALK_20261019.md.
 */
describe('TASK-244 — 13 textbook source integration invariants', () => {
  it('preserves the twelve canonical topics and all fifty-nine source insertions', () => {
    expect(Object.keys(M01_CONTENT)).toHaveLength(12)
    expect(ALL_M01_PAGE_ADDENDA).toHaveLength(59)
    for (const [topicId, base] of Object.entries(M01_CONTENT)) {
      const learner = getTopicContent(topicId)!
      const extras = ALL_M01_PAGE_ADDENDA
        .filter(addition => addition.topicId === topicId)
        .flatMap(addition => addition.blocks)
      expect(learner.theory.length).toBe(base.theory.length + extras.length)
      expect(learner.theory.filter(block => !extras.includes(block))).toEqual(base.theory)
      expect(learner.questions).toBe(base.questions)
    }
  })

  it('anchors every source block to a real existing lesson heading and page range', () => {
    for (const entry of ALL_M01_PAGE_ADDENDA) {
      const original = M01_CONTENT[entry.topicId]
      expect(original, entry.topicId).toBeDefined()
      expect(original.theory.some(block =>
        block.type === 'heading' && block.content === entry.beforeHeading,
      ), entry.topicId + ' / ' + entry.beforeHeading).toBe(true)
      const sources = entry.blocks.filter(block => block.type === 'source')
      expect(sources.length, entry.topicId + ' sources').toBeGreaterThan(0)
      expect(sources.every(block => /\bPDF\s+\d+/.test(block.content))).toBe(true)
    }
  })

  it('keeps at least 36 source-added tables visible and rectangular in the learner renderer', () => {
    const tables = ALL_M01_PAGE_ADDENDA.flatMap(addition => addition.blocks)
      .filter(block => block.type === 'table')
    expect(tables.length).toBeGreaterThanOrEqual(36)
    for (const table of tables) {
      expect(table.headers?.length).toBeGreaterThanOrEqual(2)
      expect(table.rows?.length).toBeGreaterThan(0)
      const columns = table.headers!.length
      expect(table.rows?.every(row => row.length === columns)).toBe(true)
    }
  })

  it('keeps nested solved exercises and lists available for their reader blocks', () => {
    for (const block of ALL_M01_PAGE_ADDENDA.flatMap(addition => addition.blocks)) {
      if (block.type === 'list') {
        expect(block.items?.length).toBeGreaterThan(0)
      }
      if (block.type === 'solved' && block.children) {
        expect(block.children.length).toBeGreaterThan(0)
      }
    }
  })
})
