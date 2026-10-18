/**
 * Human-readable KS quick-reference cards grounded in the 13-page PDF
 * "Pedagogning kasbiy standarti — Umumta'lim tashkiloti pedagogi uchun
 * metodik qo'llanma" (@PedMahoratGuli edition).
 *
 * This secondary methodological compilation is NOT the original enacted
 * normative document and does not attest legal currency or exam key validity.
 * The quoted PDF's overview page reverses the fifth and sixth competences:
 * p.1 list: 05 professional growth, 06 safe environment;
 * the actual section headings: p.10 = 5th safe environment,
 * p.12 = 6th professional growth. Page locators below follow ACTUAL BODY.
 */
export interface KasbSourceCard {
  readonly section: number
  readonly pages: string
  readonly topic: string
  readonly evidence: string
  readonly practice: string
  readonly distinction: string
}

export const KASB_SOURCE_CARDS: Readonly<Record<string, KasbSourceCard>> = {
  'M14.01': {
    section: 1,
    pages: '2–3',
    topic: 'O‘quv jarayonini rejalashtirish',
    evidence: 'Davlat ta’lim standartlari va o‘quv dasturi maqsadlariga mos, o‘lchanadigan natijali reja tuzish; yosh xususiyatlari, baholash dalili, fanlararo aloqalar va AKTni hisobga olish.',
    practice: 'Bir sinf uchun dars rejasini boshlashdan avval o‘quv maqsadi, o‘quvchilar tayyorgarligi va mavjud baholash natijalarini solishtiring.',
    distinction: 'Faqat texnik jihozlar ro‘yxatini tuzish ta’lim natijasini rejalashtirishning o‘rnini bosmaydi.',
  },
  'M14.02': {
    section: 2,
    pages: '4–5',
    topic: 'Ta’lim samaradorligini ta’minlash',
    evidence: 'Faol metodlar, hamkorlikdagi va loyihaviy ish, metakognitiv rejalash–nazorat–o‘z-o‘zini baholash, differensial yordam va samarali qayta aloqa.',
    practice: 'Darsning maqsadi mustaqil muammo yechish bo‘lsa, o‘quvchilarning yechim sinash va muhokama qilish faoliyatini rejalashtiring.',
    distinction: 'Metakognitiv strategiya oddiy o‘zlashtirish balidan farq qiladi: o‘quvchi qanday o‘rganayotganini ham tahlil qiladi.',
  },
  'M14.03': {
    section: 3,
    pages: '6–7',
    topic: 'O‘zlashtirishni baholash va qayta aloqa',
    evidence: 'Tashxislash, tizimli kuzatish, bahoni asoslash va natijaga qarab darsni moslashtirish; qo‘llanmada diagnostik, formativ va summativ baholash farqlangan.',
    practice: 'Dars davomida xato topilib shu zahoti o‘qitish o‘zgarsa — formativ; kurs boshlanishidagi holat aniqlansa — diagnostik; bosqich yakuni baholansa — summativ.',
    distinction: 'Baholash faqat ball qo‘yish emas: natijaga mos keyingi o‘quv harakatini ham belgilaydi.',
  },
  'M14.04': {
    section: 4,
    pages: '8–9',
    topic: 'Tarbiyaviy faoliyatni tashkil etish',
    evidence: 'Bolaning qadr-qimmati, ijtimoiy-madaniy xususiyatlar, tashabbuskorlik va o‘zini o‘zi boshqarish; maktabdan tashqari tadbirlarda tegishli ko‘rsatmalarga rioya etish.',
    practice: 'Ekskursiyani rejalashtirishda uning tarbiyaviy maqsadi, bolalarning ishtiroki va xavfsizlik bo‘yicha tegishli hujjatlarni birgalikda baholang.',
    distinction: 'Tadbirning o‘zi emas, bolaning qadr-qimmati, ko‘nikmasi va ijobiy ishtiroki tarbiyaviy natijani ko‘rsatadi.',
  },
  'M14.05': {
    section: 5,
    pages: '10–11',
    topic: 'Xavfsiz rivojlantiruvchi ta’lim muhiti',
    evidence: 'Kamsitmasdan teng imkoniyat berish, maxsus ta’limiy ehtiyojga mos ish, xavfsizlik tartibi, mediasavodxonlik va nizolarni muloqot orqali hal qilish.',
    practice: 'Maxsus ehtiyoji bor o‘quvchi vazifada qiynalsa, uning ishtirokini saqlagan holda topshiriq va yordam shaklini moslang.',
    distinction: 'Teng imkoniyat har bir o‘quvchidan aynan bir xil sur’at va shaklda ishlashni talab qilish degani emas.',
  },
  'M14.06': {
    section: 6,
    pages: '12',
    topic: 'O‘z-o‘zini rivojlantirish va kasbiy o‘sish',
    evidence: 'Malaka oshirish, kasbiy adabiyotdagi bilimni amaliyotga tatbiq qilish, o‘zaro dars kuzatish va tahlil, metodik kengash va o‘z faoliyatini reflektiv baholash.',
    practice: 'Dars natijalaridagi kuchli va qiyin jihatlarni aniqlab, keyingi malaka oshirish hamda metodik sinov uchun maqsad belgilang.',
    distinction: 'Sertifikatlar soni yoki ish stajining o‘zi dars sifati va refleksiya o‘rnini bosa olmaydi.',
  },
  'M14.07': {
    section: 7,
    pages: '13',
    topic: 'Hamkasblar va ota-onalar bilan hamkorlik',
    evidence: 'Ota-onani ta’lim va sinf hayotidagi qarorlarga jalb qilish; individual ta’lim trayektoriyasida pedagog va mutaxassislar bilan hamkorlik; mahalliy hamjamiyat bilan aloqa.',
    practice: 'O‘quvchining ehtiyojiga mos reja tayyorlashda zarur pedagog, mutaxassis va ota-onalar bilan o‘quvchining manfaatini ustun qo‘yib hamkorlik qiling.',
    distinction: 'Ota-onaga tayyor qarorni faqat ma’lum qilish uning qaror jarayonidagi mazmunli ishtiroki bilan bir xil emas.',
  },
}

export const KASB_PDF_EDITORIAL_CAUTION =
  'Qo‘llanmaning 1-betidagi 5/6-soha ro‘yxati asosiy bob sarlavhalariga mos emas. ' +
  'Ushbu sahifada asosiy matndagi 5-soha (10–11-bet: xavfsiz muhit), ' +
  '6-soha (12-bet: kasbiy o‘sish) tartibi ishlatiladi. ' +
  'Bu ikkilamchi metodik qo‘llanma bo‘lib, asl me’yoriy hujjat o‘rnini bosmaydi.'
