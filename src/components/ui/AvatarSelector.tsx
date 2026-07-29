import { useMemo } from 'react'
import { Lock, Sparkles, Crown } from 'lucide-react'

export interface AvatarDef {
  id: string
  emoji: string
  label: string
  personality: string
  trait: string
  achievementHint?: string
  unlockRequirement?: string
  isSpecial?: boolean
}

const AVATARS: AvatarDef[] = [
  // ─── Oddiy (barcha ochiq) ────────────────────────────────────────────
  {
    id: 'scholar',
    emoji: '👨‍🎓',
    label: 'Talaba',
    personality: 'Intizomli va maqsadli',
    trait: 'Har kuni 14 soat o\'qish — siz uchun odatiy hol',
  },
  {
    id: 'explorer',
    emoji: '🧭',
    label: 'Tadqiqotchi',
    personality: 'Qiziquvchan va jasur',
    trait: 'Har bir yangi mavzuni kashf qilishdan zavqlanasiz',
  },
  {
    id: 'professional',
    emoji: '💼',
    label: 'Professional',
    personality: 'Ishbilarmon va samarali',
    trait: 'Ingliz tili — sizning karyerangizdagi navbatdagi pog\'ona',
  },
  {
    id: 'creative',
    emoji: '🎨',
    label: 'Ijodkor',
    personality: 'Ijodiy va erkin',
    trait: 'Tilni san\'at sifatida o\'rganasiz — she\'rlar, qo\'shiqlar, filmlar orqali',
  },
  {
    id: 'traveler',
    emoji: '✈️',
    label: 'Sayohatchi',
    personality: 'Sarguzasht va kashfiyot',
    trait: 'Dunyo bo\'ylab sayohat qilish — ingliz tili bilan chegaralar yo\'q',
  },
  {
    id: 'dreamer',
    emoji: '🌙',
    label: 'Orzular',
    personality: 'Xayolparast va ilhomli',
    trait: 'Katta maqsadlar sari intilish — birinchi qadam bugun',
  },
  {
    id: 'warrior',
    emoji: '⚔️',
    label: 'Jangchi',
    personality: 'Qat\'iy va jasur',
    trait: 'Har bir qiyinchilik — sizni kuchliroq qiladi',
  },
  {
    id: 'wise',
    emoji: '🦉',
    label: 'Donishmand',
    personality: 'Donishmand va sabrli',
    trait: 'Bilim — eng katta boylik. Har bir dars — yangi kashfiyot',
  },

  // ─── Maxsus (achievement ochiladi) ──────────────────────────────────
  {
    id: 'champion',
    emoji: '🏆',
    label: 'Chempion',
    personality: 'G\'olib va kuchli',
    trait: 'B2 darajasiga yetish — sizning asosiy maqsadingiz',
    isSpecial: true,
    achievementHint: '🏆 5000+ XP — haqiqiy chempionlar uchun',
  },
  {
    id: 'captain',
    emoji: '👑',
    label: 'Kapitan',
    personality: 'Rahbar va ilhom',
    trait: 'O\'z yo\'lingizni toping va boshqalarga ham yo\'l ko\'rsating',
    isSpecial: true,
    achievementHint: '👑 30 kunlik streak — yetakchilik sizning tabiatingiz',
  },
  {
    id: 'polyglot',
    emoji: '🧠',
    label: 'Poliglot',
    personality: "So'z ustasi va bilimdon",
    trait: "Har bir yangi so'z — yangi olam. 1000+ so'z — bu faqat boshlanish",
    isSpecial: true,
    achievementHint: "🧠 1000+ so'z o'rganing — lug'atingiz kengayadi",
  },
  {
    id: 'genius',
    emoji: '🌟',
    label: 'Daho',
    personality: 'Ajoyib va yorqin',
    trait: '10000 XP — bu tasodif emas. Bu sizning mehnatingiz va iste\'dodingiz',
    isSpecial: true,
    achievementHint: '🌟 10000+ XP to\'plang — haqiqiy daho',
  },
  {
    id: 'master',
    emoji: '🎓',
    label: 'Usta',
    personality: 'Tajribali va yetuk',
    trait: "Kursni deyarli tugatdingiz — 126 kun sabr va intizom. Siz haqiqiy ustasiz",
    isSpecial: true,
    achievementHint: '🎓 126-kunga yeting — kurs bitiruvchisi bo\'ling',
  },
  {
    id: 'legacy',
    emoji: '💎',
    label: 'Afsona',
    personality: 'Mislsiz va abadiy',
    trait: "90 kunlik streak — bu nafaqat odat, bu hayot tarzi. Siz afsonasiz",
    isSpecial: true,
    achievementHint: '💎 90 kun streak — EnglishPath afsonasi bo\'ling',
  },
  {
    id: 'reader',
    emoji: '📖',
    label: 'Mutoliachi',
    personality: 'Bilimga chanqoq',
    trait: "Har bir matn — yangi kashfiyot. 50+ kun o'qish — bilim siz bilan",
    isSpecial: true,
    achievementHint: '📖 50-kunga yeting — barqaror o\'quvchi bo\'ling',
  },
]

export function AvatarSelector({
  current,
  onChange,
  userXP,
  userStreak,
  userWords,
  userDay,
}: {
  current: string
  onChange: (id: string) => void
  userXP?: number
  userStreak?: number
  userWords?: number
  userDay?: number
}) {
  const canUnlock = useMemo(() => {
    return (id: string): boolean => {
      switch (id) {
        case 'champion':  return (userXP ?? 0) >= 5000
        case 'captain':   return (userStreak ?? 0) >= 30
        case 'polyglot':  return (userWords ?? 0) >= 1000
        case 'genius':    return (userXP ?? 0) >= 10000
        case 'master':    return (userDay ?? 0) >= 90
        case 'legacy':    return (userStreak ?? 0) >= 90
        case 'reader':    return (userDay ?? 0) >= 50
        default:          return true
      }
    }
  }, [userXP, userStreak, userWords, userDay])

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <Sparkles size={14} className="text-yellow-500" />
        Personajingizni tanlang
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        Har bir personaj o'ziga xos xarakterga ega. Ba'zilari maxsus yutuqlar bilan ochiladi!
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {AVATARS.map(av => {
          const selected = current === av.id
          const unlocked = canUnlock(av.id)

          return (
            <button
              key={av.id}
              onClick={() => unlocked && onChange(av.id)}
              disabled={!unlocked}
              aria-label={`${av.emoji} ${av.label} — ${av.personality}${!unlocked ? ` (locked: ${av.achievementHint})` : ''}`}
              aria-pressed={selected}
              className={`
                group relative flex flex-col items-center gap-2 p-4 rounded-xl border-2
                transition-all duration-300
                ${selected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md scale-105'
                  : unlocked
                  ? 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm hover:-translate-y-0.5'
                  : 'border-gray-100 dark:border-gray-800 opacity-60 cursor-not-allowed'
                }
                ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
            >
              {/* Special badge */}
              {av.isSpecial && unlocked && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <Crown size={10} className="text-white" />
                  </div>
                </div>
              )}

              {/* Lock overlay */}
              {!unlocked && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-xl flex items-center justify-center z-20">
                  <div className="flex flex-col items-center gap-1">
                    <Lock size={18} className="text-gray-400" />
                    <span className="text-[8px] text-gray-400 font-medium px-1 text-center leading-tight">
                      {av.achievementHint}
                    </span>
                  </div>
                </div>
              )}

              <span className={`text-3xl transition-transform duration-300 ${selected ? 'scale-110' : ''}`}>
                {av.emoji}
              </span>

              <div className="text-center">
                <span className={`text-xs font-bold block ${
                  selected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {av.label}
                </span>
                <span className={`text-xs font-medium block mt-0.5 ${
                  selected ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {av.personality}
                </span>
              </div>

              {/* Trait tooltip on hover */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100
                pointer-events-none transition-opacity duration-200 z-30 w-48 bg-gray-900 text-white text-xs
                rounded-lg p-2 shadow-lg text-center hidden sm:block">
                {av.trait}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { AVATARS }
