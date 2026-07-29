// ═══════════════════════════════════════════════════════════════════════════
// InvitePage — /add/:code deep-link orqali do'st qo'shish
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Check, Loader2, ArrowRight } from 'lucide-react'
import { useI18n } from '../i18n'
import { addFriendByCode } from '../services/tandemService'
import { useToastStore } from '../utils/toastStore'

type InviteState = 'processing' | 'success' | 'error' | 'auth_required'

export default function InvitePage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [state, setState] = useState<InviteState>('processing')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!code) {
      setState('error')
      setMessage(t('invitePage.codeNotFound'))
      return
    }

    const processInvite = async () => {
      // Wait a moment for auth to initialize
      await new Promise(r => setTimeout(r, 500))

      const result = await addFriendByCode(code)
      if (result.success) {
        setState('success')
        setMessage(t('invitePage.successMessage'))
        useToastStore.getState().toast('✅ Do\'st qo\'shildi!', 'success')
      } else if (result.error?.includes('Auth')) {
        setState('auth_required')
        setMessage(t('invitePage.authRequiredMessage'))
      } else if (result.error?.includes('allaqachon')) {
        setState('success')
        setMessage(t('invitePage.alreadyFriend'))
      } else {
        setState('error')
        setMessage(result.error || t('invitePage.errorMessageDefault'))
      }
    }

    processInvite()
  }, [code, t])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-sm w-full p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
            state === 'success'
              ? 'bg-green-100 dark:bg-green-900/30'
              : state === 'error'
                ? 'bg-red-100 dark:bg-red-900/30'
                : 'bg-purple-100 dark:bg-purple-900/30'
          }`}>
            {state === 'processing' ? (
              <Loader2 size={32} className="animate-spin text-purple-500" />
            ) : state === 'success' ? (
              <Check size={32} className="text-green-500" />
            ) : state === 'auth_required' ? (
              <Users size={32} className="text-purple-500" />
            ) : (
              <span className="text-4xl">😕</span>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {state === 'processing' ? t('invitePage.processingTitle') :
           state === 'success' ? t('invitePage.successTitle') :
           state === 'auth_required' ? t('invitePage.authRequiredTitle') :
           t('invitePage.errorTitle')}
        </h2>

        <p className="text-sm text-gray-500">{message}</p>

        {state === 'success' && (
          <button
            onClick={() => navigate('/tandem')}
            className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            {t('invitePage.goToTandem')} <ArrowRight size={16} />
          </button>
        )}

        {state === 'auth_required' && (
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full py-3 text-sm"
          >
            {t('invitePage.goToAuth')}
          </button>
        )}

        {state === 'error' && (
          <button
            onClick={() => navigate('/')}
            className="btn-secondary w-full py-3 text-sm"
          >
            {t('invitePage.goHome')}
          </button>
        )}
      </div>
    </div>
  )
}
