import { supabase } from '../lib/supabase.js'
import { AppError, AuthError, ForbiddenError } from '../lib/errors.js'
import {
  professionalBankImportResultSchema,
  type ProfessionalBankImportResult,
  type ProfessionalBankItem,
} from '../schemas/admin.js'

async function requireActiveAdminId(userToken: string): Promise<string> {
  const { data, error } = await supabase.auth.getUser(userToken)
  if (error || !data.user) throw new AuthError()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, is_blocked')
    .eq('id', data.user.id)
    .maybeSingle()

  if (profileError) {
    throw new AppError("Admin profili tekshirilmadi", 500, 'ADMIN_PROFILE_CHECK_FAILED')
  }

  if (!profile || profile.role !== 'admin' || profile.is_blocked) {
    throw new ForbiddenError('Bu amal uchun faol admin huquqi kerak')
  }

  return data.user.id
}

export const questionBankImportService = {
  async importBatch(
    items: ProfessionalBankItem[],
    userToken: string
  ): Promise<ProfessionalBankImportResult> {
    const actorId = await requireActiveAdminId(userToken)

    const { data, error } = await supabase.rpc('import_question_bank_batch', {
      p_actor_id: actorId,
      p_items: items,
    })

    if (error) {
      throw new AppError(
        "Savollar bankini import qilishda xatolik",
        500,
        'QUESTION_BANK_IMPORT_FAILED'
      )
    }

    const parsed = professionalBankImportResultSchema.safeParse(data)
    if (!parsed.success) {
      throw new AppError(
        "Import natijasi kutilgan formatga mos emas",
        500,
        'QUESTION_BANK_IMPORT_RESPONSE_INVALID'
      )
    }

    return parsed.data
  },
}
