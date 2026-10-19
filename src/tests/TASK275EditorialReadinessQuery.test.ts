import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const sql = readFileSync(
  resolve('scripts/sql/TASK275_25_TOPIC_EDITORIAL_READINESS_READONLY.sql'),
  'utf8',
)

describe('TASK-275: 25-topic source/editorial readiness SQL gate', () => {
  it('is SELECT-only without answer-key or learner-private projection', () => {
    const stripped = sql.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '')
    expect(stripped.trimStart()).toMatch(/^WITH\s+lesson_snap\s+AS\s*\(/)
    expect(stripped).not.toMatch(/\b(INSERT|UPDATE|DELETE|TRUNCATE|ALTER|CREATE|DROP|GRANT|REVOKE|COPY)\b/i)
    expect(stripped).not.toMatch(/\b(correct_option_id|key_payload|answer_index|answer_json|user_id|email)\b/i)
    expect(stripped).toContain('SELECT s.module_code')
  })

  it('uses all seven underfilled modules and official published pool eligibility', () => {
    for (const code of ['M03', 'M06', 'M08', 'M09', 'M10', 'M11', 'M12']) {
      expect(sql).toContain("'" + code + "'")
    }
    expect(sql).toContain("l.status = 'published'")
    expect(sql).toContain("m.status = 'published'")
    expect(sql).toContain('topic_test_preview(l.id)')
    expect(sql).toContain("q.status='review'")
    expect(sql).toContain('s.target-s.available AS deficit')
  })

  it('requires four true editorial fields without inventing approvals', () => {
    for (const field of [
      'answer_verified',
      'reference_verified',
      'wording_verified',
      'original_authorship_verified',
    ]) {
      expect(sql).toContain('ec.' + field)
    }
    expect(sql).toContain('r.source_lesson_id=s.id')
    expect(sql).toContain('P0_ZERO_PUBLISHED')
    expect(sql).toContain('EDITORIAL_AND_PREFLIGHT_REQUIRED')
    expect(sql).toContain('EXISTS (')
  })
})
