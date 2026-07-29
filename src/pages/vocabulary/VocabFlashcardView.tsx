import { useI18n } from '../../i18n'
import FlashCardRenderer from './FlashCardRenderer'
import type { GameWord } from '../../store/vocabularyStore'
import type { Rating } from '../../services/vocabularyService'

interface VocabFlashcardViewProps {
  word: GameWord
  currentIdx: number
  totalWords: number
  onRate: (wordId: number, rating: Rating) => void
  onAdvance: () => void
  onExit: () => void
}

export default function VocabFlashcardView({
  word, currentIdx, totalWords, onRate, onAdvance, onExit,
}: VocabFlashcardViewProps) {
  const { t } = useI18n()

  return (
    <div className="p-3 sm:p-6 max-w-lg mx-auto select-none">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onExit} aria-label={t('accessibility.vocab.exitFlashcard')} className="btn-ghost text-sm px-2 py-1">
          {t('vocabPage.exitButton')}
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">{currentIdx + 1} / {totalWords}</span>
          <div className="w-28 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-b1-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalWords) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <FlashCardRenderer
        word={word}
        onRate={onRate}
        onAdvance={onAdvance}
      />
    </div>
  )
}
