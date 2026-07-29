// ═══════════════════════════════════════════════════════════════════════════
// WeeklyUnitForm — hafta (unit) yaratish/tahrirlash
// ═══════════════════════════════════════════════════════════════════════════
import { useState } from 'react'
import { X, Save, Plus, Trash2 } from 'lucide-react'
import type { WeeklyUnit, CreateUnitDTO } from '../../types/weeklyLesson'

interface Props {
  unit: WeeklyUnit | null
  /** Band bo'lgan hafta raqamlari (dublikatni oldini olish) */
  usedWeeks: number[]
  onSave: (dto: CreateUnitDTO) => Promise<void>
  onCancel: () => void
}

export default function WeeklyUnitForm({ unit, usedWeeks, onSave, onCancel }: Props) {
  const nextWeek = (usedWeeks.length ? Math.max(...usedWeeks) : 0) + 1
  const [weekNo, setWeekNo] = useState(unit?.week_no ?? nextWeek)
  const [title, setTitle] = useState(unit?.title ?? '')
  const [subtitle, setSubtitle] = useState(unit?.subtitle ?? '')
  const [objective, setObjective] = useState(unit?.objective ?? '')
  const [phase, setPhase] = useState(unit?.phase ?? '')
  const [criteria, setCriteria] = useState<string[]>(unit?.success_criteria ?? [])
  const [saving, setSaving] = useState(false)

  const weekTaken = weekNo !== unit?.week_no && usedWeeks.includes(weekNo)
  const canSave = title.trim().length > 0 && !weekTaken && !saving

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      await onSave({
        week_no: weekNo,
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        objective: objective.trim() || undefined,
        phase: phase.trim() || undefined,
        success_criteria: criteria.map((c) => c.trim()).filter(Boolean),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={onCancel}>
      <div className="card w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-b-none sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{unit ? 'Haftani tahrirlash' : 'Yangi hafta'}</h2>
          <button className="btn-ghost p-2" onClick={onCancel} aria-label="Yopish"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <label className="shrink-0">
              <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Hafta №</span>
              <input
                type="number"
                min={1}
                className={`input w-24 ${weekTaken ? 'border-red-400' : ''}`}
                value={weekNo}
                onChange={(e) => setWeekNo(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            <label className="flex-1">
              <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Sarlavha *</span>
              <input
                className="input"
                placeholder="Masalan: Perfect zamonlar"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </label>
          </div>
          {weekTaken && <p className="text-xs text-red-500 -mt-2">{weekNo}-hafta allaqachon mavjud</p>}

          <label className="block">
            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Qism sarlavha</span>
            <input className="input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Maqsad</span>
            <input className="input" placeholder="Bu hafta nimaga erishamiz?" value={objective} onChange={(e) => setObjective(e.target.value)} />
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Faza (ixtiyoriy)</span>
            <input className="input" placeholder="Masalan: Foundation" value={phase} onChange={(e) => setPhase(e.target.value)} />
          </label>

          {/* Muvaffaqiyat mezonlari */}
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">Muvaffaqiyat mezonlari</span>
            {criteria.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <input
                  className="input py-1.5 text-sm"
                  placeholder="Masalan: 10 ta gap to'g'ri tuza olaman"
                  value={c}
                  onChange={(e) => setCriteria(criteria.map((x, j) => (j === i ? e.target.value : x)))}
                />
                <button
                  type="button"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                  onClick={() => setCriteria(criteria.filter((_, j) => j !== i))}
                  aria-label="O'chirish"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-ghost text-xs text-primary-600 dark:text-primary-400 gap-1 px-2 py-1"
              onClick={() => setCriteria([...criteria, ''])}
            >
              <Plus size={14} /> Mezon qo'shish
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button className="btn-secondary flex-1" onClick={onCancel} disabled={saving}>Bekor qilish</button>
          <button className="btn-primary flex-1 gap-2" onClick={handleSave} disabled={!canSave}>
            <Save size={16} /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </div>
    </div>
  )
}
