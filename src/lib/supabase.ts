import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let _supabase: SupabaseClient<Database> | null = null
let _initError: string | null = null

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  _initError =
    'Supabase kalitlari topilmadi. Vercel dashboard\'da VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY environment o\'zgaruvchilarini sozlang.'
  // eslint-disable-next-line no-console
  console.error(_initError)
}

export const supabase = _supabase as SupabaseClient<Database>
export const supabaseInitError = _initError

// Temporary migration boundary for pre-baseline admin pages. New UUID-schema
// code must use typedSupabase; both names share one auth/realtime client.
export const typedSupabase = supabase as SupabaseClient<Database>
