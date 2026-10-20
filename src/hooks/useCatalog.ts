import { M12_LEARNER_RELEASE_APPROVED } from '../features/content/m12ReleaseGate'
import { useEffect, useState } from 'react'
import { MODULES } from '../data/contentTree'
import { getModuleDetail, listModules } from '../features/content/contentApi'
import { mergeCatalog, selectPublishedNetworkV2Catalog, publishedScratchLogoSubtopics, type CatalogModule } from '../features/content/catalog'
import { withPublishedPyjsV2Lessons } from '../features/content/pyjsV2Catalog'

export interface CatalogState {
  modules: CatalogModule[]
  loading: boolean
  online: boolean
}

const STATIC_MODULES: CatalogModule[] = mergeCatalog(MODULES, [])

/**
 * Gibrid katalog (T-010): darhol statik contentTree bilan render qiladi,
 * backend published modullari kelgach meta-ma'lumotni qoplaydi. API xatosida
 * statik katalog saqlanadi va `online` false bo'ladi (UI buzilmaydi).
 */
export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>(() => ({
    modules: STATIC_MODULES,
    loading: true,
    online: false,
  }))

  useEffect(() => {
    let cancelled = false
    listModules()
      .then(async (apiModules) => {
        // Fail closed: only show source-based V2 lessons when ALL eight chapters
        // have been expert-published. No draft/review slugs are discoverable here.
        const base = mergeCatalog(MODULES, apiModules)
        try {
          const detail = await getModuleDetail('M06')
          const chapters = detail.lessons.filter(
            lesson => lesson.status === 'published' &&
              /^algoritmlash-v2-0[1-8]$/.test(lesson.slug)
          )
          if (chapters.length === 8) {
            const all = detail.lessons.filter(
              lesson => lesson.status === 'published' &&
                lesson.slug.startsWith('algoritmlash-v2-')
            ).sort((a, b) => a.order_idx - b.order_idx)
            const mod = base.find(module => module.code === 'M06')
            if (mod) mod.subtopics = all.map(lesson => ({
              id: lesson.id, code: lesson.slug, title: lesson.title_uz,
            }))
          }
        } catch {
          // Offline or incomplete rollout: retain the previously published M06.
        }
        // M07: prefer the complete 12-chapter published Scratch/LOGO curriculum.
        // The old six static summaries are only an offline/incomplete fallback.
        try {
          const detail = await getModuleDetail('M07')
          const chapters = publishedScratchLogoSubtopics(detail.lessons)
          const mod = base.find(module => module.code === 'M07')
          if (mod && chapters) mod.subtopics = chapters
        } catch {
          // Never hide the module when the API is offline.
        }
        // M08 Python/JavaScript: atomic cutover ONLY after all 14 non-empty
        // source-backed lessons are published. Unpublished appendices remain hidden.
        try {
          const mod = base.find(module => module.code === 'M08')
          if (mod) {
            const detail = await getModuleDetail('M08')
            const updated = withPublishedPyjsV2Lessons(mod, detail.lessons)
            const index = base.indexOf(mod)
            base[index] = updated
          }
        } catch {
          // Offline/incomplete backend: preserve the existing M08 catalogue.
        }
        // TASK-212: Use the exact published seven-chapter M13 AXR edition,
        // otherwise retain the previous M13 catalog. Never show review questions.
        try {
          const detail = await getModuleDetail('M13')
          const chapters = detail.lessons.filter(
            lesson => lesson.status === 'published' &&
              /^m13-axr-0[1-7]$/.test(lesson.slug)
          )
          if (chapters.length === 7) {
            const mod = base.find(module => module.code === 'M13')
            if (mod) mod.subtopics = chapters
              .sort((a, b) => a.order_idx - b.order_idx)
              .map(lesson => ({
                id: lesson.id, code: lesson.slug, title: lesson.title_uz,
              }))
          }
        } catch {
          // Legacy M13 stays available when API is offline or incomplete.
        }
        let learnerModules = base
        if (M12_LEARNER_RELEASE_APPROVED) {
          try {
            learnerModules = selectPublishedNetworkV2Catalog(base, await getModuleDetail('M12'))
          } catch {
            // Fail closed on incomplete M12 or unavailable API; preserve legacy catalog.
          }
        }
        if (!cancelled) setState({ modules: learnerModules, loading: false, online: true })
      })
      .catch(() => {
        if (cancelled) return
        setState({ modules: STATIC_MODULES, loading: false, online: false })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
