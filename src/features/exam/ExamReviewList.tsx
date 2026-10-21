import { useState } from 'react'
import { CheckCircle2, Clock3, Lightbulb, XCircle } from 'lucide-react'
import type { ExamOption, ExamReviewItem } from './contracts'
import ExamRichText from './questions/ExamRichText'
import { learnerExplanation } from './learnerExplanation'
import ExamQuestionAssets, { legacyPedguliDebateReviewId } from './questions/ExamQuestionAssets'

type Filter = 'all' | 'wrong' | 'correct' | 'skipped'

function statusOf(item: ExamReviewItem): Exclude<Filter, 'all'> {
  return item.is_correct === null ? 'skipped' : item.is_correct ? 'correct' : 'wrong'
}

function answerId(answer: unknown): string | null {
  if (!answer || typeof answer !== 'object' || Array.isArray(answer)) return null
  const object = answer as Record<string, unknown>
  const id = object.option_id ?? object.correct_option_id
  return typeof id === 'string' ? id : null
}

function pairsOf(answer: unknown): Record<string, string> {
  if (!answer || typeof answer !== 'object' || Array.isArray(answer)) return {}
  const value = (answer as Record<string, unknown>).pairs
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value).filter((pair): pair is [string, string] => typeof pair[1] === 'string')
  )
}

function orderOf(answer: unknown): string[] {
  if (!answer || typeof answer !== 'object' || Array.isArray(answer)) return []
  const value = (answer as Record<string, unknown>).order
  return Array.isArray(value) && value.every(id => typeof id === 'string') ? value : []
}

function optionName(options: ExamOption[], id: string | undefined): string | null {
  if (!id) return null
  return options.find(option => option.id === id)?.content_md ?? null
}

function AnswerReview({ item }: { item: ExamReviewItem }) {
  const options = item.options ?? []
  if (!options.length) {
    return <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
      Bu sinovning javob variantlari tahlil ma’lumotida mavjud emas.
    </p>
  }

  if (item.format === 'Y1') {
    const chosen = answerId(item.user_answer)
    const correct = answerId(item.key)
    return <div className="mt-4 space-y-2" aria-label="Javob variantlari">
      {options.filter(option => option.side === 'a').map((option, index) => {
        const isKey = correct === option.id
        const isUser = chosen === option.id
        const wrongChoice = isUser && !isKey
        return <div key={option.id} data-answer-state={isKey ? 'correct' : wrongChoice ? 'wrong' : 'neutral'}
          className={'flex min-w-0 items-start gap-3 rounded-xl border p-3 sm:p-3.5 ' +
            (isKey ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/30'
              : wrongChoice ? 'border-rose-500 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/30'
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900')}>
          <span className={'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ' +
            (isKey ? 'border-emerald-500 text-emerald-800 dark:text-emerald-300'
              : wrongChoice ? 'border-rose-500 text-rose-800 dark:text-rose-300'
                : 'border-gray-300 text-gray-500 dark:border-gray-600')}>
            {String.fromCharCode(65 + index)}
          </span>
          <div className="min-w-0 flex-1 text-sm font-medium leading-6 text-gray-800 dark:text-gray-100">
            <ExamRichText text={option.content_md} />
            {isKey && <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 size={14} aria-hidden="true" /> To‘g‘ri javob{isUser ? ' · Sizning javobingiz' : ''}
            </span>}
            {wrongChoice && <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300">
              <XCircle size={14} aria-hidden="true" /> Siz tanlagan javob
            </span>}
          </div>
        </div>
      })}
      {!correct && <p className="text-xs text-amber-700 dark:text-amber-300">To‘g‘ri variant identifikatori mavjud emas.</p>}
    </div>
  }

  if (item.format === 'Y2') {
    const left = options.filter(option => option.side === 'a')
    const right = options.filter(option => option.side === 'b')
    const selected = pairsOf(item.user_answer)
    const correct = pairsOf(item.key)
    if (!left.length || !right.length || !Object.keys(correct).length) {
      return <p className="mt-4 text-sm text-amber-700 dark:text-amber-300">Moslashtirish javobining to‘liq tafsiloti mavjud emas.</p>
    }
    return <div className="mt-4 space-y-2" aria-label="Moslashtirish javoblari">
      {left.map((option, index) => {
        const expected = optionName(right, correct[option.id])
        const actual = optionName(right, selected[option.id])
        const matched = !!expected && correct[option.id] === selected[option.id]
        return <div key={option.id} className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
          <div className="flex gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <span>{index + 1}.</span><ExamRichText text={option.content_md} />
          </div>
          {actual && <div className={'mt-2 rounded-lg px-3 py-2 text-sm ' +
            (matched ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300')}>
            Siz tanlagan: <ExamRichText text={actual} />
          </div>}
          {!actual && <p className="mt-2 text-xs text-gray-500">Bu juftlik javobsiz qoldirilgan.</p>}
          {expected && !matched && <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            To‘g‘ri moslik: <ExamRichText text={expected} />
          </div>}
        </div>
      })}
    </div>
  }

  const correctOrder = orderOf(item.key)
  const chosenOrder = orderOf(item.user_answer)
  const byId = new Map(options.map(option => [option.id, option.content_md]))
  if (!correctOrder.length) {
    return <p className="mt-4 text-sm text-amber-700 dark:text-amber-300">Tartiblash javobining kaliti mavjud emas.</p>
  }
  return <div className="mt-4 grid gap-3 sm:grid-cols-2" aria-label="Tartiblash javoblari">
    <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
      <h4 className="mb-3 text-sm font-bold text-emerald-800 dark:text-emerald-300">To‘g‘ri tartib</h4>
      <ol className="space-y-2">{correctOrder.map((id, index) => (
        <li key={id} className="flex gap-2 text-sm text-emerald-900 dark:text-emerald-100">
          <span className="font-bold">{index + 1}.</span>
          <div className="min-w-0"><ExamRichText text={byId.get(id) ?? 'Variant mavjud emas'} /></div>
        </li>
      ))}</ol>
    </div>
    <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
      <h4 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">Sizning tartibingiz</h4>
      {chosenOrder.length ? <ol className="space-y-2">{chosenOrder.map((id, index) => (
        <li key={index} className={'flex gap-2 rounded-lg px-2 py-1 text-sm ' +
          (correctOrder[index] === id
            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'
            : 'bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200')}>
          <span className="font-bold">{index + 1}.</span>
          <div className="min-w-0"><ExamRichText text={byId.get(id) ?? 'Variant mavjud emas'} /></div>
        </li>
      ))}</ol> : <p className="text-sm text-gray-500">Javob berilmagan.</p>}
    </div>
  </div>
}

export default function ExamReviewList({ items }: { items: ExamReviewItem[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const counts = {
    all: items.length,
    wrong: items.filter(item => statusOf(item) === 'wrong').length,
    correct: items.filter(item => statusOf(item) === 'correct').length,
    skipped: items.filter(item => statusOf(item) === 'skipped').length,
  }
  const visible = items.filter(item => filter === 'all' || statusOf(item) === filter)
  const filters: Array<{ id: Filter; title: string }> = [
    { id: 'all', title: 'Barchasi' },
    { id: 'wrong', title: 'Xato' },
    { id: 'correct', title: 'To‘g‘ri' },
    { id: 'skipped', title: 'Javobsiz' },
  ]
  return <div className="mt-5 space-y-5" aria-label="Yakunlangan sinov savollari tahlili">
    <div className="flex flex-wrap gap-2" aria-label="Savollarni saralash">
      {filters.map(option => <button key={option.id} type="button"
        aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}
        className={'rounded-xl border px-3 py-2 text-xs font-semibold transition ' +
          (filter === option.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200'
            : 'border-gray-200 text-gray-600 hover:border-indigo-300 dark:border-gray-700 dark:text-gray-300')}>
        {option.title} ({counts[option.id]})
      </button>)}
    </div>
    <nav aria-label="Savollar raqamlari" className="flex flex-wrap gap-2">
      {visible.map(item => {
        const status = statusOf(item)
        return <a key={item.order_idx} href={'#review-question-' + item.order_idx}
          aria-label={'Savol ' + item.order_idx + ': ' + (status === 'wrong' ? 'Xato' : status === 'correct' ? 'To‘g‘ri' : 'Javobsiz')}
          className={'flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-bold ' +
            (status === 'wrong' ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300'
              : status === 'correct' ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300'
                : 'border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200')}>
          {item.order_idx}
        </a>
      })}
    </nav>
    {!visible.length && <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-800">Bu toifada savol yo‘q.</p>}
    <div className="space-y-4">
      {visible.map(item => {
        const status = statusOf(item)
        return <article id={'review-question-' + item.order_idx} key={item.order_idx}
          className="scroll-mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200">Savol {item.order_idx}</span>
              {item.construct && <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">{item.construct}</span>}
              <span className="rounded-md border border-gray-200 px-2 py-0.5 text-[11px] text-gray-500 dark:border-gray-700">{item.format}</span>
            </div>
            <span className={'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ' +
              (status === 'correct' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                : status === 'wrong' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200')}>
              {status === 'correct' ? <CheckCircle2 size={14} /> : status === 'wrong' ? <XCircle size={14} /> : <Clock3 size={14} />}
              {status === 'correct' ? 'To‘g‘ri' : status === 'wrong' ? 'Xato' : 'Javobsiz'}
            </span>
          </div>
          <div className="mt-4 min-w-0 text-base font-semibold text-gray-900 dark:text-gray-100">
            <ExamRichText text={item.stem_md} />
          </div>
          <ExamQuestionAssets assets={item.assets ?? []} questionId={legacyPedguliDebateReviewId(item.stem_md, item.options ?? [])} />
          <AnswerReview item={item} />
          {learnerExplanation(item.explanation_md) && <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-indigo-200">
              <Lightbulb size={17} aria-hidden="true" /> Javobning tushuntirishi
            </h4>
            <div className="text-sm leading-6 text-indigo-950 dark:text-indigo-100"><ExamRichText text={learnerExplanation(item.explanation_md)} /></div>
          </div>}
        </article>
      })}
    </div>
  </div>
}
