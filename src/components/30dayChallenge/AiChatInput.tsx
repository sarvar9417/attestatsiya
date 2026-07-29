import { useEffect } from 'react'
import { Send, Mic, Square, Zap, Volume2 } from 'lucide-react'
import type { ConversationMode } from './aiChatTypes'

interface SpeechRecognitionShape {
  isRecording: boolean
  isSupported: boolean
}

interface SpeechSynthesisShape {
  playing: boolean
  stop: () => void
}

interface Props {
  input: string
  isLoading: boolean
  mode: ConversationMode
  sr: SpeechRecognitionShape
  tts: SpeechSynthesisShape
  inputRef: React.RefObject<HTMLTextAreaElement>
  onInputChange: (value: string) => void
  onSend: () => void
  onToggleMic: () => void
  onStopSpeaking: () => void
}

export default function AiChatInput({
  input,
  isLoading,
  mode,
  sr,
  tts,
  inputRef,
  onInputChange,
  onSend,
  onToggleMic,
  onStopSpeaking,
}: Props) {
  // Auto-resize textarea on any input change (including speech recognition → setInput)
  useEffect(() => {
    const ta = inputRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
  }, [input, inputRef])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'roleplay' ? "Role-play dialogini yozing..." : "Xabar yozing yoki mikrofonni bosing..."}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary-500 resize-none max-h-[100px]"
          rows={1}
          disabled={isLoading}
        />

        {/* Mic button */}
        <button
          onClick={onToggleMic}
          disabled={isLoading}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-90 disabled:opacity-40 ${
            sr.isRecording
              ? 'bg-red-500 text-white animate-pulse shadow-lg'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          title={sr.isRecording ? "Yozib olishni to'xtatish" : "Mikrofon"}
        >
          {sr.isRecording ? <Square size={15} /> : <Mic size={16} />}
        </button>

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className={`w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-all shadow-md shrink-0 ${
            mode === 'roleplay'
              ? 'bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white'
              : 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
          }`}
        >
          {isLoading ? <Zap size={16} className="animate-pulse" /> : <Send size={16} />}
        </button>
      </div>

      {/* Recording indicator */}
      {sr.isRecording && (
        <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5 mt-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          Gapiryapsiz... to'xtatish uchun 🎤 bosing
        </p>
      )}

      {tts.playing && (
        <p className="text-xs text-primary-500 font-semibold flex items-center gap-1.5 mt-1.5">
          <Volume2 size={12} className="animate-pulse" />
          AI gapiryapti...
          <button onClick={onStopSpeaking} className="text-xs underline ml-1">To'xtatish</button>
        </p>
      )}
    </div>
  )
}
