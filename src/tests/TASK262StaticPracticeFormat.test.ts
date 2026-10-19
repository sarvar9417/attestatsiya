import { describe, expect, it } from 'vitest'
import { getTopicContent, TOPIC_CONTENT } from '../data/topicContent'

describe('TASK-262: legacy static mini-quiz interaction format', () => {
  it('keeps source MCQ text and correct index, but renders old cognitive Y2/Y3 labels as actionable Y1 choices', () => {
    const cases = [
      ['M07.04', 'M07.04-q3', 2, 'Y2'],
      ['M04.02', 'M04.02-q3', 1, 'Y3'],
      ['M05.02', 'M05.02-q3', 2, 'Y3'],
    ] as const
    for (const [topicId, itemId, expectedIndex, expectedLevel] of cases) {
      const question = getTopicContent(topicId)?.questions.find(item => item.id === itemId)
      expect(question, itemId).toBeDefined()
      expect(question?.type, itemId).toBe('Y1')
      expect(question?.cognitiveLevel, itemId).toBe(expectedLevel)
      expect(question?.options, itemId).toHaveLength(4)
      expect(question?.correctIndex, itemId).toBe(expectedIndex)
      expect(question?.options[expectedIndex]).toBeTruthy()
    }
  })

  it('does not leave unanswerable pseudo-matching or pseudo-ordering items in legacy M02–M13 topics', () => {
    const malformed = Object.entries(TOPIC_CONTENT)
      .filter(([topicId]) => /^M(?:0[2-9]|1[0-3])\.\d{2}$/.test(topicId))
      .flatMap(([topicId, topic]) => topic.questions
        .filter(q => (q.type === 'Y2' && !q.pairs?.length)
          || (q.type === 'Y3' && (!q.items?.length || !q.correctOrder?.length)))
        .map(q => `${topicId}/${q.id}`))
    expect(malformed).toEqual([])
  })
})
