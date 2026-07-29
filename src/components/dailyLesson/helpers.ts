import type { DailyExercise } from '../../data/dailyLessons'

export const COLOR_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  purple: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  green:  { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
}

export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase().trim()
    // normalize smart/curly apostrophes → ASCII
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[.,!?;:]/g, '')
    // irregular contractions must come before the general n't rule
    .replace(/won't/g, 'will not')
    .replace(/can't/g, 'cannot')
    .replace(/shan't/g, 'shall not')
    .replace(/let's/g, 'let us')
    // pronoun + 's → is  (he's, she's, it's, that's, what's, who's, there's, where's)
    .replace(/\b(he|she|it|that|this|what|who|there|here|where|how|why|which)'s\b/g, '$1 is')
    // contractions after a word character: I'll, he's, they're …
    .replace(/(\w)'ll\b/g, '$1 will')
    .replace(/(\w)'ve\b/g, '$1 have')
    .replace(/(\w)'re\b/g, '$1 are')
    .replace(/(\w)'m\b/g, '$1 am')
    .replace(/(\w)'d better\b/g, '$1 had better')
    .replace(/(\w)'d\b/g, '$1 would')
    // standalone contractions at start of string or after space
    // e.g. "'m going to buy" (blank answer without subject) → "am going to buy"
    .replace(/(^|\s)'ll\b/g, '$1will')
    .replace(/(^|\s)'ve\b/g, '$1have')
    .replace(/(^|\s)'re\b/g, '$1are')
    .replace(/(^|\s)'m\b/g, '$1am')
    .replace(/(^|\s)'d better\b/g, '$1had better')
    .replace(/(^|\s)'d\b/g, '$1would')
    // n't → not  (do not, does not, did not, is not, are not, was not …)
    .replace(/n't\b/g, ' not')
    .replace(/\s+/g, ' ')
    .trim()
}

function acceptBlank(text: string, blank: string): boolean {
  const cleaned = normalizeAnswer(text)
  return blank.split('/').some(alt => normalizeAnswer(alt) === cleaned)
}

export function isAcceptedAnswer(userAnswer: string, accepted: string[]): boolean {
  return accepted.some(a => normalizeAnswer(a) === normalizeAnswer(userAnswer))
}

export function isBlankAccepted(ex: Extract<DailyExercise, { type: 'fill-blank' | 'passage' }>, index: number, userAnswer: string): boolean {
  const accepted = ex.acceptedAnswers?.[index]
  if (accepted?.length) return isAcceptedAnswer(userAnswer, accepted)
  return acceptBlank(userAnswer, ex.blanks[index] ?? '')
}

export function getAcceptedBlankText(ex: Extract<DailyExercise, { type: 'fill-blank' | 'passage' }>, index: number): string {
  const accepted = ex.acceptedAnswers?.[index]
  if (accepted?.length) return accepted.join(' / ')
  return ex.blanks[index] ?? ''
}

export function checkAnswer(ex: DailyExercise, userAns: string[]): boolean {
  if (!userAns || userAns.length === 0) return false
  switch (ex.type) {
    case 'fill-blank':
      return ex.blanks.every((_, i) => isBlankAccepted(ex, i, userAns[i] ?? ''))
    case 'multiple-choice':
      return normalizeAnswer(userAns[0] ?? '') === normalizeAnswer(ex.correct)
    case 'error-correction':
    case 'transformation':
      return normalizeAnswer(userAns[0] ?? '') === normalizeAnswer(ex.correct)
    case 'fill-table': {
      const expected = ex.rows.flatMap((r) => [r.comp, r.sup])
      return expected.every((b, i) => normalizeAnswer(userAns[i] ?? '') === normalizeAnswer(b))
    }
    case 'vocab-match':
      return normalizeAnswer(userAns[0] ?? '') === normalizeAnswer(ex.correct)
    case 'passage':
      return ex.blanks.every((_, i) => isBlankAccepted(ex, i, userAns[i] ?? ''))
    case 'connection':
      // Elaborative encoding — ochiq javob; yozilgan bo'lsa bajarilgan deb hisoblanadi
      return (userAns[0] ?? '').trim().length > 0
    case 'elaborative':
      // Elaborative interrogation — har doim to'g'ri (o'z-o'zini tekshirish uchun)
      return true
  }
}

/* ─── Display helperlari (union bo'ylab xavfsiz matn olish) ───
   Yangi mashq turi qo'shilganda faqat shu ikki switch'ni yangilash kifoya —
   LessonView / ReviewView / SpecialCaseCard ichidagi tarqoq ternary'lar emas. */

export function getExerciseContext(ex: DailyExercise): string {
  switch (ex.type) {
    case 'fill-blank':
    case 'multiple-choice':
    case 'error-correction':
    case 'transformation':
      return ex.question
    case 'fill-table':
      return ex.instruction
    case 'vocab-match':
      return ex.word
    case 'passage':
      return ex.passage
    case 'connection':
      return ex.prompt
    case 'elaborative':
      return ex.question
  }
}

export function getCorrectText(ex: DailyExercise): string {
  switch (ex.type) {
    case 'fill-blank':
    case 'passage':
      return ex.blanks.map((_, i) => getAcceptedBlankText(ex, i)).join(' / ')
    case 'multiple-choice':
    case 'error-correction':
    case 'transformation':
    case 'vocab-match':
      return ex.correct
    case 'fill-table':
      return ex.rows.map(r => `${r.adj}: ${r.comp}/${r.sup}`).join('; ')
    case 'connection':
      return ex.exampleAnswer
    case 'elaborative':
      return ex.exampleAnswer
  }
}

export const OPTION_LABELS = ['A', 'B', 'C', 'D']
