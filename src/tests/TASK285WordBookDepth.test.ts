import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M03_01_LONGFORM } from '../data/topics/m03WordEditingLongform'
import { M03_02_LONGFORM } from '../data/topics/m03WordFormattingLongform'
import { M03_OFFICE_TEXTBOOK_ADDITIONS } from '../data/topics/m03OfficeTextbookAdditions'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-285: Word theories are real book chapters, not short notes', () => {
  for (const [id, authored] of [['M03.01', M03_01_LONGFORM], ['M03.02', M03_02_LONGFORM]] as const) {
    it(id + ' retains legacy tables/tests and adds natural textbook sections', () => {
      const topic = getTopicContent(id)!
      expect(authored.length).toBeGreaterThanOrEqual(30)
      expect(authored.filter(x => x.type === 'heading').length).toBeGreaterThanOrEqual(7)
      expect(authored.some(x => x.type === 'goal')).toBe(true)
      expect(authored.some(x => x.type === 'source')).toBe(true)
      expect(authored.some(x => x.type === 'answers')).toBe(true)
      expect(authored.filter(x => x.type === 'task').length).toBeGreaterThanOrEqual(3)
      expect(topic.source).toContain('Cambridge')
      expect(topic.theory.slice(0, authored.length)).toEqual(authored)
      const additions = M03_OFFICE_TEXTBOOK_ADDITIONS[id]
      expect(topic.theory.slice(-additions.length)).toEqual(additions)
      expect(splitSections(topic.theory).flatMap(x => x.blocks)).toEqual(topic.theory)
      expect(splitSections(topic.theory).length).toBeGreaterThan(8)
      expect(topic.questions.length).toBeGreaterThanOrEqual(4)
    })
  }

  it('keeps Word layout vs design distinction even with new earlier tables', () => {
    const topic = getTopicContent('M03.01')!
    const tables = topic.theory.filter(x => x.type === 'table').map(x => x.content).join('\n')
    expect(tables).toContain('Page Borders')
    expect(tables).toContain('Margins')
    expect(tables).toContain('References')
  })

  it('Word paragraph style book covers actual structural styles and margins', () => {
    const text = getTopicContent('M03.02')!.theory.map(x => x.content).join('\n')
    for (const word of ['Hanging', 'Heading 1', 'Format Painter', 'Ctrl+J', 'Update Table']) {
      expect(text).toContain(word)
    }
  })
})
