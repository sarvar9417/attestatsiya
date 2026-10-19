import { describe, expect, it } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { ICT11_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT11'

describe('TASK-244 grade 11 audit', () => {
  it('traces all five source additions to canonical headings and printed pages', () => {
    expect(ICT11_M01_PAGE_ADDENDA).toHaveLength(5)
    expect(ALL_M01_PAGE_ADDENDA).toHaveLength(36)
    for (const item of ICT11_M01_PAGE_ADDENDA) {
      expect(M01_CONTENT[item.topicId].theory.some(block =>
        block.type === 'heading' && block.content === item.beforeHeading,
      )).toBe(true)
      expect(item.blocks.some(block => block.type === 'source' &&
        block.content.includes('ICT 11-sinf (2021), PDF '))).toBe(true)
    }
  })

  it('checks data quality, data classes, footprint and source audit', () => {
    const firstTable = ICT11_M01_PAGE_ADDENDA[0].blocks.find(x => x.type === 'table')
    expect(firstTable?.rows?.length).toBe(6)
    const secondTable = ICT11_M01_PAGE_ADDENDA[1].blocks.find(x => x.type === 'table')
    expect(secondTable?.rows?.length).toBe(3)
    const footprint = ICT11_M01_PAGE_ADDENDA[2].blocks.find(x => x.type === 'table')
    expect(footprint?.rows?.map(row => row[0])).toEqual(['Faol', 'Passiv'])
    const checks = ICT11_M01_PAGE_ADDENDA[3].blocks.find(x => x.type === 'list')
    expect(checks?.items).toHaveLength(7)
  })

  it('preserves generated original data and exact question collections', () => {
    for (const [id, original] of Object.entries(M01_CONTENT)) {
      const actual = getTopicContent(id)!
      const injected = ALL_M01_PAGE_ADDENDA.filter(x => x.topicId === id)
        .flatMap(x => x.blocks)
      expect(actual.theory.length).toBe(original.theory.length + injected.length)
      expect(actual.theory.filter(x => !injected.includes(x))).toEqual(original.theory)
      expect(actual.questions).toBe(original.questions)
    }
  })
})
