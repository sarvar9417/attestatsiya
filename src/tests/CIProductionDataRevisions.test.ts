import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const ci = readFileSync(resolve(process.cwd(), '.github/workflows/ci.yml'), 'utf8')

const existingProductionRevisions = [
  '20261021220000_task381_y3_missing_goal_immutable_fix_and_office_qa_queue.sql',
  '20261021221001_task382_office_38_explicit_y3_goals_immutable_revisions.sql',
  '20261021222000_task383_office_final_six_y3_semantic_repair.sql',
  '20261021223000_task385_office_nine_more_generic_y3_revisions.sql',
]

describe('TASK-427: production-only Office data cutovers in fresh CI', () => {
  it('skips only named production-applied records in BOTH clean-schema bootstrap loops', () => {
    const caseGuards = ci.match(/case "\$\{migration\}" in/g) ?? []
    expect(caseGuards).toHaveLength(2)

    for (const name of existingProductionRevisions) {
      expect(ci.split(name)).toHaveLength(3)
    }
    expect(ci).toContain('Skipping previously applied production-only Office Y3 data revision')
  })

  it('preserves strict migration uniqueness validation and schema security migrations', () => {
    expect(ci).toContain('python3 scripts/check_migration_filenames.py')
    expect(ci).toContain('find supabase/migrations -maxdepth 1 -type f')
    expect(ci).not.toMatch(/supabase\/migrations\/20261021\*\.sql/)
    expect(existingProductionRevisions).not.toContain(
      '20261021224000_task386_guard_against_generic_y3_task_prompts.sql',
    )
  })
})
