import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Bot, X, Loader2 } from 'lucide-react'
import { chatWithBuddy, startBuddyVoiceChat, type BuddyContext } from '../../services/aiBuddyService'

interface AIBuddyChatProps {
  context: BuddyContext
  onClose: () => void
}

export default function AIBuddyChat({ context, onClose }: AIBuddyChatProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: `Hey ${context.userName}! 👋 I'm your AI Study Buddy. I can see you're on Day ${context.currentDay} at ${context.currentLevel} level with a ${context.streak}-day streak — amazing! What would you like to work on today?` },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  useEffect(() => {
    if (!voiceMode) {
      inputRef.current?.focus()
    }
  }, [voiceMode])

  function handleSend() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user' as const, content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setStreamingContent('')

    const history = [...messages, userMsg]

    chatWithBuddy(
      context,
      history,
      (token) => setStreamingContent(prev => prev + token),
      (full) => {
        setMessages(prev => [...prev, { role: 'assistant', content: full || '...' }])
        setStreamingContent('')
        setLoading(false)
      },
      () => {
        setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I couldn't respond right now. Please try again! 🙏` }])
        setStreamingContent('')
        setLoading(false)
      }
    )
  }

  function handleVoiceToggle() {
    if (voiceMode) {
      setVoiceMode(false)
      return
    }
    setVoiceMode(true)
    setLoading(true)
    setStreamingContent('')

    startBuddyVoiceChat(
      context,
      (token) => setStreamingContent(prev => prev + token),
      (full) => {
        setMessages(prev => [...prev, { role: 'assistant', content: full || 'Starting voice chat... Say something!' }])
        setStreamingContent('')
        setLoading(false)
      },
      () => {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Voice chat unavailable right now. Try text mode! 🎤' }])
        setStreamingContent('')
        setLoading(false)
        setVoiceMode(false)
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100dvh-4rem)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-sm">
            <Bot size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">AI Study Buddy</p>
            <p className="text-xs text-gray-400">{context.currentLevel} · Day {context.currentDay} · {context.streak} day streak</p>
          </div>
          {context.weakSpots && context.weakSpots.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-xs text-amber-600 dark:text-amber-400">
              <span>🎯</span>
              <span className="font-semibold">{context.weakSpots[0].label}</span>
            </div>
          )}
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/50">
          {messages.map((msg, i) => (
            <div key={`msg-${i}-${msg.role}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-md border border-gray-100 dark:border-gray-700 shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-md border border-gray-100 dark:border-gray-700 shadow-sm">
                {streamingContent}
                <span className="inline-block w-1.5 h-4 bg-purple-500 ml-0.5 animate-pulse" />
              </div>
            </div>
          )}
          {loading && !streamingContent && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3 border border-gray-100 dark:border-gray-700">
                <Loader2 size={16} className="text-purple-500 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <button
              onClick={handleVoiceToggle}
              className={`p-2.5 rounded-xl transition-colors ${
                voiceMode
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-500 animate-pulse'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30'
              }`}
              title={voiceMode ? 'Stop voice chat' : 'Start voice chat'}
            >
              {voiceMode ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={voiceMode ? 'Voice chat active...' : 'Type a message...'}
              disabled={loading || voiceMode}
              className="flex-1 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading || voiceMode}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white disabled:opacity-40 hover:shadow-md transition-all"
            >
              <Send size={18} />
            </button>
          </div>
          {context.weakSpots && context.weakSpots.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
              <span>🎯 Weak areas:</span>
              {context.weakSpots.slice(0, 3).map((w) => (
                <span key={w.label} className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md">
                  {w.label} ({w.score}%)
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
