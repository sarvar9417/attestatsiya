import { ChevronRight, Volume2 } from 'lucide-react'
import type { GamePhrase } from '../../store/phrasesStore'
import { getCategoryStyle } from '../../utils/phraseConfig'
import { speak } from '../../lib/tts'

const BOX_COLORS: Record<number, string> = {
  1: 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
  2: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700',
  3: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700',
  4: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700',
  5: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700',
  6: 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
}

const BOX_LABELS: Record<number, string> = {
  1: '1 kun',
  2: '3 kun',
  3: '7 kun',
  4: '14 kun',
  5: '30 kun',
  6: '90 kun',
}

const LEVEL_BADGES: Record<string, string> = {
  A1: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  A2: 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300',
  B1: 'bg-b1-100 dark:bg-b1-900/40 text-b1-700 dark:text-b1-300',
  B2: 'bg-b2-100 dark:bg-b2-900/40 text-b2-700 dark:text-b2-300',
}

export default function PhraseFlashCard({
  phrase,
  flipped,
  onFlip,
}: {
  phrase: GamePhrase
  flipped: boolean
  onFlip: () => void
}) {
  const cat = getCategoryStyle(phrase.category)

  function speakPhrase(e: React.MouseEvent) {
    e.stopPropagation()
    speak(phrase.english, { rate: 0.9 }).catch(() => {})
  }

  return (
    <div className="w-full cursor-pointer select-none">
      <div className="relative w-full min-h-[260px] sm:min-h-[280px]">
        {/* Front — inglizcha */}
        <div
          className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 ${
            flipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${BOX_COLORS[phrase.box] || BOX_COLORS[1]} flex flex-col items-center justify-center p-6 sm:p-8`}
        >
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${LEVEL_BADGES[phrase.level] || LEVEL_BADGES.A1}`}>
            {phrase.level}
          </span>
          <div className="flex items-center justify-center gap-2 mb-2">
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 text-center leading-relaxed">
              {phrase.english}
            </p>
            <button
              onClick={speakPhrase}
              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-b1-600 dark:hover:text-b1-400 transition-colors flex-shrink-0"
              title="Talaffuz"
            >
              <Volume2 size={18} />
            </button>
          </div>
          {phrase.is_new && (
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/40 px-2 py-0.5 rounded-full">
              Yangi
            </span>
          )}
          <div className="flex items-center gap-1.5 mt-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`w-2 h-2 rounded-full ${
                  n <= phrase.box
                    ? phrase.box >= 6 ? 'bg-orange-500'
                    : phrase.box >= 5 ? 'bg-yellow-500'
                    : phrase.box >= 4 ? 'bg-purple-500'
                    : phrase.box >= 3 ? 'bg-blue-500'
                    : phrase.box >= 2 ? 'bg-green-500'
                    : 'bg-gray-400'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
              Box {phrase.box}/6 · {BOX_LABELS[phrase.box] ?? '90 kun'}
            </span>
          </div>
          {!flipped && (
            <button
              onClick={(e) => { e.stopPropagation(); onFlip() }}
              className="btn-primary mt-6 text-sm flex items-center gap-2"
            >
              Ko'rish <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Back — o'zbekcha */}
        <div
          className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 ${
            flipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } border-b1-200 dark:border-b1-700 bg-b1-50 dark:bg-b1-900/20 flex flex-col p-6`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${LEVEL_BADGES[phrase.level] || LEVEL_BADGES.A1}`}>
                {phrase.level}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                {cat.label}
              </span>
            </div>
            {phrase.is_new && (
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/40 px-2 py-0.5 rounded-full">
                Yangi
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-0.5 leading-relaxed">
            {phrase.english}
          </p>
          <div className="bg-white dark:bg-gray-800/60 rounded-xl px-4 py-3 mt-2">
            <p className="text-base font-semibold text-b1-700 dark:text-b1-300 leading-relaxed">
              {phrase.uzbek}
            </p>
          </div>
          <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            {phrase.is_learned ? (
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">⭐ Yodlagan</span>
            ) : (
              <span>Box {phrase.box}/6</span>
            )}
            <span>✅ {phrase.correct_count} | ❌ {phrase.wrong_count}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
