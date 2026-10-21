import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync('supabase/maintenance/task378_parent_meeting_example_owner_release.sql', 'utf8')

describe('TASK-378 original parent-meeting question publication', () => {
  it('pins the originally reported question and exactly one review successor', () => {
    expect(sql).toContain('2e951830-a7b7-4788-ac68-1cb3ebf21b31')
    expect(sql).toContain('b64b8def-e21f-4e1b-aaeb-97f973cc281e')
    expect(sql).toContain('TASK378_SOURCE_REVIEW_DRIFT')
    expect(sql).toContain("source.status='published'")
    expect(sql).toContain("revision.status='review'")
  })

  it('checks unique distractors and preserves the correct-answer identity', () => {
    expect(sql).toContain('TASK378_CORRECT_ANSWER_CHANGED')
    expect(sql).toContain('TASK378_FOUR_OPTION_BALANCE_FAILED')
    expect(sql).toContain('v_valid<>4 OR v_uniq<>4')
    expect(sql).not.toMatch(/UPDATE\s+public\.question_options\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
  })

  it('uses an atomic controlled release with explicit owner waiver', () => {
    expect(sql).toContain("public.publish_pedagogy_revision(v_rev,v_actor)")
    expect(sql).toContain('TASK378_POSTFLIGHT_FAILED')
    expect(sql).toContain('independent human signoff NOT claimed')
    expect(sql).toContain('BEGIN;')
    expect(sql).toContain('COMMIT;')
    expect(sql).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
  })
})
