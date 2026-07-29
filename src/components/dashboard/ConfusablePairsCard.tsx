// ═══════════════════════════════════════════════════════════════════════════
// Confusable Pairs — Dashboard widget (random daily pair)
// ═══════════════════════════════════════════════════════════════════════════

import { Brain, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CONFUSABLE_PAIRS } from '../../data/confusable-pairs'
import { useI18n } from '../../i18n'

export default function ConfusablePairsCard() {
  const navigate = useNavigate()
  const { t } = useI18n()

  // Deterministic daily pick based on day of year
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86_400_000
  )
  const pair = CONFUSABLE_PAIRS[dayOfYear % CONFUSABLE_PAIRS.length]

  if (!pair) return null

  return (
    <button
      onClick={() => navigate('/confusable-pairs')}
      className="card w-full text-left group hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700
        transition-all active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
          <Brain size={20} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {t('confusable.title')}
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-0.5">
            {pair.words.map((w, i) => (
              <span key={w}>
                {i > 0 && <span className="text-gray-400 mx-1 font-normal text-sm">vs</span>}
                <span className={`${i === 0 ? 'text-purple-600 dark:text-purple-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {w}
                </span>
              </span>
            ))}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {pair.uzTitle.split(' — ')[1] ?? pair.memoryHook.slice(0, 60)}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Brain size={12} />
              {t('confusable.nExamples', { count: pair.examples.length })}
            </span>
            <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-0.5">
              {t('confusable.seeAll')} <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
