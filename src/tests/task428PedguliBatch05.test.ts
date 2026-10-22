import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync('supabase/migrations/20261022034000_task428_pedguli_verified_batch05.sql', 'utf8')
const match = sql.match(/FROM jsonb_array_elements\(\$bank\$\n([\s\S]+?)\n\$bank\$::jsonb\)/)
if (!match) throw new Error('TASK-428 batch 05 JSON not found')
const bank = JSON.parse(match[1]) as Array<{
  m: number; c: string; l: string; k: string; d: number
  s: string; o: string[]; a: number; e: string
}>
const words = (value: string) => value.trim().split(/\s+/).length

describe('TASK-428 PedGuli verified batch 05', () => {
  it('contains 20 unique technique and ability sources', () => {
    expect(bank).toHaveLength(20)
    expect(new Set(bank.map((item) => item.m)).size).toBe(20)
    expect(bank.map((item) => item.m)).toEqual([
      847, 848, 849, 1111, 1114, 1117, 1162, 1166, 563, 564,
      565, 567, 568, 569, 570, 571, 572, 574, 575, 576,
    ])
    expect(sql).toContain('TASK428_B05_SOURCE_ALREADY_REPRESENTED')
    expect(sql).toContain('TASK428_B05_ACTIVE_EXACT_DUPLICATE_')
  })

  it('maps only to the canonical pedagogical technique and ability lessons', () => {
    for (const item of bank) {
      expect(['PM.GEN.06', 'PM.GEN.07']).toContain(item.c)
      expect([
        'pedagogik-etika-nutq-texnika-va-takt',
        'pedagogik-qobiliyat-va-uning-turlari',
      ]).toContain(item.l)
      expect(item.s.length).toBeGreaterThan(75)
      expect(item.e.length).toBeGreaterThan(100)
    }
  })

  it('passes option uniqueness and the production length-bias rules', () => {
    for (const item of bank) {
      expect(item.o).toHaveLength(4)
      expect(new Set(item.o.map((value) => value.toLocaleLowerCase('uz'))).size).toBe(4)
      const counts = item.o.map(words)
      const min = Math.min(...counts)
      const max = Math.max(...counts)
      const correct = counts[item.a]
      const maxWrong = Math.max(...counts.filter((_, index) => index !== item.a))
      expect(max, `message ${item.m}: ${counts.join('/')}`).toBeLessThanOrEqual(min * 1.8)
      expect(correct, `message ${item.m}: ${counts.join('/')}`).toBeLessThanOrEqual(maxWrong * 1.25)
    }
    expect(sql).toContain('TASK428_B05_BALANCE_')
  })

  it('publishes additively and atomically with truthful provenance', () => {
    expect(sql).toContain('independent human expert signoff NOT claimed')
    expect(sql).toContain('TASK428_B05_POSTFLIGHT_%_OF_20')
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
    expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)
    expect(sql.match(/\bBEGIN\s*;/gi)).toHaveLength(1)
    expect(sql.match(/\bCOMMIT\s*;/gi)).toHaveLength(1)
  })
})
