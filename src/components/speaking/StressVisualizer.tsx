import { Volume2 } from 'lucide-react'
import { useI18n } from '../../i18n'

interface StressVisualizerProps {
  word: string
  ipa: string
  onSpeak?: (word: string) => void
}

function parseStressedSyllables(word: string, ipa: string): { syllable: string; stressed: boolean }[] {
  const isStressed = (syl: string) => syl.startsWith('ˈ') || syl.startsWith("'")
  const cleanSyl = (syl: string) => syl.replace(/^[ˈ'ˌ]/, '').replace(/[. ]$/, '')

  const ipaSyllables = ipa
    .replace(/^\/|\/$/g, '')
    .split(/[. ]/)
    .filter(Boolean)

  if (ipaSyllables.length <= 1) {
    return word.split(/(?=[A-Z])/).filter(Boolean).map(s => ({
      syllable: s,
      stressed: s === s.toUpperCase() && s.length > 1,
    }))
  }

  return ipaSyllables.map(s => ({
    syllable: cleanSyl(s),
    stressed: isStressed(s),
  }))
}

function getStressPattern(syllables: { stressed: boolean }[]): string {
  return syllables.map(s => (s.stressed ? 'STRONG' : 'weak')).join('-')
}

export default function StressVisualizer({ word, ipa, onSpeak }: StressVisualizerProps) {
  const { t } = useI18n()
  const syllables = parseStressedSyllables(word, ipa)
  const pattern = getStressPattern(syllables)

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('stressVis.title')}</span>
        <span className="text-xs text-gray-400 font-mono">{pattern}</span>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {syllables.map((s, i) => (
          <span
            key={i}
            className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-sm font-mono transition-colors ${
              s.stressed
                ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold ring-2 ring-rose-300 dark:ring-rose-700'
                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
            }`}
          >
            {s.syllable}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-rose-200 dark:bg-rose-800 ring-1 ring-rose-300 dark:ring-rose-700" />
          <span className="text-xs text-gray-500">{t('stressVis.stressed')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-600" />
          <span className="text-xs text-gray-500">{t('stressVis.unstressed')}</span>
        </div>
        {onSpeak && (
          <button
            onClick={() => onSpeak(word)}
            className="ml-auto p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
          >
            <Volume2 size={12} />
          </button>
        )}
      </div>
    </div>
  )
}
