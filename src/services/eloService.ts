// ═══════════════════════════════════════════════════════════════════════════
// eloService.ts — Tandem Elo Rating
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'
import { calculateElo, duelScoreToEloScore, INITIAL_ELO, getEloTier } from '../utils/eloRating'

// ─── Helpers ─────────────────────────────────────────────────────────────

async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user.id ?? null
}

// ═══════════════════════════════════════════════════════════════════════════
//  ELO RATING
// ═══════════════════════════════════════════════════════════════════════════

/** Foydalanuvchining Elo ratingini olish */
export async function getUserElo(userId: string): Promise<{
  rating: number
  tier: string
  matchesPlayed: number
  wins: number
  losses: number
  draws: number
}> {
  try {
    const { data, error } = await supabase
      .from('user_elo')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error

    if (data) {
      const rating = data.rating as number
      return {
        rating,
        tier: getEloTier(rating),
        matchesPlayed: (data.matches_played as number) ?? 0,
        wins: (data.wins as number) ?? 0,
        losses: (data.losses as number) ?? 0,
        draws: (data.draws as number) ?? 0,
      }
    }

    return { rating: INITIAL_ELO, tier: getEloTier(INITIAL_ELO), matchesPlayed: 0, wins: 0, losses: 0, draws: 0 }
  } catch (e) {
    monitoring.captureMessage('getUserElo failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return { rating: INITIAL_ELO, tier: getEloTier(INITIAL_ELO), matchesPlayed: 0, wins: 0, losses: 0, draws: 0 }
  }
}

/** Duel tugagandan keyin Elo ratingni yangilash */
export async function updateEloAfterDuel(
  userId: string,
  opponentId: string | null,
  myScore: number,
  theirScore: number,
  duelId: string,
  opponentName: string = 'Raqib',
): Promise<{ myNewRating: number; change: number }> {
  try {
    const myElo = await getUserElo(userId)
    let theirRating = INITIAL_ELO

    if (opponentId && opponentId !== 'ai') {
      const theirElo = await getUserElo(opponentId)
      theirRating = theirElo.rating
    }

    const { my, their } = duelScoreToEloScore(myScore, theirScore)
    const result = calculateElo(myElo.rating, theirRating, my, their)

    const myChange = result.changeA
    const myNewRating = result.playerA

    await supabase
      .from('user_elo')
      .upsert({
        user_id: userId,
        rating: myNewRating,
        matches_played: myElo.matchesPlayed + 1,
        wins: myElo.wins + (my === 1 ? 1 : 0),
        losses: myElo.losses + (my === 0 ? 1 : 0),
        draws: myElo.draws + (my === 0.5 ? 1 : 0),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    const resultLabel = my === 1 ? 'win' : my === 0.5 ? 'draw' : 'loss'
    await supabase
      .from('elo_history')
      .insert({
        user_id: userId,
        duel_id: duelId,
        old_rating: myElo.rating,
        new_rating: myNewRating,
        change: myChange,
        opponent_name: opponentName,
        result: resultLabel,
      })

    if (opponentId && opponentId !== 'ai' && opponentId !== userId) {
      const theirNewRating = result.playerB
      const theirEloData = await getUserElo(opponentId)

      await supabase
        .from('user_elo')
        .upsert({
          user_id: opponentId,
          rating: theirNewRating,
          matches_played: theirEloData.matchesPlayed + 1,
          wins: theirEloData.wins + (their === 1 ? 1 : 0),
          losses: theirEloData.losses + (their === 0 ? 1 : 0),
          draws: theirEloData.draws + (their === 0.5 ? 1 : 0),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
    }

    return { myNewRating, change: myChange }
  } catch (e) {
    monitoring.captureMessage('updateEloAfterDuel failed: ' + (e instanceof Error ? e.message : String(e)), 'error')
    return { myNewRating: INITIAL_ELO, change: 0 }
  }
}

/** Foydalanuvchining Elo tarixini olish (oxirgi 20 ta) */
export async function getEloHistory(userId: string): Promise<{
  id: string
  oldRating: number
  newRating: number
  change: number
  opponentName: string
  result: string
  createdAt: string
}[]> {
  try {
    const { data, error } = await supabase
      .from('elo_history')
      .select('id, old_rating, new_rating, change, opponent_name, result, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return (data ?? []).map(r => ({
      id: r.id,
      oldRating: r.old_rating,
      newRating: r.new_rating,
      change: r.change,
      opponentName: r.opponent_name,
      result: r.result,
      createdAt: r.created_at ?? '',
    }))
  } catch (e) {
    monitoring.captureMessage('getEloHistory failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  ELO LEADERBOARD
// ═══════════════════════════════════════════════════════════════════════════

export interface EloLeaderboardEntry {
  userId: string
  name: string
  level: string
  elo: number
  tier: string
  wins: number
  losses: number
  matchesPlayed: number
  isCurrentUser: boolean
}

/** Elo bo'yicha leaderboard (do'stlar orasida) */
export async function getEloLeaderboard(): Promise<EloLeaderboardEntry[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    const { getFriends } = await import('./friendshipService')
    const friends = await getFriends()
    const acceptedFriendIds = friends.filter(f => f.status === 'accepted').map(f => f.id)
    const allIds = [userId, ...acceptedFriendIds]

    const { data: eloData } = await supabase
      .from('user_elo')
      .select('user_id, rating, matches_played, wins, losses, draws')
      .in('user_id', allIds)

    const eloMap = new Map<string, { rating: number; matchesPlayed: number; wins: number; losses: number; draws: number }>()
    for (const row of (eloData ?? [])) {
      eloMap.set(row.user_id as string, {
        rating: (row.rating as number) ?? INITIAL_ELO,
        matchesPlayed: (row.matches_played as number) ?? 0,
        wins: (row.wins as number) ?? 0,
        losses: (row.losses as number) ?? 0,
        draws: (row.draws as number) ?? 0,
      })
    }

    const { data: usersData } = await supabase
      .from('users')
      .select('id, name, level')
      .in('id', allIds)

    const entries: EloLeaderboardEntry[] = []

    for (const user of (usersData ?? [])) {
      const uId = user.id as string
      const eloInfo = eloMap.get(uId) ?? { rating: INITIAL_ELO, matchesPlayed: 0, wins: 0, losses: 0, draws: 0 }

      entries.push({
        userId: uId,
        name: user.name as string,
        level: user.level as string,
        elo: eloInfo.rating,
        tier: getEloTier(eloInfo.rating),
        wins: eloInfo.wins,
        losses: eloInfo.losses,
        matchesPlayed: eloInfo.matchesPlayed,
        isCurrentUser: uId === userId,
      })
    }

    entries.sort((a, b) => b.elo - a.elo)
    return entries
  } catch (e) {
    monitoring.captureMessage('getEloLeaderboard failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}
