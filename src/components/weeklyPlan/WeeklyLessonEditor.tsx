// ═══════════════════════════════════════════════════════════════════════════
// WeeklyLessonEditor — kunlik dars yaratish/tahrirlash (bloklar bilan)
// ═══════════════════════════════════════════════════════════════════════════
import { useState } from 'react'
import { Plus, X, Save } from 'lucide-react'
import type {
  WeeklyLesson, LessonBlock, LessonMode, BlockType, CreateLessonDTO,
} from '../../types/weeklyLesson'
import { MODE_MINUTES, MODE_LABEL, BLOCK_LABEL, emptyBlock } from '../../types/weeklyLesson'
import BlockEditor from './BlockEditor'

interface Props {
  unitId: number
  /** Mavjud dars — tahrirlashda; null bo'lsa yangi dars */
  lesson: WeeklyLesson | null
  /** Band bo'lgan kunlar (yangi dars uchun dublikatni oldini olish) */
  usedDays: number[]
  onSave: (dto: CreateLessonDTO) => Promise<void>
  onCancel: () => void
}

const MODES: LessonMode[] = ['green', 'yellow', 'red']
const BLOCK_TYPES: BlockType[] = ['text', 'rule', 'vocab', 'task', 'speaking', 'link']

const MODE_DOT: Record<LessonMode, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
}

export default function WeeklyLessonEditor({ unitId, lesson, usedDays, onSave, onCancel }: Props) {
  const firstFreeDay = [1, 2, 3, 4, 5, 6, 7].find((d) => !usedDays.includes(d)) ?? 1
  const [dayNo, setDayNo] = useState(lesson?.day_no ?? firstFreeDay)
  const [title, setTitle] = useState(lesson?.title ?? '')
  const [objective, setObjective] = useState(lesson?.objective ?? '')
  const [mode, setMode] = useState<LessonMode>(lesson?.mode ?? 'green')
  const [duration, setDuration] = useState(lesson?.duration_min ?? MODE_MINUTES.green)
  const [blocks, setBlocks] = useState<LessonBlock[]>(lesson?.blocks ?? [])
  const [saving, setSaving] = useState(false)

  const setModeAndDuration = (m: LessonMode) => {
    setMode(m)
    setDuration(MODE_MINUTES[m])
  }

  const addBlock = (type: BlockType) => setBlocks((b) => [...b, emptyBlock(type)])
  const updateBlock = (i: number, block: LessonBlock) =>
    setBlocks((b) => b.map((x, j) => (j === i ? block : x)))
  const removeBlock = (i: number) => setBlocks((b) => b.filter((_, j) => j !== i))
  const moveBlock = (i: number, dir: -1 | 1) =>
    setBlocks((b) => {
      const j = i + dir
      if (j < 0 || j >= b.length) return b
      const next = [...b]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const canSave = title.trim().length > 0 && !saving

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      await onSave({
        unit_id: unitId,
        day_no: dayNo,
        title: title.trim(),
        objective: objective.trim() || undefined,
        mode,
        duration_min: duration,
        blocks,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={onCancel}>
      <div
        className="card w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-b-none sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-gray-900 -mx-5 px-5 pt-1 pb-3 z-10 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold">{lesson ? 'Darsni tahrirlash' : 'Yangi dars'}</h2>
          <button className="btn-ghost p-2" onClick={onCancel} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Kun + sarlavha */}
          <div className="flex gap-2">
            <label className="shrink-0">
              <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Kun</span>
              <select
                className="input w-20"
                value={dayNo}
                onChange={(e) => setDayNo(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d} disabled={d !== lesson?.day_no && usedDays.includes(d)}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1">
              <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Sarlavha *</span>
              <input
                className="input"
                placeholder="Masalan: Present Perfect — kirish"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </label>
          </div>

          {/* Maqsad */}
          <label className="block">
            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Maqsad (objective)</span>
            <input
              className="input"
              placeholder="Ushbu dars nimani o'rgatadi?"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            />
          </label>

          {/* Rejim */}
          <div>
            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Rejim</span>
            <div className="flex gap-2">
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModeAndDuration(m)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-sm font-semibold transition-all ${
                    mode === m
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${MODE_DOT[m]}`} />
                  {MODE_LABEL[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Davomiylik */}
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            Davomiylik (daqiqa):
            <input
              type="number"
              min={0}
              className="input w-28"
              value={duration}
              onChange={(e) => setDuration(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>

          {/* Bloklar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Bloklar ({blocks.length})
              </span>
            </div>
            <div className="space-y-2">
              {blocks.map((block, i) => (
                <BlockEditor
                  key={i}
                  block={block}
                  index={i}
                  total={blocks.length}
                  onChange={(b) => updateBlock(i, b)}
                  onRemove={() => removeBlock(i)}
                  onMove={(dir) => moveBlock(i, dir)}
                />
              ))}
              {blocks.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Hali blok yo'q. Quyidan qo'shing.
                </p>
              )}
            </div>

            {/* Blok qo'shish tugmalari */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {BLOCK_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="btn-secondary text-xs gap-1 px-2.5 py-1.5"
                >
                  <Plus size={13} /> {BLOCK_LABEL[type]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saqlash */}
        <div className="flex gap-2 mt-6 sticky bottom-0 bg-white dark:bg-gray-900 -mx-5 px-5 py-3 border-t border-gray-100 dark:border-gray-800">
          <button className="btn-secondary flex-1" onClick={onCancel} disabled={saving}>
            Bekor qilish
          </button>
          <button className="btn-primary flex-1 gap-2" onClick={handleSave} disabled={!canSave}>
            <Save size={16} /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </div>
    </div>
  )
}
