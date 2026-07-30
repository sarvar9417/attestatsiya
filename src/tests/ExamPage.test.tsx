import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ExamPage from '../pages/ExamPage'
import type { ExamSession } from '../features/exam/contracts'
import {
  ExamGatewayError,
  type ExamGateway,
} from '../features/exam/examGateway'

const ids = {
  exam: '00000000-0000-4000-8000-000000000001',
  item1: '00000000-0000-4000-8000-000000000011',
  item2: '00000000-0000-4000-8000-000000000012',
  item3: '00000000-0000-4000-8000-000000000013',
  question1: '00000000-0000-4000-8000-000000000021',
  question2: '00000000-0000-4000-8000-000000000022',
  question3: '00000000-0000-4000-8000-000000000023',
  optionA: '00000000-0000-4000-8000-000000000031',
  optionB: '00000000-0000-4000-8000-000000000032',
  left1: '00000000-0000-4000-8000-000000000041',
  left2: '00000000-0000-4000-8000-000000000042',
  right1: '00000000-0000-4000-8000-000000000043',
  right2: '00000000-0000-4000-8000-000000000044',
  order1: '00000000-0000-4000-8000-000000000051',
  order2: '00000000-0000-4000-8000-000000000052',
  order3: '00000000-0000-4000-8000-000000000053',
} as const

function examSession(): ExamSession {
  return {
    exam_id: ids.exam,
    kind: 'mock',
    duration_sec: 7200,
    started_at: new Date().toISOString(),
    items: [
      {
        item_id: ids.item1,
        order_idx: 1,
        question_id: ids.question1,
        format: 'Y1',
        stem_md: 'Yagona javobni tanlang',
        assets: [],
        options: [
          { id: ids.optionA, side: 'a', content_md: 'Variant A' },
          { id: ids.optionB, side: 'a', content_md: 'Variant B' },
        ],
      },
      {
        item_id: ids.item2,
        order_idx: 2,
        question_id: ids.question2,
        format: 'Y2',
        stem_md: 'Elementlarni moslang',
        assets: [],
        options: [
          { id: ids.left1, side: 'a', content_md: 'Chap bir' },
          { id: ids.left2, side: 'a', content_md: 'Chap ikki' },
          { id: ids.right1, side: 'b', content_md: 'O‘ng bir' },
          { id: ids.right2, side: 'b', content_md: 'O‘ng ikki' },
        ],
      },
      {
        item_id: ids.item3,
        order_idx: 3,
        question_id: ids.question3,
        format: 'Y3',
        stem_md: 'Qadamlarni tartiblang',
        assets: [],
        options: [
          { id: ids.order1, side: 'a', content_md: 'Birinchi qadam' },
          { id: ids.order2, side: 'a', content_md: 'Ikkinchi qadam' },
          { id: ids.order3, side: 'a', content_md: 'Uchinchi qadam' },
        ],
      },
    ],
  }
}

function successfulGateway(): ExamGateway {
  return {
    startMockExam: vi.fn().mockResolvedValue(examSession()),
    startModuleExam: vi.fn().mockResolvedValue(examSession()),
    startTopicExam: vi.fn().mockResolvedValue(examSession()),
    submitAnswer: vi.fn().mockResolvedValue({ saved: true }),
    finishExam: vi.fn().mockResolvedValue({
      exam_id: ids.exam,
      total_score: 6,
      max_score: 6,
      passed: null,
      breakdown: [
        {
          group_code: 'S1.INFO',
          jami: 3,
          togri: 3,
        },
      ],
      already_finished: false,
    }),
  }
}

function renderExam(gateway: ExamGateway, path = '/exam') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/exam" element={<ExamPage gateway={gateway} />} />
        <Route path="/exam/:kind" element={<ExamPage gateway={gateway} />} />
        <Route
          path="/exam/:kind/:moduleId"
          element={<ExamPage gateway={gateway} />}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('secure ExamRunner', () => {
  it('Y1/Y2/Y3 javoblarini UUID payload bilan serverga yuboradi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()

    renderExam(gateway)

    expect(
      screen.getByRole('heading', { name: 'Attestatsiya sinov imtihoni' })
    ).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))

    expect(await screen.findByText('Yagona javobni tanlang')).toBeDefined()
    expect(screen.queryByText(/to‘g‘ri javob/i)).toBeNull()
    await user.click(screen.getByRole('button', { name: /Variant B/ }))
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))

    expect(await screen.findByText('Elementlarni moslang')).toBeDefined()
    await user.selectOptions(screen.getByLabelText(/Chap bir/), ids.right1)
    await user.selectOptions(screen.getByLabelText(/Chap ikki/), ids.right2)
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))

    expect(await screen.findByText('Qadamlarni tartiblang')).toBeDefined()
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))

    await waitFor(() => {
      expect(gateway.submitAnswer).toHaveBeenCalledTimes(3)
    })

    expect(gateway.submitAnswer).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        examId: ids.exam,
        examKind: 'mock',
        questionId: ids.question1,
        answer: { option_id: ids.optionB },
      })
    )
    expect(gateway.submitAnswer).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        examKind: 'mock',
        questionId: ids.question2,
        answer: {
          pairs: {
            [ids.left1]: ids.right1,
            [ids.left2]: ids.right2,
          },
        },
      })
    )
    expect(gateway.submitAnswer).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        examKind: 'mock',
        questionId: ids.question3,
        answer: {
          order: expect.arrayContaining([
            ids.order1,
            ids.order2,
            ids.order3,
          ]),
        },
      })
    )

    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))

    expect(
      await screen.findByRole('heading', { name: 'Sinov yakunlandi' })
    ).toBeDefined()
    expect(screen.getByText('6 / 6')).toBeDefined()
    expect(gateway.finishExam).toHaveBeenCalledWith(ids.exam)
  })

  it('savollar zaxirasi yetarli bo‘lmasa xavfsiz qayta urinish holatini beradi', async () => {
    const user = userEvent.setup()
    const gateway: ExamGateway = {
      startMockExam: vi.fn().mockRejectedValue(
        new ExamGatewayError(
          'Sinovni boshlash uchun savollar bazasi hali yetarli emas.',
          'insufficient-pool'
        )
      ),
      startModuleExam: vi.fn(),
      startTopicExam: vi.fn(),
      submitAnswer: vi.fn(),
      finishExam: vi.fn(),
    }

    renderExam(gateway)
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Sinovni boshlash uchun savollar bazasi hali yetarli emas.'
    )
    expect(screen.getByRole('button', { name: 'Qayta urinish' })).toBeDefined()
  })

  it('server vaqt tugaganini aytsa sinovni idempotent yakunlaydi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()
    vi.mocked(gateway.submitAnswer).mockResolvedValue({
      error: 'vaqt_tugadi',
    })

    renderExam(gateway)
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(
      await screen.findByRole('button', { name: /Variant A/ })
    )
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))

    expect(
      await screen.findByRole('heading', { name: 'Sinov yakunlandi' })
    ).toBeDefined()
    expect(gateway.finishExam).toHaveBeenCalledTimes(1)
    expect(gateway.finishExam).toHaveBeenCalledWith(ids.exam)
  })

  it('bo‘lim ID bo‘lmasa mock sinovga yashirin fallback qilmaydi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()

    renderExam(gateway, '/exam/bolim')
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Bo‘lim sinovi uchun modul identifikatori topilmadi.'
    )
    expect(gateway.startMockExam).not.toHaveBeenCalled()
    expect(gateway.startModuleExam).not.toHaveBeenCalled()
  })
})
