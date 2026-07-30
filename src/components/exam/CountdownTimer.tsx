import { Clock, AlertTriangle } from 'lucide-react'

interface CountdownTimerProps {
  remainingSeconds: number
  totalSeconds: number
}

function fmtHMS(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function CountdownTimer({ remainingSeconds, totalSeconds }: CountdownTimerProps) {
  const formatted = fmtHMS(remainingSeconds)
  const totalFormatted = fmtHMS(totalSeconds)

  const urgent = remainingSeconds <= 300   // 5 min
  const warning = remainingSeconds <= 900  // 15 min

  const pct = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0

  const statusLabel = urgent
    ? 'Vaqt tugayapti!'
    : warning
      ? 'Vaqt kam qoldi'
      : 'Qolgan vaqt'

  const ringColor = urgent
    ? 'stroke-destructive'
    : warning
      ? 'stroke-warning'
      : 'stroke-primary'

  const R = 34
  const CIRC = 2 * Math.PI * R
  const offset = CIRC * (1 - pct / 100)

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {statusLabel}
        </span>
        {urgent && <AlertTriangle size={14} className="text-destructive" />}
      </div>

      <div className="flex items-center gap-4">
        {/* SVG ring */}
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r={R}
              fill="none"
              strokeWidth="5"
              className="stroke-muted"
            />
            <circle
              cx="40" cy="40" r={R}
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              className={`${ringColor} transition-all duration-1000 linear`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock size={16} className={urgent ? 'text-destructive' : 'text-primary'} />
          </div>
        </div>

        {/* Time display */}
        <div>
          <span
            className={`font-mono font-bold text-2xl tracking-tight tabular-nums ${
              urgent
                ? 'text-destructive'
                : warning
                  ? 'text-warning'
                  : 'text-foreground'
            }`}
          >
            {formatted}
          </span>
          <p className="text-[10px] text-muted-foreground">
            dan {totalFormatted}
          </p>
        </div>
      </div>
    </div>
  )
}
