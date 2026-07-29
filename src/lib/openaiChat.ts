import { openaiStreamResponse } from './openaiClient'

// ── Types ─────────────────────────────────────────────────────────────────────

interface DayContent {
  day: number
  title: string
  level: string
  vocabulary: { word: string; meaning: string; example: string; translation?: string }[]
  sentenceBank: { categories: { category: string; phrases: { en: string; uz: string }[] }[] }
  learningObjectives: string[]
  speaking: { prompt: string; tips: string[] }
  highlights: { title: string; points?: string[] }[]
}

// ── 30-Day Challenge Conversation ──────────────────────────────────────────

export async function startDayConversation(
  dayContent: DayContent,
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void,
  userFacts?: string
): Promise<void> {
  const { day, title, level, vocabulary, sentenceBank, learningObjectives, speaking, highlights } = dayContent

  const factsBlock = userFacts
    ? `
ABOUT THE STUDENT — Personal facts to make the conversation natural. Reference these naturally, but don't mention them all at once:
${userFacts}

If the student says something new about themselves, remember it for future conversations.`
    : ''

  const vocabLines = vocabulary
    .slice(0, 12)
    .map((v, i) => `  ${i + 1}. "${v.word}" — ${v.meaning} — e.g. "${v.example}"`)
    .join('\n')
  const vocabBlock = vocabulary.length > 0
    ? `
TODAY'S VOCABULARY — Naturally weave these words into your replies:
${vocabLines}

If the student uses any of these words, acknowledge it positively.`
    : ''

  const keySentences = sentenceBank.categories
    .slice(0, 4)
    .map(c => `  [${c.category}] "${c.phrases.slice(0, 3).map(p => p.en).join('" / "')}"`)
    .join('\n')
  const sentenceBlock = sentenceBank.categories.length > 0
    ? `
KEY SENTENCE STRUCTURES — Model these naturally in your side of the conversation:
${keySentences}`
    : ''

  const objectivesBlock = learningObjectives.length > 0
    ? `
LEARNING OBJECTIVES — Steer the conversation to help practise these:
${learningObjectives.map((o, i) => `  ${i + 1}. ${o}`).join('\n')}`
    : ''

  const speakingBlock = speaking?.prompt
    ? `
SPEAKING PRACTICE CONTEXT — The student practised answering:
  "${speaking.prompt}"
  Tips they received: ${speaking.tips?.slice(0, 3).map(t => `"${t}"`).join(', ') || 'none'}

  Ask them about their experience with this topic.`
    : ''

  const highlightScenarios = highlights
    ?.slice(0, 3)
    .map(h => `  • ${h.title}: ${h.points?.slice(0, 2).join('; ') || ''}`)
    .join('\n') || ''
  const highlightsBlock = highlightScenarios
    ? `
SCENARIOS COVERED IN THE LESSON — You can role-play or reference these:
${highlightScenarios}`
    : ''

  const system = `You are a friendly English conversation partner for a ${level}-level learner who just completed Day ${day} of a 30-Day Speaking Challenge.

TODAY'S TOPIC: ${title}${factsBlock}${vocabBlock}${sentenceBlock}${objectivesBlock}${speakingBlock}${highlightsBlock}

CONVERSATION RULES:
1. Speak conversationally — like a friend, NOT a teacher or examiner.
2. Keep responses SHORT: 2-4 sentences max.
3. Use ${level}-level English. If you need a harder word, define it immediately.
4. NATURALLY INCORPORATE today's vocabulary words into your side of the conversation.
5. If the student uses any of today's vocabulary, react warmly ("Great word!" / "Exactly!").
6. End each turn with a natural follow-up question to keep the conversation flowing.
7. Do NOT give scores, corrections, or grammar lessons during the conversation.
8. If the student hesitates or makes a mistake, just respond naturally — never correct them.
9. When relevant, draw from the scenarios (e.g. restaurant role-play, directions, meeting a friend).
10. Use the student's personal facts to make conversation more natural — ask follow-up questions about their interests, studies, or experiences.`

  const messages = history.length === 0
    ? [{ role: 'user' as const, content: `The student just finished Day ${day}: "${title}". Start a friendly conversation about today's topic. Greet them warmly and ask a natural question to get them speaking about what they learned today.` }]
    : history

  return openaiStreamResponse({ system, messages, maxTokens: 350 }, onDelta, onDone, onError)
}

// ── Vocabulary Practice Game ──────────────────────────────────────────────

export async function startVocabPractice(
  word: { word: string; meaning: string; example: string; translation?: string },
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void,
): Promise<void> {
  const system = `Siz ingliz tili o'qituvchisisiz. O'quvchi bilan lug'at o'yini o'ynayapsiz.

O'YIN QOIDALARI:
1. O'quvchiga quyidagi so'zni o'rgatishingiz kerak: "${word.word}" (ma'nosi: ${word.meaning})
2. Avval ${word.meaning} MA'NOSIDA o'zbekcha gap tuzib bering — inglizcha so'zni aralashtirmang, faqat o'zbekcha gap bo'lsin.
3. O'quvchi shu o'zbekcha gapni ingliz tiliga tarjima qiladi va "${word.word}" so'zini ishlatishi kerak.
4. TEKSHIRISH:
   - AGAR TO'G'RI BO'LSA: maqtang va "Endi o'zingiz "${word.word}" so'zini ishlatib yangi gap tuzib ko'ring" deb so'rang.
   - AGAR XATO BO'LSA: o'zbekcha tushuntiring, nima xato ekanini ayting va qayta urinib ko'rishni so'rang.
5. O'quvchi o'z gapini tuzganda:
   - TO'G'RI BO'LSA: maqtang va keyingi bosqichga o'ting
   - XATO BO'LSA: to'g'rilab, o'zbekcha izoh bering va qayta urinishni so'rang

MUHIM:
- Har doim o'zbekcha gap bering va o'zbekcha izoh bering
- O'quvchining inglizcha javobini tekshirganda, to'liq tahlil qiling: grammatika, so'z tanlash, so'z tartibi
- Xato bo'lsa, to'g'ri variantni ko'rsating va nima uchun xato ekanini o'zbekcha tushuntiring
- Rag'batlantirib turing, lekin xatoni ham aniq ko'rsating
- Javoblaringiz qisqa va tushunarli bo'lsin

NAMUNA:
AI: Keling "${word.word}" so'zini o'rganamiz. Men o'zbekcha gap aytaman, siz ingliz tiliga tarjima qiling.
AI: Men har kuni ingliz tilini ravon (\`${word.word}\`) qilaman.
(O'quvchi javobini kutish: "I practice English fluently" yoki "I make English fluent every day"?)
AI: "I practice English every day" deb tarjima qildingiz, lekin "${word.word}" so'zini ishlatmadingiz. Qayta urinib ko'ring — gapda "${word.word}" so'zi bo'lishi kerak.`

  const messages = history.length === 0
    ? [{ role: 'user' as const, content: 'O\'yinni boshlaylik. Menga o\'zbekcha gap bering, men ingliz tiliga tarjima qilaman.' }]
    : history

  return openaiStreamResponse({ system, messages, maxTokens: 300 }, onDelta, onDone, onError)
}

// ── 30-Day Challenge Role-Play ───────────────────────────────────────────

export async function startDayRoleplay(
  scenario: {
    title: string
    aiRole: string
    userRole: string
    opening: string
  },
  level: string,
  dayTitle: string,
  vocabulary: { word: string; meaning: string; example: string }[],
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const vocabLines = vocabulary
    .slice(0, 6)
    .map((v, i) => `  ${i + 1}. "${v.word}" — ${v.meaning}`)
    .join('\n')
  const vocabBlock = vocabulary.length > 0
    ? `\nTODAY'S VOCABULARY — Naturally weave these words into the role-play where relevant:\n${vocabLines}`
    : ''

  const system = `You are role-playing as ${scenario.aiRole}. The user is ${scenario.userRole}.

SCENARIO: ${scenario.title}

LESSON CONTEXT: This role-play is part of Day "${dayTitle}" in a 30-Day English Speaking Challenge.${vocabBlock}

ROLE-PLAY STRUCTURE:
You will guide the user through a structured 4-step role-play:
1. OPENING — Greet the user naturally and set the scene (1 sentence)
2. QUESTIONS — Ask 3-4 clear, simple questions one at a time. Wait for the user's answer after each question before asking the next one.
3. RESPONSE — React naturally to each answer. If the user answers well, acknowledge it ("Great!", "Perfect!"). If the user struggles, rephrase or give a gentle hint.
4. CLOSING — After all questions are done, give a warm closing line.

RULES:
1. STAY in character at all times — you ARE ${scenario.aiRole}, NOT an AI assistant.
2. Speak natural, real-world English at ${level} level. Keep sentences short and simple.
3. Ask ONE question at a time. Wait for the user's answer before the next question.
4. React naturally to what the user says — acknowledge good answers and gently help with difficult ones.
5. NEVER correct grammar explicitly. If you understand the meaning, just respond naturally.
6. When finished, give a warm closing like "Thank you! You did great today!"`

  const messages = history.length === 0
    ? [
        { role: 'assistant' as const, content: scenario.opening },
        { role: 'user' as const, content: '(Begin)' },
      ]
    : history

  return openaiStreamResponse({ system, messages, maxTokens: 250 }, onDelta, onDone, onError)
}

// ── Role-Play Game ───────────────────────────────────────────────────────

export async function startRoleplayGame(
  scenario: {
    title: string
    aiRole: string
    userRole: string
  },
  phase: 1 | 2,
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = phase === 1
    ? `Siz ingliz tili o'qituvchisisiz. O'quvchi bilan rolli o'yin o'ynayapsiz.

SCENARIO: ${scenario.title}

Sizning rolingiz: ${scenario.aiRole}
O'quvchining roli: ${scenario.userRole}

1-BOSQICH — SAVOL BERUVCHI SIZ:
- Siz ${scenario.aiRole} sifatida savol bering (ingliz tilida)
- O'quvchi ${scenario.userRole} sifatida ingliz tilida javob beradi
- Har bir savoldan keyin o'quvchining javobini tekshiring

TEKSHIRISH QOIDALARI:
- AGAR TO'G'RI BO'LSA: "✅ To'g'ri!" deb maqtang va keyingi savolga o'ting
- AGAR XATO BO'LSA: o'zbekcha tushuntiring, nima xato ekanini ayting va "Qayta urinib ko'ring" deb so'rang
- O'quvchi to'g'ri javob bermaguncha savolni takrorlang
- Hammasi to'g'ri bo'lgach: "Mubarak! Barcha savollarga to'g'ri javob berdingiz!" deb aytib, keyingi bosqichga o'ting

MUHIM: Javoblaringiz qisqa va tushunarli bo'lsin. Savollarni birma-bir bering.`
    : `Siz ingliz tili o'qituvchisisiz. O'quvchi bilan rolli o'yin o'ynaysiz.

SCENARIO: ${scenario.title}

2-BOSQICH — SAVOL BERUVCHI O'QUVCHI:
- Endi o'quvchi ${scenario.aiRole} rolida savol beradi
- Siz ${scenario.userRole} rolida tabiiy javob qaytarasiz
- O'quvchining har bir savoliga qisqa va tabiiy javob bering
- Grammatikasini TO'G'IRLAMANG — tabiiy suhbatdosh sifatida javob qaytaring
- Suhbat tabiiy yakunlanganda: "🎉 Ajoyib! Siz a'lo darajada savol berdingiz!" deb yakunlang`

  const messages = history.length === 0
    ? [{ role: 'user' as const, content: 'O\'yinni boshlaylik. Menga vaziyatga mos savol bering.' }]
    : history

  return openaiStreamResponse({ system, messages, maxTokens: 350 }, onDelta, onDone, onError)
}

// ── Conversation Feedback ────────────────────────────────────────────────

export async function generateConversationFeedback(
  userMessages: string[],
  level: string,
  dayTitle: string,
  vocabulary: { word: string; meaning: string }[],
  learningObjectives: string[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const vocabWords = vocabulary.map(v => v.word).join(', ')

  const transcript = userMessages
    .map((m, i) => `[Student ${i + 1}] ${m}`)
    .join('\n')

  const system = `You are an encouraging English speaking coach evaluating a ${level}-level student's conversation.

The student just finished a conversation as part of "${dayTitle}" in their 30-Day Speaking Challenge.

Today's vocabulary words: ${vocabWords}
Today's learning objectives: ${learningObjectives.join('; ')}

Respond ONLY in this exact format — no other text before or after:

GRAMMAR: [1-9]
[One sentence about grammatical accuracy observed in the conversation. Be specific — mention what they did correctly or what tense/structure they used well.]

VOCABULARY: [1-9]
[One sentence about vocabulary range. Mention if they used any of today's words naturally.]

FLUENCY: [1-9]
[One sentence about how naturally the student expressed themselves — sentence length, hesitation, flow.]

STRENGTHS:
• [Strong point 1 — specific example from their messages]
• [Strong point 2 — specific example from their messages]
• [Strong point 3 — specific example if applicable]

IMPROVE:
• [One specific, actionable tip for grammar or vocabulary]
• [One specific, actionable tip for fluency or confidence]

ENCOURAGEMENT:
[One warm, motivating sentence to keep them going. Use emojis sparingly.]`

  const prompt = `Here is the student's conversation transcript. Please evaluate their performance and provide feedback.

${transcript || '(The student did not send any messages.)'}\n
Focus on what they did well and give practical advice for improvement.`

  return openaiStreamResponse({ system, messages: [{ role: 'user', content: prompt }], maxTokens: 500 }, onDelta, onDone, onError)
}

// ── Evaluate Question Answer ─────────────────────────────────────────────

export async function evaluateQuestionAnswer(
  question: string,
  answer: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are an encouraging English teacher evaluating a ${level}-level student's spoken answer.

The student answered an open-ended speaking question. Evaluate their response based on:
1. Relevance — Did they actually answer the question?
2. Grammar — Are the sentences grammatically correct?
3. Vocabulary — Did they use appropriate words?

Respond ONLY in this exact format — no other text before or after:

✅ RELEVANCE: [checkmark if they answered / ❌ if off-topic]
[One sentence about whether they addressed the question]

📝 GRAMMAR: [1-10]
[One sentence about grammatical accuracy. Mention specific errors if any.]

📖 VOCABULARY: [1-10]
[One sentence about word choice and range]

💡 FEEDBACK:
[2-3 encouraging sentences: highlight ONE genuine strength and give ONE specific, actionable tip to improve.]

Be warm and constructive. The student is at ${level} level — praise effort and progress.`

  const userPrompt = `Question: "${question}"

Student's answer: "${answer || '(no answer given)'}"

Please evaluate this answer and provide structured feedback in the specified format.`

  return openaiStreamResponse({ system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 350 }, onDelta, onDone, onError)
}

export async function evaluateDialogueLine(
  context: string,
  expectedLine: string,
  userAttempt: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You're a warm, natural English-speaking friend who helps with dialogue practice. You're NOT a robot — you speak like a real person helping a friend.

The student is ${level} level. They're trying to say a specific line from a conversation. Compare it to the expected line.

Speak naturally — like you're right there with them. Be warm, encouraging, and clear.

CRITICAL RULE: This is SPEAKING practice, not writing. Punctuation, periods, commas, capitalization have ZERO meaning in speech. When comparing, strip ALL punctuation from both strings, then compare meaning. If they match in meaning, it is CORRECT — nothing else matters.

Example: "Um just one only me" = "Um, just one. Only me." = "um just one only me" — ALL are CORRECT because the WORDS and MEANING are the same.

Respond in this exact format:

STATUS: [CORRECT / CLOSE / INCORRECT]

💡 TIP:
[Natural, warm feedback. If wrong: explain WHAT was wrong and HOW to fix it step by step. Be specific — point to the exact mistake. "You said X, but we need Y here because...". Speak like a real teacher, not a robot.]

HINT:
[If not CORRECT: give a small clue — first 2-3 words of the expected line, or paraphrase the idea]

AI_RESPONSE:
[Continue the conversation naturally as the character. Respond to what the user said as if you're in the scene with them. Keep it short, natural, and in character. This is NOT evaluation — it's dialogue. Skip this if STATUS is INCORRECT.]

Rules:
- CORRECT = same meaning. Strip all punctuation before comparing. Filler words (um, uh, like) are fine. Say "Perfect!" or "Exactly right!"
- CLOSE = grammar or word choice needs a small fix. NEVER mention punctuation.
- INCORRECT = wrong meaning or completely different sentence. Guide step by step.
- Be encouraging and praise effort.
- Expected: "${expectedLine}"`

  const userPrompt = `Here's the conversation so far:
${context}

The student was supposed to respond as their character. Their attempt: "${userAttempt}"

How did they do? Give warm, natural feedback like a real person would.`

  return openaiStreamResponse({ system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 300 }, onDelta, onDone, onError)
}

export async function evaluateTranslation(
  userAnswer: string,
  expected: string,
  uzbekText: string,
  level: string,
): Promise<{ status: 'CORRECT' | 'CLOSE' | 'INCORRECT'; tip: string }> {
  const system = `You evaluate English translations from Uzbek. The student was given the Uzbek sentence and wrote an English translation.

Compare meaning, not exact wording.

Student level: ${level}

🚫 STRICT RULE: NEVER mention punctuation (periods, commas, question marks, exclamation points, apostrophes), capitalization (uppercase/lowercase), or spacing in your feedback. These are STRICTLY FORBIDDEN in the TIP. Focus ONLY on word choice, grammar structure, and meaning.

✅ GOOD tip: "Good job! For a more natural sentence, add 'the' before 'best': 'This is the best day.'"
❌ BAD tip: "Add a comma after 'well' and capitalize the first letter."

Respond in this exact format:
STATUS: [CORRECT / CLOSE / INCORRECT]

💡 TIP:
[Brief natural feedback about WORD CHOICE, GRAMMAR, or MEANING only. 1-2 sentences max. Warm and encouraging. NO punctuation/capitalization advice.]

Rules:
- CORRECT = same meaning. Punctuation, capitalization, spacing differences are COMPLETELY IGNORED.
- CLOSE = small grammar or word choice issue but meaning is clear.
- INCORRECT = meaning is wrong or key words missing. Guide briefly.`

  const userPrompt = `Uzbek: "${uzbekText}"
Expected English: "${expected}"
Student wrote: "${userAnswer}"

Evaluate their translation.`

    return new Promise((resolve) => {
    let full = ''
    openaiStreamResponse(
      { system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 200 },
      (token) => { full += token },
      () => {
        const statusMatch = full.match(/STATUS:\s*(CORRECT|CLOSE|INCORRECT)/)
        const tipMatch = full.match(/💡 TIP:\s*([^\n]+)/)
        resolve({
          status: (statusMatch?.[1] as 'CORRECT' | 'CLOSE' | 'INCORRECT') || 'INCORRECT',
          tip: tipMatch?.[1]?.trim() || '',
        })
      },
      () => resolve({ status: 'INCORRECT', tip: '' })
    )
  })
}

// ── Workbook exercise evaluation ──────────────────────────────────────────

export async function evaluateWorkbookAnswer(
  userAnswer: string,
  exercise: { question: string; exerciseType: string; options?: string[]; hint?: string },
  level: string,
): Promise<{ status: 'CORRECT' | 'CLOSE' | 'INCORRECT'; feedback: string; expected?: string }> {
  const typeDesc: Record<string, string> = {
    'fill-blank': 'Fill-in-the-blank — provide the missing word(s).',
    'writing': 'Free-form writing — evaluate meaning, grammar, vocabulary.',
  }

  const system = `You evaluate English exercise answers. Student level: ${level}

${typeDesc[exercise.exerciseType] || 'Evaluate the answer.'}

🚫 STRICT: NEVER mention punctuation, capitalization, or spacing in feedback.
Focus on word choice, grammar, meaning only.

Respond in EXACT format:
STATUS: [CORRECT / CLOSE / INCORRECT]
💡 FEEDBACK: [1-2 sentence warm natural feedback]
${exercise.exerciseType === 'fill-blank' ? 'EXPECTED: [the correct answer]' : ''}`

  const userPrompt = `Question: "${exercise.question}"
${exercise.options ? `Options: ${exercise.options.join(', ')}` : ''}
${exercise.hint ? `Hint: ${exercise.hint}` : ''}
Student answered: "${userAnswer}"

Evaluate this answer.${exercise.exerciseType === 'writing' ? ' Give constructive feedback on grammar, vocabulary, and naturalness.' : ''}`

  return new Promise((resolve) => {
    let full = ''
    openaiStreamResponse(
      { system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 300 },
      (token) => { full += token },
      () => {
        const statusMatch = full.match(/STATUS:\s*(CORRECT|CLOSE|INCORRECT)/)
        const feedbackMatch = full.match(/💡 FEEDBACK:\s*([^\n]+)/)
        const expectedMatch = full.match(/EXPECTED:\s*([^\n]+)/)
        resolve({
          status: (statusMatch?.[1] as 'CORRECT' | 'CLOSE' | 'INCORRECT') || 'INCORRECT',
          feedback: feedbackMatch?.[1]?.trim() || '',
          expected: expectedMatch?.[1]?.trim(),
        })
      },
      () => resolve({ status: 'INCORRECT', feedback: '' }),
    )
  })
}

export async function translateLines(lines: string[]): Promise<string[]> {
  const system = `You are a translator. Translate each English sentence to natural Uzbek (O'zbekcha).
Return ONLY a JSON array of strings — no other text.
Example: ["Salom", "Qalaysiz?"]`

  const userPrompt = `Translate these to Uzbek:
${lines.map((l, i) => `${i + 1}. ${l}`).join('\n')}`

  return new Promise((resolve, reject) => {
    let full = ''
    openaiStreamResponse(
      { system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 1000 },
      (token) => { full += token },
      () => {
        try {
          const parsed = JSON.parse(full)
          if (Array.isArray(parsed) && parsed.length === lines.length) {
            resolve(parsed.map(s => String(s)))
          } else {
            resolve(lines.map(() => ''))
          }
        } catch {
          resolve(lines.map(() => ''))
        }
      },
      () => reject(new Error('Translation failed'))
    )
  })
}