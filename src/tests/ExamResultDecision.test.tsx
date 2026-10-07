import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ExamPage from '../pages/ExamPage'
import type { ExamGateway } from '../features/exam/examGateway'
import type { ExamSession } from '../features/exam/contracts'

const ids = {
  exam: '10000000-0000-4000-8000-000000000001',
  item: '10000000-0000-4000-8000-000000000011',
  question: '10000000-0000-4000-8000-000000000021',
  optionA: '10000000-0000-4000-8000-000000000031',
  optionB: '10000000-0000-4000-8000-000000000032',
} as const

function session(): ExamSession {
  return {
    exam_id: ids.exam,
    kind: 'mock',
    duration_sec: 7200,
    started_at: new Date().toISOString(),
    items: [
      {
        item_id: ids.item,
        order_idx: 1,
        question_id: ids.question,
        format: 'Y1',
        stem_md: 'Natija qarori testi',
        assets: [],
        options: [
          { id: ids.optionA, side: 'a', content_md: 'Variant A' },
          { id: ids.optionB, side: 'a', content_md: 'Variant B' },
        ],
      },
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
      total_score: 2,
      max_score: 2,
      // Muhim invariant: frontend 100% natijadan o'zi pass hisoblamasligi kerak.
      // Server qarori false bo'lsa, aynan shu qaror ko'rsatiladi.
      passed: false,
      breakdown: [
        { group_code: 'S1.INFO', jami: 1, togri: 1 },
      ],
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

describe('T-014 server-authoritative natija ekrani', () => {
  it('ball, server qarori va guruh kesimini birgalikda ko‘rsatadi', async () => {
    const user = userEvent.setup()
    const examGateway = gateway()

    renderMock(examGateway)

    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(await screen.findByRole('button', { name: /Variant A/ }))
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))
    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))

    expect(
      await screen.findByRole('heading', { name: 'Sinov yakunlandi' })
    ).toBeDefined()

    expect(screen.getByText('2 / 2')).toBeDefined()
    expect(screen.getByText('100% natija')).toBeDefined()

    // 100% bo'lsa ham server passed=false bergani uchun frontend qarorni
    // qayta hisoblamaydi.
    expect(screen.getByText('Natijani mustahkamlash kerak')).toBeDefined()

    expect(screen.getByText('Guruhlar kesimi')).toBeDefined()
    expect(screen.getByText('S1.INFO')).toBeDefined()
    expect(screen.getByText('1 / 1')).toBeDefined()
    expect(examGateway.finishExam).toHaveBeenCalledWith(ids.exam)
  })
  it('passed null bo‘lsa yuqori ballga qarab client pass xulosasi chiqarmaydi va finalized reviewni ochadi', async () => {
    const user = userEvent.setup()
    const examGateway = gateway()

    vi.mocked(examGateway.finishExam).mockResolvedValue({
      exam_id: ids.exam,
      total_score: 2,
      max_score: 2,
      passed: null,
      breakdown: [{ group_code: 'S1.INFO', jami: 1, togri: 1 }],
      already_finished: false,
    })
    vi.mocked(examGateway.getReview).mockResolvedValue([
      {
        order_idx: 1,
        stem_md: 'Natija qarori testi',
        format: 'Y1',
        construct: 'Axborot hajmi',
        construct_slug: 'S1.INFO.05',
        user_answer: { option_id: ids.optionB },
        is_correct: false,
        key: { correct_option_id: ids.optionA },
        explanation_md: 'Serverdagi finalized tushuntirish',
        options: [
          { id: ids.optionA, side: 'a', content_md: 'Variant A' },
          { id: ids.optionB, side: 'a', content_md: 'Variant B' },
        ],
      },
    ])

    renderMock(examGateway)

    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(await screen.findByRole('button', { name: /Variant A/ }))
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))
    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))

    expect(await screen.findByText('Ball qayd etildi')).toBeDefined()
    expect(
      screen.getByText(/Interfeys ballga qarab o‘zi xulosa chiqarmaydi/)
    ).toBeDefined()

    await user.click(
      screen.getByRole('button', { name: 'Savollarni ko‘rib chiqish' })
    )

    expect(
      await screen.findByRole('heading', { name: 'Savollar tahlili' })
    ).toBeDefined()
    expect(examGateway.getReview).toHaveBeenCalledWith(ids.exam)

    await user.click(
      screen.getByRole('button', { name: /1-savol.*Natija qarori testi/ })
    )

    expect(await screen.findByText('Sizning javobingiz')).toBeDefined()
    expect(screen.getByText('To‘g‘ri javob')).toBeDefined()
    expect(screen.getByText('Serverdagi finalized tushuntirish')).toBeDefined()
  })

})
