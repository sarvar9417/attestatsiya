import { Sword, Bot, Zap, Users, Check, Layers } from 'lucide-react'
import { LEVEL_OPTIONS } from '../../services/battleService'
import {
  type AIDifficulty, type LevelId,
  AI_OPPONENTS, LEVEL_COLORS, LEVEL_RING_COLORS,
  DIFFICULTY_COLORS, DIFFICULTY_RING_COLORS, DIFFICULTY_ICONS, LEVEL_DESCRIPTIONS,
} from './VocabBattleHelpers'

interface Props {
  selectedLevel: LevelId
  aiDifficulty: AIDifficulty
  joinRoomId: string
  onLevelChange: (level: LevelId) => void
  onAIDifficultyChange: (diff: AIDifficulty) => void
  onJoinRoomIdChange: (id: string) => void
  onCreateRoom: () => void
  onStartAI: () => void
  onJoinRoom: () => void
}

export default function VocabBattleLobby({
  selectedLevel, aiDifficulty, joinRoomId,
  onLevelChange, onAIDifficultyChange, onJoinRoomIdChange,
  onCreateRoom, onStartAI, onJoinRoom,
}: Props) {
  return (
    <div className="max-w-lg mx-auto space-y-6 animate-page-enter">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sword size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vocabulary Battle</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Do'stingiz bilan real-time so'z yarishing yoki AI ga qarshi o'ynang!
        </p>
      </div>

      {/* Level Selector */}
      <div className="card p-5 space-y-3 border-2 border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Darajani tanlang</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LEVEL_OPTIONS.map((level) => {
            const isSelected = selectedLevel === level.id
            return (
              <button
                key={level.id}
                onClick={() => onLevelChange(level.id as LevelId)}
                className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                  LEVEL_COLORS[level.id]
                } ${isSelected ? 'ring-2 ring-offset-1 scale-[1.02] ' + LEVEL_RING_COLORS[level.id] : 'opacity-70 hover:opacity-100'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{level.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{level.label}</p>
                    <p className="text-xs text-gray-400">{LEVEL_DESCRIPTIONS[level.id]}</p>
                  </div>
                  {isSelected && (
                    <span className={`ml-auto w-5 h-5 rounded-full ${level.color} flex items-center justify-center`}>
                      <Check size={12} className="text-white" />
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* AI Opponent Section */}
      <div className="card p-6 space-y-4 border-2 border-primary-100 dark:border-primary-900/50 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-950/20">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">AI Opponent</h3>
            <p className="text-xs text-gray-400">Yakka o'zingiz mashq qiling</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['easy', 'medium', 'hard'] as const).map((diff) => {
            const ai = AI_OPPONENTS[diff]
            const isSelected = aiDifficulty === diff
            return (
              <button
                key={diff}
                onClick={() => onAIDifficultyChange(diff)}
                className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                  DIFFICULTY_COLORS[diff]
                } ${isSelected ? 'ring-2 ring-offset-1 scale-105 ' + DIFFICULTY_RING_COLORS[diff] : ''}`}
              >
                <span className="text-2xl block mb-1">{DIFFICULTY_ICONS[diff]}</span>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{ai.name}</p>
                <p className="text-xs text-gray-400">{Math.round(ai.accuracy * 100)}%</p>
              </button>
            )
          })}
        </div>
        <button onClick={onStartAI} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
          <Zap size={18} />
          AI ga qarshi o'ynash
        </button>
      </div>

      <div className="relative flex items-center gap-2">
        <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
        <span className="text-xs text-gray-400 font-medium">YOKI</span>
        <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
      </div>

      {/* Multiplayer Section */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Multiplayer</h3>
            <p className="text-xs text-gray-400">Do'stingiz bilan real-time o'ynang</p>
          </div>
        </div>
        <button onClick={onCreateRoom} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
          <Sword size={18} />
          Yangi xona yaratish
        </button>
        <div className="space-y-2">
          <input
            className="input text-center text-lg font-mono tracking-widest"
            placeholder="XONA ID"
            value={joinRoomId}
            onChange={(e) => onJoinRoomIdChange(e.target.value.toUpperCase())}
            maxLength={6}
          />
          <button
            onClick={onJoinRoom}
            disabled={joinRoomId.trim().length < 4}
            className="btn-secondary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Users size={18} />
            Xonaga qo'shilish
          </button>
        </div>
      </div>

      <p className="text-xs text-center text-gray-400">
        Ikki o'yinchi real-time Realtime orqali bog'lanadi
      </p>
    </div>
  )
}
