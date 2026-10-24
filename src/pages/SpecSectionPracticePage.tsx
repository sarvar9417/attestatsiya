import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, RefreshCw, XCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import InlineText from '../components/learning/theory/InlineText'
import {
  SPEC_SECTIONS, checkSpecAnswer, getSpecQuestions,
  type SpecAnswer, type SpecCode, type SpecFeedback, type SpecQuestion,
} from '../features/content/specPracticeApi'

type AnswerState = { selected: SpecAnswer; feedback: SpecFeedback }
const PAGE_ERROR = 'Testlarni yuklab bo‘lmadi. Qayta urinib ko‘ring.'

function AnswerDetails({ question, feedback }: { question: SpecQuestion; feedback: SpecFeedback }) {
  const labels = new Map(question.options.map(o => [o.id, o.content_md]))
  const correct = feedback.correct_answer

  return (
    <div role="status" aria-live="polite"
      className={`mt-5 rounded-xl border p-4 text-sm ${feedback.correct
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100'
        : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100'}`}>
      <div className="flex items-center gap-2 font-semibold">
        {feedback.correct ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        {feedback.correct ? 'To‘g‘ri javob!' : 'Noto‘g‘ri javob'}
      </div>
      <div className="mt-3">
        <p className="font-semibold">To‘g‘ri javob:</p>
        {'option_id' in correct && (
          <p className="mt-1"><InlineText text={labels.get(correct.option_id) ?? 'Variant topilmadi'} /></p>
        )}
        {'pairs' in correct && (
          <ul className="mt-2 space-y-1">
            {question.options.filter(o => o.side === 'a').map(o => (
              <li key={o.id}><InlineText text={o.content_md} /> → <InlineText text={labels.get(correct.pairs[o.id]) ?? '—'} /></li>
            ))}
          </ul>
        )}
        {'order' in correct && (
          <ol className="mt-2 list-inside list-decimal space-y-1">
            {correct.order.map(id => <li key={id}><InlineText text={labels.get(id) ?? '—'} /></li>)}
          </ol>
        )}
      </div>
      <div className="mt-3 border-t border-current/15 pt-3">
        <p className="font-semibold">Izoh va yechim:</p>
        <p className="mt-1 whitespace-pre-wrap leading-relaxed"><InlineText text={feedback.explanation_md || 'Ushbu savol uchun izoh kiritilmagan.'} /></p>
      </div>
    </div>
  )
}

function SpecQuestionForm({
  question, section, answerState, onAnswered,
}: {
  question: SpecQuestion
  section: SpecCode
  answerState: AnswerState | undefined
  onAnswered: (questionId: string, state: AnswerState) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pairs, setPairs] = useState<Record<string, string>>({})
  const [order, setOrder] = useState<string[]>([])
  const checked = Boolean(answerState)
  const left = question.options.filter(o => o.side === 'a')
  const right = question.options.filter(o => o.side === 'b')

  useEffect(() => {
    setPairs({})
    setOrder([])
    setError(null)
    setBusy(false)
  }, [question.id])

  const submit = async (answer: SpecAnswer) => {
    if (busy || checked) return
    setBusy(true)
    setError(null)
    try {
      const feedback = await checkSpecAnswer(section, question.id, answer)
      onAnswered(question.id, { selected: answer, feedback })
    } catch {
      setError('Javobni tekshirishda xato yuz berdi. Qayta urinib ko‘ring.')
    } finally {
      setBusy(false)
    }
  }

  const completePairs =
    left.length > 0 && Object.keys(pairs).length === left.length &&
    new Set(Object.values(pairs)).size === left.length &&
    Object.values(pairs).every(id => right.some(o => o.id === id))
  const completeOrder =
    left.length > 0 && order.length === left.length &&
    new Set(order).size === left.length &&
    order.every(id => left.some(o => o.id === id))

  return (
    <section>
      <div className="text-sm font-medium leading-7 text-gray-900 dark:text-gray-100">
        <InlineText text={question.stem_md} />
      </div>
      <div className="mt-5 space-y-2">
        {question.format === 'Y1' && left.map((opt, index) => {
          const chosen = answerState && 'option_id' in answerState.selected
            ? answerState.selected.option_id === opt.id : false
          const rightId = answerState?.feedback.correct_answer
          const correct = rightId && 'option_id' in rightId && rightId.option_id === opt.id
          const styling = correct
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
            : chosen && checked
              ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/30'
              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
          return <button type="button" key={opt.id}
            disabled={busy || checked} onClick={() => void submit({ option_id: opt.id })}
            className={`flex min-h-12 w-full items-start gap-3 rounded-xl border p-3 text-left text-sm text-gray-800 transition disabled:cursor-default dark:text-gray-200 ${styling}`}>
            <span className="mt-0.5 shrink-0 font-semibold">{String.fromCharCode(65 + index)})</span>
            <span><InlineText text={opt.content_md} /></span>
          </button>
        })}
        {question.format === 'Y2' && (
          <>
            <p className="mb-2 text-xs text-gray-500">Chapdagi har bir bandga o‘ngdagi mos javobni tanlang.</p>
            {left.map((opt, idx) => (
              <div key={opt.id} className="grid gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-700 sm:grid-cols-2 sm:items-center">
                <span className="text-sm text-gray-800 dark:text-gray-200">{idx + 1}. <InlineText text={opt.content_md} /></span>
                <select className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  disabled={checked || busy} value={(checked && answerState && 'pairs' in answerState.selected ? answerState.selected.pairs[opt.id] : pairs[opt.id]) ?? ''}
                  onChange={e => setPairs(p => ({ ...p, [opt.id]: e.target.value }))}>
                  <option value="">Mos javobni tanlang</option>
                  {right.map(o => <option key={o.id} value={o.id}>{o.content_md}</option>)}
                </select>
              </div>
            ))}
            {!checked && <button type="button" disabled={busy || !completePairs} onClick={() => void submit({ pairs })}
              className="min-h-11 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              Javobni tekshirish
            </button>}
          </>
        )}
        {question.format === 'Y3' && (
          <>
            <p className="mb-2 text-xs text-gray-500">Elementlarni to‘g‘ri ketma-ketlikda joylashtiring.</p>
            {left.map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-6 text-sm font-bold text-gray-600 dark:text-gray-300">{idx + 1}.</span>
                <select className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  disabled={checked || busy} value={(checked && answerState && 'order' in answerState.selected ? answerState.selected.order[idx] : order[idx]) ?? ''}
                  onChange={e => setOrder(a => {
                    const next = [...a]
                    next[idx] = e.target.value
                    return next
                  })}>
                  <option value="">Elementni tanlang</option>
                  {left.map(o => <option key={o.id} value={o.id}>{o.content_md}</option>)}
                </select>
              </div>
            ))}
            {!checked && <button type="button" disabled={busy || !completeOrder} onClick={() => void submit({ order })}
              className="min-h-11 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              Javobni tekshirish
            </button>}
          </>
        )}
      </div>
      {busy && <p className="mt-3 text-sm text-gray-500" role="status">Javob tekshirilmoqda…</p>}
      {error && <p className="mt-3 text-sm text-rose-600" role="alert">{error}</p>}
      {answerState && <AnswerDetails question={question} feedback={answerState.feedback} />}
    </section>
  )
}

export default function SpecSectionPracticePage() {
  const { sectionCode } = useParams()
  const section = SPEC_SECTIONS.find(s => s.code === sectionCode)
  const [questions, setQuestions] = useState<SpecQuestion[]>([])
  const [total, setTotal] = useState(0)
  const [cursor, setCursor] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [feedbackByQuestion, setFeedbackByQuestion] = useState<Record<string, AnswerState>>({})
  const [loading, setLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setQuestions([])
    setIndex(0)
    setTotal(0)
    setCursor(null)
    setFeedbackByQuestion({})
    if (!section) {
      setLoading(false)
      return
    }
    void getSpecQuestions(section.code).then(page => {
      if (cancelled) return
      setQuestions(page.questions)
      setTotal(page.total)
      setCursor(page.next_cursor)
    }).catch(() => {
      if (!cancelled) setError(PAGE_ERROR)
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [section, sectionCode])

  const next = async () => {
    if (!section || moreLoading) return
    if (index + 1 < questions.length) {
      setIndex(i => i + 1)
      return
    }
    if (!cursor) return
    setMoreLoading(true)
    setError(null)
    try {
      const page = await getSpecQuestions(section.code, cursor)
      if (!page.questions.length) {
        setCursor(null)
        return
      }
      setQuestions(prev => [...prev, ...page.questions])
      setCursor(page.next_cursor)
      setIndex(i => i + 1)
    } catch {
      setError(PAGE_ERROR)
    } finally {
      setMoreLoading(false)
    }
  }
  const question = questions[index]
  const answered = question ? feedbackByQuestion[question.id] : undefined

  if (!section) {
    return <main className="mx-auto max-w-3xl p-6">
      <p className="text-gray-700 dark:text-gray-200">Bunday spetsifikatsiya bo‘limi mavjud emas.</p>
      <Link to="/learn" className="mt-3 inline-block text-indigo-600">O‘rganishga qaytish</Link>
    </main>
  }

  return <main className="mx-auto w-full max-w-4xl space-y-5 px-4 py-6 sm:px-6">
    <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
      <ArrowLeft size={16} /> O‘rganishga qaytish
    </Link>
    <header className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900 dark:bg-indigo-950/30">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">2026-yil attestatsiya spetsifikatsiyasi · {section.code}</p>
      <h1 className="mt-2 text-xl font-bold text-gray-950 dark:text-white sm:text-2xl">{section.title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        Bo‘limdagi barcha e’lon qilingan testlar. Har javobdan keyin to‘g‘ri javob va uning izohi ko‘rsatiladi.
        Sinov rejimi va umumiy 50 savollik mock bundan alohida.
      </p>
      {!loading && !error && <p className="mt-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
        {total} ta test · {total > 0 ? index + 1 : 0}-savol
      </p>}
    </header>
    {loading && <p role="status" className="text-sm text-gray-500">Savollar yuklanmoqda…</p>}
    {error && <div role="alert" className="rounded-xl border border-rose-200 p-4 text-sm text-rose-700">
      {error}
      <button type="button" onClick={() => window.location.reload()} className="ml-3 inline-flex items-center gap-1 font-semibold">
        <RefreshCw size={15} /> Qayta urinish
      </button>
    </div>}
    {!loading && !error && !question && <p className="rounded-xl border p-6 text-sm text-gray-500">Ushbu bo‘limda hozircha e’lon qilingan test yo‘q.</p>}
    {question && <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="mb-4 flex items-center gap-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <span>{index + 1} / {total}</span>
        <span className="rounded-full bg-indigo-50 px-2 py-1 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{question.format}</span>
        <span>{question.group_code}</span>
        <CircleHelp size={15} className="ml-auto" aria-hidden />
      </div>
      <SpecQuestionForm key={question.id} question={question} section={section.code}
        answerState={answered} onAnswered={(id, state) => setFeedbackByQuestion(prev => ({ ...prev, [id]: state }))} />
      <div className="mt-6 flex justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" disabled={index === 0} onClick={() => setIndex(i => Math.max(0, i - 1))}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 disabled:opacity-40 dark:border-gray-700 dark:text-gray-200">
          <ArrowLeft size={16} /> Oldingi
        </button>
        <button type="button" disabled={!answered || moreLoading || (index + 1 >= questions.length && !cursor)}
          onClick={() => void next()}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-40">
          {moreLoading ? 'Yuklanmoqda…' : 'Keyingi savol'} <ArrowRight size={16} />
        </button>
      </div>
    </div>}
    <p className="text-xs text-gray-500">Savollar navbat bilan yuklanadi; 20/50 ta bilan cheklanmaydi. Kalitlar savolni ochishda yuborilmaydi.</p>
  </main>
}
