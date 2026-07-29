import { supabase } from '../lib/supabase'
import { SPEAKING_PROMPTS, CATEGORY_LABEL, CATEGORY_COLOR } from '../data/speakingPrompts'
import type { SpeakingPrompt } from '../data/speakingPrompts'
import { todayDate, fetchContent } from './contentService'
import { useToastStore } from '../utils/toastStore'
import { monitoring } from '../lib/monitoring'

export { CATEGORY_LABEL, CATEGORY_COLOR }
export type { SpeakingPrompt }

/** Save speaking evaluation result to Supabase */
export async function saveSpeakingResult(params: {
  userId:           string
  promptId:         string
  promptText:       string
  fluencyScore:     number
  grammarScore:     number
  vocabularyScore:  number
  avgScore:         number
  xpEarned:         number
  feedback:         string
}) {
  const { userId, promptId, promptText, fluencyScore, grammarScore, vocabularyScore, avgScore, xpEarned, feedback } = params

  const { error } = await supabase.from('speaking_progress').insert({
    user_id:           userId,
    date:              todayDate(),
    prompt_id:         promptId,
    prompt_text:       promptText,
    fluency_score:     fluencyScore,
    grammar_score:     grammarScore,
    vocabulary_score:  vocabularyScore,
    avg_score:         avgScore,
    xp_earned:         xpEarned,
    feedback:          feedback?.slice(0, 2000) ?? '',
    completed_at:      new Date().toISOString(),
  })
  if (error) {
    monitoring.captureMessage('saveSpeakingResult error: ' + error.message, 'error')
    useToastStore.getState().toast('Speaking natijasini saqlashda xatolik', 'error')
  }
}

/** Save chat session result (from Chat Mode) to Supabase */
export async function saveChatResult(params: {
  userId:     string
  promptId:   string
  promptText: string
  turnCount:  number
  xpEarned:   number
  feedback:   string
  userScore:  number  // 1–10 estimated from conversation quality
}) {
  const { userId, promptId, promptText, turnCount, xpEarned, feedback, userScore } = params

  const { error } = await supabase.from('speaking_progress').insert({
    user_id:          userId,
    date:             todayDate(),
    prompt_id:        promptId,
    prompt_text:      promptText,
    fluency_score:    0,
    grammar_score:    0,
    vocabulary_score: 0,
    avg_score:        userScore,
    xp_earned:        xpEarned,
    feedback:         `[Chat Mode · ${turnCount} turns] ${feedback?.slice(0, 1950) ?? ''}`,
    completed_at:     new Date().toISOString(),
  })
  if (error) monitoring.captureMessage('saveChatResult error: ' + error.message, 'error')
}

export async function fetchSpeakingPrompts(): Promise<SpeakingPrompt[]> {
  return fetchContent<SpeakingPrompt>('speaking_prompts', SPEAKING_PROMPTS)
}

export function getDailyPrompts(dayNumber: number, prompts: SpeakingPrompt[]): SpeakingPrompt[] {
  const categories = [...new Set(prompts.map((p) => p.category))]
  const count = Math.min(3, prompts.length)
  const result: SpeakingPrompt[] = []
  for (let i = 0; i < count; i++) {
    const cat = categories[i % categories.length]
    const catPrompts = prompts.filter((p) => p.category === cat)
    const idx = (dayNumber + i) % catPrompts.length
    result.push(catPrompts[idx])
  }
  return result
}
