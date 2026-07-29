import { supabase } from '../lib/supabase'

export async function addStudyBuddy(userId: string, buddyEmail: string): Promise<boolean> {
  const { data: buddy } = await supabase
    .from('users')
    .select('id')
    .eq('email', buddyEmail)
    .maybeSingle()

  if (!buddy) return false

  const { error } = await supabase.from('study_buddies').upsert({
    user_id: userId,
    buddy_id: buddy.id,
  })

  return !error
}

export async function getStudyBuddy(userId: string): Promise<{ id: string; name: string } | null> {
  const { data } = await supabase
    .from('study_buddies')
    .select('buddy_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!data) return null

  const { data: buddyUser } = await supabase
    .from('users')
    .select('id, name')
    .eq('id', data.buddy_id)
    .maybeSingle()

  return buddyUser ? { id: buddyUser.id, name: buddyUser.name || buddyUser.id } : null
}

export async function checkDuoStreak(userId: string, buddyId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('duo_streaks')
    .select('both_completed')
    .eq('user_id', userId)
    .eq('buddy_id', buddyId)
    .eq('date', today)
    .maybeSingle()

  return data?.both_completed ?? false
}
