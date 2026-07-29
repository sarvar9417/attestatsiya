import { useState, useMemo, useEffect, useRef } from 'react'
import { useI18n } from '../../i18n'
import { useCountdown, Timer } from './mockTestHelpers'
import type { ReadingText } from '@/data/reading'

interface MockTestIELTSReadingProps {
  texts: ReadingText[]
  onDone: (pct: number) => void
}

export default function MockTestIELTSReading({ texts, onDone }: MockTestIELTSReadingProps) {
  const { t } = useI18n()

  const selected = useMemo<ReadingText[]>(() => {
    const pick = (lv: string) => texts.find(t => t.level === lv)
    const wanted = ['B1', 'B1+', 'B2'].map(pick).filter((t): t is ReadingText => !!t)
    return wanted.length >= 3 ? wanted : texts.slice(0, 3)
  }, [texts])

  const offsets = useMemo(() => {
    const o: number[] = []; let acc = 0
    for (const t of selected) { o.push(acc); acc += t.questions.length }
    return o
  }, [selected])

  const totalQ = selected.reduce((a, t) => a + t.questions.length, 0)

  const [pIdx, setPIdx]       = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(totalQ).fill(null))
  const timer = useCountdown(30 * 60)
  const startRef = useRef(timer.start)
  startRef.current = timer.start
  useEffect(() => { startRef.current() }, [])

  if (selected.length === 0) return null
  const passage = selected[pIdx]
  const base    = offsets[pIdx]
  const isLast  = pIdx + 1 >= selected.length
  const answeredTotal = answers.filter(a => a !== null).length
  const answeredHere  = passage.questions.filter((_, i) => answers[base + i] !== null).length

  function pick(localIdx: number, oi: number) {
    setAnswers(prev => { const u = [...prev]; u[base + localIdx] = oi; return u })
  }
  function next() {
    if (isLast) {
      const allQ = selected.flatMap(t => t.questions)
      const correct = answers.filter((a, i) => a === allQ[i].correctIndex).length
      onDone(Math.round((correct / Math.max(1, totalQ)) * 100))
    } else {
      setPIdx(pIdx + 1)
      try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch { /* noop */ }
    }
  }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-b1-600">{t('mockTest.ieltsReadingTitle', { current: String(pIdx + 1), total: String(selected.length) })}</span>
          <p className="text-xs text-gray-500 mt-0.5">{t('mockTest.answersGiven', { count: String(answeredTotal), total: String(totalQ) })}</p>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 180} />
      </div>
      <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-b1-500 rounded-full transition-all" style={{ width: `${(answeredTotal / Math.max(1, totalQ)) * 100}%` }} />
      </div>

      <div className="card bg-gray-50 dark:bg-gray-800/50 mb-4 max-h-72 overflow-y-auto">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
          {passage.title} <span className="text-xs font-normal text-gray-400">· {passage.level}</span>
        </p>
        {passage.paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{p}</p>
        ))}
      </div>

      <div className="space-y-3">
        {passage.questions.map((q, li) => (
          <div key={li} className="card">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{li + 1}. {q.question}</p>
            <div className="space-y-2" role="radiogroup">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => pick(li, oi)} role="radio" aria-checked={answers[base + li] === oi}
                  className={`w-full text-left p-2.5 rounded-xl border text-sm transition-all
                    ${answers[base + li] === oi ? 'bg-b1-50 border-b1-400 text-b1-800 font-semibold' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-b1-200'}`}>
                  <span className="font-semibold mr-2 text-gray-400">{['A','B','C','D'][oi]}.</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={next} disabled={answeredHere === 0} className="w-full btn-primary text-sm mt-4">
        {isLast ? t('mockTest.ieltsReadingFinish') : t('mockTest.ieltsReadingNext')}
      </button>
    </div>
  )
}
