import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const migration = readFileSync(
  'supabase/migrations/20261021114500_task377_pedagogy_16_distractor_release.sql',
  'utf8',
)
const sourceIds = [...migration.matchAll(/\('([\da-f-]{36})'::uuid,'([\da-f-]{36})'::uuid,\d+,/g)]

describe('TASK-377 immutable pedagogical publication safety', () => {
  it('publishes only the exact sixteen reviewed question successors', () => {
    expect(sourceIds).toHaveLength(16)
    expect(new Set(sourceIds.map((x) => x[1])).size).toBe(16)
    expect(new Set(sourceIds.map((x) => x[2])).size).toBe(16)
    expect(migration).toContain("source.status='published'")
    expect(migration).toContain("revision.status='review'")
    expect(migration).toContain('TASK377_EXACT_PAIR_SCOPE_FAIL')
    expect(migration).toContain('TASK377_REPLACEMENTS_APPLIED_')
  })

  it('never changes published question content, correct-answer keys or historic attempts', () => {
    expect(migration).toContain('public.publish_pedagogy_revision(item.revision_id,v_actor)')
    expect(migration).toContain('task377_source_fingerprints')
    expect(migration).toContain('TASK377_SOURCE_FINGERPRINT_DRIFT_')
    expect(migration).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
    expect(migration).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
    expect(migration).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)
    expect(migration).not.toMatch(/UPDATE\s+public\.questions\b/i)
  })

  it('uses explicit owner-waiver provenance without impersonating an expert', () => {
    expect(migration).toContain('owner_explicit_no_external_expert_20261018')
    expect(migration).toContain('independent expert signoff NOT claimed')
    expect(migration).toContain('TASK377_PUBLISH_BALANCE_CHECK_')
    expect(migration).toContain('TASK377_POSTFLIGHT_PUBLISHED_')
    expect(migration).toContain('public.pedagogy_published_revisions')
    expect(migration).toContain('public.question_bank_revisions')
    expect(migration.match(/\bCOMMIT\s*;/gi)).toHaveLength(1)
    expect(migration).toContain('BEGIN;')
  })
})
