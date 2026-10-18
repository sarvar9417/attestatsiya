import { z } from 'zod'
import { customExamConfigSchema } from './custom-exam.js'

export const customPresetNameSchema = z.string()
  .min(2).max(60)
  .refine(name => name === name.trim(), 'Nom boshida yoki oxirida bo‘sh joy bo‘lmasligi kerak')

export const createCustomPresetSchema = z.object({
  name: customPresetNameSchema,
  config: customExamConfigSchema,
}).strict()

export const patchCustomPresetSchema = z.object({
  name: customPresetNameSchema.optional(),
  config: customExamConfigSchema.optional(),
}).strict().refine(value => value.name !== undefined || value.config !== undefined, {
  message: 'O‘zgartiriladigan maydon kerak',
})

export const customPresetIdSchema = z.object({
  id: z.string().uuid(),
})

export type CreateCustomPreset = z.infer<typeof createCustomPresetSchema>
export type PatchCustomPreset = z.infer<typeof patchCustomPresetSchema>
