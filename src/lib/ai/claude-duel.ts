import { MODEL, proxyFetch } from '../claudeClient'
import { monitoring } from '../monitoring'
import type { ScenarioReport } from './claude-speaking'

export async function generateDuelVerdict(
  playerLevel: string,
  mode: string,
  totalQuestions: number,
  correctCount: number,
  questionSummary: string
): Promise<{ grammar_score: number; vocab_score: number; topic_score: number; feedback: string }> {
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  const system = `You are a fair English assessment AI evaluating a ${playerLevel}-level learner's duel performance.
Analyse their results and provide scores in EXACTLY this JSON format (no markdown, no extra text):
{
  "grammar_score": <1-10 integer — grammatical accuracy demonstrated>,
  "vocab_score": <1-10 integer — vocabulary range and precision>,
  "topic_score": <1-10 integer — topic understanding / task completion>,
  "feedback": "<1-2 encouraging UZBEK sentences: highlight one strength and one improvement area>"
}

Scoring guide:
- 1-3: needs significant improvement
- 4-6: developing, some errors
- 7-8: good, minor errors
- 9-10: excellent, near-native for this level

Base your assessment on: the duel mode (${mode}), total questions (${totalQuestions}), correct answers (${correctCount}, ${accuracy}% accuracy), and the question summary (${questionSummary}).
Higher accuracy = higher scores, but a student who got 7/10 hard questions deserves higher topic_score than 10/10 easy ones.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 400,
    system,
    messages: [{ role: 'user', content: `Duel mode: ${mode}
Questions: ${totalQuestions}
Correct: ${correctCount} (${accuracy}%)
Level: ${playerLevel}
Question types: ${questionSummary}

Analyse this learner's duel performance and respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback = {
    grammar_score: Math.max(1, Math.min(10, Math.round(accuracy / 10))),
    vocab_score: Math.max(1, Math.min(10, Math.round(accuracy / 10))),
    topic_score: Math.max(1, Math.min(10, Math.round(accuracy / 10))),
    feedback: accuracy >= 70
      ? `Yaxshi natija! ${accuracy}% to'g'ri javob berdingiz. Davom eting! 💪`
      : `Yana mashq qilish kerak. ${accuracy}% to'g'ri — takrorlang va qayta urinib ko'ring. 📚`,
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      grammar_score: Math.max(1, Math.min(10, Number(parsed.grammar_score) || fallback.grammar_score)),
      vocab_score: Math.max(1, Math.min(10, Number(parsed.vocab_score) || fallback.vocab_score)),
      topic_score: Math.max(1, Math.min(10, Number(parsed.topic_score) || fallback.topic_score)),
      feedback: String(parsed.feedback || fallback.feedback),
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generateDuelVerdict:jsonParse' })
    return fallback
  }
}

// ── Duo Roleplay Report ───────────────────────────────────────────────────

export async function generateDuoRoleplayReport(
  scenarioA: { aiRole: string; userRole: string; opening: string; title: string },
  goalUz: string,
  level: string,
  userAName: string,
  userBName: string,
  userAHistory: { role: 'user' | 'assistant'; content: string }[],
  userBHistory: { role: 'user' | 'assistant'; content: string }[],
): Promise<{
  userA: ScenarioReport
  userB: ScenarioReport
}> {
  const userATranscript = userAHistory
    .filter(m => m.content !== '(Begin)')
    .map(m => `${m.role === 'user' ? userAName : scenarioA.aiRole}: ${m.content}`)
    .join('\n')

  const userBTranscript = userBHistory
    .filter(m => m.content !== '(Begin)')
    .map(m => `${m.role === 'user' ? userBName : scenarioA.aiRole}: ${m.content}`)
    .join('\n')

  const combinedUserBContext = userBHistory.length > 0
    ? userBTranscript
    : `${userBName} hali suhbat qilmagan (faqat ${userAName} o'ynagan).`

  const system = `You are an encouraging English coach analysing TWO ${level}-level learners in a TANDEM ROLEPLAY DUO.

Scenario: "${scenarioA.title}"
${scenarioA.userRole}: ${userAName} and ${userBName}
${scenarioA.aiRole}: the AI character

Goal: "${goalUz}"

You must evaluate EACH learner independently based on their conversation with the AI character.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "userA": {
    "fluency": <1-10 integer>,
    "taskSuccess": <1-10 integer — did they accomplish the goal in their role?>,
    "newWords": [{"word": "<useful word/phrase>", "meaning": "<short Uzbek meaning>"}],
    "mistakes": [{"wrong": "<exact learner phrase with error>", "correct": "<corrected version>", "tip": "<1 short Uzbek tip>"}],
    "encouragement": "<2 warm Uzbek sentences about their performance and one focus area>"
  },
  "userB": {
    "fluency": <1-10 integer>,
    "taskSuccess": <1-10 integer>,
    "newWords": [{"word": "<useful word/phrase>", "meaning": "<short Uzbek meaning>"}],
    "mistakes": [{"wrong": "<exact learner phrase with error>", "correct": "<corrected version>", "tip": "<1 short Uzbek tip>"}],
    "encouragement": "<2 warm Uzbek sentences about their performance and one focus area>"
  }
}

Rules:
- newWords: 2-4 per person, slightly above their level
- mistakes: only REAL errors from that person's lines (max 4). If none, empty array.
- If a person hasn't spoken yet, give them fluency=0, taskSuccess=0, empty newWords, empty mistakes, and encouragement saying they still need to play.
- Be fair and independent for each learner.
- All Uzbek text natural and warm.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 1500,
    system,
    messages: [{ role: 'user', content: `Conversation transcript for ${userAName}:\n\n${userATranscript}\n\n---\n\nConversation transcript for ${userBName}:\n\n${combinedUserBContext}\n\nAnalyse both learners' performances and respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallbackEval = {
    fluency: 0, taskSuccess: 0, newWords: [], mistakes: [],
    encouragement: "Suhbat tugadi! Mashq qilganingiz uchun rahmat — har bir urinish sizni kuchaytiradi.",
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { userA: fallbackEval, userB: fallbackEval }
    const parsed = JSON.parse(jsonMatch[0])

    const parseEval = (obj: unknown): ScenarioReport => {
      const o = obj as Record<string, unknown>
      return {
        fluency:     Math.max(0, Math.min(10, Number(o.fluency) || 0)),
        taskSuccess: Math.max(0, Math.min(10, Number(o.taskSuccess) || 0)),
        newWords:    Array.isArray(o.newWords) ? o.newWords.slice(0, 4).map((w: { word?: string; meaning?: string }) => ({ word: String(w.word ?? ''), meaning: String(w.meaning ?? '') })) : [],
        mistakes:    Array.isArray(o.mistakes) ? o.mistakes.slice(0, 4).map((m: { wrong?: string; correct?: string; tip?: string }) => ({ wrong: String(m.wrong ?? ''), correct: String(m.correct ?? ''), tip: String(m.tip ?? '') })) : [],
        encouragement: String((o.encouragement ?? fallbackEval.encouragement)),
      }
    }

    return {
      userA: parseEval(parsed.userA),
      userB: parseEval(parsed.userB),
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generateDuoRoleplayReport:jsonParse' })
    return { userA: fallbackEval, userB: fallbackEval }
  }
}
