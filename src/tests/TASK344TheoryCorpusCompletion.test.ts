import { describe, expect, it } from 'vitest'
import { inspectLearnerTheoryCorpus } from '../../scripts/audit-learner-theory-corpus'
import { getTopicContent } from '../data/topicContent'

describe('TASK-344: unified source-backed learner books', () => {
  const audit = inspectLearnerTheoryCorpus()

  it('audits the exact learner-visible tree and separates reference appendices', () => {
    expect(audit.topicCount).toBe(115)
    expect(audit.chapterCount).toBe(110)
    expect(audit.appendixCount).toBe(5)
    expect(new Set(audit.rows.map(row => row.id)).size).toBe(audit.topicCount)
    expect(audit.rows.some(row => row.id === 'M02.05')).toBe(false)
    expect(audit.rows.filter(row => row.kind === 'appendix').map(row => row.id)).toEqual([
      'M01.01', 'M01.09', 'M01.10', 'M01.11', 'M01.12',
    ])
  })

  it('gives every learner chapter the common book and self-study contract', () => {
    expect(audit.completeChapterCount).toBe(audit.chapterCount)
    expect(audit.incompleteChapterCount).toBe(0)
    for (const row of audit.rows.filter(item => item.kind === 'chapter')) {
      expect(row.gaps, row.id).toEqual([])
      expect(row.sources, row.id).toBeGreaterThanOrEqual(1)
      if (!row.id.startsWith('M01.')) {
        expect(row.headings, row.id).toBeGreaterThanOrEqual(5)
        expect(row.richExamples, row.id).toBeGreaterThanOrEqual(2)
        expect(row.tasks, row.id).toBeGreaterThanOrEqual(1)
        expect(row.answers, row.id).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('promotes logic, algorithms and Scratch/Logo without replacing their quizzes', () => {
    for (const id of [
      'M04.01', 'M04.02', 'M04.03', 'M04.04', 'M04.05', 'M04.06',
      'M06.01', 'M06.02', 'M06.03', 'M06.04',
      'M07.01', 'M07.02', 'M07.03', 'M07.04', 'M07.05', 'M07.06',
    ]) {
      const topic = getTopicContent(id)
      expect(topic, id).toBeDefined()
      expect(topic?.questions.map(question => question.id), id).toEqual([
        `${id}-q1`, `${id}-q2`, `${id}-q3`,
      ])
      expect(topic?.theory.some(block => block.type === 'goal'), id).toBe(true)
      expect(topic?.theory.some(block => block.type === 'answers'), id).toBe(true)
      expect(topic?.theory.filter(block => block.type === 'source').length, id).toBeGreaterThanOrEqual(2)
    }
  })

  it('keeps all source-note families readable as one chapter instead of separate mini-lessons', () => {
    for (const id of ['M08.01', 'M09.01', 'M12.06', 'M13.01', 'M14.01', 'M16.01']) {
      const topic = getTopicContent(id)
      expect(topic?.theory[0].type, id).toBe('goal')
      expect(topic?.theory[1].type, id).toBe('intro')
      expect(topic?.theory[2].type, id).toBe('keywords')
      expect(topic?.theory.some(block => block.type === 'source'), id).toBe(true)
    }
    for (const id of ['M05.01', 'M05.02', 'M05.03']) {
      const topic = getTopicContent(id)
      expect(topic?.theory.some(block => block.type === 'task'), id).toBe(true)
      expect(topic?.theory.some(block => block.type === 'answers'), id).toBe(true)
      expect(topic?.theory.some(block => block.type === 'source'), id).toBe(true)
    }
  })
})
