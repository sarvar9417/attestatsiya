import { useI18n } from '../../i18n'
import WordGame from '../../components/vocabulary/WordGame'
import type { GameWord } from '../../store/vocabularyStore'

interface VocabGameViewProps {
  words: GameWord[]
  currentBatch: number
  onComplete: (score: number, total: number) => void
  onMatch: (wordId: number, correct: boolean) => void
  onExit: () => void
}

export default function VocabGameView({
  words, currentBatch, onComplete, onMatch, onExit,
}: VocabGameViewProps) {
  const { t } = useI18n()

  return (
    <div className="p-3 sm:p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onExit} aria-label={t('accessibility.vocab.exitGame')} className="btn-ghost text-sm px-2 py-1">
          {t('vocabPage.exitButton')}
        </button>
        <span className="text-sm font-medium text-gray-500">{t('vocabPage.batchLabel', { num: currentBatch })}</span>
      </div>
      <WordGame
        words={words}
        onComplete={onComplete}
        onMatch={onMatch}
      />
    </div>
  )
}
