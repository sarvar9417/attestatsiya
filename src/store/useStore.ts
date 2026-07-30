import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createAuthSlice } from './authSlice'

export type AppState = ReturnType<typeof createAuthSlice>

export const useStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    {
      name: 'attestatsiya-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
