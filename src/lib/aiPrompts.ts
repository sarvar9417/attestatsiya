export interface LessonContent {
  title: string
  level: string
  formulas?: { label: string; structure: string; color?: string }[]
  rules?: string[]
  vocabulary?: { en: string; uz: string; example?: string; rule?: string }[]
}

export function buildSpeakingPrompt(lesson: LessonContent): string {
  const lines: string[] = []
  lines.push(`Lesson topic: "${lesson.title}"`)
  lines.push(`Level: ${lesson.level}`)
  if (lesson.formulas && lesson.formulas.length > 0) {
    lines.push('', 'Grammar formulas:', ...lesson.formulas.map(f => `- ${f.label}: ${f.structure}`))
  }
  if (lesson.rules && lesson.rules.length > 0) {
    lines.push('', 'Grammar rules:', ...lesson.rules.map(r => `- ${r}`))
  }
  if (lesson.vocabulary && lesson.vocabulary.length > 0) {
    lines.push('', 'Target vocabulary:', ...lesson.vocabulary.map(v => `- ${v.en} = ${v.uz}`))
  }
  return lines.join('\n')
}

export function buildWritingPrompt(lesson: LessonContent): string {
  const lines: string[] = []
  lines.push(`Lesson topic: "${lesson.title}"`)
  lines.push(`Level: ${lesson.level}`)
  if (lesson.formulas && lesson.formulas.length > 0) {
    lines.push('', 'Grammar formulas to practise:', ...lesson.formulas.map(f => `- ${f.label}: ${f.structure}`))
  }
  if (lesson.rules && lesson.rules.length > 0) {
    lines.push('', 'Grammar rules:', ...lesson.rules.map(r => `- ${r}`))
  }
  if (lesson.vocabulary && lesson.vocabulary.length > 0) {
    lines.push('', 'Target vocabulary:', ...lesson.vocabulary.map(v => `- ${v.en} = ${v.uz}`))
  }
  return lines.join('\n')
}
