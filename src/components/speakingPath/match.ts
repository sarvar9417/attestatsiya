// Speaking Path — oflayn matn-moslik (Gapir/recall tekshiruvi uchun)
// Reja: docs/speaking-path-roadmap.md (Faza 3)
// STT transcript yoki yozilgan matnni maqsad jumla bilan solishtiradi.

const numWords: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4',
  five: '5', six: '6', seven: '7', eight: '8', nine: '9',
  ten: '10', eleven: '11', twelve: '12',
  thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16',
  seventeen: '17', eighteen: '18', nineteen: '19',
  twenty: '20', thirty: '30', forty: '40', fifty: '50',
  sixty: '60', seventy: '70', eighty: '80', ninety: '90',
  hundred: '100', thousand: '1000',
}

/** Kichik harf, tinish belgilarsiz, raqam/so'z va vaqt normalizatsiyasi */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:'"()…—-]/g, ' ')
    .replace(/(\d+):(\d+)/g, '$1 $2')
    .replace(/\b(\d+)\s+00\b/g, '$1')
    .replace(/\bo\s*clock\b/g, '')
    .replace(
      /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\b/g,
      m => numWords[m],
    )
    .replace(/\b([2-9]0)\s+([1-9])\b/g, (_, t, o) => String(Number(t) + Number(o))) // "twenty five" → "20 5" → "25"
    .replace(/\s+/g, ' ')
    .trim()
}

/** Levenshtein masofasi (ikki string orasidagi tahrir soni) */
function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, (_, i) => i)
  for (let j = 1; j <= n; j++) {
    let prev = dp[0]
    dp[0] = j
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i]
      dp[i] = Math.min(
        dp[i] + 1, // o'chirish
        dp[i - 1] + 1, // qo'shish
        prev + (a[i - 1] === b[j - 1] ? 0 : 1), // almashtirish
      )
      prev = tmp
    }
  }
  return dp[m]
}

/** 0..1 o'xshashlik (1 = aynan bir xil) */
export function similarity(a: string, b: string): number {
  const na = normalize(a)
  const nb = normalize(b)
  const maxLen = Math.max(na.length, nb.length)
  if (maxLen === 0) return 1
  return 1 - levenshtein(na, nb) / maxLen
}

/** O'xshashlik → FSRS rating (src/lib/srs.ts: ratingToGrade) */
export function similarityToRating(sim: number): string {
  if (sim >= 0.9) return 'yodladim'
  if (sim >= 0.65) return 'bildim'
  if (sim >= 0.4) return 'qiynaldim'
  return 'bilmadim'
}

/** Javob "to'g'ri" hisoblanadimi (✅/❌ chegarasi) */
export function isCorrect(sim: number): boolean {
  return sim >= 0.65
}

// ── Semantic re-export (Faza 4) ──────────────────────────────────────────────

export {
  semanticSimilarity,
  semanticToRating,
  isSemanticCorrect,
} from '../../utils/semanticMatch'
export type { SemanticMatchResult } from '../../utils/semanticMatch'
