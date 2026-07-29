// ═══════════════════════════════════════════════════════════════════════════
// WeeklyUnitCard — bitta hafta (unit) + uning kunlik darslari
// ═══════════════════════════════════════════════════════════════════════════
import { useState } from 'react'
import {
  ChevronDown, Plus, Pencil, Trash2, Clock, CheckCircle2, Circle, Target,
} from 'lucide-react'
import type { WeeklyUnitWithLessons, WeeklyLesson, LessonMode } from '../../types/weeklyLesson'
import { MODE_LABEL } from '../../types/weeklyLesson'
import WeeklyLessonView from './WeeklyLessonView'

interface Props {
  unit: WeeklyUnitWithLessons
  onAddLesson: (unit: WeeklyUnitWithLessons) => void
  onEditLesson: (unit: WeeklyUnitWithLessons, lesson: WeeklyLesson) => void
  onDeleteLesson: (lesson: WeeklyLesson) => void
  onToggleLessonDone: (lesson: WeeklyLesson) => void
  onEditUnit: (unit: WeeklyUnitWithLessons) => void
  onDeleteUnit: (unit: WeeklyUnitWithLessons) => void
}

const MODE_BADGE: Record<LessonMode, string> = {
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

const PHASE_LABEL = 'text-xs font-semibold uppercase tracking-wider text-gray-400'

export default function WeeklyUnitCard(props: Props) {
  const { unit, onAddLesson, onEditLesson, onDeleteLesson, onToggleLessonDone, onEditUnit, onDeleteUnit } = props
  const lessons = [...unit.lessons].sort((a, b) => a.day_no - b.day_no)
  const doneCount = lessons.filter((l) => l.status === 'done').length
  const progress = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0

  return (
    <div className="card">
      {/* Sarlavha */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge-primary">{unit.week_no}-hafta</span>
            {unit.phase && <span className={PHASE_LABEL}>{unit.phase}</span>}
          </div>
          <h3 className="text-lg font-bold mt-1 truncate">{unit.title}</h3>
          {unit.subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{unit.subtitle}</p>}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button className="btn-ghost p-2" onClick={() => onEditUnit(unit)} aria-label="Haftani tahrirlash">
            <Pencil size={16} />
          </button>
          <button className="btn-ghost p-2 hover:text-red-600" onClick={() => onDeleteUnit(unit)} aria-label="Haftani o'chirish">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Maqsad + mezonlar */}
      {unit.objective && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex items-start gap-1.5">
          <Target size={15} className="text-primary-500 mt-0.5 shrink-0" /> {unit.objective}
        </p>
      )}
      {unit.success_criteria.length > 0 && (
        <ul className="mt-2 space-y-1">
          {unit.success_criteria.map((c, i) => (
            <li key={i} className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
              <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /> {c}
            </li>
          ))}
        </ul>
      )}

      {/* Progress */}
      {lessons.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>{doneCount} / {lessons.length} dars bajarildi</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill bg-primary-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Darslar */}
      <div className="mt-4 space-y-1.5">
        {lessons.map((lesson) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            onEdit={() => onEditLesson(unit, lesson)}
            onDelete={() => onDeleteLesson(lesson)}
            onToggleDone={() => onToggleLessonDone(lesson)}
          />
        ))}
        {lessons.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-3">Bu haftada hali dars yo'q.</p>
        )}
      </div>

      {/* Dars qo'shish */}
      <button
        className="btn-secondary w-full mt-3 gap-1.5"
        onClick={() => onAddLesson(unit)}
        disabled={lessons.length >= 7}
      >
        <Plus size={16} /> {lessons.length >= 7 ? 'Hafta to\'la (7 kun)' : 'Dars qo\'shish'}
      </button>
    </div>
  )
}

function LessonRow({
  lesson, onEdit, onDelete, onToggleDone,
}: {
  lesson: WeeklyLesson
  onEdit: () => void
  onDelete: () => void
  onToggleDone: () => void
}) {
  const [open, setOpen] = useState(false)
  const done = lesson.status === 'done'
  return (
    <div className={`rounded-xl border ${done ? 'border-green-200 dark:border-green-900/40 bg-green-50/40 dark:bg-green-900/10' : 'border-gray-100 dark:border-gray-800'}`}>
      <div className="flex items-center gap-2 p-2.5">
        <button onClick={onToggleDone} aria-label={done ? 'Bajarilmagan deb belgilash' : 'Bajarildi deb belgilash'} className="shrink-0">
          {done
            ? <CheckCircle2 size={20} className="text-green-500" />
            : <Circle size={20} className="text-gray-300 dark:text-gray-600 hover:text-primary-400" />}
        </button>

        <button className="flex-1 min-w-0 text-left" onClick={() => setOpen((o) => !o)}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 shrink-0">{lesson.day_no}-kun</span>
            <span className={`text-sm font-semibold truncate ${done ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
              {lesson.title}
            </span>
          </div>
          {lesson.objective && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{lesson.objective}</p>}
        </button>

        <span className={`badge shrink-0 ${MODE_BADGE[lesson.mode]}`}>{MODE_LABEL[lesson.mode]}</span>
        <span className="text-xs text-gray-400 flex items-center gap-0.5 shrink-0">
          <Clock size={12} /> {lesson.duration_min}′
        </span>

        <div className="flex items-center gap-0.5 shrink-0">
          <button className="btn-ghost p-1.5" onClick={onEdit} aria-label="Tahrirlash"><Pencil size={14} /></button>
          <button className="btn-ghost p-1.5 hover:text-red-600" onClick={onDelete} aria-label="O'chirish"><Trash2 size={14} /></button>
          <button className={`btn-ghost p-1.5 transition-transform ${open ? 'rotate-180' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Ochish">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-800">
          <WeeklyLessonView blocks={lesson.blocks} />
        </div>
      )}
    </div>
  )
}
