export function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light'): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const duration = type === 'light' ? 10 : type === 'medium' ? 25 : 40
    navigator.vibrate(duration)
  }
}
