import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { History, ChevronDown, ChevronUp, Mic } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import { useI18n } from '../../i18n'

interface SpeakingRecord {
  id: number
  date: string
  prompt_text: string
  fluency_score: number
  grammar_score: number
  vocabulary_score: number
  avg_score: number
  feedback: string
  completed_at: string
}

export default function SpeakingHistory() {
  const { t } = useI18n()
  const [records, setRecords] = useState<SpeakingRecord[]>([])
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
        .from('speaking_progress')
        .select('id, date, prompt_text, fluency_score, grammar_score, vocabulary_score, avg_score, feedback, completed_at')
        .eq('user_id', session.user.id)
        .order('completed_at', { ascending: false })
        .limit(10)
        .then(({ data }) => {
          if (abortController.signal.aborted) return
          setRecords((data ?? []) as SpeakingRecord[])
          setLoading(false)
        })
    })
    return () => abortController.abort()
  }, [open])

  const avgColor = (score: number) =>
    score >= 7 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-500'

  return (
    <div className="card">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <History size={16} className="text-b2-500" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t('speakingHistory.title')}</h3>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {open && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {loading ? (
            <div className="text-center py-6 text-sm text-gray-400 animate-pulse">{t('speakingHistory.loading')}</div>
          ) : records.length === 0 ? (
            <EmptyState icon={Mic} title={t('speakingHistory.noResults')} description={t('speakingHistory.noResultsDesc')} size="sm" />
          ) : (
            <div className="space-y-2">
              {records.map((r) => (
                <div key={r.id} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Mic size={14} className="text-b2-400 flex-shrink-0" />
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{r.prompt_text?.slice(0, 60)}...</p>
                        <p className="text-xs text-gray-400">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-bold ${avgColor(r.avg_score)}`}>{r.avg_score}/10</span>
                      {expanded === r.id ? <ChevronUp size={14} className="text-gray-300" /> : <ChevronDown size={14} className="text-gray-300" />}
                    </div>
                  </button>

                  {expanded === r.id && (
                    <div className="px-3 pb-3 pt-0 border-t border-gray-50 dark:border-gray-700 space-y-2">
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('speakingHistory.question')}</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{r.prompt_text}</p>
                      </div>

                      {/* Score breakdown */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Fluency', score: r.fluency_score },
                          { label: 'Grammar', score: r.grammar_score },
                          { label: 'Vocabulary', score: r.vocabulary_score },
                        ].map(({ label, score }) => (
                          <div key={label} className="text-center py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className={`text-sm font-bold ${avgColor(score)}`}>{score}</p>
                            <p className="text-xs text-gray-400">{label}</p>
                          </div>
                        ))}
                      </div>

                      {r.feedback && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('speakingHistory.feedback')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{r.feedback}</p>
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
