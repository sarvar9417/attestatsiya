/**
 * Editorial topic-to-objective mapping from the official 2026 Informatics
 * Attestation Test Specification, table 2, physical PDF pp. 6–7.
 *
 * Topic IDs are OUR platform's lesson grouping, not officially prescribed
 * lesson numbers or per-topic exam quotas. Wording below paraphrases the
 * competence bullets; it is not a verified question-to-objective mapping.
 * Verified source: "Informatika Testlar spesifikatsiyasi.pdf" (Toshkent, 2026).
 */
export interface PedagogySpecObjective {
  readonly skill: string
  readonly sourcePage: 6 | 7
  readonly group: 'KS' | 'PM.GEN' | 'PM.MET'
}

export const PEDAGOGY_SPEC_OBJECTIVES: Readonly<Record<string, PedagogySpecObjective>> = {
  // Five exam questions across seven professional-standard competence areas.
  'M14.01': { group: 'KS', sourcePage: 6, skill: 'O‘quv jarayonini pedagogik maqsadga mos rejalashtirish.' },
  'M14.02': { group: 'KS', sourcePage: 6, skill: 'Ta’lim samaradorligini ta’minlovchi yondashuvni tanlash.' },
  'M14.03': { group: 'KS', sourcePage: 6, skill: 'O‘zlashtirishni baholash va qayta aloqa berish.' },
  'M14.04': { group: 'KS', sourcePage: 6, skill: 'Tarbiyaviy faoliyatni tashkil etish bo‘yicha qaror qabul qilish.' },
  'M14.05': { group: 'KS', sourcePage: 6, skill: 'Xavfsiz va rivojlantiruvchi ta’lim muhitini yaratish.' },
  'M14.06': { group: 'KS', sourcePage: 6, skill: 'Kasbiy o‘sish va o‘z-o‘zini rivojlantirishni rejalash.' },
  'M14.07': { group: 'KS', sourcePage: 6, skill: 'Hamkasblar va ota-onalar bilan samarali hamkorlik qilish.' },

  // Seven exam questions across eight general pedagogy competence areas.
  'M15.01': { group: 'PM.GEN', sourcePage: 7, skill: 'Pedagogika, didaktika, tarbiya va yosh psixologiyasini vaziyatda farqlash.' },
  'M15.02': { group: 'PM.GEN', sourcePage: 7, skill: 'Didaktik tamoyillardan vaziyatga mosini tanlash.' },
  'M15.03': { group: 'PM.GEN', sourcePage: 7, skill: 'Tarbiya turlarini farqlash va ulardan o‘rinli foydalanish.' },
  'M15.04': { group: 'PM.GEN', sourcePage: 7, skill: 'Dars turini aniqlash, rejalash va sinfni boshqarish.' },
  'M15.05': { group: 'PM.GEN', sourcePage: 7, skill: 'Sinf hujjatlari, rahbarlik va ota-onalar bilan muloqotni vaziyatda qo‘llash.' },
  'M15.06': { group: 'PM.GEN', sourcePage: 7, skill: 'Etika, nutq, takt, refleksiya va kasbiy rivojlanishni farqlash.' },
  'M15.07': { group: 'PM.GEN', sourcePage: 7, skill: 'Pedagogik qobiliyatlarni konkret vaziyatlarda tanib qo‘llash.' },
  'M15.08': { group: 'PM.GEN', sourcePage: 7, skill: 'Ta’lim texnologiyalarini, jumladan inklyuziv yondashuvni, vaziyatga mos tanlash.' },

  // Three exam questions across three computer science methodology areas.
  'M16.01': { group: 'PM.MET', sourcePage: 7, skill: 'Informatika mazmunini o‘qitish yondashuvlari va texnologiyalarini farqlash.' },
  'M16.02': { group: 'PM.MET', sourcePage: 7, skill: 'Informatika o‘qitish metodlarini o‘quv vaziyatiga mos tanlash.' },
  'M16.03': { group: 'PM.MET', sourcePage: 7, skill: 'O‘qitishga oid pedagogik qarorni mezonlar asosida baholash.' },
}
