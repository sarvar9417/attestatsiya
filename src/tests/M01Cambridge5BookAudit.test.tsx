import { describe, it, expect } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { CAMBRIDGE5_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge5'

describe('TASK-244 Cambridge+ 5-sinf source fidelity', () => {
  it('reconciles all four inserts with canonical section boundaries and PDF pages', () => {
    expect(CAMBRIDGE5_M01_PAGE_ADDENDA).toHaveLength(4)
    expect(ALL_M01_PAGE_ADDENDA).toHaveLength(40)
    for (const item of CAMBRIDGE5_M01_PAGE_ADDENDA) {
      expect(item.topicId).toBe('M01.04')
      expect(M01_CONTENT['M01.04'].theory.some(block =>
        block.type === 'heading' && block.content === item.beforeHeading,
      ), item.beforeHeading).toBe(true)
      expect(item.blocks.some(block => block.type === 'source' &&
        /Cambridge\+ 5-sinf, 2021, PDF \d+/.test(block.content))).toBe(true)
    }
  })

  it('keeps four distinct pedagogical checks and original source traces', () => {
    const sources = CAMBRIDGE5_M01_PAGE_ADDENDA.map(item =>
      item.blocks.find(block => block.type === 'source')!.content,
    )
    expect(sources[0]).toContain('PDF 93–100')
    expect(sources[1]).toContain('PDF 101–108')
    expect(sources[2]).toContain('PDF 109–125')
    expect(sources[3]).toContain('PDF 123–131')
    const search = CAMBRIDGE5_M01_PAGE_ADDENDA[0].blocks
    expect(search.find(block => block.type === 'table')?.rows).toHaveLength(4)
    expect(search.find(block => block.type === 'trap')?.content).toContain('Sponsored')
    expect(search.find(block => block.type === 'trap')?.content).toContain('Uniform Resource Locator')
    const email = CAMBRIDGE5_M01_PAGE_ADDENDA[2].blocks
    expect(email.find(block => block.type === 'table')?.rows).toHaveLength(7)
    expect(email.find(block => block.type === 'trap')?.content).toContain('provayder')
    const consent = CAMBRIDGE5_M01_PAGE_ADDENDA[3].blocks
    expect(consent.find(block => block.type === 'case')?.content).toContain('rozilik')
  })

  it('preserves every generated chapter question and every original theory block', () => {
    for (const [id, generated] of Object.entries(M01_CONTENT)) {
      const learner = getTopicContent(id)!
      const additions = ALL_M01_PAGE_ADDENDA.filter(item => item.topicId === id)
        .flatMap(item => item.blocks)
      expect(learner.theory.length).toBe(generated.theory.length + additions.length)
      expect(learner.theory.filter(b => !additions.includes(b))).toEqual(generated.theory)
      expect(learner.questions).toBe(generated.questions)
    }
  })
})
