import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const originalBank = JSON.parse(readFileSync(resolve(
  'Axborot_va_axborot_jarayonlari_LaTeX',
  'Axborot_va_raqamli_savodxonlik_400_TEST.json',
), 'utf8')) as {
  chapters: Array<{ questions: Array<{ id: string; concept: string; type: string }> }>
}
const raw = readFileSync(resolve('docs/audits/TASK248_M01_04_70_ITEM_SOURCE_TRACE.tsv'), 'utf8')
  .trimEnd()
  .split('\n')
const head = raw.shift()?.split('\t') ?? []
const records = raw.map(line => {
  const cells = line.split('\t')
  return Object.fromEntries(head.map((column, index) => [column, cells[index] ?? '']))
})
const allowedBooks = new Set([
  'ICT6-2021', 'ICT7-2021', 'ICT11-2021', 'CAMBRIDGE9-2021', 'CAMBRIDGE10-11-2021',
])

describe('TASK-248 M01.04 textbook page evidence', () => {
  it('preserves all 70 original question IDs, concepts and forms', () => {
    const bank = originalBank.chapters[2].questions
    expect(bank).toHaveLength(70)
    expect(records).toHaveLength(70)
    expect(new Set(records.map(r => r.question_id)).size).toBe(70)
    bank.forEach((item, index) => {
      const record = records[index]
      expect(record.question_id).toBe(item.id)
      expect(record.concept).toBe(item.concept)
      expect(record.question_form).toBe(item.type)
      expect(record.spec_construct).toBe('S1.INFO')
      expect(record.review_status).toBe('needs_item_editorial_review')
    })
  })

  it('clearly distinguishes textbook topic matches from missing pages', () => {
    expect(records.filter(r => r.source_status === 'topic_supported')).toHaveLength(42)
    expect(records.filter(r => r.source_status === 'partial')).toHaveLength(25)
    expect(records.filter(r => r.source_status === 'source_gap')).toHaveLength(3)
    for (const record of records) {
      expect(record.evidence_note.length).toBeGreaterThan(15)
      if (record.source_status === 'source_gap') {
        expect(record.book_id).toBe('')
        expect(record.printed_page).toBe('')
        expect(record.book_url).toBe('')
      } else {
        expect(['topic_supported', 'partial']).toContain(record.source_status)
        expect(allowedBooks.has(record.book_id), record.question_id).toBe(true)
        expect(record.printed_page).toMatch(/^\d+(?:-\d+)?$/)
        expect(record.book_url).toMatch(/^https:\/\/drive\.google\.com\/file\/d\//)
      }
    }
    expect(records.filter(r => r.source_status === 'source_gap').map(r => r.concept))
      .toEqual(['Yo‘q qilish', 'Yo‘q qilish', 'Yo‘q qilish'])
  })

  it('covers all 23 concepts in three cognitive presentation forms plus the integration item', () => {
    const forms = ['ta’rif', 'farqlash', 'vaziyat']
    const bank = originalBank.chapters[2].questions
    for (let i = 0; i < 23; i++) {
      for (let j = 0; j < 3; j++) {
        const record = records[i + j * 23]
        expect(record.concept).toBe(bank[i].concept)
        expect(record.question_form).toBe(forms[j])
        expect(record.source_status).toBe(records[i].source_status)
      }
    }
    expect(records[69].question_form).toBe('integratsion tahlil')
    expect(records[69].source_status).toBe('partial')
  })
})
