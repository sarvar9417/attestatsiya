import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M09_DATABASE_TEXTBOOK_ADDITIONS } from '../data/topics/m09DatabaseTextbookAdditions'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'

describe('TASK-273: database lesson textbook depth', () => {
  for (let i = 1; i <= 7; i++) {
    const id = `M09.${String(i).padStart(2, '0')}`
    it(`${id}: preserves original theory and adds independently traced concepts`, () => {
      const topic = getTopicContent(id)
      const addition = M09_DATABASE_TEXTBOOK_ADDITIONS[id]
      expect(topic, id).toBeDefined()
      expect(addition.length).toBeGreaterThanOrEqual(5)
      expect(addition.some(block => block.type === 'table')).toBe(true)
      expect(addition.some(block => block.type === 'example')).toBe(true)
      expect(addition.at(-1)?.type).toBe('source')
      expect(addition.at(-1)?.content).toContain('drive.google.com')
      expect(topic!.theory.slice(-addition.length)).toEqual(addition)
      expect(splitAdaptiveSections(topic!.theory).flatMap(x => x.blocks))
        .toEqual(topic!.theory)
    })
  }

  it('guards foreign key identity and SQL data-manipulation boundaries', () => {
    const keys = M09_DATABASE_TEXTBOOK_ADDITIONS['M09.03'].map(x => x.content).join('\n')
    const sql = M09_DATABASE_TEXTBOOK_ADDITIONS['M09.06'].map(x => x.content).join('\n')
    expect(keys).toContain('Birlamchi kalit')
    expect(keys).toContain('Tashqi kalit')
    expect(sql).toContain('SELECT')
    expect(sql).toContain('UPDATE')
    expect(sql).toContain('DELETE')
    expect(sql).toContain('WHERE')
  })
})
