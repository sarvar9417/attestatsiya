import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const path = resolve(process.cwd(), 'supabase/maintenance/task371_m15_56_explanation_revisions_ROLLBACK_ONLY.sql')
const source = readFileSync(path, 'utf8')
const entries = [...source.matchAll(/^  \('authored:m15-topictest-20261018:(\d+:\d+)', '((?:''|[^'])*)'\)(?:,|;)?$/gm)]
const countByLesson = new Map<string, number>()
for (const match of entries) {
  const lesson = match[1].split(':')[0]
  countByLesson.set(lesson, (countByLesson.get(lesson) ?? 0) + 1)
}

describe('TASK-371: review-only M15 pedagogical explanation upgrade', () => {
  it('contains 56 unique source-referenced rationales with a meaningful explanatory length', () => {
    expect(entries).toHaveLength(56)
    expect(new Set(entries.map(e => e[1])).size).toBe(56)
    for (const entry of entries) {
      const rationale = entry[2].replace(/''/g, "'")
      expect(rationale.length).toBeGreaterThanOrEqual(155)
      expect(rationale).not.toMatch(/\b(?:Manba javobi shu|PDF muallif kaliti|baza kandidati)\b/i)
      expect(rationale).toMatch(/[.!?]$/)
    }
  })

  it('covers all eight existing pedagogy topic sections, not just one repeated concept', () => {
    expect([...countByLesson.keys()].sort()).toEqual(['1','2','3','4','5','6','7','8'])
    for (const count of countByLesson.values()) expect(count).toBeGreaterThanOrEqual(4)
  })

  it('never publishes, migrates, or persists to any database', () => {
    expect(path).toContain('supabase/maintenance/')
    expect(source).toMatch(/^BEGIN;/m)
    expect(source.trim().endsWith('ROLLBACK;')).toBe(true)
    expect(source).not.toMatch(/^\s*COMMIT\s*;/mi)
    expect(source).not.toMatch(/\bpublish_pedagogy_revision\s*\(/i)
    expect(source).not.toMatch(/\bpedagogy_owner_release_waivers\b/i)
    expect(source).not.toMatch(/\bUPDATE\s+public\.questions\b/i)
    expect(source).toContain("status='review'")
  })

  it('stages only independent review successors from current Y1 PM.GEN published rows', () => {
    expect(source).toContain("q.status='published'")
    expect(source).toContain("q.group_code='PM.GEN'")
    expect(source).toContain("q.format='Y1'")
    expect(source).toContain('v_new := public.stage_pedagogy_revision(item.id,v_actor)')
    expect(source).toContain('WHERE question_id=v_new')
    expect(source).toContain('STALE_SOURCE_OR_DUPLICATE_REVISION')
  })
})
