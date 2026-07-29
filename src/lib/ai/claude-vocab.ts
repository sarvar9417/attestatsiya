import { MODEL, proxyFetch, sendMessage } from '../claudeClient'

export async function explainWord(word: string): Promise<string> {
  return sendMessage(
    [{ role: 'user', content: `Explain the word: "${word}"` }],
    'vocabulary'
  )
}

// ── Generate Word Card ──────────────────────────────────────────────────────

export interface WordCard {
  translation: string
  phonetic:    string
  example:     string
}

export async function generateWordCard(word: string, level: string): Promise<WordCard> {
  const system = `You are a concise English–Uzbek dictionary assistant for ${level}-level learners.
Respond ONLY in this exact format — nothing else:
TRANSLATION: [Uzbek translation, 3-6 words max]
PHONETIC: [IPA pronunciation, e.g. /əˈbʌndənt/]
EXAMPLE: [One natural ${level}-level English sentence using the word]`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 120,
    system,
    messages: [{ role: 'user', content: `Word: "${word}"` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : ''
  const get  = (key: string) =>
    text.match(new RegExp(`${key}:\\s*(.+)`))?.[1]?.trim() ?? ''

  return {
    translation: get('TRANSLATION'),
    phonetic:    get('PHONETIC'),
    example:     get('EXAMPLE'),
  }
}

// ── Check vocab answer ─────────────────────────────────────────────────────

export async function checkVocabAnswer(
  uzbek: string,
  correctEnglish: string,
  userAnswer: string
): Promise<boolean> {
  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 5,
    system: 'You are a strict vocabulary checker. Reply ONLY with CORRECT or WRONG.',
    messages: [{
      role: 'user',
      content: `Uzbek word: "${uzbek}" | Expected English: "${correctEnglish}" | Student wrote: "${userAnswer}"\nIs the student's answer a valid English translation of this Uzbek word? Consider synonyms and alternate forms. Reply ONLY: CORRECT or WRONG`,
    }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text'
    ? data.content[0].text.trim().toUpperCase()
    : 'WRONG'
  return text.startsWith('CORRECT')
}

// ── Check phrase translation (simple boolean) ──────────────────────────────

export async function checkPhraseTranslation(
  uzbek: string,
  correctEnglish: string,
  userAnswer: string
): Promise<boolean> {
  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 5,
    system: 'You are a strict sentence translation checker. Reply ONLY with CORRECT or WRONG.',
    messages: [{
      role: 'user',
      content: `Uzbek sentence: "${uzbek}" | Expected English: "${correctEnglish}" | Student wrote: "${userAnswer}"\nIs the student's English translation semantically correct for this Uzbek sentence? Consider alternative valid translations, synonyms, and different phrasing — as long as the core meaning is preserved, accept it. Reply ONLY: CORRECT or WRONG`,
    }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text'
    ? data.content[0].text.trim().toUpperCase()
    : 'WRONG'
  return text.startsWith('CORRECT')
}

// ── Check phrase translation (with explanation) ────────────────────────────

export interface PhraseCheckResult {
  correct: boolean
  explanation: string
  correctAnswer: string
}

export async function checkPhraseTranslationDetailed(
  uzbek: string,
  correctEnglish: string,
  userAnswer: string
): Promise<PhraseCheckResult> {
  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 400,
    system: `Siz ingliz tili o'qituvchisisiz. O'quvchi o'zbekcha gapni ingliz tiliga tarjima qilgan.

Tekshirish QOIDALARI:
1. Tarjima o'zbekcha gap ma'nosiga mos bo'lishi kerak.
2. Sinonimlar va boshqa to'g'ri variantlar qabul qilinadi.
3. Kichik grammatik xatolar (artikl, prefiks) — NOTO'G'RI deb hisoblanadi va tushuntiriladi.

MUHIM TARJIMA QOIDALARI:
- Har bir o'zbekcha so'zning aniq inglizcha mosini ishlat. Masalan: "chiroyli" = "beautiful" (emas "cute"), "katta" = "big" (emas "large").
- "u" va "uning" = "his" yoki "her" (ikkalasi ham to'g'ri).

ARTIKLLAR (a/an/the) XATOLARI — EXPLANATION da qoidani o'zbekcha tushuntir:
• A/AN — noma'lum otlar: "I have a book." (bitta, ma'lum emas)
  A — undosh oldidan: a book, a cat
  AN — unli oldidan: an apple, an hour
• THE — ma'lum/yagona: "The sun is bright." (yagona quyosh)
• Artiklsiz — umumiy: "I like music." (umumiy musiqa)

EXPLANATION formati: "❌ [xato] → ✅ [to'g'ri]. Sababi: [qoida, 1-2 gap]"

JAVOB FORMATI — faqat quyidagi 3 qator:
CORRECT: yes
yoki
CORRECT: no
EXPLANATION: [o'zbekcha tushuntirish]
CORRECT_ANSWER: [eng oddiy to'g'ri tarjima]`,
    messages: [{
      role: 'user',
      content: `O'zbekcha gap: "${uzbek}"
To'g'ri javob: "${correctEnglish}"
O'quvchi yozdi: "${userAnswer}"`,
    }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : ''

  const getBlock = (key: string, nextKey?: string): string => {
    const pattern = nextKey
      ? new RegExp(`^${key}:\\s*(.+?)(?=\\n${nextKey}:|$)`, 'ms')
      : new RegExp(`^${key}:\\s*(.+)`, 'm')
    const match = text.match(pattern)
    return match ? match[1].trim() : ''
  }

  const correctRaw = getBlock('CORRECT', 'EXPLANATION').toLowerCase()
  const correct = correctRaw.startsWith('yes') || correctRaw === 'ha'
  const explanation = correct ? '' : getBlock('EXPLANATION', 'CORRECT_ANSWER')
  const correctAnswer = correct ? '' : getBlock('CORRECT_ANSWER') || correctEnglish

  return { correct, explanation, correctAnswer }
}

// ── Generate Uzbek sentence ────────────────────────────────────────────────

const LEVEL_SENTENCE_GUIDE: Record<string, string> = {
  A1: '5-7 so\'zli, juda oddiy, hozirgi zamon',
  A2: '7-10 so\'zli, kundalik hayot mavzusi',
  B1: '10-14 so\'zli, biroz murakkabroq, birikmali',
  B2: '12-16 so\'zli, murakkab, qo\'shma gap mumkin',
}

export async function generateUzbekSentence(
  englishWord: string,
  uzbekWord: string,
  level: string
): Promise<string> {
  const guide = LEVEL_SENTENCE_GUIDE[level] ?? '8-12 so\'zli'

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 120,
    system: `You are an Uzbek sentence composer. Your only job is to compose complete, natural Uzbek sentences. You never give instructions — you only write the sentence itself.`,
    messages: [{
      role: 'user',
      content: `Compose one complete Uzbek sentence at ${level} level (${guide}) that naturally includes the Uzbek word "${uzbekWord}" (which means "${englishWord}" in English). Reply with only the Uzbek sentence — no explanations, no quotes, no labels.`,
    }],
    stream: false,
  })

  const data = await res.json()
  const raw = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : ''
  const text = raw.replace(/^["'«»\d.\-–\s]+/, '').replace(/["'»]+$/, '').trim()
  return text || `U kecha ko'p pul ${uzbekWord}.`
}

// ── Check sentence translation ─────────────────────────────────────────────

export interface SentenceCheckResult {
  correct: boolean
  explanation: string
  correctAnswer: string
}

export async function checkSentenceTranslation(
  uzbekSentence: string,
  targetWord: string,
  userTranslation: string,
  level: string
): Promise<SentenceCheckResult> {
  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 500,
    system: `Siz ${level} darajasidagi ingliz tili o'qituvchisisiz. O'quvchi o'zbekcha gapni ingliz tiliga tarjima qilgan.

Tekshirish QOIDALARI (uchala shart bajarilsa — to'g'ri):
1. O'quvchi gapida "${targetWord}" so'zi yoki uning grammatik shakli (ed, ing, s, er va h.k.) bo'lishi kerak.
2. Tarjima o'zbekcha gap ma'nosiga mos bo'lishi kerak.
3. Grammatika ${level} darajasiga mos qabul qilinadi (kichik xatolar ok).

MUHIM TARJIMA QOIDALARI (CORRECT_ANSWER uchun):
- Har bir o'zbekcha so'zning aniq inglizcha mosini ishlat. Masalan: "chiroyli" = "beautiful" (emas "cute"), "katta" = "big" (emas "large"), "yaxshi" = "good" (emas "nice").
- O'zbekchada "u" va "uning" so'zlari jinsiy aniqlanmagan — "his" yoki "her" (yoki "its") bo'lishi mumkin. Ikkala variant ham to'g'ri deb qabul qil.
- CORRECT_ANSWER da faqat eng oddiy va to'g'ri tarjimani yoz — murakkab yoki boshqacha shaklda emas.

ARTIKLLAR (a/an/the) XATOLARI BO'LSA — EXPLANATION da quyidagi qoidalarni o'zbekcha tushuntir:
• A/AN — noma'lum otlar uchun (birinchi marta tilga olinayotgan, umumiy narsa):
  "I have a book." (Bitta kitob bor — qaysi kitobligi ma'lum emas)
  "She is a teacher." (U o'qituvchi — qaysi o'qituvchi emas)
  • A — undosh tovushdan oldin: a book, a cat, a university
  • AN — unli tovushdan oldin: an apple, an orange, an hour
• THE — ma'lum otlar uchun (ikkinchi marta tilga olinayotgan, yagona, ma'lum narsa):
  "The book is on the table." (Ma'lum kitob — avval aytildi)
  "The sun is bright." (Yagona quyosh)
  "I like the teacher." (Ma'lum o'qituvchi — hamma biladi)
• ARTIKLSIZ — umumiy ko'plik yoki abstrakt otlar:
  "I like music." (Umumiy musiqa)
  "Water is important." (Umumiy suv)
  "Children play." (Barcha bolalar)

EXPLANATION formati: "❌ [xato] → ✅ [to'g'ri]. Sababi: [qoida o'zbekcha, 1-2 gap]"

JAVOB FORMATI — faqat quyidagi 3 qatorni yoz, boshqa hech narsa yozma:
CORRECT: yes
yoki:
CORRECT: no
EXPLANATION: [o'zbekcha — nima noto'g'ri, qisqa va aniq, artikl xatosi bo'lsa qoidani tushuntir]
CORRECT_ANSWER: [to'g'ri inglizcha tarjima — eng oddiy variantini yoz]`,
    messages: [{
      role: 'user',
      content: `O'zbekcha gap: "${uzbekSentence}"
Kerakli ingliz so'zi: "${targetWord}"
O'quvchi yozdi: "${userTranslation}"`,
    }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : ''

  const getBlock = (key: string, nextKey?: string): string => {
    const pattern = nextKey
      ? new RegExp(`^${key}:\\s*(.+?)(?=\\n${nextKey}:|$)`, 'ms')
      : new RegExp(`^${key}:\\s*(.+)`, 'm')
    const match = text.match(pattern)
    return match ? match[1].trim() : ''
  }

  const correctRaw = getBlock('CORRECT', 'EXPLANATION').toLowerCase()
  const correct = correctRaw.startsWith('yes') || correctRaw === 'ha'
  const explanation = correct ? '' : getBlock('EXPLANATION', 'CORRECT_ANSWER')
  const correctAnswer = correct ? '' : getBlock('CORRECT_ANSWER')

  return { correct, explanation, correctAnswer }
}

// ── Speaking Chat Feedback ─────────────────────────────────────────────────

