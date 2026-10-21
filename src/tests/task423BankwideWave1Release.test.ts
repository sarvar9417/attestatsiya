import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const source = readFileSync('supabase/maintenance/task423_bankwide_wave1_eight_immutable_release.sql','utf8')
const manifest = source.slice(source.indexOf('INSERT INTO task423_manifest VALUES'),source.indexOf('DO $task423$'))
const ids = [...manifest.matchAll(/\('([0-9a-f-]{36})'::uuid,\s*'([0-9a-f-]{36})'::uuid/g)]
describe('TASK-423 owner-delegated eight Y1 distractor release', () => {
  it('pins exactly eight unique source/review pairs and immutable fingerprints', () => {
    expect(ids).toHaveLength(8)
    expect(new Set(ids.map(x=>x[1])).size).toBe(8)
    expect(new Set(ids.map(x=>x[2])).size).toBe(8)
    expect(source).toContain('TASK423_SCOPE_NOT_EIGHT')
    expect(source).toContain('TASK423_SOURCE_REVIEW_DRIFT_')
    expect(source).toContain('TASK423_CORRECT_TEXT_CHANGED_')
    expect(source).toContain('TASK423_DISTRACTOR_LENGTH_OR_DUPLICATE_')
  })
  it('publishes new revisions but only archives old versions, leaving old stems/options/keys untouched', () => {
    expect(source).toContain("r.status='review'")
    expect(source).toContain("s.status='published'")
    expect(source).toContain("SET status='published'::public.content_status")
    expect(source).toContain("SET status='archived'::public.content_status")
    expect(source).toContain('TASK423_SOURCES_ARCHIVED_')
    expect(source).toContain('TASK423_POSTFLIGHT_NOT_EIGHT_')
    expect(source).not.toMatch(/UPDATE\s+public\.(question_options|question_keys|exam_items)\b/i)
    expect(source).not.toMatch(/DELETE\s+FROM\s+public\.(questions|question_options|question_keys|exam_items)\b/i)
    expect(source).not.toMatch(/UPDATE\s+public\.questions\s+(?:s\s+)?SET\s+(?:stem_md|source_reference|construct_id|group_code)/i)
  })
  it('expressly labels all AI work without falsely claiming independent expert review', () => {
    expect(source).toContain('SET is_generated=true')
    expect(source).toContain("'independent_human_editorial_signature',false")
    expect(source).toContain('not an independent human expert certification')
    expect(source).not.toMatch(/INSERT\s+INTO\s+public\.question_editorial_checks/i)
    expect(source).toContain('question_quality_published_revisions')
    expect(source).toContain('task379_semantic_distractor_review_pending')
  })
  it('uses a single transaction with postflight and owner requirement', () => {
    expect(source.startsWith('-- TASK-423')).toBe(true)
    expect(source).toContain('BEGIN;')
    expect(source).toMatch(/COMMIT;\s*$/)
    expect(source).toContain('TASK423_OWNER_NOT_UNIQUE')
    expect(source).toContain('TASK423_OPEN_FINDINGS_COUNT_')
    expect(source).toContain('public.group_mock_eligible(r.id)')
  })
})
