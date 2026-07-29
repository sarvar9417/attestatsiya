import { useState, useRef, useCallback } from 'react'
import { Mic, Square, RotateCcw } from 'lucide-react'

interface Props {
  correctText: string
  onComplete: (correct: number) => void
}

export default function ListeningDictation({ correctText, onComplete }: Props) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'review'>('idle')
  const [correctWords, setCorrectWords] = useState<{ word: string; correct: boolean }[]>([])
  const recognitionRef = useRef<{ stop: () => void } | null>(null)

  const startRecording = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Browser qo\'llab-quvvatlamaydi')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setStatus('review')

      const correctArr = correctText.toLowerCase().split(/\s+/)
      const userArr = transcript.toLowerCase().split(/\s+/)
      const maxLen = Math.max(correctArr.length, userArr.length)
      const words: { word: string; correct: boolean }[] = []
      let correctCount = 0

      for (let i = 0; i < maxLen; i++) {
        const c = correctArr[i] || ''
        const u = userArr[i] || ''
        const isCorrect = c === u
        if (isCorrect) correctCount++
        words.push({ word: u || `( ${c} )`, correct: isCorrect })
      }

      setCorrectWords(words)
      onComplete(correctCount)
    }

    recognition.onerror = () => setStatus('review')
    recognition.onend = () => {
      setStatus((prev) => (prev === 'recording' ? 'review' : prev))
    }

    recognition.start()
    setStatus('recording')
  }, [correctText, onComplete])

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop()
    setStatus('review')
  }, [])

  const reset = useCallback(() => {
    setCorrectWords([])
    setStatus('idle')
    recognitionRef.current = null
  }, [])

  return (
    <div className="space-y-4">
      <div className="card">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Eshitganingizni yozing. Matn avtomatik tekshiriladi.</p>
        <div className="flex gap-2">
          {status === 'idle' && (
            <button onClick={startRecording} className="btn-primary flex items-center gap-2">
              <Mic size={16} /> Yozishni Boshlash
            </button>
          )}
          {status === 'recording' && (
            <button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <Square size={16} /> To'xtatish
            </button>
          )}
          {status === 'review' && (
            <button onClick={reset} className="btn-secondary flex items-center gap-2">
              <RotateCcw size={14} /> Qayta Sinab Ko'rish
            </button>
          )}
        </div>

        {status === 'recording' && (
          <div className="mt-3 flex items-end gap-0.5 h-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 rounded-full bg-red-500 animate-pulse"
                style={{ height: `${10 + Math.abs(Math.sin(i * 0.8)) * 14}px`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}

        {status === 'review' && correctWords.length > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Sizning Javobingiz:</p>
            <div className="flex flex-wrap gap-1.5 leading-relaxed">
              {correctWords.map((w, i) => (
                <span key={i}
                  className={`px-2 py-0.5 rounded-lg text-sm font-semibold transition-all ${w.correct ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 line-through'}`}>
                  {w.word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">To'g'ri Javob:</p>
        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{correctText}</p>
      </div>
    </div>
  )
}
