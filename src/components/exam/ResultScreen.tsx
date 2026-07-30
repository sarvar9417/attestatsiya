import { CheckCircle2, XCircle, BarChart3, RotateCcw } from 'lucide-react'

interface ResultScreenProps {
  answered: number
  total: number
  onRestart: () => void
}

export default function ResultScreen({ answered, total, onRestart }: ResultScreenProps) {
  const score = answered * 2
  const maxScore = total * 2
  const pct = Math.round((score / maxScore) * 100)

  const passed = pct >= 60

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-sm w-full">
        {/* Score card */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 text-center">
          {/* Status icon */}
          <div
            className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              passed ? 'bg-success/10' : 'bg-destructive/10'
            }`}
          >
            {passed ? (
              <CheckCircle2 size={32} className="text-success" />
            ) : (
              <XCircle size={32} className="text-destructive" />
            )}
          </div>

          {/* Score */}
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Sinov yakunlandi
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {passed ? 'Tabriklaymiz! Muvaffaqiyatli yakunlandi.' : 'Qayta urinib ko‘ring.'}
          </p>

          <div className="inline-flex items-baseline gap-1.5 mb-2">
            <span className="text-5xl font-black text-foreground tabular-nums">{score}</span>
            <span className="text-xl font-semibold text-muted-foreground">/ {maxScore}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{pct}% to‘g‘ri javob</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-lg font-bold text-success tabular-nums">{answered}</p>
              <p className="text-[10px] text-muted-foreground">To‘g‘ri</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-lg font-bold text-destructive tabular-nums">{total - answered}</p>
              <p className="text-[10px] text-muted-foreground">Noto‘g‘ri</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-lg font-bold text-foreground tabular-nums">{pct}%</p>
              <p className="text-[10px] text-muted-foreground">Natija</p>
            </div>
          </div>

          {/* Breakdown */}
          {[
            { label: 'Bilish', score: Math.floor(answered * 0.4), max: 4 },
            { label: 'Qo‘llash', score: Math.floor(answered * 0.35), max: 4 },
            { label: 'Mulohaza', score: Math.max(0, answered - Math.floor(answered * 0.75)), max: 2 },
          ].map((g) => (
            <div key={g.label} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/50 mb-2">
              <BarChart3 size={14} className="text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{g.label}</span>
                  <span className="text-xs font-bold text-foreground tabular-nums">
                    {g.score}/{g.max}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(g.score / Math.max(g.max, 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Restart */}
        <button
          type="button"
          onClick={onRestart}
          className="mt-4 w-full py-3 rounded-lg text-sm font-semibold
                     bg-primary text-primary-foreground hover:bg-primary/90
                     transition-colors inline-flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          Sinovni qayta boshlash
        </button>
      </div>
    </main>
  )
}
