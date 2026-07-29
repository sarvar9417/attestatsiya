export interface SpeakerVoice {
  pitch: number
  rate: number
  voice: SpeechSynthesisVoice | null
}

// Ayol ismlari ro'yxati (keng tarqalgan)
const FEMALE_NAMES = new Set([
  'anna', 'mary', 'jane', 'sarah', 'emma', 'olivia', 'sophia', 'ava', 'isabella', 'mia',
  'alice', 'linda', 'susan', 'karen', 'nancy', 'lisa', 'betty', 'helen', 'sandra', 'carol',
  'ruth', 'laura', 'amy', 'diana', 'julia', 'kate', 'lucy', 'lily', 'ella', 'chloe',
  'maria', 'elena', 'sofia', 'laura', 'paula', 'tina', 'nina', 'vera', 'zara', 'luna',
  'teacher', 'miss', 'mrs', 'lady', 'woman', 'girl',
])

// Erkak ismlari ro'yxati
const MALE_NAMES = new Set([
  'john', 'mike', 'david', 'james', 'robert', 'michael', 'william', 'richard', 'joseph', 'thomas',
  'tom', 'peter', 'paul', 'george', 'henry', 'alex', 'sam', 'daniel', 'chris', 'steve',
  'andrew', 'jack', 'oliver', 'harry', 'noah', 'liam', 'mason', 'ethan', 'logan', 'lucas',
  'mark', 'tim', 'bob', 'joe', 'nick', 'max', 'leo', 'ray', 'phil', 'ben',
  'narrator', 'man', 'boy', 'mr', 'sir', 'doctor', 'driver', 'waiter', 'guide',
  'speaker a', 'speaker b', 'speaker 1', 'speaker 2', 'voice 1', 'voice 2',
])

// Bolalar ismlari
const CHILD_NAMES = new Set([
  'max', 'tim', 'tom', 'lily', 'ella', 'leo', 'mia', 'luna', 'zoe', 'sam',
  'ben', 'jay', 'kate', 'lucy', 'emma', 'oli', 'ann', 'ted', 'kim', 'pat',
  'child', 'kid', 'girl', 'boy', 'student', 'pupil',
])

function detectGender(name: string): 'female' | 'male' | 'child' {
  const lower = name.toLowerCase().trim()
  if (CHILD_NAMES.has(lower)) return 'child'
  if (FEMALE_NAMES.has(lower)) return 'female'
  if (MALE_NAMES.has(lower)) return 'male'

  // Agar hech qaysi ro'yxatda bo'lmasa, harf tahlili orqali aniqlash
  // Aksar ayol ismlari 'a', 'e', 'i' bilan tugaydi
  if (lower.endsWith('a') || lower.endsWith('e') || lower.endsWith('i')) return 'female'
  return 'male'
}

export function assignSpeakerVoices(speakers: string[]): Map<string, SpeakerVoice> {
  const map = new Map<string, SpeakerVoice>()

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    for (const s of speakers) map.set(s, { pitch: 1, rate: 0.88, voice: null })
    return map
  }

  const allVoices = window.speechSynthesis.getVoices()

  // Ingliz ayol ovozini topish
  const femaleVoice = allVoices.find(v =>
    v.name.includes('Google UK') && v.name.toLowerCase().includes('female')
  ) ?? allVoices.find(v =>
    v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen')
  ) ?? allVoices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  )

  // Ingliz erkak ovozini topish
  const maleVoice = allVoices.find(v =>
    v.name.includes('Google UK') && v.name.toLowerCase().includes('male')
  ) ?? allVoices.find(v =>
    v.name.includes('Daniel') || v.name.includes('Alex') || v.name.includes('Fred')
  ) ?? allVoices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
  )

  for (const s of speakers) {
    const gender = detectGender(s)

    if (gender === 'female') {
      map.set(s, { pitch: 1.15, rate: 0.85, voice: femaleVoice ?? null })
    } else if (gender === 'child') {
      map.set(s, { pitch: 1.5, rate: 0.9, voice: maleVoice ?? null })
    } else {
      map.set(s, { pitch: 0.8, rate: 0.82, voice: maleVoice ?? null })
    }
  }

  return map
}

export const voiceGender: string = 'female'
