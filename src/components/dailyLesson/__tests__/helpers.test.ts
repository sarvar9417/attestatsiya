import { describe, it, expect } from 'vitest'
import { normalizeAnswer, checkAnswer, OPTION_LABELS, getExerciseContext, getCorrectText } from '../helpers'
import type { DailyExercise } from '../../../data/dailyLessons'

const exercise = <T extends Partial<DailyExercise>>(value: T) => value as unknown as DailyExercise

describe('normalizeAnswer', () => {
  it('trims whitespace', () => {
    expect(normalizeAnswer('  hello  ')).toBe('hello')
  })

  it('lowercases', () => {
    expect(normalizeAnswer('HELLO')).toBe('hello')
  })

  it('removes punctuation', () => {
    expect(normalizeAnswer('hello, world!')).toBe('hello world')
  })

  it('replaces n\'t with not', () => {
    expect(normalizeAnswer('don\'t')).toBe('do not')
    expect(normalizeAnswer('can\'t')).toBe('cannot')
    expect(normalizeAnswer('isn\'t')).toBe('is not')
  })

  it('collapses multiple spaces', () => {
    expect(normalizeAnswer('hello    world')).toBe('hello world')
  })

  it('handles empty string', () => {
    expect(normalizeAnswer('')).toBe('')
  })

  it('handles mixed case with punctuation and contractions', () => {
    expect(normalizeAnswer('  I don\'t like, apples!  ')).toBe('i do not like apples')
  })
})

describe('checkAnswer', () => {
  it('returns false for empty answers', () => {
    expect(checkAnswer(exercise({ type: 'multiple-choice' }), [])).toBe(false)
    expect(checkAnswer(exercise({ type: 'fill-blank' }), [])).toBe(false)
  })

  it('checks fill-blank type', () => {
    const ex = exercise({
      type: 'fill-blank',
      instruction: '',
      blanks: ['hello', 'world'],
      question: '___ ___',
      explanation: '',
    })
    expect(checkAnswer(ex, ['hello', 'world'])).toBe(true)
    expect(checkAnswer(ex, ['HELLO', 'WORLD!'])).toBe(true)
    expect(checkAnswer(ex, ['goodbye', 'world'])).toBe(false)
  })

  it('checks fill-blank type with acceptedAnswers alternatives', () => {
    const ex = exercise({
      type: 'fill-blank',
      instruction: '',
      blanks: ['next to'],
      question: 'The pharmacy is ___ the hospital',
      acceptedAnswers: [['next to', 'beside']],
      explanation: '',
    })
    expect(checkAnswer(ex, ['next to'])).toBe(true)
    expect(checkAnswer(ex, ['beside'])).toBe(true)
    expect(checkAnswer(ex, ['near'])).toBe(false)
  })

  it('checks multiple-choice type', () => {
    const ex = exercise({
      type: 'multiple-choice',
      instruction: '',
      question: 'Choose:',
      options: ['A', 'B', 'C', 'D'],
      correct: 'B',
      explanation: '',
    })
    expect(checkAnswer(ex, ['B'])).toBe(true)
    expect(checkAnswer(ex, ['b'])).toBe(true)
    expect(checkAnswer(ex, ['A'])).toBe(false)
  })

  it('checks error-correction type', () => {
    const ex = exercise({
      type: 'error-correction',
      instruction: '',
      question: 'He go to school',
      errorPart: 'go',
      correct: 'goes',
      explanation: '',
    })
    expect(checkAnswer(ex, ['goes'])).toBe(true)
    expect(checkAnswer(ex, ['GOES'])).toBe(true)
    expect(checkAnswer(ex, ['go'])).toBe(false)
  })

  it('checks transformation type', () => {
    const ex = exercise({
      type: 'transformation',
      instruction: '',
      question: 'Change to past',
      hint: 'I play',
      correct: 'I played',
      explanation: '',
    })
    expect(checkAnswer(ex, ['I played'])).toBe(true)
    expect(checkAnswer(ex, ['i played!'])).toBe(true)
    expect(checkAnswer(ex, ['I play'])).toBe(false)
  })

  it('checks fill-table type', () => {
    const ex = exercise({
      type: 'fill-table',
      instruction: 'Fill the table',
      rows: [
        { adj: 'big', comp: 'bigger', sup: 'biggest' },
        { adj: 'small', comp: 'smaller', sup: 'smallest' },
      ],
      explanation: '',
    })
    expect(checkAnswer(ex, ['bigger', 'biggest', 'smaller', 'smallest'])).toBe(true)
    expect(checkAnswer(ex, ['bigger', 'biggest', 'wrong', 'smallest'])).toBe(false)
  })

  it('handles fill-table with empty expected cells', () => {
    const ex = exercise({
      type: 'fill-table',
      instruction: 'Fill',
      rows: [
        { adj: 'good', comp: '', sup: '' },
      ],
      explanation: '',
    })
    expect(checkAnswer(ex, [''])).toBe(true)
  })

  it('checks passage type (contextual fill-blank)', () => {
    const ex = exercise({
      type: 'passage',
      instruction: 'Fill blanks',
      passage: 'He is ___(1) than me. She is the ___(2).',
      blanks: ['taller', 'best'],
      explanation: '',
    })
    expect(checkAnswer(ex, ['taller', 'best'])).toBe(true)
    expect(checkAnswer(ex, ['TALLER', 'Best!'])).toBe(true)
    expect(checkAnswer(ex, ['taller', 'worst'])).toBe(false)
  })

  it('checks passage type with acceptedAnswers alternatives', () => {
    const ex = exercise({
      type: 'passage',
      instruction: '',
      passage: '___(1)',
      blanks: ['happiest'],
      acceptedAnswers: [['happiest', 'best']],
      explanation: '',
    })
    expect(checkAnswer(ex, ['happiest'])).toBe(true)
    expect(checkAnswer(ex, ['best'])).toBe(true)
    expect(checkAnswer(ex, ['saddest'])).toBe(false)
  })

  it('checks connection type (completed when non-empty)', () => {
    const ex = exercise({
      type: 'connection',
      instruction: '',
      prompt: 'Write 3 sentences',
      hints: ['hint'],
      exampleAnswer: 'My sister is older than me.',
    })
    expect(checkAnswer(ex, ['I am taller than my brother.'])).toBe(true)
    expect(checkAnswer(ex, ['   '])).toBe(false)
    expect(checkAnswer(ex, [''])).toBe(false)
  })
})

describe('getExerciseContext / getCorrectText', () => {
  it('returns context for every exercise type', () => {
    expect(getExerciseContext(exercise({ type: 'fill-blank', instruction: '', question: 'Q', blanks: ['a'], explanation: '' }))).toBe('Q')
    expect(getExerciseContext(exercise({ type: 'vocab-match', instruction: '', word: 'cat', options: ['dog'], correct: 'cat', explanation: '' }))).toBe('cat')
    expect(getExerciseContext(exercise({ type: 'passage', instruction: '', passage: 'P', blanks: [], explanation: '' }))).toBe('P')
    expect(getExerciseContext(exercise({ type: 'connection', instruction: '', prompt: 'Pr', hints: [], exampleAnswer: '', explanation: '' }))).toBe('Pr')
  })

  it('returns correct-answer text for fill-blank, passage and connection', () => {
    expect(getCorrectText(exercise({ type: 'fill-blank', instruction: '', question: '', blanks: ['next to'], acceptedAnswers: [['next to', 'beside']], explanation: '' }))).toBe('next to / beside')
    expect(getCorrectText(exercise({ type: 'fill-blank', instruction: '', question: 'They ___ play the guitar.', blanks: ['can'], explanation: '' }))).toBe('can')
    expect(getCorrectText(exercise({ type: 'passage', instruction: '', passage: '', blanks: ['a', 'b'], explanation: '' }))).toBe('a / b')
    expect(getCorrectText(exercise({ type: 'connection', instruction: '', prompt: '', hints: [], exampleAnswer: 'Example.', explanation: '' }))).toBe('Example.')
  })
})

describe('OPTION_LABELS', () => {
  it('has labels A through D', () => {
    expect(OPTION_LABELS).toEqual(['A', 'B', 'C', 'D'])
  })

  it('has at least 4 labels for MCQ options', () => {
    expect(OPTION_LABELS.length).toBeGreaterThanOrEqual(4)
  })
})
