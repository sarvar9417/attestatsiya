import { useMemo, useEffect, useRef, useState } from 'react'
import type { DailyExercise } from '../../data/dailyLessons'
import { normalizeAnswer, OPTION_LABELS, getCorrectText, checkAnswer, isBlankAccepted, isAcceptedAnswer } from './helpers'
import { feelAnswer } from '../../lib/gameFeel'
import { AudioButton } from '../ui/AudioButton'
import { ConnectionFeedback } from './ConnectionFeedback'
import { Lightbulb, Zap, CheckCircle, XCircle } from 'lucide-react'

export default function ExerciseCard({
  ex, num, total, answers, onChange, submitted, combo = 0,
}: {
  ex: DailyExercise
  num: number
  total?: number
  answers: string[]
  onChange: (idx: number, val: string) => void
  submitted: boolean
  combo?: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hintUsed, setHintUsed] = useState(false)
  const [hintText, setHintText] = useState('')

  // Auto-focus first input when card mounts
  useEffect(() => {
    if (!submitted && cardRef.current) {
      const firstInput = cardRef.current.querySelector('input')
      if (firstInput) {
        const timer = setTimeout(() => firstInput.focus(), 100)
        return () => clearTimeout(timer)
      }
    }
  }, [ex.id, submitted])

  // GameFeel when submitted
  // feelAnswer() already handles haptic: 'light' on correct, 'medium' on wrong
  useEffect(() => {
    if (submitted) {
      const correct = checkAnswer(ex, answers)
      feelAnswer({ correct })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted])

  const shuffledOptions = useMemo(() => {
    if (ex.type !== 'multiple-choice') return []
    const arr = [...ex.options]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex.id])

  const isCorrect = submitted ? checkAnswer(ex, answers) : false

  // Dynamic animation classes on submit
  const animateCls = submitted
    ? isCorrect
      ? 'animate-correct-flash'
      : 'animate-wrong-shake'
    : ''

  const borderCls = submitted
    ? isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'
    : ''

  return (
    <div ref={cardRef} role="group" aria-label={`Exercise ${num}${total ? ` of ${total}` : ''}: ${ex.type.replace('-', ' ')}`} className={`relative rounded-2xl border p-4 transition-all duration-300 animate-pop-in ${animateCls} ${borderCls} ${
      submitted
        ? 'scale-[1.01] shadow-md'
        : 'hover:shadow-sm'
    }`}>
      {/* Progress indicator badge */}
      {total !== undefined && total > 0 && !submitted && (
        <div className="absolute -right-2 -top-2 z-10 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
          {num}/{total}
        </div>
      )}

      {/* Question number / result badge */}
      <div className={`absolute -left-3 -top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300 ${
        submitted
          ? isCorrect ? 'bg-green-500 text-white scale-110' : 'bg-red-500 text-white scale-110'
          : 'bg-primary-600 text-white'
      }`}>
        {submitted ? (isCorrect ? '✓' : '✗') : num}
      </div>

      {/* Combo badge */}
      {submitted && isCorrect && combo > 1 && (
        <div className="absolute -right-2 -top-2 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 animate-bounce">
          <Zap size={10} /> {combo}x combo!
        </div>
      )}

      {ex.type === 'fill-blank' && (
        <div>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">📝 Bo'sh joyni to'ldiring</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          {ex.visualHint && (
            <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-xl">{ex.visualHint}</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Ko'rsatma</span>
            </div>
          )}
          {/* Hint button */}
          {!submitted && !hintUsed && ex.blanks && ex.blanks.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setHintUsed(true)
                const correct = ex.blanks[0] ?? ''
                const hint = correct.length > 2
                  ? `${correct[0]}${'_'.repeat(Math.max(0, correct.length - 2))}${correct[correct.length - 1]}`
                  : `${correct[0]}_`
                setHintText(hint)
              }}
              className="mb-2 text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline"
            >
              <Lightbulb size={11} /> Yordam olish (1 marta)
            </button>
          )}
          {hintUsed && hintText && (
            <div className="mb-2 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                💡 Maslahat: <span className="font-mono">{hintText}</span>
              </span>
            </div>
          )}
          <div className="flex items-start gap-1.5 mb-1">
            <AudioButton text={ex.question.replace(/_{3,}/g, '___ ')} size="sm" />
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-loose">
            {ex.question.split(/_{3,}/).length > 1 ? (
              /* Standard fill-blank: ___ in question → render inputs inline */
              ex.question.split(/_{3,}/).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <input type="text" value={answers[i] ?? ''} onChange={(e) => onChange(i, e.target.value)} disabled={submitted} placeholder="___" aria-label={`Blank ${i + 1} answer`}
                      className={`inline-block border-b-2 w-32 text-center text-sm font-semibold outline-none bg-transparent transition-all duration-200 ${
                        submitted
                          ? isBlankAccepted(ex, i, answers[i] ?? '')
                            ? 'border-green-500 text-green-700 dark:text-green-400'
                            : 'border-red-400 text-red-700 dark:text-red-400'
                          : 'border-primary-400 text-primary-700 dark:text-primary-300 focus:border-primary-600 focus:scale-105'
                      }`}
                      autoFocus={i === 0 && !submitted}
                    />
                  )}
                </span>
              ))
            ) : (
              /* No ___ in question → show question text + inputs below */
              <>
                <p>{ex.question}</p>
                {ex.blanks && ex.blanks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ex.blanks.map((_, i) => (
                      <input key={i} type="text" value={answers[i] ?? ''} onChange={(e) => onChange(i, e.target.value)} disabled={submitted} placeholder="___" aria-label={`Blank ${i + 1} answer`}
                        className={`inline-block border-b-2 w-40 text-center text-sm font-semibold outline-none bg-transparent transition-all duration-200 ${
                          submitted
                            ? isBlankAccepted(ex, i, answers[i] ?? '')
                              ? 'border-green-500 text-green-700 dark:text-green-400'
                              : 'border-red-400 text-red-700 dark:text-red-400'
                            : 'border-primary-400 text-primary-700 dark:text-primary-300 focus:border-primary-600 focus:scale-105'
                        }`}
                        autoFocus={i === 0 && !submitted}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          </div>
          {submitted && <div aria-live="polite">{feedbackBlock(ex, answers, isCorrect)}</div>}
        </div>
      )}

      {ex.type === 'multiple-choice' && (
        <div>
          <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">🔘 To'g'ri variantni tanlang</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          {ex.visualHint && (
            <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
              <span className="text-xl">{ex.visualHint}</span>
              <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">Ko'rsatma</span>
            </div>
          )}
          {/* MC Hint button — eliminates one wrong answer */}
          {!submitted && !hintUsed && ex.options && ex.options.length > 2 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setHintUsed(true)
                const wrongOptions = ex.options.filter(o => o !== ex.correct)
                const eliminated = wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
                setHintText(`❌ ${eliminated} — bu noto'g'ri`)
              }}
              className="mb-2 text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline"
            >
              <Lightbulb size={11} /> Yordam — bitta noto'g'ri javobni olib tashlash
            </button>
          )}
          {hintUsed && hintText && (
            <div className="mb-2 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                💡 {hintText}
              </span>
            </div>
          )}
          <div className="flex items-start gap-1.5 mb-3">
            <AudioButton text={ex.question} size="sm" />
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">{ex.question}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shuffledOptions.map((opt, i) => {
              const selected = answers[0] === opt
              const correctOpt = opt === ex.correct
              let cls = 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30'
              if (submitted) {
                if (correctOpt) cls = 'border-green-400 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-bold'
                else if (selected && !correctOpt) cls = 'border-red-400 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                else cls = 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              } else if (selected) {
                cls = 'border-violet-500 bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300 font-semibold ring-2 ring-violet-300 dark:ring-violet-600 ring-offset-1 animate-pulse-glow'
              }
              return (
                <button key={opt} disabled={submitted} onClick={() => onChange(0, opt)} aria-label={`Option ${OPTION_LABELS[i]}: ${opt}${selected ? ', selected' : ''}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${cls}`}>
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {OPTION_LABELS[i]}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
          {submitted && <div aria-live="polite">{feedbackBlock(ex, answers, isCorrect)}</div>}
        </div>
      )}

      {ex.type === 'error-correction' && (
        <div>
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">🔍 Xatoni toping va to'g'irlang</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2 mb-3">
            <div className="flex items-start gap-1.5 mb-1">
              <AudioButton text={ex.question} size="sm" />
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {ex.question.split(ex.errorPart).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 font-bold px-1 rounded underline decoration-red-400">{ex.errorPart}</span>
                  )}
                </span>
              ))}
            </p>
            </div>
          </div>
          <input type="text" value={answers[0] ?? ''} onChange={(e) => onChange(0, e.target.value)} disabled={submitted}
            placeholder="To'g'ri gapni yozing..." className="input text-sm" autoFocus={!submitted} aria-label="Correct the error and write the correct sentence" />
          {submitted && <div aria-live="polite">{feedbackBlock(ex, answers, isCorrect)}</div>}
        </div>
      )}

      {ex.type === 'transformation' && (
        <div>
          <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">🔄 Gapni o'zgartiring</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-800 rounded-xl px-3 py-2 mb-2">
            <div className="flex items-start gap-1.5">
              <AudioButton text={ex.question} size="sm" />
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{ex.question}</p>
            </div>
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 mb-2 font-medium flex items-center gap-1">
            <span>Boshlang'ich:</span>
            <span className="font-mono font-bold">{ex.hint}</span>
          </p>
          <input type="text" value={answers[0] ?? ''} onChange={(e) => onChange(0, e.target.value)} disabled={submitted}
            placeholder="To'liq javobni yozing..." className="input text-sm" autoFocus={!submitted} aria-label="Write the transformed sentence" />
          {submitted && <div aria-live="polite">{feedbackBlock(ex, answers, isCorrect)}</div>}
        </div>
      )}

      {ex.type === 'vocab-match' && (
        <div>
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">📖 So'zni moslang</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-xl px-4 py-3 mb-3 text-center">
            <p className="text-lg font-black text-gray-900 dark:text-gray-100">{ex.word}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ex.options.map((opt, i) => {
              const selected = answers[0] === opt
              const correctOpt = opt === ex.correct
              let cls = 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30'
              if (submitted) {
                if (correctOpt) cls = 'border-green-400 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-bold'
                else if (selected && !correctOpt) cls = 'border-red-400 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                else cls = 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              } else if (selected) {
                cls = 'border-orange-500 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 font-semibold ring-2 ring-orange-300 dark:ring-orange-600 ring-offset-1'
              }
              return (
                <button key={opt} disabled={submitted} onClick={() => onChange(0, opt)} aria-label={`Option ${String.fromCharCode(97 + i)}: ${opt}${selected ? ', selected' : ''}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${cls}`}>
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {String.fromCharCode(97 + i)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
          {submitted && <div aria-live="polite">{feedbackBlock(ex, answers, isCorrect)}</div>}
        </div>
      )}

      {ex.type === 'fill-table' && (
        <div>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">📊 Jadvalni to'ldiring</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="pb-2 pr-3 font-semibold">Adjective</th>
                  <th className="pb-2 pr-3 font-semibold">Comparative</th>
                  <th className="pb-2 font-semibold">Superlative</th>
                </tr>
              </thead>
              <tbody>
                {ex.rows.map((row, rowIdx) => {
                  const compIdx = rowIdx * 2
                  const supIdx = rowIdx * 2 + 1
                  return (
                    <tr key={rowIdx} className="border-b border-gray-50 dark:border-gray-800">
                      <td className="py-2 pr-3 font-semibold text-gray-900 dark:text-gray-100">{row.adj}</td>
                      <td className="py-2 pr-3">
                        {row.comp ? (
                          <span className={`font-mono text-sm ${
                            submitted
                              ? normalizeAnswer(answers[compIdx] ?? '') === normalizeAnswer(row.comp)
                                ? 'text-green-600 dark:text-green-400 font-bold'
                                : 'text-red-600 dark:text-red-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {submitted ? (answers[compIdx] ?? '—') : (
                              <input type="text" value={answers[compIdx] ?? ''} onChange={(e) => onChange(compIdx, e.target.value)} disabled={submitted}
                                placeholder="___" className="w-28 border-b-2 border-dashed border-indigo-300 dark:border-indigo-600 text-center text-sm font-semibold outline-none bg-transparent focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors" aria-label={`Comparative form of ${row.adj}`} />
                            )}
                          </span>
                        ) : <span className="text-gray-300 dark:text-gray-600 italic">—</span>}
                      </td>
                      <td className="py-2">
                        {row.sup ? (
                          <span className={`font-mono text-sm ${
                            submitted
                              ? normalizeAnswer(answers[supIdx] ?? '') === normalizeAnswer(row.sup)
                                ? 'text-green-600 dark:text-green-400 font-bold'
                                : 'text-red-600 dark:text-red-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {submitted ? (answers[supIdx] ?? '—') : (
                              <input type="text" value={answers[supIdx] ?? ''} onChange={(e) => onChange(supIdx, e.target.value)} disabled={submitted}
                                placeholder="___" className="w-28 border-b-2 border-dashed border-indigo-300 dark:border-indigo-600 text-center text-sm font-semibold outline-none bg-transparent focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors" aria-label={`Superlative form of ${row.adj}`} />
                            )}
                          </span>
                        ) : <span className="text-gray-300 dark:text-gray-600 italic">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {submitted && (
            <div aria-live="polite" className={`mt-3 text-xs ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {!isCorrect && (
                <>
                  <p className="font-semibold">✍️ Sizning javobingiz:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ex.rows.map((row, rowIdx) => {
                      const compAns = answers[rowIdx * 2] ?? ''
                      const supAns = answers[rowIdx * 2 + 1] ?? ''
                      const compOk = normalizeAnswer(compAns) === normalizeAnswer(row.comp)
                      const supOk = normalizeAnswer(supAns) === normalizeAnswer(row.sup)
                      return (
                        <div key={rowIdx} className={`text-xs px-2 py-1 rounded ${(!compOk || !supOk) ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}>
                          <span className="font-semibold">{row.adj}</span>
                          {row.comp && <span className={`ml-1 ${compOk ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>C: {compAns || '—'}</span>}
                          {row.sup && <span className={`ml-1 ${supOk ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>S: {supAns || '—'}</span>}
                        </div>
                      )
                    })}
                  </div>
                  <p className="font-semibold mt-2">✅ To'g'ri javob:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ex.rows.map((row, rowIdx) => {
                      const compOk = normalizeAnswer(answers[rowIdx * 2] ?? '') === normalizeAnswer(row.comp)
                      const supOk = normalizeAnswer(answers[rowIdx * 2 + 1] ?? '') === normalizeAnswer(row.sup)
                      if (compOk && supOk) return null
                      return (
                        <div key={rowIdx} className="text-xs px-2 py-1 rounded bg-green-50 dark:bg-green-900/30">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{row.adj}</span>
                          {!compOk && <span className="ml-1 text-green-600 dark:text-green-400">C: {row.comp}</span>}
                          {!supOk && <span className="ml-1 text-green-600 dark:text-green-400">S: {row.sup}</span>}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
              {isCorrect && <p className="font-semibold">✅ To'g'ri! +10 XP</p>}
              <p className="mt-1 text-gray-600 dark:text-gray-400">💡 {ex.explanation}</p>
            </div>
          )}
        </div>
      )}

      {ex.type === 'passage' && (
        <div>
          <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">📄 Matnli mashq (kontekst)</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="bg-white dark:bg-gray-800 border border-cyan-200 dark:border-cyan-800 rounded-xl px-4 py-3 mb-2 leading-loose text-sm text-gray-700 dark:text-gray-300">
            {ex.passage.split(/_{3,}(?:\(\d+\))?/).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <input type="text" value={answers[i] ?? ''} onChange={(e) => onChange(i, e.target.value)} disabled={submitted} placeholder={`(${i + 1})`} aria-label={`Passage blank ${i + 1} answer`}
                    className={`inline-block border-b-2 w-28 text-center text-sm font-semibold outline-none bg-transparent transition-all duration-200 ${
                      submitted
                        ? normalizeAnswer(answers[i] ?? '') === normalizeAnswer((ex.blanks[i] ?? '').split('/')[0])
                          ? 'border-green-500 text-green-700 dark:text-green-400'
                          : 'border-red-400 text-red-700 dark:text-red-400'
                        : 'border-cyan-400 text-cyan-700 dark:text-cyan-300 focus:border-cyan-600 focus:scale-105'
                    }`}
                    autoFocus={i === 0 && !submitted}
                  />
                )}
              </span>
            ))}
          </div>
          {submitted && <div aria-live="polite">{feedbackBlock(ex, answers, isCorrect)}</div>}
        </div>
      )}

      {ex.type === 'connection' && (
        <div>
          <p className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">🔗 Bog'lash — o'z hayotingizdan</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl px-4 py-3 mb-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">{ex.prompt}</p>
            {ex.hints.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {ex.hints.map((h, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300">💡 {h}</span>
                ))}
              </div>
            )}
          </div>
          <textarea value={answers[0] ?? ''} onChange={(e) => onChange(0, e.target.value)} disabled={submitted}
            rows={3} placeholder="Bu yerga o'z misolingizni yozing..." className="input text-sm resize-none w-full" aria-label="Write your personal example connection" />
          {submitted && (
            <div className="mt-3" aria-live="polite">
              {(answers[0] ?? '').trim().length > 0
                ? <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">✅ Ajoyib! O'z misolingizni yaratish yodda saqlashni mustahkamlaydi. +10 XP</p>
                : <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">✍️ Keyingi safar o'z misolingizni yozib ko'ring — bu yodlashni kuchaytiradi.</p>}
              <ConnectionFeedback
                exercise={{ id: ex.id, instruction: ex.instruction, prompt: ex.prompt, hints: ex.hints, exampleAnswer: ex.exampleAnswer }}
                userAnswer={answers[0] ?? ''}
              />
            </div>
          )}
        </div>
      )}

      {ex.type === 'elaborative' && (
        <div>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">🤔 Nima uchun? — Chuqur o'ylang</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 mb-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">{ex.question}</p>
          </div>
          <textarea value={answers[0] ?? ''} onChange={(e) => onChange(0, e.target.value)} disabled={submitted}
            rows={4} placeholder="O'z so'zlaringiz bilan tushuntiring..." className="input text-sm resize-none w-full" aria-label="Write your explanation in your own words" />
          {submitted && (
            <div className="mt-3" aria-live="polite">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">✅ Ajoyib! Chuqur o'ylash — til o'rganishning eng kuchli usuli. +10 XP</p>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">💡 Misol javob:</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{ex.exampleAnswer}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Check if user gave an alternative (but still correct) answer
 */
function hasAlternativeAnswer(ex: DailyExercise, answers: string[]): boolean {
  if (ex.type !== 'fill-blank' || !ex.acceptedAnswers) return false
  return answers.some((ans, i) => {
    if (!ex.acceptedAnswers || !ex.acceptedAnswers[i]) return false
    const isMain = normalizeAnswer(ans) === normalizeAnswer(ex.blanks[i] ?? '')
    const isAlt = isAcceptedAnswer(ans, ex.acceptedAnswers[i])
    return !isMain && isAlt
  })
}

/**
 * Get blanks array for fill-blank exercise
 */
function getBlanks(ex: DailyExercise): string[] {
  if (ex.type === 'fill-blank' || ex.type === 'passage') return ex.blanks
  return []
}

function feedbackBlock(ex: DailyExercise, answers: string[], isCorrect: boolean) {
  // Check if user gave alternative correct answer
  const isAlternative = isCorrect && hasAlternativeAnswer(ex, answers)
  const blanks = getBlanks(ex)
  
  return (
    <div aria-live="polite" className={`mt-3 text-xs rounded-xl p-3 border ${
      isCorrect
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
    }`}>
      {/* Result header */}
      <div className="flex items-center gap-2 mb-2">
        {isCorrect ? (
          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
        ) : (
          <XCircle size={16} className="text-red-500 flex-shrink-0" />
        )}
        <span className="font-bold text-sm">
          {isCorrect
            ? isAlternative
              ? `To'g'ri! (${blanks.join(', ')} ham ishlatish mumkin)`
              : 'To\'g\'ri!'
            : 'Noto\'g\'ri'}
        </span>
        {isCorrect && <span className="text-green-600 dark:text-green-400 font-semibold">+10 XP</span>}
      </div>

      {/* Wrong answer details */}
      {!isCorrect && (
        <div className="space-y-1 mb-2 pl-6">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Sizning javobingiz:</span>{' '}
            <span className="font-mono line-through text-red-500">
              {ex.type === 'fill-blank' || ex.type === 'passage'
                ? (answers.join(' / ') || "(bo'sh)")
                : (answers[0] || "(bo'sh)")}
            </span>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold">To'g'ri javob:</span>{' '}
            <span className="font-mono text-green-600 dark:text-green-400 font-bold">
              {ex.type === 'fill-table' ? "jadvalda ko'rsatilgan" : getCorrectText(ex)}
            </span>
          </p>
        </div>
      )}

      {/* Explanation */}
      {'explanation' in ex && ex.explanation && (
        <div className="mt-2 pt-2 border-t border-green-200/50 dark:border-green-800/50 pl-6">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            💡 <span className="font-semibold">Tushuntirish:</span> {ex.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
