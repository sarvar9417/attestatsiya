// Speaking Path — persistence servisi
// Reja: docs/speaking-path-roadmap.md (4.5-bo'lim)
//
// Dual persistence: Supabase ASOSIY (cross-device), localStorage OFLAYN fallback/kesh.
// Har Supabase chaqiruvi try/catch bilan o'ralgan — xato/oflaynda localStorage ishlaydi
// (roadmap: 1–3 qadamlar internetsiz ishlasin). Pattern: src/services/vocabularyService.ts.
// Jadvallar: user_speaking_progress, user_speaking_chunks (migratsiya 20250611000000).

import { supabase } from '../lib/supabase'
import { createDefaultFSRSState, computeNextReviewFSRS, type FSRSState } from '../lib/srs'
import { LESSON_INDEX } from '../data/daily/lessonsIndex'
import { monitoring } from '../lib/monitoring'
import type { GrammarProgress, SpeakingChunk, SpeakingDayProgress } from '../data/speakingPath/types'
import { SpeakingDayProgressSchema, SpeakingChunkGradeSchema, SpeakingChunkEnrollSchema } from '../lib/validations'

// ── In-memory SRS cache ─────────────────────────────────────────────────────
// Takroriy localStorage o'qishlarni oldini oladi. Cache `gradeChunk`/`enrollChunks`
// chaqirilganda yoki 60 soniyadan keyin avtomatik tozalanadi (TTL).
let srsCache: { map: SrsMap; userId: string; ts: number } | null = null
const SRS_CACHE_TTL = 60_000 // 1 daqiqa

/** In-memory cache'dan SRS map ni sinxron o'qish. Agar cache bo'lmasa,
 *  localStorage dan sync o'qib, cache'ni to'ldiradi (Supabase'siz — tez).
 *  @returns null agar hech qanday ma'lumot topilmasa */
export function getCachedSrsMapSync(userId: string): SrsMap | null {
  if (srsCache && srsCache.userId === userId && Date.now() - srsCache.ts < SRS_CACHE_TTL) {
    return srsCache.map
  }
  // Cache yo'q — localStorage dan tez o'qib, cache'ni to'ldiramiz
  try {
    const raw = localStorage.getItem(srsKey(userId))
    if (raw) {
      const map = JSON.parse(raw) as SrsMap
      srsCache = { map, userId, ts: Date.now() }
      return map
    }
  } catch {
    // ignore
  }
  return null
}

/** SRS cache ni tozalaydi. gradeChunk() yoki enrollChunks() dan keyin chaqiriladi. */
export function clearSrsCache(): void {
  srsCache = null
}

// ── localStorage kalitlari — userId bilan prefikslanadi (multi-user izolatsiya) ──
const progressKey = (uid: string) => `sp_progress_${uid}`
const srsKey = (uid: string) => `sp_srs_${uid}`

type SrsMap = Record<string, FSRSState>

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch (e) {
    monitoring.captureMessage('speakingPath readJSON failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return fallback
  }
}

function writeJSON(key: string, val: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    monitoring.captureMessage('speakingPath writeJSON failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
  }
}

// ── Kunlik progress ──────────────────────────────────────────────────────────

/** Foydalanuvchining barcha kun progressi (Supabase → localStorage fallback) */
export async function getSpeakingProgress(userId: string): Promise<SpeakingDayProgress[]> {
  try {
    const { data, error } = await supabase
      .from('user_speaking_progress')
      .select('day, completed, best_speak_score, spoken_seconds, completed_at')
      .eq('user_id', userId)
    if (error) throw error
    if (data) {
      const mapped: SpeakingDayProgress[] = data.map(r => ({
        day: r.day,
        completed: r.completed,
        bestSpeakScore: r.best_speak_score ?? undefined,
        spokenSeconds: r.spoken_seconds,
        completedAt: r.completed_at ?? undefined,
      }))
      writeJSON(progressKey(userId), mapped) // oflayn kesh
      return mapped
    }    } catch (e) {
    monitoring.captureMessage('getSpeakingProgress Supabase failed, fallback to localStorage: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    /* fall through → localStorage */
  }
  return readJSON<SpeakingDayProgress[]>(progressKey(userId), [])
}

/** Bitta kun progressini saqlash (Supabase upsert + localStorage) */
export async function saveSpeakingDayProgress(userId: string, p: SpeakingDayProgress): Promise<void> {
  const validation = SpeakingDayProgressSchema.safeParse({ userId, ...p })
  if (!validation.success) {
    monitoring.captureMessage(`Validation failed in saveSpeakingDayProgress: ${validation.error.message}`, 'warn')
  }

  // localStorage (darhol, oflayn)
  const all = readJSON<SpeakingDayProgress[]>(progressKey(userId), [])
  const idx = all.findIndex(x => x.day === p.day)
  if (idx >= 0) all[idx] = p
  else all.push(p)
  writeJSON(progressKey(userId), all)

  // Supabase
  try {
    await supabase.from('user_speaking_progress').upsert({
      user_id: userId,
      day: p.day,
      completed: p.completed,
      best_speak_score: p.bestSpeakScore ?? null,
      spoken_seconds: p.spokenSeconds,
      completed_at: p.completedAt ?? null,
    })    } catch (e) {
    monitoring.captureMessage('saveSpeakingDayProgress Supabase failed (offline): ' + (e instanceof Error ? e.message : String(e)), 'warn')
    /* oflayn — localStorage da saqlandi, keyingi onlaynda sinxronlanadi */
  }
}

/** Keyingi ochilgan kun raqami (eng katta tugatilgan kun + 1; hech narsa bo'lmasa 1) */
export async function getUnlockedDay(userId: string): Promise<number> {
  const all = await getSpeakingProgress(userId)
  const maxCompleted = all.filter(p => p.completed).reduce((m, p) => Math.max(m, p.day), 0)
  return maxCompleted + 1
}

// ── Jumla darajasidagi SRS (FSRS) ─────────────────────────────────────────────

/** Joriy SRS xaritasini olish (in-memory cache → Supabase + localStorage merge).
 *  Birinchi chaqiriqda Supabase + localStorage merge qilib cache'laydi.
 *  Keyingi chaqiriqlarda (TTL ichida) cached natijani qaytaradi — localStorage o'qilmaydi.
 *  Race condition oldini olish uchun: Supabase va localStorage data'sini
 *  merge qilamiz — reps ko'p bo'lgan (yangiroq baholangan) versionni saqlaymiz. */
export async function loadSrsMap(userId: string): Promise<SrsMap> {
  // In-memory cache ni tekshirish
  if (srsCache && srsCache.userId === userId && Date.now() - srsCache.ts < SRS_CACHE_TTL) {
    return srsCache.map
  }

  const localMap = readJSON<SrsMap>(srsKey(userId), {})
  try {
    const { data, error } = await supabase
      .from('user_speaking_chunks')
      .select('chunk_id, stability, difficulty, due, reps, lapses')
      .eq('user_id', userId)
    if (error) throw error
    if (data) {
      const remoteMap: SrsMap = {}
      for (const r of data) {
        remoteMap[r.chunk_id] = {
          stability: r.stability,
          difficulty: r.difficulty,
          due: r.due,
          reps: r.reps,
          lapses: r.lapses,
        }
      }
      // Merge: Supabase data asosiy, lekin localStorage'dagi yangiroq entry'larni saqlaymiz
      // (reps ko'p = ko'proq baholangan = yangiroq)
      const mergedMap: SrsMap = { ...remoteMap }
      for (const [id, localSt] of Object.entries(localMap)) {
        const remoteSt = mergedMap[id]
        if (!remoteSt) {
          // Supabase'da yo'q — localStorage'dagi entry'ni saqlaymiz (offline yozilgan bo'lishi mumkin)
          mergedMap[id] = localSt
        } else if (localSt.reps > remoteSt.reps) {
          // localStorage'da ko'proq baholangan — demak gradeChunk yangiroq yozgan
          mergedMap[id] = localSt
        } else if (localSt.reps === remoteSt.reps && localSt.due > remoteSt.due) {
          // Reps teng, lekin localStorage'da due keyinroq — yangiroq
          mergedMap[id] = localSt
        }
      }
      writeJSON(srsKey(userId), mergedMap)
      // Cache'ga yozish
      srsCache = { map: mergedMap, userId, ts: Date.now() }
      return mergedMap
    }
  } catch (e) {
    monitoring.captureMessage('loadSrsMap Supabase failed, fallback to localStorage: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    /* fall through */
  }
  // localStorage dan o'qilgan bo'lsa ham cache'laymiz (offline mode)
  if (Object.keys(localMap).length > 0) {
    srsCache = { map: localMap, userId, ts: Date.now() }
  }
  return localMap
}

/** Yangi bloklarni SRS ga kiritish (faqat hali yo'qlari) */
export async function enrollChunks(userId: string, chunkIds: string[]): Promise<void> {
  const validation = SpeakingChunkEnrollSchema.safeParse({ userId, chunkIds })
  if (!validation.success) {
    monitoring.captureMessage(`Validation failed in enrollChunks: ${validation.error.message}`, 'warn')
  }

  const map = readJSON<SrsMap>(srsKey(userId), {})
  const newRows: { user_id: string; chunk_id: string; stability: number; difficulty: number; due: string; reps: number; lapses: number }[] = []
  for (const id of chunkIds) {
    if (!map[id]) {
      const st = createDefaultFSRSState()
      map[id] = st
      newRows.push({ user_id: userId, chunk_id: id, stability: st.stability, difficulty: st.difficulty, due: st.due, reps: st.reps, lapses: st.lapses })
    }
  }
  if (newRows.length === 0) return
  writeJSON(srsKey(userId), map)
  // Cache ni tozalash — yangi chunklar qo'shilgan bo'lishi mumkin
  clearSrsCache()
  try {
    // mavjudlarni o'zgartirmaydi (FSRS holatini saqlaydi)
    await supabase.from('user_speaking_chunks').upsert(newRows, {
      onConflict: 'user_id,chunk_id',
      ignoreDuplicates: true,
    })    } catch (e) {
    monitoring.captureMessage('enrollChunks Supabase failed (offline): ' + (e instanceof Error ? e.message : String(e)), 'warn')
    /* oflayn */
  }
}

/** Blokni baholash → FSRS keyingi takrorni hisoblaydi va saqlaydi.
 *  rating: 'bilmadim' | 'qiynaldim' | 'bildim' | 'yodladim' (src/lib/srs.ts) */
export async function gradeChunk(userId: string, chunkId: string, rating: string): Promise<void> {
  const validation = SpeakingChunkGradeSchema.safeParse({ userId, chunkId, rating })
  if (!validation.success) {
    monitoring.captureMessage(`Validation failed in gradeChunk: ${validation.error.message}`, 'warn')
  }

  const map = readJSON<SrsMap>(srsKey(userId), {})
  const current = map[chunkId] ?? createDefaultFSRSState()
  const { state } = computeNextReviewFSRS(current, rating)
  map[chunkId] = state
  writeJSON(srsKey(userId), map)
  // Cache ni tozalash — chunk baholangan, eski cache endi yangi emas
  clearSrsCache()
  try {
    await supabase.from('user_speaking_chunks').upsert({
      user_id: userId,
      chunk_id: chunkId,
      stability: state.stability,
      difficulty: state.difficulty,
      due: state.due,
      reps: state.reps,
      lapses: state.lapses,
      updated_at: new Date().toISOString(),
    })    } catch (e) {
    monitoring.captureMessage('gradeChunk Supabase failed (offline): ' + (e instanceof Error ? e.message : String(e)), 'warn')
    /* oflayn */
  }
}

/** Bugun takrorlash kerak bo'lgan bloklar (due <= bugun) */
export async function getDueChunks(
  userId: string,
  allChunks: SpeakingChunk[],
  preloadedMap?: SrsMap,
): Promise<SpeakingChunk[]> {
  const map = preloadedMap ?? await loadSrsMap(userId)
  const today = new Date().toISOString().split('T')[0]
  return allChunks.filter(c => {
    const st = map[c.id]
    return !!st && st.due <= today
  })
}

/** Jami o'zlashtirilgan (SRS ga kiritilgan) bloklar soni */
export async function getLearnedChunkCount(userId: string): Promise<number> {
  const map = await loadSrsMap(userId)
  return Object.keys(map).length
}

export interface SpeakingStats {
  /** keyingi ochilgan kun (1..N+1) */
  currentDay: number
  /** tugatilgan kunlar soni */
  totalCompleted: number
  /** bugun takrorlash kerak bo'lgan bloklar */
  dueCount: number
  /** bugun gapirilgan daqiqalar */
  todayMinutes: number
  /** ketma-ket kunlar (gapirish streak'i) */
  streakDays: number

  // ── Trend metrikalari ─────────────────────────────────────────────────────
  /** So'nggi 7 kundagi o'rtacha speak ball (STT accuracy trend) */
  avgSpeakScore7d: number
  /** So'nggi 30 kundagi o'rtacha speak ball */
  avgSpeakScore30d: number
  /** So'nggi 7 kunda kuniga o'rtacha gapirilgan daqiqa */
  avgMinutesPerDay7d: number
  /** SRS da stability >= 30 bo'lgan o'zlashtirilgan bloklar soni */
  chunksMastered: number
  /** SRS dagi barcha bloklarning o'rtacha stability si */
  avgChunkStability: number
}

export interface TrendPoint {
  date: string
  label: string
  score: number
  minutes: number
}

export interface SRSDistribution {
  range: string
  label: string
  count: number
  color: string
}

/** So'nggi N kundagi kunlik trend ma'lumotlari */
export function computeTrend(
  progress: SpeakingDayProgress[],
  days: number,
): TrendPoint[] {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const points: TrendPoint[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today + 'T00:00:00Z')
    d.setUTCDate(d.getUTCDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayData = progress.find(p => (p.completedAt ?? '').slice(0, 10) === dateStr && p.completed)

    const dayOfWeek = d.getUTCDay()
    const dayNames = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']

    points.push({
      date: dateStr,
      label: dayNames[dayOfWeek],
      score: dayData?.bestSpeakScore ?? 0,
      minutes: dayData ? Math.round((dayData.spokenSeconds || 0) / 60) : 0,
    })
  }
  return points
}

/** SRS stability bo'yicha taqsimot */
export function computeSRSDistribution(srsMap: Record<string, { stability: number }>): SRSDistribution[] {
  const buckets = [
    { range: '0-5', label: 'Yangi', count: 0, color: '#F87171' },
    { range: '5-15', label: 'O\'rganilayotgan', count: 0, color: '#FBBF24' },
    { range: '15-30', label: 'Mustahkamlanayotgan', count: 0, color: '#60A5FA' },
    { range: '30-90', label: 'O\'zlashtirilgan', count: 0, color: '#34D399' },
    { range: '90+', label: 'Yodda', count: 0, color: '#8B5CF6' },
  ]

  for (const entry of Object.values(srsMap)) {
    const s = entry.stability
    if (s < 5) buckets[0].count++
    else if (s < 15) buckets[1].count++
    else if (s < 30) buckets[2].count++
    else if (s < 90) buckets[3].count++
    else buckets[4].count++
  }

  return buckets
}

/** Dashboard ko'rsatkichi uchun jamlangan statistika */
export async function getSpeakingStats(
  userId: string,
  allChunks: SpeakingChunk[],
  preloadedSrsMap?: SrsMap,
): Promise<SpeakingStats> {
  const srsMap = preloadedSrsMap ?? await loadSrsMap(userId)
  const progress = await getSpeakingProgress(userId)
  const due = await getDueChunks(userId, allChunks, srsMap)
  const completed = progress.filter(p => p.completed)
  const maxDay = completed.reduce((m, p) => Math.max(m, p.day), 0)
  const todayStr = new Date().toISOString().split('T')[0]

  const todaySeconds = completed
    .filter(p => (p.completedAt ?? '').slice(0, 10) === todayStr)
    .reduce((s, p) => s + (p.spokenSeconds || 0), 0)

  // streak — ketma-ket kalendar kunlari (bugun yoki kechagiga bog'lab).
  // UTC bilan ishlaymiz: completedAt/todayStr ham UTC sanasi (mintaqa bug'idan saqlanish).
  const dateSet = new Set(completed.map(p => (p.completedAt ?? '').slice(0, 10)).filter(Boolean))
  const cursor = new Date(todayStr + 'T00:00:00Z')
  if (!dateSet.has(todayStr)) cursor.setUTCDate(cursor.getUTCDate() - 1)
  let streak = 0
  while (dateSet.has(cursor.toISOString().split('T')[0])) {
    streak++
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  // ── Trend metrikalari ─────────────────────────────────────────────────────
  const now = new Date(todayStr + 'T00:00:00Z')
  const daysAgo = (n: number) => {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - n)
    return d.toISOString().split('T')[0]
  }

  const scores7d = completed
    .filter(p => p.bestSpeakScore != null && (p.completedAt ?? '') >= daysAgo(7))
    .map(p => p.bestSpeakScore!)
  const scores30d = completed
    .filter(p => p.bestSpeakScore != null && (p.completedAt ?? '') >= daysAgo(30))
    .map(p => p.bestSpeakScore!)

  const avgScore = (scores: number[]) =>
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  // Kuniga o'rtacha gapirilgan daqiqa (so'nggi 7 kun)
  let totalMins7d = 0
  for (let i = 0; i < 7; i++) {
    const day = daysAgo(i)
    const daySeconds = completed
      .filter(p => (p.completedAt ?? '').slice(0, 10) === day)
      .reduce((s, p) => s + (p.spokenSeconds || 0), 0)
    totalMins7d += Math.round(daySeconds / 60)
  }
  const avgMinutesPerDay7d = Math.round(totalMins7d / 7)

  // SRS metrikalari
  const entries = Object.entries(srsMap)
  const mastered = entries.filter(([_, st]) => st.stability >= 30).length
  const avgStability = entries.length > 0
    ? Math.round(entries.reduce((s, [_, st]) => s + st.stability, 0) / entries.length * 10) / 10
    : 0

  return {
    currentDay: maxDay + 1,
    totalCompleted: completed.length,
    dueCount: due.length,
    todayMinutes: Math.round(todaySeconds / 60),
    streakDays: streak,
    avgSpeakScore7d: avgScore(scores7d),
    avgSpeakScore30d: avgScore(scores30d),
    avgMinutesPerDay7d,
    chunksMastered: mastered,
    avgChunkStability: avgStability,
  }
}

// ── Grammatika pattern'lari (CEFR bo'yicha) ─────────────────────────────────
// extractGrammarFromTranscript() uchun — transkriptda qaysi grammar
// point'lar ishlatilganini aniqlaydi. Regex match asosida ishlaydi.
// Pattern'lar speaking_curriculum_roadmap.md §5.1 dan olingan.

interface GrammarPattern {
  id: string
  level: string
  regex: RegExp
}

const GRAMMAR_PATTERNS: GrammarPattern[] = [
  // A1 (5)
  { id: 'have-got', level: 'A1', regex: /\b(have|has) got\b/i },
  { id: 'there-is-are', level: 'A1', regex: /\bthere (is|are)\b/i },
  { id: 'simple-present', level: 'A1', regex: /\b(?:i|you|we|they) \w+\b|(?:he|she|it) \w+s\b/i },
  { id: 'present-continuous', level: 'A1', regex: /\b(am|is|are) \w+ing\b/i },
  { id: 'can-cant', level: 'A1', regex: /\bcan('t| not)?\b/i },

  // A2 (12)
  { id: 'simple-past', level: 'A2', regex: /\b(did|was|were|had|went|saw|ate|took|made|said)\b/i },
  { id: 'simple-future', level: 'A2', regex: /\bwill\b|\bgoing to\b/i },
  { id: 'present-perfect', level: 'A2', regex: /\b(have|has) (been|seen|done|had|gone|taken)\b/i },
  { id: 'modal-verbs', level: 'A2', regex: /\b(can|could|should|must|might|may)\b/i },
  { id: 'first-conditional', level: 'A2', regex: /\bif .+, .+ will\b/i },
  { id: 'comparatives', level: 'A2', regex: /\b(more|most|er than|better|best|worse|worst)\b/i },
  { id: 'gerunds-infinitives', level: 'A2', regex: /\b(enjoy|like|love|hate|don't mind) \w+ing\b/i },
  { id: 'articles', level: 'A2', regex: /\b(a|an|the) \w+\b/ },
  { id: 'prepositions', level: 'A2', regex: /\b(in|on|at|to|for|with|about)\b/ },
  { id: 'questions', level: 'A2', regex: /^(Do|Does|Did|Is|Are|Was|Were|Can|Will|Have|Has) /m },
  { id: 'adjective-adverb', level: 'A2', regex: /\b(quickly|slowly|carefully|badly|well|hard)\b/i },
  { id: 'quantifiers', level: 'A2', regex: /\b(some|any|much|many|a lot of|a few|a little)\b/i },

  // B1 (15)
  { id: 'present-perfect-continuous', level: 'B1', regex: /\b(have|has) been \w+ing\b/i },
  { id: 'past-perfect', level: 'B1', regex: /\bhad (been|done|seen|gone|taken|made|said)\b/i },
  { id: 'future-continuous', level: 'B1', regex: /\bwill be \w+ing\b/i },
  { id: 'passive-voice', level: 'B1', regex: /\b(am|is|are|was|were|been|being) \w+en\b|\b(am|is|are|was|were) \w+ed\b/i },
  { id: 'reported-speech', level: 'B1', regex: /\b(said|told|asked) (that|me|him|her|us|them)\b/i },
  { id: 'second-conditional', level: 'B1', regex: /\bif .+ (were|did|had|could), .+ would\b/i },
  { id: 'relative-clauses', level: 'B1', regex: /\b(who|which|that|whom|whose) \w+\b/ },
  { id: 'time-prepositions', level: 'B1', regex: /\b(at \d|on \w+day|in \w+ber|in \w+uary)\b/i },
  { id: 'verb-patterns', level: 'B1', regex: /\b(want|need|expect|hope|decide|promise) to \w+\b/i },
  { id: 'conjunctions', level: 'B1', regex: /\b(although|however|therefore|moreover|nevertheless)\b/i },
  { id: 'modal-perfects', level: 'B1', regex: /\b(must|could|might|may|should|would) have \w+en\b/i },
  { id: 'narrative-tenses', level: 'B1', regex: /\b(was \w+ing|were \w+ing|had \w+ed)\b/ },
  { id: 'participle-clauses', level: 'B1', regex: /\b(having|being) \w+en\b|\b(Having|Being) \w+ed\b/i },
  { id: 'emphasis-does', level: 'B1', regex: /\b(do|does|did) \w+\b(?!\?)/ },
  { id: 'infinitive-gerund', level: 'B1', regex: /\b(avoid|suggest|recommend|consider|admit) \w+ing\b/i },

  // B2 (5)
  { id: 'unreal-past', level: 'B2', regex: /\b(wish|if only|would rather|it's time) \w+\b/i },
  { id: 'advanced-conditionals', level: 'B2', regex: /\b(had \w+ed|had \w+en), .+ (would|could) have\b/i },
  { id: 'hedging', level: 'B2', regex: /\b(it seems|it appears|tends to|likely to|arguably)\b/i },
  { id: 'inversion', level: 'B2', regex: /\b(Not only|Never have|Rarely do|No sooner|Hardly had)\b/i },
  { id: 'cleft-sentences', level: 'B2', regex: /\b(What I|The reason why|The thing that|It is .+ that)\b/i },
]

/** Lesson ID dan grammar point nomini olish (LESSON_INDEX orqali) */
function getGrammarPoint(lessonId: string): string {
  const found = LESSON_INDEX.find(m => m.id === lessonId)
  return found?.title ?? lessonId
}

/** Lesson ID dan CEFR darajasini olish */
function getGrammarLevel(lessonId: string, defaultLevel: string): string {
  const found = LESSON_INDEX.find(m => m.id === lessonId)
  return found?.level ?? defaultLevel
}

// ── localStorage kaliti ──────────────────────────────────────────────────────
const grammarKey = (uid: string) => `sp_grammar_${uid}`

// ── Grammar Sync ─────────────────────────────────────────────────────────────

/** Transkriptdan qaysi grammar point'lar ishlatilganini aniqlaydi.
 *  Free mode da har bir prompt'dan keyin chaqiriladi.
 *  Natija → updateGrammarProgress() ga yuboriladi. */
export function extractGrammarFromTranscript(transcript: string): GrammarProgress[] {
  const now = new Date().toISOString()
  const matched: GrammarProgress[] = []
  const seen = new Set<string>()

  for (const gp of GRAMMAR_PATTERNS) {
    const match = gp.regex.test(transcript)
    if (match && !seen.has(gp.id)) {
      seen.add(gp.id)
      matched.push({
        lessonId: gp.id,
        grammarPoint: getGrammarPoint(gp.id),
        level: gp.level,
        status: 'practice',
        bestScore: 0,
        practiceCount: 1,
        lastPracticedAt: now,
        usedInFreeMode: true,
      })
    }
  }

  return matched
}

/** Bir kunlik track mode yakunlanganda — linkedLessonId bo'yicha grammar progressni
 *  yangilaydi. Day75 da linkedLessonId yo'q bo'lsa, hech narsa qilinmaydi. */
export function onTrackDayComplete(
  userId: string,
  _day: number,
  dayGrammarScore: number,
  practicedLessonIds: string[],
): Promise<void> {
  const entries: GrammarProgress[] = practicedLessonIds.map(lessonId => ({
    lessonId,
    grammarPoint: getGrammarPoint(lessonId),
    level: getGrammarLevel(lessonId, ''),
    status: dayGrammarScore >= 80 ? 'mastered' : 'practice',
    bestScore: dayGrammarScore,
    practiceCount: 1,
    lastPracticedAt: new Date().toISOString(),
    usedInFreeMode: false,
  }))
  return updateGrammarProgress(userId, entries)
}

/** Bir yoki bir nechta GrammarProgress entry'larini saqlaydi (Dual Persistence:
 *  localStorage darhol + supabase upsert). */
export async function updateGrammarProgress(
  userId: string,
  entries: GrammarProgress[],
): Promise<void> {
  if (entries.length === 0) return

  // localStorage (darhol)
  const all = readJSON<GrammarProgress[]>(grammarKey(userId), [])
  for (const entry of entries) {
    const idx = all.findIndex(g => g.lessonId === entry.lessonId)
    if (idx >= 0) {
      all[idx].practiceCount++
      all[idx].lastPracticedAt = new Date().toISOString()
      all[idx].usedInFreeMode = all[idx].usedInFreeMode || entry.usedInFreeMode
      if (entry.bestScore > all[idx].bestScore) {
        all[idx].bestScore = entry.bestScore
        all[idx].status = entry.bestScore >= 80 ? 'mastered' : 'practice'
      }
    } else {
      all.push(entry)
    }
  }
  writeJSON(grammarKey(userId), all)

  // Supabase upsert — dynamic table (not in generated types yet)
  try {
    const rows = all.map(g => ({
      user_id: userId,
      lesson_id: g.lessonId,
      grammar_point: g.grammarPoint,
      level: g.level,
      status: g.status,
      best_score: g.bestScore,
      practice_count: g.practiceCount,
      used_in_free_mode: g.usedInFreeMode,
      updated_at: new Date().toISOString(),
    }))
    // user_grammar_progress is not in generated Supabase types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('user_grammar_progress')
      .upsert(rows, { onConflict: 'user_id,lesson_id' })
    if (error) throw error
  } catch (e) {
    monitoring.captureMessage('updateGrammarProgress Supabase failed (offline): ' + (e instanceof Error ? e.message : String(e)), 'warn')
    /* oflayn — localStorage da saqlandi */
  }
}

// ── Level Mastery ─────────────────────────────────────────────────────────────

/** Bir darajadagi mastery holatini hisoblaydi.
 *  grammarMastered/total — nechta grammar point o'zlashtirilgan (score >= 70)
 *  vocabRecalled/total — nechta chunk SRS da kamida bir marta baholangan
 *  isComplete — har ikkala shart bajarilgan bo'lsa true
 *
 *  @param levelChunks — aynan shu CEFR darajasidagi chunk'lar ro'yxati */
export async function getLevelMastery(
  userId: string,
  cefr: string,
  grammarPointCount: number,
  levelChunks: SpeakingChunk[],
): Promise<{
  grammarMastered: number
  grammarTotal: number
  vocabRecalled: number
  vocabTotal: number
  isComplete: boolean
}> {
  const grammarProgress = await getGrammarProgress(userId)
  const srsMap = await loadSrsMap(userId)

  // CEFR darajasidagi grammar point'lar
  const levelGrammar = grammarProgress.filter(g => g.level === cefr)
  const grammarMastered = levelGrammar.filter(g => g.status === 'mastered').length
  const grammarTotal = grammarPointCount

  // CEFR darajasidagi chunk ID'lari
  const levelChunkIds = new Set(levelChunks.map(c => c.id))

  // Shulardan qanchasi SRS da baholangan?
  const vocabRecalled = Object.keys(srsMap).filter(id => levelChunkIds.has(id)).length
  const vocabTotal = levelChunks.length

  return {
    grammarMastered,
    grammarTotal,
    vocabRecalled: Math.min(vocabRecalled, vocabTotal),
    vocabTotal,
    isComplete: grammarMastered >= grammarTotal && vocabRecalled >= vocabTotal,
  }
}

/** Foydalanuvchining barcha grammar progressini qaytaradi (Supabase → localStorage fallback) */
export async function getGrammarProgress(userId: string): Promise<GrammarProgress[]> {
  try {
    // user_grammar_progress is not in generated Supabase types
    type GrammarRow = {
      lesson_id: string
      grammar_point: string
      level: string
      status: string
      best_score: number
      practice_count: number
      last_practiced_at: string | null
      used_in_free_mode: boolean
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('user_grammar_progress')
      .select('lesson_id, grammar_point, level, status, best_score, practice_count, last_practiced_at, used_in_free_mode')
      .eq('user_id', userId)
    if (error) throw error
    if (data) {
      const mapped: GrammarProgress[] = (data as GrammarRow[]).map(r => ({
        lessonId: r.lesson_id,
        grammarPoint: r.grammar_point,
        level: r.level,
        status: r.status as GrammarProgress['status'],
        bestScore: r.best_score,
        practiceCount: r.practice_count,
        lastPracticedAt: r.last_practiced_at ?? undefined,
        usedInFreeMode: r.used_in_free_mode,
      }))
      writeJSON(grammarKey(userId), mapped)
      return mapped
    }
  } catch (e) {
    monitoring.captureMessage('getGrammarProgress Supabase failed, fallback to localStorage: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    /* fall through → localStorage */
  }
  return readJSON<GrammarProgress[]>(grammarKey(userId), [])
}
