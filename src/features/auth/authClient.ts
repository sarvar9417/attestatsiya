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
