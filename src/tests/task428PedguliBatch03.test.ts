import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync(
  'supabase/migrations/20261022032000_task428_pedguli_verified_batch03.sql',
  'utf8',
)
const match = sql.match(/FROM jsonb_array_elements\(\$bank\$\n([\s\S]+?)\n\$bank\$::jsonb\)/)
if (!match) throw new Error('TASK-428 batch 03 JSON not found')

interface Item {
  m: number
  c: string
  l: string
  k: string
  d: number
  s: string
  o: string[]
  a: number
  e: string
}
const bank = JSON.parse(match[1]) as Item[]
const words = (value: string) => value.trim().split(/\s+/).length

describe('TASK-428 PedGuli verified batch 03', () => {
  it('contains the 21 unique, previously unrepresented source messages', () => {
    expect(bank).toHaveLength(21)
    expect(new Set(bank.map((item) => item.m)).size).toBe(21)
    expect(bank.map((item) => item.m)).toEqual([
      2474, 2744, 2750, 2752, 2786, 2947, 2113, 2114, 2115, 2116, 2175,
      2251, 2252, 2253, 2254, 2258, 2264, 2344, 2346, 2349, 2350,
    ])
    expect(sql).toContain('TASK428_B03_SOURCE_ALREADY_REPRESENTED')
    expect(sql).toContain('TASK428_B03_ACTIVE_EXACT_DUPLICATE')
  })

  it('provides one canonical lesson mapping and substantive explanation per item', () => {
    for (const item of bank) {
      expect(item.c).toMatch(/^(KS|PM\.GEN)\.\d{2}$/)
      expect(item.l).toMatch(/^[a-z0-9-]+$/)
      expect(['bilish', 'qollash', 'mulohaza']).toContain(item.k)
      expect(item.d).toBeGreaterThanOrEqual(1)
      expect(item.d).toBeLessThanOrEqual(5)
      expect(item.s.length).toBeGreaterThan(80)
      expect(item.e.length).toBeGreaterThan(100)
    }
    expect(sql).toContain('TASK428_B03_MAPPING_')
  })

  it('passes the exact production four-option and length-bias gates', () => {
    for (const item of bank) {
      expect(item.o).toHaveLength(4)
      expect(new Set(item.o.map((value) => value.toLocaleLowerCase('uz'))).size).toBe(4)
      expect(item.a).toBeGreaterThanOrEqual(0)
      expect(item.a).toBeLessThanOrEqual(3)
      const counts = item.o.map(words)
      const min = Math.min(...counts)
      const max = Math.max(...counts)
      const correct = counts[item.a]
      const maxWrong = Math.max(...counts.filter((_, index) => index !== item.a))
      expect(max, `message ${item.m}: ${counts.join('/')}`).toBeLessThanOrEqual(min * 1.8)
      expect(correct, `message ${item.m}: ${counts.join('/')}`).toBeLessThanOrEqual(maxWrong * 1.25)
    }
    expect(sql).toContain('TASK428_B03_BALANCE_OR_KEY_')
  })

  it('publishes atomically with truthful AI provenance and immutable-history safety', () => {
    expect(sql).toContain('independent human expert signoff NOT claimed')
    expect(sql).toContain('TASK428_B03_POSTFLIGHT_%_OF_21')
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
    expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)
    expect(sql.match(/\bBEGIN\s*;/gi)).toHaveLength(1)
    expect(sql.match(/\bCOMMIT\s*;/gi)).toHaveLength(1)
  })
})
