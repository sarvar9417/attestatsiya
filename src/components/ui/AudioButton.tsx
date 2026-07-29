import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, ChevronDown, Gauge } from 'lucide-react'
import { isSpeechSupported } from '../../lib/tts'
import { useSpeechSynthesis, SPEED_OPTIONS } from '../../hooks/useSpeechSynthesis'
import { useI18n } from '../../i18n'

interface AudioButtonProps {
  text: string
  /** Override global speed for this specific button (0.5–1.3). Default: hook's speed. */
  rate?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
  /** Show speed/voice controls in a popover */
  showSettings?: boolean
}

const SIZE_CLASSES = {
  sm: 'w-6 h-6 p-1',
  md: 'w-8 h-8 p-1.5',
  lg: 'w-10 h-10 p-2',
}

const ICON_SIZES = { sm: 14, md: 16, lg: 20 }

/**
 * Audio play button with speed & voice controls.
 * When `showSettings` is true, click the chevron to open a settings popover.
 * Speed/voice settings are persisted in localStorage and shared across components.
 */
export function AudioButton({ text, rate, size = 'md', className = '', label, showSettings }: AudioButtonProps) {
  const { t } = useI18n()
  const { playing, voices, selectedVoice, speed, setVoice, setSpeed, speak: speakTTS, stop } = useSpeechSynthesis()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  async function handleClick() {
    if (playing) {
      stop()
      return
    }
    await speakTTS(text, rate)
  }

  function handleContextMenu(e: React.MouseEvent) {
    if (showSettings) {
      e.preventDefault()
      setSettingsOpen((o) => !o)
    }
  }

  // Close settings on outside click
  useEffect(() => {
    if (!settingsOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [settingsOpen])

  if (!isSpeechSupported()) return null

  const iconSize = ICON_SIZES[size]

  return (
    <span className="relative inline-flex items-center gap-0.5" ref={settingsRef}>
      <button
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        aria-label={label ?? `"${text}" ni tinglash`}
        title={label ?? `"${text}" ni tinglash`}
        className={`
          rounded-full transition-all duration-200 flex items-center justify-center
          ${SIZE_CLASSES[size]}
          ${playing
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 animate-pulse'
            : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-blue-900/30'
          }
          ${className}
        `}
      >
        {playing
          ? <VolumeX size={iconSize} />
          : <Volume2 size={iconSize} />
        }
      </button>

      {showSettings && (
        <button
          onClick={() => setSettingsOpen((o) => !o)}
          className={`rounded-full w-5 h-5 flex items-center justify-center transition-colors ${
            settingsOpen
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Ovoz sozlamalari"
          aria-label={t('aria.audioSettings')}
        >
          <ChevronDown size={12} />
        </button>
      )}

      {/* Settings popover */}
      {settingsOpen && showSettings && (
        <div className="absolute z-50 top-full mt-1 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 min-w-[200px] space-y-3">
          {/* Speed */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              <Gauge size={12} />
              <span>Tezlik</span>
              <span className="ml-auto text-gray-400 font-mono">{speed}x</span>
            </div>
            <div className="flex gap-1">
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSpeed(opt.value)}
                  className={`flex-1 text-xs font-semibold px-1 py-1.5 rounded-lg transition-colors ${
                    speed === opt.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={opt.label}
                >
                  {opt.value}x
                </button>
              ))}
            </div>
          </div>

          {/* Voice */}
          {voices.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Ovoz</div>
              <div className="max-h-[120px] overflow-y-auto space-y-0.5">
                {voices.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setVoice(v.name)}
                    className={`w-full text-left text-xs px-2 py-1 rounded-lg transition-colors ${
                      selectedVoice?.name === v.name
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="block truncate">{v.name.replace(/^Microsoft |Google /, '')}</span>
                    <span className="text-[9px] text-gray-400">{v.lang}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </span>
  )
}

/**
 * Standalone SpeakButton — full settings panel, larger click target.
 */
export function SpeakButton({ text, label }: { text: string; label?: string }) {
  const { playing, speak: speakTTS, stop } = useSpeechSynthesis()

  if (!isSpeechSupported()) return null

  return (
    <button
      onClick={() => (playing ? stop() : speakTTS(text))}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
        active:scale-95 ${
        playing
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 animate-pulse'
          : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900/30'
      }`}
      aria-label={label ?? `"${text}" ni tinglash`}
    >
      {playing ? <VolumeX size={14} /> : <Volume2 size={14} />}
      {label ?? (playing ? 'To\'xtatish' : 'Tinglash')}
    </button>
  )
}
