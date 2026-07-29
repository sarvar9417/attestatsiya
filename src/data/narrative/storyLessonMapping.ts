// ─── Lesson-to-Story Mapping ──────────────────────────────────────────────
// Har bir dars o'rganish yo'lining qaysi bosqichiga to'g'ri keladi.
// storyDay: 1–126 — 126 kunlik safaringizning kuni.

import { STORY_BEATS } from './storyline'

export interface StoryLessonLink {
  lessonId: string
  storyDay: number
  storyAct: string
  scene: string         // nima bo'lyapti?
}

// Asosiy grammatika mavzularini o'rganish yo'liga bog'laymiz
export const STORY_LESSON_LINKS: StoryLessonLink[] = [
  // ─── Prologue (kun 1–4): Boshlanish ──────────────────────────────
  { lessonId: 'simple-present',        storyDay: 1,  storyAct: 'prologue', scene: 'Birinchi qadam — o\'zingizni ingliz tilida tanishtirishni o\'rganasiz' },
  { lessonId: 'present-continuous',    storyDay: 2,  storyAct: 'prologue', scene: 'Hozir nima qilyapsiz? Ayta olasizmi — present continuous' },
  { lessonId: 'simple-past',           storyDay: 3,  storyAct: 'prologue', scene: 'Kechagi voqeani aytib bering — past simple' },

  // ─── Act 1 (kun 5–27): A2 — Asoslarni o'rganish ─────────────────────
  { lessonId: 'simple-future',         storyDay: 5,  storyAct: 'act1',     scene: 'Ertangi rejalaringiz haqida gapirasiz' },
  { lessonId: 'going-to',              storyDay: 7,  storyAct: 'act1',     scene: 'Kelajak rejalaringizni aytasiz — going to' },
  { lessonId: 'present-perfect',       storyDay: 10, storyAct: 'act1',     scene: 'Tajribalaringiz haqida gapirasiz — "I have never..."' },
  { lessonId: 'past-continuous',       storyDay: 13, storyAct: 'act1',     scene: 'Kecha nima qilayotganingizni aytasiz — past continuous' },
  { lessonId: 'modal-verbs',           storyDay: 16, storyAct: 'act1',     scene: 'Ruxsat so\'rash va maslahat berishni o\'rganasiz' },
  { lessonId: 'prepositions',          storyDay: 19, storyAct: 'act1',     scene: 'CV\'ingizni ingliz tilida yozishga tayyorlanasiz' },
  { lessonId: 'articles',              storyDay: 22, storyAct: 'act1',     scene: 'Email yozishda artikllarni to\'g\'ri ishlatishni o\'rganasiz' },
  { lessonId: 'time-prepositions',     storyDay: 25, storyAct: 'act1',     scene: 'Uchrashuv vaqtini belgilashni o\'rganasiz' },

  // ─── Act 2 (kun 28–55): B1 — Intervyu tayyorgarlik ────────────────
  { lessonId: 'past-habits',           storyDay: 28, storyAct: 'act2',     scene: 'Oldingi tajribangiz haqida gapirasiz — used to' },
  { lessonId: 'first-conditional',     storyDay: 32, storyAct: 'act2',     scene: '"Agar shunday bo\'lsa..." degan vaziyatlarni o\'rganasiz' },
  { lessonId: 'modals-obligation',     storyDay: 35, storyAct: 'act2',     scene: 'Majburiyat va qoidalar haqida gapirasiz — must, have to' },
  { lessonId: 'passive-voice',         storyDay: 38, storyAct: 'act2',     scene: '"The project was completed" — passive voice ni o\'rganasiz' },
  { lessonId: 'reported-speech',       storyDay: 42, storyAct: 'act2',     scene: 'Boshqalar aytgan gaplarni takrorlashni o\'rganasiz' },
  { lessonId: 'gerunds-infinitives',   storyDay: 45, storyAct: 'act2',     scene: 'Ko\'nikmalaringiz haqida gapirishni mashq qilasiz' },
  { lessonId: 'time-clauses',          storyDay: 48, storyAct: 'act2',     scene: '"By the time I arrive..." — vaqt gaplarini o\'rganasiz' },
  { lessonId: 'quantifiers',           storyDay: 52, storyAct: 'act2',     scene: 'Yutuqlaringiz haqida raqamlar bilan gapirasiz' },

  // ─── Act 3 (kun 56–78): B1+ — Londonda birinchi oy ─────────────────
  { lessonId: 'modals-speculation',    storyDay: 56, storyAct: 'act3',     scene: '"He might be..." — taxmin qilishni o\'rganasiz' },
  { lessonId: 'future-forms-review',   storyDay: 60, storyAct: 'act3',     scene: 'Kelasi haftadagi rejalar haqida gapirasiz' },
  { lessonId: 'phrasal-verbs-b1',      storyDay: 64, storyAct: 'act3',     scene: 'Ish muhitida kerakli phrasal verb\'larni o\'rganasiz' },
  { lessonId: 'narrative-tenses-b1plus', storyDay: 68, storyAct: 'act3',   scene: 'Esda qolarli kuningizni hikoya qilasiz — narrative tenses' },
  { lessonId: 'wish-if-only',          storyDay: 72, storyAct: 'act3',     scene: '"I wish..." — afsus va orzuni ifodalashni o\'rganasiz' },
  { lessonId: 'modal-perfects-b1plus', storyDay: 75, storyAct: 'act3',     scene: '"I should have..." — o\'tmish tahlilini o\'rganasiz' },
  { lessonId: 'first-conditional-full', storyDay: 78, storyAct: 'act3',    scene: 'Murakkab shart gaplari bilan prezentatsiya tayyorlaysiz' },

  // ─── Act 4 (kun 79–126): B2 — Professional daraja ──────────────────
  { lessonId: 'advanced-conditionals-b2', storyDay: 80, storyAct: 'act4',  scene: 'Murakkab fikrlarni ifodalaysiz — mixed conditionals' },
  { lessonId: 'advanced-modals-b2',    storyDay: 83, storyAct: 'act4',     scene: 'Professional muzokara tilini o\'rganasiz' },
  { lessonId: 'complex-prepositions-b2', storyDay: 86, storyAct: 'act4',   scene: 'Akademik yozishda murakkab predloglarni ishlatasiz' },
  { lessonId: 'cohesion-b2',           storyDay: 89, storyAct: 'act4',     scene: 'B2 sertifikati uchun yakuniy imtihonga tayyorlanasiz' },
  { lessonId: 'reported-speech-b2',    storyDay: 92, storyAct: 'act4',     scene: 'Rasmiy bayonnoma yozishni o\'zlashtirasiz' },
  { lessonId: 'advanced-modals-b2',    storyDay: 95, storyAct: 'act4',     scene: '"This must be reviewed" — professional muloqot' },

  // ─── Review / Mixed
  { lessonId: 'question-formation-a2', storyDay: 8,  storyAct: 'act1',     scene: 'To\'g\'ri savol tuzishni o\'rganasiz' },
  { lessonId: 'comparatives-a2',       storyDay: 14, storyAct: 'act1',     scene: 'Narsalarni taqqoslashni o\'rganasiz — comparatives' },
  { lessonId: 'second-conditional',    storyDay: 40, storyAct: 'act2',     scene: '"If I had..." — orzu va xayolni ifodalaysiz' },
  { lessonId: 'third-conditional',     storyDay: 70, storyAct: 'act3',     scene: 'O\'tmishdagi vaziyatlarni tahlil qilasiz — third conditional' },
]

// ─── Helpers ───────────────────────────────────────────────────────────────

export function getStoryForLesson(lessonId: string): StoryLessonLink | undefined {
  return STORY_LESSON_LINKS.find(l => l.lessonId === lessonId)
}

export function getLessonsForDay(day: number): StoryLessonLink[] {
  return STORY_LESSON_LINKS.filter(l => l.storyDay === day)
}

export function getStoryActByDay(day: number): string {
  const beat = STORY_BEATS.find(b => day >= b.dayRange[0] && day <= b.dayRange[1])
  return beat?.act ?? 'prologue'
}
