import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronRight, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { getTodayTashkent } from '../../utils/tashkentDate'
import { useI18n } from '../../i18n'

export default function ReviewReminder() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [dueCount, setDueCount] = useState<number | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchDueWords = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session || cancelled) return

        const today = getTodayTashkent()

        const { count } = await supabase
          .from('vocabulary_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .lte('next_review', today)
          .not('is_learned', 'eq', true)

        if (!cancelled && count && count > 0) {
          setDueCount(count)
        }
      } catch (e) {
        monitoring.captureMessage('ReviewReminder fetch failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      }
    }

    fetchDueWords()
    return () => { cancelled = true }
  }, [])

  if (!dueCount || dismissed) return null

  return (
    <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/40 p-3 sm:p-4 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
          <BookOpen size={18} className="text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              📝 {dueCount} ta so'z takrorlash vaqti keldi
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Bu so'zlarni ko'rib chiqish ularni uzoq muddatli xotirangizga mustahkamlashga yordam beradi.
          </p>
          <button
            onClick={() => navigate('/vocabulary')}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Ko'rib chiqish <ChevronRight size={12} />
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label={t('aria.close')}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
