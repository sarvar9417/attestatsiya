import { Bookmark, BookmarkCheck } from 'lucide-react'
import type { ExamQuestion } from './exam-data'
import { LEVEL_LABELS, LETTERS } from './exam-data'
import AnswerOption from './AnswerOption'
import CodeBlock, { parseCodeBlocks } from './CodeBlock'

interface QuestionCardProps {
  question: ExamQuestion
  selectedAnswer?: string
  markedForReview: boolean
  saved: boolean
  disabled: boolean
  onSelectAnswer: (optionId: string) => void
  onToggleReview: () => void
}

export default function QuestionCard({
  question,
  selectedAnswer,
  markedForReview,
  saved,
  disabled,
  onSelectAnswer,
  onToggleReview,
}: QuestionCardProps) {
  const options = question.options.filter((o) => o.side === 'a')

  // Parse stem for code blocks
  const stemSegments = parseCodeBlocks(question.stem_md)

  return (
    <div className="bg-card border border-border rounded-xl">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {question.subject}
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="text-[11px] font-medium text-muted-foreground">
            {question.number}-savol
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="text-[11px] font-medium text-primary/70">
            {LEVEL_LABELS[question.cognitiveLevel]}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {'★'.repeat(question.difficulty)}
            {'☆'.repeat(5 - question.difficulty)}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleReview}
          className={`
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium
            transition-colors duration-150
            ${
              markedForReview
                ? 'text-warning bg-warning/10 hover:bg-warning/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }
          `}
          aria-label={markedForReview ? 'Ko‘rib chiqishdan olib tashlash' : 'Ko‘rib chiqish uchun belgilash'}
          aria-pressed={markedForReview}
        >
          {markedForReview ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          <span className="hidden sm:inline">
            {markedForReview ? 'Belgilangan' : 'Belgilash'}
          </span>
        </button>
      </div>

      {/* Question stem with code block support */}
      <div className="px-5 pt-5 pb-2 space-y-3">
        {stemSegments
          .filter((s) => s.type === 'code' || s.content.length > 0)
          .map((segment, i) => {
            if (segment.type === 'code') {
              return <CodeBlock key={i} code={segment.content} language={segment.language} />
            }
            return (
              <p key={i} className="text-base sm:text-lg leading-relaxed text-foreground font-medium">
                {segment.content}
              </p>
            )
          })}
      </div>

      {/* Answer options */}
      <div className="px-5 pb-5 space-y-2.5">
        {options.map((opt, i) => (
          <AnswerOption
            key={opt.id}
            letter={LETTERS[i]}
            label={opt.content_md}
            selected={selectedAnswer === opt.id}
            disabled={disabled || saved}
            onClick={() => onSelectAnswer(opt.id)}
          />
        ))}
      </div>
    </div>
  )
}
