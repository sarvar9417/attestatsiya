#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Misol gaplarni o'zbekchaga tarjima qilish skripti
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 2 rejimda ishlaydi:
 *
 * Rejim 1 — To'liq (DB bilan):
 *   example_uzbek ustunini qo'shadi, so'zlarni o'qiydi, tarjima qiladi, DB'ga yozadi
 *   Ishga tushirish: tsx scripts/translate-example-uzbek.ts
 *
 * Rejim 2 — Offline (faqat tarjima):
 *   OpenAI orqali tarjima qiladi va translations.json fayliga saqlaydi
 *   Ishga tushirish: tsx scripts/translate-example-uzbek.ts --dry-run
 *
 * Muhit o'zgaruvchilari:
 *   SUPABASE_SERVICE_KEY  (kerak bo'lsa)
 *   OPENAI_API_KEY        (majburiy)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'
import { writeFileSync, existsSync } from 'fs'

// ─── Konfiguratsiya ────────────────────────────────────────────────────────

// .env fayllarini yuklash (env var'lar hardcoded dan ustun)
const envPath = resolve(import.meta.dirname, '../.env')
if (existsSync(envPath)) config({ path: envPath })

const SUPABASE_URL        = process.env.VITE_SUPABASE_URL        || 'https://julclavaqxzffslmaard.supabase.co'
const SUPABASE_ANON_KEY   = process.env.VITE_SUPABASE_ANON_KEY   || 'sb_publishable_LmHiGYXbs0fd_2ilSxSNng_QwzpYdnA'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY    || ''
const OPENAI_API_KEY      = process.env.OPENAI_API_KEY           || ''

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY topilmadi! .env faylida OPENAI_API_KEY ni belgilang.')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')
const BATCH_SIZE = 5
const RATE_LIMIT_MS = 500

// ─── Yordamchi funksiyalar ────────────────────────────────────────────────

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)) }

function formatTime(ms: number): string {
  const sec = Math.floor(ms / 1000)
  const min = Math.floor(sec / 60)
  return min > 0 ? `${min}m ${sec % 60}s` : `${sec}s`
}

function log(msg: string) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ─── Supabase Client ───────────────────────────────────────────────────────

// Service key (agar bor bo'lsa) — to'liq rejim uchun
const serviceClient = SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })
  : null

// Anon key — faqat o'qish uchun
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } })

// ─── 1-qadam: Ustunni qo'shish (agar service key bo'lsa) ───────────────────

async function ensureColumnExists(): Promise<boolean> {
  if (!serviceClient) {
    log('⚠️  Service key topilmadi — ustun qo\'shib bo\'lmaydi')
    return false
  }

  log('🔍 example_uzbek ustuni tekshirilmoqda...')

  // Avval ustun bor-yo'qligini tekshiramiz
  const { error: testError } = await anonClient
    .from('personal_vocabulary')
    .select('example_uzbek')
    .limit(1)

  if (!testError) {
    log('✅ example_uzbek ustuni mavjud')
    return true
  }

  // Ustun yo'q — RPC orqali qo'shish
  log('⚠️  Ustun topilmadi. qo\'shishga urinish...')

  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/julclavaqxzffslmaard/database/query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({
          query: 'ALTER TABLE public.personal_vocabulary ADD COLUMN IF NOT EXISTS example_uzbek TEXT;',
        }),
      }
    )

    if (response.ok) {
      log('✅ Ustun qo\'shildi!')
      return true
    }

    log(`⚠️  Management API ishlamadi (${response.status})`)
    log('   🔄 Service key bilan to\'g\'ridan-to\'g\'ri urinish...')

    const { error: rpcError } = await serviceClient.rpc('exec_sql' as any, {
      query: 'ALTER TABLE public.personal_vocabulary ADD COLUMN IF NOT EXISTS example_uzbek TEXT;',
    } as any)

    if (!rpcError) {
      log('✅ Ustun RPC orqali qo\'shildi')
      return true
    }

    log(`❌ Service key bilan ham ishlamadi: ${rpcError.message}`)
    return false
  } catch (err) {
    log(`❌ Xatolik: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

// ─── 2-qadam: Tarjima qilinadigan so'zlarni olish ─────────────────────────

async function fetchWordsNeedingTranslation() {
  log('📦 Tarjima qilinadigan so\'zlar olinmoqda...')

  // Service key bilan urinish (to'liq ma'lumot)
  if (serviceClient) {
    const { data, error } = await serviceClient
      .from('personal_vocabulary')
      .select('id, english, uzbek, example, example_uzbek, user_id')
      .not('example', 'is', null)
      .is('example_uzbek', null)

    if (!error && data && data.length > 0) {
      log(`📊 ${data.length} ta so'z topildi (service key)`)
      return data as Array<{ id: number; english: string; uzbek: string; example: string; example_uzbek: string | null; user_id: string }>
    }
    if (!error && data?.length === 0) {
      log('✅ Barcha so\'zlar allaqachon tarjima qilingan!')
      return []
    }
    if (error) log(`⚠️  Service key xatosi: ${error.message}`)
  }

  // Anon key bilan urinish (RLS tufayli faqat auth.uid() uchun)
  // Bunda auth.uid() = null bo'lgani uchun hech qanday row qaytmaydi
  log('⚠️  Service key bilan o\'qib bo\'lmadi. Anon key bilan urinish...')

  const { data, error } = await anonClient
    .from('personal_vocabulary')
    .select('id, english, uzbek, example, example_uzbek, user_id')
    .not('example', 'is', null)
    .is('example_uzbek', null)

  if (error) {
    if (error.message?.includes('example_uzbek')) {
      log('❌ example_uzbek ustuni mavjud emas!')
      log('   Iltimos, avval SQL migratsiyani ishga tushiring:')
      log('   → scripts/add_example_uzbek_column.sql')
      return null // signal that column doesn't exist
    }
    log(`⚠️  Anon key xatosi: ${error.message}`)
    // Try without example_uzbek filter
    const { data: fallback, error: fallbackErr } = await anonClient
      .from('personal_vocabulary')
      .select('id, english, uzbek, example, user_id')
      .not('example', 'is', null)
      .limit(100)

    if (fallbackErr) {
      log(`❌ Ma'lumot olishda xatolik: ${fallbackErr.message}`)
      return null
    }

    if (!fallback || fallback.length === 0) {
      log('ℹ️  Hech qanday so\'z topilmadi (RLS — faqat auth.uid() ga tegishli so\'zlar ko\'rinadi)')
      return []
    }

    log(`📊 ${fallback.length} ta so'z topildi (anon, example_uzbek filtri yo'q)`)
    return fallback as Array<{ id: number; english: string; uzbek: string; example: string; user_id: string }>
  }

  if (!data || data.length === 0) {
    log('ℹ️  So\'z topilmadi (RLS)')
    return []
  }

  log(`📊 ${data.length} ta so'z topildi`)
  return data as Array<{ id: number; english: string; uzbek: string; example: string; example_uzbek: string | null; user_id: string }>
}

// ─── 3-qadam: ChatGPT orqali tarjima qilish ───────────────────────────────

async function translateWithOpenAI(
  word: string,
  uzbek: string,
  example: string
): Promise<string | null> {
  const prompt = `Translate this English sentence to natural, grammatically correct Uzbek.

The word "${word}" means "${uzbek}" in Uzbek.

Sentence: "${example}"

Rules:
- Translate naturally, not word-by-word
- Keep the EXACT same meaning
- Use natural Uzbek grammar and word order
- Make sure the translation sounds like a native Uzbek speaker wrote it
- Respond with ONLY the Uzbek translation, nothing else — no quotes, no explanation`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional English→Uzbek translator. You ONLY respond with the translated text, nothing else. No explanations, no quotes, no formatting.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`OpenAI API xatosi (${response.status}): ${errText.slice(0, 200)}`)
    }

    const data = await response.json()
    const translation = (data.choices?.[0]?.message?.content || '').replace(/^["']|["']$/g, '').trim()

    if (!translation) throw new Error('Bo\'sh javob qaytarildi')
    return translation
  } catch (err) {
    log(`   ❌ "${word}" tarjimasida xatolik: ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}

// ─── 4-qadam: DB'ni yangilash ────────────────────────────────────────────

async function updateWordInDB(wordId: number, translation: string): Promise<boolean> {
  if (!serviceClient) return false

  const { error } = await serviceClient
    .from('personal_vocabulary')
    .update({ example_uzbek: translation } as any)
    .eq('id', wordId)

  if (error) {
    log(`   ❌ DB yangilashda xatolik (id=${wordId}): ${error.message}`)
    return false
  }
  return true
}

// ─── Asosiy funksiya ───────────────────────────────────────────────────────

async function main() {
  console.log('══════════════════════════════════════════════════════════════')
  console.log(`  Misol gaplarni o'zbekchaga tarjima qilish`)
  console.log(`  Rejim: ${DRY_RUN ? 'OFFLINE (faqat JSON)' : 'TO\'LIQ'}`)
  console.log('══════════════════════════════════════════════════════════════')
  console.log(`  OpenAI:    ${OPENAI_API_KEY.slice(0, 25)}...${OPENAI_API_KEY.slice(-10)}`)
  console.log(`  Service:   ${SUPABASE_SERVICE_KEY ? `${SUPABASE_SERVICE_KEY.slice(0, 25)}...` : '❌ yo\'q'}`)
  console.log('══════════════════════════════════════════════════════════════')

  // 1-qadam: Ustunni tekshirish/qo'shish
  if (!DRY_RUN && serviceClient) {
    const ok = await ensureColumnExists()
    if (!ok) {
      log('\n⚠️  Ustun qo\'shilmadi. Offline rejimga o\'tish:')
      log('   tsx scripts/translate-example-uzbek.ts --dry-run')
    }
  }

  // 2-qadam: So'zlarni olish
  const words = await fetchWordsNeedingTranslation()

  if (words === null) {
    // Ustun yo'q — offline rejim
    log('\n❌ example_uzbek ustuni mavjud emas!')
    log('   Iltimos, SQL migratsiyani ishga tushiring:')
    log('   1. https://supabase.com/dashboard/project/julclavaqxzffslmaard')
    log('   2. SQL Editor → New query')
    log('   3. Quyidagi SQL ni ishga tushiring:')
    log()
    log('   ┌────────────────────────────────────────────────────────┐')
    log('   │ ALTER TABLE public.personal_vocabulary                 │')
    log('   │   ADD COLUMN IF NOT EXISTS example_uzbek TEXT;         │')
    log('   └────────────────────────────────────────────────────────┘')
    log()
    log('   Keyin skriptni qayta ishga tushiring.')
    process.exit(1)
  }

  if (words.length === 0) {
    log('\n✅ Hech qanday ish qilinmadi!')
    log('   Yoki barcha so\'zlar tarjima qilingan, yoki hech qanday so\'z yo\'q.')
    log('   Izoh: Anon key faqat tizimga kirgan foydalanuvchining so\'zlarini ko\'radi.')
    log('   Agar tizimga kirmagan bo\'lsangiz, hech qanday so\'z ko\'rinmaydi.')
    return
  }

  // 3-qadam: Tarjima qilish
  log(`\n🤖 ${words.length} ta misol gap tarjima qilinmoqda...\n`)

  let completed = 0
  let failed = 0
  const startTime = Date.now()
  const translations: Array<{ id: number; english: string; example: string; example_uzbek: string }> = []

  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE)
    const batchStartTime = Date.now()

    const results = await Promise.allSettled(
      batch.map(async (word) => {
        const wordStr = `[${completed + 1}/${words.length}] "${word.english}"`
        log(`   🔄 ${wordStr} → tarjima qilinmoqda...`)

        const translation = await translateWithOpenAI(word.english, word.uzbek, word.example)

        if (translation) {
          translations.push({
            id: word.id,
            english: word.english,
            example: word.example,
            example_uzbek: translation,
          })

          if (!DRY_RUN && serviceClient) {
            const ok = await updateWordInDB(word.id, translation)
            if (ok) {
              log(`   ✅ ${wordStr} → "${translation}" [DB]`)
            } else {
              log(`   ⚠️ ${wordStr} → "${translation}" [DB yozilmadi]`)
            }
          } else {
            log(`   ✅ ${wordStr} → "${translation}"`)
          }
          completed++
        } else {
          log(`   ⚠️  ${wordStr} → tarjima topilmadi`)
          failed++
        }
      })
    )

    const batchTime = Date.now() - batchStartTime
    const elapsed = Date.now() - startTime
    const pct = Math.round((completed / words.length) * 100)

    log(`   📊 Batch: ${completed}/${words.length} (${pct}%) | ${formatTime(elapsed)}`)

    if (i + BATCH_SIZE < words.length) await sleep(RATE_LIMIT_MS)
  }

  // 4-qadam: JSON faylga saqlash
  const jsonPath = resolve(import.meta.dirname, '../translations_output.json')
  writeFileSync(jsonPath, JSON.stringify(translations, null, 2))
  log(`\n📄 Tarjimalar faylga saqlandi: ${jsonPath}`)

  // 5-qadam: Hisobot
  const totalTime = Date.now() - startTime
  console.log('\n══════════════════════════════════════════════════════════════')
  console.log('  ✅ Tugallandi!')
  console.log('══════════════════════════════════════════════════════════════')
  console.log(`  Jami:        ${words.length} ta so'z`)
  console.log(`  Tarjima:     ${completed} ta`)
  console.log(`  Xatolik:     ${failed} ta`)
  console.log(`  Vaqt:        ${formatTime(totalTime)}`)
  console.log(`  Fayl:        translations_output.json`)
  console.log('══════════════════════════════════════════════════════════════')

  if (!DRY_RUN && !serviceClient) {
    console.log('\n⚠️  DB ga yozilmadi — service key yo\'q')
    console.log(`   Tarjimalar .translations_output.json faylida`)
  }

  if (DRY_RUN) {
    console.log('\n📋 Import qilish uchun bu JSON fayldan foydalaning')
  }
}

main().catch((err) => {
  console.error('\n❌ Skriptda kutilmagan xatolik:', err)
  process.exit(1)
})
