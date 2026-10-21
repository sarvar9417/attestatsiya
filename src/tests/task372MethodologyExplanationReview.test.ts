import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const filePath = resolve(process.cwd(), 'supabase/maintenance/task372_pmmet_35_explanations_ROLLBACK_ONLY.sql')
const sql = readFileSync(filePath, 'utf8')
const drafts = [...sql.matchAll(/^  \('((?:authored:pedguli-topic-study:v2:PM\.MET\.01:127|revision:pedagogy:[0-9a-f-]+))', '((?:''|[^'])*)'\)(?:,|;)?$/gm)]

describe('TASK-372: explanation quality, provenance and production safety', () => {
  it('prepares exactly 35 unique, meaningful PM.MET explanations', () => {
    expect(drafts).toHaveLength(35)
    expect(new Set(drafts.map(item => item[1])).size).toBe(35)
    expect(new Set(drafts.map(item => item[2])).size).toBe(35)
    for (const [, source, escaped] of drafts) {
      expect(source).toMatch(/^(?:revision:pedagogy:|authored:pedguli-topic-study:v2:PM\.MET\.01:)/)
      const rationale = escaped.replace(/''/g, "'")
      expect(rationale.length).toBeGreaterThanOrEqual(180)
      expect(rationale).toMatch(/[.!?]$/)
      expect(rationale).not.toMatch(/(?:Manba javobi shu|PDF muallif kaliti|baza kandidati|Manba:)/i)
    }
  })

  it('includes methodological differences instead of reproducing option letters or PDF metadata', () => {
    expect(sql).toMatch(/Metod.*[Uu]sul|[Uu]sul.*metod/s)
    expect(sql).toMatch(/interfaol|o‘zaro ta’sir/i)
    expect(sql).toMatch(/algoritm|blok-sxema/i)
    expect(sql).toMatch(/baholash|mezon/i)
    expect(sql).not.toMatch(/\bcorrect_option_id\b|\banswer_key\b/i)
  })

  it('is a non-migration ROLLBACK-only revision proposal with no publication', () => {
    expect(filePath).toContain('/supabase/maintenance/')
    expect(sql).toMatch(/^BEGIN;$/m)
    expect(sql.trim().endsWith('ROLLBACK;')).toBe(true)
    expect(sql).not.toMatch(/^\s*COMMIT\s*;/mi)
    expect(sql).not.toMatch(/\bpublish_pedagogy_revision\s*\(/i)
    expect(sql).not.toMatch(/^\s*UPDATE\s+public\.questions\b/mi)
    expect(sql).toContain("q.status='published'")
    expect(sql).toContain("q.group_code='PM.MET'")
    expect(sql).toContain("q.format='Y1'")
    expect(sql).toContain("status='review'")
    expect(sql).toContain('TASK372_SOURCE_CHANGED_OR_ALREADY_REVISED')
  })
})
