import { M01_CONTENT } from './topics/m01'
import { withVerifiedM01Additions } from './topics/m01TextbookAudit'
import { M05_THEORY } from './topics/m05'
import { buildCanonicalM02Topic } from './topics/m02Canonical'
import { M13_DIGITAL_TEXTBOOK_ADDITIONS } from './topics/m13DigitalTextbookAdditions'
import { M10_GRAPHICS_TEXTBOOK_ADDITIONS } from './topics/m10GraphicsTextbookAdditions'
import { M12_NETWORK_TEXTBOOK_ADDITIONS } from './topics/m12NetworkTextbookAdditions'
import { M11_WEB_TEXTBOOK_ADDITIONS } from './topics/m11WebTextbookAdditions'
import { M09_DATABASE_TEXTBOOK_ADDITIONS } from './topics/m09DatabaseTextbookAdditions'
import { M03_OFFICE_TEXTBOOK_ADDITIONS } from './topics/m03OfficeTextbookAdditions'
import { M03_05_CANONICAL_BOOK } from './topics/m03ExcelCanonicalBook'
import { M15_01_CANONICAL_BOOK } from './topics/m15PedagogyCanonicalBook'
import { M03_01_CANONICAL_BOOK } from './topics/m03WordCanonicalBook'
import { M15_02_CANONICAL_BOOK } from './topics/m15LearningPrinciplesCanonicalBook'
import { M12_05_CANONICAL_BOOK } from './topics/m12IPv4CanonicalBook'
import { M08_TEXTBOOK_STUDY_ADDITIONS } from './topics/m08TextbookStudyAdditions'
import { M14_NORMATIVE_SOURCE_ADDITIONS } from './topics/m14NormativeSourceAdditions'
import { M16_SOURCE_THEORY_ADDITIONS } from './topics/m16SourceTheoryAdditions'
// M14–M16 use server-scored exams exclusively. Legacy mini-quiz answer keys
// have intentionally been stripped from the shipped JavaScript bundle.

/**
 * Nazariy blok turlari.
 *
 * Birinchi guruh — barcha modullarda ishlatiladigan asosiy turlar.
 * Ikkinchi guruh — "Axborot va axborot jarayonlari" qo'llanmasidagi
 * tuzilma: bob sarlavhalari, rangli qutilar, ro'yxat va diagrammalar.
 */
export type TheoryBlockType =
  | 'text' | 'formula' | 'code' | 'example' | 'note' | 'definition' | 'table'
  | 'heading'      // \section — bob ichidagi bo'lim
  | 'subheading'   // \subsection va \subsubsection
  | 'intro'        // bob kirish qutisi
  | 'goal'         // "Bob maqsadi va o'rganish natijalari" / "Bob yakuni" (to'q fon)
  | 'exam'         // "ATTESTATSIYA uchun muhim"
  | 'trap'         // "Ko'p uchraydigan xato"
  | 'extra'        // "Darslikdan tashqari aniqlashtirish", "Mavzu chegarasi"
  | 'solved'       // "Tushuntiruvchi misol", "Bosqichma-bosqich yechimlar"
  | 'task'         // "Ishlanadigan misollar: oddiydan murakkabga"
  | 'keywords'     // "Tayanch atamalar"
  | 'case'         // sarlavhasi o'zgaruvchan tahlil qutisi
  | 'summary'      // "Bob yakuni"
  | 'source'       // "Manba izi"
  | 'quickcheck'   // "Tezkor tekshiruv"
  | 'answers'      // "Javob va izoh"
  | 'keyformula'   // \formula{...} — ajratilgan asosiy formula
  | 'list'         // itemize / enumerate
  | 'deflist'      // atama — izoh ro'yxati
  | 'diagram'      // kitobdagi sxema (React SVG)

/**
 * Blok matni ichki mini-formatda saqlanadi:
 * `**qalin**`, `__kursiv__`, `~~inglizcha atama~~`, `==kalit so'z==`,
 * `` `kod` ``, `$matematika$` (KaTeX), `@@manba, PDF 10–12@@`, `[matn](url)`.
 */
export interface TheoryBlock {
  type: TheoryBlockType
  content: string
  language?: string
  /** Quti sarlavhasi — manbada o'z nomi berilgan bo'lsa (aks holda tur bo'yicha standart) */
  label?: string
  /** table: sarlavha qatori (bo'sh bo'lishi mumkin) */
  headers?: string[]
  /** table: ma'lumot qatorlari */
  rows?: string[][]
  /** list: elementlar */
  items?: string[]
  /** list: raqamlangan ro'yxatmi */
  ordered?: boolean
  /** deflist: atama va izohi */
  terms?: { term: string; body: string }[]
  /** quti ichidagi ichki bloklar (matn + ro'yxat + formula) */
  children?: TheoryBlock[]
  /** diagram: React komponenti identifikatori */
  diagram?: string
}

export interface PairItem {
  leftId: string
  leftContent: string
  rightContent: string
}

export interface OrderedItem {
  id: string
  content: string
}

export interface TestQuestion {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  type: 'Y1' | 'Y2' | 'Y3'
  /** Original cognitive tag retained while using the four-choice Y1 interaction. */
  cognitiveLevel?: 'Y1' | 'Y2' | 'Y3'
  pairs?: PairItem[]
  items?: OrderedItem[]
  correctOrder?: string[]
  /** Backenddan kelgan savol uchun variantlarning DB id'lari (server check uchun) */
  optionIds?: string[]
  /** Savol manbai: statik kontent yoki backend API */
  source?: 'static' | 'backend'
}

/** Preserve the authored cognitive level in the learner badge, independent of UI answer interaction type. */
export function displayedCognitiveLevel(question: Pick<TestQuestion, 'type' | 'cognitiveLevel'>): TestQuestion['type'] {
  return question.cognitiveLevel ?? question.type
}

export interface TopicContent {
  subtopicId: string
  title: string
  theory: TheoryBlock[]
  /** Source-backed material for optional, progressive study; not part of core lesson. */
  supplementalTheory?: TheoryBlock[]
  questions: TestQuestion[]
  /** Kontent olingan manba fayli (generatsiya qilingan mavzular uchun) */
  source?: string
  /** Qo'llanmadagi o'rni: bob yoki ilova (formulalar varag'i, lug'at, manbalar) */
  kind?: 'chapter' | 'appendix'
}

function normalizeLegacyPracticeFormat(question: TestQuestion): TestQuestion {
  const missingMatching = question.type === 'Y2' && !question.pairs?.length
  const missingOrdering = question.type === 'Y3' && (!question.items?.length || !question.correctOrder?.length)
  const validChoice = question.options.length === 4
    && question.options.every(option => option.trim().length > 0)
    && Number.isInteger(question.correctIndex)
    && question.correctIndex >= 0
    && question.correctIndex < question.options.length
  return (missingMatching || missingOrdering) && validChoice
    ? { ...question, type: 'Y1', cognitiveLevel: question.type }
    : question
}

function t(subtopicId: string, title: string, theory: TheoryBlock[], questions: TestQuestion[]): TopicContent {
  return { subtopicId, title, theory, questions: questions.map(normalizeLegacyPracticeFormat) }
}

export const TOPIC_CONTENT: Record<string, TopicContent> = {
  // ========= M01: AXBOROT VA RAQAMLI SAVODXONLIK =========
  // Kontent "Axborot va axborot jarayonlari" LaTeX qo'llanmasidan
  // generatsiya qilingan (src/data/topics/m01.ts).
  ...withVerifiedM01Additions(M01_CONTENT),

  // ========= M02: KOMPYUTER TIZIMLARI VA DASTURIY MUHIT =========

  "M02.01": t("M02.01", "Kompyuterlarning rivojlanish tarixi", [
    { type: "definition", content: "Kompyuter texnologiyalarining rivojlanishi bir necha avlod (generatsiya) orqali o'tgan. Har bir avlod yangi texnologik yechimlar bilan farqlanadi: elektron lampalardan tortib sun'iy intellektgacha." },
    { type: "table", content: "| Avlod | Davr | Asosiy element | Xususiyati |\n|-------|------|---------------|----------|\n| I | 1940-1950 | Elektron lampalar | Katta hajm, tez qiziydi |\n| II | 1950-1960 | Tranzistorlar | Kichikroq, ishonchliroq |\n| III | 1960-1970 | Integral mikrosxemalar (IC) | Yana kichik, tez |\n| IV | 1970-2000 | Mikroprotsessorlar | Shaxsiy kompyuterlar |\n| V (shartli tasnif) | XX asr oxiri va keyin | Parallel hisoblash, AI yo‘nalishlari | Yagona xalqaro standart emas |" },
    { type: "text", content: "ENIAC (1946, AQSh) — ilk umumiy maqsadli elektron raqamli kompyuterlardan biri; undan oldin ham hisoblash mashinalari bo‘lgan. Charlz Bebbaj — \"analitik mashina\" g'oyasi (1837). Al-Xorazmiy — algoritm va algoritmlash tushunchalari asoschisi. Kompyuter so'zi lotincha \"computare\" — hisoblamoq so'zidan olingan." },
    { type: "note", content: "I avlod kompyuterlari bir necha xonani egallagan, juda ko'p elektr energiyasi sarflagan va tez qizib ketgan. Zamonaviy smartfonlar ko‘plab vazifalarni birinchi avlod kompyuterlariga nisbatan tezroq bajaradi; aniq nisbat vazifaga bog‘liq." },
  ], [
    { id: "M02.01-q1", text: "1946-yilda ommaga tanishtirilgan ilk umumiy maqsadli elektron raqamli kompyuterlardan biri qaysi?", options: ["IBM PC", "ENIAC", "Apple II", "Mark I"], correctIndex: 1, explanation: "ENIAC (1946) — ilk umumiy maqsadli elektron raqamli kompyuterlardan biri", type: "Y1" },
    { id: "M02.01-q2", text: "I avlod kompyuterlarining asosiy elementi nima?", options: ["Tranzistor", "Elektron lampa", "Mikroprotsessor", "Integral sxema"], correctIndex: 1, explanation: "I avlod (1940-1950) elektron lampalar asosida ishlagan", type: "Y1" },
    { id: "M02.01-q3", text: "Mikroprotsessor kashf etilishi qaysi avlodga to'g'ri keladi?", options: ["II", "III", "IV", "V"], correctIndex: 2, explanation: "Mikroprotsessorlar IV avlod (1970-2000) bilan bog'liq", type: "Y1" },
    { id: "M02.01-q4", text: "\"Algoritm\" so'zi qaysi olim nomi bilan bog'liq?", options: ["Arastu", "Pifagor", "Al-Xorazmiy", "Nyuton"], correctIndex: 2, explanation: "Al-Xorazmiy — algoritm tushunchasi asoschisi", type: "Y1" },
  ]),

  "M02.02": t("M02.02", "Kompyuter tuzilishi va ichki qurilmalar", [
    { type: "definition", content: "Fon-Neyman arxitekturasi — zamonaviy kompyuterlarning asosiy tuzilish modeli. Asosiy komponentlar: protsessor (ALU + boshqaruv qurilmasi), xotira, kiritish-chiqarish qurilmalari." },
    { type: "text", content: "Fon-Neyman prinsiplari: dastur va ma'lumotlar bir xil xotiraga joylanadi, xotira manzillanadi, buyruqlar ketma-ket bajariladi. Kompyuter 5 ta asosiy blokdan iborat: arifmetik-mantiqiy qurilma (ALU), boshqaruv qurilmasi (CU), xotira, kiritish va chiqarish qurilmalari." },
    { type: "table", content: "| Blok | Vazifasi |\n|------|---------|\n| ALU | Arifmetik va mantiqiy amallar bajarish |\n| Boshqaruv qurilmasi (CU) | Buyruqlarni dekodlash va bajarishni boshqarish |\n| Xotira (RAM/ROM) | Ma'lumot va dasturlarni saqlash |\n| Kiritish qurilmalari | Ma'lumotlarni kompyuterga kiritish |\n| Chiqarish qurilmalari | Natijalarni foydalanuvchiga yetkazish |" },
    { type: "note", content: "Fon-Neyman arxitekturasining asosiy cheklovi — \"Fon-Neyman tor bo‘g‘ini\": protsessor va xotira o'rtasidagi ma'lumot uzatish tezligi farqi. Protsessor xotiraga nisbatan ancha tez." },
  ], [
    { id: "M02.02-q1", text: "Fon-Neyman arxitekturasi bo'yicha kompyuter nechta asosiy blokdan iborat?", options: ["3", "4", "5", "6"], correctIndex: 2, explanation: "5 ta: ALU, boshqaruv qurilmasi, xotira, kiritish, chiqarish", type: "Y1" },
    { id: "M02.02-q2", text: "Protsessordagi ALU ning vazifasi nima?", options: ["Ma'lumotlarni saqlash", "Arifmetik va mantiqiy amallar bajarish", "Buyruqlarni dekodlash", "Natijalarni chiqarish"], correctIndex: 1, explanation: "ALU (Arithmetic Logic Unit) arifmetik va mantiqiy amallarni bajaradi", type: "Y1" },
    { id: "M02.02-q3", text: "\"Fon-Neyman tor bo‘g‘ini\" nima bilan bog'liq?", options: ["Protsessor va xotira tezligi farqi", "Operatsion tizim cheklovi", "Tarmoq kechikishi", "Elektr energiyasi sarfi"], correctIndex: 0, explanation: "Protsessor xotiraga nisbatan ancha tez, shuning uchun ma'lumot kutishga majbur", type: "Y1" },
    { id: "M02.02-q4", text: "Boshqaruv qurilmasi (CU) qanday vazifani bajaradi?", options: ["Arifmetik amallar", "Buyruqlarni dekodlash va bajarishni boshqarish", "Ma'lumotlarni saqlash", "Ma'lumotlarni kiritish"], correctIndex: 1, explanation: "CU buyruqlarni dekodlaydi va bajarilishini muvofiqlashtiradi", type: "Y1" },
  ]),

  "M02.03": t("M02.03", "Tashqi va qo'shimcha qurilmalar", [
    { type: "definition", content: "Tashqi qurilmalar (periferiya) — kompyuterning asosiy blokiga ulangan qo'shimcha qurilmalar. Ular kiritish, chiqarish va saqlash qurilmalariga bo'linadi. Qo'shimcha qurilmalar kompyuter imkoniyatlarini kengaytiradi." },
    { type: "table", content: "| Qurilma turi | Vazifasi | Misollar |\n|------------|---------|--------|\n| Kiritish | Ma'lumot kiritish | Klaviatura, sichqoncha, mikrofon, skaner |\n| Chiqarish | Natija chiqarish | Monitor, printer, dinamik, proyektor |\n| Saqlash | Ma'lumot saqlash | Qattiq disk, fleshka, CD/DVD |\n| Aloqa | Tarmoqqa ulanish | Modem, router, Wi-Fi adapter |\n| Multimediya | Audio/video | Veb-kamera, TV tyuner |" },
    { type: "text", content: "Klaviatura — asosiy kiritish qurilmasi. Sichqoncha (mouse) — grafik interfeysni boshqaradi. Printerlar turlari: matritsali (igna), inkjet (siyohli), lazerli. Skaner — matnni, rasmni raqamli ko'rinishga o'tkazadi." },
    { type: "note", content: "Qurilmalarni ulash interfeyslari: USB (Universal Serial Bus), HDMI (video), Bluetooth (simsiz), Wi-Fi (tarmoq). Qurilma vazifasiga qarab USB, HDMI, Bluetooth, Wi‑Fi yoki boshqa ulanishlardan foydalaniladi." },
    { type: "example", content: "Qurilmalar kombinatsiyasi:\n• Ofis: monitor + klaviatura + sichqoncha + printer\n• Dizayner: monitor + grafik planshet + skaner\n• Musiqachi: mikrofon + dinamiklar + MIDI klaviatura\n• O'yinchi: monitor + joystick + naushnik" },
  ], [
    { id: "M02.03-q1", text: "Skaner qanday turdagi qurilma?", options: ["Chiqarish", "Saqlash", "Kiritish", "Aloqa"], correctIndex: 2, explanation: "Skaner — kiritish qurilmasi, matn/rasmni raqamli ko'rinishga o'tkazadi", type: "Y1" },
    { id: "M02.03-q2", text: "USB interfeysi nima uchun xizmat qiladi?", options: ["Monitor ulash", "Turli qurilmalarni ulash", "Internetga ulash", "Ovoz chiqarish"], correctIndex: 1, explanation: "USB (Universal Serial Bus) — turli qurilmalarni kompyuterga ulash uchun universal interfeys", type: "Y1" },
    { id: "M02.03-q3", text: "Toner kukunini issiqlik bilan qog‘ozga mahkamlaydigan printer turi qaysi?", options: ["Matritsali", "Inkjet", "Lazerli", "Termal"], correctIndex: 2, explanation: "Lazerli printer toner kukunini lazer va termik mahkamlash jarayoni orqali qog‘ozga tushiradi", type: "Y1" },
  ]),

  "M02.04": t("M02.04", "Xotira va saqlash qurilmalari", [
    { type: "definition", content: "Kompyuter xotirasi — ma'lumotlarni saqlash uchun mo'ljallangan qurilmalar. Xotira turlari: ichki (RAM, ROM) va tashqi (qattiq disk, SSD, fleshka). Ichki xotira tez, lekin cheklangan hajmli. Tashqi xotira sekinroq, lekin katta hajmli." },
    { type: "table", content: "| Xotira turi | Tavsif | Hajm | Tezlik |\n|-----------|--------|------|-------|\n| RAM (tezkor) | Ishchi maʼlumotlar, o‘chuvchan | Modelga bog‘liq | Juda tez |\n| ROM/flash | Mikrodastur (BIOS/UEFI), o‘chmaydi | Modelga bog‘liq | Boshqa vazifa |\n| Qattiq disk (HDD) | Mexanik magnit saqlash | Modelga bog‘liq | SSDdan sekinroq |\n| SSD | NAND flash asosidagi doimiy saqlash | Modelga bog‘liq | Tez |\n| USB flash-disk | Ko‘chma doimiy saqlash | Modelga bog‘liq | Modelga bog‘liq |\n| CD/DVD | Optik disk | 700 MB-8.5 GB | Sekin |" },
    { type: "text", content: "RAM (Random Access Memory) — tezkor xotira, kompyuter o'chirilganda ma'lumotlar o'chadi. ROM — tarixan faqat o‘qiladigan xotira; zamonaviy BIOS/UEFI mikrodasturi ko‘pincha qayta yoziladigan flash-xotirada saqlanadi. Kesh xotira — protsessor ichidagi juda tez xotira. Virtual xotira OTning manzil makonini boshqarish mexanizmi; kerak bo‘lganda RAMdagi sahifalar SSD yoki HDDdagi swap/pagefile bilan almashinadi. Disk RAMga teng tezlik bermaydi." },
    { type: "note", content: "HDD (qattiq disk) — aylanuvchi magnit disklar, SSD — mikrosxemalar. SSD odatda HDDga qaraganda tezroq kirish vaqtiga ega; aniq tezlik va narx model hamda ish yukiga bog‘liq. Xotira iyerarxiyasida odatda registr va kesh RAMdan tez, RAM esa SSD/HDDdan tez; sig‘im va narx nisbati texnologiyaga bog‘liq." },
    { type: "example", content: "Xotira hajmi misollari:\n• Windows 11: kamida 4 GB RAM talab qiladi\n• 1 TB HDD ≈ 250,000 ta musiqa yoki 500 ta film\n• 240 GB SSD — operatsion tizim va asosiy dasturlar uchun\n• Kattaroq RAM ko‘proq ishchi maʼlumotni xotirada saqlashga yordam beradi; unumdorlik boshqa qismlarga ham bog‘liq" },
  ], [
    { id: "M02.04-q1", text: "Qaysi xotira turi kompyuter o'chirilganda ma'lumotlarni yo'qotadi?", options: ["ROM", "RAM", "HDD", "SSD"], correctIndex: 1, explanation: "RAM (tezkor xotira) — o'chuvchan xotira, kompyuter o'chirilganda ma'lumotlar o'chadi", type: "Y1" },
    { id: "M02.04-q2", text: "Qaysi xotira qurilmasi eng tez ishlaydi?", options: ["HDD", "SSD", "RAM", "Fleshka"], correctIndex: 2, explanation: "Sanab o‘tilgan RAM/HDD/SSD/fleshka ichida RAM eng tezkor; protsessor registri va kesh undan ham tez.", type: "Y1" },
    { id: "M02.04-q3", text: "SSD ning HDD dan afzalligi?", options: ["Arzonroq", "Tezroq, jim, kam energiya", "Katta hajm", "Uzoq muddat saqlash"], correctIndex: 1, explanation: "SSD — tezroq, jimroq va kam energiya sarflaydi, lekin HDD dan qimmatroq", type: "Y1" },
    { id: "M02.04-q4", text: "BIOS qaysi xotira turida saqlanadi?", options: ["RAM", "ROM", "HDD", "Fleshka"], correctIndex: 1, explanation: "Maktab modelida BIOS ROMga bog‘lanadi; hozir BIOS/UEFI mikrodasturi odatda qayta yoziladigan flashda saqlanadi.", type: "Y1" },
  ]),

  "M02.05": t("M02.05", "Mobil qurilmalar", [
    { type: "definition", content: "Mobil qurilmalar — ko'chma, portativ elektron qurilmalar bo'lib, ular akkumulyator batareyasidan quvvat oladi va simsiz aloqa imkoniyatiga ega. Asosiy turlari: smartfon, planshet, noutbuk, smart-soat." },
    { type: "table", content: "| Qurilma | Ekran | OT | Asosiy vazifasi |\n|--------|------|----|--------------|\n| Smartfon | 4-7 dyuym, sensor | Android, iOS | Muloqot, internet, ilovalar |\n| Planshet | 7-13 dyuym, sensor | Android, iOS, Windows | O'qish, video, chizma |\n| Noutbuk | 13-17 dyuym | Windows, macOS, Linux | Ish, o'qish, dasturlash |\n| Smart-soat | 1-2 dyuym | Wear OS, watchOS | Fitnes, bildirishnoma |\n| E-reader | 6-8 dyuym, E-ink | Maxsus | Kitob o'qish |" },
    { type: "text", content: "Mobil qurilmalarning asosiy xususiyatlari: portativlik (yengil), akkumulyatorli, simsiz ulanish (Wi-Fi, Bluetooth, 4G/5G), sensor ekran, ko'p funksiyalilik. Android va iOS keng tarqalgan mobil OTlardir; ularning bozor ulushi vaqt hamda hududga bog‘liq. iOS — Apple qurilmalari uchun." },
    { type: "note", content: "Smartfonning hisoblash quvvati qurilma modeli va ish turiga bog‘liq; barcha vazifalarda kompyuterdan kuchli deb umumlashtirilmaydi." },
    { type: "example", content: "Mobil qurilma imkoniyatlari:\n• GPS navigatsiya\n• Yuqori sifatli kamera (100+ MP)\n• Sensorlar: akselerometr, giroskop, barometr\n• Biometrik autentifikatsiya (barmoq izi, Face ID)\n• NFC (temassiz to'lov)\n• Bulutli xizmatlar bilan sinxronlash" },
  ], [
    { id: "M02.05-q1", text: "Eng keng tarqalgan mobil operatsion tizim qaysi?", options: ["iOS", "Android", "Windows Phone", "Symbian"], correctIndex: 1, explanation: "Android ko‘plab mobil qurilmalarda ishlatiladi; ulush hudud va vaqtga bog‘liq.", type: "Y1" },
    { id: "M02.05-q2", text: "Qaysi qurilma E-ink texnologiyasidan foydalanadi?", options: ["Smartfon", "Planshet", "E-reader", "Noutbuk"], correctIndex: 2, explanation: "E-reader qurilmalari elektron siyoh (E-ink) displeyidan foydalanishi mumkin; barcha modellar bir xil emas", type: "Y1" },
    { id: "M02.05-q3", text: "Sensor ekran qanday qurilmalarga xos?", options: ["Faqat noutbuk", "Faqat smartfon", "Smartfon va planshet", "Faqat monitor"], correctIndex: 2, explanation: "Sensor ekran asosan smartfon va planshetlarda ishlatiladi", type: "Y1" },
  ]),

  "M02.06": t("M02.06", "Dasturiy ta'minot turlari", [
    { type: "definition", content: "Dasturiy ta'minot (software) — kompyuter va qurilmalarni boshqarish, ma'lumotlarni qayta ishlash uchun mo'ljallangan dasturlar majmui. Dasturiy ta'minot 3 asosiy turga bo'linadi: tizimli, amaliy va dasturlash vositalari." },
    { type: "table", content: "| Tur | Vazifasi | Misollar |\n|-----|---------|--------|\n| Tizimli dasturiy ta'minot | Kompyuterni boshqarish | OT, drayver, utilitlar |\n| Amaliy dasturiy ta'minot | Foydalanuvchi vazifalari | Word, Excel, Photoshop |\n| Dasturlash vositalari | Dastur yaratish | Python, C++, VS Code |\n| Amaliy: o‘yinlar | Ko‘ngilochar ilovalar | Minecraft, FIFA |\n| Amaliy: o‘quv dasturlari | Taʼlim ilovalari | LMS, e-darslik |" },
    { type: "text", content: "Tizimli dasturiy ta'minot: operatsion tizim (boshqaruvchi dastur), drayverlar (qurilmalarni boshqarish), utilitlar (xizmat ko'rsatish). Amaliy dasturiy ta'minot: matn muharrirlari, elektron jadvallar, grafik muharrirlar, brauzerlar, o'yinlar." },
    { type: "note", content: "Litsenziya va narx ikki xil mezon: proprietar dastur pullik yoki bepul bo‘lishi mumkin. Erkin/ochiq kodli dasturdan foydalanish hamda uni o‘zgartirish huquqi litsenziyaga bog‘liq, u albatta bepul degani emas. Freeware — bepul foydalanish; shareware — cheklangan/sinov tarqatish." },
    { type: "example", content: "Dasturiy ta'minot misollari:\n• Tizimli: Windows 11, Linux, macOS, Android\n• Amaliy: MS Word, Excel, Google Chrome, Adobe Photoshop\n• Dasturlash: Python, VS Code, PyCharm\n• O'yinlar: o'quv o'yinlari, simulyatorlar" },
  ], [
    { id: "M02.06-q1", text: "Operatsion tizim dasturiy ta'minotning qaysi turiga kiradi?", options: ["Amaliy", "Tizimli", "Dasturlash", "O'yin"], correctIndex: 1, explanation: "OT — tizimli dasturiy ta'minot, kompyuterni boshqaradi", type: "Y1" },
    { id: "M02.06-q2", text: "MS Word dasturiy ta'minotning qaysi turiga kiradi?", options: ["Tizimli", "Amaliy", "Dasturlash", "Tarmoq"], correctIndex: 1, explanation: "MS Word — amaliy dasturiy ta'minot (matn muharriri)", type: "Y1" },
    { id: "M02.06-q3", text: "Ochiq kodli dasturiy ta'minotga misol?", options: ["Photoshop", "Windows", "Linux", "MS Office"], correctIndex: 2, explanation: "Linux — ochiq kodli operatsion tizim", type: "Y1" },
    { id: "M02.06-q4", text: "Drayver qanday vazifani bajaradi?", options: ["Matn tahrirlaydi", "Qurilmalarni boshqaradi", "Internetga ulaydi", "O'yin ishga tushiradi"], correctIndex: 1, explanation: "Drayver — qurilmalarni OT bilan bog'lovchi dastur", type: "Y1" },
  ]),

  "M02.07": t("M02.07", "Operatsion tizimlar", [
    { type: "definition", content: "Operatsion tizim (OT) — kompyuter resurslarini boshqaruvchi va foydalanuvchi bilan apparat vositalari o'rtasida bog'lovchi dasturlar majmui. Qurilma ishga tushganda BIOS/UEFI boshlang‘ich tekshiruvni bajaradi, so‘ng yuklovchi OTni ishga tushiradi." },
    { type: "text", content: "OT ning asosiy vazifalari: jarayonlarni boshqarish, xotirani boshqarish, fayl tizimini boshqarish, kiritish-chiqarishni boshqarish, xavfsizlikni ta'minlash, foydalanuvchi interfeysini taqdim etish. OT turlari: bir vazifali/ko'p vazifali, bir foydalanuvchi/ko'p foydalanuvchi." },
    { type: "table", content: "| OT | Ishlab chiqaruvchi | Xususiyati |\n|----|-----------------|----------|\n| Windows | Microsoft | Ommabop, GUI, ko'p dasturiy ta'minot |\n| macOS | Apple | Dizayn, barqaror, yopiq ekosistema |\n| Linux | Ochiq kodli hamjamiyat | Server, ish stansiyasi va qurilmalarda ishlatiladi |\n| Android | Google / AOSP | Mobil OT oilasi |\n| iOS | Apple | Mobil, xavfsiz, yopiq |" },
    { type: "note", content: "Windows so'zi inglizchada \"oynalar\" ma'nosini anglatadi. Windows 1.0 (1985) dan Windows 11 (2021) gacha 30+ yil ichida 20 dan ortiq versiya chiqarilgan." },
  ], [
    { id: "M02.07-q1", text: "Quyidagilardan qaysi biri operatsion tizim?", options: ["MS Word", "Windows 11", "Python", "Google Chrome"], correctIndex: 1, explanation: "Windows 11 — operatsion tizim; Word va Chrome amaliy dasturlar, Python esa dasturlash tilidir", type: "Y1" },
    { id: "M02.07-q2", text: "OT ning vazifasi emas?", options: ["Jarayonlarni boshqarish", "Xotirani boshqarish", "Matn tahrirlash", "Fayl tizimini boshqarish"], correctIndex: 2, explanation: "Matn tahrirlash — amaliy dasturning vazifasi (masalan, MS Word)", type: "Y1" },
    { id: "M02.07-q3", text: "Windows OT ning birinchi versiyasi qachon chiqarilgan?", options: ["1975", "1985", "1995", "2000"], correctIndex: 1, explanation: "Windows 1.0 1985-yilda chiqarilgan", type: "Y1" },
    { id: "M02.07-q4", text: "Qaysi OT asosan serverlarda ishlatiladi?", options: ["Windows 11", "macOS", "Linux", "Android"], correctIndex: 2, explanation: "Linux yuqori barqarorlik va xavfsizlik tufayli serverlarda keng qo'llaniladi", type: "Y1" },
  ]),

  "M02.08": t("M02.08", "Xizmat ko'rsatuvchi dasturlar", [
    { type: "definition", content: "Xizmat ko'rsatuvchi dasturlar (utilitalar) — kompyuterning ishlashini ta'minlash, sozlash va optimallashtirish uchun mo'ljallangan yordamchi dasturlar. Ular tizimli dasturiy ta'minotning bir qismi hisoblanadi." },
    { type: "table", content: "| Utilit turi | Vazifasi | Misollar |\n|-----------|---------|--------|\n| Antivirus | Viruslardan himoya | Kaspersky, Doctor Web, Avast |\n| Arxivator | Fayllarni siqish | WinRAR, 7-Zip, WinZip |\n| Disk boshqaruvi | Disk xatolarini tuzatish | CHKDSK, Defrag |\n| Zaxiralash | Ma'lumotlarni nusxalash | Backup, Time Machine |\n| Tozalash | Keraksiz fayllarni o'chirish | CCleaner |\n| Ma'lumot tiklash | O'chgan fayllarni tiklash | Recuva |" },
    { type: "text", content: "Antivirus dasturlari — zararli dasturlarni (virus, troya, worm) aniqlash va yo'q qilish. Arxivatorlar — fayllarni ZIP, RAR formatlarida siqish. Defragmentatsiya — diskdagi ma'lumotlarni tartibga solish (faqat HDD uchun)." },
    { type: "note", content: "Windows OT tarkibiga ko'plab utilitalar kiritilgan: Diskni tozalash, Diskni tekshirish, Tizimni tiklash, Vazifa menejeri. Zamonaviy operatsion tizimlar ko'p vazifalarni avtomatik bajaradi." },
    { type: "example", content: "Xizmat ko'rsatuvchi dasturlardan foydalanish:\n• Faylni siqish: WinRAR → 100 MB → 70 MB (30% siqish)\n• Antivirus tekshiruvi: har kuni avtomatik skanerlash\n• Disk tozalash: vaqtinchalik fayllarni o'chirish\n• Tizimni tiklash: avvalgi holatga qaytarish" },
  ], [
    { id: "M02.08-q1", text: "Antivirus dasturi qanday vazifani bajaradi?", options: ["Internet tezligini oshiradi", "Zararli dasturlarni aniqlaydi", "Fayllarni siqadi", "Disklarni formatlaydi"], correctIndex: 1, explanation: "Antivirus — zararli dasturlarni (virus) aniqlash va yo'q qilish", type: "Y1" },
    { id: "M02.08-q2", text: "Fayllarni siqish uchun qanday dastur ishlatiladi?", options: ["Antivirus", "Arxivator", "Brauzer", "Matn muharriri"], correctIndex: 1, explanation: "Arxivator (WinRAR, 7-Zip) fayllarni ZIP/RAR formatida siqadi", type: "Y1" },
    { id: "M02.08-q3", text: "Defragmentatsiya qaysi turdagi disk uchun kerak?", options: ["SSD", "HDD", "Fleshka", "RAM"], correctIndex: 1, explanation: "Klassik defragmentatsiya HDDga xos; SSDda odatda TRIM va OTning SSDga mos optimallashtirish mexanizmlari ishlatiladi.", type: "Y1" },
    { id: "M02.08-q4", text: "Quyidagilardan qaysi biri xizmat ko'rsatuvchi dastur emas?", options: ["Kaspersky", "WinRAR", "MS Word", "CCleaner"], correctIndex: 2, explanation: "MS Word — amaliy dastur, xizmat ko'rsatuvchi emas", type: "Y1" },
  ]),

  "M02.09": t("M02.09", "Fayl va papkalar", [
    { type: "definition", content: "Fayl — kompyuter xotirasida umumiy nom bilan saqlangan har qanday ma'lumot (matn, rasm, musiqa, dastur). Papka (katalog) — fayllarni tartibli saqlash uchun konteyner. Katalog — papkaning boshqa nomi; papkalar va ichki papkalar tuzilmasi kataloglar daraxti deyiladi." },
    { type: "table", content: "| Kengaytma | Format | Dastur |\n|---------|-------|-------|\n| .docx / .doc | Matn hujjati | MS Word |\n| .xlsx / .xls | Elektron jadval | MS Excel |\n| .pptx / .ppt | Taqdimot | MS PowerPoint |\n| .jpg / .png | Rasm | Grafik muharrir |\n| .mp3 / .wav | Audio | Media player |\n| .mp4 / .avi | Video | Media player |\n| .pdf | Hujjat | PDF reader |\n| .py / .js | Dastur kodi | VS Code, Python |" },
    { type: "text", content: "Fayl nomi asosiy nom va ixtiyoriy kengaytmaga ega bo‘lishi mumkin (masalan, `hisobot.docx`); kengaytmasiz fayllar ham bor. Masalan: \"Mening_faylim.docx\". Windowsda fayl nomida quyidagi belgilar ishlatilmaydi (boshqa OTlarda qoidalar farq qiladi): / \\ : * ? \" < > |. Papkalar iyerarxiyasi: C:\\Papka\\Ostki_papka\\fayl.docx. Atributlar: faqat o'qish, yashirin, arxivlangan." },
    { type: "note", content: "Fayl yo'li (path): C:\\Users\\User\\Documents\\hisobot.docx. C: — disk nomi, Users — asosiy papka, User — foydalanuvchi papkasi, Documents — ostki papka, hisobot.docx — fayl." },
    { type: "example", content: "Fayl va papka bilan ishlash:\n• Fayl yaratish: Fayl → Saqlash → nom berish\n• Nusxalash: Ctrl+C, Ctrl+V\n• Ko'chirish: Ctrl+X, Ctrl+V\n• O'chirish: Delete tugmasi (savatchaga)\n• Qayta tiklash: Savatchadan qaytarish" },
  ], [
    { id: "M02.09-q1", text: "Kengaytmali fayl nomi odatda nechta mantiqiy qismga ajratiladi?", options: ["1", "2", "3", "4"], correctIndex: 1, explanation: "Ko‘pincha fayl nomi asosiy nom va kengaytma bilan yoziladi; kengaytmasiz fayllar ham bor", type: "Y1" },
    { id: "M02.09-q2", text: "Quyidagilardan qaysi biri fayl kengaytmasi?", options: [".docx", "Windows", "Papka", "C:\\"], correctIndex: 0, explanation: ".docx — MS Word fayl kengaytmasi", type: "Y1" },
    { id: "M02.09-q3", text: "Fayl nomida qaysi belgi ishlatilishi mumkin?", options: ["/", "\\", "_", "\""], correctIndex: 2, explanation: "Tag chiziq (_) fayl nomida ishlatilishi mumkin. / \\ : * ? \" < > | taqiqlangan", type: "Y1" },
    { id: "M02.09-q4", text: "Papkalar va ichki papkalar iyerarxiyasi qanday ataladi?", options: ["Fayl tizimi", "Kataloglar daraxti", "Baza", "Jadval"], correctIndex: 1, explanation: "Papkalar iyerarxiyasi kataloglar daraxti deyiladi; katalog esa papka bilan maʼnodosh", type: "Y1" },
  ]),

  // ========= M03: MICROSOFT OFFICE =========

  "M03.01": t("M03.01", "Word interfeysi, yaratish va tahrirlash", [
    { type: "definition", content: "MS Word — Microsoft kompaniyasining matn protsessori dasturi. Matnli hujjatlarni yaratish, tahrirlash, formatlash va chop etish uchun mo'ljallangan. MS Office dasturlar paketining asosiy komponentlaridan biri." },
    { type: "text", content: "Word interfeysi: Sarlavha satri (fayl nomi), Menyu lentasi (Home, Insert, Design...), Asboblar paneli, Hujjat maydoni, Holat satri (sahifa raqami, so'z soni). Foydali ko'rinish rejimlari: Print Layout, Read Mode, Web Layout, Draft." },
    { type: "table", content: "| Menyu | Vazifasi |\n|-------|---------|\n| Home | Shrift, abzats, uslublar, tahrirlash |\n| Insert | Rasm, jadval, diagramma, havola |\n| Design | Mavzular, ranglar va sahifa chegaralari (Page Borders) |\n| Layout | Maydonlar, yo'nalish, ustunlar |\n| References | Mundarija, izohlar, manbalar |\n| Review | Imlo tekshirish, sharhlar |\n| View | Ko'rinish rejimlari, oyna |" },
    { type: "note", content: "Foydali klavishlar: Ctrl+N (yangi), Ctrl+O (ochish), Ctrl+S (saqlash), F12 (boshqa nom bilan saqlash), Ctrl+P (chop etish), Ctrl+Z (bekor qilish), Ctrl+Y (qaytarish)." },
    { type: "example", content: "Hujjat yaratish:\n1) Word dasturini ishga tushiring\n2) Yangi hujjat (Blank Document) yoki shablon tanlang\n3) Matn kiriting\n4) Ctrl+S bilan saqlang (Fayl → Saqlash)\n5) Nom bering va papka tanlang" },
  ], [
    { id: "M03.01-q1", text: "Yangi hujjat yaratish klavishi?", options: ["Ctrl+O", "Ctrl+N", "Ctrl+S", "Ctrl+P"], correctIndex: 1, explanation: "Ctrl+N — yangi hujjat yaratish", type: "Y1" },
    { id: "M03.01-q2", text: "Word dasturining asosiy vazifasi?", options: ["Rasm tahrirlash", "Matn hujjatlarini yaratish", "Video montaj", "Internetda ishlash"], correctIndex: 1, explanation: "MS Word — matn protsessori, matnli hujjatlarni yaratish va tahrirlash", type: "Y1" },
    { id: "M03.01-q3", text: "Qaysi menyu rasm qo'shish imkonini beradi?", options: ["Home", "Insert", "Design", "Layout"], correctIndex: 1, explanation: "Insert menyusi rasm, jadval, diagramma qo'shish uchun", type: "Y1" },
    { id: "M03.01-q4", text: "F12 klavishining vazifasi?", options: ["Saqlash", "Boshqa nom bilan saqlash", "Ochish", "Chop etish"], correctIndex: 1, explanation: "F12 — \"Save As\" (boshqa nom bilan saqlash)", type: "Y1" },
  ]),

  "M03.02": t("M03.02", "Word formatlash vositalari", [
    { type: "definition", content: "Formatlash — hujjat ko'rinishini o'zgartirish, matnni estetik jihatdan bezash. Formatlash turlari: belgi formati (shrift, o'lcham, rang), abzats formati (tekislash, chekinish, oraliq), sahifa formati (maydonlar, yo'nalish, o'lcham)." },
    { type: "table", content: "| Formatlash turi | Parametrlar | Klavishlar |\n|--------------|-----------|----------|\n| Qalin | Bold | Ctrl+B |\n| Kursiv | Italic | Ctrl+I |\n| Tagiga chizish | Underline | Ctrl+U |\n| O'ngga tekislash | Align Right | Ctrl+R |\n| Markazga | Center | Ctrl+E |\n| Chetga | Justify | Ctrl+J |\n| Satr oralig'i | Line Spacing | - |" },
    { type: "text", content: "Uslublar (Styles) — bir xil formatlashni tez qo'llash imkonini beradi. Normal, Sarlavha 1, Sarlavha 2, Sarlavha 3 kabi uslublar mavjud. Ctrl+Shift+S — uslublar panelini ochish. Format Painter (Format bo'yagichi) — formatni nusxalash." },
    { type: "note", content: "Ro'yxat turlari: markerli (bulleted), raqamli (numbered), ko'p darajali (multilevel). Tabulyatsiya — matnni ustunlar ko'rinishida joylashtirish. Sahifa chetlari va fon qo'shish Design → Page Borders orqali." },
    { type: "example", content: "Matnni formatlash:\n1) Matnni belgilang (Select)\n2) Shrift turi: Times New Roman, 12 pt\n3) Qalin (Ctrl+B), sarlavha: 16 pt\n4) Abzats: tekislash - Justify, chekinish - 1.25 cm\n5) Satr oralig'i: 1.5 (Home → Line Spacing)\n6) Uslub qo'llash: Sarlavha 1" },
  ], [
    { id: "M03.02-q1", text: "Matnni qalin qilish klavishi?", options: ["Ctrl+I", "Ctrl+B", "Ctrl+U", "Ctrl+E"], correctIndex: 1, explanation: "Ctrl+B (Bold) — qalin", type: "Y1" },
    { id: "M03.02-q2", text: "Uslublar (Styles) qanday vazifani bajaradi?", options: ["Matnni tekshiradi", "Formatlashni tez qo'llaydi", "Rasm qo'shadi", "Sahifa raqamlaydi"], correctIndex: 1, explanation: "Uslublar bir xil formatlashni tez bir xilda qo'llash imkonini beradi", type: "Y1" },
    { id: "M03.02-q3", text: "Abzats formati nimalarni o'z ichiga oladi?", options: ["Shrift va rang", "Tekislash, chekinish, oraliq", "Rasm o'lchami", "Sahifa maydonlari"], correctIndex: 1, explanation: "Abzats formati — tekislash, chekinish, oraliq kabi parametrlar", type: "Y2" },
    { id: "M03.02-q4", text: "Format Painter nima uchun xizmat qiladi?", options: ["Rasm chizish", "Formatni nusxalash", "Matnni o'chirish", "Shrift o'zgartirish"], correctIndex: 1, explanation: "Format Painter bir joydagi formatlashni boshqa joyga nusxalaydi", type: "Y2" },
  ]),

  "M03.03": t("M03.03", "Word obyektlari", [
    { type: "definition", content: "Word obyektlari — hujjatga qo'shiladigan matn bo'lmagan elementlar: rasm, jadval, diagramma, SmartArt, WordArt, formula, havola (gipermurojaat), blok-sxema, sarvaraq (titul varag'i)." },
    { type: "table", content: "| Obyekt | Vazifasi | Qo'shish (Insert menyusi) |\n|--------|---------|------------------------|\n| Rasm | Grafik tasvir | Pictures / Online Pictures |\n| Jadval | Ma'lumotlarni joylashtirish | Table |\n| SmartArt | Vizual sxema | SmartArt |\n| WordArt | Bezatilgan matn | WordArt |\n| Diagramma | Grafik ma'lumot | Chart |\n| Gipermurojaat | Boshqa joyga o'tish | Link |\n| Formula | Matematik ifoda | Equation |\n| Blok-sxema | Jarayon sxemasi | Shapes → Flowchart |" },
    { type: "text", content: "Rasm bilan ishlash: Format menyusi orqali o'lcham, joylashuv, matn o'rash (Text Wrapping) sozlanadi. Jadval yaratish: Insert → Table → katakchalar sonini tanlash. Jadvalni birlashtirish (Merge Cells) va bo'lish (Split Cells) mumkin." },
    { type: "note", content: "Obyektlar bilan ishlashda \"Format\" kontekst menyusi avtomatik ochiladi. Rasmni matn bilan o'rash (Wrap Text): In Line with Text, Square, Tight, Through, Top and Bottom, Behind Text, In Front of Text." },
    { type: "example", content: "Rasm qo'shish:\n1) Insert → Pictures → This Device\n2) Rasmni tanlang → Insert\n3) Rasm ustiga ikki marta bosish → Format menyusi\n4) Wrap Text → Square (matn rasm atrofida)\n5) O'lchamni o'zgartirish: chetidan tortish" },
  ], [
    { id: "M03.03-q1", text: "SmartArt obyekti nima uchun ishlatiladi?", options: ["Rasm tahrirlash", "Vizual sxema yaratish", "Matn yozish", "Jadval tuzish"], correctIndex: 1, explanation: "SmartArt — vizual sxema va diagrammalar yaratish uchun", type: "Y1" },
    { id: "M03.03-q2", text: "Rasm atrofida matnni joylashtirish uchun qaysi funksiya ishlatiladi?", options: ["Text Wrapping", "WordArt", "SmartArt", "Hyperlink"], correctIndex: 0, explanation: "Text Wrapping (matn o'rash) — rasm atrofida matnni joylashtirish", type: "Y2" },
    { id: "M03.03-q3", text: "Jadval kataklarini birlashtirish buyrug'i?", options: ["Split Cells", "Merge Cells", "Delete Cells", "Insert Cells"], correctIndex: 1, explanation: "Merge Cells — kataklarni birlashtirish", type: "Y1" },
    { id: "M03.03-q4", text: "WordArt qanday obyekt?", options: ["Rasm", "Bezatilgan matn", "Jadval", "Diagramma"], correctIndex: 1, explanation: "WordArt — maxsus bezatilgan matn obyekti", type: "Y1" },
  ]),

  "M03.04": t("M03.04", "Excel vazifalari va elementlari", [
    { type: "definition", content: "MS Excel — Microsoft elektron jadval dasturi. Ma'lumotlarni jadval ko'rinishida saqlash, tartiblash, hisoblash va tahlil qilish uchun mo'ljallangan. Excel moliya, buxgalteriya, statistika, fan sohalarida keng qo'llaniladi." },
    { type: "text", content: "Excel interfeysi: Ish kitobi (Workbook) — fayl. Ish varag'i (Worksheet) — jadval. Ustun (Column) — A, B, C... (16 384 ta). Qator (Row) — 1, 2, 3... (1 048 576 ta). Katak (Cell) — ustun va qator kesishmasi (masalan, A1). Faol katak — tanlangan katak." },
    { type: "table", content: "| Element | Tavsifi |\n|---------|--------|\n| Workbook | Excel fayli (.xlsx) |\n| Worksheet | Ish varag'i (Sheet1) |\n| Column | Ustun (A, B, ..., XFD) |\n| Row | Qator (1 - 1,048,576) |\n| Cell | Katak (A1, B5) |\n| Cell Reference | Katak manzili (=A1+B1) |\n| Formula Bar | Formula yozish satri |\n| Name Box | Faol katak manzili |" },
    { type: "note", content: "Katak manzillari: nisbiy (A1 — o'zgaradi), mutlaq ($A$1 — o'zgarmaydi), aralash ($A1, A$1). F4 klavishi manzil turini almashtiradi. Bir vaqtda bir necha varaq bilan ishlash mumkin." },
    { type: "example", content: "Excel asosiy amallar:\n1) Katakka ma'lumot kiriting (matn, son, sana)\n2) Avtoto'ldirish (AutoFill) — katakni tortish\n3) Ustun eni/kengligini o'zgartirish\n4) Kataklarni formatlash (shrift, rang, chekka)\n5) Funksiya: =SUM(A1:A10)" },
  ], [
    { id: "M03.04-q1", text: "Excel fayli qanday nomlanadi?", options: ["Document", "Workbook", "Slide", "Database"], correctIndex: 1, explanation: "Excel fayli ish kitobi (Workbook) deb ataladi", type: "Y1" },
    { id: "M03.04-q2", text: "Excelda nechta ustun bor?", options: ["256", "1024", "16384", "65536"], correctIndex: 2, explanation: "Excelda 16,384 ta ustun (A dan XFD gacha)", type: "Y1" },
    { id: "M03.04-q3", text: "C5 katak manzili nimani anglatadi?", options: ["5-ustun, C-qator", "C-ustun, 5-qator", "C5 nomli katak", "5-sahifa"], correctIndex: 1, explanation: "C5 — C ustuni va 5-qator kesishmasidagi katak", type: "Y1" },
    { id: "M03.04-q4", text: "Mutlaq manzil qanday belgilanadi?", options: ["A1", "$A$1", "#A1", "@A1"], correctIndex: 1, explanation: "Mutlaq manzil $A$1 ko'rinishida, $ belgisi bilan belgilanadi", type: "Y2" },
  ]),

  "M03.05": t("M03.05", "Excel formulalari va funksiyalari", [
    { type: "definition", content: "Formula — katakda hisoblashni bajaruvchi ifoda. Formula = (teng) belgisi bilan boshlanadi. Funksiya — oldindan tayyorlangan formula. Excelda 400+ funksiya mavjud (matematik, statistika, matn, sana, mantiqiy)." },
    { type: "table", content: "| Funksiya | Sintaksis | Vazifasi |\n|---------|----------|---------|\n| SUM | =SUM(A1:A10) | Yig'indi |\n| AVERAGE | =AVERAGE(A1:A10) | O'rtacha qiymat |\n| MAX | =MAX(A1:A10) | Eng katta |\n| MIN | =MIN(A1:A10) | Eng kichik |\n| COUNT | =COUNT(A1:A10) | Son yozilgan kataklarni sanash |\n| COUNTA | =COUNTA(A1:A10) | Bo'sh bo'lmagan kataklarni sanash |\n| IF | =IF(A1>50,\"o'tdi\",\"qoldi\") | Shart tekshirish |\n| VLOOKUP | =VLOOKUP(A1,$D$1:$E$10,2,0) | Qidirish |" },
    { type: "code", content: "=A1+B1              -- ikki katak yig'indisi\n=SUM(A1:A10)        -- diapazon yig'indisi\n=AVERAGE(B1:B20)    -- o'rtacha qiymat\n=MAX(C1:C100)       -- maksimal qiymat\n=IF(D1>=60,\"o'tdi\",\"qoldi\") -- shart\n=A1*$B$1            -- nisbiy va mutlaq manzil", language: "excel" },
    { type: "note", content: "Operatorlar: + (qo'shish), - (ayirish), * (ko'paytirish), / (bo'lish), ^ (daraja). Amallar tartibi: qavslar → daraja → ko'paytirish/bo'lish → qo'shish/ayirish. AutoSum (Σ) — kataklar diapazonining yig'indisini tez hisoblash." },
    { type: "example", content: "Baho hisoblash:\nA1 - A5: baholar (56, 78, 90, 45, 67)\n=SUM(A1:A5) → 336 (yig'indi)\n=AVERAGE(A1:A5) → 67.2 (o'rtacha)\n=MAX(A1:A5) → 90 (eng yuqori)\n=MIN(A1:A5) → 45 (eng past)\n=COUNTIF(A1:A5,\">=70\") → 2 (70 dan yuqori baholar)" },
  ], [
    { id: "M03.05-q1", text: "Excelda formula qanday belgi bilan boshlanadi?", options: ["+", "=", "@", "#"], correctIndex: 1, explanation: "Formula = (teng) belgisi bilan boshlanadi", type: "Y1" },
    { id: "M03.05-q2", text: "Yig'indi hisoblash funksiyasi?", options: ["=COUNT()", "=MAX()", "=SUM()", "=AVG()"], correctIndex: 2, explanation: "=SUM() — yig'indi hisoblash funksiyasi", type: "Y1" },
    { id: "M03.05-q3", text: "A1=100, B1=50 bo'lsa, =A1-B1*2 natija?", options: ["100", "0", "50", "-50"], correctIndex: 1, explanation: "Amallar tartibi: B1*2=100, keyin A1-100=0", type: "Y2" },
    { id: "M03.05-q4", text: "IF funksiyasi nima uchun ishlatiladi?", options: ["Yig'indi", "Shart tekshirish", "Qidirish", "Sanash"], correctIndex: 1, explanation: "IF — shart tekshirish funksiyasi: =IF(shart, qiymat_agar_true, qiymat_agar_false)", type: "Y2" },
  ]),

  "M03.06": t("M03.06", "Excel filtrlash va saralash", [
    { type: "definition", content: "Saralash (Sort) — ma'lumotlarni berilgan tartibda joylashtirish (o'sish, kamayish, alfavit). Filtrlash (Filter) — berilgan shart bo'yicha ma'lumotlarni tanlab ko'rsatish, qolganlarini yashirish." },
    { type: "text", content: "Saralash turlari: bir ustun bo'yicha, bir necha ustun bo'yicha (Custom Sort), rang bo'yicha. AutoFilter — ustun sarlavhasidagi o'q orqali filtr qo'shish. Matn filtrlari: Contains, Begins With, Ends With. Son filtrlari: Greater Than, Between, Top 10." },
    { type: "table", content: "| Amal | Buyruq | Tavsifi |\n|------|-------|--------|\n| O'sish bo'yicha | Sort A to Z | A-Z, 0-9 |\n| Kamayish bo'yicha | Sort Z to A | Z-A, 9-0 |\n| Maxsus saralash | Custom Sort | Bir necha ustun |\n| Filtr qo'shish | Filter | AutoFilter yoqish |\n| Matn filtri | Text Filters | Contains, Does Not Contain |\n| Son filtri | Number Filters | Greater Than, Between |" },
    { type: "note", content: "Filtrlashda ma'lumotlar o'chmaydi, faqat yashirinadi. Filtrni olib tashlash: Clear Filter. Saralash va filtrlash ma'lumotlar tahlilida eng ko'p ishlatiladigan vositalardandir." },
    { type: "example", content: "Filtrlash va saralash:\n1) Ma'lumotlarni belgilang (sarlavha bilan)\n2) Data → Sort & Filter → Filter (yoki Ctrl+Shift+L)\n3) Ustun o'qiga bosing → filtr shartini tanlang\n4) Saralash: Data → Sort → ustun va tartibni tanlang\n5) Maxsus: Custom Sort → Add Level → bir necha ustun" },
  ], [
    { id: "M03.06-q1", text: "AutoFilter qanday vazifani bajaradi?", options: ["Ma'lumotlarni saralaydi", "Shart bo'yicha ma'lumotlarni tanlab ko'rsatadi", "Ma'lumotlarni o'chiradi", "Yangi qator qo'shadi"], correctIndex: 1, explanation: "AutoFilter — berilgan shart bo'yicha ma'lumotlarni tanlab ko'rsatadi", type: "Y1" },
    { id: "M03.06-q2", text: "Filtrlashda ma'lumotlar qanday bo'ladi?", options: ["O'chadi", "Yashirinadi", "Ko'chiriladi", "Tahrirlanadi"], correctIndex: 1, explanation: "Filtrlashda ma'lumotlar o'chmaydi, faqat yashirinadi (Hide)", type: "Y2" },
    { id: "M03.06-q3", text: "Bir necha ustun bo'yicha saralash qanday amalga oshiriladi?", options: ["Sort A to Z", "Custom Sort", "Filter", "AutoSort"], correctIndex: 1, explanation: "Custom Sort → Add Level → bir necha ustun saralash", type: "Y1" },
    { id: "M03.06-q4", text: "Filtr qo'shish klavishi?", options: ["Ctrl+F", "Ctrl+Shift+L", "Ctrl+D", "Ctrl+S"], correctIndex: 1, explanation: "Ctrl+Shift+L — AutoFilter yoqish/o'chirish", type: "Y2" },
  ]),

  "M03.07": t("M03.07", "Excel diagramma va grafiklari", [
    { type: "definition", content: "Diagramma — ma'lumotlarni vizual (grafik) ko'rinishda ifodalash. Excelda 10+ diagramma turi mavjud: ustunli, chiziqli, doiraviy, qatorli, sohali, nuqtali va boshqalar." },
    { type: "table", content: "| Diagramma turi | Qo'llanilishi | Misol |\n|--------------|-------------|------|\n| Column (ustunli) | Taqqoslash | Oylik savdo hajmi |\n| Line (chiziqli) | Tendensiya ko'rsatish | Yillik o'sish |\n| Pie (doiraviy) | Qismlar nisbati | Bozor ulushi |\n| Bar (qatorli) | Taqqoslash (gorizontal) | Reyting |\n| Area (sohali) | Hajm o'zgarishi | Mahsulot ishlab chiqarish |\n| Scatter (nuqtali) | Korrelyatsiya | Bog'liqlik tahlili |" },
    { type: "text", content: "Diagramma qismlari: ma'lumotlar qatori (series), kategoriya (category), qiymat o'qi (Y), kategoriya o'qi (X), sarlavha, legend, ma'lumot belgilari (data labels). Diagramma yaratish: ma'lumotlarni belgilash → Insert → Chart → tur tanlash." },
    { type: "note", content: "Diagramma tahrirlash: Chart Design (dizayn, tur o'zgartirish), Format (ranglar, uslublar). Ma'lumotlar o'zgarganda diagramma avtomatik yangilanadi. Doiraviy diagramma faqat bir qator ma'lumot uchun mos." },
    { type: "example", content: "Diagramma yaratish:\n1) Ma'lumotlarni belgilang (sarlavhalar bilan)\n2) Insert → Charts → Column (yoki boshqa tur)\n3) Diagramma avtomatik yaratiladi\n4) Chart Design → Chart Styles (rangni o'zgartirish)\n5) Element qo'shish: Chart Elements (+) → Data Labels" },
  ], [
    { id: "M03.07-q1", text: "Doiraviy (Pie) diagramma nima uchun ishlatiladi?", options: ["Tendensiya", "Qismlar nisbati", "Taqqoslash", "Korrelyatsiya"], correctIndex: 1, explanation: "Pie chart — qismlarning butunga nisbatini ko'rsatadi", type: "Y1" },
    { id: "M03.07-q2", text: "Chiziqli (Line) diagramma qanday ma'lumot uchun mos?", options: ["Bozor ulushi", "Vaqt bo'yicha o'zgarish", "Mahsulot turlari", "Reyting"], correctIndex: 1, explanation: "Line chart — vaqt bo'yicha o'zgarish (tendensiya) ko'rsatish uchun", type: "Y1" },
    { id: "M03.07-q3", text: "Diagramma ma'lumotlari o'zgarganda nima bo'ladi?", options: ["Qo'lda yangilash kerak", "Avtomatik yangilanadi", "Diagramma o'chadi", "Hech narsa bo'lmaydi"], correctIndex: 1, explanation: "Excel diagrammasi ma'lumotlar o'zgarganda avtomatik yangilanadi", type: "Y1" },
    { id: "M03.07-q4", text: "Diagrammada qiymatlarni ko'rsatish uchun qaysi element ishlatiladi?", options: ["Legend", "Data Labels", "Gridlines", "Title"], correctIndex: 1, explanation: "Data Labels — diagrammada aniq qiymatlarni ko'rsatadi", type: "Y2" },
  ]),

  "M03.08": t("M03.08", "PowerPoint interfeysi va dizayni", [
    { type: "definition", content: "MS PowerPoint — Microsoft kompaniyasining taqdimot yaratish dasturi. 1987-yilda Apple Macintosh uchun ishlab chiqilgan. Hozirda eng keng tarqalgan taqdimot dasturi. Taqdimot — slaydlardan iborat elektron hujjat." },
    { type: "text", content: "PowerPoint interfeysi: menyu lentasi (Home, Insert, Design, Transitions, Animations, Slide Show, Review, View), slaydlar paneli (chap tomonda), slayd maydoni (markazda), eslatmalar maydoni (pastda), holat satri. Ko'rinish rejimlari: Normal, Outline, Slide Sorter, Notes Page, Slide Show." },
    { type: "table", content: "| Menyu | Vazifasi |\n|-------|---------|\n| Home | Slayd qo'shish, maket, shrift, abzats |\n| Insert | Rasm, jadval, diagramma, video, audio |\n| Design | Mavzular (Themes), ranglar, shriftlar |\n| Transitions | Slayd o'tish effektlari |\n| Animations | Obyekt animatsiyalari |\n| Slide Show | Namoyish rejimi |\n| View | Ko'rinish rejimlari |" },
    { type: "note", content: "Taqdimot dizayni (Design → Themes) — tayyor shablonlar. Shablon ranglari, shriftlari va effektlarini o'zgartirish mumkin. Zamonaviy taqdimot dizayni: minimal, 3 xildan ko'p shrift ishlatmaslik, yuqori sifatli rasmlar." },
    { type: "example", content: "Taqdimot yaratish:\n1) PowerPoint dasturini ishga tushiring\n2) Yangi taqdimot (Blank Presentation) yoki shablon tanlang\n3) Sarlavha va matn kiriting\n4) Yangi slayd: Home → New Slide (Ctrl+M)\n5) Dizayn: Design → Themes → mavzu tanlash\n6) Slaydlar tartibini o'zgartirish: Slide Sorter" },
  ], [
    { id: "M03.08-q1", text: "Yangi slayd qo'shish klavishi?", options: ["Ctrl+N", "Ctrl+M", "Ctrl+S", "Ctrl+D"], correctIndex: 1, explanation: "Ctrl+M — yangi slayd qo'shish", type: "Y1" },
    { id: "M03.08-q2", text: "PowerPoint dasturi qachon yaratilgan?", options: ["1977", "1987", "1997", "2007"], correctIndex: 1, explanation: "MS PowerPoint 1987-yilda Apple Macintosh uchun ishlab chiqilgan", type: "Y1" },
    { id: "M03.08-q3", text: "Taqdimot dizaynini o'zgartirish qaysi menyuda?", options: ["Home", "Design", "Transitions", "View"], correctIndex: 1, explanation: "Design menyusida Themes (mavzular) orqali dizayn o'zgartiriladi", type: "Y1" },
    { id: "M03.08-q4", text: "Slaydlarni ketma-ketlikda ko'rish rejimi?", options: ["Normal", "Slide Sorter", "Slide Show", "Outline"], correctIndex: 1, explanation: "Slide Sorter — barcha slaydlarni ketma-ketlikda ko'rish rejimi", type: "Y2" },
  ]),

  "M03.09": t("M03.09", "PowerPoint obyektlari va multimedia", [
    { type: "definition", content: "PowerPoint obyektlari — slaydga qo'shiladigan elementlar: matn, rasm, jadval, diagramma, SmartArt, WordArt, shakl (Shape), video, audio, gipermurojaat. Multimedia — bir vaqtda bir necha turdagi ma'lumotlardan (matn, tovush, video) foydalanish." },
    { type: "table", content: "| Obyekt turi | Insert menyusi | Imkoniyatlari |\n|-----------|--------------|-------------|\n| Rasm | Pictures / Online Pictures | O'lcham, effekt, ramka |\n| Jadval | Table | Qator/ustun, uslublar |\n| Diagramma | Chart | 10+ tur, ma'lumotlar bilan bog'liq |\n| SmartArt | SmartArt | Jarayon, iyerarxiya, matritsa |\n| Shakl | Shapes | Chiziq, to'rtburchak, strelka |\n| Video | Video | Kompyuterdan yoki onlayn |\n| Audio | Audio | Ovoz, musiqa, ovoz yozish |" },
    { type: "text", content: "Rasm va shakllarni formatlash: Format menyusi (o'lcham, rang, soyali, 3D effektlar). Video qo'shish: Insert → Video → This Device yoki Online Video. Audio: Insert → Audio → Audio on My PC yoki Record Audio. Gipermurojaat: boshqa slaydga, faylga yoki websaytga o'tish." },
    { type: "note", content: "Multimedia slaydlarni jonlantiradi, lekin haddan oshirmaslik kerak. Video va audio fayllar taqdimot hajmini oshiradi. Maqsad: tinglovchi diqqatini jalb qilish, chalg'itmaslik." },
    { type: "example", content: "Multimedia qo'shish:\n1) Video: Insert → Video → This Device → fayl tanlash\n2) Audio: Insert → Audio → Audio on My PC → musiqa tanlash\n3) Video sozlash: Playback → Start (Automatically / On Click)\n4) Gipermurojaat: matnni belgilash → Insert → Link → Place in This Document\n5) SmartArt: Insert → SmartArt → tur tanlash → matn kiritish" },
  ], [
    { id: "M03.09-q1", text: "Slaydga video qo'shish menyusi?", options: ["Home → Video", "Insert → Video", "Design → Video", "Animations → Video"], correctIndex: 1, explanation: "Insert → Video orqali slaydga video qo'shiladi", type: "Y1" },
    { id: "M03.09-q2", text: "Giper murojaat (Hyperlink) nima vazifasini bajaradi?", options: ["Rasm chizish", "Boshqa joyga o'tish", "Matn formatlash", "Video montaj"], correctIndex: 1, explanation: "Giper murojaat boshqa slaydga, faylga yoki websaytga o'tish imkonini beradi", type: "Y1" },
    { id: "M03.09-q3", text: "SmartArt qanday ma'lumot uchun mo'ljallangan?", options: ["Matnli ma'lumot", "Vizual iyerarxik ma'lumot", "Raqamli ma'lumot", "Video ma'lumot"], correctIndex: 1, explanation: "SmartArt — iyerarxiya, jarayon, ro'yxat kabi vizual sxemalar uchun", type: "Y2" },
    { id: "M03.09-q4", text: "Insert → Audio → Record Audio nima imkoniyat beradi?", options: ["Musiqa qo'shish", "Ovoz yozish", "Video kesish", "Rasm tahrirlash"], correctIndex: 1, explanation: "Record Audio — mikrofondan ovoz yozish imkonini beradi", type: "Y1" },
  ]),

  "M03.10": t("M03.10", "Animatsiya va o'tish effektlari", [
    { type: "definition", content: "Animatsiya — slayddagi obyektlarga (matn, rasm, shakl) harakat berish. O'tish effekti (Transition) — bir slayddan ikkinchi slaydga o'tishdagi vizual effekt. Animatsiya va o'tish effektlari taqdimotni jonlantiradi." },
    { type: "table", content: "| Effekt turi | Animations menyusi | Tavsifi |\n|-----------|-----------------|--------|\n| Entrance | Kirish effektlari | Obyekt paydo bo'lishi |\n| Emphasis | Ajratish | Obyektni ta'kidlash |\n| Exit | Chiqish effektlari | Obyekt yo'qolishi |\n| Motion Paths | Harakat yo'li | Obyektning harakati |\n| Transition | Transitions menyusi | Slayd o'tish effekti |" },
    { type: "text", content: "Animatsiya sozlamalari: Animation Pane (animatsiya paneli) — barcha animatsiyalarni boshqarish. Start: On Click (bosganda), With Previous (oldingi bilan), After Previous (keyin). Duration (davomiylik) va Delay (kechikish) sozlash mumkin. Trigger — bosganda yoki boshqa hodisa orqali." },
    { type: "note", content: "O'tish effektlari (Transitions): None (yo'q), Fade, Push, Wipe, Split, Morph, Reveal va boshqalar. Bir xil o'tishni barcha slaydlarga qo'llash: Apply To All. Effektlar haddan tashqari ko'p bo'lsa, tinglovchini chalg'itadi." },
    { type: "example", content: "Animatsiya qo'shish:\n1) Obyektni tanlang (matn yoki rasm)\n2) Animations → qandaydir effektni tanlang (masalan, Fly In)\n3) Effect Options → yo'nalishni tanlang\n4) Animation Pane → start, duration, delay sozlang\n5) Transitions → slayd o'tish effektini tanlang\n6) Transitions → Timing → Automatically After: 5 sekund" },
  ], [
    { id: "M03.10-q1", text: "Slayddagi obyektga harakat berish qanday nomlanadi?", options: ["Transition", "Animation", "Design", "Layout"], correctIndex: 1, explanation: "Animatsiya — slayddagi obyektga harakat berish", type: "Y1" },
    { id: "M03.10-q2", text: "Bir slayddan ikkinchisiga o'tish effekti qaysi menyuda?", options: ["Home", "Animations", "Transitions", "Design"], correctIndex: 2, explanation: "Transitions menyusida slayd o'tish effektlari sozlanadi", type: "Y1" },
    { id: "M03.10-q3", text: "Animation Pane nima vazifasini bajaradi?", options: ["Slaydlar tartibi", "Animatsiyalarni boshqarish paneli", "Rang tanlash", "Shrift sozlash"], correctIndex: 1, explanation: "Animation Pane — barcha animatsiyalarni boshqarish paneli", type: "Y2" },
    { id: "M03.10-q4", text: "Barcha slaydlarga bir xil o'tish effektini qo'llash buyrug'i?", options: ["Apply All", "Apply To All", "Copy To All", "Use For All"], correctIndex: 1, explanation: "Apply To All — barcha slaydlarga bir xil o'tish effektini qo'llaydi", type: "Y1" },
  ]),
// ===================== M04: MANTIQIY FIKRLASH VA MODELLASHTIRISH =====================

  'M04.01': t('M04.01', 'Mantiq asoslari va mulohazalar', [
    { type: 'definition', content: 'Mantiq (logika) — tafakkurning namoyon bo\'lish shakllari va taraqqiyotini, fikrlar o\'rtasidagi aloqadorlikni ko\'rsatadigan qonun-qoidalar yig\'indisini o\'rganadi. Mantiq ilmining asoschisi Arastu (Aristotel) hisoblanadi.' },
    { type: 'text', content: 'Mantiqning boshlang\'ich tushunchalaridan biri — mulohaza. Mulohaza — rost yoki yolg\'onligi haqida fikr yuritish mumkin bo\'lgan darak gap. So\'roq va undov gaplar mulohaza bo\'la olmaydi.' },
    { type: 'table', content: '| Mulohaza turi | Ta\'rifi | Misol |\n|--------------|---------|-------|\n| Sodda mulohaza | Qismlarga ajratilmaydi | "7 < 5" — yolg\'on |\n| Murakkab mulohaza | Sodda mulohazalardan tuziladi | "2 ga bo\'linuvchi son juft" |' },
    { type: 'note', content: '🔑 Mulohazalar lotin alifbosi bosh harflari bilan belgilanadi: A, B, C, ... Har bir mulohaza faqat "rost" (1, true) yoki "yolg\'on" (0, false) qiymatga ega.' },
    { type: 'example', content: 'A = "Toshkent — go\'zal shahar" (rost)\nB = "WWW — butun dunyo o\'rgimchak to\'ri" (rost)\nC = "Kompyuter XVI asrda ixtiro qilingan" (yolg\'on)\nD = "11 — tub son" (rost)' },
  ], [
    { id: 'M04.01-q1', text: 'Mantiq ilmining asoschisi kim?', options: ['Suqrot', 'Arastu', 'Aflotun', 'Forobiy'], correctIndex: 1, explanation: 'Arastu (Aristotel) — mantiq ilmining asoschisi', type: 'Y1' },
    { id: 'M04.01-q2', text: 'Quyidagilardan qaysi biri mulohaza bo\'la oladi?', options: ['Ertalabki badantarbiya mashqlarini bajaring', 'Ushbu tasmaning uzunligi qanday?', '11 — tub son', 'Kim kelgan?'], correctIndex: 2, explanation: '"11 — tub son" darak gap, rost yoki yolg\'onligi aniqlanadi. So\'roq va undov gaplar mulohaza emas', type: 'Y1' },
    { id: 'M04.01-q3', text: '"Agar butun son 2 ga bo\'linsa, u holda bu son juft son bo\'ladi" — bu qanday mulohaza?', options: ['Sodda', 'Murakkab', 'So\'roq gap', 'Undov gap'], correctIndex: 1, explanation: 'Bu murakkab mulohaza, chunki ikki sodda mulohazadan tashkil topgan', type: 'Y2' },
  ]),

  'M04.02': t('M04.02', 'Mantiqiy amallar va ifodalar', [
    { type: 'definition', content: 'Mantiqiy amallar — mulohazalar ustida bajariladigan amallar: konyunksiya (VA), dizyunksiya (YOKI), inversiya (EMAS), implikatsiya (AGAR...BO\'LSA) va ekvivalensiya (FAQAT VA FAQAT).' },
    { type: 'table', content: '| Amal | Belgilanishi | Natija |\n|------|-------------|--------|\n| Konyunksiya | A & B, A∧B | Ikkala mulohaza rost bo\'lganda rost |\n| Dizyunksiya | A ∨ B, A+B | Kamida bittasi rost bo\'lganda rost |\n| Inversiya | ⏋A, ¬A, Ā | Qiymatni qarama-qarshiga o\'zgartiradi |\n| Implikatsiya | A=>B | A rost, B yolg\'on bo\'lganda yolg\'on |\n| Ekvivalensiya | A<=>B | Bir vaqtda rost yoki bir vaqtda yolg\'on |' },
    { type: 'text', content: 'Mantiqiy amallarning bajarilish tartibi: inversiya (⏋) → konyunksiya (&) → dizyunksiya (∨) → implikatsiya (=>) → ekvivalensiya (<=>). Qavslar mavjud bo\'lsa, avval qavs ichidagi amallar bajariladi.' },
    { type: 'example', content: 'A = "Olma sotib olsam", B = "O\'rik sotib olsam", C = "Mevali pirog tayyorlayman"\n(A ∨ B) => C: "Agar olma yoki o\'rik sotib olsam, mevali pirog tayyorlayman"' },
    { type: 'note', content: '💡 Konyunksiya — mantiqiy ko\'paytirish (AND), dizyunksiya — mantiqiy qo\'shish (OR), inversiya — mantiqiy inkor (NOT). Jorj Bul mantiq algebrasining asoschisi.' },
  ], [
    { id: 'M04.02-q1', text: 'A=rost, B=yolg\'on bo\'lganda A & B nimaga teng?', options: ['Rost', 'Yolg\'on', 'Aniqlab bo\'lmaydi', 'A ga teng'], correctIndex: 1, explanation: 'Konyunksiya ikkala mulohaza rost bo\'lgandagina rost. A=1, B=0 → A&B=0 (yolg\'on)', type: 'Y1' },
    { id: 'M04.02-q2', text: 'Mantiqiy amallarning bajarilish tartibi qanday?', options: ['∨ → & → ⏋ → => → <=>', '⏋ → & → ∨ → => → <=>', '& → ∨ → ⏋ → => → <=>', '⏋ → ∨ → & => → <=>'], correctIndex: 1, explanation: 'Inversiya → konyunksiya → dizyunksiya → implikatsiya → ekvivalensiya', type: 'Y1' },
    { id: 'M04.02-q3', text: 'A=rost, B=yolg\'on bo\'lganda (A ∨ ⏋B) & (A=>B) ifodaning qiymatini toping.', options: ['Rost', 'Yolg\'on', 'A ga teng', 'B ga teng'], correctIndex: 1, explanation: 'A=1, B=0: ⏋B=1, (A∨⏋B)=1, (A=>B)=0, (A∨⏋B)&(A=>B)=1&0=0 (yolg\'on)', type: 'Y3' },
  ]),

  'M04.03': t('M04.03', 'Rostlik jadvallari', [
    { type: 'definition', content: 'Rostlik jadvali — mantiqiy ifodadagi o\'zgaruvchilarning barcha mumkin bo\'lgan qiymatlari kombinatsiyasi uchun ifoda natijasini ko\'rsatuvchi jadval.' },
    { type: 'text', content: 'Rostlik jadvalini tuzish ketma-ketligi:\n1) O\'zgaruvchilar soni (n) ni aniqlash\n2) Mantiqiy amallar soni (k) ni aniqlash\n3) Amallarning bajarilish tartibini aniqlash\n4) Jadval ustunlari soni: c = n + k\n5) Jadval satrlari soni: r = 2ⁿ' },
    { type: 'example', content: 'Misol: (A ∨ B) & (⏋A) ifoda uchun rostlik jadvali:\n| A | B | A∨B | ⏋A | (A∨B)&⏋A |\n| 0 | 0 |  0  |  1 |    0     |\n| 0 | 1 |  1  |  1 |    1     |\n| 1 | 0 |  1  |  0 |    0     |\n| 1 | 1 |  1  |  0 |    0     |' },
    { type: 'table', content: '| Asosiy amallar | Rostlik jadvali |\n|----------------|----------------|\n| Konyunksiya (A&B) | 00→0, 01→0, 10→0, 11→1 |\n| Dizyunksiya (A∨B) | 00→0, 01→1, 10→1, 11→1 |\n| Inversiya (⏋A) | 0→1, 1→0 |\n| Implikatsiya (A=>B) | 00→1, 01→1, 10→0, 11→1 |\n| Ekvivalensiya (A<=>B) | 00→1, 01→0, 10→0, 11→1 |' },
    { type: 'note', content: '📊 O\'zgaruvchilar qiymatlari ikkilik sanoq sistemasida o\'sish tartibida yoziladi. n=2 bo\'lsa: 00, 01, 10, 11. n=3 bo\'lsa: 000, 001, 010, 011, 100, 101, 110, 111.' },
  ], [
    { id: 'M04.03-q1', text: 'Ikkita o\'zgaruvchili mantiqiy ifodaning rostlik jadvalida nechta satr bo\'ladi?', options: ['2', '4', '8', '16'], correctIndex: 1, explanation: 'r = 2ⁿ = 2² = 4 ta satr', type: 'Y1' },
    { id: 'M04.03-q2', text: 'A=1, B=1 bo\'lganda (A & B) => (A ∨ B) ifodaning qiymati?', options: ['0', '1', 'Aniqlab bo\'lmaydi', 'A ga teng'], correctIndex: 1, explanation: 'A&B=1, A∨B=1, 1=>1=1 (rost)', type: 'Y2' },
    { id: 'M04.03-q3', text: 'A=0, B=0, C=1 bo\'lganda (A ∨ B) & ⏋C ifodaning qiymati?', options: ['Rost', 'Yolg\'on', 'Aniqlab bo\'lmaydi', 'C ga teng'], correctIndex: 1, explanation: '(0∨0)=0, ⏋1=0, 0&0=0 (yolg\'on)', type: 'Y2' },
  ]),

  'M04.04': t('M04.04', 'Mantiqiy sxemalar', [
    { type: 'definition', content: 'Mantiqiy element — ikkilik signallarni qayta ishlab, mantiqiy amal natijasini chiqaruvchi elektron qurilma. Asosiy mantiqiy elementlar: VA (AND), YOKI (OR), EMAS (NOT).' },
    { type: 'table', content: '| Element | Belgisi | Vazifasi | Rostlik sharti |\n|---------|--------|---------|---------------|\n| Konyunktor (VA) | & | Mantiqiy ko\'paytirish | Ikkala signal 1 bo\'lganda 1 |\n| Dizyunktor (YOKI) | ∨ | Mantiqiy qo\'shish | Kamida bitta signal 1 bo\'lganda 1 |\n| Invertor (EMAS) | ⏋ | Inkor | Signalni teskarisiga o\'zgartiradi |' },
    { type: 'text', content: 'Mantiqiy sxema — kompyuter qurilmalarining ishlashini tavsiflovchi mantiqiy funksiyani bajaradigan elektron qurilma. Mantiqiy elementlar birikmasidan murakkab raqamli sxemalar yaratiladi.' },
    { type: 'example', content: 'A & B ∨ ⏋(B ∨ A) ifodaga mos sxemani chizish:\n1) O\'zgaruvchilar: A, B\n2) Amallar tartibi: B∨A → ⏋(B∨A) → A&B → A&B ∨ ⏋(B∨A)\n3) A=1, B=0: 1&0∨⏋(0∨1)=0' },
    { type: 'note', content: '🔌 Zamonaviy kompyuterlarning barcha hisoblash qurilmalari mantiqiy elementlarga asoslangan. Protsessor milliardlab mantiqiy elementlardan tashkil topgan.' },
  ], [
    { id: 'M04.04-q1', text: 'Invertor elementi nechta kirish signaliga ega?', options: ['0', '1', '2', '3'], correctIndex: 1, explanation: 'Invertor faqat bitta kirish va bitta chiqish signaliga ega', type: 'Y1' },
    { id: 'M04.04-q2', text: 'VA (AND) elementining chiqishida 1 bo\'lishi uchun nima kerak?', options: ['Kamida bitta kirish 1', 'Ikkala kirish 1', 'Kirishlar har xil', 'Hech qanday signal'], correctIndex: 1, explanation: 'VA elementi ikkala kirish 1 bo\'lgandagina chiqishda 1 beradi', type: 'Y1' },
    { id: 'M04.04-q3', text: 'A=1, B=0 bo\'lganda (A & B) ∨ ⏋B sxemaning chiqish signali qiymati?', options: ['0', '1', 'Aniqlab bo\'lmaydi', 'A ga teng'], correctIndex: 1, explanation: 'A&B=0, ⏋B=1, (A&B)∨⏋B=0∨1=1', type: 'Y2' },
  ]),

  'M04.05': t('M04.05', 'Masalani kompyuterda yechish bosqichlari', [
    { type: 'definition', content: 'Kompyuter yordamida masala yechish — muammoni tahlil qilish, matematik modelini tuzish, algoritm ishlab chiqish, dasturlash va natijani tahlil qilish bosqichlaridan iborat jarayon.' },
    { type: 'text', content: 'Masalani kompyuterda yechish bosqichlari:\n1) Masalaning qo\'yilishi — maqsad va mazmunini aniqlash, boshlang\'ich va natijaviy kattaliklarni belgilash\n2) Matematik modelni tuzish — formulalar va munosabatlarni ifodalash\n3) Algoritmlash — yechim algoritmini tuzish\n4) Dasturlash — algoritmni dasturiy kodga o\'tkazish\n5) Dasturni kompyuter xotirasiga kiritish\n6) Natija olish va tahlil etish' },
    { type: 'example', content: 'Masala: Xokkey shaybasi massasi 150 g, unga 100 N kuch berilsa, tezlanishni toping.\n1) Berilgan: m=0,15 kg, F=100 N. Topish: a=?\n2) Model: Nyuton qonuni a=F/m\n3) Algoritm: m ni kg ga o\'tkaz → a=F/m → a ni chiqar\n4) Dastur: a = 100 / 0.15 → 666.67 m/s²' },
    { type: 'note', content: '💡 Masalaning to\'g\'ri qo\'yilishi muvaffaqiyatli yechimning asosidir. Keraksiz ma\'lumotlarni ajratish va muhimlarini aniqlash muhim.' },
  ], [
    { id: 'M04.05-q1', text: 'Masalani kompyuterda yechishning birinchi bosqichi?', options: ['Dasturlash', 'Algoritmlash', 'Masalaning qo\'yilishi', 'Natija tahlili'], correctIndex: 2, explanation: 'Birinchi bosqich — masalaning qo\'yilishi, maqsad va mazmunini aniqlash', type: 'Y1' },
    { id: 'M04.05-q2', text: 'Matematik modelni tuzish qaysi bosqichda amalga oshiriladi?', options: ['1-bosqich', '2-bosqich', '3-bosqich', '4-bosqich'], correctIndex: 1, explanation: '2-bosqichda masalaning matematik modeli, formulalar va munosabatlar hosil qilinadi', type: 'Y1' },
    { id: 'M04.05-q3', text: 'Dastur to\'g\'riligini tekshirish qaysi bosqichda amalga oshiriladi?', options: ['Algoritmlash', 'Dasturlash', 'Natija olish va tahlil', 'Masala qo\'yilishi'], correctIndex: 2, explanation: '6-bosqichda dastur ishga tushiriladi, testlar yordamida to\'g\'riligi tekshiriladi', type: 'Y2' },
  ]),

  'M04.06': t('M04.06', 'Model va model turlari', [
    { type: 'definition', content: 'Model (lot. modulus — o\'lchov, me\'yor) — haqiqiy obyekt yoki obyektlar tizimining soddalashtirilgan nusxasi. Modellashtirish — obyektlarni ularning modellari yordamida tadqiq qilish jarayoni.' },
    { type: 'text', content: 'Modellarning turlari:\n1) Foydalanish sohasi bo\'yicha: o\'quv, tajriba, o\'yin, imitatsion, ilmiy-tadqiqot\n2) Vaqt omili bo\'yicha: statik (vaqt o\'zgarishisiz) va dinamik (vaqt bilan o\'zgaradi)\n3) Taqdim etish usuli bo\'yicha: moddiy (globus, maket) va axborot (belgili, verbal)' },
    { type: 'table', content: '| Model turi | Ta\'rifi | Misol |\n|-----------|---------|-------|\n| O\'quv | O\'qitish jarayonida ishlatiladi | Trenajyor, o\'quv dasturi |\n| Tajriba | Tadqiqot va bashorat uchun | Samolyot modeli |\n| O\'yin | Ziddiyatli vaziyatlarni hal qilish | Harbiy o\'yin |\n| Imitatsion | Voqelikni taqlid qilish | Ob-havo modeli |\n| Statik | Vaqt o\'zgarishisiz | Xarita, globus |\n| Dinamik | Vaqt bilan o\'zgaradi | Harakat grafigi |' },
    { type: 'note', content: '🌍 Hech qaysi model prototipning barcha xususiyatlarini to\'liq hisobga olmaydi. Model asosida olingan natija haqiqatga yaqin keladi.' },
    { type: 'example', content: 'Kompyuter modellari: tuzilmaviy-funksional (obyektning shartli ifodasi) va imitatsion (turli sharoitlarda ishlash jarayonini ifodalovchi dastur).\nMisollar: Excelda moliyaviy model, 3D-model, simulyatorlar.' },
  ], [
    { id: 'M04.06-q1', text: 'Model nima?', options: ['Haqiqiy obyektning o\'zi', 'Obyektning soddalashtirilgan nusxasi', 'Kompyuter dasturi', 'Matematik formula'], correctIndex: 1, explanation: 'Model — haqiqiy obyektning soddalashtirilgan nusxasi yoki obrazi', type: 'Y1' },
    { id: 'M04.06-q2', text: 'Globus qanday model turiga kiradi?', options: ['Dinamik', 'Moddiy statik', 'Axborot', 'O\'yin'], correctIndex: 1, explanation: 'Globus — Yer shari shaklining moddiy va statik modeli', type: 'Y1' },
    { id: 'M04.06-q3', text: 'Axborot modelining turlari?', options: ['Statik va dinamik', 'Belgili va verbal', 'O\'quv va o\'yin', 'Moddiy va mavhum'], correctIndex: 1, explanation: 'Axborot modellari belgili (formal til vositalari bilan) va verbal (og\'zaki) turlarga bo\'linadi', type: 'Y2' },
  ]),

  // ===================== M05: SANOQ SISTEMALARI =====================

  'M05.01': t('M05.01', 'Sanoq sistemalari asoslari', [
    { type: 'definition', content: 'Sanoq sistemalari — sonlarni yozish va nomlash usullari. Eng keng tarqalganlari: ikkilik (2), sakkizlik (8), o\'nlik (10) va o\'n oltilik (16).' },
    { type: 'text', content: 'O\'nlik sistema (decimal) — kundalik hayotda ishlatamiz. Ikkilik (binary) — kompyuterlar tili. O\'n oltilik (hexadecimal) — xotira manzillari va ranglarni ifodalashda ishlatiladi.' },
    { type: 'table', content: '| Sistema | Asos | Raqamlar | Misol |\n|---------|------|----------|-------|\n| Ikkilik | 2 | 0,1 | 1010₂ |\n| Sakkizlik | 8 | 0-7 | 12₈ |\n| O\'nlik | 10 | 0-9 | 10₁₀ |\n| O\'n oltilik | 16 | 0-9,A-F | A₁₆ |' },
    { type: 'note', content: '🔑 O\'n oltilik sistemada A=10, B=11, C=12, D=13, E=14, F=15' },
    { type: 'example', content: 'FF₁₆ = 255₁₀ = 11111111₂' },
  ], [
    { id: 'M05.01-q1', text: 'O\'n oltilik sanoq sistemasining asosi necha?', options: ['8', '10', '16', '2'], correctIndex: 2, explanation: 'O\'n oltilik sanoq sistemasining asosi 16', type: 'Y1' },
    { id: 'M05.01-q2', text: 'O\'n oltilik sistemada F harfi qaysi songa mos keladi?', options: ['14', '15', '16', '10'], correctIndex: 1, explanation: 'F = 15', type: 'Y1' },
    { id: 'M05.01-q3', text: '1A₁₆ sonini o\'nlikka o\'tkazing.', options: ['16', '26', '36', '20'], correctIndex: 1, explanation: '1A₁₆ = 1×16 + 10 = 26₁₀', type: 'Y2' },
  ]),

  'M05.02': t('M05.02', 'Sanoq sistemalari orasida o\'tkazish', [
    { type: 'definition', content: 'Sonlarni bir sanoq sistemasidan boshqasiga o\'tkazish — informatikaning asosiy ko\'nikmalaridan biri. Har bir sanoq sistemasining o\'z asosi (baza) bor.' },
    { type: 'text', content: 'Ikkilik sanoq sistemasidan o\'nlikka o\'tkazish uchun har bir raqamni 2 ning darajasiga ko\'paytirib, yig\'indisini topamiz.' },
    { type: 'formula', content: 'N = aₙ×2ⁿ⁻¹ + aₙ₋₁×2ⁿ⁻² + ... + a₁×2⁰' },
    { type: 'example', content: '1011₂ = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11₁₀\n255₁₀ → ikkilikka: ketma-ket 2 ga bo\'lish: 11111111₂' },
    { type: 'note', content: '💡 Ikkilikdan o\'nlikka — 2 ning darajalari bo\'yicha yoyish. O\'nlikdan ikkilikka — ketma-ket 2 ga bo\'lish. Sakkizlik va o\'n oltilik uchun diada, triada, tetrada jadvallaridan foydalanish mumkin.' },
    { type: 'code', content: '# Python: ikkilik → o\'nlik\nbinary = "1011"\ndecimal = int(binary, 2)\nprint(decimal)  # 11\n\n# O\'nlik → ikkilik\nprint(bin(255))  # 0b11111111\n\n# O\'nlik → o\'n oltilik\nprint(hex(255))  # 0xff', language: 'python' },
  ], [
    { id: 'M05.02-q1', text: '1011₂ sonini o\'nlik sanoq sistemasiga o\'tkazing.', options: ['9', '11', '13', '15'], correctIndex: 1, explanation: '1011₂ = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11₁₀', type: 'Y1' },
    { id: 'M05.02-q2', text: '255₁₀ sonini ikkilik sanoq sistemasiga o\'tkazing.', options: ['11111111₂', '11111110₂', '11101111₂', '11001100₂'], correctIndex: 0, explanation: '255 ni ketma-ket 2 ga bo\'lamiz: 255÷2=127(1), 127÷2=63(1), 63÷2=31(1), 31÷2=15(1), 15÷2=7(1), 7÷2=3(1), 3÷2=1(1), 1÷2=0(1). Qoldiqlarni teskari yozamiz: 11111111₂', type: 'Y2' },
    { id: 'M05.02-q3', text: 'Agar ikkilik sonda eng kichik 3 ta bit 0 ga teng bo\'lsa, bu son qanday songa bo\'linadi?', options: ['2', '4', '8', '16'], correctIndex: 2, explanation: 'Agar sonning oxirgi 3 ta biti 0 bo\'lsa, bu son 2³ = 8 ga qoldiqsiz bo\'linadi. Masalan: 1011000₂ = 88₁₀, 88 ÷ 8 = 11', type: 'Y3' },
  ]),

  'M05.03': t('M05.03', 'Turli sanoq sistemalarida arifmetika', [
    { type: 'definition', content: 'Turli sanoq sistemalarida arifmetik amallar o\'nlik sistemasidagi kabi qoidalar asosida bajariladi, farqi — asosga ko\'ra o\'nlikdan o\'tish qoidasidadir.' },
    { type: 'text', content: 'Ikkilik sistemada qo\'shish: 0+0=0, 0+1=1, 1+0=1, 1+1=0 (1 ni keyingi xonaga o\'tadi). Ayirish, ko\'paytirish va bo\'lish ham o\'xshash qoidalar asosida bajariladi.' },
    { type: 'example', content: 'Ikkilik qo\'shish:\n  1011₂\n+ 1101₂\n-------\n 11000₂\n\nTushuntirish: 1+1=0 (1 o\'tadi), 1+0+1=0 (1 o\'tadi) va h.k.' },
    { type: 'table', content: '| Amal | Ikkilik | Sakkizlik | O\'n oltilik |\n|------|---------|----------|------------|\n| Qo\'shish | 101+011=1000₂ | 7₈+5₈=14₈ | A₁₆+B₁₆=15₁₆ |\n| Ayirish | 101-011=010₂ | 12₈-5₈=5₈ | 1A₁₆-F₁₆=B₁₆ |' },
    { type: 'note', content: '📐 Ikkilik arifmetika kompyuter protsessorida ALU (Arifmetik-mantiqiy qurilma) tomonidan bajariladi. Ayirish amali qo\'shimcha kod orqali qo\'shishga almashtiriladi.' },
    { type: 'code', content: '# Ikkilik arifmetika\nprint(0b1011 + 0b1101)  # 24 (11000₂)\nprint(0b1011 - 0b0111)  # 4 (0100₂)\nprint(0b1011 * 0b0011)  # 33 (100001₂)\n\n# Formatlash\nprint(bin(0b1011 + 0b1101))  # 0b11000', language: 'python' },
  ], [
    { id: 'M05.03-q1', text: 'Ikkilik sistemada 1+1 nimaga teng?', options: ['0 (1 o\'tadi)', '10₂', '2', '11₂'], correctIndex: 0, explanation: '1+1=0, 1 ni keyingi xonaga o\'tadi', type: 'Y1' },
    { id: 'M05.03-q2', text: '1101₂ + 1011₂ natijasini toping.', options: ['11000₂', '10100₂', '11100₂', '10001₂'], correctIndex: 0, explanation: '1101₂ + 1011₂ = 13₁₀ + 11₁₀ = 24₁₀ = 11000₂', type: 'Y2' },
    { id: 'M05.03-q3', text: 'A₁₆ + B₁₆ yig\'indini o\'n oltilikda toping.', options: ['1A₁₆', '15₁₆', 'AB₁₆', '21₁₆'], correctIndex: 1, explanation: 'A₁₆=10₁₀, B₁₆=11₁₀, 10+11=21₁₀=16+5=15₁₆', type: 'Y2' },
  ]),

  // ===================== M06: ALGORITMLASH =====================

  'M06.01': t('M06.01', 'Algoritm tushunchasi va xossalari', [
    { type: 'definition', content: 'Algoritm — muayyan maqsadga erishish uchun bajariladigan amallarning aniq, tushunarli va chekli ketma-ketligi.' },
    { type: 'text', content: 'Algoritm xossalari: diskretlik (qadamlarga bo\'linish), aniqilik (noaniqlik yo\'q), tushunarlilik (ijrochiga mos), natijalilik (chekli qadamda natija), ommaviylik (turli ma\'lumotlar uchun mos).' },
    { type: 'table', content: '| Ifodalash usuli | Tavsif | Misol |\n|----------------|--------|-------|\n| So\'zlar bilan | Tabiiy tilda | "Agar yomg\'ir yog\'sa, soyabon ol" |\n| Blok-sxema | Grafik shakl | Geometrik figuralar bilan |\n| Psevdokod | Dasturga o\'xshash | Agar A>B: chiqar A |\n| Dastur kodi | Til operatorlari | if (a > b) print(a) |' },
    { type: 'example', content: 'Blok-sxema elementlari:\n   Oval — boshlash/tugatish\n   Parallelogramm — kiritish/chiqarish\n   Romb — shart tekshirish\n   To\'g\'ri to\'rtburchak — amal bajarish' },
  ], [
    { id: 'M06.01-q1', text: 'Algoritmning qaysi xossasi uning chekli qadamlardan iboratligini anglatadi?', options: ['Aniqilik', 'Diskretlik', 'Natijalilik', 'Ommaviylik'], correctIndex: 1, explanation: 'Diskretlik — algoritmning alohida qadamlarga bo\'linishi', type: 'Y1' },
    { id: 'M06.01-q2', text: 'Algoritmni grafik shaklda ifodalash usuli qanday nomlanadi?', options: ['Psevdokod', 'Blok-sxema', 'Dastur kodi', 'So\'zlar bilan'], correctIndex: 1, explanation: 'Blok-sxema — algoritmni geometrik figuralar orqali ifodalash', type: 'Y1' },
    { id: 'M06.01-q3', text: 'Algoritmning ommaviylik xossasi nimani anglatadi?', options: ['Faqat bir marta ishlatiladi', 'Turli ma\'lumotlar uchun mos', 'Tez bajariladi', 'Ko\'p joy egallaydi'], correctIndex: 1, explanation: 'Ommaviylik — algoritm bir turdagi turli boshlang\'ich ma\'lumotlar uchun ishlatilishi mumkin', type: 'Y2' },
  ]),

  'M06.02': t('M06.02', 'Algoritm turlari', [
    { type: 'definition', content: 'Algoritmlarning uchta asosiy konstruksiyasi mavjud: chiziqli, tarmoqlanuvchi va takrorlanuvchi (siklik).' },
    { type: 'text', content: 'Chiziqli algoritm — barcha amallar ketma-ket, hech qanday shartsiz bajariladi.\nTarmoqlanuvchi algoritm — muayyan shartga qarab, ikki yoki undan ortiq tarmoqdan biri tanlanadi.\nTakrorlanuvchi algoritm — bir qism amallar bir necha marta takrorlanadi.' },
    { type: 'table', content: '| Algoritm turi | Tavsif | Misol |\n|-------------|--------|-------|\n| Chiziqli | Amallar ketma-ket | Kvadrat yuzini hisoblash |\n| Tarmoqlanuvchi | Shartga qarab tanlash | Ikkita sondan kattasini topish |\n| Takrorlanuvchi | Bir qism takrorlanadi | 1 dan 10 gacha sonlar yig\'indisi |\n| Aralash | Kombinatsiyalashgan | Murakkab masalalar |' },
    { type: 'example', content: 'Chiziqli: Non tayyorlash — 1) nonni kes, 2) sariyog\' surt, 3) pishloq qo\'y\nTarmoqlanuvchi: Agar yomg\'ir yog\'sa → soyabon ol, aks holda → soyabon olma\nTakrorlanuvchi: 5 marta "Salom" yoz' },
    { type: 'note', content: '📋 Algoritm turlari dasturlashda uchta asosiy konstruksiya sifatida ishlatiladi. Har qanday murakkab algoritm shu uch tur kombinatsiyasidan tashkil topadi.' },
  ], [
    { id: 'M06.02-q1', text: 'Qaysi algoritmda amallar hech qanday shartsiz ketma-ket bajariladi?', options: ['Tarmoqlanuvchi', 'Chiziqli', 'Takrorlanuvchi', 'Aralash'], correctIndex: 1, explanation: 'Chiziqli algoritmda barcha amallar ketma-ketlikda bajariladi', type: 'Y1' },
    { id: 'M06.02-q2', text: 'Ikkita sondan kattasini topish qaysi algoritm turiga kiradi?', options: ['Chiziqli', 'Tarmoqlanuvchi', 'Takrorlanuvchi', 'Aralash'], correctIndex: 1, explanation: 'Shart tekshirish (A>B?) natijasiga qarab yo\'nalish tanlanadi', type: 'Y1' },
    { id: 'M06.02-q3', text: '1 dan N gacha sonlar yig\'indisini hisoblash algoritmi qaysi turga kiradi?', options: ['Chiziqli', 'Tarmoqlanuvchi', 'Takrorlanuvchi', 'Hech biri'], correctIndex: 2, explanation: 'Qo\'shish amali N marta takrorlanadi — takrorlanuvchi algoritm', type: 'Y2' },
  ]),

  'M06.03': t('M06.03', 'Algoritmni blok-sxema va psevdokodda tasvirlash', [
    { type: 'definition', content: 'Blok-sxema — algoritmni geometrik figuralar (bloklar) orqali grafik tasvirlash usuli. Psevdokod — algoritmni dastur tiliga o\'xshash, lekin til qoidalariga qat\'iy rioya qilmaydigan yozuv.' },
    { type: 'table', content: '| Figuram | Vazifasi |\n|---------|---------|\n| Oval | Boshlash va tugatish |\n| Parallelogramm | Ma\'lumot kiritish/chiqarish |\n| Romb | Shart tekshirish |\n| To\'g\'ri to\'rtburchak | Amal bajarish |\n| O\'q chiziqlar | Ketma-ketlik yo\'nalishi |' },
    { type: 'example', content: 'Blok-sxema: Ikkita sondan kattasini topish\nBoshlash (oval) → A,B kiritish (paral.) → A>B? (romb) → ha: A ni chiqar, yo\'q: B ni chiqar → Tugatish' },
    { type: 'code', content: '# Psevdokod: Ikkita sondan kattasini topish\nALGORITM: KattaSon\n  KIRITISH: A, B\n  AGAR A > B\n    CHIQARISH: A\n  AKS HOLDA\n    CHIQARISH: B\n  TUGATISH\n', language: 'text' },
    { type: 'note', content: '💡 Psevdokod dasturlash tiliga bog\'liq emas. Unda shartli operatorlar (AGAR...AKS HOLDA), sikllar (TAKRORLA...) va kiritish/chiqarish amallari ishlatiladi.' },
  ], [
    { id: 'M06.03-q1', text: 'Blok-sxemada shart tekshirish qaysi figura bilan tasvirlanadi?', options: ['Oval', 'Parallelogramm', 'Romb', 'To\'g\'ri to\'rtburchak'], correctIndex: 2, explanation: 'Romb — shart tekshirish bloki', type: 'Y1' },
    { id: 'M06.03-q2', text: 'Blok-sxemada ma\'lumot kiritish/chiqarish qaysi figura bilan tasvirlanadi?', options: ['Oval', 'Parallelogramm', 'Romb', 'To\'g\'ri to\'rtburchak'], correctIndex: 1, explanation: 'Parallelogramm — kiritish/chiqarish bloki', type: 'Y1' },
    { id: 'M06.03-q3', text: 'Psevdokodning dastur kodidan farqi?', options: ['Hech qanday', 'Til qoidalariga qat\'iy rioya qilmaydi', 'Faqat ingliz tilida', 'Bajarilmaydi'], correctIndex: 1, explanation: 'Psevdokod dasturlash tilining sintaksis qoidalariga qat\'iy rioya qilmaydi, algoritmni tushunarli ifodalash uchun xizmat qiladi', type: 'Y2' },
  ]),

  'M06.04': t('M06.04', 'Algoritmni tekshirish, tahlil qilish va eng maqbulini tanlash', [
    { type: 'definition', content: 'Algoritmni tekshirish va tahlil qilish — uning to\'g\'riligi, samaradorligi va optimalligini baholash jarayoni. Eng maqbul algoritm — kam vaqt va xotira sarflab natija beradigan algoritm.' },
    { type: 'text', content: 'Algoritm samaradorligi mezonlari:\n- Vaqt murakkabligi (qancha tez bajariladi)\n- Xotira murakkabligi (qancha joy egallaydi)\n- Resurs sarfi (energiya, tarmoq trafigi)\nAlgoritmlarni taqqoslashda O-notatsiyasi (Big O) ishlatiladi: O(1) — doimiy, O(n) — chiziqli, O(n²) — kvadratik.' },
    { type: 'table', content: '| Murakkablik | Belgilanishi | Misol |\n|-------------|-------------|-------|\n| Doimiy | O(1) | Massiv elementiga murojaat |\n| Chiziqli | O(n) | Bir martalik sikl |\n| Kvadratik | O(n²) | Ichma-ich sikllar |\n| Logarifmik | O(log n) | Ikkilik qidiruv |' },
    { type: 'example', content: '1000 ta sonni saralash:\n- Buble sort: O(n²) = 1 000 000 taqqoslash\n- Quick sort: O(n log n) ≈ 10 000 taqqoslash\nTezkor saralash (Quick Sort) katta hajmlarda ancha samarali.' },
    { type: 'note', content: '⏱ Dastur ishlash vaqtini hisoblash: `time` moduli yoki `datetime` yordamida. Algoritm tanlashda ma\'lumotlar hajmi va cheklovlarini hisobga olish muhim.' },
  ], [
    { id: 'M06.04-q1', text: 'O(1) qanday murakkablikni anglatadi?', options: ['Chiziqli', 'Kvadratik', 'Doimiy', 'Logarifmik'], correctIndex: 2, explanation: 'O(1) — doimiy murakkablik, ma\'lumotlar hajmiga bog\'liq emas', type: 'Y1' },
    { id: 'M06.04-q2', text: 'Bitta sikl operatori qanday murakkablikka ega?', options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], correctIndex: 1, explanation: 'Bitta sikl n marta takrorlanadi — O(n) chiziqli murakkablik', type: 'Y1' },
    { id: 'M06.04-q3', text: 'Algoritmning eng maqbulligi qanday mezonlar bilan aniqlanadi?', options: ['Faqat tezlik', 'Faqat xotira', 'Vaqt, xotira va resurs sarfi', 'Faqat kod uzunligi'], correctIndex: 2, explanation: 'Eng maqbul algoritm vaqt, xotira va resurs sarfining optimal nisbati bilan aniqlanadi', type: 'Y2' },
  ]),

  // ===================== M07: SCRATCH VA LOGO =====================

  'M07.01': t('M07.01', 'Scratch muhiti, sprayt va koordinatalar', [
    { type: 'definition', content: 'Scratch — Massachusets universiteti professori Mitchel Resnick tomonidan yaratilgan, LEGO konstruktori prinsipi asosida ishlab chiqilgan vizual dasturlash muhiti. Scratch inglizcha so\'z bo\'lib, "chiziq", "pero" ma\'nolarini anglatadi.' },
    { type: 'text', content: 'Scratch asosiy tushunchalari:\n- Sprayt (Sprite) — sahna ustida harakatlanuvchi grafik obyekt\n- Sahna (Stage) — spraytlar harakatlanadigan maydon (480×360 birlik)\n- Skript — bloklardan tuzilgan dastur\n- Kostyum (Costume) — spraytning tashqi ko\'rinishi\n- Bloklar paneli — buyruqlar guruhlangan bo\'lim' },
    { type: 'example', content: 'Scratch koordinatalar tizimi:\n- Markaz: x=0, y=0\n- Chap chekka: x=-240, o\'ng: x=240\n- Pastki: y=-180, yuqori: y=180\n- "go to x: 0 y: 0" — spraytni markazga olib boradi\n- "move 10 steps" — spraytni 10 birlik oldinga siljitadi' },
    { type: 'note', content: '🎨 Scratch interfeysi: bloklar palitrasi (chapda), skriptlar maydoni (markazda), sahna (yuqori o\'ngda), spraytlar paneli (pastki o\'ngda). 2 xil rejim: rastrli va vektorli grafik.' },
  ], [
    { id: 'M07.01-q1', text: 'Scratch dasturlash muhitidagi grafik obyekt nima deb ataladi?', options: ['Sahna', 'Sprayt', 'Kostyum', 'Blok'], correctIndex: 1, explanation: 'Sprayt (Sprite) — sahna ustida harakatlanuvchi grafik obyekt', type: 'Y1' },
    { id: 'M07.01-q2', text: 'Scratch sahnasining o\'lchami necha birlik?', options: ['320×240', '480×360', '640×480', '800×600'], correctIndex: 1, explanation: 'Scratch sahnasi 480 birlik eni va 360 birlik bo\'yi', type: 'Y1' },
    { id: 'M07.01-q3', text: 'Scratch sahnasida spraytning boshlang\'ich koordinatasi?', options: ['x=240, y=180', 'x=0, y=0', 'x=-240, y=-180', 'x=100, y=100'], correctIndex: 1, explanation: 'Sprayt dastur ishga tushganda sahna markazida (x=0, y=0) joylashadi', type: 'Y2' },
  ]),

  'M07.02': t('M07.02', 'Scratch bloklari va hodisalar', [
    { type: 'definition', content: 'Scratch bloklari — ranglar bo\'yicha guruhlangan buyruqlar. Har bir blok ma\'lum bir vazifani bajaradi. Bloklar bir-biriga LEGO kabi ulanish orqali skript (dastur) hosil qiladi.' },
    { type: 'table', content: '| Bo\'lim | Rangi | Vazifasi |\n|--------|-------|---------|\n| Motion | To\'q ko\'k | Harakat bloklari |\n| Looks | Binafsha | Tashqi ko\'rinish |\n| Sound | Pushti | Ovoz |\n| Events | Sariq | Hodisalar |\n| Control | To\'q sariq | Shart va sikllar |\n| Sensing | Moviy | Sensor bloklari |\n| Operators | Yashil | Matematik va mantiqiy |\n| Variables | To\'q sariq | O\'zgaruvchilar |' },
    { type: 'text', content: 'Hodisalar (Events) — dasturning bajarilishini boshlaydi. "when flag clicked" — yashil bayroq bosilganda ishga tushadi. "when key pressed" — tugma bosilganda ishlaydi. "when sprite clicked" — sprayt bosilganda ishlaydi.' },
    { type: 'example', content: 'Misol: Mushuk harakati\nwhen flag clicked\nforever\n  move 10 steps\n  if on edge, bounce' },
    { type: 'note', content: '🔹 Skriptlar spraytga biriktiriladi. Har bir sprayt o\'zining skriptlariga ega bo\'ladi. Bloklar faqat mantiqiy ketma-ketlikda ulanishi mumkin.' },
  ], [
    { id: 'M07.02-q1', text: 'Scratchda dasturni boshlash uchun qaysi hodisa bloki ishlatiladi?', options: ['when key pressed', 'when flag clicked', 'when sprite clicked', 'when backdrop switches'], correctIndex: 1, explanation: '"when flag clicked" — yashil bayroqcha bosilganda dastur ishga tushadi', type: 'Y1' },
    { id: 'M07.02-q2', text: 'Motion bo\'limi bloklari qanday rangda?', options: ['Sariq', 'To\'q ko\'k', 'Yashil', 'Binafsha'], correctIndex: 1, explanation: 'Motion (harakat) bloklari to\'q ko\'k rangda', type: 'Y1' },
    { id: 'M07.02-q3', text: 'Scratchda nechta asosiy blok bo\'limi mavjud?', options: ['6', '7', '8', '9'], correctIndex: 2, explanation: '8 ta asosiy bo\'lim: Motion, Looks, Sound, Events, Control, Sensing, Operators, Variables', type: 'Y2' },
  ]),

  'M07.03': t('M07.03', 'Scratch o\'zgaruvchi va ro\'yxatlari', [
    { type: 'definition', content: 'O\'zgaruvchi — dastur bajarilishi jarayonida o\'z qiymatini o\'zgartira oladigan kattalik. Scratchda "Variables" bo\'limida o\'zgaruvchilar yaratiladi va boshqariladi.' },
    { type: 'text', content: 'O\'zgaruvchi yaratish uchun "Make a Variable" tugmasi bosiladi. O\'zgaruvchi nomi va turi tanlanadi: "For all sprites" (barcha spraytlar uchun) yoki "For this sprite only" (faqat shu sprayt uchun).' },
    { type: 'table', content: '| Blok | Vazifasi |\n|------|---------|\n| set [variable] to [value] | O\'zgaruvchi qiymatini belgilash |\n| change [variable] by [num] | O\'zgaruvchi qiymatini o\'zgartirish |\n| show variable [var] | O\'zgaruvchini ko\'rsatish |\n| hide variable [var] | O\'zgaruvchini yashirish |\n| add [item] to [list] | Ro\'yxatga element qo\'shish |\n| delete [i] of [list] | Elementni o\'chirish |' },
    { type: 'example', content: 'Misol: Kvadrat yuzini hisoblash\nwhen flag clicked\nask "Kvadrat tomonini kiriting" and wait\nset [tomon] to (answer)\nset [yuza] to (tomon * tomon)\nsay (yuza)' },
    { type: 'note', content: '📊 Ro\'yxat (List) — bir necha qiymatni saqlash uchun. "add", "delete", "insert", "replace" bloklari mavjud. Ro\'yxat indekslari 1 dan boshlanadi.' },
  ], [
    { id: 'M07.03-q1', text: 'Scratchda o\'zgaruvchi yaratish uchun qaysi tugma bosiladi?', options: ['Make a List', 'Make a Variable', 'New Block', 'Add Extension'], correctIndex: 1, explanation: '"Make a Variable" — o\'zgaruvchi yaratish tugmasi', type: 'Y1' },
    { id: 'M07.03-q2', text: 'Scratchda o\'zgaruvchining qiymatini o\'zgartirish uchun qaysi blok ishlatiladi?', options: ['set [var] to [val]', 'change [var] by [num]', 'show variable [var]', 'add [val] to [var]'], correctIndex: 1, explanation: '"change [var] by [num]" — musbat yoki manfiy songa o\'zgartirish', type: 'Y1' },
    { id: 'M07.03-q3', text: 'Scratch ro\'yxatida indeks nechadan boshlanadi?', options: ['0', '1', '-1', 'Indeks yo\'q'], correctIndex: 1, explanation: 'Scratch ro\'yxatida element indekslari 1 dan boshlanadi', type: 'Y2' },
  ]),

  'M07.04': t('M07.04', 'Scratch shart va sikllari', [
    { type: 'definition', content: 'Shartli bloklar — muayyan shartga qarab turli amallarni bajarish imkonini beradi. Sikllar — bir qism amallarni bir necha marta takrorlaydi. Ikkalasi "Control" bo\'limida joylashgan.' },
    { type: 'table', content: '| Blok | Vazifasi |\n|------|---------|\n| if...then | Shart bajarilsa, ichidagi amallarni bajarish |\n| if...then...else | Ikki tarmoqli shart |\n| wait until | Shart bajarilguncha kutish |\n| repeat [N] | N marta takrorlash |\n| forever | Cheksiz takrorlash |\n| repeat until | Shart bajarilguncha takrorlash |' },
    { type: 'text', content: 'Tarmoqlanuvchi konstruksiyalar: if..then (to\'liqsiz shart) va if..then..else (to\'liq shart). Takrorlanuvchi konstruksiyalar: repeat (ma\'lum martali), forever (cheksiz), repeat until (shartli).' },
    { type: 'example', content: 'Shartli: if (A > B) then say "A katta" else if (A < B) then say "B katta" else say "A va B teng"\nSiklli: repeat 10 (move 10 steps, wait 1 sec)\nMantiqiy: (15 * 2 = 36) → yolg\'on, (16 + 3 < 25) → rost' },
    { type: 'note', content: '🔄 "wait until" bloki dasturni shart bajarilguncha to\'xtatib turadi. "forever" bloki to\'xtovsiz takrorlaydi, odatda o\'yinlarda ishlatiladi.' },
  ], [
    { id: 'M07.04-q1', text: 'Scratchda "repeat 10" bloki necha marta takrorlanadi?', options: ['9', '10', '11', 'Cheksiz'], correctIndex: 1, explanation: '"repeat 10" — 10 marta takrorlash', type: 'Y1' },
    { id: 'M07.04-q2', text: 'Qaysi blok shart bajarilmaguncha takrorlaydi?', options: ['repeat', 'forever', 'repeat until', 'if then'], correctIndex: 2, explanation: '"repeat until" shart bajarilguncha takrorlaydi', type: 'Y1' },
    { id: 'M07.04-q3', text: 'Scratchda mantiqiy amal bloklari qaysi bo\'limda joylashgan?', options: ['Control', 'Sensing', 'Operators', 'Variables'], correctIndex: 2, explanation: 'Mantiqiy amallar (<, >, =, and, or, not) "Operators" bo\'limida joylashgan', type: 'Y2' },
  ]),

  'M07.05': t('M07.05', 'Scratch Pen, shakl va animatsiya', [
    { type: 'definition', content: 'Pen (Pero) — Scratchning maxsus kengaytmasi bo\'lib, sprayt ortidan chiziq chizish imkonini beradi. Pen bloklari yordamida turli shakllar, animatsiyalar va o\'yinlar yaratiladi.' },
    { type: 'table', content: '| Blok | Vazifasi |\n|------|---------|\n| pen down | Qalamni tushirish (chizishni boshlash) |\n| pen up | Qalamni ko\'tarish (chizishni to\'xtatish) |\n| set pen color to [color] | Qalam rangini o\'zgartirish |\n| change pen size by [num] | Qalam qalinligini o\'zgartirish |\n| stamp | Sprayt tasvirini sahna bo\'ylab bosish |\n| erase all | Barcha chizilganlarni o\'chirish |' },
    { type: 'example', content: 'Kvadrat chizish (Pen bilan):\nwhen flag clicked\npen down\nrepeat 4 (move 100 steps, turn right 90 degrees)\npen up\n\nAylana: repeat 360 (move 1 step, turn right 1 degree)' },
    { type: 'text', content: 'Animatsiya yaratish: sprayt kostyumlarini almashtirish, x va y koordinatalarni o\'zgartirish, rang effektlari, aylanish. "next costume", "switch costume to", "change size by", "set rotation style" bloklari ishlatiladi.' },
    { type: 'note', content: '🎬 Scratch dasturida animatsiya, multfilm va kompyuter o\'yinlarini yaratish mumkin. Spraytlarga turli kostyumlar berish orqali harakat illyuziyasi hosil qilinadi.' },
  ], [
    { id: 'M07.05-q1', text: 'Pen blokida chizishni boshlash uchun qaysi blok ishlatiladi?', options: ['pen up', 'pen down', 'stamp', 'erase all'], correctIndex: 1, explanation: '"pen down" — qalamni tushirish, chizishni boshlash', type: 'Y1' },
    { id: 'M07.05-q2', text: 'Kvadrat chizish uchun repeat blokida nechta takrorlash kerak?', options: ['2', '3', '4', '5'], correctIndex: 2, explanation: 'Kvadrat 4 tomondan iborat, shuning uchun repeat 4', type: 'Y1' },
    { id: 'M07.05-q3', text: 'Spraytning tashqi ko\'rinishini almashtirish uchun qaysi bo\'lim bloklari ishlatiladi?', options: ['Motion', 'Looks', 'Events', 'Pen'], correctIndex: 1, explanation: 'Looks (tashqi ko\'rinish) bo\'limida kostyum almashtirish, rang, o\'lcham bloklari joylashgan', type: 'Y2' },
  ]),

  'M07.06': t('M07.06', 'LOGO va Toshbaqa grafikasi', [
    { type: 'definition', content: 'LOGO — dasturlash tilidir. Toshbaqa grafikasi (Turtle Graphics) — LOGO tilining asosiy elementi bo\'lib, kompyuter boshqaruviga misol bo\'ladi. Toshbaqa ekranda buyruqlar asosida harakatlanadi va chizadi.' },
    { type: 'table', content: '| Buyruq | Qisqartma | Vazifasi |\n|--------|----------|---------|\n| FORWARD N | FD N | Oldinga N birlik yurish |\n| BACK N | BK N | Orqaga N birlik yurish |\n| LEFT D | LT D | Chapga D gradus burilish |\n| RIGHT D | RT D | O\'ngga D gradus burilish |\n| PENUP | PU | Qalamni ko\'tarish |\n| PENDOWN | PD | Qalamni tushirish |\n| REPEAT N [cmd] | REPEAT | Buyruqni N marta takrorlash |' },
    { type: 'example', content: 'Kvadrat chizish (LOGO):\nREPEAT 4 [FORWARD 4 RIGHT 90]\n\nTeng tomonli uchburchak:\nREPEAT 3 [FORWARD 5 RIGHT 120]\n\nAylana: REPEAT 360 [FORWARD 1 RIGHT 1]' },
    { type: 'text', content: 'LOGO buyruqlari ikki qismdan iborat: birinchisi — nom, ikkinchisi — miqdor (qancha bajarish kerak). Masalan, FORWARD 5 — toshbaqa oldinga 5 birlik harakatlanadi.' },
    { type: 'note', content: '🐢 Toshbaqa holati uning qarab turgan tomoni bilan ko\'rsatiladi (uchburchak uchi). REPEAT buyrug\'i imtihon uchun zarur bo\'lgan eng muhim buyruqlardan biri.' },
  ], [
    { id: 'M07.06-q1', text: 'LOGO tilida toshbaqani oldinga yurgizish buyrug\'i?', options: ['BACK', 'FORWARD', 'LEFT', 'RIGHT'], correctIndex: 1, explanation: 'FORWARD (FD) — oldinga harakatlanish', type: 'Y1' },
    { id: 'M07.06-q2', text: 'LOGOda kvadratchizish buyrug\'i?', options: ['REPEAT 4 [FORWARD 5 RIGHT 90]', 'REPEAT 3 [FORWARD 5 RIGHT 120]', 'REPEAT 5 [FORWARD 4 RIGHT 72]', 'REPEAT 6 [FORWARD 3 RIGHT 60]'], correctIndex: 0, explanation: 'Kvadrat 4 tomon, har bir 90° burilish', type: 'Y1' },
    { id: 'M07.06-q3', text: 'LOGOda qalamni ko\'tarish buyrug\'i?', options: ['PENDOWN', 'PENUP', 'FORWARD', 'BACK'], correctIndex: 1, explanation: 'PENUP (PU) — qalamni ko\'tarish, chizmay harakatlanish', type: 'Y1' },
  ]),

  // ===================== M08: PYTHON VA JAVASCRIPT =====================

  'M08.01': t('M08.01', 'Dastur va dasturlash tillari', [
    { type: 'definition', content: 'Dastur — kompyuterda ma\'lum bir masalani yechish uchun yozilgan buyruqlar ketma-ketligi. Dasturlash tili — dastur yozish uchun mo\'ljallangan belgilar, qoidalar va sintaksis tizimi.' },
    { type: 'text', content: 'Dasturlash tillari darajasi bo\'yicha:\n- Past darajali: Assembler (mashina kodiga yaqin)\n- Yuqori darajali: Python, Java, C++, JavaScript (inson tiliga yaqin)\nDasturlash tillari paradigmasi bo\'yicha: protsedural, obyektga yo\'naltirilgan (OOP), funksional.' },
    { type: 'table', content: '| Til | Daraja | Paradigma | Qo\'llanish sohasi |\n|-----|--------|-----------|-----------------|\n| Python | Yuqori | Protsedural/OOP | Sun\'iy intellekt, tahlil |\n| JavaScript | Yuqori | Obyektga/Functional | Veb-ishlanmalar |\n| C++ | O\'rta | OOP/Tizimli | O\'yinlar, tizim dasturlari |\n| Java | Yuqori | OOP | Korxona dasturlari |' },
    { type: 'note', content: '💻 Dasturlash tili sintaksisi — til qoidalari (gap tuzilishi). Semantika — buyruqlarning ma\'nosi va bajarilish tartibi.' },
  ], [
    { id: 'M08.01-q1', text: 'Yuqori darajali dasturlash tiliga misol?', options: ['Assembler', 'Mashina kodi', 'Python', 'Binary'], correctIndex: 2, explanation: 'Python — yuqori darajali dasturlash tili', type: 'Y1' },
    { id: 'M08.01-q2', text: 'Dasturlash tilining qoidalar to\'plami nima deb ataladi?', options: ['Semantika', 'Sintaksis', 'Paradigma', 'Algoritm'], correctIndex: 1, explanation: 'Sintaksis — dasturlash tilining yozilish qoidalari', type: 'Y1' },
    { id: 'M08.01-q3', text: 'OOP qanday dasturlash paradigmasi?', options: ['Funksional', 'Obyektga yo\'naltirilgan', 'Protsedural', 'Mantiqiy'], correctIndex: 1, explanation: 'OOP (Object-Oriented Programming) — obyektga yo\'naltirilgan dasturlash paradigmasining qisqartmasi', type: 'Y2' },
  ]),

  'M08.02': t('M08.02', 'Python sintaksisi va muhiti', [
    { type: 'definition', content: 'Python — Gvido van Rossum tomonidan 1991-yilda yaratilgan, sodda va o\'qishga oson sintaksisga ega bo\'lgan yuqori darajali dasturlash tili.' },
    { type: 'text', content: 'Python xususiyatlari: interpretator til (birdan-bir bajariladi), dinamik tiplash (o\'zgaruvchi turi avtomatik aniqlanadi), indentatsiya (joy tashlash) bloklarni ajratish uchun ishlatiladi.' },
    { type: 'code', content: '# Birinchi dastur\nprint("Salom, dunyo!")\n\n# Arifmetik amallar\nprint(2 + 3)   # 5\nprint(10 // 3)  # 3 (butun bo\'lish)\nprint(10 % 3)   # 1 (qoldiq)\nprint(2 ** 3)   # 8 (daraja)\n\n# Ma\'lumot kiritish\nname = input("Ismingiz: ")\nprint("Salom,", name)', language: 'python' },
    { type: 'note', content: '🐍 Python nomi Monty Python komediya guruhidan olingan. Kod bloklari {} emas, balki indentatsiya (4 bo\'sh joy) bilan ajratiladi.' },
  ], [
    { id: 'M08.02-q1', text: 'Python dasturlash tili kim tomonidan yaratilgan?', options: ['Dennis Ritchie', 'Gvido van Rossum', 'Brendan Eich', 'James Gosling'], correctIndex: 1, explanation: 'Gvido van Rossum — Python yaratuvchisi (1991)', type: 'Y1' },
    { id: 'M08.02-q2', text: 'Python\'da kod bloklari qanday ajratiladi?', options: ['{}', 'Indentatsiya', 'begin/end', 'Qavslar'], correctIndex: 1, explanation: 'Python bloklarni indentatsiya (joy tashlash) bilan ajratadi', type: 'Y1' },
    { id: 'M08.02-q3', text: 'Python\'da 10 // 3 natijasi?', options: ['3.33', '3', '1', '10'], correctIndex: 1, explanation: '// — butun bo\'lish, 10 // 3 = 3', type: 'Y1' },
  ]),

  'M08.03': t('M08.03', 'Python o\'zgaruvchilari va ma\'lumot turlari', [
    { type: 'definition', content: 'O\'zgaruvchi — ma\'lumotlarni saqlash uchun xotira maydoni. Python dinamik tiplashga ega — o\'zgaruvchi turi unga qiymat berilganda avtomatik aniqlanadi.' },
    { type: 'table', content: '| Ma\'lumot turi | Misol | Izoh |\n|--------------|-------|------|\n| int | 5, -3, 100 | Butun sonlar |\n| float | 3.14, -0.5 | Haqiqiy sonlar |\n| str | "Salom", \'A\' | Matn (satr) |\n| bool | True, False | Mantiqiy qiymat |\n| NoneType | None | Qiymat yo\'qligi |' },
    { type: 'code', content: '# O\'zgaruvchilar\nism = "Ali"\nyosh = 15\nball = 85.5\n\n# Turini aniqlash\nprint(type(ism))   # <class \'str\'>\nprint(type(yosh))  # <class \'int\'>\nprint(type(ball))  # <class \'float\'>\n\n# Turini o\'zgartirish\nprint(int(3.14))    # 3\nprint(float(5))     # 5.0\nprint(str(42))      # "42"', language: 'python' },
    { type: 'note', content: '🔤 O\'zgaruvchi nomi harf yoki _ bilan boshlanadi, raqam bilan boshlanmaydi. Katta-kichik harflar farqlanadi (yosh va Yosh — har xil).' },
  ], [
    { id: 'M08.03-q1', text: 'Python\'da matn ma\'lumot turi qaysi?', options: ['int', 'str', 'float', 'list'], correctIndex: 1, explanation: 'str (string) — matn ma\'lumot turi', type: 'Y1' },
    { id: 'M08.03-q2', text: 'type(3.14) natijasi nima?', options: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'bool\'>'], correctIndex: 1, explanation: '3.14 — float (haqiqiy son)', type: 'Y1' },
    { id: 'M08.03-q3', text: 'Quyidagilardan qaysi biri to\'g\'ri o\'zgaruvchi nomi?', options: ['2nd', 'my-var', '_value', 'class'], correctIndex: 2, explanation: '_value bilan _ boshlangan — to\'g\'ri. Qolganlari: raqam bilan boshlangan, tireli yoki kalit so\'z', type: 'Y2' },
  ]),

  'M08.04': t('M08.04', 'JavaScript sintaksisi: o‘zgaruvchilar, chiqarish va operatorlar', [
    { type: 'definition', content: 'JavaScript — veb-sahifaga interfaollik qo‘shishda ishlatiladigan dasturlash tili. HTML ichidagi <script> elementi JavaScript kodini joylashtiradi; tashqi skriptni src atributi bilan bog‘lash mumkin.' },
    { type: 'text', content: 'O‘zgaruvchini var, let yoki const orqali e’lon qilish mumkin. Darslikda var misollari ko‘p; zamonaviy kodda let o‘zgaruvchi, const qayta tayinlanmaydigan bog‘lanish uchun ishlatiladi. = qiymat tayinlaydi, == qiymatlarni tur o‘zgartirish bilan solishtirishi mumkin, === esa turini ham taqqoslaydi.' },
    { type: 'table', content: '| Konstruksiya | Vazifasi | Misol |\n|---|---|---|\n| let a = 5 | O‘zgaruvchi e’lon qilish | a = 7 |\n| console.log(a) | Dasturchi konsoliga chiqarish | console.log(7) |\n| document.write(a) | Hujjatga yozish (darslik usuli) | document.write(7) |\n| a === b | Turini ham hisobga olgan tenglik | 5 === "5" → false |\n| a % b | Bo‘lishdan qoldiq | 11 % 5 → 1 |' },
    { type: 'code', content: 'let score = 5;\nscore = score + 3;\nconsole.log(score); // 8\nconsole.log(5 === "5"); // false\nconsole.log(11 % 5); // 1', language: 'javascript' },
    { type: 'note', content: '⚠️ Darslikning JavaScript bo‘limida ayrim bosma xatolar bor: % operatori bo‘linmaning butun qismi emas, qoldig‘ini beradi; to‘g‘ri qat’iy tengsizlik !== (emas !==== yoki !===). Yozilgan kodni brauzer yoki JS muhitida alohida tekshirish kerak.' },
    { type: 'source', content: 'Manba: Cambridge+ Informatika va axborot texnologiyalari 10/11-sinf, 19-bob «Veb uchun dasturlash», bosma 307–311-betlar (PDF taxminan 316–320).' },
  ], [
    { id: 'M08.04-js2021-q1', text: 'JavaScriptda console.log() va document.write() vazifalarining asosiy farqi qaysi?', options: ['Ikkalasi faqat HTML taglarini yopadi', 'console.log konsolga, document.write hujjatga yozadi', 'console.log faqat rasm saqlaydi, document.write audio ijro etadi', 'document.write faqat o‘zgaruvchi e’lon qiladi'], correctIndex: 1, explanation: 'console.log natijani ishlab chiquvchi konsolida, document.write esa HTML hujjatida chiqaradi.', type: 'Y1' },
    { id: 'M08.04-js2021-q2', text: 'let x = 5; x = x + 3; console.log(x); kodidagi yakuniy qiymat nechaga teng?', options: ['5', '3', '8', '53'], correctIndex: 2, explanation: 'Birinchi qiymat 5, keyingi tayinlashdan so‘ng 8; konsolga 8 chiqadi.', type: 'Y1' },
    { id: 'M08.04-js2021-q3', text: 'JavaScriptdagi 5 === "5" qat’iy tenglik ifodasi qanday natija qaytaradi?', options: ['false', 'true', '"55"', 'SyntaxError'], correctIndex: 0, explanation: 'Son 5 va matn "5" tur jihatidan farq qiladi; === qiymat va turni solishtiradi.', type: 'Y1' },
    { id: 'M08.04-js2021-q4', text: 'JavaScriptdagi 11 % 5 ifodasining qiymati nima bo‘ladi?', options: ['2', '2.2', '5', '1'], correctIndex: 3, explanation: '11 ni 5 ga bo‘lganda qoldiq 1. % — qoldiq operatori.', type: 'Y1' },
    { id: 'M08.04-js2021-q5', text: 'Kod: console.log(20 * 2); Brauzerning dasturchi vositalarida natija qayerda ko‘rinadi?', options: ['Faqat sahifaning <title> qismida', 'Dasturchi konsolida', 'Har doim ogohlantirish oynasida', 'Avtomatik HTML jadvalida'], correctIndex: 1, explanation: 'console.log hisoblash natijasini konsolga yozadi; sahifaga avtomatik qo‘shmaydi.', type: 'Y1' },
  ]),

  'M08.05': t('M08.05', 'JavaScript: shart, sikl, funksiyalar va massivlar', [
    { type: 'definition', content: 'Shartli if/else va switch turli holatlarda yo‘l tanlaydi; for, while va do…while kodni takrorlaydi. Funksiya parametrlar qabul qilib, return bilan natija qaytarishi mumkin; massiv indekslari 0 dan boshlanadi.' },
    { type: 'text', content: 'JavaScriptda if (shart) { ... } else { ... } yoziladi. for (let i=0; i<3; i++) siklida i qiymatlari 0, 1, 2 bo‘ladi. Massivning alohida elementiga [indeks] orqali murojaat qilinadi, push() oxiriga yangi element qo‘shadi.' },
    { type: 'table', content: '| Konstruksiya | Qachon qo‘llanadi |\n|---|---|\n| if / else | Shart rost yoki yolg‘on bo‘yicha tarmoqlanish |\n| for | Hisoblagich yoki ketma-ketlik bo‘yicha takrorlash |\n| while | Shart rostligicha takrorlash |\n| function / return | Qayta foydalaniladigan kod va natija |\n| arr[index] / arr.push(x) | Massiv elementini olish va oxiriga qo‘shish |' },
    { type: 'code', content: 'const colours = ["orange", "purple", "green"];\nconsole.log(colours[1]); // purple\ncolours.push("blue");\nconsole.log(colours.length); // 4\nfunction addNums(a, b) { return a + b; }\nconsole.log(addNums(2, 3)); // 5\nfor (let i = 0; i < 3; i++) { console.log(i); } // 0 1 2', language: 'javascript' },
    { type: 'note', content: '⚠️ Cambridge+ darsligidagi switch namunalarida case 4; kabi bosma sintaksis xatosi bor: to‘g‘risi case 4: shaklidir. while(check = true) esa tekshirish o‘rniga true tayinlab, cheksiz siklga olib kelishi mumkin; while(check === true) ishlating va sikl shartini yangilang.' },
    { type: 'source', content: 'Manba: Cambridge+ Informatika va axborot texnologiyalari 10/11-sinf, 19-bob, bosma 311–315-betlar (massiv, shart, for/while, funksiya).' },
  ], [
    { id: 'M08.05-js2021-q1', text: 'let x = 8; let message; if (x > 10) { message = "katta"; } else { message = "kichik"; } ifodasida message qanday bo‘ladi?', options: ['"katta"', '"kichik"', 'undefined', '"10"'], correctIndex: 1, explanation: '8 > 10 yolg‘on; else tarmog‘i bajarilib, message "kichik" bo‘ladi.', type: 'Y1' },
    { id: 'M08.05-js2021-q2', text: 'for (let i = 0; i < 3; i++) { console.log(i); } kodi qanday ketma-ketlik chiqaradi?', options: ['1, 2, 3', '0, 1, 2, 3', '0, 1, 2', '3, 2, 1'], correctIndex: 2, explanation: 'i avval 0, shart i<3; 0, 1, 2 chiqariladi, i=3 da sikl tugaydi.', type: 'Y1' },
    { id: 'M08.05-js2021-q3', text: 'const colours = ["orange", "purple", "green"]; colours[1] natijasi qaysi?', options: ['"orange"', '"green"', '"1"', '"purple"'], correctIndex: 3, explanation: 'JavaScriptda massiv indekslari 0 dan boshlanadi: indeks 1 — ikkinchi element.', type: 'Y1' },
    { id: 'M08.05-js2021-q4', text: 'const a = ["red", "blue"]; a.push("green"); a.length qiymati nechaga teng bo‘ladi?', options: ['3', '2', '1', '4'], correctIndex: 0, explanation: 'push massiv oxiriga bitta element qo‘shadi; uzunlik 2 dan 3 ga o‘tadi.', type: 'Y1' },
    { id: 'M08.05-js2021-q5', text: 'function addNums(a, b) { return a + b; } addNums(2, 3) qanday qiymat qaytaradi?', options: ['23', 'NaN', '5', 'undefined'], correctIndex: 2, explanation: 'Raqamli parametrlar 2 va 3 qo‘shiladi, return orqali 5 qaytariladi.', type: 'Y1' },
  ]),

  'M08.06': t('M08.06', 'Python sikllari', [
    { type: 'definition', content: 'Sikl — bir qism kodni bir necha marta takrorlash imkonini beruvchi konstruksiya. Python\'da for va while sikllari mavjud.' },
    { type: 'text', content: 'for sikl — ma\'lum ketma-ketlik bo\'ylab iteratsiya. while sikl — shart bajarilguncha takrorlash. break — siklni to\'xtatish. continue — joriy iteratsiyani o\'tkazib yuborish.' },
    { type: 'code', content: '# for sikl\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\nfor i in range(1, 11):\n    if i % 2 == 0:\n        print(f"{i} juft")\n\n# while sikl\nn = 1\nwhile n <= 5:\n    print(n)\n    n += 1\n\n# break va continue\nfor i in range(10):\n    if i == 3:\n        continue  # 3 ni o\'tkazib yubor\n    if i == 7:\n        break     # 7 da to\'xta\n    print(i)', language: 'python' },
    { type: 'example', content: 'Yig\'indi hisoblash:\nn = 5\nyigindi = 0\nfor i in range(1, n + 1):\n    yigindi += i\nprint(yigindi)  # 15\n\n# Ichma-ich sikllar\nfor i in range(3):\n    for j in range(3):\n        print(i, j)' },
    { type: 'note', content: '🔄 range(start, stop, step) — sikl parametrlari. Cheksiz sikl (while True) dan ehtiyot bo\'ling. for-else va while-else konstruksiyalari mavjud.' },
  ], [
    { id: 'M08.06-q1', text: 'range(5) qanday sonlarni hosil qiladi?', options: ['1,2,3,4,5', '0,1,2,3,4', '0,1,2,3,4,5', '1,2,3,4'], correctIndex: 1, explanation: 'range(5) → 0 dan 4 gacha', type: 'Y1' },
    { id: 'M08.06-q2', text: 'Siklni to\'xtatish uchun qaysi operator ishlatiladi?', options: ['continue', 'break', 'stop', 'exit'], correctIndex: 1, explanation: 'break — siklni darhol to\'xtatadi', type: 'Y1' },
    { id: 'M08.06-q3', text: 'Joriy iteratsiyani o\'tkazib yuborish uchun qaysi operator ishlatiladi?', options: ['break', 'continue', 'skip', 'pass'], correctIndex: 1, explanation: 'continue — joriy iteratsiyani to\'xtatib, keyingisiga o\'tadi', type: 'Y1' },
  ]),

  'M08.07': t('M08.07', 'Python funksiyalari va o\'zgaruvchi sohasi', [
    { type: 'definition', content: 'Funksiya — muayyan vazifani bajaruvchi, qayta ishlatiladigan kod bloki. def kalit so\'zi bilan yaratiladi. Funksiya argumentlar qabul qilishi va qiymat qaytarishi mumkin.' },
    { type: 'table', content: '| Tushuncha | Ta\'rif | Misol |\n|----------|--------|-------|\n| Funksiya | def yordamida yaratiladi | def salom(): |\n| Parametr | Funksiyaga uzatiladigan qiymat | def add(a, b): |\n| return | Qiymat qaytaradi | return a + b |\n| Lokal o\'zgaruvchi | Funksiya ichida | faqat funksiya ichida |\n| Global o\'zgaruvchi | Funksiya tashqarisida | hamma joyda |' },
    { type: 'code', content: '# Funksiya yaratish\ndef salom_ber(ism):\n    return f"Salom, {ism}!"\n\nprint(salom_ber("Ali"))  # Salom, Ali!\n\n# Default parametr\ndef kopaytirish(a, b=1):\n    return a * b\n\nprint(kopaytirish(5, 3))  # 15\nprint(kopaytirish(5))     # 5\n\n# Lokal va global o\'zgaruvchilar\nx = 10  # global\n\ndef funk():\n    global x\n    x = 20  # global qiymatni o\'zgartirish\n\n# Lambda funksiyasi\nkvadrat = lambda x: x ** 2\nprint(kvadrat(5))  # 25', language: 'python' },
    { type: 'note', content: '📦 Funksiyalar kodni qayta ishlatishni ta\'minlaydi. DRY (Don\'t Repeat Yourself) prinsipi: bir xil kodni takrorlamang.' },
  ], [
    { id: 'M08.07-q1', text: 'Python\'da funksiya yaratish uchun qaysi kalit so\'z ishlatiladi?', options: ['func', 'def', 'function', 'define'], correctIndex: 1, explanation: 'def — funksiya yaratish kalit so\'zi', type: 'Y1' },
    { id: 'M08.07-q2', text: 'Funksiyadan qiymat qaytarish uchun qaysi operator ishlatiladi?', options: ['print', 'return', 'yield', 'send'], correctIndex: 1, explanation: 'return — funksiyadan qiymat qaytaradi', type: 'Y1' },
    { id: 'M08.07-q3', text: 'Funksiya ichida global o\'zgaruvchini o\'zgartirish uchun nima kerak?', options: ['global', 'nonlocal', 'import', 'hech narsa'], correctIndex: 0, explanation: 'global kalit so\'zi funksiya ichida global o\'zgaruvchiga murojaat qilish uchun kerak', type: 'Y2' },
  ]),

  'M08.08': t('M08.08', 'Python ro\'yxat va massivlari', [
    { type: 'definition', content: 'Python\'da 4 ta asosiy kolleksiya turi bor: list (ro\'yxat), tuple (kortej), dict (lug\'at), set (to\'plam).' },
    { type: 'text', content: 'List — o\'zgartiriladigan, tartiblangan kolleksiya. Tuple — o\'zgartirilmaydigan, tezroq. Dict — kalit-qiymat juftliklari. Set — takrorlanmaydigan elementlar.' },
    { type: 'code', content: '# List\nnumbers = [1, 2, 3, 4, 5]\nnumbers.append(6)\nprint(numbers[0])    # 1\nprint(numbers[-1])   # 6\nprint(numbers[1:3])  # [2, 3]\nprint(numbers[::-1]) # [6, 5, 4, 3, 2, 1]\n\n# Tuple\npoint = (3, 4)\nx, y = point\n\n# Dict\nuser = {"name": "Ali", "age": 25}\nprint(user["name"])\nuser["city"] = "Toshkent"\n\n# Set\nunique = {1, 2, 3, 3, 2}\nprint(unique)  # {1, 2, 3}\n\n# List comprehension\nsquares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]', language: 'python' },
    { type: 'note', content: '💡 List [] bilan, tuple () bilan, dict {} bilan (kalit:qiymat), set {} bilan (faqat qiymat) yaratiladi.' },
  ], [
    { id: 'M08.08-q1', text: 'Pythonda \'tuple\' qanday xususiyatga ega?', options: ['O\'zgartiriladi', 'O\'zgartirilmaydi', 'Takrorlanuvchi elementlar saqlaydi', 'Kalit-qiymat saqlaydi'], correctIndex: 1, explanation: 'Tuple — o\'zgartirilmaydigan kolleksiya', type: 'Y1' },
    { id: 'M08.08-q2', text: 'my_list = [1, 2, 3, 4, 5] da my_list[::-1] nimani qaytaradi?', options: ['[1, 2, 3, 4, 5]', '[5, 4, 3, 2, 1]', 'Error', 'None'], correctIndex: 1, explanation: '[::-1] — ro\'yxatni teskari tartibda qaytaradi', type: 'Y2' },
    { id: 'M08.08-q3', text: 'my_set = {1, 2, 3, 3, 2} da len(my_set) necha?', options: ['5', '3', '2', '4'], correctIndex: 1, explanation: 'Set takrorlanmaydigan elementlarni saqlaydi, shuning uchun {1, 2, 3} → 3 ta', type: 'Y2' },
  ]),

  'M08.09': t('M08.09', 'Python kutubxona, fayl, GUI va OOP', [
    { type: 'definition', content: 'Kutubxona (module) — oldindan tayyorlangan funksiyalar to\'plami. Python\'da 200+ standart kutubxona mavjud. GUI (Graphical User Interface) — grafik foydalanuvchi interfeysi.' },
    { type: 'text', content: 'OOP (Obyektga yo\'naltirilgan dasturlash) — class va object tushunchalariga asoslangan paradigm. Asosiy tushunchalar: class (sinf), object (obyekt), inheritance (meros), encapsulation (inkapsulyatsiya), polymorphism (polimorfizm).' },
    { type: 'code', content: '# Kutubxona import qilish\nimport math\nprint(math.sqrt(16))     # 4.0\nprint(math.pi)           # 3.141592653589793\n\nfrom datetime import datetime\nprint(datetime.now())\n\nimport random\nprint(random.randint(1, 10))\n\n# Fayl bilan ishlash\nwith open("test.txt", "w") as f:\n    f.write("Salom, dunyo!")\n\nwith open("test.txt", "r") as f:\n    matn = f.read()\n    print(matn)\n\n# OOP: class\nclass Talaba:\n    def __init__(self, ism, yosh):\n        self.ism = ism\n        self.yosh = yosh\n    \n    def malumot(self):\n        return f"{self.ism}, {self.yosh} yosh"\n\nt = Talaba("Ali", 15)\nprint(t.malumot())', language: 'python' },
    { type: 'note', content: '📚 Python kutubxonalari: math, random, datetime, os, sys, json, turtle, tkinter (GUI), numpy, pandas, matplotlib (tashqi).' },
  ], [
    { id: 'M08.09-q1', text: 'Python\'da math.sqrt(16) qiymati?', options: ['4', '4.0', '16', '8'], correctIndex: 1, explanation: 'math.sqrt(16) = 4.0 (float qiymat)', type: 'Y1' },
    { id: 'M08.09-q2', text: 'OOPda class nima?', options: ['Funksiya', 'Obyekt namunasi', 'O\'zgaruvchi', 'Sikl'], correctIndex: 1, explanation: 'Class — obyektlarning namunasi (template)', type: 'Y1' },
    { id: 'M08.09-q3', text: 'Python\'da faylni avtomatik yopish uchun qaysi konstruksiya ishlatiladi?', options: ['open-close', 'with open', 'file.open', 'try-finally'], correctIndex: 1, explanation: '"with open" kontekst menejeri faylni avtomatik yopadi', type: 'Y2' },
  ]),

  'M08.10': t('M08.10', 'Python va sun\'iy intellekt', [
    { type: 'definition', content: 'Sun\'iy intellekt (SI) — kompyuter tizimlarining inson aqlini talab qiladigan vazifalarni bajarish qobiliyati. Python SI sohasida eng mashhur til hisoblanadi.' },
    { type: 'table', content: '| Kutubxona | Vazifasi |\n|----------|---------|\n| NumPy | Sonli hisoblashlar, massivlar |\n| Pandas | Ma\'lumotlarni tahlil qilish |\n| Matplotlib | Ma\'lumotlarni vizuallashtirish |\n| Scikit-learn | Mashinaviy o\'qitish |\n| TensorFlow / PyTorch | Chuqur o\'qitish (Deep Learning) |\n| NLTK | Tabiiy tilni qayta ishlash |' },
    { type: 'text', content: 'SI yo\'nalishlari: Mashinaviy o\'qitish (ML), Chuqur o\'qitish (DL), Tabiiy tilni qayta ishlash (NLP), Kompyuter ko\'rishi (CV). ANI (Weak AI) — hozirgi kunda mavjud bo\'lgan yagona SI turi.' },
    { type: 'code', content: '# Oddiy ML misol (Scikit-learn)\nfrom sklearn import tree\n\n# Ma\'lumotlar\nX = [[0, 0], [1, 1], [0, 1], [1, 0]]\nY = [0, 1, 1, 1]  # OR\n\n# Model yaratish va o\'qitish\nmodel = tree.DecisionTreeClassifier()\nmodel.fit(X, Y)\n\n# Bashorat\nprint(model.predict([[0, 0]]))  # [0]\nprint(model.predict([[1, 0]]))  # [1]', language: 'python' },
    { type: 'note', content: '🤖 ANI — Artificial Narrow Intelligence (tor SI). AGI — Artificial General Intelligence (inson darajasi), ASI — Artificial Super Intelligence (insonni ortda qoldiradi). AGI va ASI hali mavjud emas.' },
  ], [
    { id: 'M08.10-q1', text: 'Python\'da mashinaviy o\'qitish uchun qaysi kutubxona ishlatiladi?', options: ['NumPy', 'Scikit-learn', 'Matplotlib', 'Flask'], correctIndex: 1, explanation: 'Scikit-learn — mashinaviy o\'qitish kutubxonasi', type: 'Y1' },
    { id: 'M08.10-q2', text: 'Hozirgi kunda mavjud bo\'lgan SI turi?', options: ['AGI', 'ASI', 'ANI', 'Barchasi'], correctIndex: 2, explanation: 'ANI (Weak AI) — tor vazifalarni bajaradigan SI, AGI va ASI hali mavjud emas', type: 'Y1' },
    { id: 'M08.10-q3', text: 'Pandas kutubxonasining vazifasi?', options: ['Grafik chizish', 'Ma\'lumotlarni tahlil qilish', 'Veb-server', 'O\'yin yaratish'], correctIndex: 1, explanation: 'Pandas — ma\'lumotlarni tahlil qilish va qayta ishlash kutubxonasi', type: 'Y1' },
  ]),

  'M08.11': t('M08.11', 'JavaScript sintaksisi va ma\'lumotlari', [
    { type: 'definition', content: 'JavaScript — Brendan Eich tomonidan 1995-yilda yaratilgan, veb-sahifalarni interaktiv qilish uchun mo\'ljallangan yuqori darajali dasturlash tili. ECMAScript standarti asosida rivojlanadi.' },
    { type: 'text', content: 'JavaScript xususiyatlari: interpretator til, dinamik tiplash, birinchi darajali funksiyalar, prototipga asoslangan OOP. Veb-brauzerlarda ishlaydi, Node.js orqali serverda ham ishlatiladi.' },
    { type: 'code', content: '// O\'zgaruvchilar\nlet ism = "Ali"\nconst yosh = 15\nvar eski = "ES5 usuli"\n\n// Ma\'lumot turlari\nlet son = 42             // number\nlet matn = "Salom"       // string\nlet rost = true           // boolean\nlet arr = [1, 2, 3]      // object (array)\nlet obj = {a: 1, b: 2}   // object\n\n// console ga chiqarish\nconsole.log("Salom, dunyo!")\n\n// String metodlari\nconsole.log("hello".toUpperCase())  // HELLO\nconsole.log("hello".length)         // 5\nconsole.log("hello".slice(1, 4))    // ell\n\n// Number\nconsole.log(10 + 5)        // 15\nconsole.log(10 / 3)        // 3.333...\nconsole.log(10 % 3)        // 1\nconsole.log(2 ** 3)        // 8 (ES7)', language: 'javascript' },
    { type: 'note', content: '🌐 JavaScript vebning asosiy tilidir. HTML va CSS bilan birga ishlatiladi. let — o\'zgaruvchi, const — o\'zgarmas qiymat, var — eski usul.' },
  ], [
    { id: 'M08.11-q1', text: 'JavaScript kim tomonidan yaratilgan?', options: ['Gvido van Rossum', 'Brendan Eich', 'James Gosling', 'Dennis Ritchie'], correctIndex: 1, explanation: 'Brendan Eich — JavaScript yaratuvchisi (1995)', type: 'Y1' },
    { id: 'M08.11-q2', text: 'JavaScript\'da o\'zgarmas o\'zgaruvchi e\'lon qilish uchun qaysi kalit so\'z ishlatiladi?', options: ['let', 'var', 'const', 'static'], correctIndex: 2, explanation: 'const — o\'zgarmas qiymat e\'lon qilish', type: 'Y1' },
    { id: 'M08.11-q3', text: '"hello".length qiymati?', options: ['4', '5', '6', 'undefined'], correctIndex: 1, explanation: '"hello" da 5 ta harf, length = 5', type: 'Y1' },
  ]),

  'M08.12': t('M08.12', 'JavaScript shart, sikl, funksiya va massivlari', [
    { type: 'definition', content: 'JavaScript\'da shart operatorlari (if/else, switch), sikllar (for, while, do-while), funksiyalar va massivlar bilan ishlash imkoniyati mavjud.' },
    { type: 'table', content: '| Konstruksiya | Sintaksis |\n|-------------|----------|\n| if/else | if (shart) { } else { } |\n| switch | switch(x) { case 1: break } |\n| for | for (let i=0; i<n; i++) |\n| while | while (shart) { } |\n| for...of | for (let el of arr) |\n| Funksiya | function f(x) { return } |\n| Arrow funksiya | const f = (x) => x*2 |' },
    { type: 'code', content: '// Shart\nlet yosh = 15\nif (yosh >= 18) {\n    console.log("Voyaga yetgan")\n} else {\n    console.log("Voyaga yetmagan")\n}\n\n// Ternary\nlet natija = yosh >= 18 ? "Katta" : "Kichik"\n\n// Sikl\nfor (let i = 0; i < 5; i++) {\n    console.log(i)  // 0 1 2 3 4\n}\n\n// While\nlet n = 0\nwhile (n < 3) {\n    console.log(n)\n    n++\n}\n\n// Funksiya\nfunction kvadrat(x) {\n    return x * x\n}\n\n// Arrow funksiya\nconst kub = (x) => x ** 3\n\nconsole.log(kvadrat(5))  // 25\nconsole.log(kub(3))      // 27\n\n// Massiv\nlet arr = [1, 2, 3, 4, 5]\narr.push(6)\nconsole.log(arr.length)   // 6\nconsole.log(arr[0])       // 1\nconsole.log(arr.slice(1, 3))  // [2, 3]\n\n// Massiv metodlari\narr.forEach(x => console.log(x))\nlet ikkilangan = arr.map(x => x * 2)\nlet juft = arr.filter(x => x % 2 === 0)\nconsole.log(arr.find(x => x > 3))  // 4', language: 'javascript' },
    { type: 'note', content: '⚡ Arrow funksiyalar (=>) ES6 dan boshlab qo\'shilgan. Massiv metodlari (map, filter, find, reduce) deklarativ usulda kod yozish imkonini beradi.' },
  ], [
    { id: 'M08.12-q1', text: 'JavaScript\'da massiv oxiriga element qo\'shish metodi?', options: ['push()', 'pop()', 'unshift()', 'shift()'], correctIndex: 0, explanation: 'push() — massiv oxiriga element qo\'shadi', type: 'Y1' },
    { id: 'M08.12-q2', text: 'Arrow funksiya sintaksisi?', options: ['function(x) {return x*2}', '(x) => x*2', 'def(x): return x*2', 'fn(x) => x*2'], correctIndex: 1, explanation: 'Arrow funksiya: (parametr) => ifoda', type: 'Y1' },
    { id: 'M08.12-q3', text: 'arr.map(x => x * 2) nimani qaytaradi?', options: ['Faqat juftlarni', 'Har bir elementni 2 ga ko\'paytiradi', 'Massiv uzunligini', 'Birinchi elementni'], correctIndex: 1, explanation: 'map() — har bir elementga funksiyani qo\'llab, yangi massiv qaytaradi', type: 'Y2' },
  ]),
'M09.01': t('M09.01', 'Ma\'lumotlar bazasi va MBBT', [
    { type: 'definition', content: 'Ma\'lumotlar bazasi (MB) — tartiblangan, o\'zaro bog\'langan ma\'lumotlar to\'plami. MBBT (DBMS) — MB ni yaratish, boshqarish va ishlatish uchun dastur.' },
    { type: 'text', content: 'MB turlari: relyatsion (jadval ko\'rinishida — PostgreSQL, MySQL), hujjatli (JSON — MongoDB), kalit-qiymat (Redis), grafli (Neo4j). Relyatsion MB eng keng tarqalgan.' },
    { type: 'table', content: '| MBBT | Turi | Xususiyatlari |\n|------|------|-------------|\n| PostgreSQL | Relyatsion | Bepul, kuchli, ACID |\n| MySQL | Relyatsion | Tez, mashhur |\n| MongoDB | Hujjatli | NoSQL, moslashuvchan |\n| Redis | Kalit-qiymat | Juda tez, kesh uchun |' },
    { type: 'note', content: '💡 Relyatsion MB da ma\'lumotlar jadvallarda saqlanadi, jadvallar o\'zaro kalitlar orqali bog\'lanadi. SQL — relyatsion MB lar uchun so\'rovlar tili.' },
    { type: 'example', content: 'Maktab MB: O\'quvchilar jadvali, Fanlar jadvali, Baholar jadvali. Uchala jadval o\'zaro kalitlar orqali bog\'lanadi.' },
  ], [
    { id: 'M09.01-q1', text: 'MBBT nima?', options: ['Ma\'lumotlar to\'plami', 'Ma\'lumotlar bazasini boshqarish tizimi', 'Dasturlash tili', 'Veb-server'], correctIndex: 1, explanation: 'MBBT — Ma\'lumotlar Bazasini Boshqarish Tizimi (DBMS)', type: 'Y1' },
    { id: 'M09.01-q2', text: 'Quyidagilardan qaysi biri relyatsion MBBT?', options: ['MongoDB', 'Redis', 'PostgreSQL', 'Neo4j'], correctIndex: 2, explanation: 'PostgreSQL — relyatsion MBBT. MongoDB (hujjatli), Redis (kalit-qiymat), Neo4j (grafli)', type: 'Y1' },
    { id: 'M09.01-q3', text: 'Relyatsion MB da ma\'lumotlar qanday saqlanadi?', options: ['JSON ko\'rinishida', 'Jadvallarda', 'Graf ko\'rinishida', 'Kalit-qiymat juftligida'], correctIndex: 1, explanation: 'Relyatsion MB ma\'lumotlarni o\'zaro bog\'langan jadvallarda saqlaydi', type: 'Y1' },
  ]),

  'M09.02': t('M09.02', 'Baza turlari, jadvallar va ma\'lumot turlari', [
    { type: 'definition', content: 'Ma\'lumotlar bazasi turlari: relyatsion, iyerarxik, tarmoq, obyektga yo\'naltirilgan, NoSQL. Relyatsion MB da ma\'lumotlar jadvallar ko\'rinishida tashkil etiladi.' },
    { type: 'text', content: 'Jadval — MB ning asosiy obyekti. Ustunlar (maydonlar) ma\'lumot turini belgilaydi, qatorlar (yozuvlar) ma\'lumotlarni saqlaydi. Ma\'lumot turlari: matn (TEXT, VARCHAR), son (INTEGER, FLOAT, DECIMAL), sana/vaqt (DATE, DATETIME), mantiqiy (BOOLEAN), BLOB (rasm, fayl).' },
    { type: 'table', content: '| Ma\'lumot turi | Izoh | Misol |\n|---------------|------|------|\n| INTEGER | Butun son | 25 |\n| VARCHAR(n) | O\'zgaruvchan matn | \'Ali\' |\n| DECIMAL(p,s) | Aniq kasr son | 45.50 |\n| DATE | Sana | 2024-09-01 |\n| BOOLEAN | Mantiqiy | TRUE/FALSE |\n| TEXT | Uzun matn | Maqola matni |' },
    { type: 'note', content: '🔑 Ma\'lumot turini to\'g\'ri tanlash — MB ning samarali ishlashi va xotira tejamkorligi uchun muhim.' },
  ], [
    { id: 'M09.02-q1', text: 'VARCHAR(n) ma\'lumot turi qanday ma\'lumot uchun ishlatiladi?', options: ['Butun son', 'O\'zgaruvchan matn', 'Sana', 'Mantiqiy'], correctIndex: 1, explanation: 'VARCHAR — o\'zgaruvchan uzunlikdagi matn saqlash uchun', type: 'Y1' },
    { id: 'M09.02-q2', text: 'Relyatsion MB da ma\'lumotlar qanday tuzilmada saqlanadi?', options: ['Ro\'yxat', 'Jadval', 'Daraxt', 'Graf'], correctIndex: 1, explanation: 'Relyatsion MB ma\'lumotlarni jadvallarda saqlaydi', type: 'Y1' },
    { id: 'M09.02-q3', text: 'O\'quvchining tug\'ilgan sanasini saqlash uchun qaysi ma\'lumot turi mos?', options: ['INTEGER', 'VARCHAR', 'DATE', 'BOOLEAN'], correctIndex: 2, explanation: 'Sana ma\'lumotlari uchun DATE turi ishlatiladi', type: 'Y2' },
  ]),

  'M09.03': t('M09.03', 'Kalitlar va jadvallarni bog\'lash', [
    { type: 'definition', content: 'Kalit — jadvaldagi yozuvlarni unikal aniqlash uchun ishlatiladigan maydon yoki maydonlar guruhi. Birlamchi kalit (Primary Key) — har bir yozuvni noyob aniqlaydi. Tashqi kalit (Foreign Key) — ikki jadvalni bog\'lash uchun ishlatiladi.' },
    { type: 'table', content: '| Kalit turi | Vazifasi | Xususiyati |\n|-----------|---------|-----------|\n| Birlamchi (PK) | Yozuvni unikal aniqlaydi | NULL bo\'lmaydi, takrorlanmaydi |\n| Tashqi (FK) | Jadvallarni bog\'laydi | Boshqa jadval PK ga murojaat |\n| Unikal (UNIQUE) | Takrorlanmaslikni ta\'minlaydi | Bir nechta bo\'lishi mumkin |\n| Indeks | Qidiruvni tezlashtiradi | PK avtomatik indeks |' },
    { type: 'example', content: 'O\'quvchilar (ID(PK), Ism, Familiya, Sinf)\nBaholar (ID(PK), O\'quvchiID(FK), Fan, Baho, Sana)\nO\'quvchiID — O\'quvchilar jadvalidagi ID ga murojaat qiladi.' },
    { type: 'note', content: '🔗 Jadvallarni bog\'lash turlari: 1:1 (bir-birga), 1:M (birga-ko\'p), M:M (ko\'pga-ko\'p). M:M munosabatda oraliq jadval ishlatiladi.' },
  ], [
    { id: 'M09.03-q1', text: 'Birlamchi kalit (Primary Key) qanday xususiyatga ega?', options: ['NULL bo\'lishi mumkin', 'Takrorlanishi mumkin', 'NULL bo\'lmaydi va takrorlanmaydi', 'Faqat matnli maydon'], correctIndex: 2, explanation: 'PK — noyob, NULL bo\'lmaydi, har bir yozuvni unikal aniqlaydi', type: 'Y1' },
    { id: 'M09.03-q2', text: 'Tashqi kalit (Foreign Key) nima vazifani bajaradi?', options: ['Yozuvlarni tartiblaydi', 'Jadvallarni bog\'laydi', 'Ma\'lumotlarni tekshiradi', 'Indeks yaratadi'], correctIndex: 1, explanation: 'Foreign Key ikki jadval o\'rtasida bog\'lanishni ta\'minlaydi', type: 'Y1' },
    { id: 'M09.03-q3', text: 'Ikki jadval o\'rtasida M:M munosabat qanday amalga oshiriladi?', options: ['To\'g\'ridan-to\'g\'ri FK bilan', 'Oraliq jadval orqali', 'Birlamchi kalit orqali', 'Unikal kalit orqali'], correctIndex: 1, explanation: 'Ko\'pga-ko\'p munosabatda oraliq jadval yaratiladi', type: 'Y2' },
  ]),

  'M09.04': t('M09.04', 'Accessda oddiy so‘rovlar va tanlash shartlari', [
    { type: 'definition', content: 'So‘rov (Query) — bazadagi bir yoki bir nechta jadvaldan berilgan talabga mos yozuv va maydonlarni ko‘rsatish vositasi. Oddiy so‘rov bir jadval ma’lumotlaridan foydalanishi mumkin.' },
    { type: 'text', content: 'Accessda Query Design (Конструктор запросов) orqali jadval tanlanadi, kerakli maydonlar so‘rov panjarasiga qo‘shiladi va mezon (Criteria / Условия отбора) ko‘rsatiladi. So‘rov natijasi jadvalning barcha satrlarini avtomatik ko‘rsatishi shart emas: tanlash mezoni ishlatilsa, faqat unga mos yozuvlar olinadi.' },
    { type: 'table', content: '| Amal | Vazifasi |\n|---|---|\n| Jadvalni qo‘shish | So‘rov ma’lumot manbasini tanlash |\n| Maydonni tanlash | Natijada ko‘rinadigan ustunlarni belgilash |\n| Criteria | Yozuvlarni shart bo‘yicha tanlash |\n| Run/Execute | So‘rov natijasini hisoblash va ko‘rsatish |' },
    { type: 'example', content: '“Kitoblar” jadvalidan “Muallif” va “Kitob nomi” maydonlari tanlandi. Muallif mezoniga muayyan yozuvchi nomi berilsa, natijada o‘sha yozuvchiga mos kitoblar chiqadi. Mezon qo‘yilmagan maydon natijani ko‘rsatishda ishlatilishi mumkin.' },
    { type: 'source', content: 'Manba: Informatika va axborot texnologiyalari, 11-sinf (2021), 7-dars, bosma 44–50-betlar — Access oddiy/ko‘p jadvalli so‘rovlarni loyihalash va ishlatish.' },
  ], [
    { id: 'M09.04-2021-query-q1', text: 'Accessda so‘rov loyihasiga jadval va kerakli maydonlarni qo‘shish uchun qaysi vosita mos?', options: ['Report Wizard', 'Query Design', 'Form View', 'Slide Master'], correctIndex: 1, explanation: 'Query Design so‘rov uchun jadval, maydon va mezonlarni belgilash imkonini beradi.', type: 'Y1' },
    { id: 'M09.04-2021-query-q2', text: 'Access so‘rovining Criteria (Условия отбора) qatori nimaga xizmat qiladi?', options: ['Jadvalni butunlay o‘chirishga', 'Yangi hisobot sahifasini bezashga', 'Dastur interfeysini tarjima qilishga', 'Natijaga tushadigan yozuvlarni shart bilan tanlashga'], correctIndex: 3, explanation: 'Criteria — so‘rov natijasidagi yozuvlarni filtrlaydigan tanlash mezoni.', type: 'Y1' },
    { id: 'M09.04-2021-query-q3', text: 'So‘rovdagi maydonni tanlash va unga mezon yozish o‘rtasidagi farq qaysi?', options: ['Maydon natijadagi ustunni, mezon esa mos yozuvlarni belgilaydi', 'Ikkalasi faqat satrni o‘chiradi', 'Maydon faqat rangni o‘zgartiradi', 'Mezon har doim barcha yozuvni qaytaradi'], correctIndex: 0, explanation: 'Maydon tanlash qaysi ustun ishlatilishini, mezon esa qaysi satrlar mos kelishini aniqlaydi.', type: 'Y1' },
  ]),

  'M09.05': t('M09.05', 'Murakkab so‘rovlar va tanlash mezonlari', [
    { type: 'definition', content: 'So‘rov — jadvaldagi yozuvlarni shart bo‘yicha tanlash va tahlil qilish vositasi. MS Access so‘rovlarida bir yoki bir nechta jadvalning maydonlaridan foydalanish mumkin.' },
    { type: 'text', content: 'Access konstruktoridagi mezon (Criteria / Условия отбора) yozuvlarni filtrlash uchun ishlatiladi. Like matn namunasiga mosligini, Not Like esa namuna mos kelmasligini tekshiradi. Accessning darslikdagi odatiy namuna sintaksisida * istalgan belgilar ketma-ketligini bildiradi; bu SQLdagi % belgisi bilan adashtirilmasin.' },
    { type: 'table', content: '| Access mezoni | Natija |\n|---|---|\n| Like "Gul*" | Gul bilan boshlanadigan matn |\n| Like "*a" | a bilan tugaydigan matn |\n| Like "*gul*" | Ichida gul ketma-ketligi bor matn |\n| Not Like "*gul*" | Ichida gul ketma-ketligi bo‘lmagan matn |\n| Between 5 And 11 | 5 va 11 ni ham o‘z ichiga oluvchi sonli oraliq |' },
    { type: 'example', content: 'Kutubxona jadvalidagi Ism maydonida Like "Gul*" mezoni Gulnora, Gulsara va Gulhayo kabi yozuvlarni tanlaydi. Bu misol Access Query Design mezoniga tegishli; boshqa SQL muhitlaridagi LIKE belgilarini avtomatik aynan shunday deb qabul qilmang.' },
    { type: 'source', content: 'Manba: Informatika va axborot texnologiyalari, 11-sinf (2021), 7-dars, bosma 44–52-betlar: Access so‘rovlari, tanlash shartlari, Like / Not Like / Between.' },
  ], [
    { id: 'M09.05-2021-query-q1', text: 'MS Access so‘rovida Ism maydoni "Gul" bilan boshlanishi uchun qaysi mezon mos?', options: ['Like "Gul*"', 'Like "*Gul"', 'Like "*Gul*"', 'Not Like "Gul*"'], correctIndex: 0, explanation: 'Darslikda Like "Gul*" Gul bilan boshlanuvchi yozuvlarni tanlash uchun ishlatiladi.', type: 'Y1' },
    { id: 'M09.05-2021-query-q2', text: 'ID maydonidagi Between 5 And 11 mezoni qaysi yozuvlarni tanlaydi?', options: ['Faqat 5 va 11 ni', 'Faqat 6 dan 10 gacha', '5 dan 11 gacha, chegaralar bilan birga', '11 dan katta qiymatlarni'], correctIndex: 2, explanation: 'Between ... And ... ikki chegara qiymatini ham qamrab oladigan oraliq mezonidir.', type: 'Y1' },
    { id: 'M09.05-2021-query-q3', text: 'Ism maydonida Not Like "*gul*" mezonining vazifasi nima?', options: ['Faqat gul bilan boshlanadiganlarni olish', 'gul ketma-ketligini o‘z ichiga olmagan matnlarni olish', 'Faqat gul bilan tugaydiganlarni olish', 'Barcha yozuvlarni olish'], correctIndex: 1, explanation: 'Not Like "*gul*" ushbu harflar ketma-ketligiga mos kelmaydigan matnlarni tanlaydi.', type: 'Y1' },
  ]),

  'M09.06': t('M09.06', 'SQL SELECT, INSERT, UPDATE, DELETE', [
    { type: 'definition', content: 'SQL (Structured Query Language) — relyatsion MB larni boshqarish uchun standart so\'rovlar tili. DML (Data Manipulation Language) — ma\'lumotlar bilan ishlash buyruqlari.' },
    { type: 'code', content: '-- SELECT: ma\'lumotlarni tanlash\nSELECT ism, fam FROM oquvchilar WHERE sinf = \'9A\';\n\n-- INSERT: yangi yozuv qo\'shish\nINSERT INTO oquvchilar (ism, fam, sinf) VALUES (\'Ali\', \'Valiyev\', \'9A\');\n\n-- UPDATE: yozuvni yangilash\nUPDATE oquvchilar SET sinf = \'9B\' WHERE ism = \'Ali\';\n\n-- DELETE: yozuvni o\'chirish\nDELETE FROM oquvchilar WHERE id = 5;', language: 'sql' },
    { type: 'table', content: '| Buyruq | Vazifasi | Muhim so\'zlar |\n|--------|---------|--------------|\n| SELECT | Ma\'lumot tanlash | FROM, WHERE, ORDER BY, GROUP BY |\n| INSERT | Yozuv qo\'shish | INTO, VALUES |\n| UPDATE | Yozuv yangilash | SET, WHERE |\n| DELETE | Yozuv o\'chirish | FROM, WHERE |' },
    { type: 'note', content: '⚠️ WHERE shartisiz UPDATE yoki DELETE butun jadvalni o\'zgartirishi mumkin. Doim WHERE shartini tekshiring!' },
    { type: 'example', content: 'SELECT COUNT(*) FROM oquvchilar WHERE sinf = \'9A\'; -- 9A sinfidagi o\'quvchilar soni\nSELECT * FROM baholar ORDER BY sana DESC; -- Baholarni sana bo\'yicha kamayish tartibida' },
  ], [
    { id: 'M09.06-q1', text: 'SQL da yangi yozuv qo\'shish uchun qaysi buyruq ishlatiladi?', options: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], correctIndex: 1, explanation: 'INSERT — jadvalga yangi yozuv qo\'shadi', type: 'Y1' },
    { id: 'M09.06-q2', text: 'WHERE shartisiz UPDATE buyrug\'i nima qiladi?', options: ['Hech narsa', 'Bitta yozuvni yangilaydi', 'Barcha yozuvlarni o\'zgartiradi', 'Xatolik beradi'], correctIndex: 2, explanation: 'WHERE sharti bo\'lmasa, UPDATE jadvaldagi barcha yozuvlarni o\'zgartiradi', type: 'Y2' },
    { id: 'M09.06-q3', text: 'SELECT * FROM oquvchilar ORDER BY fam; buyrug\'i nima qaytaradi?', options: ['Familiya bo\'yicha saralangan ro\'yxat', 'Faqat familiyalar', 'O\'quvchilar soni', 'Familiyasi eng uzun o\'quvchi'], correctIndex: 0, explanation: 'ORDER BY fam — natijalarni familiya bo\'yicha saralaydi', type: 'Y2' },
  ]),

  'M09.07': t('M09.07', 'Sun\'iy intellekt tushunchasi va turlari', [
    { type: 'definition', content: 'Sun\'iy intellekt (SI) — kompyuter tizimlarining inson aqlini talab qiladigan vazifalarni bajarish qobiliyati: o\'qish, fikrlash, muammo yechish, qaror qabul qilish.' },
    { type: 'table', content: '| Tur | Izoh | Misol |\n|-----|------|------|\n| ANI (Weak AI) | Tor vazifalar | Siri, ChatGPT, shaxmat |\n| AGI (Strong AI) | Inson darajasi | Hali mavjud emas |\n| ASI | Insonni ortda qoldiradi | Nazariy |' },
    { type: 'text', content: 'SI yo\'nalishlari: Mashinaviy o\'qitish (ML), Tabiiy tilni qayta ishlash (NLP), Kompyuter ko\'rishi (CV), Robototexnika, Ekspert tizimlari.' },
    { type: 'note', content: '🤖 ANI (Artificial Narrow Intelligence) — bugungi kunda mavjud bo\'lgan yagona SI turi. AGI hali yaratilmagan. ASI — kelajak tushunchasi.' },
    { type: 'example', content: 'SI misollari:\n- Tavsiya tizimlari (Netflix, YouTube)\n- Ovozli yordamchilar (Siri, Google Assistant)\n- Avtonom mashinalar (Tesla)\n- Tibbiy diagnostika' },
  ], [
    { id: 'M09.07-q1', text: 'Hozirgi kunda mavjud bo\'lgan SI turi?', options: ['AGI', 'ASI', 'ANI', 'Barchasi'], correctIndex: 2, explanation: 'ANI (Weak AI) — tor vazifalarni bajaradigan SI. AGI va ASI hali mavjud emas', type: 'Y1' },
    { id: 'M09.07-q2', text: 'Quyidagilardan qaysi biri SI yo\'nalishi emas?', options: ['Mashinaviy o\'qitish', 'Kompyuter ko\'rishi', 'Veb-dizayn', 'NLP'], correctIndex: 2, explanation: 'Veb-dizayn — SI yo\'nalishi emas. ML, CV, NLP — SI yo\'nalishlari', type: 'Y1' },
    { id: 'M09.07-q3', text: 'AGI nimani anglatadi?', options: ['Tor SI', 'Inson darajasidagi SI', 'Tezkor SI', 'Avtomatik SI'], correctIndex: 1, explanation: 'AGI (Artificial General Intelligence) — inson darajasida fikrlay oladigan SI', type: 'Y2' },
  ]),

  // ============================================================
  // M10 — Kompyuter grafikasi va media
  // ============================================================
  'M10.01': t('M10.01', 'Grafika turlari, rang modellari va formatlar', [
    { type: 'definition', content: 'Kompyuter grafikasi — kompyuter yordamida tasvirlarni yaratish va qayta ishlash. Ikki asosiy tur: rastrli va vektorli grafika.' },
    { type: 'table', content: '| Tur | Asos | Sifat | Formatlar |\n|-----|------|------|----------|\n| Rastrli | Piksel | Kattalashtirilganda piksellashadi | BMP, JPEG, PNG, GIF |\n| Vektorli | Chiziq va shakllar | Sifat yo\'qotmaydi | SVG, CDR, AI, EPS |' },
    { type: 'text', content: 'Rang modellari: RGB (qizil, yashil, ko\'k — ekran uchun), CMYK (havorang, qizg\'ish, sariq, qora — bosma uchun), HSB (rang tus, to\'yinganlik, yorqinlik).' },
    { type: 'table', content: '| Format | Xususiyati | Qo\'llanishi |\n|--------|-----------|-----------|\n| JPEG | Siqilgan, 16.7M rang | Foto, veb |\n| PNG | Shaffoflik, lossless | Veb, logotip |\n| GIF | Animatsiya, 256 rang | Animatsiya |\n| SVG | Vektor, masshtablanadi | Veb-ikona |\n| BMP | Siqilmagan | Windows fon |' },
    { type: 'note', content: '🎨 RGB qo\'shuvchi rang modeli — qora ekrandan rang hosil qiladi. CMYK ayiruvchi model — oq qog\'ozdan rang hosil qiladi.' },
  ], [
    { id: 'M10.01-q1', text: 'Rastrli grafika asosi nima?', options: ['Nuqta', 'Chiziq', 'Piksel', 'Shakl'], correctIndex: 2, explanation: 'Rastrli grafika piksellardan tashkil topgan', type: 'Y1' },
    { id: 'M10.01-q2', text: 'Vektorli grafika kattalashtirilganda sifat o\'zgaradimi?', options: ['Ha, piksellashadi', 'Yo\'q, sifat saqlanadi', 'O\'zgaradi', 'Faqat kichik hajmda'], correctIndex: 1, explanation: 'Vektorli grafika matematik formulalarga asoslangan, shuning uchun sifat yo\'qotmaydi', type: 'Y1' },
    { id: 'M10.01-q3', text: 'Bosma mahsulotlar uchun qaysi rang modeli ishlatiladi?', options: ['RGB', 'CMYK', 'HSB', 'HEX'], correctIndex: 1, explanation: 'CMYK — bosma rang modeli (Cyan, Magenta, Yellow, Black)', type: 'Y2' },
  ]),

  'M10.02': t('M10.02', 'Paint va Photoshop interfeysi', [
    { type: 'definition', content: 'MS Paint — oddiy rastrli grafik muharrir, Windows tarkibiga kiradi. Adobe Photoshop — professional rastrli grafik muharrir, keng imkoniyatlarga ega.' },
    { type: 'table', content: '| Xususiyat | MS Paint | Adobe Photoshop |\n|-----------|----------|----------------|\n| Qatlamlar | Yo\'q | Bor |\n| Filtrlar | Minimal | Ko\'p (100+) |\n| Rang tuzatish | Cheklangan | Keng |\n| Formatlar | BMP, PNG, JPEG | PSD, TIFF, barchasi |\n| Narx | Bepul | Pullik (abonement) |' },
    { type: 'text', content: 'Photoshop interfeysi: asboblar paneli (chapda), menyu (yuqorida), qatlamlar paneli (o\'ngda), rang palitrasi, ish maydoni. Paint interfeysi soddaroq: asboblar paneli, lenta, ranglar palitrasi.' },
    { type: 'note', content: '🖌 Paint — oddiy chizish va tahrirlash uchun. Photoshop — professional foto va grafika tahrirlash uchun.' },
  ], [
    { id: 'M10.02-q1', text: 'Adobe Photoshop dagi asosiy farq MS Paint dan?', options: ['Tezroq', 'Qatlamlar bilan ishlash', 'Faqat rasm ochadi', 'Bepul'], correctIndex: 1, explanation: 'Photoshop qatlamlar (layers) bilan ishlash imkoniyatiga ega', type: 'Y1' },
    { id: 'M10.02-q2', text: 'MS Paint qanday turdagi grafik muharrir?', options: ['Vektorli', 'Rastrli', '3D', 'Hibrid'], correctIndex: 1, explanation: 'MS Paint — oddiy rastrli grafik muharrir', type: 'Y1' },
    { id: 'M10.02-q3', text: 'Photoshop da qatlamlar paneli qayerda joylashgan?', options: ['Chapda', 'Yuqorida', 'O\'ngda', 'Pastda'], correctIndex: 2, explanation: 'Photoshop da qatlamlar paneli odatda o\'ng tomonda joylashgan', type: 'Y2' },
  ]),

  'M10.03': t('M10.03', 'Belgilash, kesish, rang va qatlamlar', [
    { type: 'definition', content: 'Belgilash (selection) — tasvirning ma\'lum qismini ajratish. Kesish (cropping) — keraksiz qismlarni olib tashlash. Rang — piksel rangini o\'zgartirish. Qatlam (layer) — bir-biridan mustaqil tasvir sathlari.' },
    { type: 'table', content: '| Asbob | Vazifasi |\n|-------|---------|\n| Rectangular Marquee | To\'g\'ri to\'rtburchak belgilash |\n| Lasso | Erkin shaklda belgilash |\n| Magic Wand | Rang bo\'yicha belgilash |\n| Crop | Kesish |\n| Brush | Bo\'yash |\n| Eraser | O\'chirish |\n| Gradient | Rang o\'tishi |' },
    { type: 'text', content: 'Qatlamlar muhim afzallik: har bir qatlam mustaqil tahrirlanadi, boshqa qatlamlarga ta\'sir qilmaydi. Qatlamlarni aralashtirish rejimlari (blending modes) qiziqarli effektlar yaratish imkonini beradi.' },
    { type: 'note', content: '💡 Masalan, matn qatlami, fon qatlami va rasm qatlami alohida tahrirlanadi. Pastki qatlamni o\'chirish boshqa qatlamlarga ta\'sir qilmaydi.' },
  ], [
    { id: 'M10.03-q1', text: 'Photoshop da rang bo\'yicha belgilash uchun qaysi asbob ishlatiladi?', options: ['Lasso', 'Magic Wand', 'Crop', 'Brush'], correctIndex: 1, explanation: 'Magic Wand — rang bo\'yicha belgilash asbobi', type: 'Y1' },
    { id: 'M10.03-q2', text: 'Qatlam (layer) qanday afzallik beradi?', options: ['Rasm tezroq ochiladi', 'Mustaqil tahrirlash imkoniyati', 'Fayl hajmi kichiklashadi', 'Ranglar yorqinlashadi'], correctIndex: 1, explanation: 'Qatlamlar mustaqil tahrirlash imkonini beradi, bir qatlamdagi o\'zgarish boshqasiga ta\'sir qilmaydi', type: 'Y2' },
  ]),

  'M10.04': t('M10.04', 'Matn, foto va rasmlarni tahrirlash', [
    { type: 'text', content: 'Matn tahrirlash: shrift, o\'lcham, rang, effekt (soya, glow), matnni egri chiziq bo\'ylab joylashtirish. Photoshop da Type asbobi yordamida matn qo\'shiladi.' },
    { type: 'text', content: 'Foto tahrirlash: yorqinlik/kontrast, rang balansi, to\'yinganlik, keskinlik, dog\'larni tozalash, qizil ko\'zlarni olib tashlash. Filtrlar: blur (xiralashtirish), sharpen (keskinlashtirish), distort (buzish).' },
    { type: 'table', content: '| Amal | Vazifasi |\n|------|---------|\n| Brightness/Contrast | Yorqinlik va kontrastni sozlash |\n| Levels | Rang darajalarini sozlash |\n| Curves | Tonlarni aniq sozlash |\n| Hue/Saturation | Rang tus va to\'yinganlik |\n| Clone Stamp | Nusxa ko\'chirish (dog\'larni tozalash) |\n| Red Eye Tool | Qizil ko\'zni olib tashlash |' },
    { type: 'example', content: 'Fotoni tahrirlash ketma-ketligi:\n1) Rasmni ochish\n2) Crop bilan kesish\n3) Rang tuzatish (Levels/Curves)\n4) Dog\'larni Clone Stamp bilan tozalash\n5) Sharpen filtri bilan keskinlashtirish\n6) Matn qo\'shish' },
    { type: 'note', content: '📷 Clone Stamp (Nusxa muhri) — tasvirning bir qismidan nusxa olib, boshqa joyga qo\'yadi. Fotosuratdagi keraksiz obyektlarni olib tashlash uchun ishlatiladi.' },
  ], [
    { id: 'M10.04-q1', text: 'Photoshop da rang tus va to\'yinganlikni sozlash uchun qaysi buyruq ishlatiladi?', options: ['Levels', 'Curves', 'Hue/Saturation', 'Brightness/Contrast'], correctIndex: 2, explanation: 'Hue/Saturation — rang tus (Hue) va to\'yinganlikni (Saturation) sozlash', type: 'Y2' },
    { id: 'M10.04-q2', text: 'Clone Stamp asbobi nima uchun ishlatiladi?', options: ['Matn yozish', 'Dog\'larni tozalash', 'Rasm chizish', 'Belgilash'], correctIndex: 1, explanation: 'Clone Stamp — tasvir qismidan nusxa olib, dog\' yoki keraksiz obyektlarni yopish uchun', type: 'Y1' },
  ]),

  'M10.05': t('M10.05', '3D modellashtirish', [
    { type: 'definition', content: '3D modellashtirish — uch o\'lchamli obyektlarni kompyuterda yaratish jarayoni. Asosiy elementlar: uch, chekka, yoq (vertex, edge, face).' },
    { type: 'text', content: '3D model yaratish usullari: poligonal modellashtirish (eng keng tarqalgan), spline modellashtirish (egri chiziqlar), skulpting (loyga o\'xshash), parametrik (matematik formula asosida).' },
    { type: 'table', content: '| Dastur | Turi | Qo\'llanishi |\n|--------|------|-----------|\n| Blender | Bepul, ochiq kod | Animatsiya, o\'yin, model |\n| 3ds Max | Pullik | Arxitektura, o\'yin |\n| Maya | Pullik | Film, animatsiya |\n| Tinkercad | Bepul, online | Boshlang\'ichlar |\n| SketchUp | Pullik | Arxitektura, interyer |' },
    { type: 'note', content: '🔺 3D modelning asosi — uchburchak (triangle) yoki to\'rtburchak (quad) poligonlar. Ko\'p poligon = batafsil model, lekin sekinroq render.' },
    { type: 'example', content: '3D modellashtirish bosqichlari:\n1) Model yaratish (modelling)\n2) Tekstura qo\'yish (texturing)\n3) Yoritish (lighting)\n4) Render (render)\n5) Animatsiya (animation) — ixtiyoriy' },
  ], [
    { id: 'M10.05-q1', text: '3D modelning asosiy elementi nima?', options: ['Nuqta', 'Chiziq', 'Poligon', 'Rang'], correctIndex: 2, explanation: '3D modellar poligonlardan (uchburchak/to\'rtburchak) tashkil topgan', type: 'Y1' },
    { id: 'M10.05-q2', text: 'Quyidagilardan qaysi biri 3D modellashtirish dasturi?', options: ['Photoshop', 'Blender', 'Excel', 'Audacity'], correctIndex: 1, explanation: 'Blender — bepul 3D modellashtirish va animatsiya dasturi', type: 'Y1' },
    { id: 'M10.05-q3', text: '3D modelga tekstura qo\'yish bosqichi qanday nomlanadi?', options: ['Modelling', 'Texturing', 'Rendering', 'Lighting'], correctIndex: 1, explanation: 'Texturing — model sirtiga tasvir yoki rang berish', type: 'Y2' },
  ]),

  'M10.06': t('M10.06', 'Animatsiya va Adobe Animate', [
    { type: 'definition', content: 'Animatsiya — ketma-ket kadrlarni tez almashlab, harakat illuziyasini yaratish. Framerate (FPS) — sekunddagi kadrlar soni. Standart: 24 FPS (kino), 30 FPS (TV), 60 FPS (o\'yin).' },
    { type: 'table', content: '| Animatsiya turi | Izoh |\n|----------------|------|\n| Traditional (2D) | Qo\'lda chizilgan kadrlar |\n| Stop-motion | Jismoniy obyektlarni suratga olish |\n| 3D animatsiya | Kompyuterda 3D modellarni harakatlantirish |\n| Motion graphics | Matn va grafik elementlar harakati |\n| Tween animatsiya | Oraliq kadrlarni avtomatik yaratish |' },
    { type: 'text', content: 'Adobe Animate (sobiq Flash Professional) — 2D animatsiya va interfaol kontent yaratish dasturi. Asosiy vositalar: Timeline (vaqt shkalasi), Keyframe (kalit kadr), Tween (oraliq kadr), Symbol (belgi).' },
    { type: 'note', content: '🎬 Tween animatsiya: boshlang\'ich va tugash holatini belgilaysiz, dastur oraliq kadrlarni avtomatik yaratadi.' },
  ], [
    { id: 'M10.06-q1', text: 'Sekunddagi kadrlar soni qanday atama bilan belgilanadi?', options: ['FPS', 'DPI', 'RGB', 'CPU'], correctIndex: 0, explanation: 'FPS (Frames Per Second) — sekunddagi kadrlar soni', type: 'Y1' },
    { id: 'M10.06-q2', text: 'Adobe Animate da oraliq kadrlarni avtomatik yaratish qanday nomlanadi?', options: ['Keyframe', 'Tween', 'Symbol', 'Timeline'], correctIndex: 1, explanation: 'Tween — boshlang\'ich va tugash holati orasidagi kadrlarni avtomatik yaratadi', type: 'Y2' },
  ]),

  'M10.07': t('M10.07', 'Audio va video tahrirlash', [
    { type: 'definition', content: 'Audio tahrirlash — ovoz fayllarini kesish, birlashtirish, effekt qo\'shish, sifatni yaxshilash. Video tahrirlash — video lavhalarni montaj qilish, tranzisiya va effektlar qo\'shish.' },
    { type: 'table', content: '| Dastur | Turi | Xususiyati |\n|--------|------|-----------|\n| Audacity | Audio | Bepul, ko\'p platformali |\n| Adobe Audition | Audio | Professional, keng imkoniyatlar |\n| DaVinci Resolve | Video | Bepul, professional |\n| Adobe Premiere Pro | Video | Professional, industriya standarti |\n| CapCut | Video | Mobil, sodda |' },
    { type: 'text', content: 'Audio formatlar: WAV (lossless), MP3 (siqilgan), FLAC (lossless siqilgan), AAC (Apple). Video formatlar: MP4, AVI, MOV, MKV, WebM.' },
    { type: 'example', content: 'Audacity da audio tahrirlash:\n1) Faylni ochish\n2) Kesish (Ctrl+X) / Nusxa (Ctrl+C)\n3) Effekt qo\'shish (Reverb, Echo, Noise Reduction)\n4) Eksport (MP3, WAV)' },
    { type: 'note', content: '🎵 Video montajda uch asosiy bosqich: import → tahrirlash (kesish, joylashtirish, tranzisiya) → eksport (render qilish).' },
  ], [
    { id: 'M10.07-q1', text: 'Quyidagilardan qaysi biri audio muharrir?', options: ['Premiere Pro', 'Audacity', 'Photoshop', 'Blender'], correctIndex: 1, explanation: 'Audacity — bepul audio muharrir', type: 'Y1' },
    { id: 'M10.07-q2', text: 'MP3 audio formatining xususiyati?', options: ['Lossless', 'Siqilgan', 'Video', 'Rasm'], correctIndex: 1, explanation: 'MP3 — siqilgan audio formati, fayl hajmini kichiklashtiradi', type: 'Y1' },
    { id: 'M10.07-q3', text: 'Video montajning to\'g\'ri ketma-ketligi qaysi?', options: ['Eksport→Import→Tahrirlash', 'Import→Tahrirlash→Eksport', 'Tahrirlash→Import→Eksport', 'Import→Eksport→Tahrirlash'], correctIndex: 1, explanation: 'Video montaj: Import (yuklash) → Tahrirlash (kesish, joylashtirish) → Eksport (render)', type: 'Y2' },
  ]),

  // ============================================================
  // M11 — HTML va CSS
  // ============================================================
  'M11.01': t('M11.01', 'Veb va HTML asoslari', [
    { type: 'definition', content: 'HTML (HyperText Markup Language) — veb-sahifalarni yaratish uchun ishlatiladigan belgilash tili. Teglar yordamida sahifa tuzilishi ifodalanadi.' },
    { type: 'code', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Sahifa nomi</title>\n</head>\n<body>\n  <h1>Sarlavha</h1>\n  <p>Matn</p>\n</body>\n</html>', language: 'html' },
    { type: 'table', content: '| Teg | Vazifasi |\n|-----|---------|\n| <h1>-<h6> | Sarlavhalar |\n| <p> | Paragraf |\n| <a> | Havola (link) |\n| <img> | Rasm |\n| <ul>/<ol> | Ro\'yxatlar |\n| <table> | Jadval |\n| <div> | Blok konteyner |\n| <span> | Qator ichidagi element |' },
    { type: 'note', content: '💡 Atributlar teg ichida yoziladi: <a href="https://example.com">Link</a>. href — atribut, "url" — qiymat.' },
  ], [
    { id: 'M11.01-q1', text: 'HTML nimaning qisqartmasi?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperText Modern Layout', 'Home Tool Markup Language'], correctIndex: 0, explanation: 'HTML — HyperText Markup Language', type: 'Y1' },
    { id: 'M11.01-q2', text: 'Qaysi teg eng katta sarlavha uchun ishlatiladi?', options: ['<h6>', '<h1>', '<header>', '<title>'], correctIndex: 1, explanation: '<h1> eng katta, <h6> eng kichik sarlavha', type: 'Y1' },
    { id: 'M11.01-q3', text: '<a href="...">Link</a> da href nima?', options: ['Teg', 'Atribut', 'Qiymat', 'Element'], correctIndex: 1, explanation: 'href — atribut, uning qiymati havola manzili', type: 'Y2' },
  ]),

  'M11.02': t('M11.02', 'HTML matn, fon, ro\'yxat va rasm', [
    { type: 'definition', content: 'HTML da matn elementlari: paragraf, sarlavha, formatlash teglari (qalin, kursiv, tagiga chizish). Fon — sahifa yoki element orqa foni.' },
    { type: 'code', content: '<p>Oddiy matn</p>\n<b>Qalin matn</b>\n<i>Kursiv matn</i>\n<u>Tagiga chizilgan</u>\n<mark>Belgilangan matn</mark>\n<small>Kichik matn</small>', language: 'html' },
    { type: 'code', content: '<!-- Ro\'yxat turlari -->\n<ul>\n  <li>Bir element</li>\n  <li>Ikki element</li>\n</ul>\n\n<ol>\n  <li>Birinchi</li>\n  <li>Ikkinchi</li>\n</ol>', language: 'html' },
    { type: 'note', content: '🔑 <ul> — tartibsiz ro\'yxat (belgili), <ol> — tartibli ro\'yxat (raqamli). type atributi bilan raqamlash usulini o\'zgartirish mumkin.' },
  ], [
    { id: 'M11.02-q1', text: 'Matnni qalin qilish uchun qaysi teg ishlatiladi?', options: ['<i>', '<b>', '<u>', '<small>'], correctIndex: 1, explanation: '<b> (bold) — qalin matn', type: 'Y1' },
    { id: 'M11.02-q2', text: 'Tartibli ro\'yxat qaysi teg bilan yaratiladi?', options: ['<ul>', '<ol>', '<li>', '<list>'], correctIndex: 1, explanation: '<ol> (ordered list) — tartibli (raqamli) ro\'yxat', type: 'Y1' },
    { id: 'M11.02-q3', text: 'Rasm tegi <img> qanday atributga ega bo\'lishi shart?', options: ['width', 'height', 'src', 'style'], correctIndex: 2, explanation: 'src (source) — rasm manzilini ko\'rsatishi shart', type: 'Y1' },
  ]),

  'M11.03': t('M11.03', 'HTML jadval va forma', [
    { type: 'definition', content: 'Jadval — ma\'lumotlarni qator va ustunlar ko\'rinishida joylashtirish. Forma — foydalanuvchi ma\'lumot kiritishi uchun maydonlar to\'plami.' },
    { type: 'code', content: '<table border="1">\n  <tr>\n    <th>Ism</th>\n    <th>Yosh</th>\n  </tr>\n  <tr>\n    <td>Ali</td>\n    <td>15</td>\n  </tr>\n</table>', language: 'html' },
    { type: 'code', content: '<form action="/submit" method="post">\n  <label for="ism">Ism:</label>\n  <input type="text" id="ism" name="ism"><br>\n  <label for="parol">Parol:</label>\n  <input type="password" id="parol" name="parol"><br>\n  <input type="radio" name="jins" value="erkak"> Erkak\n  <input type="radio" name="jins" value="ayol"> Ayol<br>\n  <select name="shahar">\n    <option value="tosh">Toshkent</option>\n    <option value="sam">Samarqand</option>\n  </select>\n  <input type="submit" value="Yuborish">\n</form>', language: 'html' },
    { type: 'table', content: '| Input turi | Vazifasi |\n|-----------|---------|\n| text | Matn kiritish |\n| password | Parol (yashirin) |\n| radio | Bir tanlovli |\n| checkbox | Ko\'p tanlovli |\n| email | Elektron pochta |\n| number | Son kiritish |\n| date | Sana tanlash |\n| file | Fayl yuklash |\n| submit | Yuborish tugmasi |' },
  ], [
    { id: 'M11.03-q1', text: 'Jadval sarlavhasi uchun qaysi teg ishlatiladi?', options: ['<td>', '<th>', '<tr>', '<table>'], correctIndex: 1, explanation: '<th> (table header) — jadval sarlavhasi', type: 'Y1' },
    { id: 'M11.03-q2', text: 'Formada parol kiritish maydoni uchun qaysi input turi ishlatiladi?', options: ['text', 'password', 'hidden', 'number'], correctIndex: 1, explanation: 'type="password" — kiritilgan matn yashirin ko\'rinadi', type: 'Y1' },
  ]),

  'M11.04': t('M11.04', 'HTML havola, iframe, audio va video', [
    { type: 'definition', content: 'Havola (anchor) — bir sahifadan boshqa sahifaga o\'tish. Iframe — sahifa ichida boshqa sahifani ko\'rsatish. Audio va video — multimedia fayllarini sahifaga joylash.' },
    { type: 'code', content: '<!-- Havola -->\n<a href="https://example.com" target="_blank">\n  Yangi oynada ochiladi\n</a>\n<a href="#bolim">Ichki havola</a>', language: 'html' },
    { type: 'code', content: '<!-- Iframe -->\n<iframe src="https://maps.google.com" \n  width="600" height="450" \n  allowfullscreen>\n</iframe>', language: 'html' },
    { type: 'code', content: '<!-- Audio -->\n<audio controls>\n  <source src="ovoz.mp3" type="audio/mpeg">\n</audio>\n\n<!-- Video -->\n<video width="640" height="360" controls>\n  <source src="video.mp4" type="video/mp4">\n</video>', language: 'html' },
    { type: 'note', content: '🔗 target="_blank" — havolani yangi oynada ochadi. controls atributi audio/video pleyerni ko\'rsatadi.' },
  ], [
    { id: 'M11.04-q1', text: 'Havolani yangi oynada ochish uchun qaysi atribut ishlatiladi?', options: ['target="_self"', 'target="_blank"', 'target="_new"', 'target="_top"'], correctIndex: 1, explanation: 'target="_blank" — havolani yangi oynada ochadi', type: 'Y1' },
    { id: 'M11.04-q2', text: 'Iframe nima vazifani bajaradi?', options: ['Rasm ko\'rsatadi', 'Boshqa sahifani ichki ko\'rsatadi', 'Video o\'ynatadi', 'Forma yaratadi'], correctIndex: 1, explanation: 'Iframe — hozirgi sahifa ichida boshqa sahifani ko\'rsatadi', type: 'Y1' },
  ]),

  'M11.05': t('M11.05', 'CSS asoslari va ranglar', [
    { type: 'definition', content: 'CSS (Cascading Style Sheets) — HTML elementlarining ko\'rinishini (rang, shrift, joylashuv) belgilaydigan stillar tili.' },
    { type: 'text', content: 'CSS qo\'shish usullari: Inline (teg ichida style=""), Internal (<style> tegi ichida), External (alohida .css fayl). External eng tavsiya etiladigan usul.' },
    { type: 'code', content: '/* CSS sintaksis */\nselektor {\n  xususiyat: qiymat;\n}\n\np {\n  color: red;\n  font-size: 16px;\n  text-align: center;\n}\n\n#sarlavha {\n  color: #3366cc;\n}\n\n.klass {\n  background-color: yellow;\n}', language: 'css' },
    { type: 'table', content: '| Rang berish usuli | Misol |\n|-----------------|------|\n| Nom bilan | red, blue, green |\n| HEX | #FF0000, #00FF00 |\n| RGB | rgb(255, 0, 0) |\n| RGBA | rgba(255, 0, 0, 0.5) |\n| HSL | hsl(0, 100%, 50%) |' },
    { type: 'note', content: '🎨 CSS da rang nomlari: 140+ standart rang nomi mavjud.' },
  ], [
    { id: 'M11.05-q1', text: 'CSSning to\'liq nomi?', options: ['Color Style Sheets', 'Cascading Style Sheets', 'Computer Style System', 'Creative Style Sheets'], correctIndex: 1, explanation: 'CSS — Cascading Style Sheets', type: 'Y1' },
    { id: 'M11.05-q2', text: 'CSS ni alohida fayldan ulash qanday nomlanadi?', options: ['Inline', 'Internal', 'External', 'Import'], correctIndex: 2, explanation: 'External CSS — alohida .css faylni <link> orqali ulash', type: 'Y1' },
    { id: 'M11.05-q3', text: '#FF0000 qanday rang?', options: ['Yashil', 'Qora', 'Qizil', 'Ko\'k'], correctIndex: 2, explanation: '#FF0000 — qizil (FF=255 qizil, 00 yashil, 00 ko\'k)', type: 'Y2' },
  ]),

  'M11.06': t('M11.06', 'CSS matn, ro\'yxat, blok, jadval va forma', [
    { type: 'text', content: 'CSS matn xususiyatlari: font-family (shrift turi), font-size (o\'lcham), font-weight (qalinlik), text-align (tekislash), text-decoration (bezak), line-height (qator balandligi).' },
    { type: 'code', content: '/* Blok modeli */\ndiv {\n  width: 300px;\n  margin: 10px;\n  padding: 15px;\n  border: 2px solid black;\n  background-color: #f0f0f0;\n}\n\ntable {\n  border-collapse: collapse;\n  width: 100%;\n}\ntd, th {\n  border: 1px solid #ddd;\n  padding: 8px;\n}', language: 'css' },
    { type: 'note', content: '📐 Blok modeli (Box Model): margin → border → padding → content. Har bir element to\'rt qatlamdan iborat.' },
  ], [
    { id: 'M11.06-q1', text: 'CSS da shrift o\'lchamini belgilash uchun qaysi xususiyat ishlatiladi?', options: ['font-weight', 'font-size', 'font-family', 'text-align'], correctIndex: 1, explanation: 'font-size — shrift o\'lchamini belgilaydi', type: 'Y1' },
    { id: 'M11.06-q2', text: 'CSS Box Model da qatlamlarning ichkaridan tashqariga to\'g\'ri ketma-ketligi?', options: ['Margin > Border > Padding > Content', 'Content > Padding > Border > Margin', 'Border > Padding > Content > Margin', 'Padding > Content > Border > Margin'], correctIndex: 1, explanation: 'Ichkaridan: Content → Padding → Border → Margin', type: 'Y2' },
  ]),

  'M11.07': t('M11.07', 'Veb-sayt loyihalash va tekshirish', [
    { type: 'definition', content: 'Veb-sayt loyihalash — maqsad, auditoriya va mazmunni aniqlab, sahifa tuzilmasini yaratish jarayoni.' },
    { type: 'text', content: 'Loyihalash bosqichlari: 1) Maqsad va auditoriyani aniqlash, 2) Mazmunni rejalashtirish, 3) Wireframe (sxema) yaratish, 4) Dizayn, 5) Kodlash, 6) Testlash, 7) Joylashtirish (hosting).' },
    { type: 'table', content: '| Test turi | Nima tekshiriladi |\n|----------|-----------------|\n| Validatsiya | HTML/CSS xatoliklari |\n| Moslik (Cross-browser) | Turli brauzerlar |\n| Responsivlik | Mobil/moslashuvchanlik |\n| Yuklanish tezligi | Sahifa tezligi |\n| Foydalanuvchanlik (UX) | Qulaylik |\n| Xavfsizlik | XSS, SQL injection |' },
    { type: 'note', content: '🌐 W3C Validator — HTML/CSS standartlarga mosligini tekshiradi. Google Lighthouse — sayt sifatini baholaydi.' },
  ], [
    { id: 'M11.07-q1', text: 'Veb-sayt loyihalashning birinchi bosqichi?', options: ['Kodlash', 'Dizayn', 'Maqsad va auditoriyani aniqlash', 'Testlash'], correctIndex: 2, explanation: 'Loyihalash maqsad va auditoriyani aniqlashdan boshlanadi', type: 'Y1' },
    { id: 'M11.07-q2', text: 'W3C Validator nima vazifani bajaradi?', options: ['Sayt tezligini oshiradi', 'HTML/CSS xatoliklarni tekshiradi', 'Rasm hajmini kichiklashtiradi', 'Domen nomini tekshiradi'], correctIndex: 1, explanation: 'W3C Validator — HTML/CSS standartlarga mosligini tekshiradi', type: 'Y2' },
  ]),

  // ============================================================
  // M12 — Kompyuter tarmoqlari va internet
  // ============================================================
  'M12.01': t('M12.01', 'Tarmoq tushunchasi va turlari', [
    { type: 'definition', content: 'Kompyuter tarmog\'i — ikki yoki undan ortiq kompyuterlarni ma\'lumot almashish va resurslarni birgalikda ishlatish uchun bog\'lovchi tizim.' },
    { type: 'table', content: '| Tarmoq turi | Qamrovi | Misol |\n|------------|---------|------|\n| PAN | Bir shaxs (1-10m) | Bluetooth, USB |\n| LAN | Bino (100m-1km) | Ofis, maktab tarmog\'i |\n| MAN | Shahar (1-50km) | Shahar Wi-Fi |\n| WAN | Mamlakat/Dunyo | Internet |\n| VPN | Virtual (har joyda) | Masofaviy ulanish |' },
    { type: 'note', content: '🔑 LAN — tez va xavfsiz, WAN — sekinroq, lekin global. VPN — virtual xususiy tarmoq.' },
    { type: 'example', content: 'Maktab kompyuterlari bir-biriga LAN orqali ulangan.\nToshkent va Nukus filiallari internet orqali WAN tarmog\'i hosil qiladi.\nXodim uydan ofisga VPN orqali ulanadi.' },
  ], [
    { id: 'M12.01-q1', text: 'Internet qanday turdagi tarmoqqa misol?', options: ['LAN', 'MAN', 'WAN', 'PAN'], correctIndex: 2, explanation: 'Internet butun dunyoni qamrab olgan WAN (Wide Area Network)', type: 'Y1' },
    { id: 'M12.01-q2', text: 'Shaxsiy qurilmalarni bog\'lovchi tarmoq?', options: ['PAN', 'LAN', 'MAN', 'WAN'], correctIndex: 0, explanation: 'PAN (Personal Area Network) — shaxsiy qurilmalar uchun', type: 'Y1' },
    { id: 'M12.01-q3', text: 'VPN qanday vazifani bajaradi?', options: ['Internet tezligini oshiradi', 'Xavfsiz virtual ulanish yaratadi', 'Tarmoq qurilmalarini birlashtiradi', 'Wi-Fi signalini kuchaytiradi'], correctIndex: 1, explanation: 'VPN (Virtual Private Network) — internet orqali xavfsiz ulanishni ta\'minlaydi', type: 'Y2' },
  ]),

  'M12.02': t('M12.02', 'Komponentlar, qurilmalar va aloqa vositalari', [
    { type: 'definition', content: 'Tarmoq komponentlari — kompyuterlarni ulash va ma\'lumot uzatishni ta\'minlovchi qurilmalar va vositalar.' },
    { type: 'table', content: '| Qurilma | Vazifasi |\n|---------|---------|\n| Router | Tarmoqlarni ulash, paket marshrutlash |\n| Switch | Ichki tarmoqda qurilmalarni ulash |\n| Hub | Signallarni takrorlash |\n| Modem | Analog/digital signal konvertatsiyasi |\n| Access Point | Simsiz ulanish nuqtasi |\n| Firewall | Xavfsizlik, trafik filtrlash |' },
    { type: 'text', content: 'Aloqa vositalari: simli (UTP-kabel, koaksial, optik tolali), simsiz (Wi-Fi, Bluetooth, infraqizil, mobil aloqa). Optik tolali — eng tez (100 Gbit/s gacha).' },
    { type: 'note', content: '🔌 Router — tarmoqlararo ulanish (internetga chiqish). Switch — bir tarmoq ichida qurilmalarni ulash.' },
  ], [
    { id: 'M12.02-q1', text: 'Tarmoqlarni bir-biriga ulash uchun qaysi qurilma ishlatiladi?', options: ['Switch', 'Router', 'Hub', 'Modem'], correctIndex: 1, explanation: 'Router — turli tarmoqlarni ulaydi va paketlarni marshrutlaydi', type: 'Y1' },
    { id: 'M12.02-q2', text: 'Eng tez aloqa vositasi qaysi?', options: ['UTP-kabel', 'Wi-Fi', 'Optik tolali', 'Bluetooth'], correctIndex: 2, explanation: 'Optik tolali — yorug\'lik orqali, 100 Gbit/s gacha tezlik', type: 'Y1' },
    { id: 'M12.02-q3', text: 'Switch va Hub o\'rtasidagi asosiy farq?', options: ['Switch tezroq', 'Switch har bir portga alohida kanal beradi', 'Hub xavfsizroq', 'Farqi yo\'q'], correctIndex: 1, explanation: 'Switch har bir ulangan qurilmaga alohida kanal ajratadi, Hub barcha portlarga signalni takrorlaydi', type: 'Y2' },
  ]),

  'M12.03': t('M12.03', 'Arxitektura va topologiyalar', [
    { type: 'definition', content: 'Tarmoq arxitekturasi — tarmoq qurilmalarining o\'zaro bog\'lanish modeli. Topologiya — tarmoqning fizik yoki mantiqiy tuzilishi.' },
    { type: 'table', content: '| Topologiya | Ta\'rifi | Afzallik | Kamchilik |\n|-----------|---------|---------|----------|\n| Yulduz (Star) | Markaziy switch/hub | Bir nuqta uzilishi butun tarmoqni buzmydi | Markaziy qurilma muhim |\n| Shina (Bus) | Bitta kabel | Oddiy, kam kabel | Bir uzilish butun tarmoqni buradi |\n| Halqa (Ring) | Ketma-ket ulangan | Tartibli ma\'lumot oqimi | Bir nuqta uzilishi butun tarmoqni buradi |\n| Daraxt (Tree) | Iyerarxik | Kengaytirish oson | Murakkab boshqaruv |\n| Mesh (To\'liq) | Har bir qurilma bog\'langan | Eng ishonchli | Juda ko\'p kabel |' },
    { type: 'text', content: 'Arxitektura turlari: Client-Server (mijoz-server) — markaziy server, qolgani mijozlar. Peer-to-Peer (P2P) — barcha qurilmalar teng huquqli.' },
    { type: 'note', content: '⭐ Eng keng tarqalgan topologiya — Yulduz (Star). Zamonaviy tarmoqlarda asosan switch asosida yulduz topologiyasi ishlatiladi.' },
  ], [
    { id: 'M12.03-q1', text: 'Eng keng tarqalgan tarmoq topologiyasi?', options: ['Shina', 'Halqa', 'Yulduz', 'Mesh'], correctIndex: 2, explanation: 'Yulduz (Star) — zamonaviy tarmoqlarda eng ko\'p ishlatiladi', type: 'Y1' },
    { id: 'M12.03-q2', text: 'Client-server arxitekturasida qurilmalar qanday munosabatda?', options: ['Hamma teng', 'Markaziy server va mijozlar', 'Faqat o\'zaro', 'Ketma-ket ulangan'], correctIndex: 1, explanation: 'Client-Server: server resurslarni boshqaradi, mijozlar ulardan foydalanadi', type: 'Y1' },
    { id: 'M12.03-q3', text: 'To\'liq Mesh topologiyasining kamchiligi?', options: ['Ishonchsiz', 'Ko\'p kabel talab qiladi', 'Sekin', 'Faoliyati cheklangan'], correctIndex: 1, explanation: 'Mesh topologiyada har bir qurilma barcha qurilmalar bilan bog\'lanadi, juda ko\'p kabel talab qiladi', type: 'Y2' },
  ]),

  'M12.04': t('M12.04', 'Tarmoq ishlash prinsipi', [
    { type: 'definition', content: 'Tarmoq ishlash prinsipi — ma\'lumotlarni manbadan qabul qiluvchiga yetkazish usuli. Paketli ma\'lumot uzatish — ma\'lumotni kichik paketlarga bo\'lib yuborish.' },
    { type: 'table', content: '| OSI sathi | Vazifasi | Protokollar |\n|----------|---------|-----------|\n| 7 - Amaliy | Foydalanuvchi ilovalari | HTTP, FTP, SMTP |\n| 6 - Taqdimot | Ma\'lumot formatlash, shifrlash | SSL, TLS |\n| 5 - Sessiya | Sessiyani boshqarish | NetBIOS |\n| 4 - Transport | Ishonchli yetkazish | TCP, UDP |\n| 3 - Tarmoq | Marshrutlash, manzillash | IP, ICMP |\n| 2 - Ma\'lumot ulanishi | Kadrlar, MAC manzil | Ethernet, Wi-Fi |\n| 1 - Fizik | Signallar, kabel | RJ45, optik |' },
    { type: 'note', content: '📡 TCP — ishonchli ulanishli protokol (ma\'lumot yetib borishi kafolatlanadi). UDP — tez, lekin ishonchsiz (video, o\'yin).' },
    { type: 'example', content: 'Veb-sahifa ochish:\n1) Brauzer (Amaliy) HTTP so\'rov yuboradi\n2) TCP (Transport) ulanish o\'rnatadi\n3) IP (Tarmoq) paketni marshrutlaydi\n4) Ethernet (Ulanish) kadrni uzatadi\n5) Fizik sath signalni yuboradi' },
  ], [
    { id: 'M12.04-q1', text: 'TCP protokoli qaysi OSI sathida ishlaydi?', options: ['Tarmoq', 'Transport', 'Amaliy', 'Fizik'], correctIndex: 1, explanation: 'TCP — Transport sathida ishlaydi, ishonchli yetkazishni ta\'minlaydi', type: 'Y1' },
    { id: 'M12.04-q2', text: 'IP protokoli qaysi vazifani bajaradi?', options: ['Ma\'lumotni shifrlash', 'Paketlarni marshrutlash', 'Sessiyani boshqarish', 'Ilovalar bilan ishlash'], correctIndex: 1, explanation: 'IP (Internet Protocol) — paketlarni manzil bo\'yicha marshrutlaydi', type: 'Y1' },
    { id: 'M12.04-q3', text: 'UDP protokoli TCP dan qanday farq qiladi?', options: ['Sekinroq', 'Ishonchsiz, lekin tez', 'Xavfsizroq', 'Faqat matn uchun'], correctIndex: 1, explanation: 'UDP — ulanishsiz, tez, lekin paket yetib borishini kafolatlamaydi', type: 'Y2' },
  ]),

  'M12.05': t('M12.05', 'IP manzil, maska va tarmoq hisobi', [
    { type: 'definition', content: 'IP manzil — tarmoqdagi har bir qurilmaga berilgan unikal raqamli identifikator. IPv4: 32 bitli, 4 oktet (masalan, 192.168.1.1). IPv6: 128 bitli.' },
    { type: 'table', content: '| Sinfli IPv4 | Manzil diapazoni | Qo\'llanishi |\n|-----------|-----------------|-----------|\n| A | 1.0.0.0 - 126.255.255.255 | Katta tarmoqlar |\n| B | 128.0.0.0 - 191.255.255.255 | O\'rta tarmoqlar |\n| C | 192.0.0.0 - 223.255.255.255 | Kichik tarmoqlar |\n| D | 224.0.0.0 - 239.255.255.255 | Multicast |\n| E | 240.0.0.0 - 255.255.255.255 | Eksperimental |' },
    { type: 'text', content: 'Tarmoq maskasi (subnet mask) — IP manzilning qaysi qismi tarmoq, qaysi qismi qurilma (host) ekanligini aniqlaydi. Xususiy IP manzillar: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.' },
    { type: 'note', content: '💡 Xususiy IP manzillar internetda ishlatilmaydi, faqat ichki tarmoqlar uchun. NAT orqali internetga chiqadi.' },
  ], [
    { id: 'M12.05-q1', text: 'IPv4 necha bitli manzil?', options: ['32', '64', '128', '16'], correctIndex: 0, explanation: 'IPv4 — 32 bitli, 4 oktet (8 bitdan)', type: 'Y1' },
    { id: 'M12.05-q2', text: '192.168.1.1 qanday turdagi IP manzil?', options: ['Internet', 'Xususiy (private)', 'Multicast', 'Loopback'], correctIndex: 1, explanation: '192.168.x.x — xususiy (private) IP manzil diapazoni', type: 'Y2' },
    { id: 'M12.05-q3', text: '/24 (CIDR) nechta IP manzilni bildiradi?', options: ['24', '256', '255', '16'], correctIndex: 1, explanation: '/24 = 256 ta manzil (255.255.255.0)', type: 'Y2' },
  ]),

  'M12.06': t('M12.06', 'Internet, brauzer va qidiruv', [
    { type: 'definition', content: 'Internet — global kompyuter tarmoqlari tizimi. Brauzer — veb-sahifalarni ko\'rish uchun dastur. Qidiruv tizimi — internetda ma\'lumot qidirish vositasi.' },
    { type: 'table', content: '| Brauzer | Ishlab chiqaruvchi | Dvigatel (Engine) |\n|---------|-----------------|-----------------|\n| Google Chrome | Google | Blink |\n| Mozilla Firefox | Mozilla | Gecko |\n| Safari | Apple | WebKit |\n| Microsoft Edge | Microsoft | Blink |\n| Opera | Opera Software | Blink |' },
    { type: 'text', content: 'Qidiruv tizimlari: Google (90%+ bozor), Bing, Yandex, DuckDuckGo (maxfiylik). Qidiruv operatorlari: "..." (aniq ibora), site: (sayt ichida), filetype: (fayl turi), - (so\'zni chiqarish).' },
    { type: 'note', content: '🌐 URL tuzilishi: protokol://domen/yol/fayl\n   https://example.com/informatika/darslik.pdf' },
  ], [
    { id: 'M12.06-q1', text: 'Veb-sahifalarni ko\'rish uchun qaysi dastur ishlatiladi?', options: ['Brauzer', 'Qidiruv tizimi', 'Server', 'Router'], correctIndex: 0, explanation: 'Brauzer (Chrome, Firefox) — veb-sahifalarni ko\'rish dasturi', type: 'Y1' },
    { id: 'M12.06-q2', text: 'Google Chrome qanday dvigateldan foydalanadi?', options: ['Gecko', 'WebKit', 'Blink', 'Trident'], correctIndex: 2, explanation: 'Chrome Blink dvigatelidan foydalanadi', type: 'Y1' },
    { id: 'M12.06-q3', text: 'Qidiruvda "informatika" so\'zini aniq shaklda qidirish uchun nima ishlatiladi?', options: ['*', '" "', '()', '[]'], correctIndex: 1, explanation: 'Qo\'shtirnoq " " — aniq iborani qidirish', type: 'Y2' },
  ]),

  'M12.07': t('M12.07', 'Elektron pochta', [
    { type: 'definition', content: 'Elektron pochta (email) — internet orqali xabar va fayllarni yuborish va qabul qilish tizimi. Protokollar: SMTP (yuborish), POP3/IMAP (qabul qilish).' },
    { type: 'table', content: '| Protokol | Vazifasi | Xususiyati |\n|---------|---------|-----------|\n| SMTP | Xabar yuborish | 25-port |\n| POP3 | Xabarlarni yuklab olish | 110-port, serverdan o\'chadi |\n| IMAP | Xabarlarni serverda o\'qish | 143-port, serverda saqlanadi |' },
    { type: 'text', content: 'Elektron pochta manzili: foydalanuvchi@domen.uz. Xizmatlar: Gmail, Outlook, Mail.ru, Yandex.Mail.' },
    { type: 'note', content: '📧 CC (Carbon Copy) — xabar nusxasini boshqa oluvchiga ham yuboradi. BCC (Blind Carbon Copy) — yashirin nusxa.' },
  ], [
    { id: 'M12.07-q1', text: 'Elektron pochta yuborish uchun qaysi protokol ishlatiladi?', options: ['HTTP', 'FTP', 'SMTP', 'POP3'], correctIndex: 2, explanation: 'SMTP (Simple Mail Transfer Protocol) — pochta yuborish uchun', type: 'Y1' },
    { id: 'M12.07-q2', text: 'IMAP va POP3 o\'rtasidagi farq?', options: ['IMAP tezroq', 'POP3 xabarlarni serverdan o\'chiradi', 'IMAP faqat yuboradi', 'Farqi yo\'q'], correctIndex: 1, explanation: 'POP3 xabarlarni kompyuterga yuklab olib, serverdan o\'chiradi. IMAP serverda saqlaydi', type: 'Y2' },
    { id: 'M12.07-q3', text: 'BCC nima?', options: ['Xabar nusxasi', 'Yashirin nusxa', 'Fayl biriktirish', 'Pochta filtri'], correctIndex: 1, explanation: 'BCC (Blind Carbon Copy) — oluvchilar bir-birini ko\'rmaydigan yashirin nusxa', type: 'Y2' },
  ]),

  'M12.08': t('M12.08', 'Bulutli texnologiyalar', [
    { type: 'definition', content: 'Bulutli hisoblash — kompyuter resurslarini (server, xotira, dastur) internet orqali talab bo\'yicha yetkazib berish modeli.' },
    { type: 'table', content: '| Xizmat modeli | Izoh | Misol |\n|-------------|------|------|\n| IaaS | Infrastruktura (virtual server) | AWS EC2, Google Compute |\n| PaaS | Platforma (dastur ishlab chiqarish) | Heroku, Google App Engine |\n| SaaS | Dastur (tayyor ilova) | Google Docs, Office 365 |\n| DaaS | Ish stoli (masofaviy ish stoli) | Windows Virtual Desktop |' },
    { type: 'table', content: '| Bulut turi | Qamrovi |\n|-----------|---------|\n| Public (Ommaviy) | Internet orqali hamma uchun |\n| Private (Xususiy) | Bir tashkilot ichida |\n| Hybrid (Aralash) | Ommaviy + xususiy birlashmasi |\n| Community | Bir nechta tashkilot |' },
    { type: 'note', content: '☁️ Bulutli texnologiyalar afzalliklari: tejamkorlik, masshtablash, moslashuvchanlik, xavfsizlik.' },
    { type: 'example', content: 'Bulutli xizmatlar: Google Drive, Dropbox, iCloud, OneDrive, AWS S3.' },
  ], [
    { id: 'M12.08-q1', text: 'SaaS modeli nima?', options: ['Virtual server', 'Tayyor dastur', 'Dastur platformasi', 'Ma\'lumotlar bazasi'], correctIndex: 1, explanation: 'SaaS (Software as a Service) — tayyor dastur xizmati', type: 'Y1' },
    { id: 'M12.08-q2', text: 'Quyidagilardan qaysi biri bulutli xizmat?', options: ['MS Word', 'Google Drive', 'Paint', 'Kalkulyator'], correctIndex: 1, explanation: 'Google Drive — bulutli fayl saqlash xizmati', type: 'Y1' },
    { id: 'M12.08-q3', text: 'Public cloud va Private cloud farqi?', options: ['Narxda', 'Qamrovda (ommaviy/bir tashkilot)', 'Tezlikda', 'Xavfsizlikda'], correctIndex: 1, explanation: 'Public cloud hamma uchun ochiq, Private cloud bir tashkilot ichida ishlatiladi', type: 'Y2' },
  ]),

  'M12.09': t('M12.09', 'IoT, VR, AR va mobil texnologiyalar', [
    { type: 'definition', content: 'IoT (Internet of Things) — jismoniy qurilmalarni internetga ulash tizimi. VR (Virtual Reality) — sun\'iy muhit. AR (Augmented Reality) — real muhitga virtual qo\'shish.' },
    { type: 'table', content: '| Texnologiya | Izoh | Misol |\n|-----------|------|------|\n| IoT | Qurilmalar interneti | Aqlli uy, smartwatch |\n| VR | Virtual voqelik | Oculus Rift, VR o\'yinlar |\n| AR | To\'ldirilgan voqelik | Pokemon Go, IKEA Place |\n| Mobil | Mobil qurilma texnologiyalari | Android, iOS ilovalar |' },
    { type: 'text', content: 'Mobil texnologiyalar: 4G/LTE (tez internet), 5G (juda tez, past kechikish), NFC (temassiz to\'lov), Bluetooth, GPS.' },
    { type: 'note', content: '🌍 5G — 5-avlod mobil aloqa, 10 Gbit/s gacha tezlik, 1 ms kechikish. IoT, VR, avtonom mashinalar uchun muhim.' },
  ], [
    { id: 'M12.09-q1', text: 'IoT nimani anglatadi?', options: ['Virtual voqelik', 'Qurilmalar interneti', 'Mobil texnologiya', 'Bulutli hisoblash'], correctIndex: 1, explanation: 'IoT (Internet of Things) — jismoniy qurilmalarni internetga ulash', type: 'Y1' },
    { id: 'M12.09-q2', text: 'VR va AR o\'rtasidagi asosiy farq?', options: ['VR narxi arzon', 'VR to\'liq sun\'iy muhit, AR realga qo\'shadi', 'AR faqat mobil', 'VR faqat o\'yin uchun'], correctIndex: 1, explanation: 'VR virtual muhit yaratadi, AR real muhitga virtual obyektlarni qo\'shadi', type: 'Y2' },
    { id: 'M12.09-q3', text: 'Temassiz to\'lov uchun qaysi texnologiya ishlatiladi?', options: ['Bluetooth', 'Wi-Fi', 'NFC', 'GPS'], correctIndex: 2, explanation: 'NFC (Near Field Communication) — temassiz to\'lov va ma\'lumot almashish', type: 'Y1' },
  ]),
// ============================================================
  // M13 — Axborot xavfsizligi va raqamli xizmatlar
  // ============================================================
  'M13.01': t('M13.01', 'Axborot xavfsizligi tahdidlari', [
    { type: 'definition', content: 'Axborot xavfsizligi — axborotni ruxsatsiz kirish, o\'zgartirish, yo\'q qilish va tarqatishdan himoya qilish. Uch asosiy tamoyil: konfidensiallik, yaxlitlik, mavjudlik (CIA triad).' },
    { type: 'table', content: '| Tahdid turi | Ta\'rifi |\n|-----------|--------|\n| Ruxsatsiz kirish | Parolni o\'g\'irlash, tarmoqqa noqonuniy ulanish |\n| Ma\'lumot yo\'qolishi | Server ishdan chiqishi, foydalanuvchi xatosi |\n| Ma\'lumot o\'zgartirish | Virus, xakerlik hujumi |\n| Xizmatni rad etish | DDoS hujumlari (server band qilish) |\n| Shaxsiy ma\'lumot o\'g\'irlanishi | Identity theft, fishing |\n| Ichki tahdidlar | Xodim tomonidan ma\'lumot sizdirilishi |' },
    { type: 'text', content: 'CIA triad: Confidentiality (maxfiylik) — ma\'lumot faqat ruxsat etilgan shaxslarga ochiq. Integrity (yaxlitlik) — ma\'lumot to\'g\'ri va o\'zgartirilmagan. Availability (mavjudlik) — ma\'lumot kerakli vaqtda foydalanish mumkin.' },
    { type: 'note', content: '🛡️ Axborot xavfsizligi buzilishi oqibatlari: moliyaviy zarar, obro\' yo\'qotish, ma\'muriy javobgarlik, ma\'lumotlar yo\'qolishi.' },
  ], [
    { id: 'M13.01-q1', text: 'CIA triad qanday uch tamoyildan iborat?', options: ['Maxfiylik, yaxlitlik, mavjudlik', 'Tezlik, sifat, narx', 'Aniqlik, to\'liqlik, dolzarblik', 'Xavfsizlik, maxfiylik, ishonchlilik'], correctIndex: 0, explanation: 'CIA — Confidentiality, Integrity, Availability', type: 'Y1' },
    { id: 'M13.01-q2', text: 'DDoS hujumi nima bilan tavsiflanadi?', options: ['Parol o\'g\'irlash', 'Serverni so\'rovlar bilan band qilish', 'Ma\'lumot shifrlash', 'Fayl o\'chirish'], correctIndex: 1, explanation: 'DDoS — serverni ko\'plab so\'rovlar bilan band qilish', type: 'Y1' },
    { id: 'M13.01-q3', text: 'Yaxlitlik tamoyili (Integrity) nimani anglatadi?', options: ['Ma\'lumot faqat ruxsat etilganlarga ochiq', 'Ma\'lumot o\'zgartirilmagan va to\'g\'ri', 'Ma\'lumot doim mavjud', 'Ma\'lumot tez uzatiladi'], correctIndex: 1, explanation: 'Yaxlitlik — ma\'lumotning ruxsatsiz o\'zgartirilmaganligi va to\'g\'riligi', type: 'Y2' },
  ]),

  'M13.02': t('M13.02', 'Zararli dastur va phishing', [
    { type: 'definition', content: 'Zararli dastur (malware) — kompyuter tizimiga zarar yetkazish uchun yaratilgan dastur. Phishing — soxta xabarlar orqali maxfiy ma\'lumotlarni olish usuli.' },
    { type: 'table', content: '| Zararli dastur | Vazifasi |\n|--------------|---------|\n| Virus | Fayllarni zararlaydi, tarqaladi |\n| Worm | Tarmoq orqali o\'z-o\'zidan tarqaladi |\n| Trojan (Troyan) | Foydali dastur ko\'rinishida |\n| Ransomware | Ma\'lumotni shifrlab, to\'lov talab qiladi |\n| Spyware | Maxfiy ma\'lumotlarni yig\'adi |\n| Adware | Bezovta qiluvchi reklamalar |\n| Rootkit | Tizimni chuqur yashirin boshqarish |' },
    { type: 'text', content: 'Phishing usullari: soxta email (bank nomidan), soxta veb-sayt, SMS phishing (smishing), ovozli phishing (vishing). Belgilari: shoshilinch talab, shubhali havola, imlo xatolari, noma\'lum jo\'natuvchi.' },
    { type: 'note', content: '⚠️ Phishingdan saqlanish: havolani tekshirmasdan bosmang, shaxsiy ma\'lumotni emailda yubormang, ikki faktorli autentifikatsiyani yoqing.' },
    { type: 'example', content: 'Phishing namunasi:\n"So\'nggi hisobingiz bloklandi. Parolingizni tiklash uchun havoni bosing."\n— Bu soxta xabar. Bank hech qachon email orqali parol so\'ramaydi.' },
  ], [
    { id: 'M13.02-q1', text: 'Ma\'lumotni shifrlab, to\'lov talab qiladigan zararli dastur?', options: ['Virus', 'Trojan', 'Ransomware', 'Spyware'], correctIndex: 2, explanation: 'Ransomware — ma\'lumotni shifrlab, to\'lov talab qiladi', type: 'Y1' },
    { id: 'M13.02-q2', text: 'Phishing nima?', options: ['Tarmoq hujumi', 'Maxfiy ma\'lumotni olish usuli', 'Dasturlash xatosi', 'Shifrlash usuli'], correctIndex: 1, explanation: 'Phishing — soxta xabarlar orqali maxfiy ma\'lumotlarni olish', type: 'Y1' },
    { id: 'M13.02-q3', text: 'Tarmoq orqali o\'z-o\'zidan tarqaladigan zararli dastur?', options: ['Virus', 'Worm', 'Trojan', 'Adware'], correctIndex: 1, explanation: 'Worm (qurt) — tarmoq orqali mustaqil tarqaladi', type: 'Y2' },
  ]),

  'M13.03': t('M13.03', 'Antivirus va himoya vositalari', [
    { type: 'definition', content: 'Antivirus — zararli dasturlarni aniqlash, oldini olish va yo\'q qilish uchun dastur. Himoya vositalari — xavfsizlikni ta\'minlovchi dasturiy va apparat vositalar.' },
    { type: 'table', content: '| Himoya vositasi | Vazifasi |\n|----------------|---------|\n| Antivirus | Zararli dasturlarni aniqlash va yo\'q qilish |\n| Firewall | Tarmoq trafigini filtrlash |\n| Antispyware | Josus dasturlaridan himoya |\n| IDS/IPS | Hujumni aniqlash/oldini olish |\n| VPN | Shifrlangan ulanish |\n| Autentifikatsiya | Foydalanuvchini aniqlash (parol, biometric) |' },
    { type: 'text', content: 'Antiviruslar: Kaspersky, Norton, ESET NOD32, Bitdefender, Windows Defender. Aniqlash usullari: signatura tahlili, evristik tahlil, xulq-atvor tahlili.' },
    { type: 'note', content: '🛡️ Antivirusni doim yangilab turish kerak — yangi zararli dasturlar har kuni paydo bo\'ladi.' },
  ], [
    { id: 'M13.03-q1', text: 'Antivirusning asosiy vazifasi?', options: ['Internet tezligini oshirish', 'Zararli dasturlarni aniqlash va yo\'q qilish', 'Disklarni tozalash', 'Shriftlarni boshqarish'], correctIndex: 1, explanation: 'Antivirus — zararli dasturlarni aniqlaydi va yo\'q qiladi', type: 'Y1' },
    { id: 'M13.03-q2', text: 'Firewall nima vazifani bajaradi?', options: ['Ma\'lumotlarni shifrlash', 'Tarmoq trafigini filtrlash', 'Fayllarni zaxiralash', 'Parollarni saqlash'], correctIndex: 1, explanation: 'Firewall — tarmoq orqali kiruvchi/chiquvchi trafikni boshqaradi', type: 'Y1' },
    { id: 'M13.03-q3', text: 'Signatura tahlili qanday ishlaydi?', options: ['Dastur xulq-atvorini tahlil qiladi', 'Ma\'lum zararli dasturlar bazasi bilan solishtiradi', 'Tarmoq trafigini tekshiradi', 'Foydalanuvchi harakatini kuzatadi'], correctIndex: 1, explanation: 'Signatura tahlili — faylni ma\'lum zararli dasturlar signaturalari bilan solishtirish', type: 'Y2' },
  ]),

  'M13.04': t('M13.04', 'Zaxiralash va shifrlash', [
    { type: 'definition', content: 'Zaxiralash (backup) — ma\'lumotlarning nusxasini yaratish va xavfsiz joyda saqlash. Shifrlash — ma\'lumotni faqat kalit bilan o\'qish mumkin bo\'lgan formatga aylantirish.' },
    { type: 'table', content: '| Zaxiralash usuli | Izoh |\n|-----------------|------|\n| To\'liq (Full) | Barcha ma\'lumotlar nusxasi |\n| Differensial | Oxirgi to\'liq backupdan keyingi o\'zgarishlar |\n| Incremental | Oxirgi backupdan (har qanday) keyingi o\'zgarishlar |\n| Bulutli | Internet orqali masofaviy saqlash |\n| Jismoniy | Tashqi disk, USB, magnit lenta |' },
    { type: 'table', content: '| Shifrlash turi | Izoh | Misol |\n|--------------|------|------|\n| Simmetrik | Bir kalit (shifrlash + deshifrlash) | AES, DES |\n| Asimmetrik | Ikki kalit (ochiq + yopiq) | RSA, ECC |\n| Hash | Bir tomonlama shifrlash | SHA-256 |' },
    { type: 'note', content: '💾 3-2-1 qoidasi: Ma\'lumotning 3 nusxasi, 2 xil muhitda, 1 nusxasi masofada.' },
  ], [
    { id: 'M13.04-q1', text: '3-2-1 backup qoidasi bo\'yicha necha nusxa bo\'lishi kerak?', options: ['1', '2', '3', '4'], correctIndex: 2, explanation: '3-2-1 qoidasi: 3 nusxa, 2 xil muhit, 1 masofada', type: 'Y1' },
    { id: 'M13.04-q2', text: 'Simmetrik shifrlashda nechta kalit ishlatiladi?', options: ['1', '2', '3', '4'], correctIndex: 0, explanation: 'Simmetrik shifrlashda bitta kalit', type: 'Y1' },
    { id: 'M13.04-q3', text: 'Asimmetrik shifrlashning afzalligi?', options: ['Tezroq', 'Xavfsizroq (kalit almashish muammosi yo\'q)', 'Kam resurs talab qiladi', 'Oddiyroq'], correctIndex: 1, explanation: 'Ochiq kalitni hamma bilishi mumkin, yopiq kalit faqat egasida', type: 'Y2' },
  ]),

  'M13.05': t('M13.05', 'Elektron imzo, hujjat va hukumat', [
    { type: 'definition', content: 'Elektron imzo — hujjatning haqiqiyligini va muallifligini tasdiqlovchi elektron ma\'lumot. Elektron hukumat (e-Government) — davlat xizmatlarini internet orqali ko\'rsatish.' },
    { type: 'table', content: '| Xizmat | Izoh |\n|--------|------|\n| Elektron imzo | Hujjatni tasdiqlash (raqamli sertifikat) |\n| Elektron hujjat | Qog\'ozsiz hujjat aylanishi |\n| my.gov.uz | Yagona davlat xizmatlari portali |\n| E-ITO | Elektron ishonchli xizmatlar |\n| ERI | Elektron raqamli imzo (O\'zbekiston) |' },
    { type: 'text', content: 'Elektron imzo asimmetrik shifrlashga asoslangan. O\'zbekistonda "Elektron hujjat aylanishi to\'g\'risida" qonun asosida tartibga solinadi.' },
    { type: 'example', content: 'Elektron imzo qo\'llanishi:\n- Soliq hisobotlarini topshirish\n- Davlat xaridlari tenderlari\n- Bank operatsiyalari\n- Shartnomalar imzolash' },
    { type: 'note', content: '📄 my.gov.uz portali 50+ davlat xizmatini ko\'rsatadi.' },
  ], [
    { id: 'M13.05-q1', text: 'Elektron imzo nima vazifani bajaradi?', options: ['Hujjatni shifrlash', 'Hujjatning haqiqiyligini tasdiqlash', 'Hujjatni o\'chirish', 'Hujjatni chop etish'], correctIndex: 1, explanation: 'Elektron imzo — hujjatning haqiqiyligi va muallifligini tasdiqlaydi', type: 'Y1' },
    { id: 'M13.05-q2', text: 'O\'zbekistonda davlat xizmatlari portali?', options: ['gov.uz', 'my.gov.uz', 'e-gov.uz', 'davlat.uz'], correctIndex: 1, explanation: 'my.gov.uz — Yagona davlat xizmatlari portali', type: 'Y1' },
    { id: 'M13.05-q3', text: 'Elektron imzo qanday shifrlash turiga asoslangan?', options: ['Simmetrik', 'Asimmetrik', 'Hash', 'Teskari'], correctIndex: 1, explanation: 'Elektron imzo asimmetrik shifrlash asosida ishlaydi', type: 'Y2' },
  ]),

  'M13.06': t('M13.06', 'Elektron tijorat, to\'lov va blockchain', [
    { type: 'definition', content: 'Elektron tijorat (e-commerce) — tovar va xizmatlarni internet orqali sotib olish va sotish. Elektron to\'lov — internet orqali pul o\'tkazmalari. Blockchain — ma\'lumotni zanjirli bloklarda saqlash texnologiyasi.' },
    { type: 'table', content: '| Model | Ta\'rifi | Misol |\n|-------|--------|------|\n| B2B | Kompaniyalar o\'rtasida | Alibaba |\n| B2C | Kompaniyadan iste\'molchiga | Amazon, Uzum |\n| C2C | Iste\'molchilar o\'rtasida | OLX, Etsy |\n| C2B | Iste\'molchidan kompaniyaga | Freelance platforma |' },
    { type: 'text', content: 'Elektron to\'lov tizimlari: plastik kartalar (UzCard, HUMO, VISA, MasterCard), elektron hamyonlar (PayPal), mobil to\'lovlar (Payme, Click, Apelsin).' },
    { type: 'table', content: '| Xususiyat | Blockchain | An\'anaviy baza |\n|-----------|------------|----------------|\n| Boshqaruv | Markazlashmagan | Markazlashgan |\n| Ma\'lumot | O\'zgartirilmaydi | O\'zgartirish mumkin |\n| Misol | Bitcoin, Ethereum | PostgreSQL |' },
    { type: 'note', content: '₿ Blockchain — kriptovalyutalar (Bitcoin, Ethereum) asosi.' },
  ], [
    { id: 'M13.06-q1', text: 'B2C modelida kim kimga sotadi?', options: ['Kompaniya kompaniyaga', 'Kompaniya iste\'molchiga', 'Iste\'molchi iste\'molchiga', 'Iste\'molchi kompaniyaga'], correctIndex: 1, explanation: 'B2C — Business-to-Customer', type: 'Y1' },
    { id: 'M13.06-q2', text: 'Blockchain ma\'lumotlarni qanday saqlaydi?', options: ['Jadvalda', 'Zanjirli bloklarda', 'Daraxtda', 'Ro\'yxatda'], correctIndex: 1, explanation: 'Blockchain — o\'zaro bog\'langan bloklar zanjiri', type: 'Y1' },
    { id: 'M13.06-q3', text: 'O\'zbekistonda keng tarqalgan mobil to\'lov tizimi emas?', options: ['Payme', 'Click', 'Apelsin', 'PayPal'], correctIndex: 3, explanation: 'PayPal O\'zbekistonda kam tarqalgan', type: 'Y2' },
  ]),

  'M13.07': t('M13.07', 'SMM va auditoriya', [
    { type: 'definition', content: 'SMM (Social Media Marketing) — ijtimoiy tarmoqlar orqali marketing va reklama faoliyati. Auditoriya — maqsadli foydalanuvchilar guruhi.' },
    { type: 'text', content: 'Ijtimoiy tarmoqlar: Facebook, Instagram, Telegram, YouTube, TikTok, LinkedIn. SMM strategiyasi: maqsad, auditoriya, kontent reja, post berish jadvali, tahlil.' },
    { type: 'table', content: '| Platforma | Auditoriya | Kontent turi |\n|----------|-----------|------------|\n| Instagram | Yoshlar (18-35) | Rasm, video, stories |\n| Telegram | Keng (16-60) | Matn, kanal, bot |\n| YouTube | Barcha yosh | Video (5-60 min) |\n| TikTok | O\'smirlar (13-24) | Qisqa video (15-60 soniya) |\n| Facebook | Kattalar (25-55) | Matn, rasm, video |' },
    { type: 'note', content: '📊 SMM samaradorligini o\'lchash: reach, engagement, conversion, ROI.' },
  ], [
    { id: 'M13.07-q1', text: 'SMM nimaning qisqartmasi?', options: ['Social Media Management', 'Social Media Marketing', 'Site Media Marketing', 'Social Mobile Marketing'], correctIndex: 1, explanation: 'SMM — Social Media Marketing', type: 'Y1' },
    { id: 'M13.07-q2', text: 'Qisqa video formatiga mos platforma?', options: ['Facebook', 'LinkedIn', 'TikTok', 'Telegram'], correctIndex: 2, explanation: 'TikTok — qisqa video platformasi', type: 'Y1' },
    { id: 'M13.07-q3', text: 'SMM da ROI nimani anglatadi?', options: ['Postlar soni', 'Investitsiya qaytimi', 'Obunachilar soni', 'Reklama narxi'], correctIndex: 1, explanation: 'ROI (Return on Investment) — investitsiya qaytimi', type: 'Y2' },
  ]),

  'M13.08': t('M13.08', 'CMS', [
    { type: 'definition', content: 'CMS (Content Management System) — veb-sayt mazmunini boshqarish tizimi. Kod bilmagan foydalanuvchilarga ham sayt yaratish imkonini beradi.' },
    { type: 'table', content: '| CMS | Xususiyati | Qo\'llanishi |\n|-----|-----------|-----------|\n| WordPress | Eng mashhur (40%+ saytlar) | Blog, korporativ, e-commerce |\n| Joomla | Moslashuvchan, murakkab | Portal, forum |\n| Drupal | Kuchli, xavfsiz | Davlat, universitet |\n| OpenCart | E-commerce uchun | Onlayn do\'kon |\n| 1C-Bitrix | Biznes uchun | Korporativ |' },
    { type: 'text', content: 'CMS xususiyatlari: mazmun yaratish va tahrirlash (WYSIWYG), foydalanuvchi boshqaruvi, template/dizayn, kengaytmalar (plugin), SEO.' },
    { type: 'note', content: '🌐 WordPress — eng keng tarqalgan CMS. Saytlarning 40% dan ortig\'i WordPress da ishlaydi.' },
  ], [
    { id: 'M13.08-q1', text: 'Eng keng tarqalgan CMS qaysi?', options: ['Joomla', 'WordPress', 'Drupal', 'OpenCart'], correctIndex: 1, explanation: 'WordPress — eng mashhur CMS', type: 'Y1' },
    { id: 'M13.08-q2', text: 'CMS ning asosiy vazifasi?', options: ['Grafika tahrirlash', 'Veb-sayt mazmunini boshqarish', 'Video montaj', 'Elektron pochta'], correctIndex: 1, explanation: 'CMS — sayt mazmunini boshqarish tizimi', type: 'Y1' },
    { id: 'M13.08-q3', text: 'WYSIWYG nima?', options: ['Dasturlash tili', 'Kod yozmasdan vizual tahrirlash', 'Xavfsizlik protokoli', 'Shifrlash usuli'], correctIndex: 1, explanation: 'WYSIWYG — What You See Is What You Get', type: 'Y2' },
  ]),

  'M13.09': t('M13.09', 'LMS', [
    { type: 'definition', content: 'LMS (Learning Management System) — ta\'lim jarayonini boshqarish tizimi. O\'quv kurslarini yaratish, tarqatish va boshqarish imkonini beradi.' },
    { type: 'table', content: '| LMS | Xususiyati | Qo\'llanishi |\n|-----|-----------|-----------|\n| Moodle | Bepul, ochiq kod, keng imkoniyatli | Universitet, maktab |\n| Google Classroom | Bepul, Google integratsiyasi | Maktab |\n| Canvas | Zamonaviy, qulay interfeys | OTM |\n| Edmodo | Ijtimoiy tarmoqqa o\'xshash | Maktab |\n| Blackboard | Professional, pullik | Universitet |' },
    { type: 'text', content: 'LMS imkoniyatlari: kurslar va darslar yaratish, topshiriq berish, test va baholash, forum va chat, progress kuzatish, sertifikat berish.' },
    { type: 'note', content: '📚 Moodle — eng keng tarqalgan ochiq kodli LMS. Google Classroom — maktablar uchun bepul.' },
  ], [
    { id: 'M13.09-q1', text: 'Ochiq kodli eng mashhur LMS qaysi?', options: ['Google Classroom', 'Moodle', 'Canvas', 'Blackboard'], correctIndex: 1, explanation: 'Moodle — ochiq kodli, eng keng tarqalgan LMS', type: 'Y1' },
    { id: 'M13.09-q2', text: 'LMS ning asosiy vazifasi?', options: ['Sayt yaratish', 'Ta\'lim jarayonini boshqarish', 'Grafika tahrirlash', 'Moliya boshqaruvi'], correctIndex: 1, explanation: 'LMS — Learning Management System', type: 'Y1' },
    { id: 'M13.09-q3', text: 'Google Classroom qanday LMS turi?', options: ['Pullik', 'Bepul, bulutli', 'Server talab qiladi', 'Ochiq kodli'], correctIndex: 1, explanation: 'Google Classroom — bepul, bulutli (SaaS) LMS', type: 'Y2' },
  ]),

  'M13.10': t('M13.10', 'MOOC', [
    { type: 'definition', content: 'MOOC (Massive Open Online Course) — ommaviy ochiq onlayn kurslar. Katta miqdordagi ishtirokchilar uchun ochiq, internet orqali o\'qitish platformasi.' },
    { type: 'table', content: '| Platforma | Xususiyati |\n|----------|-----------|\n| Coursera | Universitet kurslari, sertifikat |\n| edX | Harvard, MIT kurslari |\n| Udemy | Turli mavzular, pullik/bepul |\n| Khan Academy | Bepul, maktab darajasi |\n| FutureLearn | Britaniya universitetlari |' },
    { type: 'text', content: 'MOOC xususiyatlari: bepul yoki arzon, katta auditoriya, video darslar, interfaol topshiriqlar, forum, sertifikat.' },
    { type: 'note', content: '🎓 Coursera va edX — eng nufuzli MOOC platformalari.' },
  ], [
    { id: 'M13.10-q1', text: 'MOOC nimaning qisqartmasi?', options: ['Modern Online Open Course', 'Massive Open Online Course', 'Mobile Online Open Class', 'Multi-User Open Online Course'], correctIndex: 1, explanation: 'MOOC — Massive Open Online Course', type: 'Y1' },
    { id: 'M13.10-q2', text: 'Quyidagilardan qaysi biri MOOC platformasi?', options: ['Moodle', 'Google Classroom', 'Coursera', 'WordPress'], correctIndex: 2, explanation: 'Coursera — MOOC platformasi', type: 'Y1' },
    { id: 'M13.10-q3', text: '"Ochiq" (Open) xususiyati nimani anglatadi?', options: ['Kod ochiq', 'Bepul va hamma uchun ochiq', 'Ochiq havoda', 'Hafta ochiq'], correctIndex: 1, explanation: '"Ochiq" — kursga hamma bepul qatnashishi mumkin', type: 'Y2' },
  ]),

  'M13.11': t('M13.11', 'Web-freelance', [
    { type: 'definition', content: 'Freelance — mustaqil ravishda, uzoq muddatli shartnomasiz ishlash. Web-freelance — internet orqali masofaviy ishlash, buyurtmalarni onlayn platformalarda topish.' },
    { type: 'table', content: '| Platforma | Yo\'nalish |\n|----------|----------|\n| Upwork | Global, ko\'p yo\'nalish |\n| Freelancer | Global, loyiha asosida |\n| Fiverr | Xizmatlar (gig iqtisodiyoti) |\n| TopTal | Yuqori malakali IT mutaxassislar |\n| Kwork | Byudjetli xizmatlar |' },
    { type: 'text', content: 'Web-freelance yo\'nalishlari: veb-dasturlash, grafik dizayn, kontent yozish, SEO, SMM, video muharrir, tarjima.' },
    { type: 'example', content: 'Freelance boshlash:\n1) Yo\'nalish tanlash\n2) Portfolio yaratish\n3) Platformada ro\'yxatdan o\'tish\n4) Birinchi buyurtmalar (kichik, arzon)\n5) Reyting va tajriba orttirish\n6) Narxlarni oshirish' },
    { type: 'note', content: '💻 Freelance afzalliklari: erkin jadval, istalgan joyda ishlash. Kamchiliklari: barqaror daromadsizlik, raqobat.' },
  ], [
    { id: 'M13.11-q1', text: 'Freelance nima?', options: ['Ofisda ishlash', 'Mustaqil, shartnomasiz ishlash', 'Davlat xizmati', 'Ishchi kuni 8 soat'], correctIndex: 1, explanation: 'Freelance — mustaqil ishlash shakli', type: 'Y1' },
    { id: 'M13.11-q2', text: 'Global freelance platformalaridan biri?', options: ['Instagram', 'Upwork', 'Telegram', 'Google'], correctIndex: 1, explanation: 'Upwork — eng yirik global freelance platformasi', type: 'Y1' },
    { id: 'M13.11-q3', text: 'Freelance uchun eng muhim narsa?', options: ['Ofis maydoni', 'Portfolio va reyting', 'Mansab maoshi', 'Ish vaqti'], correctIndex: 1, explanation: 'Portfolio va ijobiy reyting buyurtmalar olish uchun muhim', type: 'Y2' },
  ]),

  // ============================================================
  // M14 — Kasb standarti
  // ============================================================
  'M14.01': t('M14.01', "O‘quv jarayonini rejalashtirish", [
    { type: 'definition', content: "O‘quv jarayonini rejalashtirish — DTS va o‘quv dasturi maqsadlarini o‘quvchining ehtiyojiga mos, aniq va o‘lchanadigan natijalar, o‘qitish usullari hamda baholash dalillariga aylantirishdir." },
    { type: 'table', content: "| Rejalash elementi | Manbadagi vazifa |\n|---|---|\n| DTS va o‘quv dasturi | Maqsadlarni o‘quv faoliyatiga moslashtirish |\n| O‘quvchi ehtiyoji | Qiziqish, yosh, individual farq va oldingi baholashni inobatga olish |\n| Natija va mezon | Darsda nimaga erishilishini tekshirish mumkin bo‘lgan shaklda belgilash |\n| Metod va resurs | Namoyish, tarqatma, AKT va vaqtni maqsadga muvofiq tanlash |\n| Fanlararo aloqa | Korrelyatsiya va integratsiyani mazmun bilan bog‘lash |" },
    { type: 'example', content: "Informatika darsida «algoritm turlari»ni shunchaki «o‘rganish» emas, «berilgan uchta vaziyat uchun mos algoritm tuzilmasini tanlab, sababini izohlash» maqsadi bilan rejalang; yakundagi misol topshiriq aynan shu natijani tekshiradi." },
    { type: 'note', content: "Rejada jihoz va slaydlar sanab o‘tilgani o‘quvchi erishishi kutilgan natija aniq belgilanganini anglatmaydi." },
    { type: 'source', content: "Asos: «Kasb-standarti.pdf» — «Umumiy o‘rta ta’lim maktabi o‘qituvchisining kasb standarti» matnli nusxasi, barnoyevak Drive/pedagogika/files (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view). Bu ko‘chirma sifatida tekshirilgan; normativ hujjatning kuchga kirishi va PDF fizik beti alohida verifikatsiyaga muhtoj." },
  ], []),

  'M14.02': t('M14.02', "Ta’lim samaradorligini ta’minlash", [
    { type: 'definition', content: "Ta’lim samaradorligini ta’minlash — o‘quvchilarga maqsadga mos faol o‘rganish, individual yordam, hayotiy kontekst va natijalarga qarab moslashtiriladigan o‘qitishni tashkil etishdir." },
    { type: 'table', content: "| Amaliy mezon | O‘qituvchining harakati |\n|---|---|\n| Faol metodlar | Muhokama, tajriba, amaliy va jamoaviy ishni tashkil qilish |\n| Differensial yordam | O‘quvchining ehtiyojiga mos yordamni o‘z vaqtida berish |\n| Metakognitsiya | O‘quvchiga rejalash, o‘z ishini nazorat qilish va o‘zini baholashni o‘rgatish |\n| Baholash dalili | Kuzatish va natijaga qarab metod yoki darsni moslashtirish |\n| Maqsadga mos AKT | Texnologiyani o‘rganishga xizmat qiladigan joyda ishlatish |" },
    { type: 'example', content: "Scratch loyihasida xatolar ko‘p bo‘lsa, faqat natija uchun ball qo‘ymang: o‘quvchidan sinagan yechimini tushuntirishni so‘rang, ehtiyojiga qarab ko‘rsatma bering va keyingi kichik vazifani moslang." },
    { type: 'note', content: "Metakognitiv strategiya — o‘quvchining «qanday o‘rganaman, qayerda qiynaldim va keyin nimani o‘zgartiraman?» degan savollar ustida ishlashidir. AKTdan foydalanish o‘z-o‘zidan samaradorlikning isboti emas." },
    { type: 'source', content: "Asos: «Kasb-standarti.pdf» — «Umumiy o‘rta ta’lim maktabi o‘qituvchisining kasb standarti» matnli nusxasi, barnoyevak Drive/pedagogika/files (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view). Bu ko‘chirma sifatida tekshirilgan; normativ hujjatning kuchga kirishi va PDF fizik beti alohida verifikatsiyaga muhtoj." },
  ], []),

  'M14.03': t('M14.03', "Baholash va qayta aloqa", [
    { type: 'definition', content: "Baholash — maqsadga mos dalillarni yig‘ish va ulardan o‘quvchining o‘zlashtirishi haqida xulosa qilish; qayta aloqa esa natijaga tayanib o‘quvchiga keyingi rivojlanish yo‘lini ko‘rsatishdir." },
    { type: 'table', content: "| Pedagogik baholash | Qachon va nima uchun? |\n|---|---|\n| Diagnostik | Boshlang‘ich bilim yoki qiyinchilikni aniqlash |\n| Formativ | O‘rganish davomida xatoni ko‘rib, yordam va o‘qitishni moslashtirish |\n| Summativ | Belgilangan bosqich yakunida erishilgan natijani umumlashtirish |" },
    { type: 'text', content: "Kasb standarti diagnostika va baholash usullaridan foydalanish, natijani tizimli tahlil qilish, qo‘yilgan bahoni asoslash hamda zarur paytda hamkasb va mutaxassis bilan maslahatlashishni nazarda tutadi. «Diagnostik / formativ / summativ» bu yerda pedagogik maqsadni farqlash uchun ishlatilgan; muayyan baho shkalasini o‘z-o‘zidan belgilamaydi." },
    { type: 'example', content: "O‘quvchi Python siklida xatoga yo‘l qo‘ysa, uning sababini dars davomida topib ko‘rsatma berish — formativ qayta aloqa. Dastlabki tayyorgarlikni bilish — diagnostik, bo‘lim yakunini mezon asosida baholash — summativ." },
    { type: 'note', content: "Test, og‘zaki savol, jadval yoki kuzatishning qaysi baholash turiga kirishi vositaning nomiga emas, undan foydalanish maqsadiga bog‘liq. «O‘zbekistonda faqat 5 ballik tizim» kabi umumiy normativ da’vo qilinmaydi." },
    { type: 'source', content: "Asos: «Kasb-standarti.pdf» — «Umumiy o‘rta ta’lim maktabi o‘qituvchisining kasb standarti» matnli nusxasi, barnoyevak Drive/pedagogika/files (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view). Bu ko‘chirma sifatida tekshirilgan; normativ hujjatning kuchga kirishi va PDF fizik beti alohida verifikatsiyaga muhtoj." },
    { type: 'heading', content: 'Baholash maqsadi bilan natijani talqin qilish mezonini farqlang' },
    { type: 'definition', content: '**Domen** — baholanayotgan bilim, ko‘nikma va kompetensiyalar majmui; **konstrukt** — shu doirada o‘lchanishi kerak bo‘lgan muayyan xususiyat. **Validlik** testdan olingan natija asosida chiqariladigan xulosa va qarorning maqsadga qanchalik asosli ekanligi bilan bog‘liq; faqat chiroyli savol tuzish emas.' },
    { type: 'table', content: '| Natijani talqin qilish turi | Natija nimaga nisbatan solishtiriladi? |\n|---|---|\n| Normaga mo‘ljallangan | Taqqoslanadigan o‘quvchilar guruhining natijalariga |\n| Mezonga mo‘ljallangan | Oldindan aniqlangan o‘quv maqsadi yoki mezonga |\n| Ipsativ | O‘sha o‘quvchining avvalgi natijasi va shaxsiy o‘sishiga |' },
    { type: 'example', content: 'Informatikadan bir xil topshiriq uch xil maqsadda ishlatilishi mumkin: sinf o‘rtacha ko‘rsatkichiga solishtirish — normaga; «siklni to‘g‘ri tuzadi» mezonini tekshirish — mezonga; o‘quvchining o‘tgan haftadagi natijasi bilan taqqoslash — ipsativ talqin. **Testning o‘zi emas, natijadan chiqarilgan xulosa** bu farqni belgilaydi.' },
    { type: 'trap', content: '**Aralashtirmang:** diagnostik, formativ va summativ — baholashning o‘quv jarayonidagi maqsadlari; normaga, mezonga va ipsativ — natijani taqqoslash asoslari. Komil Jalilov 1.2-bo‘limda shakllantiruvchi va xulosalovchi baholashni asosiy maqsad sifatida ajratadi, pedagogning kasb standarti 3-sohasi esa diagnostik baholashni ham alohida ko‘rsatadi. Manbalarning tasnif ko‘lami bir xil emas.' },
    { type: 'source', content: 'Manbalar: Komil Jalilov, «Baholash nazariyasi asoslari» (Akademnashr, 2020), «1.1.», «1.2. Baholashning maqsadlari», test natijalarini tahlil qilish bo‘limi va «2.1. Validlik» — https://drive.google.com/file/d/1-l4tFRqNEBuDEtvIavoh8yYB2pYp1JFN/view ; «Kasb-standarti.pdf», 3-mehnat vazifasi — https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view . PDF matni ko‘rib chiqildi, fizik sahifalar va huquqiy kuch alohida tekshiriladi.' },
  ], []),

  'M14.04': t('M14.04', "Tarbiyaviy faoliyat", [
    { type: 'definition', content: "Tarbiyaviy faoliyat — o‘quvchining qadr-qimmati, qadriyatlari, ijtimoiy munosabati, tashabbuskorligi va mas’uliyatini qo‘llab-quvvatlovchi maqsadli pedagogik ishdir." },
    { type: 'table', content: "| Asosiy yo‘nalish | Amaliy ko‘rinish |\n|---|---|\n| Darsdagi tarbiya | Hurmat, tenglik va hamkorlikda o‘quv faoliyatini tashkil etish |\n| Sinfdan tashqari faoliyat | Mahalliy imkoniyat va yosh xususiyatiga mos tadbirlar |\n| O‘quvchi tashabbusi | O‘zini o‘zi boshqarish, mustaqil fikr va ijodiy faoliyat |\n| Ziddiyatni hal qilish | Tinglash, muloqot va tomonlarning manfaatini hurmat qilish |" },
    { type: 'example', content: "Informatika loyihasida o‘quvchilar mas’uliyatni teng taqsimlab, boshqa fikrga hurmat bilan yondashishni o‘rgansa, tarbiyaviy faoliyat **darsning o‘zida** ham sodir bo‘lgan bo‘ladi." },
    { type: 'note', content: "Tarbiyaviy ishni faqat sinf rahbari yoki faqat sinfdan tashqari mashg‘ulot zimmasiga yuklash xato: manba o‘qituvchining darsdagi va darsdan tashqaridagi tarbiyaviy vazifalarini qayd qiladi." },
    { type: 'source', content: "Asos: «Kasb-standarti.pdf» — «Umumiy o‘rta ta’lim maktabi o‘qituvchisining kasb standarti» matnli nusxasi, barnoyevak Drive/pedagogika/files (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view). Bu ko‘chirma sifatida tekshirilgan; normativ hujjatning kuchga kirishi va PDF fizik beti alohida verifikatsiyaga muhtoj." },
  ], []),

  'M14.05': t('M14.05', "Xavfsiz rivojlantiruvchi muhit", [
    { type: 'definition', content: "Xavfsiz rivojlantiruvchi ta’lim muhiti — bolalarning teng ishtiroki, qadr-qimmati, jismoniy va ruhiy xavfsizligi hamda o‘rganishga qo‘llab-quvvatlovchi sharoitidir." },
    { type: 'table', content: "| Standartdagi vazifa | Amaliy chora |\n|---|---|\n| Kamsitishsiz teng imkoniyat | Shaxsiy va ijtimoiy farqlardan qat’i nazar ishtirokni ta’minlash |\n| Individual ehtiyoj | Vazifa, ko‘rsatma yoki yordamni o‘quvchiga moslashtirish |\n| Xavfsizlik | Favqulodda holat va sinf qoidalarini tushuntirish |\n| Media va raqamli xavfsizlik | Axborot va onlayn muhitdagi tahdidlarni anglatish |\n| Nizolar | Hurmat va samarali muloqot bilan hal etish |" },
    { type: 'example', content: "Amaliy kompyuter darsida o‘quvchiga uzoq matnni o‘qish qiyin bo‘lsa, aniq bosqichli ko‘rsatma yoki mos ko‘rgazma bering; boshqa o‘quvchilar bilan bir xil o‘quv maqsadiga mazmunli qatnashishini saqlang." },
    { type: 'note', content: "«Teng imkoniyat» barcha o‘quvchidan aynan bir xil tezlikda va bir xil ko‘rinishda ishlashni talab qilmaydi. Xavfsizlikka media va kommunikatsiya madaniyati ham kiradi." },
    { type: 'source', content: "Asos: «Kasb-standarti.pdf» — «Umumiy o‘rta ta’lim maktabi o‘qituvchisining kasb standarti» matnli nusxasi, barnoyevak Drive/pedagogika/files (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view). Bu ko‘chirma sifatida tekshirilgan; normativ hujjatning kuchga kirishi va PDF fizik beti alohida verifikatsiyaga muhtoj." },
  ], []),

  'M14.06': t('M14.06', "Kasbiy o‘sish", [
    { type: 'definition', content: "Kasbiy rivojlanish — o‘qituvchining faoliyatini tahlil qilish, ehtiyojini aniqlash, bilim va usullarini yangilash hamda amaliy natijaga qarab ishini takomillashtirish jarayonidir." },
    { type: 'table', content: "| Kasbiy o‘sish faoliyati | Standartdagi mazmun |\n|---|---|\n| Malaka oshirish | Muntazam ravishda bilim va ko‘nikmalarni yangilash |\n| Metodik hamkorlik | Uslubiy kengash, seminar va treningda tajriba almashish |\n| Dars kuzatuvi | Hamkasb darsini tahlil qilib, amaliyotga mos xulosa olish |\n| Refleksiya | Kuchli va takomillashtiriladigan jihatlarni aniqlash |\n| Amaliy yangilash | Yangi ilmiy-metodik bilimni keyingi darsga tatbiq etish |" },
    { type: 'example', content: "O‘qituvchi o‘quvchilarning o‘zlashtirish xatosini qayd etib, hamkasb darsini kuzatadi; keyin dars rejasi va qayta aloqa usulini o‘zgartirib natijani taqqoslaydi. Bu kasbiy rivojlanishning amaliy dalilidir." },
    { type: 'note', content: "Manbada muntazam malaka oshirish qayd etilgan, biroq aynan «3–5 yilda bir marta» degan universal interval berilmagan. Kurs sertifikati yoki ish staji refleksiya va real metodik o‘sishning o‘rnini bosa olmaydi." },
    { type: 'source', content: "Asos: «Kasb-standarti.pdf» — «Umumiy o‘rta ta’lim maktabi o‘qituvchisining kasb standarti» matnli nusxasi, barnoyevak Drive/pedagogika/files (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view). Bu ko‘chirma sifatida tekshirilgan; normativ hujjatning kuchga kirishi va PDF fizik beti alohida verifikatsiyaga muhtoj." },
  ], []),

  'M14.07': t('M14.07', "Hamkasb va ota-onalar bilan hamkorlik", [
    { type: 'definition', content: "Kasbiy hamkorlik — o‘qituvchilar, mutaxassislar, ota-onalar yoki ularning o‘rnini bosuvchi shaxslar bilan bolaning ta’lim olishi va farovonligi uchun birgalikda qaror qabul qilishdir." },
    { type: 'table', content: "| Hamkorlik ishtirokchisi | Mazmunli vazifa |\n|---|---|\n| Ota-ona yoki qonuniy vakil | Bolaning o‘qishi, sinf hayoti va rivojlanishiga oid qarorlarda ishtirok etish |\n| Hamkasb o‘qituvchi | O‘quv natijalari, qiyinchiliklar va individual yondashuvni birgalikda tahlil qilish |\n| Mutaxassis | Zarur bo‘lsa o‘quvchining individual trayektoriyasini qo‘llab-quvvatlash |\n| Hamjamiyat | O‘quvchi manfaatiga xizmat qiladigan resurs va faoliyatni muvofiqlashtirish |" },
    { type: 'example', content: "O‘quvchi darsda qiynalsa, o‘qituvchi ota-onasiga tayyor qarorni faqat e’lon qilmaydi: faktlarni tushuntirib, fikrini tinglaydi va zarur hamkasb/mutaxassis bilan mos yordam rejasini belgilaydi." },
    { type: 'note', content: "Hamkorlik vositasi (masalan, xabar almashish guruhi) samarali qaror hamda maxfiylikni ta’minlashning o‘rnini bosa olmaydi. O‘quvchining shaxsiy ma’lumoti umumiy guruhda oshkor etilmaydi." },
    { type: 'source', content: "Asos: «Kasb-standarti.pdf» — «Umumiy o‘rta ta’lim maktabi o‘qituvchisining kasb standarti» matnli nusxasi, barnoyevak Drive/pedagogika/files (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view). Bu ko‘chirma sifatida tekshirilgan; normativ hujjatning kuchga kirishi va PDF fizik beti alohida verifikatsiyaga muhtoj." },
  ], []),

  // ============================================================
  // M15 — Umumiy pedagogika
  // ============================================================
  'M15.01': t('M15.01', 'Pedagogika, didaktika va yosh psixologiyasi', [
    { type: 'definition', content: '**Pedagogika** ta’lim va tarbiya jarayonini yaxlit holda, uning mazmuni va qonuniyatlarini o‘rganadi. **Didaktika** — ta’lim nazariyasi; **tarbiya nazariyasi** — tarbiyaviy jarayonning mazmuni, shakl, usul va vositalarini o‘rganadi. **Yosh psixologiyasi** esa yoshga qarab psixik rivojlanishni tadqiq qiladi.' },
    { type: 'table', content: '| Asosiy tushuncha | Mazmuni |\n|---|---|\n| Shaxs | Jamiyatda ong, dunyoqarash va o‘ziga xos xulq-atvorga ega inson |\n| Ta’lim | Bilim, ko‘nikma, malaka va kompetensiyani rivojlantirishga yo‘naltirilgan jarayon |\n| Tarbiya | Qadriyat, munosabat va xulqni maqsadli shakllantirish jarayoni |\n| Rivojlanish | Shaxsning jismoniy, aqliy va ijtimoiy jihatidagi miqdoriy hamda sifat o‘zgarishlari |\n| Bilim | Borliq haqidagi tizimlashtirilgan tushuncha va ma’lumotlar |\n| Ko‘nikma | Muayyan faoliyatni ongli ravishda bajara olish |\n| Malaka | Mashq natijasida avtomatlashgan harakat yoki faoliyat usuli |\n| Kompetensiya | Bilim va ko‘nikmalarni real vaziyatda maqsadga muvofiq qo‘llash |\n| Ma’lumot | O‘zlashtirilgan bilim, ko‘nikma va shakllangan dunyoqarash majmui |' },
    { type: 'text', content: 'Pedagogika fanining **obyekti** — yaxlit pedagogik jarayon; **predmeti** — ta’lim-tarbiyaning mazmuni, qonuniyatlari, tamoyillari, shakl, metod va vositalari. Ilmiy pedagogik kuzatish, suhbat, anketa va eksperimentni sinfda o‘qitish metodi bilan bir tushuncha deb qabul qilmang.' },
    { type: 'example', content: 'O‘quvchi Python dasturidagi siklni tushuntirsa — bilimini namoyon qiladi; kodni yoza olsa — ko‘nikmasini ko‘rsatadi; uni mustaqil muammo yechishga moslashtirsa — kompetensiyasi namoyon bo‘ladi. Ushbu misol o‘quv maqsadini bosqichma-bosqich kuzatish uchun berilgan.' },
    { type: 'trap', content: '«Bilim olish» o‘quvchining faoliyatini ifodalaydi; uni ushbu manbadagi «bilim», «ko‘nikma», «malaka», «kompetensiya» kategoriyalaridan birining o‘rniga qo‘ymang. Bilim, malaka va kompetensiya ham o‘zaro sinonim emas.' },
    { type: 'source', content: 'Manba: «Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf», «Pedagogika fan sifatida», «Pedagogika fanining asosiy kategoriyalari» va «Tadqiqot metodlari» bo‘limlari — https://drive.google.com/file/d/1woZMas8dNbzk6yephzNH_XdmT19ess-l/view . Ikkilamchi konspekt matni bilan solishtirilgan, fizik sahifalar tekshirilmagan.' },
  ], []),

  'M15.02': t('M15.02', 'Ta\'lim tamoyillari', [
    { type: 'definition', content: 'Ta\'lim tamoyillari — o\'qitish jarayonining asosiy qoidalari, talablar tizimi. Ular ta\'lim mazmuni, metodlari va tashkil etilishini belgilaydi.' },
    { type: 'table', content: '| Tamoyil | Mazmuni |\n|---------|--------|\n| Onglilik va faollik | O\'quvchilar ongli ravishda o\'zlashtirishi |\n| Ko\'rgazmalilik | Vizual vositalardan foydalanish |\n| Tizimlilik va muntazamlik | Bilimlarni tizimli va izchil berish |\n| Ilmiylik | Fan yutuqlariga asoslanish |\n| Nazariya va amaliyot birligi | Nazariy bilimni amalda qo\'llash |\n| Mavjudlik | O\'quvchilarning yosh imkoniyatlariga moslik |\n| Mustahkamlik | Bilimlarni mustahkam o\'zlashtirish |\n| Individuallashtirish | Har bir o\'quvchiga individual yondashish |' },
    { type: 'text', content: 'Ta\'lim tamoyillari o\'zaro bog\'liq va bir-birini to\'ldiradi. Ular didaktikaning muhim qismi bo\'lib, o\'qituvchiga metodik yo\'nalish beradi.' },
    { type: 'example', content: 'Ko\'rgazmalilik tamoyili: darsda slaydlar, videolar, namoyishlardan foydalanish.\nOnglilik va faollik: o\'quvchilarni muammoli vaziyat orqali mustaqil fikrlashga undash.' },
    { type: 'note', content: '💡 Komenskiy "Buyuk didaktika" asarida ko\'rgazmalilik tamoyilini "oltin qoida" deb atagan.' },
  ], []),

  'M15.03': t('M15.03', 'Tarbiya va uning turlari', [
    { type: 'definition', content: 'Tarbiya — shaxsning ma\'naviy, axloqiy, ijtimoiy va madaniy sifatlarini shakllantirishga qaratilgan pedagogik jarayon.' },
    { type: 'table', content: '| Tarbiya turi | Mazmuni |\n|-------------|--------|\n| Fuqarolik | Jamiyatdagi huquq va burchlarni mas’uliyat bilan anglash |\n| Aqliy | Fikrlash qobiliyatini rivojlantirish |\n| Axloqiy | Axloqiy me\'yor va qadriyatlarni shakllantirish |\n| Mehnat | Mehnatga munosabat va kasb tanlash |\n| Estetik | Go\'zallikni his qilish va yaratish |\n| Jismoniy | Sog\'lom turmush tarzi |\n| Huquqiy | Huquqiy ong va mas\'uliyat |\n| Ekologik | Atrof-muhitga ehtiyotkorona munosabat |\n| Iqtisodiy | Iqtisodiy bilim asoslari |' },
    { type: 'text', content: 'Tarbiya metodlariga tushuntirish va ishontirish, ijobiy namuna, mashq qildirish, rag‘batlantirish, asosli talab qo‘yish hamda pedagogik nazorat kiradi. Metod vaziyat va tarbiyaviy maqsadga muvofiq, o‘quvchining qadr-qimmatini saqlagan holda tanlanadi.' },
    { type: 'example', content: 'Axloqiy tarbiya: yaxshi va yomon xulq haqida suhbat, axloqiy vaziyatlarni tahlil qilish, ijobiy namunalar ko\'rsatish.' },
    { type: 'note', content: 'Tarbiya **yo‘nalishi** (masalan, ekologik), **metodi** (masalan, namuna) va **shakli** (masalan, loyiha) alohida mezonlardir. Ayrim tarixiy tasniflarda «majburlash» atamasi uchrashi mumkin; uni o‘quvchiga zo‘ravonlik yoki kamsitishni tavsiya qilish deb talqin qilmang.' },
    { type: 'source', content: 'Manba: «Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf», «Tarbiya nazariyasi» va «Ijtimoiy tarbiya» qismlari — https://drive.google.com/file/d/1woZMas8dNbzk6yephzNH_XdmT19ess-l/view . Tarbiya usullari haqidagi didaktik misollar muharrir izohi bo‘lib, konspektdan so‘zma-so‘z ko‘chirma emas.' },
  ], []),

  'M15.04': t('M15.04', 'Dars turlari, rejalashtirish va sinfni boshqarish', [
    { type: 'definition', content: "Dars — o‘qitish jarayonining asosiy shakli. Didaktik maqsadga ko‘ra dars turi, o‘tkazilish usuli yoki tashkiliy shakldan farqlanadi. Sinfni boshqarish — o‘quvchilar faoliyati va xavfsiz hamkorlikni tashkil etish." },
    { type: 'table', content: "| Yetakchi didaktik maqsadga ko‘ra dars turi | Asosiy vazifasi |\n|---|---|\n| Aralash (kombinatsiyalashgan) | Oldingi ishni tekshirish, yangi mavzu, mashq va baholashni uyg‘unlashtirish |\n| Yangi bilimni o‘rganish | Yangi tushuncha va bog‘lanishlarni o‘zlashtirish |\n| Mustahkamlash va takrorlash | Oldin o‘rganilgan bilimni mashqlar bilan mustahkamlash |\n| Umumlashtirish va tizimlashtirish | O‘zlashtirilgan tushunchalarni bog‘lab, tizimga solish |\n| Ko‘nikma va malaka hosil qilish | Nazariy bilimni amaliy vazifada qo‘llash |\n| Bilimlarni tekshirish (nazorat) | O‘zlashtirish darajasi va keyingi ehtiyojni aniqlash |" },
    { type: 'text', content: "Sinfni boshqarish: vaqtni rejalash, o‘quvchilarning faolligini ta’minlash, xavfsiz muhit, guruhli va individual faoliyatni boshqarish. Laboratoriya va ekskursiya — o‘qitishning amaliy/tashkiliy shakllari bo‘lib, bu jadvaldagi didaktik maqsad tasnifi bilan aynan bir o‘q emas." },
    { type: 'example', content: "Informatikada algoritm turlarini yangi tushuntirish — yangi bilimni o‘rganish; avvalgi algoritmlarni jadvalda solishtirib tasniflash — umumlashtirish; dastur yozib ishlatish — ko‘nikma hosil qilish; nazorat topshirig‘i bilan natijani baholash — tekshirish darsi." },
    { type: 'note', content: "Bir darsda bir nechta faoliyat bo‘lishi mumkin. Nomlashda o‘qitishning yetakchi maqsadini aniqlang; alohida laboratoriya usuli yoki ekskursiya shaklini avtomatik alohida didaktik maqsad deb qabul qilmang." },
    { type: 'source', content: "Manba: «Dars turlari.pdf», 1–6-raqamlangan didaktik turlar; «dars tahlili turlari.pdf», 1–5-raqamlangan tahlil turlari, barnoyevak Google Drive/ChatExport_2026-10-19/files. Mazkur materiallar ikkilamchi konspekt bo‘lib, PDFning fizik sahifa lokatorlari va normativ kuchi alohida tekshiriladi." },
  ], []),

  'M15.05': t('M15.05', 'Sinf rahbari va ota-onalar bilan ish', [
    { type: 'definition', content: 'Sinf rahbari — sinfdagi o\'quv-tarbiyaviy ishlarni tashkil etuvchi o\'qituvchi. Ota-onalar bilan ish — ta\'lim jarayonining muhim qismi.' },
    { type: 'text', content: 'Sinf rahbarining vazifalari: o\'quvchilarni o\'rganish, sinf jamoasini shakllantirish, o\'quvchilar bilan individual ish, ota-onalar bilan hamkorlik, hujjatlar yuritish (sinf jurnali, shaxsiy ish).' },
    { type: 'table', content: '| Hujjat | Vazifasi |\n|--------|---------|\n| Sinf jurnali | O\'zlashtirish va davomatni qayd etish |\n| O\'quvchi shaxsiy ishi | Shaxsiy ma\'lumotlar |\n| Ota-onalar bilan ish rejasi | Hamkorlik tadbirlari |\n| Sinf soati rejasi | Tarbiyaviy ish rejasi |\n| Kundalik yoki elektron xizmat (mavjud bo‘lsa) | Vazifa va baholar bo‘yicha axborot almashish |' },
    { type: 'example', content: 'Sinf rahbari faoliyati:\n- Sinf soati va tarbiyaviy tadbirlarni rejalashtirish\n- Ota-onalar yig\'ilishi va individual suhbatni ehtiyojga ko\'ra tashkil etish\n- O\'quvchilar bilan individual suhbat\n- Davomatni kuzatish\n- Fan o\'qituvchilari bilan hamkorlik' },
    { type: 'note', content: 'Jadval — sinf rahbari hamkorligini tushuntiruvchi **namunaviy** hujjatlar va vositalar ro‘yxati; hammasi bir vaqtda majburiy yuritiladi degan amaldagi huquqiy talab emas. O‘quvchining shaxsiy ma’lumotlari umumiy guruhlarga ruxsatsiz tarqatilmaydi; haqiqiy hujjat majburiyati alohida normativ bilan tekshiriladi.' },
  ], []),

  'M15.06': t('M15.06', 'Pedagogik etika, nutq va refleksiya', [
    { type: 'definition', content: 'Pedagogik etika — o\'qituvchining kasbiy axloq me\'yorlari va qoidalari. Pedagogik nutq — o\'qituvchining o\'quvchilar bilan muloqotdagi nutq madaniyati. Refleksiya — o\'z faoliyatini tahlil qilish va baholash.' },
    { type: 'text', content: 'Pedagogik etika qoidalari: o\'quvchilarga hurmat, adolatli munosabat, mehr-oqibat, talabchanlik, o\'ziga nisbatan talabchanlik, pedagogik takt (me\'yorni his qilish).' },
    { type: 'table', content: '| Tushuncha | Mazmuni |\n|-----------|--------|\n| Pedagogik etika | Kasbiy axloq me\'yorlari |\n| Pedagogik takt | O\'zini tuta bilish, me\'yorni his qilish |\n| Pedagogik nutq | Aniq, ifodali, tushunarli nutq |\n| Refleksiya | O\'z faoliyatini tahlil qilish |\n| Pedagogik texnika | Nutq, mimika, jest, ovozni boshqarish |\n| Pedagogik ijodkorlik | Yangi g\'oya va yondashuvlar yaratish |' },
    { type: 'note', content: '🎯 O\'qituvchi nutqi o\'quvchilarga namuna bo\'ladi. Pedagogik takt — o\'qituvchining muhim sifati.' },
    { type: 'heading', content: 'Nutq madaniyatining asosiy kommunikativ sifatlari' },
    { type: 'table', content: '| Sifat | Informatika darsida tekshirish uchun belgi |\n|---|---|\n| To‘g‘rilik | Til me’yorlari va atamalarni xatosiz ishlatish |\n| Aniqlik | «O‘zgaruvchi» va «qiymat»ni chalkashtirmay bayon qilish |\n| Mantiqiylik | Fikrlarni sabab va natija izchilligida tushuntirish |\n| Soflik | Ma’noga xizmat qilmaydigan ortiqcha so‘zlarni kamaytirish |\n| Boylik | Ma’noni turli tushunarli ifodalar bilan yetkazish |\n| Jo‘yalilik | Nutqni sinf yoshiga va vaziyatiga mos tanlash |\n| Ifodalilik | Muhim fikrni ohang va urg‘u bilan ravshan ko‘rsatish |' },
    { type: 'example', content: 'O‘qituvchi «algoritmni kompyuter ishlaydi» deb umumiy aytish o‘rniga, «algoritm — amallar ketma-ketligi, uni bajaruvchi inson yoki kompyuter bo‘lishi mumkin» deb aniqlashtiradi. Bu **aniqlik** va **mantiqiylik**ka xizmat qiladi. Ovozni balandlatishning o‘zi nutq sifatini kafolatlamaydi.' },
    { type: 'source', content: 'Manba: Nizomiddin Mahmudov, «O‘qituvchi nutqi madaniyati» (Toshkent, 2007), darslikning kirish/bibliografik tavsifidagi yetti kommunikativ sifat — https://drive.google.com/file/d/1MUrT_uKKg-0jWwV16j97AzkcbU6LGpHL/view ; qo‘shimcha: Muslimov va boshqalar, «Pedagogik kompetentlik va kreativlik asoslari» (2015) — https://drive.google.com/file/d/1M0vGhTnSMehXfyEHo3dlHXUgeA_DTbfN/view . Mahmudov PDF matnida OCR buzilishlari bor; fizik sahifa lokatorlari tekshirilmagan, amaliy informatika misoli muharrirniki.' },
  ], []),

  'M15.07': t('M15.07', 'Pedagogik qobiliyatlar', [
    { type: 'definition', content: 'Pedagogik qobiliyat — o\'qituvchining ta\'lim-tarbiyaviy ishni samarali amalga oshirish imkonini beruvchi individual psixologik xususiyatlar majmui.' },
    { type: 'table', content: '| Qobiliyat turi | Mazmuni |\n|--------------|--------|\n| Didaktik | Materialni tushunarli bayon qilish |\n| Akademik | Fan bilimlari va tadqiqot qobiliyati |\n| Perseptiv | O\'quvchini tushunish, ichki dunyosini his qilish |\n| Nutq | Tushunarli, ifodali nutq |\n| Tashkilotchilik | O\'quvchilar va jarayonni tashkil etish |\n| Kommunikativ | Muloqot o\'rnatish qobiliyati |\n| Avtoritar | O\'quvchilarga ta\'sir o\'tkazish |\n| Pedagogik tasavvur | Natijalarni oldindan ko\'ra bilish |\n| Diqqatni taqsimlash | Bir vaqtda bir necha ishni boshqarish |' },
    { type: 'text', content: 'Pedagogik qobiliyatlarni o\'qish, amaliy tajriba va muntazam refleksiya orqali rivojlantirish mumkin. O\'qituvchi o\'zining kuchli tomonlarini rivojlantirishi va zaif tomonlarini mustahkamlashi kerak.' },
    { type: 'note', content: 'Didaktik qobiliyat murakkab materialni tushunarli yetkazishga xizmat qiladi. Biroq pedagogik qobiliyatlarning yagona «eng muhim» turi qat’iy belgilangan emas: vaziyat va manbadagi muallif tasnifi hisobga olinadi.' },
    { type: 'trap', content: '«Avtoritar qobiliyat» atamasi ayrim tarixiy pedagogik tasniflarda shaxsiy obro‘ va ta’sir bilan bog‘liq. Bu bolaga qo‘pollik, zo‘ravonlik yoki bosim o‘tkazishni oqlamaydi. Test savolida keltirilgan muallif tasnifini aniqlang.' },
    { type: 'source', content: 'Manba: «Xoliqov Pedagogik mahorat.pdf», pedagogik qobiliyatlar bo‘limi — https://drive.google.com/file/d/1urZe1IJjLVco-KysxtIvg46Ej89XreuK/view ; mualliflar tasnifi cheklovlari qo‘shimcha M15.07 source notesda yoritilgan.' },
  ], []),

  'M15.08': t('M15.08', 'Ta\'lim texnologiyalari', [
    { type: 'definition', content: "Ta’lim texnologiyasi — o‘quv maqsadiga erishishni rejalashtiradigan metod, vosita, faoliyat va baholash tizimi. Yondashuv tanlashda o‘quvchilarning ehtiyoji va ishtirok imkoniyati hisobga olinadi." },
    { type: 'table', content: "| Yondashuv | Asosiy maqsadi |\n|---|---|\n| Loyihaga asoslangan ta’lim | Muammoni o‘rganib, yakuniy mahsulot yoki yechim tayyorlash |\n| Muammoli ta’lim | Muammo sababini tahlil qilish va asosli yechim izlash |\n| Hamkorlikdagi ta’lim | Birgalikda ishlash va individual hissa uchun mas’uliyat |\n| Evristik ta’lim | Izlanish orqali xulosa va g‘oyani kashf etish |\n| Shaxsga yo‘naltirilgan | O‘quvchi ehtiyojiga mos maqsad va faoliyat |\n| Interfaol ta’lim | Faol fikr almashish va munozara |\n| Differensial ta’lim | Tayyorlik hamda o‘rganish ehtiyojiga mos turlicha yordam |\n| Integrativ ta’lim | Fanlararo mazmuniy aloqalarni bog‘lash |\n| O‘yinli ta’lim | O‘yin elementlari orqali mashq va qayta aloqa |\n| Inklyuziv ta’lim | Turli ehtiyojlarni hisobga olib teng imkoniyat va mazmunli ishtirok yaratish |" },
    { type: 'text', content: "Texnologiya tanlashda ta’lim maqsadi, yosh, avvalgi bilim, resurs, xavfsizlik va natijani baholash mezoni birgalikda ko‘riladi. Inklyuzivlik hamma o‘quvchiga aynan bir xil topshiriq berish emas; zarur moslashtirish va qo‘llab-quvvatlashga tayangan ishtirokdir." },
    { type: 'example', content: "Bir o‘quvchi matnli ko‘rsatmani o‘qishga qiynalsa, informatika vazifasiga qisqa bosqichli qo‘llanma va tushunarli vizual ko‘rsatma berish mumkin. Bu mazmuniy maqsadni bekor qilish emas, unga erishish yo‘lini moslashtirishdir." },
    { type: 'note', content: "Loyihaga asoslangan yondashuvni shunchaki guruh bo‘lib suhbatlashish bilan, inklyuziv ta’limni esa barcha o‘quvchiga bir xil shart qo‘yish bilan tenglashtirmang." },
    { type: 'source', content: "Manba: F.U. Qodirova, D.A. Pulatova, «Inklyuziv ta’lim: nazariya va metodika» (Chirchiq, 2022), «Kirish» va inklyuziv ta’lim ta’riflari; barnoyevak Google Drive/ChatExport_2026-10-19/files. Fizik PDF betlari alohida tekshiruvga muhtoj." },
  ], []),

  // ============================================================
  // M16 — Informatika o\'qitish metodikasi
  // ============================================================
  'M16.01': t('M16.01', 'Fan mazmunini o\'qitish yondashuvlari', [
    { type: 'definition', content: 'Informatika o\'qitish metodikasi — informatika fanini o\'qitishda foydalaniladigan usul va vositalar majmui. Yondashuvlar: tizimli, faoliyatli, kompetensiyaviy, shaxsga yo\'naltirilgan.' },
    { type: 'table', content: '| Yondashuv | Mazmuni |\n|-----------|--------|\n| Tizimli | Fan mazmunini tizim sifatida o\'rganish |\n| Faoliyatli | O\'quvchini faoliyatga jalb qilish |\n| Kompetensiyaviy | Amaliy ko\'nikmalarni shakllantirish |\n| Shaxsga yo\'naltirilgan | O\'quvchining qobiliyati va ehtiyojiga moslashish |' },
    { type: 'text', content: 'Informatika mazmun sohalari: axborot va raqamli savodxonlik, kompyuter tizimlari va dasturiy muhit, mantiqiy fikrlash va algoritmlash, dasturlash va ma\'lumotlar bilan ishlash, grafika va veb-texnologiyalar, kompyuter tarmoqlari, axborot xavfsizligi.' },
    { type: 'note', content: '💻 Informatika o\'qitishda spiral yondashuv — mavzular har bir sinfda murakkablashib boradi.' },
    { type: 'heading', content: "Attestatsiya kompetensiyasi: mazmunni o‘qitish yondashuvi" },
    { type: 'example', content: "5-sinfda algoritmni kundalik amallar orqali tasvirlash, yuqori sinflarda esa uni kod bilan tekshirish — mazmunni o‘quvchi tayyorgarligiga mos bosqichlash misoli. Savolda faqat qaysi dastur ishlatilgani emas, tanlangan faoliyat o‘quv maqsadiga mosligi tekshiriladi." },
    { type: 'trap', content: "2026-yilgi spetsifikatsiyada M16 uchun 3 ta imtihon savoli ajratilgan. Bu M16.01, M16.02 va M16.03 ning har biridan aynan bittadan savol tushishi kafolati emas. Spiral yondashuvga oid misol metodik tushuntirishdir, spetsifikatsiyadagi alohida rasmiy talab emas." },
    { type: 'source', content: "Manba: «Informatika Testlar spesifikatsiyasi.pdf» (Toshkent, 2026), «2.2. Informatika o‘qitish metodikasi», 2-jadval, 3 ta topshiriq — https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view . Bu spetsifikatsiya kompetensiyalarni belgilaydi, lekin Mamarajabov va boshqalar (2023) «Informatika o‘qitish metodikasi» darsligining sahifama-sahifa tekshiruvi o‘rniga o‘tmaydi." },
  ], []),

  'M16.02': t('M16.02', 'O\'qitish usul va metodlari', [
    { type: 'definition', content: 'O\'qitish usullari — o\'qituvchi va o\'quvchining o\'zaro faoliyatini tashkil etish yo\'llari. Metodlar og\'zaki, ko\'rgazmali, amaliy va interfaol turlarga bo\'linadi.' },
    { type: 'table', content: '| Metod guruhi | Misollar | Xususiyati |\n|-------------|---------|----------|\n| Og\'zaki | Hikoya, tushuntirish, suhbat | Nazariy bilim berish |\n| Ko\'rgazmali | Slayd, video, animatsiya, plakat | Vizual idrok |\n| Amaliy | Laboratoriya, masala yechish, loyiha | Ko\'nikma hosil qilish |\n| Interfaol | Klaster, Venn, Fishbone (Ishikava diagrammasi), blits-so\'rov | Faol muloqot |' },
    { type: 'text', content: 'Informatika darslarida amaliy faoliyat muhim: kompyuterda ishlash vaqti darsning aniq maqsadi, yosh xususiyatlari, xavfsizlik talablari va mavjud sharoitga qarab rejalashtiriladi. Dasturlashni o\'rgatishda "Code.org", "Scratch", "Python" kabi vositalar qo\'llaniladi.' },
    { type: 'example', content: 'Muammoli ta\'lim: "Internetga ulanish yo\'q. Ma\'lumotlarni qanday almashish mumkin?" — o\'quvchilar muammoni mustaqil yechishadi.' },
    { type: 'note', content: '💡 Informatika fanida "Fishbone" (Ishikava, baliq skeleti) diagrammasi — muammo va sabablarni tahlil qilish uchun qo\'llaniladi.' },
    { type: 'heading', content: "Metod nomini emas, vaziyatga mosligini baholang" },
    { type: 'table', content: "| Maqsad | Mos mashg‘ulot namunasi | Nega? |\n|---|---|---|\n| Algoritm ketma-ketligini tushunish | Blok-sxemani tahlil qilish | Amallar tartibini ko‘rinarli qiladi |\n| Dasturdagi xatoni aniqlash | Kodni ishga tushirish va debugging | Kuzatiladigan natija bilan taxminni solishtiradi |\n| Raqamli xavfsizlik qarori | Dalilli vaziyat muhokamasi | Xavf va oqibatni taqqoslashga undaydi |" },
    { type: 'trap', content: "«Interfaol metod doim eng yaxshi» yoki «slayd ko‘rsatishning o‘zi ko‘rgazmalilikni kafolatlaydi» degan umumiy xulosa noto‘g‘ri. Metod tanlovi maqsad, mavjud resurs, yosh va qayta aloqa imkoniga bog‘liq." },
    { type: 'source', content: "Manba: «Informatika Testlar spesifikatsiyasi.pdf» (Toshkent, 2026), «2.2. Informatika o‘qitish metodikasi», 2-jadval, 3 ta topshiriq — https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view . Bu spetsifikatsiya kompetensiyalarni belgilaydi, lekin Mamarajabov va boshqalar (2023) «Informatika o‘qitish metodikasi» darsligining sahifama-sahifa tekshiruvi o‘rniga o‘tmaydi." },
  ], []),

  'M16.03': t('M16.03', 'Ta\'limiy vaziyatdagi qarorlarni baholash', [
    { type: 'definition', content: 'Ta\'limiy vaziyat — o\'qituvchi oldida turgan pedagogik muammo yoki masala. Qarorlarni baholash — berilgan vaziyatda eng to\'g\'ri pedagogik qarorni tanlash va asoslash.' },
    { type: 'text', content: 'Baholash mezonlari: qarorning maqsadga muvofiqligi, o\'quvchilarning yosh xususiyatlariga mosligi, metodik to\'g\'riligi, natijaga erishish imkoniyati, etik me\'yorlarga mosligi.' },
    { type: 'table', content: '| Vaziyat | Mumkin qaror | Baholash |\n|---------|-------------|---------|\n| O\'quvchi darsga qiziqmaydi | Interfaol metod qo\'llash | To\'g\'ri, faollikni oshiradi |\n| O\'quvchi kompyuterda o\'yin o\'ynayapti | Darsdan haydash | Noto\'g\'ri, sababini aniqlash kerak |\n| O\'quvchilar turli darajada | Differensial topshiriq berish | To\'g\'ri, har bir o\'quvchiga mos |\n| Ota-ona farzandining bahosidan norozi | Bahoni tushuntirish, mezonlarni ko\'rsatish | To\'g\'ri, ochiq muloqot |' },
    { type: 'example', content: 'Vaziyat: darsda ikkita o\'quvchi kompyuterda o\'zaro urishib qoladi.\nNoto\'g\'ri: ikkalasini ham darsdan haydash.\nTo\'g\'ri: vaziyatni tahlil qilish, sababini aniqlash, alohida suhbatlashish, kelishuvga erishish.' },
    { type: 'note', content: '🔍 Pedagogik qaror qabul qilishda o\'qituvchi: vaziyatni tahlil qiladi, variantlarni ko\'rib chiqadi, eng maqbulini tanlaydi va natijani baholaydi.' },
    { type: 'heading', content: "Pedagogik qarorni asoslashning to‘rt bosqichi" },
    { type: 'table', content: "| Bosqich | Tekshiriladigan savol |\n|---|---|\n| Vaziyat dalillari | Nima kuzatildi, nima hali taxmin? |\n| Maqsad va cheklovlar | O‘quv natijasi, xavfsizlik va teng imkoniyat saqlanyaptimi? |\n| Muqobil yechimlar | Qaysi usul eng kam zarar va eng ko‘p o‘rganish imkonini beradi? |\n| Natijani tekshirish | Qaror samarasini qanday dalil va qayta aloqa bilan baholaymiz? |" },
    { type: 'example', content: "Kompyuterlar soni cheklangan darsda bir guruh dastur tuzadi, ikkinchisi kodni qog‘ozda tahlil qiladi, keyin almashadi. Bunday yechimni «to‘g‘ri» deyishdan oldin barcha o‘quvchi amaliy maqsadga erishgani va xavfsiz ishlashini tekshirish kerak." },
    { type: 'trap', content: "Vaziyatli savollarda yagona «hamisha to‘g‘ri» metod yo‘q. O‘quvchini kamsitadigan jazo, shaxsiy ma’lumotni oshkor qilish yoki sababsiz chetlatish maqbul pedagogik qaror bo‘la olmaydi." },
    { type: 'source', content: "Manba: «Informatika Testlar spesifikatsiyasi.pdf» (Toshkent, 2026), «2.2. Informatika o‘qitish metodikasi», 2-jadval, 3 ta topshiriq — https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view . Bu spetsifikatsiya kompetensiyalarni belgilaydi, lekin Mamarajabov va boshqalar (2023) «Informatika o‘qitish metodikasi» darsligining sahifama-sahifa tekshiruvi o‘rniga o‘tmaydi." },
  ], []),
}

/**
 * M05 — 11-bobli “Sanoq sistemalari” nazariyasi.
 *
 * Eski savollarni saqlaymiz: faqat qisqa nazariya o'rniga kitobning barcha
 * 11 bobi joylanadi. Server mavjud 180 ta yangi + eski savollarni beradi,
 * statik savollar esa tarmoq uzilgandagi fallback bo'lib qoladi.
 *
 * M05.01 = 1–2-bob, M05.02 = 3–5-bob, M05.03 = 6–11-bob.
 */
for (const [id, theory] of Object.entries(M05_THEORY)) {
  const existing = TOPIC_CONTENT[id]
  if (!existing) continue
  TOPIC_CONTENT[id] = {
    ...existing,
    theory,
    source: 'src/content/sanoq/Sanoq_sistemalari_nazariya.tex',
    kind: 'chapter',
  }
}

// ICT8 / Cambridge cybersecurity and digital culture content (11 topics).
for (const [subtopicId, additions] of Object.entries(M13_DIGITAL_TEXTBOOK_ADDITIONS)) {
  const local = TOPIC_CONTENT[subtopicId]
  if (local) TOPIC_CONTENT[subtopicId] = { ...local, theory: [...local.theory, ...additions] }
}

// Graphics, 3D, animation and media original explanatory blocks (7 topics).
for (const [subtopicId, additions] of Object.entries(M10_GRAPHICS_TEXTBOOK_ADDITIONS)) {
  const local = TOPIC_CONTENT[subtopicId]
  if (local) TOPIC_CONTENT[subtopicId] = { ...local, theory: [...local.theory, ...additions] }
}

// Source-grounded networking / Internet / cloud / IoT study blocks (9 topics).
for (const [subtopicId, additions] of Object.entries(M12_NETWORK_TEXTBOOK_ADDITIONS)) {
  const local = TOPIC_CONTENT[subtopicId]
  if (local) TOPIC_CONTENT[subtopicId] = { ...local, theory: [...local.theory, ...additions] }
}

// Cambridge+ sourced HTML/CSS lessons, retaining legacy content and tests.
for (const [subtopicId, additions] of Object.entries(M11_WEB_TEXTBOOK_ADDITIONS)) {
  const local = TOPIC_CONTENT[subtopicId]
  if (local) TOPIC_CONTENT[subtopicId] = { ...local, theory: [...local.theory, ...additions] }
}

// Cambridge database/Access/SQL original study additions (7 topics).
for (const [subtopicId, additions] of Object.entries(M09_DATABASE_TEXTBOOK_ADDITIONS)) {
  const local = TOPIC_CONTENT[subtopicId]
  if (local) TOPIC_CONTENT[subtopicId] = { ...local, theory: [...local.theory, ...additions] }
}

// Cambridge+ Word, Excel and PowerPoint thematic study examples (10 topics).
// Keep the previous theory blocks and question keys exactly as authored.
for (const [subtopicId, additions] of Object.entries(M03_OFFICE_TEXTBOOK_ADDITIONS)) {
  const local = TOPIC_CONTENT[subtopicId]
  if (local) TOPIC_CONTENT[subtopicId] = { ...local, theory: [...local.theory, ...additions] }
}

// TASK-284: Unlike earlier 5-block addenda, this is a complete, structured
// long-form textbook chapter with a goals box, solved examples and exercises.
// The existing static/extended theory is retained verbatim as review notes;
// static question keys and server assessments are never modified.
const excelBase = TOPIC_CONTENT['M03.05']
if (excelBase) {
  TOPIC_CONTENT['M03.05'] = {
    ...excelBase,
    source: 'Cambridge+ 10–11-sinf (2021), 8-bob — Elektron jadvallar',
    kind: 'chapter',
    theory: [
      ...M03_05_CANONICAL_BOOK,
      { type: 'heading', content: 'Qo‘shimcha takrorlash: avvalgi nazariya va qisqa konspekt' },
      ...excelBase.theory,
    ],
  }
}

// National ICT 9 Python and Cambridge+ 10/11 JavaScript / AI source notes.
// Static M08 is learner-facing: these examples are added before first reading.
for (const [subtopicId, additions] of Object.entries(M08_TEXTBOOK_STUDY_ADDITIONS)) {
  const local = TOPIC_CONTENT[subtopicId]
  if (local) TOPIC_CONTENT[subtopicId] = { ...local, theory: [...local.theory, ...additions] }
}

// TASK-273: retain every original M16 block and append separately traced
// methodology explanations to the offline canonical fallback. Server-backed
// M16 lessons attach the same blocks in overlayPublishedProfessionalLesson.
// Original labor-task explanations for M14 are kept after the legacy offline
// theory as supplementary study blocks, without changing answer keys.
for (const [subtopicId, additions] of Object.entries(M14_NORMATIVE_SOURCE_ADDITIONS)) {
  const local = TOPIC_CONTENT[subtopicId]
  if (local) TOPIC_CONTENT[subtopicId] = { ...local, theory: [...local.theory, ...additions] }
}

for (const [subtopicId, additions] of Object.entries(M16_SOURCE_THEORY_ADDITIONS)) {
  const local = TOPIC_CONTENT[subtopicId]
  if (local) TOPIC_CONTENT[subtopicId] = { ...local, theory: [...local.theory, ...additions] }
}

// TASK-284: authored subnet/CIDR worked-book chapter, including bitwise
// examples and /31-/32 caveats. Do not discard the previous M12 exercises.
const ipv4Base = TOPIC_CONTENT['M12.05']
if (ipv4Base) {
  TOPIC_CONTENT['M12.05'] = {
    ...ipv4Base,
    source: 'Cambridge+ ICT 10–11 + original IPv4 subnet theory',
    kind: 'chapter',
    theory: [
      ...M12_05_CANONICAL_BOOK,
      { type: 'heading', content: 'Qo‘shimcha takrorlash: avvalgi subnet nazariyasi' },
      ...ipv4Base.theory,
    ],
  }
}

// TASK-284: source-backed pedagogy is no longer a short summary followed by
// a collapsed note card. The new book is read first and earlier reviewed
// material is preserved; withPedagogyStudyNotes adds the previous source notes.
const pedagogyBase = TOPIC_CONTENT['M15.01']
if (pedagogyBase) {
  TOPIC_CONTENT['M15.01'] = {
    ...pedagogyBase,
    source: 'Mirzayeva, Pedagogika nazariyasi, 2-mavzu',
    kind: 'chapter',
    theory: [
      ...M15_01_CANONICAL_BOOK,
      { type: 'heading', content: 'Qo‘shimcha takrorlash: mavjud qisqa pedagogika nazariyasi' },
      ...pedagogyBase.theory,
    ],
  }
}

// TASK-285: put the long source-grounded Word chapter first. Preserve the
// original quiz and the previous office supplement (they remain readable).
const wordIntroBase = TOPIC_CONTENT['M03.01']
if (wordIntroBase) {
  TOPIC_CONTENT['M03.01'] = {
    ...wordIntroBase,
    source: 'Cambridge+ ICT 5 + 10/11, original pedagogical Word chapter',
    kind: 'chapter',
    theory: [
      ...M03_01_CANONICAL_BOOK,
      { type: 'heading', content: 'Oldingi darsdagi qisqa Word nazariyasi va tekshiruv' },
      ...wordIntroBase.theory,
    ],
  }
}

// TASK-285: complete M15.02 before the legacy summary and the additional
// reviewed study notes attached in TopicView. Never change assessment keys.
const didacticsBase = TOPIC_CONTENT['M15.02']
if (didacticsBase) {
  TOPIC_CONTENT['M15.02'] = {
    ...didacticsBase,
    source: 'F.O. Mirzayeva, Pedagogika nazariyasi va tarixi, didaktika ma’ruzalari',
    kind: 'chapter',
    theory: [
      ...M15_02_CANONICAL_BOOK,
      { type: 'heading', content: 'Oldingi qisqa ta’lim tamoyillari konspekti' },
      ...didacticsBase.theory,
    ],
  }
}

// M02 canonical chapters combine multiple lengthy source lessons. Rebuilding
// their arrays at every React render invalidates BookReader/observer state and
// can visually reflow an already opened lesson.
const m02CachedContent = new Map<string, TopicContent | undefined>()

export function getTopicContent(subtopicId: string): TopicContent | undefined {
  if (!subtopicId.startsWith('M02.')) return TOPIC_CONTENT[subtopicId]
  if (!m02CachedContent.has(subtopicId)) {
    m02CachedContent.set(subtopicId, buildCanonicalM02Topic(subtopicId, TOPIC_CONTENT))
  }
  return m02CachedContent.get(subtopicId) ?? TOPIC_CONTENT[subtopicId]
}

export interface SubtopicMeta {
  theoryCount: number
  questionCount: number
  totalBlocks: number
  theoryTypes: { type: string; count: number }[]
  questionTypes: { type: string; count: number }[]
}

export function getSubtopicMeta(subtopicId: string): SubtopicMeta | null {
  const content = getTopicContent(subtopicId)
  if (!content) return null

  const theoryTypes: Record<string, number> = {}
  for (const block of content.theory) {
    theoryTypes[block.type] = (theoryTypes[block.type] || 0) + 1
  }

  const questionTypes: Record<string, number> = {}
  for (const q of content.questions) {
    questionTypes[q.type] = (questionTypes[q.type] || 0) + 1
  }

  return {
    theoryCount: content.theory.length,
    questionCount: content.questions.length,
    totalBlocks: content.theory.length + content.questions.length,
    theoryTypes: Object.entries(theoryTypes).map(([type, count]) => ({ type, count })),
    questionTypes: Object.entries(questionTypes).map(([type, count]) => ({ type, count })),
  }
}
