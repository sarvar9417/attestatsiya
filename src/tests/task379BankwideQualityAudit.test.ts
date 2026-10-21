import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const audit = readFileSync('supabase/maintenance/task379_full_bank_option_quality_audit_READONLY.sql','utf8')
const stage = readFileSync('supabase/maintenance/task379_wave1_EIGHT_REVIEW_STAGE.sql','utf8')
const targetIds = [...stage.matchAll(/\('([0-9a-f-]{36})'::uuid/g)].map((m) => m[1])

describe('TASK-379 whole-bank QA and first eight review revisions', () => {
  it('audits all question statuses and all formats without mutating the database', () => {
    expect(audit).toContain('FROM public.questions q')
    expect(audit).toContain("fmt='Y1'")
    expect(audit).toContain("fmt='Y2'")
    expect(audit).toContain("fmt='Y3'")
    expect(audit).toContain('published_total')
    expect(audit).toContain('review_total')
    expect(audit).toContain('archived_total')
    expect(audit).toContain('draft_total')
    expect(audit).not.toMatch(/\b(UPDATE|DELETE|INSERT|TRUNCATE|DROP|CREATE|COMMIT)\s+(?:TABLE|INTO|FROM|public\.)/i)
  })

  it('does not misclassify the allowed native 3x3 and 4x5 matching or 3–6 item ordering', () => {
    expect(audit).toContain('a_n NOT BETWEEN 3 AND 5')
    expect(audit).toContain('b_n>a_n+1')
    expect(audit).toContain('a_n NOT BETWEEN 3 AND 6')
    expect(audit).toContain('count(distinct btrim(o.content_md))')
    expect(audit).not.toContain('count(distinct lower(btrim(o.content_md)))')
  })

  it('pins exactly eight sources with three authored distractors each', () => {
    const ids = [...new Set(targetIds)]
    expect(ids).toHaveLength(8)
    expect(stage).toContain('cardinality(b.wrong)=3')
    expect(stage).toContain('TASK379_SOURCE_OR_KEY_DRIFT_')
    expect(stage).toContain('TASK379_OPTION_KEY_BALANCE_FAILED_')
    expect(stage).toContain('TASK379_PUBLISHED_SOURCE_CHANGED')
    expect(stage).toContain('TASK379_OPTION_MAP_NOT_32')
    expect(stage).toContain('status=\'review\'')
  })

  it('keeps published source versions and answer keys immutable', () => {
    expect(stage).toContain("'review'::public.content_status")
    expect(stage).toContain('human_editorial_approval')
    expect(stage).toContain('release_performed')
    expect(stage).toContain('TASK379_NOT_REVIEW_ONLY')
    expect(stage).not.toMatch(/UPDATE\s+public\.(questions|question_keys|question_options)\b/i)
    expect(stage).not.toMatch(/DELETE\s+FROM\s+public\.(questions|question_keys|question_options)\b/i)
    expect(stage).not.toContain("'published'::public.content_status,q.author_id")
  })
})
