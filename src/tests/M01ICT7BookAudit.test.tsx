import { describe, expect, it } from 'vitest'
import { M01_CONTENT } from '../data/topics/m01'
import { getTopicContent } from '../data/topicContent'
import { ALL_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAudit'
import { ICT7_M01_PAGE_ADDENDA } from '../data/topics/m01TextbookAuditICT7'

describe('TASK-244 — ICT 7-sinf 2021, PDF sahifali M01 manba tekshiruvi', () => {
  it('reconciles every ICT7 insert against a real M01 heading and a page trace', () => {
    expect(ICT7_M01_PAGE_ADDENDA).toHaveLength(7)
    expect(ALL_M01_PAGE_ADDENDA).toHaveLength(17)
    expect(ICT7_M01_PAGE_ADDENDA.map(item => item.topicId))
      .toEqual(['M01.03', 'M01.05', 'M01.05', 'M01.06', 'M01.06', 'M01.06', 'M01.06'])

    for (const item of ICT7_M01_PAGE_ADDENDA) {
      const headingExists = M01_CONTENT[item.topicId].theory.some(
        block => block.type === 'heading' && block.content === item.beforeHeading,
      )
      expect(headingExists, item.beforeHeading).toBe(true)
      expect(item.blocks.some(block =>
        block.type === 'source' && /ICT 7-sinf \(2021\), PDF \d+/.test(block.content),
      )).toBe(true)
    }
  })

  it('calculates both textbook media exercises independently and documents the printed erratum', () => {
    expect(48000 * 16 * (3 * 60)).toBe(138240000)
    expect(138240000 / 8).toBe(17280000)
    expect(768 * 484 * 10 * 30 * 120).toBe(13381632000)
    expect(13381632000 / 8).toBe(1672704000)

    const audio = ICT7_M01_PAGE_ADDENDA.find(item =>
      item.beforeHeading === 'Video va multimedia: kadr, FPS, bitrate va hajm')!
    const worked = audio.blocks.find(block => block.type === 'solved')!
    expect(worked.children?.filter(block => block.type === 'keyformula')).toHaveLength(2)
    expect(worked.children?.some(block => block.content.includes('17 280 000 bayt'))).toBe(true)
    expect(worked.children?.some(block => block.content.includes('1,64 Mb'))).toBe(true)
    expect(audio.blocks.some(block =>
      block.type === 'source' && block.content.includes('PDF 34–39'))).toBe(true)
  })

  it('keeps all 12 generated lessons and the original block order after 3 textbooks', () => {
    for (const [id, original] of Object.entries(M01_CONTENT)) {
      const learner = getTopicContent(id)!
      const newlyInserted = ALL_M01_PAGE_ADDENDA.filter(item => item.topicId === id)
        .flatMap(item => item.blocks)
      expect(learner.theory.length).toBe(original.theory.length + newlyInserted.length)
      expect(learner.theory.filter(block => !newlyInserted.includes(block))).toEqual(original.theory)
      expect(learner.questions).toBe(original.questions)
    }
  })

  it('places graphics in graphics section and audio in audio section, not the previous topic', () => {
    const theory = getTopicContent('M01.06')!.theory
    const sectionFor = (heading: string) => {
      const begin = theory.findIndex(block => block.type === 'heading' && block.content === heading)
      const next = theory.findIndex((block, i) => i > begin && block.type === 'heading')
      return theory.slice(begin, next < 0 ? undefined : next)
    }
    const graphics = sectionFor('Grafik axborot: rastr, vektor, rang va hajm')
    const audio = sectionFor('Audioaxborot: namunalash, bit chuqurligi va hajm')
    const video = sectionFor('Video va multimedia: kadr, FPS, bitrate va hajm')
    expect(graphics.some(block => block.content.includes('7-sinf: bir bitli rastr'))).toBe(true)
    expect(audio.some(block => block.content.includes('7-sinf kitobida hisob'))).toBe(true)
    expect(video.some(block => block.content.includes('7-sinf: animatsiya'))).toBe(true)
  })

  it('documents Unicode limits and textbook unit conventions rather than treating them as universal', () => {
    const text = ICT7_M01_PAGE_ADDENDA.flatMap(item => item.blocks)
      .map(block => [block.content, ...(block.children ?? []).map(child => child.content)].join(' '))
      .join('\n')
    expect(text).toContain('1 830 600 bayt')
    expect(text).toContain('16 777 216')
    expect(text).toContain('64 bit = 8 bayt')
    expect(text).toContain('kB')
    expect(text).toContain('KiB')
    expect(text).toContain('UTF-16')
    expect(text).not.toContain('1 Kb = 1024 bayt = 1 kb')
  })
})
