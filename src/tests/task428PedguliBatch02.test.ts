import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync(
  'supabase/migrations/20261022031000_task428_pedguli_verified_batch02.sql',
  'utf8',
)

const bankMatch = sql.match(/FROM jsonb_array_elements\(\$bank\$\n([\s\S]+?)\n\$bank\$::jsonb\)/)
if (!bankMatch) throw new Error('TASK-428 JSON bank not found')

interface BankItem {
  m: number
  c: string
  l: string
  k: 'bilish' | 'qollash' | 'mulohaza'
  d: number
  s: string
  o: string[]
  a: number
  e: string
}

const bank = JSON.parse(bankMatch[1]) as BankItem[]
const words = (value: string) => value.trim().split(/\s+/).length

const canonicalLesson = new Map<string, string>([
  ['KS.01', 'oquv-jarayonini-rejalashtirish'],
  ['KS.02', 'talim-samaradorligini-taminlash'],
  ['KS.03', 'ozlashtirishni-baholash-va-qayta-aloqa'],
  ['KS.04', 'tarbiyaviy-faoliyatni-tashkil-etish'],
  ['KS.05', 'xavfsiz-rivojlantiruvchi-talim-muhiti'],
  ['KS.07', 'hamkasblar-va-ota-onalar-bilan-hamkorlik'],
  ['PM.GEN.01', 'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi'],
  ['PM.GEN.08', 'talim-texnologiyalari-va-vaziyatga-mos-tanlov'],
])

describe('TASK-428 PedGuli verified batch 02', () => {
  it('contains exactly 22 unique, source-traceable expert rewrites', () => {
    expect(bank).toHaveLength(22)
    expect(new Set(bank.map((item) => item.m)).size).toBe(22)
    expect(bank.map((item) => item.m)).toEqual([
      2393, 2395, 2398, 2403, 2471, 2475, 2482, 2575, 2576, 2577, 2585,
      2694, 2697, 2711, 2719, 2720, 2721, 2739, 2740, 2741, 2742, 2743,
    ])
    expect(sql).toContain("'telegram:@PedMahoratGuli:' || message_id::text || '|task428:expert-rewrite:v1'")
    expect(sql).toContain('TASK428_SOURCE_ALREADY_REPRESENTED')
    expect(sql).toContain('TASK428_ACTIVE_EXACT_STEM_DUPLICATE')
  })

  it('maps every item to its one canonical construct lesson', () => {
    for (const item of bank) {
      expect(canonicalLesson.get(item.c)).toBe(item.l)
      expect(['bilish', 'qollash', 'mulohaza']).toContain(item.k)
      expect(item.d).toBeGreaterThanOrEqual(1)
      expect(item.d).toBeLessThanOrEqual(5)
      expect(item.s.length).toBeGreaterThan(80)
      expect(item.e.length).toBeGreaterThan(100)
    }
    expect(sql).toContain('TASK428_CANONICAL_MAPPING_')
  })

  it('has four unique plausible options and passes publication length gates', () => {
    for (const item of bank) {
      expect(item.o).toHaveLength(4)
      expect(item.a).toBeGreaterThanOrEqual(0)
      expect(item.a).toBeLessThanOrEqual(3)
      expect(new Set(item.o.map((option) => option.toLocaleLowerCase('uz'))).size).toBe(4)

      const counts = item.o.map(words)
      const min = Math.min(...counts)
      const max = Math.max(...counts)
      const correct = counts[item.a]
      const maxWrong = Math.max(...counts.filter((_, index) => index !== item.a))
      expect(max, `message ${item.m}: ${counts.join('/')}`).toBeLessThanOrEqual(min * 1.8)
      expect(correct, `message ${item.m}: correct=${correct}, maxWrong=${maxWrong}`)
        .toBeLessThanOrEqual(maxWrong * 1.25)
    }
    expect(sql).toContain('TASK428_BALANCE_OR_KEY_FAILURE_')
  })

  it('releases two pinned REVIEW rows and 22 additive rows without altering published history', () => {
    expect(sql).toContain("'telegram:@PedMahoratGuli:2447'")
    expect(sql).toContain("'telegram:@PedMahoratGuli:11756'")
    expect(sql).toContain('b7226c526366733f4df709aafa21d351')
    expect(sql).toContain('58eaceea538e451c6cea6515224b73a4')
    expect(sql).toContain('independent human expert signoff NOT claimed')
    expect(sql).toContain('TASK428_POSTFLIGHT_%_OF_24')
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
    expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)
    expect(sql.match(/\bBEGIN\s*;/gi)).toHaveLength(1)
    expect(sql.match(/\bCOMMIT\s*;/gi)).toHaveLength(1)
  })
})
