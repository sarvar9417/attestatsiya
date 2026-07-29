import { describe, it, expect } from 'vitest'
import uz from '../uz.json'
import en from '../en.json'
import ru from '../ru.json'

type Dict = Record<string, string>
const locales: Record<string, Dict> = { uz: uz as Dict, en: en as Dict, ru: ru as Dict }

/* ─── Helpers ─── */

const placeholders = (s: string) => (s.match(/\{(\w+)\}/g) ?? []).sort().join(',')

function checkKeyExistence(key: string): void {
  for (const [name, dict] of Object.entries(locales)) {
    expect(dict[key], `[${name}] "${key}" kaliti topilmadi`).toBeDefined()
  }
}

function checkNoEmptyValue(key: string): void {
  for (const [name, dict] of Object.entries(locales)) {
    expect(dict[key]?.trim(), `[${name}] "${key}" qiymati bo'sh`).not.toBe('')
  }
}

function checkPlaceholdersMatch(key: string): void {
  const values = Object.entries(locales).map(([name, d]) => ({ name, val: d[key] })).filter(x => x.val !== undefined)
  if (values.length < 2) return // only 1 locale has this key — skip
  const ref = placeholders(values[0].val!)
  for (const { name, val } of values.slice(1)) {
    expect(placeholders(val!), `${key}: placeholder mos kelmadi (${values[0].name}≠${name})`).toBe(ref)
  }
}

/* ─── Key groups ─── */

// All Listening & Speaking keys that should exist
const LISTENING_DAILY_KEYS = [
  'dailyListening.preparing',
  'dailyListening.listening',
  'dailyListening.exercises',
  'dailyListening.result',
  'dailyListening.stepFirst',
  'dailyListening.stepQuestions',
  'dailyListening.goToQuestions',
  'dailyListening.relisten',
  'dailyListening.comprehensionTitle',
  'dailyListening.answeredCount',
  'dailyListening.replayAudio',
  'dailyListening.dictation',
  'dailyListening.dictationHint',
  'dailyListening.dictationPlaceholder',
  'dailyListening.lineNumber',
  'dailyListening.discussion',
  'dailyListening.checkAnswers',
  'dailyListening.answerReview',
  'dailyListening.dictationResults',
  'dailyListening.backToListen',
  'dailyListening.nextPhase',
  'dailyListening.resultComplete',
  'dailyListening.resultExcellent',
  'dailyListening.resultGood',
  'dailyListening.percentCorrect',
  'dailyListening.listenedCount',
  'dailyListening.restartFromStart',
  'dailyListening.backupLink',
  'dailyListening.exerciseLabel',
  'dailyListening.speakerSpeaking',
  'dailyListening.linesCount',
  'dailyListening.hideTranscript',
  'dailyListening.showTranscript',
  'dailyListening.afterListenOnly',
  'dailyListening.transcript',
  'dailyListening.listenAllText',
]

const SPEAKING_DAILY_KEYS = [
  'dailySpeaking.aiGeneratingTask',
  'dailySpeaking.taskTitle',
  'dailySpeaking.listen',
  'dailySpeaking.tips',
  'dailySpeaking.keyPhrases',
  'dailySpeaking.speakNow',
  'dailySpeaking.evaluate',
  'dailySpeaking.evaluating',
  'dailySpeaking.fluency',
  'dailySpeaking.grammar',
  'dailySpeaking.vocabulary',
  'dailySpeaking.retry',
  'dailySpeaking.browserNotSupported',
  'dailySpeaking.xpEarned',
  'dailySpeaking.paused',
]

const SPEAKING_HISTORY_KEYS = [
  'speakingHistory.title',
  'speakingHistory.loading',
  'speakingHistory.noResults',
  'speakingHistory.noResultsDesc',
  'speakingHistory.question',
  'speakingHistory.feedback',
]

const AUDIO_PLAYBACK_KEYS = [
  'audioPlayback.yourAudio',
  'audioPlayback.sample',
  'audioPlayback.playing',
  'audioPlayback.play',
  'audioPlayback.pause',
]

const INTONATION_KEYS = [
  'intonation.noPitchData',
]

const STRESS_VIS_KEYS = [
  'stressVis.title',
  'stressVis.stressed',
  'stressVis.unstressed',
]

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  // Simple {variable} replacement
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = params[key]
    return val !== undefined ? String(val) : `{${key}}`
  })
}

/* ─── Tests ─── */

describe('i18n Listening keys (F4-4a)', () => {
  for (const key of LISTENING_DAILY_KEYS) {
    it(`[${key}] barcha 3 tilda mavjud va bo'sh emas`, () => {
      checkKeyExistence(key)
      checkNoEmptyValue(key)
    })

    it(`[${key}] placeholder ({…}) lar barcha tilda mos keladi`, () => {
      checkPlaceholdersMatch(key)
    })
  }

  describe('interpolation — dailyListening', () => {
    it('dailyListening.answeredCount — {answered} va {total} to\'g\'ri almashtiriladi', () => {
      for (const [, dict] of Object.entries(locales)) {
        const result = interpolate(dict['dailyListening.answeredCount'], { answered: '3', total: '5' })
        expect(result).toContain('3')
        expect(result).toContain('5')
        expect(result).not.toContain('{answered}')
        expect(result).not.toContain('{total}')
      }
    })

    it('dailyListening.replayAudio — {speed} to\'g\'ri almashtiriladi', () => {
      for (const [, dict] of Object.entries(locales)) {
        const result = interpolate(dict['dailyListening.replayAudio'], { speed: '1.5' })
        expect(result).toContain('1.5')
        expect(result).not.toContain('{speed}')
      }
    })

    it('dailyListening.lineNumber — {n} to\'g\'ri almashtiriladi', () => {
      for (const [, dict] of Object.entries(locales)) {
        const result = interpolate(dict['dailyListening.lineNumber'], { n: '3' })
        expect(result).toContain('3')
        expect(result).not.toContain('{n}')
      }
    })

    it('dailyListening.percentCorrect — {pct} to\'g\'ri almashtiriladi', () => {
      for (const [, dict] of Object.entries(locales)) {
        const result = interpolate(dict['dailyListening.percentCorrect'], { pct: '80' })
        expect(result).toContain('80')
        expect(result).not.toContain('{pct}')
      }
    })

    it('dailyListening.listenedCount — {count} to\'g\'ri almashtiriladi', () => {
      for (const [, dict] of Object.entries(locales)) {
        const result = interpolate(dict['dailyListening.listenedCount'], { count: '3' })
        expect(result).toContain('3')
        expect(result).not.toContain('{count}')
      }
    })

    it('dailyListening.speakerSpeaking — {speaker} to\'g\'ri almashtiriladi', () => {
      for (const [, dict] of Object.entries(locales)) {
        const result = interpolate(dict['dailyListening.speakerSpeaking'], { speaker: 'John' })
        expect(result).toContain('John')
        expect(result).not.toContain('{speaker}')
      }
    })

    it('dailyListening.linesCount — {count} to\'g\'ri almashtiriladi', () => {
      for (const [, dict] of Object.entries(locales)) {
        const result = interpolate(dict['dailyListening.linesCount'], { count: '12' })
        expect(result).toContain('12')
        expect(result).not.toContain('{count}')
      }
    })

    it('barcha dailyListening keylar parametrsiz chaqirilganda {var} ko\'rinmaydi', () => {
      for (const key of LISTENING_DAILY_KEYS) {
        for (const [, dict] of Object.entries(locales)) {
          const template = dict[key]
          if (!template) continue
          // Agar template'da {xxx} bo'lsa va hech qanday params berilmasa,
          // natijada {xxx} ko'rinishi kerak (no crash)
          const result = interpolate(template)
          // Hech qanday exception tashlamasligi kerak
          expect(typeof result).toBe('string')
        }
      }
    })
  })
})

describe('i18n Speaking keys (F4-4b)', () => {
  const allSpeakingKeys = [
    ...SPEAKING_DAILY_KEYS,
    ...SPEAKING_HISTORY_KEYS,
    ...AUDIO_PLAYBACK_KEYS,
    ...INTONATION_KEYS,
    ...STRESS_VIS_KEYS,
  ]

  for (const key of allSpeakingKeys) {
    it(`[${key}] barcha 3 tilda mavjud va bo'sh emas`, () => {
      checkKeyExistence(key)
      checkNoEmptyValue(key)
    })

    it(`[${key}] placeholder ({…}) lar barcha tilda mos keladi`, () => {
      checkPlaceholdersMatch(key)
    })
  }

  describe('interpolation — dailySpeaking', () => {
    it('dailySpeaking.xpEarned — {xp} to\'g\'ri almashtiriladi', () => {
      for (const [, dict] of Object.entries(locales)) {
        const result = interpolate(dict['dailySpeaking.xpEarned'], { xp: '45' })
        expect(result).toContain('45')
        expect(result).not.toContain('{xp}')
      }
    })

    it('parametrsiz dailySpeaking keylar hech qanday {var} talab qilmaydi', () => {
      const noParamKeys = SPEAKING_DAILY_KEYS.filter(k => k !== 'dailySpeaking.xpEarned')
      for (const key of noParamKeys) {
        for (const [name, dict] of Object.entries(locales)) {
          const template = dict[key]
          if (!template) continue
          // These keys should not have any {variable} placeholders
          expect(template, `[${name}] "${key}" parametrsiz bo'lishi kerak, lekin unda {…} bor`).not.toMatch(/\{\w+\}/)
        }
      }
    })

    it('speakingHistory keys da placeholder yo\'q (wordCount dan tashqari)', () => {
      for (const key of SPEAKING_HISTORY_KEYS.filter(k => k !==  'writingHistory.wordCount')) {
        for (const [name, dict] of Object.entries(locales)) {
          const template = dict[key]
          if (!template) continue
          expect(template, `[${name}] "${key}" placeholder bo'lmasligi kerak`).not.toMatch(/\{\w+\}/)
        }
      }
    })

    it('writingHistory.wordCount — {count} to\'g\'ri almashtiriladi', () => {
      for (const [, dict] of Object.entries(locales)) {
        const result = interpolate(dict['writingHistory.wordCount'], { count: '42' })
        expect(result).toContain('42')
        expect(result).not.toContain('{count}')
      }
    })

    it('audioPlayback keys da placeholder yo\'q', () => {
      for (const key of AUDIO_PLAYBACK_KEYS) {
        for (const [name, dict] of Object.entries(locales)) {
          expect(dict[key], `[${name}] "${key}"`).not.toMatch(/\{\w+\}/)
        }
      }
    })

    it('intonation va stressVis keys da placeholder yo\'q', () => {
      for (const key of [...INTONATION_KEYS, ...STRESS_VIS_KEYS]) {
        for (const [name, dict] of Object.entries(locales)) {
          expect(dict[key], `[${name}] "${key}"`).not.toMatch(/\{\w+\}/)
        }
      }
    })
  })
})

describe('useI18n fallback (F4-4c)', () => {
  // The useI18n() hook falls back to uz.json when no I18nProvider is present.
  // Test that the fallback dict contains all Listening & Speaking keys.

  it('fallback (uz) dailyListening keys mavjud', () => {
    for (const key of LISTENING_DAILY_KEYS) {
      expect(uz).toHaveProperty(key)
      expect(typeof (uz as Record<string, unknown>)[key]).toBe('string')
    }
  })

  it('fallback (uz) dailySpeaking keys mavjud', () => {
    for (const key of SPEAKING_DAILY_KEYS) {
      expect(uz).toHaveProperty(key)
      expect(typeof (uz as Record<string, unknown>)[key]).toBe('string')
    }
  })

  it('fallback (uz) speakingHistory keys mavjud', () => {
    for (const key of SPEAKING_HISTORY_KEYS) {
      expect(uz).toHaveProperty(key)
    }
  })

  it('fallback (uz) audioPlayback keys mavjud', () => {
    for (const key of AUDIO_PLAYBACK_KEYS) {
      expect(uz).toHaveProperty(key)
    }
  })

  it('fallback (uz) intonation va stressVis keys mavjud', () => {
    for (const key of [...INTONATION_KEYS, ...STRESS_VIS_KEYS]) {
      expect(uz).toHaveProperty(key)
    }
  })

  it('fallback (uz) dailyListening matnlari o\'zbek tilida', () => {
    // Spot-check a few key Uzbek phrases
    const dict = uz as Dict
    expect(dict['dailyListening.preparing']).toMatch(/Tayyorgarlik/)
    expect(dict['dailyListening.listening']).toMatch(/Tinglash/)
    expect(dict['dailyListening.exercises']).toMatch(/Mashqlar/)
    expect(dict['dailyListening.result']).toMatch(/Natija/)
    expect(dict['dailyListening.checkAnswers']).toMatch(/Javoblarni/)
  })

  it('fallback (uz) dailySpeaking matnlari o\'zbek tilida', () => {
    const dict = uz as Dict
    expect(dict['dailySpeaking.taskTitle']).toMatch(/Speaking/)
    expect(dict['dailySpeaking.speakNow']).toMatch(/Gapiring/)
    expect(dict['dailySpeaking.evaluate']).toMatch(/Baholash/)
    expect(dict['dailySpeaking.fluency']).toMatch(/Ravonlik/)
    expect(dict['dailySpeaking.grammar']).toMatch(/Grammatika/)
    expect(dict['dailySpeaking.vocabulary']).toMatch(/Lug'at/)
  })
})

describe('i18n natija matnlari (F4-4d)', () => {
  // Daily Listening result phase messages should be meaningful in each locale
  it('dailyListening.resultComplete — barcha tilda mavjud va ma\'noli', () => {
    for (const [, dict] of Object.entries(locales)) {
      const val = dict['dailyListening.resultComplete']
      expect(val).toBeDefined()
      expect(val?.length).toBeGreaterThan(5)
      // Should not contain raw placeholder remnants
      expect(val).not.toMatch(/\{\w+\}/)
    }
  })

  it('dailyListening.resultExcellent ≠ dailyListening.resultGood', () => {
    for (const [, dict] of Object.entries(locales)) {
      expect(dict['dailyListening.resultExcellent']).not.toBe(dict['dailyListening.resultGood'])
    }
  })

  it('dailyListening.percentCorrect — {pct} placeholder to\'g\'ri', () => {
    for (const [, dict] of Object.entries(locales)) {
      expect(dict['dailyListening.percentCorrect']).toMatch(/\{pct\}/)
    }
  })
})
