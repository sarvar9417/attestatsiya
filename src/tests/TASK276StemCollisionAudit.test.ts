import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const sql = readFileSync(
  resolve('scripts/sql/TASK276_SEVEN_MODULE_DUPLICATE_STEM_READONLY.sql'),
  'utf8',
)

describe('TASK-276: exact-stem collision triage is privacy-safe', () => {
  it('is SELECT-only, with no answer key or learner record access', () => {
    const code = sql.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '')
    expect(code.trimStart()).toMatch(/^WITH\s+scoped\s+AS\s*\(/)
    expect(code).not.toMatch(/\b(INSERT|UPDATE|DELETE|TRUNCATE|ALTER|CREATE|DROP|GRANT|REVOKE|COPY)\b/i)
    for (const secret of ['question_keys', 'correct_option_id', 'answer_index', 'user_id', 'email']) {
      expect(code).not.toContain(secret)
    }
  })
  it('keeps all seven affected modules and aggregates exact repeated stems', () => {
    for (const module of ['M03','M06','M08','M09','M10','M11','M12']) {
      expect(sql).toContain("'" + module + "'")
    }
    expect(sql).toContain("q.status IN ('published','review')")
    expect(sql).toContain('count(DISTINCT question_id) > 1')
    expect(sql).toContain('left(md5(normalized_stem),12)')
    expect(sql).toContain('item_ids-1 AS excess_same_stem_ids')
  })
  it('forbids unreviewed deduplication or publishing from an aggregate', () => {
    expect(sql).toContain('GENERIC_STEM_DISTINCT_OPTIONS_NO_AUTO_DELETE')
    expect(sql).toContain('POTENTIAL_OPTIONS_COLLISION_EXPERT_REVIEW')
    expect(sql).toContain('distinct_option_sets')
    expect(sql).toContain('option_signatures')
    expect(sql).toContain('asset_backed_items')
    expect(sql).toContain('distinct_source_lessons')
    expect(sql).toContain('generated_items')
    expect(sql).not.toMatch(/\bstatus\s*=\s*'published'\s*;/i)
  })
})
