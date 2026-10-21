/** Ordering is persisted to the room's private server-side question snapshot.
 * Never mutate React state arrays; reject out-of-bounds moves. */
export function reorderManualQuestions(
  ids: readonly string[], index: number, direction: -1 | 1,
): string[] {
  const target = index + direction
  if (!Number.isInteger(index) || index < 0 || target < 0 || target >= ids.length) {
    return [...ids]
  }
  const next = [...ids]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}
