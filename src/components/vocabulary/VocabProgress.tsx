import { Flame } from 'lucide-react'
import { useI18n } from '../../i18n'

interface LevelStat {
  level: string
  total: number
  learned: number
  color: string
}

interface Props {
  stats: LevelStat[]
  totalLearned: number
  totalWords: number
  dueCount: number
  streak: number
}

export default function VocabProgress({ stats, totalLearned, totalWords, dueCount, streak }: Props) {
  const { t } = useI18n()
  return (
    <div className="card p-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {stats.map((s) => {
          const pct = s.total > 0 ? Math.round((s.learned / s.total) * 100) : 0
          return (
            <div key={s.level}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="font-semibold text-gray-700 dark:text-gray-300">{s.level}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {s.learned.toLocaleString()}/{s.total.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${s.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 text-center">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{totalLearned.toLocaleString()}</p>
          <p className="text-[9px] text-gray-400">{t('vocabProgress.totalWords', { total: totalWords.toLocaleString() })}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-orange-600">{dueCount}</p>
          <p className="text-[9px] text-gray-400">{t('vocabProgress.review')}</p>
        </div>
        <div className="flex items-center gap-1">
          <Flame size={14} className="text-orange-500" />
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{streak}</p>
          <p className="text-[9px] text-gray-400">{t('vocabProgress.days')}</p>
        </div>
      </div>
    </div>
  )
}
