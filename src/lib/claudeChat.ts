import { streamResponse } from './claudeClient'
import { withCachedStream } from './aiCache'

// ── Grammar Feedback ───────────────────────────────────────────────────────

export interface GrammarResult {
  qNum: number
  type: string
  question: string
  userAnswer: string
  correct: string
  isCorrect: boolean
}

export async function getGrammarFeedback(
  topicTitle: string,
  level: string,
  results: GrammarResult[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const wrong = results.filter((r) => !r.isCorrect)
  const score = results.filter((r) => r.isCorrect).length

  const lines = results.map((r) => {
    const mark = r.isCorrect ? '✅' : '❌'
    if (r.isCorrect) return `Q${r.qNum} [${r.type}] ${mark} Correct`
    return `Q${r.qNum} [${r.type}] ${mark} WRONG
  Question : ${r.question}
  Student  : ${r.userAnswer || '(blank)'}
  Correct  : ${r.correct}`
  }).join('\n\n')

  const system = `You are an expert English grammar teacher. \
Your student is at ${level} level (Uzbek speaker). \
Be warm, encouraging, and concise. Use simple B1-level English.`

  const prompt = `My student just completed a "${topicTitle}" exercise. Score: ${score}/${results.length}.

${lines}

Please provide:
${wrong.length === 0
  ? '✨ All answers were correct! Write a short congratulation (2-3 sentences) and one advanced tip about this grammar point.'
  : `For each ❌ WRONG answer:
  - Quote the student's answer
  - Explain the error in 1-2 simple sentences
  - Give the rule / memory tip

Then add a 2-sentence summary of the main weakness and one practice suggestion.`}

Keep the total response under 300 words. Use emojis sparingly (📌 for rules, 💡 for tips).`

  return streamResponse({ system, messages: [{ role: 'user', content: prompt }], maxTokens: 700 }, onDelta, onDone, onError)
}

// ── Reading Questions ──────────────────────────────────────────────────────

export async function generateReadingQuestions(
  text: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are an English teacher creating reading comprehension questions for ${level}-level students.
Write clear, unambiguous multiple-choice questions that test genuine understanding of the text.`

  const prompt = `Based on the following text, create exactly 5 new multiple-choice comprehension questions.

Format each question as:
Q1. [question]
A) [option]
B) [option]
C) [option]
D) [option]
✓ Answer: [letter]

Text:
${text}`

  return streamResponse({ system, messages: [{ role: 'user', content: prompt }], maxTokens: 700 }, onDelta, onDone, onError)
}

// ── Evaluate Writing ───────────────────────────────────────────────────────

export async function evaluateWriting(
  prompt: string,
  essay: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are an encouraging English writing tutor evaluating a ${level}-level student's essay.
Use IELTS-style criteria. Be constructive and specific.

Respond ONLY in this exact format:

TASK_ACHIEVEMENT: [1-10]
[One sentence about how well the prompt was addressed]

COHERENCE: [1-10]
[One sentence about organisation, paragraphing, and linking]

VOCABULARY: [1-10]
[One sentence about range and accuracy of vocabulary]

GRAMMAR: [1-10]
[One sentence about grammatical accuracy and range]

FEEDBACK:
[2–3 sentences: highlight one genuine strength, give the single most important improvement tip]

IMPROVED:
[Rewrite the student's essay with improved language, structure, and vocabulary — keep their ideas intact. Match the same approximate length.]`

  const userPrompt = `Writing prompt: "${prompt}"

Student's essay:
"${essay}"`

  return streamResponse({ system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 1200 }, onDelta, onDone, onError)
}

// ── Evaluate Speech ────────────────────────────────────────────────────────

export async function evaluateSpeech(
  prompt: string,
  transcript: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void,
  acoustic?: { speechRate: number; pauseCount: number; avgPauseDuration: number; totalPauseRatio: number; pitchMean: number; pitchStddev: number }
): Promise<void> {
  const system = `You are an experienced English speaking coach evaluating a ${level}-level student.
Respond ONLY in this exact format — no other text before or after:

FLUENCY: [1-10]
[One sentence about fluency — pace, hesitation, flow]

GRAMMAR: [1-10]
[One sentence about grammatical accuracy]

VOCABULARY: [1-10]
[One sentence about range and appropriateness of vocabulary]

FEEDBACK:
[2–3 encouraging sentences: highlight one strength, give one specific improvement tip]

IMPORTANT - Use these ACTUAL acoustic measurements from the recording for the FLUENCY score:
- Speech rate: measured words per minute directly from audio
- Pauses: count and duration detected in the audio signal
- Pitch variation: indicates intonation (monotone speech → lower fluency)`

  let userPrompt = `Speaking prompt: "${prompt}"

Student's spoken response: "${transcript || '(no speech detected)'}"`

  if (acoustic) {
    userPrompt += `\n\nAcoustic measurements from audio:
- Speech rate: ${acoustic.speechRate} words/min
- Pauses detected: ${acoustic.pauseCount} (avg ${acoustic.avgPauseDuration}ms, ${acoustic.totalPauseRatio}% of speaking time)
- Mean pitch: ${acoustic.pitchMean}Hz (variation: ±${acoustic.pitchStddev}Hz)

Use these measurements to inform your FLUENCY score. Fast speech with few pauses = higher fluency.`
  }

  return streamResponse({ system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 350 }, onDelta, onDone, onError)
}

// ── Evaluate Question Answer (for 30-Day Challenge questions) ────────────

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

  return streamResponse({ system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 350 }, onDelta, onDone, onError)
}

// ── Generate Examples ──────────────────────────────────────────────────────

export async function generateExamples(
  word: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are a concise English vocabulary teacher. \
Create clear, natural example sentences for ${level}-level learners.`

  const prompt = `Write exactly 3 example sentences using the word "${word}".
Each sentence must be natural, at ${level} level, and show a different context.
Format:
1. [sentence]
2. [sentence]
3. [sentence]
Only the numbered sentences, nothing else.`

  return streamResponse({ system, messages: [{ role: 'user', content: prompt }], maxTokens: 250 }, onDelta, onDone, onError)
}

// ── Analyze Grammar ────────────────────────────────────────────────────────

export async function analyzeGrammar(
  uzbekSentence: string,
  userTranslation: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `Siz ${level} darajasidagi ingliz tili grammatikasi ekspertisiz. O'quvchi o'zbekcha gapni ingliz tiliga tarjima qilgan. Siz uning tarjimasini CHUQUR grammatik tahlil qilasiz. BARCHA javoblar O'ZBEKCHA bo'lishi shart.

Quyidagi FORMAT bo'yicha yozing (har bir bo'lim uchun aniq belgilardan foydalaning):

📌 ZAMON
→ Ishlatilgan zamon: [zamon nomi]
→ Formula: [S + V + ... ko'rinishida]
→ Nima uchun: [bu gapda nima uchun aynan shu zamon ishlatilganini tushuntir]
→ Boshqa zamon ishlatilsa: [boshqa zamon ishlatilganda ma'no qanday o'zgarardi]

📌 ARTIKL
[Gapda har bir artikl uchun alohida qator:]
→ "[so'z]" oldidagi artikl: [qaysi artikl: a/an/the/zero] — [nima uchun aynan shu artikl, qoidasi]
[Agar artikl yo'q bo'lsa: → Bu gapda artikl ishlatilmagan — [sababi]]

📌 BOG'LOVCHILAR VA ALOQA SO'ZLARI
[Gapda ishlatilgan har bir bog'lovchi uchun:]
→ "[bog'lovchi]" — [nima bilan nima ni bog'layapti, qanday ma'no beradi]
[Agar yo'q bo'lsa: → Bu oddiy gap — bog'lovchi ishlatilmagan]

📌 SO'Z TARTIBI VA TUZILISH
→ Gapning tuzilishi: [Subject] + [Predicate] + [boshqa qismlar]
→ Asosiy qismlar: [har bir qismni tahlil qil]
→ [so'z tartibiga oid muhim qoida]

📌 XATOLAR VA TAVSIYALAR
[Agar xato yo'q bo'lsa: → ✅ Grammatik jihatdan to'g'ri yozilgan]
[Agar xato bo'lsa, har bir xato uchun:]
→ ❌ Xato: "[xato qism]"
   ✅ To'g'ri shakl: "[to'g'ri shakl]"
   📖 Sababi: [nima uchun xato, qaysi qoida buzilgan]

📌 UMUMIY BAHO
[2-3 jumla: tarjima sifati, o'quvchiga foydali maslahat, kuchli va zaif tomonlari]`

  const userPrompt = `O'zbekcha gap: "${uzbekSentence}"
O'quvchi yozgan inglizcha tarjima: "${userTranslation}"
Daraja: ${level}

Iltimos, o'quvchining tarjimasini yuqoridagi format bo'yicha chuqur grammatik tahlil qiling.`

  return streamResponse({ system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 900 }, onDelta, onDone, onError)
}

// ── Speaking Chat ──────────────────────────────────────────────────────────

export async function startSpeakingChat(
  topic: string,
  level: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void,
  pronunciationFocus?: { sound: string; ipaExample: string; tipUz: string; tipEn: string; commonError?: string },
  grammarTips?: string[]
): Promise<void> {
  let pronunciationBlock = ''
  if (pronunciationFocus) {
    pronunciationBlock = `
PRONUNCIATION FOCUS — Today's sound: /${pronunciationFocus.sound}/
The student should practise this sound naturally. If they struggle, gently model it.
Tip for the student: ${pronunciationFocus.tipEn}`
  }

  let grammarBlock = ''
  if (grammarTips && grammarTips.length > 0) {
    const tips = grammarTips.map((t, i) => `  ${i + 1}. ${t}`).join('\n')
    grammarBlock = `
GRAMMAR POINTS TO WEAVE INTO THIS CONVERSATION:
${tips}
Naturally model correct forms when the student uses them — do NOT explicitly teach or correct during the conversation.`
  }

  const system = `You are a friendly English conversation partner for a ${level}-level learner.

RULES:
1. Respond conversationally — like a friend, NOT a teacher.
2. Keep responses SHORT: 2-4 sentences max.
3. Use ${level}-level English. Define any harder word immediately.
4. End each turn with a natural follow-up question.
5. Do NOT give scores or evaluations during conversation.
6. Topic: ${topic}${pronunciationBlock}${grammarBlock}`

  const messages = history.length === 0
    ? [{ role: 'user' as const, content: `Let's talk about ${topic}. Start the conversation with a friendly greeting and a question to get me talking.` }]
    : history

  return streamResponse({ system, messages, maxTokens: 300 }, onDelta, onDone, onError)
}

// ── 30-Day Challenge Conversation (100% tailored to today's content) ────────

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

export async function startDayConversation(
  dayContent: DayContent,
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void,
  userFacts?: string  // Life Memory facts text (e.g. "- lives in: Tashkent\n- occupation: student")
): Promise<void> {
  const { day, title, level, vocabulary, sentenceBank, learningObjectives, speaking, highlights } = dayContent

  // ── Build user facts block ──────────────────────────────────────────────
  const factsBlock = userFacts
    ? `
ABOUT THE STUDENT — Personal facts to make the conversation natural. Reference these naturally, but don't mention them all at once:
${userFacts}

If the student says something new about themselves, remember it for future conversations.`
    : ''

  // ── Build vocabulary block ──────────────────────────────────────────────
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

  // ── Build sentence bank block ───────────────────────────────────────────
  const keySentences = sentenceBank.categories
    .slice(0, 4)
    .map(c => `  [${c.category}] "${c.phrases.slice(0, 3).map(p => p.en).join('" / "')}"`)
    .join('\n')
  const sentenceBlock = sentenceBank.categories.length > 0
    ? `
KEY SENTENCE STRUCTURES — Model these naturally in your side of the conversation:
${keySentences}`
    : ''

  // ── Build learning objectives block ─────────────────────────────────────
  const objectivesBlock = learningObjectives.length > 0
    ? `
LEARNING OBJECTIVES — Steer the conversation to help practise these:
${learningObjectives.map((o, i) => `  ${i + 1}. ${o}`).join('\n')}`
    : ''

  // ── Build speaking prompt block ─────────────────────────────────────────
  const speakingBlock = speaking?.prompt
    ? `
SPEAKING PRACTICE CONTEXT — The student practised answering:
  "${speaking.prompt}"
  Tips they received: ${speaking.tips?.slice(0, 3).map(t => `"${t}"`).join(', ') || 'none'}

  Ask them about their experience with this topic.`
    : ''

  // ── Build highlights block ──────────────────────────────────────────────
  const highlightScenarios = highlights
    ?.slice(0, 3)
    .map(h => `  • ${h.title}: ${h.points?.slice(0, 2).join('; ') || ''}`)
    .join('\n') || ''
  const highlightsBlock = highlightScenarios
    ? `
SCENARIOS COVERED IN THE LESSON — You can role-play or reference these:
${highlightScenarios}`
    : ''

  // ── Assemble system prompt ──────────────────────────────────────────────
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

  return streamResponse({ system, messages, maxTokens: 350 }, onDelta, onDone, onError)
}

// ── Vocabulary Practice Game ────────────────────────────────────────────────

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
2. Avval o'zbekcha gap tuzib bering — bu gapda "${word.word}" so'zi ishlatilgan bo'lsin.
3. O'quvchi shu gapni ingliz tiliga tarjima qiladi.
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
AI: Men har kuni ingliz tilini "${word.word}" qilaman.
(O'quvchi javobini kutish)
AI: "I practice English every day." — Ajoyib! To'g'ri tarjima. Endi o'zingiz "${word.word}" so'zini ishlatib yangi gap tuzib ko'ring.`

  const messages = history.length === 0
    ? [{ role: 'user' as const, content: 'O\'yinni boshlaylik. Menga o\'zbekcha gap bering, men ingliz tiliga tarjima qilaman.' }]
    : history

  return streamResponse({ system, messages, maxTokens: 300 }, onDelta, onDone, onError)
}

// ── Scenario Conversation ──────────────────────────────────────────────────

export interface ScenarioContext {
  aiRole:   string
  userRole: string
  opening:  string
  title:    string
}

export async function startScenarioConversation(
  scenario: ScenarioContext,
  level: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are role-playing as ${scenario.aiRole}. The user is ${scenario.userRole}. \
Scenario: "${scenario.title}".

RULES:
1. STAY in character at all times — you ARE ${scenario.aiRole}, not an AI or teacher.
2. Speak natural, real-world English at ${level} level. Keep it simple if the level is low.
3. Keep each reply SHORT: 1-3 sentences. React naturally to what the user says.
4. Gently move the situation forward toward a natural conclusion (the user completing their task).
5. NEVER correct the user's grammar or break character to teach — that happens later in a report.
6. If the user makes a mistake but you understand them, just respond naturally.
7. When the task is clearly complete, give a warm, natural closing line.`

  const messages = history.length === 0
    ? [{ role: 'assistant' as const, content: scenario.opening }, { role: 'user' as const, content: '(Begin)' }]
    : history

  const cacheKey = `scenario:${scenario.title}:${scenario.aiRole}:${scenario.userRole}:${level}:${JSON.stringify(history)}`
  return withCachedStream(
    cacheKey,
    (d, done, e) => streamResponse({ system, messages, maxTokens: 250 }, d, done, e),
    onDelta, onDone, onError,
  )
}

// ── 30-Day Challenge Role-Play ─────────────────────────────────────────

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
  // Build vocabulary block
  const vocabLines = vocabulary
    .slice(0, 6)
    .map((v, i) => `  ${i + 1}. "${v.word}" — ${v.meaning}`)
    .join('\n')
  const vocabBlock = vocabulary.length > 0
    ? `\nTODAY'S VOCABULARY — Naturally weave these words into the role-play where relevant:\n${vocabLines}`
    : ''

  const system = `You are role-playing as ${scenario.aiRole}. The user is ${scenario.userRole}.

SCENARIO: ${scenario.title}

LESSON CONTEXT: This role-play is part of Day of "${dayTitle}" in a 30-Day English Speaking Challenge.${vocabBlock}

RULES:
1. STAY in character at all times — you ARE ${scenario.aiRole}, NOT an AI assistant or teacher.
2. Speak natural, real-world English at ${level} level. Keep sentences short and simple.
3. Keep each reply VERY SHORT: 1-3 sentences. React naturally to what the user says.
4. Gently move the scene forward toward a natural conclusion.
5. NEVER correct the student's grammar or break character.
6. If the user makes a mistake but you understand, just respond naturally.
7. When the task is clearly complete, give a warm closing line.`

  const messages = history.length === 0
    ? [
        { role: 'assistant' as const, content: scenario.opening },
        { role: 'user' as const, content: '(Begin)' },
      ]
    : history

  return streamResponse({ system, messages, maxTokens: 250 }, onDelta, onDone, onError)
}

// ── Role-Play Game (question → answer → validate → switch) ─────────────

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

  return streamResponse({ system, messages, maxTokens: 350 }, onDelta, onDone, onError)
}

// ── Conversation Feedback (after free/role-play chat) ──────────────────

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

GRAMMAR: [1-10]
[One sentence about grammatical accuracy observed in the conversation. Be specific — mention what they did correctly or what tense/structure they used well.]

VOCABULARY: [1-10]
[One sentence about vocabulary range. Mention if they used any of today's words naturally.]

FLUENCY: [1-10]
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

  return streamResponse({ system, messages: [{ role: 'user', content: prompt }], maxTokens: 500 }, onDelta, onDone, onError)
}

// ── IELTS Writing Analysis ────────────────────────────────────────────────

export interface WritingAnalysis {
  taskAchievement: number
  coherence:       number
  lexicalResource: number
  grammar:         number
  overallBand:     number
  feedback:        string
  improvedVersion: string
}

export async function analyzeWritingIELTS(
  prompt: string,
  essay: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are an expert IELTS writing examiner (former Cambridge examiner).
Evaluate the essay using official IELTS Writing Task 2 band descriptors.

Respond ONLY in this exact format — no other text:

TASK_ACHIEVEMENT: [1-9]
[One sentence: how well does the essay address all parts of the prompt? Consider position, development, and relevance of main ideas.]

COHERENCE: [1-9]
[One sentence: paragraphing, logical progression, use of cohesive devices.]

VOCABULARY: [1-9]
[One sentence: vocabulary range, precision, collocations, word formation control.]

GRAMMAR: [1-9]
[One sentence: sentence structures, tense control, punctuation, error frequency.]

OVERALL_BAND: [1-9]
OVERALL_BAND_DESC: [One sentence summary of overall performance]

FEEDBACK:
[3-4 sentences: highlight one key strength, one critical weakness, and the single most impactful change the student can make to raise their band by 0.5-1.0]

IMPROVED:
[Rewrite the student's essay at a band 7+ level — keep all original ideas and arguments intact, but improve expression, structure, and vocabulary. Show only the improved essay text, no extra commentary.]`

  const userPrompt = `IELTS Writing Task 2 prompt:
"${prompt}"

Student's essay:
"${essay}"

Please evaluate and provide band scores.`

  return streamResponse(
    { system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 1500 },
    onDelta, onDone, onError
  )
}
