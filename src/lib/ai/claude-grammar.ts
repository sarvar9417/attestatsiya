import { MODEL, proxyFetch, sendMessage } from '../claudeClient'
import { monitoring } from '../monitoring'

export async function checkGrammar(text: string): Promise<string> {
  return sendMessage(
    [{ role: 'user', content: `Please check my grammar:\n\n${text}` }],
    'grammar-check'
  )
}

export async function getWritingFeedback(essay: string): Promise<string> {
  return sendMessage(
    [{ role: 'user', content: `Please give detailed feedback on my writing:\n\n${essay}` }],
    'writing-feedback'
  )
}

export interface WritingError {
  wrong:       string
  correct:     string
  explanation: string
  category:    string
}

export async function analyzeWritingErrors(
  prompt: string,
  essay: string,
  level: string
): Promise<WritingError[]> {
  const system = `You are a meticulous English writing teacher analysing a ${level}-level (Uzbek speaker) student's essay. \
Find the SPECIFIC errors and return them as actionable corrections.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "errors": [
    {
      "wrong": "<the exact phrase the student wrote that contains the error>",
      "correct": "<the corrected phrase>",
      "explanation": "<1 short sentence in UZBEK explaining why it is wrong>",
      "category": "<one of: Grammatika, Lug'at, Artikl, Imlo, Punktuatsiya, So'z tartibi, Predlog>"
    }
  ]
}

Rules:
- Only include REAL errors actually present in the essay. Quote the student's exact words in "wrong".
- Maximum 8 most important errors. Prioritise errors that affect meaning or are repeated.
- If the essay is essentially error-free, return {"errors": []}.
- "explanation" must be in natural Uzbek, short and clear.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 1400,
    system,
    messages: [{ role: 'user', content: `Writing prompt: "${prompt}"\n\nStudent's essay:\n"${essay}"\n\nFind the specific errors and respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []
    const parsed = JSON.parse(jsonMatch[0])
    if (!Array.isArray(parsed.errors)) return []
    return parsed.errors.slice(0, 8).map((e: { wrong?: string; correct?: string; explanation?: string; category?: string }) => ({
      wrong:       String(e.wrong ?? ''),
      correct:     String(e.correct ?? ''),
      explanation: String(e.explanation ?? ''),
      category:    String(e.category ?? 'Grammatika'),
    })).filter((e: WritingError) => e.wrong && e.correct)
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'analyzeWritingErrors:jsonParse' })
    return []
  }
}

// ── Duel Verdict ────────────────────────────────────────────────────────────

