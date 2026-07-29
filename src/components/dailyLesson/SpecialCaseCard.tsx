import { useState } from 'react'
import type { SpecialCase } from '../../data/dailyLessons'
import { normalizeAnswer, checkAnswer, getCorrectText } from './helpers'
import { saveExerciseAnswersToDB } from '../../services/lessonService'

export default function SpecialCaseCard({ sc, addXP, lessonId }: { sc: SpecialCase; addXP: (n: number) => void; lessonId: string }) {
  const [drillAnswers, setDrillAnswers] = useState<Record<number, string[]>>({})
  const [drillSubmitted, setDrillSubmitted] = useState<Record<number, boolean>>({})
  const [drillCorrect, setDrillCorrect] = useState<Record<number, boolean>>({})

  const handleChange = (exId: number, blankIdx: number, val: string) => {
    setDrillAnswers((prev) => {
      const cur = [...(prev[exId] ?? [])]
      cur[blankIdx] = val
      return { ...prev, [exId]: cur }
    })
  }

  const handleSubmit = (ex: import('../../data/dailyLessons').DailyExercise) => {
    const userAns = drillAnswers[ex.id] ?? []
    const ok = checkAnswer(ex, userAns)
    setDrillSubmitted((prev) => ({ ...prev, [ex.id]: true }))
    setDrillCorrect((prev) => ({ ...prev, [ex.id]: ok }))
    if (ok) addXP(10)
    saveExerciseAnswersToDB(lessonId, -1, 'drill', [
      { exerciseId: ex.id, exerciseType: ex.type, answer: userAns, isCorrect: ok },
    ])
  }

  const handleRetry = (exId: number) => {
    setDrillSubmitted((prev) => ({ ...prev, [exId]: false }))
    setDrillAnswers((prev) => ({ ...prev, [exId]: [] }))
  }

  return (
    <div className="card border-primary-200 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center text-sm font-bold text-orange-700 flex-shrink-0">!</div>
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{sc.title}</h3>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-3 border border-orange-100">
        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1.5">Qoida</p>
        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{sc.rule}</p>
        <div className="mt-2 flex items-start gap-2">
          <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">⚠️ Xato</span>
          <p className="text-xs text-red-600">{sc.commonMistakes}</p>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {sc.examples.map((ex, i) => (
          <div key={i} className="border-l-[3px] border-primary-300 pl-3 py-1">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">{ex.en}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">{ex.uz}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-3">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">🎯 Mashqlar</p>
        {sc.drills.map((ex, i) => {
          const sub = drillSubmitted[ex.id] ?? false
          const ok = drillCorrect[ex.id] ?? false
          const answers = drillAnswers[ex.id] ?? []
          const borderCls = sub ? (ok ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30') : 'border-gray-100 dark:border-gray-700'

          return (
            <div key={ex.id} className={`relative rounded-xl border p-3 transition-colors ${borderCls}`}>
              <div className={`absolute -left-2 -top-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm text-white ${sub ? (ok ? 'bg-green-500' : 'bg-red-500') : 'bg-primary-600'}`}>
                {sub ? (ok ? '✓' : '✗') : i + 1}
              </div>

              <div className="ml-0">
                {ex.type === 'fill-blank' && (
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">📝 Bo'sh joyni to'ldiring</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-loose">
                      {ex.question.split(/_{3,}/).map((part, pi, arr) => (
                        <span key={pi}>
                          {part}
                          {pi < arr.length - 1 && (
                            <input type="text" value={answers[pi] ?? ''} onChange={(e) => handleChange(ex.id, pi, e.target.value)} disabled={sub} placeholder="___"
                              className={`inline-block border-b-2 w-24 text-center text-xs font-semibold outline-none bg-transparent ${sub ? normalizeAnswer(answers[pi] ?? '') === normalizeAnswer(ex.blanks[pi] ?? '') ? 'border-green-500 text-green-700' : 'border-red-400 text-red-700' : 'border-primary-400 text-primary-700 focus:border-primary-600'}`}
                            />
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                )}

                {ex.type === 'multiple-choice' && (
                  <div>
                    <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-2">🔘 To'g'ri variantni tanlang</p>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2">{ex.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {ex.options.map((opt, oi) => {
                        const selected = answers[0] === opt
                        const correctOpt = opt === ex.correct
                        let cls = 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-violet-400'
                        if (sub) {
                          if (correctOpt) cls = 'border-green-400 bg-green-100 text-green-800 font-bold'
                          else if (selected) cls = 'border-red-400 bg-red-100 text-red-700'
                          else cls = 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                        } else if (selected) {
                          cls = 'border-violet-500 bg-violet-100 text-violet-800 font-semibold'
                        }
                        return (
                          <button key={opt} disabled={sub} onClick={() => handleChange(ex.id, 0, opt)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${cls}`}>
                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">{['A','B','C','D'][oi]}</span>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {ex.type === 'error-correction' && (
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">🔍 Xatoni toping</p>
                    <div className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1.5 mb-2">
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        {ex.question.split(ex.errorPart).map((part, pi, arr) => (
                          <span key={pi}>{part}{pi < arr.length - 1 && <span className="bg-red-100 text-red-700 font-bold px-0.5 rounded">{ex.errorPart}</span>}</span>
                        ))}
                      </p>
                    </div>
                    <input type="text" value={answers[0] ?? ''} onChange={(e) => handleChange(ex.id, 0, e.target.value)} disabled={sub} placeholder="To'g'ri variant..." className="input text-xs" />
                  </div>
                )}

                {ex.type === 'transformation' && (
                  <div>
                    <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">🔄 Gapni o'zgartiring</p>
                    <div className="bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-800 rounded-lg px-2.5 py-1.5 mb-1">
                      <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">{ex.question}</p>
                    </div>
                    <p className="text-xs text-teal-600 mb-1 font-medium">Boshlang'ich: <span className="font-mono font-bold">{ex.hint}</span></p>
                    <input type="text" value={answers[0] ?? ''} onChange={(e) => handleChange(ex.id, 0, e.target.value)} disabled={sub} placeholder="Javob..." className="input text-xs" />
                  </div>
                )}
              </div>

              {!sub ? (
                <button onClick={() => handleSubmit(ex)} className="mt-2 text-xs bg-primary-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Tekshirish +10 XP
                </button>
              ) : (
                <div className={`mt-2 text-xs ${ok ? 'text-green-700' : 'text-red-700'}`}>
                  <div className="flex items-center gap-2">
                    {ok ? <span className="font-semibold">✅ To'g'ri! +10 XP</span> : <span className="font-semibold">❌ Xato.</span>}
                    <button onClick={() => handleRetry(ex.id)} className="text-primary-600 underline hover:no-underline">Qayta urinish</button>
                  </div>
                  {!ok && (
                    <div className="flex flex-wrap gap-3 mt-1">
                      <p className="font-semibold">✍️ Sizning javobingiz: <span className="font-mono">{answers.length > 0 ? answers.join(' / ') : "(bo'sh)"}</span></p>
                      <p className="font-semibold">✅ To'g'ri javob: <span className="font-mono">{ex.type === 'fill-table' ? '' : getCorrectText(ex)}</span></p>
                    </div>
                  )}
                  {!ok && 'explanation' in ex && <p className="text-gray-600 dark:text-gray-400 mt-1">💡 {ex.explanation}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
