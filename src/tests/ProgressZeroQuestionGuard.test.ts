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
