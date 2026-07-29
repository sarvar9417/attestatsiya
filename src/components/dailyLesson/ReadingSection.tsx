import { useState, useMemo } from 'react'
import { 
  CheckCircle, XCircle, BookOpen, Clock, Trophy, RotateCcw, FileText,
  BookMarked, Lightbulb, MessageCircle, ChevronDown, ChevronUp,
  ChevronRight, MessageSquareQuote,
} from 'lucide-react'
import type { ReadingSection as ReadingSectionType } from '../../data/dailyLessons'
import { AudioButton } from '../ui/AudioButton'

interface Props {
  section: ReadingSectionType
  addXP?: (amount: number) => void
}

export default function ReadingSection({ section, addXP }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [xpAwarded, setXpAwarded] = useState(false)

  const shuffledMap = useMemo(() => {
    const map = new Map<number, { options: string[]; correctIndex: number }>()
    for (const q of section.questions) {
      const indices = q.options.map((_, i) => i)
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]]
      }
      map.set(q.id, {
        options: indices.map(i => q.options[i]),
        correctIndex: indices.indexOf(q.correctIndex),
      })
    }
    return map
  }, [section.questions])

  const allAnswered = section.questions.every(q => answers[q.id] !== undefined)
  const answeredCount = Object.keys(answers).length

  const score = submitted
    ? section.questions.filter(q => answers[q.id] === (shuffledMap.get(q.id)?.correctIndex ?? q.correctIndex)).length
    : 0
  const total = section.questions.length
  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  const handleSubmit = () => {
    if (!allAnswered) return
    setSubmitted(true)
    if (!xpAwarded && addXP) {
      const correct = section.questions.filter(q => answers[q.id] === (shuffledMap.get(q.id)?.correctIndex ?? q.correctIndex)).length
      addXP(correct * 10)
      setXpAwarded(true)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
  }

  const [showVocab, setShowVocab] = useState(false)
  const [showDiscussion, setShowDiscussion] = useState(false)

  const lines = section.passage.split('\n').filter(Boolean)
  const passageTitle = section.title || lines[0]
  const bodyText = section.title ? lines.join('\n\n').trim() : lines.slice(1).join('\n\n').trim()
  const wordCount = section.passage.trim().split(/\s+/).length
  const readingTimeMin = Math.max(1, Math.round(wordCount / 180))

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1.5 flex items-center gap-1.5">
              <BookOpen size={12} /> Reading Comprehension
            </p>
            <h3 className="text-xl font-bold leading-snug">{passageTitle}</h3>
          </div>
          <div className="shrink-0 text-right text-xs opacity-80 space-y-1">
            <div className="flex items-center gap-1 justify-end"><Clock size={12} /> {readingTimeMin} min</div>
            <div className="flex items-center gap-1 justify-end"><FileText size={12} /> {wordCount} words</div>
          </div>
        </div>
      </div>

      {/* Vocabulary — collapsible pre-reading */}
      {section.vocabulary && section.vocabulary.length > 0 && (
        <div className="card border-sky-100 dark:border-sky-900">
          <button
            onClick={() => setShowVocab(p => !p)}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="flex items-center gap-2">
              <BookMarked size={16} className="text-sky-500" />
              <span>Key Vocabulary <span className="text-xs font-normal text-gray-400">({section.vocabulary.length} words)</span></span>
            </span>
            {showVocab ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {showVocab && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 grid gap-2">
              {section.vocabulary.map((v, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-sky-50/50 dark:bg-sky-900/10 rounded-xl px-3 py-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{v.word}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{v.definition}</p>
                    {v.example && (
                      <p className="text-xs text-sky-600 dark:text-sky-400 italic mt-0.5">"{v.example}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Idea — pre-reading */}
      {section.mainIdea && section.mainIdea.length > 0 && (
        <div className="card bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/50">
          <div className="flex items-start gap-2.5">
            <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1.5">Main Idea</p>
              <ul className="space-y-1.5">
                {section.mainIdea.map((idea, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                    <ChevronRight size={14} className="shrink-0 mt-0.5 text-amber-400" />
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Passage */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-sky-500 rounded-full" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Read the passage</p>
          </div>
          <AudioButton text={section.passage} size="sm" rate={0.8} label="Butun matnni tinglash" />
        </div>
        <div className="text-sm leading-[1.95] text-gray-700 dark:text-gray-300 space-y-3">
          {bodyText.split('\n\n').filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* Questions */}
      {submitted ? (
        <div className="space-y-4">
          {/* Score panel */}
          <div className={`rounded-2xl border p-5 text-center ${
            pct === 100
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
              : pct >= 60
              ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
          }`}>
            <p className={`text-4xl font-bold font-mono mb-1 ${pct === 100 ? 'text-green-600 dark:text-green-400' : pct >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}`}>
              {score}<span className="text-xl text-gray-400 dark:text-gray-500">/{total}</span>
            </p>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full max-w-xs mx-auto mb-3">
              <div
                className={`h-2 rounded-full transition-all ${pct === 100 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {pct === 100 ? '🎯 Perfect! Excellent reading comprehension!' :
               pct >= 80 ? '👍 Great job! Very good understanding.' :
               pct >= 60 ? '📚 Good attempt — re-read the passage for details.' :
               '💪 Try again after re-reading the passage carefully.'}
            </p>
            {addXP && (
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl px-3 py-1.5 mb-3">
                <Trophy size={14} /> +{score * 10} XP earned
              </div>
            )}
            <div className="flex gap-2 justify-center mt-2">
              <button onClick={handleRetry} className="btn-secondary text-sm py-2 px-5 inline-flex items-center gap-2">
                <RotateCcw size={14} /> Try Again
              </button>
            </div>
          </div>

          {/* Answer review */}
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Answer Review</p>
          <div className="space-y-3">
            {section.questions.map((q, qi) => {
              const userAns = answers[q.id]
              const shuffled = shuffledMap.get(q.id)
              const displayOptions = shuffled?.options ?? q.options
              const correctIdx = shuffled?.correctIndex ?? q.correctIndex
              const isCorrect = userAns === correctIdx
              return (
                <div key={q.id} className={`rounded-2xl border p-4 ${isCorrect ? 'border-green-200 dark:border-green-800 bg-green-50/40 dark:bg-green-900/10' : 'border-red-200 dark:border-red-800 bg-red-50/40 dark:bg-red-900/10'}`}>
                  <div className="flex items-start gap-2.5 mb-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {qi + 1}
                    </span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">{q.question}</p>
                  </div>
                  <div className="space-y-1.5 ml-8">
                    {displayOptions.map((opt, i) => {
                      const isCorrectOpt = i === correctIdx
                      const isUserWrong = i === userAns && !isCorrect
                      let cls = 'border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600'
                      if (isCorrectOpt) cls = 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold'
                      else if (isUserWrong) cls = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      return (
                        <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-sm ${cls}`}>
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isCorrectOpt && <CheckCircle size={14} className="text-green-600 dark:text-green-400 shrink-0" />}
                          {isUserWrong && <XCircle size={14} className="text-red-500 dark:text-red-400 shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-2.5 ml-8 flex items-start gap-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2.5">
                    <span className="text-blue-500 text-xs mt-0.5">💡</span>
                    <p className="text-xs text-blue-700 dark:text-blue-300 italic">{q.explanation}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Questions header + progress */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comprehension Questions</p>
            <span className="text-xs text-gray-400 dark:text-gray-500">{answeredCount}/{total} answered</span>
          </div>
          <div className="flex gap-1.5">
            {section.questions.map(q => (
              <div
                key={q.id}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${answers[q.id] !== undefined ? 'bg-sky-500' : 'bg-gray-200 dark:bg-gray-700'}`}
              />
            ))}
          </div>

          {section.questions.map((q, qi) => {
            const selected = answers[q.id]
            const displayOptions = shuffledMap.get(q.id)?.options ?? q.options
            return (
              <div key={q.id} className="card">
                <div className="flex items-start gap-2.5 mb-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${selected !== undefined ? 'bg-sky-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                    {qi + 1}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">{q.question}</p>
                </div>
                <div className="space-y-1.5 ml-8">
                  {displayOptions.map((opt, i) => {
                    const isSel = selected === i
                    return (
                      <button
                        key={i}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: i }))}
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                          isSel
                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-800 dark:text-sky-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-sky-300 dark:hover:border-sky-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSel ? 'bg-sky-500 border-sky-500 text-white' : 'border-current'}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <CheckCircle size={18} />
            Check Answers
            {addXP && ` (+${total * 10} XP)`}
          </button>
        </div>
      )}

      {/* Discussion — post-reading */}
      {section.discussion && section.discussion.length > 0 && (
        <div className="card border-violet-100 dark:border-violet-900/50">
          <button
            onClick={() => setShowDiscussion(p => !p)}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="flex items-center gap-2">
              <MessageCircle size={16} className="text-violet-500" />
              <span>Discussion Questions <span className="text-xs font-normal text-gray-400">({section.discussion.length} questions)</span></span>
            </span>
            {showDiscussion ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {showDiscussion && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-3">
              {section.discussion.map((d, i) => (
                <div key={i} className="bg-violet-50/50 dark:bg-violet-900/10 rounded-xl p-3.5">
                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{d.question}</p>
                      {d.hints && d.hints.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {d.hints.map((hint, hi) => (
                            <span key={hi} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 text-xs text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                              <MessageSquareQuote size={10} />
                              {hint}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
