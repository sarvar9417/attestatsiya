import { getAuthedClient } from '../lib/supabase.js'
import { AppError, NotFoundError } from '../lib/errors.js'
import { buildCustomExamPlan } from './custom-exam-planner.js'
import type { CreateCustomPreset, PatchCustomPreset } from '../schemas/custom-preset.js'

export interface CustomPresetRecord {
  id: string
  name: string
  config: CreateCustomPreset['config']
  created_at: string
  updated_at: string
}

const fields = 'id, name, config, created_at, updated_at'

function databaseError(error: { code?: string; message: string }): never {
  if (error.code === '23505') {
    throw new AppError('Bunday nomdagi shablon mavjud', 409, 'CUSTOM_PRESET_DUPLICATE')
  }
  if (error.message.includes('preset_limit_reached')) {
    throw new AppError('Ko‘pi bilan 30 ta shablon saqlash mumkin', 409, 'CUSTOM_PRESET_LIMIT')
  }
  if (error.code === '42P01') {
    throw new AppError('Shablonlar bazasi hali tayyor emas', 503, 'CUSTOM_PRESETS_UNAVAILABLE')
  }
  throw new AppError('Shablon ma’lumotlari saqlanmadi', 503, 'CUSTOM_PRESETS_UNAVAILABLE')
}

export const customPresetService = {
  async list(userToken: string): Promise<CustomPresetRecord[]> {
    const client = getAuthedClient(userToken)
    const { data, error } = await client
      .from('custom_exam_presets')
      .select(fields)
      .order('updated_at', { ascending: false })
      .limit(30)
    if (error) return databaseError(error)
    return (data ?? []) as CustomPresetRecord[]
  },

  async create(input: CreateCustomPreset, userToken: string): Promise<CustomPresetRecord> {
    const client = getAuthedClient(userToken)
    const config = buildCustomExamPlan(input.config).config
    const { data, error } = await client
      .from('custom_exam_presets')
      .insert({ name: input.name, config })
      .select(fields)
      .single()
    if (error) return databaseError(error)
    if (!data) throw new AppError('Shablon yaratilmadi', 503, 'CUSTOM_PRESETS_UNAVAILABLE')
    return data as CustomPresetRecord
  },

  async update(id: string, patch: PatchCustomPreset, userToken: string): Promise<CustomPresetRecord> {
    const client = getAuthedClient(userToken)
    const values = {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.config !== undefined ? { config: buildCustomExamPlan(patch.config).config } : {}),
    }
    const { data, error } = await client
      .from('custom_exam_presets')
      .update(values)
      .eq('id', id)
      .select(fields)
      .maybeSingle()
    if (error) return databaseError(error)
    if (!data) throw new NotFoundError('Shablon topilmadi')
    return data as CustomPresetRecord
  },

  async remove(id: string, userToken: string): Promise<{ deleted: true }> {
    const client = getAuthedClient(userToken)
    const { data, error } = await client
      .from('custom_exam_presets')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle()
    if (error) return databaseError(error)
    if (!data) throw new NotFoundError('Shablon topilmadi')
    return { deleted: true }
  },
}
