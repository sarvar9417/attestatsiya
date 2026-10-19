import { describe, expect, it } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { ICT8_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT8'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-244 — ICT 8-sinf 2020, social-media source fidelity', () => {
  it('places four page-traced digital literacy supplements in the correct learner topic', () => {
    expect(ICT8_M01_PAGE_ADDENDA).toHaveLength(4)
    expect(ALL_M01_PAGE_ADDENDA).toHaveLength(24)
    for (const item of ICT8_M01_PAGE_ADDENDA) {
      expect(item.topicId).toBe('M01.04')
      expect(M01_CONTENT['M01.04'].theory.some(block =>
        block.type === 'heading' && block.content === item.beforeHeading,
      )).toBe(true)
      expect(item.blocks.some(block => block.type === 'source' &&
        /ICT 8-sinf \(2020\), PDF \d+/.test(block.content))).toBe(true)
    }
  })

  it('does not substitute product clicks or dated platform rankings for construct knowledge', () => {
    const text = ICT8_M01_PAGE_ADDENDA.flatMap(item => item.blocks)
      .map(block => block.content).join('\n')
    expect(text).toContain('ijtimoiy media')
    expect(text).toContain('maqsad')
    expect(text).toContain('platforma')
    expect(text).toContain('CMS')
    expect(text).toContain('MOOC')
    expect(text).toContain('LMS')
    expect(text).toContain('maxfiy')
    expect(text).toContain('2020-yil')
    expect(text).not.toContain('80%+ qurilmalar')
  })

  it('distinguishes CMS, LMS and MOOC and preserves their actual textbook page ranges', () => {
    const entry = ICT8_M01_PAGE_ADDENDA.find(item =>
      item.blocks.some(block => block.content.includes('CMS, LMS va MOOC tushunchalarining')),
    )!
    const table = entry.blocks.find(block => block.type === 'table')!
    expect(table.rows?.map(row => row[0])).toEqual(['CMS', 'LMS', 'MOOC'])
    expect(table.rows?.every(row => row.length === table.headers?.length)).toBe(true)
    const source = entry.blocks.find(block => block.type === 'source')!
    expect(source.content).toContain('PDF 37–59')
    expect(source.content).toContain('60–76')
    expect(source.content).toContain('77–93')
  })

  it('does not discard any old handbook sections or add stale content to unrelated M01 topics', () => {
    const original = M01_CONTENT['M01.04'].theory
    const expanded = getTopicContent('M01.04')!.theory
    const added = ALL_M01_PAGE_ADDENDA.filter(item => item.topicId === 'M01.04')
      .flatMap(item => item.blocks)
    expect(expanded.length).toBe(original.length + added.length)
    expect(expanded.filter(block => !added.includes(block))).toEqual(original)
    expect(splitSections(expanded).flatMap(section => section.blocks)).toEqual(expanded)
    expect(getTopicContent('M01.09')!.theory).toEqual(M01_CONTENT['M01.09'].theory)
  })
})
