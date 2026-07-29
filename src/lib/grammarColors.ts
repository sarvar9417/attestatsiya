export const GRAMMAR_CATEGORIES = {
  tenses:       'tenses',
  modals:       'modals',
  prepositions: 'prepositions',
  conditionals: 'conditionals',
  articles:     'articles',
  passives:     'passives',
  reported:     'reported',
  vocabulary:   'vocabulary',
  phrasal:      'phrasal',
  other:        'other',
} as const

export type GrammarCategory = keyof typeof GRAMMAR_CATEGORIES

export const GRAMMAR_COLORS: Record<GrammarCategory, {
  bg: string; text: string; border: string; badge: string; dark: string
}> = {
  tenses:       { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200',  badge: 'bg-blue-100 text-blue-700',   dark: 'dark:bg-blue-900/30 dark:text-blue-300' },
  modals:       { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200',badge: 'bg-purple-100 text-purple-700',dark: 'dark:bg-purple-900/30 dark:text-purple-300' },
  prepositions: { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dark: 'dark:bg-amber-900/30 dark:text-amber-300' },
  conditionals: { bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-200',   badge: 'bg-red-100 text-red-700',     dark: 'dark:bg-red-900/30 dark:text-red-300' },
  articles:     { bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200', badge: 'bg-green-100 text-green-700', dark: 'dark:bg-green-900/30 dark:text-green-300' },
  passives:     { bg: 'bg-teal-50',    text: 'text-teal-700',   border: 'border-teal-200',  badge: 'bg-teal-100 text-teal-700',   dark: 'dark:bg-teal-900/30 dark:text-teal-300' },
  reported:     { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200',badge: 'bg-orange-100 text-orange-700',dark: 'dark:bg-orange-900/30 dark:text-orange-300' },
  vocabulary:   { bg: 'bg-pink-50',    text: 'text-pink-700',   border: 'border-pink-200',  badge: 'bg-pink-100 text-pink-700',   dark: 'dark:bg-pink-900/30 dark:text-pink-300' },
  phrasal:      { bg: 'bg-indigo-50',  text: 'text-indigo-700', border: 'border-indigo-200',badge: 'bg-indigo-100 text-indigo-700',dark: 'dark:bg-indigo-900/30 dark:text-indigo-300' },
  other:        { bg: 'bg-gray-50',    text: 'text-gray-700',   border: 'border-gray-200',  badge: 'bg-gray-100 text-gray-700',   dark: 'dark:bg-gray-900/30 dark:text-gray-300' },
}

export function getLessonColor(lessonId: string): typeof GRAMMAR_COLORS[GrammarCategory] {
  const category = LESSON_CATEGORY[lessonId] ?? 'other'
  return GRAMMAR_COLORS[category]
}

export const LESSON_CATEGORY: Record<string, GrammarCategory> = {
  'simple-present':         'tenses',
  'present-continuous':     'tenses',
  'simple-past':            'tenses',
  'simple-future':          'tenses',
  'present-perfect':        'tenses',
  'past-continuous':        'tenses',
  'future-forms-review':    'tenses',
  'past-habits':            'tenses',
  'narrative-tenses-b1plus':'tenses',
  'modal-verbs':            'modals',
  'modals-obligation':      'modals',
  'modals-speculation':     'modals',
  'modal-perfects-b1plus':  'modals',
  'advanced-modals-b2':     'modals',
  'prepositions':           'prepositions',
  'time-prepositions':      'prepositions',
  'complex-prepositions-b2':'prepositions',
  'first-conditional':      'conditionals',
  'time-clauses':           'conditionals',
  'advanced-conditionals-b2':'conditionals',
  'articles':               'articles',
  'passive-voice':          'passives',
  'cohesion-b2':            'passives',
  'reported-speech':        'reported',
  'indirect-questions':     'reported',
  'gerunds-infinitives':    'other',
  'quantifiers':            'vocabulary',
  'phrasal-verbs-b1':       'phrasal',
}
