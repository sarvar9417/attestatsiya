import { ChevronLeft, Sparkles } from 'lucide-react'
import { SkeletonText } from '../ui/Skeleton'
import type { ChatMessage, ChatTopic } from './speakingHelpers'

interface SpeakingChatFeedbackProps {
  chatFeedback: string
  turnCount: number
  chatMessages: ChatMessage[]
  chatTopic: ChatTopic | null
  todayChecklist: { speaking?: boolean }
  xpEarned: number
  progressPct: number
  t: (key: string, params?: Record<string, string>) => string
  onBack: () => void
}

export default function SpeakingChatFeedback({
  chatFeedback, turnCount, chatMessages, chatTopic, todayChecklist,
  xpEarned, progressPct, t, onBack,
}: SpeakingChatFeedbackProps) {
  return (
    <div className="p-3 sm:p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="btn-ghost p-2 rounded-xl">
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-bold text-gray-900">{t('speaking.chatFeedbackTitle')}</h2>
      </div>

      {/* Stats */}
      <div className="card bg-gradient-to-r from-primary-50 to-b2-50 border-primary-100 text-center mb-4">
        <div className="w-12 h-12 bg-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Sparkles size={24} className="text-primary-700" />
        </div>
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{t('speaking.chatCompleted')}</p>
        <p className="text-xs text-gray-500 mt-1">
          {t('speaking.chatFeedbackTurnCount', { count: String(turnCount) })} · {chatTopic?.prompt.slice(0, 60)}...
        </p>
      </div>

      {/* XP & Progress */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-b2-600">+{xpEarned}</p>
          <p className="text-xs text-gray-500 mt-0.5">{t('speaking.chatXPEarned')}</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-green-600">
            {progressPct}%
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{t('speaking.chatProgressLabel')}</p>
        </div>
      </div>

      {/* Feedback */}
      {chatFeedback ? (
        <div className="card bg-primary-50 border-primary-100 mb-4">
          <p className="text-xs font-semibold text-primary-700 mb-2">{t('speaking.feedback')}</p>
          <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
            {chatFeedback}
          </pre>
        </div>
      ) : (
        <div className="card bg-gray-50 text-center py-6 mb-4">
          <p className="text-sm text-gray-500 mb-3">{t('speaking.chatFeedbackLoading')}</p>
          <SkeletonText lines={3} />
        </div>
      )}

      {/* Checklist status */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-600">{t('speaking.chatChecklistLabel')}</span>
          <span className={`text-xs font-bold ${todayChecklist.speaking ? 'text-green-600' : 'text-gray-400'}`}>
            {todayChecklist.speaking ? t('speaking.chatCompletedStatus') : t('speaking.chatNotCompletedStatus')}
          </span>
        </div>
      </div>

      {/* Conversation transcript */}
      <details className="card mb-4">
        <summary className="cursor-pointer text-sm font-semibold text-gray-700 select-none">
          {t('speaking.chatTranscript', { count: String(chatMessages.length) })}
        </summary>
        <div className="space-y-2 mt-3">
          {chatMessages.map((msg) => (
            <div key={msg.timestamp} className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-b2-50' : 'bg-gray-50'}`}>
              <p className={`text-xs font-semibold mb-0.5 ${msg.role === 'user' ? 'text-b2-600' : 'text-gray-500'}`}>
                {msg.role === 'user' ? t('speaking.chatYou') : t('speaking.chatClaude')}
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">{msg.content}</p>
            </div>
          ))}
        </div>
      </details>

      <button onClick={onBack} className="btn-primary w-full text-sm">
        {t('speaking.chatBackButton')}
      </button>
    </div>
  )
}
