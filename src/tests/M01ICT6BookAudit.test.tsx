import { describe, expect, it } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { ICT6_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT6'

describe('TASK-244 — 2021 ICT grade-six page-by-page source audit', () => {
  it('tracks all four ICT6 additions, independently from the first book', () => {
    expect(ICT6_M01_PAGE_ADDENDA).toHaveLength(4)
    expect(ICT6_M01_PAGE_ADDENDA.map(x => x.topicId))
      .toEqual(['M01.04', 'M01.04', 'M01.04', 'M01.06'])
    expect(ALL_M01_PAGE_ADDENDA).toHaveLength(32)
    for (const insertion of ICT6_M01_PAGE_ADDENDA) {
      expect(M01_CONTENT[insertion.topicId].theory.some(block =>
        block.type === 'heading' && block.content === insertion.beforeHeading,
      )).toBe(true)
      expect(insertion.blocks.some(block =>
        block.type === 'source' && /ICT 6-sinf \(2021\), PDF \d+/.test(block.content),
      )).toBe(true)
    }
  })

  it('contains the exact six Creative Commons source-license combinations', () => {
    const contribution = ICT6_M01_PAGE_ADDENDA
      .find(insertion => insertion.beforeHeading === 'Raqamli xavfsizlikning kundalik minimumi')!
    const table = contribution.blocks.find(block => block.type === 'table')!
    expect(table.rows?.map(row => row[0])).toEqual([
      'CC BY', 'CC BY-SA', 'CC BY-ND', 'CC BY-NC', 'CC BY-NC-SA', 'CC BY-NC-ND',
    ])
    expect(table.rows).toHaveLength(6)
    expect(table.rows?.find(row => row[0] === 'CC BY-ND')?.[2]).toContain('mumkin emas')
    expect(contribution.blocks.some(block => block.type === 'trap' &&
      block.content.includes('Manbani ko‘rsatishning o‘zi'))).toBe(true)
  })

  it('distinguishes device account sign-out from deleting browser history', () => {
    const risk = ICT6_M01_PAGE_ADDENDA.find(insertion =>
      insertion.topicId === 'M01.04' &&
      insertion.blocks.some(block => block.content.includes('grooming')),
    )
    expect(risk?.blocks.some(block => block.content.includes('Sign out / Chiqish'))).toBe(true)
    expect(risk?.blocks.some(block => block.content.includes('kiberbulling'))).toBe(true)
    expect(getTopicContent('M01.04')!.theory.some(block =>
      block.content.includes('Umumiy kompyuterda faqat brauzer tarixini'))).toBe(true)
  })

  it('preserves source pages, concept-specific warnings and the entire M01 baseline', () => {
    const sourcePages = ICT6_M01_PAGE_ADDENDA.flatMap(x =>
      x.blocks.filter(block => block.type === 'source').map(block => block.content),
    )
    expect(sourcePages).toHaveLength(4)
    expect(sourcePages.join(' ')).toContain('PDF 82–87')
    expect(sourcePages.join(' ')).toContain('PDF 103–106')
    expect(sourcePages.join(' ')).toContain('PDF 107–113')
    expect(sourcePages.join(' ')).toContain('PDF 114–126')
    const media = getTopicContent('M01.06')!.theory
    expect(media.some(block => block.content.includes('320 kbps'))).toBe(true)
    const appended = ALL_M01_PAGE_ADDENDA.filter(x => x.topicId === 'M01.06')
      .flatMap(x => x.blocks)
    expect(media.filter(block => !appended.includes(block))).toEqual(M01_CONTENT['M01.06'].theory)
  })
})
