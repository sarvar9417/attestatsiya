export function speakText(text: string, rate = 0.85) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = rate
    window.speechSynthesis.speak(u)
  }
}
