import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = JSON.parse(readFileSync(resolve(
  'Axborot_va_axborot_jarayonlari_LaTeX',
  'Axborot_va_raqamli_savodxonlik_400_TEST.json',
), 'utf8')) as {
  chapters: Array<{ questions: Array<{ id: string; concept: string; type: string }> }>
}
const content = readFileSync(resolve('docs/audits/TASK247_M01_03_60_ITEM_SOURCE_TRACE.tsv'), 'utf8')
  .trimEnd()
  .split('\n')
const headers = content.shift()?.split('\t') ?? []
const records = content.map(line => {
  const cells = line.split('\t')
  return Object.fromEntries(headers.map((h, index) => [h, cells[index] ?? '']))
})
const validBooks = new Set(['ICT6-2021', 'ICT7-2021', 'ICT11-2021', 'CAMBRIDGE10-11-2021'])
const statuses = ['topic_supported', 'partial', 'source_gap']

describe('M01.03 textbook source fidelity manifest', () => {
  it('maps all 60 individual ARS-02 IDs and original concepts without renumbering', () => {
    const items = source.chapters[1].questions
    expect(items).toHaveLength(60)
    expect(records).toHaveLength(60)
    expect(new Set(records.map(record => record.question_id)).size).toBe(60)

    items.forEach((item, index) => {
      const row = records[index]
      expect(row.question_id).toBe(item.id)
      expect(row.concept).toBe(item.concept)
      expect(row.question_form).toBe(item.type)
      expect(row.spec_construct).toBe('S1.INFO')
      expect(row.review_status).toBe('needs_item_editorial_review')
      expect(row.evidence_note.length, item.id).toBeGreaterThan(15)
    })
  })

  it('keeps unproven concepts explicitly unverified and verifies source locators', () => {
    const statusCounts = statuses.map(status =>
      records.filter(record => record.source_status === status).length,
    )
    expect(statusCounts).toEqual([39, 19, 2])
    expect(records.filter(record => record.source_status === 'source_gap')
      .map(record => record.concept)).toEqual([
      'ichki-tashqi manba',
      'foydalilik va qiymatlilik',
    ])
    for (const row of records) {
      expect(statuses, row.question_id).toContain(row.source_status)
      if (row.source_status === 'source_gap') {
        expect(row.book_id).toBe('')
        expect(row.printed_page).toBe('')
        expect(row.book_url).toBe('')
      } else {
        expect(validBooks.has(row.book_id), row.question_id).toBe(true)
        expect(row.printed_page).toMatch(/^\d+(?:-\d+)?$/)
        expect(row.book_url).toMatch(/^https:\/\/drive\.google\.com\/file\/d\//)
      }
    }
  })

  it('preserves the question form distribution in this source chapter', () => {
    const forms = records.reduce<Record<string, number>>((result, record) => {
      result[record.question_form] = (result[record.question_form] ?? 0) + 1
      return result
    }, {})
    expect(forms['ta’rif']).toBe(15)
    expect(forms['farqlash']).toBe(15)
    expect(forms.vaziyat).toBe(15)
    expect(Object.entries(forms).filter(([form]) => !['ta’rif', 'farqlash', 'vaziyat'].includes(form))
      .reduce((sum, [, count]) => sum + count, 0)).toBe(15)
  })
})
