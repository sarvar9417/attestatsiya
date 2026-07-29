import { Check, Sparkles, ChevronRight } from 'lucide-react'

interface LevelExplainerProps {
  currentLevel: string
  onNext: () => void
}

const LEVELS = [
  {
    id: 'A1',
    emoji: '🌱',
    label: 'A1 — Boshlang\'ich',
    color: 'from-gray-400 to-gray-500',
    skills: [
      'Oddiy so\'z va iboralarni tushunish',
      'O\'zini tanishtirish va asosiy ma\'lumot berish',
      'Oddiy savollarga javob berish',
      'Kundalik predmetlar haqida gapirish',
    ],
    examples: ['I am a student.', 'This is a book.', 'How are you?'],
  },
  {
    id: 'A2',
    emoji: '🌿',
    label: 'A2 — Asosiy',
    color: 'from-blue-400 to-blue-500',
    skills: [
      'Oilasi, ishi, xaridlari haqida gapirish',
      'Oddiy gaplar va tez-tez ishlatiladigan iboralar',
      'Qobiliyat haqida gapirish (I can speak)',
      'O\'tgan zamon — kecha nima qilganingiz',
    ],
    examples: ['I live in Tashkent.', 'She works in a hospital.', 'I can swim.'],
  },
  {
    id: 'B1',
    emoji: '🌳',
    label: 'B1 — O\'rta',
    color: 'from-purple-400 to-purple-500',
    skills: [
      'Sayohat, ish, maktab haqida batafsil gapirish',
      'Fikr va rejalarni ifodalash',
      'Matn yozish va tushunish',
      'Vaqt va shart gaplari',
    ],
    examples: ['If I had time, I would travel.', 'He said he was tired.', 'What should we do today?'],
  },
  {
    id: 'B1+',
    emoji: '🌲',
    label: 'B1+ — Kuchli O\'rta',
    color: 'from-orange-400 to-orange-500',
    skills: [
      'Majmuali mavzularda fikr bildirish',
      'Professional yozishmalar',
      'Passiv va shart gaplari',
      'Murakkab grammatika konstruksiyalari',
    ],
    examples: ['The bridge was built in 2020.', 'Had I known, I would have helped.', 'I wish I could fly.'],
  },
  {
    id: 'B2',
    emoji: '🚀',
    label: 'B2 — Yuqori',
    color: 'from-red-400 to-red-500',
    skills: [
      'Akademik va professional muhokamalar',
      'Murakkab matnlarni tushunish va tahlil qilish',
      'Tabiiy va ravon gapirish',
      'IELTS / imtihon darajasi',
    ],
    examples: ['It is essential that everyone be on time.', 'Not until later did I realize.', 'Were it not for you...'],
  },
]

export function LevelExplainer({ currentLevel, onNext }: LevelExplainerProps) {
  const userLevelIdx = LEVELS.findIndex(l => l.id === currentLevel)

  return (
    <div className="w-full animate-slide-up">
      <div className="text-center mb-6">
        <span className="text-5xl block mb-3">
          {LEVELS.find(l => l.id === currentLevel)?.emoji ?? '🎯'}
        </span>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">
          Sizning darajangiz: <span className="text-primary-600">{currentLevel}</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Bu erda sizni nimalar kutayotganini ko'rib chiqing
        </p>
      </div>

      <div className="space-y-4 max-w-lg mx-auto">
        {LEVELS.map((level, idx) => {
          const isPast = idx < userLevelIdx
          const isCurrent = idx === userLevelIdx
          const isFuture = idx > userLevelIdx
          const isUnlocked = isPast || isCurrent

          return (
            <div
              key={level.id}
              className={`
                card relative overflow-hidden transition-all duration-300
                ${isCurrent
                  ? 'ring-2 ring-primary-400 ring-offset-2 dark:ring-offset-gray-900 scale-[1.02]'
                  : isFuture
                  ? 'opacity-60 hover:opacity-90'
                  : ''
                }
              `}
            >
              {/* Gradient accent bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${level.color}`}
              />

              <div className="pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{level.emoji}</span>
                    <span className={`font-bold text-sm ${
                      isCurrent
                        ? 'text-primary-600 dark:text-primary-400'
                        : isPast
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {level.label}
                    </span>
                  </div>
                  {isPast && (
                    <span className="text-green-500">
                      <Check size={18} />
                    </span>
                  )}
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                      <Sparkles size={10} /> Hozir shu yerda
                    </span>
                  )}
                  {isFuture && !isUnlocked && (
                    <span className="text-gray-300 dark:text-gray-600 text-xs font-medium">
                      Keladi
                    </span>
                  )}
                </div>

                {isUnlocked && (
                  <div className="mt-2 space-y-1.5">
                    {level.skills.map((skill, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check size={12} className={`mt-0.5 shrink-0 ${
                          isCurrent ? 'text-primary-500' : 'text-green-500'
                        }`} />
                        <span className={`text-xs ${
                          isCurrent
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {skill}
                        </span>
                      </div>
                    ))}

                    {level.examples.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {level.examples.map((ex, i) => (
                          <span
                            key={i}
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              isCurrent
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {isFuture && (
                  <div className="mt-2">
                    <div
                      className={`h-1.5 rounded-full w-full bg-gradient-to-r ${level.color} opacity-40`}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {level.skills.length} ta ko'nikma
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={onNext} className="btn-primary w-full mt-6 py-3 font-bold flex items-center justify-center gap-2">
        Keyingi — Interaktiv dars <ChevronRight size={16} />
      </button>
    </div>
  )
}
