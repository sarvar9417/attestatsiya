import { describe, expect, it } from 'vitest'
import { MODULES } from '../data/contentTree'
import { mergeCatalog } from '../features/content/catalog'
import type { LessonSummary } from '../features/content/contentApi'
import { withPublishedPyjsV2Lessons } from '../features/content/pyjsV2Catalog'

const m08 = mergeCatalog(MODULES, []).find(m => m.code === 'M08')!
const slugs = [
  ...Array.from({ length: 7 }, (_, i) => `pyjs-v2-P0${i + 1}`),
  ...Array.from({ length: 7 }, (_, i) => `pyjs-v2-J0${i + 1}`),
]

function lesson(
  slug: string,
  status: string = 'published',
  extras: Partial<LessonSummary> = {},
): LessonSummary {
  return {
    id: `uuid-${slug}`,
    module_id: 'uuid-m08',
    title_uz: slug,
    slug,
    body_mdx: '# Source-verified lesson',
    blocks: [],
    blocks_kind: 'chapter',
    est_minutes: 25,
    order_idx: 201 + slugs.indexOf(slug),
    status,
    constructs: [],
    ...extras,
  }
}

describe('M08 V2 publication gate', () => {
  it('review lessons are not exposed in the learner catalogue', () => {
    const staged = slugs.map(slug => lesson(slug, 'review'))
    expect(withPublishedPyjsV2Lessons(m08, staged)).toBe(m08)
    expect(m08.subtopics).toHaveLength(12)
  })

  it('a partial 13/14 or mixed review/published release does not replace legacy', () => {
    const partial = slugs.map(slug => lesson(slug))
    expect(withPublishedPyjsV2Lessons(m08, partial.slice(0, 13))).toBe(m08)
    partial[13] = lesson(slugs[13], 'review')
    expect(withPublishedPyjsV2Lessons(m08, partial)).toBe(m08)
  })

  it('empty-body lessons fail closed even when marked published', () => {
    const lessons = slugs.map(slug => lesson(slug))
    lessons[4] = lesson(slugs[4], 'published', { body_mdx: '  ' })
    expect(withPublishedPyjsV2Lessons(m08, lessons)).toBe(m08)
  })

  it('all 14 unique published chapters replace M08 without mutating the static catalogue', () => {
    const lessons = slugs.map(slug => lesson(slug)).reverse()
    const updated = withPublishedPyjsV2Lessons(m08, lessons)
    expect(updated).not.toBe(m08)
    expect(updated.subtopics).toHaveLength(14)
    expect(updated.subtopics.map(sub => sub.code)).toEqual(slugs)
    expect(updated.subtopics[0].id).toBe('uuid-pyjs-v2-P01')
    expect(m08.subtopics).toHaveLength(12)
    expect(updated.examQuestionCount).toBe(3)
  })

  it('only separately published appendix is included after all 14 core chapters', () => {
    const lessons = [
      ...slugs.map(slug => lesson(slug)),
      lesson('pyjs-v2-A01', 'review', { order_idx: 215 }),
      lesson('pyjs-v2-A02', 'published', { order_idx: 216 }),
      lesson('pyjs-v2-other', 'published', { order_idx: 217 }),
    ]
    const updated = withPublishedPyjsV2Lessons(m08, lessons)
    expect(updated.subtopics).toHaveLength(15)
    expect(updated.subtopics[14].code).toBe('pyjs-v2-A02')
  })

  it('never changes another module', () => {
    const m06 = mergeCatalog(MODULES, []).find(m => m.code === 'M06')!
    expect(withPublishedPyjsV2Lessons(m06, slugs.map(slug => lesson(slug)))).toBe(m06)
  })
})
