import { describe, expect, it } from 'vitest'
import { publishedScratchLogoSubtopics } from '../features/content/catalog'
import type { LessonSummary } from '../features/content/contentApi'

const lesson = (n: number): LessonSummary => ({
  id: `lesson-${n}`, module_id: 'm07', title_uz: `Scratch chapter ${n}`,
  slug: `scratch-chapter-${String(n).padStart(2, '0')}`,
  body_mdx: '# Verified body', blocks: null, blocks_kind: null,
  est_minutes: 20, order_idx: n, status: 'published', constructs: [],
})

describe('M07 exact twelve-chapter publication gate', () => {
  it('accepts exactly twelve unique published chapters', () => {
    expect(publishedScratchLogoSubtopics(Array.from({ length: 12 }, (_, i) => lesson(i + 1))))?.toHaveLength(12)
  })
  it('rejects thirteen published chapters rather than leaking an unreviewed edition', () => {
    expect(publishedScratchLogoSubtopics(Array.from({ length: 13 }, (_, i) => lesson(i + 1)))).toBeNull()
  })
  it('rejects gaps and duplicate ordering', () => {
    const chapters = Array.from({ length: 12 }, (_, i) => lesson(i + 1))
    expect(publishedScratchLogoSubtopics(chapters.slice(1))).toBeNull()
    expect(publishedScratchLogoSubtopics([...chapters.slice(0, 11), { ...chapters[11], order_idx: 11 }])).toBeNull()
  })
})
