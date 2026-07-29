// ═══════════════════════════════════════════════════════════════════════════
// O'zbek tilidagi grammatik terminologiya lug'ati
// Kanonik manba: grammarGlossary.ts → bu fayl undan re-export qiladi
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Re-export from grammarGlossary.ts which is the canonical source.
 * terminology-uz.ts exists as a convenient import for consumers that prefer
 * the Record-based API (Record<string, GrammarTerm> with `en` as key).
 *
 * grammarGlossary.ts uses GrammarTerm[] with `en` as a field — that is the
 * single source of truth; this file just re-exports the same helpers.
 */

import {
  termUz as _termUz,
  termUzFull as _termUzFull,
  termUzBilingual as _termUzBilingual,
  termDescription as _termDescription,
} from './grammarGlossary'

export type { GrammarTerm } from './grammarGlossary'

/** Terminni o'zbekcha qisqa shaklda qaytaradi */
export const termUz = _termUz

/** Terminni to'liq o'zbekcha nom bilan qaytaradi */
export const termUzFull = _termUzFull

/** Terminni "To'liq nom (English Name)" formatida qaytaradi */
export const termUzBilingual = _termUzBilingual

/** Terminning description/info matnini qaytaradi */
export const termDescription = _termDescription
