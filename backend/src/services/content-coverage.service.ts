import { supabase } from '../lib/supabase.js'
import { AppError, AuthError, ForbiddenError, NotFoundError } from '../lib/errors.js'
import type {
  ConstructCoverage,
  ContentCoverageResponse,
  QuestionCoverageIssue,
} from '../schemas/admin.js'

type CoverageIssueCode = QuestionCoverageIssue['issues'][number]

interface ModuleRow {
  id: string
  code: string | null
}

interface LessonRow {
  id: string
  module_id: string
  slug: string
}

interface LessonConstructRow {
  lesson_id: string
  construct_id: string
}

interface ConstructRow {
  id: string
  code: string
  group_code: string
  title_uz: string
}

interface QuestionRow {
  id: string
  construct_id: string
  group_code: string
  format: 'Y1' | 'Y2' | 'Y3'
  cognitive: 'bilish' | 'qollash' | 'mulohaza'
  difficulty: number
  status: 'draft' | 'review' | 'published' | 'archived'
  source_reference: string | null
  source_lesson_id: string | null
  stem_md: string
}

interface QuestionKeyRow {
  question_id: string
}

interface BlueprintRow {
  id: string
}

interface BlueprintQuotaRow {
  blueprint_id: string
  group_code: string
}

export interface CoverageDataset {
  modules: ModuleRow[]
  lessons: LessonRow[]
  lessonConstructs: LessonConstructRow[]
  constructs: ConstructRow[]
  questions: QuestionRow[]
  questionKeys: QuestionKeyRow[]
  activeBlueprints: BlueprintRow[]
  blueprintQuotas: BlueprintQuotaRow[]
}

const PAGE_SIZE = 1000

async function requireAdmin(userToken: string): Promise<void> {
  const { data, error } = await supabase.auth.getUser(userToken)
  if (error || !data.user) throw new AuthError()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'admin') {
    throw new ForbiddenError('Bu amal uchun admin huquqi kerak')
  }
}

async function readPaged<T>(
  label: string,
  loader: (from: number, to: number) => PromiseLike<{
    data: T[] | null
    error: { message?: string } | null
  }>
): Promise<T[]> {
  const rows: T[] = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await loader(from, from + PAGE_SIZE - 1)
    if (error) {
      throw new AppError(
        `${label} coverage so‘rovi bajarilmadi: ${error.message ?? 'unknown error'}`,
        500,
        'CONTENT_COVERAGE_QUERY_ERROR'
      )
    }
    const page = data ?? []
    rows.push(...page)
    if (page.length < PAGE_SIZE) break
  }
  return rows
}

function blankStatusCounts() {
  return { draft: 0, review: 0, published: 0, archived: 0 }
}

function blankFormatCounts() {
  return { Y1: 0, Y2: 0, Y3: 0 }
}

function blankCognitiveCounts() {
  return { bilish: 0, qollash: 0, mulohaza: 0 }
}

function blankDifficultyCounts(): Record<string, number> {
  return { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
}

function addIssue(target: CoverageIssueCode[], issue: CoverageIssueCode): void {
  if (!target.includes(issue)) target.push(issue)
}

function stemPreview(stem: string): string {
  const normalized = stem.replace(/\s+/g, ' ').trim()
  return normalized.length <= 140 ? normalized : `${normalized.slice(0, 137)}…`
}

/**
 * Pure coverage calculator.
 *
 * Important boundary:
 * - objective = current DB construct_id / constructs.code;
 * - source traceability = current source_reference + source_lesson_id.
 *
 * A normalized source/source_locator registry does not exist in the active runtime
 * schema yet, therefore this report intentionally does not invent source metadata.
 */
export function buildContentCoverageReport(
  dataset: CoverageDataset,
  moduleCode?: string
): ContentCoverageResponse {
  const normalizedModule = moduleCode?.toUpperCase() ?? null
  const module = normalizedModule
    ? dataset.modules.find(row => row.code?.toUpperCase() === normalizedModule)
    : null

  if (normalizedModule && !module) {
    throw new NotFoundError(`${normalizedModule} moduli topilmadi`)
  }

  const scopedLessons = module
    ? dataset.lessons.filter(row => row.module_id === module.id)
    : dataset.lessons
  const scopedLessonIds = new Set(scopedLessons.map(row => row.id))
  const lessonById = new Map(dataset.lessons.map(row => [row.id, row]))
  const lessonConstructPairs = new Set(
    dataset.lessonConstructs.map(row => `${row.lesson_id}:${row.construct_id}`)
  )

  const moduleConstructIds = new Set(
    dataset.lessonConstructs
      .filter(row => !module || scopedLessonIds.has(row.lesson_id))
      .map(row => row.construct_id)
  )

  const constructById = new Map(dataset.constructs.map(row => [row.id, row]))
  const scopedConstructs = module
    ? dataset.constructs.filter(row => moduleConstructIds.has(row.id))
    : dataset.constructs

  const activeBlueprintIds = new Set(dataset.activeBlueprints.map(row => row.id))
  const activeGroups = new Set(
    dataset.blueprintQuotas
      .filter(row => activeBlueprintIds.has(row.blueprint_id))
      .map(row => row.group_code)
  )
  const keyIds = new Set(dataset.questionKeys.map(row => row.question_id))

  const questions = dataset.questions.filter(question => {
    if (!module) return true
    return (
      moduleConstructIds.has(question.construct_id) ||
      (question.source_lesson_id !== null &&
        scopedLessonIds.has(question.source_lesson_id))
    )
  })

  const questionsByConstruct = new Map<string, QuestionRow[]>()
  for (const question of questions) {
    const rows = questionsByConstruct.get(question.construct_id) ?? []
    rows.push(question)
    questionsByConstruct.set(question.construct_id, rows)
  }

  const lessonSlugsByConstruct = new Map<string, string[]>()
  for (const link of dataset.lessonConstructs) {
    if (module && !scopedLessonIds.has(link.lesson_id)) continue
    const lesson = lessonById.get(link.lesson_id)
    if (!lesson) continue
    const slugs = lessonSlugsByConstruct.get(link.construct_id) ?? []
    if (!slugs.includes(lesson.slug)) slugs.push(lesson.slug)
    lessonSlugsByConstruct.set(link.construct_id, slugs)
  }

  const questionIssues: QuestionCoverageIssue[] = []
  const constructIssueMap = new Map<string, CoverageIssueCode[]>()

  for (const question of questions) {
    if (question.status !== 'published') continue
    const construct = constructById.get(question.construct_id)
    if (!construct) continue

    const issues: CoverageIssueCode[] = []
    if (!question.source_reference?.trim()) {
      addIssue(issues, 'published_without_source_reference')
    }
    if (!question.source_lesson_id) {
      addIssue(issues, 'published_without_source_lesson')
    }
    if (!keyIds.has(question.id)) {
      addIssue(issues, 'published_without_key')
    }
    if (question.group_code !== construct.group_code) {
      addIssue(issues, 'group_mismatch')
    }
    if (
      question.source_lesson_id &&
      !lessonConstructPairs.has(`${question.source_lesson_id}:${question.construct_id}`)
    ) {
      addIssue(issues, 'source_lesson_construct_mismatch')
    }
    if (activeGroups.size > 0 && !activeGroups.has(question.group_code)) {
      addIssue(issues, 'outside_active_blueprint')
    }

    if (issues.length > 0) {
      questionIssues.push({
        question_id: question.id,
        construct_code: construct.code,
        group_code: question.group_code,
        source_lesson_slug: question.source_lesson_id
          ? lessonById.get(question.source_lesson_id)?.slug ?? null
          : null,
        stem_preview: stemPreview(question.stem_md),
        issues,
      })

      const aggregate = constructIssueMap.get(construct.id) ?? []
      for (const issue of issues) addIssue(aggregate, issue)
      constructIssueMap.set(construct.id, aggregate)
    }
  }

  const constructs: ConstructCoverage[] = scopedConstructs
    .map(construct => {
      const rows = questionsByConstruct.get(construct.id) ?? []
      const published = rows.filter(row => row.status === 'published')
      const statusCounts = blankStatusCounts()
      const formatCounts = blankFormatCounts()
      const cognitiveCounts = blankCognitiveCounts()
      const difficultyCounts = blankDifficultyCounts()

      for (const row of rows) {
        statusCounts[row.status] += 1
      }
      for (const row of published) {
        formatCounts[row.format] += 1
        cognitiveCounts[row.cognitive] += 1
        const difficulty = String(row.difficulty)
        difficultyCounts[difficulty] = (difficultyCounts[difficulty] ?? 0) + 1
      }

      const issues = [...(constructIssueMap.get(construct.id) ?? [])]
      if (published.length === 0) addIssue(issues, 'no_published_questions')

      return {
        construct_id: construct.id,
        construct_code: construct.code,
        group_code: construct.group_code,
        title_uz: construct.title_uz,
        lesson_slugs: [...(lessonSlugsByConstruct.get(construct.id) ?? [])].sort(),
        question_count: rows.length,
        status_counts: statusCounts,
        format_counts: formatCounts,
        cognitive_counts: cognitiveCounts,
        difficulty_counts: difficultyCounts,
        traceability: {
          with_source_reference: published.filter(row => Boolean(row.source_reference?.trim())).length,
          with_source_lesson: published.filter(row => Boolean(row.source_lesson_id)).length,
          with_key: published.filter(row => keyIds.has(row.id)).length,
        },
        issues,
      }
    })
    .sort((a, b) => a.construct_code.localeCompare(b.construct_code))

  const countQuestionIssue = (issue: CoverageIssueCode) =>
    questionIssues.filter(row => row.issues.includes(issue)).length

  const publishedCount = questions.filter(row => row.status === 'published').length

  return {
    module_code: normalizedModule,
    generated_at: new Date().toISOString(),
    summary: {
      construct_count: constructs.length,
      question_count: questions.length,
      published_count: publishedCount,
      issue_question_count: questionIssues.length,
      no_published_construct_count: constructs.filter(row =>
        row.issues.includes('no_published_questions')
      ).length,
      published_without_source_reference: countQuestionIssue(
        'published_without_source_reference'
      ),
      published_without_source_lesson: countQuestionIssue(
        'published_without_source_lesson'
      ),
      published_without_key: countQuestionIssue('published_without_key'),
      group_mismatch: countQuestionIssue('group_mismatch'),
      source_lesson_construct_mismatch: countQuestionIssue(
        'source_lesson_construct_mismatch'
      ),
      outside_active_blueprint: countQuestionIssue('outside_active_blueprint'),
    },
    constructs,
    question_issues: questionIssues.sort((a, b) =>
      a.construct_code.localeCompare(b.construct_code)
    ),
  }
}

async function loadCoverageDataset(): Promise<CoverageDataset> {
  const [
    modules,
    lessons,
    lessonConstructs,
    constructs,
    questions,
    questionKeys,
    activeBlueprints,
    blueprintQuotas,
  ] = await Promise.all([
    readPaged<ModuleRow>('modules', (from, to) =>
      supabase.from('modules').select('id, code').order('id').range(from, to)
    ),
    readPaged<LessonRow>('lessons', (from, to) =>
      supabase
        .from('lessons')
        .select('id, module_id, slug')
        .order('id')
        .range(from, to)
    ),
    readPaged<LessonConstructRow>('lesson_constructs', (from, to) =>
      supabase
        .from('lesson_constructs')
        .select('lesson_id, construct_id')
        .order('lesson_id')
        .range(from, to)
    ),
    readPaged<ConstructRow>('constructs', (from, to) =>
      supabase
        .from('constructs')
        .select('id, code, group_code, title_uz')
        .order('code')
        .range(from, to)
    ),
    readPaged<QuestionRow>('questions', (from, to) =>
      supabase
        .from('questions')
        .select(
          'id, construct_id, group_code, format, cognitive, difficulty, status, source_reference, source_lesson_id, stem_md'
        )
        .order('id')
        .range(from, to)
    ),
    readPaged<QuestionKeyRow>('question_keys', (from, to) =>
      supabase
        .from('question_keys')
        .select('question_id')
        .order('question_id')
        .range(from, to)
    ),
    readPaged<BlueprintRow>('blueprints', (from, to) =>
      supabase
        .from('blueprints')
        .select('id')
        .eq('is_active', true)
        .order('id')
        .range(from, to)
    ),
    readPaged<BlueprintQuotaRow>('blueprint_quotas', (from, to) =>
      supabase
        .from('blueprint_quotas')
        .select('blueprint_id, group_code')
        .order('order_idx')
        .range(from, to)
    ),
  ])

  return {
    modules,
    lessons,
    lessonConstructs,
    constructs,
    questions,
    questionKeys,
    activeBlueprints,
    blueprintQuotas,
  }
}

export const contentCoverageService = {
  async getReport(
    userToken: string,
    moduleCode?: string
  ): Promise<ContentCoverageResponse> {
    await requireAdmin(userToken)
    const dataset = await loadCoverageDataset()
    return buildContentCoverageReport(dataset, moduleCode)
  },
}
