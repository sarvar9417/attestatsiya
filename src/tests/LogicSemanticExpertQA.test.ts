import { describe, expect, it } from 'vitest'
import { mantiqAmalGenerator } from '../lib/exam/generators'

// Independent parser: never call the generator's private expression evaluator.
function evalExpr(text: string, vars: Record<string, boolean>): boolean {
  const tokens = text.match(/AND|OR|XOR|¬|\(|\)|[A-Z]/g) ?? []
  expect(tokens.join('')).toBe(text.replace(/\s/g, ''))
  let i = 0
  function atom(): boolean {
    const token = tokens[i++]
    if (token === '¬') return !atom()
    if (token === '(') {
      const result = expr()
      if (tokens[i++] !== ')') throw Error('unclosed_parenthesis')
      return result
    }
    if (!(token in vars)) throw Error('unknown_variable:' + token)
    return vars[token]
  }
  function expr(): boolean {
    let left = atom()
    while (['AND', 'OR', 'XOR'].includes(tokens[i] ?? '')) {
      const op = tokens[i++]
      const right = atom()
      left = op === 'AND' ? left && right : op === 'OR' ? left || right : left !== right
    }
    return left
  }
  const result = expr()
  expect(i).toBe(tokens.length)
  return result
}

describe('S3.LOGIC independent truth-table expert QA', () => {
  it('recalculates 400 generated logic keys by boolean evaluation', () => {
    for (let seed = 0; seed < 200; seed++) {
      for (const construct of ['S3.LOGIC.02', 'S3.LOGIC.04']) {
        const q = mantiqAmalGenerator.generate(seed, construct)
        expect(q.key.kind).toBe('Y1')
        if (q.key.kind !== 'Y1') continue
        const key = q.key
        const answer = q.options.find(o => o.id === key.optionId)?.content
        expect(new Set(q.options.map(o => o.content)).size).toBe(4)

        if (construct === 'S3.LOGIC.02') {
          const m = /^([A-Z]) = (rost|yolg‘on), ([A-Z]) = (rost|yolg‘on), ([A-Z]) = (rost|yolg‘on) bo‘lsa, (.+) qiymatini toping\.$/.exec(q.stem)
          expect(m, 'seed ' + seed).not.toBeNull()
          const vars = { [m![1]]: m![2] === 'rost', [m![3]]: m![4] === 'rost', [m![5]]: m![6] === 'rost' }
          expect(answer).toBe(evalExpr(m![7], vars) ? 'rost' : 'yolg‘on')
        } else {
          const m = /^(.+) ifodasi uchun 3 o‘zgaruvchili rostlik jadvalida/.exec(q.stem)
          expect(m, 'seed ' + seed).not.toBeNull()
          const symbols = [...new Set(m![1].match(/\b[A-Z]\b/g) ?? [])]
          expect(symbols).toHaveLength(3)
          let trueRows = 0
          for (let mask = 0; mask < 8; mask++) {
            const vars: Record<string, boolean> = {}
            for (let bit = 0; bit < 3; bit++) vars[symbols[bit]] = Boolean(mask & (1 << bit))
            if (evalExpr(m![1], vars)) trueRows++
          }
          expect(answer, 'seed ' + seed).toBe(trueRows + ' ta')
        }
      }
    }
  })
})
