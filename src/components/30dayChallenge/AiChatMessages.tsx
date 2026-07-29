import { Bot, User, Drama, AlertCircle, BarChart3, Lightbulb, ArrowLeft } from 'lucide-react'
import type { RoleplayExercise } from '../../data/30dayChallenge'
import type { ChatMsg, ConversationMode } from './aiChatTypes'

interface SpeechRecognitionShape {
  isRecording: boolean
  isSupported: boolean
  permissionError: boolean
  reset: () => void
  start: () => void
}

interface Props {
  messages: ChatMsg[]
  streamingText: string
  isLoading: boolean
  mode: ConversationMode
  activeRoleplay: RoleplayExercise | null
  roleplayExercises: RoleplayExercise[]
  showRoleplayPicker: boolean
  userMsgCount: number
  showFeedback: boolean
  isFeedbackLoading: boolean
  sr: SpeechRecognitionShape
  scrollRef: React.RefObject<HTMLDivElement>
  onRequestFeedback: () => void
  onShowRoleplayPicker: () => void
  onSwitchToFree: () => void
}

export default function AiChatMessages({
  messages,
  streamingText,
  isLoading,
  mode,
  activeRoleplay,
  roleplayExercises,
  showRoleplayPicker,
  userMsgCount,
  showFeedback,
  isFeedbackLoading,
  sr,
  scrollRef,
  onRequestFeedback,
  onShowRoleplayPicker,
  onSwitchToFree,
}: Props) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin relative">
      {messages.map((msg, i) => (
        <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
            msg.role === 'user'
              ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
              : mode === 'roleplay'
                ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300'
                : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
          }`}>
            {msg.role === 'user' ? <User size={13} /> : mode === 'roleplay' ? <Drama size={13} /> : <Bot size={13} />}
          </div>
          <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            msg.role === 'user'
              ? 'bg-primary-600 text-white rounded-tr-sm'
              : mode === 'roleplay'
                ? 'bg-purple-50 dark:bg-purple-900/30 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-purple-100 dark:border-purple-800/50'
                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-gray-700'
          }`}>
            {msg.content}
          </div>
        </div>
      ))}

      {/* Streaming */}
      {streamingText && (
        <div className="flex gap-2.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
            mode === 'roleplay'
              ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300'
              : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
          }`}>
            {mode === 'roleplay' ? <Drama size={13} /> : <Bot size={13} />}
          </div>
          <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-sm ${
            mode === 'roleplay'
              ? 'bg-purple-50 dark:bg-purple-900/30 text-gray-800 dark:text-gray-200 border border-purple-100 dark:border-purple-800/50'
              : 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700'
          }`}>
            {streamingText}
            <span className="inline-block w-1.5 h-4 bg-primary-500 ml-0.5 rounded-sm animate-pulse" />
          </div>
        </div>
      )}

      {/* Loading dots */}
      {isLoading && !streamingText && (
        <div className="flex gap-2.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
            mode === 'roleplay'
              ? 'bg-purple-100 dark:bg-purple-900/50'
              : 'bg-indigo-100 dark:bg-indigo-900/50'
          }`}>
            {mode === 'roleplay' ? <Drama size={13} className="text-purple-600 dark:text-purple-300" /> : <Bot size={13} className="text-indigo-600 dark:text-indigo-300" />}
          </div>
          <div className={`px-3.5 py-2.5 rounded-2xl border flex gap-1 ${
            mode === 'roleplay'
              ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-800/50'
              : 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-700'
          }`}>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* Mic permission error */}
      {sr.permissionError && !sr.isRecording && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
          <p className="flex items-center gap-1 font-medium">
            <AlertCircle size={12} /> Mikrofon ruxsati yo'q
          </p>
          <button onClick={() => { sr.reset(); sr.start() }} className="mt-1 text-xs font-bold text-amber-800 dark:text-amber-200 underline">
            Qayta urinish
          </button>
        </div>
      )}

      {/* Feedback button */}
      {userMsgCount >= 2 && !showFeedback && (
        <div className="text-center py-1">
          <button
            onClick={onRequestFeedback}
            disabled={isFeedbackLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold hover:from-emerald-600 hover:to-green-700 transition-all active:scale-95 shadow-md hover:shadow-lg"
          >
            <BarChart3 size={14} />
            {isFeedbackLoading ? 'Tahlil qilinmoqda...' : 'Suhbat tahlili 📊'}
          </button>
          <p className="text-[10px] text-gray-400 mt-1">So'nggi {userMsgCount} ta xabaringiz tahlil qilinadi</p>
        </div>
      )}

      {/* Role-play tip */}
      {mode === 'free' && roleplayExercises.length > 0 && !showRoleplayPicker && (
        <div className="text-center">
          <button
            onClick={onShowRoleplayPicker}
            className="text-xs text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 underline transition-colors"
          >
            🎭 Role-play rejimiga o'tish
          </button>
        </div>
      )}

      {mode === 'roleplay' && (
        <div className="text-center">
          <button
            onClick={onSwitchToFree}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline transition-colors flex items-center gap-1 justify-center"
          >
            <ArrowLeft size={12} /> Free suhbatga qaytish
          </button>
        </div>
      )}

      {/* Tips in role-play mode */}
      {mode === 'roleplay' && activeRoleplay?.tips && activeRoleplay.tips.length > 0 && (
        <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30">
          <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 mb-1.5">
            <Lightbulb size={11} /> Maslahatlar
          </p>
          <ul className="space-y-0.5">
            {activeRoleplay.tips.map((tip, i) => (
              <li key={i} className="text-[11px] text-gray-600 dark:text-gray-400">💡 {tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
