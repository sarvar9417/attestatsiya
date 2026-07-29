import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { useI18n } from '../../i18n'
import { type Exercise } from '../../data/grammar'
import { type GrammarTopic } from '../../data/grammar'
import { getGrammarFeedback, type GrammarResult } from '../../lib/claude'

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase().trim()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/n't/g, ' not')
    .replace(/\s+/g, ' ')
    .trim()
}

export function checkAnswer(ex: Exercise, userAns: string[]): boolean {
  if (!userAns || userAns.length === 0) return false
  switch (ex.type) {
    case 'fill-blank':
      return ex.blanks.every((b, i) => normalizeAnswer(userAns[i] ?? '') === normalizeAnswer(b))
    case 'multiple-choice':
      return normalizeAnswer(userAns[0] ?? '') === normalizeAnswer(ex.correct)
    case 'error-correction':
    case 'transformation':
      return normalizeAnswer(userAns[0] ?? '') === normalizeAnswer(ex.correct)
  }
}

export function getUserAnswerText(ex: Exercise, userAns: string[], noAnswer: string): string {
  if (!userAns || userAns.length === 0) return noAnswer
  if (ex.type === 'fill-blank') return userAns.join(' / ')
  return userAns[0] ?? noAnswer
}

// ─── Fill-blank ─────────────────────────────────────────────────────────────

export function FillBlankQuestion({
  ex, answers, onChange, submitted, isCorrect,
}: {
  ex: Extract<Exercise, { type: 'fill-blank' }>
  answers: string[]
  onChange: (blankIdx: number, val: string) => void
  submitted: boolean
  isCorrect: boolean
}) {
  const { t } = useI18n()
  const parts = ex.question.split(/_{3,}/)

  return (
    <div className={`p-4 rounded-2xl border transition-colors ${
      submitted
        ? isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
    }`}>
      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
        {t('grammar.fillBlankTitle')}
      </p>
      <p className="text-sm text-gray-700 leading-loose flex flex-wrap items-center gap-y-1">
        {parts.map((part, i) => (
          <span key={i} className="flex items-center gap-1 flex-wrap">
            <span>{part}</span>
            {i < parts.length - 1 && (
              <input
                type="text"
                value={answers[i] ?? ''}
                onChange={(e) => onChange(i, e.target.value)}
                disabled={submitted}
                placeholder="___"
                className={`inline-block border-b-2 w-32 text-center text-sm font-semibold outline-none bg-transparent transition-colors
                  ${submitted
                    ? normalizeAnswer(answers[i] ?? '') === normalizeAnswer(ex.blanks[i] ?? '')
                      ? 'border-green-500 text-green-700'
                      : 'border-red-400 text-red-700'
                    : 'border-primary-400 text-primary-700 focus:border-primary-600'
                  }`}
              />
            )}
          </span>
        ))}
      </p>
      {submitted && (
        <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {!isCorrect && (
            <p className="font-semibold">
              {t('grammar.correctAnswer')}{' '}
              <span className="font-mono">{ex.blanks.join(' / ')}</span>
            </p>
          )}
          <p className="mt-1 text-gray-600">💡 {ex.explanation}</p>
        </div>
      )}
    </div>
  )
}

// ─── Multiple choice ────────────────────────────────────────────────────────

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export function MCQuestion({
  ex, selected, onSelect, submitted, isCorrect,
}: {
  ex: Extract<Exercise, { type: 'multiple-choice' }>
  selected: string
  onSelect: (val: string) => void
  submitted: boolean
  isCorrect: boolean
}) {
  const { t } = useI18n()
  return (
    <div className={`p-4 rounded-2xl border transition-colors ${
      submitted
        ? isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        : 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800'
    }`}>
      <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">
        {t('grammar.mcTitle')}
      </p>
      <p className="text-sm font-semibold text-gray-800 mb-3 leading-relaxed">{ex.question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ex.options.map((opt, i) => {
          const isSelected = selected === opt
          const isCorrectOpt = opt === ex.correct
          let cls = 'border border-gray-200 bg-white text-gray-700 dark:text-gray-300 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20'
          if (submitted) {
            if (isCorrectOpt) cls = 'border-green-400 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-bold'
            else if (isSelected && !isCorrectOpt) cls = 'border-red-400 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
            else cls = 'border-gray-100 bg-gray-50 text-gray-400'
          } else if (isSelected) {
            cls = 'border-violet-500 bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300 font-semibold'
          }
          return (
            <button
              key={opt}
              disabled={submitted}
              onClick={() => onSelect(opt)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${cls}`}
            >
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center
                text-xs font-bold flex-shrink-0">
                {OPTION_LABELS[i]}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
      {submitted && !isCorrect && (
        <p className="mt-3 text-xs text-gray-600">💡 {ex.explanation}</p>
      )}
    </div>
  )
}

// ─── Error correction ───────────────────────────────────────────────────────

export function ErrorCorrectionQuestion({
  ex, answer, onChange, submitted, isCorrect,
}: {
  ex: Extract<Exercise, { type: 'error-correction' }>
  answer: string
  onChange: (val: string) => void
  submitted: boolean
  isCorrect: boolean
}) {
  const { t } = useI18n()
  return (
    <div className={`p-4 rounded-2xl border transition-colors ${
      submitted
        ? isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        : 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
    }`}>
      <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3">
        {t('grammar.errorCorrectionTitle')}
      </p>
      <div className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-2 mb-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          {ex.question.split(ex.errorPart).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="bg-red-100 text-red-700 font-bold px-1 rounded underline decoration-red-400">
                  {ex.errorPart}
                </span>
              )}
            </span>
          ))}
        </p>
      </div>
      <input
        type="text"
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitted}
        placeholder={t('grammar.errorInputPlaceholder')}
        className="input text-sm"
      />
      {submitted && (
        <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {!isCorrect && (
            <p className="font-semibold">{t('grammar.correctAnswer')} <span className="font-mono">{ex.correct}</span></p>
          )}
          <p className="mt-1 text-gray-600">💡 {ex.explanation}</p>
        </div>
      )}
    </div>
  )
}

// ─── Transformation ─────────────────────────────────────────────────────────

export function TransformQuestion({
  ex, answer, onChange, submitted, isCorrect,
}: {
  ex: Extract<Exercise, { type: 'transformation' }>
  answer: string
  onChange: (val: string) => void
  submitted: boolean
  isCorrect: boolean
}) {
  const { t } = useI18n()
  return (
    <div className={`p-4 rounded-2xl border transition-colors ${
      submitted
        ? isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        : 'bg-teal-50 border-teal-100'
    }`}>
      <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3">
        {t('grammar.transformTitle')}
      </p>
      <div className="bg-white border border-teal-200 rounded-xl px-3 py-2 mb-2">
        <p className="text-sm text-gray-800 font-medium">{ex.question}</p>
      </div>
      <p className="text-xs text-teal-600 mb-2 font-medium flex items-center gap-1">
        <span>{t('grammar.transformHint')}:</span>
        <span className="font-mono font-bold">{ex.hint}</span>
      </p>
      <input
        type="text"
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitted}
        placeholder={t('grammar.transformInputPlaceholder')}
        className="input text-sm"
      />
      {submitted && (
        <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {!isCorrect && (
            <p className="font-semibold">{t('grammar.correctAnswer')} <span className="font-mono">{ex.correct}</span></p>
          )}
          <p className="mt-1 text-gray-600">💡 {ex.explanation}</p>
        </div>
      )}
    </div>
  )
}

// ─── Exercise wrapper ───────────────────────────────────────────────────────

export function ExerciseItem({
  ex, num, answers, onChange, submitted,
}: {
  ex: Exercise
  num: number
  answers: string[]
  onChange: (idx: number, val: string) => void
  submitted: boolean
}) {
  const isCorrect = submitted ? checkAnswer(ex, answers) : false

  return (
    <div className="relative">
      <div className={`absolute -left-3 -top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center
        text-xs font-bold shadow-sm
        ${submitted
          ? isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          : 'bg-primary-600 text-white'
        }`}>
        {submitted ? (isCorrect ? '✓' : '✗') : num}
      </div>

      {ex.type === 'fill-blank' && (
        <FillBlankQuestion
          ex={ex} answers={answers}
          onChange={onChange}
          submitted={submitted} isCorrect={isCorrect}
        />
      )}
      {ex.type === 'multiple-choice' && (
        <MCQuestion
          ex={ex} selected={answers[0] ?? ''}
          onSelect={(val) => onChange(0, val)}
          submitted={submitted} isCorrect={isCorrect}
        />
      )}
      {ex.type === 'error-correction' && (
        <ErrorCorrectionQuestion
          ex={ex} answer={answers[0] ?? ''}
          onChange={(val) => onChange(0, val)}
          submitted={submitted} isCorrect={isCorrect}
        />
      )}
      {ex.type === 'transformation' && (
        <TransformQuestion
          ex={ex} answer={answers[0] ?? ''}
          onChange={(val) => onChange(0, val)}
          submitted={submitted} isCorrect={isCorrect}
        />
      )}
    </div>
  )
}

// ─── AI Feedback Panel ──────────────────────────────────────────────────────

export function AIFeedbackPanel({
  topic, results,
}: {
  topic: GrammarTopic
  results: GrammarResult[]
}) {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [text])

  const start = useCallback(async () => {
    setStarted(true)
    setLoading(true)
    setText('')
    await getGrammarFeedback(
      topic.title,
      topic.level,
      results,
      (token) => { setText((t) => t + token) },
      ()      => { setLoading(false) },
      (err)   => { setError(err.message); setLoading(false) },
    )
  }, [topic, results])

  const renderText = (raw: string) =>
    raw.split('\n').map((line, i) => {
      const parts: (string | JSX.Element)[] = []
      let remaining = line
      let keyIdx = 0
      remaining = remaining.replace(/\*\*(.+?)\*\*/g, (_, inner) => `<b>${inner}</b>`)
      const segments = remaining.split(/(<b>.+?<\/b>)/g)
      for (const seg of segments) {
        if (seg.startsWith('<b>')) {
          parts.push(<strong key={keyIdx++}>{seg.slice(3, -4)}</strong>)
        } else {
          parts.push(seg)
        }
      }
      return (
        <span key={i} className="block mt-1 text-sm leading-relaxed text-gray-700">
          {parts}
        </span>
      )
    })

  if (!started) {
    return (
      <button
        onClick={start}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
      >
        <Sparkles size={18} />
        {t('grammar.aiButton')}
      </button>
    )
  }

  return (
    <div className="card border-b2-100 bg-gradient-to-b from-b2-50 to-white">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-b2-600" />
        <h3 className="font-bold text-gray-900">{t('grammar.aiTitle')}</h3>
        {loading && <Loader2 size={15} className="text-b2-500 animate-spin ml-auto" />}
      </div>

      {error ? (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      ) : (
        <div className="space-y-0.5">
          {renderText(text)}
          {loading && (
            <span className="inline-block w-1 h-4 bg-b2-500 rounded-sm animate-pulse ml-0.5" />
          )}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
