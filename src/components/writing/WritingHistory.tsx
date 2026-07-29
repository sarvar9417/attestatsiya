import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { History, ChevronDown, ChevronUp, PenLine } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import { useI18n } from '../../i18n'

interface WritingRecord {
  id: number
  date: string
  prompt: string
  user_text: string
  word_count: number
  score: number
  ai_feedback: string
  created_at: string
}

export default function WritingHistory() {
  const { t } = useI18n()
  const [records, setRecords] = useState<WritingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const abortController = new AbortController()
    setLoading(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (abortController.signal.aborted) return
      if (!session?.user.id) { setLoading(false); return }
      supabase
        .from('writings')
        .select('id, date, prompt, user_text, word_count, score, ai_feedback, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10)
        .then(({ data }) => {
          if (abortController.signal.aborted) return
          setRecords((data ?? []) as WritingRecord[])
          setLoading(false)
        })
    })
    return () => abortController.abort()
  }, [open])

  return (
    <div className="card">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <History size={16} className="text-b2-500" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t('writingHistory.title')}</h3>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {open && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {loading ? (
            <div className="text-center py-6 text-sm text-gray-400 animate-pulse">{t('writingHistory.loading')}</div>
          ) : records.length === 0 ? (
            <EmptyState icon={PenLine} title={t('writingHistory.noResults')} description={t('writingHistory.noResultsDesc')} size="sm" />
          ) : (
            <div className="space-y-2">
              {records.map((r) => (
                <div key={r.id} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <PenLine size={14} className="text-b2-400 flex-shrink-0" />
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{r.prompt?.slice(0, 60)}...</p>
                        <p className="text-xs text-gray-400">{r.date} · {t('writingHistory.wordCount', { count: String(r.word_count) })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-bold ${
                        r.score >= 7 ? 'text-green-600' : r.score >= 5 ? 'text-yellow-600' : 'text-red-500'
                      }`}>{r.score}/10</span>
                      {expanded === r.id ? <ChevronUp size={14} className="text-gray-300" /> : <ChevronDown size={14} className="text-gray-300" />}
                    </div>
                  </button>

                  {expanded === r.id && (
                    <div className="px-3 pb-3 pt-0 border-t border-gray-50 dark:border-gray-700 space-y-2">
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('writingHistory.task')}</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{r.prompt}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('writingHistory.yourText')}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{r.user_text}</p>
                      </div>
                      {r.ai_feedback && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('writingHistory.aiFeedback')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{r.ai_feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
