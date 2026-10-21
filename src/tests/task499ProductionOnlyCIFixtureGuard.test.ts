import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const ci = readFileSync('.github/workflows/ci.yml', 'utf8')
const appliedProductionMigrations: Array<[string, string]> = [
  [
    "20261021230000_task388_owner_ai_legacy_y2_20_review_release.sql",
    "725ff398e9a438ed19396e933a4835c4"
  ],
  [
    "20261021231000_task389_owner_ai_12_y2_y3_instruction_clarity_revisions.sql",
    "9432cb232b98418400f313905aed024f"
  ],
  [
    "20261021232000_task390_resolve_verified_live_pedguli_image_warning.sql",
    "853fab1f996aaa4740e810a94abc87a7"
  ],
  [
    "20261021233000_task391_pedagogy_two_y1_context_disambiguations_ai_delegated.sql",
    "8eeac72c13d2cb6cba16e58dc2d7151c"
  ],
  [
    "20261021234000_task392_owner_delegated_ai_y2_narrow_official_mock_eligibility.sql",
    "9045146c1f448cc8151eef0b47c69f7e"
  ]
]

describe('TASK-499 clean CI production-only release isolation', () => {
  it('retains precisely listed, immutable production releases in both fresh-schema loops', () => {
    expect(ci.split('case "${migration}" in')).toHaveLength(3)
    for (const [name, appliedMd5] of appliedProductionMigrations) {
      const path = 'supabase/migrations/' + name
      expect(ci.split(path)).toHaveLength(3)
      const sql = readFileSync(path)
      expect(createHash('md5').update(sql).digest('hex')).toBe(appliedMd5)
    }
  })
  it('does not suppress general Y3 publication guards or migration name uniqueness', () => {
    expect(ci).not.toContain('supabase/migrations/20261021224000_task386_guard_against_generic_y3_task_prompts.sql|')
    expect(readFileSync('scripts/check_migration_filenames.py', 'utf8')).toContain('Duplicate migration version')
    expect(ci).toContain('Validate migration version uniqueness and timestamp format')
    expect(ci).toContain('Production-like lesson drift reconciliation')
  })
})
