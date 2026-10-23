import { ApiError } from '../../lib/apiClient'

/** A missing lesson is not a network outage, and neither is a missing blueprint. */
export interface TopicPreflightIssue {
  kind: 'not_found' | 'auth' | 'network' | 'server' | 'unexpected'
  title: string
  detail: string
  canRetry: boolean
}

export function describeTopicPreflightError(error: unknown): TopicPreflightIssue {
  if (error instanceof ApiError) {
    if (error.statusCode === 404 || error.code === 'NOT_FOUND') {
      return {
        kind: 'not_found', title: 'Mavzu testi bazada topilmadi.',
        detail: 'Ushbu nazariya uchun nashr qilingan test darsiga bog‘lanish aniqlanmadi. Boshqa mavzuga o‘tishingiz mumkin.',
        canRetry: false,
      }
    }
    if (error.statusCode === 401 || error.statusCode === 403 ||
        error.code === 'SESSION_EXPIRED') {
      return {
        kind: 'auth', title: 'Testni tekshirish uchun kirish talab qilinadi.',
        detail: 'Hisobingizga qayta kiring va mavzuni yana oching.',
        canRetry: false,
      }
    }
    if (error.code === 'NETWORK_ERROR' || error.statusCode === 0) {
      return {
        kind: 'network', title: 'Test serveri bilan aloqa uzildi.',
        detail: 'Internet aloqasini tekshiring. O‘qish davom etadi, testni keyin qayta tekshirish mumkin.',
        canRetry: true,
      }
    }
    if (error.statusCode >= 500) {
      return {
        kind: 'server', title: 'Test serveri vaqtincha javob bermayapti.',
        detail: 'Birozdan so‘ng test tayyorligini qayta tekshiring. Savollar yo‘q degani emas.',
        canRetry: true,
      }
    }
  }
  return {
    kind: 'unexpected', title: 'Test holatini aniqlab bo‘lmadi.',
    detail: 'Server javobi yoki test ma’lumotlari kutilgan shaklda emas. Qayta tekshiring.',
    canRetry: true,
  }
}

export function describeUnreadyTopic(reason: string, available: number, required: number): string {
  switch (reason) {
    case 'blueprint_missing': return 'Ushbu dars uchun test qamrovi belgilanmagan.'
    case 'blueprint_invalid': return 'Mavzu testining qamrov sozlamasi noto‘g‘ri.'
    case 'objective_gap': return 'Majburiy o‘quv maqsadlari bo‘yicha savollar yetishmayapti.'
    case 'pool_insufficient': return `Test uchun savollar yetarli emas: ${available}/${required}.`
    default: return 'Mavzu testi hozircha tayyor emas.'
  }
}
