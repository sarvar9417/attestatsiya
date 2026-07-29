import { useI18n } from '../../i18n'
import { getBatchWords } from '../../store/vocabularyStore'
import type { DailyWordRow } from '../../services/vocabularyService'

interface VocabBatchTabsProps {
  dailyWords: DailyWordRow[]
  currentBatch: number
  onSelectBatch: (batch: number) => void
}

export default function VocabBatchTabs({
  dailyWords, currentBatch, onSelectBatch,
}: VocabBatchTabsProps) {
  const { t } = useI18n()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
      {[0, 1, 2, 3].map((i) => {
        const batchNum = i + 1
        const batchWordsSlice = getBatchWords(dailyWords, batchNum)
        const isCurrent = currentBatch === batchNum
        const batchIds = batchWordsSlice.map(w => w.word_id)
        const bStart = batchIds.length > 0 ? Math.min(...batchIds) : 0
        const bEnd = batchIds.length > 0 ? Math.max(...batchIds) : 0
        return (
          <button
            key={batchNum}
            onClick={() => onSelectBatch(batchNum)}
            disabled={batchWordsSlice.length === 0}
            aria-label={t('accessibility.vocab.batch', { num: batchNum })}
            className={`card py-3 text-center transition-all ${
              isCurrent ? 'ring-2 ring-b1-500 border-b1-500' : ''
            } ${batchWordsSlice.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <p className={`text-sm font-bold ${isCurrent ? 'text-b1-600' : 'text-gray-700'}`}>
              {t('vocabPage.batchLabel', { num: batchNum })}
            </p>
            <p className="text-xs text-gray-400">{bStart}-{bEnd}</p>
            <p className="text-xs font-medium text-b1-500 mt-0.5">
              {t('vocabPage.reviewCount', { count: batchWordsSlice.filter((w) => !w.is_new && !w.is_learned).length })}
              {batchWordsSlice.filter((w) => w.is_learned).length > 0 && (
                <> · {t('vocabPage.learnedCount', { count: batchWordsSlice.filter((w) => w.is_learned).length })}</>
              )}
            </p>
          </button>
        )
      })}
    </div>
  )
}
