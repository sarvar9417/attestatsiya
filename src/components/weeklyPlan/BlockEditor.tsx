// ═══════════════════════════════════════════════════════════════════════════
// BlockEditor — bitta LessonBlock ni tahrirlash (type bo'yicha maydonlar)
// ═══════════════════════════════════════════════════════════════════════════
import { Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react'
import type { LessonBlock } from '../../types/weeklyLesson'
import { BLOCK_LABEL } from '../../types/weeklyLesson'

interface Props {
  block: LessonBlock
  index: number
  total: number
  onChange: (block: LessonBlock) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
}

const rowBtn =
  'p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed'

export default function BlockEditor({ block, index, total, onChange, onRemove, onMove }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-gray-50/60 dark:bg-gray-800/40">
      <div className="flex items-center justify-between mb-2">
        <span className="badge-primary">{BLOCK_LABEL[block.type]}</span>
        <div className="flex items-center gap-0.5">
          <button type="button" className={rowBtn} disabled={index === 0} onClick={() => onMove(-1)} aria-label="Yuqoriga">
            <ChevronUp size={16} />
          </button>
          <button type="button" className={rowBtn} disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Pastga">
            <ChevronDown size={16} />
          </button>
          <button type="button" className={`${rowBtn} hover:text-red-600`} onClick={onRemove} aria-label="O'chirish">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <BlockFields block={block} onChange={onChange} />
    </div>
  )
}

function BlockFields({ block, onChange }: { block: LessonBlock; onChange: (b: LessonBlock) => void }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="space-y-2">
          <input
            className="input"
            placeholder="Sarlavha (ixtiyoriy)"
            value={block.title ?? ''}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <textarea
            className="input min-h-[80px]"
            placeholder="Matn..."
            value={block.body}
            onChange={(e) => onChange({ ...block, body: e.target.value })}
          />
        </div>
      )

    case 'rule':
      return (
        <div className="space-y-2">
          <input
            className="input"
            placeholder="Qoida sarlavhasi"
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <textarea
            className="input min-h-[60px]"
            placeholder="Qoida tavsifi..."
            value={block.rule}
            onChange={(e) => onChange({ ...block, rule: e.target.value })}
          />
          <PairList
            label="Misollar"
            rows={block.examples}
            leftPh="English"
            rightPh="O'zbekcha"
            getLeft={(r) => r.en}
            getRight={(r) => r.uz}
            makeEmpty={() => ({ en: '', uz: '' })}
            setLeft={(r, v) => ({ ...r, en: v })}
            setRight={(r, v) => ({ ...r, uz: v })}
            onChange={(examples) => onChange({ ...block, examples })}
          />
        </div>
      )

    case 'vocab':
      return (
        <div className="space-y-2">
          <input
            className="input"
            placeholder="Sarlavha (ixtiyoriy)"
            value={block.title ?? ''}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <PairList
            label="So'zlar"
            rows={block.items}
            leftPh="English"
            rightPh="O'zbekcha"
            getLeft={(r) => r.en}
            getRight={(r) => r.uz}
            makeEmpty={() => ({ en: '', uz: '' })}
            setLeft={(r, v) => ({ ...r, en: v })}
            setRight={(r, v) => ({ ...r, uz: v })}
            onChange={(items) => onChange({ ...block, items })}
          />
        </div>
      )

    case 'task':
      return (
        <div className="space-y-2">
          <textarea
            className="input min-h-[60px]"
            placeholder="Topshiriq matni..."
            value={block.prompt}
            onChange={(e) => onChange({ ...block, prompt: e.target.value })}
          />
          <input
            className="input"
            placeholder="Yordam (ixtiyoriy)"
            value={block.hint ?? ''}
            onChange={(e) => onChange({ ...block, hint: e.target.value })}
          />
          <input
            className="input"
            placeholder="Javob (ixtiyoriy)"
            value={block.answer ?? ''}
            onChange={(e) => onChange({ ...block, answer: e.target.value })}
          />
        </div>
      )

    case 'speaking':
      return (
        <div className="space-y-2">
          <textarea
            className="input min-h-[60px]"
            placeholder="Speaking topshirig'i..."
            value={block.prompt}
            onChange={(e) => onChange({ ...block, prompt: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            Vaqt (soniya):
            <input
              type="number"
              min={5}
              className="input w-28"
              value={block.seconds}
              onChange={(e) => onChange({ ...block, seconds: Math.max(0, Number(e.target.value) || 0) })}
            />
          </label>
        </div>
      )

    case 'link':
      return (
        <div className="space-y-2">
          <input
            className="input"
            placeholder="Havola matni"
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
          />
          <input
            className="input"
            placeholder="https://..."
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
          />
          <input
            className="input"
            placeholder="Manba (ixtiyoriy)"
            value={block.source ?? ''}
            onChange={(e) => onChange({ ...block, source: e.target.value })}
          />
        </div>
      )
  }
}

// ─── En/Uz juftliklar ro'yxati (rule.examples, vocab.items uchun) ──────────
interface PairListProps<T> {
  label: string
  rows: T[]
  leftPh: string
  rightPh: string
  getLeft: (row: T) => string
  getRight: (row: T) => string
  setLeft: (row: T, v: string) => T
  setRight: (row: T, v: string) => T
  makeEmpty: () => T
  onChange: (rows: T[]) => void
}

function PairList<T>({
  label, rows, leftPh, rightPh, getLeft, getRight, setLeft, setRight, makeEmpty, onChange,
}: PairListProps<T>) {
  const update = (i: number, row: T) => onChange(rows.map((r, j) => (j === i ? row : r)))
  const remove = (i: number) => onChange(rows.filter((_, j) => j !== i))
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            className="input py-1.5 text-sm"
            placeholder={leftPh}
            value={getLeft(row)}
            onChange={(e) => update(i, setLeft(row, e.target.value))}
          />
          <input
            className="input py-1.5 text-sm"
            placeholder={rightPh}
            value={getRight(row)}
            onChange={(e) => update(i, setRight(row, e.target.value))}
          />
          <button
            type="button"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
            onClick={() => remove(i)}
            aria-label="Qatorni o'chirish"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-ghost text-xs text-primary-600 dark:text-primary-400 gap-1 px-2 py-1"
        onClick={() => onChange([...rows, makeEmpty()])}
      >
        <Plus size={14} /> Qator qo'shish
      </button>
    </div>
  )
}
