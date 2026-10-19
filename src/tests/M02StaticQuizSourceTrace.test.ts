import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M02_CANONICAL_GROUPS } from '../data/topics/m02Canonical'

const [header, ...lines] = readFileSync(resolve(
  'docs/audits/TASK250_M02_34_STATIC_QUESTION_SOURCE_REVIEW.tsv',
), 'utf8').trimEnd().split('\n')
const columns = header.split('\t')
const rows = lines.map(line => {
  const values = line.split('\t')
  expect(values).toHaveLength(columns.length)
  return Object.fromEntries(columns.map((name, i) => [name, values[i]]))
})

describe('M02 legacy question source-trace gate', () => {
  it('preserves 34 Y1 question IDs across canonical 2026 learner lessons', () => {
    expect(rows).toHaveLength(34)
    const actual = M02_CANONICAL_GROUPS.flatMap(group =>
      (getTopicContent(group.id)?.questions ?? []).map(q => ({
        id: q.id, canonicalTopic: group.id, type: q.type,
      })),
    )
    expect(actual).toHaveLength(34)
    expect(new Set(rows.map(row => row.legacy_question_id)).size).toBe(34)
    const byId = new Map(rows.map(row => [row.legacy_question_id, row]))
    for (const q of actual) {
      const row = byId.get(q.id)
      expect(row, q.id).toBeDefined()
      expect(row?.canonical_topic).toBe(q.canonicalTopic)
      expect(row?.question_type).toBe('Y1')
      expect(q.type).toBe('Y1')
      expect(row?.editorial_status).toBe('needs_item_editorial_review')
    }
  })

  it('retains source page candidates without pretending they are human approval', () => {
    for (const row of rows) {
      expect(row.source_state).toBe('topic_candidate')
      expect(row.source_book).toMatch(/^(ICT5-2020|ICT10-2021|CAMBRIDGE9-2021)$/)
      expect(row.page_candidate).toMatch(/^\d+-\d+$/)
      expect(row.source_url).toMatch(/^https:\/\/drive\.google\.com\/file\/d\//)
      expect(row.review_note.length).toBeGreaterThan(12)
    }
  })

  it('flags historically ambiguous and time-sensitive static items', () => {
    const flagged = rows.filter(row => row.risk_code !== 'none')
    expect(flagged.map(row => row.legacy_question_id)).toEqual([
      'M02.01-q1',
      'M02.04-q4',
      'M02.05-q1',
      'M02.07-q4',
      'M02.08-q3',
      'M02.09-q3',
    ])
    expect(new Set(flagged.map(row => row.risk_code)).size).toBe(6)
  })
})
