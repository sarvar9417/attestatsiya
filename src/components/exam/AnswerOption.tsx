import { Check } from 'lucide-react'

interface AnswerOptionProps {
  letter: string
  label: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}

export default function AnswerOption({
  letter,
  label,
  selected,
  disabled,
  onClick,
}: AnswerOptionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        group relative w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border
        text-left transition-all duration-150
        ${
          selected
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/40 hover:bg-muted/50'
        }
        ${disabled ? 'opacity-50 cursor-default' : 'cursor-pointer'}
      `}
      aria-pressed={selected}
      aria-label={`${letter} — ${label}`}
    >
      {/* Radio / Check indicator */}
      <div
        className={`
          w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center
          transition-all duration-150
          ${
            selected
              ? 'border-primary bg-primary'
              : 'border-muted-foreground/40 group-hover:border-primary/60'
          }
        `}
      >
        {selected && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>

      {/* Letter badge */}
      <span
        className={`
          w-6 h-6 shrink-0 rounded-md text-xs font-bold flex items-center justify-center
          transition-colors duration-150
          ${
            selected
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary/80'
          }
        `}
      >
        {letter}
      </span>

      {/* Label */}
      <span
        className={`text-sm sm:text-base font-medium leading-snug ${
          selected ? 'text-primary' : 'text-foreground'
        }`}
      >
        {label}
      </span>
    </button>
  )
}
