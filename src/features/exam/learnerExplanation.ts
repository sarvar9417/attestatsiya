/**
 * Explanations are delivered only after server-authoritative scoring.
 *
 * Legacy imported explanations sometimes append editorial PDF IDs, source-key
 * confirmations and candidate numbers. Preserve the teaching rationale, but
 * keep source provenance in the database/auditor view rather than exposing it
 * as part of the learner-facing answer explanation.
 *
 * No question texts, answer keys, option IDs or per-question mappings belong
 * in the browser bundle.
 */

const sourceParagraph = /^\s*(?:\*{0,2})?(?:(?:Asl|Telegramdagi)\s+)?Manba(?:lar)?(?:\*{0,2})?\s*:\s*/iu

const editorialSentence = [
  /\b(?:Asl\s+)?manba\s+javobi\s+shu\.?/giu,
  /\b(?:Asl\s+)?PDF\s+javobi\s+shu\.?/giu,
  /\b(?:Asl\s+)?javob\s+shu\.?/giu,
  /\b(?:Manba|Asl\s+manba)\s+shuni\s+beradi\.?/giu,
  /\bAsl\s+manba\s+shunday\s+kalitni\s+beradi\.?/giu,
  /\bPDF\s+muallif\s+kaliti\s+saqlandi[^.]*\.?/giu,
  /\b(?:PDF|Manba)\s+\d+\s*[-–]\s*[A-D](?:\s*,\s*\d+\s*[-–]\s*[A-D])*\.?/giu,
  /\bPDF\s+kaliti\s+namoyish\.?/giu,
  /\bPDF\s+javobi\s+lokal\s+daraja\.?/giu,
  /\bManba\s+huquqiy\s+tarbiya\s+deb\s+beradi\.?/giu,
  /\bManba\s+javobi\s+xususiy-metodik\s*\(mezo\)\.?/giu,
  /\bAsl\s+PDF\s+\d+\s*[-–]\s*[A-D]\s+moslikni\s+beradi\.?/giu,
  /\bAsl\s+PDF\s+javobi\s+aynan\s+shu\.?/giu,
  /\bAsl\s+manbada\s+shu\.?/giu,
  /\bPDFda\s+shu\s+daraja\s+berilgan\.?/giu,
  /\bPDFda\s+\d+\s*[-–]\s*[A-D](?:\s*,\s*\d+\s*[-–]\s*[A-D])*\s+moslig?i?\s+berilgan\.?/giu,
  /\bManbada\s+diagnostika\s+ajratib\s+ko‘rsatilgan\.?/giu,
  /\bPDF\s+ikki\s+tomonini\s+ko‘rsatadi\.?/giu,
]

/** Read-only presentation transform; never write the result to a published row. */
export function learnerExplanation(raw: string | null | undefined): string {
  if (!raw?.trim()) return ''

  // Split only on paragraph boundaries: inline mention of a reference or a
  // citation in the rationale is not evidence that the paragraph is metadata.
  const paragraphs = raw.replace(/\r\n?/g, '\n').split(/\n\s*\n/)
  const meaningful = paragraphs.filter(p => !sourceParagraph.test(p))
  const stripped = meaningful
    .map(paragraph => editorialSentence.reduce((text, rule) => text.replace(rule, ''), paragraph)
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\s+([.,;:])/g, '$1')
      .trim())
    .filter(Boolean)
    .join('\n\n')
    .trim()

  // Never pass a citation or an empty assertion off as a learning explanation.
  // The answer key itself still comes exclusively from the scoring server.
  return stripped || 'Bu savolning batafsil tushuntirishi tahrir qilinmoqda.'
}
