import { useEffect, useState } from 'react'
import { MODULES } from '../data/contentTree'
import { getModuleDetail, listModules } from '../features/content/contentApi'
import { mergeCatalog, type CatalogModule } from '../features/content/catalog'
import { selectPublishedM09V2Lessons } from '../features/content/m09AccessEdition'

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
        // TASK-205: M09 V2 is an atomic six-chapter edition. No partial
        // release, no review lessons in the learner catalog. Legacy M09 remains
        // visible until all six chapters have been published by a reviewer.
        try {
          const detail = await getModuleDetail('M09')
          const chapters = selectPublishedM09V2Lessons(detail.lessons)
          const mod = base.find(module => module.code === 'M09')
          if (mod && chapters) mod.subtopics = chapters
        } catch {
          // Keep the existing M09 catalog if the API is offline or unpublished.
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
