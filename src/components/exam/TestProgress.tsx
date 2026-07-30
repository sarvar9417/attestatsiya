import { BookOpen } from 'lucide-react'

import { BookmarkCheck } from 'lucide-react'

interface TestProgressProps {
  answered: number
  total: number
  currentNumber: number
  markedForReview?: number
  testName?: string
}

export default function TestProgress({ answered, total, currentNumber, markedForReview = 0, testName }: TestProgressProps) {
  const pct = total > 0 ? (answered / total) * 100 : 0

  return (
    <div className="space-y-2.5">
      {/* Test name row */}
      {testName && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen size={13} />
          <span className="font-medium">{testName}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground text-sm">
            <span className="text-muted-foreground font-normal">Savol</span>{' '}
            {currentNumber} / {total}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground tabular-nums flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Bajarilgan: {answered}
          </span>
          {markedForReview > 0 && (
            <span className="text-warning tabular-nums flex items-center gap-1">
              <BookmarkCheck size={11} />
              Belgilangan: {markedForReview}
            </span>
          )}
        </div>
      </div>
      <div className="relative">
        <div
          className="h-2 bg-muted rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={answered}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Test bajarilish jarayoni"
        >
          <div
            className="h-full rounded-full bg-success transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="absolute -top-0.5 right-0 text-[10px] font-mono text-muted-foreground tabular-nums">
          {pct}%
        </span>
      </div>
    </div>
  )
}
