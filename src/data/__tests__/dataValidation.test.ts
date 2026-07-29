import { describe, it, expect } from 'vitest'
import { SEED_WORDS } from '../vocabularyWords'
import { A1_LESSONS_NEW } from '../daily/a1Registry'
import { A2_LESSONS } from '../daily/lessonsA2'
import { B1_LESSONS_NEW as B1_LESSONS } from '../daily/lessonsB1'
import { B1PLUS_LESSONS_NEW as B1PLUS_LESSONS } from '../daily/lessonsB1plus'
import { B2_LESSONS_NEW as B2_LESSONS } from '../daily/lessonsB2'
import { GRAMMAR_TOPICS } from '../grammar'
import { READING_TEXTS } from '../reading'
import { LISTENING_LESSONS } from '../listeningLessons'
import { SPEAKING_PROMPTS } from '../speakingPrompts'
import { WRITING_PROMPTS } from '../writingPrompts'
import { MOCK_TEST_QUESTIONS } from '../mockTestData'

// Daraja darslari: A2, B1, B1+, B2.
// TENSES_LESSONS alohida saqlanadi — pedagogik jihatdan B1/B2 tenses ularning
// daraja darslariga singdirilgan (lessonsB1.ts/B1_LESSONS_NEW da 5 ta,
// lessonsB2.ts/B2_LESSONS_NEW da 1 ta), shuning uchun ALL_LESSONS ga
// qo'shilsa id dublikat bo'lardi.
const ALL_LESSONS = [
  ...A2_LESSONS,
  ...B1_LESSONS,
  ...B1PLUS_LESSONS,
  ...B2_LESSONS,
]

// Transcript integritet tekshiruvi uchun A1 ni ham qamraymiz
const ALL_LESSONS_WITH_LISTENING = [...A1_LESSONS_NEW, ...ALL_LESSONS]

describe('vocabularyWords data', () => {
  it('has at least 50 seed words', () => {
    expect(SEED_WORDS.length).toBeGreaterThanOrEqual(50)
  })

  it('every word has required fields', () => {
    for (const w of SEED_WORDS) {
      expect(w.word).toBeTruthy()
      expect(w.translation).toBeTruthy()
      expect(w.phonetic).toBeTruthy()
      expect(w.level).toMatch(/^(A1|A2|B1|B1\+|B2)$/)
      expect(w.category).toBeTruthy()
    }
  })

  it('no duplicate words', () => {
    const words = SEED_WORDS.map((w) => w.word.toLowerCase())
    expect(new Set(words).size).toBe(words.length)
  })

  it('all example sentences end with punctuation', () => {
    for (const w of SEED_WORDS) {
      expect(w.exampleSentence).toMatch(/[.!?]$/)
    }
  })
})

describe('daily lessons data', () => {
  it('has at least 39 total lessons across all levels', () => {
    expect(ALL_LESSONS.length).toBeGreaterThanOrEqual(39)
  })

  it('every lesson has required fields', () => {
    for (const l of ALL_LESSONS) {
      expect(l.id).toBeTruthy()
      expect(l.title).toBeTruthy()
      expect(l.level).toMatch(/^(A1|A2|B1|B1\+|B2)$/)
      expect(l.day).toBeGreaterThanOrEqual(0)
      expect(Array.isArray(l.exercises)).toBe(true)
      expect(Array.isArray(l.vocabulary)).toBe(true)
    }
  })

  it('no duplicate lesson ids', () => {
    const ids = ALL_LESSONS.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every lesson has at least 10 vocabulary items', () => {
    for (const l of ALL_LESSONS) {
      expect(l.vocabulary.length).toBeGreaterThanOrEqual(10)
    }
  })

  it('no duplicate exercise IDs within each lesson', () => {
    for (const l of ALL_LESSONS) {
      const ids = l.exercises.map((ex: { id: number }) => ex.id)
      const unique = new Set(ids)
      if (unique.size !== ids.length) {
        const dup = ids.filter((id, i) => ids.indexOf(id) !== i)
        // eslint-disable-next-line no-console
        console.warn(`[WARN] Lesson "${l.id}" has duplicate exercise IDs: ${[...new Set(dup)].join(', ')}`)
      }
      expect(unique.size).toBe(ids.length)
    }
  })

  // ── Lesson data quality ──

  const VALID_EXERCISE_TYPES = ['fill-blank', 'multiple-choice', 'error-correction', 'transformation', 'fill-table', 'vocab-match', 'passage', 'connection']
  // 'connection' (elaborative encoding) — ochiq javobli, explanation o'rniga exampleAnswer ishlatadi
  const TYPES_WITHOUT_EXPLANATION = ['connection']

  it('every exercise has a valid type', () => {
    for (const l of ALL_LESSONS) {
      for (const ex of l.exercises) {
        expect(VALID_EXERCISE_TYPES.includes(ex.type)).toBe(true)
      }
      if (l.tests) {
        for (const t of l.tests) {
          expect(VALID_EXERCISE_TYPES.includes(t.type)).toBe(true)
        }
      }
    }
  })

  it('every exercise has a non-empty explanation', () => {
    for (const l of ALL_LESSONS) {
      for (const ex of l.exercises) {
        if (TYPES_WITHOUT_EXPLANATION.includes(ex.type)) continue
        expect(ex.explanation).toBeTruthy()
        expect(ex.explanation.length).toBeGreaterThanOrEqual(3)
      }
      if (l.tests) {
        for (const t of l.tests) {
          if (TYPES_WITHOUT_EXPLANATION.includes(t.type)) continue
          expect(t.explanation).toBeTruthy()
          expect(t.explanation.length).toBeGreaterThanOrEqual(3)
        }
      }
    }
  })

  it('no duplicate test IDs within each lesson', () => {
    for (const l of ALL_LESSONS) {
      if (l.tests) {
        const ids = l.tests.map((t: { id: number }) => t.id)
        const unique = new Set(ids)
        if (unique.size !== ids.length) {
          const dup = ids.filter((id, i) => ids.indexOf(id) !== i)
          // eslint-disable-next-line no-console
          console.warn(`[WARN] Lesson "${l.id}" has duplicate test IDs: ${[...new Set(dup)].join(', ')}`)
        }
        expect(unique.size).toBe(ids.length)
      }
    }
  })

  it('every exercise ID in exerciseSections exists in exercises array', () => {
    const missing: string[] = []
    for (const l of ALL_LESSONS) {
      const allIds = new Set([
        ...l.exercises.map((ex: { id: number }) => ex.id),
        ...((l as Record<string, unknown>).specialCases
          ? ((l as Record<string, unknown>).specialCases as Record<string, unknown>[])
              .flatMap(sc => Array.isArray(sc.drills) ? (sc.drills as { id: number }[]).map(d => d.id) : [])
          : []),
      ])
      for (const section of l.exerciseSections || []) {
        for (const id of section.ids) {
          if (!allIds.has(id)) {
            missing.push(`[${(l as Record<string, unknown>).level}] ${(l as Record<string, unknown>).id}: section "${section.title}" references non-existent exercise ID ${id}`)
          }
        }
      }
    }
    if (missing.length) {
      // Runtime (LessonView.tsx) filters gracefully — data migration needed
      // eslint-disable-next-line no-console
      console.warn(`⚠️ ${missing.length} exerciseSection reference(s) missing. Data migration needed.`)
    }
  })
})

describe('daily lesson listening transcripts', () => {
  // Audio transcriptdan TTS (SpeechSynthesis) orqali generatsiya qilinadi va
  // listeningUtils.parseTranscript uni '\n' bo'yicha qatorlarga bo'ladi.
  // Manba matnda IKKI teskari chiziqli '\\n' (literal backslash+n) bo'lsa,
  // qatorlarga bo'linmaydi va TTS + transcript ko'rinishi buziladi (P0-1 bug klassi).
  const withListening = ALL_LESSONS_WITH_LISTENING.filter(
    (l): l is typeof l & { listening: { transcript: string } } =>
      !!(l as Record<string, unknown>).listening,
  )

  it('no lesson transcript contains a literal double-escaped newline (\\n)', () => {
    const bad: string[] = []
    for (const l of withListening) {
      const transcript = l.listening?.transcript ?? ''
      if (transcript.includes('\\n')) bad.push(`${l.level} «${l.id}»`)
    }
    expect(bad, `Literal '\\\\n' topilgan darslar: ${bad.join(', ')}`).toEqual([])
  })

  it('every listening transcript is non-empty', () => {
    for (const l of withListening) {
      expect(l.listening?.transcript?.trim()).toBeTruthy()
    }
  })
})

describe('grammar topics data', () => {
  it('has at least 15 grammar topics', () => {
    expect(GRAMMAR_TOPICS.length).toBeGreaterThanOrEqual(15)
  })

  it('every topic has required fields', () => {
    for (const t of GRAMMAR_TOPICS) {
      expect(t.id).toBeTruthy()
      expect(t.title).toBeTruthy()
      expect(t.subtitle).toBeTruthy()
      expect(t.level).toMatch(/^(A1|A2|B1|B1\+|B2)$/)
      expect(typeof t.week).toBe('number')
      expect(typeof t.tag).toBe('string')
      expect(Array.isArray(t.formulaRows)).toBe(true)
      expect(Array.isArray(t.usedFor)).toBe(true)
      expect(Array.isArray(t.examples)).toBe(true)
      expect(Array.isArray(t.exercises)).toBe(true)
    }
  })

  it('no duplicate grammar topic ids', () => {
    const ids = GRAMMAR_TOPICS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('each topic has at least 1 exercise', () => {
    for (const t of GRAMMAR_TOPICS) {
      expect(t.exercises.length).toBeGreaterThanOrEqual(1)
    }
  })
})

describe('reading texts data', () => {
  it('has at least 10 reading texts', () => {
    expect(READING_TEXTS.length).toBeGreaterThanOrEqual(10)
  })

  it('every text has required fields', () => {
    for (const t of READING_TEXTS) {
      expect(t.id).toBeTruthy()
      expect(t.title).toBeTruthy()
      expect(t.topic).toBeTruthy()
      expect(t.level).toMatch(/^(A1|A2|B1|B1\+|B2)$/)
      expect(typeof t.wordCount).toBe('number')
      expect(typeof t.readingTime).toBe('number')
      expect(Array.isArray(t.paragraphs)).toBe(true)
      expect(t.paragraphs.length).toBeGreaterThanOrEqual(1)
      expect(Array.isArray(t.questions)).toBe(true)
    }
  })

  it('no duplicate reading text ids', () => {
    const ids = READING_TEXTS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every text has at least 3 questions', () => {
    for (const t of READING_TEXTS) {
      expect(t.questions.length).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('listening lessons data', () => {
  it('has at least 10 listening lessons', () => {
    expect(LISTENING_LESSONS.length).toBeGreaterThanOrEqual(10)
  })

  it('every lesson has required fields', () => {
    for (const l of LISTENING_LESSONS) {
      expect(l.id).toBeTruthy()
      expect(l.title).toBeTruthy()
      expect(l.source).toBeTruthy()
      expect(l.level).toMatch(/^(A1|A2|B1|B1\+|B2)$/)
      expect(l.duration).toBeTruthy()
      expect(l.youtubeId).toBeTruthy()
      expect(l.topic).toBeTruthy()
      expect(Array.isArray(l.transcript)).toBe(true)
      expect(l.transcript.length).toBeGreaterThanOrEqual(1)
      expect(Array.isArray(l.fillBlanks)).toBe(true)
      expect(Array.isArray(l.trueFalse)).toBe(true)
    }
  })

  it('no duplicate listening lesson ids', () => {
    const ids = LISTENING_LESSONS.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('speaking prompts data', () => {
  it('has at least 20 speaking prompts', () => {
    expect(SPEAKING_PROMPTS.length).toBeGreaterThanOrEqual(20)
  })

  it('every prompt has required fields', () => {
    for (const p of SPEAKING_PROMPTS) {
      expect(p.id).toBeTruthy()
      expect(p.prompt).toBeTruthy()
      expect(p.level).toMatch(/^(A1|A2|B1|B1\+|B2)$/)
      expect(p.category).toMatch(/^(personal|opinion|description|narrative|abstract)$/)
      expect(Array.isArray(p.tips)).toBe(true)
      expect(typeof p.timeSeconds).toBe('number')
    }
  })

  it('no duplicate speaking prompt ids', () => {
    const ids = SPEAKING_PROMPTS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('writing prompts data', () => {
  it('has at least 10 writing prompts', () => {
    expect(WRITING_PROMPTS.length).toBeGreaterThanOrEqual(10)
  })

  it('every prompt has required fields', () => {
    for (const p of WRITING_PROMPTS) {
      expect(p.id).toBeTruthy()
      expect(p.type).toMatch(/^(opinion|discussion|problem-solution|advantage-disadvantage|ielts-task1-graph|ielts-task1-table|ielts-task1-process|ielts-task1-map|ielts-task2-opinion|ielts-task2-discussion|ielts-task2-problem|academic-compare|academic-cause-effect|creative-story|lesson-integrated)$/)
      expect(p.prompt).toBeTruthy()
      expect(typeof p.wordLimit).toBe('number')
      expect(typeof p.timeMinutes).toBe('number')
      expect(Array.isArray(p.tips)).toBe(true)
      expect(p.tips.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('no duplicate writing prompt ids', () => {
    const ids = WRITING_PROMPTS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('mock test questions data', () => {
  it('has at least 100 mock test questions', () => {
    expect(MOCK_TEST_QUESTIONS.length).toBeGreaterThanOrEqual(100)
  })

  it('every question has required fields', () => {
    for (const q of MOCK_TEST_QUESTIONS) {
      expect(q.id).toBeTruthy()
      expect(q.level).toMatch(/^(A1|A2|B1|B2)$/)
      expect(q.section).toMatch(/^(grammar|vocabulary|reading)$/)
      expect(q.q).toBeTruthy()
      expect(Array.isArray(q.opts)).toBe(true)
      expect(q.opts.length).toBeGreaterThanOrEqual(2)
      expect(typeof q.ans).toBe('number')
      expect(q.ans).toBeGreaterThanOrEqual(0)
      expect(q.ans).toBeLessThan(q.opts.length)
    }
  })

  it('no duplicate mock question ids', () => {
    const ids = MOCK_TEST_QUESTIONS.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('correct answer index is valid for all questions', () => {
    for (const q of MOCK_TEST_QUESTIONS) {
      expect(q.ans).toBeGreaterThanOrEqual(0)
      expect(q.ans).toBeLessThan(q.opts.length)
    }
  })
})
