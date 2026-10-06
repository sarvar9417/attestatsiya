import { axborotHajmiGenerator } from './axborotHajmi'
import { ipMaskaGenerator } from './ipMaska'
import { mantiqAmalGenerator } from './mantiqAmal'
import { sanoqSistemaGenerator } from './sanoqSistema'
import type { QuestionGenerator } from './types'

export * from './types'
export { axborotHajmiGenerator } from './axborotHajmi'
export { sanoqSistemaGenerator } from './sanoqSistema'
export { mantiqAmalGenerator } from './mantiqAmal'
export { ipMaskaGenerator, ipMath } from './ipMaska'

export const QUESTION_GENERATORS: readonly QuestionGenerator[] = [
  axborotHajmiGenerator,
  sanoqSistemaGenerator,
  mantiqAmalGenerator,
  ipMaskaGenerator,
]

export function getQuestionGenerator(name: string): QuestionGenerator {
  const generator = QUESTION_GENERATORS.find(item => item.name === name)
  if (!generator) throw new Error(`unknown_generator:${name}`)
  return generator
}
