import { BarChart3, X } from 'lucide-react'

interface Props {
  feedbackResult: string
  isFeedbackLoading: boolean
  onClose: () => void
}

export default function AiFeedbackOverlay({ feedbackResult, isFeedbackLoading, onClose }: Props) {
  return (
    <div className="absolute inset-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-y-auto scrollbar-thin">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary-600" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Suhbat tahlili</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {isFeedbackLoading && !feedbackResult && (
          <div className="flex items-center gap-2 py-8 justify-center">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-gray-500">Tahlil qilinmoqda...</span>
          </div>
        )}

        {feedbackResult && (
          <div className="space-y-3">
            {/* Parse structured feedback */}
            {['GRAMMAR', 'VOCABULARY', 'FLUENCY'].map(label => {
              const match = feedbackResult.match(new RegExp(`${label}:\\s*\\d+`))
              const scoreMatch = feedbackResult.match(new RegExp(`${label}:\\s*(\\d+)\\/(\\d+)`)) ||
                                feedbackResult.match(new RegExp(`${label}:\\s*(\\d+)`))
              const score = scoreMatch ? parseInt(scoreMatch[1]) : null
              const maxScore = scoreMatch && scoreMatch[2] ? parseInt(scoreMatch[2]) : 10

              // Get the sentence after the score
              const afterLabel = feedbackResult.split(`${label}:`)[1]
              const sentence = afterLabel
                ? afterLabel.split('\n').find(l => l.trim() && !l.trim().match(/^\d+\/?\d*$/))?.trim() || ''
                : ''

              if (!match && !sentence) return null

              const percentage = score ? (score / maxScore) * 100 : 0
              const color = percentage >= 70 ? 'from-emerald-500 to-green-500' :
                            percentage >= 50 ? 'from-amber-500 to-yellow-500' :
                            'from-red-500 to-rose-500'

              return (
                <div key={label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{label}</span>
                    {score !== null && (
                      <span className="text-sm font-black text-gray-900 dark:text-gray-100">{score}/{maxScore}</span>
                    )}
                  </div>
                  {score !== null && (
                    <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mb-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}
                  {sentence && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{sentence}</p>
                  )}
                </div>
              )
            })}

            {/* Strengths */}
            {feedbackResult.includes('STRENGTHS:') && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1.5">✅ Kuchli tomonlari</p>
                <div className="space-y-0.5">
                  {(() => {
                    const parts = feedbackResult.split('STRENGTHS:')[1]?.split('IMPROVE:')[0]
                    if (!parts) return null
                    return parts.split('\n').filter(l => l.trim().startsWith('•')).map((line, i) => (
                      <p key={i} className="text-xs text-emerald-600 dark:text-emerald-400">{line.trim()}</p>
                    ))
                  })()}
                </div>
              </div>
            )}

            {/* Improve */}
            {feedbackResult.includes('IMPROVE:') && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1.5">📈 Yaxshilash uchun</p>
                <div className="space-y-0.5">
                  {(() => {
                    const parts = feedbackResult.split('IMPROVE:')[1]?.split('ENCOURAGEMENT:')[0]
                    if (!parts) return null
                    return parts.split('\n').filter(l => l.trim().startsWith('•')).map((line, i) => (
                      <p key={i} className="text-xs text-amber-600 dark:text-amber-400">{line.trim()}</p>
                    ))
                  })()}
                </div>
              </div>
            )}

            {/* Encouragement */}
            {feedbackResult.includes('ENCOURAGEMENT:') && (
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                <p className="text-xs font-bold text-primary-700 dark:text-primary-300 mb-1">💪 Rag'bat</p>
                <p className="text-xs text-primary-600 dark:text-primary-400 leading-relaxed">
                  {feedbackResult.split('ENCOURAGEMENT:')[1]?.split('\n').filter(l => l.trim())[0]?.trim() || ''}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Suhbatga qaytish
        </button>
      </div>
    </div>
  )
}
