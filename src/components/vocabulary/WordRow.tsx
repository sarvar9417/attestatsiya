import { useState } from 'react'
import { useI18n } from '../../i18n'
import type { GameWord } from '../../store/vocabularyStore'
import type { Rating } from '../../services/vocabularyService'
import QuickRating from './QuickRating'
import VocabAIAssistant from './VocabAIAssistant'
import { RetentionBar } from './RetentionBar'
import { AudioButton } from '../ui/AudioButton'

export default function WordRow({
  word,
  globalIndex,
  onRate,
}: {
  word: GameWord
  globalIndex: number
  onRate: (wordId: number, rating: Rating) => void
}) {
  const { t } = useI18n()
  const [showAI, setShowAI] = useState(false)

  return (
    <div>
      <div className="card flex items-center justify-between py-2.5 px-4">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="text-xs font-mono text-gray-300 dark:text-gray-600 w-5 text-right shrink-0">
            {globalIndex}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate flex items-center gap-1">
                {word.english}
                {word.is_learned && <span className="text-yellow-500 text-xs">⭐</span>}
              </p>
              <AudioButton text={word.english} size="sm" />
              {word.phonetic && (
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono shrink-0">/{word.phonetic}/</span>
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {word.uzbek}
              {word.example && <span className="ml-2 text-gray-300 dark:text-gray-600 italic">— {word.example}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button
            onClick={() => setShowAI(v => !v)}
            className={`text-xs font-medium px-1.5 py-0.5 rounded transition-all
              flex items-center gap-1
              ${showAI
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50'
              }`}
            title={t('wordRow.aiAssistant')}
          >
            🤖
          </button>
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
            word.is_learned ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
            word.level === 'A1' ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' :
            word.level === 'A2' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' :
            word.level === 'B1' ? 'bg-b1-50 dark:bg-b1-900/30 text-b1-600 dark:text-b1-400' :
            'bg-b2-50 dark:bg-b2-900/30 text-b2-600 dark:text-b2-400'
          }`}>
            {word.is_learned ? t('wordRow.learned') : word.level}
          </span>
          {!word.is_learned && (
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              word.is_new ? 'bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
            }`}>
              {word.is_new ? t('wordRow.new') : t('wordRow.box', { box: word.box })}
            </span>
          )}
          {!word.is_new && (
            <RetentionBar box={word.box} nextReview={word.next_review} />
          )}
          <QuickRating wordId={word.word_id} lastRating={word.last_rating} onRate={onRate} />
        </div>
      </div>

      {showAI && (
        <div className="px-4 pb-2 -mt-1">
          <VocabAIAssistant english={word.english} level={word.level} />
        </div>
      )}
    </div>
  )
}
