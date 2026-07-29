/**
 * Replace all occurrences of 'Sarvar' with the given userName throughout the text.
 *
 * Handles:
 * - Possessive forms: "Sarvar's" → "Ali's"
 * - Punctuation: "Sarvar." → "Ali." , "Sarvar," → "Ali,"
 * - Avoids false matches inside words: "Sarvarbek" → not modified
 * - Empty / missing userName returns original text unchanged
 * - If userName === 'Sarvar' returns original text unchanged (no-op)
 */
export function personalizeText(text: string, userName: string): string {
  if (!userName || userName === 'Sarvar') return text
  // Uses negative lookahead (?!\w) to avoid replacing inside words (e.g. 'Sarvarbek')
  return text.replace(/Sarvar(?!\w)/g, userName)
}
