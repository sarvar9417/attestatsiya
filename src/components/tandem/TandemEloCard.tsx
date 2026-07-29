import { Swords } from 'lucide-react'
import RatingBadge from './RatingBadge'

interface TandemEloCardProps {
  rating: number
  tier: string
  matchesPlayed: number
  wins: number
  losses: number
  draws: number
}

export default function TandemEloCard({ rating, matchesPlayed, wins, losses, draws }: TandemEloCardProps) {
  return (
    <div className="card p-5 space-y-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/20 border-2 border-purple-100 dark:border-purple-900/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Swords size={20} className="text-purple-600" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Tandem Elo Rating</h3>
        </div>
        <span className="text-xs font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full">
          {matchesPlayed} o'yin
        </span>
      </div>

      <div className="flex items-center justify-center">
        <RatingBadge rating={rating} size="lg" showProgress />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
          <p className="font-bold text-lg text-green-600">{wins}</p>
          <p className="text-gray-400">G'alaba</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
          <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{draws}</p>
          <p className="text-gray-400">Durang</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
          <p className="font-bold text-lg text-red-500">{losses}</p>
          <p className="text-gray-400">Mag'lubiyat</p>
        </div>
      </div>
    </div>
  )
}
