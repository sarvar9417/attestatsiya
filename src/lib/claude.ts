export {
  sendMessage,
  sendMessageStream,
  MODEL,
} from './claudeClient'
export type { ChatMessage } from './claudeClient'

// ── AI domen modullari (ilgari monolit claudePrompts.ts edi — F3-2) ──
export { checkGrammar, getWritingFeedback, analyzeWritingErrors } from './ai/claude-grammar'
export type { WritingError } from './ai/claude-grammar'

export {
  explainWord,
  generateWordCard,
  checkVocabAnswer,
  checkPhraseTranslation,
  checkPhraseTranslationDetailed,
  generateUzbekSentence,
  checkSentenceTranslation,
} from './ai/claude-vocab'
export type { WordCard, SentenceCheckResult, PhraseCheckResult } from './ai/claude-vocab'

export {
  generateSpeakingTask,
  analyzePronunciation,
  getSpeakingChatFeedback,
  getScenarioReport,
} from './ai/claude-speaking'
export type { SpeakingTask, PronunciationIssue, PronunciationAnalysis, ScenarioReport } from './ai/claude-speaking'

export { generateWritingTask } from './ai/claude-writing'
export type { GeneratedWritingTask } from './ai/claude-writing'

export {
  generatePracticeExercises,
  generateLearningInsights,
  checkDailyExerciseAnswers,
} from './ai/claude-exercises'
export type { GeneratedExercise, LearningSignals, LearningInsights, DailyExerciseCheckItem } from './ai/claude-exercises'

export { generateDuelVerdict, generateDuoRoleplayReport } from './ai/claude-duel'

export {
  getGrammarFeedback,
  generateReadingQuestions,
  evaluateWriting,
  evaluateSpeech,
  generateExamples,
  analyzeGrammar,
  startSpeakingChat,
  startScenarioConversation,
  analyzeWritingIELTS,
} from './claudeChat'
export type {
  GrammarResult,
  ScenarioContext,
  WritingAnalysis,
} from './claudeChat'
