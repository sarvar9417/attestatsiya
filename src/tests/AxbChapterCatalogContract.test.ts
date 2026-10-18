import { describe, expect, it } from 'vitest'
import { axbChaptersSchema } from '../features/exam/backendGateway'

const validCatalog = () => Array.from({ length: 19 }, (_, i) => ({
  chapter_no: i + 1,
  total_pdf: 30 as const,
  published_count: i === 15 ? 3 : i === 18 ? 27 : 30,
  review_count: i === 15 ? 27 : i === 18 ? 3 : 0,
}))

describe('AXB chapter catalog contract', () => {
  it('accepts the source-backed 19 unique chapters with partial review pools', () => {
    expect(axbChaptersSchema.safeParse(validCatalog()).success).toBe(true)
  })
  it('rejects a duplicate chapter even when 19 rows are returned', () => {
    const rows = validCatalog()
    rows[18] = { ...rows[18], chapter_no: 16 }
    expect(axbChaptersSchema.safeParse(rows).success).toBe(false)
  })
  it('rejects counts that exceed the 30-question PDF chapter pool', () => {
    const rows = validCatalog()
    rows[0] = { ...rows[0], published_count: 29, review_count: 2 }
    expect(axbChaptersSchema.safeParse(rows).success).toBe(false)
  })
  it('rejects a wrong total or impossible published count', () => {
    const rows = validCatalog()
    expect(axbChaptersSchema.safeParse(rows.map((x,i) => i === 0 ? { ...x, total_pdf: 31 } : x)).success).toBe(false)
    expect(axbChaptersSchema.safeParse(rows.map((x,i) => i === 0 ? { ...x, published_count: 31 } : x)).success).toBe(false)
  })
})
