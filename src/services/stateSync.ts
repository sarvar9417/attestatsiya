import { supabase } from '../lib/supabase'
import { getTodayTashkent } from '../utils/tashkentDate'
import { mergeUserState } from './conflictResolution'
import type { Json } from '../types/supabase'

type PersistedState = Record<string, unknown>

export async function syncUserState(state: PersistedState): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user.id) return

  // Load existing remote state and smart-merge before overwriting
  const { data: existing } = await supabase
    .from('users')
    .select('state')
    .eq('id', session.user.id)
    .maybeSingle()

  if (existing?.state) {
    const remoteState = existing.state as PersistedState
    const merged = mergeUserState({ local: state, remote: remoteState })
    await supabase.from('users').update({ state: merged as Json }).eq('id', session.user.id)
  } else {
    await supabase.from('users').update({ state: state as Json }).eq('id', session.user.id)
  }
}

export async function loadUserState(): Promise<PersistedState | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user.id) return null
  const { data } = await supabase
    .from('users')
    .select('state')
    .eq('id', session.user.id)
    .maybeSingle()
  return (data?.state as PersistedState) ?? null
}

export async function loadTodayProgress() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user.id) return null
  const today = getTodayTashkent()
  const { data } = await supabase
    .from('daily_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('date', today)
    .maybeSingle()
  return data
}
