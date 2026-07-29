import { useState, useCallback, useEffect } from 'react'
import { Brain, RotateCw, CheckCircle, XCircle, ChevronRight, BarChart3, BookOpen, MessageSquare, Sparkles } from 'lucide-react'
import { useSrsStore } from '../../hooks/useSrsStore'
import type { ChallengeDay } from '../../data/30dayChallenge'

interface Props {
  day: ChallengeDay
  onComplete?: () => void
}

export default function WarmUpSection({ day, onComplete }: Props) {
  const {
    dueCount,
    reviewQueue,
    isReviewing,
    currentCard,
    ensureDayCards,
    startReview,
    rateCard,
    endReview,
    getStats,
  } = useSrsStore()

  // Ensure cards exist for this day when component mounts
  useEffect(() => {
    ensureDayCards(day)
  }, [day, ensureDayCards])

  const stats = getStats()

  const handleRate = useCallback((rating: string) => {
    rateCard(rating)
  }, [rateCard])

  // Track session size at start for accurate progress
  const [sessionSize, setSessionSize] = useState(0)

  // When review starts, capture the number of due cards
  const handleStartReview = useCallback(() => {
    setSessionSize(dueCount)
    startReview()
  }, [dueCount, startReview])

  const handleEndReview = useCallback(() => {
    endReview()
    setSessionSize(0)
  }, [endReview])

  const handleComplete = useCallback(() => {
    endReview()
    setSessionSize(0)
    onComplete?.()
  }, [endReview, onComplete])

  const reviewComplete = isReviewing && reviewQueue.length === 0 && !currentCard
  const totalInSession = sessionSize

  // Flip state for card reveal (defined at top level per React hooks rules)
  const [flipped, setFlipped] = useState(false)

  // Reset flip state when card changes
  useEffect(() => {
    setFlipped(false)
  }, [currentCard?.id])

  // ── Review complete screen ──────────────────────────────────────────────
  if (reviewComplete) {
    return (
      <div className="animate-slide-up space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-center text-white">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-xl font-black mb-1">Ajoyib! Takrorlash tugadi!</h2>
          <p className="text-sm text-emerald-100">Bugun barcha kartalar ko'rib chiqildi</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{stats.total}</p>
            <p className="text-[10px] text-gray-500 mt-1">Jami kartalar</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-2xl font-black text-emerald-600">{stats.reviewed}</p>
            <p className="text-[10px] text-gray-500 mt-1">Ko'rib chiqilgan</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-2xl font-black text-primary-600">{stats.newCards}</p>
            <p className="text-[10px] text-gray-500 mt-1">Yangi so'zlar</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border border-primary-100 dark:border-primary-800/30">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            💡 Kartalar keyingi takrorlanguncha SRS tizimi tomonidan rejalashtirilgan. 
            Har kuni qaytib keling!
          </p>
        </div>

        <button
          onClick={handleComplete}
          className="w-full py-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-sm font-bold text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
        >
          Kontentga o'tish →
        </button>
      </div>
    )
  }

  // ── Review session (showing cards) ──────────────────────────────────────
  if (isReviewing && currentCard) {
    const progress = totalInSession - reviewQueue.length
    const total = totalInSession
    const isVocab = currentCard.type === 'vocab'

    return (
      <div className="animate-slide-up space-y-4">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-gray-500 shrink-0">{progress}/{total}</span>
        </div>

        {/* Card type badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
            isVocab
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
          }`}>
            {isVocab ? <BookOpen size={12} /> : <MessageSquare size={12} />}
            {isVocab ? 'So\'z' : 'Jumla'}
          </span>
          <span className="text-[10px] text-gray-400">Day {currentCard.dayNumber}</span>
        </div>

        {/* Card — clickable to flip */}
        <div
          onClick={() => !flipped && setFlipped(true)}
          className={`relative w-full p-6 rounded-2xl border shadow-lg transition-all duration-500 min-h-[200px] flex flex-col items-center justify-center text-center cursor-pointer select-none ${
            flipped
              ? 'bg-white dark:bg-gray-800 border-primary-200 dark:border-primary-700 scale-[1.02]'
              : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-xl'
          }`}
        >
          {/* Front — O'zbekcha / prompt */}
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
            {flipped ? 'Javob' : 'Esingizdami?'}
          </p>
          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed mb-4">
            {currentCard.front}
          </p>

          {/* Back — revealed only when flipped */}
          {flipped && (
            <div className="mt-2 pt-4 border-t border-gray-100 dark:border-gray-700 w-full animate-fade-in">
              <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mb-2 uppercase tracking-wider">
                To'g'ri javob:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentCard.back}
              </p>
            </div>
          )}

          {!flipped && (
            <div className="mt-4 animate-bounce">
              <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <span>Javobni ko'rsatish uchun bosing</span>
              </p>
            </div>
          )}
        </div>

        {/* Topic */}
        <p className="text-xs text-gray-400 text-center">{currentCard.topicTitle}</p>

        {/* Rating buttons — only visible after flipping */}
        {flipped && (
          <div className="space-y-2 animate-slide-up">
            <p className="text-xs font-bold text-center text-gray-500 dark:text-gray-400">
              Qanchalik eslab qoldingiz?
            </p>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => { handleRate('bilmadim'); setFlipped(false) }}
                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 active:scale-95 transition-all"
              >
                <XCircle size={18} className="mx-auto mb-1" />
                <span className="text-[10px] font-bold block">Unutdim</span>
              </button>
              <button
                onClick={() => { handleRate('qiynaldim'); setFlipped(false) }}
                className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 active:scale-95 transition-all"
              >
                <Brain size={18} className="mx-auto mb-1" />
                <span className="text-[10px] font-bold block">Qiynaldim</span>
              </button>
              <button
                onClick={() => { handleRate('bildim'); setFlipped(false) }}
                className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-95 transition-all"
              >
                <RotateCw size={18} className="mx-auto mb-1" />
                <span className="text-[10px] font-bold block">Bildim</span>
              </button>
              <button
                onClick={() => { handleRate('yodladim'); setFlipped(false) }}
                className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 active:scale-95 transition-all"
              >
                <CheckCircle size={18} className="mx-auto mb-1" />
                <span className="text-[10px] font-bold block">Yodladim</span>
              </button>
            </div>
          </div>
        )}

        {/* Skip / end */}
        <button
          onClick={handleEndReview}
          className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline transition-colors"
        >
          Takrorlashni to'xtatish
        </button>
      </div>
    )
  }

  // ── Warm-up dashboard (before starting) ─────────────────────────────────
  return (
    <div className="animate-slide-up space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={20} />
          <h2 className="text-lg font-black">Warm-up</h2>
        </div>
        <p className="text-sm text-indigo-100">
          Kunning boshida o'tgan kunlardan SRS kartalarni takrorlang.
          Bu so'z va jumlalarni uzoq muddat eslab qolishingizga yordam beradi.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{stats.total}</p>
          <p className="text-[10px] text-gray-500 mt-1">Jami kartalar</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center">
          <p className={`text-2xl font-black ${dueCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {dueCount}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Bugun due</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-2xl font-black text-primary-600">{stats.reviewed}</p>
          <p className="text-[10px] text-gray-500 mt-1">Ko'rib chiqilgan</p>
        </div>
      </div>

      {/* Start button */}        <button
          onClick={handleStartReview}
          disabled={dueCount === 0}
        className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black text-lg overflow-hidden transition-all hover:shadow-xl hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Sparkles size={20} />
          {dueCount > 0
            ? `Takrorlashni boshlash (${dueCount} ta)`
            : 'Bugun barcha kartalar bajarildi ✅'}
          <ChevronRight size={18} className="text-white/70" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>

      {/* Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-100 dark:border-amber-800/30">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-1">
          <BarChart3 size={12} /> SRS tizimi
        </p>
        <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
          Karta qanchalik yaxshi eslab qolingan bo'lsa, shunchalik kechroq qayta ko'rsatiladi. 
          "Unutdim" — ertaga, "Yodladim" — 6 kundan keyin. Bu interval unutish egri chizig'iga 
          qarshi optimal hisoblanadi.
        </p>
      </div>
    </div>
  )
}
