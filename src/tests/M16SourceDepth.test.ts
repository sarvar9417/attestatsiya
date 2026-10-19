import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M16_SOURCE_THEORY_ADDITIONS } from '../data/topics/m16SourceTheoryAdditions'
import { overlayPublishedProfessionalLesson } from '../features/content/professionalLessonTheory'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'
import type { LessonSummary } from '../features/content/contentApi'

const codes = ['M16.01', 'M16.02', 'M16.03']

describe('TASK-273 source-grounded informatics teaching methodology', () => {
  for (const id of codes) {
    it(`${id} has source trace, examples and enough blocks in the offline book`, () => {
      const topic = getTopicContent(id)
      const extras = M16_SOURCE_THEORY_ADDITIONS[id]
      expect(topic).toBeDefined()
      expect(extras?.length).toBeGreaterThanOrEqual(8)
      expect(extras.some(x => x.type === 'table')).toBe(true)
      expect(extras.some(x => x.type === 'example')).toBe(true)
      expect(extras.some(x => x.type === 'source')).toBe(true)
      expect(topic?.theory.slice(-extras.length)).toEqual(extras)
      expect(topic?.questions).toEqual([])
      expect(splitAdaptiveSections(topic!.theory).flatMap(x => x.blocks)).toEqual(topic!.theory)
      expect(topic?.theory.map(x => x.content).join('\n')).not.toMatch(/70\s*%/)
    })
    it(`${id} keeps published theory first and source additions once`, () => {
      const offline = getTopicContent(id)!
      const server: LessonSummary = {
        id: '11111111-1111-4111-8111-111111111111',
        module_id: '22222222-2222-4222-8222-222222222222',
        title_uz: 'Mavjud tasdiqlangan metodik dars',
        slug: 'published-methodology',
        body_mdx: [
          '## Tasdiqlangan asos',
          'Mavjud bazadagi asl matn.',
          '## Chuqurlashtirilgan nazariya — manba korpusi',
          'Shartli qo‘shimcha, asosiy matn emas.',
        ].join('\n\n'),
        status: 'published',
        constructs: [],
        blocks: null,
        blocks_kind: 'chapter',
        est_minutes: 20,
        order_idx: 1,
      }
      const output = overlayPublishedProfessionalLesson(offline, server)
      const addons = M16_SOURCE_THEORY_ADDITIONS[id]
      expect(output.theory.at(0)?.content).toBe('Tasdiqlangan asos')
      expect(output.theory.some(x => x.content === 'Mavjud bazadagi asl matn.')).toBe(true)
      expect(output.theory.slice(-addons.length)).toEqual(addons)
      expect(output.theory.filter(x => x.content === addons[0].content)).toHaveLength(1)
      expect(output.supplementalTheory?.some(x => x.content.includes('Shartli qo‘shimcha'))).toBe(true)
      expect(output.questions).toBe(offline.questions)
    })
  }

  it('the profession standard maps different tasks to distinct M16 chapters', () => {
    expect(M16_SOURCE_THEORY_ADDITIONS['M16.01'].some(x => x.content.includes('maqsad'))).toBe(true)
    expect(M16_SOURCE_THEORY_ADDITIONS['M16.02'].some(x => x.content.includes('amaliy'))).toBe(true)
    expect(M16_SOURCE_THEORY_ADDITIONS['M16.03'].some(x => x.content.includes('Qayta aloqa'))).toBe(true)
  })
})
