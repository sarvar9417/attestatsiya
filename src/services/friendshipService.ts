// ═══════════════════════════════════════════════════════════════════════════
// friendshipService.ts — Do'stlik CRUD + Leaderboard
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'
import { sendBrowserNotification } from '../hooks/useNotifications'
import type { FriendshipStatus } from '../types/tandem'
import { lookupUserIdByInviteCode } from './inviteCodeService'

// ─── Helpers ─────────────────────────────────────────────────────────────

async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user.id ?? null
}

// ═══════════════════════════════════════════════════════════════════════════
//  DO'STLIK (Friendship)
// ═══════════════════════════════════════════════════════════════════════════

/** Invite kodi orqali do'st qo'shish (xavfsiz — random kod, base64 emas) */
export async function addFriendByCode(code: string): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  // Random invite code orqali foydalanuvchini topamiz
  let inviterId = await lookupUserIdByInviteCode(code)

  // Agar yangi random kod topilmasa — eski base64 kod bo'lishi mumkin (backward compat)
  if (!inviterId) {
    try {
      const decoded = atob(code)
      if (decoded.length > 20 && decoded.includes('-')) {
        inviterId = decoded
      }
    } catch (e) {
      monitoring.captureMessage('addFriendByCode base64 decode failed (expected): ' + (e instanceof Error ? e.message : String(e)), 'info')
    }
  }

  if (!inviterId) {
    return { success: false, error: 'Noto\'g\'ri taklif kodi' }
  }

  if (inviterId === userId) {
    return { success: false, error: 'O\'zingizni qo\'sha olmaysiz' }
  }

  // Mavjud do'stlik yozuvlarini ikki tomondan tekshirish
  const { data: rows } = await supabase
    .from('friendships')
    .select('id, status, user_id, friend_id')
    .or(`and(user_id.eq.${userId},friend_id.eq.${inviterId}),and(user_id.eq.${inviterId},friend_id.eq.${userId})`)
    .limit(5)

  const existing = (rows ?? [])[0] ?? null
  const extras = (rows ?? []).slice(1)

  // Agar bir nechta yozuv bo'lsa — duplikatlarni o'chiramiz
  if (extras.length > 0) {
    const ids = extras.map(r => r.id)
    const { error: deleteError } = await supabase.from('friendships').delete().in('id', ids)
    if (deleteError) monitoring.captureMessage('addFriendByCode cleanup error: ' + deleteError.message, 'warn')
  }

  if (existing) {
    if (existing.status === 'accepted') {
      return { success: false, error: 'Bu foydalanuvchi allaqachon do\'stingiz' }
    }
    const { error: acceptError } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', existing.id as string)

    if (acceptError) {
      monitoring.captureMessage('addFriendByCode accept error: ' + acceptError.message, 'error')
      return { success: false, error: 'Xatolik yuz berdi' }
    }

    sendBrowserNotification('🤝 Do\'stlik tasdiqlandi!', {
      body: 'Endi tandem yaratishingiz mumkin',
      url: '/tandem',
    })
    return { success: true }
  }

  const { error: upsertError } = await supabase
    .from('friendships')
    .upsert(
      { user_id: userId, friend_id: inviterId, status: 'accepted' },
      { onConflict: 'user_id,friend_id' }
    )

  if (upsertError) {
    monitoring.captureMessage('addFriendByCode upsert error: ' + upsertError.message, 'error')
    return { success: false, error: 'Do\'st qo\'shishda xatolik: ' + upsertError.message }
  }

  sendBrowserNotification('🤝 Yangi do\'st!', {
    body: 'Siz do\'stlar ro\'yxatiga qo\'shildingiz',
    url: '/tandem',
  })
  return { success: true }
}

/** Do'st taklifini yuborish (user_id orqali) */
export async function sendFriendRequest(friendId: string): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  const { error } = await supabase
    .from('friendships')
    .upsert(
      { user_id: userId, friend_id: friendId, status: 'pending' },
      { onConflict: 'user_id,friend_id' }
    )

  if (error) {
    monitoring.captureMessage('sendFriendRequest error: ' + error.message, 'error')
    return { success: false, error: 'Taklif yuborishda xatolik' }
  }

  sendBrowserNotification('📨 Do\'stlik taklifi yuborildi', {
    body: 'Taklifingiz do\'stingizga yetkazildi',
    url: '/tandem',
  })

  return { success: true }
}

/** Do'st taklifini qabul qilish */
export async function acceptFriendRequest(friendshipId: string): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  const { error } = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId)
    .eq('friend_id', userId)

  if (error) {
    monitoring.captureMessage('acceptFriendRequest error: ' + error.message, 'error')
    return { success: false, error: 'Qabul qilishda xatolik' }
  }

  return { success: true }
}

/** Do'stni o'chirish */
export async function removeFriend(friendshipId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)

  if (error) {
    monitoring.captureMessage('removeFriend error: ' + error.message, 'error')
    return { success: false, error: 'O\'chirishda xatolik' }
  }

  return { success: true }
}

/** Do'stlar ro'yxatini olish (profillari bilan) */
export async function getFriends(): Promise<{
  id: string
  name: string
  level: string
  streak: number
  last_active: string | null
  status: FriendshipStatus
  friendship_id: string
}[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('friendships')
    .select(`
      id,
      status,
      user_id,
      friend_id,
      friend:friend_id(id, name, level, streak, last_active),
      inviter:user_id(id, name, level, streak, last_active)
    `)
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .in('status', ['pending', 'accepted'])

  if (error) {
    monitoring.captureMessage('getFriends error: ' + error.message, 'warn')
    return []
  }

  const friends: {
    id: string
    name: string
    level: string
    streak: number
    last_active: string | null
    status: FriendshipStatus
    friendship_id: string
  }[] = []

  for (const row of data ?? []) {
    const rowData = row
    const friendData = userId === rowData.user_id
      ? rowData.friend
      : rowData.inviter

    if (friendData && typeof friendData === 'object' && 'id' in friendData) {
      const f = friendData as Record<string, unknown>
      friends.push({
        id: f.id as string,
        name: f.name as string,
        level: f.level as string,
        streak: (f.streak as number) ?? 0,
        last_active: f.last_active as string | null,
        status: rowData.status as FriendshipStatus,
        friendship_id: rowData.id as string,
      })
    }
  }

  return friends
}

// ═══════════════════════════════════════════════════════════════════════════
//  LEADERBOARD (Do'stlar orasida XP/Streak reytingi)
// ═══════════════════════════════════════════════════════════════════════════

export interface LeaderboardEntry {
  userId: string
  name: string
  level: string
  totalXP: number
  streak: number
  isCurrentUser: boolean
}

/**
 * Joriy foydalanuvchi va do'stlarini XP bo'yicha tartiblangan leaderboard qaytaradi.
 * Reyting: eng katta XP dan kichikga.
 */
export async function getFriendLeaderboard(): Promise<LeaderboardEntry[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    const { data: userData } = await supabase
      .from('users')
      .select('id, name, level, total_xp, streak')
      .eq('id', userId)
      .single()

    if (!userData) return []

    const friends = await getFriends()
    const friendIds = friends
      .filter(f => f.status === 'accepted')
      .map(f => f.id)

    if (friendIds.length === 0) {
      return [{
        userId: userData.id as string,
        name: userData.name as string,
        level: userData.level as string,
        totalXP: userData.total_xp as number,
        streak: userData.streak as number,
        isCurrentUser: true,
      }]
    }

    const { data: friendsData } = await supabase
      .from('users')
      .select('id, name, level, total_xp, streak')
      .in('id', friendIds)

    const entries: LeaderboardEntry[] = []

    entries.push({
      userId: userData.id as string,
      name: userData.name as string,
      level: userData.level as string,
      totalXP: userData.total_xp as number,
      streak: userData.streak as number,
      isCurrentUser: true,
    })

    for (const friend of friendsData ?? []) {
      entries.push({
        userId: friend.id as string,
        name: friend.name as string,
        level: friend.level as string,
        totalXP: friend.total_xp as number,
        streak: friend.streak as number,
        isCurrentUser: false,
      })
    }

    entries.sort((a, b) => b.totalXP - a.totalXP)
    return entries
  } catch (e) {
    monitoring.captureMessage('getFriendLeaderboard failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  DARS TAVSIYALARI (Friends' Lesson Progress)
// ═══════════════════════════════════════════════════════════════════════════

export interface FriendLessonProgress {
  friendId: string
  friendName: string
  lessons: { lessonId: string; lessonTitle: string; score: number }[]
}

/**
 * Do'stlarning dars progressini olib, foydalanuvchi hali o'tmagan darslarni qaytaradi.
 */
export async function getFriendsLessonRecommendations(
  userProgress: Record<string, number>,
): Promise<FriendLessonProgress[]> {
  const userId = await getUserId()
  if (!userId) return []

  const friends = await getFriends()
  const acceptedFriends = friends.filter((f) => f.status === 'accepted')
  if (acceptedFriends.length === 0) return []

  const friendIds = acceptedFriends.map((f) => f.id)
  const friendNameMap = new Map(acceptedFriends.map((f) => [f.id, f.name]))

  try {
    const { data } = await supabase
      .from('lesson_progress')
      .select('user_id, lesson_id, score')
      .in('user_id', friendIds)

    if (!data || data.length === 0) return []

    const friendLessons = new Map<string, { lessonId: string; lessonTitle: string; score: number }[]>()
    for (const row of data) {
      const fId = row.user_id as string
      const lessonId = row.lesson_id as string
      if (lessonId.endsWith('__test')) continue
      if (userProgress[lessonId] !== undefined) continue
      if (!friendLessons.has(fId)) friendLessons.set(fId, [])
      friendLessons.get(fId)!.push({
        lessonId,
        lessonTitle: '',
        score: row.score as number,
      })
    }

    const result: FriendLessonProgress[] = []
    for (const [fId, lessons] of friendLessons) {
      if (lessons.length === 0) continue
      result.push({
        friendId: fId,
        friendName: friendNameMap.get(fId) ?? 'Do\'st',
        lessons,
      })
    }
    return result
  } catch (e) {
    monitoring.captureMessage('getFriendsLessonRecommendations failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}
