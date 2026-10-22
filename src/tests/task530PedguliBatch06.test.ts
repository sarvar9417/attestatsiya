import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync('supabase/migrations/20261022035000_task530_pedguli_verified_batch06.sql', 'utf8')
const match = sql.match(/FROM jsonb_array_elements\(\$bank\$\n([\s\S]+?)\n\$bank\$::jsonb\)/)
if (!match) throw new Error('TASK-530 batch 06 JSON not found')
const bank = JSON.parse(match[1]) as Array<{
  m: number; c: string; l: string; k: string; d: number
  s: string; o: string[]; a: number; e: string
}>
const words = (value: string) => value.trim().split(/\s+/).length

describe('TASK-530 PedGuli verified batch 06', () => {
  it('contains 30 unique general pedagogy and didactics sources', () => {
    expect(bank).toHaveLength(30)
    expect(new Set(bank.map((item) => item.m)).size).toBe(30)
    expect(bank.map((item) => item.m)).toEqual([
      121, 129, 131, 159, 248, 264, 268, 269, 352, 357,
      358, 359, 360, 362, 384, 400, 401, 405, 406, 613,
      618, 627, 630, 1212, 1213, 1217, 1218, 1555, 1561, 1576,
    ])
    expect(sql).toContain('TASK530_B06_SOURCE_ALREADY_REPRESENTED')
    expect(sql).toContain('TASK530_B06_ACTIVE_EXACT_DUPLICATE_')
  })

  it('maps only to canonical pedagogy, lesson-form and technology lessons', () => {
    for (const item of bank) {
      expect(['PM.GEN.01', 'PM.GEN.04', 'PM.GEN.08']).toContain(item.c)
      expect([
        'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi',
        'dars-turlari-rejalashtirish-va-sinfni-boshqarish',
        'talim-texnologiyalari-va-vaziyatga-mos-tanlov',
      ]).toContain(item.l)
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
    expect(sql).toContain('TASK530_B06_BALANCE_')
  })

  it('publishes additively and atomically with truthful provenance', () => {
    expect(sql).toContain('independent human expert signoff NOT claimed')
    expect(sql).toContain('TASK530_B06_POSTFLIGHT_%_OF_30')
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
    expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)
    expect(sql.match(/\bBEGIN\s*;/gi)).toHaveLength(1)
    expect(sql.match(/\bCOMMIT\s*;/gi)).toHaveLength(1)
  })
})
