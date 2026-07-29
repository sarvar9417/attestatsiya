// Yagona "bosib turib gapirish" (push-to-talk) mikrofon tugmasi — Telegram uslubi.
//
// Usul:
//   • Bosib turing → yozadi (push-to-talk). Qo'yib yuborsangiz → to'xtaydi va yuboradi.
//   • Bosib turib YUQORIGA suring → "qulflanadi" (hands-free): qo'lni qo'yib
//     yuborsangiz ham yozishda davom etadi. Keyin bir bosib to'xtatasiz.
//
// Mobil ishonchliligi: setPointerCapture bilan barmoq qimirlaganda ham pointer
// tugmada qoladi. touch-none + preventDefault brauzer scroll/zoom/long-press'ni
// bloklaydi. onPointerLeave ISHLATILMAYDI (mobil'da mikro-harakatда yozishni
// noto'g'ri to'xtatardi).

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Lock, ChevronUp } from 'lucide-react'

interface Props {
  /** Hozir yozilyaptimi (parent holati) */
  isRecording: boolean
  /** Yozishni boshlash */
  onStart: () => void
  /** Yozishni to'xtatish (va natijani yuborish) */
  onStop: () => void
  disabled?: boolean
  /** Tinch holatdagi yozuv */
  idleLabel?: string
  /** Yozayotgandagi jonli matn (STT interim) */
  interim?: string
  size?: 'md' | 'lg'
}

const LOCK_THRESHOLD = 55 // px — shuncha yuqoriga surilsa qulflanadi

export default function HoldMicButton({
  isRecording, onStart, onStop, disabled, idleLabel = 'Bosib turib gapiring', interim, size = 'lg',
}: Props) {
  const [locked, setLocked] = useState(false)
  const [sliding, setSliding] = useState(false) // bosib turilmoqda, hali qulflanmagan
  const holdingRef = useRef(false)
  const startYRef = useRef(0)

  // Yozish tashqaridan tugasa (yoki to'xtatilsa) — holatni tozalaymiz
  useEffect(() => {
    if (!isRecording) { setLocked(false); setSliding(false); holdingRef.current = false }
  }, [isRecording])

  const dim = size === 'lg' ? 'w-16 h-16' : 'w-14 h-14'

  const handleDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.preventDefault()
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* noop */ }

    if (isRecording && locked) {
      // Qulflangan holat → bir bosish to'xtatadi
      onStop()
      return
    }
    if (!isRecording) {
      holdingRef.current = true
      startYRef.current = e.clientY
      setLocked(false)
      setSliding(true)
      onStart()
    }
  }

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!holdingRef.current || locked) return
    if (startYRef.current - e.clientY > LOCK_THRESHOLD) {
      setLocked(true)
      setSliding(false)
    }
  }

  const handleUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* noop */ }
    if (!holdingRef.current) return
    holdingRef.current = false
    setSliding(false)
    if (locked) return // hands-free — yozishda davom etadi
    if (isRecording) onStop()
  }

  const label = !isRecording
    ? idleLabel
    : locked
      ? (interim || 'Bosib to\'xtating')
      : (interim || "Gapiring… (qo'yib yuboring)")

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Qulflash ishorasi — bosib turib yuqoriga surilganda */}
      {sliding && !locked && (
        <div className="flex flex-col items-center text-gray-400 animate-bounce">
          <ChevronUp size={16} />
          <span className="text-xs font-medium">qulflash uchun suring</span>
        </div>
      )}

      <button
        type="button"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        onContextMenu={(e) => e.preventDefault()}
        disabled={disabled}
        aria-label={isRecording ? (locked ? 'Yozilmoqda (qulflangan) — to\'xtatish uchun bosing' : "Yozilmoqda — qo'yib yuboring") : idleLabel}
        className={`${dim} rounded-full flex items-center justify-center text-white shadow-lg transition-all touch-none active:scale-95 relative
          ${isRecording
            ? 'bg-rose-500 animate-pulse ring-4 ring-rose-200 dark:ring-rose-900'
            : 'bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {isRecording
          ? <Square size={size === 'lg' ? 22 : 20} className="text-white" fill="white" />
          : <Mic size={size === 'lg' ? 26 : 22} className="text-white" />}
        {/* Qulflangan belgisi */}
        {isRecording && locked && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
            <Lock size={10} className="text-white" />
          </span>
        )}
      </button>

      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 min-h-[16px] text-center max-w-[220px]">
        {label}
      </p>
    </div>
  )
}
