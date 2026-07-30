import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase kalitlari topilmadi. .env faylidan VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY ni tekshiring.'
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Temporary migration boundary for pre-baseline admin pages. New UUID-schema
// code must use typedSupabase; both names share one auth/realtime client.
export const typedSupabase = supabase as SupabaseClient<Database>
