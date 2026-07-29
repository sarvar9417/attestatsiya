interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext
}

let audioCtx: AudioContext | null = null
if (typeof window !== 'undefined') {
  try {
    const Ctor = window.AudioContext || (window as WebkitWindow).webkitAudioContext
    if (Ctor) audioCtx = new Ctor()
  } catch {
    // Audio not available (test environment, server-side, etc.)
  }
}

/** Play a Web Audio API synthesized sound effect */
export function playSfx(name: string = 'click'): void {
  if (!audioCtx) return
  const now = audioCtx.currentTime
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)

  switch (name) {
    case 'correct':
      osc.frequency.setValueAtTime(523, now)
      osc.frequency.setValueAtTime(659, now + 0.1)
      osc.frequency.setValueAtTime(784, now + 0.2)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
      osc.start(now)
      osc.stop(now + 0.4)
      break
    case 'wrong':
      osc.frequency.setValueAtTime(200, now)
      osc.frequency.setValueAtTime(150, now + 0.2)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      osc.start(now)
      osc.stop(now + 0.3)
      break
    case 'levelup':
      osc.frequency.setValueAtTime(523, now)
      osc.frequency.setValueAtTime(659, now + 0.15)
      osc.frequency.setValueAtTime(784, now + 0.3)
      osc.frequency.setValueAtTime(1047, now + 0.45)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6)
      osc.start(now)
      osc.stop(now + 0.6)
      break
    case 'combo':
      // Rising two-tone "ding ding!" for combos
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.setValueAtTime(1100, now + 0.08)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      osc.start(now)
      osc.stop(now + 0.25)
      break
    case 'milestone':
      // Triumphant ascending chord for streak milestones
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523, now)        // C5
      osc.frequency.setValueAtTime(659, now + 0.12)  // E5
      osc.frequency.setValueAtTime(784, now + 0.25)  // G5
      osc.frequency.setValueAtTime(1047, now + 0.4)  // C6
      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8)
      osc.start(now)
      osc.stop(now + 0.8)
      break
    case 'streak-burn':
      // Rolling low fire crackle for streak fire
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(100, now)
      osc.frequency.linearRampToValueAtTime(200, now + 0.3)
      osc.frequency.linearRampToValueAtTime(120, now + 0.6)
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6)
      osc.start(now)
      osc.stop(now + 0.6)
      break
    case 'xp-tick':
      // Quick sparkle for XP tick
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1400, now)
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
      osc.start(now)
      osc.stop(now + 0.08)
      break
    default:
      osc.frequency.setValueAtTime(440, now)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      osc.start(now)
      osc.stop(now + 0.1)
  }
}
