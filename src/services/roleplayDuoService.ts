// ═══════════════════════════════════════════════════════════════════════════
// roleplayDuoService.ts — Tandem AI Roleplay Duo (2 do'st + AI hakam)
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { monitoring } from '../lib/monitoring'
import { sendBrowserNotification } from '../hooks/useNotifications'
import { getScenario } from '../data/conversationScenarios'
import type { RoleplaySession, RoleplaySessionStatus, RoleplayEvaluation, RoleplayDuoItem } from '../types/tandem'

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user.id ?? null
}

async function getUserName(userId: string): Promise<string> {
  const { data } = await supabase
    .from('users')
    .select('name')
    .eq('id', userId)
    .single()
  return data?.name ?? 'Foydalanuvchi'
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CRUD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Yangi Roleplay Duo session yaratadi.
 * Creator = User A, juft = User B (tandem pair orqali).
 */
export async function createRoleplaySession(
  pairId: string,
  scenarioId: string,
): Promise<{ success: boolean; session?: RoleplaySession; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  // Pair'ning ikkinchi a'zosini topamiz
  const { data: pair } = await supabase
    .from('tandem_pairs')
    .select('user_a, user_b')
    .eq('id', pairId)
    .single()

  if (!pair) return { success: false, error: 'Tandem juftlik topilmadi' }

  // 24 soat ichida tugashi kerak
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  // Try Supabase first, fallback to localStorage
  try {
    const { data, error } = await supabase
      .from('roleplay_sessions')
      .insert({
        pair_id: pairId,
        scenario_id: scenarioId,
        creator_id: userId,
        status: 'invited',
        user_a_messages: [],
        user_b_messages: [],
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (error) throw error

    // Juftga notification
    const creatorName = await getUserName(userId)
    sendBrowserNotification('🎭 Yangi Roleplay Duo!', {
      body: `${creatorName} sizni tandem rolli o'yinga taklif qildi!`,
      url: '/tandem',
    })

    return { success: true, session: data as RoleplaySession }
  } catch (e) {
    monitoring.captureMessage('createRoleplaySession failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return { success: false, error: 'Roleplay session yaratishda xatolik. Iltimos, qayta urinib ko\'ring.' }
  }
}

/**
 * Sessionni ID bo'yicha olish.
 */
export async function getRoleplaySession(
  sessionId: string,
): Promise<RoleplaySession | null> {
  try {
    const { data, error } = await supabase
      .from('roleplay_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error) throw error
    return data as RoleplaySession
  } catch (e) {
    monitoring.captureMessage('getRoleplaySession failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return null
  }
}

/**
 * Joriy tandem juftlik uchun barcha roleplay sessionlarni olish.
 */
export async function getRoleplaySessionsForPair(): Promise<RoleplaySession[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    const { data: pair, error: pairError } = await supabase
      .from('tandem_pairs')
      .select('id')
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .maybeSingle()

    if (pairError) {
      monitoring.captureMessage('getRoleplaySessionsForPair pair error: ' + pairError.message, 'warn')
      return []
    }
    if (!pair) return []

    const { data, error } = await supabase
      .from('roleplay_sessions')
      .select('*')
      .eq('pair_id', pair.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return (data ?? []) as RoleplaySession[]
  } catch (e) {
    monitoring.captureMessage('getRoleplaySessionsForPair failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}

/**
 * Session statusini yangilash.
 */
export async function updateSessionStatus(
  sessionId: string,
  status: RoleplaySessionStatus,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('roleplay_sessions')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    if (error) throw error
    return true
  } catch (e) {
    monitoring.captureMessage('updateSessionStatus failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}

/**
 * Scenario ID ni yangilash (User A scenario tanlaganida).
 */
export async function updateSessionScenario(
  sessionId: string,
  scenarioId: string,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('roleplay_sessions')
      .update({
        scenario_id: scenarioId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    if (error) throw error
    return true
  } catch (e) {
    monitoring.captureMessage('updateSessionScenario failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}

/**
 * User A (creator) ning suhbat xabarlarini saqlash.
 */
export async function saveUserAMessages(
  sessionId: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('roleplay_sessions')
      .update({
        user_a_messages: db.toJson(messages),
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    if (error) throw error
    return true
  } catch (e) {
    monitoring.captureMessage('saveUserAMessages failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}

/**
 * User B (juft) ning suhbat xabarlarini saqlash.
 */
export async function saveUserBMessages(
  sessionId: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('roleplay_sessions')
      .update({
        user_b_messages: db.toJson(messages),
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    if (error) throw error
    return true
  } catch (e) {
    monitoring.captureMessage('saveUserBMessages failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}

/**
 * Ikkala foydalanuvchining baholarini saqlash.
 */
export async function saveRoleplayEvaluations(
  sessionId: string,
  userAEvaluation: RoleplayEvaluation,
  userBEvaluation: RoleplayEvaluation,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('roleplay_sessions')
      .update({
        user_a_evaluation: db.toJson(userAEvaluation),
        user_b_evaluation: db.toJson(userBEvaluation),
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    if (error) throw error
    return true
  } catch (e) {
    monitoring.captureMessage('saveRoleplayEvaluations failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}

/**
 * User A tugatgandan keyin User B ga notification yuborish.
 */
export async function notifyUserBRoleplayPending(sessionId: string): Promise<void> {
  const session = await getRoleplaySession(sessionId)
  if (!session) return

  const { data: pairData, error: pairError } = await supabase
    .from('tandem_pairs')
    .select('user_a, user_b')
    .eq('id', session.pair_id)
    .single()

  if (pairError || !pairData) {
    monitoring.captureMessage('notifyUserBRoleplayPending pair error: ' + (pairError?.message ?? 'not found'), 'warn')
    return
  }

  const creatorName = await getUserName(session.creator_id)
  const scenario = getScenario(session.scenario_id)

  sendBrowserNotification(`🎭 ${creatorName} rolingizni kutmoqda!`, {
    body: `"${scenario?.titleUz ?? 'Roleplay'}" — sizning navbatingiz!`,
    url: '/tandem',
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
//  UI helper
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Roleplay sessionlarni UI list item'lariga aylantirish.
 */
export function sessionsToDuoItems(
  sessions: RoleplaySession[],
  currentUserId: string,
): RoleplayDuoItem[] {
  return sessions.map((s) => {
    const scenario = getScenario(s.scenario_id)

    // Navbat kimda?
    let myTurn = false
    if (s.status === 'invited' || s.status === 'user_a_playing') {
      myTurn = s.creator_id === currentUserId
    } else if (s.status === 'user_a_done' || s.status === 'user_b_playing') {
      myTurn = s.creator_id !== currentUserId
    } else {
      // completed, user_b_done — hech kimning navbati emas
      myTurn = false
    }

    // Ballar (evaluation fluency asosida)
    const scoreA = s.user_a_evaluation
      ? Math.round((s.user_a_evaluation.fluency + s.user_a_evaluation.taskSuccess) / 2)
      : null
    const scoreB = s.user_b_evaluation
      ? Math.round((s.user_b_evaluation.fluency + s.user_b_evaluation.taskSuccess) / 2)
      : null

    return {
      id: s.id,
      scenarioTitle: scenario?.titleUz ?? 'Noma\'lum scenario',
      scenarioEmoji: scenario?.emoji ?? '🎭',
      status: s.status,
      creatorName: '',
      myTurn,
      scoreA,
      scoreB,
      createdAt: s.created_at,
    }
  })
}

/**
 * Joriy foydalanuvchi uchun kutilayotgan (pending) roleplay sessionlar.
 */
export async function getPendingRoleplaySessions(): Promise<RoleplayDuoItem[]> {
  const userId = await getUserId()
  if (!userId) return []

  const sessions = await getRoleplaySessionsForPair()
  const items = sessionsToDuoItems(sessions, userId)
  return items.filter((item) => item.myTurn && !['completed'].includes(item.status))
}

/**
 * AI orqali ikkala o'yinchini baholash.
 */
export async function evaluateDuoRoleplay(
  sessionId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getRoleplaySession(sessionId)
    if (!session) return { success: false, error: 'Session topilmadi' }

    // Idempotensiya: allaqachon baholangan bo'lsa, qimmat AI hisobotini
    // (generateDuoRoleplayReport) qayta generatsiya qilmaymiz — retry/ikki marta
    // chaqiruvda takror Claude xarajatining oldini oladi.
    if (session.status === 'completed') return { success: true }

    const scenario = getScenario(session.scenario_id)
    if (!scenario) return { success: false, error: 'Scenario topilmadi' }

    // Pair ma'lumotlarini olish
    const { data: pair } = await supabase
      .from('tandem_pairs')
      .select('user_a, user_b')
      .eq('id', session.pair_id)
      .single()

    if (!pair) return { success: false, error: 'Juftlik topilmadi' }

    // Foydalanuvchi ismlarini olish
    const [userAName, userBName] = await Promise.all([
      getUserName(pair.user_a),
      getUserName(pair.user_b),
    ])

    const { generateDuoRoleplayReport } = await import('../lib/claude')

    const level = 'B1' // Default — keyinroq foydalanuvchi levelidan olinadi

    const result = await generateDuoRoleplayReport(
      {
        aiRole: scenario.aiRole,
        userRole: scenario.userRole,
        opening: scenario.opening,
        title: scenario.title,
      },
      scenario.goalUz,
      level,
      userAName,
      userBName,
      session.user_a_messages,
      session.user_b_messages,
    )

    // Save to DB
    const saved = await saveRoleplayEvaluations(sessionId, result.userA, result.userB)
    if (!saved) return { success: false, error: 'Baholarni saqlashda xatolik' }

    // Ikkala foydalanuvchiga notification
    sendBrowserNotification('🎭 Roleplay Duo baholandi!', {
      body: 'Natijalarni ko\'rish uchun Tandem sahifasiga o\'ting!',
      url: '/tandem',
    })

    return { success: true }
  } catch (e) {
    monitoring.captureMessage('evaluateDuoRoleplay failed: ' + (e instanceof Error ? e.message : String(e)), 'error')
    return { success: false, error: 'AI baholashda xatolik' }
  }
}
