import Fastify from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { adminRoutes } from '../admin.js'
import { getZodIssues, sendError } from '../../lib/errors.js'

const mocks = vi.hoisted(() => ({
  dashboard: vi.fn(),
  listModules: vi.fn(),
  createModule: vi.fn(),
  listQuestions: vi.fn(),
  transitionQuestion: vi.fn(),
  getPedguliEditorialReview: vi.fn(),
  savePedguliEditorialReview: vi.fn(),
  questionEditorMeta: vi.fn(),
  questionEditor: vi.fn(),
  createQuestion: vi.fn(),
  updateQuestion: vi.fn(),
  stagePedagogyRevision: vi.fn(),
}))

vi.mock('../../services/admin-content.service.js', () => ({
  adminContentService: mocks,
}))

const pdfMocks=vi.hoisted(()=>({list:vi.fn()}))
vi.mock('../../services/pedagogy-pdf.service.js',()=>({pedagogyPdfService:pdfMocks}))

const sourceMocks = vi.hoisted(() => ({
  importBatch: vi.fn(),
  list: vi.fn(),
  review: vi.fn(),
  importStage4: vi.fn(),
}))
vi.mock('../../services/pedguli-candidate.service.js', () => ({
  pedguliCandidateService: sourceMocks,
}))

vi.mock('../../services/content-coverage.service.js', () => ({
  contentCoverageService: { getReport: vi.fn() },
}))

vi.mock('../../services/question-bank-import.service.js', () => ({
  questionBankImportService: { importBatch: vi.fn() },
}))

vi.mock('../../services/admin.service.js', () => ({
  adminService: {
    listAttempts: vi.fn(),
    getAttemptDetail: vi.fn(),
  },
}))

function makeApp() {
  const app = Fastify({ logger: false })
  app.setErrorHandler((error: unknown, _request, reply) => {
    const zodIssues = getZodIssues(error)
    if (zodIssues) {
      return reply.status(400).send({
        error: { code: 'VALIDATION_ERROR', message: 'Validation error' },
      })
    }
    return sendError(reply, error)
  })
  return app
}

describe('admin CMS backend boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('dashboard token bo‘lmasa 401 qaytaradi', async () => {
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({ method: 'GET', url: '/api/admin/dashboard' })

    expect(response.statusCode).toBe(401)
    expect(JSON.parse(response.body).error.code).toBe('TOKEN_REQUIRED')
    expect(mocks.dashboard).not.toHaveBeenCalled()
    await app.close()
  })

  it('dashboard session tokenini servicega uzatadi', async () => {
    mocks.dashboard.mockResolvedValue({
      role: 'admin',
      modules: 16,
      questions: 100,
      blueprints: 1,
      users: 3,
    })
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({
      method: 'GET',
      url: '/api/admin/dashboard',
      headers: { authorization: 'Bearer admin-token' },
    })

    expect(response.statusCode).toBe(200)
    expect(mocks.dashboard).toHaveBeenCalledWith('admin-token')
    await app.close()
  })

  it('module yaratish body sini validatsiya qilib servicega uzatadi', async () => {
    mocks.createModule.mockResolvedValue({
      id: '33333333-3333-4333-8333-333333333333',
      code: 'M17',
      title_uz: 'Yangi modul',
      summary_uz: null,
      order_idx: 17,
      slug: 'm17',
      status: 'draft',
    })
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()

    const body = {
      code: 'M17',
      title_uz: 'Yangi modul',
      subject_id: '22222222-2222-4222-8222-222222222222',
    }
    const response = await app.inject({
      method: 'POST',
      url: '/api/admin/modules',
      headers: { authorization: 'Bearer admin-token' },
      payload: body,
    })

    expect(response.statusCode).toBe(201)
    expect(mocks.createModule).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'M17', title_uz: 'Yangi modul' }),
      'admin-token',
    )
    await app.close()
  })

  it('Y1 savolda 4 variant bo‘lmasa 400 qaytaradi', async () => {
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({
      method: 'POST',
      url: '/api/admin/questions',
      headers: { authorization: 'Bearer admin-token' },
      payload: {
        stem_md: 'Savol?',
        format: 'Y1',
        cognitive: 'bilish',
        difficulty: 1,
        construct_id: '11111111-1111-4111-8111-111111111111',
        options: [{ content_md: 'A' }],
        correct_index: 0,
      },
    })

    expect(response.statusCode).toBe(400)
    expect(mocks.createQuestion).not.toHaveBeenCalled()
    await app.close()
  })

  it('status transition authenticated backend orqali bajariladi', async () => {
    mocks.transitionQuestion.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      status: 'review',
    })
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()

    const response = await app.inject({
      method: 'PATCH',
      url: '/api/admin/questions/11111111-1111-4111-8111-111111111111/status',
      headers: { authorization: 'Bearer editor-token' },
      payload: { status: 'review' },
    })

    expect(response.statusCode).toBe(200)
    expect(mocks.transitionQuestion).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      'review',
      'editor-token',
    )
    await app.close()
  })
  it('Pedguli checklist cannot be accessed without auth', async () => {
    const app=makeApp()
    await app.register(adminRoutes)
    await app.ready()
    const res=await app.inject({
      method:'GET',url:'/api/admin/questions/11111111-1111-4111-8111-111111111111/editorial'
    })
    expect(res.statusCode).toBe(401)
    expect(mocks.getPedguliEditorialReview).not.toHaveBeenCalled()
    await app.close()
  })

  it('rejects Pedguli reviewer checklist without adequate notes', async () => {
    const app=makeApp()
    await app.register(adminRoutes)
    await app.ready()
    const res=await app.inject({
      method:'PUT',url:'/api/admin/questions/11111111-1111-4111-8111-111111111111/editorial',
      headers:{authorization:'Bearer admin-token'},
      payload:{answer_verified:true,reference_verified:true,wording_verified:true,
        original_authorship_verified:true,reviewer_notes:'short'},
    })
    expect(res.statusCode).toBe(400)
    expect(mocks.savePedguliEditorialReview).not.toHaveBeenCalled()
    await app.close()
  })

  it('passes valid Pedguli reviewer attestations via authenticated backend', async () => {
    mocks.savePedguliEditorialReview.mockResolvedValue({question_id:'11111111-1111-4111-8111-111111111111'})
    const app=makeApp()
    await app.register(adminRoutes)
    await app.ready()
    const payload={
      answer_verified:true,reference_verified:true,
      wording_verified:true,original_authorship_verified:false,
      reviewer_notes:'Pedagogical reference checked, original wording requires additional review.'
    }
    const res=await app.inject({
      method:'PUT',url:'/api/admin/questions/11111111-1111-4111-8111-111111111111/editorial',
      headers:{authorization:'Bearer admin-token'},payload
    })
    expect(res.statusCode).toBe(200)
    expect(mocks.savePedguliEditorialReview).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      payload,
      'admin-token',
    )
    await app.close()
  })

  it('rejects unauthenticated candidate import and review access', async () => {
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()
    const list = await app.inject({method:'GET',url:'/api/admin/pedguli-candidates'})
    const imp = await app.inject({method:'POST',url:'/api/admin/pedguli-candidates/import',
      payload:{items:[]}})
    expect(list.statusCode).toBe(401)
    expect(imp.statusCode).toBe(401)
    expect(sourceMocks.list).not.toHaveBeenCalled()
    expect(sourceMocks.importBatch).not.toHaveBeenCalled()
    await app.close()
  })

  it('forbids spoofed Telegram links and auto-publish fields', async () => {
    const app = makeApp()
    await app.register(adminRoutes)
    await app.ready()
    const bad = await app.inject({
      method:'POST',url:'/api/admin/pedguli-candidates/import',
      headers:{authorization:'Bearer admin-token'},
      payload:{items:[{
        message_id:116,
        source_url:'https://t.me/PedMahoratGuli/999',
        source_html:'messages.html',
        date_local:'12.02.2025 10:00:00',
        raw_text_private:'Unverified text with four multiple-choice options.',
        suggested_constructs:['PM.GEN.04'],
        media_present:false,key_marker_unverified:false,
        correct_answer:'B',editorial_status:'published',
      }]},
    })
    expect(bad.statusCode).toBe(400)
    expect(sourceMocks.importBatch).not.toHaveBeenCalled()
    await app.close()
  })

  it('passes an approved shape to review-only candidate importer', async () => {
    const item = {
      message_id:116,
      source_url:'https://t.me/PedMahoratGuli/116',
      source_html:'messages.html',
      date_local:'12.02.2025 10:00:00',
      raw_text_private:'Pedagogik ta’lim jarayoniga oid yangi test savoli va variantlari.',
      suggested_constructs:['PM.GEN.04'], media_present:false,
      key_marker_unverified:true,
    }
    sourceMocks.importBatch.mockResolvedValue({
      submitted:1,unique_in_batch:1,inserted:1,
      already_present_or_duplicate:0,status:'needs_review',published:0,
    })
    const app=makeApp()
    await app.register(adminRoutes)
    await app.ready()
    const result=await app.inject({method:'POST',url:'/api/admin/pedguli-candidates/import',
      headers:{authorization:'Bearer admin-token'},payload:{items:[item]}})
    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body).published).toBe(0)
    expect(sourceMocks.importBatch).toHaveBeenCalledWith('admin-token',[item])
    await app.close()
  })

  it('candidate review requires login and a complete evidence payload',async()=>{
    const app=makeApp()
    await app.register(adminRoutes)
    await app.ready()
    const id='11111111-1111-4111-8111-111111111111'
    const noAuth=await app.inject({method:'PATCH',
      url:'/api/admin/pedguli-candidates/'+id+'/review',
      payload:{editorial_status:'verified'}})
    expect(noAuth.statusCode).toBe(401)
    const invalid=await app.inject({
      method:'PATCH',url:'/api/admin/pedguli-candidates/'+id+'/review',
      headers:{authorization:'Bearer admin-token'},
      payload:{
        editorial_status:'verified',rights_status:'not_cleared',
        answer_key_status:'unverified',historical_exam_claim_status:'unverified',
        suggested_constructs:[],review_notes:'Should not pass without evidence even if long enough for notes.'
      }
    })
    expect(invalid.statusCode).toBe(400)
    expect(sourceMocks.review).not.toHaveBeenCalled()
    await app.close()
  })

  it('review-only candidate moderation sends no answer key or learner publication action',async()=>{
    const app=makeApp()
    await app.register(adminRoutes)
    await app.ready()
    const id='11111111-1111-4111-8111-111111111111'
    const input={
      editorial_status:'needs_source',
      rights_status:'not_cleared',
      answer_key_status:'unverified',
      historical_exam_claim_status:'not_claimed',
      suggested_constructs:['PM.GEN.07'],
      review_notes:'The Telegram answer is not independently supported by the cited material.',
    }
    sourceMocks.review.mockResolvedValue({id,editorial_status:'needs_source'})
    const res=await app.inject({
      method:'PATCH',url:'/api/admin/pedguli-candidates/'+id+'/review',
      headers:{authorization:'Bearer admin-token'},payload:input
    })
    expect(res.statusCode).toBe(200)
    expect(sourceMocks.review).toHaveBeenCalledWith('admin-token',id,input)
    expect(res.json()).not.toHaveProperty('correct_option_id')
    expect(res.json()).not.toHaveProperty('question_id')
    await app.close()
  })

  it('private stage4 import blocks unauthenticated and auto-published payloads',async()=>{
    const app=makeApp()
    await app.register(adminRoutes);await app.ready()
    const url='/api/admin/pedguli-candidates/stage4'
    const noAuth=await app.inject({method:'POST',url,
      payload:{topics:[],answer_references:[]}})
    expect(noAuth.statusCode).toBe(401)
    const bad=await app.inject({method:'POST',url,
      headers:{authorization:'Bearer admin-token'},
      payload:{topics:[{telegram_message_id:127,suggested_construct:'KS.03',
        suggestion_mode:'model_low_margin',model_margin:0.3,
        second_choice:'PM.GEN.02',source_scope_warning:'Needs human review',
        published:true}],answer_references:[]}})
    expect(bad.statusCode).toBe(400)
    expect(sourceMocks.importStage4).not.toHaveBeenCalled()
    await app.close()
  })

  it('stage4 admin-only endpoint handles a bounded source-research batch without public keys',async()=>{
    const app=makeApp()
    await app.register(adminRoutes);await app.ready()
    const url='/api/admin/pedguli-candidates/stage4'
    const body={topics:[{
      telegram_message_id:5636,suggested_construct:'',suggestion_mode:'media_blocked',
      model_margin:0.01,second_choice:'PM.GEN.02',
      source_scope_warning:'Missing original image. No correct topic assigned.'
    }],answer_references:[]}
    sourceMocks.importStage4.mockResolvedValue({
      topic_suggestions_saved:1,private_source_comparisons_saved:0,
      expert_approved:0,published:0,permissions_confirmed:0
    })
    const res=await app.inject({method:'POST',url,
      headers:{authorization:'Bearer admin-token'},payload:body})
    expect(res.statusCode).toBe(200)
    expect(res.json().published).toBe(0)
    expect(sourceMocks.importStage4).toHaveBeenCalledWith('admin-token',body)
    await app.close()
  })

  it('private PDF source queue rejects anonymous, pages and validates filters', async () => {
    const app=makeApp()
    await app.register(adminRoutes); await app.ready()
    const uri='/api/admin/pedagogy-pdf-candidates'
    expect((await app.inject({method:'GET',url:uri})).statusCode).toBe(401)
    expect((await app.inject({method:'GET',url:uri+'?page_size=800',
      headers:{authorization:'Bearer admin-token'}})).statusCode).toBe(400)
    pdfMocks.list.mockResolvedValue({items:[],total:649,page:2,page_size:20})
    const response=await app.inject({method:'GET',
      url:uri+'?page=2&page_size=20&status=verified&source_year=2025&unlinked_only=true',
      headers:{authorization:'Bearer admin-token'}})
    expect(response.statusCode).toBe(200)
    expect(response.headers['cache-control']).toBe('private, no-store')
    expect(response.json().total).toBe(649)
    expect(pdfMocks.list).toHaveBeenCalledWith('admin-token',{
      page:2,page_size:20,status:'verified',source_year:2025,unlinked_only:true,
    })
    await app.close()
  })

  it('only authenticated CMS calls can stage a new review revision',async()=>{
    const app=makeApp()
    await app.register(adminRoutes);await app.ready()
    const id='11111111-1111-4111-8111-111111111111'
    const uri='/api/admin/questions/'+id+'/stage-revision'
    expect((await app.inject({method:'POST',url:uri})).statusCode).toBe(401)
    expect((await app.inject({method:'POST',
      url:'/api/admin/questions/not-a-uuid/stage-revision',
      headers:{authorization:'Bearer admin-token'}})).statusCode).toBe(400)
    mocks.stagePedagogyRevision.mockResolvedValue({id:'22222222-2222-4222-8222-222222222222',status:'review'})
    const result=await app.inject({method:'POST',url:uri,
      headers:{authorization:'Bearer admin-token'}})
    expect(result.statusCode).toBe(201)
    expect(result.json().status).toBe('review')
    expect(mocks.stagePedagogyRevision).toHaveBeenCalledWith(id,'admin-token')
    await app.close()
  })

})
