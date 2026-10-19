import { describe, expect, it } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { CAMBRIDGE8_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge8'

describe('Cambridge+8 TASK-244 textbook trace', () => {
  it('traces three inserts to exact M01 headings and textbook pages', () => {
    expect(CAMBRIDGE8_M01_PAGE_ADDENDA).toHaveLength(3)
    expect(ALL_M01_PAGE_ADDENDA.length).toBeGreaterThanOrEqual(46)
    for(const item of CAMBRIDGE8_M01_PAGE_ADDENDA) {
      expect(M01_CONTENT[item.topicId].theory.some(block =>
        block.type==='heading' && block.content===item.beforeHeading,
      )).toBe(true)
      expect(item.blocks.some(block => block.type==='source' &&
        block.content.includes('Cambridge+ 8-sinf, 2021, PDF '))).toBe(true)
    }
  })
  it('distinguishes network types, protective layers and storyboard components', () => {
    expect(CAMBRIDGE8_M01_PAGE_ADDENDA[0].blocks.find(b=>b.type==='table')?.rows).toHaveLength(5)
    expect(CAMBRIDGE8_M01_PAGE_ADDENDA[1].blocks.find(b=>b.type==='table')?.rows).toHaveLength(4)
    expect(CAMBRIDGE8_M01_PAGE_ADDENDA[2].blocks.find(b=>b.type==='table')?.rows).toHaveLength(4)
  })
  it('retains original theory block order and original questions', () => {
    for(const [id,source] of Object.entries(M01_CONTENT)){
      const theory=getTopicContent(id)!
      const patches=ALL_M01_PAGE_ADDENDA.filter(p=>p.topicId===id).flatMap(p=>p.blocks)
      expect(theory.theory.length).toBe(source.theory.length+patches.length)
      expect(theory.theory.filter(x=>!patches.includes(x))).toEqual(source.theory)
      expect(theory.questions).toBe(source.questions)
    }
  })
})
