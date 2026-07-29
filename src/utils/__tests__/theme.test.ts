import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initTheme, cycleTheme, isDark, getThemePreference, subscribeToTheme } from '../theme'

beforeEach(() => {
  localStorage.clear()
  // Reset <html> class list between tests
  document.documentElement.className = ''
  // Ensure theme-color meta tag exists
  let meta = document.getElementById('theme-color') as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.id = 'theme-color'
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', '#1a56db')
})

afterEach(() => {
  vi.restoreAllMocks()
})

function mockSystemTheme(dark: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = []
  const mql = {
    matches: dark,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.push(cb)
    },
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(cb)
      if (idx !== -1) listeners.splice(idx, 1)
    },
    // Helper to simulate system theme change
    _dispatch(dark: boolean) {
      for (const cb of listeners) {
        cb({ matches: dark } as unknown as MediaQueryListEvent)
      }
    },
  }
  vi.spyOn(window, 'matchMedia').mockReturnValue(mql as unknown as MediaQueryList)
  return mql
}

describe('initTheme', () => {
  it('applies dark class when system prefers dark and no stored preference', () => {
    mockSystemTheme(true)
    initTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('applies light when system prefers light and no stored preference', () => {
    mockSystemTheme(false)
    initTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('uses stored dark preference over system preference', () => {
    localStorage.setItem('theme', 'dark')
    mockSystemTheme(false) // system says light
    initTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('uses stored light preference over system preference', () => {
    localStorage.setItem('theme', 'light')
    mockSystemTheme(true) // system says dark
    initTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('updates theme-color meta tag for dark mode', () => {
    mockSystemTheme(true)
    initTheme()
    const meta = document.getElementById('theme-color') as HTMLMetaElement
    expect(meta?.getAttribute('content')).toBe('#030712')
  })

  it('updates theme-color meta tag for light mode', () => {
    mockSystemTheme(false)
    initTheme()
    const meta = document.getElementById('theme-color') as HTMLMetaElement
    expect(meta?.getAttribute('content')).toBe('#1a56db')
  })

  it('listens for system theme changes when no stored preference', () => {
    const mql = mockSystemTheme(false)
    initTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Simulate system theme change to dark
    mql._dispatch(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('ignores system theme changes when stored light preference exists', () => {
    localStorage.setItem('theme', 'light')
    const mql = mockSystemTheme(true)
    initTheme()

    // System changes to dark, but stored is light
    mql._dispatch(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('follows system theme changes when stored preference is system', () => {
    localStorage.setItem('theme', 'system')
    const mql = mockSystemTheme(false)
    initTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // System changes to dark
    mql._dispatch(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('handles invalid localStorage value gracefully', () => {
    localStorage.setItem('theme', 'invalid')
    mockSystemTheme(true)
    initTheme()
    // Should fall through to system preference
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('handles localStorage throw gracefully', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('storage error') })
    mockSystemTheme(false)
    // Should not throw
    expect(() => initTheme()).not.toThrow()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

describe('cycleTheme', () => {
  it('cycles from system → light', () => {
    localStorage.setItem('theme', 'system')
    mockSystemTheme(false)
    initTheme()
    expect(getThemePreference()).toBe('system')
    expect(isDark()).toBe(false)

    const result = cycleTheme()
    expect(result).toBe('light')
    expect(getThemePreference()).toBe('light')
    expect(isDark()).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('cycles from light → dark', () => {
    localStorage.setItem('theme', 'light')
    mockSystemTheme(false)
    initTheme()
    expect(isDark()).toBe(false)

    const result = cycleTheme()
    expect(result).toBe('dark')
    expect(getThemePreference()).toBe('dark')
    expect(isDark()).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('cycles from dark → system', () => {
    localStorage.setItem('theme', 'dark')
    mockSystemTheme(true)
    initTheme()
    expect(isDark()).toBe(true)

    const result = cycleTheme()
    expect(result).toBe('system')
    expect(getThemePreference()).toBe('system')
    // Applied theme follows system after cycling to system
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('system')
  })

  it('cycles from no stored preference (system default) → light', () => {
    mockSystemTheme(false)
    initTheme()
    expect(getThemePreference()).toBe('system')
    expect(isDark()).toBe(false)

    cycleTheme()
    // After first cycle, becomes 'light'
    expect(localStorage.getItem('theme')).toBe('light')
    expect(isDark()).toBe(false)
  })

  it('handles localStorage.setItem throw gracefully', () => {
    mockSystemTheme(true)
    initTheme()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota exceeded') })
    // Should not throw even if storage fails
    expect(() => cycleTheme()).not.toThrow()
    // Visual state should still update
    expect(isDark()).toBe(false)
  })

  it('notifies subscribers on cycle', async () => {
    localStorage.setItem('theme', 'light')
    mockSystemTheme(false)
    initTheme()
    const callback = vi.fn()
    const unsubscribe = subscribeToTheme(callback)

    cycleTheme()
    expect(callback).toHaveBeenCalledTimes(1)
    unsubscribe()
  })
})

describe('isDark', () => {
  it('returns true after initTheme with dark system preference', () => {
    mockSystemTheme(true)
    initTheme()
    expect(isDark()).toBe(true)
  })

  it('returns false after initTheme with light system preference', () => {
    mockSystemTheme(false)
    initTheme()
    expect(isDark()).toBe(false)
  })

  it('returns true after cycle from light to dark', () => {
    localStorage.setItem('theme', 'light')
    mockSystemTheme(false)
    initTheme()
    cycleTheme()
    expect(isDark()).toBe(true)
  })

  it('is reactive to class changes', () => {
    // Before init, dark class check
    document.documentElement.classList.add('dark')
    expect(isDark()).toBe(true)
    document.documentElement.classList.remove('dark')
    expect(isDark()).toBe(false)
  })
})
