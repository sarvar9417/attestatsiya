import { monitoring } from '../lib/monitoring'

const STORAGE_KEY = 'theme'

type Theme = 'light' | 'dark'
type ThemePreference = Theme | 'system'

// React sync listeners
const listeners = new Set<() => void>()

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): ThemePreference | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'dark' || v === 'light' || v === 'system') return v
  } catch (e) { monitoring.captureMessage('getStoredTheme failed: ' + (e instanceof Error ? e.message : String(e)), 'warn') }
  return null
}

/** Returns the raw preference: 'light' | 'dark' | 'system' (default) */
export function getThemePreference(): ThemePreference {
  return getStoredTheme() ?? 'system'
}

/** Resolves current effective theme (light or dark) */
function getTheme(): Theme {
  const pref = getThemePreference()
  if (pref === 'system') return getSystemTheme()
  return pref
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const meta = document.getElementById('theme-color')
  if (theme === 'dark') {
    root.classList.add('dark')
    if (meta) meta.setAttribute('content', '#030712')
  } else {
    root.classList.remove('dark')
    if (meta) meta.setAttribute('content', '#ffffff')
  }
}

export function initTheme() {
  applyTheme(getTheme())

  // Listen for system theme changes — always listen, apply only when preference is 'system'
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (getThemePreference() === 'system') {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })
}

/** Cycles: light → dark → system → light */
export function cycleTheme(): ThemePreference {
  const current = getThemePreference()
  const next: ThemePreference = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light'
  try { localStorage.setItem(STORAGE_KEY, next) } catch (e) { monitoring.captureMessage('cycleTheme setItem failed: ' + (e instanceof Error ? e.message : String(e)), 'warn') }
  applyTheme(next === 'system' ? getSystemTheme() : next)
  listeners.forEach(cb => cb()) // notify React subscribers
  return next
}

export function isDark(): boolean {
  return document.documentElement.classList.contains('dark')
}

/** Subscribe for React useSyncExternalStore */
export function subscribeToTheme(callback: () => void): () => void {
  listeners.add(callback)
  return () => listeners.delete(callback)
}
