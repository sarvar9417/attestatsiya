import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ModulePage from '../pages/ModulePage'

const catalogMock = vi.hoisted(() => ({
  loading: false,
  modules: [{
    id: 'M01',
    code: 'M01',
    title: 'Axborot va raqamli savodxonlik',
    description: 'M01 mavzulari',
    examQuestionCount: 3,
    subtopics: [{ id: 'M01.01', title: 'Axborot asoslari' }],
  }] as Array<{
    id: string; code: string; title: string; description: string;
    examQuestionCount: number; subtopics: { id: string; title: string }[]
  }>,
}))

vi.mock('../hooks/useCatalog', () => ({
  useCatalog: () => ({
    ...catalogMock,
    online: true,
  }),
}))

/* old-mock-replaced */

vi.mock('../store/progressStore', () => ({
  useProgressStore: () => ({
    getModuleProgress: () => ({ completedTopics: [], topicProgress: {} }),
    completeTopic: vi.fn(),
  }),
}))

vi.mock('../components/learning/TopicView', () => ({
  default: () => <div>Mavzu nazariyasi</div>,
}))

vi.mock('../pages/AxborotPracticePage', () => ({
  default: ({ embedded }: { embedded?: boolean }) => (
    <div data-testid="axb-chapter-bank" data-embedded={embedded ? 'true' : 'false'}>
      19 boblik savollar banki
    </div>
  ),
}))

function renderM01(url = '/learn/M01') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/learn/:moduleId" element={<ModulePage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('M01 / Axborot chapter navigation consolidation', () => {
  it('shows a loading status, not a false 404, for a module missing during async hydration', () => {
    catalogMock.loading = true
    catalogMock.modules = []
    try {
      renderM01('/learn/M01')
      expect(screen.getByRole('status').textContent).toMatch(/yuklanmoqda/)
      expect(screen.queryByText('Bo‘lim topilmadi')).toBeNull()
    } finally {
      catalogMock.loading = false
      catalogMock.modules = [{
        id: 'M01', code: 'M01', title: 'Axborot va raqamli savodxonlik',
        description: 'M01 mavzulari', examQuestionCount: 3,
        subtopics: [{ id: 'M01.01', title: 'Axborot asoslari' }],
      }]
    }
  })


  it('keeps the 19-chapter bank hidden until the learner opens extra practice', () => {
    renderM01()
    const opener = screen.getByRole('button', { name: /19 boblik mashqlarni ochish/ })
    expect(opener.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByTestId('axb-chapter-bank')).toBeNull()

    fireEvent.click(opener)
    expect(screen.getByRole('button', { name: /Qo‘shimcha mashqlarni yopish/ })
      .getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByTestId('axb-chapter-bank').getAttribute('data-embedded')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: /Qo‘shimcha mashqlarni yopish/ }))
    expect(screen.queryByTestId('axb-chapter-bank')).toBeNull()
  })

  it('opens the same in-module bank for old practice links', () => {
    renderM01('/learn/M01?extra=axb')
    expect(screen.getByTestId('axb-chapter-bank').getAttribute('data-embedded')).toBe('true')
    expect(screen.getByText('Axborot asoslari')).toBeDefined()
  })
})
