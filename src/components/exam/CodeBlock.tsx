import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
}

export default function CodeBlock({ code, language = 'c' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for non-secure contexts
    }
  }

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-border bg-[#0d1117] dark:bg-[#0a0d14] shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] dark:bg-[#0d1117] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5555] opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffaa33] opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#33cc66] opacity-80" />
          </div>
          <span className="text-[11px] font-medium text-[#8b949e] ml-2 uppercase tracking-wider">
            {language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium
                     text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d] transition-colors"
          aria-label={copied ? 'Nusxalandi' : 'Kodni nusxalash'}
        >
          {copied ? (
            <>
              <Check size={12} className="text-[#33cc66]" />
              <span className="text-[#33cc66]">Nusxalandi</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Nusxalash</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="px-4 py-3.5 text-sm leading-relaxed font-mono text-[#e6edf3]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

/**
 * Parses markdown text and extracts code blocks.
 * Returns an array of text/code segments.
 */
export function parseCodeBlocks(text: string): Array<{ type: 'text' | 'code'; content: string; language?: string }> {
  const segments: Array<{ type: 'text' | 'code'; content: string; language?: string }> = []
  const regex = /```(\w*)\n([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    // Add text before this code block
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index).trim() })
    }
    // Add the code block
    segments.push({
      type: 'code',
      language: match[1] || 'c',
      content: match[2].trim(),
    })
    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex).trim() })
  }

  // If no code blocks found, return as single text segment
  if (segments.length === 0) {
    segments.push({ type: 'text', content: text })
  }

  return segments
}
