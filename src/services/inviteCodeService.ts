// ═══════════════════════════════════════════════════════════════════════════
// inviteCodeService.ts — Invite Code CRUD
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'

/**
 * Foydalanuvchi uchun random invite code yaratadi yoki mavjudini qaytaradi.
 * Kod `crypto.getRandomValues` bilan generatsiya qilinadi (base64 emas).
 * Supabase users jadvalidagi invite_code kolonkasida saqlanadi.
 */
export async function getOrCreateInviteCode(userId: string): Promise<string> {
  try {
    // Avval mavjud kodni tekshiramiz
    const { data, error } = await supabase
      .from('users')
      .select('invite_code')
      .eq('id', userId)
      .maybeSingle()
    if (!error && data?.invite_code) return data.invite_code

    // Yangi random kod yaratamiz (8 belgi, alphanumeric uppercase, no ambiguous chars)
    const buf = new Uint8Array(6)
    crypto.getRandomValues(buf)
    const code = Array.from(buf)
      .map(b => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32])
      .join('')

    // Supabase'ga saqlaymiz
    await supabase
      .from('users')
      .update({ invite_code: code })
      .eq('id', userId)

    return code
  } catch (e) {
    monitoring.captureMessage('getOrCreateInviteCode failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    // Fallback: localStorage'da saqlaymiz (faqat bitta qurilma)
    const localKey = `invite-code-${userId}`
    try {
      const existing = localStorage.getItem(localKey)
      if (existing) return existing
      const buf = new Uint8Array(6)
      crypto.getRandomValues(buf)
      const code = Array.from(buf)
        .map(b => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32])
        .join('')
      localStorage.setItem(localKey, code)
      return code
    } catch {
      monitoring.captureMessage('tandem inviteCode localStorage fallback failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      return Math.random().toString(36).slice(2, 10).toUpperCase()
    }
  }
}

/**
 * Invite code orqali foydalanuvchi ID sini topadi.
 * @returns userId yoki null agar kod topilmasa
 */
export async function lookupUserIdByInviteCode(code: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('invite_code', code)
      .maybeSingle()
    if (!error && data?.id) return data.id
    return null
  } catch (e) {
    monitoring.captureMessage('lookupUserIdByInviteCode failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return null
  }
}
