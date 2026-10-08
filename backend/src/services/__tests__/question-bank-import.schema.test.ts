import { describe, expect, it } from 'vitest'
import { professionalBankImportRequestSchema } from '../../schemas/admin.js'

function validItem() {
  return {
    external_id: 'AXB-01-001',
    format: 'Y1' as const,
    construct_code: 'S1.INFO.01',
    cognitive: 'bilish' as const,
    difficulty: 2,
    stem_md: 'Informatika nimani o‘rganadi?',
    options: [
      { content_md: 'A' },
      { content_md: 'B' },
      { content_md: 'C' },
      { content_md: 'D' },
    ],
    correct_index: 0,
    explanation_md: 'A variant to‘g‘ri.',
    source_locator: 'ICT5, PDF 10–12',
    bank_pdf_page: 4,
    assets: [],
  }
}

describe('professionalBankImportRequestSchema', () => {
  it('valid Y1 bank batchni qabul qiladi', () => {
    const parsed = professionalBankImportRequestSchema.parse({
      items: [validItem()],
    })

    expect(parsed.items).toHaveLength(1)
    expect(parsed.items[0].external_id).toBe('AXB-01-001')
    expect(parsed.items[0].options).toHaveLength(4)
  })

  it('answer index yoki option soni noto‘g‘ri bo‘lsa rad etadi', () => {
    const item = validItem()
    item.options = item.options.slice(0, 3)
    item.correct_index = 4

    expect(() =>
      professionalBankImportRequestSchema.parse({ items: [item] })
    ).toThrow()
  })

  it('100 tadan katta batchni rad etadi', () => {
    const items = Array.from({ length: 101 }, (_, index) => ({
      ...validItem(),
      external_id: `AXB-98-${String(index).padStart(3, '0')}`,
    }))

    expect(() =>
      professionalBankImportRequestSchema.parse({ items })
    ).toThrow()
  })
})
