import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ExamPage from '../pages/ExamPage'
import type { ExamSession } from '../features/exam/contracts'
import {
  type ExamGateway, type SubmitAnswerInput,
} from '../features/exam/examGateway'
import { useProgressStore } from '../store/progressStore'

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
  const pending = new Map<string, SubmitAnswerInput>()
  const gateway: ExamGateway = {
    getPendingAnswer: vi.fn((_examId, questionId) => pending.get(questionId)?.answer),
    queueMockAnswer: vi.fn(input => { pending.set(input.questionId, input) }),
    flushQueuedAnswers: vi.fn(async examId => {
      for (const [questionId, input] of [...pending.entries()]) {
        if (input.examId !== examId) continue
        await gateway.submitAnswer(input)
        if (pending.get(questionId) === input) pending.delete(questionId)
      }
      return { remaining: [...pending.values()].filter(input => input.examId === examId).length }
    }),
    startMockExam: vi.fn().mockResolvedValue(examSession()),
    startModuleExam: vi.fn().mockResolvedValue({ ...examSession(), kind: 'bolim' }),
    startTopicExam: vi.fn().mockResolvedValue({ ...examSession(), kind: 'mavzu' }),
    startFocusedExam: vi.fn().mockResolvedValue({
      ...examSession(),
      kind: 'takrorlash',
    }),
    previewTopicTest: vi.fn().mockResolvedValue({
      questionCount: 20, durationSec: 2400,
      ready: true, available: 22, reason: 'ready', criticalObjectiveGaps: [], missingRequiredObjectives: [],
    }),
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
    getReview: vi.fn().mockResolvedValue([]),
    getResult: vi.fn(),
    getHistory: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, page_size: 20 }),
    getDueReviews: vi.fn().mockResolvedValue([]),
  }
  return gateway
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
  beforeEach(() => {
    useProgressStore.setState({ moduleProgress: {} })
  })

  it('mock Y1/Y2/Y3 javoblarini saqlash tugmasisiz avtomatik yuboradi va o‘zgartirishga ruxsat beradi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()
    renderExam(gateway)
    expect(screen.getByRole('heading', { name: 'Attestatsiya mock sinovi' })).toBeDefined()
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    expect(await screen.findByText('Yagona javobni tanlang')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Javobni saqlash' })).toBeNull()

    await user.click(screen.getByRole('button', { name: /Variant A/ }))
    await user.click(screen.getByRole('button', { name: /Variant B/ }))
    expect(gateway.queueMockAnswer).toHaveBeenLastCalledWith(expect.objectContaining({
      examId: ids.exam, examKind: 'mock', questionId: ids.question1,
      answer: expect.objectContaining({ option_id: ids.optionB, _client_revision: expect.any(Number) }),
    }))
    await user.click(screen.getByRole('button', { name: 'Keyingi' }))
    expect(await screen.findByText('Elementlarni moslang')).toBeDefined()
    await user.selectOptions(screen.getByLabelText(/Chap bir/), ids.right1)
    await user.selectOptions(screen.getByLabelText(/Chap ikki/), ids.right2)
    expect(gateway.queueMockAnswer).toHaveBeenLastCalledWith(expect.objectContaining({
      questionId: ids.question2,
      answer: expect.objectContaining({
        pairs: { [ids.left1]: ids.right1, [ids.left2]: ids.right2 },
      }),
    }))
    await user.click(screen.getByRole('button', { name: 'Keyingi' }))
    expect(await screen.findByText('Qadamlarni tartiblang')).toBeDefined()
    await user.click(screen.getAllByRole('button', { name: /— pastga/ }).find(
      button => !(button as HTMLButtonElement).disabled
    ) as HTMLButtonElement)
    expect(gateway.queueMockAnswer).toHaveBeenLastCalledWith(expect.objectContaining({
      questionId: ids.question3,
      answer: expect.objectContaining({ order: expect.arrayContaining([ids.order1, ids.order2, ids.order3]) }),
    }))
    await waitFor(() => expect(gateway.submitAnswer).toHaveBeenCalledTimes(3))
    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))
    expect(await screen.findByRole('heading', { name: 'Sinov yakunlandi' })).toBeDefined()
    expect(gateway.finishExam).toHaveBeenCalledWith(ids.exam)
  })

  it('mock oldin serverga saqlangan javobni qayta tahrirlab, oxirgisini yuboradi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()
    renderExam(gateway)
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(await screen.findByRole('button', { name: /Variant A/ }))
    await waitFor(() => expect(gateway.submitAnswer).toHaveBeenCalledTimes(1))
    expect(await screen.findByText('Saqlandi ✓')).toBeDefined()

    const otherChoice = screen.getByRole('button', { name: /Variant B/ }) as HTMLButtonElement
    expect(otherChoice.disabled).toBe(false)
    await user.click(otherChoice)
    await waitFor(() => expect(gateway.submitAnswer).toHaveBeenCalledTimes(2))
    const calls = vi.mocked(gateway.submitAnswer).mock.calls
    const first = calls[0][0].answer as { _client_revision: number }
    const last = calls[1][0].answer as { option_id: string; _client_revision: number }
    expect(last.option_id).toBe(ids.optionB)
    expect(last._client_revision).toBeGreaterThan(first._client_revision)
    expect(await screen.findByText('Saqlandi ✓')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Javobni saqlash' })).toBeNull()
  })

  it('mock internet bo‘lmasa javobni navbatda qoldiradi va qayta ulanishda yuboradi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()
    vi.mocked(gateway.flushQueuedAnswers!).mockResolvedValueOnce({
      remaining: 1, stoppedByNetwork: true,
    })
    renderExam(gateway)
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(await screen.findByRole('button', { name: /Variant B/ }))
    await waitFor(() => expect(gateway.flushQueuedAnswers).toHaveBeenCalledTimes(1))
    expect(gateway.submitAnswer).not.toHaveBeenCalled()
    await act(async () => { window.dispatchEvent(new Event('online')) })
    await waitFor(() => expect(gateway.submitAnswer).toHaveBeenCalledTimes(1))
    expect(await screen.findByText('Saqlandi ✓')).toBeDefined()
  })

  it('tayyor bo‘lmagan pedagogika mavzu testini bosishni bloklaydi', async () => {
    const gateway = successfulGateway()
    vi.mocked(gateway.previewTopicTest!).mockResolvedValue({
      questionCount: 20, durationSec: 2400, ready: false,
      available: 8, reason: 'pool_insufficient', criticalObjectiveGaps: [], missingRequiredObjectives: [],
    })
    renderExam(gateway, '/exam/mavzu/M15?lessonId=M15.01')
    expect(await screen.findByText(/8\/20 ta mos savol/)).toBeDefined()
    const button = screen.getByRole('button', { name: 'Sinovni boshlash' }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
    expect(gateway.startTopicExam).not.toHaveBeenCalled()
  })

  it('mavzu testi preflight xatosida startni fail-closed bloklaydi', async () => {
    const gateway = successfulGateway()
    vi.mocked(gateway.previewTopicTest!).mockRejectedValue(new Error('network'))
    renderExam(gateway, '/exam/mavzu/M15?lessonId=M15.01')
    expect(await screen.findByText(/tayyorligini hozir tekshirib bo‘lmadi/)).toBeDefined()
    const button = screen.getByRole('button', { name: 'Sinovni boshlash' }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
    expect(gateway.startTopicExam).not.toHaveBeenCalled()
  })

  it('savollar zaxirasi yetarli bo‘lmasa xavfsiz qayta urinish holatini beradi', async () => {
    const user = userEvent.setup()
    const gateway: ExamGateway = {
      startMockExam: vi.fn().mockRejectedValue(
        new Error('Sinovni boshlash uchun savollar bazasi hali yetarli emas.')
      ),
      startModuleExam: vi.fn(),
      startTopicExam: vi.fn(),
      submitAnswer: vi.fn(),
      finishExam: vi.fn(),
      getReview: vi.fn(),
      getResult: vi.fn(),
      getHistory: vi.fn(),
      getDueReviews: vi.fn(),
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

    renderExam(gateway, '/exam/bolim/M01')
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

  it('pedagogik 15 route mustaqil 5+7+3 sessionini boshlaydi va mockga fallback qilmaydi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()
    vi.mocked(gateway.startFocusedExam!).mockResolvedValue({
      ...examSession(),
      kind: 'pedagogik_15',
      duration_sec: 1800,
    })
    renderExam(gateway, '/exam/pedagogik_15')
    expect(screen.getByRole('heading', { name: 'Pedagogik mahorat va kasb standarti — 15 savol' })).toBeDefined()
    expect(screen.getByText('15 savol (5 + 7 + 3)')).toBeDefined()
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    expect(gateway.startFocusedExam).toHaveBeenCalledWith('pedagogik_15')
    expect(gateway.startMockExam).not.toHaveBeenCalled()
    expect(await screen.findByText('Yagona javobni tanlang')).toBeDefined()
  })

  it('modul sinovi kirish oynasi backendning 50 savol va 100 daqiqalik kontraktini ko‘rsatadi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()
    vi.mocked(gateway.startModuleExam).mockResolvedValue({
      ...examSession(),
      kind: 'bolim',
      duration_sec: 6000,
    })

    renderExam(gateway, '/exam/bolim/M10')

    expect(screen.getByRole('heading', { name: 'Modul sinovi' })).toBeDefined()
    expect(screen.getByText('50 savol')).toBeDefined()
    expect(screen.getByText('100 daqiqa')).toBeDefined()
    expect(gateway.startModuleExam).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    expect(gateway.startModuleExam).toHaveBeenCalledWith('M10')
    expect(await screen.findByText('Yagona javobni tanlang')).toBeDefined()
  })

  it('bo‘lim sinovi modul kodi bilan server gateway orqali boshlanadi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()

    renderExam(gateway, '/exam/bolim/M01')
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))

    expect(gateway.startModuleExam).toHaveBeenCalledWith('M01')
    expect(gateway.startMockExam).not.toHaveBeenCalled()
    expect(await screen.findByText('Yagona javobni tanlang')).toBeDefined()
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

  it('mavzu sinovi lessonId bilan boshlanadi va yakunida progress yoziladi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()

    renderExam(gateway, '/exam/mavzu/M01?lessonId=M01.01')

    // Intro ekranda vaqt cheklovi ko'rsatiladi (20 savol · 40 daqiqa)
    expect(await screen.findByText(/40 daqiqa/)).toBeDefined()
    expect(gateway.previewTopicTest).toHaveBeenCalledWith('M01.01')

    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))

    expect(gateway.startTopicExam).toHaveBeenCalledWith('M01.01')
    expect(gateway.startMockExam).not.toHaveBeenCalled()

    // Barcha savollarga javob berib sinovni yakunlash
    await screen.findByText('Yagona javobni tanlang')
    await user.click(screen.getByRole('button', { name: /Variant A/ }))
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))
    await screen.findByText('Elementlarni moslang')
    await user.selectOptions(screen.getByLabelText(/Chap bir/), ids.right1)
    await user.selectOptions(screen.getByLabelText(/Chap ikki/), ids.right2)
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))
    await screen.findByText('Qadamlarni tartiblang')
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))
    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))

    expect(
      await screen.findByRole('heading', { name: 'Sinov yakunlandi' })
    ).toBeDefined()

    // "Modulga qaytish" — modul sahifasiga havola
    expect(
      screen.getByRole('link', { name: 'Modulga qaytish' })
    ).toHaveAttribute('href', '/learn/M01')

    // Progress: M01.01 mavzusi 3/3 savol bilan bajarilgan deb yoziladi
    const progress = useProgressStore.getState().moduleProgress['M01']
    expect(progress?.completedTopics).toContain('M01.01')
    expect(progress?.topicProgress['M01.01']).toMatchObject({
      completed: true,
      correctCount: 3,
      totalCount: 3,
      lastScore: 100,
    })
  })

  it('diagnostika route mockga fallback qilmasdan server diagnostika sessionini boshlaydi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()
    vi.mocked(gateway.startFocusedExam!).mockResolvedValue({
      ...examSession(),
      kind: 'diagnostika',
      duration_sec: null,
    })

    renderExam(gateway, '/exam/diagnostika')
    expect(
      screen.getByRole('heading', { name: 'Boshlang‘ich diagnostika' })
    ).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))

    expect(gateway.startFocusedExam).toHaveBeenCalledWith('diagnostika')
    expect(gateway.startMockExam).not.toHaveBeenCalled()
    expect(await screen.findByText('Yagona javobni tanlang')).toBeDefined()
  })

  it('mashq route adaptive server sessionini boshlaydi va lesson scope uzatadi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()
    vi.mocked(gateway.startFocusedExam!).mockResolvedValue({
      ...examSession(),
      kind: 'mashq',
      duration_sec: null,
      selection_meta: {
        selector_version: 'adaptive-v1',
        fallback_used: false,
      },
    })

    renderExam(gateway, '/exam/mashq?lessonId=M01.01')
    expect(
      screen.getByRole('heading', { name: 'Moslashtirilgan mashq' })
    ).toBeDefined()
    expect(screen.getByText('10 savol')).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))

    expect(gateway.startFocusedExam).toHaveBeenCalledWith('mashq', 'M01.01')
    expect(gateway.startMockExam).not.toHaveBeenCalled()
    expect(await screen.findByText('Yagona javobni tanlang')).toBeDefined()
  })

  it('takrorlash route mockga fallback qilmasdan server review sessionini boshlaydi', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()

    renderExam(gateway, '/exam/takrorlash')
    expect(
      screen.getByRole('heading', { name: 'Takrorlash sinovi' })
    ).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))

    expect(gateway.startFocusedExam).toHaveBeenCalledWith('takrorlash')
    expect(gateway.startMockExam).not.toHaveBeenCalled()
    expect(await screen.findByText('Yagona javobni tanlang')).toBeDefined()
  })

  it('mavzu sinovi lessonId bo‘lmasa start tugmasi fail-closed qoladi', async () => {
    const gateway = successfulGateway()
    renderExam(gateway, '/exam/mavzu/M01')
    await screen.findByText(/tayyorligini hozir tekshirib bo‘lmadi/)
    expect((screen.getByRole('button', { name: 'Sinovni boshlash' }) as HTMLButtonElement).disabled).toBe(true)
    expect(gateway.startTopicExam).not.toHaveBeenCalled()
  })
  it('does not finish from an already-open confirmation while an answer is saving', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()
    let resolveSave!: (value: { saved: true }) => void
    vi.mocked(gateway.submitAnswer).mockImplementationOnce(() => new Promise(resolve => { resolveSave = resolve }))
    renderExam(gateway, '/exam/bolim/M01')
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(screen.getByRole('button', { name: /Variant A/ }))
    await user.click(screen.getByRole('button', { name: 'Sinovni yakunlash' }))
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))
    const confirm = screen.getByRole('button', { name: 'Yakunlash' })
    expect(confirm).toBeDisabled()
    await user.click(confirm)
    expect(gateway.finishExam).not.toHaveBeenCalled()
    await act(async () => { resolveSave({ saved: true }) })
    expect(await screen.findByText('Elementlarni moslang')).toBeDefined()
  })

  it('keeps the first offline answer locked after a background reconnect flush', async () => {
    const user = userEvent.setup()
    const gateway = successfulGateway()
    let queued: { option_id: string } | undefined
    gateway.getPendingAnswer = vi.fn(() => queued)
    vi.mocked(gateway.submitAnswer).mockImplementationOnce(async () => {
      queued = { option_id: ids.optionA }
      throw new Error('Javob qurilmada saqlandi')
    })
    renderExam(gateway, '/exam/bolim/M01')
    await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
    await user.click(screen.getByRole('button', { name: /Variant A/ }))
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))
    await screen.findByText('Javob qurilmada saqlandi')
    // Reconnect already delivered A, so the queue is now empty. The UI must
    // still prevent changing to B before obtaining the idempotent receipt.
    queued = undefined
    expect(screen.getByRole('button', { name: /Variant B/ })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))
    expect(gateway.submitAnswer).toHaveBeenLastCalledWith(expect.objectContaining({ answer: { option_id: ids.optionA } }))
    expect(await screen.findByText('Elementlarni moslang')).toBeDefined()
  })

  it('waits for an in-flight save before automatic timeout finalization', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    const now = Date.now()
    const clock = vi.spyOn(Date, 'now').mockReturnValue(now)
    try {
      const user = userEvent.setup()
      const gateway = successfulGateway()
      vi.mocked(gateway.startModuleExam).mockResolvedValue({ ...examSession(), kind: 'bolim',
        started_at: new Date(now).toISOString(), duration_sec: 1 })
      let resolveSave!: (value: { saved: true }) => void
      vi.mocked(gateway.submitAnswer).mockImplementationOnce(() => new Promise(resolve => { resolveSave = resolve }))
      renderExam(gateway, '/exam/bolim/M01')
      await user.click(screen.getByRole('button', { name: 'Sinovni boshlash' }))
      await user.click(screen.getByRole('button', { name: /Variant A/ }))
      await user.click(screen.getByRole('button', { name: 'Javobni saqlash' }))
      clock.mockReturnValue(now + 1500)
      act(() => { vi.advanceTimersByTime(1000) })
      expect(gateway.finishExam).not.toHaveBeenCalled()
      await act(async () => { resolveSave({ saved: true }) })
      expect(await screen.findByRole('heading', { name: 'Sinov yakunlandi' })).toBeDefined()
      expect(gateway.finishExam).toHaveBeenCalledTimes(1)
    } finally {
      clock.mockRestore()
      vi.useRealTimers()
    }
  })

})
