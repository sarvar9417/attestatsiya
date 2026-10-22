import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const stage = readFileSync('supabase/maintenance/task531_security_eight_review_stage.sql','utf8')
const ids = [...stage.matchAll(/\('([a-f\d-]{36})'::uuid,NULL,/g)].map(x => x[1])

describe('TASK-531 security awareness distractors REVIEW-only stage', () => {
  it('pins eight distinct S7.SEC Y1 published source questions', () => {
    expect(ids).toHaveLength(8)
    expect(new Set(ids).size).toBe(8)
    expect(stage).toContain("q.group_code IN ('S7.SEC')")
    expect(stage).toContain("q.status='published'")
    expect(stage).toContain("q.format='Y1'")
    expect(stage).toContain('TASK531_SOURCE_OR_KEY_DRIFT_')
  })
  it('keeps published sources and historical exam answers immutable', () => {
    expect(stage).toContain('CASE WHEN r.correct THEN r.content_md ELSE b.wrong')
    expect(stage).toContain('TASK531_PUBLISHED_SOURCE_CHANGED')
    expect(stage).not.toMatch(/UPDATE\s+public\.(questions|question_options|question_keys|exam_items)\b/i)
    expect(stage).not.toMatch(/DELETE\s+FROM\s+public\.(questions|question_options|question_keys|exam_items)\b/i)
  })
  it('never publishes an AI proposal before separate editorial decision', () => {
    expect(stage).toContain("q.assets,true,'review'::public.content_status")
    expect(stage).toContain("'human_editorial_approval',false")
    expect(stage).toContain("'release_performed',false")
    expect(stage).toContain("SELECT m.source_id,'task531_semantic_distractor_review_pending','medium',")
    expect(stage).toContain('TASK531_NOT_REVIEW_ONLY')
    expect(stage).not.toMatch(/SET\s+status\s*=\s*'published'/i)
  })
  it('requires exactly eight reviewed questions and 32 distinct keyed options', () => {
    expect(stage).toContain('TASK531_EXACT_EIGHT_REQUIRED')
    expect(stage).toContain('TASK531_OPTION_MAP_NOT_32')
    expect(stage).toContain('TASK531_OPTION_KEY_BALANCE_FAILED_')
    expect(stage).toContain('BEGIN;')
    expect(stage).toMatch(/COMMIT;\s*$/)
  })
})
