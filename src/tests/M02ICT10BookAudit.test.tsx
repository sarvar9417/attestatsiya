import { describe, expect, it } from 'vitest'
import { getTopicContent, TOPIC_CONTENT } from '../data/topicContent'
import { M02_CANONICAL_GROUPS } from '../data/topics/m02Canonical'
import { ICT10_M02_BOOK_ADDENDA } from '../data/topics/m02TextbookAuditICT10'

describe('M02 ICT10 (2021) source corrections', () => {
  it('includes four PDF-traced original textbook corrections', () => {
    expect(Object.keys(ICT10_M02_BOOK_ADDENDA).sort()).toEqual(['M02.01','M02.02','M02.03','M02.04'])
    for (const group of M02_CANONICAL_GROUPS) {
      const parts=ICT10_M02_BOOK_ADDENDA[group.id]
      expect(parts.some(b=>b.type==='source' && b.content.includes('PDF '))).toBe(true)
      const current=getTopicContent(group.id)!
      for (const b of parts) expect(current.theory).toContain(b)
      for (const legacy of group.legacyParts) for (const q of TOPIC_CONTENT[legacy]!.questions) {
        expect(current.questions.some(item=>item.id===q.id)).toBe(true)
      }
    }
  })
  it('identifies printed generation/GUI and Django example ambiguities', () => {
    expect(ICT10_M02_BOOK_ADDENDA['M02.01'].some(b=>b.content.includes('1946–1955'))).toBe(true)
    expect(ICT10_M02_BOOK_ADDENDA['M02.02'].some(b=>b.content.includes('GUI (Graphical User Interface)'))).toBe(true)
    expect(ICT10_M02_BOOK_ADDENDA['M02.03'].some(b=>b.content.includes('settings.py'))).toBe(true)
  })
  it('has a rectangular archiver/codec/converter/player comparison', () => {
    const table=ICT10_M02_BOOK_ADDENDA['M02.04'].find(b=>b.type==='table')!
    expect(table.headers).toHaveLength(3)
    expect(table.rows).toHaveLength(4)
    expect(table.rows?.every(row=>row.length===table.headers?.length)).toBe(true)
  })
})
