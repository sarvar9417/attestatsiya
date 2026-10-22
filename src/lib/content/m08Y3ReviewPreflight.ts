/**
 * M08 private Y3 review preflight.
 *
 * A structural/pedagogical gate only. NEVER runs private submitted programs,
 * approves a question, writes to production, or validates the semantic answer.
 * The private JSON and answer keys must never be committed to public Git.
 */
const record = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const source = /^pyjs-2026-v2:([PJ])\d{2}-\d{3}$/

export function validateM08Y3ReviewCandidate(value: unknown): string[] {
  const errors: string[] = []
  const item = record(value)
  if (!item) return ['candidate_not_object']

  const reference = typeof item.previous_source_reference === 'string'
    ? item.previous_source_reference : ''
  const sourceMatch = source.exec(reference)
  if (!sourceMatch) errors.push('invalid_previous_source_reference')
  if (typeof item.previous_question_id !== 'string' || !uuid.test(item.previous_question_id)) {
    errors.push('invalid_previous_question_uuid')
  }

  if (item.format !== 'Y3' || item.group_code !== 'S4.CODE') {
    errors.push('invalid_format_or_group')
  }
  if (item.intent !== 'review_only_immutable_replacement_candidate'
    || item.publication_status !== 'review_only_not_in_database') {
    errors.push('cannot_claim_published_status')
  }
  if (item.preserve_old_exam_items !== true) errors.push('historical_exam_items_must_be_preserved')
  if (item.independent_human_editorial_signoff !== false) {
    errors.push('must_not_claim_unverified_human_review')
  }

  const stem = typeof item.stem_md === 'string' ? item.stem_md : ''
  const codeBlocks = [...stem.matchAll(/```(python|javascript)\n([\s\S]*?)\n```/g)]
  if (codeBlocks.length !== 1 || !codeBlocks[0][2].trim()) {
    errors.push('exactly_one_executable_code_block_required')
  } else {
    const [block, language, code] = codeBlocks[0]
    const expectedLanguage = sourceMatch?.[1] === 'P' ? 'python' : 'javascript'
    if (sourceMatch && language !== expectedLanguage) errors.push('language_source_mismatch')
    if (stem.split(block).length !== 2) errors.push('ambiguous_code_block_count')
    if (!(language === 'python' ? /\bprint\s*\(/.test(code) : /\bconsole\.log\s*\(/.test(code))) {
      errors.push('no_output_statement')
    }
  }
  if (!/tartibida/i.test(stem) || !/natija/i.test(stem)) {
    errors.push('must_explicitly_ask_for_output_order')
  }

  const choices = Array.isArray(item.options) ? item.options : []
  if (choices.length !== 4) {
    errors.push('exactly_four_options_required')
  } else {
    const indices: number[] = []
    const texts: string[] = []
    for (const choice of choices) {
      const option = record(choice)
      if (!option || option.side !== 'a' || typeof option.content_md !== 'string'
        || !option.content_md.trim() || typeof option.order_idx !== 'number' || !Number.isInteger(option.order_idx)) {
        errors.push('malformed_option')
      } else {
        indices.push(option.order_idx as number)
        texts.push(option.content_md.trim().replace(/\s+/g, ' '))
      }
    }
    if (indices.length !== 4 || [...indices].sort((a, b) => a - b).join(',') !== '0,1,2,3') {
      errors.push('option_indices_must_be_0_to_3')
    }
    if (new Set(texts).size !== 4) errors.push('duplicate_output_option')
  }

  const key = item.correct_order_option_indices
  if (!Array.isArray(key) || key.length !== 4 || key.some(n => !Number.isInteger(n))
    || [...key].sort((a, b) => a - b).join(',') !== '0,1,2,3') {
    errors.push('answer_must_be_four_option_permutation')
  }
  if (typeof item.explanation_md !== 'string' || item.explanation_md.trim().length < 40) {
    errors.push('detailed_explanation_required')
  }
  if (typeof item.source_context !== 'string' || !item.source_context.trim()) {
    errors.push('source_context_required')
  }

  // Topic/syntax evidence is not an assertion that this original question
  // appears verbatim on a textbook page, nor an automatic source approval.
  // The bounds are PDF page numbers, not the page numbers printed in books.
  const sourcePdfPages: Record<string, number> = {
    'Informatika Testlar spesifikatsiyasi.pdf': 10,
    'ICT 9_sinf-2020(1).pdf': 114,
    'ICT 10_sinf-2021(1).pdf': 257,
    '10-11-sinf informatika (Cambridge +)(1).pdf': 360,
  }
  const pythonBooks = new Set(['ICT 9_sinf-2020(1).pdf', 'ICT 10_sinf-2021(1).pdf'])
  const javascriptBooks = new Set(['10-11-sinf informatika (Cambridge +)(1).pdf'])
  const evidence = Array.isArray(item.source_evidence) ? item.source_evidence : []
  let specEvidence = false
  let textbookEvidence = false
  if (evidence.length < 2) errors.push('specification_and_textbook_evidence_required')
  for (const raw of evidence) {
    const e = record(raw)
    const file = typeof e?.file === 'string' ? e.file : ''
    const page = e?.pdf_page_1_based
    if (!Object.prototype.hasOwnProperty.call(sourcePdfPages, file) || typeof page !== 'number'
      || !Number.isInteger(page) || page < 1 || page > sourcePdfPages[file]) {
      errors.push('invalid_source_pdf_page_or_file')
      continue
    }
    if (e?.evidence_level !== 'topic_and_syntax_not_verbatim_source'
      || typeof e?.supported_skill !== 'string' || e.supported_skill.trim().length < 7) {
      errors.push('unqualified_or_unsupported_source_evidence')
    }
    if (file === 'Informatika Testlar spesifikatsiyasi.pdf' && page === 4) {
      specEvidence = true
    }
    if (sourceMatch?.[1] === 'P' && pythonBooks.has(file)) textbookEvidence = true
    if (sourceMatch?.[1] === 'J' && javascriptBooks.has(file)) textbookEvidence = true
  }
  if (!specEvidence) errors.push('missing_2026_specification_reference')
  if (!textbookEvidence) errors.push('missing_language_appropriate_textbook_reference')

  return [...new Set(errors)]
}

export function validateM08Y3ReviewBatch(data: unknown): { count: number; failures: { index: number; codes: string[] }[] } {
  const dataRecord = record(data)
  const items: unknown = Array.isArray(data) ? data : dataRecord?.items
  if (!Array.isArray(items) || items.length === 0) {
    return { count: 0, failures: [{ index: -1, codes: ['nonempty_review_array_required'] }] }
  }
  const failures = items.flatMap((value, index) => {
    const codes = validateM08Y3ReviewCandidate(value)
    return codes.length ? [{ index, codes }] : []
  })
  const refs = new Set<string>()
  for (const [index, value] of items.entries()) {
    const ref = record(value)?.previous_source_reference
    if (typeof ref !== 'string') continue
    if (refs.has(ref)) failures.push({ index, codes: ['duplicate_previous_source_reference'] })
    refs.add(ref)
  }
  return { count: items.length, failures }
}
