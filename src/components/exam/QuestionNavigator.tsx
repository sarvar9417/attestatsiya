import { Check, Bookmark } from 'lucide-react'

export type QuestionState = 'unanswered' | 'answered' | 'current' | 'review' | 'answered-review'

interface QuestionNavigatorProps {
  currentIndex: number
  answered: Set<string>
  markedForReview: Set<string>
  questionIds: string[]
  onNavigate: (index: number) => void
  disabled?: boolean
}

export default function QuestionNavigator({
  currentIndex,
  answered,
  markedForReview,
  questionIds,
  onNavigate,
  disabled,
}: QuestionNavigatorProps) {
  function getState(id: string, index: number): QuestionState {
    const isCurrent = index === currentIndex
    const isAnswered = answered.has(id)
    const isReview = markedForReview.has(id)

    if (isCurrent && isAnswered && isReview) return 'answered-review'
    if (isCurrent) return 'current'
    if (isAnswered && isReview) return 'answered-review'
    if (isReview) return 'review'
    if (isAnswered) return 'answered'
    return 'unanswered'
  }

  const stateStyles: Record<QuestionState, string> = {
    unanswered:
      'bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:border-muted-foreground/30',
    answered:
      'bg-success/10 text-success border-success/30 hover:bg-success/20',
    current:
      'ring-2 ring-primary border-primary bg-primary/5 text-primary',
    review:
      'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20',
    'answered-review':
      'bg-success/10 text-success border-success/30 ring-1 ring-warning/50',
  }

  function ariaLabel(index: number, state: QuestionState): string {
    const num = index + 1
    const labels: Record<QuestionState, string> = {
      unanswered: `${num}-savol, javob berilmagan`,
      answered: `${num}-savol, javob berilgan`,
      current: `${num}-savol, joriy`,
      review: `${num}-savol, ko‘rib chiqish uchun belgilangan`,
      'answered-review': `${num}-savol, javob berilgan va belgilangan`,
    }
    return labels[state]
  }

  return (
    <div className="grid grid-cols-10 gap-1.5">
      {questionIds.map((id, i) => {
        const state = getState(id, i)
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onNavigate(i)}
            className={`
              relative w-full aspect-square rounded-lg text-xs font-semibold
              flex items-center justify-center border transition-all duration-150
              ${stateStyles[state]}
              ${disabled ? 'cursor-default' : 'cursor-pointer'}
            `}
            aria-label={ariaLabel(i, state)}
            aria-current={i === currentIndex ? 'true' : undefined}
          >
            {i + 1}
            {state === 'answered' && (
              <Check size={7} strokeWidth={4} className="absolute -top-0.5 -right-0.5 text-success" />
            )}
            {state === 'review' && (
              <Bookmark size={7} className="absolute -top-0.5 -right-0.5 text-warning" fill="currentColor" />
            )}
            {state === 'answered-review' && (
              <>
                <Check size={7} strokeWidth={4} className="absolute -top-0.5 -right-0.5 text-success" />
                <Bookmark size={7} className="absolute -bottom-0.5 -right-0.5 text-warning" fill="currentColor" />
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
