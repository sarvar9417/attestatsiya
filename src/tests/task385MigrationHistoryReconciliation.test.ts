import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'

const path = 'supabase/migrations/20261021145214_task376_pedguli_verified_intake.sql'
const oldAlias = 'supabase/migrations/20261021221000_task376_pedguli_verified_intake.sql'
const expectedProductionMd5 = '9740ed8ec22aca8088bbeb1e7984db81'

describe('TASK-385 historical migration version reconciliation', () => {
  it('matches the actual applied production version and exact SQL body fingerprint', () => {
    expect(existsSync(path)).toBe(true)
    expect(existsSync(oldAlias)).toBe(false)
    const migration = readFileSync(path)
    expect(migration.length).toBe(13019)
    expect(createHash('md5').update(migration).digest('hex')).toBe(expectedProductionMd5)
  })

  it('rejects duplicate timestamp aliases without relaxing the validator', () => {
    const files = readdirSync('supabase/migrations').filter((n) => n.endsWith('.sql'))
    const versions = files.map((n) => n.slice(0, 14))
    expect(new Set(versions).size).toBe(versions.length)
    expect(files).toContain('20261021221000_task382_office_38_explicit_y3_goals_immutable_revisions.sql')
    expect(files).toContain('20261021145214_task376_pedguli_verified_intake.sql')
    const validator = readFileSync('scripts/check_migration_filenames.py', 'utf8')
    expect(validator).toContain('Duplicate migration version')
  })
})
