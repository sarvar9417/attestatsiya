import { describe, expect, it } from 'vitest'
import { sanoqSistemaGenerator } from '../lib/exam/generators'

describe('S3.NUM: independent arithmetic and base-notation QA', () => {
  it('checks all three constructs across 200 seeds each', () => {
    let sums = 0
    let sorted = 0
    for (let seed = 0; seed < 200; seed++) {
      for (const code of ['S3.NUM.01', 'S3.NUM.02', 'S3.NUM.03']) {
        const q = sanoqSistemaGenerator.generate(seed, code)
        if (q.key.kind === 'Y3') {
          sorted++
          const lookup = new Map(q.options.map(o => [o.id, o.content]))
          const values = q.key.order.map(id => {
            const text = lookup.get(id) ?? ''
            const m = /^([0-9A-F]+)₍(2|8|16)₎$/.exec(text)
            expect(m, code + ':' + seed).not.toBeNull()
            return Number.parseInt(m![1], Number(m![2]))
          })
          expect(values).toEqual([...values].sort((a, b) => a - b))
          expect(new Set(values).size).toBe(values.length)
          continue
        }
        expect(q.key.kind).toBe('Y1')
        if (q.key.kind !== 'Y1') continue
        const key = q.key
        const option = q.options.find(o => o.id === key.optionId)?.content
        expect(new Set(q.options.map(o => o.content)).size).toBe(4)
        let expected = ''
        if (code === 'S3.NUM.01') {
          const digits = /^([0-9A-F]+) yozuvi/.exec(q.stem)?.[1] ?? ''
          expected = String(Math.max(2, ...[...digits].map(ch => Number.parseInt(ch, 16) + 1)))
        } else if (code === 'S3.NUM.02') {
          const m = /^(\d+)₁₀ sonini (2|8|16) lik/.exec(q.stem)
          expect(m).not.toBeNull()
          expected = Number(m![1]).toString(Number(m![2])).toUpperCase()
        } else {
          sums++
          const m = /^([0-9A-F]+)₍(2|8)₎ \+ ([0-9A-F]+)₍(2|8)₎/.exec(q.stem)
          expect(m).not.toBeNull()
          expect(m![2]).toBe(m![4])
          const base = Number(m![2])
          expected = (Number.parseInt(m![1], base) + Number.parseInt(m![3], base)).toString(base).toUpperCase()
        }
        expect(option, code + ':' + seed).toBe(expected)
      }
    }
    expect(sums).toBeGreaterThan(0)
    expect(sorted).toBeGreaterThan(0)
  })
})
