import { getAuthedClient } from '../lib/supabase.js'
import { AppError } from '../lib/errors.js'
import { presetPayloadSchema } from '../schemas/custom-presets.js'
import type { CustomExamConfig } from '../schemas/custom-exam.js'

interface PresetValues { title: string; config: CustomExamConfig }
const fields = 'id,title,config,created_at,updated_at'

async function identity(client: ReturnType<typeof getAuthedClient>) {
  const { data, error } = await client.auth.getUser()
  if (error || !data.user) throw new AppError('Tizimga qayta kiring',401,'UNAUTHORIZED')
  return data.user.id
}

function databaseError(error: {code?:string; message:string}): never {
  if (error.message.includes('custom_preset_limit')) throw new AppError('30 tadan ortiq shablon saqlab bo‘lmaydi',409,'PRESET_LIMIT')
  if (error.code==='23505') throw new AppError('Bu nomli shablon allaqachon mavjud',409,'PRESET_DUPLICATE')
  throw new AppError('Shablon bilan ishlashda xato yuz berdi',503,'PRESET_UNAVAILABLE')
}

export const customPresetService = {
  async list(token:string) {
    const client=getAuthedClient(token)
    const userId=await identity(client)
    const {data,error}=await client.from('custom_test_presets').select(fields)
      .eq('user_id',userId).order('updated_at',{ascending:false}).limit(30)
    if(error) return databaseError(error)
    return data ?? []
  },
  async create(token:string, input:PresetValues) {
    const values=presetPayloadSchema.parse(input)
    const client=getAuthedClient(token)
    const userId=await identity(client)
    const {data,error}=await client.from('custom_test_presets')
      .insert({user_id:userId, title:values.title,config:values.config})
      .select(fields).single()
    if(error) return databaseError(error)
    return data
  },
  async update(token:string,id:string,input:Partial<PresetValues>) {
    const client=getAuthedClient(token)
    const userId=await identity(client)
    const {data,error}=await client.from('custom_test_presets')
      .update(input).eq('id',id).eq('user_id',userId).select(fields).maybeSingle()
    if(error) return databaseError(error)
    if(!data) throw new AppError('Shablon topilmadi',404,'PRESET_NOT_FOUND')
    return data
  },
  async remove(token:string,id:string) {
    const client=getAuthedClient(token)
    const userId=await identity(client)
    const {data,error}=await client.from('custom_test_presets')
      .delete().eq('id',id).eq('user_id',userId).select('id').maybeSingle()
    if(error) return databaseError(error)
    if(!data) throw new AppError('Shablon topilmadi',404,'PRESET_NOT_FOUND')
    return {deleted:true}
  },
}
