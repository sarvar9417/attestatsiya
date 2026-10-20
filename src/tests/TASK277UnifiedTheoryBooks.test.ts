import { describe, expect, it } from 'vitest'
import { splitBalancedSections } from '../components/learning/theory/BookReader'
import { withPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { TOPIC_CONTENT, type TheoryBlock } from '../data/topicContent'

const targetIds = ['M03.08', 'M03.09', 'M03.10', 'M15.07', 'M15.08'] as const
const chars = (blocks: TheoryBlock[]) => blocks.reduce((sum, block) => sum + block.content.length, 0)

describe('TASK-277 unified theory books', () => {
  it('promotes the remaining PowerPoint and general-pedagogy lessons to structured books', () => {
    for (const id of targetIds) {
      const source = TOPIC_CONTENT[id]
      expect(source, id).toBeDefined()
      const theory = id.startsWith('M15.') ? withPedagogyStudyNotes(source).theory : source.theory
      const types = theory.map(block => block.type)

      expect(theory.length, id).toBeGreaterThanOrEqual(38)
      expect(chars(theory), id).toBeGreaterThan(5_500)
      expect(types.filter(type => type === 'heading').length, id).toBeGreaterThanOrEqual(9)
      expect(types.filter(type => type === 'goal').length, id).toBe(1)
      expect(types.filter(type => type === 'task').length, id).toBeGreaterThanOrEqual(3)
      expect(types.filter(type => ['example', 'solved', 'case'].includes(type)).length, id)
        .toBeGreaterThanOrEqual(4)
      expect(types.at(-1), id).toBe('source')
    }
  })

  it('preserves the existing PowerPoint quiz identities and pedagogy server-only policy', () => {
    for (const id of ['M03.08', 'M03.09', 'M03.10'] as const) {
      expect(TOPIC_CONTENT[id].questions.map(question => question.id), id).toEqual([
        id + '-q1', id + '-q2', id + '-q3', id + '-q4',
      ])
      expect(TOPIC_CONTENT[id].questions).toHaveLength(4)
    }
    expect(TOPIC_CONTENT['M15.07'].questions).toEqual([])
    expect(TOPIC_CONTENT['M15.08'].questions).toEqual([])
  })

  it('paginates every offline theory with one lossless contract', () => {
    for (const [id, content] of Object.entries(TOPIC_CONTENT)) {
      const pages = splitBalancedSections(content.theory)
      expect(pages.flatMap(page => page.blocks), id).toEqual(content.theory)
      expect(pages.every(page => page.blocks.length <= 4), id).toBe(true)
      for (const page of pages.filter(page => page.continued)) {
        expect(page.title.length, id).toBeGreaterThan(0)
      }
    }
  })

  it('uses source-trace language without claiming complete physical-page verification', () => {
    for (const id of targetIds) {
      const sources = TOPIC_CONTENT[id].theory
        .filter(block => block.type === 'source')
        .map(block => block.content)
        .join(' ')
      expect(sources, id).toMatch(/Manba(?:lar| izi)?:/)
      expect(sources, id).not.toMatch(/to‘liq sahifama-sahifa tasdiqlandi/i)
    }
  })
})
