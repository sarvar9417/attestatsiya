import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ExamPage from '../pages/ExamPage'
import type { ExamSession } from '../features/exam/contracts'
import type { ExamGateway } from '../features/exam/examGateway'

const ids = {
  exam: '20000000-0000-4000-8000-000000000001',
  item1: '20000000-0000-4000-8000-000000000011',
  item2: '20000000-0000-4000-8000-000000000012',
  question1: '20000000-0000-4000-8000-000000000021',
  question2: '20000000-0000-4000-8000-000000000022',
  optionA: '20000000-0000-4000-8000-000000000031',
  optionB: '20000000-0000-4000-8000-000000000032',
} as const

function item(
  itemId: string,
  questionId: string,
  orderIdx: number,
  stem: string
): ExamSession['items'][number] {
  return {
    item_id: itemId,
    order_idx: orderIdx,
    question_id: questionId,
    format: 'Y1',
    stem_md: stem,
    assets: [],
    options: [
      { id: ids.optionA, side: 'a', content_md: 'Variant A' },
      { id: ids.optionB, side: 'a', content_md: 'Variant B' },
    ],
  }
}

function session(): ExamSession {
  return {
    exam_id: ids.exam,
    kind: 'mock',
    duration_sec: 7200,
    started_at: new Date().toISOString(),
    items: [
      item(ids.item1, ids.question1, 1, 'Birinchi savol'),
      item(ids.item2, ids.question2, 2, 'Ikkinchi savol'),
    ],
  }
}

function gateway(): ExamGateway {
  return {
    startMockExam: vi.fn().mockResolvedValue(session()),
    startModuleExam: vi.fn().mockResolvedValue(session()),
    startTopicExam: vi.fn().mockResolvedValue(session()),
    submitAnswer: vi.fn().mockResolvedValue({ saved: true }),
    finishExam: vi.fn().mockResolvedValue({
      exam_id: ids.exam,
      total_score: 0,
      max_score: 4,
      passed: false,
      breakdown: [],
      already_finished: false,
    }),
    getReview: vi.fn().mockResolvedValue([]),
    getHistory: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, page_size: 20 }),
    getDueReviews: vi.fn().mockResolvedValue([]),
  }
}

function renderMock(examGateway: ExamGateway) {
  return render(
    <MemoryRouter initialEntries={['/exam/mock']}>
      <Routes>
        <Route path="/exam/:kind" element={<ExamPage gateway={examGateway} />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('T-015 mock timer, navigator va flag', () => {
  it('savol flagini navigator bo‘ylab saqlaydi va scoringga yubormaydi', async () => {
    const user = userEvent.setup()
    const examGateway = gateway()

    renderMock(examGateway)
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))

    expect(await screen.findByText('Birinchi savol')).toBeDefined()
    expect(screen.getByText('Qolgan vaqt')).toBeDefined()
    expect(screen.getByText('Nomzod ma’lumotlari')).toBeDefined()
    expect(screen.getByText('Savollar navigatsiyasi')).toBeDefined()
    expect(screen.getByText('Javob berilgan')).toBeDefined()
    expect(screen.getByText('Joriy savol')).toBeDefined()
    expect(screen.getByText('Javob berilmagan')).toBeDefined()
    expect(
      screen.getByRole('button', { name: 'Rang mavzusini almashtirish' })
    ).toBeDefined()
    expect(
      screen.getAllByRole('button', { name: 'Sinovni yakunlash' }).length
    ).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Savol 1' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Savol 2' })).toBeDefined()

    const flagFirst = screen.getByRole('button', {
      name: 'Savolni keyin ko‘rish uchun belgilash',
    })
    await user.click(flagFirst)

    expect(
      screen.getByRole('button', { name: 'Savoldan belgini olib tashlash' })
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Belgilangan: 1')).toBeDefined()
    expect(
      screen.getByRole('button', {
        name: /Savol 1.*keyin ko‘rish uchun belgilangan/,
      })
    ).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Keyingi' }))
    expect(await screen.findByText('Ikkinchi savol')).toBeDefined()

    await user.click(
      screen.getByRole('button', {
        name: 'Savolni keyin ko‘rish uchun belgilash',
      })
    )
    expect(screen.getByText('Belgilangan: 2')).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Oldingi' }))
    expect(await screen.findByText('Birinchi savol')).toBeDefined()
    await user.click(
      screen.getByRole('button', { name: 'Savoldan belgini olib tashlash' })
    )
    expect(screen.getByText('Belgilangan: 1')).toBeDefined()

    expect(examGateway.submitAnswer).not.toHaveBeenCalled()
  })
})
