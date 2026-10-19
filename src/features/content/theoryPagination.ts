import type { TheoryBlock } from '../../data/topicContent'

/**
 * Small, source-order-preserving pages for static lessons.
 * M02 combines nine original lessons into four canonical topics. Keep the
 * following explanation together with its heading instead of placing that
 * heading at the bottom of the preceding page.
 * Default behavior stays unchanged for every other module.
 */
export function paginateTheoryBlocks(
  theory: readonly TheoryBlock[],
  pageSize = 2,
  keepHeadingWithNext = false,
): TheoryBlock[][] {
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new Error('Invalid page size')
  const pages: TheoryBlock[][] = []
  for (let index = 0; index < theory.length;) {
    let end = Math.min(index + pageSize, theory.length)
    if (keepHeadingWithNext && end < theory.length && theory[end - 1].type === 'heading') {
      // A single heading can expand its page by one item even at pageSize=1.
      end = end - index === 1 ? end + 1 : end - 1
    }
    pages.push(theory.slice(index, end))
    index = end
  }
  return pages
}
