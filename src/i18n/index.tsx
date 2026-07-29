import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { Locale, TranslationStrings } from './types'
import { monitoring } from '../lib/monitoring'
// Provider'siz holatlar (testlar yoki edge-case) uchun statik uz tarjima fallback'i.
// Production'da App doim <I18nProvider> bilan o'raydi — bu ishlatilmaydi.
import uzFallback from './uz.json'

/* ─── Storage ─── */

const STORAGE_KEY = 'locale'

function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'uz' || stored === 'en' || stored === 'ru') return stored
  } catch (e) { monitoring.captureMessage('getStoredLocale failed: ' + (e instanceof Error ? e.message : String(e)), 'warn') }
  return 'uz'  // default
}

function setStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch (e) { monitoring.captureMessage('setStoredLocale failed: ' + (e instanceof Error ? e.message : String(e)), 'warn') }
}

/* ─── Loader ─── */

function asTranslations(data: Record<string, unknown>): TranslationStrings {
  return data as unknown as TranslationStrings
}

const cache = new Map<Locale, TranslationStrings>()

async function loadLocale(locale: Locale): Promise<TranslationStrings> {
  const cached = cache.get(locale)
  if (cached) return cached

  let data: TranslationStrings
  switch (locale) {
    case 'en':
      data = asTranslations((await import('./en.json')).default)
      break
    case 'ru':
      data = asTranslations((await import('./ru.json')).default)
      break
    case 'uz':
    default:
      data = asTranslations((await import('./uz.json')).default)
      break
  }
  cache.set(locale, data)
  return data
}

/* ─── Interpolation + Pluralization ─── */

type Params = Record<string, string | number>

/**
 * Plural formani aniqlash:
 * - Uzbek: doim "other" ishlatiladi (1 ta, 5 ta — bir xil)
 * - English: one/other (1 item, 2 items)
 * - Russian: one/few/many/other (1 день, 2 дня, 5 дней)
 */
function getPluralForm(count: number, locale: Locale): 'one' | 'few' | 'many' | 'other' {
  if (locale === 'uz') return 'other'
  if (locale === 'en') return count === 1 ? 'one' : 'other'
  // Russian
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'one'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few'
  if (mod10 === 0 || (mod10 >= 5 && mod10 <= 9) || (mod100 >= 11 && mod100 <= 14)) return 'many'
  return 'other'
}

function interpolate(template: string, params?: Params, locale: Locale = 'uz'): string {
  if (!params) return template
  // Plural: {count, plural, one {# item} other {# items}}
  let result = template.replace(
    /\{(\w+),\s*plural,\s*one\s*\{([^}]*)\}\s*other\s*\{([^}]*)\}\}/g,
    (_, key, singular, plural) => {
      const val = params[key]
      if (val === undefined) return `{${key}}`
      const n = Number(val)
      const form = getPluralForm(n, locale)
      const pattern = form === 'one' ? singular : plural
      return pattern.replace(/#/g, String(n))
    }
  )
  // Simple: {variable}
  result = result.replace(/\{(\w+)\}/g, (_, key) => {
    const val = params[key]
    return val !== undefined ? String(val) : `{${key}}`
  })
  return result
}

/* ─── Context ─── */

interface I18nContextValue {
  locale: Locale
  loading: boolean
  t: (key: keyof TranslationStrings, params?: Params) => string
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

/* ─── Provider ─── */

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale)
  const [dict, setDict] = useState<TranslationStrings | null>(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    setLoading(true)
    loadLocale(locale).then((data) => {
      if (mountedRef.current) {
        setDict(data)
        setLoading(false)
      }
    }).catch((err) => {
      monitoring.captureMessage('i18n load failed: ' + (err instanceof Error ? err.message : String(err)), 'warn')
      if (mountedRef.current) {
        // Fallback to empty dict — app still works, just shows missing strings
        setDict(null)
        setLoading(false)
      }
    })
  }, [locale])

  // Sync <html lang> attribute for accessibility
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const t = useCallback((key: keyof TranslationStrings, params?: Params): string => {
    const template = dict?.[key]
    if (template === undefined) return key // fallback: show the key name
    return interpolate(template, params, locale)
  }, [dict, locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setStoredLocale(newLocale)
    setLocaleState(newLocale)
  }, [])

  return (
    <I18nContext.Provider value={{ locale, loading, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

/* ─── Hook ─── */

// Provider yo'q bo'lganda ishlatiladigan fallback — haqiqiy uz tarjimalar bilan.
// Shu sabab provider'siz render qilingan komponentlar (masalan testlar) ham
// to'g'ri matn ko'rsatadi va crash bo'lmaydi.
const FALLBACK_DICT = uzFallback as Record<string, string>
const FALLBACK_CONTEXT: I18nContextValue = {
  locale: 'uz',
  loading: false,
  t: (key, params) => {
    const template = FALLBACK_DICT[key as string]
    return template === undefined ? (key as string) : interpolate(template, params, 'uz')
  },
  setLocale: () => { /* no-op outside provider */ },
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext) ?? FALLBACK_CONTEXT
}

/* ─── Re-export types ─── */

export type { Locale, TranslationStrings }
export { LOCALES } from './types'
