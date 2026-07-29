import { ArrowLeft, Users, Lightbulb } from 'lucide-react'
import { CONVERSATION_SCENARIOS } from '../../data/conversationScenarios'
import { CATEGORY_LABEL, CATEGORY_COLOR } from './RoleplayHelpers'

interface Props {
  onBack: () => void
  onStartScenario: (s: typeof CONVERSATION_SCENARIOS[number]) => void
}

export default function RoleplayScenarioSelect({ onBack, onStartScenario }: Props) {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <Users size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">AI Roleplay Duo</h1>
          <p className="text-xs text-gray-500">Juftingiz bilan birga rol o'ynang</p>
        </div>
      </div>

      <div className="rounded-2xl p-3.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20 text-xs text-purple-800 dark:text-purple-200 flex gap-2 border border-purple-200 dark:border-purple-800">
        <Lightbulb size={16} className="shrink-0 mt-0.5" />
        <span>Stsenariy tanlang. Siz avval o'ynaysiz, keyin juftingiz davom etadi. Oxirida AI ikkalangizni baholaydi!</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {CONVERSATION_SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => onStartScenario(s)}
            className="text-left p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-purple-300 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-3xl">{s.emoji}</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${CATEGORY_COLOR[s.category]}`}>{CATEGORY_LABEL[s.category]}</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{s.minLevel}+</span>
              </div>
            </div>
            <p className="font-bold text-sm text-gray-900 dark:text-white">{s.titleUz}</p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{s.goalUz}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
