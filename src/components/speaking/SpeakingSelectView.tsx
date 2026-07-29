import { ChevronLeft, Mic, MicOff, RotateCcw, MessageCircle, Sparkles } from 'lucide-react'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/data/speakingPrompts'
import type { SpeakingPrompt } from '@/services/speakingService'
import type { SpeechRecognitionState } from '@/hooks/useSpeechRecognition'
import type { Mode, ChatTopic } from './speakingHelpers'

interface SpeakingSelectViewProps {
  fromSkills: boolean
  mode: Mode
  prompts: SpeakingPrompt[]
  promptsLoading: boolean
  dailyPrompts: SpeakingPrompt[]
  currentDay: number
  sr: SpeechRecognitionState
  t: (key: string, params?: Record<string, string>) => string
  onModeChange: (mode: Mode) => void
  onSelectPrompt: (prompt: SpeakingPrompt) => void
  onStartChat: (topic: ChatTopic) => void
  onNavigateConversation: () => void
  onNavigatePronunciation: () => void
  onNavigateSkills: () => void
}

export default function SpeakingSelectView({
  fromSkills, mode, prompts, promptsLoading, dailyPrompts, currentDay,
  sr, t, onModeChange, onSelectPrompt, onStartChat,
  onNavigateConversation, onNavigatePronunciation, onNavigateSkills,
}: SpeakingSelectViewProps) {
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        {fromSkills && (
          <button onClick={onNavigateSkills} className="btn-ghost p-2 rounded-xl -ml-2" aria-label={t('common.backToSkills')}>
            <ChevronLeft size={18} />
          </button>
        )}
        <div className="w-10 h-10 bg-b2-100 rounded-xl flex items-center justify-center">
          <Mic size={20} className="text-b2-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('speaking.title')}</h1>
          <p className="text-xs text-gray-500">{t('speaking.subtitle')}</p>
        </div>
      </div>

      {/* AI Suhbat Hamrohi — roleplay banner */}
      <button
        onClick={onNavigateConversation}
        className="w-full mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-left flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm flex items-center gap-1.5">{t('speaking.bannerRoleplay')} <span className="text-xs bg-white/25 px-1.5 py-0.5 rounded-full font-bold">{t('speaking.bannerNew')}</span></p>
          <p className="text-xs text-white/85">{t('speaking.bannerRoleplayDesc')}</p>
        </div>
        <ChevronLeft size={18} className="rotate-180 shrink-0 text-white/70" />
      </button>

      {/* AI Talaffuz Murabbiysi banner */}
      <button
        onClick={onNavigatePronunciation}
        className="w-full mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-left flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Mic size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm flex items-center gap-1.5">{t('speaking.bannerPronunciation')} <span className="text-xs bg-white/25 px-1.5 py-0.5 rounded-full font-bold">{t('speaking.bannerNew')}</span></p>
          <p className="text-xs text-white/85">{t('speaking.bannerPronunciationDesc')}</p>
        </div>
        <ChevronLeft size={18} className="rotate-180 shrink-0 text-white/70" />
      </button>

      {/* Mode switcher */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4">
        <button
          onClick={() => onModeChange('prompt')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
            mode === 'prompt'
              ? 'bg-white dark:bg-gray-700 text-b2-700 dark:text-b2-400 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Mic size={14} className="inline mr-1" /> {t('speaking.modePrompt')}
        </button>
        <button
          onClick={() => onModeChange('chat')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
            mode === 'chat'
              ? 'bg-white text-b2-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageCircle size={14} className="inline mr-1" /> {t('speaking.modeChat')}
        </button>
      </div>

      {sr.permissionError && (
        <div className="card bg-amber-50 border-amber-100 mb-4">
          <p className="text-sm text-amber-700 font-medium flex items-center gap-2">
            <MicOff size={16} className="text-amber-500 shrink-0" />
            {t('speaking.micPermissionDenied')}
          </p>
          <button
            onClick={() => { sr.reset(); sr.start() }}
            className="mt-2 text-xs font-semibold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw size={12} className="inline mr-1" />
            {t('speaking.micRetry')}
          </button>
        </div>
      )}
      {!sr.isSupported && (
        <div className="card bg-red-50 border-red-100 mb-4">
          <p className="text-sm text-red-700 font-medium">
            {t('speaking.browserWarn')}
          </p>
        </div>
      )}

      {/* ── Prompt Mode ────────────────────────────────────────────────── */}
      {mode === 'prompt' && (
        <>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {t('speaking.todayPrompts', { day: String(currentDay) })}
          </p>
          <div className="space-y-3 mb-6">
            {dailyPrompts.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPrompt(p)}
                className="w-full card text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`badge text-xs ${CATEGORY_COLOR[p.category]}`}>
                        {CATEGORY_LABEL[p.category]}
                      </span>
                      <span className="text-xs text-gray-400">{Math.floor(p.timeSeconds / 60)}:{String(p.timeSeconds % 60).padStart(2, '0')} {t('common.minutes')}</span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">{p.prompt}</p>
                    <div className="flex gap-1 mt-2">
                      {p.tips.slice(0, 2).map((tip, i) => (
                        <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                          {tip}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Mic size={16} className="text-b2-400 flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>

          <details className="card">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700 select-none">
              {t('speaking.allPrompts', { count: String(prompts.length) })}
            </summary>
            {promptsLoading ? (
              <div className="text-gray-400 animate-pulse text-center py-4 text-sm">{t('speaking.loadingPrompts')}</div>
            ) : (
              <div className="space-y-0.5 mt-2">
                {prompts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPrompt(p)}
                    className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0 flex items-center gap-2"
                  >
                    <span className={`badge text-xs flex-shrink-0 ${CATEGORY_COLOR[p.category]}`}>
                      {CATEGORY_LABEL[p.category]}
                    </span>
                    <span className="line-clamp-1">{p.prompt}</span>
                  </button>
                ))}
              </div>
            )}
          </details>
        </>
      )}

      {/* ── Chat Mode ──────────────────────────────────────────────────── */}
      {mode === 'chat' && (
        <>
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-100 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary-800">{t('speaking.chatDescription')}</p>
                <p className="text-xs text-primary-600 mt-0.5">
                  {t('speaking.chatDescriptionDetail')}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {t('speaking.chatTopics')}
          </p>
          <div className="space-y-2 mb-6">
            {prompts.map((p) => {
              const topic: ChatTopic = {
                id: p.id,
                title: p.prompt.slice(0, 80) + (p.prompt.length > 80 ? '...' : ''),
                category: p.category,
                prompt: p.prompt,
              }
              return (
                <button
                  key={p.id}
                  onClick={() => onStartChat(topic)}
                  className="w-full card text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`badge text-xs ${CATEGORY_COLOR[p.category]}`}>
                          {CATEGORY_LABEL[p.category]}
                        </span>
                        <span className="text-xs text-gray-400">{p.level}</span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug line-clamp-2">{p.prompt}</p>
                    </div>
                    <MessageCircle size={16} className="text-primary-400 flex-shrink-0 mt-1" />
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
