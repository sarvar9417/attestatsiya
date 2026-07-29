import { MODEL, proxyFetch } from '../claudeClient'
import { monitoring } from '../monitoring'

export interface DailyExerciseCheckItem {
  id: number
  context: string
  correct: string
  userAnswer: string
  type: string
}

export async function checkDailyExerciseAnswers(
  items: DailyExerciseCheckItem[]
): Promise<boolean[]> {
  if (items.length === 0) return []

  const exerciseList = items.map((item, i) =>
    `[${i + 1}] Type: ${item.type}\nContext: ${item.context}\nExpected answer: ${item.correct}\nStudent's answer: ${item.userAnswer}`
  ).join('\n\n')

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 50 + items.length * 30,
    system: `You are a strict but fair English grammar exercise checker for daily language lessons. Your job: determine if a student's answer is an ACCEPTABLE ALTERNATIVE even when it differs from the expected answer.

RULES:
1. ACCEPT contractions as fully equivalent to their full forms and vice versa:
   I'll = I will, he's = he is, she's = she is, it's = it is, they're = they are,
   we've = we have, I've = I have, won't = will not, can't = cannot / can not,
   don't = do not, doesn't = does not, didn't = did not, isn't = is not, aren't = are not,
   I'm = I am, he'd = he would, I'd = I would. NEVER mark an answer wrong only because
   the student used a contraction or the full form.
2. ACCEPT synonyms and close alternatives (e.g., "big" ≈ "large", "quickly" ≈ "fast")
3. ACCEPT alternate correct grammatical forms
4. ACCEPT minor typos (1 letter off) if the word is still clearly recognizable
5. REJECT answers that change the meaning or are grammatically incorrect
6. REJECT answers that mix comparative+more (e.g., "more bigger" is WRONG)
7. For fill-table exercises: each cell comparison is separate, accept if at least half the cells match in spirit

Respond ONLY with a JSON array of booleans, e.g.: [true, false, true, ...]
Where each value corresponds to the exercise at that position (index 1 = first exercise).
true = student's answer is acceptable, false = it is NOT acceptable.`,
    messages: [{
      role: 'user',
      content: `Check if each student's answer is an acceptable alternative for these daily English grammar exercises:\n\n${exerciseList}\n\nRespond ONLY with a JSON array of booleans.`,
    }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '[]'

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        return parsed.map((v: unknown) => Boolean(v))
      }
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'checkDailyExerciseAnswers:jsonParse' })
  }

  return items.map(() => false)
}

// ── Speaking Task ─────────────────────────────────────────────────────────

export interface GeneratedExercise {
  question:    string
  options:     string[]
  correct:     string
  explanation: string
}

export async function generatePracticeExercises(
  topic: string,
  theme: string,
  level: string,
  count = 6
): Promise<GeneratedExercise[]> {
  const themeLine = theme && theme !== 'Umumiy'
    ? `Make the sentences about the theme "${theme}" to keep it engaging.`
    : 'Use varied everyday contexts.'

  const system = `You are an expert English exercise writer for ${level}-level Uzbek learners. \
Create FRESH, original multiple-choice grammar exercises on the given topic. ${themeLine}

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "exercises": [
    {
      "question": "<one sentence with a single gap marked as ___ >",
      "options": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"],
      "correct": "<exactly one of the options — the right answer>",
      "explanation": "<1 short UZBEK sentence explaining why it is correct>"
    }
  ]
}

Rules:
- Exactly ${count} exercises. Each tests the topic "${topic}".
- Exactly ONE gap (___) per question. Exactly 4 plausible options. "correct" MUST be one of the options.
- Vary difficulty appropriately for ${level}. Make options tricky but fair.
- explanation in natural Uzbek, short.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 1600,
    system,
    messages: [{ role: 'user', content: `Topic: "${topic}". Generate ${count} fresh multiple-choice exercises. Respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []
    const parsed = JSON.parse(jsonMatch[0])
    if (!Array.isArray(parsed.exercises)) return []
    return parsed.exercises
      .map((e: { question?: string; options?: unknown; correct?: string; explanation?: string }) => ({
        question:    String(e.question ?? ''),
        options:     Array.isArray(e.options) ? e.options.map(String).slice(0, 4) : [],
        correct:     String(e.correct ?? ''),
        explanation: String(e.explanation ?? ''),
      }))
      .filter((e: GeneratedExercise) => e.question && e.options.length === 4 && e.options.includes(e.correct))
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generatePracticeExercises:jsonParse' })
    return []
  }
}

// ── Learning Insights ──────────────────────────────────────────────────────

export interface LearningSignals {
  level:      string
  streak:     number
  skills:     { name: string; pct: number }[]
  weakGrammar: string[]
}

export interface LearningInsights {
  strengths:      string[]
  focusArea:      string
  recommendation: string
  motivation:     string
}

export async function generateLearningInsights(
  signals: LearningSignals
): Promise<LearningInsights> {
  const skillsLine = signals.skills.map(s => `${s.name}: ${s.pct}%`).join(', ')
  const weakLine = signals.weakGrammar.length ? signals.weakGrammar.join(', ') : 'aniqlanmagan'

  const system = `You are a supportive personal English coach for an Uzbek learner. \
Analyse their progress data and give SHORT, specific, actionable insights — all in UZBEK.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "strengths": ["<1-2 strong areas, short Uzbek phrases>"],
  "focusArea": "<the single most important area to improve, short Uzbek phrase>",
  "recommendation": "<1 concrete, specific action in Uzbek — e.g. which skill to practise and how>",
  "motivation": "<1-2 warm, motivating sentences in Uzbek>"
}

Rules:
- Base everything on the actual data. Lower % = weaker skill.
- Be specific and encouraging. Keep each field short.
- All text in natural Uzbek.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 500,
    system,
    messages: [{ role: 'user', content: `Learner data:
- CEFR level: ${signals.level}
- Streak: ${signals.streak} kun
- Skill scores: ${skillsLine}
- Weak grammar topics: ${weakLine}

Analyse and respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback: LearningInsights = {
    strengths: [], focusArea: '', recommendation: '',
    motivation: "Har kuni bir oz mashq — katta natijaga olib keladi. Davom eting! 💪",
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      strengths:      Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3).map(String) : [],
      focusArea:      String(parsed.focusArea || ''),
      recommendation: String(parsed.recommendation || ''),
      motivation:     String(parsed.motivation || fallback.motivation),
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generateLearningInsights:jsonParse' })
    return fallback
  }
}

// ── Pronunciation Analysis ─────────────────────────────────────────────────

