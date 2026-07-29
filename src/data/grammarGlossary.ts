// Grammatik atamalar lug'ati — Ingliz → O'zbek standartlashtirilgan terminologiya.
// Maqsad: butun platformada bir xil o'zbekcha atamalar ishlatilishi (audit F4-2).
// `en` — ingliz atama, `uz` — to'liq o'zbekcha tarjima, `short` — qisqa shakl.

export interface GrammarTerm {
  en: string
  uz: string
  short: string
  description?: string  // Qisqa izoh (o'zbek tilida)
}

export const GRAMMAR_TERMS: GrammarTerm[] = [
  // Zamonlar (Tenses)
  { en: 'Present Simple',              uz: 'Oddiy hozirgi zamon',            short: 'hozirgi oddiy',
    description: 'Har kuni, doimiy, odat bo\'lgan harakatlar uchun' },
  { en: 'Present Continuous',          uz: 'Davom etayotgan hozirgi zamon',  short: 'davomiy hozirgi',
    description: 'Ayni paytda sodir bo\'layotgan harakatlar uchun' },
  { en: 'Present Perfect',             uz: 'Tugallangan hozirgi zamon',      short: 'tugallangan hozirgi',
    description: 'O\'tgan vaqtda boshlanib, hozirgacha bog\'liq bo\'lgan harakatlar' },
  { en: 'Present Perfect Continuous',  uz: 'Davomli tugallangan hozirgi zamon', short: 'davomli tugallangan hozirgi' },
  { en: 'Past Simple',                 uz: 'Oddiy o\'tgan zamon',            short: 'o\'tgan oddiy',
    description: 'O\'tgan vaqtda tugallangan harakatlar uchun' },
  { en: 'Past Continuous',             uz: 'Davomiy o\'tgan zamon',          short: 'davomiy o\'tgan',
    description: 'O\'tgan vaqtning biror nuqtasida davom etayotgan harakat' },
  { en: 'Past Perfect',                uz: 'Tugallangan o\'tgan zamon',      short: 'tugallangan o\'tgan' },
  { en: 'Past Perfect Continuous',     uz: 'Davomli tugallangan o\'tgan zamon', short: 'davomli tugallangan o\'tgan' },
  { en: 'Future Simple',               uz: 'Oddiy kelasi zamon',             short: 'kelasi oddiy',
    description: 'Kelajakda sodir bo\'ladigan harakatlar, bashoratlar, va\'dalar' },
  { en: 'Future Continuous',           uz: 'Davomiy kelasi zamon',           short: 'davomiy kelasi' },
  { en: 'Future Perfect',              uz: 'Tugallangan kelasi zamon',       short: 'tugallangan kelasi' },
  { en: 'Tense',                       uz: 'Zamon',                          short: 'zamon' },

  // Nisbat va gap turlari
  { en: 'Active voice',                uz: 'Ma\'lum nisbat',                 short: 'ma\'lum' },
  { en: 'Passive voice',               uz: 'Majhul nisbat',                  short: 'majhul',
    description: 'Harakat bajaruvchi emas, balki qabul qiluvchi muhim bo\'lganda' },
  { en: 'Conditional',                 uz: 'Shart gap',                      short: 'shart',
    description: 'Biror shartga bog\'liq bo\'lgan harakat (if bilan)' },
  { en: 'First Conditional',           uz: 'Birinchi tur shart gap (real)',  short: '1-shart' },
  { en: 'Second Conditional',          uz: 'Ikkinchi tur shart gap (noreal hozirgi)', short: '2-shart' },
  { en: 'Third Conditional',           uz: 'Uchinchi tur shart gap (noreal o\'tgan)', short: '3-shart' },
  { en: 'Relative clause',             uz: 'Aniqlovchi ergash gap',          short: 'aniqlovchi',
    description: 'Who, which, that bilan boshlanuvchi qo\'shimcha ma\'lumot beruvchi gap' },
  { en: 'Reported speech',             uz: 'Bilvosita (ko\'chirma) nutq',    short: 'bilvosita',
    description: 'Birovning gapini keltirish (said that...)' },
  { en: 'Clause',                      uz: 'Ergash/bosh gap',                short: 'gap bo\'lagi' },
  { en: 'Phrase',                      uz: 'Ibora (so\'z birikmasi)',        short: 'ibora' },

  // So'z turkumlari (Parts of speech)
  { en: 'Noun',                        uz: 'Ot',                             short: 'ot' },
  { en: 'Verb',                        uz: 'Fe\'l',                          short: 'fe\'l' },
  { en: 'Adjective',                   uz: 'Sifat',                          short: 'sifat' },
  { en: 'Adverb',                      uz: 'Ravish',                         short: 'ravish',
    description: 'Fe\'l, sifat yoki boshqa ravishni aniqlovchi so\'z (quickly, very)' },
  { en: 'Pronoun',                     uz: 'Olmosh',                         short: 'olmosh',
    description: 'Ot o\'rnida ishlatiluvchi so\'z (I, you, he, she, it, we, they)' },
  { en: 'Preposition',                 uz: 'Predlog (ko\'makchi)',           short: 'predlog',
    description: 'Ot/olmoshdan oldin kelib, joy, vaqt, munosabat bildiruvchi so\'z (in, on, at)' },
  { en: 'Conjunction',                 uz: 'Bog\'lovchi',                    short: 'bog\'lovchi',
    description: 'Ikki gap yoki so\'zni bog\'lovchi (and, but, or)' },
  { en: 'Article',                     uz: 'Artikl (aniqlik ko\'rsatkichi)', short: 'artikl',
    description: 'Ot oldidan kelib, aniqlik/noaniqlik bildiruvchi so\'z (a, an, the)' },
  { en: 'Determiner',                  uz: 'Aniqlovchi (determiner)',        short: 'aniqlovchi soz' },
  { en: 'Modal verb',                  uz: 'Modal fe\'l',                      short: 'modal',
    description: 'Imkoniyat, zaruriyat, ruxsat, majburiyat bildiruvchi fe\'llar (can, must, should)' },
  { en: 'Auxiliary verb',              uz: 'Yordamchi fe\'l',                short: 'yordamchi' },
  { en: 'Gerund',                      uz: 'Gerundiy (V-ing ot shakli)',     short: 'gerundiy',
    description: 'Fe\'lning -ing shakli, ot vazifasida ishlatiladi' },
  { en: 'Infinitive',                  uz: 'Infinitiv (to + V)',             short: 'infinitiv',
    description: 'Fe\'lning to+verb shakli' },
  { en: 'Participle',                  uz: 'Sifatdosh (participle)',         short: 'sifatdosh' },
  { en: 'Phrasal verb',                uz: 'Frazeologik fe\'l (phrasal verb)', short: 'frazeologik',
    description: 'Fe\'l + predlog birikmasi, ma\'nosi alohida so\'zlardan farqli (give up, look after)' },
  { en: 'Collocation',                 uz: 'Turg\'un so\'z birikmasi (collocation)', short: 'kollokatsiya' },

  // Gap bo'laklari va daraja
  { en: 'Subject',                     uz: 'Ega',                            short: 'ega' },
  { en: 'Predicate',                   uz: 'Kesim',                          short: 'kesim' },
  { en: 'Object',                      uz: 'To\'ldiruvchi',                  short: 'to\'ldiruvchi' },
  { en: 'Comparative',                 uz: 'Qiyosiy daraja',                  short: 'qiyosiy',
    description: 'Ikki narsani taqqoslash (bigger, more expensive)' },
  { en: 'Superlative',                 uz: 'Ustun daraja',                  short: 'ustun',
    description: 'Eng yuqori daraja (the biggest, the most expensive)' },
  { en: 'Countable noun',              uz: 'Sanaladigan ot',                 short: 'sanaladigan',
    description: 'Son bilan sanash mumkin bo\'lgan otlar (book, apple, car)' },
  { en: 'Uncountable noun',            uz: 'Sanalmaydigan ot',               short: 'sanalmaydigan',
    description: 'Son bilan sanab bo\'lmaydigan otlar (water, information, rice)' },
  { en: 'Question tag',                uz: 'Savol qo\'shimchasi (..., isn\'t it?)', short: 'savol qoshimchasi' },
  { en: 'Quantifier',                  uz: 'Miqdor so\'z',                    short: 'miqdor',
    description: 'Miqdor bildiruvchi so\'zlar (some, any, much, many, a lot of)' },
  { en: 'Negation',                    uz: 'Inkor shakli',                    short: 'inkor',
    description: 'Gapni inkor qilish (not, don\'t, doesn\'t)' },
  { en: 'Possessive',                  uz: 'Egalik shakli',                   short: 'egalik',
    description: 'Tegishlilik bildirish (my, your, his, her, its, our, their)' },
  { en: 'Reflexive pronoun',           uz: 'O\'zlik olmoshi',                 short: 'o\'zlik',
    description: 'Harakat egasining o\'ziga qaytishi (myself, yourself, himself)' },
  { en: 'Irregular verb',              uz: 'Noto\'g\'ri fe\'l',               short: 'noto\'g\'ri fe\'l',
    description: 'O\'tgan zamonda -ed qo\'shimchasini olmaydigan fe\'llar (go→went, eat→ate)' },
]

// ─── Helper Functions ───────────────────────────────────────────────────────

const termMap = new Map(GRAMMAR_TERMS.map(t => [t.en.toLowerCase(), t]))

/** Terminni o'zbekcha qisqa shaklda qaytaradi ("Present Simple" → "hozirgi oddiy") */
export function termUz(enTerm: string): string {
  return termMap.get(enTerm.toLowerCase())?.short ?? enTerm
}

/** Terminni to'liq o'zbekcha nom bilan qaytaradi ("Present Simple" → "Oddiy hozirgi zamon") */
export function termUzFull(enTerm: string): string {
  return termMap.get(enTerm.toLowerCase())?.uz ?? enTerm
}

/** Terminni "To'liq nom (English Name)" formatida qaytaradi */
export function termUzBilingual(enTerm: string): string {
  const term = termMap.get(enTerm.toLowerCase())
  if (!term) return enTerm
  return `${term.uz} (${enTerm})`
}

/** Terminning description/info matnini qaytaradi (agar mavjud bo'lsa) */
export function termDescription(enTerm: string): string | undefined {
  return termMap.get(enTerm.toLowerCase())?.description
}
