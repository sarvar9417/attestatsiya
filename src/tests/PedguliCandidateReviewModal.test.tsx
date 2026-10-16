import { render,screen,waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach,describe,expect,it,vi} from 'vitest'
import PedguliCandidateReviewModal from '../components/admin/PedguliCandidateReviewModal'

const mocks=vi.hoisted(()=>({savePedguliCandidateReview:vi.fn()}))
vi.mock('../features/admin/pedguliCandidateApi',()=>({
  savePedguliCandidateReview:mocks.savePedguliCandidateReview,
}))

const candidate={
  id:'11111111-1111-4111-8111-111111111111',
  source_message_id:116,source_url:'https://t.me/PedMahoratGuli/116',
  source_html:'messages.html',date_local:'12.02.2025 10:01:05 UTC+05:00',
  raw_text_private:'Qaysi pedagogik faoliyat samarali? A) Namoyish B) Tajriba C) Izlanish D) Kuzatuv',
  suggested_constructs:['PM.GEN.07'],proposed_constructs:[],
  topic_suggestion_state:'unclassified' as const,topic_suggestion_evidence:[],
  media_present:false,
  key_marker_unverified:true,quality_flags:['answer_marker_not_verified'],
  review_priority:1 as const,four_options_detected:true,
  editorial_status:'needs_review' as const,rights_status:'not_cleared',
  answer_key_status:'unverified',historical_exam_claim_status:'unverified',
  review_notes:'',created_at:'2026-10-12T10:00:00Z',
}

describe('Private Telegram candidate human-review modal',()=>{
  beforeEach(()=>{mocks.savePedguliCandidateReview.mockReset()})
  it('defaults to unverified and cannot save without review evidence',()=>{
    render(<PedguliCandidateReviewModal candidate={candidate} onClose={vi.fn()} onSaved={vi.fn()}/>)
    expect(screen.getByRole('combobox',{name:'Tahririy holat'})).toHaveValue('needs_review')
    expect(screen.getByRole('combobox',{name:'Javob tekshiruvi'})).toHaveValue('unverified')
    expect(screen.getByRole('button',{name:'Tekshiruvni saqlash'})).toBeDisabled()
    expect(mocks.savePedguliCandidateReview).not.toHaveBeenCalled()
  })
  it('keeps verified disabled without independent key and reuse rights',async()=>{
    const user=userEvent.setup()
    render(<PedguliCandidateReviewModal candidate={candidate} onClose={vi.fn()} onSaved={vi.fn()}/>)
    await user.selectOptions(screen.getByRole('combobox',{name:'Tahririy holat'}),'verified')
    await user.type(screen.getByLabelText(/Tekshiruv dalillari/),
      'The teaching method was studied but the channel reuse permission remains unknown.')
    expect(screen.getByRole('button',{name:'Tekshiruvni saqlash'})).toBeDisabled()
    expect(mocks.savePedguliCandidateReview).not.toHaveBeenCalled()
  })
  it('sends staff-only needs_source review and does not publish a test',async()=>{
    const user=userEvent.setup()
    mocks.savePedguliCandidateReview.mockResolvedValue({id:candidate.id})
    const onSaved=vi.fn()
    render(<PedguliCandidateReviewModal candidate={candidate} onClose={vi.fn()} onSaved={onSaved}/>)
    await user.selectOptions(screen.getByRole('combobox',{name:'Tahririy holat'}),'needs_source')
    await user.type(screen.getByLabelText(/Tekshiruv dalillari/),
      'The option key requires a reliable didactic source and a written explanation.')
    await user.click(screen.getByRole('button',{name:'Tekshiruvni saqlash'}))
    await waitFor(()=>expect(mocks.savePedguliCandidateReview).toHaveBeenCalledWith(
      candidate.id,expect.objectContaining({
        editorial_status:'needs_source',
        answer_key_status:'unverified',rights_status:'not_cleared',
      })))
    expect(onSaved).toHaveBeenCalledTimes(1)
  })
})
