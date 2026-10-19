import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

describe('TASK-274: source-correct M08 JavaScript static lessons', () => {
  const syntax = getTopicContent('M08.04')
  const control = getTopicContent('M08.05')

  it('routes canonical M08.04 to JavaScript rather than stale Python-error fallback', () => {
    expect(syntax).toBeDefined()
    expect(syntax?.title).toContain('JavaScript')
    const theory = syntax?.theory.map(block => block.content).join(' ') ?? ''
    for (const concept of ['console.log', 'document.write', '===', '11 % 5', '307–311']) {
      expect(theory).toContain(concept)
    }
    expect(theory).not.toContain('SyntaxError (sintaksis xatosi)')
  })

  it('routes M08.05 to JavaScript flow, arrays and functions, not Python elif', () => {
    expect(control?.title).toContain('JavaScript')
    const theory = control?.theory.map(block => block.content).join(' ') ?? ''
    for (const concept of ['for', 'while', 'push', 'function', '311–315']) {
      expect(theory).toContain(concept)
    }
    expect(theory).not.toContain('Python’da if, elif')
  })

  it('uses distinct new quiz IDs instead of reinterpreting historical Python progress', () => {
    for (const [lesson, prefix, keys] of [
      [syntax, 'M08.04-js2021-q', [1, 2, 0, 3, 1]],
      [control, 'M08.05-js2021-q', [1, 2, 3, 0, 2]],
    ] as const) {
      expect(lesson?.questions).toHaveLength(5)
      expect(lesson?.questions.map(q => q.id)).toEqual(
        [1, 2, 3, 4, 5].map(n => prefix + n),
      )
      expect(lesson?.questions.map(q => q.correctIndex)).toEqual(keys)
      for (const q of lesson?.questions ?? []) {
        expect(q.type).toBe('Y1')
        expect(q.options).toHaveLength(4)
        expect(new Set(q.options.map(option => option.trim())).size).toBe(4)
        expect(q.options.every(option => option.trim().length >= 1)).toBe(true)
        expect(q.options[q.correctIndex]).toBeTruthy()
      }
    }
  })

  it('checks JavaScript outcomes independently, including three textbook errata', () => {
    const numberFive: unknown = 5
    const stringFive: unknown = '5'
    expect(numberFive === stringFive).toBe(false)
    expect(11 % 5).toBe(1)
    expect('Hello World'.substring(7, 11)).toBe('orld')
    expect('Hello World'.substr(2, 4)).toBe('llo ')
    let total = 0
    for (let index = 0; index < 3; index++) total += index
    expect(total).toBe(3)
    const colours = ['orange', 'purple', 'green']
    expect(colours[1]).toBe('purple')
    colours.push('blue')
    expect(colours.length).toBe(4)
    const addNums = (a: number, b: number) => a + b
    expect(addNums(2, 3)).toBe(5)
  })
})
