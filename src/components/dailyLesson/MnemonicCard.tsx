import { Lightbulb } from 'lucide-react'

interface MnemonicCardProps {
  rule: string
  mnemonic: string
  visual?: string
  acronym?: string
}

const VISUAL_MAP: Record<string, string> = {
  'be verb': '👑',
  'good morning': '🌅',
  'peel': '🍎',
  'will vs going to': '⚡📅',
  'present perfect signal': '🔔',
}

export default function MnemonicCard({ rule, mnemonic, visual, acronym }: MnemonicCardProps) {
  const emoji = visual || VISUAL_MAP[rule.toLowerCase()] || '🧠'

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20
      border-l-4 border-yellow-400 dark:border-yellow-600 rounded-xl p-4 shadow-sm transition-all
      hover:shadow-md hover:border-yellow-500 group">
      <div className="flex items-start gap-3">
        {/* Emoji circle */}
        <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-800/40 flex items-center justify-center text-xl
          group-hover:scale-110 transition-transform flex-shrink-0">
          {emoji}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb size={14} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">
              Yodda saqlash
            </span>
          </div>

          {/* Acronym bubbles */}
          {acronym && (
            <div className="flex items-center gap-1 mb-2">
              {acronym.split('').map((char, i) => (
                <span key={i}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full
                    bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200
                    text-xs font-bold shadow-sm">
                  {char}
                </span>
              ))}
            </div>
          )}

          {/* Rule label */}
          {rule && (
            <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              {rule}
            </p>
          )}

          {/* Mnemonic text */}
          <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed italic">
            {mnemonic}
          </p>
        </div>
      </div>
    </div>
  )
}
