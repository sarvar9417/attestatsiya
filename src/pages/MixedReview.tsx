// Aralash takror (Interleaved Practice) — yetilgan darslardan turli mavzulardagi
// mashqlarni aralashtirib beradi. "Blocked practice" o'rniga interleaving xotirani
// mustahkamlaydi (audit #3, yodlash ilmi tavsiyasi).

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Shuffle, CheckCircle, ArrowLeft, RotateCcw, Trophy } from 'lucide-react'
import ExerciseCard from '../components/dailyLesson/ExerciseCard'
import { checkAnswer } from '../components/dailyLesson/helpers'
import { useStore } from '../store/useStore'
import type { DailyLesson, DailyExercise } from '../data/dailyLessons'

const SESSION_SIZE = 12

interface SessionItem {
  ex: DailyExercise
  lessonTitle: string
  level: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Yetilgan darslardan mashqlarni round-robin bilan aralashtirib oladi:
// ketma-ket mashqlar har xil darsdan bo'ladi (haqiqiy interleaving).
function buildSession(currentDay: number, lessons: DailyLesson[]): SessionItem[] {
  const reached = lessons.filter(
    (l) => (l.day ?? 9999) <= Math.max(currentDay, 1) && l.exercises?.length > 0,
  )
  const groups = shuffle(reached).map((l) => ({
    items: shuffle(l.exercises).map((ex) => ({ ex, lessonTitle: l.title, level: l.level })),
  }))

  const out: SessionItem[] = []
  let i = 0
  while (out.length < SESSION_SIZE && groups.some((g) => g.items.length > 0)) {
    const g = groups[i % groups.length]
    const item = g.items.shift()
    if (item) out.push(item)
    i++
  }
  return out
}

export default function MixedReview() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { currentDay, addXP, lessons } = useStore()

  const [session, setSession] = useState<SessionItem[]>(() => buildSession(currentDay, lessons as DailyLesson[]))
  const [answers, setAnswers] = useState<Record<number, string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = useCallback((exId: number, idx: number, val: string) => {
    setAnswers((prev) => {
      const cur = [...(prev[exId] ?? [])]
      cur[idx] = val
      return { ...prev, [exId]: cur }
    })
  }, [])

  const correctCount = useMemo(
    () => session.filter((s) => checkAnswer(s.ex, answers[s.ex.id] ?? [])).length,
    [session, answers],
  )

  const handleSubmit = () => {
    setSubmitted(true)
    addXP(correctCount * 10)
  }

  const restart = () => {
    setAnswers({})
    setSubmitted(false)
    setSession(buildSession(currentDay, lessons as DailyLesson[]))
  }

  const scorePct = session.length ? Math.round((correctCount / session.length) * 100) : 0

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2 rounded-xl -ml-2" aria-label={t('mixedReview.backAria')}>
          <ArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Shuffle size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">{t('mixedReview.title')}</h1>
          <p className="text-xs text-gray-500">{t('mixedReview.subtitle')}</p>
        </div>
      </div>

      {session.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-gray-500">{t('mixedReview.emptyState')}</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">{t('mixedReview.goToLessons')}</button>
        </div>
      ) : (
        <>
          {submitted && (
            <div className="card bg-primary-50 border-primary-100 mb-4 text-center">
              <Trophy size={28} className="text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-gray-900">{correctCount}/{session.length}</p>
              <p className="text-sm text-gray-600">{t('mixedReview.resultScore', { pct: String(scorePct), xp: String(correctCount * 10) })}</p>
            </div>
          )}

          <div className="space-y-3">
            {session.map((s, i) => (
              <div key={s.ex.id}>
                <p className="text-xs font-medium text-gray-400 mb-1 ml-1">
                  {s.level} · {s.lessonTitle}
                </p>
                <ExerciseCard
                  ex={s.ex}
                  num={i + 1}
                  total={session.length}
                  answers={answers[s.ex.id] ?? []}
                  onChange={(idx, val) => handleChange(s.ex.id, idx, val)}
                  submitted={submitted}
                />
              </div>
            ))}
          </div>

          {submitted ? (
            <button onClick={restart} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4">
              <RotateCcw size={18} /> {t('mixedReview.newSession')}
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4">
              <CheckCircle size={18} /> {t('mixedReview.submitButton', { count: String(session.length) })}
            </button>
          )}
        </>
      )}
    </div>
  )
}
