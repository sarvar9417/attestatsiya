import { beforeEach, describe, expect, it, vi } from 'vitest'
import { adminContentService } from '../admin-content.service.js'

const { mockAuth, mockFrom, mockRpc } = vi.hoisted(() => ({
  mockAuth: { getUser: vi.fn() },
  mockFrom: vi.fn(),
  mockRpc: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
    auth: mockAuth,
    rpc: mockRpc,
  })),
}))

const STAFF_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const OTHER_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
const QUESTION_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
const CONSTRUCT_ID = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'

function singleRow(data: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error: null }),
  }
}

function staffProfile(role: 'editor' | 'admin') {
  return singleRow({ role })
}

describe('adminContentService publish workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.getUser.mockResolvedValue({
      data: { user: { id: STAFF_ID } },
      error: null,
    })
  })

  it('blocked admin cannot access the CMS transition service', async () => {
    mockFrom.mockReturnValueOnce(singleRow({role:'admin',is_blocked:true}))
    await expect(
      adminContentService.transitionQuestion(QUESTION_ID,'published','token'),
    ).rejects.toMatchObject({code:'FORBIDDEN',statusCode:403})
    expect(mockFrom).toHaveBeenCalledTimes(1)
  })

  it('editor review savolini to‘g‘ridan-to‘g‘ri publish qila olmaydi', async () => {
    mockFrom
      .mockReturnValueOnce(staffProfile('editor'))
      .mockReturnValueOnce(
        singleRow({
          id: QUESTION_ID,
          status: 'review',
          author_id: OTHER_ID,
          source_reference: 'ICT 11, PDF 172',
          construct_id: CONSTRUCT_ID,
        }),
      )

    await expect(
      adminContentService.transitionQuestion(QUESTION_ID, 'published', 'token'),
    ).rejects.toMatchObject({ code: 'FORBIDDEN', statusCode: 403 })
  })

  it('admin o‘zi muallif bo‘lgan review savolini publish qila olmaydi', async () => {
    mockFrom
      .mockReturnValueOnce(staffProfile('admin'))
      .mockReturnValueOnce(
        singleRow({
          id: QUESTION_ID,
          status: 'review',
          author_id: STAFF_ID,
          source_reference: 'ICT 11, PDF 172',
          construct_id: CONSTRUCT_ID,
        }),
      )

    await expect(
      adminContentService.transitionQuestion(QUESTION_ID, 'published', 'token'),
    ).rejects.toMatchObject({ code: 'FORBIDDEN', statusCode: 403 })
  })

  it('manbasiz review savoli publish qilinmaydi', async () => {
    mockFrom
      .mockReturnValueOnce(staffProfile('admin'))
      .mockReturnValueOnce(
        singleRow({
          id: QUESTION_ID,
          status: 'review',
          author_id: OTHER_ID,
          source_reference: null,
          construct_id: CONSTRUCT_ID,
        }),
      )

    await expect(
      adminContentService.transitionQuestion(QUESTION_ID, 'published', 'token'),
    ).rejects.toMatchObject({ code: 'PUBLISH_REQUIREMENTS_FAILED', statusCode: 409 })
  })

  it('javob kalitisiz review savoli publish qilinmaydi', async () => {
    mockFrom
      .mockReturnValueOnce(staffProfile('admin'))
      .mockReturnValueOnce(
        singleRow({
          id: QUESTION_ID,
          status: 'review',
          author_id: OTHER_ID,
          source_reference: 'ICT 11, PDF 172',
          construct_id: CONSTRUCT_ID,
        }),
      )
      .mockReturnValueOnce(singleRow(null))

    await expect(
      adminContentService.transitionQuestion(QUESTION_ID, 'published', 'token'),
    ).rejects.toMatchObject({ code: 'PUBLISH_REQUIREMENTS_FAILED', statusCode: 409 })
  })

  it('published savol joyida tahrirlanmaydi', async () => {
    mockFrom
      .mockReturnValueOnce(staffProfile('admin'))
      .mockReturnValueOnce(singleRow({ id: QUESTION_ID, status: 'published' }))

    await expect(
      adminContentService.updateQuestion(
        QUESTION_ID,
        {
          stem_md: 'Yangilangan matn',
          format: 'Y1',
          cognitive: 'bilish',
          difficulty: 2,
          construct_id: CONSTRUCT_ID,
          options: [
            { content_md: 'A' },
            { content_md: 'B' },
            { content_md: 'C' },
            { content_md: 'D' },
          ],
          correct_index: 0,
          explanation_md: 'Izoh',
        },
        'token',
      ),
    ).rejects.toMatchObject({ code: 'PUBLISHED_IMMUTABLE', statusCode: 409 })
  })

  it('boshqa muallifning valid review savolini admin publish qila oladi', async () => {
    const updateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: QUESTION_ID, status: 'published' },
        error: null,
      }),
    }
    const auditChain = {
      insert: vi.fn().mockResolvedValue({ error: null }),
    }

    mockFrom
      .mockReturnValueOnce(staffProfile('admin'))
      .mockReturnValueOnce(
        singleRow({
          id: QUESTION_ID,
          status: 'review',
          author_id: OTHER_ID,
          source_reference: 'ICT 11, PDF 172',
          construct_id: CONSTRUCT_ID,
        }),
      )
      .mockReturnValueOnce(singleRow({ question_id: QUESTION_ID }))
      .mockReturnValueOnce(updateChain)
      .mockReturnValueOnce(auditChain)

    await expect(
      adminContentService.transitionQuestion(QUESTION_ID, 'published', 'token'),
    ).resolves.toEqual({ id: QUESTION_ID, status: 'published' })
  })
  it('creates Y1 using one atomic RPC instead of partial option/key requests',async()=>{
    mockRpc.mockResolvedValueOnce({data:QUESTION_ID,error:null})
    mockFrom
      .mockReturnValueOnce(staffProfile('admin'))
      .mockReturnValueOnce({insert:vi.fn().mockResolvedValue({error:null})})
    const result=await adminContentService.createQuestion({
      stem_md:'Qayta aloqa nima?',format:'Y1',cognitive:'bilish',difficulty:2,
      construct_id:CONSTRUCT_ID,explanation_md:'O‘quvchi natijasini yaxshilash uchun.',
      options:[{content_md:'Bir xil maslahat'},{content_md:'Dalilli ko‘rsatma'},
        {content_md:'Qayta sanash'},{content_md:'Nazoratni oshirish'}],
      correct_index:1,
    },'token')
    expect(result).toEqual({id:QUESTION_ID})
    expect(mockRpc).toHaveBeenCalledWith('save_admin_y1_question',
      expect.objectContaining({p_question_id:null,p_correct_index:1,
        p_options:['Bir xil maslahat','Dalilli ko‘rsatma','Qayta sanash','Nazoratni oshirish']}))
    expect(mockFrom.mock.calls.map(c=>c[0])).not.toContain('question_keys')
    expect(mockFrom.mock.calls.map(c=>c[0])).not.toContain('question_options')
  })

  it('rejects Y1 RPC failure without any follow-up key or option mutation',async()=>{
    mockRpc.mockResolvedValueOnce({data:null,error:{message:'ADMIN_Y1_INVALID_OPTIONS'}})
    mockFrom
      .mockReturnValueOnce(staffProfile('admin'))
      .mockReturnValueOnce(singleRow({id:QUESTION_ID,status:'review',format:'Y1'}))
    await expect(adminContentService.updateQuestion(QUESTION_ID,{
      stem_md:'Qayta aloqa nima?',format:'Y1',cognitive:'bilish',difficulty:2,
      construct_id:CONSTRUCT_ID,explanation_md:'Izoh',
      options:[{content_md:'Yagona variant'},{content_md:'Yagona variant'},
        {content_md:'Uchinchi'},{content_md:'To‘rtinchi'}],correct_index:0,
    },'token')).rejects.toMatchObject({code:'ADMIN_Y1_VALIDATION_FAILED'})
    expect(mockFrom.mock.calls.map(c=>c[0])).not.toContain('question_keys')
    expect(mockFrom.mock.calls.map(c=>c[0])).not.toContain('question_options')
  })

  it('generic CMS must not create Y2/Y3 without a structured key',async()=>{
    mockFrom.mockReturnValueOnce(staffProfile('admin'))
    await expect(adminContentService.createQuestion({
      stem_md:'Moslashtiring',format:'Y2',cognitive:'qollash',
      difficulty:2,construct_id:CONSTRUCT_ID,explanation_md:'',
    },'token')).rejects.toMatchObject({
      code:'MULTIFORMAT_PIPELINE_REQUIRED',statusCode:400,
    })
    expect(mockFrom).toHaveBeenCalledTimes(1)
  })

  it('metadata edit of a review Y2 preserves the matching key and options',async()=>{
    const updateChain={
      update:vi.fn().mockReturnThis(),
      eq:vi.fn().mockResolvedValue({error:null}),
    }
    mockFrom
      .mockReturnValueOnce(staffProfile('admin'))
      .mockReturnValueOnce(singleRow({id:QUESTION_ID,status:'review',format:'Y2'}))
      .mockReturnValueOnce(singleRow({id:CONSTRUCT_ID,subject_id:OTHER_ID,group_code:'PM.GEN'}))
      .mockReturnValueOnce(updateChain)
      .mockReturnValueOnce({insert:vi.fn().mockResolvedValue({error:null})})
    await expect(adminContentService.updateQuestion(QUESTION_ID,{
      stem_md:'Y2 mazmuni izohli',format:'Y2',cognitive:'qollash',
      difficulty:2,construct_id:CONSTRUCT_ID,explanation_md:'',
    },'token')).resolves.toEqual({id:QUESTION_ID})
    expect(mockFrom.mock.calls.map(c=>c[0])).not.toContain('question_keys')
    expect(mockFrom.mock.calls.map(c=>c[0])).not.toContain('question_options')
  })

})
