import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { monitoring } from '../lib/monitoring'
import { GRAMMAR_TOPICS } from '../data/grammar'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AdaptiveTask {
  id: string
  type: 'review' | 'drill' | 'new-topic' | 'vocab-review' | 'writing-prompt' | 'listening-prompt'
  topicId?: string
  label: string
  detail: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  xp: number
  estimatedMinutes: number
}

export interface AdaptivePlan {
  date: string
  tasks: AdaptiveTask[]
  totalEstimatedMinutes: number
  totalXP: number
  focusArea: string
  focusReason: string
}

export interface GrammarTopicScore {
  topicId: string
  topicTitle: string
  avgScore: number
  attempts: number
  lastAttempt: string | null
}

// ─── Analyzers ──────────────────────────────────────────────────────────────

async function fetchGrammarTopicScores(userId: string): Promise<GrammarTopicScore[]> {
  const { data, error } = await supabase
    .from('grammar_progress')
    .select('topic_id, topic_title, score, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (error) {
    monitoring.captureMessage('fetchGrammarTopicScores error: ' + error.message, 'warn')
    return []
  }

  if (!data || data.length === 0) return []

  const topicMap = new Map<string, { scores: number[]; lastAttempt: string | null }>()
  for (const row of data) {
    if (!row.topic_id) continue
    const entry = topicMap.get(row.topic_id) ?? { scores: [], lastAttempt: null }
    entry.scores.push(row.score ?? 0)
    if (!entry.lastAttempt && row.completed_at) entry.lastAttempt = row.completed_at
    topicMap.set(row.topic_id, entry)
  }

  return Array.from(topicMap.entries()).map(([topicId, entry]) => {
    const topic = GRAMMAR_TOPICS.find(t => t.id === topicId)
    return {
      topicId,
      topicTitle: topic?.title ?? topicId,
      avgScore: Math.round(entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length),
      attempts: entry.scores.length,
      lastAttempt: entry.lastAttempt,
    }
  })
}

async function fetchWeakestTopics(userId: string, limit = 3): Promise<GrammarTopicScore[]> {
  const scores = await fetchGrammarTopicScores(userId)
  return scores
    .filter(s => s.avgScore < 80)
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, limit)
}

// ─── Plan Generator ─────────────────────────────────────────────────────────

export async function generateAdaptivePlan(userId: string): Promise<AdaptivePlan> {
  const today = new Date().toISOString().split('T')[0]

  try {
    const weakTopics = await fetchWeakestTopics(userId, 3)
    const tasks: AdaptiveTask[] = []

    // 1. Review weakest grammar topics
    for (const wt of weakTopics) {
      tasks.push({
        id: `review-${wt.topicId}`,
        type: 'review',
        topicId: wt.topicId,
        label: `${wt.topicTitle} — qayta o'rganish`,
        detail: `Oxirgi natija: ${wt.avgScore}%. ${wt.attempts} ta urinish`,
        reason: wt.avgScore < 50
          ? 'Bu mavzu sizga juda zaif. Asosdan boshlang.'
          : wt.avgScore < 70
          ? "O'rtacha natija. Qo'shimcha mashqlar bilan mustahkamlang."
          : 'Yaxshi, lekin hali 80% dan past. Bir oz ko\'proq mashq qiling.',
        priority: wt.avgScore < 50 ? 'high' : wt.avgScore < 70 ? 'medium' : 'low',
        xp: calculateXP(wt.avgScore),
        estimatedMinutes: 10,
      })
    }

    // 2. Add a vocab review task if vocabulary is weak
    tasks.push({
      id: 'daily-vocab-review',
      type: 'vocab-review',
      label: 'Leitner takrorlash',
      detail: "Bugungi SRS takrorlash — eski so'zlarni unutmang",
      reason: 'Kunlik takrorlash eslab qolishni 70% gacha oshiradi',
      priority: 'medium',
      xp: 50,
      estimatedMinutes: 10,
    })

    // 3. If no weak spots found, suggest moving forward
    if (weakTopics.length === 0) {
      tasks.unshift({
        id: 'new-topic',
        type: 'new-topic',
        label: 'Yangi grammatika mavzusi',
        detail: 'Barcha mavzular yaxshi holatda. Yangi mavzu o\'rganing!',
        reason: 'Hozirgi darajangiz yangi mavzuga tayyor',
        priority: 'medium',
        xp: 100,
        estimatedMinutes: 15,
      })
    }

    // Focus area
    const focusArea = weakTopics.length > 0 ? weakTopics[0].topicTitle : 'Grammar'
    const focusReason = weakTopics.length > 0
      ? `Eng past natija: ${weakTopics[0].avgScore}% — shu mavzuni mustahkamlash kerak`
      : 'Barcha mavzular yaxshi — yangi mavzuga o\'ting'

    const totalMinutes = tasks.reduce((s, t) => s + t.estimatedMinutes, 0)
    const totalXP = tasks.reduce((s, t) => s + t.xp, 0)

    return { date: today, tasks, totalEstimatedMinutes: totalMinutes, totalXP, focusArea, focusReason }
  } catch (e) {
    monitoring.captureMessage('generateAdaptivePlan error: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return {
      date: today,
      tasks: [{
        id: 'default-drill',
        type: 'drill',
        label: 'Grammatika mashq',
        detail: 'Kunlik grammatika mashqlarini bajaring',
        reason: 'Ma\'lumotlar yuklanmadi — standart mashq',
        priority: 'medium',
        xp: 50,
        estimatedMinutes: 10,
      }],
      totalEstimatedMinutes: 10,
      totalXP: 50,
      focusArea: 'Grammar',
      focusReason: 'Kunlik grammatika mashqi',
    }
  }
}

function calculateXP(score: number): number {
  if (score < 50) return 80
  if (score < 70) return 60
  return 40
}

// ─── Daily plan persistence ────────────────────────────────────────────────

export async function saveAdaptivePlan(userId: string, plan: AdaptivePlan): Promise<void> {
  await supabase.from('adaptive_plans').upsert({
    user_id: userId,
    date: plan.date,
    plan_data: db.toJson(plan),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,date' })
}

export async function loadAdaptivePlan(userId: string, date: string): Promise<AdaptivePlan | null> {
  const { data } = await supabase
    .from('adaptive_plans')
    .select('plan_data')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle()

  if (!data) return null
  return db.cast<AdaptivePlan>(data.plan_data)
}
