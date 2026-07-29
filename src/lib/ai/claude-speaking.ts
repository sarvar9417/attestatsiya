import { MODEL, proxyFetch } from '../claudeClient'
import { monitoring } from '../monitoring'

export async function getSpeakingChatFeedback(
  level: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  pronunciationFocus?: { sound: string; ipaExample: string; tipUz: string; tipEn: string; commonError?: string },
  grammarTips?: string[]
): Promise<string> {
  let focusBlock = ''
  if (pronunciationFocus || (grammarTips && grammarTips.length > 0)) {
    focusBlock = '\n\nADDITIONAL FOCUS AREAS FOR THIS SESSION — use these to give more targeted feedback:'
    if (pronunciationFocus) {
      focusBlock += `\n🔊 Talaffuz fokusi: /${pronunciationFocus.sound}/ (${pronunciationFocus.ipaExample})\n  - O'zbeklar uchun odatdagi xato: ${pronunciationFocus.commonError || '—'}\n  - Maslahat: ${pronunciationFocus.tipUz}\n  - Fikrda: talaffuz qanchalik to'g'ri edi?`
    }
    if (grammarTips && grammarTips.length > 0) {
      focusBlock += `\n📚 Grammatika fokuslari:\n${grammarTips.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}\n  - Fikrda: o'quvchi bu grammatik qoidalarni ishlata oldimi?`
    }
  }

  const system = `You are an encouraging English speaking coach for a ${level}-level UZBEK learner.
Provide brief, constructive feedback on the conversation that just ended.

IMPORTANT: Write the ENTIRE feedback in UZBEK (Latin script). Keep English ONLY for
specific words/phrases the learner used as examples.

Use these EXACT Uzbek labels and format:
✅ Kuchli tomon: [yaxshi bajargan bir narsa]
📌 Yaxshilash kerak: [ustida ishlash kerak bo'lgan aniq bir narsa]
💡 Maslahat: [keyingi safar uchun bitta amaliy maslahat]

120 so'zdan oshmasin. Iliq va rag'batlantiruvchi bo'l. Hammasi o'zbek tilida.${focusBlock}`

  const transcript = history.map(m => `${m.role === 'user' ? 'Student' : 'You'}: ${m.content}`).join('\n')

  try {
    const res = await proxyFetch({
      model: MODEL,
      max_tokens: 300,
      system,
      messages: [{ role: 'user', content: `Here is the conversation transcript:\n\n${transcript}\n\nIltimos, qisqa fikr-mulohaza bering — HAMMASI o'zbek tilida.` }],
      stream: false,
    })
    const data = await res.json()
    const block = data.content?.[0]
    return block?.type === 'text' ? block.text : ''
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'getSpeakingChatFeedback' })
    return ''
  }
}

// ── Scenario Report ────────────────────────────────────────────────────────

export interface ScenarioReport {
  fluency:    number
  taskSuccess: number
  newWords:   { word: string; meaning: string }[]
  mistakes:   { wrong: string; correct: string; tip: string }[]
  encouragement: string
}

export async function getScenarioReport(
  scenario: { aiRole: string; userRole: string; opening: string; title: string },
  goalUz: string,
  level: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<ScenarioReport> {
  const transcript = history
    .filter(m => m.content !== '(Begin)')
    .map(m => `${m.role === 'user' ? 'Learner' : scenario.aiRole}: ${m.content}`)
    .join('\n')

  const system = `You are an encouraging English coach analysing a ${level}-level learner's performance in a roleplay conversation. \
The learner played "${scenario.userRole}" and their goal was: "${goalUz}".

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "fluency": <1-10 integer>,
  "taskSuccess": <1-10 integer — did they accomplish the goal?>,
  "newWords": [{"word": "<useful word/phrase the learner could learn>", "meaning": "<short Uzbek meaning>"}],
  "mistakes": [{"wrong": "<exact learner phrase with an error>", "correct": "<corrected version>", "tip": "<1 short Uzbek tip>"}],
  "encouragement": "<2 warm sentences in Uzbek about what they did well and one thing to focus on>"
}

Rules:
- newWords: 2-4 items, slightly above the learner's level (help them grow).
- mistakes: only REAL errors from the learner's lines (max 4). If none, use an empty array.
- Keep all Uzbek text natural and warm.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 900,
    system,
    messages: [{ role: 'user', content: `Conversation transcript:\n\n${transcript}\n\nAnalyse the learner's performance and respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback: ScenarioReport = {
    fluency: 0, taskSuccess: 0, newWords: [], mistakes: [],
    encouragement: "Suhbat tugadi! Mashq qilganingiz uchun rahmat — har bir urinish sizni kuchaytiradi.",
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      fluency:     Math.max(0, Math.min(10, Number(parsed.fluency) || 0)),
      taskSuccess: Math.max(0, Math.min(10, Number(parsed.taskSuccess) || 0)),
      newWords:    Array.isArray(parsed.newWords) ? parsed.newWords.slice(0, 4).map((w: { word?: string; meaning?: string }) => ({ word: String(w.word ?? ''), meaning: String(w.meaning ?? '') })) : [],
      mistakes:    Array.isArray(parsed.mistakes) ? parsed.mistakes.slice(0, 4).map((m: { wrong?: string; correct?: string; tip?: string }) => ({ wrong: String(m.wrong ?? ''), correct: String(m.correct ?? ''), tip: String(m.tip ?? '') })) : [],
      encouragement: String(parsed.encouragement || fallback.encouragement),
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'getScenarioReport:jsonParse' })
    return fallback
  }
}

// ── Check Daily Exercise Answers ───────────────────────────────────────────

export interface SpeakingTask {
  prompt:     string
  tips:       string[]
  keyPhrases: { phrase: string; translation: string }[]
}

export async function generateSpeakingTask(
  topic: string,
  level: string,
  formulas?: { label: string; structure: string; color?: string }[],
  rules?: string[],
  vocabulary?: { en: string; uz: string; example?: string; rule?: string }[]
): Promise<SpeakingTask> {
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

  const system = `You are an English speaking coach creating a SHORT speaking task for a ${level}-level Uzbek learner, \
based on the grammar/lesson topic they just studied. The task must make them USE that grammar while speaking.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown):
{
  "prompt": "<one clear speaking task (1-2 sentences) that makes the learner practise the topic by speaking ~30-60 seconds>",
  "tips": ["<2-3 short UZBEK tips on what to include / how to use the grammar>"],
  "keyPhrases": [{"phrase": "<useful English phrase for this task>", "translation": "<short Uzbek>"}]
}

Rules:
- The prompt must clearly relate to the topic "${topic}" and be ${level}-appropriate.
- 3-5 keyPhrases. All tips/translations in natural Uzbek.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 600,
    system,
    messages: [{ role: 'user', content: `Lesson topic: "${topic}".${extra}\n\nCreate a speaking task that incorporates these grammar/vocabulary points. JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback: SpeakingTask = {
    prompt: `Talk about "${topic}" for 30-60 seconds. Use what you learned in this lesson.`,
    tips: ["O'rgangan grammatikani ishlatishga harakat qiling.", 'Sekin va aniq gapiring.'],
    keyPhrases: [],
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      prompt: String(parsed.prompt || fallback.prompt),
      tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 4).map(String) : fallback.tips,
      keyPhrases: Array.isArray(parsed.keyPhrases)
        ? parsed.keyPhrases.slice(0, 6).map((k: { phrase?: string; translation?: string }) => ({ phrase: String(k.phrase ?? ''), translation: String(k.translation ?? '') })).filter((k: { phrase: string }) => k.phrase)
        : [],
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generateSpeakingTask:jsonParse' })
    return fallback
  }
}

// ── Writing Task ───────────────────────────────────────────────────────────

export interface PronunciationIssue {
  word: string
  heard: string
  ipa: string
  tip: string
}

export interface PronunciationAnalysis {
  score: number
  issues: PronunciationIssue[]
  encouragement: string
}

export async function analyzePronunciation(
  target: string,
  transcript: string,
  ipa: string,
  level: string,
  acoustic?: { pitchMean: number; pitchStddev: number; avgEnergy: number; energyVariation: number }
): Promise<PronunciationAnalysis> {
  const system = `You are an expert English pronunciation coach for ${level}-level UZBEK speakers. \
The learner tried to say a target phrase. A speech-recognition system transcribed what it heard. \
By comparing the TARGET with the HEARD transcript, infer which words were likely MISPRONOUNCED \
(if the recogniser heard a different word, the learner probably mispronounced it).

Focus on sounds Uzbek speakers struggle with: th (θ/ð), w vs v, short/long vowels (ship/sheep), \
-ed endings, word stress, silent letters, /æ/, /ŋ/.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "score": <0-100 — overall pronunciation accuracy>,
  "issues": [
    {"word": "<the target word likely mispronounced>", "heard": "<what was heard, or '—' if just unclear>", "ipa": "<correct IPA for that word>", "tip": "<1 short UZBEK tip on how to say it>"}
  ],
  "encouragement": "<2 warm UZBEK sentences: what was good + one focus area>"
}

Rules:
- If TARGET and HEARD match closely, score high (85-100) and issues can be empty.
- Max 4 issues, the most important ones.
- All tips and encouragement in natural Uzbek.`

  let userContent = `TARGET phrase: "${target}"\nCorrect IPA: ${ipa}\nHEARD (speech recognition): "${transcript || '(nothing detected)'}"\n\nAnalyse the pronunciation and respond with JSON only.`
  if (acoustic) {
    userContent += `\n\nAcoustic measurements from the recording:
- Mean pitch: ${acoustic.pitchMean}Hz (variation: ±${acoustic.pitchStddev}Hz)
- Mean energy: ${acoustic.avgEnergy} (variation: ±${acoustic.energyVariation})
Consider these for word stress and intonation accuracy in your score.`
  }

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 700,
    system,
    messages: [{ role: 'user', content: userContent }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback: PronunciationAnalysis = {
    score: 0, issues: [],
    encouragement: "Mashq qilganingiz uchun rahmat! Yana urinib ko'ring — talaffuz takror bilan yaxshilanadi.",
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
      issues: Array.isArray(parsed.issues) ? parsed.issues.slice(0, 4).map((i: { word?: string; heard?: string; ipa?: string; tip?: string }) => ({
        word:  String(i.word ?? ''),
        heard: String(i.heard ?? '—'),
        ipa:   String(i.ipa ?? ''),
        tip:   String(i.tip ?? ''),
      })).filter((i: PronunciationIssue) => i.word) : [],
      encouragement: String(parsed.encouragement || fallback.encouragement),
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'analyzePronunciation:jsonParse' })
    return fallback
  }
}

// ── Writing Error Analysis ─────────────────────────────────────────────────

