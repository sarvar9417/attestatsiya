// Speaking Path — "0 dan Gapirishgacha" bo'limi tiplari
// Reja: docs/speaking-path-roadmap.md (3-bo'lim)

/** Just-in-time vocabulary — scenario uchun kerakli qo'shimcha so'z */
export interface VocabItem {
  en: string
  uz: string
  /** ishlatilish misoli (ixtiyoriy) */
  example?: string
}

/** Bitta o'rganiladigan "blok" — tayyor jumla qolipi yoki ibora */
export interface SpeakingChunk {
  /** barqaror noyob id, masalan 'sp-d1-c1' */
  id: string
  /** inglizcha jumla: "Can I have a coffee, please?" */
  en: string
  /** o'zbekcha tarjima: "Iltimos, menga qahva bering" */
  uz: string
  /** IPA — analyzePronunciation uchun (kalit bloklarga) */
  ipa?: string
  /** qolip nomi, masalan "Can I have …?" */
  pattern?: string
  // -- Pedagogik kengaytmalar (Phase 1) --
  /** Grammatika izohi: "Went = go ning o'tgan zamon shakli (noto'g'ri fe'l)" */
  grammarTip?: string
  /** O'zbeklar uchun tipik xato: "I from Uzbekistan → I AM from Uzbekistan (am ni unutmang)" */
  commonMistake?: string
  /** Urg'u beriladigan so'z: "ARE" — "How ARE you?" da "ARE" ga urg'u */
  stressWord?: string
  /** Qaysi kunlardan recycling qilingan: ["sp-d1-c2", "sp-d3-c1"] */
  recycledFrom?: string[]
}

/** Kunlik talaffuz fokusi — bitta tovushga e'tibor */
export interface PronunciationFocus {
  /** Ovoz: "θ" */
  sound: string
  /** IPA misol: "/θ/ - think, three, thank" */
  ipaExample: string
  /** O'zbekcha maslahat: "Tilingizni tishlaringiz orasiga qo'ying" */
  tipUz: string
  /** Inglizcha maslahat: "Place your tongue between your teeth" */
  tipEn: string
  /** O'zbeklar uchun tipik xato: "/θ/ ni /s/ yoki /t/ bilan almashtiradi" */
  commonError?: string
}

/** Kunning AI suhbat stsenariysi (4-qadam uchun) */
export interface SpeakingScenario {
  /** startSpeakingChat uchun mavzu, masalan "ordering at a cafe" */
  topic: string
  /** AI roli: "a friendly barista" */
  aiRole: string
  /** foydalanuvchi roli: "a customer" */
  userRole: string
  /** AI ning birinchi gapi (startScenarioConversation uchun) */
  opening: string
  /** o'zbekcha maqsad: "Qahva buyurtma qiling va narxini so'rang" */
  goalUz: string
}

/** Narvondagi bitta kun */
export interface SpeakingDay {
  /** 1..N, ketma-ketlik */
  day: number
  cefr: 'A0' | 'A1' | 'A2' | 'B1' | 'B2'
  /** "Salomlashish va tanishish" */
  title: string
  /** qisqa tavsif */
  subtitle: string
  /** bu kun oxirida nima qila olasiz (o'zbekcha) */
  goalUz: string
  /** 5–8 ta blok */
  chunks: SpeakingChunk[]
  scenario: SpeakingScenario
  /** taxminiy davomiylik, ~12–15 daqiqa */
  estMinutes: number
  // -- Pedagogik kengaytmalar (Phase 1) --
  /** Kunlik talaffuz fokusi (bitta tovush) */
  pronunciationFocus?: PronunciationFocus
  /** Avvalgi kunlardan recycled chunk id'lari: ["sp-d1-c2", "sp-d3-c1"] */
  recycledChunkIds?: string[]
  /** True bo'lsa — faqat recycled chunklar, yangi chunk yo'q */
  isReviewDay?: boolean
  /** Scenario uchun kerakli qo'shimcha lug'at (just-in-time vocabulary) */
  vocab?: VocabItem[]
  // -- Phase 2: Grammar-Driven Speaking --
  /** Daily lesson ID ga bog'lash. Format: daily lesson id bilan bir xil — kebab-case string.
   *  B2 ID'lari '-b2' suffix'i bilan */
  linkedLessonId?: string
  /** Shu kunda ishlatiladigan daily lesson vocabulary ID'lari */
  usedVocabIds?: string[]
  /** Grammatika punktining qisqa nomi (display uchun) */
  grammarPoint?: string
}

/** Foydalanuvchining bir kun bo'yicha progressi (runtime/persist) */
export interface SpeakingDayProgress {
  day: number
  completed: boolean
  /** 3-qadamdagi o'rtacha STT/AI ball (0–100) */
  bestSpeakScore?: number
  /** shu kunda gapirilgan vaqt (soniya) */
  spokenSeconds: number
  /** ISO sana */
  completedAt?: string
  // -- Phase 2 additions --
  /** Shu kundagi grammar quiz balli */
  grammarScore?: number
  /** Shu kunda practice qilingan daily lesson ID'lari */
  practicedLessonIds?: string[]
}

/** Grammar Track progress (persist) */
export interface GrammarProgress {
  lessonId: string
  grammarPoint: string
  level: string
  status: 'not-started' | 'practice' | 'mastered'
  bestScore: number
  practiceCount: number
  lastPracticedAt?: string
  usedInFreeMode: boolean
}
