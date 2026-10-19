import { describe, it, expect } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { CAMBRIDGE7_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditCambridge7'

describe('TASK-244 Cambridge+ 7-sinf source audit', () => {
  it('places three page-cited additions into canonical M01 sections', () => {
    expect(CAMBRIDGE7_M01_PAGE_ADDENDA).toHaveLength(3)
    expect(ALL_M01_PAGE_ADDENDA.length).toBeGreaterThanOrEqual(43)
    for (const item of CAMBRIDGE7_M01_PAGE_ADDENDA) {
      expect(item.topicId).toBe('M01.04')
      expect(M01_CONTENT['M01.04'].theory.some(block =>
        block.type === 'heading' && block.content === item.beforeHeading,
      ), item.beforeHeading).toBe(true)
      expect(item.blocks.find(block => block.type === 'source')?.content)
        .toContain('Cambridge+ 7-sinf, 2021, PDF ')
    }
  })

  it('distinguishes content design, copyright and field-level read permission', () => {
    expect(CAMBRIDGE7_M01_PAGE_ADDENDA[0].blocks
      .find(block => block.type === 'table')?.rows).toHaveLength(4)
    expect(CAMBRIDGE7_M01_PAGE_ADDENDA[1].blocks
      .find(block => block.type === 'trap')?.content).toContain('foydalanish huquqi')
    const permissions = CAMBRIDGE7_M01_PAGE_ADDENDA[2].blocks
    expect(permissions.find(block => block.type === 'table')?.rows?.map(row => row[0]))
      .toEqual(['Faqat o‘qish (Read only)', 'O‘qish va yozish (Read/write)', 'Ko‘rish qamrovi (View scope)'])
    expect(permissions.find(block => block.type === 'source')?.content).toContain('PDF 117–118')
  })

  it('preserves all original generated blocks and question banks', () => {
    for (const [id, original] of Object.entries(M01_CONTENT)) {
      const view = getTopicContent(id)!
      const patches = ALL_M01_PAGE_ADDENDA.filter(x => x.topicId === id).flatMap(x => x.blocks)
      expect(view.theory.length).toBe(original.theory.length + patches.length)
      expect(view.theory.filter(b => !patches.includes(b))).toEqual(original.theory)
      expect(view.questions).toBe(original.questions)
    }
  })
})
