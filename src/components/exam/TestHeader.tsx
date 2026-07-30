import { HelpCircle, LogOut, Wifi, WifiOff } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

interface TestHeaderProps {
  onExit: () => void
  onHelp: () => void
}

export default function TestHeader({ onExit, onHelp }: TestHeaderProps) {
  // Simulate online status
  const online = navigator.onLine

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 h-12 border-b border-border bg-card"
      role="banner"
    >
      {/* Left: logo + title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">Attestatsiya</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">Test Platformasi</span>
          </div>
        </div>
        <div className="w-px h-4 bg-border" />
        <span className="text-sm text-foreground font-medium truncate">
          Attestatsiya testi
        </span>
      </div>

      {/* Right: status + actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Autosave status */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium">
          {online ? (
            <>
              <Wifi size={12} className="text-success" />
              <span className="text-muted-foreground hidden sm:inline">Avtomatik saqlash</span>
            </>
          ) : (
            <>
              <WifiOff size={12} className="text-destructive" />
              <span className="text-destructive hidden sm:inline">Oflayn</span>
            </>
          )}
        </div>

        <ThemeToggle />

        <button
          type="button"
          onClick={onHelp}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium
                     text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Yordam"
        >
          <HelpCircle size={14} />
          <span className="hidden sm:inline">Yordam</span>
        </button>

        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium
                     text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Chiqish"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Chiqish</span>
        </button>
      </div>
    </header>
  )
}
