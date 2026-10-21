import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
const workflow = readFileSync('.github/workflows/ci.yml','utf8')
const productionOnly = 'supabase/migrations/20261021221000_task382_office_38_explicit_y3_goals_immutable_revisions.sql'
const finalSix = 'supabase/migrations/20261021222000_task383_office_final_six_y3_semantic_repair.sql'
describe('TASK-384 isolate production-only 38-question cutover from clean CI', () => {
  it('skips TASK-382 only in both fresh-schema CI fixture loops', () => {
    expect(workflow.split('if [ "${migration}" = "' + productionOnly + '" ]; then')).toHaveLength(3)
    expect(workflow).toContain('Skipping TASK-382 production-only content release in clean CI')
    expect(workflow.split('if [ "${migration}" = "' + finalSix + '" ]; then')).toHaveLength(3)
  })
  it('leaves the original migration and production publication gates untouched', () => {
    const migration = readFileSync(productionOnly,'utf8')
    expect(migration).toContain('TASK-382 source drift')
    expect(migration).toContain('TASK-382 final QA release count inconsistent')
    const lastMigration = readFileSync(finalSix,'utf8')
    expect(lastMigration).toContain('TASK-383 original source missing or drifted')
    expect(workflow).toContain('Fresh database — complete active migration chain')
    expect(workflow).toContain('Production-like lesson drift reconciliation')
  })
})
