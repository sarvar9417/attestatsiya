import { Users, Loader2 } from 'lucide-react'

// ── Waiting for partner (scenario not selected) ──
export function WaitingPartner({ partnerName, onBack }: { partnerName: string; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 flex items-center justify-center">
        <Users size={36} className="text-yellow-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">⏳ Juftingizni kutish...</h2>
      <p className="text-sm text-gray-500 max-w-md">
        <strong>{partnerName || 'Juftingiz'}</strong> hali stsenariy tanlamadi.
        U scenario tanlab, o'ynaganidan so'ng sizga bildirishnoma keladi.
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Loader2 size={14} className="animate-spin" />
        <span>Juftingizni kutish...</span>
      </div>
      <button onClick={onBack} className="btn-secondary mt-4 py-2.5 px-6 text-sm">Tandemga qaytish</button>
    </div>
  )
}

// ── Waiting after finishing turn ──
export function WaitingAfterTurn({ partnerName, onBack }: { partnerName: string; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
        <Users size={36} className="text-purple-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ajoyib! Sizning navbatingiz tugadi 🎉</h2>
      <p className="text-sm text-gray-500 max-w-md">
        Endi <strong>{partnerName || 'juftingiz'}</strong> ning navbati. U boshlaganida sizga bildirishnoma keladi va natijalarni ko'rishingiz mumkin bo'ladi.
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Loader2 size={14} className="animate-spin" />
        <span>Juftingizni kutish...</span>
      </div>
      <button onClick={onBack} className="btn-secondary mt-4 py-2.5 px-6 text-sm">Tandemga qaytish</button>
    </div>
  )
}

// ── Loading report ──
export function LoadingReport() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="text-6xl mb-4 animate-bounce">🧠</div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Claude ikkalangizni tahlil qilyapti…</h2>
      <p className="text-sm text-gray-500">Ravonlik, yangi so'zlar va xatolar aniqlanmoqda</p>
    </div>
  )
}

// ── User B start screen ──
interface UserBStartProps {
  scenario: { emoji: string; titleUz: string; goalUz: string; userRole: string }
  partnerName: string
  onBack: () => void
  onStart: () => void
}

export function UserBStartScreen({ scenario, partnerName, onBack, onStart }: UserBStartProps) {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <Users size={22} className="text-white" />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">{scenario.emoji} {scenario.titleUz}</h1>
          <p className="text-xs text-gray-500">Navbat sizda!</p>
        </div>
      </div>

      <div className="card p-6 space-y-4 text-center">
        <div className="text-6xl mb-2">{scenario.emoji}</div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sizning navbatingiz!</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          <strong>{partnerName || 'Juftingiz'}</strong> allaqachon o'ynadi. Endi sizning rolingizni o'ynash vaqti!
        </p>
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-4 text-left text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="font-bold mb-1">🎯 Maqsad:</p>
          <p>{scenario.goalUz}</p>
          <p className="font-bold mt-3 mb-1">👤 Sizning rolingiz:</p>
          <p>{scenario.userRole}</p>
        </div>
        <button onClick={onStart} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
          <Users size={22} className="text-white" />
          Boshlash!
        </button>
      </div>
    </div>
  )
}
