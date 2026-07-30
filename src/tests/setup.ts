import { vi } from 'vitest'
// DOM matcherlari: toBeInTheDocument, toHaveClass va h.k.
import '@testing-library/jest-dom/vitest'

const store: Record<string, string> = {}
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
    length: 0,
  },
  writable: true,
})

// jsdom scrollIntoView'ni qo'llab-quvvatlamaydi
Element.prototype.scrollIntoView = vi.fn()
