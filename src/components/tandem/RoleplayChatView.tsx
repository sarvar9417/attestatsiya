import { useRef, useEffect } from 'react'
import { ArrowLeft, Volume2, Lightbulb, Mic, Square, Send } from 'lucide-react'
import type { Msg } from './RoleplayHelpers'

interface Props {
  scenario: { emoji: string; titleUz: string } | null
  messages: Msg[]
  streaming: string
  loading: boolean
  input: string
  voiceOn: boolean
  showHints: boolean
  isCreator: boolean
  turnCount: number
  hints: string[]
  isRecording: boolean
  isMicSupported: boolean
  onBack: () => void
  onToggleVoice: () => void
  onToggleHints: () => void
  onInputChange: (val: string) => void
  onSend: () => void
  onToggleMic: () => void
  onFinishTurn: () => void
  onHintClick: (hint: string) => void
}

export default function RoleplayChatView({
  scenario, messages, streaming, loading, input, voiceOn, showHints,
  isCreator, turnCount, hints, isRecording, isMicSupported,
  onBack, onToggleVoice, onToggleHints, onInputChange, onSend,
  onToggleMic, onFinishTurn, onHintClick,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, streaming])

  return (
    <div className="flex flex-col max-w-2xl mx-auto" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <span className="text-2xl">{scenario?.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{scenario?.titleUz}</p>
          <p className="text-xs text-gray-400 truncate">
            {isCreator ? "✋ Siz 1-o'yinchisiz" : "✋ Siz 2-o'yinchisiz"}
            {turnCount > 0 && ` · ${turnCount} ta xabar`}
          </p>
        </div>
        <button
          onClick={onToggleVoice}
          className={`p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center ${
            voiceOn ? 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Volume2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${
              m.role === 'user'
                ? 'bg-purple-500 text-white rounded-br-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3.5 py-2 rounded-2xl rounded-bl-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              {streaming}<span className="animate-pulse">▋</span>
            </div>
          </div>
        )}
        {loading && !streaming && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Hints */}
      {showHints && hints.length > 0 && (
        <div className="px-3 pb-1 flex flex-wrap gap-1.5">
          {hints.map((h) => (
            <button key={h} onClick={() => onHintClick(h)}
              className="text-xs px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
            >{h}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-2">
        <div className="flex items-center justify-between">
          <button onClick={onToggleHints} className="text-xs text-purple-500 font-semibold flex items-center gap-1 min-h-[44px]">
            <Lightbulb size={14} /> Yordam iboralari
          </button>
          {turnCount >= 2 && (
            <button onClick={onFinishTurn} className="text-xs text-gray-500 font-semibold underline min-h-[44px]">
              {isCreator ? "Rolimni tugatish →" : "Yakunlash →"}
            </button>
          )}
        </div>

        {isRecording && (
          <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 bg-rose-500 rounded-full" /> Tinglayapman… gapiring
          </p>
        )}

        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onSend() }}
            placeholder={isRecording ? 'Gapiring…' : 'Yozing yoki 🎤 bosib gapiring…'}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none focus:ring-2 ring-purple-400"
          />
          {isMicSupported && (
            <button onClick={onToggleMic} disabled={loading}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition active:scale-95 disabled:opacity-40 ${
                isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-purple-500'
              }`}
            >
              {isRecording ? <Square size={16} /> : <Mic size={18} />}
            </button>
          )}
          <button onClick={onSend} disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition shrink-0"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
