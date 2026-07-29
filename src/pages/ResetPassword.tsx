import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../i18n'
import { CheckCircle, Lock } from 'lucide-react'
import { ResetPasswordSkeleton } from '../components/ui/PageSkeleton'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { updatePassword } = useAuth()

  const [password,     setPassword]     = useState('')
  const [confirm,      setConfirm]      = useState('')
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [success,      setSuccess]      = useState(false)
  const [checking,     setChecking]     = useState(true)
  const resolvedRef    = useRef(false)

  useEffect(() => {
    // Supabase automatically processes the hash fragment and establishes session
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        resolvedRef.current = true
        setChecking(false)
      } else {
        // Try to wait for the session to be established
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'SIGNED_IN') {
            resolvedRef.current = true
            setChecking(false)
            subscription.unsubscribe()
          }
        })
        // Timeout after 5s
        setTimeout(() => {
          setChecking(false)
          if (!resolvedRef.current) {
            setError(t('resetPassword.errorTimeout'))
          }
          subscription.unsubscribe()
        }, 5000)
      }
    }
    init()
  }, [t])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError(t('resetPassword.errorMinLength'))
      return
    }
    if (password !== confirm) {
      setError(t('resetPassword.errorNotMatch'))
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await updatePassword(password)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/'), 3000)
    }

    setLoading(false)
  }

  if (checking) {
    return <ResetPasswordSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-b2-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('resetPassword.successTitle')}</h2>
              <p className="text-sm text-gray-500">{t('resetPassword.successRedirect')}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3 bg-primary-50 rounded-full flex items-center justify-center">
                  <Lock size={28} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('resetPassword.title')}</h2>
                <p className="text-sm text-gray-500 mt-1">{t('resetPassword.subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('resetPassword.newPasswordLabel')}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('resetPassword.placeholderPassword')}
                    required
                    minLength={6}
                    className="input"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('resetPassword.confirmPasswordLabel')}</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder={t('resetPassword.placeholderPassword')}
                    required
                    minLength={6}
                    className="input"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? t('resetPassword.savingButton') : t('resetPassword.saveButton')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
