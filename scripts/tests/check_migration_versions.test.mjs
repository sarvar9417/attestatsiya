import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { checkMigrationVersions } from '../check_migration_versions.mjs'

describe('migration history preflight', () => {
  it('accepts valid unique timestamp migration names', () => {
    assert.deepEqual(checkMigrationVersions([
      '20261018100000_alpha.sql',
      '20261018100001_beta.sql',
      '20261018105100_gamma.sql',
    ]), [])
  })

  it('rejects duplicate versions even when migration names differ', () => {
    const errors = checkMigrationVersions([
      '20261018100000_alpha.sql',
      '20261018100000_beta.sql',
    ])
    assert.equal(errors.length, 1)
    assert.match(errors[0], /Takroriy migratsiya/)
  })

  it('rejects impossible UTC timestamp components', () => {
    const errors = checkMigrationVersions([
      '20261018106000_invalid_minute.sql',
      '20260230090000_invalid_day.sql',
      '20261301120000_invalid_month.sql',
    ])
    assert.equal(errors.length, 3)
    assert.ok(errors.every(error => error.includes('UTC')))
  })

  it('rejects wrong filename shapes and ignores non-SQL files', () => {
    const errors = checkMigrationVersions([
      'migration.sql',
      '20261018102000_BadCaps.sql',
      'README.md',
    ])
    assert.equal(errors.length, 2)
  })
})
