import { useEffect, useState } from 'react'
import { MODULES } from '../data/contentTree'
import { getModuleDetail, listModules } from '../features/content/contentApi'
import { mergeCatalog, type CatalogModule } from '../features/content/catalog'
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
        // M08: only switch from legacy subjects to the 14 expert-approved
        // Python/JavaScript chapters when every core lesson is published.
        // No preview/review rows or answer keys enter the learner catalogue.
        try {
          const m08 = base.find(module => module.code === 'M08')
          if (m08) {
            const detail = await getModuleDetail('M08')
            const next = withPublishedPyjsV2Lessons(m08, detail.lessons)
            const index = base.indexOf(m08)
            base[index] = next
          }
        } catch {
          // Incomplete rollout or offline backend: keep the legacy M08 topics.
        }
        if (!cancelled) setState({ modules: base, loading: false, online: true })
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
