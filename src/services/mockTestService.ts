import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { useToastStore } from '../utils/toastStore'
import { monitoring } from '../lib/monitoring'
import {
  A1_QUESTIONS,
  A2_QUESTIONS,
  B1_QUESTIONS,
  B2_QUESTIONS,
  IELTS_WRITING_TASK1,
  IELTS_WRITING_TASK2,
  IELTS_LISTENING_TEXT,
  IELTS_LISTENING_MCQ,
  pctToBand,
  scoreToBand,
  roundBand,
} from '../data/mockTestData'
import type { TQ, ListeningMCQ } from '../data/mockTestData'

export { pctToBand, scoreToBand, roundBand }
export type { TQ, ListeningMCQ }

export interface MockTestData {
  questions: TQ[]
  writingTask1: { prompt: string; instruction: string }
  writingTask2: { prompt: string; instruction: string }
  listeningText: string
  listeningMCQ: ListeningMCQ[]
}

interface MockTestRow {
  id: string
  data: {
    writingTask1: { prompt: string; instruction: string }
    writingTask2: { prompt: string; instruction: string }
  }
}

async function fetchQuestions(level: string): Promise<TQ[]> {
  const { data, error } = await supabase
    .from('mocktest_questions')
    .select('*')
    .eq('level', level)

  if (error || !data || data.length === 0) {
    if (level === 'A1') return A1_QUESTIONS
    if (level === 'A2') return A2_QUESTIONS
    return level === 'B2' ? B2_QUESTIONS : B1_QUESTIONS
  }

  return data
    .map((r) => {
      const q = db.jsonFrom<TQ>(r.data)
      if (!q || typeof q !== 'object') return null
      return q
    })
    .filter((q): q is TQ => q !== null)
}

async function fetchListening(level: string): Promise<{ text: string; mcq: ListeningMCQ[] } | null> {
  const { data, error } = await supabase
    .from('mocktest_listening')
    .select('*')
    .eq('level', level)
    .maybeSingle()

  if (error || !data) {
    return { text: IELTS_LISTENING_TEXT, mcq: IELTS_LISTENING_MCQ }
  }

  const listening = db.jsonFrom<{ text: string; mcq: ListeningMCQ[] }>(data.data)
  if (listening && typeof listening === 'object') {
    return listening
  }
  return { text: IELTS_LISTENING_TEXT, mcq: IELTS_LISTENING_MCQ }
}

async function fetchWriting(): Promise<{ writingTask1: { prompt: string; instruction: string }; writingTask2: { prompt: string; instruction: string } }> {
  const { data, error } = await supabase
    .from('mocktest_writing')
    .select('*')
    .eq('id', 'ielts-writing')
    .maybeSingle()

  if (error || !data) {
    return { writingTask1: { prompt: IELTS_WRITING_TASK1.prompt, instruction: IELTS_WRITING_TASK1.title }, writingTask2: { prompt: IELTS_WRITING_TASK2.prompt, instruction: IELTS_WRITING_TASK2.title } }
  }

  return db.jsonFrom<MockTestRow['data']>(data.data) ?? {
    writingTask1: { prompt: IELTS_WRITING_TASK1.prompt, instruction: IELTS_WRITING_TASK1.title },
    writingTask2: { prompt: IELTS_WRITING_TASK2.prompt, instruction: IELTS_WRITING_TASK2.title },
  }
}

export async function saveMockTestResult(params: {
  userId:    string
  date:      string
  day:       number
  week:      number
  type:      'weekly' | 'monthly' | 'final'
  sections:  { reading: number; listening: number; grammar: number; writing: number; speaking: number }
  totalScore: number
  level:     string
}) {
  const { error } = await supabase.from('mock_tests').insert({
    user_id:         params.userId,
    date:            params.date,
    day:             params.day,
    week:            params.week,
    type:            params.type,
    reading_score:   params.sections.reading,
    listening_score: params.sections.listening,
    grammar_score:   params.sections.grammar,
    writing_score:   params.sections.writing,
    total_score:     params.totalScore,
    level:           params.level,
  })
  if (error) {
    monitoring.captureMessage('saveMockTestResult error: ' + error.message, 'error')
    useToastStore.getState().toast('Mock test natijasini saqlashda xatolik', 'error')
  }
}

export async function fetchMockTestData(level: string): Promise<MockTestData> {
  const [questions, listening, writing] = await Promise.all([
    fetchQuestions(level),
    fetchListening(level),
    fetchWriting(),
  ])

  return {
    questions,
    writingTask1: writing.writingTask1,
    writingTask2: writing.writingTask2,
    listeningText: listening?.text ?? '',
    listeningMCQ: listening?.mcq ?? [],
  }
}
