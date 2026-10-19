import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const chapters = (JSON.parse(readFileSync(resolve(
  'Axborot_va_axborot_jarayonlari_LaTeX',
  'Axborot_va_raqamli_savodxonlik_400_TEST.json',
), 'utf8')) as {
  chapters: Array<{ questions: Array<{ id: string; type: string; concept: string }> }>
}).chapters
const files = [
  'TASK247_M01_02_60_ITEM_SOURCE_TRACE.tsv',
  'TASK247_M01_03_60_ITEM_SOURCE_TRACE.tsv',
  'TASK248_M01_04_70_ITEM_SOURCE_TRACE.tsv',
  'TASK249_M01_05_06_210_ITEM_SOURCE_TRACE.tsv',
]

function readRows(filename: string) {
  const [header, ...rest] = readFileSync(resolve('docs/audits', filename), 'utf8')
    .trimEnd()
    .split('\n')
  const keys = header.split('\t')
  return rest.map(line => {
    const cells = line.split('\t')
    expect(cells.length, filename + ': TSV column count').toBe(keys.length)
    return Object.fromEntries(keys.map((key, index) => [key, cells[index] ?? '']))
  })
}

describe('M01 400-item page-level source-audit census', () => {
  it('preserves all original question IDs, sequence, and per-file census', () => {
    const allQuestions = chapters.flatMap(chapter => chapter.questions)
    expect(allQuestions).toHaveLength(400)
    const byFile = files.map(readRows)
    expect(byFile.map(part => part.length)).toEqual([60, 60, 70, 210])
    const rows = byFile.flat()
    expect(new Set(rows.map(r => r.question_id)).size).toBe(400)
    allQuestions.forEach((q, i) => {
      const row = rows[i]
      expect(row.question_id).toBe(q.id)
      expect(row.spec_construct).toBe('S1.INFO')
      expect(row.review_status).toBe('needs_item_editorial_review')
      const conceptOrType = row.concept ?? row.concept_or_math_type
      expect(conceptOrType).toBe(i < 190 ? q.concept : q.type)
    })
  })

  it('distinguishes topic citations from editorially verified items and unlocated material', () => {
    const rows = files.flatMap(readRows)
    const statuses = rows.reduce<Record<string, number>>((counts, row) => {
      counts[row.source_status] = (counts[row.source_status] ?? 0) + 1
      return counts
    }, {})
    expect(statuses).toEqual({
      topic_supported: 239,
      partial: 149,
      source_gap: 12,
    })
    for (const row of rows) {
      expect(row.evidence_note.length, row.question_id).toBeGreaterThan(14)
      if (row.source_status === 'source_gap') {
        expect(row.book_id).toBe('')
        expect(row.printed_page).toBe('')
        expect(row.book_url).toBe('')
      } else {
        expect(['topic_supported', 'partial']).toContain(row.source_status)
        expect(row.book_id, row.question_id).not.toBe('')
        expect(row.printed_page, row.question_id).toMatch(/^\d+(?:-\d+)?$/)
        expect(row.book_url).toMatch(/^https:\/\/drive\.google\.com\/file\/d\//)
      }
    }
  })

  it('retains the twelve unresolved source debts for author/editor review', () => {
    const outstanding = files.flatMap(readRows)
      .filter(row => row.source_status === 'source_gap')
      .map(row => row.question_id)
    expect(outstanding).toEqual([
      'ARS-01-010', 'ARS-01-030', 'ARS-01-050',
      'ARS-02-042', 'ARS-02-057',
      'ARS-03-014', 'ARS-03-037', 'ARS-03-060',
      'ARS-04-013', 'ARS-04-014',
      'ARS-05-016', 'ARS-05-024',
    ])
  })
})
