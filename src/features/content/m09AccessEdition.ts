/** Fail-closed M09 Access V2 edition selector. Public catalog only, no keys. */
import type { LessonSummary } from './contentApi'

export const M09_ACCESS_V2_SLUGS = [
  'm09-v2-relyatsion-model',
  'm09-v2-access-maydonlar',
  'm09-v2-kalit-va-yaxlitlik',
  'm09-v2-query-design',
  'm09-v2-access-sql',
  'm09-v2-murakkab-sql',
] as const

const slugSet: ReadonlySet<string> = new Set(M09_ACCESS_V2_SLUGS)

export const isM09V2LessonSlug = (slug: string): boolean => slugSet.has(slug)

export function selectPublishedM09V2Lessons(
  lessons: Pick<LessonSummary, 'id' | 'slug' | 'title_uz' | 'order_idx' | 'status'>[],
): { id: string; code: string; title: string }[] | null {
  const published = lessons.filter(
    lesson => lesson.status === 'published' && isM09V2LessonSlug(lesson.slug),
  )
  if (
    published.length !== M09_ACCESS_V2_SLUGS.length ||
    new Set(published.map(lesson => lesson.slug)).size !== M09_ACCESS_V2_SLUGS.length
  ) return null

  return [...published].sort((a, b) => a.order_idx - b.order_idx)
    .map(lesson => ({ id: lesson.id, code: lesson.slug, title: lesson.title_uz }))
}
