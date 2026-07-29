import { useI18n } from '../../i18n'

interface VocabReviewBannerProps {
  reviewCount: number
  onStartReview: () => void
}

export default function VocabReviewBanner({ reviewCount, onStartReview }: VocabReviewBannerProps) {
  const { t } = useI18n()

  if (reviewCount === 0) return null

  return (
    <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800 px-3 py-2">
      <p className="text-xs font-medium text-orange-700 dark:text-orange-400">
        {t('vocabPage.reviewBanner', { count: reviewCount })}
      </p>
      <button
        onClick={onStartReview}
        aria-label={t('accessibility.vocab.startReview', { count: reviewCount })}
        className="shrink-0 px-3 py-1 bg-orange-500 text-white font-bold rounded-lg text-xs hover:bg-orange-600 transition-all"
      >
        {t('vocabPage.reviewStart')}
      </button>
    </div>
  )
}
