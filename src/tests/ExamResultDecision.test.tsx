import { act, render, screen } from '@testing-library/react'
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
  let pendingAnswer: unknown
  return {
    getPendingAnswer: () => pendingAnswer as { option_id: string } | undefined,
    queueMockAnswer: vi.fn(input => { pendingAnswer = input.answer }),
    flushQueuedAnswers: vi.fn(async () => {
      pendingAnswer = undefined
      return { remaining: 0 }
    }),
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
    getResult: vi.fn(),
    getHistory: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, page_size: 20 }),
    getDueReviews: vi.fn().mockResolvedValue([]),
  }
}

function renderMock(examGateway: ExamGateway, route = '/exam/mock') {
  return render(
    <MemoryRouter initialEntries={[route]}>
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
    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))

    expect(
      await screen.findByRole('heading', { name: 'Sinov yakunlandi' })
    ).toBeDefined()

    expect(screen.getByText('2 / 2')).toBeDefined()
    expect(screen.getByText('Ball: olingan / maksimal')).toBeDefined()
    expect(screen.getByText('1 / 1 ta savol to‘g‘ri')).toBeDefined()
    expect(screen.getByText('100% natija')).toBeDefined()
    expect(screen.getByRole('link', { name: 'Bo‘limga qaytish' }).getAttribute('href')).toBe('/learn')
    expect(screen.getByRole('link', { name: 'Bosh sahifa' }).getAttribute('href')).toBe('/')

    // 100% bo'lsa ham server passed=false bergani uchun frontend qarorni
    // qayta hisoblamaydi.
    expect(screen.getByText('Natijani mustahkamlash kerak')).toBeDefined()

    expect(screen.getByText('Guruhlar kesimi')).toBeDefined()
    expect(screen.getByText('S1.INFO')).toBeDefined()
    expect(screen.getByText('1 / 1')).toBeDefined()
    expect(examGateway.finishExam).toHaveBeenCalledWith(ids.exam)
  })

  it('pedagogik 15 natijada 30 ball va 15 savolni adashtirmaydi hamda qaytish yo‘lini ko‘rsatadi', async () => {
    const user = userEvent.setup()
    const examGateway = gateway()
    const baseSession = session()
    examGateway.startFocusedExam = vi.fn().mockResolvedValue({
      ...baseSession,
      kind: 'pedagogik_15',
      duration_sec: 1800,
      items: Array.from({ length: 15 }, (_, index) => ({
        ...baseSession.items[0],
        order_idx: index + 1,
        item_id: `10000000-0000-4000-8000-${String(index + 100).padStart(12, '0')}`,
        question_id: `10000000-0000-4000-8000-${String(index + 200).padStart(12, '0')}`,
      })),
    })
    examGateway.finishExam = vi.fn().mockResolvedValue({
      exam_id: ids.exam,
      total_score: 30,
      max_score: 30,
      passed: null,
      breakdown: [
        { group_code: 'KS', jami: 5, togri: 5 },
        { group_code: 'PM.GEN', jami: 7, togri: 7 },
        { group_code: 'PM.MET', jami: 3, togri: 3 },
      ],
      already_finished: false,
    })

    renderMock(examGateway, '/exam/pedagogik_15')
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(await screen.findByRole('button', { name: /Variant A/ }))
    await screen.findByText('Avtomatik saqlandi ✓')
    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))
    await user.click(screen.getByRole('button', { name: 'Yakunlash' }))

    expect(await screen.findByRole('heading', { name: 'Sinov yakunlandi' })).toBeDefined()
    expect(screen.getByText('30 / 30')).toBeDefined()
    expect(screen.getByText('Ball: olingan / maksimal')).toBeDefined()
    expect(screen.getByText('15 / 15 ta savol to‘g‘ri')).toBeDefined()
    expect(screen.getByText('100% natija')).toBeDefined()
    const returnLinks = screen.getAllByRole('link', { name: 'Pedagogik mashqlarga qaytish' })
    expect(returnLinks.length).toBeGreaterThan(0)
    expect(returnLinks[0].getAttribute('href')).toBe('/professional-practice')
    expect(screen.getByRole('link', { name: 'Bosh sahifa' }).getAttribute('href')).toBe('/')
  })

  it('finalized sinovdan keyin server reviewini ochadi va next actionlarni ko‘rsatadi', async () => {
    const user = userEvent.setup()
    const examGateway = gateway()
    examGateway.getReview = vi.fn().mockResolvedValue([
      {
        order_idx: 1,
        stem_md: 'Natija qarori testi',
        format: 'Y1',
        options: [
          { id: ids.optionA, side: 'a', content_md: 'Variant A' },
          { id: ids.optionB, side: 'a', content_md: 'Variant B' },
        ],
        assets: [],
        construct: 'S1.INFO.01',
        user_answer: { option_id: ids.optionA },
        is_correct: false,
        key: { option_id: ids.optionB },
        explanation_md: 'Axborot hajmini bit va bayt nisbatida tekshiring.',
      },
    ])

    renderMock(examGateway)

    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(await screen.findByRole('button', { name: /Variant A/ }))
    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))

    expect(
      await screen.findByRole('heading', { name: 'Sinov yakunlandi' })
    ).toBeDefined()
    expect(screen.getByRole('link', { name: /Xatolarni qayta ishlash/ })).toBeDefined()
    expect(screen.getByRole('link', { name: /Natijalar tarixi/ })).toBeDefined()
    expect(examGateway.getReview).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /Tahlilni ochish/ }))

    expect(await screen.findByText('S1.INFO.01')).toBeDefined()
    expect(screen.getByText('Xato')).toBeDefined()
    expect(screen.getByText('Variant A').closest('[data-answer-state]')?.getAttribute('data-answer-state')).toBe('wrong')
    expect(screen.getByText('Variant B').closest('[data-answer-state]')?.getAttribute('data-answer-state')).toBe('correct')
    expect(
      screen.getByText(/Axborot hajmini bit va bayt nisbatida tekshiring/)
    ).toBeDefined()
    expect(examGateway.getReview).toHaveBeenCalledWith(ids.exam)
  })
  it('does not invent a passing decision when the practice server returns null even at 100%', async () => {
    const user = userEvent.setup()
    const examGateway = gateway()
    examGateway.startFocusedExam = vi.fn().mockResolvedValue({
      ...session(),
      kind: 'pedagogik_15',
      duration_sec: 1800,
    })
    vi.mocked(examGateway.finishExam).mockResolvedValue({
      exam_id: ids.exam,
      total_score: 2,
      max_score: 2,
      passed: null,
      breakdown: [{ group_code: 'PM.GEN', jami: 1, togri: 1 }],
      already_finished: false,
    })

    renderMock(examGateway, '/exam/pedagogik_15')
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(await screen.findByRole('button', { name: /Variant A/ }))
    await screen.findByText('Avtomatik saqlandi ✓')
    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))

    expect(await screen.findByRole('heading', { name: 'Sinov yakunlandi' })).toBeDefined()
    expect(screen.getByText('100% natija')).toBeDefined()
    expect(screen.getByText('Mashq natijasi hisoblandi')).toBeDefined()
    expect(screen.queryByText('Natija talab darajasida')).toBeNull()
    expect(screen.queryByText('Natijani mustahkamlash kerak')).toBeNull()
    expect(examGateway.startFocusedExam).toHaveBeenCalledWith('pedagogik_15')
  })

  it('does not fabricate a pass verdict for an ungraded mock either', async () => {
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

    renderMock(examGateway)
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(await screen.findByRole('button', { name: /Variant A/ }))
    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))

    expect(await screen.findByText('Baholash qarori mavjud emas')).toBeDefined()
    expect(screen.queryByText('Natija talab darajasida')).toBeNull()
  })


  it('does not update an unmounted runner when auto-sync rejects late', async () => {
    const user = userEvent.setup()
    const examGateway = gateway()
    let rejectSync: ((reason: Error) => void) | undefined
    examGateway.flushQueuedAnswers = vi.fn(() => new Promise<{ remaining: number }>((_, reject) => {
      rejectSync = reject
    }))

    const view = renderMock(examGateway)
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await screen.findByRole('button', { name: /Variant A/ })
    expect(examGateway.flushQueuedAnswers).toHaveBeenCalled()

    view.unmount()
    await act(async () => {
      rejectSync?.(new Error('network offline after navigation'))
    })
    expect(examGateway.flushQueuedAnswers).toHaveBeenCalledTimes(1)
  })

})
