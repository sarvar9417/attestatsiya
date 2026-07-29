import { useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { Flame, Zap, Target, Trophy, Star } from 'lucide-react'

const QUOTES = [
  { text: "Til o'rganish — bu marafon, tezlik emas. Harakatda qoling.", author: "Anonim" },
  { text: "Birinchi qadam eng qiyin. Lekin siz allaqachon boshlagansiz.", author: "Anonim" },
  { text: "Xatolar — o'rganishning eng yaxshi usuli. Qo'rqmang.", author: "Anonim" },
  { text: "Har bir yangi so'z — yangi dunno eshigi.", author: "Anonim" },
  { text: "Bugun bir narsa o'rgansangiz, ertaga o'zingizga minnatdor bo'lasiz.", author: "Anonim" },
  { text: "Mukammallik — bu har kuni biroz yaxshiroq bo'lish.", author: "Anonim" },
  { text: "Streak — bu odatning kuchi. Davom eting!", author: "Anonim" },
  { text: "Bilmagan narsangiz — o'sish imkoniyatingiz.", author: "Anonim" },
  { text: "Har bir mashaq — kelajakdagi suhbat uchun tayyorgarlik.", author: "Anonim" },
  { text: "Siz allaqachon 100% dan ko'proq harakat qildingiz. Davom eting!", author: "Anonim" },
  { text: "Kichik g'alabalar katta natijaga olib keladi.", author: "Anonim" },
  { text: "Bugun qilgan ishingiz — ertagi o'zingizga sovg'a.", author: "Anonim" },
]

function getQuoteOfTheDay(): { text: string; author: string } {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return QUOTES[dayOfYear % QUOTES.length]
}

function getGreeting(): { emoji: string; text: string; subtext: string } {
  const hour = new Date().getHours()
  if (hour < 6)  return { emoji: '🌙', text: 'Xayrli tun!', subtext: "Siz hali ham o'rganayapsiz — ajoyib!" }
  if (hour < 12) return { emoji: '☀️', text: 'Xayrli ertalab!', subtext: "Bugun yangi bilimlar kuni!" }
  if (hour < 18) return { emoji: '🌤️', text: 'Xayrli kun!', subtext: "O'rganishda davom eting!" }
  return { emoji: '🌙', text: 'Xayrli kech!', subtext: "Bugun nimani o'rgandingiz?" }
}

export default function MotivationalWidget() {
  const { streak, todayXP, totalXP, totalWordsLearned, todayChecklist } = useStore()

  const quote = useMemo(() => getQuoteOfTheDay(), [])
  const greeting = useMemo(() => getGreeting(), [])

  const checklistDone = Object.values(todayChecklist).filter(Boolean).length
  const checklistTotal = Object.keys(todayChecklist).length

  const level = Math.floor(totalXP / 500) + 1
  const xpInLevel = totalXP % 500
  const xpProgress = (xpInLevel / 500) * 100

  return (
    <div className="space-y-3">
      {/* Greeting + Quote */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-b1-700 p-4 sm:p-5 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{greeting.emoji}</span>
            <div>
              <h2 className="text-lg font-black">{greeting.text}</h2>
              <p className="text-white/70 text-xs">{greeting.subtext}</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="text-sm font-medium italic leading-relaxed">"{quote.text}"</p>
            <p className="text-xs text-white/50 mt-1">— {quote.author}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Streak */}
        <div className={`relative overflow-hidden rounded-xl p-3 text-center transition-all ${
          streak > 0
            ? 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200'
            : 'bg-gray-50 border border-gray-100'
        }`}>
          <Flame size={20} className={`mx-auto mb-1 ${streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
          <p className={`text-xl font-black ${streak > 0 ? 'text-orange-600' : 'text-gray-300'}`}>{streak}</p>
          <p className="text-[10px] text-gray-500 font-medium">Streak</p>
          {streak >= 7 && <span className="absolute top-1 right-1 text-[8px]">🔥</span>}
        </div>

        {/* Today XP */}
        <div className={`relative overflow-hidden rounded-xl p-3 text-center transition-all ${
          todayXP > 0
            ? 'bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200'
            : 'bg-gray-50 border border-gray-100'
        }`}>
          <Zap size={20} className={`mx-auto mb-1 ${todayXP > 0 ? 'text-violet-500' : 'text-gray-300'}`} />
          <p className={`text-xl font-black ${todayXP > 0 ? 'text-violet-600' : 'text-gray-300'}`}>{todayXP}</p>
          <p className="text-[10px] text-gray-500 font-medium">XP today</p>
          {todayXP >= 100 && <span className="absolute top-1 right-1 text-[8px]">⚡</span>}
        </div>

        {/* Words */}
        <div className={`relative overflow-hidden rounded-xl p-3 text-center transition-all ${
          totalWordsLearned > 0
            ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'
            : 'bg-gray-50 border border-gray-100'
        }`}>
          <BookOpen size={20} className={`mx-auto mb-1 ${totalWordsLearned > 0 ? 'text-emerald-500' : 'text-gray-300'}`} />
          <p className={`text-xl font-black ${totalWordsLearned > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>{totalWordsLearned}</p>
          <p className="text-[10px] text-gray-500 font-medium">So'zlar</p>
          {totalWordsLearned >= 100 && <span className="absolute top-1 right-1 text-[8px]">📚</span>}
        </div>
      </div>

      {/* Level Progress */}
      <div className="rounded-xl bg-white border border-gray-100 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Star size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Level {level}</p>
              <p className="text-[10px] text-gray-400">{xpInLevel}/500 XP</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
            {Math.round(xpProgress)}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-b1-500 transition-all duration-700"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      {/* Daily Goal */}
      <div className="rounded-xl bg-white border border-gray-100 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-b1-500" />
            <p className="text-xs font-bold text-gray-900">Bugungi maqsad</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            checklistDone === checklistTotal
              ? 'bg-emerald-50 text-emerald-600'
              : checklistDone > 0
                ? 'bg-amber-50 text-amber-600'
                : 'bg-gray-50 text-gray-400'
          }`}>
            {checklistDone}/{checklistTotal}
          </span>
        </div>
        <div className="flex gap-1">
          {Object.entries(todayChecklist).map(([key, done]) => (
            <div
              key={key}
              className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                done ? 'bg-gradient-to-r from-primary-500 to-b1-500' : 'bg-gray-100'
              }`}
            />
          ))}
        </div>
        {checklistDone === checklistTotal && checklistTotal > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <Trophy size={12} />
            <span>Barcha maqsadlar bajarildi! Ajoyib!</span>
          </div>
        )}
      </div>
    </div>
  )
}

function BookOpen(props: { size: number; className?: string }) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
