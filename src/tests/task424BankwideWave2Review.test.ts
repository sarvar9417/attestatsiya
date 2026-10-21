import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const source = readFileSync('supabase/maintenance/task424_wave2_EIGHT_REVIEW_STAGE.sql','utf8')
const ids = [...source.matchAll(/\('([\da-f-]{36})'::uuid,NULL,/g)].map(x=>x[1])

describe('TASK-424 bankwide audit wave 2 review-only Y1 revisions', () => {
  it('tracks eight unique source IDs with fail-closed checks', () => {
    expect(ids).toHaveLength(8)
    expect(new Set(ids).size).toBe(8)
    expect(source).toContain('TASK424_EXACT_EIGHT_REQUIRED')
    expect(source).toContain('TASK424_SOURCE_OR_KEY_DRIFT_')
    expect(source).toContain('TASK424_OPTION_KEY_BALANCE_FAILED_')
    expect(source).toContain('TASK424_PUBLISHED_SOURCE_CHANGED')
  })
  it('maintains the exact Y1 key while rewriting only distractors in new review revisions', () => {
    expect(source).toContain("q.group_code IN ('S1.INFO','S4.BLOCK')")
    expect(source).toContain("q.assets,true,'review'::public.content_status")
    expect(source).toContain('CASE WHEN r.correct THEN r.content_md ELSE b.wrong')
    expect(source).toContain('TASK424_NOT_REVIEW_ONLY')
    expect(source).toContain('TASK424_OPTION_MAP_NOT_32')
    expect(source).not.toMatch(/UPDATE\s+public\.(questions|question_keys|question_options|exam_items)\b/i)
    expect(source).not.toMatch(/DELETE\s+FROM\s+public\.(questions|question_keys|question_options|exam_items)\b/i)
  })
  it('never claims external human editorial approval or learner publication', () => {
    expect(source).toContain("'human_editorial_approval',false")
    expect(source).toContain("'release_performed',false")
    expect(source).toContain('task424_semantic_distractor_review_pending')
    expect(source).toContain("WHERE q.status='review'")
    expect(source).not.toContain("SET status='published'")
    expect(source).not.toContain("SET status='archived'")
  })
})
