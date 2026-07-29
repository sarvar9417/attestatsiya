import { useState } from 'react'
import { Zap, Wifi, Users } from 'lucide-react'

interface HotSeatOnlineLobbyProps {
  onCreateRoom: () => void
  onJoinRoom: (roomId: string) => void
  onBack: () => void
}

export default function HotSeatOnlineLobby({ onCreateRoom, onJoinRoom, onBack }: HotSeatOnlineLobbyProps) {
  const [joinRoomId, setJoinRoomId] = useState('')

  return (
    <div className="max-w-lg mx-auto space-y-5 animate-page-enter p-4">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Wifi size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Online Hot Seat</h2>
        <p className="text-sm text-gray-500">Supabase Realtime orqali ikki telefonda o'ynang</p>
      </div>

      <button onClick={onCreateRoom}
        className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
      >
        <Zap size={18} />
        Yangi xona yaratish
      </button>

      <div className="relative flex items-center gap-2">
        <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
        <span className="text-xs text-gray-400 font-medium">YOKI</span>
        <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
      </div>

      <div className="space-y-2">
        <input className="input text-center text-lg font-mono tracking-widest"
          placeholder="XONA ID" value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())} maxLength={6}
        />
        <button onClick={() => onJoinRoom(joinRoomId)} disabled={joinRoomId.trim().length < 4}
          className="btn-secondary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Users size={18} />
          Xonaga qo'shilish
        </button>
      </div>

      <button onClick={onBack} className="btn-secondary w-full py-2 text-sm">Ortga</button>
    </div>
  )
}
