import { useState, useEffect, useRef, useCallback } from 'react'
import { BookOpen, CheckCircle2, Lightbulb, MessageSquare, Bookmark, ChevronRight, Sparkles, CheckCheck, ArrowLeft, GraduationCap, SendHorizonal, RefreshCw, Loader2, HelpCircle } from 'lucide-react'
import type { WorkbookItem, WorkbookSectionData, WorkbookDialogue, WorkbookVocabList, WorkbookTable, WorkbookList, WorkbookExercise } from '../../data/30dayChallenge/types'
import { evaluateWorkbookAnswer } from '../../lib/openaiChat'

interface Props {
  workbook: WorkbookSectionData[]
}

type EvalResult = { status: 'CORRECT' | 'CLOSE' | 'INCORRECT'; feedback: string; expected?: string }

const SECTION_COLORS = [
  'from-blue-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-violet-600 to-purple-700',
  'from-rose-600 to-pink-700',
  'from-amber-600 to-orange-700',
  'from-cyan-600 to-sky-700',
  'from-fuchsia-600 to-purple-700',
  'from-lime-600 to-green-700',
  'from-orange-600 to-red-700',
  'from-teal-600 to-cyan-700',
  'from-indigo-600 to-blue-700',
  'from-pink-600 to-rose-700',
  'from-green-600 to-emerald-700',
  'from-purple-600 to-violet-700',
  'from-sky-600 to-indigo-700',
]

export default function WorkbookSection({ workbook }: Props) {
  const [activeSection, setActiveSection] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [expandedDialogue, setExpandedDialogue] = useState<Record<string, boolean>>({})
  const [flippedVocab, setFlippedVocab] = useState<Set<string>>(new Set())
  const contentRef = useRef<HTMLDivElement>(null)

  // Interactive exercise state
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, EvalResult>>({})
  const [checking, setChecking] = useState<Record<string, boolean>>({})
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  const totalSections = workbook.length
  const completedCount = completed.size
  const progressPct = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0

  const markViewed = useCallback((idx: number) => {
    setCompleted(prev => {
      if (prev.has(idx)) return prev
      const next = new Set(prev)
      next.add(idx)
      return next
    })
  }, [])

  useEffect(() => {
    markViewed(activeSection)
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeSection, markViewed])

  const goNext = () => {
    if (activeSection < totalSections - 1) {
      setActiveSection(activeSection + 1)
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const goPrev = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1)
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const pickSection = (idx: number) => {
    setActiveSection(idx)
  }

  const toggleDialogue = (key: string) => {
    setExpandedDialogue(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleVocab = (key: string) => {
    setFlippedVocab(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // ── Exercise handlers ──────────────────────────────────────────────────

  const exKey = (sectionIdx: number, itemIdx: number) => `ex-${sectionIdx}-${itemIdx}`

  const handleMCQ = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
    setResults(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleInput = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
    setResults(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const checkAnswer = (key: string, ex: WorkbookExercise) => {
    if (ex.exerciseType === 'mcq') {
      const isCorrect = answers[key] === String(ex.correctAnswer)
      setResults(prev => ({
        ...prev,
        [key]: {
          status: isCorrect ? 'CORRECT' : 'INCORRECT',
          feedback: isCorrect ? "To'g'ri!" : "Noto'g'ri. To'g'ri javob: " + (ex.options?.[Number(ex.correctAnswer)] || ex.correctAnswer),
          expected: ex.options?.[Number(ex.correctAnswer)] || String(ex.correctAnswer),
        },
      }))
      return
    }

    if (ex.exerciseType === 'true-false') {
      const userAns = answers[key]?.toLowerCase()
      const correct = String(ex.correctAnswer).toLowerCase()
      const isCorrect = userAns === correct || (userAns === 't' && correct === 'true') || (userAns === 'f' && correct === 'false')
      setResults(prev => ({
        ...prev,
        [key]: {
          status: isCorrect ? 'CORRECT' : 'INCORRECT',
          feedback: isCorrect ? "To'g'ri! 👍" : "Noto'g'ri. To'g'ri javob: " + (ex.correctAnswer === 'true' || ex.correctAnswer === 'T' ? 'True' : 'False') + ". " + (ex.explanation || ''),
          expected: String(ex.correctAnswer),
        },
      }))
      return
    }

    if (ex.exerciseType === 'fill-blank') {
      if (!answers[key]?.trim()) return
      setChecking(prev => ({ ...prev, [key]: true }))
      evaluateWorkbookAnswer(
        answers[key],
        { question: ex.question, exerciseType: 'fill-blank', hint: ex.hint },
        'A2',
      ).then(result => {
        setResults(prev => ({ ...prev, [key]: result }))
        setChecking(prev => ({ ...prev, [key]: false }))
      })
      return
    }

    if (ex.exerciseType === 'writing') {
      if (!answers[key]?.trim()) return
      setChecking(prev => ({ ...prev, [key]: true }))
      evaluateWorkbookAnswer(
        answers[key],
        { question: ex.question, exerciseType: 'writing', hint: ex.hint },
        'A2',
      ).then(result => {
        setResults(prev => ({ ...prev, [key]: result }))
        setChecking(prev => ({ ...prev, [key]: false }))
      })
    }
  }

  const revealAnswer = (key: string) => {
    setRevealed(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const resetExercise = (key: string) => {
    setAnswers(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    setResults(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    setRevealed(prev => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  const renderItem = (item: WorkbookItem, index: number, sectionIdx: number) => {
    const itemKey = `${sectionIdx}-${index}`
    switch (item.type) {
      case 'heading':
        if (item.level === 1) {
          return (
            <div key={index} className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full bg-primary-500" />
              <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{item.text}</h2>
            </div>
          )
        }
        if (item.level === 2) {
          return (
            <h3 key={index} className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-7 mb-4 flex items-center gap-2.5">
              <Bookmark size={18} className="text-primary-500 shrink-0" />
              {item.text}
            </h3>
          )
        }
        return (
          <h4 key={index} className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-5 mb-3 uppercase tracking-wider">{item.text}</h4>
        )

      case 'text':
        return (
          <p key={index} className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {item.text}
          </p>
        )

      case 'tip':
        return (
          <div key={index} className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/15 dark:to-yellow-900/15 border border-amber-200 dark:border-amber-700/40 p-4 mb-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-300/10 dark:bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-start gap-3 relative">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center shrink-0">
                <Lightbulb size={16} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1">Maslahat</p>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">{item.text}</p>
              </div>
            </div>
          </div>
        )

      case 'list': {
        const lst = item as WorkbookList
        return (
          <div key={index} className="mb-5">
            {lst.ordered ? (
              <ol className="space-y-2">
                {lst.items.map((li, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="pt-0.5">{li}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="space-y-2">
                {lst.items.map((li, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="pt-0.5">{li}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      }

      case 'table': {
        const tbl = item as WorkbookTable
        return (
          <div key={index} className="overflow-x-auto mb-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750">
                  {tbl.headers.map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 whitespace-nowrap text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tbl.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-gray-100 dark:border-gray-700/40 last:border-0 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      case 'dialogue': {
        const dlg = item as WorkbookDialogue
        const key = `dialogue-${itemKey}`
        const expanded = expandedDialogue[key]
        const displayLines = expanded ? dlg.lines : dlg.lines.slice(0, 3)
        return (
          <div key={index} className="mb-5 rounded-xl overflow-hidden border border-blue-200 dark:border-blue-800/50 shadow-sm">
            <div className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center gap-2">
              <MessageSquare size={14} className="text-white/80" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Dialogue</span>
            </div>
            <div className="p-4 space-y-3 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/10 dark:to-gray-800/50">
              {displayLines.map((line, i) => (
                <div key={i} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 whitespace-nowrap shrink-0">{line.speaker}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{line.text}</span>
                </div>
              ))}
              {dlg.lines.length > 3 && (
                <button
                  onClick={() => toggleDialogue(key)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1.5 mt-1"
                >
                  {expanded ? 'Yig\'ish' : `To'liq ko'rsatish (${dlg.lines.length} qator)`}
                  <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
                </button>
              )}
            </div>
          </div>
        )
      }

      case 'vocabulary': {
        const vl = item as WorkbookVocabList
        return (
          <div key={index} className="grid sm:grid-cols-2 gap-3 mb-5">
            {vl.items.map((v, i) => {
              const vkey = `vocab-${itemKey}-${i}`
              const flipped = flippedVocab.has(vkey)
              return (
                <div
                  key={i}
                  onClick={() => toggleVocab(vkey)}
                  className="group relative rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base font-bold text-primary-600 dark:text-primary-400">{v.word}</span>
                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full">
                      {flipped ? 'yashirish' : 'misol'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{v.meaning}</p>
                  {flipped && (
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
                      <p className="text-sm text-gray-800 dark:text-gray-200 italic leading-relaxed">
                        "{v.example}"
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      }

      case 'exercise': {
        const ex = item as WorkbookExercise
        const key = exKey(sectionIdx, index)
        const result = results[key]
        const isChecking = checking[key]
        const isRevealed = revealed.has(key)

        return (
          <div key={index} className="mb-5 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            {/* Question header */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <HelpCircle size={14} className="text-primary-600" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {ex.exerciseType === 'mcq' ? 'Test' : ex.exerciseType === 'fill-blank' ? 'To\'ldiring' : ex.exerciseType === 'true-false' ? 'True/False' : 'Yozma'}
              </span>
              {result && (
                <span className={`ml-auto text-xs font-bold ${result.status === 'CORRECT' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {result.status === 'CORRECT' ? '✅ To\'g\'ri' : result.status === 'CLOSE' ? '🟡 Qisman' : '❌ Xato'}
                </span>
              )}
            </div>

            <div className="p-4 bg-white dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">{ex.question}</p>

              {/* MCQ */}
              {ex.exerciseType === 'mcq' && ex.options && (
                <div className="space-y-2">
                  {ex.options.map((opt, oi) => {
                    const isSelected = answers[key] === String(oi)
                    const isCorrectOpt = result && String(ex.correctAnswer) === String(oi)
                    const isWrongOpt = result && isSelected && !isCorrectOpt
                    return (
                      <button
                        key={oi}
                        onClick={() => !result && handleMCQ(key, String(oi))}
                        disabled={!!result}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-xl text-sm transition-all ${
                          result
                            ? isCorrectOpt
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-400 text-emerald-800 dark:text-emerald-200'
                              : isWrongOpt
                                ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 text-red-800 dark:text-red-200'
                                : 'bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                            : isSelected
                              ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-400 text-primary-800 dark:text-primary-200'
                              : 'bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 hover:bg-primary-50/50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          result && isCorrectOpt
                            ? 'bg-emerald-500 text-white'
                            : result && isWrongOpt
                              ? 'bg-red-400 text-white'
                              : isSelected
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                        }`}>
                          {result && isCorrectOpt ? '✓' : result && isWrongOpt ? '✗' : String.fromCharCode(65 + oi)}
                        </span>
                        <span className={result && isCorrectOpt ? 'font-medium' : ''}>{opt}</span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Fill-blank */}
              {ex.exerciseType === 'fill-blank' && (
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={answers[key] || ''}
                      onChange={e => handleInput(key, e.target.value)}
                      disabled={!!result}
                      placeholder="Javobingizni yozing..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
                    />
                    {!result ? (
                      <button
                        onClick={() => checkAnswer(key, ex)}
                        disabled={!answers[key]?.trim() || isChecking}
                        className="p-2.5 rounded-xl bg-primary-600 text-white disabled:opacity-40 hover:bg-primary-700 transition-all active:scale-95"
                      >
                        {isChecking ? <Loader2 size={16} className="animate-spin" /> : <SendHorizonal size={16} />}
                      </button>
                    ) : (
                      <button onClick={() => resetExercise(key)} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all" title="Qayta urinish">
                        <RefreshCw size={16} />
                      </button>
                    )}
                  </div>
                  {ex.hint && !result && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Lightbulb size={12} /> {ex.hint}
                    </p>
                  )}
                </div>
              )}

              {/* True/False */}
              {ex.exerciseType === 'true-false' && (
                <div className="flex gap-3">
                  {['True', 'False'].map(val => {
                    const isSelected = answers[key] === val.toLowerCase()
                    const correctVal = String(ex.correctAnswer).toLowerCase()
                    const isCorrectOpt = result && correctVal === val.toLowerCase()
                    const isWrongOpt = result && isSelected && !isCorrectOpt
                    return (
                      <button
                        key={val}
                        onClick={() => !result && handleMCQ(key, val.toLowerCase())}
                        disabled={!!result}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all ${
                          result && isCorrectOpt
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                            : result && isWrongOpt
                              ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 text-red-700 dark:text-red-300'
                              : isSelected
                                ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-400 text-primary-700'
                                : 'bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary-300'
                        }`}
                      >
                        {result && isCorrectOpt ? '✓' : result && isWrongOpt ? '✗' : ''}
                        {val}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Writing */}
              {ex.exerciseType === 'writing' && (
                <div>
                  <textarea
                    value={answers[key] || ''}
                    onChange={e => handleInput(key, e.target.value)}
                    disabled={!!result}
                    rows={4}
                    placeholder="Javobingizni yozing..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none disabled:opacity-50"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    {!result ? (
                      <button
                        onClick={() => checkAnswer(key, ex)}
                        disabled={!answers[key]?.trim() || isChecking}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold disabled:opacity-40 hover:from-primary-700 hover:to-primary-800 transition-all active:scale-95"
                      >
                        {isChecking ? (
                          <><Loader2 size={14} className="animate-spin" /> Tekshirish...</>
                        ) : (
                          <><SendHorizonal size={14} /> AI tekshirish</>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => resetExercise(key)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
                      >
                        <RefreshCw size={14} /> Qayta yozish
                      </button>
                    )}
                    {!result && !isChecking && (
                      <button
                        onClick={() => revealAnswer(key)}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline"
                      >
                        Javobni ko'rsatish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Result feedback */}
              {result && (
                <div className={`mt-3 p-3 rounded-xl text-sm ${
                  result.status === 'CORRECT'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200'
                    : result.status === 'CLOSE'
                      ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-200'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200'
                }`}>
                  <p className="font-semibold mb-0.5">
                    {result.status === 'CORRECT' ? '✅ To\'g\'ri!' : result.status === 'CLOSE' ? '🟡 Qisman to\'g\'ri' : '❌ Xato'}
                  </p>
                  {result.feedback && <p>{result.feedback}</p>}
                  {result.expected && result.status !== 'CORRECT' && (
                    <p className="mt-1 text-xs opacity-75">Kutilgan javob: {result.expected}</p>
                  )}
                </div>
              )}

              {/* Revealed answer */}
              {isRevealed && !result && (
                <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400">
                  {ex.exerciseType === 'mcq' && ex.options && (
                    <p><span className="font-medium">Javob:</span> {ex.options[Number(ex.correctAnswer)]}</p>
                  )}
                  {ex.exerciseType === 'fill-blank' && (
                    <p><span className="font-medium">Javob:</span> {ex.correctAnswer}</p>
                  )}
                  {ex.exerciseType === 'true-false' && (
                    <p><span className="font-medium">Javob:</span> {ex.correctAnswer === 'true' || ex.correctAnswer === 'T' ? 'True' : 'False'}</p>
                  )}
                  {ex.explanation && <p className="mt-1 text-xs opacity-75">{ex.explanation}</p>}
                </div>
              )}
            </div>
          </div>
        )
      }

      default:
        return null
    }
  }

  if (totalSections === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <BookOpen size={48} className="mx-auto mb-4 opacity-40" />
        <p className="text-sm font-medium">Bu kun uchun ish daftari mavjud emas</p>
      </div>
    )
  }

  const section = workbook[activeSection]
  const sectionColor = SECTION_COLORS[activeSection % SECTION_COLORS.length]

  return (
    <div className="space-y-4">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Workbook</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ish daftari • {completedCount}/{totalSections} bo'lim</p>
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────── */}
      <div className="relative h-2 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all duration-700 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* ── Section navigation pills ─────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-thin py-1 -mx-1 px-1">
        {workbook.map((s, i) => {
          const isActive = i === activeSection
          const isDone = completed.has(i)
          return (
            <button
              key={s.id}
              onClick={() => pickSection(i)}
              className={`
                relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-200
                ${isActive
                  ? 'text-white shadow-lg scale-105'
                  : isDone
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40'
                    : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {isActive && (
                <span className={`absolute inset-0 rounded-xl bg-gradient-to-r ${sectionColor} animate-gradientMove`} />
              )}
              <span className="relative z-10">{isDone ? '✅' : s.icon}</span>
              <span className="relative z-10 hidden sm:inline">{s.title.replace(/^[^\s]+\s/, '')}</span>
            </button>
          )
        })}
      </div>

      {/* ── Active section content ─────────────────────────────────────── */}
      <div ref={contentRef} className="scroll-mt-4">
        {/* Section hero */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${sectionColor} p-6 text-white shadow-xl mb-5`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{section.icon}</span>
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Bo'lim {activeSection + 1} / {totalSections}
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight">{section.title}</h2>
          </div>
        </div>

        {/* Section items */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
          {section.items.map((item: WorkbookItem, i: number) => renderItem(item, i, activeSection))}
        </div>

        {/* ── Navigation buttons ──────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 mt-5">
          <button
            onClick={goPrev}
            disabled={activeSection === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={16} />
            Oldingi
          </button>

          <div className="flex items-center gap-1.5">
            {workbook.map((_, i) => (
              <button
                key={i}
                onClick={() => pickSection(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeSection
                    ? 'w-6 bg-primary-500'
                    : completed.has(i)
                      ? 'bg-emerald-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={activeSection >= totalSections - 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-sm disabled:opacity-40 hover:from-primary-700 hover:to-primary-800 transition-all active:scale-95 shadow-lg"
          >
            Keyingi
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Completion footer ──────────────────────────────────────────── */}
      {completedCount === totalSections && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white text-center shadow-xl animate-pop-in">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <CheckCheck size={28} className="mx-auto mb-2 text-emerald-200" />
            <p className="text-lg font-black">Tabriklaymiz!</p>
            <p className="text-sm text-white/80 mt-1">Barcha {totalSections} bo'limni yakunladingiz</p>
            <div className="mt-3 flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Sparkles key={i} size={16} className="text-yellow-300 animate-pop-in" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
