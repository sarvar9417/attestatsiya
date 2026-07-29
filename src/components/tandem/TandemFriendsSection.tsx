import { Users, Loader2, UserPlus, Target, Link as LinkIcon, Sword, UserX, Clock } from 'lucide-react'
import { StatusDot } from './tandemHelpers'
import type { FriendWithProfile } from '../../types/tandem'

interface TandemFriendsSectionProps {
  friends: FriendWithProfile[]
  pendingInvites: FriendWithProfile[]
  tandemPair: { id: string } | null
  loadingFriends: boolean
  onNeyronProfile: (id: string, name: string) => void
  onInitTandem: (userId: string) => void
  onDuelOpponent: (id: string, name: string) => void
  onRemoveFriend: (friendshipId: string) => void
  onAcceptInvite: (friendshipId: string) => void
  onRefresh: () => void
}

export default function TandemFriendsSection({
  friends, pendingInvites, tandemPair, loadingFriends,
  onNeyronProfile, onInitTandem, onDuelOpponent, onRemoveFriend, onAcceptInvite, onRefresh,
}: TandemFriendsSectionProps) {
  return (
    <>
      {/* Friends List */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Do'stlar ({friends.length})</h3>
          </div>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-4">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <UserPlus size={32} className="mx-auto text-gray-300" />
            <p className="text-sm text-gray-500">Hali do'st qo'shilmagan</p>
            <p className="text-xs text-gray-400">
              Do'stingiz bilan tandem yaratish uchun taklif havolasini yuboring
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.friendshipId}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{friend.name}</p>
                      <StatusDot lastActive={friend.lastActive} />
                    </div>
                    <p className="text-xs text-gray-400">{friend.level} · {friend.streak} kunlik streak</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onNeyronProfile(friend.userId, friend.name)}
                    className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 hover:bg-indigo-100 transition-colors"
                    title="Neyron Profil"
                  >
                    <Target size={14} />
                  </button>
                  {!tandemPair && (
                    <button
                      onClick={() => onInitTandem(friend.userId)}
                      className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 hover:bg-purple-200 transition-colors"
                      title="Tandem yaratish"
                    >
                      <LinkIcon size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => onDuelOpponent(friend.userId, friend.name)}
                    className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 hover:bg-orange-200 transition-colors"
                    title="Duelga chaqirish"
                  >
                    <Sword size={14} />
                  </button>
                  <button
                    onClick={() => onRemoveFriend(friend.friendshipId)}
                    className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 transition-colors"
                    title="O'chirish"
                  >
                    <UserX size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="card p-5 space-y-3 border-2 border-yellow-100 dark:border-yellow-900/50">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-yellow-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              Kutilayotgan takliflar ({pendingInvites.length})
            </h3>
          </div>
          {pendingInvites.map((invite) => (
            <div key={invite.friendshipId} className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {invite.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{invite.name}</p>
                  <p className="text-xs text-gray-400">{invite.level}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  await onAcceptInvite(invite.friendshipId)
                  onRefresh()
                }}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Qabul qilish
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
