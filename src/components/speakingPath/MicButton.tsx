// Speaking Path — qayta ishlatiladigan mikrofon tugmasi (STT o'rami).
// Endi yagona HoldMicButton'ni ishlatadi → butun Speaking Path bilan bir xil
// push-to-talk(+lock) tajriba. useSpeechRecognition (STT) ni o'raydi: bosib
// turilganda yozadi, qo'yib yuborilganda transcript'ni onResult orqali qaytaradi.

import { useEffect, useRef } from 'react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import HoldMicButton from './HoldMicButton'

interface Props {
  onResult: (transcript: string) => void
  /** STT qo'llab-quvvatlanmasligi haqida parent'ni xabardor qilish */
  onSupportChange?: (supported: boolean, permissionError: boolean) => void
  label?: string
  disabled?: boolean
}

export default function MicButton({ onResult, onSupportChange, label = 'Gapiring', disabled }: Props) {
  const { isSupported, isRecording, transcript, interim, permissionError, start, stop, reset } = useSpeechRecognition()
  const wasRecording = useRef(false)

  useEffect(() => {
    onSupportChange?.(isSupported, permissionError)
  }, [isSupported, permissionError, onSupportChange])

  // yozish tugagan paytni ushlaymiz → transcript'ni qaytaramiz
  useEffect(() => {
    if (wasRecording.current && !isRecording) {
      const t = transcript.trim()
      if (t) onResult(t)
    }
    wasRecording.current = isRecording
  }, [isRecording, transcript, onResult])

  const startRec = () => {
    if (disabled || isRecording) return
    reset()
    start()
  }
  const stopRec = () => {
    if (isRecording) stop()
  }

  if (!isSupported) {
    return (
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        🎤 Mikrofon bu brauzerda ishlamaydi
      </p>
    )
  }

  return (
    <HoldMicButton
      isRecording={isRecording}
      onStart={startRec}
      onStop={stopRec}
      disabled={disabled}
      idleLabel={`${label} (bosib turib)`}
      interim={interim}
    />
  )
}
