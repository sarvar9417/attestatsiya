import { AlertTriangle, Check, Bookmark, X } from 'lucide-react'

interface SubmitTestDialogProps {
  open: boolean
  answered: number
  unanswered: number
  markedForReview: number
  remainingTime: string
  onCancel: () => void
  onConfirm: () => void
}

export default function SubmitTestDialog({
  open,
  answered,
  unanswered,
  markedForReview,
  remainingTime,
  onCancel,
  onConfirm,
}: SubmitTestDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Testni yakunlash"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative bg-card border border-border rounded-xl shadow-xl max-w-sm w-full animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle size={16} className="text-warning" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Testni yakunlash</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Yopish"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Testni yakunlashni tasdiqlaysizmi? Quyidagi statistikani tekshiring:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-success/5 border border-success/20">
              <Check size={14} className="text-success" />
              <div>
                <p className="text-sm font-bold text-foreground tabular-nums">{answered}</p>
                <p className="text-[10px] text-muted-foreground">Javob berilgan</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted border border-border">
              <X size={14} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-bold text-foreground tabular-nums">{unanswered}</p>
                <p className="text-[10px] text-muted-foreground">Javob berilmagan</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-warning/5 border border-warning/20">
              <Bookmark size={14} className="text-warning" />
              <div>
                <p className="text-sm font-bold text-foreground tabular-nums">{markedForReview}</p>
                <p className="text-[10px] text-muted-foreground">Belgilangan</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted border border-border">
              <span className="font-mono text-sm font-bold text-foreground">⏱</span>
              <div>
                <p className="text-sm font-bold text-foreground tabular-nums">{remainingTime}</p>
                <p className="text-[10px] text-muted-foreground">Qolgan vaqt</p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            {unanswered > 0
              ? `${unanswered} ta savolga javob berilmagan. Yakunlagach, bu savollar noto‘g‘ri hisoblanadi.`
              : 'Barcha savollarga javob berilgan. Natijani ko‘rish uchun yakunlang.'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Testni yakunlash
          </button>
        </div>
      </div>
    </div>
  )
}
