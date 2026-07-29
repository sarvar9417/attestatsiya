// Semantic matching — Levenshtein o'rniga ma'noga asoslangan matn mosligi
// Fazali yondashuv: normalizatsiya → keyword → sinonim → word order

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their',
  'this', 'that', 'these', 'those',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'into',
  'and', 'or', 'but', 'so', 'if', 'because', 'when', 'while', 'than',
  'do', 'does', 'did', 'have', 'has', 'had',
  'no', 'not', 'yes',
  'some', 'any', 'every', 'each', 'both', 'few', 'many', 'much', 'lots',
  'also', 'just', 'only', 'very', 'too', 'really', 'quite',
])

// Multi-word sinonimlarni avval almashtirish uchun (uzunidan qisqasiga)
const SYNONYM_PHRASES: [string, string][] = [
  ['would like', 'want'],
  ['be able to', 'can'],
  ['a lot of', 'many'],
  ['a little', 'some'],
  ['plenty of', 'many'],
  ['kind of', 'sort of'],
  ['on the other hand', 'but'],
  ['as well', 'also'],
  ['in addition', 'also'],
  ['due to', 'because'],
  ['for example', 'example'],
  ['need to', 'must'],
  ['have to', 'must'],
  ['ought to', 'should'],
]

// Son so'zlari → raqam (STT "five" o'rniga "5" yozadi — ikkalasini birxillashtiramiz)
const NUM_WORDS: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4',
  five: '5', six: '6', seven: '7', eight: '8', nine: '9',
  ten: '10', eleven: '11', twelve: '12',
  thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16',
  seventeen: '17', eighteen: '18', nineteen: '19',
  twenty: '20', thirty: '30', forty: '40', fifty: '50',
  sixty: '60', seventy: '70', eighty: '80', ninety: '90',
  hundred: '100', thousand: '1000',
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:'"()…—-]/g, ' ')
    .replace(/(\d+):(\d+)/g, '$1 $2')      // "7:30" → "7 30"
    .replace(/\bo\s*clock\b/g, '')         // "o'clock" tushiriladi
    .replace(
      /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\b/g,
      m => NUM_WORDS[m],
    )
    .replace(/\b([2-9]0)\s+([1-9])\b/g, (_, t, o) => String(Number(t) + Number(o))) // "twenty five" → "20 5" → "25"
    .replace(/\s+/g, ' ')
    .trim()
}

function substituteSynonyms(text: string): string {
  let result = text
  for (const [phrase, replacement] of SYNONYM_PHRASES) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi')
    result = result.replace(regex, replacement)
  }
  return result
}

function tokenize(s: string): string[] {
  return normalize(s).split(/\s+/).filter(Boolean)
}

function keywordSimilarity(student: string, target: string): number {
  const normStudent = substituteSynonyms(normalize(student))
  const normTarget = substituteSynonyms(normalize(target))

  const targetTokens = tokenize(normTarget)
  const studentTokens = tokenize(normStudent)

  const targetKeywords = targetTokens.filter(w => !STOP_WORDS.has(w))
  const studentSet = new Set(studentTokens)

  if (targetKeywords.length === 0) return 0.5

  let matchCount = 0
  for (const tkw of targetKeywords) {
    if (studentSet.has(tkw)) {
      matchCount++
    }
  }

  return matchCount / targetKeywords.length
}

function wordOrderSimilarity(student: string, target: string): number {
  const studentWords = tokenize(substituteSynonyms(normalize(student)))
  const targetWords = tokenize(substituteSynonyms(normalize(target)))

  if (targetWords.length < 2) return 1

  let matchCount = 0
  let prevIdx = -1
  for (const tw of targetWords) {
    const idx = studentWords.indexOf(tw, prevIdx + 1)
    if (idx > prevIdx) {
      matchCount++
      prevIdx = idx
    }
  }

  return targetWords.length > 0 ? matchCount / targetWords.length : 1
}

function lengthRatio(student: string, target: string): number {
  const sLen = tokenize(student).length
  const tLen = tokenize(target).length
  if (tLen === 0) return 0.5
  const ratio = sLen / tLen
  if (ratio <= 0.3) return 0
  if (ratio >= 2.5) return 0.2
  return Math.min(ratio, 1 / ratio, 1)
}

export interface SemanticMatchResult {
  score: number
  details: {
    keyword: number
    wordOrder: number
    length: number
  }
}

export function semanticSimilarity(student: string, target: string): SemanticMatchResult {
  const ns = normalize(student)
  const nt = normalize(target)

  if (ns === nt) return { score: 1, details: { keyword: 1, wordOrder: 1, length: 1 } }
  if (!ns || !nt) return { score: 0, details: { keyword: 0, wordOrder: 0, length: 0 } }

  const keywordScore = keywordSimilarity(ns, nt)
  const orderScore = wordOrderSimilarity(ns, nt)
  const lengthScore = lengthRatio(ns, nt)

  const score = keywordScore * 0.6 + orderScore * 0.3 + lengthScore * 0.1

  return {
    score: Math.max(0, Math.min(1, Math.round(score * 1000) / 1000)),
    details: {
      keyword: Math.round(keywordScore * 1000) / 1000,
      wordOrder: Math.round(orderScore * 1000) / 1000,
      length: Math.round(lengthScore * 1000) / 1000,
    },
  }
}

export function semanticToRating(score: number): string {
  if (score >= 0.85) return 'yodladim'
  if (score >= 0.6) return 'bildim'
  if (score >= 0.35) return 'qiynaldim'
  return 'bilmadim'
}

export function isSemanticCorrect(score: number): boolean {
  return score >= 0.6
}
