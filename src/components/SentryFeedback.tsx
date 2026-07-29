import { useState, useCallback } from 'react'
import { Bug, X, Send } from 'lucide-react'

/**
 * Floating "Report an issue" button + modal.
 * Sends feedback to Sentry via its User Feedback API (requires VITE_SENTRY_DSN).
 * If Sentry is not configured, the button is hidden.
 */
export default function SentryFeedback() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSending(true)
    setError('')

    try {
      const Sentry = await import('@sentry/react')
      // Capture the feedback as a Sentry event with user details
      Sentry.captureMessage(`User feedback: ${message.substring(0, 80)}`, {
        level: 'info',
        extra: { name, email, message, url: location.href },
      })
      // @sentry/react v10+: sendFeedback creates a standalone feedback item
      Sentry.sendFeedback?.({
        name: name || 'Anonymous',
        email: email || 'unknown@user.dev',
        message,
      })
      setSent(true)
      setTimeout(() => { setOpen(false); setSent(false); setName(''); setEmail(''); setMessage('') }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send feedback')
    } finally {
      setSending(false)
    }
  }, [name, email, message])

  const sentryEnabled = !!import.meta.env.VITE_SENTRY_DSN
  if (!sentryEnabled) return null

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-[9997] w-12 h-12 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Report an issue"
        title="Report an issue"
      >
        <Bug size={20} />
      </button>

      {/* Backdrop + Modal */}
      {open && (
        <div className="fixed inset-0 z-[9996] flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:w-96 p-5 shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bug size={18} className="text-primary-600" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Report an Issue
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Feedback sent!
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Thank you for helping improve EnglishPath.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input flex-1 text-sm"
                    maxLength={80}
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input flex-1 text-sm"
                    maxLength={120}
                  />
                </div>
                <textarea
                  placeholder="Describe the issue or suggestion..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input min-h-[100px] resize-none text-sm"
                  required
                  maxLength={2000}
                />
                {error && (
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  {sending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  Send Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
