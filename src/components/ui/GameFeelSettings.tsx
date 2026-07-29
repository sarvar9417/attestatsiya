import { Volume2, Vibrate, Sparkles } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { isSpeechSupported } from '../../lib/tts'

export default function GameFeelSettings() {
  const {
    soundEnabled,
    vibrationEnabled,
    setSoundEnabled,
    setVibrationEnabled,
  } = useStore()

  const supportsVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator

  // Preview sound on toggle
  function handleSoundToggle(v: boolean) {
    setSoundEnabled(v)
    if (v && isSpeechSupported()) {
      try {
        const utterance = new SpeechSynthesisUtterance('✓')
        utterance.volume = 0.3
        utterance.rate = 2
        speechSynthesis.speak(utterance)
      } catch { /* ignore */ }
    }
  }

  // Preview vibration on toggle
  function handleVibrationToggle(v: boolean) {
    setVibrationEnabled(v)
    if (v && supportsVibration) {
      navigator.vibrate(50)
    }
  }

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
        <Sparkles size={15} className="text-yellow-500" />
        O'yin sozlamalari
      </h3>

      <div className="space-y-3">
        {/* Sound toggle */}
        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Volume2 size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Tovush</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                To'g'ri javob, streak, level-up ovozlari
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={soundEnabled}
            onChange={handleSoundToggle}
            id="sound-toggle"
            label="Tovush"
          />
        </div>

        {/* Vibration toggle */}
        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <Vibrate size={16} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Vibratsiya</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Noto'g'ri javob, combo, boss fight effektlari
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={vibrationEnabled}
            onChange={handleVibrationToggle}
            id="vibration-toggle"
            label="Vibratsiya"
          />
        </div>
      </div>
    </div>
  )
}

function ToggleSwitch({
  checked,
  onChange,
  id,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  id: string
  label: string
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2
        focus:ring-primary-500 focus:ring-offset-2
        ${checked
          ? 'bg-primary-600 dark:bg-primary-500'
          : 'bg-gray-200 dark:bg-gray-600'
        }
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
          transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  )
}
