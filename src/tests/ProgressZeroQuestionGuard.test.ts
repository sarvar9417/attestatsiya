import { beforeEach, describe, expect, it } from 'vitest'
import { useProgressStore } from '../store/progressStore'

describe('topic progress is awarded only for valid answered tests', () => {
  beforeEach(() => {
    useProgressStore.setState({ moduleProgress: {} })
  })

  it('rejects zero-question, negative, impossible and invalid scores', () => {
    const complete = useProgressStore.getState().completeTopic
    complete('M03', 'M03.01', 0, 0)
    complete('M03', 'M03.02', 1, 0)
    complete('M03', 'M03.03', -1, 20)
    complete('M03', 'M03.04', 21, 20)
    complete('M03', 'M03.05', NaN, 20)
    complete('M03', 'M03.06', 10, Infinity)
    expect(useProgressStore.getState().getModuleProgress('M03').completedTopics).toEqual([])
    expect(useProgressStore.getState().isModuleComplete('M03', 0)).toBe(false)
  })

  it('ignores historical persisted 0/0 completions while keeping genuine attempts', () => {
    useProgressStore.setState({
      moduleProgress: {
        M03: {
          completedTopics: ['M03.01', 'M03.02'],
          topicProgress: {
            'M03.01': { completed: true, correctCount: 0, totalCount: 0, lastScore: 100 },
            'M03.02': { completed: true, correctCount: 16, totalCount: 20, lastScore: 80 },
          },
          mockExamScore: 40,
          mockExamCompleted: true,
          mockExamAnswers: {},
        },
      },
    })
    expect(useProgressStore.getState().getModuleProgress('M03').completedTopics).toEqual(['M03.02'])
    expect(useProgressStore.getState().isModuleComplete('M03', 2)).toBe(false)
    expect(useProgressStore.getState().isModuleComplete('M03', 1)).toBe(true)
    // Original stored record preserved for possible later reconciliation.
    expect(useProgressStore.getState().moduleProgress.M03.completedTopics).toEqual(['M03.01', 'M03.02'])
  })

  it('still saves valid tested topic scores without overcounting', () => {
    const complete = useProgressStore.getState().completeTopic
    complete('M03', 'M03.01', 16, 20)
    complete('M03', 'M03.01', 18, 20)
    const state = useProgressStore.getState().getModuleProgress('M03')
    expect(state.completedTopics).toEqual(['M03.01'])
    expect(state.topicProgress['M03.01']).toMatchObject({
      completed: true,
      correctCount: 18,
      totalCount: 20,
      lastScore: 90,
    })
  })
})
