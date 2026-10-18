import type { FastifyInstance } from 'fastify'
import { adminService } from '../services/admin.service.js'
import {
  contentCoverageQuerySchema,
  listAttemptsQuerySchema,
  professionalBankImportRequestSchema,
} from '../schemas/admin.js'
import { sendError, AppError } from '../lib/errors.js'
import { pedguliCandidateService } from '../services/pedguli-candidate.service.js'
import { pedguliCandidateImportSchema, pedguliCandidateListQuerySchema, pedguliCandidateReviewSchema, pedguliStage4BatchSchema } from '../schemas/pedguli-candidates.js'
import { contentCoverageService } from '../services/content-coverage.service.js'
import { questionBankImportService } from '../services/question-bank-import.service.js'
import { adminContentService } from '../services/admin-content.service.js'
import { pedagogyPdfService } from '../services/pedagogy-pdf.service.js'
import {
  adminQuestionsQuerySchema,
  createAdminModuleSchema,
  saveAdminQuestionSchema,
  transitionAdminQuestionSchema,
  savePedguliEditorialReviewSchema,
  pedagogyPdfSourceListQuerySchema,
  stagePedagogyPdfQuestionSchema,
} from '../schemas/admin-content.js'

function getToken(req: { headers: { authorization?: string } }): string | null {
  return req.headers.authorization?.replace('Bearer ', '') ?? null
}

export async function adminRoutes(app: FastifyInstance) {
  /**
   * Admin CMS boundary: browser Supabase Data API bilan to‘g‘ridan-to‘g‘ri
   * ishlamaydi. Barcha content/dashboard amallari shu authenticated backend
   * boundary orqali service-role Supabase clientga boradi.
   */
  /**
   * Private review inbox: never returns original Telegram source text to a
   * non-staff user. Does not expose answers or insert into exam question pool.
   */
  app.get('/api/admin/pedguli-candidates', async (req, reply) => {
    const token=getToken(req)
    if(!token) throw new AppError('Token kerak',401,'TOKEN_REQUIRED')
    const query=pedguliCandidateListQuerySchema.parse(req.query)
    try {
      return reply.send(await pedguliCandidateService.list(token,query))
    } catch(error) {
      return sendError(reply,error)
    }
  })

  /** Active admin only; batches <= 50; idempotent and review-only. */
  /** Staff records a manual source review; only an admin can mark verified. */
  app.patch('/api/admin/pedguli-candidates/:id/review', async (req, reply) => {
    const token=getToken(req)
    if(!token)throw new AppError('Token kerak',401,'TOKEN_REQUIRED')
    const {id}=req.params as {id:string}
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)){
      throw new AppError('Nomzod ID formati noto‘g‘ri',400,'INVALID_CANDIDATE_ID')
    }
    const input=pedguliCandidateReviewSchema.parse(req.body)
    try{
      return reply.send(await pedguliCandidateService.review(token,id,input))
    }catch(error){return sendError(reply,error)}
  })

  /** Private, admin-only source research upload; no grader/public.question writes. */
  app.post('/api/admin/pedguli-candidates/stage4', async (req, reply) => {
    const token=getToken(req)
    if(!token)throw new AppError('Token kerak',401,'TOKEN_REQUIRED')
    const body=pedguliStage4BatchSchema.parse(req.body)
    try {return reply.send(await pedguliCandidateService.importStage4(token,body))}
    catch(error){return sendError(reply,error)}
  })

  app.post('/api/admin/pedguli-candidates/import', async (req, reply) => {
    const token=getToken(req)
    if(!token) throw new AppError('Token kerak',401,'TOKEN_REQUIRED')
    const body=pedguliCandidateImportSchema.parse(req.body)
    try {
      return reply.send(await pedguliCandidateService.importBatch(token,body.items))
    } catch(error) {
      return sendError(reply,error)
    }
  })

  app.get('/api/admin/dashboard', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    try {
      return reply.send(await adminContentService.dashboard(token))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/api/admin/modules', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    try {
      return reply.send(await adminContentService.listModules(token))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.post('/api/admin/modules', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    const body = createAdminModuleSchema.parse(req.body)
    try {
      const result = await adminContentService.createModule(body, token)
      return reply.status(201).send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /** PDF archive is staff-only; response must not be cached by public proxies. */
  app.get('/api/admin/pedagogy-pdf-candidates', async (req, reply) => {
    const token=getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    const filters=pedagogyPdfSourceListQuerySchema.parse(req.query)
    reply.header('Cache-Control','private, no-store')
    try { return reply.send(await pedagogyPdfService.list(token,filters)) }
    catch (error) { return sendError(reply,error) }
  })

  /** Verified private PDF source -> human-authored REVIEW, never publish. */
  app.post('/api/admin/pedagogy-pdf-candidates/:id/stage-question', async (req, reply) => {
    const token=getToken(req)
    if (!token) throw new AppError('Token kerak',401,'TOKEN_REQUIRED')
    const {id} = req.params as {id:string}
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      throw new AppError('Manba ID formati noto‘g‘ri',400,'INVALID_CANDIDATE_ID')
    }
    const input=stagePedagogyPdfQuestionSchema.parse(req.body)
    reply.header('Cache-Control','private, no-store')
    try { return reply.status(201).send(await pedagogyPdfService.stageQuestion(token,id,input)) }
    catch(error){ return sendError(reply,error) }
  })

  app.get('/api/admin/questions', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    const query = adminQuestionsQuerySchema.querystring.parse(req.query)
    try {
      return reply.send(await adminContentService.listQuestions(
        query.status, token, query.source, query.page, query.page_size,
        query.group_code, query.query,
      ))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /** Editorial checklist visible only to authenticated CMS staff. */
  app.get('/api/admin/questions/:id/editorial', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    const { id } = req.params as { id: string }
    try {
      return reply.send(await adminContentService.getPedguliEditorialReview(id, token))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /** Only an authenticated admin can attest independent answer/source review. */
  app.put('/api/admin/questions/:id/editorial', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    const { id } = req.params as { id: string }
    const input = savePedguliEditorialReviewSchema.parse(req.body)
    try {
      return reply.send(await adminContentService.savePedguliEditorialReview(id, input, token))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.patch('/api/admin/questions/:id/status', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    const { id } = req.params as { id: string }
    const body = transitionAdminQuestionSchema.parse(req.body)
    try {
      return reply.send(await adminContentService.transitionQuestion(id, body.status, token))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /** Stage one length-biased legacy question as a NEW review-only revision. */
  app.post('/api/admin/questions/:id/stage-revision', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    const { id } = req.params as { id: string }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      throw new AppError('Savol ID formati noto‘g‘ri', 400, 'INVALID_QUESTION_ID')
    }
    try {
      return reply.status(201).send(await adminContentService.stagePedagogyRevision(id, token))
    } catch (error) { return sendError(reply, error) }
  })

  app.get('/api/admin/question-editor/meta', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    try {
      return reply.send(await adminContentService.questionEditorMeta(token))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/api/admin/questions/:id/editor', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    const { id } = req.params as { id: string }
    try {
      return reply.send(await adminContentService.questionEditor(id, token))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.post('/api/admin/questions', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    const body = saveAdminQuestionSchema.parse(req.body)
    try {
      const result = await adminContentService.createQuestion(body, token)
      return reply.status(201).send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.put('/api/admin/questions/:id', async (req, reply) => {
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')
    const { id } = req.params as { id: string }
    const body = saveAdminQuestionSchema.parse(req.body)
    try {
      return reply.send(await adminContentService.updateQuestion(id, body, token))
    } catch (error) {
      return sendError(reply, error)
    }
  })
  /**
   * GET /api/admin/content-coverage
   * Published savollarni objective/source/cognitive/difficulty bo‘yicha audit qiladi.
   * module_code=M01 kabi scope ixtiyoriy.
   */
  app.get('/api/admin/content-coverage', async (req, reply) => {
    const query = contentCoverageQuerySchema.querystring.parse(req.query)
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')

    try {
      const result = await contentCoverageService.getReport(
        token,
        query.module_code
      )
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /**
   * POST /api/admin/question-bank/import
   * Xususiy professional bankni 100 tagacha batch bilan REVIEW holatida import qiladi.
   * Raw bank/answer key public Git repoga yozilmaydi.
   */
  app.post('/api/admin/question-bank/import', async (req, reply) => {
    const body = professionalBankImportRequestSchema.parse(req.body)
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')

    try {
      const result = await questionBankImportService.importBatch(body.items, token)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /**
   * GET /api/admin/attempts
   * Barcha sinov urinishlari (admin). Filter: kind, lesson_id, user_id, from, to.
   */
  app.get('/api/admin/attempts', async (req, reply) => {
    const query = listAttemptsQuerySchema.querystring.parse(req.query)
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')

    try {
      const result = await adminService.listAttempts(query, token)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  /**
   * GET /api/admin/attempts/:id
   * Bitta urinishning to'liq detali (admin).
   */
  app.get('/api/admin/attempts/:id', async (req, reply) => {
    const { id } = (req.params as { id: string })
    const token = getToken(req)
    if (!token) throw new AppError('Token kerak', 401, 'TOKEN_REQUIRED')

    try {
      const result = await adminService.getAttemptDetail(id, token)
      return reply.send(result)
    } catch (error) {
      return sendError(reply, error)
    }
  })
}
