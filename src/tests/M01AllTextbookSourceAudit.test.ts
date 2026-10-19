import { describe, expect, it } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { ALL_M01_PAGE_ADDENDA, ICT5_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { ICT6_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT6'
import { ICT7_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT7'
import { ICT8_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT8'
import { ICT9_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT9'
import { ICT10_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT10'
import { ICT11_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT11'
import { CAMBRIDGE5_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge5'
import { CAMBRIDGE6_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge6'
import { CAMBRIDGE7_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge7'
import { CAMBRIDGE8_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge8'
import { CAMBRIDGE9_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge9'
import { CAMBRIDGE1011_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge1011'

const books = [
  ['ICT5', ICT5_M01_PAGE_ADDENDA, 6],
  ['ICT6', ICT6_M01_PAGE_ADDENDA, 4],
  ['ICT7', ICT7_M01_PAGE_ADDENDA, 7],
  ['ICT8', ICT8_M01_PAGE_ADDENDA, 4],
  ['ICT9', ICT9_M01_PAGE_ADDENDA, 3],
  ['ICT10', ICT10_M01_PAGE_ADDENDA, 3],
  ['ICT11', ICT11_M01_PAGE_ADDENDA, 5],
  ['Cambridge5', CAMBRIDGE5_M01_PAGE_ADDENDA, 4],
  ['Cambridge6', CAMBRIDGE6_M01_PAGE_ADDENDA, 4],
  ['Cambridge7', CAMBRIDGE7_M01_PAGE_ADDENDA, 3],
  ['Cambridge8', CAMBRIDGE8_M01_PAGE_ADDENDA, 3],
  ['Cambridge9', CAMBRIDGE9_M01_PAGE_ADDENDA, 6],
  ['Cambridge10–11', CAMBRIDGE1011_M01_PAGE_ADDENDA, 7],
] as const

describe('TASK-244 unified 13 original textbook evidence gate', () => {
  it('includes exactly one record per original textbook in the required order', () => {
    expect(books).toHaveLength(13)
    expect(books.map(([name]) => name)).toEqual([
      'ICT5','ICT6','ICT7','ICT8','ICT9','ICT10','ICT11',
      'Cambridge5','Cambridge6','Cambridge7','Cambridge8','Cambridge9','Cambridge10–11',
    ])
    for (const [name, items, count] of books) {
      expect(items.length, name).toBe(count)
      expect(items.every(item => item.blocks.length > 0), name).toBe(true)
    }
    expect(books.reduce((sum, [,items]) => sum + items.length, 0)).toBe(59)
    expect(ALL_M01_PAGE_ADDENDA).toEqual(books.flatMap(([,items]) => items))
  })

  it('requires each insert to be in a real canonical topic with traceable textbook pages', () => {
    for (const [book, inserts] of books) {
      for (const entry of inserts) {
        const base = M01_CONTENT[entry.topicId]
        expect(base, book).toBeDefined()
        expect(base.theory.some(block =>
          block.type === 'heading' && block.content === entry.beforeHeading,
        ), `${book} / ${entry.topicId} / ${entry.beforeHeading}`).toBe(true)
        const sources = entry.blocks.filter(block => block.type === 'source')
        expect(sources.length, `${book}/${entry.topicId}`).toBeGreaterThan(0)
        expect(sources.every(block => /PDF \d+/.test(block.content)), book).toBe(true)
      }
    }
  })

  it('retains every generated theory block by identity and order and every original question array', () => {
    for (const [id, base] of Object.entries(M01_CONTENT)) {
      const learner = getTopicContent(id)!
      const extras = ALL_M01_PAGE_ADDENDA.filter(item => item.topicId === id)
        .flatMap(item => item.blocks)
      expect(learner.theory.length, id).toBe(base.theory.length + extras.length)
      expect(learner.theory.filter(block => !extras.includes(block))).toEqual(base.theory)
      expect(learner.questions).toBe(base.questions)
      expect(learner.title).toBe(base.title)
      expect(learner.source).toBe(base.source)
    }
  })
})
