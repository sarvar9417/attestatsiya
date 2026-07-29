import { useMemo } from 'react'
import type { PersonalWord, PersonalVocabSession } from '../../types/personalVocabulary'
import { getTodayTashkent } from '../../utils/tashkentDate'
import { Zap, Trophy, BookOpen, PlayCircle, ListChecks, Sparkles, Target, TrendingUp } from 'lucide-react'

interface ReviewDashboardProps {
  words: PersonalWord[]
  onStartFlashcard: () => void
  onStartQuickReview: () => void
  onStartMultipleChoice: () => void
  onStartTyping: () => void
  sessions?: PersonalVocabSession[]
}

function getDaysAgo(dateStr: string): number {
  const today = new Date(getTodayTashkent())
  const date = new Date(dateStr)
  const diffTime = today.getTime() - date.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function ReviewDashboard({
  words, onStartFlashcard, onStartQuickReview,
  onStartMultipleChoice, onStartTyping, sessions = [],
}: ReviewDashboardProps) {
  const today = getTodayTashkent()

  const stats = useMemo(() => {
    const total = words.length
    const learned = words.filter(w => w.is_learned).length
    const due = words.filter(w => !w.is_learned && w.next_review <= today).length
    const overdue = words.filter(w => !w.is_learned && getDaysAgo(w.next_review) > 2).length
    const newWords = words.filter(w => w.box <= 1 && !w.is_learned).length
    const mastered = words.filter(w => w.box >= 6 && w.is_learned).length
    const needsReview = words.filter(w => !w.is_learned && w.wrong_count > w.correct_count && w.correct_count + w.wrong_count >= 3).length
    const weeklyReviewed = new Set(sessions.map(session => session.vocab_id)).size
    
    const avgAccuracy = words.reduce((sum, w) => {
      const total = w.correct_count + w.wrong_count
      return total > 0 ? sum + (w.correct_count / total) * 100 : sum
    }, 0) / Math.max(words.filter(w => w.correct_count + w.wrong_count > 0).length, 1)

    return { total, learned, due, overdue, newWords, mastered, needsReview, weeklyReviewed, avgAccuracy }
  }, [words, today, sessions])

  if (stats.total === 0) {
    return null
  }

  const MODES = [
    {
      id: 'flashcard',
      label: 'Flash Card',
      desc: 'Klasik kartochka usuli',
      icon: <BookOpen size={20} />,
      color: 'from-primary-500 to-primary-600',
      shadow: 'shadow-primary-500/20',
      action: onStartFlashcard,
      badge: stats.due > 0 ? `${stats.due} ta` : undefined,
    },
    {
      id: 'quick',
      label: 'Tezkor takrorlash',
      desc: 'Eng tezkor usul — bir tugma',
      icon: <Zap size={20} />,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
      action: onStartQuickReview,
      badge: stats.due > 0 ? `${stats.due} ta` : undefined,
    },
    {
      id: 'quiz',
      label: 'Test (4 variant)',
      desc: 'Variantlar bilan past bosim',
      icon: <ListChecks size={20} />,
      color: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/20',
      action: onStartMultipleChoice,
      badge: stats.total > 0 ? `${Math.min(20, stats.total)} ta` : undefined,
      disabled: stats.total < 2,
    },
    {
      id: 'typing',
      label: 'Yozish amaliyoti',
      desc: 'Javobni yozib o\'rganing',
      icon: <Sparkles size={20} />,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      action: onStartTyping,
      badge: stats.total > 0 ? `${Math.min(20, stats.total)} ta` : undefined,
      disabled: false,
    },
  ]

  return (
    <div className="space-y-5">
      {/* Today's Focus Banner */}
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800/30 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} className="text-primary-500" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Bugungi diqqat markazi</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Due Words - Most Important */}
          <div className={`rounded-xl p-3 text-center border transition-all ${
            stats.due > 0
              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          }`}>
            <div className={`text-2xl font-bold ${stats.due > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
              {stats.due}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">
              {stats.due > 0 ? 'Takrorlash vaqti' : 'Barcha tugallangan'}
            </div>
            {stats.overdue > 0 && (
              <div className="text-[10px] text-red-500 font-medium mt-1">
                ({stats.overdue} ta muddati o'tgan)
              </div>
            )}
          </div>

          {/* New Words */}
          <div className="rounded-xl p-3 text-center border border-blue-100 dark:border-blue-800/30 bg-blue-50 dark:bg-blue-900/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.newWords}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">Yangi so'zlar</div>
          </div>

          {/* Need Review */}
          <div className={`rounded-xl p-3 text-center border ${
            stats.needsReview > 0
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/30'
          }`}>
            <div className={`text-2xl font-bold ${stats.needsReview > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
              {stats.needsReview}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">Xato ko'p so'zlar</div>
          </div>

          {/* Weekly Review Streak */}
          <div className="rounded-xl p-3 text-center border border-primary-100 dark:border-primary-800/30 bg-primary-50 dark:bg-primary-900/20">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.weeklyReviewed}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">Bu hafta takrorlangan</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      {stats.total > 0 && (
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <TrendingUp size={13} />
              <span>O'zlashtirish darajasi</span>
            </div>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
              {stats.learned}/{stats.total} ({Math.round((stats.learned / stats.total) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-700"
              style={{ width: `${(stats.learned / stats.total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <Zap size={10} /> {stats.mastered} o'zlashtirilgan
            </div>
            <div className="flex items-center gap-1">
              <Trophy size={10} /> {Math.round(stats.avgAccuracy)}% o'rtacha aniqlik
            </div>
          </div>
        </div>
      )}

      {/* Practice Modes */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <PlayCircle size={14} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amaliyot rejimlari</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODES.map(mode => (
            <button
              key={mode.id}
              onClick={mode.action}
              disabled={mode.disabled}
              title={mode.disabled ? "Test uchun kamida 2 ta turli so'z kerak" : undefined}
              className="group relative flex items-start gap-4 bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-white shadow-lg ${mode.shadow} group-hover:scale-105 transition-transform`}>
                {mode.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {mode.label}
                  </span>
                  {mode.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                      {mode.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{mode.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      {stats.needsReview > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50">
          <div className="flex items-start gap-3">
            <Target size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {stats.needsReview} ta so'zda xatolik ko'p
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                Bu so'zlar sizga qiyinlik qilyapti. Tezkor takrorlash rejimida ularni bir necha marta takrorlab, mustahkamlang.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
