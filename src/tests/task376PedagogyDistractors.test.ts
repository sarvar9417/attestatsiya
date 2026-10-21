import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync('supabase/maintenance/task376_pedagogy_distractor_revisions_ROLLBACK_ONLY.sql','utf8')
const audit = readFileSync('supabase/maintenance/task376_pedagogy_distractor_audit_READONLY.sql','utf8')

describe('TASK-376 safe pedagogical distractor preparation', () => {
  it('never edits published questions, keys or historical attempts', () => {
    expect(sql).toContain("source.status='published'")
    expect(sql).toContain("revision.status='review'")
    expect(sql).toMatch(/ROLLBACK;\s*-- NEVER use this as an automatic production release/)
    expect(sql).not.toMatch(/\bCOMMIT\s*;/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.questions\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
  })
  it('checks prior option text and excludes the correct-option UUID', () => {
    expect(sql).toContain('o.content_md=e.expected_old')
    expect(sql).toContain("o.id::text<>k.payload->>'correct_option_id'")
    expect(sql).toContain("opts<>4 OR unique_opts<>4 OR correct_opts<>1")
    expect(sql).toContain("proposals.proposal_status='draft'")
  })
  it('does not republish the user-example question and keeps inventory read-only', () => {
    expect(sql).not.toContain('2e951830-a7b7-4788-ac68-1cb3ebf21b31')
    expect(audit).toContain("WHERE q.status='published' AND f.flagged_for_revision")
    expect(audit).not.toMatch(/\bUPDATE\b|\bINSERT\b|\bDELETE\b|\bCOMMIT\b/i)
  })
})
