import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface WeakSpot {
  category: 'vocabulary' | 'phrases' | 'grammar' | 'writing' | 'speaking' | 'listening' | 'reading'
  label: string
  score: number        // 0–100, past = weaker
  totalAttempts: number
  errorCount: number
  trend: 'improving' | 'stable' | 'declining'
  detail: string       // qisqa izoh
  recommendedAction: string
  icon: string
}

export interface WeeklyTrend {
  date: string
  avgScore: number
  category: string
}

export interface AnalyticsSummary {
  weakSpots: WeakSpot[]
  weeklyTrends: WeeklyTrend[]
  overallScore: number
  totalExercisesDone: number
  totalErrors: number
  strongestCategory: string | null
  weakestCategory: string | null
}

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function scoreToPct(score: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((score / total) * 100)
}

function getTrend(recent: number[], older: number[]): 'improving' | 'stable' | 'declining' {
  const avgRecent = recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : 0
  const avgOlder  = older.length  > 0 ? older.reduce((a, b) => a + b, 0) / older.length  : 0
  const diff = avgRecent - avgOlder
  if (diff > 5) return 'improving'
  if (diff < -5) return 'declining'
  return 'stable'
}

// ═══════════════════════════════════════════════════════════════════════════
// Main analysis function
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchAnalytics(userId: string): Promise<AnalyticsSummary> {
  const last7 = getLast7Days()

  try {
    // ── Parallel fetch all progress data ──────────────────────────────────
    const [
      vocabRes, phraseRes, grammarRes, writingRes, speakingRes,
      listeningRes, readingRes,
    ] = await Promise.all([
      supabase
        .from('vocabulary_progress')
        .select('correct_count, wrong_count, box, is_learned')
        .eq('user_id', userId),

      supabase
        .from('phrase_progress')
        .select('correct_count, wrong_count, box, is_learned')
        .eq('user_id', userId),

      supabase
        .from('grammar_progress')
        .select('date, score, topic_title')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false }),

      supabase
        .from('writings')
        .select('date, score')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),

      supabase
        .from('speaking_progress')
        .select('date, avg_score')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false }),

      supabase
        .from('listening_progress')
        .select('date, score')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false }),

      supabase
        .from('reading_progress')
        .select('date, score')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false }),
    ])

    // ── Vocabulary analysis ───────────────────────────────────────────────
    const vocabRows = vocabRes.data ?? []
    const vocabTotalAttempts = vocabRows.reduce((s, r) => s + (r.correct_count ?? 0) + (r.wrong_count ?? 0), 0)
    const vocabErrors = vocabRows.reduce((s, r) => s + (r.wrong_count ?? 0), 0)
    const vocabScore = vocabTotalAttempts > 0
      ? scoreToPct(vocabTotalAttempts - vocabErrors, vocabTotalAttempts)
      : 0
    // Words stuck in box 1-2 (not progressing)
    const stuckWords = vocabRows.filter(r => (r.box ?? 1) <= 2 && !r.is_learned).length

    // ── Phrases analysis ──────────────────────────────────────────────────
    const phraseRows = phraseRes.data ?? []
    const phraseTotalAttempts = phraseRows.reduce((s, r) => s + (r.correct_count ?? 0) + (r.wrong_count ?? 0), 0)
    const phraseErrors = phraseRows.reduce((s, r) => s + (r.wrong_count ?? 0), 0)
    const phraseScore = phraseTotalAttempts > 0
      ? scoreToPct(phraseTotalAttempts - phraseErrors, phraseTotalAttempts)
      : 0
    const stuckPhrases = phraseRows.filter(r => (r.box ?? 1) <= 2 && !r.is_learned).length

    // ── Grammar analysis ──────────────────────────────────────────────────
    const grammarRows = grammarRes.data ?? []
    const grammarScore = grammarRows.length > 0
      ? Math.round(grammarRows.reduce((s, r) => s + (r.score ?? 0), 0) / grammarRows.length)
      : 0
    const grammarTrend = getTrend(
      grammarRows.filter(r => last7.includes(r.date ?? '')).map(r => r.score ?? 0),
      grammarRows.filter(r => !last7.includes(r.date ?? '')).map(r => r.score ?? 0),
    )

    // Find weakest grammar topic
    const topicScores = new Map<string, number[]>()
    for (const row of grammarRows) {
      if (row.topic_title) {
        const arr = topicScores.get(row.topic_title) ?? []
        arr.push(row.score ?? 0)
        topicScores.set(row.topic_title, arr)
      }
    }
    let weakestTopic = ''
    let weakestTopicScore = 100
    for (const [topic, scores] of topicScores) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      if (avg < weakestTopicScore) {
        weakestTopicScore = avg
        weakestTopic = topic
      }
    }

    // ── Writing analysis ──────────────────────────────────────────────────
    const writingRows = writingRes.data ?? []
    const writingAvg = writingRows.length > 0
      ? Math.round(writingRows.reduce((s, r) => s + ((r.score ?? 0) * 10), 0) / writingRows.length)
      : 0
    const writingTrend = getTrend(
      writingRows.filter(r => last7.includes(r.date ?? '')).map(r => (r.score ?? 0) * 10),
      writingRows.filter(r => !last7.includes(r.date ?? '')).map(r => (r.score ?? 0) * 10),
    )

    // ── Speaking analysis ─────────────────────────────────────────────────
    const speakingRows = speakingRes.data ?? []
    const speakingAvg = speakingRows.length > 0
      ? Math.round(speakingRows.reduce((s, r) => s + ((r.avg_score ?? 0) * 10), 0) / speakingRows.length)
      : 0

    // ── Listening analysis ────────────────────────────────────────────────
    const listeningRows = listeningRes.data ?? []
    const listeningAvg = listeningRows.length > 0
      ? Math.round(listeningRows.reduce((s, r) => s + (r.score ?? 0), 0) / listeningRows.length)
      : 0

    // ── Reading analysis ──────────────────────────────────────────────────
    const readingRows = readingRes.data ?? []
    const readingAvg = readingRows.length > 0
      ? Math.round(readingRows.reduce((s, r) => s + (r.score ?? 0), 0) / readingRows.length)
      : 0

    // ── Build weak spots list ─────────────────────────────────────────────
    const weakSpots: WeakSpot[] = [
      {
        category: 'vocabulary',
        label: 'Vocabulary',
        score: vocabScore,
        totalAttempts: vocabTotalAttempts,
        errorCount: vocabErrors,
        trend: vocabScore >= 80 ? 'improving' : 'stable',
        detail: stuckWords > 0
          ? `${stuckWords} ta so'z Box 1–2 da qotib qolgan`
          : vocabTotalAttempts > 0
          ? `${vocabErrors} ta xato, ${vocabScore}% aniqlik`
          : 'Hali so\'z o\'rganilmagan',
        recommendedAction: stuckWords > 5
          ? 'Box 1–2 dagi so\'zlarni takrorlang'
          : vocabScore < 70 && vocabTotalAttempts > 0
          ? 'Leitner tizimida past boxlarni mustahkamlang'
          : 'Yangi so\'zlarni o\'rganishda davom eting',
        icon: '📖',
      },
      {
        category: 'phrases',
        label: 'Phrases',
        score: phraseScore,
        totalAttempts: phraseTotalAttempts,
        errorCount: phraseErrors,
        trend: phraseScore >= 80 ? 'improving' : 'stable',
        detail: stuckPhrases > 0
          ? `${stuckPhrases} ta gap Box 1–2 da qotib qolgan`
          : phraseTotalAttempts > 0
          ? `${phraseErrors} ta xato, ${phraseScore}% aniqlik`
          : 'Hali gaplar o\'rganilmagan',
        recommendedAction: stuckPhrases > 3
          ? 'Qotib qolgan gaplarni alohida takrorlang'
          : 'Yangi gaplarni yodlashda davom eting',
        icon: '💬',
      },
      {
        category: 'grammar',
        label: 'Grammar',
        score: grammarScore,
        totalAttempts: grammarRows.length,
        errorCount: grammarRows.length > 0
          ? Math.round(grammarRows.reduce((s, r) => s + (100 - (r.score ?? 0)), 0) / 100 * grammarRows.length)
          : 0,
        trend: grammarTrend,
        detail: grammarRows.length > 0
          ? `O'rtacha ${grammarScore}%${weakestTopic ? ` · Eng zaif: ${weakestTopic}` : ''}`
          : 'Hali grammatika mashqlari bajarilmagan',
        recommendedAction: grammarScore < 70
          ? `${weakestTopic || 'Grammatika'} mavzusini qayta o'rganing`
          : 'Murakkab grammatik tuzilmalarga o\'ting',
        icon: '📐',
      },
      {
        category: 'writing',
        label: 'Writing',
        score: writingAvg,
        totalAttempts: writingRows.length,
        errorCount: 0,
        trend: writingTrend,
        detail: writingRows.length > 0
          ? `${writingRows.length} ta essay, o'rtacha ${writingAvg}%`
          : 'Hali yozish mashqi bajarilmagan',
        recommendedAction: writingAvg < 60
          ? 'Essay strukturasi ustida ishlang'
          : 'IELTS topshiriqlariga o\'ting',
        icon: '✍️',
      },
      {
        category: 'speaking',
        label: 'Speaking',
        score: speakingAvg,
        totalAttempts: speakingRows.length,
        errorCount: 0,
        trend: 'stable',
        detail: speakingRows.length > 0
          ? `${speakingRows.length} ta suhbat, o'rtacha ${speakingAvg}%`
          : 'Hali gapirish mashqi bajarilmagan',
        recommendedAction: speakingAvg < 60
          ? 'Ko\'proq gapirish mashq qiling'
          : 'Murakkab mavzularda suhbatlashing',
        icon: '🎙️',
      },
      {
        category: 'listening',
        label: 'Listening',
        score: listeningAvg,
        totalAttempts: listeningRows.length,
        errorCount: 0,
        trend: 'stable',
        detail: listeningRows.length > 0
          ? `O'rtacha ${listeningAvg}%`
          : 'Hali tinglash mashqi bajarilmagan',
        recommendedAction: listeningAvg < 70
          ? 'Sekinlashtirilgan audio bilan tinglang'
          : 'Real tezlikdagi audiolarga o\'ting',
        icon: '🎧',
      },
      {
        category: 'reading',
        label: 'Reading',
        score: readingAvg,
        totalAttempts: readingRows.length,
        errorCount: 0,
        trend: 'stable',
        detail: readingRows.length > 0
          ? `O'rtacha ${readingAvg}%`
          : 'Hali o\'qish mashqi bajarilmagan',
        recommendedAction: readingAvg < 70
          ? 'Qisqa matnlardan boshlang, so\'z boyligingizni oshiring'
          : 'Academic matnlarga o\'ting',
        icon: '📚',
      },
    ]

    // Sort by score ascending (weakest first), but only include categories with data
    const sortedSpots = weakSpots
      .filter(w => w.totalAttempts > 0)
      .sort((a, b) => a.score - b.score)

    // ── Weekly trends ─────────────────────────────────────────────────────
    const weeklyTrends: WeeklyTrend[] = []
    // Grammar trends per day (last 7)
    for (const date of last7) {
      const dayGrammar = grammarRows.filter(r => r.date === date)
      const avgScore = dayGrammar.length > 0
        ? Math.round(dayGrammar.reduce((s, r) => s + (r.score ?? 0), 0) / dayGrammar.length)
        : 0
      weeklyTrends.push({ date, avgScore, category: 'grammar' })
    }

    // ── Totals ────────────────────────────────────────────────────────────
    const totalErrors = sortedSpots.reduce((s, w) => s + w.errorCount, 0)
    const overallScore = sortedSpots.length > 0
      ? Math.round(sortedSpots.reduce((s, w) => s + w.score, 0) / sortedSpots.length)
      : 0

    return {
      weakSpots: sortedSpots,
      weeklyTrends,
      overallScore,
      totalExercisesDone: sortedSpots.reduce((s, w) => s + w.totalAttempts, 0),
      totalErrors,
      strongestCategory: sortedSpots.length > 0 ? sortedSpots[sortedSpots.length - 1]?.label ?? null : null,
      weakestCategory: sortedSpots.length > 0 ? sortedSpots[0]?.label ?? null : null,
    }
  } catch (e) {
    monitoring.captureMessage('fetchAnalytics error: ' + (e instanceof Error ? e.message : String(e)), 'error')
    return {
      weakSpots: [],
      weeklyTrends: [],
      overallScore: 0,
      totalExercisesDone: 0,
      totalErrors: 0,
      strongestCategory: null,
      weakestCategory: null,
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Quick summary (lighter version for Dashboard)
// ═══════════════════════════════════════════════════════════════════════════

export interface QuickWeakSpot {
  category: string
  label: string
  score: number
  icon: string
  detail: string
}

export async function fetchQuickWeakSpots(userId: string): Promise<QuickWeakSpot[]> {
  const analytics = await fetchAnalytics(userId)
  return analytics.weakSpots.slice(0, 3).map(w => ({
    category: w.category,
    label: w.label,
    score: w.score,
    icon: w.icon,
    detail: w.detail,
  }))
}
