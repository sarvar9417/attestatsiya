import { useEffect, useRef, useState } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

export default function BottomSheet({ open, onClose, children, title, className = '' }: BottomSheetProps) {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  useEffect(() => {
    if (open) {
      setVisible(true)
      requestAnimationFrame(() => setAnimating(true))
    } else {
      setAnimating(false)
      const timer = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (sheetRef.current && e.touches[0].clientY < 80) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current) return
    currentY.current = e.touches[0].clientY - startY.current
    if (currentY.current > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${currentY.current}px)`
    }
  }

  const handleTouchEnd = () => {
    if (currentY.current > 100) {
      onClose()
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = ''
    }
    startY.current = 0
    currentY.current = 0
  }

  if (!visible) return null

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 will-change-[opacity] ${
          animating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out will-change-transform safe-area-bottom ${
          animating ? 'translate-y-0' : 'translate-y-full'
        } ${className}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h2>
          </div>
        )}
        <div className="overflow-y-auto max-h-[85dvh] overscroll-contain scrollable">
          {children}
        </div>
      </div>
    </>
  )
}
