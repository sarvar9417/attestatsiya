/** Sanoq sistemalari: 11-bobli original LaTeX qo‘llanmadan strukturaviy o‘girilgan nazariya. */
import type { TheoryBlock } from '../topicContent'
import raw from './m05.json'

/** M05.01: 1–2-boblar; M05.02: 3–5-boblar; M05.03: 6–11-boblar. */
export const M05_THEORY = raw as unknown as Record<string, TheoryBlock[]>
