import { supabase } from '../lib/supabase'
import { useToastStore } from '../utils/toastStore'
import type { Json } from '../types/supabase'
import type {
  WeeklyUnit, WeeklyLesson, WeeklyUnitWithLessons,
  CreateUnitDTO, UpdateUnitDTO, CreateLessonDTO, UpdateLessonDTO,
  LessonBlock, LessonMode, LessonStatus, UnitStatus,
} from '../types/weeklyLesson'

// ═══════════════════════════════════════════════════════════════════════════
// Weekly Lesson Service — haftalik dars rejasi CRUD
// ═══════════════════════════════════════════════════════════════════════════

function requireAuthedUser(userId: string): void {
  if (!userId || userId === 'guest') {
    useToastStore.getState().toast('Iltimos, avval tizimga kiring', 'error')
    throw new Error('Not authenticated')
  }
}

/** Joriy foydalanuvchi id'si — RLS uchun har mutatsiyada kerak */
export async function getWeeklyUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? 'guest'
}

// ─── Row → domain mapping ─────────────────────────────────────────────────
// DB `blocks` JSONB va `mode`/`status` matn sifatida qaytadi; bu yerda
// domain tipiga tor qilamiz. Noto'g'ri JSON bo'lsa bo'sh massiv beramiz —
// bitta buzuq dars butun sahifani yiqitmasin.

function parseBlocks(raw: Json): LessonBlock[] {
  if (!Array.isArray(raw)) return []
  // LessonBlock interfeyslarida index-signature yo'q → Json'ga to'g'ridan-to'g'ri
  // type-predicate qo'llab bo'lmaydi. Shakl bo'yicha filtrlab, natijani tor qilamiz.
  return raw.filter(
    (b) =>
      typeof b === 'object' && b !== null && !Array.isArray(b) && typeof (b as { type?: unknown }).type === 'string'
  ) as unknown as LessonBlock[]
}

type UnitRow = {
  id: number; user_id: string; week_no: number; title: string
  subtitle: string | null; objective: string | null; success_criteria: string[]
  phase: string | null; start_date: string | null; end_date: string | null
  status: string; created_at: string; updated_at: string
}

type LessonRow = {
  id: number; user_id: string; unit_id: number; day_no: number; title: string
  objective: string | null; mode: string; duration_min: number; blocks: Json
  status: string; notes: string | null; completed_at: string | null
  created_at: string; updated_at: string
}

function toUnit(row: UnitRow): WeeklyUnit {
  return { ...row, status: row.status as UnitStatus, success_criteria: row.success_criteria ?? [] }
}

function toLesson(row: LessonRow): WeeklyLesson {
  return {
    ...row,
    mode: row.mode as LessonMode,
    status: row.status as LessonStatus,
    blocks: parseBlocks(row.blocks),
  }
}

// ─── Units ────────────────────────────────────────────────────────────────

export async function fetchUnits(userId: string): Promise<WeeklyUnit[]> {
  const { data, error } = await supabase
    .from('weekly_units')
    .select('*')
    .eq('user_id', userId)
    .order('week_no', { ascending: true })

  if (error) throw error
  return (data ?? []).map(toUnit)
}

/** Barcha haftalar + ularning kunlik darslari — hub sahifasi uchun bitta yuklash */
export async function fetchUnitsWithLessons(userId: string): Promise<WeeklyUnitWithLessons[]> {
  const [units, lessons] = await Promise.all([
    fetchUnits(userId),
    fetchAllLessons(userId),
  ])

  const byUnit = new Map<number, WeeklyLesson[]>()
  for (const lesson of lessons) {
    const list = byUnit.get(lesson.unit_id)
    if (list) list.push(lesson)
    else byUnit.set(lesson.unit_id, [lesson])
  }

  return units.map(u => ({ ...u, lessons: byUnit.get(u.id) ?? [] }))
}

export async function createUnit(userId: string, dto: CreateUnitDTO): Promise<WeeklyUnit> {
  requireAuthedUser(userId)

  const { data, error } = await supabase
    .from('weekly_units')
    .insert({
      user_id: userId,
      week_no: dto.week_no,
      title: dto.title,
      subtitle: dto.subtitle || null,
      objective: dto.objective || null,
      success_criteria: dto.success_criteria ?? [],
      phase: dto.phase || null,
      start_date: dto.start_date || null,
      end_date: dto.end_date || null,
      status: dto.status ?? 'planned',
    })
    .select()
    .single()

  if (error) {
    // UNIQUE (user_id, week_no) — bir raqamli hafta ikki marta kiritilmasin
    if (error.code === '23505') {
      useToastStore.getState().toast(`${dto.week_no}-hafta allaqachon mavjud`, 'warning')
    }
    throw error
  }
  return toUnit(data)
}

export async function updateUnit(unitId: number, dto: UpdateUnitDTO, userId: string): Promise<WeeklyUnit> {
  requireAuthedUser(userId)

  const { data, error } = await supabase
    .from('weekly_units')
    .update({
      ...(dto.week_no          !== undefined && { week_no: dto.week_no }),
      ...(dto.title            !== undefined && { title: dto.title }),
      ...(dto.subtitle         !== undefined && { subtitle: dto.subtitle || null }),
      ...(dto.objective        !== undefined && { objective: dto.objective || null }),
      ...(dto.success_criteria !== undefined && { success_criteria: dto.success_criteria }),
      ...(dto.phase            !== undefined && { phase: dto.phase || null }),
      ...(dto.start_date       !== undefined && { start_date: dto.start_date || null }),
      ...(dto.end_date         !== undefined && { end_date: dto.end_date || null }),
      ...(dto.status           !== undefined && { status: dto.status }),
    })
    .eq('id', unitId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return toUnit(data)
}

/** Haftani o'chiradi — ON DELETE CASCADE kunlik darslarni ham olib tashlaydi */
export async function deleteUnit(unitId: number, userId: string): Promise<void> {
  requireAuthedUser(userId)

  const { error } = await supabase
    .from('weekly_units')
    .delete()
    .eq('id', unitId)
    .eq('user_id', userId)

  if (error) throw error
}

// ─── Lessons ──────────────────────────────────────────────────────────────

export async function fetchAllLessons(userId: string): Promise<WeeklyLesson[]> {
  const { data, error } = await supabase
    .from('weekly_lessons')
    .select('*')
    .eq('user_id', userId)
    .order('day_no', { ascending: true })

  if (error) throw error
  return (data ?? []).map(toLesson)
}

export async function fetchLessonsForUnit(unitId: number, userId: string): Promise<WeeklyLesson[]> {
  const { data, error } = await supabase
    .from('weekly_lessons')
    .select('*')
    .eq('unit_id', unitId)
    .eq('user_id', userId)
    .order('day_no', { ascending: true })

  if (error) throw error
  return (data ?? []).map(toLesson)
}

export async function createLesson(userId: string, dto: CreateLessonDTO): Promise<WeeklyLesson> {
  requireAuthedUser(userId)

  const { data, error } = await supabase
    .from('weekly_lessons')
    .insert({
      user_id: userId,
      unit_id: dto.unit_id,
      day_no: dto.day_no,
      title: dto.title,
      objective: dto.objective || null,
      mode: dto.mode ?? 'green',
      duration_min: dto.duration_min ?? 90,
      blocks: (dto.blocks ?? []) as unknown as Json,
      status: dto.status ?? 'todo',
      notes: dto.notes || null,
    })
    .select()
    .single()

  if (error) {
    // UNIQUE (unit_id, day_no)
    if (error.code === '23505') {
      useToastStore.getState().toast(`Bu haftada ${dto.day_no}-kun allaqachon mavjud`, 'warning')
    }
    throw error
  }
  return toLesson(data)
}

export async function updateLesson(lessonId: number, dto: UpdateLessonDTO, userId: string): Promise<WeeklyLesson> {
  requireAuthedUser(userId)

  const { data, error } = await supabase
    .from('weekly_lessons')
    .update({
      ...(dto.day_no       !== undefined && { day_no: dto.day_no }),
      ...(dto.title        !== undefined && { title: dto.title }),
      ...(dto.objective    !== undefined && { objective: dto.objective || null }),
      ...(dto.mode         !== undefined && { mode: dto.mode }),
      ...(dto.duration_min !== undefined && { duration_min: dto.duration_min }),
      ...(dto.blocks       !== undefined && { blocks: dto.blocks as unknown as Json }),
      ...(dto.notes        !== undefined && { notes: dto.notes || null }),
      // 'done' ga o'tganda vaqtni belgilaymiz, qaytganda tozalaymiz
      ...(dto.status       !== undefined && {
        status: dto.status,
        completed_at: dto.status === 'done' ? new Date().toISOString() : null,
      }),
    })
    .eq('id', lessonId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return toLesson(data)
}

export async function deleteLesson(lessonId: number, userId: string): Promise<void> {
  requireAuthedUser(userId)

  const { error } = await supabase
    .from('weekly_lessons')
    .delete()
    .eq('id', lessonId)
    .eq('user_id', userId)

  if (error) throw error
}
