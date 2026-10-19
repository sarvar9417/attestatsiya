import type { TheoryBlock } from '../../data/topicContent'

/**
 * Small, source-order-preserving pages for legacy/static lesson theory.
 * Every block belongs to exactly one page; no text is cut or omitted.
 * BookReader's heading-aware pagination continues to serve source books.
 */
export function paginateTheoryBlocks(theory: readonly TheoryBlock[], pageSize = 2): TheoryBlock[][] {
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new Error('Invalid page size')
  const pages: TheoryBlock[][] = []
  for (let index = 0; index < theory.length; index += pageSize) {
    pages.push(theory.slice(index, index + pageSize))
  }
  return pages
}
