import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { useI18n } from '../../i18n'
import { useCountdown, Timer } from './mockTestHelpers'
import type { TQ } from '@/data/mockTestData'

interface MockTestWeeklyTestProps {
  questions: TQ[]
  level: 'A1' | 'B1' | 'B2'
  mins: number
  onDone: (correct: number, total: number) => void
}

export default function MockTestWeeklyTest({ questions, level, mins, onDone }: MockTestWeeklyTestProps) {
  const { t } = useI18n()
  const [idx,     setIdx]     = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [chosen,  setChosen]  = useState<number | null>(null)
  const timer = useCountdown(mins * 60)

  useEffect(() => { timer.start() }, [mins])

  const q    = questions[idx]
  const done = idx >= questions.length

  function selectAnswer(opt: number) { setChosen(opt) }

  function next() {
    const updated = [...answers]
    updated[idx] = chosen
    setAnswers(updated)
    if (idx + 1 >= questions.length) {
      const correct = updated.filter((a, i) => a === questions[i].ans).length
      onDone(correct, questions.length)
    } else {
      setIdx(idx + 1)
      setChosen(null)
    }
  }

  if (done) return null

  const sectionLabel: Record<string, string> = {
    grammar: t('mockTest.sectionGrammar'),
    vocabulary: t('mockTest.sectionVocab'),
    reading: t('mockTest.sectionReading'),
  }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">{t('mockTest.weeklyLabel', { level })}</p>
          <p className="text-sm font-semibold text-gray-700">{t('mockTest.questionOf', { current: String(idx + 1), total: String(questions.length) })}</p>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 300} />
      </div>

      <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full transition-all"
          style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full mb-3 inline-block">
        {sectionLabel[q.section]}
      </span>

      {q.passage && (
        <div className="card bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">{q.passage}</p>
        </div>
      )}

      <div className="card mb-4">
        <p className="text-base font-medium text-gray-900 dark:text-gray-100 leading-relaxed">{q.q}</p>
      </div>

      <div className="space-y-2 mb-5">
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => selectAnswer(i)}
            className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all
              ${chosen === i
                ? 'bg-primary-50 border-primary-400 text-primary-800 font-semibold'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-200'}`}>
            <span className="font-semibold mr-2 text-gray-400">{['A','B','C','D'][i]}.</span>
            {opt}
          </button>
        ))}
      </div>

      <button onClick={next} disabled={chosen === null}
        className="w-full btn-primary text-sm flex items-center justify-center gap-2">
        {idx + 1 >= questions.length ? t('mockTest.finishButton') : <>{t('mockTest.nextButton')} <ChevronRight size={14} /></>}
      </button>
    </div>
  )
}
