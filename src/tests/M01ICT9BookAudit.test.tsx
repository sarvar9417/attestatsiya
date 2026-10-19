import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M01_CONTENT } from '../data/topics/m01'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { ICT9_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT9'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-244 — ICT 9-sinf 2020 textbook M01 source audit', () => {
  it('traces the three ICT9 inserts to source pages and real topic anchors', () => {
    expect(ICT9_M01_PAGE_ADDENDA).toHaveLength(3)
    expect(ALL_M01_PAGE_ADDENDA.length).toBeGreaterThanOrEqual(24)
    expect(ICT9_M01_PAGE_ADDENDA.map(item => item.topicId))
      .toEqual(['M01.02', 'M01.07', 'M01.06'])
    for (const item of ICT9_M01_PAGE_ADDENDA) {
      expect(M01_CONTENT[item.topicId].theory.some(block =>
        block.type === 'heading' && block.content === item.beforeHeading,
      ), item.beforeHeading).toBe(true)
      expect(item.blocks.some(block => block.type === 'source' &&
        /ICT 9-sinf \(2020\), PDF \d+/.test(block.content))).toBe(true)
    }
  })

  it('solves the 46 × 40 × 67 one-byte textbook transfer exercise with explicit assumptions', () => {
    const n = 46 * 40 * 67
    expect(n).toBe(123280)
    expect(n / (1024 * 1024)).toBeCloseTo(0.1175689697)
    expect(n).toBeLessThan(51 * 1000 * 1000)
    const entry = ICT9_M01_PAGE_ADDENDA.find(item => item.topicId === 'M01.07')!
    const worked = entry.blocks.find(block => block.type === 'solved')!
    expect(worked.children?.filter(block => block.type === 'keyformula')).toHaveLength(2)
    const text = (worked.children ?? []).map(block => block.content).join(' ')
    expect(text).toContain('123280')
    expect(text).toContain('0.118')
    expect(text).toContain('pochta xizmati')
    expect(text).toContain('51 MB')
    expect(entry.blocks.find(block => block.type === 'source')!.content).toContain('PDF 19–20')
  })

  it('codes four colours using two bits per pixel, not four bits', () => {
    const bits = 2048 * 1366 * 2
    expect(bits).toBe(5595136)
    expect(bits / 8).toBe(699392)
    expect(bits / 8 / 1024).toBe(683)
    const entry = ICT9_M01_PAGE_ADDENDA.find(item => item.topicId === 'M01.06')!
    const card = entry.blocks.find(block => block.type === 'solved')!
    const text = (card.children ?? []).map(block => block.content).join(' ')
    expect(text).toContain('2048')
    expect(text).toContain('1366')
    expect(text).toContain('683')
    expect(text).toContain('2 bit')
    expect(entry.blocks.find(block => block.type === 'source')?.content).toContain('PDF 27')
  })

  it('keeps the original generated text and existing four textbook inserts in the reader', () => {
    for (const [id, original] of Object.entries(M01_CONTENT)) {
      const page = getTopicContent(id)!
      const injected = ALL_M01_PAGE_ADDENDA.filter(item => item.topicId === id)
        .flatMap(item => item.blocks)
      expect(page.theory.length).toBe(original.theory.length + injected.length)
      expect(page.theory.filter(block => !injected.includes(block))).toEqual(original.theory)
      expect(page.questions).toBe(original.questions)
      expect(splitSections(page.theory).flatMap(section => section.blocks)).toEqual(page.theory)
    }
    expect(getTopicContent('M01.11')!.theory).toEqual(M01_CONTENT['M01.11'].theory)
  })

  it('uses textbook-derived vocabulary but avoids importing the unrelated M04/M06/M08 syllabus', () => {
    const blocks = ICT9_M01_PAGE_ADDENDA.flatMap(item => item.blocks)
    const all = blocks.map(block => block.content).join(' ')
    expect(all).toContain('Axborot modeli')
    expect(all).toContain('Obyekt')
    expect(all).not.toContain('Python sintaksisi')
    expect(all).not.toContain('Rostlik jadvalini tuzish algoritmi')
    expect(all).not.toContain('while operatori')
  })
})
