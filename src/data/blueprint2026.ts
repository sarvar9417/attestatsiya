/**
 * 2026 spetsifikatsiyasining BAHOLASH O'QI — o'zgarmas haqiqat.
 *
 * Manba: "Umumiy o'rta va maktabdan tashqari ta'lim tashkilotlari informatika va
 * axborot texnologiyalari fani o'qituvchilarini attestatsiyadan o'tkazish uchun
 * malaka sinovida foydalaniladigan test topshiriqlari spetsifikatsiyasi",
 * Toshkent — 2026. (darsliklar/Informatika Testlar spesifikatsiyasi.pdf)
 *
 * ⚠️ Bu fayldagi raqamlar o'ylab topilmagan. O'zgartirish faqat yangi rasmiy
 * spetsifikatsiya chiqqanda va yangi `specification_version` yaratish orqali.
 *
 * Kognitiv kvotalar haqida: rasmiy spetsifikatsiya kognitiv taqsimotni FAQAT
 * global darajada beradi (8/35/7, 3-jadval). Har guruh uchun kognitiv taqsimot
 * — bizning dizayn qarorimiz (ADR-022). Global jami hech qachon buzilmaydi;
 * per-guruh taqsimot savol banki yetishmasa yumshatilishi mumkin.
 */

export const EXAM_SECTIONS = [
  'specialty',
  'professional_standard',
  'pedagogy',
  'methodology',
] as const
export type ExamSection = (typeof EXAM_SECTIONS)[number]

export const COGNITIVE_LEVELS = ['bilish', 'qollash', 'mulohaza'] as const
export type CognitiveLevel = (typeof COGNITIVE_LEVELS)[number]

export const QUESTION_FORMATS = ['Y1', 'Y2', 'Y3'] as const
export type QuestionFormat = (typeof QUESTION_FORMATS)[number]

/** Rasmiy spetsifikatsiya, III va IV bo'limlar. */
export const EXAM_RULES = {
  totalQuestions: 50,
  durationMinutes: 120,
  pointsPerQuestion: 2,
  maxPoints: 100,
  /** 3-jadval. Global jami — buzilmaydi. */
  cognitive: { bilish: 8, qollash: 35, mulohaza: 7 },
  /** III bo'lim va 2-jadval. */
  sections: {
    specialty: { label: 'Mutaxassislik fani', count: 35 },
    professional_standard: { label: 'Kasb standarti', count: 5 },
    pedagogy: { label: 'Umumiy pedagogika', count: 7 },
    methodology: { label: "Informatika o'qitish metodikasi", count: 3 },
  },
} as const

/**
 * Mutaxassislik fanining 7 mazmun sohasi (1-jadval) + kasb standarti va
 * pedagogik mahorat (2-jadval). Savol raqami diapazonlari rasmiy — imtihonda
 * savollar aynan shu tartibda raqamlanadi.
 */
export interface ContentArea {
  code: string
  title: string
  /** Rasmiy savol raqami diapazoni, 1-based inclusive. */
  questionFrom: number
  questionTo: number
  groups: readonly string[]
}

export const CONTENT_AREAS: readonly ContentArea[] = [
  { code: 'A1', title: 'Axborot va raqamli savodxonlik asoslari', questionFrom: 1, questionTo: 3, groups: ['S1.INFO'] },
  { code: 'A2', title: 'Kompyuter tizimlari va dasturiy muhit', questionFrom: 4, questionTo: 10, groups: ['S2.HW', 'S2.OFFICE'] },
  { code: 'A3', title: 'Mantiqiy fikrlash va algoritmlash', questionFrom: 11, questionTo: 18, groups: ['S3.LOGIC', 'S3.NUM', 'S3.ALGO'] },
  { code: 'A4', title: "Dasturlash va ma'lumotlar bilan ishlash asoslari", questionFrom: 19, questionTo: 26, groups: ['S4.BLOCK', 'S4.CODE', 'S4.DB'] },
  { code: 'A5', title: 'Grafika va veb-texnologiyalar', questionFrom: 27, questionTo: 31, groups: ['S5.WEB'] },
  { code: 'A6', title: 'Kompyuter tizimlari va tarmoqlari', questionFrom: 32, questionTo: 33, groups: ['S6.NET'] },
  { code: 'A7', title: 'Axborot xavfsizligi va raqamli xizmatlar', questionFrom: 34, questionTo: 35, groups: ['S7.SEC'] },
  { code: 'KS', title: 'Kasb standarti', questionFrom: 36, questionTo: 40, groups: ['KS'] },
  { code: 'PM', title: 'Pedagogik mahorat', questionFrom: 41, questionTo: 50, groups: ['PM.GEN', 'PM.MET'] },
] as const

/** 15 baholash guruhi — blueprint kvotasining birligi. */
export interface BlueprintGroup {
  code: string
  title: string
  section: ExamSection
  orderIdx: number
  questionCount: number
  /** ADR-022: per-guruh taqsimot dizayn qarori, global jami rasmiy. */
  bilish: number
  qollash: number
  mulohaza: number
  questionFrom: number
  questionTo: number
}

export const BLUEPRINT_GROUPS: readonly BlueprintGroup[] = [
  { code: 'S1.INFO',   title: "Axborot, kodlash, o'lchov",        section: 'specialty',             orderIdx: 1,  questionCount: 3, bilish: 1, qollash: 2, mulohaza: 0, questionFrom: 1,  questionTo: 3 },
  { code: 'S2.HW',     title: 'Apparat, OT, fayl tizimi',          section: 'specialty',             orderIdx: 2,  questionCount: 2, bilish: 1, qollash: 1, mulohaza: 0, questionFrom: 4,  questionTo: 5 },
  { code: 'S2.OFFICE', title: 'Word, Excel, PowerPoint',           section: 'specialty',             orderIdx: 3,  questionCount: 5, bilish: 0, qollash: 5, mulohaza: 0, questionFrom: 6,  questionTo: 10 },
  { code: 'S3.LOGIC',  title: 'Mantiq va rostlik jadvali',         section: 'specialty',             orderIdx: 4,  questionCount: 3, bilish: 0, qollash: 2, mulohaza: 1, questionFrom: 11, questionTo: 13 },
  { code: 'S3.NUM',    title: 'Sanoq sistemalari',                 section: 'specialty',             orderIdx: 5,  questionCount: 2, bilish: 0, qollash: 2, mulohaza: 0, questionFrom: 14, questionTo: 15 },
  { code: 'S3.ALGO',   title: 'Algoritm va blok-sxema',            section: 'specialty',             orderIdx: 6,  questionCount: 3, bilish: 0, qollash: 2, mulohaza: 1, questionFrom: 16, questionTo: 18 },
  { code: 'S4.BLOCK',  title: 'Scratch va LOGO',                   section: 'specialty',             orderIdx: 7,  questionCount: 3, bilish: 0, qollash: 3, mulohaza: 0, questionFrom: 19, questionTo: 21 },
  { code: 'S4.CODE',   title: 'Python va JavaScript',              section: 'specialty',             orderIdx: 8,  questionCount: 3, bilish: 0, qollash: 2, mulohaza: 1, questionFrom: 22, questionTo: 24 },
  { code: 'S4.DB',     title: "Ma'lumotlar bazasi, Access, SQL",   section: 'specialty',             orderIdx: 9,  questionCount: 2, bilish: 0, qollash: 2, mulohaza: 0, questionFrom: 25, questionTo: 26 },
  { code: 'S5.WEB',    title: 'Grafika, HTML, CSS',                section: 'specialty',             orderIdx: 10, questionCount: 5, bilish: 1, qollash: 4, mulohaza: 0, questionFrom: 27, questionTo: 31 },
  { code: 'S6.NET',    title: 'Tarmoqlar va IP manzillash',        section: 'specialty',             orderIdx: 11, questionCount: 2, bilish: 0, qollash: 2, mulohaza: 0, questionFrom: 32, questionTo: 33 },
  { code: 'S7.SEC',    title: 'Xavfsizlik va raqamli xizmatlar',   section: 'specialty',             orderIdx: 12, questionCount: 2, bilish: 1, qollash: 1, mulohaza: 0, questionFrom: 34, questionTo: 35 },
  { code: 'KS',        title: 'Kasb standarti',                    section: 'professional_standard', orderIdx: 13, questionCount: 5, bilish: 1, qollash: 3, mulohaza: 1, questionFrom: 36, questionTo: 40 },
  { code: 'PM.GEN',    title: 'Umumiy pedagogika',                 section: 'pedagogy',              orderIdx: 14, questionCount: 7, bilish: 2, qollash: 4, mulohaza: 1, questionFrom: 41, questionTo: 47 },
  { code: 'PM.MET',    title: "Informatika o'qitish metodikasi",   section: 'methodology',           orderIdx: 15, questionCount: 3, bilish: 1, qollash: 0, mulohaza: 2, questionFrom: 48, questionTo: 50 },
] as const

/**
 * Baholanadigan konstruktlar — spetsifikatsiyaning 1- va 2-jadvallaridagi
 * "Baholanadigan konstruktlar" bandlaridan olingan. Har konstrukt AYNAN BITTA
 * blueprint guruhga tegishli.
 *
 * `keywords` — konstrukt→sahifa indeksatori (scripts/build-source-index.mjs)
 * uchun. Ular kontent emas, faqat qidiruv signali.
 */
export interface Construct {
  code: string
  group: string
  title: string
  /** Parametrik generator bilan cheksiz savol yaratish mumkinmi? */
  generator?: string
  keywords: readonly string[]
}

export const CONSTRUCTS: readonly Construct[] = [
  // ── S1.INFO — 7 ─────────────────────────────────────────────────────────
  { code: 'S1.INFO.01', group: 'S1.INFO', title: "Informatika, axborot, ma'lumot va bilim tushunchalarini farqlash", keywords: ['informatika fani', 'bilim'] },
  { code: 'S1.INFO.02', group: 'S1.INFO', title: 'Axborot turlari va manbalari', keywords: ['axborot turlari', 'axborot manbalari'] },
  { code: 'S1.INFO.03', group: 'S1.INFO', title: "Turli ko'rinishdagi axborotni kodlash", keywords: ['axborotni kodlash', 'matnli axborot', 'grafik axborot', 'ASCII', 'Unicode'] },
  { code: 'S1.INFO.04', group: 'S1.INFO', title: "Axborot o'lchov birliklari", generator: 'axborotHajmi', keywords: ["o'lchov birlik", 'bit', 'bayt', 'kilobayt', 'megabayt'] },
  { code: 'S1.INFO.05', group: 'S1.INFO', title: 'Axborot hajmini hisoblash', generator: 'axborotHajmi', keywords: ['axborot hajmi', 'hajmini hisoblash'] },
  { code: 'S1.INFO.06', group: 'S1.INFO', title: 'Axborot uzatish tezligini hisoblash', generator: 'axborotHajmi', keywords: ['uzatish tezligi', "o'tkazish qobiliyati", 'bit/s'] },
  { code: 'S1.INFO.07', group: 'S1.INFO', title: 'Raqamli muhitda axloq va mualliflik huquqi', keywords: ['mualliflik huquqi', 'axloq', 'plagiat'] },

  // ── S2.HW — 4 ───────────────────────────────────────────────────────────
  { code: 'S2.HW.01', group: 'S2.HW', title: 'Kompyuter qurilmalari va ularning vazifalari', keywords: ['protsessor', 'asosiy plata', 'kiritish qurilma', 'chiqarish qurilma', 'tizimli blok'] },
  { code: 'S2.HW.02', group: 'S2.HW', title: 'Operatsion tizimlar va ularning imkoniyatlari', keywords: ['operatsion tizim', 'Windows', 'Linux', 'macOS'] },
  { code: 'S2.HW.03', group: 'S2.HW', title: 'Fayl va papkalar bilan ishlash', keywords: ['fayl va papka', 'fayl tizimi', 'kengaytma'] },
  { code: 'S2.HW.04', group: 'S2.HW', title: 'Tizimli va amaliy dasturlarni farqlash', keywords: ["dasturiy ta'minot", 'tizimli dastur', 'amaliy dastur', 'utilita'] },

  // ── S2.OFFICE — 4 ───────────────────────────────────────────────────────
  { code: 'S2.OFFICE.01', group: 'S2.OFFICE', title: 'MS Word: hujjat formatlash va tuzilma', keywords: ['MS Word', 'formatlash', 'abzas', 'shrift'] },
  { code: 'S2.OFFICE.02', group: 'S2.OFFICE', title: 'MS Excel: formulalar va funksiyalar', keywords: ['MS Excel', 'formula', 'SUM', 'IF', 'funksiya', 'katak'] },
  { code: 'S2.OFFICE.03', group: 'S2.OFFICE', title: 'MS Excel: filtr, saralash, diagramma tahlili', keywords: ['filtr', 'saralash', 'diagramma', 'grafik'] },
  { code: 'S2.OFFICE.04', group: 'S2.OFFICE', title: "MS PowerPoint: taqdimot, animatsiya, o'tish effektlari", keywords: ['PowerPoint', 'taqdimot', 'slayd', 'animatsiya', "o'tish effekt"] },

  // ── S3.LOGIC — 4 ────────────────────────────────────────────────────────
  { code: 'S3.LOGIC.01', group: 'S3.LOGIC', title: 'Sodda va murakkab mantiqiy mulohazalar tuzish', keywords: ['mantiqiy mulohaza', 'mulohaza'] },
  { code: 'S3.LOGIC.02', group: 'S3.LOGIC', title: 'Mantiqiy amallar bajarish', generator: 'mantiqAmal', keywords: ['mantiqiy amal', 'konyunksiya', 'dizyunksiya', 'inkor', 'AND', 'OR', 'NOT'] },
  { code: 'S3.LOGIC.03', group: 'S3.LOGIC', title: 'Mantiqiy mulohazalar yordamida masala yechish', keywords: ['mantiqiy masala', 'mantiqiy xulosa'] },
  { code: 'S3.LOGIC.04', group: 'S3.LOGIC', title: 'Rostlik jadvali va mantiqiy sxemalar', generator: 'mantiqAmal', keywords: ['rostlik jadvali', 'mantiqiy sxema'] },

  // ── S3.NUM — 3 ──────────────────────────────────────────────────────────
  { code: 'S3.NUM.01', group: 'S3.NUM', title: 'Sanoq sistemalari asoslari', generator: 'sanoqSistema', keywords: ['sanoq sistema', 'ikkilik sanoq', 'asos'] },
  { code: 'S3.NUM.02', group: 'S3.NUM', title: "Sonlarni bir sanoq sistemasidan boshqasiga o'tkazish", generator: 'sanoqSistema', keywords: ["sanoq sistemasiga o'tkaz", 'sakkizlik', "o'n oltilik"] },
  { code: 'S3.NUM.03', group: 'S3.NUM', title: 'Turli sanoq sistemalarida arifmetik amallar', generator: 'sanoqSistema', keywords: ['arifmetik amal', 'ikkilik sanoq'] },

  // ── S3.ALGO — 4 ─────────────────────────────────────────────────────────
  { code: 'S3.ALGO.01', group: 'S3.ALGO', title: 'Algoritm va uning turlari', keywords: ['algoritm', 'algoritm turlari', 'chiziqli algoritm', 'tarmoqlanuvchi'] },
  { code: 'S3.ALGO.02', group: 'S3.ALGO', title: 'Blok-sxema va psevdokodda ifodalash', keywords: ['blok-sxema', 'psevdo', 'blok sxema'] },
  { code: 'S3.ALGO.03', group: 'S3.ALGO', title: 'Masalaning algoritmini tuzish', keywords: ['algoritm tuzish', 'algoritm turlari'] },
  { code: 'S3.ALGO.04', group: 'S3.ALGO', title: 'Algoritmni tahlil qilish va maqbulini tanlash', keywords: ['samaradorlik', 'algoritmni tekshirish'] },

  // ── S4.BLOCK — 5 ────────────────────────────────────────────────────────
  { code: 'S4.BLOCK.01', group: 'S4.BLOCK', title: "Scratch: o'zgaruvchilar va koordinatalar tekisligi", keywords: ['Scratch', 'sprayt', 'koordinata'] },
  { code: 'S4.BLOCK.02', group: 'S4.BLOCK', title: 'Scratch: bloklar yordamida algoritm tuzish', keywords: ['Scratch', 'hodisa'] },
  { code: 'S4.BLOCK.03', group: 'S4.BLOCK', title: 'Scratch: shartli va takrorlanuvchi bloklar', keywords: ['takrorlash bloki', 'shart bloki'] },
  { code: 'S4.BLOCK.04', group: 'S4.BLOCK', title: 'Scratch: Pen uskunasi bilan shakl chizish', keywords: ['Pen', 'qalam', 'shakl chizish'] },
  { code: 'S4.BLOCK.05', group: 'S4.BLOCK', title: 'LOGO: toshbaqa grafikasi', keywords: ['LOGO', 'toshbaqa grafika', 'Toshbaqa'] },

  // ── S4.CODE — 5 ─────────────────────────────────────────────────────────
  { code: 'S4.CODE.01', group: 'S4.CODE', title: 'Python sintaksisi asoslari', keywords: ['Python', 'sintaksis', 'print', 'IDLE'] },
  { code: 'S4.CODE.02', group: 'S4.CODE', title: "Python: o'zgaruvchi, shart, sikl", keywords: ['sikl', 'shart operatori', 'while', 'for'] },
  { code: 'S4.CODE.03', group: 'S4.CODE', title: 'Python: funksiya va massivlar', keywords: ['def', "ro'yxat", 'massiv'] },
  { code: 'S4.CODE.04', group: 'S4.CODE', title: 'JavaScript sintaksisi asoslari', keywords: ['JavaScript', 'skript'] },
  { code: 'S4.CODE.05', group: 'S4.CODE', title: "JavaScript: o'zgaruvchi, shart, sikl, funksiya, massiv", keywords: ['JavaScript', 'massiv', 'sikl operatori'] },

  // ── S4.DB — 5 ───────────────────────────────────────────────────────────
  { code: 'S4.DB.01', group: 'S4.DB', title: "Ma'lumotlar bazasi va SQL asoslari", keywords: ["ma'lumotlar bazasi", 'SQL', 'MBBT'] },
  { code: 'S4.DB.02', group: 'S4.DB', title: 'MS Access: jadval yaratish va ma\'lumot kiritish', keywords: ['MS Access', 'jadval yaratish'] },
  { code: 'S4.DB.03', group: 'S4.DB', title: "Jadvallarni kalitlar orqali bog'lash", keywords: ['birlamchi kalit', 'tashqi kalit', "jadvallarni bog'lash"] },
  { code: 'S4.DB.04', group: 'S4.DB', title: "So'rovlar yaratish", keywords: ["so'rov", 'SELECT', 'query'] },
  { code: 'S4.DB.05', group: 'S4.DB', title: "Murakkab so'rovlar bilan masala yechish", keywords: ['JOIN', 'GROUP', 'guruhlash'] },

  // ── S5.WEB — 6 ──────────────────────────────────────────────────────────
  { code: 'S5.WEB.01', group: 'S5.WEB', title: 'Kompyuter grafikasi turlari', keywords: ['kompyuter grafikasi', 'rastrli', 'vektorli'] },
  { code: 'S5.WEB.02', group: 'S5.WEB', title: 'Rastrli va vektorli tasvirlar ustida amallar', keywords: ['piksel', "tasvir o'lchami", 'rang modeli', 'RGB', 'CMYK'] },
  { code: 'S5.WEB.03', group: 'S5.WEB', title: 'MS Paint va Adobe Photoshop', keywords: ['Paint', 'Photoshop', 'grafik muharrir', 'qatlam'] },
  { code: 'S5.WEB.04', group: 'S5.WEB', title: "HTML: matn, rasm, ro'yxat teglari", keywords: ['HTML', 'teg', '<p>', '<img', "<ul"] },
  { code: 'S5.WEB.05', group: 'S5.WEB', title: 'HTML: jadval va forma teglari', keywords: ['<table', '<form', 'HTML jadval', 'HTML forma'] },
  { code: 'S5.WEB.06', group: 'S5.WEB', title: "CSS stillarini HTML elementlariga qo'llash", keywords: ['CSS', 'selektor', 'style'] },

  // ── S6.NET — 5 ──────────────────────────────────────────────────────────
  { code: 'S6.NET.01', group: 'S6.NET', title: 'Kompyuter tarmoqlari va tarmoq qurilmalari', keywords: ['kompyuter tarmog', 'router', 'switch', 'tarmoq qurilma'] },
  { code: 'S6.NET.02', group: 'S6.NET', title: 'Tarmoq arxitekturasi va topologiyalari', keywords: ['topologiya', 'tarmoq arxitektura', 'LAN', 'WAN'] },
  { code: 'S6.NET.03', group: 'S6.NET', title: 'IP manzillash va tarmoq maskasi', generator: 'ipMaska', keywords: ['IP manzil', 'tarmoq maskasi', 'maska'] },
  { code: 'S6.NET.04', group: 'S6.NET', title: 'Internetdan xavfsiz va maqsadli foydalanish', keywords: ['internetdan xavfsiz', 'internet xavfsizligi'] },
  { code: 'S6.NET.05', group: 'S6.NET', title: 'Brauzer va qidiruv tizimlari', keywords: ['brauzer', 'qidiruv tizimi', 'URL'] },

  // ── S7.SEC — 6 ──────────────────────────────────────────────────────────
  { code: 'S7.SEC.01', group: 'S7.SEC', title: 'Axborot xavfsizligi tahdidlari va himoya', keywords: ['axborot xavfsizligi', 'tahdid', 'himoya'] },
  { code: 'S7.SEC.02', group: 'S7.SEC', title: 'Zararli dastur va phishing', keywords: ['zararli dastur', 'virus', 'phishing', 'troyan'] },
  { code: 'S7.SEC.03', group: 'S7.SEC', title: 'Antivirus va himoya vositalari', keywords: ['antivirus', 'brandmauer', 'firewall'] },
  { code: 'S7.SEC.04', group: 'S7.SEC', title: 'Elektron hukumat xizmatlari', keywords: ['elektron hukumat', 'my.gov', 'ERI', 'elektron imzo'] },
  { code: 'S7.SEC.05', group: 'S7.SEC', title: 'SMM, CMS, LMS, MOOC tushunchalari', keywords: ['SMM', 'CMS', 'LMS', 'MOOC'] },
  { code: 'S7.SEC.06', group: 'S7.SEC', title: "Freelance yo'nalishlari va platformalari", keywords: ['freelance', 'frilanser'] },

  // ── KS — 7 ── ⚠️ manba yo'q: "Umumiy o'rta ta'lim maktab o'qituvchisi kasb standarti"
  { code: 'KS.01', group: 'KS', title: "O'quv jarayonini rejalashtirish", keywords: ['rejalashtirish', 'dars rejasi', "o'quv reja"] },
  { code: 'KS.02', group: 'KS', title: "Ta'lim samaradorligini ta'minlash", keywords: ["ta'lim samaradorligi"] },
  { code: 'KS.03', group: 'KS', title: "O'zlashtirishni baholash va qayta aloqa", keywords: ['baholash', 'qayta aloqa', 'formativ'] },
  { code: 'KS.04', group: 'KS', title: 'Tarbiyaviy faoliyatni tashkil etish', keywords: ['tarbiyaviy faoliyat'] },
  { code: 'KS.05', group: 'KS', title: "Xavfsiz rivojlantiruvchi ta'lim muhiti", keywords: ["xavfsiz ta'lim muhiti"] },
  { code: 'KS.06', group: 'KS', title: "O'z-o'zini rivojlantirish va kasbiy o'sish", keywords: ["kasbiy o'sish", 'malaka oshirish'] },
  { code: 'KS.07', group: 'KS', title: 'Hamkasblar va ota-onalar bilan hamkorlik', keywords: ['ota-onalar bilan', 'hamkasblar bilan'] },

  // ── PM.GEN — 8 ── ⚠️ manba yo'q: Mavlonova 2018, Xoliqov 2025, Tolipov 2019
  { code: 'PM.GEN.01', group: 'PM.GEN', title: 'Pedagogika, didaktika, tarbiya va yosh psixologiyasi asoslari', keywords: ['pedagogika', 'didaktika', 'yosh psixologiya'] },
  { code: 'PM.GEN.02', group: 'PM.GEN', title: 'Pedagogika tamoyillari', keywords: ['onglilik va faollik', "ko'rgazmalilik", 'tizimlilik', 'ilmiylik'] },
  { code: 'PM.GEN.03', group: 'PM.GEN', title: 'Tarbiya va uning turlari', keywords: ['tarbiya turlari', "aqliy tarbiya", 'axloqiy tarbiya'] },
  { code: 'PM.GEN.04', group: 'PM.GEN', title: 'Dars turlari, darsni rejalashtirish va sinfni boshqarish', keywords: ['dars turlari', 'sinfni boshqarish'] },
  { code: 'PM.GEN.05', group: 'PM.GEN', title: 'Sinf rahbari faoliyati va sinf hujjatlari', keywords: ['sinf rahbari', 'sinf hujjat'] },
  { code: 'PM.GEN.06', group: 'PM.GEN', title: 'Pedagogik etika, nutq, texnika, takt', keywords: ['pedagogik etika', 'pedagogik takt', 'nutq madaniyati'] },
  { code: 'PM.GEN.07', group: 'PM.GEN', title: 'Pedagogik qobiliyat va uning turlari', keywords: ['pedagogik qobiliyat', 'didaktik qobiliyat', 'persiptiv'] },
  { code: 'PM.GEN.08', group: 'PM.GEN', title: "Ta'lim texnologiyalari", keywords: ["ta'lim texnologiya", 'muammoli ta', 'evristik', 'interfaol', 'inklyuziv'] },

  // ── PM.MET — 3 ── ⚠️ manba yo'q: Mamarajabov 2023
  { code: 'PM.MET.01', group: 'PM.MET', title: "Informatika o'qitish yondashuvlari va metodikasi", keywords: ["o'qitish metodika", 'informatika metodika'] },
  { code: 'PM.MET.02', group: 'PM.MET', title: "O'qitish usullari va metodlarini farqlash", keywords: ["o'qitish usul", "o'qitish metod"] },
  { code: 'PM.MET.03', group: 'PM.MET', title: "Ta'limiy vaziyatga oid qarorlarga baho berish", keywords: ["ta'limiy vaziyat", 'pedagogik vaziyat'] },
] as const

/** Manbasi hali korpusda yo'q guruhlar (B-001). */
export const SOURCE_BLOCKED_GROUPS = ['KS', 'PM.GEN', 'PM.MET'] as const

/**
 * TEXNOLOGIYA MARKERLARI — guruhga xos, boshqa mavzuda uchramaydigan atamalar.
 *
 * NIMA UCHUN KERAK: kalit so'z ballari mavzuni har doim to'g'ri aniqlamaydi.
 * Misol: "Python dasturlash tilida sonli ma'lumotlar ustida arifmetik amallar"
 * parchasi `S3.NUM.03` ("sanoq sistemalarida arifmetik amallar") ga
 * `arifmetik amal` (IDF 5.8) orqali, `S4.CODE` ga `Python` (IDF 4.9) orqali
 * mos keladi. Ball bo'yicha S3.NUM yutadi — lekin parcha aslida Python
 * materiali. IDF bu farqni ko'rmaydi: u chastotani o'lchaydi, mavzuni emas.
 *
 * QOIDA: parchada BOSHQA guruhning texnologiya markeri bo'lsa va SHU guruhning
 * markeri bo'lmasa — parcha bu guruhga biriktirilmaydi.
 *
 * Ro'yxat ataylab qisqa: faqat mahsulot/texnologiya nomlari va ikkinchi ma'nosi
 * yo'q atamalar. Umumiy tushunchalar (`algoritm`, `funksiya`, `jadval`) bu yerga
 * KIRMAYDI — ular bir necha mavzuda qonuniy uchraydi.
 */
export const GROUP_TECH_MARKERS: Readonly<Record<string, readonly string[]>> = {
  // Konseptual guruhlar — mahsulot nomi yo'q, o'ziga xos atamalar bilan.
  // Ular ham ro'yxatda bo'lishi SHART: aks holda guruh qoidadan chetda qoladi
  // va begona material qabul qilishda davom etadi.
  'S1.INFO': ['axborot hajmi', "o'lchov birlik", 'bayt', 'kodlash', 'mualliflik huquqi'],
  'S2.HW': ['protsessor', 'operatsion tizim', 'fayl tizimi', 'qurilma'],
  'S3.ALGO': ['algoritm', 'blok-sxema'],
  'S2.OFFICE': ['Excel', 'MS Word', 'PowerPoint', 'elektron jadval', 'taqdimot'],
  'S3.NUM': ['sanoq sistema', 'ikkilik sanoq', 'sakkizlik', "o'n oltilik"],
  'S3.LOGIC': ['rostlik jadvali', 'konyunksiya', 'dizyunksiya'],
  'S4.BLOCK': ['Scratch', 'LOGO', 'sprayt', 'toshbaqa'],
  'S4.CODE': ['Python', 'JavaScript'],
  'S4.DB': ['MS Access', 'SQL', 'MBBT'],
  'S5.WEB': ['HTML', 'CSS', 'Photoshop', 'Paint'],
  'S6.NET': ['IP manzil', 'tarmoq maskasi', 'topologiya', 'brauzer'],
  'S7.SEC': ['antivirus', 'phishing', 'elektron imzo', 'MOOC', 'CMS'],
} as const

export const GENERATOR_CONSTRUCTS = CONSTRUCTS.filter((c) => c.generator)
