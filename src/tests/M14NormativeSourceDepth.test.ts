import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M14_NORMATIVE_SOURCE_ADDITIONS } from '../data/topics/m14NormativeSourceAdditions'
import { overlayPublishedProfessionalLesson } from '../features/content/professionalLessonTheory'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'
import type { LessonSummary } from '../features/content/contentApi'

const all = Array.from({ length: 7 }, (_, i) => `M14.${String(i + 1).padStart(2, '0')}`)

describe('TASK-273: 7 teacher professional standard labor functions retain source content', () => {
  for (const id of all) {
    it(`${id} has a source trace and educationally meaningful blocks`, () => {
      const local = getTopicContent(id)
      const addition = M14_NORMATIVE_SOURCE_ADDITIONS[id]
      expect(local, id).toBeDefined()
      expect(addition.length, id).toBeGreaterThanOrEqual(5)
      expect(addition.some(block => block.type === 'heading'), id).toBe(true)
      expect(addition.some(block => block.type === 'example'), id).toBe(true)
      expect(addition.some(block => block.type === 'source'), id).toBe(true)
      expect(addition.at(-1)?.content).toContain('Kasb-standarti.pdf')
      expect(local!.theory.slice(-addition.length)).toEqual(addition)
      expect(local!.questions).toEqual([])
      expect(splitAdaptiveSections(local!.theory).flatMap(section => section.blocks)).toEqual(local!.theory)
    })

    it(`${id} preserves canonical DB core and adds normative explanation once`, () => {
      const base = getTopicContent(id)!
      const lesson: LessonSummary = {
        id: '33333333-3333-4333-8333-333333333333',
        module_id: '44444444-4444-4444-8444-444444444444',
        title_uz: 'Kanonik kasb standarti',
        slug: 'kanonik',
        body_mdx: '## Maqsad\n\nAsosiy tasdiqlangan matn.',
        status: 'published',
        constructs: [],
        blocks: null,
        blocks_kind: 'chapter',
        est_minutes: 20,
        order_idx: 1,
      }
      const output = overlayPublishedProfessionalLesson(base, lesson)
      const additions = M14_NORMATIVE_SOURCE_ADDITIONS[id]
      expect(output.theory.at(0)?.content).toBe('Maqsad')
      expect(output.theory.slice(-additions.length)).toEqual(additions)
      expect(output.theory.filter(block => block.content === additions[0].content)).toHaveLength(1)
      expect(output.questions).toBe(base.questions)
    })
  }

  it('does not invert the professional standard 5th and 6th labor functions', () => {
    const m1405 = M14_NORMATIVE_SOURCE_ADDITIONS['M14.05'].map(x => x.content).join('\n')
    const m1406 = M14_NORMATIVE_SOURCE_ADDITIONS['M14.06'].map(x => x.content).join('\n')
    expect(m1405).toContain('A/05.6')
    expect(m1405).toContain('xavfsiz')
    expect(m1406).toContain('B/01.6')
    expect(m1406).toContain('kasbiy')
    expect(m1405).not.toContain('6-vazifa — **xavfsiz')
  })
})
