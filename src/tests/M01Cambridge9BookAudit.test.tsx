import { describe, expect, it } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { CAMBRIDGE9_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge9'

describe('TASK-244 Cambridge 9 source-to-theory reconciliation', () => {
  it('traces six book insertions into exact existing M01 headings', () => {
    expect(CAMBRIDGE9_M01_PAGE_ADDENDA).toHaveLength(6)
    expect(ALL_M01_PAGE_ADDENDA.length).toBeGreaterThanOrEqual(52)
    for (const item of CAMBRIDGE9_M01_PAGE_ADDENDA) {
      expect(M01_CONTENT[item.topicId].theory.some(b =>
        b.type === 'heading' && b.content === item.beforeHeading,
      ), item.beforeHeading).toBe(true)
      expect(item.blocks.some(b => b.type === 'source' &&
        b.content.includes('Cambridge+ 9-sinf (2021), PDF '))).toBe(true)
    }
  })
  it('separates input validation, verification and word spelling checks', () => {
    const item = CAMBRIDGE9_M01_PAGE_ADDENDA.find(x =>
      x.beforeHeading === 'Xatolarni aniqlashning chuqurlashtirilgan usullari',
    )!
    expect(item.blocks.find(x => x.type === 'table')?.rows?.map(x => x[0]))
      .toEqual(['Validation (qoidaga moslik)','Verification (asl manbaga moslik)','Spell check'])
    expect(item.blocks.find(x => x.type === 'source')?.content).toContain('PDF 192–198')
  })
  it('does not treat a filename extension, newsletter and source rank as correctness', () => {
    const joined = CAMBRIDGE9_M01_PAGE_ADDENDA.flatMap(x => x.blocks).map(x => x.content).join(' ')
    expect(joined).toContain('ZIP')
    expect(joined).toContain('JPEG')
    expect(joined).toContain('Pharming')
    expect(joined).toContain('trend')
  })
  it('never removes a generated handbook lesson or question', () => {
    for (const [id, original] of Object.entries(M01_CONTENT)) {
      const actual = getTopicContent(id)!
      const add = ALL_M01_PAGE_ADDENDA.filter(x => x.topicId === id).flatMap(x => x.blocks)
      expect(actual.theory.length).toBe(original.theory.length + add.length)
      expect(actual.theory.filter(x => !add.includes(x))).toEqual(original.theory)
      expect(actual.questions).toBe(original.questions)
    }
  })
})
