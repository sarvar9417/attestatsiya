import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const filePath = resolve(process.cwd(), 'supabase/maintenance/task373_ks_60_explanations_ROLLBACK_ONLY.sql')
const sql = readFileSync(filePath, 'utf8')
const items = [...sql.matchAll(/^  \('([^']+)', '((?:''|[^'])*)'\)(?:,|;)?$/gm)]
const rationales = items.map(([, source, escaped]) => ({
  source,
  explanation: escaped.replace(/''/g, "'"),
}))

describe('TASK-373: KS explanations, provenance and immutable publication gate', () => {
  it('contains 60 distinct reviewed sources and 60 distinct learner explanations', () => {
    expect(rationales).toHaveLength(60)
    expect(new Set(rationales.map(x => x.source)).size).toBe(60)
    expect(new Set(rationales.map(x => x.explanation)).size).toBe(60)
    for (const { source, explanation } of rationales) {
      expect(source).toMatch(/^(?:revision:pedagogy:|authored:|reserve-2026:)/)
      expect(explanation.length).toBeGreaterThanOrEqual(190)
      expect(explanation).toMatch(/[.!?]$/)
      expect(explanation).not.toMatch(/(?:Manba javobi shu|PDF muallif kaliti|baza kandidati|Manba:)/i)
    }
  })

  it('includes independent reasons about differentiated learning, safe teaching and feedback', () => {
    const joined = rationales.map(x => x.explanation).join(' ')
    expect(joined).toMatch(/differensial|ehtiyojga mos/)
    expect(joined).toMatch(/baholash|mezon/)
    expect(joined).toMatch(/xavfsizlik|xavf/)
    expect(joined).toMatch(/ota-ona|oila/)
    expect(joined).toMatch(/refleksiya/)
    expect(joined).toMatch(/maxfiy/)
  })

  it('cannot publish or persist any revisions when used without manual revision', () => {
    expect(filePath).toContain('/supabase/maintenance/')
    expect(sql).toMatch(/^BEGIN;$/m)
    expect(sql.trim().endsWith('ROLLBACK;')).toBe(true)
    expect(sql).not.toMatch(/^\s*COMMIT\s*;/mi)
    expect(sql).not.toMatch(/\bpublish_pedagogy_revision\s*\(/i)
    expect(sql).not.toMatch(/\bpedagogy_owner_release_waivers\b/i)
    expect(sql).not.toMatch(/^\s*UPDATE\s+public\.questions\b/mi)
    expect(sql).not.toMatch(/\bcorrect_option_id\b|\banswer_key\b/i)
  })

  it('checks source state and creates only independent REVIEW revisions', () => {
    expect(sql).toContain("q.status='published'")
    expect(sql).toContain("q.group_code='KS'")
    expect(sql).toContain("q.format='Y1'")
    expect(sql).toContain('TASK373_SOURCE_DRIFT_OR_ALREADY_REVISED')
    expect(sql).toContain('v_successor := public.stage_pedagogy_revision(item.id,v_actor)')
    expect(sql).toContain('WHERE question_id=v_successor')
    expect(sql).toContain("status='review'")
  })
})
