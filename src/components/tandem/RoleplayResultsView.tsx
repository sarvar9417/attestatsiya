import { Trophy } from 'lucide-react'
import { EvalSection } from './RoleplayHelpers'
import type { RoleplayEvaluation } from '../../types/tandem'

interface Props {
  myEval: RoleplayEvaluation
  partnerEval: RoleplayEvaluation
  currentUserName: string
  partnerName: string
  xpEarned: number
  onBack: () => void
  onComplete: () => void
}

export default function RoleplayResultsView({
  myEval, partnerEval, currentUserName, partnerName,
  xpEarned, onBack, onComplete,
}: Props) {
  const myAvg = Math.round((myEval.fluency + myEval.taskSuccess) / 2)
  const partnerAvg = Math.round((partnerEval.fluency + partnerEval.taskSuccess) / 2)

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 animate-page-enter">
      <div className="text-center pt-2 space-y-2">
        <div className="text-5xl mb-1">🎭</div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">Roleplay Duo — yakunlandi!</h1>
        {xpEarned > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold text-sm">
            <Trophy size={15} /> +{xpEarned} XP
          </div>
        )}
        <p className="text-xs text-gray-400">AI ikkala o'yinchini baholadi</p>
      </div>

      <EvalSection label="Sizning natijangiz" evaluation={myEval} userName={currentUserName} />
      <EvalSection label="Juftingizning natijasi" evaluation={partnerEval} userName={partnerName || 'Juftingiz'} />

      <div className="card p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/50">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" />
          Umumiy natija
        </h3>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-xs text-gray-500">{currentUserName}</p>
            <p className="text-2xl font-bold text-amber-600">{myAvg}</p>
          </div>
          <span className="text-gray-300 font-bold text-lg">VS</span>
          <div className="text-center">
            <p className="text-xs text-gray-500">{partnerName || 'Juft'}</p>
            <p className="text-2xl font-bold text-purple-600">{partnerAvg}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onBack} className="btn-secondary flex-1 py-3 font-bold text-sm">Tandemga qaytish</button>
        <button onClick={onComplete} className="btn-primary flex-1 py-3 font-bold text-sm">Yakunlash</button>
      </div>
    </div>
  )
}
