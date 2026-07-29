import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Sword, UserPlus, ChevronRight, MessageCircle, HeartHandshake } from 'lucide-react'
import { useTandemStore } from '../../store/tandemSlice'

export default function TandemCard() {
  const navigate = useNavigate()
  const {
    friends,
    pendingInvites,
    tandemPair,
    activeDuels,
    pendingOpponentDuels,
    inviteCode,
    loadingFriends,
    loadingPair,
    loadingDuels,
    loadAll,
  } = useTandemStore()

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const totalPending =
    pendingOpponentDuels.length +
    pendingInvites.filter(i => i.status === 'pending').length

  // ── Loading state ──
  if (loadingFriends || loadingPair || loadingDuels) {
    return (
      <section className="card animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-xl" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
        <div className="h-20 bg-gray-100 rounded-xl" />
      </section>
    )
  }

  // ── Tandem juftlik mavjud ──
  if (tandemPair) {
    return (
      <section className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 overflow-hidden relative">
        {/* Decorative background */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-200/30 rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                <HeartHandshake size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Tandem Juftlik</h3>
                <p className="text-xs text-gray-500">Do'st bilan birga o'rganing</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/tandem')}
              className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all"
            >
              Barchasi <ChevronRight size={12} />
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center border border-indigo-100/50">
              <p className="text-xl font-bold text-indigo-600">{tandemPair.combined_streak}</p>
              <p className="text-xs text-gray-500 mt-0.5">🔥 Birga streak</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center border border-indigo-100/50">
              <p className="text-xl font-bold text-purple-600">{tandemPair.total_xp}</p>
              <p className="text-xs text-gray-500 mt-0.5">⚡ Birga XP</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center border border-indigo-100/50">
              <p className="text-xl font-bold text-amber-600">{activeDuels.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">⚔️ Faol duel</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/tandem')}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl
                bg-indigo-600 text-white text-xs font-semibold
                hover:bg-indigo-700 active:scale-[0.97] transition-all shadow-sm"
            >
              <Sword size={14} />
              Duel o'yna
            </button>
            {totalPending > 0 && (
              <button
                onClick={() => navigate('/tandem')}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl
                  bg-rose-100 text-rose-700 text-xs font-semibold
                  hover:bg-rose-200 active:scale-[0.97] transition-all"
              >
                <MessageCircle size={14} />
                {totalPending}
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  // ── Do'stlar bor, juftlik yo'q ──
  if (friends.length > 0) {
    return (
      <section className="card border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
            <HeartHandshake size={16} className="text-gray-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Tandem Juftlik</h3>
            <p className="text-xs text-gray-500">{friends.length} ta do'st</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-3">
          Do'stingiz bilan juftlik yarating — birgalikda streak oshiring va duel o'ynang!
        </p>

        <button
          onClick={() => navigate('/tandem')}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl
            bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold
            hover:from-indigo-600 hover:to-purple-700 active:scale-[0.97] transition-all shadow-sm"
        >
          <Users size={14} />
          Juftlik yaratish
        </button>
      </section>
    )
  }

  // ── Do'stlar yo'q ──
  return (
    <section className="card border-dashed border-2 border-gray-200 bg-gray-50/50">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <UserPlus size={16} className="text-gray-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Tandem</h3>
          <p className="text-xs text-gray-500">Do'st bilan o'rganing</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Do'st qo'shib, birgalikda ingliz tilini o'rganing. Streak, duel va ko'proq!
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => navigate('/tandem')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl
            bg-gray-900 text-white text-xs font-semibold
            hover:bg-gray-800 active:scale-[0.97] transition-all"
        >
          <UserPlus size={14} />
          Do'st qo'shish
        </button>
        {inviteCode && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/add/${inviteCode}`
              )
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl
              bg-gray-200 text-gray-700 text-xs font-semibold
              hover:bg-gray-300 active:scale-[0.97] transition-all"
          >
            <Users size={14} />
            Kod
          </button>
        )}
      </div>
    </section>
  )
}
