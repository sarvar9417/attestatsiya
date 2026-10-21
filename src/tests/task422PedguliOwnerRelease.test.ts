import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync(
  'supabase/maintenance/task422_pedguli_16_owner_authorized_release.sql',
  'utf8',
)

const rows = [...sql.matchAll(
  /\('telegram:@PedMahoratGuli:(\d+)\|task421:expert-rewrite:v1','([\da-f]{32})',\n '([^']+)',\n '(\[[^']+\])'\)/g,
)].map((match) => ({
  messageId: Number(match[1]),
  fingerprint: match[2],
  stem: match[3],
  options: JSON.parse(match[4]) as string[],
}))

const correctIndex = new Map<number, number>([
  [2257, 1], [2263, 0], [2341, 0], [2342, 1],
  [2343, 0], [2345, 1], [2348, 2], [2392, 0],
  [2394, 1], [2396, 2], [2571, 2], [2573, 1],
  [2714, 2], [2715, 0], [2718, 3], [2745, 2],
])

const words = (value: string) => value.trim().split(/\s+/).length

describe('TASK-422 PedGuli owner-authorized release', () => {
  it('pins exactly sixteen reviewed source rows and their pre-edit fingerprints', () => {
    expect(rows).toHaveLength(16)
    expect(new Set(rows.map((row) => row.messageId)).size).toBe(16)
    expect(new Set(rows.map((row) => row.fingerprint)).size).toBe(16)
    expect(sql).toContain("q.status='review'")
    expect(sql).toContain('TASK422_PRECHECK_')
  })

  it('keeps four distinct options and satisfies the production balance gate', () => {
    for (const row of rows) {
      expect(row.options).toHaveLength(4)
      expect(new Set(row.options.map((option) => option.toLocaleLowerCase('uz'))).size).toBe(4)

      const counts = row.options.map(words)
      const min = Math.min(...counts)
      const max = Math.max(...counts)
      const correct = counts[correctIndex.get(row.messageId)!]
      const maxWrong = Math.max(...counts.filter((_, index) => index !== correctIndex.get(row.messageId)))
      expect(max).toBeLessThanOrEqual(min * 1.8)
      expect(correct).toBeLessThanOrEqual(maxWrong * 1.25)
    }
    expect(sql).toContain('TASK422_BALANCE_OR_KEY_FAILURE_')
    expect(sql).toContain('TASK422_EXACT_DUPLICATE_')
  })

  it('records truthful owner authority and publishes atomically without touching keys or attempts', () => {
    expect(sql).toContain('owner delegated final review and decision authority')
    expect(sql).toContain('independent human expert signoff NOT claimed')
    expect(sql).toContain('public.pedagogy_owner_release_waivers')
    expect(sql).toContain('public.pedagogy_published_revisions')
    expect(sql).toContain('TASK422_POSTFLIGHT_')
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.exam_items\b/i)
    expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)
    expect(sql.match(/\bBEGIN\s*;/gi)).toHaveLength(1)
    expect(sql.match(/\bCOMMIT\s*;/gi)).toHaveLength(1)
  })

  it('fixes the two detected Uzbek possessive-case defects', () => {
    expect(rows.find((row) => row.messageId === 2257)?.stem).toContain("o‘quvchining gapini")
    expect(rows.find((row) => row.messageId === 2396)?.stem).toContain("o‘quvchilarning yaqinlariga")
  })
})
