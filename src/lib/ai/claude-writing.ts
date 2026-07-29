import { MODEL, proxyFetch } from '../claudeClient'
import { monitoring } from '../monitoring'

export interface GeneratedWritingTask {
  prompt: string
  wordLimit: number
  tips: string[]
  keyPhrases: { phrase: string; translation: string }[]
  structure: string[]
}

export async function generateWritingTask(
  topic: string,
  level: string,
  formulas?: { label: string; structure: string; color?: string }[],
  rules?: string[],
  vocabulary?: { en: string; uz: string; example?: string; rule?: string }[]
): Promise<GeneratedWritingTask> {
  let extra = ''
  if (formulas && formulas.length > 0) {
    extra += '\nGrammar formulas:\n' + formulas.map(f => `- ${f.label}: ${f.structure}`).join('\n')
  }
  if (rules && rules.length > 0) {
    extra += '\nGrammar rules:\n' + rules.map(r => `- ${r}`).join('\n')
  }
  if (vocabulary && vocabulary.length > 0) {
    extra += '\nTarget vocabulary:\n' + vocabulary.map(v => `- ${v.en} = ${v.uz}`).join('\n')
  }

  const system = `You are an English writing teacher creating a SHORT writing task for a ${level}-level Uzbek learner, \
based on the grammar/lesson topic they just studied. The task must make them USE that grammar while writing.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown):
{
  "prompt": "<one clear writing task (1-2 sentences) that makes the learner practise the topic by writing ~80-150 words>",
  "wordLimit": <number between 80-150, appropriate for ${level}>,
  "tips": ["<2-4 short UZBEK tips on what to include / how to use the grammar>"],
  "keyPhrases": [{"phrase": "<useful English phrase for this task>", "translation": "<short Uzbek>"}],
  "structure": ["<step 1>", "<step 2>", "<step 3>"]
}

Rules:
- The prompt must clearly relate to the topic "${topic}" and be ${level}-appropriate.
- 3-4 keyPhrases, 2-3 structure steps. All tips/translations in natural Uzbek.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 700,
    system,
    messages: [{ role: 'user', content: `Lesson topic: "${topic}".${extra}\n\nCreate a writing task that incorporates these grammar/vocabulary points. JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback: GeneratedWritingTask = {
    prompt: `Write about "${topic}" in ${80-150} words. Use what you learned in this lesson.`,
    wordLimit: level === 'A1' ? 60 : level === 'A2' ? 80 : 120,
    tips: ["O'rgangan grammatikani ishlatishga harakat qiling.", 'Reja tuzib oling.'],
    keyPhrases: [],
    structure: ['Introduction', 'Main body', 'Conclusion'],
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      prompt: String(parsed.prompt || fallback.prompt),
      wordLimit: Number(parsed.wordLimit) || fallback.wordLimit,
      tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 5).map(String) : fallback.tips,
      keyPhrases: Array.isArray(parsed.keyPhrases)
        ? parsed.keyPhrases.slice(0, 6).map((k: { phrase?: string; translation?: string }) => ({ phrase: String(k.phrase ?? ''), translation: String(k.translation ?? '') })).filter((k: { phrase: string }) => k.phrase)
        : [],
      structure: Array.isArray(parsed.structure) ? parsed.structure.slice(0, 5).map(String) : fallback.structure,
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generateWritingTask:jsonParse' })
    return fallback
  }
}

// ── Practice Exercises ─────────────────────────────────────────────────────

