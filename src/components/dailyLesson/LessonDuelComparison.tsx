// ═══════════════════════════════════════════════════════════════════════════
// LessonDuelComparison — Dars tugagandan keyin duel natijalarini ko'rsatish
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sword, Trophy, ChevronRight, CheckCircle2, Plus, Zap, Loader2, Bot } from 'lucide-react'
import { getDuelById } from '../../services/tandemService'
import { pushLessonProgress } from '../../services/lessonService'
import { useStore } from '../../store/useStore'
import { useToastStore } from '../../utils/toastStore'
import { monitoring } from '../../lib/monitoring'

interface Props {
  lessonId: string
  lessonTitle: string
  lessonScore: number
  lessonTotal: number
}

interface DuelData {
  id: string
  challenger_score: number | null
  opponent_score: number | null
  is_bot: boolean
  challenger: string
  opponent: string | null
  question_set: unknown[]
  status: string
}

export default function LessonDuelComparison({ lessonId, lessonTitle, lessonScore, lessonTotal }: Props) {
  const navigate = useNavigate()
  const [duelData, setDuelData] = useState<DuelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [opponentName, setOpponentName] = useState('Do\'st')
  const [bonusApplied, setBonusApplied] = useState(false)
  const [bonusScore, setBonusScore] = useState<number | null>(null)

  const { setLessonProgress: updateLessonProgress } = useStore()

  // localStorage dan challenge + bonus ma'lumotlarini olish
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`lesson-challenge-${lessonId}`)
      const bonusSaved = localStorage.getItem(`lesson-challenge-bonus-${lessonId}`)
      if (bonusSaved === 'true') setBonusApplied(true)

      if (!saved) {
        setLoading(false)
        return
      }

      const parsed = JSON.parse(saved) as { duelId: string; createdAt: number }
      const hoursSince = (Date.now() - parsed.createdAt) / 3600000
      if (hoursSince >= 24) {
        localStorage.removeItem(`lesson-challenge-${lessonId}`)
        setLoading(false)
        return
      }

      // Duel ma'lumotlarini olish
      getDuelById(parsed.duelId).then((duel) => {
        if (!duel) {
          setLoading(false)
          return
        }

        setDuelData({
          id: duel.id,
          challenger_score: duel.challenger_score,
          opponent_score: duel.opponent_score,
          is_bot: duel.is_bot,
          challenger: duel.challenger,
          opponent: duel.opponent,
          question_set: duel.question_set as unknown[],
          status: duel.status,
        })

        // Raqib nomini aniqlash
        if (duel.is_bot) {
          setOpponentName('AI Bot')
        }

        // Do'stning ismini olish (agar do'st bo'lsa)
        if (!duel.is_bot && duel.opponent) {
          import('../../lib/supabase').then(({ supabase }) => {
            supabase.from('users').select('name').eq('id', duel.opponent!).single().then(({ data }) => {
              if (data?.name) setOpponentName(data.name)
            })
          }).catch((e: unknown) => {
            monitoring.captureMessage('load opponent name failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
          })
        }

        setLoading(false)
      }).catch(() => setLoading(false))
    } catch {
      monitoring.captureMessage('Failed to load lesson challenge data from localStorage', 'warn')
      setLoading(false)
    }
  }, [lessonId])

  // Bonus qo'llash
  const applyDuelBonus = async () => {
    if (!duelData || duelData.challenger_score === null) return
    const duelScore = duelData.challenger_score
    const duelTotal = duelData.question_set.length
    if (duelTotal === 0) return

    const lessonCorrect = Math.round((lessonScore / 100) * lessonTotal)
    const newCorrect = lessonCorrect + duelScore
    const newTotal = lessonTotal + duelTotal
    const newScore = Math.min(100, Math.round((newCorrect / newTotal) * 100))

    updateLessonProgress(lessonId, newScore)
    localStorage.setItem(`lesson-challenge-bonus-${lessonId}`, 'true')
    setBonusApplied(true)
    setBonusScore(newScore)

    pushLessonProgress(lessonId, newCorrect, newTotal).catch((e) => {
      monitoring.captureMessage('pushLessonProgress (duel bonus) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    })

    const bonusXP = duelScore * 15
    useStore.getState().addXP(bonusXP)

    useToastStore.getState().toast(
      `🎯 Duel bonusi qo'shildi! ${bonusXP} XP, dars natijasi ${lessonScore}% → ${newScore}%`,
      'success', 4000,
    )
  }

  // Yuklanayotganda yoki challenge yo'q bo'lsa — null qaytaramiz
  if (loading) return <div className="flex justify-center py-3"><Loader2 size={18} className="animate-spin text-gray-400" /></div>
  if (!duelData) return null
  if (duelData.challenger_score === null) return null  // Hali o'ynalmagan

  const myScore = duelData.challenger_score
  const theirScore = duelData.opponent_score
  const duelTotal = duelData.question_set.length

  // Duel yakunlanganmi? (ikkala score ham mavjud)
  const duelComplete = theirScore !== null && duelData.status === 'done'
  const myPct = duelTotal > 0 ? Math.round((myScore / duelTotal) * 100) : 0
  const theirPct = theirScore !== null && duelTotal > 0 ? Math.round((theirScore / duelTotal) * 100) : 0

  let resultText = ''
  let resultColor = ''
  let resultEmoji = ''
  if (duelComplete && theirScore !== null) {
    if (myScore > theirScore) {
      resultText = 'Siz g\'alaba qozondingiz!'
      resultColor = 'text-emerald-600 dark:text-emerald-400'
      resultEmoji = '🏆'
    } else if (myScore < theirScore) {
      resultText = `${opponentName} g'alaba qozondi`
      resultColor = 'text-rose-600 dark:text-rose-400'
      resultEmoji = '😔'
    } else {
      resultText = 'Durang!'
      resultColor = 'text-amber-600 dark:text-amber-400'
      resultEmoji = '🤝'
    }
  }

  return (
    <div className="w-full rounded-2xl border-2 border-indigo-200 dark:border-indigo-800/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sword size={16} />
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">Dars Duel'i</span>
        </div>
        <p className="text-sm font-bold">{lessonTitle}</p>
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 space-y-4">
        {/* VS Score */}
        <div className="flex items-center gap-4">
          {/* Siz */}
          <div className="flex-1 text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm mx-auto mb-1 shadow-sm">
              S
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Siz</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{myScore}<span className="text-sm text-gray-400 font-medium">/{duelTotal}</span></p>
            <p className="text-xs text-gray-500">{myPct}%</p>
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">VS</span>
            {duelComplete && theirScore !== null && (
              <span className={`text-lg ${resultEmoji === '🏆' ? 'text-yellow-500' : resultEmoji === '😔' ? 'text-gray-400' : 'text-amber-500'}`}>
                {resultEmoji}
              </span>
            )}
          </div>

          {/* Raqib */}
          <div className="flex-1 text-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-1 shadow-sm ${
              duelData.is_bot
                ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                : 'bg-gradient-to-br from-purple-400 to-pink-500'
            }`}>
              {duelData.is_bot ? <Bot size={16} /> : opponentName.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5 truncate max-w-[80px] mx-auto">{opponentName}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {theirScore !== null ? theirScore : '?'}
              <span className="text-sm text-gray-400 font-medium">/{duelTotal}</span>
            </p>
            <p className="text-xs text-gray-500">{theirScore !== null ? `${theirPct}%` : '⏳'}</p>
          </div>
        </div>

        {/* Duel ma'lumotlari */}
        {!duelComplete && theirScore === null && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-center">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
              ⏳ {opponentName} o'ynashini kuting
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Natija bilinishi uchun ikkala o'yinchi ham o'ynashi kerak
            </p>
          </div>
        )}

        {/* Natija */}
        {duelComplete && theirScore !== null && (
          <div className={`rounded-xl p-3 text-center ${
            myScore > theirScore
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
              : myScore < theirScore
                ? 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
          }`}>
            <p className={`font-bold text-sm ${resultColor}`}>
              {resultEmoji} {resultText}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Dars natijangiz: {lessonScore}% · Duel: {myScore}/{duelTotal}
            </p>
          </div>
        )}

        {/* Lessons Score */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Trophy size={12} className="text-yellow-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Dars natijasi</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100">{lessonScore}%</span>
          </div>
          <div className="mt-1.5 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${lessonScore}%` }}
            />
          </div>
        </div>

        {/* Duel bonus */}
        {!bonusApplied && (
          <button
            onClick={applyDuelBonus}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold
              hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus size={14} />
            Duel natijasini darsga qo'shish (+{myScore}/{duelTotal})
            <Zap size={14} />
          </button>
        )}

        {bonusApplied && bonusScore !== null && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={14} />
              Duel bonusi qo'shilgan — yangi natija: {bonusScore}%
            </div>
          </div>
        )}

        {/* Tandem ga o'tish */}
        <button
          onClick={() => navigate('/tandem')}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl
            bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold
            hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all"
        >
          Tandem'da batafsil ko'rish <ChevronRight size={12} />
        </button>
      </div>
    </div>
  )
}
