// O'zbek talaffuzidagi tipik xatolar — sound classification
// Har bir PronunciationIssue ni qaysi tovush guruhiga tegishli ekanini aniqlash

export interface SoundCategory {
  id: string
  label: string
  ipa: string
  description: string
  patterns: RegExp[]
  drillCategory?: string  // PRONUNCIATION_CATEGORIES dagi id
}

export const SOUND_CATEGORIES: SoundCategory[] = [
  {
    id: 'th-voiceless',
    label: 'θ (voiceless th)',
    ipa: 'θ',
    description: 'Tish orasidan "s" — think, thanks, three',
    patterns: [/θ/],
    drillCategory: 'th-sounds',
  },
  {
    id: 'th-voiced',
    label: 'ð (voiced th)',
    ipa: 'ð',
    description: 'Tish orasidan "z" — the, this, that, mother',
    patterns: [/ð/],
    drillCategory: 'th-sounds',
  },
  {
    id: 'w-v',
    label: 'w/v',
    ipa: 'w/v',
    description: 'W va V tovushlarini farqlash',
    patterns: [/w\/v/, /\bv\b.*\bw\b/, /\bw\b.*\bv\b/, /v.* w/, /w.* v/],
    drillCategory: 'w-v',
  },
  {
    id: 'short-i',
    label: 'ɪ (short i)',
    ipa: 'ɪ',
    description: 'Qisqa "i" — ship, bit, sit',
    patterns: [/ɪ/],
    drillCategory: 'short-long-vowels',
  },
  {
    id: 'long-ee',
    label: 'iː (long ee)',
    ipa: 'iː',
    description: 'Cho\'ziq "i" — sheep, beat, seat',
    patterns: [/iː/],
    drillCategory: 'short-long-vowels',
  },
  {
    id: 'ae',
    label: 'æ (cat)',
    ipa: 'æ',
    description: '"A" va "E" orasidagi tovush — cat, man, apple',
    patterns: [/æ/],
    drillCategory: 'ae-sound',
  },
  {
    id: 'ed-ending',
    label: '-ed qo\'shimchasi',
    ipa: '-ed',
    description: '-ed qo\'shimchasini to\'g\'ri talaffuz qilish (t/d/ɪd)',
    patterns: [/-ed\b/],
    drillCategory: 'ed-endings',
  },
  {
    id: 'word-stress',
    label: 'So\'z urg\'usi',
    ipa: 'ˈ',
    description: 'Urg\'u noto\'g\'ri bo\'g\'inda',
    patterns: [/ˈ/],
    drillCategory: 'word-stress',
  },
  {
    id: 'silent-letters',
    label: 'Jim harflar',
    ipa: 'silent',
    description: 'Jim harflarni talaffuz qilish (knife, write, hour)',
    patterns: [/silent/i, /jim/i],
    drillCategory: 'silent-letters',
  },
  {
    id: 'ng',
    label: 'ŋ (ng)',
    ipa: 'ŋ',
    description: 'Burun "ng" tovushi — sing, long, thing',
    patterns: [/ŋ/],
    drillCategory: 'ng-sound',
  },
  {
    id: 'schwa',
    label: 'ə (schwa)',
    ipa: 'ə',
    description: 'Bo\'g\'in urg\'usiz "ə" — about, banana, water',
    patterns: [/ə/],
    drillCategory: 'schwa',
  },
  {
    id: 'other',
    label: 'Boshqa',
    ipa: '',
    description: 'Aniqlanmagan talaffuz xatosi',
    patterns: [],
    drillCategory: undefined,
  },
]

export function classifySound(ipa: string, tip: string): SoundCategory {
  const text = `${ipa} ${tip}`.toLowerCase()
  for (const cat of SOUND_CATEGORIES) {
    if (cat.id === 'other') continue
    for (const pattern of cat.patterns) {
      if (pattern.test(text)) return cat
    }
  }
  const other = SOUND_CATEGORIES.find(c => c.id === 'other')
  return other ?? SOUND_CATEGORIES[0]
}

export function getDrillLabel(categoryId?: string): string {
  const DRILl_LABELS: Record<string, string> = {
    'th-sounds': 'Th tovushlari',
    'w-v': 'W/V farqlash',
    'short-long-vowels': 'Qisqa/cho\'ziq unlilar',
    'ae-sound': 'Æ (cat) tovushi',
    'ed-endings': '-Ed qo\'shimchasi',
    'word-stress': 'So\'z urg\'usi',
    'silent-letters': 'Jim harflar',
    'ng-sound': 'Ng tovushi',
    'schwa': 'Schwa (ə) tovushi',
  }
  return DRILl_LABELS[categoryId ?? ''] ?? 'Talaffuz mashqi'
}
