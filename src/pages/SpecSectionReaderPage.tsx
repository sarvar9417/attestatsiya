import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, BookOpenText, Check, Eye, EyeOff, Search, RotateCcw } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import InlineText from '../components/learning/theory/InlineText'
import ExamRichText from '../features/exam/questions/ExamRichText'
import { SPEC_SECTIONS, type SpecCode } from '../features/content/specPracticeApi'
import {
  getReaderPage, getReaderState, saveReaderPosition, changeReaderMark,
  type ReaderPage, type ReaderMark, type ReaderPageSize, type ReaderPosition, type ReaderQuestion,
} from '../features/content/specReaderApi'

const initialPosition: ReaderPosition = { page: 1, pageSize: 30, search: '', reviewOnly: false }

function RichText({ text }: { text: string }) {
  return <ExamRichText text={text} />
}

function ReaderCard({
  question, number, showAnswers, showExplanations, mark, onMark, busy,
}: {
  question: ReaderQuestion
  number: number
  showAnswers: boolean
  showExplanations: boolean
  mark: ReaderMark
  onMark: (mark: ReaderMark) => void
  busy: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const left = question.options.filter(opt => opt.side === 'a')
  const right = question.options.filter(opt => opt.side === 'b')
  const optionText = new Map(question.options.map(opt => [opt.id, opt.content_md]))
  const key = question.correct_answer
  const correctId = 'correct_option_id' in key ? key.correct_option_id : null
  const correctPairs = 'pairs' in key ? key.pairs : null
  const correctOrder = 'order' in key ? key.order : null
  const explanation = question.explanation_md

  return <article id={`spec-read-question-${number}`}
    className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <span className="rounded-md bg-indigo-50 px-2 py-1 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{number}-savol</span>
        <span>{question.format}</span>
        <span className="font-normal">{question.group_code}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy}
          aria-pressed={mark === 'memorized'}
          onClick={() => onMark(mark === 'memorized' ? null : 'memorized')}
          className={`inline-flex min-h-9 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold disabled:opacity-50 ${mark === 'memorized' ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'}`}>
          <Check size={14}/> Yodladim
        </button>
        <button type="button" disabled={busy}
          aria-pressed={mark === 'review'}
          onClick={() => onMark(mark === 'review' ? null : 'review')}
          className={`inline-flex min-h-9 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold disabled:opacity-50 ${mark === 'review' ? 'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'}`}>
          <Bookmark size={14}/> Qayta ko‘raman
        </button>
      </div>
    </div>
    <div className="text-sm font-semibold leading-7 text-gray-950 dark:text-gray-100 sm:text-base">
      <RichText text={question.stem_md}/>
    </div>

    {question.format === 'Y1' && <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {left.map((option, index) => {
        const isCorrect = showAnswers && option.id === correctId
        return <div key={option.id} className={`flex min-w-0 items-start gap-2 rounded-lg border p-2.5 text-sm leading-6 ${isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100' : 'border-gray-200 bg-gray-50/50 text-gray-800 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-200'}`}>
          <strong className="shrink-0">{String.fromCharCode(65 + index)})</strong>
          <div className="min-w-0 flex-1"><RichText text={option.content_md}/></div>
          {isCorrect && <Check size={16} className="shrink-0 text-emerald-600" aria-label="To‘g‘ri javob"/>}
        </div>
      })}
    </div>}

    {question.format === 'Y2' && <div className="mt-3 space-y-2 text-sm">
      <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
        <strong className="mb-2 block text-xs text-gray-500">Moslashtirish variantlari</strong>
        <div className="grid gap-2 sm:grid-cols-2">
          <ol className="list-inside list-decimal space-y-1">
            {left.map(o => <li key={o.id}><InlineText text={o.content_md}/></li>)}
          </ol>
          <ol className="list-inside list-[upper-alpha] space-y-1">
            {right.map(o => <li key={o.id}><InlineText text={o.content_md}/></li>)}
          </ol>
        </div>
      </div>
      {showAnswers && correctPairs && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
        <strong className="mb-2 block">To‘g‘ri mosliklar</strong>
        {left.map((o, i) => <div key={o.id} className="py-0.5">
          {i + 1}. <InlineText text={o.content_md}/> → <InlineText text={optionText.get(correctPairs[o.id]) ?? '—'}/>
        </div>)}
      </div>}
    </div>}

    {question.format === 'Y3' && <div className="mt-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800">
      <strong className="mb-2 block text-xs text-gray-500">{showAnswers ? 'To‘g‘ri ketma-ketlik' : 'Tartiblash uchun elementlar'}</strong>
      <ol className="list-inside list-decimal space-y-1">
        {(showAnswers && correctOrder ? correctOrder : left.map(o => o.id)).map(id =>
          <li key={id} className={showAnswers ? 'text-emerald-800 dark:text-emerald-300' : 'text-gray-800 dark:text-gray-200'}>
            <InlineText text={optionText.get(id) ?? '—'}/>
          </li>,
        )}
      </ol>
    </div>}

    {showAnswers && showExplanations && <div className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">
      <strong className="mb-1 block text-indigo-700 dark:text-indigo-300">Izoh va yechim</strong>
      <div className={expanded ? '' : 'line-clamp-3'}><RichText text={explanation || 'Bu savol uchun izoh kiritilmagan.'}/></div>
      {explanation.length > 175 && <button type="button" className="mt-1 min-h-9 text-xs font-semibold text-indigo-600 dark:text-indigo-300"
        onClick={() => setExpanded(v => !v)}>{expanded ? 'Qisqartirish' : 'Batafsil izoh'}</button>}
    </div>}
  </article>
}

export default function SpecSectionReaderPage() {
  const { sectionCode } = useParams()
  const section = SPEC_SECTIONS.find(s => s.code === sectionCode)
  const code = section?.code as SpecCode | undefined
  const [ready, setReady] = useState(false)
  const [position, setPosition] = useState<ReaderPosition>(initialPosition)
  const [searchInput, setSearchInput] = useState('')
  const [pageData, setPageData] = useState<ReaderPage | null>(null)
  const [marks, setMarks] = useState<Record<string, 'memorized' | 'review'>>({})
  const [markBusy, setMarkBusy] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(0)
  const [showAnswers, setShowAnswers] = useState(true)
  const [showExplanations, setShowExplanations] = useState(true)
  const [pageInput, setPageInput] = useState('1')
  const [questionInput, setQuestionInput] = useState('')
  const [jumpTarget, setJumpTarget] = useState<number | null>(null)

  useEffect(() => {
    if (!code) return
    let cancelled = false
    setReady(false)
    setLoading(true)
    setLoadError(null)
    setPageData(null)
    void getReaderState(code).then(state => {
      if (cancelled) return
      const pos = {
        page: state.page, pageSize: state.page_size,
        search: state.search, reviewOnly: state.review_only,
      }
      setPosition(pos)
      setSearchInput(pos.search)
      setPageInput(String(pos.page))
      setMarks(state.marks)
      setReady(true)
    }).catch(() => {
      if (!cancelled) {
        setLoadError('O‘qish holatini yuklab bo‘lmadi. Qayta urining.')
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [code])

  useEffect(() => {
    if (!ready || !code) return
    let cancelled = false
    setLoading(true)
    setLoadError(null)
    void getReaderPage(code, position).then(data => {
      if (cancelled) return
      const lastPage = Math.max(1, Math.ceil(data.total / position.pageSize))
      if (position.page > lastPage) {
        setPosition(p => ({ ...p, page: lastPage }))
        return
      }
      setPageData(data)
      setPageInput(String(position.page))
      void saveReaderPosition(code, position).then(() => {
        if (!cancelled) setSaveError(null)
      }).catch(() => {
        if (!cancelled) setSaveError('O‘qigan joyni saqlashda xato yuz berdi.')
      })
    }).catch(() => {
      if (!cancelled) setLoadError('Savollarni yuklab bo‘lmadi. Qayta urining.')
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [ready, code, position, reload])

  useEffect(() => {
    if (jumpTarget === null || !pageData) return
    if (Math.ceil(jumpTarget / position.pageSize) !== position.page) return
    const target = document.getElementById(`spec-read-question-${jumpTarget}`)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setJumpTarget(null)
    }
  }, [pageData, jumpTarget, position.page, position.pageSize])

  const totalPages = Math.max(1, Math.ceil((pageData?.total ?? 0) / position.pageSize))
  const memorized = Object.values(marks).filter(x => x === 'memorized').length
  const review = Object.values(marks).filter(x => x === 'review').length
  const updatePosition = (changes: Partial<ReaderPosition>) => {
    setPosition(p => ({ ...p, ...changes }))
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateMark = (questionId: string, next: ReaderMark) => {
    if (!code || markBusy) return
    const previous = marks[questionId]
    setMarks(p => {
      const nextMarks = { ...p }
      if (next) nextMarks[questionId] = next
      else delete nextMarks[questionId]
      return nextMarks
    })
    setMarkBusy(questionId)
    setSaveError(null)
    void changeReaderMark(code, questionId, next).then(() => {
      if (position.reviewOnly) setReload(i => i + 1)
    }).catch(() => {
      setMarks(p => {
        const result = { ...p }
        if (previous) result[questionId] = previous
        else delete result[questionId]
        return result
      })
      setSaveError('Belgi saqlanmadi. Qayta urining.')
    }).finally(() => setMarkBusy(null))
  }

  if (!section || !code) return <main className="p-6 text-sm">Bunday bo‘lim topilmadi. <Link to="/learn" className="text-indigo-600">O‘rganishga qaytish</Link></main>
  return <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-5 sm:px-6">
    <Link to="/learn" className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300"><ArrowLeft size={16}/> O‘rganishga qaytish</Link>
    <section className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/30">
      <p className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-300">2026-yil spetsifikatsiyasi · {section.code}</p>
      <h1 className="mt-1 text-xl font-bold text-gray-950 dark:text-white">{section.title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Testlarni kitobdek pastga qarab o‘qing, javoblarni yodlang va qiyinlarini belgilang.</p>
      <div className="mt-3 inline-flex flex-wrap gap-1 rounded-lg bg-white p-1 dark:bg-gray-900" role="group" aria-label="Ko‘rish rejimi">
        <span className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"><BookOpenText size={15} className="mr-1 inline"/> O‘qish sahifasi</span>
        <Link to={`/learn/spec/${section.code}`} className="rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">Test ishlash</Link>
      </div>
    </section>
    <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900" aria-label="O‘qish sozlamalari">
      <form onSubmit={e => {
        e.preventDefault()
        updatePosition({ page: 1, search: searchInput.trim().slice(0, 80) })
      }} className="flex flex-wrap gap-2">
        <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
          maxLength={80} aria-label="Savol matnidan qidirish" placeholder="Savol matnidan kalit so‘z qidirish..."
          className="min-h-10 min-w-[170px] flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"/>
        <button type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white"><Search size={15}/> Qidirish</button>
        {position.search && <button type="button" onClick={() => { setSearchInput(''); updatePosition({ page: 1, search: '' }) }}
          className="min-h-10 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700">Tozalash</button>}
      </form>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
        <label className="flex items-center gap-2">Bir sahifada:
          <select aria-label="Sahifadagi savollar soni" value={position.pageSize}
            onChange={e => updatePosition({ page: 1, pageSize: Number(e.target.value) as ReaderPageSize })}
            className="min-h-10 rounded-lg border border-gray-300 bg-white px-2 dark:border-gray-700 dark:bg-gray-950">
            <option value={30}>30 ta</option><option value={50}>50 ta</option><option value={100}>100 ta</option>
          </select>
        </label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={showAnswers} onChange={e => setShowAnswers(e.target.checked)}/>
          <span className="inline-flex items-center gap-1">{showAnswers ? <Eye size={16}/> : <EyeOff size={16}/>} Javoblarni ko‘rsatish</span>
        </label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={showExplanations} disabled={!showAnswers}
          onChange={e => setShowExplanations(e.target.checked)}/> Izohlarni ko‘rsatish</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={position.reviewOnly}
          onChange={e => updatePosition({ page: 1, reviewOnly: e.target.checked })}/>
          Faqat «Qayta ko‘raman» ({review})
        </label>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">Yodladim: {memorized} ta · Qayta ko‘raman: {review} ta. Belgilar va o‘qigan sahifangiz akkauntingizda saqlanadi.</p>
    </section>

    {saveError && <p role="alert" className="rounded-lg border border-amber-300 p-3 text-sm text-amber-800 dark:text-amber-300">{saveError}</p>}
    {loadError && <div role="alert" className="rounded-lg border border-red-300 p-4 text-red-700 dark:text-red-300">
      {loadError} <button type="button" onClick={() => { if (!ready) window.location.reload(); else setReload(n => n + 1) }}
        className="ml-2 font-semibold underline"><RotateCcw size={14} className="inline"/> Qayta urinish</button>
    </div>}
    {loading && <p role="status" className="text-sm text-gray-500">Savollar yuklanmoqda…</p>}

    {!loading && !loadError && pageData && <>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <strong className="text-gray-800 dark:text-gray-200">
          {pageData.total > 0 ? (position.page - 1) * position.pageSize + 1 : 0}–{Math.min(position.page * position.pageSize, pageData.total)} / {pageData.total} ta savol
        </strong>
        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={e => { e.preventDefault(); const n = Number(pageInput); if (Number.isInteger(n) && n >= 1 && n <= totalPages) updatePosition({ page: n }) }}
            className="flex items-center gap-1">
            <label htmlFor="spec-page-jump">Sahifa</label>
            <input id="spec-page-jump" type="number" min={1} max={totalPages} value={pageInput} onChange={e => setPageInput(e.target.value)}
              className="min-h-9 w-16 rounded-lg border border-gray-300 bg-white px-2 dark:border-gray-700 dark:bg-gray-900"/>
            <span>/ {totalPages}</span>
            <button type="submit" className="min-h-9 rounded-lg border border-gray-300 px-2 dark:border-gray-700">O‘tish</button>
          </form>
          <form onSubmit={e => {
            e.preventDefault()
            const n = Number(questionInput)
            if (Number.isInteger(n) && n >= 1 && n <= (pageData?.total ?? 0)) {
              setJumpTarget(n)
              updatePosition({ page: Math.ceil(n / position.pageSize) })
            }
          }} className="flex items-center gap-1">
            <input aria-label="Savol raqamiga o‘tish" type="number" min={1} max={pageData.total} value={questionInput}
              onChange={e => setQuestionInput(e.target.value)} placeholder="№"
              className="min-h-9 w-16 rounded-lg border border-gray-300 bg-white px-2 dark:border-gray-700 dark:bg-gray-900"/>
            <button type="submit" className="min-h-9 rounded-lg border border-gray-300 px-2 dark:border-gray-700">Savolga</button>
          </form>
        </div>
      </div>
      {pageData.questions.length ? <div className="space-y-3">
        {pageData.questions.map((question, index) => (
          <ReaderCard key={question.id} question={question}
            number={(position.page - 1) * position.pageSize + index + 1}
            showAnswers={showAnswers} showExplanations={showExplanations}
            mark={marks[question.id] ?? null}
            onMark={mark => updateMark(question.id, mark)}
            busy={markBusy === question.id}/>
        ))}
      </div> : <p className="rounded-xl border p-5 text-sm text-gray-600 dark:text-gray-300">Bu filtr bo‘yicha testlar topilmadi.</p>}
      <nav aria-label="Test sahifalari" className="flex flex-wrap items-center justify-center gap-3 py-5">
        <button type="button" disabled={position.page <= 1}
          onClick={() => updatePosition({ page: position.page - 1 })}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold disabled:opacity-40 dark:border-gray-700">
          <ArrowLeft size={16}/> Oldingi sahifa
        </button>
        <span className="text-sm font-semibold">{position.page} / {totalPages}</span>
        <button type="button" disabled={position.page >= totalPages}
          onClick={() => updatePosition({ page: position.page + 1 })}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-40">
          Keyingi sahifa <ArrowRight size={16}/>
        </button>
      </nav>
    </>}
  </main>
}
