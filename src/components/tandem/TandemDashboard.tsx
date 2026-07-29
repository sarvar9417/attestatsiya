// ═══════════════════════════════════════════════════════════════════════════
// TandemDashboard — Do'stlar, Juftlik Streak, Duellar
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { Users, UserPlus, Copy, Check } from 'lucide-react'
import { monitoring } from '../../lib/monitoring'
import { useTandemStore } from '../../store/tandemSlice'
import { getOrCreateInviteCode, getOrCreateWeeklyDuel, getUserElo, acceptFriendRequest } from '../../services/tandemService'
import { useToastStore } from '../../utils/toastStore'
import AsyncDuel from './AsyncDuel'
import RoleplayDuoPlayer from './RoleplayDuoPlayer'
import FriendNeyronProfile from './FriendNeyronProfile'
import HotSeatDuel from './HotSeatDuel'
import FriendLeaderboard from './FriendLeaderboard'
import TandemJoinByCode from './TandemJoinByCode'
import TandemStreakCard from './TandemStreakCard'
import TandemEloCard from './TandemEloCard'
import TandemWeeklyDuelCard from './TandemWeeklyDuelCard'
import TandemFriendsSection from './TandemFriendsSection'
import TandemDuelLists from './TandemDuelLists'
import TandemRoleplaySection from './TandemRoleplaySection'
import TandemAIDuelSection from './TandemAIDuelSection'
import TandemDuelHistorySection from './TandemDuelHistorySection'
import TandemDuelModal from './TandemDuelModal'
import { createRoleplaySession, getRoleplaySession, getRoleplaySessionsForPair } from '../../services/roleplayDuoService'
import type { DuelMode, Duel, RoleplaySession } from '../../types/tandem'
import type { WeeklyDuelData } from '../../services/tandemService'

export default function TandemDashboard() {
  const {
    friends, pendingInvites, loadingFriends,
    tandemPair,
    activeDuels, duelHistory, pendingOpponentDuels,
    roleplaySessions,
    loadAll, removeFriend, initTandemPair, startDuel, cancelDuel, loadRoleplaySessions,
  } = useTandemStore()
  const [inviteCode, setInviteCode] = useState('')
  const [inviteCopied, setInviteCopied] = useState(false)
  const [showDuelModal, setShowDuelModal] = useState(false)
  const [duelOpponent, setDuelOpponent] = useState<{ id: string; name: string } | null>(null)
  const [duelMode, setDuelMode] = useState<DuelMode>('vocab')
  const [creatingDuel, setCreatingDuel] = useState(false)
  const [activeDuel, setActiveDuel] = useState<Duel | null>(null)
  const [weeklyDuel, setWeeklyDuel] = useState<WeeklyDuelData | null>(null)
  const [weeklyLoading, setWeeklyLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('')
  const [currentUserName, setCurrentUserName] = useState('')
  const [showRoleplayPlayer, setShowRoleplayPlayer] = useState(false)
  const [roleplaySessionData, setRoleplaySessionData] = useState<RoleplaySession | null>(null)
  const [neyronProfileFriend, setNeyronProfileFriend] = useState<{ id: string; name: string } | null>(null)
  const [showHotSeat, setShowHotSeat] = useState(false)
  const [myElo, setMyElo] = useState<{ rating: number; tier: string; matchesPlayed: number; wins: number; losses: number; draws: number } | null>(null)

  // ── Get current user ID for invite code ────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const { supabase } = await import('../../lib/supabase')
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user.id) {
          setCurrentUserId(session.user.id)
          const { data: userData } = await supabase
            .from('users')
            .select('name')
            .eq('id', session.user.id)
            .single()
          if (userData?.name) setCurrentUserName(userData.name)
          const code = await getOrCreateInviteCode(session.user.id)
          setInviteCode(code)
        }
      } catch { /* ignore */ }
    }
    init()
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  useEffect(() => {
    if (!currentUserId) return
    getUserElo(currentUserId).then(setMyElo).catch((e: unknown) => {
      monitoring.captureMessage('getUserElo failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    })
  }, [currentUserId])

  useEffect(() => {
    if (tandemPair) loadRoleplaySessions()
  }, [tandemPair, loadRoleplaySessions])

  useEffect(() => {
    if (!tandemPair) { setWeeklyDuel(null); return }
    setWeeklyLoading(true)
    getOrCreateWeeklyDuel(tandemPair.id).then((wd) => {
      setWeeklyDuel(wd)
      setWeeklyLoading(false)
    }).catch(() => setWeeklyLoading(false))
  }, [tandemPair])


  const copyInviteLink = () => {
    const link = `${window.location.origin}/add/${inviteCode}`
    navigator.clipboard.writeText(link)
    setInviteCopied(true)
    setTimeout(() => setInviteCopied(false), 2000)
    useToastStore.getState().toast('🔗 Havola nusxalandi!', 'success')
  }

  const handleStartDuel = async () => {
    if (!duelOpponent) return
    if (duelMode === 'hotseat') {
      setShowDuelModal(false)
      setShowHotSeat(true)
      return
    }
    setCreatingDuel(true)
    const duel = await startDuel(duelOpponent.id, duelMode)
    if (duel) {
      useToastStore.getState().toast('⚔️ Duel boshlandi!', 'success')
      setShowDuelModal(false)
      setActiveDuel(duel)
    } else {
      useToastStore.getState().toast('Duel yaratishda xatolik', 'error')
    }
    setCreatingDuel(false)
  }

  const handleAIDuel = async (mode: DuelMode) => {
    if (mode === 'hotseat') {
      setShowHotSeat(true)
      return
    }
    setCreatingDuel(true)
    const duel = await startDuel(null, mode)
    if (duel) {
      useToastStore.getState().toast('⚔️ AI bilan duel boshlandi!', 'success')
      setActiveDuel(duel)
    } else {
      useToastStore.getState().toast('Duel yaratishda xatolik', 'error')
    }
    setCreatingDuel(false)
  }

  const handleRoleplayDuo = async () => {
    if (!tandemPair) return
    setCreatingDuel(true)

    try {
      const { supabase } = await import('../../lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user.id) { setCreatingDuel(false); return }

      const pendingSessions = await getRoleplaySessionsForPair()
      const incomplete = pendingSessions.filter(s => s.status !== 'completed')

      if (incomplete.length > 0) {
        const fresh = await getRoleplaySession(incomplete[0].id)
        if (fresh) {
          if (fresh.creator_id !== session.user.id && fresh.scenario_id === 'pending') {
            useToastStore.getState().toast(
              "⏳ Juftingiz hali stsenariy tanlamagan. U tanlagach, sizga bildirishnoma keladi.",
              'info', 5000,
            )
            setCreatingDuel(false)
            return
          }
          setRoleplaySessionData(fresh)
          setShowRoleplayPlayer(true)
          setCreatingDuel(false)
          return
        }
      }

      const result = await createRoleplaySession(tandemPair.id, 'pending')
      if (result.success && result.session) {
        setRoleplaySessionData(result.session)
        setShowRoleplayPlayer(true)
      } else {
        useToastStore.getState().toast(
          result.error || "Roleplay session yaratishda xatolik. Iltimos, qayta urinib ko'ring.",
          'error',
        )
      }
    } catch {
      useToastStore.getState().toast('Roleplay yaratishda xatolik yuz berdi', 'error')
    }

    setCreatingDuel(false)
  }

  // ── Render full-screen sub-views ──────────────────────────────

  if (showRoleplayPlayer && roleplaySessionData) {
    return (
      <RoleplayDuoPlayer
        session={roleplaySessionData}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        isCreator={roleplaySessionData.creator_id === currentUserId}
        onBack={() => { setShowRoleplayPlayer(false); setRoleplaySessionData(null); loadAll() }}
        onComplete={() => { setShowRoleplayPlayer(false); setRoleplaySessionData(null); loadAll() }}
      />
    )
  }

  if (showHotSeat) {
    return <HotSeatDuel onBack={() => { setShowHotSeat(false); loadAll() }} />
  }

  if (activeDuel) {
    const userRole = activeDuel.challenger === currentUserId ? 'challenger' : 'opponent'
    return (
      <AsyncDuel
        duel={activeDuel}
        mode={activeDuel.mode}
        userRole={userRole}
        onComplete={() => { setActiveDuel(null); loadAll() }}
      />
    )
  }

  const streak = tandemPair?.combined_streak ?? 0

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 animate-page-enter">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 dark:shadow-purple-900/30">
            <Users size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tandem</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Do'stingiz bilan birga o'rganing — streak, duel va AI hakam
        </p>
      </div>

      {/* Invite Section */}
      <div className="card p-5 space-y-3 border-2 border-dashed border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/30 to-transparent dark:from-purple-950/20">
        <div className="flex items-center gap-2">
          <UserPlus size={18} className="text-purple-500" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Do'st taklif qilish</h3>
        </div>
        <p className="text-xs text-gray-500">
          Taklif havolangizni do'stingizga yuboring yoki uning kodini kiriting
        </p>
        <div className="flex gap-2">
          <button onClick={copyInviteLink} className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5">
            {inviteCopied ? <Check size={16} /> : <Copy size={16} />}
            {inviteCopied ? 'Nusxalandi!' : 'Havolani nusxalash'}
          </button>
        </div>
        <TandemJoinByCode onJoined={loadAll} />
      </div>

      {/* Tandem Streak Card */}
      {tandemPair && (
        <TandemStreakCard
          streak={streak}
          totalXp={tandemPair.total_xp}
          lastBothActive={tandemPair.last_both_active}
        />
      )}

      {/* Elo Rating Card */}
      {myElo && (
        <TandemEloCard
          rating={myElo.rating}
          tier={myElo.tier}
          matchesPlayed={myElo.matchesPlayed}
          wins={myElo.wins}
          losses={myElo.losses}
          draws={myElo.draws}
        />
      )}

      {/* Weekly Duel Card */}
      {tandemPair && (
        <TandemWeeklyDuelCard
          currentUserId={currentUserId}
          tandemPair={tandemPair}
          weeklyDuel={weeklyDuel}
          weeklyLoading={weeklyLoading}
        />
      )}

      {/* Friends + Pending Invites */}
      <TandemFriendsSection
        friends={friends}
        pendingInvites={pendingInvites}
        tandemPair={tandemPair}
        loadingFriends={loadingFriends}
        onNeyronProfile={(id, name) => setNeyronProfileFriend({ id, name })}
        onInitTandem={initTandemPair}
        onDuelOpponent={(id, name) => { setDuelOpponent({ id, name }); setShowDuelModal(true) }}
        onRemoveFriend={removeFriend}
        onAcceptInvite={async (fid) => { await acceptFriendRequest(fid) }}
        onRefresh={loadAll}
      />

      {/* Leaderboard */}
      <FriendLeaderboard />

      {/* Pending + Active Duels */}
      <TandemDuelLists
        pendingOpponentDuels={pendingOpponentDuels}
        activeDuels={activeDuels}
        onSetActiveDuel={setActiveDuel}
        onCancelDuel={cancelDuel}
      />

      {/* AI Roleplay Duo + History */}
      <TandemRoleplaySection
        tandemPair={tandemPair}
        creatingDuel={creatingDuel}
        roleplaySessions={roleplaySessions}
        onStartRoleplay={handleRoleplayDuo}
      />

      {/* AI Duel */}
      <TandemAIDuelSection creatingDuel={creatingDuel} onAIDuel={handleAIDuel} />

      {/* Duel History */}
      <TandemDuelHistorySection duelHistory={duelHistory} />

      {/* Neyron Profil Modal */}
      {neyronProfileFriend && (
        <FriendNeyronProfile
          friendId={neyronProfileFriend.id}
          friendName={neyronProfileFriend.name}
          onClose={() => setNeyronProfileFriend(null)}
        />
      )}

      {/* Duel Modal */}
      {showDuelModal && duelOpponent && (
        <TandemDuelModal
          name={duelOpponent.name}
          duelMode={duelMode}
          creatingDuel={creatingDuel}
          onModeChange={setDuelMode}
          onStart={handleStartDuel}
          onClose={() => setShowDuelModal(false)}
        />
      )}

      {/* Tandem info footer */}
      <div className="text-center text-xs text-gray-400 space-y-1 pb-4">
        <p>Tandem — do'stingiz bilan birga ingliz tilini o'rganing</p>
        <p>Juftlik Streak, Async Duel va AI hakam bilan</p>
      </div>
    </div>
  )
}
