import type { NavigateFunction } from 'react-router-dom'

interface ConfusablePair {
  pairId: string
  uzTitle: string
  words: string[]
}

interface Props {
  pairs: ConfusablePair[]
  navigate: NavigateFunction
  /** 'theory' — default shorter description; 'speaking' | 'writing' — longer practice-focused description */
  variant?: 'theory' | 'speaking' | 'writing'
}

export default function ConfusableBanner({ pairs, navigate, variant = 'theory' }: Props) {
  if (pairs.length === 0) return null

  const description =
    variant === 'theory'
      ? "Quyidagi so'zlar o'zbek talabalar uchun eng ko'p chalkashlik tug'diradigan so'zlar qatoriga kiradi:"
      : "Quyidagi so'zlarni ishlatishda e'tiborli bo'ling. Ular o'zbek talabalar uchun eng ko'p chalkashlik tug'diradi:"

  return (
    <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-lg shrink-0">
          <span role="img" aria-label="warning">⚠️</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 mb-1">
            Diqqat! Bu darsda chalkash so'zlar bor
          </p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">
            {description}
          </p>
          <div className="space-y-1.5 mb-3">
            {pairs.map((c) => (
              <div key={c.pairId} className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                  {c.words.join(' / ')}
                </span>
                <span className="text-indigo-400 dark:text-indigo-500">—</span>
                <span className="text-gray-600 dark:text-gray-400">{c.uzTitle}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/confusable-pairs')}
            className="text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors active:scale-[0.97]"
          >
            Batafsil →
          </button>
        </div>
      </div>
    </div>
  )
}
