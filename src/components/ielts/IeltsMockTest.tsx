import { useState, useEffect } from 'react'
import { Clock, CheckCircle, ChevronRight } from 'lucide-react'
import { useI18n } from '../../i18n'

// ── Types ─────────────────────────────────────────────────────────────────────

interface MCQ {
  question: string
  options: string[]
  correct: number
}

interface TFNG {
  statement: string
  answer: 'true' | 'false' | 'not given'
}

type Phase = 'test' | 'result'

// ── Timer ─────────────────────────────────────────────────────────────────────

function Timer({ secondsLeft, total }: { secondsLeft: number; total: number }) {
  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const pct = (secondsLeft / total) * 100
  const warn = secondsLeft < 300

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-semibold
      ${warn ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
      <Clock size={13} />
      {mins}:{String(secs).padStart(2, '0')}
      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden ml-2">
        <div className={`h-full rounded-full ${warn ? 'bg-red-500' : 'bg-primary-500'} transition-all`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Passage data ──────────────────────────────────────────────────────────────

const PASSAGE = {
  title: 'The Impact of Urban Green Spaces on Mental Health',
  paragraphs: [
    'Recent studies have shown that access to urban green spaces significantly improves mental health outcomes for city dwellers. Researchers at the University of Exeter analysed data from over 10,000 participants across 18 countries and found that people living near parks and gardens reported 20% lower levels of stress and anxiety compared to those in densely built-up areas with little vegetation.',
    'The concept of "biophilia," popularised by biologist Edward O. Wilson, suggests that humans have an innate tendency to seek connections with nature. This theory has gained substantial empirical support in recent years. A landmark study published in the Proceedings of the National Academy of Sciences found that a 90-minute walk in a natural setting reduced activity in the prefrontal cortex, the brain region associated with repetitive negative thinking, known as rumination.',
    'Urban planners have increasingly recognised the therapeutic potential of green infrastructure. Singapore\'s "City in a Garden" initiative, for example, has integrated vertical gardens, rooftop parks, and connected green corridors throughout the city-state. Following the implementation of these features, surveys indicated a 15% improvement in reported well-being among residents living within 500 metres of newly created green spaces.',
    'However, not all green spaces deliver equal mental health benefits. Research indicates that biodiversity plays a crucial role — environments rich in wildlife and varied plant species produce greater psychological improvements than manicured lawns with limited ecological diversity. Furthermore, the perceived safety and accessibility of green spaces significantly moderates their health benefits, particularly for women and elderly populations.',
  ],
}

const MCQ_QUESTIONS: MCQ[] = [
  {
    question: 'According to the University of Exeter study, people living near parks reported lower levels of stress and anxiety by:',
    options: ['10%', '15%', '20%', '25%'],
    correct: 2,
  },
  {
    question: 'Who popularised the concept of "biophilia"?',
    options: ['Charles Darwin', 'Edward O. Wilson', 'Sigmund Freud', 'Carl Jung'],
    correct: 1,
  },
  {
    question: 'In the PNAS study, how long was the walk in a natural setting that reduced rumination?',
    options: ['30 minutes', '60 minutes', '90 minutes', '120 minutes'],
    correct: 2,
  },
  {
    question: 'Singapore\'s green initiative improved well-being by how much among nearby residents?',
    options: ['10%', '15%', '20%', '30%'],
    correct: 1,
  },
]

const TFNG_QUESTIONS: TFNG[] = [
  {
    statement: 'The University of Exeter study involved participants from 18 different countries.',
    answer: 'true',
  },
  {
    statement: 'Green spaces with limited biodiversity produce the same psychological benefits as those rich in wildlife.',
    answer: 'false',
  },
  {
    statement: 'The prefrontal cortex is associated with short-term memory.',
    answer: 'not given',
  },
]

const MATCH_HEADINGS: { heading: string; para: number }[] = [
  { heading: 'The role of nature in reducing negative thoughts', para: 2 },
  { heading: 'How city design incorporates natural elements', para: 3 },
  { heading: 'Not all parks are equally beneficial', para: 4 },
]

// ── Main Component ────────────────────────────────────────────────────────────

export default function IeltsMockTest() {
  const { t } = useI18n()
  const [phase, setPhase] = useState<Phase>('test')
  const [mcqAnswers, setMcqAnswers] = useState<(number | null)[]>(Array(MCQ_QUESTIONS.length).fill(null))
  const [tfngAnswers, setTfngAnswers] = useState<('true' | 'false' | 'not given' | null)[]>(Array(TFNG_QUESTIONS.length).fill(null))
  const [matchAnswers, setMatchAnswers] = useState<(number | null)[]>(Array(MATCH_HEADINGS.length).fill(null))
  const [timeLeft, setTimeLeft] = useState(60 * 60)
  const total = 60 * 60

  useEffect(() => {
    if (phase !== 'test' || timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft((n) => n - 1), 1000)
    return () => clearInterval(id)
  }, [phase, timeLeft])

  const answered = [...mcqAnswers, ...tfngAnswers, ...matchAnswers].filter((a) => a !== null).length
  const totalQ = MCQ_QUESTIONS.length + TFNG_QUESTIONS.length + MATCH_HEADINGS.length

  function calcScore() {
    let correct = 0
    MCQ_QUESTIONS.forEach((q, i) => { if (mcqAnswers[i] === q.correct) correct++ })
    TFNG_QUESTIONS.forEach((q, i) => { if (tfngAnswers[i] === q.answer) correct++ })
    MATCH_HEADINGS.forEach((h, i) => { if (matchAnswers[i] === h.para) correct++ })
    return Math.round((correct / totalQ) * 100)
  }

  function submit() {
    setPhase('result')
  }

  if (phase === 'result') {
    const score = calcScore()
    const correct = Math.round((score / 100) * totalQ)
    const passed = score >= 60
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <div className="card bg-gradient-to-br from-purple-50 to-primary-50 border-purple-100 text-center mb-5">
          <CheckCircle size={36} className={`mx-auto mb-2 ${passed ? 'text-green-600' : 'text-orange-500'}`} />
          <p className="text-xs text-gray-500 mb-1">{t('ielts.score')}</p>
          <p className="text-5xl font-bold text-purple-700">{score}%</p>
          <p className="text-sm text-gray-600 mt-1">
            {correct}/{totalQ} {t('mockTest.progressLabel', { correct: String(correct), total: String(totalQ) }).split(' ')[1]}
          </p>
          <p className={`text-lg font-semibold mt-3 ${passed ? 'text-green-700' : 'text-orange-600'}`}>
            {passed ? t('ielts.pass') : t('ielts.fail')}
          </p>
        </div>

        {/* Correct answers review */}
        <div className="card mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Review</p>
          {MCQ_QUESTIONS.map((q, i) => (
            <div key={`mcq-${i}`} className="mb-3">
              <p className="text-sm font-medium text-gray-800">{i + 1}. {q.question}</p>
              <p className={`text-xs mt-1 ${mcqAnswers[i] === q.correct ? 'text-green-600' : 'text-red-500'}`}>
                {mcqAnswers[i] === q.correct ? '✓' : '✗'} {q.options[q.correct]}
              </p>
            </div>
          ))}
          {TFNG_QUESTIONS.map((q, i) => (
            <div key={`tfng-${i}`} className="mb-3">
              <p className="text-sm font-medium text-gray-800">{i + 5}. {q.statement}</p>
              <p className={`text-xs mt-1 ${tfngAnswers[i] === q.answer ? 'text-green-600' : 'text-red-500'}`}>
                {tfngAnswers[i] === q.answer ? '✓' : '✗'} {q.answer.toUpperCase()}
              </p>
            </div>
          ))}
          {MATCH_HEADINGS.map((h, i) => (
            <div key={`match-${i}`} className="mb-3">
              <p className="text-sm font-medium text-gray-800">{h.heading}</p>
              <p className={`text-xs mt-1 ${matchAnswers[i] === h.para ? 'text-green-600' : 'text-red-500'}`}>
                {matchAnswers[i] === h.para ? '✓' : '✗'} Paragraph {h.para}
              </p>
            </div>
          ))}
        </div>

        <button onClick={() => { setPhase('test'); setTimeLeft(60 * 60); setMcqAnswers(Array(MCQ_QUESTIONS.length).fill(null)); setTfngAnswers(Array(TFNG_QUESTIONS.length).fill(null)); setMatchAnswers(Array(MATCH_HEADINGS.length).fill(null)) }}
          className="w-full btn-primary text-sm">
          {t('mockTest.retryButton')}
        </button>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t('ielts.title')}</h1>
          <p className="text-xs text-gray-500">{answered}/{totalQ} answered</p>
        </div>
        <Timer secondsLeft={timeLeft} total={total} />
      </div>

      <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-purple-500 rounded-full transition-all"
          style={{ width: `${(answered / totalQ) * 100}%` }} />
      </div>

      {/* Reading passage */}
      <div className="card bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 mb-5 max-h-64 overflow-y-auto">
        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">{t('ielts.readingPassage')}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">{PASSAGE.title}</p>
        {PASSAGE.paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
            <span className="font-semibold text-purple-600">[{i + 1}]</span> {p}
          </p>
        ))}
      </div>

      {/* Section 1: Multiple Choice */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full mb-3 inline-block">
          Questions 1–4 · Multiple Choice
        </span>
        <div className="space-y-3">
          {MCQ_QUESTIONS.map((q, qi) => (
            <div key={qi} className="card">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <button key={oi} onClick={() => setMcqAnswers((prev) => { const u = [...prev]; u[qi] = oi; return u })}
                    className={`w-full text-left p-2.5 rounded-xl border text-sm transition-all
                      ${mcqAnswers[qi] === oi
                        ? 'bg-purple-50 border-purple-400 text-purple-800 font-semibold'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-purple-200'}`}>
                    <span className="font-semibold mr-2 text-gray-400">{['A', 'B', 'C', 'D'][oi]}.</span>{opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: True/False/Not Given */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full mb-3 inline-block">
          Questions 5–7 · True / False / Not Given
        </span>
        <div className="space-y-3">
          {TFNG_QUESTIONS.map((q, qi) => (
            <div key={qi} className="card">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{qi + 5}. {q.statement}</p>
              <div className="flex gap-2">
                {(['true', 'false', 'not given'] as const).map((val) => (
                  <button key={val} onClick={() => setTfngAnswers((prev) => { const u = [...prev]; u[qi] = val; return u })}
                    className={`flex-1 p-2 rounded-xl border text-xs font-semibold transition-all
                      ${tfngAnswers[qi] === val
                        ? 'bg-purple-50 border-purple-400 text-purple-800'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-purple-200'}`}>
                    {val === 'not given' ? 'Not Given' : val === 'true' ? 'True' : 'False'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Matching Headings */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full mb-3 inline-block">
          Questions 8–10 · Matching Headings
        </span>
        <div className="space-y-3">
          {MATCH_HEADINGS.map((h, qi) => (
            <div key={qi} className="card">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{qi + 8}. {h.heading}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((para) => (
                  <button key={para} onClick={() => setMatchAnswers((prev) => { const u = [...prev]; u[qi] = para; return u })}
                    className={`flex-1 p-2 rounded-xl border text-xs font-semibold transition-all
                      ${matchAnswers[qi] === para
                        ? 'bg-purple-50 border-purple-400 text-purple-800'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-purple-200'}`}>
                    Para {para}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button onClick={submit}
        disabled={answered === 0}
        className="w-full btn-primary text-sm flex items-center justify-center gap-2">
        {t('ielts.submit')} <ChevronRight size={14} />
      </button>
    </div>
  )
}
