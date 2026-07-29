// ═══════════════════════════════════════════════════════════════════════════
// LessonDuelButton — Dars tugagach do'st bilan duel boshlash
// Aynan o'sha darsning mashqlaridan duel yaratadi
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Swords, Bot, Loader2, X, ChevronRight } from 'lucide-react'
import type { DailyLesson } from '../../data/dailyLessons'
import {
  getFriends,
  createLessonDuel,
  lessonExercisesToDuelQuestions,
} from '../../services/tandemService'
import type { Duel } from '../../types/tandem'
import AsyncDuel from '../tandem/AsyncDuel'
import { useToastStore } from '../../utils/toastStore'

interface Friend {
  id: string
  name: string
  level: string
  status: string
}

export default function LessonDuelButton({ lesson }: { lesson: DailyLesson }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [playingDuel, setPlayingDuel] = useState<Duel | null>(null)

  // Bu darsdan nechta duel-savol chiqadi (multiple-choice mashqlar)
  const questions = lessonExercisesToDuelQuestions(lesson.exercises)
  const hasEnough = questions.length >= 3

  useEffect(() => {
    if (!open) return
    setLoading(true)
    getFriends()
      .then((all) => setFriends(all.filter((f) => f.status === 'accepted')))
      .catch(() => setFriends([]))
      .finally(() => setLoading(false))
  }, [open])

  // Modal ochilganda orqa fon scroll'ini qulflaymiz
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  const startDuel = async (opponentId: string | null) => {
    setCreating(true)
    const result = await createLessonDuel(opponentId, lesson.id, lesson.title, questions)
    setCreating(false)
    if (result.success && result.duel) {
      setOpen(false)
      // Challenger DARHOL o'ynaydi — o'ynagandan keyin do'stga navbat o'tadi
      // (status pending → opponent_turn). Aks holda do'st hech narsa ko'rmaydi.
      setPlayingDuel(result.duel)
    } else {
      useToastStore.getState().toast(result.error || 'Duel yaratishda xatolik', 'error')
    }
  }

  // Yetarli savol bo'lmasa — tugmani ko'rsatmaymiz
  if (!hasEnough) return null

  // Challenger duelni o'ynayapti — to'liq ekran
  if (playingDuel) {
    return createPortal(
      <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <AsyncDuel
          duel={playingDuel}
          mode="lesson"
          userRole="challenger"
          onComplete={() => {
            setPlayingDuel(null)
            useToastStore.getState().toast(
              playingDuel.is_bot
                ? '🤖 AI bilan duel yakunlandi — natijani Tandem\'da ko\'ring!'
                : '⚔️ Javobingiz saqlandi! Endi do\'stingiz o\'ynaydi.',
              'success',
            )
            navigate('/tandem')
          }}
        />
      </div>,
      document.body,
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
          bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold text-sm
          hover:from-rose-600 hover:to-orange-600 transition-all shadow-md active:scale-[0.98]"
      >
        <Swords size={16} />
        Do'st bilan bellashing
      </button>

      {/* Modal — document.body ga portal orqali chiqariladi (transform'li
          ota-element position:fixed ni buzmasin) */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 overscroll-contain"
          onClick={() => !creating && setOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-5 space-y-3 animate-page-enter max-h-[85vh] overflow-y-auto mobile-safe-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">
                <Swords size={16} className="inline mr-1.5 text-rose-500" />
                Dars Duel'i
              </h3>
              <button
                onClick={() => !creating && setOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              "{lesson.title}" darsidan {questions.length} ta savol. Do'stingiz ham
              aynan shu savollarga javob beradi — kim yaxshiroq biladi?
            </p>

            {creating ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={22} className="animate-spin text-rose-500" />
              </div>
            ) : (
              <div className="space-y-1.5">
                {/* AI bot — har doim mavjud */}
                <button
                  onClick={() => startDuel(null)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                    hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Bot size={16} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">AI bot bilan</p>
                    <p className="text-xs text-gray-400">Darrov o'ynash</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>

                {/* Do'stlar */}
                {loading ? (
                  <div className="flex justify-center py-3">
                    <Loader2 size={18} className="animate-spin text-gray-400" />
                  </div>
                ) : friends.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">
                    Hali do'stingiz yo'q.{' '}
                    <button
                      onClick={() => { setOpen(false); navigate('/tandem') }}
                      className="text-rose-500 font-semibold underline"
                    >
                      Do'st qo'shing
                    </button>
                  </p>
                ) : (
                  friends.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => startDuel(f.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                        hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-300">
                          {f.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{f.name}</p>
                        <p className="text-xs text-gray-400">{f.level}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
