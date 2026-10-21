import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const migrationPath = resolve(
  process.cwd(),
  'supabase/migrations/20261021075218_task375_database_code_block_revisions.sql',
)
const sql = readFileSync(migrationPath, 'utf8')
const findingMigration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20261021075438_task375_carry_quality_findings.sql'),
  'utf8',
)

describe('TASK-375 database code-block revisions', () => {
  it('covers the audited 37 inline snippets and 22 unmarked pseudocode stems', () => {
    expect(sql.match(/\$old\$/g)).toHaveLength(74)
    expect(sql.match(/^  \('algoritmlash-v[234]:/gm)).toHaveLength(22)
    expect(sql).toContain('ELSIF v_target_count>59')
    expect(sql).toContain('(SELECT count(*) FROM task375_map)<>v_target_count')
  })

  it('formats the two reported loops as language-labelled multiline blocks', () => {
    expect(sql).toContain('$new$for i in range(3):\n    print(i, end=" ")$new$')
    expect(sql).toContain('$new$for (let i = 0; i < a.length; i++)\n  sum += a[i];')
    expect(sql).toContain("E'\\n\\n```' || i.language")
  })

  it('uses immutable revisions and remaps only the private Y1 option id', () => {
    expect(sql).not.toMatch(/UPDATE\s+public\.questions\s+SET\s+stem_md/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.question_(?:options|keys)/i)
    expect(sql).toContain("'code_block_presentation_normalization'")
    expect(sql).toContain("'{correct_option_id}'")
    expect(sql).toContain("source_k.explanation_md IS DISTINCT FROM revision_k.explanation_md")
    expect(sql).toContain("'answer_semantics_changed',false")
    expect(sql).toContain("q.id=m.source_question_id AND q.status='published'")
  })

  it('records the owner-requested formatting release without claiming human review', () => {
    expect(sql).toContain("'owner_requested',true")
    expect(sql).toContain('No independent human review is claimed or fabricated.')
    expect(sql).toContain('no independent editorial certification')
  })

  it('carries all open quality blockers to the immutable successors', () => {
    expect(findingMigration).toContain("f.resolved_at IS NULL")
    expect(findingMigration).toContain("v_total=59 AND (v_sources<>80 OR v_eligible<>45)")
    expect(findingMigration).toContain('public.is_question_official_mock_eligible')
    expect(findingMigration.trim().endsWith('COMMIT;')).toBe(true)
  })
})
