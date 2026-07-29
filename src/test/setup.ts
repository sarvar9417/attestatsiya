import '@testing-library/jest-dom'

// jsdom doesn't implement IntersectionObserver — mock so useInView hook doesn't crash tests
if (typeof IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    readonly root: Element | null = null
    readonly rootMargin: string = '0px'
    readonly thresholds: ReadonlyArray<number> = [0]
    constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
    observe(_target: Element) {}
    unobserve(_target: Element) {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] { return [] }
  }
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    value: MockIntersectionObserver,
    writable: true,
    configurable: true,
  })
}

// jsdom doesn't implement scrollTo — mock both window and Element.scrollTo so tests don't throw
if (typeof window.scrollTo !== 'function') {
  window.scrollTo = (() => {}) as typeof window.scrollTo
}
if (typeof Element.prototype.scrollTo !== 'function') {
  Element.prototype.scrollTo = (() => {}) as typeof Element.prototype['scrollTo']
}

// Vitest 4.x jsdom doesn't provide matchMedia by default — required by theme tests
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

// Suppress act() warnings from async effects — tests handle this correctly via await renderPage()
// Suppress jsdom 'Not implemented: window.scrollTo' error — guarded with try/catch in source
// HTMLCanvasElement.getContext — jsdom doesn't implement canvas
if (typeof HTMLCanvasElement.prototype.getContext !== 'function') {
  HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext
}

// HTMLMediaElement.prototype.pause — jsdom doesn't implement media elements
if (typeof HTMLMediaElement.prototype.pause !== 'function') {
  HTMLMediaElement.prototype.pause = (() => {}) as typeof HTMLMediaElement.prototype.pause
}

const origConsoleError = console.error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (...args: any[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : ''
  if (msg.includes('inside a test was not wrapped in act(')) return
  if (msg.includes('Not implemented: window.scrollTo')) return
  if (msg.includes('Not implemented: HTMLCanvasElement')) return
  if (msg.includes('Not implemented: HTMLMediaElement')) return
  origConsoleError.call(console, ...args)
}

if (typeof localStorage === 'undefined' || typeof localStorage.clear !== 'function') {
  const store: Record<string, string> = {}
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = String(value) },
      removeItem: (key: string) => { delete store[key] },
      clear: () => { for (const k in store) delete store[k] },
      get length() { return Object.keys(store).length },
      key: (i: number) => Object.keys(store)[i] ?? null,
    },
    configurable: true,
    writable: true,
  })
}
