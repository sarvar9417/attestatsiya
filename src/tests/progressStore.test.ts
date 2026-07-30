import { describe, it, expect, beforeEach } from 'vitest'
import { useProgressStore } from '../store/progressStore'

describe('progressStore', () => {
  beforeEach(() => {
    useProgressStore.setState({ moduleProgress: {} })
  })

  it('getModuleProgress default qiymatlarni qaytaradi', () => {
    const progress = useProgressStore.getState().getModuleProgress('M01')
    expect(progress.completedTopics).toEqual([])
    expect(progress.topicProgress).toEqual({})
    expect(progress.mockExamScore).toBeNull()
    expect(progress.mockExamCompleted).toBe(false)
  })

  it('completeTopic topicni bajarilgan deb belgilaydi', () => {
    const { completeTopic } = useProgressStore.getState()
    completeTopic('M01', 'M01.01', 4, 5)
    const progress = useProgressStore.getState().getModuleProgress('M01')
    expect(progress.completedTopics).toContain('M01.01')
    expect(progress.topicProgress['M01.01']).toBeDefined()
    expect(progress.topicProgress['M01.01'].completed).toBe(true)
    expect(progress.topicProgress['M01.01'].correctCount).toBe(4)
    expect(progress.topicProgress['M01.01'].totalCount).toBe(5)
    expect(progress.topicProgress['M01.01'].lastScore).toBe(80)
  })

  it('completeTopic ikki marta chaqirilsa duplicate topic qo\'shilmaydi', () => {
    const { completeTopic } = useProgressStore.getState()
    completeTopic('M01', 'M01.01', 4, 5)
    completeTopic('M01', 'M01.01', 5, 5)
    const progress = useProgressStore.getState().getModuleProgress('M01')
    expect(progress.completedTopics.filter(t => t === 'M01.01').length).toBe(1)
  })

  it('setMockExamScore natijani saqlaydi', () => {
    const { setMockExamScore } = useProgressStore.getState()
    setMockExamScore('M01', 84)
    const progress = useProgressStore.getState().getModuleProgress('M01')
    expect(progress.mockExamScore).toBe(84)
    expect(progress.mockExamCompleted).toBe(true)
  })

  it('setMockExamScore ikkinchi marta chaqirilsa yangilanadi', () => {
    const { setMockExamScore } = useProgressStore.getState()
    setMockExamScore('M01', 84)
    setMockExamScore('M01', 92)
    const progress = useProgressStore.getState().getModuleProgress('M01')
    expect(progress.mockExamScore).toBe(92)
  })

  it('resetModule barcha progressni tozalaydi', () => {
    const { completeTopic, resetModule } = useProgressStore.getState()
    completeTopic('M01', 'M01.01', 4, 5)
    resetModule('M01')
    const progress = useProgressStore.getState().getModuleProgress('M01')
    expect(progress.completedTopics).toEqual([])
    expect(progress.topicProgress).toEqual({})
  })

  it('getModuleProgress ikki xil modul uchun mustaqil', () => {
    const { completeTopic, setMockExamScore } = useProgressStore.getState()
    completeTopic('M01', 'M01.01', 4, 5)
    setMockExamScore('M02', 90)
    const p1 = useProgressStore.getState().getModuleProgress('M01')
    const p2 = useProgressStore.getState().getModuleProgress('M02')
    expect(p1.completedTopics).toContain('M01.01')
    expect(p2.completedTopics).toEqual([])
    expect(p1.mockExamScore).toBeNull()
    expect(p2.mockExamScore).toBe(90)
  })
})
