import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import TopicView from '../components/learning/TopicView'

vi.mock('../features/content/contentApi', () => ({
  getTopicTestPreflight: vi.fn(async () => { throw new Error('API temporarily offline') }),
  getLessonDetail: vi.fn(async () => { throw new Error('not needed for static M11') }),
}))
vi.mock('../features/content/lessonContentGateway', () => ({
  getLessonTestQuestions: vi.fn(async () => []),
  checkQuestionAnswer: vi.fn(async () => { throw new Error('not called') }),
}))
vi.mock('../lib/progressSync', () => ({
  syncTopicProgress: vi.fn(async () => undefined),
}))

describe('M11 legacy theory navigation regression', () => {
  it('offers 1/2 → 2/2 pages and a next TOPIC even when test readiness API fails', async () => {
    const user = userEvent.setup()
    const onOpenTopic = vi.fn()
    const onComplete = vi.fn()

    render(
      <MemoryRouter initialEntries={['/learn/M11']}>
        <Routes>
          <Route path="/learn/M11" element={
            <TopicView moduleId="M11" moduleTitle="HTML"
              subtopicId="M11.02" subtopicIndex={1} subtopicCount={7}
              onComplete={onComplete} onBack={vi.fn()}
              previousSubtopic={{ id: 'M11.01', title: 'HTML asoslari' }}
              nextSubtopic={{ id: 'M11.03', title: 'HTML jadval va forma' }}
              onOpenTopic={onOpenTopic}
            />
          } />
        </Routes>
      </MemoryRouter>,
    )

    const navigation = screen.getByRole('navigation', { name: 'Nazariya sahifalari' })
    expect(within(navigation).getByText('1/2 sahifa')).toBeInTheDocument()
    expect(within(navigation).getByRole('button', { name: /Oldingi sahifa/ })).toBeDisabled()

    await waitFor(() =>
      expect(screen.getByText(/Test serveriga ulanib bo‘lmadi/)).toBeInTheDocument()
    )
    expect(screen.queryByText('Bu mavzu uchun test hali qo‘shilmagan')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mavzuni yakunlash' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Keyingi sahifa \(2\/2\)/ }))
    expect(within(navigation).getByText('2/2 sahifa')).toBeInTheDocument()
    expect(within(navigation).getByRole('button', { name: /Keyingi sahifa/ })).toBeDisabled()
    expect(screen.getByText(/Nazariyaning barcha 2 sahifasi ko‘rsatildi/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Keyingi mavzu: HTML jadval va forma/ }))
    expect(onOpenTopic).toHaveBeenCalledWith('M11.03')
    expect(onComplete).not.toHaveBeenCalled()
  })
})
