import { ChevronLeft, ChevronRight, Flag } from 'lucide-react'

interface TestNavigationProps {
  currentIndex: number
  total: number
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
  onFinish: () => void
}

export default function TestNavigation({
  currentIndex,
  total,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onFinish,
}: TestNavigationProps) {
  return (
    <nav
      className="sticky bottom-0 bg-card border-t border-border px-4 py-3"
      aria-label="Test navigatsiyasi"
    >
      <div className="max-w-3xl mx-auto flex items-center gap-2">
        {/* Previous */}
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={onPrev}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                     text-muted-foreground hover:text-foreground hover:bg-muted
                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Oldingi savol"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Oldingi</span>
          <kbd className="hidden sm:inline-flex ml-0.5 px-1 py-0.5 rounded text-[10px] bg-muted text-muted-foreground font-mono">
            ←
          </kbd>
        </button>

        {/* Position indicator */}
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-md tabular-nums">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Finish */}
        <button
          type="button"
          onClick={onFinish}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                     text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Testni yakunlash"
        >
          <Flag size={15} />
          <span className="hidden sm:inline">Yakunlash</span>
        </button>

        {/* Next */}
        <button
          type="button"
          disabled={!canGoNext}
          onClick={onNext}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                     text-muted-foreground hover:text-foreground hover:bg-muted
                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Keyingi savol"
        >
          <span className="hidden sm:inline">Keyingi</span>
          <kbd className="hidden sm:inline-flex mr-0.5 px-1 py-0.5 rounded text-[10px] bg-muted text-muted-foreground font-mono">
            →
          </kbd>
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  )
}
