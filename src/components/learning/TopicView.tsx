import { useState } from 'react'
import { getTopicContent, type TestQuestion, type TheoryBlock } from '../../data/topicContent'
import { CheckCircle2, XCircle, Lightbulb, Code2, BookOpen, ArrowRight, ArrowLeft, Sparkles, ChevronRight } from 'lucide-react'

interface Props {
  moduleId: string
  subtopicId: string
  moduleTitle: string
  onComplete: (correct: number, total: number) => void
  onBack: () => void
}

export default function TopicView({ moduleId, subtopicId, moduleTitle, onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<'theory' | 'test' | 'result'>('theory')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  const content = getTopicContent(subtopicId)

  if (!content) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-400">Bu mavzu uchun kontent tayyor emas</p>
      </div>
    )
  }

  const questions = content.questions
  const correctCount = questions.filter(q => answers[q.id] === q.correctIndex && submitted[q.id]).length
  const allAnswered = questions.every(q => submitted[q.id])
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  const handleAnswer = (qId: string, optIdx: number) => {
    if (submitted[qId]) return
    setAnswers(p => ({ ...p, [qId]: optIdx }))
  }

  const handleSubmit = (qId: string) => {
    if (answers[qId] === undefined) return
    setSubmitted(p => ({ ...p, [qId]: true }))
  }

  const finishTest = () => {
    setPhase('result')
  }

  const continueLearning = () => {
    onComplete(correctCount, questions.length)
  }

  if (phase === 'result') {
    const passed = score >= 80
    const wrongTopics = questions.filter(q => answers[q.id] !== q.correctIndex)

    return (
      <div className="animate-fade-in">
        <div className={`card p-8 text-center mb-6 ${passed ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'}`}>
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-green-100 dark:bg-green-800/40' : 'bg-orange-100 dark:bg-orange-800/40'}`}>
            {passed ? <Sparkles size={36} className="text-green-600" /> : <BookOpen size={36} className="text-orange-600" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {passed ? 'Ajoyib! 🎉' : 'Yaxshi urinish! 💪'}
          </h2>
          <div className="text-5xl font-bold text-primary-600 mb-2">{score}%</div>
          <p className="text-gray-500 mb-2">{correctCount}/{questions.length} ta to'g'ri</p>
          {passed ? (
            <p className="text-green-600 font-medium">Mavzu o'zlashtirildi. Keyingi mavzuga o'tishingiz mumkin.</p>
          ) : (
            <p className="text-orange-600 font-medium">80% talab qilinadi. Xatolaringizni ko'rib chiqing.</p>
          )}
        </div>

        {!passed && wrongTopics.length > 0 && (
          <div className="card p-5 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Xatolar tahlili</h3>
            <div className="space-y-3">
              {wrongTopics.map(q => {
                const wrongAnswer = q.options[answers[q.id]]
                const rightAnswer = q.options[q.correctIndex]
                return (
                  <div key={q.id} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-1">{q.text}</p>
                    <p className="text-xs text-red-600 mb-1">Sizning javobingiz: {wrongAnswer}</p>
                    <p className="text-xs text-green-600 mb-1">To'g'ri javob: {rightAnswer}</p>
                    <p className="text-xs text-gray-500 mt-2">{q.explanation}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {!passed && (
            <button onClick={() => { setPhase('test'); setAnswers({}); setSubmitted({}) }} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Qayta urinish
            </button>
          )}
          <button onClick={continueLearning} className={`${passed ? 'btn-primary' : 'btn-secondary'} flex-1 flex items-center justify-center gap-2`}>
            {passed ? <>Keyingi mavzu <ArrowRight size={16} /></> : 'Keyinroq urinaman'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button onClick={onBack} className="hover:text-primary-600 transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Orqaga
        </button>
        <span>·</span>
        <span>{moduleTitle}</span>
        <span>·</span>
        <span className={phase === 'theory' ? 'text-primary-600 font-medium' : ''}>Nazariya</span>
        {phase === 'test' && <><span>·</span><span className="text-primary-600 font-medium">Test</span></>}
      </div>

      {phase === 'theory' && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{content.title}</h1>
            <div className="flex items-center gap-2">
              <span className="badge bg-primary-100 text-primary-700">{moduleId}</span>
              <span className="text-sm text-gray-400">{questions.length} ta savol</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {content.theory.map((block, i) => <TheoryBlockRenderer key={i} block={block} />)}
          </div>

          <button
            onClick={() => setPhase('test')}
            className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-semibold text-lg hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-200 dark:shadow-primary-900/30 flex items-center justify-center gap-2"
          >
            Bilimni tekshirish <ChevronRight size={20} />
          </button>
        </>
      )}

      {phase === 'test' && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Test: {content.title}</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{Object.keys(submitted).length}/{questions.length} ta bajarildi</span>
              {Object.keys(submitted).length > 0 && (
                <span className="text-sm font-medium text-primary-600">{correctCount} ta to'g'ri</span>
              )}
            </div>
            <div className="progress-bar mt-2">
              <div className="progress-fill bg-primary-500" style={{ width: `${(Object.keys(submitted).length / questions.length) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-5">
            {questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                selected={answers[q.id]}
                isSubmitted={submitted[q.id]}
                onSelect={(oi) => handleAnswer(q.id, oi)}
                onSubmit={() => handleSubmit(q.id)}
              />
            ))}
          </div>

          {allAnswered && (
            <button onClick={finishTest} className="btn-primary w-full mt-6 py-3 text-lg flex items-center justify-center gap-2">
              Natijani ko'rish <ArrowRight size={18} />
            </button>
          )}
        </>
      )}
    </div>
  )
}

function TheoryBlockRenderer({ block }: { block: TheoryBlock }) {
  switch (block.type) {
    case 'definition':
      return (
        <div className="card p-5 border-l-4 border-primary-500 bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-900/10">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{block.content}</p>
        </div>
      )
    case 'formula':
      return (
        <div className="card p-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center">
          <code className="text-lg font-mono text-primary-700 dark:text-primary-300 font-semibold">{block.content}</code>
        </div>
      )
    case 'code':
      return (
        <div className="card overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <Code2 size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500 font-mono">{block.language || 'code'}</span>
          </div>
          <pre className="p-4 text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto bg-white dark:bg-gray-900">{block.content}</pre>
        </div>
      )
    case 'example':
      return (
        <div className="card p-5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border border-amber-200 dark:border-amber-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Misol</span>
          </div>
          <code className="text-sm text-gray-700 dark:text-gray-300 font-mono">{block.content}</code>
        </div>
      )
    case 'note':
      return (
        <div className="card p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800/30">
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{block.content}</p>
        </div>
      )
    case 'table':
      return (
        <div className="card overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {block.content.split('\n').map((row, i) => (
                i === 0 ? null : i === 1 ? (
                  <thead key={i}>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      {row.split('|').filter(r => r.trim()).map((cell, ci) => (
                        <th key={ci} className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">{cell.trim()}</th>
                      ))}
                    </tr>
                  </thead>
                ) : (
                  <tbody key={i}>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      {row.split('|').filter(r => r.trim()).map((cell, ci) => (
                        <td key={ci} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{cell.trim()}</td>
                      ))}
                    </tr>
                  </tbody>
                )
              ))}
            </table>
          </div>
        </div>
      )
    default:
      return (
        <div className="card p-5">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{block.content}</p>
        </div>
      )
  }
}

function QuestionCard({ question: q, index, selected, isSubmitted, onSelect, onSubmit }: {
  question: TestQuestion; index: number; selected?: number; isSubmitted: boolean
  onSelect: (i: number) => void; onSubmit: () => void
}) {
  const typeColors: Record<string, string> = { Y1: 'bg-green-100 text-green-700', Y2: 'bg-blue-100 text-blue-700', Y3: 'bg-purple-100 text-purple-700' }

  return (
    <div className={`card p-5 border ${isSubmitted ? (selected === q.correctIndex ? 'border-green-200' : 'border-red-200') : 'border-gray-100 dark:border-gray-800'}`}>
      <div className="flex items-start gap-3 mb-4">
        <span className={`badge text-xs ${typeColors[q.type] || 'bg-gray-100 text-gray-600'}`}>{q.type}</span>
        <span className="text-xs text-gray-400 shrink-0">#{index + 1}</span>
        <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{q.text}</p>
      </div>

      <div className="space-y-2">
        {q.options.map((opt, oi) => {
          let cls = 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
          let icon = null
          if (isSubmitted) {
            if (oi === q.correctIndex) { cls = 'border-green-500 bg-green-50 dark:bg-green-900/20'; icon = <CheckCircle2 size={16} className="text-green-600 shrink-0" /> }
            else if (oi === selected) { cls = 'border-red-500 bg-red-50 dark:bg-red-900/20'; icon = <XCircle size={16} className="text-red-600 shrink-0" /> }
          } else if (selected === oi) {
            cls = 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          }
          return (
            <button key={oi} onClick={() => onSelect(oi)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm text-left transition-all ${cls}`}>
              <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-medium shrink-0 ${isSubmitted && oi === q.correctIndex ? 'border-green-500 text-green-600' : isSubmitted && oi === selected && oi !== q.correctIndex ? 'border-red-500 text-red-600' : selected === oi ? 'border-primary-500 text-primary-600' : 'border-gray-300'}`}>
                {icon || String.fromCharCode(65 + oi)}
              </span>
              <span className="text-gray-700 dark:text-gray-300">{opt}</span>
            </button>
          )
        })}
      </div>

      {!isSubmitted ? (
        <button onClick={onSubmit} disabled={selected === undefined} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Javobni tekshirish
        </button>
      ) : (
        <div className={`mt-3 p-3 rounded-xl text-sm ${selected === q.correctIndex ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p className={`font-medium mb-1 ${selected === q.correctIndex ? 'text-green-700' : 'text-red-700'}`}>
            {selected === q.correctIndex ? 'To\'g\'ri ✅' : 'Noto\'g\'ri ❌'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{q.explanation}</p>
        </div>
      )}
    </div>
  )
}
