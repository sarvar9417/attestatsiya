#!/usr/bin/env node
/**
 * rebuild-days.mjs — Read days.ts, add new days, renumber, write.
 * Usage: node rebuild-days.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const FILE = 'src/data/speakingPath/days.ts';
const content = readFileSync(FILE, 'utf-8');

// ── 1. Extract all existing const dayN blocks ──────────────────
const BLOCK_RE = /const (day\d+): SpeakingDay = \{[\s\S]*?^}\n\n/gm;
const blocks = [];
let m;
while ((m = BLOCK_RE.exec(content))) blocks.push(m[1]);
console.log(`Found ${blocks.length} day blocks`);

// ── 2. Build lookup: variable → raw text ───────────────────────
const raw = {};
for (const v of blocks) {
  const re = new RegExp(`const ${v}: SpeakingDay = \\{[\\s\\S]*?^}\\n\\n`, 'm');
  const match = re.exec(content);
  if (match) raw[v] = match[0];
}

// ── 3. Helper: extract info from raw block ─────────────────────
function info(raw) {
  const day    = +(raw.match(/day:\s*(\d+)/)?.[1] ?? 0);
  const cefr   = raw.match(/cefr:\s*'(\w+)'/)?.[1];
  const review = /isReviewDay:\s*true/.test(raw);
  return { day, cefr, review };
}

// ── 4. Current CEFR counts ────────────────────────────────────
const counts = {};
for (const v of blocks) { const i = info(raw[v]); counts[i.cefr] = (counts[i.cefr]||0)+1; }
console.log('Current CEFR:', counts);

// ── 5. NEW A1 days (8 content + 3 review) ────────────────────
const NEW_A1 = [
  // --- Content ---
  { title: "Have got / Has got", sub: "Egallik va taqdimot", lesson: "have-got", review: false, chunks: [
    { en: "I have got a new laptop.", uz: "Men yangi noutbuk oldim.", tip: "'Have got' = egalik." },
    { en: "She has got two brothers.", uz: "Uning ikki ukasi bor.", tip: "'Has got' — uchinchi shaxs." },
    { en: "Have you got a pen?", uz: "Sizda qalam bor mi?", tip: "So'roq: 'Have you got …?'" },
    { en: "I haven't got a car.", uz: "Mening mashinam yo'q.", tip: "Inkor: 'haven't got'." },
    { en: "What have you got in your bag?", uz: "Sumkangda nima bor?", tip: "'What have you got …?'" },
    { en: "He has got a beautiful house.", uz: "Uning chiroyli uyi bor.", tip: "'He has got' = egalik." },
  ]},
  { title: "Can / Can't", sub: "Imkoniyat va qobiliyat", lesson: "can-cant", review: false, chunks: [
    { en: "I can swim very well.", uz: "Men juda yaxshi suza olaman.", tip: "'Can' + fe'l — imkoniyat." },
    { en: "She can speak three languages.", uz: "U uchta tillada gapira oladi.", tip: "'She can' — 'can' o'zgarmaydi." },
    { en: "Can you help me?", uz: "Menga yordam bera olasizmi?", tip: "So'roq: 'Can you …?'" },
    { en: "I can't drive.", uz: "Men hayday olmayman.", tip: "Inkor: 'can't'." },
    { en: "What can you do?", uz: "Nima qila olasiz?", tip: "'What can you do?'" },
    { en: "He can't cook at all.", uz: "U umuman ovqat pishira olmaydi.", tip: "'Can't … at all'." },
  ]},
  { title: "Present Continuous", sub: "Hozirgi davomiy zamon", lesson: "present-continuous-future", review: false, chunks: [
    { en: "I am reading a book.", uz: "Men kitob o'qiyapman.", tip: "'am' + V-ing." },
    { en: "She is cooking dinner.", uz: "U ovqat pishiryapti.", tip: "'She is cooking'." },
    { en: "What are you doing?", uz: "Nima qilyapsan?", tip: "'What are you doing?'" },
    { en: "We are not watching TV.", uz: "Biz televizor ko'rmayapmiz.", tip: "'are not' — inkor." },
    { en: "They are playing football.", uz: "Ular futbol o'ynayapti.", tip: "'They are playing'." },
    { en: "Is he working today?", uz: "U bugun ishlayaptimi?", tip: "So'roq: 'Is he …?'" },
  ]},
  { title: "Simple Past (Irregular)", sub: "O'tgan zamon (irregular verbs)", lesson: "simple-past", review: false, chunks: [
    { en: "I went to the market yesterday.", uz: "Men kecha bozorga bordim.", tip: "'Went' = go ning o'tgan zamoni." },
    { en: "She saw a movie last night.", uz: "U kecha kechda kino ko'rdi.", tip: "'Saw' = see ning o'tgan zamoni." },
    { en: "We ate dinner at 7.", uz: "Biz soat 7 da ovqat yedik.", tip: "'Ate' = eat ning o'tgan zamoni." },
    { en: "Did you go to school?", uz: "Siz maktabga bordingizmi?", tip: "So'roq: 'Did you …?'" },
    { en: "I didn't see him.", uz: "Men uni ko'rmadim.", tip: "Inkor: 'didn't + verb'." },
    { en: "She bought a new dress.", uz: "U yangi ko'ylak sotib oldi.", tip: "'Bought' = buy ning o'tgan zamoni." },
  ]},
  { title: "Simple Future", sub: "Kelajak zamon (will / going to)", lesson: "present-continuous-future", review: false, chunks: [
    { en: "I will help you.", uz: "Men senga yordam beraman.", tip: "'will' + fe'l — kelajak." },
    { en: "She is going to travel next month.", uz: "U kelgusi oy sayohat qilmoqchi.", tip: "'going to' — reja." },
    { en: "Will you come to my party?", uz: "Siz mening ziyofatimga kelasizmi?", tip: "So'roq: 'Will you …?'" },
    { en: "It will rain tomorrow.", uz: "Ertaga yog'ingarchilik bo'ladi.", tip: "'It will rain' — ob-havo." },
    { en: "I won't be late.", uz: "Men kechikmayman.", tip: "Inkor: 'won't'." },
    { en: "We are going to have dinner at 8.", uz: "Biz soat 8 da ovqat yeymiz.", tip: "'going to' — reja." },
  ]},
  { title: "Question Words", sub: "So'roq so'zlari", lesson: "questions", review: false, chunks: [
    { en: "Who is your best friend?", uz: "Kim eng yaqin do'stingiz?", tip: "'Who' — kim." },
    { en: "What do you do for a living?", uz: "Nima ish qilasiz?", tip: "'What' — nima." },
    { en: "Where do you live?", uz: "Qayerda yashaysiz?", tip: "'Where' — qayer." },
    { en: "When is your birthday?", uz: "Tug'ilgan kuningiz qachon?", tip: "'When' — qachon." },
    { en: "Why are you late?", uz: "Nega kechikdingiz?", tip: "'Why' — nega." },
    { en: "How old are you?", uz: "Yoshingiz nechada?", tip: "'How' — qanday." },
  ]},
  { title: "Conjunctions", sub: "Bog'lovchi so'zlar", lesson: "simple-present", review: false, chunks: [
    { en: "I have a cat and a dog.", uz: "Mening itim va mushugim bor.", tip: "'And' — va." },
    { en: "I like tea but I hate coffee.", uz: "Men choyni yaxshi ko'raman, lekin qahvani yoqtirmayman.", tip: "'But' — lekin." },
    { en: "Do you want tea or coffee?", uz: "Choy yoki qahva xohlaysiz?", tip: "'Or' — yoki." },
    { en: "I stayed home because it rained.", uz: "Men uyda qoldim, chunki yog'ib ketdi.", tip: "'Because' — chunki." },
    { en: "I want to go and see a movie.", uz: "Men borib kino ko'rishni xohlayman.", tip: "'And' — harakatlar." },
    { en: "You can stay or you can leave.", uz: "Siz qolishingiz yoki ketishingiz mumkin.", tip: "'Or' — tanlov." },
  ]},
  { title: "Body Parts", sub: "Tana qismlari", lesson: "basic-adjectives", review: false, chunks: [
    { en: "My head hurts.", uz: "Boshim og'riyapti.", tip: "Tana qismi + 'hurts'." },
    { en: "I have a stomach ache.", uz: "Qorinim og'riyapti.", tip: "'Stomach ache' = qorin og'rig'i." },
    { en: "What's wrong?", uz: "Nima bo'ldi?", tip: "So'roq: 'What's wrong?'" },
    { en: "I feel dizzy.", uz: "Boshim aylanayapti.", tip: "'I feel dizzy'." },
    { en: "I need to see a doctor.", uz: "Shifokorga borishim kerak.", tip: "'need to' — kerak." },
    { en: "Take care of yourself.", uz: "O'zingizga g'amxo'rlik qiling.", tip: "'Take care of yourself'." },
  ]},
  // --- Reviews ---
  { title: "A1 Review 1", sub: "Birinchi A1 daraja tekshiruvi", lesson: null, review: true, chunks: [
    { en: "Can I have a coffee, please?", uz: "Iltimos, menga qahva bering.", tip: "'Can I have …?'" },
    { en: "I am from Uzbekistan.", uz: "Men O'zbekistondanman.", tip: "'I am from …'" },
    { en: "I have got a new phone.", uz: "Men yangi telefon oldim.", tip: "'have got' — egalik." },
    { en: "I can speak English.", uz: "Men inglizcha gapira olaman.", tip: "'can' — imkoniyat." },
    { en: "I am reading a book.", uz: "Men kitob o'qiyapman.", tip: "'am + V-ing'." },
    { en: "I went to school yesterday.", uz: "Men kecha maktabga bordim.", tip: "'went' — o'tgan zamon." },
  ]},
  { title: "A1 Review 2", sub: "Ikkinchi A1 daraja tekshiruvi", lesson: null, review: true, chunks: [
    { en: "Who is your best friend?", uz: "Kim eng yaqin do'stingiz?", tip: "'Who' — so'roq." },
    { en: "Where do you live?", uz: "Qayerda yashaysiz?", tip: "'Where' — so'roq." },
    { en: "I have a cat and a dog.", uz: "Mening itim va mushugim bor.", tip: "'and' — bog'lovchi." },
    { en: "I like tea but I hate coffee.", uz: "Men choyni yaxshi ko'raman, lekin qahvani yoqtirmayman.", tip: "'but' — bog'lovchi." },
    { en: "My head hurts.", uz: "Boshim og'riyapti.", tip: "Tana qismlari." },
    { en: "Will you come to my party?", uz: "Siz mening ziyofatimga kelasizmi?", tip: "'Will' — kelajak." },
  ]},
  { title: "A1 Final Review", sub: "A1 darajasining yakuniy tekshiruvi", lesson: null, review: true, chunks: [
    { en: "Hello! My name is Aziz.", uz: "Salom! Mening ismim Aziz.", tip: "Salomlashish." },
    { en: "I am from Uzbekistan.", uz: "Men O'zbekistondanman.", tip: "Qayerdanlik." },
    { en: "Can you help me?", uz: "Menga yordam bera olasizmi?", tip: "'Can' — imkoniyat." },
    { en: "I went to the market yesterday.", uz: "Men kecha bozorga bordim.", tip: "O'tgan zamon." },
    { en: "Who is your teacher?", uz: "Kim sizning o'qituvchingiz?", tip: "'Who' — so'roq." },
    { en: "I have got a new phone.", uz: "Men yangi telefon oldim.", tip: "'have got' — egalik." },
  ]},
];

// ── 6. NEW A2 days (3 content + 3 review) ────────────────────
const NEW_A2 = [
  { title: "Past Continuous", sub: "O'tmishda davomiylik", lesson: "present-continuous-future", review: false, chunks: [
    { en: "I was reading a book when you called.", uz: "Sen qo'ng'iroq qilganda men kitob o'qiyotgan edim.", tip: "'was reading' — o'tmishda davomiy." },
    { en: "They were playing football while I was cooking.", uz: "Ular futbol o'ynayotgan edilar men ovqat pishirayotgan edim.", tip: "'were playing' — ko'p sonli shaxs." },
    { en: "What were you doing at 8 o'clock?", uz: "Sen soat 8 da nima qilyotgan eding?", tip: "So'roq: 'What were you …?'" },
    { en: "I wasn't sleeping when the phone rang.", uz: "Telefon qo'ng'iroq qilganda men uyquda emas edim.", tip: "Inkor: 'wasn't sleeping'." },
    { en: "She was studying while I was watching TV.", uz: "U o'qiyotgan edimen televizor ko'rayotgan edim.", tip: "'While' — ekan." },
    { en: "Suddenly, it started to rain.", uz: "To'satdan, yog'ib ketdi.", tip: "'Suddenly' — to'satdan." },
  ]},
  { title: "Too / Enough", sub: "Haddan tashqari va yetarli", lesson: "adjective-adverb", review: false, chunks: [
    { en: "This coffee is too hot.", uz: "Bu qahva juda issiq.", tip: "'Too + sifat' — haddan tashqari." },
    { en: "She is old enough to drive.", uz: "U haydash uchun yetarlicha katta.", tip: "'adj + enough' — yetarli." },
    { en: "I don't have enough money.", uz: "Mening yetarlicha pulim yo'q.", tip: "'enough + ot' — yetarli." },
    { en: "This bag is too heavy.", uz: "Bu sumka juda og'ir.", tip: "'Too heavy' — juda og'ir." },
    { en: "He runs too fast.", uz: "U juda tez yuguradi.", tip: "'Too + ravish'." },
    { en: "Is this shirt big enough?", uz: "Bu ko'ylak yetarlicha kattami?", tip: "So'roq: 'Is … enough?'" },
  ]},
  { title: "So / Such", sub: "Daraja va ta'kidlash", lesson: "adjective-adverb", review: false, chunks: [
    { en: "The weather is so nice today!", uz: "Ob-havo juda chiroyli!", tip: "'So + sifat' — juda." },
    { en: "It is such a beautiful day.", uz: "Bu juda chiroyli kun.", tip: "'Such a + adj + noun'." },
    { en: "I have so much work to do.", uz: "Mening juda ko'p ishim bor.", tip: "'So much + uncountable'." },
    { en: "She has so many friends.", uz: "Uning juda ko'p do'stlari bor.", tip: "'So many + plural noun'." },
    { en: "This is such a good book!", uz: "Bu juda yaxshi kitob!", tip: "'Such a + adj + noun'." },
    { en: "It was so cold yesterday.", uz: "Kecha juda sovuq edi.", tip: "'So + adj' — o'tmishda." },
  ]},
  // Reviews
  { title: "A2 Review 1", sub: "Birinchi A2 daraja tekshiruvi", lesson: null, review: true, chunks: [
    { en: "I went to the market yesterday.", uz: "Men kecha bozorga bordim.", tip: "O'tgan zamon." },
    { en: "I am going to travel next month.", uz: "Men kelgusi oy sayohat qilmoqchi.", tip: "'going to' — kelajak." },
    { en: "I like tea but I hate coffee.", uz: "Men choyni yaxshi ko'raman, lekin qahvani yoqtirmayman.", tip: "'but' — bog'lovchi." },
    { en: "Can you help me?", uz: "Menga yordam bera olasizmi?", tip: "'Can' — imkoniyat." },
    { en: "My head hurts.", uz: "Boshim og'riyapti.", tip: "Tana qismlari." },
    { en: "I have got a new phone.", uz: "Men yangi telefon oldim.", tip: "'have got' — egalik." },
  ]},
  { title: "A2 Review 2", sub: "Ikkinchi A2 daraja tekshiruvi", lesson: null, review: true, chunks: [
    { en: "I was reading when you called.", uz: "Sen qo'ng'iroq qilganda men kitob o'qiyotgan edim.", tip: "Past Continuous." },
    { en: "This coffee is too hot.", uz: "Bu qahva juda issiq.", tip: "'Too' — haddan tashqari." },
    { en: "It is such a beautiful day.", uz: "Bu juda chiroyli kun.", tip: "'Such' — ta'kidlash." },
    { en: "She is old enough to drive.", uz: "U haydash uchun yetarlicha katta.", tip: "'Enough' — yetarli." },
    { en: "They were playing football.", uz: "Ular futbol o'ynayotgan edilar.", tip: "Past Continuous." },
    { en: "I don't have enough time.", uz: "Mening yetarlicha vaqtim yo'q.", tip: "'Enough' — yetarli." },
  ]},
  { title: "A2 Final Review", sub: "A2 darajasining yakuniy tekshiruvi", lesson: null, review: true, chunks: [
    { en: "Hello! My name is Aziz.", uz: "Salom! Mening ismim Aziz.", tip: "Salomlashish." },
    { en: "I went to the market yesterday.", uz: "Men kecha bozorga bordim.", tip: "O'tgan zamon." },
    { en: "I was reading when you called.", uz: "Sen qo'ng'iroq qilganda men kitob o'qiyotgan edim.", tip: "Past Continuous." },
    { en: "This coffee is too hot.", uz: "Bu qahva juda issiq.", tip: "'Too' — haddan tashqari." },
    { en: "I have so much work.", uz: "Mening juda ko'p ishim bor.", tip: "'So much' — ta'kidlash." },
    { en: "She is old enough to drive.", uz: "U haydash uchun yetarlicha katta.", tip: "'Enough' — yetarli." },
  ]},
];

console.log(`NEW A1: ${NEW_A1.length} days, NEW A2: ${NEW_A2.length} days`);

// ── 7. Group existing days by CEFR ───────────────────────────
const cefrBuckets = { A0: [], A1: [], A2: [], B1: [], B2: [] };
for (const v of blocks) {
  const i = info(raw[v]);
  if (cefrBuckets[i.cefr]) cefrBuckets[i.cefr].push({ v, ...i });
}

// Add new A1 after existing A1
for (const nd of NEW_A1) {
  cefrBuckets.A1.push({ v: `_newA1_${nd.title}`, cefr: 'A1', review: nd.review, isNew: true, ...nd });
}
// Add new A2 after existing A2
for (const nd of NEW_A2) {
  cefrBuckets.A2.push({ v: `_newA2_${nd.title}`, cefr: 'A2', review: nd.review, isNew: true, ...nd });
}

// Sort within each bucket: content first, then review
for (const c of ['A0','A1','A2','B1','B2']) {
  cefrBuckets[c].sort((a,b) => (a.review?1:0) - (b.review?1:0));
}

console.log('CEFR after additions:');
for (const c of ['A0','A1','A2','B1','B2']) console.log(`  ${c}: ${cefrBuckets[c].length}`);

// ── 8. Assign new day numbers ────────────────────────────────
let dayNum = 1;
const flat = [];
for (const c of ['A0','A1','A2','B1','B2']) {
  for (const entry of cefrBuckets[c]) {
    flat.push({ ...entry, newDay: dayNum++ });
  }
}
console.log(`Total days: ${flat.length}`);

// ── 9. Build new file ────────────────────────────────────────
function makeDayBlock(entry) {
  const n = entry.newDay;
  const varName = `day${n}`;

  if (entry.isNew) {
    // Build from structured data
    let lessonLine = entry.lesson ? `  linkedLessonId: '${entry.lesson}',` : '';
    let reviewLine = entry.review ? '  isReviewDay: true,' : '';

    const chunkLines = entry.chunks.map((c, i) => {
      return `    { id: 'sp-d${n}-c${i+1}', en: "${c.en}", uz: "${c.uz}", grammarTip: "${c.tip}", commonMistake: "${c.en} to'g'ri — grammani tekshiring.", stressWord: "${c.en.split(' ')[0].toUpperCase()}" },`;
    }).join('\n');

    return `const ${varName}: SpeakingDay = {
  day: ${n}, cefr: '${entry.cefr}',
  title: "${entry.title}",
  subtitle: "${entry.sub}",
  goalUz: "${entry.title} mavzusini mustahkamlang.",
  estMinutes: ${entry.review ? 15 : 12},
  ${lessonLine}
  ${reviewLine}
  vocab: [],
  pronunciationFocus: {
    sound: '/θ/',
    ipaExample: '/θ/ — think, three, thank',
    tipUz: "Til tishlar orasida, nafas chiqaring.",
    tipEn: "Tongue between teeth, breathe out.",
  },
  chunks: [
${chunkLines}
  ],
  scenario: {
    topic: "${entry.title.toLowerCase()}",
    aiRole: "a friendly examiner",
    userRole: "a student",
    opening: "Let's practice ${entry.title.toLowerCase()}.",
    goalUz: "${entry.title} mavzusini mustahkamlang.",
  },
}
`;
  }

  // Existing day — copy raw, just update day number and variable name
  let block = raw[entry.v];
  // Replace variable name
  block = block.replace(/const day\d+/, `const ${varName}`);
  // Replace day number
  block = block.replace(/day:\s*\d+/, `day: ${n}`);
  return block;
}

const header = `// Speaking Path — 120 kunlik narvon (to'liq kontent)
// Reja: docs/speaking-path-roadmap.md
// Authoring: A0 dan B2 gacha, i+1 qiyinlashish, yuqori chastotali bloklar, gapiriladigan jumlalar (so'z emas)
// Eslatma: o'zbekcha matnda apostrof (o', g', yo') bor — barcha matn maydonlari
// qo'sh tirnoq (") ichida yoziladi.
// Faza 1 qo'shimchalari: grammarTip, pronunciationFocus, recycledChunkIds (spiral curriculum)

import type { SpeakingDay } from './types'

`;

const allBlocks = flat.map(e => makeDayBlock(e)).join('\n');
const exportArr = flat.map(e => `day${e.newDay}`).join(', ');

const footer = `
export const SPEAKING_DAYS: SpeakingDay[] = [
  ${exportArr},
]
`;

writeFileSync(FILE, header + allBlocks + footer, 'utf-8');
console.log('\n✓ File written successfully');
console.log(`  Lines: ${(header + allBlocks + footer).split('\n').length}`);
