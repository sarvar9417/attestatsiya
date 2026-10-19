import { describe, it, expect } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { CAMBRIDGE6_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge6'

describe('TASK-244 Cambridge+ grade 6 Internet and email source audit', () => {
  it('has four stable, page-cited additions placed in M01.04', () => {
    expect(CAMBRIDGE6_M01_PAGE_ADDENDA).toHaveLength(4)
    expect(ALL_M01_PAGE_ADDENDA.length).toBeGreaterThanOrEqual(40)
    const pages = ['PDF 162–166','PDF 167–180','PDF 181–196','PDF 196–205']
    CAMBRIDGE6_M01_PAGE_ADDENDA.forEach((item, i) => {
      expect(item.topicId).toBe('M01.04')
      expect(M01_CONTENT['M01.04'].theory.some(block =>
        block.type === 'heading' && block.content === item.beforeHeading,
      ), item.beforeHeading).toBe(true)
      expect(item.blocks.find(block => block.type === 'source')?.content).toContain(pages[i])
    })
  })

  it('corrects the index/history confusion and rejects a universal search ranking', () => {
    const blocks = CAMBRIDGE6_M01_PAGE_ADDENDA[0].blocks
    expect(blocks.find(b => b.type === 'table')?.rows?.length).toBe(4)
    expect(blocks.find(b => b.type === 'trap')?.content).toContain('shaxsiy qidiruv tarixining o‘zi emas')
    expect(blocks.find(b => b.type === 'trap')?.content).toContain('.uz')
  })

  it('distinguishes BCC from encryption, and checks attachment size-unit caveat', () => {
    const mail = CAMBRIDGE6_M01_PAGE_ADDENDA[2].blocks
    expect(mail.find(b => b.type === 'table')?.rows?.map(row => row[0]))
      .toEqual(['Reply','Reply All','Forward','CC','BCC'])
    expect(mail.find(b => b.type === 'trap')?.content).toContain('shifrlashi emas')
    const files = CAMBRIDGE6_M01_PAGE_ADDENDA[3].blocks
    expect(files.find(b => b.type === 'trap')?.content).toContain('Mb (megabit)')
    expect(files.find(b => b.type === 'trap')?.content).toContain('MB (megabayt)')
  })

  it('preserves every original lesson block and published question unchanged', () => {
    for (const [id, base] of Object.entries(M01_CONTENT)) {
      const learner = getTopicContent(id)!
      const insert = ALL_M01_PAGE_ADDENDA.filter(x => x.topicId === id).flatMap(x => x.blocks)
      expect(learner.theory.length).toBe(base.theory.length + insert.length)
      expect(learner.theory.filter(b => !insert.includes(b))).toEqual(base.theory)
      expect(learner.questions).toBe(base.questions)
    }
  })
})
