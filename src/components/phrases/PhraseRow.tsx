import { Volume2 } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { GamePhrase } from '../../store/phrasesStore'
import type { PhraseRating } from '../../types/phrases'
import PhraseQuickRating from './PhraseQuickRating'
import { getCategoryStyle } from '../../utils/phraseConfig'
import { speak } from '../../lib/tts'

export default function PhraseRow({
  phrase,
  globalIndex,
  onRate,
}: {
  phrase: GamePhrase
  globalIndex: number
  onRate: (phraseId: number, rating: PhraseRating) => void
}) {
  const { t } = useI18n()
  const cat = getCategoryStyle(phrase.category)

  return (
    <div className="card flex items-center justify-between py-2.5 px-4">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="text-xs font-mono text-gray-300 dark:text-gray-600 w-5 text-right shrink-0">
          {globalIndex}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 flex items-center gap-1">
            {phrase.english}
            {phrase.is_learned && <span className="text-yellow-500 text-xs">⭐</span>}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{phrase.uzbek}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            speak(phrase.english, { rate: 0.9 }).catch(() => {})
          }}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-300 hover:text-b1-500 transition-colors"
          title={t('phraseRow.pronounce')}
        >
          <Volume2 size={13} />
        </button>
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${cat.bg} ${cat.text}`}>
          {cat.label}
        </span>
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
          phrase.is_learned ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
          phrase.level === 'A1' ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' :
          phrase.level === 'A2' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' :
          phrase.level === 'B1' ? 'bg-b1-50 dark:bg-b1-900/30 text-b1-600 dark:text-b1-400' :
          'bg-b2-50 dark:bg-b2-900/30 text-b2-600 dark:text-b2-400'
        }`}>
          {phrase.is_learned ? t('phraseRow.learned') : phrase.level}
        </span>
        {!phrase.is_learned && (
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
            phrase.is_new
              ? 'bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
          }`}>
            {phrase.is_new ? t('phraseRow.new') : t('phraseRow.box', { box: phrase.box })}
          </span>
        )}
        <PhraseQuickRating phraseId={phrase.phrase_id} lastRating={phrase.last_rating} onRate={onRate} />
      </div>
    </div>
  )
}
