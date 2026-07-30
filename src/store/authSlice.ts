import type { StateCreator } from 'zustand'

export interface AuthSlice {
  userName: string
  userEmail: string
  onboardingComplete: boolean
  _hydrated: boolean

  setUserName: (name: string) => void
  setUserEmail: (email: string) => void
  completeOnboarding: (name: string) => void
}

export type AppState = AuthSlice

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set) => {
  return {
    userName: '',
    userEmail: '',
    onboardingComplete: false,
    _hydrated: false,

    setUserName: (name) => set({ userName: name }),
    setUserEmail: (email) => set({ userEmail: email }),

    completeOnboarding: (name) => {
      set({
        userName: name,
        onboardingComplete: true,
      })
    },
  }
}
