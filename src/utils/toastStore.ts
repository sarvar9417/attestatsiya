import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
}

interface ToastState {
  toasts: Toast[]
  toast: (message: string, type?: ToastType, duration?: number) => void
  dismiss: (id: string) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  toast: (message, type = 'info', duration = 4000) => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, message, type, duration }] }))
    if (duration > 0) {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
      }, duration)
    }
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}))
