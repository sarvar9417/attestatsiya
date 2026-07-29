import { useI18n } from '../../i18n'
import type { ViewMode } from '../../store/vocabularyStore'

interface VocabPhaseNavProps {
  batchWordsLength: number
  currentBatch: number
  onEnterMode: (mode: ViewMode) => void
}

export default function VocabPhaseNav({
  batchWordsLength, currentBatch, onEnterMode,
}: VocabPhaseNavProps) {
  const { t } = useI18n()

  if (batchWordsLength === 0) return null

  const phases = [
    { mode: 'flashcard' as const, label: t('vocabPage.modeFlashcard'), icon: '🃏', desc: t('vocabPage.modeFlashcardDesc') },
    { mode: 'test' as const, label: t('vocabPage.modeTest'), icon: '📝', desc: t('vocabPage.modeTestDesc') },
    { mode: 'game' as const, label: t('vocabPage.modeGame'), icon: '🎮', desc: t('vocabPage.modeGameDesc') },
  ]

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {t('vocabPage.batchPhaseName', { num: currentBatch, count: batchWordsLength })}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {phases.map((phase) => (
          <button
            key={phase.mode}
            onClick={() => onEnterMode(phase.mode)}
            aria-label={phase.label}
            className="card py-3 text-center hover:shadow-sm hover:border-b1-200 transition-all"
          >
            <span className="text-xl">{phase.icon}</span>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{phase.label}</p>
            <p className="text-[9px] text-gray-400">{phase.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
