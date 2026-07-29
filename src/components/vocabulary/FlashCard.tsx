import { ChevronRight } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { GameWord } from '../../store/vocabularyStore'
import { useSwipe } from '../../hooks/useSwipe'
import { AudioButton } from '../ui/AudioButton'

const BOX_COLORS: Record<number, string> = {
  1: 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
  2: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700',
  3: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700',
  4: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700',
  5: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700',
  6: 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
}

const SRS_INTERVALS = [1, 3, 7, 14, 30, 90]

const LEVEL_BADGES: Record<string, string> = {
  A1: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  A2: 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300',
  B1: 'bg-b1-100 dark:bg-b1-900/40 text-b1-700 dark:text-b1-300',
  B2: 'bg-b2-100 dark:bg-b2-900/40 text-b2-700 dark:text-b2-300',
}

export default function FlashCard({
  word,
  flipped,
  onFlip,
  onSwipeLeft,
  onSwipeRight,
}: {
  word: GameWord
  flipped: boolean
  onFlip: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}) {
  const { t } = useI18n()
  const [, { offsetX, isDragging }] = useSwipe({
    onSwipeLeft: onSwipeLeft,
    onSwipeRight: onSwipeRight,
    onTap: () => { if (!flipped) onFlip() },
  })

  return (
    <div
      className="w-full cursor-pointer select-none touch-pan-y"
    >
        <div
          className="relative w-full min-h-[260px] sm:min-h-[280px]"
          role="region"
          aria-label={`Flash card: ${word.english}`}
          aria-roledescription="flash card"
        style={{
          transform: isDragging ? `translateX(${offsetX}px) rotate(${offsetX * 0.03}deg)` : '',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 ${
            flipped ? 'opacity-0 pointer-events-none rotate-y-180' : 'opacity-100'
          } ${BOX_COLORS[word.box] || BOX_COLORS[1]} flex flex-col items-center justify-center p-6 sm:p-8`}
        >
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${LEVEL_BADGES[word.level] || LEVEL_BADGES.A1}`}>
            {word.level}
          </span>
          <div className="flex items-center justify-center gap-2 mb-2">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center leading-relaxed">
              {word.english}
            </p>
            <AudioButton text={word.english} size="sm" />
          </div>
          {word.is_new && (
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/40 px-2 py-0.5 rounded-full">
              {t('flashCard.new')}
            </span>
          )}
          <div className="flex items-center gap-1.5 mt-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`w-2 h-2 rounded-full ${
                  n <= word.box
                    ? word.box >= 6 ? 'bg-orange-500'
                    : word.box >= 5 ? 'bg-yellow-500'
                    : word.box >= 4 ? 'bg-purple-500'
                    : word.box >= 3 ? 'bg-blue-500'
                    : word.box >= 2 ? 'bg-green-500'
                    : 'bg-gray-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
              {t('flashCard.box', { box: word.box })}/6 · {t('flashCard.boxInterval', { interval: SRS_INTERVALS[word.box - 1] ?? 90 })}
            </span>
          </div>
          {!flipped && (
            <button
              onClick={(e) => { e.stopPropagation(); onFlip() }}
              aria-label={t('flashCard.view')}
              className="btn-primary mt-6 text-sm flex items-center gap-2"
            >
              {t('flashCard.view')} <ChevronRight size={14} />
            </button>
          )}
        </div>

        <div
          className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 ${
            flipped ? 'opacity-100 rotate-y-0' : 'opacity-0 pointer-events-none -rotate-y-180'
          } border-b1-200 bg-b1-50 flex flex-col p-6`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${LEVEL_BADGES[word.level] || LEVEL_BADGES.A1}`}>
              {word.level}
            </span>
            {word.is_new && (
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                {t('flashCard.new')}
              </span>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{word.english}</p>
            <AudioButton text={word.english} size="sm" />
          </div>
          {word.phonetic && (
            <p className="text-sm text-gray-400 dark:text-gray-500 font-mono mb-2 text-center">/{word.phonetic}/</p>
          )}
          <div className="bg-white dark:bg-gray-700/50 rounded-xl px-4 py-3 mt-2">
            <p className="text-base font-semibold text-b1-700">{word.uzbek}</p>
          </div>
          {word.example && (
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl px-4 py-3 mt-2 italic text-sm text-gray-600 dark:text-gray-400 border border-b1-100 dark:border-b1-800">
              “{word.example}”
            </div>
          )}
          <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            {word.is_learned ? (
              <span className="text-yellow-600 font-semibold">{t('flashCard.learned')}</span>
            ) : (
              <span>{t('flashCard.box', { box: word.box })}</span>
            )}
            <span>{t('flashCard.correct', { count: word.correct_count })} | {t('flashCard.wrong', { count: word.wrong_count })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
