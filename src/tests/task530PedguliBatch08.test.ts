import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync('supabase/migrations/20261022041000_task530_pedguli_verified_batch08.sql', 'utf8')
const match = sql.match(/FROM jsonb_array_elements\(\$bank\$\n([\s\S]+?)\n\$bank\$::jsonb\)/)
if (!match) throw new Error('TASK-530 batch 08 JSON not found')
const bank = JSON.parse(match[1]) as Array<{
  m: number; c: string; l: string; k: string; d: number
  s: string; o: string[]; a: number; e: string
}>
const words = (value: string) => value.trim().split(/\s+/).length

describe('TASK-530 PedGuli verified batch 08', () => {
  it('contains 30 unique ability, communication and conflict sources', () => {
    expect(bank).toHaveLength(30)
    expect(new Set(bank.map((item) => item.m)).size).toBe(30)
    expect(bank.map((item) => item.m)).toEqual([
      656, 658, 660, 661, 662, 663, 665, 666, 667, 668,
      669, 670, 672, 727, 728, 730, 731, 732, 733, 744,
      746, 747, 784, 787, 789, 790, 791, 794, 798, 859,
    ])
    expect(sql).toContain('TASK530_B08_SOURCE_ALREADY_REPRESENTED')
    expect(sql).toContain('TASK530_B08_ACTIVE_EXACT_DUPLICATE_')
  })

  it('maps only to canonical ability and pedagogical-ethics lessons', () => {
    for (const item of bank) {
      expect(['PM.GEN.06', 'PM.GEN.07']).toContain(item.c)
      expect([
        'pedagogik-etika-nutq-texnika-va-takt',
        'pedagogik-qobiliyat-va-uning-turlari',
      ]).toContain(item.l)
      expect(item.s.length).toBeGreaterThan(50)
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
    expect(sql).toContain('TASK530_B08_BALANCE_')
  })

  it('publishes additively, semantically and atomically', () => {
    expect(sql).toContain('TASK530_B08_SEMANTIC_')
    expect(sql).toContain('independent human expert signoff NOT claimed')
    expect(sql).toContain('TASK530_B08_POSTFLIGHT_%_OF_30')
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
    expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)
    expect(sql.match(/\bBEGIN\s*;/gi)).toHaveLength(1)
    expect(sql.match(/\bCOMMIT\s*;/gi)).toHaveLength(1)
  })
})
