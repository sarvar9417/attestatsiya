import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PedguliEditorialModal from '../components/admin/PedguliEditorialModal'

const mocks = vi.hoisted(() => ({
  getPedguliEditorialReview: vi.fn(),
  savePedguliEditorialReview: vi.fn(),
}))
vi.mock('../features/admin/adminContentApi', () => ({
  getPedguliEditorialReview: mocks.getPedguliEditorialReview,
  savePedguliEditorialReview: mocks.savePedguliEditorialReview,
}))

const question = {
  id: '11111111-1111-4111-8111-111111111111',
  stem_md: 'Informatika darsida muammoli ta’lim qanday tashkil qilinadi?',
  source_reference: 'authored:pedguli-topic-audit:v4:PM.MET.02:306',
}

describe('Pedguli original exercise: admin editorial review', () => {
  beforeEach(() => {
    mocks.getPedguliEditorialReview.mockReset()
    mocks.savePedguliEditorialReview.mockReset()
  })

  it('does not auto-check review boxes or enable save without evidence notes', async () => {
    mocks.getPedguliEditorialReview.mockResolvedValue({
      question_id:question.id, status:'review', checks:null,
    })
    render(<PedguliEditorialModal question={question} onClose={vi.fn()} onSaved={vi.fn()}/>)
    expect(await screen.findByText(/To‘g‘ri javob tasdiqlandi/)).toBeInTheDocument()
    const boxes=screen.getAllByRole('checkbox')
    expect(boxes).toHaveLength(4)
    boxes.forEach(b => expect(b).not.toBeChecked())
    expect(screen.getByRole('button',{name:'Tekshiruvni saqlash'})).toBeDisabled()
    expect(mocks.savePedguliEditorialReview).not.toHaveBeenCalled()
  })

  it('sends explicit human checks and review notes to the admin backend', async () => {
    const user=userEvent.setup()
    mocks.getPedguliEditorialReview.mockResolvedValue({
      question_id:question.id,status:'review',checks:null,
    })
    mocks.savePedguliEditorialReview.mockResolvedValue({
      question_id:question.id, reviewed_at:'2026-10-12T10:00:00Z',
    })
    const onSaved=vi.fn()
    render(<PedguliEditorialModal question={question} onClose={vi.fn()} onSaved={onSaved}/>)
    await screen.findByText(/To‘g‘ri javob tasdiqlandi/)
    for(const checkbox of screen.getAllByRole('checkbox')) await user.click(checkbox)
    await user.type(
      screen.getByLabelText(/Tekshiruv dalillari va izoh/),
      'Darsning asosiy mavzusi va o‘quv maqsadi bo‘yicha javob mustaqil tekshirildi.',
    )
    await user.click(screen.getByRole('button',{name:'Tekshiruvni saqlash'}))
    await waitFor(()=>expect(mocks.savePedguliEditorialReview).toHaveBeenCalledWith(
      question.id,
      expect.objectContaining({
        answer_verified:true, reference_verified:true, wording_verified:true,
        original_authorship_verified:true,
      }),
    ))
    expect(onSaved).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/Savolni endi administrator nashrga tasdiqlashi mumkin/)).toBeInTheDocument()
  })

  it('never treats already-checked but partial review as approved', async () => {
    mocks.getPedguliEditorialReview.mockResolvedValue({
      question_id:question.id,status:'review',
      checks:{answer_verified:true,reference_verified:true,
        wording_verified:false,original_authorship_verified:false,
        reviewer_notes:'Javob manbasi qayta tekshirildi, matn va huquq qolmoqda.'}
    })
    render(<PedguliEditorialModal question={question} onClose={vi.fn()} onSaved={vi.fn()}/>)
    await screen.findByText(/To‘g‘ri javob tasdiqlandi/)
    expect(screen.getAllByRole('checkbox').filter(x => (x as HTMLInputElement).checked)).toHaveLength(2)
    expect(screen.getByText('Tekshiruv to‘liq yakunlanmagan')).toBeInTheDocument()
  })
})
