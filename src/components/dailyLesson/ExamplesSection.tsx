import { Volume2 } from 'lucide-react'
import { AudioButton } from '../ui/AudioButton'
import { speak } from '../../lib/tts'
import { monitoring } from '../../lib/monitoring'
import { useI18n } from '../../i18n'

interface Props {
  examples: { en: string; uz: string }[]
}

export default function ExamplesSection({ examples }: Props) {
  const { t } = useI18n()
  return (
    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          📖 Misollar — {examples.length} ta gap
        </p>
        <button
          onClick={() => {
            const allText = examples.map(e => e.en).join('. ')
            speak(allText, { rate: 0.85 }).catch((e) =>
              monitoring.captureMessage(
                'LessonView speak all failed: ' + (e instanceof Error ? e.message : String(e)),
                'warn',
              ),
            )
          }}
          className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
          title="Barcha misollarni tinglash"
          aria-label={t('aria.listenAll')}
        >
          <Volume2 size={12} /> Hammasini tinglash
        </button>
      </div>
      <div className="space-y-3">
        {examples.map((ex, i) => (
          <div key={i} className="flex items-start gap-3 border-l-4 border-primary-300 pl-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-relaxed">{ex.en}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 italic">{ex.uz}</p>
            </div>
            <AudioButton text={ex.en} size="sm" className="mt-0.5 shrink-0" label={`${ex.en} ni tinglash`} />
          </div>
        ))}
      </div>
    </div>
  )
}
