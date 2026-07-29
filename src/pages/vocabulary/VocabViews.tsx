import { Loader2, RotateCcw, CheckCircle, ArrowLeft } from 'lucide-react'
import { useI18n } from '../../i18n'
import VocabProgress from '../../components/vocabulary/VocabProgress'

// ── Loading state ────────────────────────────────────────────

export function VocabLoading() {
  const { t } = useI18n()
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto flex items-center justify-center h-60">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-b1-500" />
        <p className="text-sm text-gray-500">{t('vocabPage.loading')}</p>
      </div>
    </div>
  )
}

// ── Empty / no-words state ───────────────────────────────────

interface VocabEmptyProps {
  rpcError: string | null
  levelStats: { level: string; total: number; learned: number; color: string }[]
  totalLearned: number
  totalWords: number
  dueCount: number
  streak: number
  loadDailyData: () => void
}

export function VocabEmpty(props: VocabEmptyProps) {
  const { t } = useI18n()
  const { rpcError, levelStats, totalLearned, totalWords, dueCount, streak, loadDailyData } = props
  const hasWordsInDB = levelStats.some((s) => s.total > 0)

  if (rpcError) {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <VocabProgress
          stats={levelStats}
          totalLearned={totalLearned}
          totalWords={totalWords}
          dueCount={dueCount}
          streak={streak}
        />
        <div className="mt-6 flex flex-col items-center gap-4 py-16 text-center">
          <div className="text-6xl mb-2">⚠️</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('vocabPage.rpcErrorTitle')}</h2>
          <p className="text-sm text-gray-500 max-w-sm">{rpcError}</p>
          <button
            onClick={loadDailyData}
            className="mt-4 py-4 px-10 bg-gradient-to-r from-b1-500 to-b1-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
          >
            <RotateCcw size={20} /> {t('common.retry')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <VocabProgress
        stats={levelStats}
        totalLearned={totalLearned}
        totalWords={totalWords}
        dueCount={dueCount}
        streak={streak}
      />
      <div className="mt-6 flex flex-col items-center gap-4 py-16 text-center">
        {hasWordsInDB ? (
          <>
            <div className="text-6xl mb-2">🎉</div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('vocabPage.dailyDone')}</h2>
            <p className="text-sm text-gray-500 max-w-xs">
              {t('vocabPage.dailyDoneDesc')}
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-2">📚</div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('vocabPage.noWordsTitle')}</h2>
            <p className="text-sm text-gray-500 max-w-xs">
              {t('vocabPage.noWordsDesc')}
            </p>
            <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-700">
              npx tsx scripts/seed-words-table.ts
            </code>
          </>
        )}
        <button
          onClick={loadDailyData}
          className="mt-4 py-4 px-10 bg-gradient-to-r from-b1-500 to-b1-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
        >            <RotateCcw size={20} /> {t('vocabPage.refresh')}
          </button>
      </div>
    </div>
  )
}

// ── Batch complete view ──────────────────────────────────────

interface BatchCompleteProps {
  batchWordsLength: number
  correctCount: number
  currentBatch: number
  handleBatchComplete: () => void
  selectBatch: (batch: number) => void
}

export function VocabBatchComplete(props: BatchCompleteProps) {
  const { t } = useI18n()
  const { batchWordsLength, correctCount, currentBatch, handleBatchComplete, selectBatch } = props
  const pct = batchWordsLength > 0 ? Math.round((correctCount / batchWordsLength) * 100) : 0
  const isReviewMode = currentBatch === 0
  const isLastBatch = isReviewMode || currentBatch >= 4

  return (
    <div className="p-3 sm:p-6 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
        {isReviewMode ? t('vocabPage.reviewDone') : isLastBatch ? t('vocabPage.dailyDoneAlt') : t('vocabPage.batchDone', { num: currentBatch })}
      </h2>
      <p className="text-gray-500 mb-6">
        {t('vocabPage.scoreText', { correct: correctCount, total: batchWordsLength })}
      </p>
      <div className="flex items-center gap-3 mb-8">
        <div className="card text-center px-4 sm:px-8 py-4">
          <p className="text-2xl sm:text-3xl font-bold text-b1-600">{pct}%</p>
          <p className="text-xs text-gray-500 mt-0.5">{t('vocabPage.correct')}</p>
        </div>
        <div className="card text-center px-4 sm:px-8 py-4">
          <p className="text-2xl sm:text-3xl font-bold text-primary-600">{correctCount * 5}</p>
          <p className="text-xs text-gray-500 mt-0.5">{t('vocabPage.xpScore')}</p>
        </div>
      </div>
      {isLastBatch ? (
        <button onClick={handleBatchComplete} className="btn-primary flex items-center gap-2">
          <CheckCircle size={16} /> {t('vocabPage.finish')}
        </button>
      ) : (
        <button
          onClick={() => selectBatch(currentBatch + 1)}
          className="btn-primary flex items-center gap-2"
        >
          {t('vocabPage.nextBatch')} <ArrowLeft size={16} className="rotate-180" />
        </button>
      )}
    </div>
  )
}
