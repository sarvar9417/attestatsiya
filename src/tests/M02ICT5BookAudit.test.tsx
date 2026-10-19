import { describe, expect, it } from 'vitest'
import { getTopicContent, TOPIC_CONTENT } from '../data/topicContent'
import { M02_CANONICAL_GROUPS } from '../data/topics/m02Canonical'
import { ICT5_M02_BOOK_ADDENDA } from '../data/topics/m02TextbookAuditICT5'

describe('TASK-245 — ICT5 textbook page audit for M02', () => {
  it('attaches four textbook packages to all four canonical M02 topics', () => {
    expect(Object.keys(ICT5_M02_BOOK_ADDENDA).sort())
      .toEqual(['M02.01','M02.02','M02.03','M02.04'])
    for (const group of M02_CANONICAL_GROUPS) {
      const blocks = ICT5_M02_BOOK_ADDENDA[group.id]
      expect(blocks?.length).toBeGreaterThanOrEqual(3)
      expect(blocks.some(b => b.type === 'source' && b.content.includes('PDF '))).toBe(true)
      const learner = getTopicContent(group.id)!
      for (const block of blocks) expect(learner.theory).toContain(block)
    }
  })

  it('contrasts Esc with Undo and file content with shortcut', () => {
    const keyboard = ICT5_M02_BOOK_ADDENDA['M02.02'].map(x=>x.content).join(' ')
    expect(keyboard).toContain('Esc')
    expect(keyboard).toContain('Undo (Ctrl+Z)')
    const files = ICT5_M02_BOOK_ADDENDA['M02.03'].map(x=>x.content).join(' ')
    expect(files).toContain('yorliq')
    expect(files).toContain('asl faylni')
  })

  it('renders the added comparison tables as rectangular data', () => {
    const tables = Object.values(ICT5_M02_BOOK_ADDENDA).flat().filter(b => b.type === 'table')
    expect(tables.length).toBeGreaterThanOrEqual(2)
    for (const table of tables) {
      expect(table.rows?.length).toBeGreaterThan(0)
      expect(table.rows?.every(row => row.length === table.headers?.length)).toBe(true)
    }
  })

  it('preserves every original legacy theory block and question id', () => {
    for (const group of M02_CANONICAL_GROUPS) {
      const learner = getTopicContent(group.id)!
      for (const legacyId of group.legacyParts) {
        const original = TOPIC_CONTENT[legacyId]!
        for (const block of original.theory) expect(learner.theory).toContain(block)
        for (const question of original.questions) {
          expect(learner.questions.some(q => q.id === question.id)).toBe(true)
        }
      }
      expect(new Set(learner.questions.map(q=>q.id)).size).toBe(learner.questions.length)
    }
  })
})
