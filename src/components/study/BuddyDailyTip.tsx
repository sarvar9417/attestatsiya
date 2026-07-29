import { useState, useEffect, lazy, Suspense } from 'react'
import { Bot, Sparkles, MessageCircle, RefreshCw } from 'lucide-react'
import { generateDailyTip, getContextFromStore, type BuddyContext } from '../../services/aiBuddyService'
import { monitoring } from '../../lib/monitoring'

const AIBuddyChat = lazy(() => import('./AIBuddyChat'))

export default function BuddyDailyTip() {
  const [tip, setTip] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [context, setContext] = useState<BuddyContext | null>(null)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    loadTip()
  }, [])

  async function loadTip() {
    setLoading(true)
    const ctx = await getContextFromStore()
    if (!ctx) { setLoading(false); return }
    setContext(ctx)
    try {
      const generated = await generateDailyTip(ctx)
      setTip(generated)
    } catch {
      monitoring.captureMessage('Failed to generate daily AI tip', 'warn')
      setTip(null)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    )
  }

  if (!context) return null

  return (
    <>
      <div className="card p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              AI Study Buddy
              <Sparkles size={12} className="text-purple-500" />
            </p>
            <p className="text-xs text-gray-400">Proactive tip for today</p>
          </div>
          <button
            onClick={loadTip}
            className="p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-400 transition-colors"
            title="New tip"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {tip ? (
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {tip}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {context.streak >= 7
              ? `🔥 ${context.streak}-day streak! Keep it going — review 5 old vocabulary words today.`
              : context.todayXP === 0
              ? `💪 Start your day with a quick 10-minute lesson to keep your streak alive!`
              : `🎯 Great progress today (${context.todayXP} XP)! Try a quick review exercise to lock it in.`}
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
          <button
            onClick={() => setShowChat(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-700 transition-colors"
          >
            <MessageCircle size={14} />
            Chat with Buddy
          </button>
          <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
            {context.streak > 0 ? `${context.streak}-day streak` : 'Active'}
          </div>
        </div>
      </div>

      {showChat && context && (
        <Suspense fallback={null}>
          <AIBuddyChat context={context} onClose={() => setShowChat(false)} />
        </Suspense>
      )}
    </>
  )
}
