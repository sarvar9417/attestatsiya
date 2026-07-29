import { useState, useCallback, useRef, useEffect } from 'react'
import { Send, Volume2, Loader2, Sparkles, Shuffle, Mic, Square } from 'lucide-react'
import { startVocabPractice } from '../../lib/openaiChat'
import type { ChallengeVocab } from '../../data/30dayChallenge'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'

interface Props {
  vocabulary: ChallengeVocab[]
}

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

function pickRandom<T>(arr: T[], exclude?: T): T {
  const filtered = exclude ? arr.filter(x => x !== exclude) : arr
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export default function VocabPracticeChat({ vocabulary }: Props) {
  const tts = useSpeechSynthesis()
  const sr = useSpeechRecognition()
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [currentWord, setCurrentWord] = useState<ChallengeVocab | null>(null)
  const [practicedWords, setPracticedWords] = useState<Set<string>>(new Set())
  const [gameStarted, setGameStarted] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  // STT transcript → input
  useEffect(() => {
    if (sr.isRecording && sr.transcript) {
      setInput(prev => {
        const combined = (sr.transcript + ' ' + sr.interim).trim()
        return combined || prev
      })
    }
  }, [sr.transcript, sr.interim, sr.isRecording])

  const speakAiText = useCallback((text: string) => {
    if (voiceEnabled) {
      tts.speak(text).catch(() => {})
    }
  }, [voiceEnabled, tts])

  const startGame = useCallback(() => {
    tts.stop()
    if (sr.isRecording) sr.stop()
    const word = pickRandom(vocabulary)
    setCurrentWord(word)
    setMessages([])
    setPracticedWords(new Set())
    setGameStarted(true)
    setStreamingText('')
    setIsLoading(true)

    startVocabPractice(
      word,
      [],
      (token) => setStreamingText(prev => prev + token),
      (full) => {
        setMessages([{ role: 'assistant', content: full }])
        setStreamingText('')
        setIsLoading(false)
        speakAiText(full)
      },
      (err) => {
        setMessages(prev => [...prev, { role: 'assistant', content: `Xatolik yuz berdi: ${err.message}` }])
        setIsLoading(false)
      }
    )
  }, [vocabulary, tts, sr, speakAiText])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading || !currentWord) return
    if (sr.isRecording) sr.stop()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsLoading(true)
    setStreamingText('')

    const history: { role: 'user' | 'assistant'; content: string }[] = [
      ...messages,
      { role: 'user', content: text }
    ]

    startVocabPractice(
      currentWord,
      history,
      (token) => setStreamingText(prev => prev + token),
      (full) => {
        setMessages(prev => [...prev, { role: 'assistant', content: full }])
        setStreamingText('')
        setIsLoading(false)
        speakAiText(full)

        const remaining = vocabulary.filter(v => !practicedWords.has(v.word) && v.word !== currentWord.word)
        if ((remaining.length > 0 && full.includes('keyingi')) || full.includes('next word') || full.includes('yangi so\'z')) {
          const next = pickRandom(remaining)
          setPracticedWords(prev => new Set([...prev, currentWord.word]))
          setCurrentWord(next)
        }
      },
      (err) => {
        setMessages(prev => [...prev, { role: 'assistant', content: `Xatolik: ${err.message}` }])
        setIsLoading(false)
      }
    )
  }, [input, isLoading, currentWord, messages, vocabulary, practicedWords, sr, speakAiText])

  const toggleMic = useCallback(() => {
    if (sr.isRecording) {
      sr.stop()
    } else {
      tts.stop()
      setInput('')
      sr.reset()
      sr.start()
    }
  }, [sr, tts])

  if (!gameStarted) {
    return (
      <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/50 dark:border-indigo-800/30 p-6 text-center">
        <div className="text-4xl mb-3">🎮</div>
        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">AI bilan lug'at o'yini</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
          AI sizga o'zbekcha gap beradi, siz ingliz tiliga tarjima qilasiz. 
          So'ng o'zingiz gap tuzasiz. AI har tomonlama tekshirib, xatolarni tushuntiradi.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {vocabulary.slice(0, 8).map(v => (
            <span key={v.word} className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
              {v.word}
            </span>
          ))}
          {vocabulary.length > 8 && (
            <span className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-400">
              +{vocabulary.length - 8} ta
            </span>
          )}
        </div>
        <button
          onClick={startGame}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95 shadow-lg"
        >
          <Sparkles size={16} /> O'yinni boshlash
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎮</span>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">AI Lug'at o'yini</p>
            {currentWord && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                So'z: <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentWord.word}</span>
                <span className="text-gray-400"> — {currentWord.meaning}</span>
                {vocabulary.length > 1 && (
                  <span className="ml-2">({practicedWords.size + 1}/{vocabulary.length})</span>
                )}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setVoiceEnabled(v => !v)}
            className={`p-2 rounded-lg transition-all ${
              voiceEnabled
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title={voiceEnabled ? 'Ovoz o\'chirish' : 'Ovoz yoqish'}
          >
            <Volume2 size={16} />
          </button>
          <button
            onClick={startGame}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
          >
            <Shuffle size={12} /> Yangi o'yin
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
              m.role === 'user'
                ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-tr-sm'
                : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-tl-sm'
            }`}>
              {m.role === 'assistant' && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-1">AI Teacher</p>
              )}
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-tl-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-1">AI Teacher</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {streamingText}
                <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-0.5 animate-pulse" />
              </p>
            </div>
          </div>
        )}

        {isLoading && !streamingText && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <Loader2 size={14} className="animate-spin text-indigo-500" />
              <span className="text-xs text-gray-500">AI o'ylamoqda...</span>
            </div>
          </div>
        )}

        {/* TTS playing indicator */}
        {tts.playing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
              <Volume2 size={12} className="animate-pulse text-indigo-500" />
              <span className="text-xs text-indigo-600 dark:text-indigo-400">AI gapiryapti...</span>
              <button onClick={() => tts.stop()} className="text-xs underline text-indigo-500 hover:text-indigo-700 ml-1">To'xtatish</button>
            </div>
          </div>
        )}

        {/* Recording indicator */}
        {sr.isRecording && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-600 dark:text-red-400">Gapiryapsiz... to'xtatish uchun 🎤 bosing</span>
            </div>
          </div>
        )}

        {/* Permission error */}
        {sr.permissionError && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <span className="text-xs text-amber-600 dark:text-amber-400">Mikrofon ruxsati yo'q</span>
              <button onClick={() => { sr.reset(); sr.start() }} className="text-xs underline text-amber-600">Qayta urinish</button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex gap-2">
          <button
            onClick={toggleMic}
            disabled={!sr.isSupported || isLoading}
            className={`p-2.5 rounded-xl transition-all ${
              sr.isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            } disabled:opacity-40`}
            title={sr.isRecording ? 'To\'xtatish' : 'Mikrofon'}
          >
            {sr.isRecording ? <Square size={16} /> : <Mic size={16} />}
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder={sr.isRecording ? 'Gapiryapsiz...' : 'Javobingizni yozing...'}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95 disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}