import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const stage = readFileSync('supabase/maintenance/task427_office_eight_review_stage.sql', 'utf8')
const ids = [...stage.matchAll(/\('([a-f0-9-]{36})'::uuid,NULL,/g)].map((m) => m[1])

describe('TASK-427 Office question-bank editorial review staging', () => {
  it('pins eight existing Office Y1 source questions without source in-place edits', () => {
    expect(ids).toHaveLength(8)
    expect(new Set(ids).size).toBe(8)
    expect(stage).toContain("q.group_code IN ('S2.OFFICE')")
    expect(stage).toContain("q.status='published'")
    expect(stage).toContain("q.format='Y1'")
    expect(stage).toContain('TASK427_SOURCE_OR_KEY_DRIFT_')
    expect(stage).not.toMatch(/UPDATE\s+public\.(questions|question_options|question_keys|exam_items)\b/i)
    expect(stage).not.toMatch(/DELETE\s+FROM\s+public\.(questions|question_options|question_keys|exam_items)\b/i)
  })
  it('requires four distinct alternatives and retains the exact old correct option content', () => {
    expect(stage).toContain('cardinality(b.wrong)=3')
    expect(stage).toContain('CASE WHEN r.correct THEN r.content_md ELSE b.wrong')
    expect(stage).toContain('TASK427_OPTION_KEY_BALANCE_FAILED_')
    expect(stage).toContain('TASK427_OPTION_MAP_NOT_32')
    expect(stage).toContain('TASK427_PUBLISHED_SOURCE_CHANGED')
  })
  it('stages AI-assisted variants for review without faking human editorial signoff', () => {
    expect(stage).toContain("q.assets,true,'review'::public.content_status")
    expect(stage).toContain("WHERE q.status='review'")
    expect(stage).toContain("'human_editorial_approval',false")
    expect(stage).toContain("'release_performed',false")
    expect(stage).toContain('task427_semantic_distractor_review_pending')
    expect(stage).toContain('TASK427_NOT_REVIEW_ONLY')
    expect(stage).not.toMatch(/SET\s+status\s*=\s*'published'/i)
  })
  it('commits only if eight row and 32 option validation succeeds', () => {
    expect(stage).toContain('BEGIN;')
    expect(stage).toMatch(/COMMIT;\s*$/)
    expect(stage).toContain('TASK427_EXACT_EIGHT_REQUIRED')
    expect(stage).toContain('TASK427_OPTION_MAP_NOT_32')
    expect(stage).toContain("public.professional_question_fingerprint")
  })
})
