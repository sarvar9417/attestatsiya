import { useState, useMemo } from 'react'
import { Volume2, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import { speak } from '../../lib/tts'
import { useStore } from '../../store/useStore'
import { personalizeText } from '../../utils/personalize'
import type { Dialogue } from '../../data/dailyLessons'
import { useI18n } from '../../i18n'
import { monitoring } from '../../lib/monitoring'

interface DialogueCardProps {
  dialogue: Dialogue
}

const SPEAKER_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Ali:    { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  Bobur:  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  Laziza: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', dot: 'bg-purple-500' },
  Dilshod: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  Sarvar: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', dot: 'bg-rose-500' },
  Aziz:   { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', dot: 'bg-cyan-500' },
  Malika: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800', dot: 'bg-pink-500' },
}

const SARVAR_STYLE = SPEAKER_COLORS['Sarvar']

function getSpeakerStyle(speaker: string) {
  return SPEAKER_COLORS[speaker] ?? SARVAR_STYLE
}

export default function DialogueCard({ dialogue }: DialogueCardProps) {
  const userName = useStore((s) => s.userName) || 'Talaba'
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)

  // Replace 'Sarvar' with the user's name throughout dialogue data
  function personalize(text: string): string {
    return personalizeText(text, userName)
  }

  const displayTitle = useMemo(() => personalizeText(dialogue.title, userName), [dialogue.title, userName])
  const displayContext = useMemo(() => personalizeText(dialogue.context, userName), [dialogue.context, userName])

  async function handleSpeak(text: string, lineId: string) {
    setPlayingId(lineId)
    try {
      await speak(text, { rate: 0.85 })
    } finally {
      setPlayingId(null)
    }
  }

  function handlePlayAll() {
    if (dialogue.lines.length === 0) return
    const firstId = dialogue.lines[0].speaker + '-0'
    setPlayingId(firstId)
    speakAll(0)
  }

  async function speakAll(idx: number) {
    if (idx >= dialogue.lines.length) {
      setPlayingId(null)
      return
    }
    const line = dialogue.lines[idx]
    const lineId = line.speaker + '-' + idx
    setPlayingId(lineId)
    try {
      await speak(personalize(line.text), { rate: 0.85 })
    } catch {
      monitoring.captureMessage('TTS playback failed in dialogue', 'warn')
      setPlayingId(null)
      return
    }
    await new Promise(r => setTimeout(r, 400))
    speakAll(idx + 1)
  }

  return (
    <div className="rounded-2xl border border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-indigo-50/50 dark:from-primary-900/10 dark:to-indigo-900/10 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-lg shrink-0">
          <MessageCircle size={18} className="text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1 text-left">              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{displayTitle}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{displayContext}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handlePlayAll() }}
            className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
            title="Hammasini tinglash"
            aria-label={t('aria.listenAll')}
          >
            <Volume2 size={14} />
          </button>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="border-t border-primary-100 dark:border-primary-800 px-4 py-3 space-y-2 animate-slide-down">
          {dialogue.lines.map((line, idx) => {
            const isMainCharacter = line.speaker === 'Sarvar'
            // Replace 'Sarvar' with user's name for speaker display, but keep original for color lookup
            const displaySpeaker = isMainCharacter ? userName : line.speaker
            const style = getSpeakerStyle(displaySpeaker)
            // Personalize all dialogue text — replace 'Sarvar' with user's name in every line
            const lineText = personalize(line.text)
            const lineTranslation = personalize(line.translation)
            const lineId = line.speaker + '-' + idx
            const isPlaying = playingId === lineId
            return (
              <div key={idx} className={`flex items-start gap-2.5 p-2.5 rounded-xl ${style.bg} ${style.border} border`}>
                {/* Speaker dot */}
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
                      {displaySpeaker}
                    </span>
                    <button
                      onClick={() => handleSpeak(lineText, lineId)}
                      className={`p-1 rounded-md transition-colors ${isPlaying ? 'bg-primary-200 dark:bg-primary-800 text-primary-600 animate-pulse' : 'text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30'}`}
                      title="Bu qatorni tinglash"
                      aria-label={`${displaySpeaker}: ${lineText} ni tinglash`}
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                    {lineText}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">
                    {lineTranslation}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
