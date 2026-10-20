import { describe, expect, it } from 'vitest'
import additions from '../content/tarmoq/Kompyuter_tarmoqlari_Y2_Y3_qoshimcha_80_V3.json'
import original from '../content/tarmoq/Kompyuter_tarmoqlari_300_savol_V2.json'

type Item = {
  id: string
  ch: number
  fmt: 'Y2' | 'Y3'
  stem: string
  source: string
  exp: string
  a?: string[]
  b?: string[]
  pairs?: number[]
  items?: string[]
  order?: number[]
}
const bank = additions as Item[]
const normalized = (x: string) => x.trim().replace(/\s+/g, ' ').toLocaleLowerCase('uz-UZ')
const setEq = (numbers: number[], n: number) =>
  [...numbers].sort((a, b) => a - b).join(',') === Array.from({ length: n }, (_, i) => i).join(',')

describe('TASK-220 M12 native Y2/Y3 +80 source invariants', () => {
  it('adds exactly 40 matching and 40 ordering questions, 4 + 4 per chapter', () => {
    expect(bank).toHaveLength(80)
    expect(new Set(bank.map(x => x.id)).size).toBe(80)
    expect(new Set(bank.map(x => normalized(x.stem))).size).toBe(80)
    expect(bank.filter(x => x.fmt === 'Y2')).toHaveLength(40)
    expect(bank.filter(x => x.fmt === 'Y3')).toHaveLength(40)
    const oldStems = new Set(original.map(x => normalized(x.q)))
    for (const item of bank) expect(oldStems.has(normalized(item.stem)), item.id).toBe(false)
    for (let ch = 1; ch <= 10; ch++) {
      expect(bank.filter(x => x.ch === ch && x.fmt === 'Y2')).toHaveLength(4)
      expect(bank.filter(x => x.ch === ch && x.fmt === 'Y3')).toHaveLength(4)
    }
  })

  it('ensures matching maps each unique left item to exactly one unique right item', () => {
    for (const item of bank.filter(x => x.fmt === 'Y2')) {
      expect(item.a, item.id).toHaveLength(3)
      expect(item.b, item.id).toHaveLength(3)
      expect(item.pairs, item.id).toHaveLength(3)
      expect(new Set(item.a?.map(normalized)).size, item.id).toBe(3)
      expect(new Set(item.b?.map(normalized)).size, item.id).toBe(3)
      expect(setEq(item.pairs!, 3), item.id).toBe(true)
      expect(item.exp.length, item.id).toBeGreaterThan(15)
      expect(item.source.length, item.id).toBeGreaterThan(10)
    }
  })

  it('requires ordering to be an exact permutation of four distinct steps', () => {
    for (const item of bank.filter(x => x.fmt === 'Y3')) {
      expect(item.items, item.id).toHaveLength(4)
      expect(item.order, item.id).toHaveLength(4)
      expect(new Set(item.items?.map(normalized)).size, item.id).toBe(4)
      expect(setEq(item.order!, 4), item.id).toBe(true)
      expect(item.exp.length, item.id).toBeGreaterThan(15)
      expect(item.source.length, item.id).toBeGreaterThan(10)
    }
  })
})
