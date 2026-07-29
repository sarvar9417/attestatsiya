import { monitoring } from '../lib/monitoring'

const PROXY_URL = '/api/claude'
const MODEL = (import.meta.env.VITE_CLAUDE_MODEL as string | undefined) ?? 'claude-sonnet-4-5'

export interface BuddyWeakSpot {
  category: string
  label: string
  score: number
  trend: 'improving' | 'stable' | 'declining'
}

export interface BuddyContext {
  userName: string
  currentLevel: string
  currentDay: number
  streak: number
  totalXP: number
  todayXP: number
  weeklyXP: number
  todayMinutes: number
  totalWordsLearned: number
  weakSpots?: BuddyWeakSpot[]
  grammarWeakTopics?: { topicTitle: string; avgScore: number }[]
  buddyName?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

function buildBuddySystemPrompt(ctx: BuddyContext, mode: 'chat' | 'voice' | 'tip'): string {
  const weakSpotSection = ctx.weakSpots && ctx.weakSpots.length > 0
    ? `\n\nSTUDENT'S WEAK AREAS (prioritize these in conversation):
${ctx.weakSpots.map((w, i) => `${i + 1}. ${w.label} (${w.category}) — score: ${w.score}%, trend: ${w.trend === 'declining' ? '⚠️ declining' : w.trend}`).join('\n')}`
    : '\n\nNo specific weak areas identified yet.'

  const grammarSection = ctx.grammarWeakTopics && ctx.grammarWeakTopics.length > 0
    ? `\n\nWEAK GRAMMAR TOPICS (try to naturally practice these):
${ctx.grammarWeakTopics.map(t => `  • ${t.topicTitle} (avg score: ${t.avgScore}%)`).join('\n')}`
    : ''

  const base = `You are EnglishPath AI Study Buddy — a friendly, motivating study companion for Uzbek students learning English.

ABOUT THE STUDENT:
• Name: ${ctx.userName}
• Current Level: ${ctx.currentLevel}
• Program Day: ${ctx.currentDay}/126
• Streak: ${ctx.streak} days 🔥
• Total XP: ${ctx.totalXP}
• Today's XP: ${ctx.todayXP}
• Words Learned: ${ctx.totalWordsLearned}
• Studied Today: ${ctx.todayMinutes} minutes${ctx.buddyName ? `\n• Study Buddy: ${ctx.buddyName}` : ''}
${weakSpotSection}${grammarSection}

CORE RULES:
1. You are a FRIENDLY STUDY BUDDY, not a teacher. Use casual, encouraging language.
2. Always respond in ENGLISH (not Uzbek).
3. Be concise — 2-4 sentences in chat mode, 1-2 sentences for tips.
4. Naturally work in corrections when the student makes errors — model the correct form in your response.
5. Reference their weak areas in conversation when relevant (e.g., "I noticed you've been working on prepositions — want to practice those?")
6. Celebrate their streak, XP milestones, and progress.
7. Use emojis naturally (🎯🔥💪⭐).
8. End messages with a question or suggestion to keep them engaged.
9. Adjust vocabulary to ${ctx.currentLevel} level.`

  if (mode === 'tip') {
    return base + `\n\nMODE: Daily Tip
Generate ONE specific, actionable study tip based on the student's current progress and weak areas.
Format:
💡 Today's Tip: <one sentence tip>
🎯 Focus: <what to practice today>
⏱️ Time: <suggested minutes>
💪 Challenge: <optional optional challenge>

Keep the tip SHORT and focused. The student should be able to act on it immediately.`
  }

  if (mode === 'voice') {
    return base + `\n\nMODE: Voice Chat
- This is a VOICE conversation. Keep responses VERY SHORT: 1-3 sentences.
- Speak naturally, like a friend would.
- End with a simple question to keep the conversation flowing.
- Do NOT give evaluations during the chat.
- Pronunciation note: the student is speaking aloud, so be patient and encouraging.`
  }

  return base + `\n\nMODE: Study Buddy Chat
- Chat like a supportive friend who also helps them improve their English.
- Reference their progress and weak areas naturally.
- Offer specific suggestions based on their data.
- Be warm and encouraging — studying English is hard work!`
}

async function proxyFetch(body: Record<string, unknown>): Promise<Response> {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `Proxy error: ${res.status}`)
  }
  return res
}

export async function generateDailyTip(ctx: BuddyContext): Promise<string> {
  try {
    const res = await proxyFetch({
      model: MODEL,
      max_tokens: 300,
      system: buildBuddySystemPrompt(ctx, 'tip'),
      messages: [{ role: 'user', content: 'Give me my daily study tip!' }],
      stream: false,
    })
    const data = await res.json()
    const block = data.content?.[0]
    return block?.type === 'text' ? block.text : getFallbackTip(ctx)
  } catch (e) {
    monitoring.captureMessage('generateDailyTip error: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return getFallbackTip(ctx)
  }
}

function getFallbackTip(ctx: BuddyContext): string {
  const levelTips: Record<string, string> = {
    'A1': 'Try to learn 5 new words every day and use them in sentences!',
    'A2': 'Practice the past tense by writing 3 sentences about your day.',
    'B1': 'Watch a short YouTube video in English and write a summary.',
    'B2': 'Try shadowing — repeat after a native speaker to improve pronunciation.',
  }
  const tip = levelTips[ctx.currentLevel] ?? levelTips.B1
  return `💡 Today's Tip: ${tip}\n🎯 Focus: Keep your ${ctx.streak}-day streak alive!\n⏱️ Time: 15 minutes`
}

export async function chatWithBuddy(
  ctx: BuddyContext,
  messages: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone: (full: string) => void,
  onError: (err: Error) => void
): Promise<void> {
  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        system: buildBuddySystemPrompt(ctx, 'chat'),
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err.error || `Proxy error: ${res.status}`)
    }

    let full = ''
    const reader = res.body?.getReader()
    if (!reader) { onDone(''); return }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6))
            const text = parsed.delta?.text || parsed.content?.[0]?.delta?.text || ''
            if (text) {
              full += text
              onDelta(text)
            }
          } catch (e) {
            monitoring.captureMessage('chatWithBuddy parse error: ' + (e instanceof Error ? e.message : String(e)), 'warn')
            /* skip parse errors */ }
        }
      }
    }

    onDone(full)
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    onError(err)
  }
}

export async function startBuddyVoiceChat(
  ctx: BuddyContext,
  onDelta: (token: string) => void,
  onDone: (full: string) => void,
  onError: (err: Error) => void
): Promise<void> {
  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 256,
        system: buildBuddySystemPrompt(ctx, 'voice'),
        messages: [{ role: 'user', content: 'Hi! Let\'s practice speaking. Start a conversation with me!' }],
        stream: true,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err.error || `Proxy error: ${res.status}`)
    }

    let full = ''
    const reader = res.body?.getReader()
    if (!reader) { onDone(''); return }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6))
            const text = parsed.delta?.text || parsed.content?.[0]?.delta?.text || ''
            if (text) {
              full += text
              onDelta(text)
            }
          } catch (e) {
            monitoring.captureMessage('chatWithBuddy parse error: ' + (e instanceof Error ? e.message : String(e)), 'warn')
            /* skip parse errors */ }
        }
      }
    }

    onDone(full)
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    onError(err)
  }
}

export async function getContextFromStore(): Promise<BuddyContext | null> {
  try {
    const { useStore } = await import('../store/useStore')
    const state = useStore.getState()
    return {
      userName: state.userName || 'Student',
      currentLevel: state.currentLevel,
      currentDay: state.currentDay,
      streak: state.streak,
      totalXP: state.totalXP,
      todayXP: state.todayXP,
      weeklyXP: state.weeklyXP ?? 0,
      todayMinutes: state.todayMinutes,
      totalWordsLearned: state.totalWordsLearned,
    }
  } catch (e) {
    monitoring.captureMessage('getContextFromStore failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return null
  }
}
