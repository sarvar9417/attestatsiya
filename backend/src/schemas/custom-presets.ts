import { z } from 'zod'
import { customExamConfigSchema } from './custom-exam.js'

export const presetPayloadSchema = z.object({
  title: z.string().trim().min(1).max(80),
  config: customExamConfigSchema,
}).strict()
export const presetUpdateSchema = presetPayloadSchema.partial().refine(
  value => value.title !== undefined || value.config !== undefined,
  'Kamida bitta qiymat yuboring'
)
export const presetIdSchema = z.object({ id: z.string().uuid() })
