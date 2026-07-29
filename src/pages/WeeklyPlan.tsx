// ═══════════════════════════════════════════════════════════════════════════
// WeeklyPlan — shaxsiy haftalik dars rejasi (Green 90 / Yellow 45 / Red 10)
// Backend: src/services/weeklyLessonService.ts, migration weekly_lessons.sql
// ═══════════════════════════════════════════════════════════════════════════
import { useCallback, useEffect, useState } from 'react'
import { CalendarRange, Plus, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  getWeeklyUserId, fetchUnitsWithLessons,
  createUnit, updateUnit, deleteUnit,
  createLesson, updateLesson, deleteLesson,
} from '../services/weeklyLessonService'
import type {
  WeeklyUnitWithLessons, WeeklyLesson, WeeklyUnit,
  CreateUnitDTO, CreateLessonDTO,
} from '../types/weeklyLesson'
import { useToastStore } from '../utils/toastStore'
import WeeklyUnitCard from '../components/weeklyPlan/WeeklyUnitCard'
import WeeklyUnitForm from '../components/weeklyPlan/WeeklyUnitForm'
import WeeklyLessonEditor from '../components/weeklyPlan/WeeklyLessonEditor'
import { SkeletonCard } from '../components/ui/Skeleton'

const toast = (m: string, t?: 'success' | 'error' | 'info' | 'warning') =>
  useToastStore.getState().toast(m, t)

type LessonEditState = { unit: WeeklyUnitWithLessons; lesson: WeeklyLesson | null }

export default function WeeklyPlan() {
  const [userId, setUserId] = useState<string | null>(null)
  const [units, setUnits] = useState<WeeklyUnitWithLessons[]>([])
  const [loading, setLoading] = useState(true)

  const [unitForm, setUnitForm] = useState<{ unit: WeeklyUnit | null } | null>(null)
  const [lessonEdit, setLessonEdit] = useState<LessonEditState | null>(null)

  const reload = useCallback(async (uid: string) => {
    const data = await fetchUnitsWithLessons(uid)
    setUnits(data)
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const uid = await getWeeklyUserId()
      if (!alive) return
      setUserId(uid)
      if (uid !== 'guest') {
        try {
          await reload(uid)
        } catch {
          toast('Rejani yuklab bo\'lmadi', 'error')
        }
      }
      setLoading(false)
    })()
    return () => { alive = false }
  }, [reload])

  const guarded = async (fn: () => Promise<void>, errMsg: string) => {
    if (!userId || userId === 'guest') return
    try {
      await fn()
      await reload(userId)
    } catch {
      toast(errMsg, 'error')
    }
  }

  // ─── Unit handlers ────────────────────────────────────────────────────────
  const saveUnit = async (dto: CreateUnitDTO) => {
    const editing = unitForm?.unit
    await guarded(async () => {
      if (editing) {
        await updateUnit(editing.id, dto, userId!)
        toast('Hafta yangilandi', 'success')
      } else {
        await createUnit(userId!, dto)
        toast('Hafta qo\'shildi', 'success')
      }
    }, 'Haftani saqlab bo\'lmadi')
    setUnitForm(null)
  }

  const removeUnit = (unit: WeeklyUnitWithLessons) => {
    if (!window.confirm(`${unit.week_no}-hafta va uning barcha darslari o'chiriladi. Davom etilsinmi?`)) return
    guarded(async () => {
      await deleteUnit(unit.id, userId!)
      toast('Hafta o\'chirildi', 'info')
    }, 'Haftani o\'chirib bo\'lmadi')
  }

  // ─── Lesson handlers ──────────────────────────────────────────────────────
  const saveLesson = async (dto: CreateLessonDTO) => {
    const editing = lessonEdit?.lesson
    await guarded(async () => {
      if (editing) {
        await updateLesson(editing.id, dto, userId!)
        toast('Dars yangilandi', 'success')
      } else {
        await createLesson(userId!, dto)
        toast('Dars qo\'shildi', 'success')
      }
    }, 'Darsni saqlab bo\'lmadi')
    setLessonEdit(null)
  }

  const removeLesson = (lesson: WeeklyLesson) => {
    if (!window.confirm(`"${lesson.title}" darsi o'chiriladi. Davom etilsinmi?`)) return
    guarded(async () => {
      await deleteLesson(lesson.id, userId!)
      toast('Dars o\'chirildi', 'info')
    }, 'Darsni o\'chirib bo\'lmadi')
  }

  const toggleLessonDone = (lesson: WeeklyLesson) => {
    const next = lesson.status === 'done' ? 'todo' : 'done'
    guarded(async () => {
      await updateLesson(lesson.id, { status: next }, userId!)
    }, 'Holatni o\'zgartirib bo\'lmadi')
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (userId === 'guest') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <CalendarRange size={48} className="mx-auto text-primary-400 mb-4" />
        <h1 className="text-xl font-bold mb-2">Haftalik reja</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Shaxsiy haftalik dars rejangizni saqlash uchun tizimga kiring.
        </p>
        <Link to="/" className="btn-primary inline-flex gap-2">
          <LogIn size={16} /> Tizimga kirish
        </Link>
      </div>
    )
  }

  const usedWeeks = units.map((u) => u.week_no)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Sarlavha */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarRange className="text-primary-500" /> Haftalik reja
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Green 90 · Yellow 45 · Red 10 — kunlik rejim bo'yicha shaxsiy reja
          </p>
        </div>
        <button className="btn-primary gap-1.5 shrink-0" onClick={() => setUnitForm({ unit: null })}>
          <Plus size={16} /> Hafta
        </button>
      </div>

      {/* Bo'sh holat */}
      {units.length === 0 ? (
        <div className="card text-center py-12">
          <CalendarRange size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">Hali reja yo'q. Birinchi haftani qo'shing.</p>
          <button className="btn-primary inline-flex gap-1.5" onClick={() => setUnitForm({ unit: null })}>
            <Plus size={16} /> Birinchi hafta
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {units.map((unit) => (
            <WeeklyUnitCard
              key={unit.id}
              unit={unit}
              onAddLesson={(u) => setLessonEdit({ unit: u, lesson: null })}
              onEditLesson={(u, l) => setLessonEdit({ unit: u, lesson: l })}
              onDeleteLesson={removeLesson}
              onToggleLessonDone={toggleLessonDone}
              onEditUnit={(u) => setUnitForm({ unit: u })}
              onDeleteUnit={removeUnit}
            />
          ))}
        </div>
      )}

      {/* Modallar */}
      {unitForm && (
        <WeeklyUnitForm
          unit={unitForm.unit}
          usedWeeks={usedWeeks}
          onSave={saveUnit}
          onCancel={() => setUnitForm(null)}
        />
      )}
      {lessonEdit && (
        <WeeklyLessonEditor
          unitId={lessonEdit.unit.id}
          lesson={lessonEdit.lesson}
          usedDays={lessonEdit.unit.lessons
            .filter((l) => l.id !== lessonEdit.lesson?.id)
            .map((l) => l.day_no)}
          onSave={saveLesson}
          onCancel={() => setLessonEdit(null)}
        />
      )}
    </div>
  )
}
