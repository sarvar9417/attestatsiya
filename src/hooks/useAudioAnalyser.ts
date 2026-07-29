import { useState, useCallback } from 'react'

export interface PauseInfo {
  start: number
  end: number
  duration: number
}

export interface FluencyMetrics {
  speechRate: number
  articulationRate: number
  pauseCount: number
  avgPauseDuration: number
  totalPauseRatio: number
  longestPhrase: number
  avgEnergy: number
  energyVariation: number
}

export interface PitchContourPoint {
  time: number
  frequency: number
}

export interface AudioAnalysisResult {
  fluency: FluencyMetrics
  pitchMean: number
  pitchStddev: number
  pitchContour: PitchContourPoint[]
}

async function decodeAudio(audioUrl: string): Promise<AudioBuffer> {
  const response = await fetch(audioUrl)
  const arrayBuffer = await response.arrayBuffer()
  const audioCtx = new AudioContext()
  return audioCtx.decodeAudioData(arrayBuffer)
}

function getChannelData(audioBuffer: AudioBuffer): Float32Array {
  return audioBuffer.getChannelData(0)
}

function autocorrelationPitch(signal: Float32Array, sampleRate: number): number | null {
  const minFreq = 50
  const maxFreq = 500
  const minPeriod = Math.floor(sampleRate / maxFreq)
  const maxPeriod = Math.floor(sampleRate / minFreq)

  let bestCorr = 0
  let bestPeriod = -1

  for (let period = minPeriod; period <= maxPeriod; period++) {
    let correlation = 0
    let count = 0
    for (let i = 0; i + period < signal.length; i += 2) {
      correlation += signal[i] * signal[i + period]
      count++
    }
    if (count === 0) continue
    correlation /= count

    if (correlation > bestCorr) {
      bestCorr = correlation
      bestPeriod = period
    }
  }

  if (bestPeriod === -1 || bestCorr < 0.1) return null
  return sampleRate / bestPeriod
}

function computeEnergy(signal: Float32Array): number {
  let sumSq = 0
  for (let i = 0; i < signal.length; i++) {
    sumSq += signal[i] * signal[i]
  }
  return Math.sqrt(sumSq / signal.length)
}

function detectSilences(signal: Float32Array, sampleRate: number): PauseInfo[] {
  const frameSize = Math.floor(sampleRate * 0.03)
  const energyThreshold = 0.02
  const minPauseDuration = 0.2
  const pauses: PauseInfo[] = []
  let inSilence = false
  let silenceStart = 0

  for (let i = 0; i + frameSize < signal.length; i += frameSize) {
    let frameEnergy = 0
    for (let j = 0; j < frameSize; j++) {
      frameEnergy += Math.abs(signal[i + j])
    }
    frameEnergy /= frameSize

    const time = i / sampleRate

    if (frameEnergy < energyThreshold) {
      if (!inSilence) {
        inSilence = true
        silenceStart = time
      }
    } else {
      if (inSilence) {
        const duration = time - silenceStart
        if (duration >= minPauseDuration) {
          pauses.push({ start: silenceStart, end: time, duration })
        }
        inSilence = false
      }
    }
  }

  if (inSilence) {
    const duration = signal.length / sampleRate - silenceStart
    if (duration >= minPauseDuration) {
      pauses.push({ start: silenceStart, end: signal.length / sampleRate, duration })
    }
  }

  return pauses
}

export async function analyzeAudio(audioUrl: string, transcript: string): Promise<AudioAnalysisResult> {
  const audioBuffer = await decodeAudio(audioUrl)
  const signal = getChannelData(audioBuffer)
  const sampleRate = audioBuffer.sampleRate
  const duration = audioBuffer.duration

  // Pitch detection (every 50ms)
  const frameSize = Math.floor(sampleRate * 0.05)
  const pitches: number[] = []
  const pitchContour: PitchContourPoint[] = []
  for (let i = 0; i + frameSize < signal.length; i += frameSize) {
    const frame = signal.slice(i, i + frameSize)
    const pitch = autocorrelationPitch(frame, sampleRate)
    if (pitch !== null) {
      pitches.push(pitch)
      pitchContour.push({ time: i / sampleRate, frequency: pitch })
    }
  }
  const pitchMean = pitches.length > 0
    ? pitches.reduce((a, b) => a + b, 0) / pitches.length
    : 0
  const pitchStddev = pitches.length > 1
    ? Math.sqrt(pitches.reduce((sum, p) => sum + (p - pitchMean) ** 2, 0) / pitches.length)
    : 0

  // Energy
  const avgEnergy = computeEnergy(signal)
  const frameEnergies: number[] = []
  for (let i = 0; i + frameSize < signal.length; i += frameSize) {
    const frame = signal.slice(i, i + frameSize)
    frameEnergies.push(computeEnergy(frame))
  }
  const energyVariation = frameEnergies.length > 1
    ? Math.sqrt(frameEnergies.reduce((sum, e) => sum + (e - avgEnergy) ** 2, 0) / frameEnergies.length)
    : 0

  // Silence detection
  const pauses = detectSilences(signal, sampleRate)
  const totalPauseDuration = pauses.reduce((sum, p) => sum + p.duration, 0)
  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length
  const speakingTime = duration - totalPauseDuration

  const speechRate = duration > 0 ? wordCount / (duration / 60) : 0
  const articulationRate = speakingTime > 0 ? wordCount / (speakingTime / 60) : 0

  return {
    fluency: {
      speechRate: Math.round(speechRate * 10) / 10,
      articulationRate: Math.round(articulationRate * 10) / 10,
      pauseCount: pauses.length,
      avgPauseDuration: pauses.length > 0
        ? Math.round((totalPauseDuration / pauses.length) * 1000)
        : 0,
      totalPauseRatio: duration > 0
        ? Math.round((totalPauseDuration / duration) * 100)
        : 0,
      longestPhrase: pauses.length > 0
        ? Math.round((pauses[0].start) * 10) / 10
        : Math.round(duration * 10) / 10,
      avgEnergy: Math.round(avgEnergy * 1000) / 1000,
      energyVariation: Math.round(energyVariation * 1000) / 1000,
    },
    pitchMean: Math.round(pitchMean),
    pitchStddev: Math.round(pitchStddev),
    pitchContour,
  }
}

export function useAudioAnalyser() {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AudioAnalysisResult | null>(null)

  const analyze = useCallback(async (audioUrl: string, transcript: string) => {
    setAnalyzing(true)
    setResult(null)
    try {
      const r = await analyzeAudio(audioUrl, transcript)
      setResult(r)
      return r
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setAnalyzing(false)
  }, [])

  return { analyzing, result, analyze, reset }
}

export function formatFluencySummary(metrics: FluencyMetrics): string {
  const rate = metrics.speechRate
  let rateDesc = 'normal'
  if (rate < 80) rateDesc = 'sekin'
  else if (rate > 160) rateDesc = 'tez'

  return [
    `Nutq tezligi: ${metrics.speechRate} so'z/daq (${rateDesc})`,
    `Pauzalar: ${metrics.pauseCount} ta (o'rtacha ${metrics.avgPauseDuration}ms)`,
    `Umumiy vaqtning ${metrics.totalPauseRatio}% pauza`,
  ].join('\n')
}
