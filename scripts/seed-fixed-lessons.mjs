import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://julclavaqxzffslmaard.supabase.co'
const KEY = process.env.SUPABASE_SERVICE_KEY

if (!KEY) {
  console.error('❌ Set SUPABASE_SERVICE_KEY and try again')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, KEY)

const sql = readFileSync('scripts/seed-fixed-lessons-clean.sql', 'utf-8').trim()

console.log(`📦 SQL: ${sql.length} bytes`)

const { error } = await supabase.rpc('exec_sql', { query: sql })
if (error) {
  console.error('❌', error.message)
  process.exit(1)
}

console.log('✅ 4 lessons upserted successfully')
