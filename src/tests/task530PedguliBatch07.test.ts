import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync('supabase/migrations/20261022040000_task530_pedguli_verified_batch07.sql', 'utf8')
const match = sql.match(/FROM jsonb_array_elements\(\$bank\$\n([\s\S]+?)\n\$bank\$::jsonb\)/)
if (!match) throw new Error('TASK-530 batch 07 JSON not found')
const bank = JSON.parse(match[1]) as Array<{
  m: number; c: string; l: string; k: string; d: number
  s: string; o: string[]; a: number; e: string
}>
const words = (value: string) => value.trim().split(/\s+/).length

describe('TASK-530 PedGuli verified batch 07', () => {
  it('contains 30 unique competence, reflection, ethics and ability sources', () => {
    expect(bank).toHaveLength(30)
    expect(new Set(bank.map((item) => item.m)).size).toBe(30)
    expect(bank.map((item) => item.m)).toEqual([
      448, 449, 454, 457, 458, 459, 463, 464, 465, 466,
      469, 470, 471, 472, 507, 508, 513, 516, 519, 520,
      524, 528, 529, 531, 532, 557, 558, 559, 560, 561,
    ])
    expect(sql).toContain('TASK530_B07_SOURCE_ALREADY_REPRESENTED')
    expect(sql).toContain('TASK530_B07_ACTIVE_EXACT_DUPLICATE_')
  })

  it('uses only canonical competence and general-pedagogy mappings', () => {
    for (const item of bank) {
      expect(['KS.05', 'KS.06', 'KS.07', 'PM.GEN.06', 'PM.GEN.07', 'PM.GEN.08']).toContain(item.c)
      expect(item.s.length).toBeGreaterThan(45)
      expect(item.e.length).toBeGreaterThan(80)
    }
  })

  it('passes option uniqueness and production length-bias rules', () => {
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
    expect(sql).toContain('TASK530_B07_BALANCE_')
  })

  it('publishes additively, semantically and atomically', () => {
    expect(sql).toContain('TASK530_B07_SEMANTIC_')
    expect(sql).toContain('independent human expert signoff NOT claimed')
    expect(sql).toContain('TASK530_B07_POSTFLIGHT_%_OF_30')
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
    expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)
    expect(sql.match(/\bBEGIN\s*;/gi)).toHaveLength(1)
    expect(sql.match(/\bCOMMIT\s*;/gi)).toHaveLength(1)
  })
})
