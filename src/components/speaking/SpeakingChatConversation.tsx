import { useRef, useEffect } from 'react'
import { ChevronLeft, Mic, MicOff, RotateCcw, Send, Square, Brain, MessageCircle } from 'lucide-react'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/data/speakingPrompts'
import type { SpeechRecognitionState } from '@/hooks/useSpeechRecognition'
import type { ChatMessage, ChatTopic } from './speakingHelpers'

interface SpeakingChatConversationProps {
  chatMessages: ChatMessage[]
  chatLoading: boolean
  streamingText: string
  sr: SpeechRecognitionState
  chatTopic: ChatTopic | null
  turnCount: number
  canSend: boolean
  srReady: boolean
  t: (key: string, params?: Record<string, string>) => string
  onSendMessage: () => void
  onEndChat: () => void
  onBack: () => void
}

export default function SpeakingChatConversation({
  chatMessages, chatLoading, streamingText, sr, chatTopic, turnCount, canSend, srReady,
  t, onSendMessage, onEndChat, onBack,
}: SpeakingChatConversationProps) {
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, streamingText])

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(var(--vh, 1vh) * 100 - 8rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-ghost p-2 rounded-xl">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h2 className="font-bold text-sm text-gray-900 dark:text-white">{t('speaking.chatDescription')}</h2>
            {chatTopic && (
              <span className={`badge text-xs ${CATEGORY_COLOR[chatTopic.category]}`}>
                {CATEGORY_LABEL[chatTopic.category]}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{t('speaking.chatTurn', { count: String(turnCount) })}</span>
          <button
            onClick={onEndChat}
            disabled={chatLoading}
            className="btn-ghost text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium disabled:opacity-40"
          >
            <Square size={12} className="inline mr-1" /> {t('speaking.chatEnd')}
          </button>
        </div>
      </div>

      {/* Topic card */}
      {chatTopic && (
        <div className="card bg-b2-50 border-b2-100 mb-3 flex-shrink-0">
          <div className="flex items-start gap-2">
            <Brain size={16} className="text-b2-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 leading-relaxed">{chatTopic.prompt}</p>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 px-0.5 scroll-smooth mobile-safe-bottom">
        {chatMessages.length === 0 && !chatLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-3 animate-pulse">
              <MessageCircle size={28} className="text-primary-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">{t('speaking.chatWaiting')}</p>
            <p className="text-xs text-gray-400 mt-1">{t('speaking.chatPleaseWait')}</p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.timestamp}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                msg.role === 'user'
                  ? 'bg-b2-600 text-white rounded-br-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Brain size={12} className="text-primary-500" />
                  <span className="text-xs font-semibold text-primary-600">{t('speaking.chatClaude')}</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {chatLoading && streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-gray-100 text-gray-800 rounded-bl-md">
              <div className="flex items-center gap-1.5 mb-1">
                <Brain size={12} className="text-primary-500" />
                <span className="text-xs font-semibold text-primary-600">Claude AI</span>
              </div>
              <p className="text-sm leading-relaxed">
                {streamingText}
                <span className="inline-block w-1.5 h-4 bg-primary-400 ml-0.5 animate-pulse align-middle" />
              </p>
            </div>
          </div>
        )}

        {/* Loading indicator (no text yet) */}
        {chatLoading && !streamingText && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0">
        {/* Speech recognition transcript */}
        {sr.isRecording && (
          <div className="card bg-b2-50 border-b2-100 mb-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 animate-pulse flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">
                {sr.transcript}
                {sr.interim && <span className="text-gray-400">{sr.interim}</span>}
              </p>
            </div>
          </div>
        )}

        {/* Last sent transcript preview */}
        {!sr.isRecording && sr.transcript.trim() && (
          <div className="card bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 mb-2">
            <p className="text-xs text-gray-700 leading-relaxed">{sr.transcript}</p>
          </div>
        )}

        {/* Control buttons */}
        <div className="flex items-center gap-2">
          {sr.permissionError && !sr.isRecording && (
            <div className="text-center w-full">
              <p className="text-xs text-amber-600 font-medium">
                {t('speaking.micPermissionDenied')}
              </p>
              <button
                onClick={() => { sr.reset(); sr.start() }}
                className="mt-1.5 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                <RotateCcw size={11} className="inline mr-1" />
                {t('speaking.micRetry')}
              </button>
            </div>
          )}
          {!sr.isRecording ? (
            <button
              onClick={() => sr.start()}
              disabled={!sr.isSupported || chatLoading}
              className="btn-primary flex-1 text-sm flex items-center justify-center gap-2 py-3 disabled:opacity-40"
            >
              <Mic size={18} /> {t('speaking.chatMicButton')}
            </button>
          ) : (
            <button
              onClick={() => sr.stop()}
              className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2 py-3"
            >
              <MicOff size={18} className="text-red-500" /> {t('speaking.chatStopButton')}
            </button>
          )}

          {!sr.isRecording && sr.transcript.trim() && (
            <button
              onClick={onSendMessage}
              disabled={!canSend}
              className="btn-primary text-sm flex items-center justify-center gap-1.5 py-3 px-5 disabled:opacity-40"
            >
              <Send size={16} /> {t('speaking.chatSendButton')}
            </button>
          )}

          {!sr.isRecording && !sr.transcript.trim() && !chatLoading && (
            <button
              onClick={() => sr.reset()}
              className="btn-ghost p-3 rounded-xl text-gray-400 hover:text-gray-600"
              title={t('common.reset')}
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="mt-2 text-center">
          {srReady && !chatLoading && (
            <p className="text-xs text-gray-400">
              {t('speaking.chatInputTip')}
            </p>
          )}
          {chatLoading && (
            <p className="text-xs text-primary-500 animate-pulse">{t('speaking.chatClaudeLoading')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
