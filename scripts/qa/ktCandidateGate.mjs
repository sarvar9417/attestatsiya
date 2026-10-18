/** Private hardware/software bank release gate. No candidate data belongs in Git. */
export function assessCandidates(items, expectedCount = 387) {
  const issues = []
  if (!Array.isArray(items)) return { ready: false, total: 0, issues: ['items_not_array'] }
  if (items.length !== expectedCount) issues.push(`expected_${expectedCount}_got_${items.length}`)
  const seen = new Set()
  for (const [index, item] of items.entries()) {
    const id = item?.external_id ?? `index_${index}`
    if (seen.has(id)) issues.push(`${id}:duplicate_id`)
    seen.add(id)
    if (!/^KT-\d{2}-\d{3}$/.test(id)) issues.push(`${id}:invalid_external_id`)
    if (!Array.isArray(item?.options) || item.options.length !== 4 || new Set(item.options).size !== 4)
      issues.push(`${id}:invalid_options`)
    if (!['A', 'B', 'C', 'D'].includes(item?.correct_letter)) issues.push(`${id}:invalid_key`)
    if (!['S2.HW.01', 'S2.HW.02', 'S2.HW.03', 'S2.HW.04'].some(code => item?.construct_codes?.includes(code)))
      issues.push(`${id}:unmapped_construct`)
    if (item?.review_state !== 'approved_for_import') issues.push(`${id}:not_approved`)
    for (const field of ['source_verified', 'expert_verified', 'editor_approved', 'key_unique_verified', 'distractors_verified'])
      if (item?.[field] !== true) issues.push(`${id}:${field}_missing`)
    if (!item?.evidence_book_code || !Number.isSafeInteger(item?.evidence_pdf_page) ||
        item.evidence_pdf_page < 1 || typeof item.evidence_excerpt !== 'string' ||
        item.evidence_excerpt.trim().length < 30)
      issues.push(`${id}:precise_source_missing`)
    if (typeof item?.reviewer_key_rationale !== 'string' || item.reviewer_key_rationale.trim().length < 30)
      issues.push(`${id}:key_review_missing`)
    if (typeof item?.reviewer_distractor_rationale !== 'string' || item.reviewer_distractor_rationale.trim().length < 30)
      issues.push(`${id}:distractor_review_missing`)
    if (!Array.isArray(item?.qa_flags) || item.qa_flags.length !== 0)
      issues.push(`${id}:unresolved_qa_flags`)
  }
  return { ready: issues.length === 0, total: items.length, issues }
}
