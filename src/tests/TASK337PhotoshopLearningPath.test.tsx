import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ModulePage from '../pages/ModulePage'
import { MODULES } from '../data/contentTree'
import { mergeCatalog } from '../features/content/catalog'
import { getTopicContent } from '../data/topicContent'
import { M10_PHOTOSHOP_PRACTICAL_LABS, PHOTOSHOP_STUDY_STAGES } from '../data/topics/m10PhotoshopLearningPath'

const mocks = vi.hoisted(() => ({
  topicView: vi.fn(),
}))

vi.mock('../hooks/useCatalog', () => ({
  useCatalog: () => ({ modules: mergeCatalog(MODULES, []), loading: false, online: false }),
}))

vi.mock('../store/progressStore', () => ({
  useProgressStore: () => ({
    getModuleProgress: () => ({
      completedTopics: [], topicProgress: {}, mockExamScore: null,
      mockExamCompleted: false, mockExamAnswers: {},
    }),
    completeTopic: vi.fn(),
  }),
}))

vi.mock('../components/learning/TopicView', () => ({
  default: (props: { subtopicId: string }) => {
    mocks.topicView(props)
    return <div>Dars ochildi: {props.subtopicId}</div>
  },
}))

describe('TASK-337: Adobe Photoshop darslik o‘quv yo‘li', () => {
  it('shows all three discoverable Photoshop chapters and opens the original BookReader topic', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/learn/M10']}>
        <Routes>
          <Route path="/learn/:moduleId" element={<ModulePage />} />
          <Route path="/learn" element={<div>Learning</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('region', { name: 'Adobe Photoshop bo‘yicha o‘quv yo‘li' })).toBeDefined()
    expect(screen.getByText('7-sinf: 13-dars, 50–56-betlar')).toBeDefined()
    expect(screen.getByText('7-sinf: 14–15-darslar, 57–66-betlar')).toBeDefined()
    expect(screen.getByText('7-sinf: 17–18-darslar, 67–79-betlar')).toBeDefined()

    await user.click(screen.getByRole('button', { name: /1\. Photoshop interfeysi va asboblari/ }))
    expect(await screen.findByText('Dars ochildi: M10.02')).toBeDefined()
    expect(mocks.topicView).toHaveBeenCalledWith(expect.objectContaining({ subtopicId: 'M10.02' }))
  })

  it('maps the official graphics/photo curriculum to the same three authored textbook chapters', () => {
    expect(PHOTOSHOP_STUDY_STAGES.map(s => s.id)).toEqual(['M10.02', 'M10.03', 'M10.04'])
    const mod = MODULES.find(m => m.code === 'M10')!
    expect(mod.subtopics).toHaveLength(7)
    for (const stage of PHOTOSHOP_STUDY_STAGES) {
      const topic = getTopicContent(stage.id)!
      const lab = M10_PHOTOSHOP_PRACTICAL_LABS[stage.id]!
      expect(mod.subtopics.find(s => s.id === stage.id)?.title).toContain('Photoshop')
      expect(topic.title).toContain('Photoshop')
      expect(topic.kind).toBe('chapter')
      expect(topic.theory).toContainEqual(lab[0])
      expect(lab.some(b => b.type === 'solved')).toBe(true)
      expect(lab.some(b => b.type === 'task')).toBe(true)
      expect(lab.some(b => b.type === 'answers')).toBe(true)
      expect(lab.at(-1)?.content).toContain('ICT 7-sinf')
      expect(topic.theory.length).toBeGreaterThan(70)
    }
    expect(M10_PHOTOSHOP_PRACTICAL_LABS['M10.05']).toBeUndefined()
  })
})
