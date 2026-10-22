import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const workflow = readFileSync('.github/workflows/ci.yml','utf8')
const releases = [
  '20261022031000_task428_pedguli_verified_batch02.sql',
  '20261022032000_task428_pedguli_verified_batch03.sql',
  '20261022033000_task428_pedguli_verified_batch04.sql',
  '20261022034000_task428_pedguli_verified_batch05.sql',
]
describe('TASK-532 historical production-only PedGuli data releases in clean CI fixture', () => {
  it('skips each of the four exact source-pinned TASK-428 release files in both clean-schema loops', () => {
    for(const name of releases){
      expect(workflow.split('supabase/migrations/' + name)).toHaveLength(3)
    }
    expect(workflow).toContain('Skipping previously applied production-specific data release')
  })
  it('retains all applied production migration SQL and their source-integrity guards', () => {
    for(const name of releases){
      const sql = readFileSync('supabase/migrations/' + name,'utf8')
      expect(sql).toContain('BEGIN;')
      expect(sql).toMatch(/COMMIT;\s*$/)
      expect(sql).toMatch(/TASK428_[A-Z_]+/)
    }
    expect(workflow).toContain('Fresh database — complete active migration chain')
    expect(workflow).toContain('Production-like lesson drift reconciliation')
  })
})
