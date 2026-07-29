import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Mic, Flame, Sparkles, Zap, Loader2 } from 'lucide-react'
import { TOTAL_CHALLENGE_DAYS, getChallengeDay, getStaticDay } from '../data/30dayChallenge'
import type { ChallengeDay } from '../data/30dayChallenge/types'


// Components
import DaySelector from '../components/30dayChallenge/DaySelector'
import ChallengeHeader from '../components/30dayChallenge/ChallengeHeader'
import VideoPlayer from '../components/30dayChallenge/VideoPlayer'
import HighlightsSection from '../components/30dayChallenge/HighlightsSection'
import VocabularySection from '../components/30dayChallenge/VocabularySection'
import SentenceBankSection from '../components/30dayChallenge/SentenceBankSection'
import QuizSection from '../components/30dayChallenge/QuizSection'
import ReviewSection from '../components/30dayChallenge/ReviewSection'
import AiConversationSection from '../components/30dayChallenge/AiConversationSection'
import RoleplayGame from '../components/30dayChallenge/RoleplayGame'
import WarmUpSection from '../components/30dayChallenge/WarmUpSection'
import WorkbookSection from '../components/30dayChallenge/WorkbookSection'

// ── Progress type ──────────────────────────────────────────────────────────

interface ChallengeProgress {
  completedDays: number[]
  currentDay: number
  dayScores: Record<number, { quizScore: number; exercisesDone: number[]; xpEarned: number }>
  totalXp: number
}

const STORAGE_KEY = '30dayChallenge_progress'

function loadProgress(): ChallengeProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { completedDays: [], currentDay: 1, dayScores: {}, totalXp: 0 }
}

function saveProgress(p: ChallengeProgress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)) } catch {}
}

// ── Tabs ────────────────────────────────────────────────────────────────────

type Tab = 'warmup' | 'video' | 'highlights' | 'vocabulary' | 'sentences' | 'roleplay-game' | 'quiz' | 'review' | 'ai-chat' | 'workbook'

const TABS: { key: Tab; icon: string; label: string; color: string }[] = [
  { key: 'warmup',     icon: '🧠', label: 'Warm-up',   color: 'from-indigo-500 to-purple-600' },
  { key: 'video',      icon: '📺', label: 'Video',     color: 'from-red-500 to-orange-500' },
  { key: 'highlights', icon: '💡', label: 'Bo\'limlar', color: 'from-amber-500 to-yellow-500' },
  { key: 'vocabulary', icon: '📚', label: 'Lug\'at',   color: 'from-emerald-500 to-teal-500' },
  { key: 'sentences',  icon: '💬', label: 'Jumlalar',  color: 'from-violet-500 to-purple-500' },
  { key: 'roleplay-game',  icon: '🎭', label: 'Role-play',    color: 'from-purple-500 to-fuchsia-500' },
  { key: 'quiz',           icon: '📝', label: 'Test',          color: 'from-pink-500 to-rose-500' },
  { key: 'ai-chat',    icon: '🤖', label: 'AI Chat',   color: 'from-purple-500 to-fuchsia-500' },
  { key: 'review',     icon: '📋', label: 'Yakun',     color: 'from-green-500 to-emerald-500' },
  { key: 'workbook',   icon: '📖', label: 'Daftar',    color: 'from-orange-500 to-amber-500' },
]

// ── Page ────────────────────────────────────────────────────────────────────

export default function ThirtyDayChallenge() {
  const navigate = useNavigate()

  const [progress, setProgress] = useState<ChallengeProgress>(loadProgress)
  const [currentDay, setCurrentDay] = useState(progress.currentDay)
  const [activeTab, setActiveTab] = useState<Tab>('video')
  const [quizScore, setQuizScore] = useState(0)
  const [animatingTab, setAnimatingTab] = useState<Tab | null>(null)
  const [pageEntered, setPageEntered] = useState(false)
  const [day, setDay] = useState<ChallengeDay | null>(null)
  const [dayLoading, setDayLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const completedCount = progress.completedDays.length
  const isCompleted = day ? progress.completedDays.includes(day.day) : false

  // Async day loader: tries Supabase first, falls back to static
  useEffect(() => {
    let cancelled = false
    setDayLoading(true)

    // Show static day immediately — no flash of 'not ready'
    const staticDay = getStaticDay(currentDay)
    if (staticDay) {
      setDay(staticDay)
    } else {
      setDay(null)
    }

    // Then try Supabase (with error handling)
    getChallengeDay(currentDay).then(d => {
      if (cancelled) return
      if (d) setDay(d)
    }).catch(() => {}).finally(() => {
      if (!cancelled) setDayLoading(false)
    })

    return () => { cancelled = true }
  }, [currentDay])

  // Page enter animation
  useEffect(() => {
    requestAnimationFrame(() => setPageEntered(true))
  }, [])

  // Progressni saqlash
  useEffect(() => {
    saveProgress({ ...progress, currentDay })
  }, [progress, currentDay])

  // Tab change animation
  const switchTab = useCallback((tab: Tab) => {
    if (tab === activeTab) return
    setAnimatingTab(activeTab)
    setTimeout(() => {
      setActiveTab(tab)
      setAnimatingTab(null)
    }, 150)
  }, [activeTab])

  const goToDay = useCallback((n: number) => {
    if (n < 1 || n > TOTAL_CHALLENGE_DAYS) return
    setCurrentDay(n)
    setActiveTab('video')
    setQuizScore(0)
    setDayLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const completeDay = useCallback(() => {
    if (isCompleted) return
    setProgress(prev => {
      const dayScore = {
        quizScore,
        exercisesDone: [],
        xpEarned: Math.max(10, quizScore),
      }
      return {
        ...prev,
        completedDays: [...new Set([...prev.completedDays, currentDay])],
        dayScores: { ...prev.dayScores, [currentDay]: dayScore },
        totalXp: prev.totalXp + dayScore.xpEarned,
      }
    })
  }, [currentDay, isCompleted, quizScore])

  const handleQuizComplete = useCallback((score: number) => {
    setQuizScore(score)
  }, [])



  // ── Render ──────────────────────────────────────────────────────────────

  // Kun hali tayyor bo'lmasa (yoki yuklanayotgan bo'lsa)
  // day.day !== currentDay = eski day kontenti ko'rinmasligi uchun
  const dayReady = day && day.day === currentDay
  if (!dayReady) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-black text-gray-900 dark:text-gray-100">30-Day Speaking Challenge</h1>
        </div>
        <DaySelector
          currentDay={currentDay}
          totalDays={TOTAL_CHALLENGE_DAYS}
          completedDays={progress.completedDays}
          onSelect={goToDay}
        />

        {dayLoading ? (
          <div className="text-center py-20 animate-fade-in">
            <Loader2 size={40} className="animate-spin text-primary-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Kun ma'lumotlari yuklanmoqda...</p>
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">📅</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Kun {currentDay} hali tayyor emas
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Bu kun uchun kontent tayyorlanmoqda. Tez orada qo'shiladi! 🚀
            </p>
            <button
              onClick={() => goToDay(currentDay - 1)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold hover:from-primary-700 hover:to-primary-800 transition-all hover:shadow-lg active:scale-95"
            >
              ← Oldingi kunga qaytish
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`max-w-4xl mx-auto p-4 space-y-4 mobile-safe-bottom transition-opacity duration-300 ${pageEntered ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 -mx-4 -mt-4 px-4 pt-4 pb-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                <Mic size={14} />
              </span>
              <span className="truncate">30-Day Challenge</span>
            </h1>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <Flame size={14} className="text-orange-500" />
              <span className="font-bold text-orange-600 dark:text-orange-400">{progress.totalXp}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
              <Trophy size={14} className="text-primary-600" />
              <span className="font-bold text-primary-700 dark:text-primary-300">{completedCount}/{TOTAL_CHALLENGE_DAYS}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Day Selector ────────────────────────────────────────────────── */}
      <div className={`transition-all duration-500 delay-100 ${pageEntered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <DaySelector
          currentDay={currentDay}
          totalDays={TOTAL_CHALLENGE_DAYS}
          completedDays={progress.completedDays}
          onSelect={goToDay}
        />
      </div>

      {/* ── Challenge Header ────────────────────────────────────────────── */}
      <div className={`transition-all duration-500 delay-150 ${pageEntered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <ChallengeHeader
          day={day}
          isCompleted={isCompleted}
          completedCount={completedCount}
          totalDays={TOTAL_CHALLENGE_DAYS}
        />
      </div>

      {/* ── Tab Navigation ──────────────────────────────────────────────── */}
      <div className={`transition-all duration-500 delay-200 ${pageEntered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="relative flex gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800/80 overflow-x-auto scrollbar-thin">
          {TABS.map(tab => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => switchTab(tab.key)}
                className={`
                  relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0
                  ${isActive
                    ? 'text-white shadow-lg scale-105'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                {isActive && (
                  <span
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.color} animate-gradientMove`}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <div
        className={`transition-all duration-300 ease-out ${animatingTab ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        {activeTab === 'warmup' && (
          <div className="animate-slide-up">
            <WarmUpSection day={day} onComplete={() => switchTab('video')} />
          </div>
        )}

        {activeTab === 'video' && day.video && (
          <div className="animate-slide-up">
            <VideoPlayer youtubeId={day.video.youtubeId} title={day.title} />
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="animate-slide-up">
            <HighlightsSection highlights={day.highlights} />
          </div>
        )}

        {activeTab === 'vocabulary' && (
          <div className="animate-slide-up">
            <VocabularySection vocabulary={day.vocabulary} />
          </div>
        )}

        {activeTab === 'sentences' && (
          <div className="animate-slide-up">
            <SentenceBankSection sentenceBank={day.sentenceBank} structuredTranscript={day.structuredTranscript} highlights={day.highlights} level={day.level} />
          </div>
        )}

        {activeTab === 'roleplay-game' && (
          <div className="animate-slide-up">
            <RoleplayGame day={day} />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="animate-slide-up">
            <QuizSection quiz={day.quiz} onComplete={handleQuizComplete} />
          </div>
        )}

        {activeTab === 'ai-chat' && (
          <div className="animate-slide-up">
            <AiConversationSection day={day} />
          </div>
        )}

        {activeTab === 'review' && (
          <div className="animate-slide-up">
            <ReviewSection review={day.review} />
          </div>
        )}

        {activeTab === 'workbook' && day.workbook && (
          <div className="animate-slide-up">
            <WorkbookSection workbook={day.workbook} />
          </div>
        )}
      </div>

      {/* ── Complete Day Button ──────────────────────────────────────────── */}
      <div className={`transition-all duration-500 delay-500 ${pageEntered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        {!isCompleted && (
          <button
            onClick={completeDay}
            className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black text-lg overflow-hidden transition-all hover:shadow-xl hover:from-primary-700 hover:to-primary-800 active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles size={20} />
              Kunni yakunlash
              <Zap size={18} className="text-yellow-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        )}

        {isCompleted && (
          <div className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-400/90 to-emerald-500/90 dark:from-green-600/30 dark:to-emerald-700/30 text-green-700 dark:text-green-300 font-bold text-center backdrop-blur-sm border border-green-300 dark:border-green-700">
            ✅ Kun bajarildi! <span className="text-yellow-500">⭐</span> XP: {progress.dayScores[currentDay]?.xpEarned ?? 0}
          </div>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <div className={`flex justify-between gap-3 transition-all duration-500 delay-500 ${pageEntered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <button
          onClick={() => goToDay(currentDay - 1)}
          disabled={currentDay <= 1}
          className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 font-bold text-sm disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 disabled:active:scale-100"
        >
          <span className="flex items-center justify-center gap-1">
            ← Kun {currentDay - 1}
          </span>
        </button>
        <button
          onClick={() => goToDay(currentDay + 1)}
          disabled={currentDay >= TOTAL_CHALLENGE_DAYS}
          className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 font-bold text-sm disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 disabled:active:scale-100"
        >
          <span className="flex items-center justify-center gap-1">
            Kun {currentDay + 1} →
          </span>
        </button>
      </div>
    </div>
  )
}
