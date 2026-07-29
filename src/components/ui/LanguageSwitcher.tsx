import { useState, useRef, useEffect } from 'react'
import { Languages, Check } from 'lucide-react'
import { useI18n, LOCALES } from '../../i18n'
import type { Locale } from '../../i18n'

/**
 * A small language switcher button that opens a dropdown with available locales.
 * Renders as an icon button + label in expanded view.
 */
interface LanguageSwitcherProps {
  collapsed?: boolean
}

export default function LanguageSwitcher({ collapsed }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const currentLabel = LOCALES.find((l) => l.code === locale)?.native ?? locale

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={currentLabel}
        aria-expanded={open}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium
          text-gray-400 dark:text-gray-500
          hover:text-primary-600 dark:hover:text-primary-400
          hover:bg-gray-50 dark:hover:bg-gray-800
          transition-colors"
        title={currentLabel}
      >
        <Languages size={16} className="shrink-0" />
        {!collapsed && (
          <span className="truncate">{currentLabel}</span>
        )}
      </button>

      {open && (
        <div
          className={`absolute bottom-full left-0 mb-1 z-50 min-w-[140px] bg-white dark:bg-gray-800
            rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1
            ${collapsed ? 'left-8 bottom-auto top-0 mb-0 ml-1' : ''}`}
        >
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code as Locale)
                setOpen(false)
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-sm
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors text-left"
            >
              <span>{l.native}</span>
              {locale === l.code && (
                <Check size={14} className="text-primary-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
