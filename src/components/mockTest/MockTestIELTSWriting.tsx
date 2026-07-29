import { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { useI18n } from '../../i18n'
import { useCountdown, Timer, wordCount, parseAIScore } from './mockTestHelpers'
import { evaluateWriting } from '@/lib/claude'
import type { MockTestData } from '@/services/mockTestService'

interface MockTestIELTSWritingProps {
  data: MockTestData | null
  onDone: (t1: number, t2: number) => void
}

export default function MockTestIELTSWriting({ data, onDone }: MockTestIELTSWritingProps) {
  const { t } = useI18n()
  const writingTask1 = data?.writingTask1 ?? { prompt: '', instruction: '' }
  const writingTask2 = data?.writingTask2 ?? { prompt: '', instruction: '' }
  const [task,     setTask]     = useState<1 | 2>(1)
  const [text1,    setText1]    = useState('')
  const [text2,    setText2]    = useState('')
  const [score1,   setScore1]   = useState(0)
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [done1,    setDone1]    = useState(false)
  const timer = useCountdown(40 * 60)
  const startRef = useRef(timer.start)
  startRef.current = timer.start
  useEffect(() => { startRef.current() }, [])

  async function submitTask1() {
    setLoading1(true)
    let full = ''
    await evaluateWriting(writingTask1.prompt, text1, 'B2',
      (tok) => { full += tok },
      (text) => {
        const avg = Math.round(
          (parseAIScore(text,'TASK_ACHIEVEMENT') + parseAIScore(text,'COHERENCE') +
           parseAIScore(text,'VOCABULARY') + parseAIScore(text,'GRAMMAR')) / 4
        )
        setScore1(avg); setLoading1(false); setDone1(true); setTask(2)
      },
      () => setLoading1(false)
    )
    void full
  }

  async function submitTask2() {
    setLoading2(true)
    let full = ''
    await evaluateWriting(writingTask2.prompt, text2, 'B2',
      (tok) => { full += tok },
      (text) => {
        const avg = Math.round(
          (parseAIScore(text,'TASK_ACHIEVEMENT') + parseAIScore(text,'COHERENCE') +
           parseAIScore(text,'VOCABULARY') + parseAIScore(text,'GRAMMAR')) / 4
        )
        setLoading2(false); onDone(score1, avg)
      },
      () => setLoading2(false)
    )
    void full
  }

  const curText    = task === 1 ? text1 : text2
  const setCurText = task === 1 ? setText1 : setText2
  const curPrompt  = task === 1 ? writingTask1 : writingTask2
  const wc         = wordCount(curText)
  const minWords   = task === 1 ? 150 : 250
  const canSubmit  = wc >= minWords && !(task === 1 ? loading1 : loading2)

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-b2-600">✍️ Writing</span>
          <div className="flex gap-2 mt-1">
            {[1, 2].map((t) => (
              <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-semibold
                ${task === t ? 'bg-b2-100 text-b2-700' : done1 && t === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                Task {t} {done1 && t === 1 ? '✓' : ''}
              </span>
            ))}
          </div>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 300} />
      </div>

      <div className="card bg-b2-50 border-b2-100 mb-3">
        <p className="text-xs font-semibold text-b2-700 mb-1">{t('mockTest.ieltsWritingTask', { n: String(task), title: task === 1 ? 'Data Description' : 'Essay', min: task === 1 ? '150' : '250' })}</p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{curPrompt.prompt}</p>
      </div>

      <div className="card mb-3">
        <textarea
          className="w-full min-h-[200px] text-sm text-gray-800 dark:text-gray-100 dark:bg-transparent leading-relaxed resize-none outline-none placeholder-gray-300 dark:placeholder-gray-600"
          placeholder={t('mockTest.writingPlaceholder')}
          value={curText}
          onChange={(e) => setCurText(e.target.value)}
          disabled={task === 1 ? loading1 : loading2}
        />
        <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
          <span className={`text-xs font-semibold ${wc >= minWords ? 'text-green-600' : 'text-gray-400'}`}>
            {t('mockTest.wordCount', { count: String(wc) })} / {minWords}
          </span>
        </div>
      </div>

      <button onClick={task === 1 ? submitTask1 : submitTask2} disabled={!canSubmit}
        className="w-full btn-primary text-sm flex items-center justify-center gap-2">
        {(task === 1 ? loading1 : loading2)
          ? <><Loader2 size={14} className="animate-spin" /> {t('mockTest.writingEval')}</>
          : task === 1 ? t('mockTest.writingSubmit1') : t('mockTest.writingSubmit2')}
      </button>
    </div>
  )
}
