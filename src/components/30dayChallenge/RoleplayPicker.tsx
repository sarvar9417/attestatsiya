import { Drama } from 'lucide-react'
import type { RoleplayExercise } from '../../data/30dayChallenge'
import { inferScenario } from '../../lib/roleplayUtils'

interface Props {
  roleplayExercises: RoleplayExercise[]
  onStartRoleplay: (ex: RoleplayExercise) => void
  onClose: () => void
}

export default function RoleplayPicker({ roleplayExercises, onStartRoleplay, onClose }: Props) {
  return (
    <div className="px-3 py-3 bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 border-b border-purple-100 dark:border-purple-800/30">
      <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-purple-700 dark:text-purple-300">
        <Drama size={14} />
        Role-play bilan mashq qiling
      </div>
      <div className="flex flex-wrap gap-2">
        {roleplayExercises.map(ex => {
          const scenario = inferScenario(ex)
          return (
            <button
              key={ex.id}
              onClick={() => onStartRoleplay(ex)}
              className="group relative flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-md active:scale-[0.97] text-left"
            >
              <div className="mt-0.5">
                <Drama size={14} className="text-purple-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[160px]">{scenario.title}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{scenario.aiRole} ↔ {scenario.userRole}</p>
              </div>
            </button>
          )
        })}
      </div>
      <button
        onClick={onClose}
        className="mt-1.5 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline"
      >
        Yopish
      </button>
    </div>
  )
}
