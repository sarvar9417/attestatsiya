import type { LessonSummary } from './contentApi'
import type { CatalogModule } from './catalog'

/**
 * M08 Python/JavaScript V2 is a single atomic learning-catalogue release.
 * Pending AI-authored review/draft lessons MUST remain invisible.
 * Existing M08 learner progress and legacy catalogue remain untouched until all
 * 14 core chapters have been reviewed and independently published.
 */
const CORE_SLUGS = [
  ...Array.from({ length: 7 }, (_, i) => `pyjs-v2-P0${i + 1}`),
  ...Array.from({ length: 7 }, (_, i) => `pyjs-v2-J0${i + 1}`),
] as const

const OPTIONAL_APPENDIX = /^pyjs-v2-A0[1-3]$/

export function withPublishedPyjsV2Lessons(
  module: CatalogModule,
  lessons: readonly LessonSummary[],
): CatalogModule {
  if (module.code !== 'M08') return module

  const published = lessons.filter(lesson => lesson.status === 'published')
  const core = new Map(
    published.filter(lesson => CORE_SLUGS.some(slug => slug === lesson.slug))
      .map(lesson => [lesson.slug, lesson]),
  )

  // Exactly 14 unique, non-empty published chapters. A partial rollout is
  // deliberately hidden even if a backend returns some of its lesson rows.
  if (core.size !== CORE_SLUGS.length ||
      CORE_SLUGS.some(slug => !core.get(slug)?.body_mdx?.trim())) {
    return module
  }

  const approved = [
    ...CORE_SLUGS.map(slug => core.get(slug)!),
    ...published.filter(lesson => OPTIONAL_APPENDIX.test(lesson.slug)),
  ].sort((a, b) => a.order_idx - b.order_idx)

  return {
    ...module,
    subtopics: approved.map(lesson => ({
      id: lesson.id,
      code: lesson.slug,
      title: lesson.title_uz,
    })),
  }
}
