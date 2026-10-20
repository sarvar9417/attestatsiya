import { describe, expect, it } from 'vitest'
import { TOPIC_CONTENT, getTopicContent } from '../data/topicContent'
import { paginateTheoryBlocks } from '../features/content/theoryPagination'

describe('static theory pages', () => {
  it('preserves every block exactly once and in source order across all static lessons', () => {
    for (const topic of Object.values(TOPIC_CONTENT)) {
      const pages = paginateTheoryBlocks(topic.theory)
      expect(pages.flat(), topic.subtopicId).toEqual(topic.theory)
      expect(pages.every(page => page.length > 0 && page.length <= 2), topic.subtopicId).toBe(true)
    }
  })

  it('M11.02 starts with a continuous sourced HTML book and preserves end appendices', () => {
    const topic = getTopicContent('M11.02')
    expect(topic).toBeDefined()
    const pages = paginateTheoryBlocks(topic!.theory)
    expect(pages).toHaveLength(Math.ceil(topic!.theory.length / 2))
    expect(pages.slice(0, 2).map(page => page.map(block => block.type))).toEqual([
      ['goal', 'intro'], ['table', 'heading'],
    ])
    expect(pages.flat().map(block => block.content)).toEqual(topic!.theory.map(block => block.content))
    expect(topic!.theory.at(-1)?.type).toBe('source')
  })

  it('empty content has no blank pages; invalid page sizes are rejected', () => {
    expect(paginateTheoryBlocks([])).toEqual([])
    expect(() => paginateTheoryBlocks([], 0)).toThrow('Invalid page size')
    expect(() => paginateTheoryBlocks([], 1.5)).toThrow('Invalid page size')
  })
})
