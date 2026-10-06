export type GeneratedQuestionFormat = 'Y1' | 'Y2' | 'Y3'
export type GeneratedCognitive = 'bilish' | 'qollash' | 'mulohaza'

export interface GeneratedOption {
  id: string
  side: 'a' | 'b'
  content: string
}

export type GeneratedAnswerKey =
  | { kind: 'Y1'; optionId: string }
  | { kind: 'Y2'; pairs: Record<string, string> }
  | { kind: 'Y3'; order: string[] }

export interface GeneratedQuestion {
  generator: 'axborotHajmi' | 'sanoqSistema' | 'mantiqAmal' | 'ipMaska'
  seed: string
  constructCode: string
  groupCode: string
  format: GeneratedQuestionFormat
  cognitive: GeneratedCognitive
  difficulty: 1 | 2 | 3 | 4 | 5
  stem: string
  options: GeneratedOption[]
  key: GeneratedAnswerKey
  explanation: string
  fingerprint: string
}

export interface QuestionGenerator {
  readonly name: GeneratedQuestion['generator']
  readonly constructCodes: readonly string[]
  generate(seed: string | number, constructCode?: string): GeneratedQuestion
}
