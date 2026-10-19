import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M01_CONTENT } from '../data/topics/m01'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { ICT10_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT10'

describe('TASK-244 — 10-sinf ICT 2021, 257-page textbook module-fidelity audit', () => {
  it('tracks three source-backed M01 addenda without republishing unrelated modules', () => {
    expect(ICT10_M01_PAGE_ADDENDA).toHaveLength(3)
    expect(ALL_M01_PAGE_ADDENDA).toHaveLength(36)
    expect(ICT10_M01_PAGE_ADDENDA.map(x => x.topicId)).toEqual(['M01.06', 'M01.06', 'M01.04'])
    for (const x of ICT10_M01_PAGE_ADDENDA) {
      expect(M01_CONTENT[x.topicId].theory.some(block =>
        block.type === 'heading' && block.content === x.beforeHeading,
      )).toBe(true)
      expect(x.blocks.some(block => block.type === 'source' &&
        /ICT 10-sinf \(2021\), PDF \d+/.test(block.content))).toBe(true)
    }
  })

  it('distinguishes the four codec/format/archive concepts in a real learner table', () => {
    const table = ICT10_M01_PAGE_ADDENDA[0].blocks.find(x => x.type === 'table')!
    expect(table.rows?.map(row => row[0])).toEqual([
      'Arxivator', 'Kodek', 'Konteyner formati', 'Konvertor',
    ])
    expect(table.headers).toHaveLength(3)
    expect(table.rows?.every(row => row.length === 3)).toBe(true)
    expect(table.rows?.find(row => row[0] === 'Konteyner formati')?.[2]).toContain('AVI')
    expect(ICT10_M01_PAGE_ADDENDA[0].blocks.some(x => x.type === 'trap' &&
      x.content.includes('Fayl kengaytmasini qayta nomlash'))).toBe(true)
  })

  it('explains that FLAC cannot restore quality already lost in MP3', () => {
    const statement = ICT10_M01_PAGE_ADDENDA[1].blocks
      .find(x => x.type === 'case')!.content
    expect(statement).toContain('MP3')
    expect(statement).toContain('FLAC')
    expect(statement).toContain('qayta yaratmaydi')
    expect(ICT10_M01_PAGE_ADDENDA[1].blocks.find(x => x.type === 'source')!.content)
      .toContain('PDF 34')
  })

  it('puts accessibility before the next M01.04 section heading', () => {
    const text = getTopicContent('M01.04')!.theory
    const accessibility = text.findIndex(block =>
      block.type === 'subheading' && block.content.includes('10-sinf: raqamli matnda'),
    )
    const errors = text.findIndex(block => block.type === 'heading' &&
      block.content === 'Xatolarni aniqlashning chuqurlashtirilgan usullari',
    )
    expect(accessibility).toBeGreaterThan(0)
    expect(accessibility).toBeLessThan(errors)
    expect(ICT10_M01_PAGE_ADDENDA[2].blocks.find(x => x.type === 'source')?.content)
      .toContain('PDF 204')
  })

  it('keeps the original handbook blocks in the original order for each lesson', () => {
    for (const [id, base] of Object.entries(M01_CONTENT)) {
      const current = getTopicContent(id)!
      const added = ALL_M01_PAGE_ADDENDA.filter(x => x.topicId === id).flatMap(x => x.blocks)
      expect(current.theory.length).toBe(base.theory.length + added.length)
      expect(current.theory.filter(block => !added.includes(block))).toEqual(base.theory)
      expect(current.questions).toBe(base.questions)
    }
  })
})
