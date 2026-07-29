// Placement Test — qayta ishlatiladigan adaptiv test halqasi
// Reja: docs/EnglishPath_Roadmap.md (1.1)
// Sahifa (/placement-test) va onboarding ikkalasi shu komponentni ishlatadi.

import { useState, useCallback } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import {
  createSession, pickNextQuestion, applyAnswer, isComplete, computeResult,
  PLACEMENT_TEST_LENGTH,
} from '../../data/placement/adaptive'
import type { PlacementResult } from '../../data/placement/types'

interface Props {
  onComplete: (result: PlacementResult) => void
}

export default function PlacementQuiz({ onComplete }: Props) {
  const [state, setState] = useState(() => {
    const session = createSession()
    return { session, currentQ: pickNextQuestion(session) }
  })
  const [selected, setSelected] = useState<number | null>(null)

  const { session, currentQ } = state

  const next = useCallback(() => {
    if (selected == null || !currentQ) return
    const correct = selected === currentQ.correct
    const ns = applyAnswer(session, currentQ, correct)
    if (isComplete(ns)) {
      onComplete(computeResult(ns))
    } else {
      setState({ session: ns, currentQ: pickNextQuestion(ns) })
      setSelected(null)
    }
  }, [selected, currentQ, session, onComplete])

  if (!currentQ) return null

  const qNum = session.asked + 1
  const pct = Math.round((session.asked / PLACEMENT_TEST_LENGTH) * 100)
  const isLast = session.asked + 1 >= PLACEMENT_TEST_LENGTH

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          <span>Savol {qNum} / {PLACEMENT_TEST_LENGTH}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="h-full bg-primary-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Savol */}
      <div className="rounded-2xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-base font-bold text-gray-900 dark:text-gray-100">{currentQ.question}</p>
      </div>

      {/* Variantlar */}
      <div className="space-y-2">
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all
              ${selected === i
                ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-400 dark:border-primary-600'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
              ${selected === i ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
              {selected === i ? <Check size={14} /> : String.fromCharCode(65 + i)}
            </span>
            <span className="text-sm text-gray-800 dark:text-gray-100">{opt}</span>
          </button>
        ))}
      </div>

      <button
        onClick={next}
        disabled={selected == null}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-40"
      >
        {isLast ? 'Yakunlash' : 'Keyingi'} <ArrowRight size={16} />
      </button>
    </div>
  )
}
