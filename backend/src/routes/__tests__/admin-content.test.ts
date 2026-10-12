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
}))

vi.mock('../../services/admin-content.service.js', () => ({
  adminContentService: mocks,
}))

const sourceMocks = vi.hoisted(() => ({
  importBatch: vi.fn(),
  list: vi.fn(),
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

})
