import { memo } from 'react'

export default memo(function RuleCard({ rule, index }: { rule: string; index: number }) {
  const sections = rule.split('\n\n').filter(Boolean)
  const titleRaw = sections[0]?.trim() || ''
  const titleClean = titleRaw.replace(/^[0-9#️⃣]+️?\s*/, '').replace(/[—-].*$/, '').replace(/\(.*?\)/, '').trim()

  const subSections = sections.slice(1).filter(s => {
    if (sections.length <= 2) return true
    return s.length > 15 || s.startsWith('📌') || s.startsWith('🔴') || s.startsWith('🔥')
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          {index + 1}
        </span>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">{titleClean || 'Qoida'}</p>
      </div>

      <div className="px-4 py-3 space-y-4">
        {subSections.length === 0 && sections.length > 1 ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{sections.slice(1).join('\n\n')}</p>
        ) : null}

        {subSections.map((sec, si) => {
          const lines = sec.split('\n').map(l => l.trim()).filter(Boolean)
          if (lines.length === 0) return null

          const firstLine = lines[0]
          const emoji = firstLine.match(/^([📌🔴🔥🎯⭐📍])/)
          const isErrorSection = firstLine.includes('❌') || firstLine.includes('✅')
          const isPercentageSection = firstLine.includes('100%') || firstLine.includes('%')

          if (emoji) {
            const titleLine = lines.find(l => l.match(/^[📌🔴🔥🎯⭐📍]/))
            const title = titleLine ? titleLine.replace(/^[📌🔴🔥🎯⭐📍]\s*/, '').trim() : ''
            const exampleLines = lines.filter(l => l.startsWith('→') || l.startsWith('  →'))
            const errorLines = lines.filter(l => l.includes('❌') || l.includes('✅'))
            const bulletLines = lines.filter(l => l.startsWith('•') || l.startsWith('  •'))
            const otherLines = lines.filter(l => {
              const t = l.replace(/^[📌🔴🔥🎯⭐📍]\s*/, '')
              return !t.startsWith('→') && !t.includes('❌') && !t.includes('✅') && !t.startsWith('•') && t !== title && !l.match(/^[📌🔴🔥🎯⭐📍]/) && !l.match(/^\d+%/)
            })
            const percentageLines = lines.filter(l => l.match(/^\d+%/) || l.match(/^  \d+%/))

            return renderEmojiSection(si, emoji[1], title, otherLines, percentageLines, bulletLines, exampleLines, errorLines)
          }

          if (isErrorSection) {
            return renderErrorSection(si, lines)
          }

          if (isPercentageSection) {
            return renderPercentageSection(si, lines)
          }

          return (
            <div key={si} className="space-y-2">
              {lines.filter(l => {
                if (lines[0] === titleClean && l === lines[0]) return false
                return true
              }).map((l, li) => {
                // Highlight lines with arrows (examples)
                if (l.startsWith('→') || l.startsWith('  →')) {
                  return (
                    <div key={li} className="flex items-start gap-2 pl-1">
                      <span className="text-indigo-400 font-bold flex-shrink-0 mt-0.5 text-xs">→</span>
                      <code className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-gray-200 font-mono border border-gray-200 dark:border-gray-700">
                        {l.replace(/^→\s*/, '').replace(/^  →\s*/, '')}
                      </code>
                    </div>
                  )
                }
                // Highlight lines with bullets
                if (l.startsWith('•') || l.startsWith('  •')) {
                  return (
                    <p key={li} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 pl-1">
                      <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                      <span>{l.replace(/^[•\s]+/, '')}</span>
                    </p>
                  )
                }
                // Default: plain text
                return <p key={li} className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{l}</p>
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
})

function renderEmojiSection(si: number, emoji: string, title: string, otherLines: string[], percentageLines: string[], bulletLines: string[], exampleLines: string[], errorLines: string[]) {
  return (
    <div key={si} className="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
      {title && (
        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-2 flex items-center gap-1.5">
          <span className="text-base">{emoji}</span>
          <span>{title}</span>
        </p>
      )}
      {otherLines.length > 0 && otherLines.map((l, li) => (
        <p key={`o-${li}`} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-1">{l}</p>
      ))}
      {percentageLines.length > 0 && (
        <div className="space-y-1 mb-2">
          {percentageLines.map((l, li) => {
            const m = l.match(/^(\s*)(\d+)%\s*→\s*(.+)/)
            if (m) {
              const pct = parseInt(m[2])
              let barColor = 'bg-green-400'
              if (pct <= 20) barColor = 'bg-red-400'
              else if (pct <= 50) barColor = 'bg-yellow-400'
              else if (pct <= 80) barColor = 'bg-blue-400'
              else barColor = 'bg-green-500'
              return (
                <div key={li} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 text-xs text-gray-500 font-mono text-right">{m[2]}%</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-sm text-gray-700 w-full">{m[3]}</div>
                </div>
              )
            }
            return <p key={li} className="text-sm text-gray-700 dark:text-gray-300">{l.replace(/^\s*/, '')}</p>
          })}
        </div>
      )}
      {bulletLines.length > 0 && (
        <div className="space-y-1 mb-2">
          {bulletLines.map((l, li) => (
            <p key={`b-${li}`} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 pl-1">
              <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
              <span>{l.replace(/^[•\s]+/, '')}</span>
            </p>
          ))}
        </div>
      )}
      {exampleLines.length > 0 && (
        <div className="space-y-1.5 mt-2">
          {exampleLines.map((l, li) => (
            <div key={`e-${li}`} className="flex items-start gap-2 pl-1">
              <span className="text-indigo-400 font-bold flex-shrink-0 mt-0.5 text-xs">→</span>
              <code className="text-sm bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg text-gray-800 dark:text-gray-200 font-mono w-full border border-gray-200 dark:border-gray-700 shadow-sm">
                {l.replace(/^→\s*/, '').replace(/^  →\s*/, '')}
              </code>
            </div>
          ))}
        </div>
      )}
      {errorLines.length > 0 && (
        <div className="space-y-1 mt-2">
          {errorLines.map((l, li) => (
            <div key={`er-${li}`} className="bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 border border-red-100 dark:border-red-800">
              {renderSplitErrorLine(l, li)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function renderErrorSection(si: number, lines: string[]) {
  return (
    <div key={si} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-100 dark:border-red-800 space-y-1">
      {lines.map((l, li) => renderSplitErrorLine(l, li))}
    </div>
  )
}

function renderSplitErrorLine(line: string, key: string | number) {
  const segments = line.split(/(?=[✅❌])/).filter(Boolean)
  const emojiSegments = segments.filter(s => s.startsWith('✅') || s.startsWith('❌'))
  if (emojiSegments.length <= 1) {
    const parts = line.split(/([❌✅])/g)
    return (
      <p key={key} className="flex items-start gap-1.5 text-sm flex-wrap">
        {parts.map((part, pi) => {
          if (part === '❌') return <span key={pi} className="text-red-500 font-bold flex-shrink-0 text-lg">✕</span>
          if (part === '✅') return <span key={pi} className="text-green-500 font-bold flex-shrink-0 text-lg">✓</span>
          if (line.includes('❌') && (part.includes('noto\'g\'ri') || part.includes('NOTO\'G\'RI'))) return <span key={pi} className="line-through text-red-600">{part}</span>
          return <span key={pi}>{part}</span>
        })}
      </p>
    )
  }
  return (
    <div key={key} className="space-y-1">
      {segments.map((seg, si) => {
        if (!seg.startsWith('✅') && !seg.startsWith('❌')) {
          return <p key={si} className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{seg}</p>
        }
        const isGood = seg.startsWith('✅')
        const text = seg.slice(1).trim()
        return (
          <p key={si} className="flex items-start gap-1.5 text-sm flex-wrap">
            <span className={isGood ? 'text-green-500 font-bold flex-shrink-0 text-lg' : 'text-red-500 font-bold flex-shrink-0 text-lg'}>
              {isGood ? '✓' : '✕'}
            </span>
            <span>{text}</span>
          </p>
        )
      })}
    </div>
  )
}

function renderPercentageSection(si: number, lines: string[]) {
  return (
    <div key={si} className="space-y-1">
      {lines.map((l, li) => {
        const m = l.match(/^(\d+)%\s*→\s*(.+)/)
        if (m) {
          const pct = parseInt(m[1])
          let barColor = 'bg-green-400'
          if (pct <= 20) barColor = 'bg-red-400'
          else if (pct <= 50) barColor = 'bg-yellow-400'
          else if (pct <= 80) barColor = 'bg-blue-400'
          return (
            <div key={li} className="flex items-center gap-2">
              <div className="flex-shrink-0 w-10 text-xs text-gray-500 font-mono text-right">{m[1]}%</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="text-sm text-gray-700">{m[2]}</div>
            </div>
          )
        }
        return <p key={li} className="text-sm text-gray-700">{l}</p>
      })}
    </div>
  )
}
