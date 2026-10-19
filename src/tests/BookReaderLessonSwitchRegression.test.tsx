import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import TopicView from '../components/learning/TopicView'

vi.mock('../features/content/contentApi', () => ({
  getTopicTestPreflight: vi.fn(async () => { throw new Error('not needed for theory navigation') }),
  getLessonDetail: vi.fn(async () => { throw new Error('not needed for local pedagogy theory') }),
}))
vi.mock('../features/content/lessonContentGateway', () => ({
  getLessonTestQuestions: vi.fn(async () => []),
  checkQuestionAnswer: vi.fn(async () => { throw new Error('not called') }),
}))
vi.mock('../lib/progressSync', () => ({
  syncTopicProgress: vi.fn(async () => undefined),
}))

const lesson = (subtopicId: string, subtopicIndex: number) => (
  <MemoryRouter initialEntries={['/learn/M15']}>
    <TopicView
      moduleId="M15"
      moduleTitle="Pedagogika"
      subtopicId={subtopicId}
      subtopicIndex={subtopicIndex}
      subtopicCount={8}
      onComplete={vi.fn()}
      onBack={vi.fn()}
    />
  </MemoryRouter>
)

describe('book reader: switching lessons after reading a long chapter', () => {
  it('starts the next, shorter lesson on its first section without an out-of-range crash', async () => {
    const user = userEvent.setup()
    const { rerender } = render(lesson('M15.08', 7))
    await screen.findByRole('navigation', { name: 'Bo‘limlar orasida harakat' })
    const oldTabs = screen.getAllByRole('tab')
    expect(oldTabs.length).toBeGreaterThan(3)

    // Reproduce the stale high index left by an extensively paginated lesson.
    await user.click(oldTabs[oldTabs.length - 1])
    expect(oldTabs[oldTabs.length - 1]).toHaveAttribute('aria-selected', 'true')

    // A parent route can reuse TopicView for another subtopic of the same module.
    // BookReader must not first render an obsolete, out-of-bounds section index.
    rerender(lesson('M15.02', 1))
    await screen.findByRole('navigation', { name: 'Bo‘limlar orasida harakat' })
    const newTabs = screen.getAllByRole('tab')
    expect(newTabs.length).toBeLessThan(oldTabs.length)
    expect(newTabs[0]).toHaveAttribute('aria-selected', 'true')
    for (const tab of newTabs.slice(1)) {
      expect(tab).toHaveAttribute('aria-selected', 'false')
    }
  })
})
