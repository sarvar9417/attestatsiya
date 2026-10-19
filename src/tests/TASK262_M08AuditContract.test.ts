import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const report = readFileSync(resolve('docs/TASK262_M08_PYTHON_JS_SOURCE_QA_20261019.md'), 'utf8')
const sql = readFileSync(resolve('scripts/sql/TASK262_M08_PYTHON_JS_REVIEW_READONLY.sql'), 'utf8')

const lessonRows = report.split(/\r?\n/).filter(line => /^\| M08\.0[1-5] /.test(line))

describe('TASK-262 M08 Python/JavaScript source-aware pool inventory', () => {
  it('retains five exact-20 canonical lessons and 55 missing published slots', () => {
    expect(lessonRows).toHaveLength(5)
    const rows = lessonRows.map(line => {
      const columns = line.split('|').map(x => x.trim())
      const [available, target] = columns[2].split('/').map(Number)
      return {
        available, target,
        deficit: Number(columns[3]),
        review: Number(columns[4]),
        byFormat: columns[5].split('/').map(Number),
        approved: Number(columns[6]),
        sameSource: Number(columns[7]),
      }
    })
    expect(rows.reduce((sum, row) => sum + row.available, 0)).toBe(45)
    expect(rows.reduce((sum, row) => sum + row.deficit, 0)).toBe(55)
    expect(rows.reduce((sum, row) => sum + row.review, 0)).toBe(426)
    expect(rows.reduce((sum, row) => sum + row.sameSource, 0)).toBe(6)
    expect(rows.every(row => row.target === 20 && row.available + row.deficit === 20)).toBe(true)
    expect(rows.every(row => row.approved === 0)).toBe(true)
    expect(rows.every(row => row.byFormat.length === 3 &&
      row.byFormat.reduce((sum, n) => sum + n, 0) === row.review)).toBe(true)
    expect(rows[3].available).toBe(0) // JS syntax must not falsely appear ready
  })

  it('never confuses Python textbooks with verified JavaScript chapter pages', () => {
    expect(report).toContain('ICT 9_sinf-2020(1).pdf')
    expect(report).toContain('10-11-sinf informatika (Cambridge +)(1).pdf')
    expect(report).toContain('316–329')
    expect(report).toContain('Python-only')
    expect(report).toContain('chapter-level evidence')
  })

  it('executes no DML and exposes no answer payloads or learner attempts', () => {
    const statements = sql.split('\n').filter(line => !line.trim().startsWith('--')).join('\n')
    expect(statements).toMatch(/\bSELECT\b/)
    expect(statements).not.toMatch(/\b(INSERT|UPDATE|DELETE|ALTER|DROP|TRUNCATE)\b/i)
    expect(statements).not.toMatch(/(?:\.payload|\.explanation_md|SELECT\s+\*\s+FROM\s+public\.question_keys)/i)
    expect(statements).not.toContain('public.exam_items')
  })
})
