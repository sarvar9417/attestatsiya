/**
 * Y3 ordering responses must be an exact permutation of the displayed item IDs.
 * A matching length alone is not enough: stale, unknown or repeated IDs must
 * not be submitted or marked correct.
 *
 * This only strengthens the local learner UI and fallback check. Official
 * exam scoring and answer keys remain authoritative on the backend.
 */
export function isCompleteOrdering(
  items: readonly { id: string }[],
  answer: unknown,
): answer is string[] {
  if (!Array.isArray(items) || items.length === 0 || !Array.isArray(answer)) {
    return false
  }
  if (answer.length !== items.length) return false
  const ids = items.map(item => item.id)
  if (ids.some(id => typeof id !== 'string' || id.trim() === '')) return false
  const validIds = new Set(ids)
  if (validIds.size !== items.length) return false
  if (!answer.every(id => typeof id === 'string' && validIds.has(id))) {
    return false
  }
  return new Set(answer).size === items.length
}
