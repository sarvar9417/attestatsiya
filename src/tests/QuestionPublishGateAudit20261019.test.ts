import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(resolve('scripts/sql/TASK282_QUESTION_PUBLISH_GATES_READONLY.sql'), 'utf8')
const statements = source.split('\n').filter(line => !line.trim().startsWith('--')).join('\n')

describe('TASK-282: question bank publication eligibility report', () => {
  it('never writes production questions, keys, lessons or reviewer flags', () => {
    expect(statements).not.toMatch(/\b(INSERT|UPDATE|DELETE|TRUNCATE|ALTER|DROP|CREATE|MERGE|CALL)\b/i)
    expect(statements).toContain("q.status='review'")
    expect(statements.trim().endsWith(';')).toBe(true)
  })

  it('requires the original source lesson to be published with a valid construct and key', () => {
    for (const term of [
      "lesson_status='published'",
      'construct_active AND lesson_construct_linked AND key_present',
      'source_lesson_id',
    ]) expect(statements).toContain(term)
  })

  it('checks expert records rather than fabricating approval', () => {
    expect(statements).toContain('ktd_quality.editorial_reviews')
    expect(statements).toContain('public.question_editorial_checks')
    expect(statements).toContain('r.item_fingerprint=ktd_quality.item_fingerprint(s.id)')
    expect(statements).toContain('e.content_fingerprint=public.professional_question_fingerprint(s.id)')
    for (const term of ['answer_verified','source_verified','distractors_verified','reference_verified']) {
      expect(statements).toContain(term)
    }
  })

  it('reports aggregated gate counts without exposing answer keys or stems', () => {
    expect(statements).toContain('basic_preflight_pass_only')
    expect(statements).toContain('unpublished_source_lesson')
    expect(statements).toContain('missing_independent_editorial_evidence')
    expect(statements).not.toContain('stem_md')
    expect(statements).not.toContain('payload')
    expect(statements).not.toContain('correct_option_id')
  })
})
