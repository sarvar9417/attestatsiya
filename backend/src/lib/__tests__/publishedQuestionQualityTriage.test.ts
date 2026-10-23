import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync(
  new URL('../../../../supabase/maintenance/20261023_published_question_quality_triage_READONLY.sql', import.meta.url),
  'utf8',
)

const securitySql = readFileSync(
  new URL('../../../../supabase/maintenance/20261023_security_definer_grants_READONLY.sql', import.meta.url),
  'utf8',
)

describe('published question quality review inventory', () => {
  it('is an inspection-only artifact, never an automatic release or answer-key rewrite', () => {
    // Drop SQL comments so remediation suggestions in comments cannot fool checks.
    const statements = sql.split('\n').filter(line => !line.trimStart().startsWith('--')).join('\n')
    expect(statements).not.toMatch(/^\s*(?:update|delete|insert|alter|drop|truncate|grant|revoke|create)\b/im)
    expect(statements).toMatch(/FROM\s+public\.question_quality_findings/i)
    expect(statements).toMatch(/f\.resolved_at\s+IS\s+NULL/i)
    expect(statements).toMatch(/q\.status::text\s*=\s*'published'/i)
    expect(statements).not.toMatch(/question_keys|question_options|stem_md/i)
  })

  it('counts unique question IDs separately from finding rows', () => {
    expect(sql).toMatch(/GROUP BY\s+q\.id,\s*q\.group_code/i)
    expect(sql).toMatch(/distinct_questions_with_any_flag/i)
    expect(sql).toMatch(/flag_rows_not_distinct_questions/i)
    expect(sql).toMatch(/question_source_evidence_eligible/i)
    expect(sql).toMatch(/LIMIT 100/i)
  })
})

describe('public SECURITY DEFINER function privilege inventory', () => {
  it('uses only catalog reads, never changes production grants or code', () => {
    const body = securitySql.split('\n').filter(line => !line.trimStart().startsWith('--')).join('\n')
    expect(body).not.toMatch(/^\s*(?:update|delete|insert|alter|drop|truncate|grant|revoke|create)\b/im)
    expect(body).toMatch(/pg_proc/)
    expect(body).toMatch(/pg_namespace/)
    expect(body).toMatch(/has_function_privilege/)
    expect(body).toMatch(/aclexplode/)
    expect(body).toMatch(/auth\.uid\(\)/)
    expect(body).toMatch(/search_path/)
  })
})
