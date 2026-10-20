import { describe, expect, it } from 'vitest'
import items from '../content/tarmoq/Kompyuter_tarmoqlari_300_savol_V2.json'

type V2Item = {
  id: string; ch: number; kind: string; level: string
  q: string; options: string[]; ans: string; correct: string
  why: string; construct: string; source_detail: string
}
const bank = items as V2Item[]
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim().toLocaleLowerCase('uz-UZ')

describe('TASK-220 M12 V2 source question bank invariants', () => {
  it('has exactly 10 chapters, 30 questions each, with unique stable IDs and prompts', () => {
    expect(bank).toHaveLength(300)
    expect(new Set(bank.map(item => item.id)).size).toBe(300)
    expect(new Set(bank.map(item => normalize(item.q))).size).toBe(300)
    for (let chapter = 1; chapter <= 10; chapter++) {
      const questions = bank.filter(item => item.ch === chapter)
      expect(questions, `chapter ${chapter}`).toHaveLength(30)
      for (const [i, item] of questions.entries()) {
        expect(item.id).toBe(`TAR-${String(chapter).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`)
      }
    }
  })

  it('preserves 280 choice, 10 matching and 10 ordering source tasks', () => {
    for (const [kind, count] of [['Y1', 280], ['Y2', 10], ['Y3', 10]] as const) {
      expect(bank.filter(item => item.kind === kind)).toHaveLength(count)
    }
  })

  it('rejects repeated options, missing source/solution and mismatched letter keys', () => {
    for (const item of bank) {
      expect(item.options, item.id).toHaveLength(4)
      expect(new Set(item.options.map(normalize)).size, item.id).toBe(4)
      expect(['A', 'B', 'C', 'D'], item.id).toContain(item.correct)
      expect(item.options['ABCD'.indexOf(item.correct)], item.id).toBe(item.ans)
      expect(item.source_detail.trim().length, item.id).toBeGreaterThan(5)
      expect(item.why.trim().length, item.id).toBeGreaterThan(10)
      expect(['S6.1', 'S6.2', 'S6.3', 'S6.4', 'S6.5', 'S6.6']).toContain(item.construct)
      expect(['A', 'B', 'C', 'D', 'E']).toContain(item.level)
    }
  })
})
