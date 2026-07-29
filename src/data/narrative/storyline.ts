export interface StoryBeat {
  dayRange: [number, number]
  act: 'prologue' | 'act1a' | 'act1b' | 'act1c' | 'act2a' | 'act2b' | 'act2c' | 'act3a' | 'act3b' | 'act3c' | 'act4a' | 'act4b' | 'act4c' | 'epilogue'
  title: string
  context: string
  lessonHint: string
  location: string
  emoji: string
}

// ─── Sub-act grouping (for display/color purposes) ───────────────────────
const ACT_GROUP: Record<string, string> = {
  prologue: 'prologue',
  act1a: 'act1', act1b: 'act1', act1c: 'act1',
  act2a: 'act2', act2b: 'act2', act2c: 'act2',
  act3a: 'act3', act3b: 'act3', act3c: 'act3',
  act4a: 'act4', act4b: 'act4', act4c: 'act4',
  epilogue: 'epilogue',
}

export function getActGroup(act: string): string {
  return ACT_GROUP[act] ?? act
}

export const STORY_BEATS: StoryBeat[] = [
  // ── Prologue: Boshlanish (days 1–4) ─────────────────────────────────
  {
    dayRange: [1, 4], act: 'prologue',
    title: '🧭 Boshlanish',
    context: 'Bugun safaringiz boshlanadi. 126 kun ichida A1 dan B2 sari katta yo\'l bosasiz!',
    lessonHint: 'Ingliz tilini asoslaridan o\'rganishni boshladingiz.',
    location: 'A1 — Boshlang\'ich', emoji: '✉️',
  },

  // ── Act 1a: A2 asoslar (days 5–12) ───────────────────────────────────
  {
    dayRange: [5, 12], act: 'act1a',
    title: '🌱 A2 — Birinchi Qadamlar',
    context: 'Endi oddiy gaplar tuza olasiz. Har kuni yangi mavzu o\'rganyapsiz.',
    lessonHint: 'Bu mavzu sizni ingliz tilida erkin gapirishga bir qadam yaqinlashtirdi.',
    location: 'A2 — Asoslar', emoji: '📚',
  },

  // ── Act 1b: A2 kengaytirish (days 13–19) ─────────────────────────────
  {
    dayRange: [13, 19], act: 'act1b',
    title: '🌿 A2 — Ko\'nikmalar',
    context: 'Savol berish, vaqt haqida gapirish, taqqoslash — endi murakkabroq tuzilmalarni o\'rganyapsiz.',
    lessonHint: 'Amaliyot bilan mustahkamlang — real suhbatlarda ishlatish eng muhimi.',
    location: 'A2 — Rivojlanish', emoji: '🌻',
  },

  // ── Act 1c: A2 mustahkamlash (days 20–27) ───────────────────────────
  {
    dayRange: [20, 27], act: 'act1c',
    title: '🌳 A2 — Mustahkamlash',
    context: 'A2 darajasini yakunlayapsiz. Endi oddiy suhbatlarni tushuna va qatnasha olasiz.',
    lessonHint: 'A2 ni mustahkamlash B1 ga o\'tish uchun poydevor bo\'ladi.',
    location: 'A2 — Yakuniy', emoji: '🌲',
  },

  // ── Act 2a: B1 boshlanish (days 28–36) ───────────────────────────────
  {
    dayRange: [28, 36], act: 'act2a',
    title: '💼 B1 — Suhbat',
    context: 'Endi suhbat qura olasiz. Ish va kundalik mavzularda fikr bildirishni o\'rganyapsiz.',
    lessonHint: 'Bu mavzu real suhbatlarda javob bera olishingiz uchun juda muhim.',
    location: 'B1 — Suhbat', emoji: '💬',
  },

  // ── Act 2b: B1 kengaytirish (days 37–45) ─────────────────────────────
  {
    dayRange: [37, 45], act: 'act2b',
    title: '📋 B1 — Fikr Bildirish',
    context: 'Fikr bildirish, shart gaplar, passive voice — endi murakkab fikrlarni ifodalay olasiz.',
    lessonHint: 'Grammatik tuzilmalarni o\'zlashtirish — ishonchli gapirish kaliti.',
    location: 'B1 — Fikr', emoji: '🧠',
  },

  // ── Act 2c: B1 mustahkamlash (days 46–55) ────────────────────────────
  {
    dayRange: [46, 55], act: 'act2c',
    title: '🎯 B1 — Mustahkamlash',
    context: 'B1 darajasini yakunlashga yaqin. Endi ko\'proq mustaqil gapira olasiz.',
    lessonHint: 'B1 da mustahkam poydevor B1+ va B2 ga ishonchli o\'tishni ta\'minlaydi.',
    location: 'B1 — Yakuniy', emoji: '🔥',
  },

  // ── Act 3a: B1+ boshlanish (days 56–63) ──────────────────────────────
  {
    dayRange: [56, 63], act: 'act3a',
    title: '🏙️ B1+ — Professional',
    context: 'Professional ingliz tilini o\'rganyapsiz — ish, prezentatsiya va rasmiy muloqot.',
    lessonHint: 'Professional ingliz tili — ish va karyerangizga bevosita foydali.',
    location: 'B1+ — Ish', emoji: '🏢',
  },

  // ── Act 3b: B1+ hikoya (days 64–70) ─────────────────────────────────
  {
    dayRange: [64, 70], act: 'act3b',
    title: '📖 B1+ — Hikoya Qilish',
    context: 'Hikoya qilish, nisbiy gaplar, sifatdoshlar — matn va nutqingiz boyib bormoqda.',
    lessonHint: 'Narrative tenses va murakkab gap tuzilmalari bilan nutqingiz tabiiylashadi.',
    location: 'B1+ — Hikoya', emoji: '✍️',
  },

  // ── Act 3c: B1+ yakuniy (days 71–78) ────────────────────────────────
  {
    dayRange: [71, 78], act: 'act3c',
    title: '🌉 B1+ — Bog\'lovchilar',
    context: 'Linking words, kollokatsiyalar, phrasal verbs, idiomalar — ingiliz tilida professional tarafingizni ko\'rsatasiz.',
    lessonHint: 'Bog\'lovchi so\'zlar va idiomalar sizni natural gapiruvchiga aylantiradi.',
    location: 'B1+ — Yakuniy', emoji: '🔗',
  },

  // ── Act 4a: B2 boshlanish (days 79–94) ───────────────────────────────
  {
    dayRange: [79, 94], act: 'act4a',
    title: '🌟 B2 — Akademik',
    context: 'Endi murakkab muhokamalar, akademik yozish va rasmiy nutq darajasidasiz!',
    lessonHint: 'B2 darajasiga yetib bormoqdasiz — deyarli maqsadingizdasiz!',
    location: 'B2 — Akademik', emoji: '🎓',
  },

  // ── Act 4b: B2 murakkab (days 95–110) ────────────────────────────────
  {
    dayRange: [95, 110], act: 'act4b',
    title: '⚡ B2 — Murakkab Tuzilmalar',
    context: 'Mixed conditionals, advanced modals, cohesion — B2 sertifikati talab qiladigan barcha mavzular.',
    lessonHint: 'Eng murakkab grammatik tuzilmalarni o\'zlashtirish — B2 darajasining kaliti.',
    location: 'B2 — Murakkab', emoji: '💎',
  },

  // ── Act 4c: B2 yakuniy + imtihon (days 111–126) ─────────────────────
  {
    dayRange: [111, 126], act: 'act4c',
    title: '🏆 B2 — Yakuniy',
    context: 'Barcha o\'rganganlaringizni takrorlab, B2 darajasini yakunlaysiz. IELTS va imtihonlarga tayyorsiz!',
    lessonHint: 'Eng yuqori daraja — barcha bilimlaringizni sinovdan o\'tkazish vaqti.',
    location: 'B2 — Final', emoji: '🏆',
  },

  // ── Epilogue: Yakun (day 126+) ────────────────────────────────────────
  {
    dayRange: [126, 126], act: 'epilogue',
    title: '🎉 Sayohat Yakuni',
    context: '126 kunlik safar yakunlandi! Siz A1 dan B2 gacha bo\'lgan katta yo\'lni bosib o\'tdingiz.',
    lessonHint: 'Bugun — 126-kun. Til o\'rganish hech qachon tugamaydi, faqat yangi bosqich boshlanadi.',
    location: 'B2 — Tamom', emoji: '🎉',
  },
]

export function getStoryBeat(day: number): StoryBeat {
  return STORY_BEATS.find(b => day >= b.dayRange[0] && day <= b.dayRange[1])
    ?? STORY_BEATS[STORY_BEATS.length - 1]
}

// ─── Act display info (shared across UI components) ───────────────────────
export interface ActDisplay {
  label: string
  emoji: string
  color: string
  bgClass: string
  lightBgClass: string
  borderClass: string
  textClass: string
}

const ACT_PARENT: Record<string, string> = {
  prologue: 'prologue',
  act1a: 'act1', act1b: 'act1', act1c: 'act1',
  act2a: 'act2', act2b: 'act2', act2c: 'act2',
  act3a: 'act3', act3b: 'act3', act3c: 'act3',
  act4a: 'act4', act4b: 'act4', act4c: 'act4',
  epilogue: 'epilogue',
}

export const ACT_DISPLAY: Record<string, ActDisplay> = {
  prologue: {
    label: 'Boshlanish',
    emoji: '🌱',
    color: '#6b7280',
    bgClass: 'bg-gray-500',
    lightBgClass: 'bg-gray-50',
    borderClass: 'border-gray-200',
    textClass: 'text-gray-600 dark:text-gray-400',
  },
  act1: {
    label: '1-qism',
    emoji: '📚',
    color: '#059669',
    bgClass: 'bg-emerald-500',
    lightBgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
  act2: {
    label: '2-qism',
    emoji: '💼',
    color: '#2563eb',
    bgClass: 'bg-blue-500',
    lightBgClass: 'bg-sky-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-600 dark:text-blue-400',
  },
  act3: {
    label: '3-qism',
    emoji: '🏙️',
    color: '#7c3aed',
    bgClass: 'bg-violet-500',
    lightBgClass: 'bg-violet-50',
    borderClass: 'border-violet-200',
    textClass: 'text-violet-600 dark:text-violet-400',
  },
  act4: {
    label: '4-qism',
    emoji: '🌟',
    color: '#d97706',
    bgClass: 'bg-amber-500',
    lightBgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-600 dark:text-amber-400',
  },
  epilogue: {
    label: 'Yakun',
    emoji: '🏆',
    color: '#dc2626',
    bgClass: 'bg-red-500',
    lightBgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    textClass: 'text-red-600 dark:text-red-400',
  },
}

// Resolve sub-act to parent act for display
export function resolveActDisplay(act: string): ActDisplay {
  const parent = ACT_PARENT[act] ?? 'prologue'
  return ACT_DISPLAY[parent] ?? ACT_DISPLAY.prologue
}
