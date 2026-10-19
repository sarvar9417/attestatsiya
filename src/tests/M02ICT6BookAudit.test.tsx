import { describe, expect, it } from 'vitest'
import { getTopicContent, TOPIC_CONTENT } from '../data/topicContent'
import { ICT6_M02_BOOK_ADDENDA } from '../data/topics/m02TextbookAuditICT6'
import { M02_CANONICAL_GROUPS } from '../data/topics/m02Canonical'

describe('M02 ICT 6-sinf 2021 source-linked bridges', () => {
  it('keeps four M02 topic additions linked to exact PDF pages', () => {
    expect(Object.keys(ICT6_M02_BOOK_ADDENDA).sort()).toEqual(['M02.01','M02.02','M02.03','M02.04'])
    for (const group of M02_CANONICAL_GROUPS) {
      const blocks=ICT6_M02_BOOK_ADDENDA[group.id]
      expect(blocks.some(b=>b.type==='source' && /PDF \d+/.test(b.content))).toBe(true)
      const learner=getTopicContent(group.id)!
      for (const block of blocks) expect(learner.theory).toContain(block)
      for (const part of group.legacyParts) {
        for (const q of TOPIC_CONTENT[part]!.questions) expect(learner.questions.some(x=>x.id===q.id)).toBe(true)
      }
    }
  })
  it('distinguishes a local hyperlink target from the referenced file', () => {
    expect(ICT6_M02_BOOK_ADDENDA['M02.03'].some(b=>b.content.includes('avtomatik ravishda hujjat ichiga ko‘chirib'))).toBe(true)
  })
  it('renders application and OS contrast as a real table', () => {
    const b=ICT6_M02_BOOK_ADDENDA['M02.04'].find(b=>b.type==='table')!
    expect(b.headers).toHaveLength(3)
    expect(b.rows).toHaveLength(3)
    expect(b.rows!.every(row=>row.length===b.headers!.length)).toBe(true)
  })
})
