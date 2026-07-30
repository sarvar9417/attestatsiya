import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                 text-muted-foreground hover:text-foreground
                 hover:bg-muted transition-colors duration-150"
      aria-label={dark ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘i rejimga o‘tish'}
    >
      {dark ? <Sun size={14} /> : <Moon size={14} />}
      <span className="hidden sm:inline">{dark ? 'Yorug‘' : 'Qorong‘i'}</span>
    </button>
  )
}
