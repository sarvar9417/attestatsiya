import { Mic, MicOff, RotateCcw, ChevronLeft, Volume2, Loader2 } from 'lucide-react'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/data/speakingPrompts'
import type { SpeakingPrompt } from '@/services/speakingService'
import type { SpeechRecognitionState } from '@/hooks/useSpeechRecognition'
import type { AudioRecorderState } from '@/hooks/useAudioRecorder'
import { speakText } from './speakingHelpers'
import AudioPlayback from './AudioPlayback'

interface SpeakingRecordViewProps {
  prompt: SpeakingPrompt
  sr: SpeechRecognitionState
  ar: AudioRecorderState
  timer: number
  evaluation: string
  isRecording: boolean
  isDone: boolean
  isEvaluating: boolean
  t: (key: string, params?: Record<string, string>) => string
  onStartRecording: () => void
  onStopRecording: () => void
  onReset: () => void
  onEvaluate: () => void
  onBack: () => void
}

export default function SpeakingRecordView({
  prompt, sr, ar, timer, evaluation,
  isRecording, isDone, isEvaluating,
  t, onStartRecording, onStopRecording, onReset, onEvaluate, onBack,
}: SpeakingRecordViewProps) {
  const mins  = Math.floor(timer / 60)
  const secs  = timer % 60

  return (
    <div className="p-3 sm:p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="btn-ghost p-2 rounded-xl">
          <ChevronLeft size={18} />
        </button>
        <div>
          <span className={`badge text-xs ${CATEGORY_COLOR[prompt.category]}`}>
            {CATEGORY_LABEL[prompt.category]}
          </span>
        </div>
      </div>

      {/* Prompt */}
      <div className="card bg-b2-50 border-b2-100 mb-5">
        <div className="flex items-start gap-2">
          <button
            onClick={() => speakText(prompt.prompt)}
            className="flex-shrink-0 mt-0.5 p-1 rounded-lg hover:bg-b2-100 transition-colors"
            title={t('speaking.speakTooltip')}
          >
            <Volume2 size={16} className="text-b2-500" />
          </button>
          <p className="text-sm text-gray-800 leading-relaxed font-medium">{prompt.prompt}</p>
        </div>
      </div>

      {/* Tips */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-1.5">{t('speaking.tipsHeader')}</p>
        <ul className="space-y-1">
          {prompt.tips.map((tip, i) => (
            <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
              <span className="text-b2-400 flex-shrink-0">•</span>{tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Mic button */}
      <div className="flex flex-col items-center gap-4 mb-5">
        {sr.permissionError && !isRecording && (
          <div className="card bg-amber-50 border-amber-100 w-full text-center">
            <p className="text-xs text-amber-700 font-medium flex items-center justify-center gap-1.5">
              <MicOff size={14} className="text-amber-500" />
              {t('speaking.micPermissionDenied')}
            </p>
            <button
              onClick={() => { sr.reset(); sr.start() }}
              className="mt-2 text-xs font-semibold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw size={12} className="inline mr-1" />
              {t('speaking.micRetry')}
            </button>
          </div>
        )}
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={!sr.isSupported || isEvaluating}
          aria-pressed={isRecording}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200
            shadow-lg active:scale-95
            ${isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-b2-600 hover:bg-b2-700'
            }
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isRecording
            ? <MicOff size={36} className="text-white" />
            : <Mic    size={36} className="text-white" />
          }
        </button>

        <div className="text-center">
          {isRecording && (
            <p className="text-sm font-mono text-red-500 font-semibold" aria-live="polite">
              {t('speaking.recordingTimer', { mins: String(mins), secs: String(secs).padStart(2, '0') })}
            </p>
          )}
          {!isRecording && !isDone && !sr.permissionError && (
            <p className="text-sm text-gray-400">{t('speaking.recordInstruction')}</p>
          )}
          {isDone && (
            <p className="text-sm text-green-600 font-medium">
              {t('speaking.recordDone', { duration: `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` })}
            </p>
          )}
        </div>
      </div>

      {/* Transcript display */}
      {(sr.transcript || sr.interim) && (
        <div className="card bg-gray-50 border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            {sr.transcript}
            {sr.interim && <span className="text-gray-400">{sr.interim}</span>}
          </p>
        </div>
      )}

      {/* Audio playback */}
      {isDone && ar.audioUrl && (
        <AudioPlayback audioUrl={ar.audioUrl} label="Sizning javobingiz" color="text-b2-600" />
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {(isDone || isRecording) && (
          <button onClick={onReset} className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1">
            <RotateCcw size={14} /> {t('speaking.recordRewind')}
          </button>
        )}
        {isDone && sr.transcript.trim() && (
          <button onClick={onEvaluate} disabled={isEvaluating} className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5">
            {isEvaluating
              ? <><Loader2 size={14} className="animate-spin" /> {t('speaking.evaluating')}</>
              : t('speaking.recordEvaluate')
            }
          </button>
        )}
      </div>

      {/* Evaluation streaming */}
      {isEvaluating && evaluation && (
        <div className="mt-4 card bg-primary-50 border-primary-100">
          <p className="text-xs font-semibold text-primary-700 mb-1">{t('speaking.evaluating')}</p>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {evaluation}
            <span className="inline-block w-1 h-3 bg-primary-400 ml-0.5 animate-pulse align-middle" />
          </pre>
        </div>
      )}
    </div>
  )
}
