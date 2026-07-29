// ═══════════════════════════════════════════════════════════════════════════
// LessonChallengeButton — Dars boshida do'stni chaqirish
// "Do'stni darsga chaqirish" — ikkalangiz bir dars bo'yicha bellashasiz
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Users, Bot, Loader2, X, ChevronRight, CheckCircle2, Sword, Plus, Zap } from 'lucide-react'
import type { DailyLesson } from '../../data/dailyLessons'
import {
  getFriends,
  createLessonDuel,
  lessonExercisesToDuelQuestions,
  getDuelById,
} from '../../services/tandemService'
import { useToastStore } from '../../utils/toastStore'
import { useStore } from '../../store/useStore'
import { pushLessonProgress } from '../../services/lessonService'
import { monitoring } from '../../lib/monitoring'
import type { Duel } from '../../types/tandem'
import AsyncDuel from '../tandem/AsyncDuel'

interface Friend {
  id: string
  name: string
  level: string
  status: string
}

interface Props {
  lesson: DailyLesson
  /** Dars tugallanganmi? (lessonProgress mavjud) */
  lessonCompleted: boolean
  /** Darsdagi foiz natija (0-100) */
  lessonScore: number | null
}

export default function LessonChallengeButton({ lesson, lessonCompleted, lessonScore }: Props) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [playingDuel, setPlayingDuel] = useState<Duel | null>(null)
  const [challengeActive, setChallengeActive] = useState(false)
  const challengeIdRef = useRef<string | null>(null)
  const [duelScore, setDuelScore] = useState<number | null>(null)
  const [duelTotal, setDuelTotal] = useState<number>(0)
  const [bonusApplied, setBonusApplied] = useState(false)

  // Faqat multiple-choice mashqlaridan duel savollari tayyorlanadi
  const { setLessonProgress: updateLessonProgress } = useStore()

  const questions = lessonExercisesToDuelQuestions(lesson.exercises)
  const hasEnough = questions.length >= 3

  // localStorage dan challenge holatini tiklash
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`lesson-challenge-${lesson.id}`)
      if (saved) {
        const parsed = JSON.parse(saved) as { duelId: string; createdAt: number }
        const hoursSince = (Date.now() - parsed.createdAt) / 3600000
        if (hoursSince < 24) {
          setChallengeActive(true)
          challengeIdRef.current = parsed.duelId
        } else {
          localStorage.removeItem(`lesson-challenge-${lesson.id}`)
        }
      }
    } catch {
      monitoring.captureMessage('Failed to parse localStorage challenge state', 'warn')
      localStorage.removeItem(`lesson-challenge-${lesson.id}`)
    }
  }, [lesson.id])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    getFriends()
      .then((all) => setFriends(all.filter((f) => f.status === 'accepted')))
      .catch(() => setFriends([]))
      .finally(() => setLoading(false))
  }, [open])

  // localStorage dan bonusApplied holatini tiklash
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`lesson-challenge-bonus-${lesson.id}`)
      if (saved === 'true') setBonusApplied(true)
    } catch {
      monitoring.captureMessage('Failed to read bonusApplied from localStorage', 'warn')
    }
  }, [lesson.id])

  // Duel natijasini olish (challenger_score ni bilish uchun)
  useEffect(() => {
    if (!challengeActive || !challengeIdRef.current) return
    const fetchDuelScore = async () => {
      try {
        const duel = await getDuelById(challengeIdRef.current!)
        if (!duel) return
        // Challenger score mavjud bo'lsa — duel o'ynalgan
        if (duel.challenger_score !== null) {
          setDuelScore(duel.challenger_score)
          setDuelTotal((duel.question_set as unknown[]).length)
        }
      } catch {
        monitoring.captureMessage('Failed to fetch duel score', 'warn')
      }
    }
    // Har 5 sekundda tekshirib turamiz (chunki duel o'ynalishi async)
    fetchDuelScore()
    const interval = setInterval(fetchDuelScore, 5000)
    return () => clearInterval(interval)
  }, [challengeActive, lesson.id])

  // Modal ochilganda orqa fon scroll'ini qulflaymiz
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  const startChallenge = async (opponentId: string | null) => {
    if (!hasEnough) {
      useToastStore.getState().toast('Bu darsda duel uchun yetarli savol yo\'q', 'error')
      return
    }
    setCreating(true)
    const result = await createLessonDuel(opponentId, lesson.id, lesson.title, questions)
    setCreating(false)
    if (result.success && result.duel) {
      // Challenge ma'lumotini localStorage'ga saqlaymiz
      localStorage.setItem(`lesson-challenge-${lesson.id}`, JSON.stringify({
        duelId: result.duel.id,
        createdAt: Date.now(),
      }))
      challengeIdRef.current = result.duel.id
      setOpen(false)

      // Challenger darhol o'ynaydi (AI bot yoki do'st — farqi yo'q)
      setChallengeActive(true)
      setPlayingDuel(result.duel)
    } else {
      useToastStore.getState().toast(result.error || 'Challenge yaratishda xatolik', 'error')
    }
  }

  const cancelChallenge = () => {
    localStorage.removeItem(`lesson-challenge-${lesson.id}`)
    localStorage.removeItem(`lesson-challenge-bonus-${lesson.id}`)
    challengeIdRef.current = null
    setChallengeActive(false)
    useToastStore.getState().toast('Challenge bekor qilindi', 'info')
  }

  // ── Duel natijasini dars progressiga qo'shish ────────────────────────
  const applyDuelBonus = async () => {
    if (duelScore === null || lessonScore === null) return

    const lessonTotal = lesson.exercises.length + lesson.tests.length
    if (lessonTotal === 0) return

    // Hozirgi darsdagi to'g'ri javoblar sonini taxminiy hisoblash
    const lessonCorrect = Math.round((lessonScore / 100) * lessonTotal)
    const duelCorrect = duelScore
    const duelTotalQs = duelTotal

    // Yangi foiz: (dars to'g'ri + duel to'g'ri) / (dars jami + duel jami) * 100
    const newCorrect = lessonCorrect + duelCorrect
    const newTotal = lessonTotal + duelTotalQs
    const newScore = Math.min(100, Math.round((newCorrect / newTotal) * 100))

    // Store va localStorage ga yozish
    updateLessonProgress(lesson.id, newScore)
    localStorage.setItem(`lesson-challenge-bonus-${lesson.id}`, 'true')
    setBonusApplied(true)

    // DB ga yozish
    pushLessonProgress(lesson.id, newCorrect, newTotal).catch((e) => {
      monitoring.captureMessage('pushLessonProgress (duel bonus) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    })

    // Bonus XP (duel to'g'ri javoblar uchun qo'shimcha XP)
    const bonusXP = duelCorrect * 15
    useStore.getState().addXP(bonusXP)

    useToastStore.getState().toast(
      `🎯 Duel bonusi qo'shildi! ${bonusXP} XP, dars natijasi ${lessonScore}% → ${newScore}%`,
      'success', 4000,
    )
  }

  // Yetarli savol bo'lmasa — ko'rsatmaymiz
  if (!hasEnough) return null

  // ── Challenger duelni o'ynayapti (to'liq ekran) ──────────────────────
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
              '⚔️ Javobingiz saqlandi! Endi do\'stingiz o\'ynaydi.',
              'success',
            )
          }}
        />
      </div>,
      document.body,
    )
  }

  // ── Active challenge banner (dars o'rganayotganda yoki tugaganda) ─────
  if (challengeActive) {
    // "Natijani ko'rish" tugmasini ko'rsatish: dars tugagan bo'lsa yoki
    // oldin tugatilgan bo'lsa (lessonScore mavjud)
    const showResults = lessonCompleted || lessonScore !== null

    return (
      <div className="w-full rounded-2xl p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 border-2 border-indigo-200 dark:border-indigo-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
            <Sword size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-indigo-800 dark:text-indigo-200">
              ⚔️ Dars Duel'i — do'stingiz bilan bellashyapsiz
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
              &quot;{lesson.title}&quot; — aynan shu dars savollari bo'yicha
            </p>
          </div>
          {showResults && (
            <button
              onClick={() => navigate('/tandem')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shrink-0"
            >
              Natijani ko'rish <ChevronRight size={12} />
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs">
          {showResults ? (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircle2 size={12} />
              Sizning natijangiz: {lessonScore ?? '?'}%
            </span>
          ) : (
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              <Sword size={12} />
              Darsni tugating va natijalarni solishtiring
            </span>
          )}
          <button
            onClick={cancelChallenge}
            className="ml-auto text-gray-400 hover:text-red-500 transition-colors text-xs underline"
          >
            Bekor qilish
          </button>
        </div>

        {/* ── Duel bonus option ── */}
        {showResults && duelScore !== null && !bonusApplied && (
          <div className="mt-3 pt-3 border-t border-indigo-200/50 dark:border-indigo-800/30">
            <button
              onClick={applyDuelBonus}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold
                hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm active:scale-[0.98]"
            >
              <Plus size={14} />
              Duel natijasini darsga qo'shish (+{duelScore}/{duelTotal})
              <Zap size={14} />
            </button>
            <p className="text-xs text-gray-400 text-center mt-1.5">
              Dueldagi to'g'ri javoblar dars progressiga qo'shiladi va bonus XP olasiz
            </p>
          </div>
        )}

        {/* ── Bonus applied confirmation ── */}
        {showResults && bonusApplied && (
          <div className="mt-3 pt-3 border-t border-indigo-200/50 dark:border-indigo-800/30">
            <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={14} />
              Duel bonusi qo'shilgan
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Default: Challenge tugmasi (dars boshida ko'rinadi) ────────────────
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
          bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm
          hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md active:scale-[0.98]"
      >
        <Users size={16} />
        Do'stni darsga chaqirish
      </button>

      {/* Modal — portal orqali */}
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
                <Users size={16} className="inline mr-1.5 text-indigo-500" />
                Do'stni darsga chaqirish
              </h3>
              <button
                onClick={() => !creating && setOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              &quot;{lesson.title}&quot; darsidan {questions.length} ta savol.
              Do'stingizni chaqirib, kim yaxshiroq bilishini aniqlang!
            </p>

            <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-3 text-xs text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
              💡 Siz avval o'ynaysiz, keyin do'stingiz o'ynaydi. Ikkalangiz bir xil savollarga javob berasiz!
              {lessonCompleted && ' Siz allaqachon darsni tugatgansiz — endi do\'stingizni chaqirib, natijalarni solishtiring!'}
            </div>

            {creating ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={22} className="animate-spin text-indigo-500" />
              </div>
            ) : (
              <div className="space-y-1.5">
                {/* AI bot — har doim mavjud */}
                <button
                  onClick={() => startChallenge(null)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                    hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Bot size={16} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">AI bot bilan</p>
                    <p className="text-xs text-gray-400">Darhol natijani ko'rish</p>
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
                      className="text-indigo-500 font-semibold underline"
                    >
                      Do'st qo'shing
                    </button>
                  </p>
                ) : (
                  friends.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => startChallenge(f.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                        hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
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
