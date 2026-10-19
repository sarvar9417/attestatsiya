import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const report = readFileSync(resolve('docs/TASK261_M09_DB_ACCESS_SOURCE_QA_20261019.md'), 'utf8')
const sql = readFileSync(resolve('scripts/sql/TASK261_M09_REVIEW_QA_READONLY.sql'), 'utf8')

const rows = report.split(/\r?\n/).filter(line =>
  /^\| M09\.0[1-5] /.test(line),
)

describe('TASK-261: M09 source and safety audit contract', () => {
  it('accounts for all five canonical lesson deficits without claiming any expert approval', () => {
    expect(rows).toHaveLength(5)
    const counts = rows.map(line => {
      const parts = line.split('|').map(s => s.trim())
      const [usable, target] = parts[2].split('/').map(Number)
      return {
        usable, target, deficit: Number(parts[3]), review: Number(parts[4]),
        formats: parts[5].split('/').map(Number),
        approvals: Number(parts[6]),
      }
    })
    expect(counts.reduce((s, x) => s + x.deficit, 0)).toBe(75)
    expect(counts.reduce((s, x) => s + x.review, 0)).toBe(309)
    expect(counts.every(x => x.target === 20 && x.usable + x.deficit === 20)).toBe(true)
    expect(counts.every(x => x.formats.length === 3 && x.formats.reduce((s, n) => s + n, 0) === x.review)).toBe(true)
    expect(counts.every(x => x.approvals === 0)).toBe(true)
  })

  it('keeps its SQL read-only, aggregated and free of answer payloads', () => {
    const statements = sql.split('\n').filter(line => !line.trim().startsWith('--')).join('\n')
    expect(statements.toLowerCase()).toContain('topic_test_preview')
    expect(statements.toLowerCase()).toContain('question_editorial_checks')
    expect(statements).toMatch(/\bSELECT\b/)
    expect(statements).not.toMatch(/\b(INSERT|UPDATE|DELETE|ALTER|DROP|TRUNCATE)\b/i)
    expect(statements).not.toMatch(/(?:\.payload|\.explanation_md|SELECT\s+\*\s+FROM\s+public\.question_keys)/i)
  })

  it('states that observed review questions remain unavailable without individual source/key approval', () => {
    expect(report).toContain('NOT completed')
    expect(report).toContain('No question has received independent sign-off')
    expect(report).toContain('No migrations or production writes')
  })
})
