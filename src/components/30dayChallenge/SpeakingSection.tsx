import { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, Square, Play, RotateCcw, Sparkles } from 'lucide-react'
import type { ChallengeSpeaking } from '../../data/30dayChallenge'

interface Props {
  speaking: ChallengeSpeaking
}

export default function SpeakingSection({ speaking }: Props) {
  const [isRecording, setIsRecording] = useState(false)
  const [timer, setTimer] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(30).fill(0))
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const revokedRef = useRef(false)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (audioUrl && !revokedRef.current) {
        revokedRef.current = true
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Setup audio analyzer for visualization
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      // Pre-compute bar positions for deterministic visualization
      const barPositions = Array.from({ length: 30 }, (_, i) => i / 30)

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        revokedRef.current = false  // Reset for new recording
        setAudioUrl(URL.createObjectURL(blob))
        setRecordingComplete(true)
        stream.getTracks().forEach(t => t.stop())
        audioCtx.close()
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        setAudioLevels(Array(30).fill(0))
      }

      recorder.start()
      setIsRecording(true)
      setTimer(0)
      setRecordingComplete(false)

      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)

      // Audio level monitoring with deterministic bars
      const updateLevel = () => {
        if (!analyserRef.current) return
        const data = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(data)
        const levels = barPositions.map(pos => {
          const idx = Math.floor(pos * data.length)
          return Math.min(1, data[idx] / 255)
        })
        setAudioLevels(levels)
        animationFrameRef.current = requestAnimationFrame(updateLevel)
      }
      updateLevel()
    } catch {
      alert('Mikrofonni ochib bo\'lmadi. Iltimos, ruxsat bering.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
  }, [])

  const resetRecording = useCallback(() => {
    if (audioUrl && !revokedRef.current) {
      revokedRef.current = true
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    setTimer(0)
    setRecordingComplete(false)
    chunksRef.current = []
  }, [audioUrl])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // Progress percentage for timer ring
  const timerPct = speaking.practiceTime > 0 ? Math.min(100, (timer / speaking.practiceTime) * 100) : 0

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Mic size={18} className="text-primary-600" />
        Speaking amaliyoti
      </h3>

      {/* Prompt */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 p-5 text-white shadow-xl">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        <p className="text-xs font-bold text-white/70 mb-2 flex items-center gap-1">
          <Sparkles size={12} /> Speaking prompt
        </p>
        <p className="text-sm sm:text-base font-medium leading-relaxed">{speaking.prompt}</p>
      </div>

      {/* Timer and recording */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center gap-8">
          {/* Timer ring */}
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6"
                className="text-gray-100 dark:text-gray-700" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - timerPct / 100)}`}
                className={`transition-all duration-1000 ${isRecording ? 'text-red-500' : recordingComplete ? 'text-green-500' : 'text-primary-500'}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`text-2xl font-black font-mono ${isRecording ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                {formatTime(timer)}
              </span>
              <span className="text-xs text-gray-400">/{formatTime(speaking.practiceTime)}</span>
            </div>
          </div>

          {/* Audio level visualization */}
          {isRecording && (
            <div className="flex items-end gap-0.5 h-16">
              {audioLevels.map((level, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-red-400 to-red-600 transition-all duration-75"
                  style={{
                    height: `${Math.max(8, level * 100)}%`,
                    opacity: 0.3 + level * 0.7,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-4">
          {!isRecording && !audioUrl && (
            <button
              onClick={startRecording}
              className="group relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95 text-white flex items-center justify-center shadow-lg transition-all"
            >
              <Mic size={28} className="group-hover:animate-pulse" />
              <span className="absolute -bottom-8 text-xs text-gray-500 whitespace-nowrap">Boshlash</span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center shadow-lg animate-pulse"
            >
              <Square size={20} />
              <span className="absolute -bottom-8 text-xs text-gray-500 whitespace-nowrap">To'xtatish</span>
            </button>
          )}

          {audioUrl && !isRecording && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const audio = new Audio(audioUrl)
                  audio.play()
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 active:scale-95 text-white flex items-center justify-center shadow-lg transition-all"
              >
                <Play size={22} />
                <span className="absolute -bottom-8 text-xs text-gray-500 whitespace-nowrap">Tinglash</span>
              </button>
              <button
                onClick={resetRecording}
                className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 text-gray-600 dark:text-gray-300 flex items-center justify-center shadow-lg transition-all"
              >
                <RotateCcw size={20} />
                <span className="absolute -bottom-8 text-xs text-gray-500 whitespace-nowrap">Qayta</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 p-4">
        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 uppercase flex items-center gap-1">
          <Sparkles size={12} /> Maslahatlar
        </p>
        <ul className="space-y-1.5">
          {speaking.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
              <span className="text-amber-500 shrink-0 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {!isRecording && !audioUrl && (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 animate-pulse">
          🎤 Yuqoridagi prompt asosida gapiring va yozib oling
        </p>
      )}
    </div>
  )
}
