/**
 * Y2 (moslashtirish) savollari o'zaro bir qiymatli bo'lishi kerak:
 * har bir chap elementga bitta, takrorlanmagan o'ng javob tanlanadi.
 * Bu faqat o'quv interfeýsining to'liqlik tekshiruvi; rasmiy imtihon
 * javobini server tekshiradi.
 */
export interface MatchingPair {
  leftId: string
  rightContent: string
}

export function isCompleteOneToOneMatching(
  pairs: readonly MatchingPair[],
  answer: unknown,
): answer is Record<string, string> {
  if (pairs.length === 0 || !answer || typeof answer !== 'object' || Array.isArray(answer)) {
    return false
  }

  const leftIds = new Set(pairs.map((pair) => pair.leftId))
  const rightChoices = new Set(pairs.map((pair) => pair.rightContent))
  if (
    leftIds.size !== pairs.length ||
    rightChoices.size !== pairs.length ||
    [...rightChoices].some((choice) => choice.trim() === '')
  ) {
    return false
  }

  const submitted = answer as Record<string, unknown>
  if (
    Object.keys(submitted).length !== pairs.length ||
    Object.keys(submitted).some((id) => !leftIds.has(id))
  ) {
    return false
  }

  const selected = pairs.map((pair) => submitted[pair.leftId])
  return (
    selected.every((choice) => typeof choice === 'string' && rightChoices.has(choice)) &&
    new Set(selected).size === pairs.length
  )
}

export function isRightChoiceUsedByAnotherPair(
  selected: Record<string, string> | undefined,
  leftId: string,
  rightContent: string,
): boolean {
  if (!selected) return false
  return Object.entries(selected).some(
    ([otherLeftId, chosen]) => otherLeftId !== leftId && chosen === rightContent,
  )
}
