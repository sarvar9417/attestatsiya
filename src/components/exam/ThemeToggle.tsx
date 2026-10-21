import { Moon, Sun } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { isDark, setThemePreference, subscribeToTheme } from '../../utils/theme'

export default function ThemeToggle() {
  // Reading and writing `theme` independently previously overwrote the
  // saved "system" preference with "light" as soon as this button mounted.
  const dark = useSyncExternalStore(subscribeToTheme, isDark, () => false)

  return (
    <button
      type="button"
      onClick={() => setThemePreference(dark ? 'light' : 'dark')}
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
