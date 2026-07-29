import { Bot, Volume2, Sparkles, Drama, MessageCircle, Heart } from 'lucide-react'
import type { RoleplayExercise } from '../../data/30dayChallenge'
import { inferScenario } from '../../lib/roleplayUtils'
import type { ConversationMode } from './aiChatTypes'

interface Props {
  mode: ConversationMode
  activeRoleplay: RoleplayExercise | null
  hasRoleplayExercises: boolean
  lifeMemoryFactCount: number
  voiceEnabled: boolean
  showLifeMemory: boolean
  dayLevel: string
  dayTitle: string
  onToggleMode: () => void
  onToggleVoice: () => void
  onClearChat: () => void
  onToggleLifeMemory: () => void
}

export default function AiConversationHeader({
  mode,
  activeRoleplay,
  hasRoleplayExercises,
  lifeMemoryFactCount,
  voiceEnabled,
  showLifeMemory,
  dayLevel,
  dayTitle,
  onToggleMode,
  onToggleVoice,
  onClearChat,
  onToggleLifeMemory,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20">
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          mode === 'roleplay'
            ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600'
            : 'bg-gradient-to-br from-primary-500 to-primary-700'
        }`}>
          {mode === 'roleplay' ? <Drama size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
            {mode === 'roleplay' ? '🎭 Role-Play' : 'AI Conversation'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {mode === 'roleplay' && activeRoleplay
              ? inferScenario(activeRoleplay).title
              : `${dayLevel} • ${dayTitle}`
            }
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {/* Mode toggle */}
        {hasRoleplayExercises && (
          <button
            onClick={onToggleMode}
            className={`p-2 rounded-lg transition-all text-xs font-bold flex items-center gap-1 ${
              mode === 'roleplay'
                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={mode === 'roleplay' ? 'Free suhbatga qaytish' : 'Role-play rejimi'}
          >
            {mode === 'roleplay' ? (
              <><MessageCircle size={14} /><span className="hidden sm:inline text-xs">Free</span></>
            ) : (
              <><Drama size={14} /><span className="hidden sm:inline text-xs">Role-play</span></>
            )}
          </button>
        )}
        {/* Life Memory button */}
        {lifeMemoryFactCount > 0 && (
          <button
            onClick={onToggleLifeMemory}
            className={`p-2 rounded-lg transition-all ${showLifeMemory ? 'text-rose-600 bg-rose-100 dark:bg-rose-900/40' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Life Memory - faktlar"
          >
            <Heart size={15} />
          </button>
        )}
        <button
          onClick={onToggleVoice}
          className={`p-2 rounded-lg transition-colors ${voiceEnabled ? 'text-primary-600 bg-primary-100 dark:bg-primary-900/40' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          title={voiceEnabled ? "Ovoz o'chirish" : "Ovoz yoqish"}
        >
          <Volume2 size={15} />
        </button>
        <button
          onClick={onClearChat}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          title="Suhbatni tozalash"
        >
          <Sparkles size={15} />
        </button>
      </div>
    </div>
  )
}
