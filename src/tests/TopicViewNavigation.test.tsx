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

describe('M11 unified book theory navigation regression', () => {
  it('uses M01-style sections and a next TOPIC even when test readiness API fails', async () => {
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

    const navigation = await screen.findByRole('navigation', { name: 'Bo‘limlar orasida harakat' })
    // The sourced M11 chapter now has more sections than its old four-block summary.
    const sectionCount = screen.getAllByRole('tab').length
    expect(sectionCount).toBeGreaterThan(2)
    expect(screen.getByText(`/${sectionCount} bo‘lim`)).toBeInTheDocument()
    expect(screen.getByText('HTML da matn elementlari: paragraf, sarlavha, formatlash teglari (qalin, kursiv, tagiga chizish). Fon — sahifa yoki element orqa foni.')).toBeInTheDocument()

    await waitFor(() =>
      expect(screen.getByText(/Test serveriga ulanib bo‘lmadi/)).toBeInTheDocument()
    )
    expect(screen.queryByRole('button', { name: 'Mavzuni yakunlash' })).not.toBeInTheDocument()

    for (let index = 1; index < sectionCount; index++) {
      await user.click(within(navigation).getByRole('button', { name: /Keyingi/i }))
    }
    expect(screen.getByText(/o‘qib bo‘lindi/)).toBeInTheDocument()
    expect(screen.getByText(/Cambridge\+ 9-sinf/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /test tayyorligi kutilmoqda/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /Oldingi mavzu/ }))
    expect(onOpenTopic).toHaveBeenCalledWith('M11.01')
    onOpenTopic.mockClear()

    await user.click(screen.getByRole('button', { name: /Keyingi mavzu: HTML jadval va forma/ }))
    expect(onOpenTopic).toHaveBeenCalledWith('M11.03')
    expect(onComplete).not.toHaveBeenCalled()
  })
})
