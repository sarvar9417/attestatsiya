/**
 * Lesson Content Gateway — dars kontentini backend-first o'qiydi.
 *
 * Tartib:
 *   1. Backend API (published dars savollari) — asosiy manba
 *   2. Backend xato yoki tarmoq uzilishida → statik kontent (src/data/)
 *
 * Kalit (question_keys) client'ga hech qachon chiqmaydi: javob tekshirish
 * doimo serverda bajariladi, statik fallback faqat lokal (offline) holat uchun.
 */
import { getTopicContent, type TestQuestion } from '../../data/topicContent'
import {
  getLessonQuestions,
  checkAnswer as apiCheckAnswer,
  type LessonQuestion,
} from './contentApi'
import { isNetworkError } from '../../lib/apiClient'

/**
 * Backend savolini UI TestQuestion shakliga o'tkazadi.
 * M01 banki Y1 (MCQ) formatda; boshqa format hozircha statik fallback qoladi.
 * correctIndex noma'lum (-1) — kalit faqat serverda.
 */
function mapLessonQuestion(q: LessonQuestion): TestQuestion | null {
  if (q.format !== 'Y1') return null
  return {
    id: q.id,
    text: q.stem_md,
    options: q.options.map(o => o.content_md),
    optionIds: q.options.map(o => o.id),
    correctIndex: -1,
    explanation: '',
    type: 'Y1',
    source: 'backend',
  }
}

/**
 * Dars test savollarini oladi: backend-first, statik fallback.
 */
export async function getLessonTestQuestions(subtopicId: string): Promise<TestQuestion[]> {
  const staticQuestions = getTopicContent(subtopicId)?.questions ?? []

  try {
    const remote = await getLessonQuestions(subtopicId)
    const mapped = remote
      .map(mapLessonQuestion)
      .filter((q): q is TestQuestion => q !== null)
    if (mapped.length > 0) return mapped
    return staticQuestions
  } catch {
    // Backend xatosi (tarmoq uzilishi, 404, kontrakt buzilishi) → statik
    return staticQuestions
  }
}

/**
 * Javobni tekshiradi: server-authoritative.
 *
 * @param question  UI savoli (backend savoli uchun optionIds kerak)
 * @param optionIndex  tanlangan variant indeksi
 * @returns correctIndex -1 bo'lsa — natijani aniqlab bo'lmadi (server xatosi)
 */
export async function checkQuestionAnswer(
  question: TestQuestion,
  optionIndex: number
): Promise<{ correct: boolean; correctIndex: number; explanation: string }> {
  const optionId = question.optionIds?.[optionIndex]

  // Backend savoli uchun option id bo'lmasa serverga yuborib bo'lmaydi
  if (!optionId) {
    if (question.correctIndex >= 0) {
      return {
        correct: optionIndex === question.correctIndex,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
      }
    }
    return { correct: false, correctIndex: -1, explanation: '' }
  }

  try {
    const result = await apiCheckAnswer(question.id, optionId)
    const correctIndex = question.optionIds?.indexOf(result.correct_option_id) ?? -1
    return {
      correct: result.correct,
      correctIndex: correctIndex >= 0 ? correctIndex : question.correctIndex,
      explanation: result.explanation_md ?? '',
    }
  } catch (error) {
    // Offline fallback: statik savolda kalit bor bo'lsa lokaldan tekshiramiz
    if (question.source !== 'backend' && !isNetworkError(error)) {
      return {
        correct: optionIndex === question.correctIndex,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
      }
    }
    // Server javobi yo'q va lokal kalit yo'q — natijani aniqlab bo'lmaydi
    return { correct: false, correctIndex: -1, explanation: '' }
  }
}
