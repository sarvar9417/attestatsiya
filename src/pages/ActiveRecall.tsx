// Active Recall — "Blank Slate" o'zini sinash (F7-4, yodlash ilmi tavsiyasi).
// Recognition (tanlash) o'rniga RECALL: formula nomi ko'rsatiladi, foydalanuvchi
// tuzilishini xotirasidan eslaydi, keyin ochib o'zini baholaydi (testing effect).
// Mavjud darslar formulalaridan foydalanadi — yangi data kerak emas.

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, ArrowLeft, RotateCcw, Eye, Check, X, Trophy } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useI18n } from '../i18n'
import type { DailyLesson } from '../data/dailyLessons'

const SESSION_SIZE = 10

interface RecallItem {
  label: string
  structure: string
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

function buildSession(currentDay: number, lessons: DailyLesson[]): RecallItem[] {
  const reached = lessons.filter((l) => (l.day ?? 9999) <= Math.max(currentDay, 1))
  const all: RecallItem[] = []
  for (const l of reached) {
    for (const f of l.formulas ?? []) {
      if (f.label && f.structure) {
        all.push({ label: f.label, structure: f.structure, lessonTitle: l.title, level: l.level })
      }
    }
  }
  return shuffle(all).slice(0, SESSION_SIZE)
}

export default function ActiveRecall() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { currentDay, addXP, lessons } = useStore()

  const [session, setSession] = useState<RecallItem[]>(() => buildSession(currentDay, lessons as DailyLesson[]))
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [knownCount, setKnownCount] = useState(0)
  const [done, setDone] = useState(false)

  const current = session[idx]
  const progress = useMemo(() => (session.length ? Math.round((idx / session.length) * 100) : 0), [idx, session.length])

  const rate = useCallback((known: boolean) => {
    if (known) {
      setKnownCount((c) => c + 1)
      addXP(10)
    }
    if (idx < session.length - 1) {
      setIdx((i) => i + 1)
      setRevealed(false)
    } else {
      setDone(true)
    }
  }, [idx, session.length, addXP])

  const restart = useCallback(() => {
    setSession(buildSession(currentDay, lessons as DailyLesson[]))
    setIdx(0)
    setRevealed(false)
    setKnownCount(0)
    setDone(false)
  }, [currentDay])

  const scorePct = session.length ? Math.round((knownCount / session.length) * 100) : 0

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2 rounded-xl -ml-2" aria-label={t('aria.goBack')}>
          <ArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Brain size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Active Recall</h1>
          <p className="text-xs text-gray-500">Xotirangizdan eslang — ko'mak yo'q (eng kuchli yodlash usuli)</p>
        </div>
      </div>

      {session.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-gray-500">Hali formula yo'q — avval bir nechta darsni boshlang.</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">Darslarga o'tish</button>
        </div>
      ) : done ? (
        <div className="card text-center py-10">
          <Trophy size={36} className="text-yellow-500 mx-auto mb-3" />
          <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{knownCount}/{session.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{scorePct}% bildingiz · +{knownCount * 10} XP</p>
          <button onClick={restart} className="btn-primary mt-5 flex items-center justify-center gap-2 mx-auto px-6 py-3">
            <RotateCcw size={18} /> Yangi sessiya
          </button>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-gray-400 shrink-0">{idx + 1}/{session.length}</span>
          </div>

          <div className="card">
            <p className="text-xs font-medium text-gray-400 mb-2">{current.level} · {current.lessonTitle}</p>

            {/* Prompt — formula nomi */}
            <div className="rounded-2xl p-5 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/40 text-center">
              <p className="text-xs text-primary-500 font-semibold mb-1">Eslab ko'ring:</p>
              <p className="text-xl font-black text-gray-900 dark:text-gray-100">{current.label}</p>
              <p className="text-xs text-gray-500 mt-2">Tuzilishi, qoidasi va misolini xotirangizdan ayting</p>
            </div>

            {/* Reveal */}
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3"
              >
                <Eye size={18} /> Ko'rsatish
              </button>
            ) : (
              <>
                <div className="mt-4 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">{current.structure}</p>
                </div>
                <p className="text-xs text-center text-gray-500 mt-3">Eslay oldingizmi?</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => rate(false)} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-semibold text-sm border border-rose-200 dark:border-rose-800/40">
                    <X size={16} /> Eslay olmadim
                  </button>
                  <button onClick={() => rate(true)} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm border border-emerald-200 dark:border-emerald-800/40">
                    <Check size={16} /> Bildim (+10 XP)
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
