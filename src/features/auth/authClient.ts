/**
 * Auth Client — barcha foydalanuvchi amallari backend orqali bajariladi.
 *
 * Frontend hech qachon to'g'ridan-to'g'ri Supabase'ga ulanmaydi:
 * frontend → backend (/api/auth/*) → Supabase.
 */

import { api } from '../../lib/apiClient'
import type { AuthSession, AuthUser } from './sessionStore'

export interface RegisterResponse {
  user_id: string
  email: string
  requires_confirmation: true
}

export interface OnboardingState {
  available: boolean
  completed: boolean
  display_name: string | null
  exam_date: string | null
  daily_goal_minutes: number
  timezone: string
  locale: string
  onboarding_completed_at: string | null
}

export interface CompleteOnboardingInput {
  exam_date: string | null
  daily_goal_minutes: 10 | 20 | 30 | 45 | 60
  start_diagnostic: boolean
}

export interface CompleteOnboardingResponse {
  state: OnboardingState
  next_action: 'diagnostic' | 'dashboard'
}

export const authClient = {
  register(email: string, password: string, full_name: string) {
    return api.post<RegisterResponse>('/api/auth/register', { email, password, full_name })
  },

  login(email: string, password: string) {
    return api.post<AuthSession>('/api/auth/login', { email, password })
  },

  refresh(refresh_token: string) {
    return api.post<AuthSession>('/api/auth/refresh', { refresh_token })
  },

  logout() {
    return api.post<{ success: true }>('/api/auth/logout')
  },

  me() {
    return api.get<AuthUser>('/api/auth/me')
  },

  updateProfile(full_name: string) {
    return api.patch<AuthUser>('/api/auth/profile', { full_name })
  },

  getOnboarding() {
    return api.get<OnboardingState>('/api/auth/onboarding')
  },

  completeOnboarding(input: CompleteOnboardingInput) {
    return api.patch<CompleteOnboardingResponse>('/api/auth/onboarding', input)
  },

  resetPassword(email: string) {
    return api.post<{ sent: true }>('/api/auth/reset-password', { email })
  },

  updatePassword(password: string) {
    return api.post<{ updated: true }>('/api/auth/update-password', { password })
  },

  resendConfirmation(email: string) {
    return api.post<{ sent: true }>('/api/auth/resend-confirmation', { email })
  },
}
