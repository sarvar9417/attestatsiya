import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync(
  'supabase/migrations/20261022033000_task428_pedguli_verified_batch04.sql',
  'utf8',
)
const match = sql.match(/FROM jsonb_array_elements\(\$bank\$\n([\s\S]+?)\n\$bank\$::jsonb\)/)
if (!match) throw new Error('TASK-428 batch 04 JSON not found')
const bank = JSON.parse(match[1]) as Array<{
  m: number
  k: string
  d: number
  s: string
  o: string[]
  a: number
  e: string
}>
const words = (value: string) => value.trim().split(/\s+/).length

describe('TASK-428 PedGuli verified batch 04', () => {
  it('pins the 19 assessment and control source messages exactly once', () => {
    expect(bank).toHaveLength(19)
    expect(new Set(bank.map((item) => item.m)).size).toBe(19)
    expect(bank.map((item) => item.m)).toEqual([
      902, 906, 908, 909, 910, 912, 914, 917, 918, 919,
      920, 938, 940, 941, 942, 944, 947, 950, 952,
    ])
    expect(sql).toContain('TASK428_B04_SOURCE_ALREADY_REPRESENTED')
    expect(sql).toContain('TASK428_B04_ACTIVE_EXACT_DUPLICATE_')
  })

  it('contains complete standalone prompts and pedagogical explanations', () => {
    for (const item of bank) {
      expect(['bilish', 'qollash', 'mulohaza']).toContain(item.k)
      expect(item.d).toBeGreaterThanOrEqual(1)
      expect(item.d).toBeLessThanOrEqual(5)
      expect(item.s.length).toBeGreaterThan(80)
      expect(item.e.length).toBeGreaterThan(100)
      expect(item.s).not.toMatch(/nuqtalar|bo‘g‘in/i)
    }
  })

  it('passes four-option uniqueness and production word-balance checks', () => {
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
    expect(sql).toContain('TASK428_B04_BALANCE_')
  })

  it('uses an atomic additive release and records honest provenance', () => {
    expect(sql).toContain('independent human expert signoff NOT claimed')
    expect(sql).toContain('TASK428_B04_POSTFLIGHT_%_OF_19')
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
    expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)
    expect(sql.match(/\bBEGIN\s*;/gi)).toHaveLength(1)
    expect(sql.match(/\bCOMMIT\s*;/gi)).toHaveLength(1)
  })
})
