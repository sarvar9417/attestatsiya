import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const ci = readFileSync('.github/workflows/ci.yml','utf8')
const task381 = 'supabase/migrations/20261021220000_task381_y3_missing_goal_immutable_fix_and_office_qa_queue.sql'

describe('TASK-382 production-only content migration and fresh CI fixture separation', () => {
  it('excludes the source-pinned TASK-381 release in both fresh schema loops', () => {
    expect(ci.split(task381)).toHaveLength(3)
    expect(ci).toContain('Skipping previously applied production-specific data release')
  })
  it('keeps the production migration on disk and other DB test gates intact', () => {
    const source = readFileSync(task381,'utf8')
    expect(source).toContain('TASK-381 source question not found')
    expect(source).toContain('TASK-381 release postflight failed')
    expect(ci).toContain('supabase/tests/task202_atomic_pedagogy_publish.test.sql')
    expect(ci).toContain('Fresh database — complete active migration chain')
    expect(ci).toContain('Production-like lesson drift reconciliation')
  })
})
