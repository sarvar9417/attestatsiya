import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const filePath = resolve(process.cwd(), 'supabase/maintenance/task374_pmgen_30_explanations_ROLLBACK_ONLY.sql')
const sql = readFileSync(filePath, 'utf8')
const cases = [...sql.matchAll(/^  \('([^']+)', '((?:''|[^'])*)'\)(?:,|;)?$/gm)]
const items = cases.map(([, source, encoded]) => ({ source, text: encoded.replace(/''/g, "'") }))

describe('TASK-374: general pedagogy 30 individual learner explanations', () => {
  it('has 30 distinct approved-for-review source references and 30 distinct reasons', () => {
    expect(items).toHaveLength(30)
    expect(new Set(items.map(x => x.source)).size).toBe(30)
    expect(new Set(items.map(x => x.text)).size).toBe(30)
    for (const item of items) {
      expect(item.source).toMatch(/^(?:revision:pedagogy:|authored:)/)
      expect(item.text.length).toBeGreaterThanOrEqual(200)
      expect(item.text).toMatch(/[.!?]$/)
      expect(item.text).not.toMatch(/(?:Manba javobi shu|PDF muallif kaliti|baza kandidati|Manba:)/i)
    }
  })

  it('addresses diverse authentic pedagogical concepts', () => {
    const all = items.map(x => x.text).join(' ')
    expect(all).toMatch(/etika|hurmat/)
    expect(all).toMatch(/ilmiylik|dalil/)
    expect(all).toMatch(/didaktika/)
    expect(all).toMatch(/muammoli ta’lim/)
    expect(all).toMatch(/axloqiy tarbiya/)
    expect(all).toMatch(/inklyuziv|ko‘rishida qiyinchiligi/i)
    expect(all).toMatch(/maxfiylik/)
  })

  it('only proposes immutable review successors and cannot persist by default', () => {
    expect(filePath).toContain('/supabase/maintenance/')
    expect(sql).toMatch(/^BEGIN;$/m)
    expect(sql.trim().endsWith('ROLLBACK;')).toBe(true)
    expect(sql).not.toMatch(/^\s*COMMIT\s*;/mi)
    expect(sql).not.toMatch(/\bpublish_pedagogy_revision\s*\(/i)
    expect(sql).not.toMatch(/\bpedagogy_owner_release_waivers\b/i)
    expect(sql).not.toMatch(/\bcorrect_option_id\b|\banswer_key\b/i)
    expect(sql).not.toMatch(/^\s*UPDATE\s+public\.questions\b/mi)
    expect(sql).toContain("q.status='published'")
    expect(sql).toContain("q.group_code='PM.GEN'")
    expect(sql).toContain("q.format='Y1'")
    expect(sql).toContain('TASK374_SOURCE_DRIFT_OR_ALREADY_REVISED')
    expect(sql).toContain("status='review'")
  })
})
