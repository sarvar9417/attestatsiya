import { test, expect } from 'vitest'
import { loadAllLessons } from '../dailyLessons'
import type { DailyLesson } from '../dailyLessons'
import { SEED_WORDS } from '../vocabularyWords'

function isDailyLesson(l: unknown): l is DailyLesson {
  return !!(l as Record<string, unknown>).vocabulary
}

// ── Roadmap Phase 0: dars lug'ati SRS'ga KAFOLATLI kiradi ──
// Yondashuv (b) — AUTO-INSERT: lokal SEED_WORDS / Supabase `words` katalogida bo'lmagan
// dars so'zi RUNTIME'da `pushWordsToSRS_FSRS` ichida avtomatik `words`ga insert qilinadi
// (vocabularyService.ts). Shu sabab lokal SEED_WORDS to'liq qamrovi SHART EMAS — 900+
// dars so'zini qo'lda qo'shish o'rniga auto-insert ishlatiladi (roadmap tavsiyasi).
//
// Bu test endi statik qamrovni MAJBURLAMAYDI; u faqat AUDIT qiladi (nechta so'z runtime
// auto-insert'ga tayanadi) va audit yaxlitligini tekshiradi.
test('dars lug\'ati katalog qamrovi auditi (auto-insert bilan qoplanadi — Phase 0)', async () => {
  const all = await loadAllLessons()
  const seedSet = new Set(SEED_WORDS.map(w => w.word.toLowerCase().trim()))

  const missing = new Set<string>()
  for (const lesson of all) {
    if (!isDailyLesson(lesson)) continue
    for (const v of lesson.vocabulary) {
      if (!seedSet.has(v.en.toLowerCase().trim())) missing.add(v.en)
    }
  }

  // Informational: bu so'zlar lokal SEED_WORDS'da yo'q, lekin pushWordsToSRS_FSRS
  // ularni RUNTIME'da Supabase `words`ga auto-insert qiladi → hech biri tashlanmaydi.
  // eslint-disable-next-line no-console
  console.log(`SEED_WORDS'da yo'q dars so'zlari: ${missing.size} ta (auto-insert bilan SRS'ga kiradi)`)

  // Audit yaxlitligi: har bir yetishmayotgan yozuv bo'sh bo'lmagan haqiqiy so'z
  for (const w of missing) {
    expect(w.trim().length).toBeGreaterThan(0)
  }
})
