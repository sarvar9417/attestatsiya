import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const bank = JSON.parse(readFileSync(resolve(
  'Axborot_va_axborot_jarayonlari_LaTeX',
  'Axborot_va_raqamli_savodxonlik_400_TEST.json',
), 'utf8')) as { chapters: Array<{ questions: Array<{ id: string; concept: string }> }> }
const rows = readFileSync(resolve('docs/audits/TASK247_M01_02_60_ITEM_SOURCE_TRACE.tsv'), 'utf8')
  .trimEnd()
  .split('\n')
  .map(line => line.split('\t'))
const columns = rows.shift() ?? []
const records = rows.map(values => Object.fromEntries(columns.map((key, index) => [key, values[index] ?? ''])))
const eligibleBooks = new Set(['ICT5-2020', 'ICT7-2021', 'CAMBRIDGE9-2021',
  'CAMBRIDGE10-11-2021', 'ICT11-2021'])
const validStatuses = new Set(['topic_supported', 'partial', 'source_gap'])

describe('TASK-247 M01.02 source-trace register safety contract', () => {
  it('accounts for all sixty existing ARS-01 IDs with the matching original concept', () => {
    const originals = bank.chapters[0].questions
    expect(originals).toHaveLength(60)
    expect(records).toHaveLength(60)
    expect(new Set(records.map(row => row.question_id)).size).toBe(60)
    const byId = new Map(records.map(row => [row.question_id, row]))
    for (const item of originals) {
      const row = byId.get(item.id)
      expect(row, item.id).toBeDefined()
      expect(row?.concept, item.id).toBe(item.concept)
      expect(row?.spec_construct).toBe('S1.INFO')
      // A broad chapter citation is not expert signoff for a question/answer.
      expect(row?.review_status).toBe('needs_item_editorial_review')
    }
  })

  it('tracks source debt instead of fabricating a page or claiming approval', () => {
    expect(records.filter(row => row.source_status === 'topic_supported')).toHaveLength(39)
    expect(records.filter(row => row.source_status === 'partial')).toHaveLength(15)
    expect(records.filter(row => row.source_status === 'source_gap')).toHaveLength(6)
    for (const row of records) {
      expect(validStatuses.has(row.source_status), row.question_id).toBe(true)
      expect(row.evidence_note.length, row.question_id).toBeGreaterThan(12)
      if (row.source_status === 'source_gap') {
        expect(row.book_id).toBe('')
        expect(row.printed_page).toBe('')
        expect(row.book_url).toBe('')
      } else {
        expect(eligibleBooks.has(row.book_id), row.question_id).toBe(true)
        expect(row.printed_page, row.question_id).toMatch(/^\d+(?:-\d+)?$/)
        expect(row.book_url, row.question_id).toMatch(/^https:\/\/drive\.google\.com\/file\/d\//)
      }
    }
  })

  it('separates definition, concept recognition and scenario for the same 20 concepts', () => {
    for (let i = 0; i < 20; i++) {
      const concept = records[i].concept
      for (const [offset, form] of [[0, 'definition'], [20, 'definition-recognition'],
        [40, 'applied-scenario']] as const) {
        const row = records[i + offset]
        expect(row.concept).toBe(concept)
        expect(row.question_form).toBe(form)
        expect(row.source_status).toBe(records[i].source_status)
        expect(row.book_url).toBe(records[i].book_url)
      }
    }
    const missing = records.filter(row => row.source_status === 'source_gap')
    expect(missing.map(row => row.concept)).toEqual([
      'Obyekt', 'Hodisa', 'Obyekt', 'Hodisa', 'Obyekt', 'Hodisa',
    ])
  })
})
