import { useEffect, useState } from 'react'
import { MODULES } from '../data/contentTree'
import { listModules } from '../features/content/contentApi'
import { mergeCatalog, type CatalogModule } from '../features/content/catalog'

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
      .then((apiModules) => {
        if (cancelled) return
        setState({ modules: mergeCatalog(MODULES, apiModules), loading: false, online: true })
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
