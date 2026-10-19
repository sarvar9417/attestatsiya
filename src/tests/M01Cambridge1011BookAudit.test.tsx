import { describe, expect, it } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { CAMBRIDGE1011_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge1011'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'

describe('TASK-244 Cambridge+ 10–11 original source concordance', () => {
  it('has four M01 additions with exact source pages and valid chapter anchors', () => {
    expect(CAMBRIDGE1011_M01_PAGE_ADDENDA).toHaveLength(4)
    for (const add of CAMBRIDGE1011_M01_PAGE_ADDENDA) {
      expect(M01_CONTENT[add.topicId].theory.some(block =>
        block.type === 'heading' && block.content === add.beforeHeading,
      )).toBe(true)
      expect(add.blocks.some(block =>
        block.type === 'source' && /Cambridge\+ 10–11-sinf \(2021\), PDF \d+/.test(block.content),
      )).toBe(true)
    }
    expect(ALL_M01_PAGE_ADDENDA.some(add =>
      add.blocks.some(b => b.content.includes('Raqamli tengsizlik'))
    )).toBe(true)
  })

  it('preserves all 12 generated M01 topics and all old lesson blocks in order', () => {
    for (const [id, original] of Object.entries(M01_CONTENT)) {
      const learner = getTopicContent(id)!
      const added = ALL_M01_PAGE_ADDENDA.filter(a => a.topicId === id).flatMap(a => a.blocks)
      expect(learner.theory.length).toBe(original.theory.length + added.length)
      expect(learner.theory.filter(block => !added.includes(block))).toEqual(original.theory)
      expect(learner.questions).toBe(original.questions)
    }
  })

  it('separates static/dynamic data and corrects universal assumptions', () => {
    const data = CAMBRIDGE1011_M01_PAGE_ADDENDA[0].blocks.map(b => b.content).join(' ')
    expect(data).toContain('Statik')
    expect(data).toContain('dinamik')
    const divide = CAMBRIDGE1011_M01_PAGE_ADDENDA[2].blocks
    expect(divide.some(block => block.content.includes('Raqamli tengsizlik'))).toBe(true)
  })
})
