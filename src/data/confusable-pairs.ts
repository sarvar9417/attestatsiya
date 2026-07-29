// ═══════════════════════════════════════════════════════════════════════════
// Confusable Pairs — O'zbek o'quvchilari uchun chalkash so'zlar lug'ati
// ═══════════════════════════════════════════════════════════════════════════

export interface ConfusablePair {
  id: string
  words: string[]      // chalkashadigan so'zlar (odatda 2 ta)
  uzTitle: string              // O'zbekcha nomi
  rule: string                 // Farqni tushuntirish
  memoryHook: string           // Yodda saqlash uchun hiyla
  examples: Array<{ correct: string; wrong: string; explanation: string }>
}

export const CONFUSABLE_PAIRS: ConfusablePair[] = [
  {
    id: 'make-do',
    words: ['make', 'do'],
    uzTitle: 'Make vs Do — Yaratish va Bajarish',
    rule: "MAKE — yaratish, ishlab chiqarish, sabab bo'lish.\nDO — harakatni bajarish, vazifani amalga oshirish.",
    memoryHook: "MAKE = Material (nimadir yaratiladi). DO = Do-ing (vazifani bajarish).\nMake a cake (tort yaratish), Do homework (vazifani bajarish).",
    examples: [
      { correct: "Can you make me a coffee?", wrong: "Can you do me a coffee?", explanation: "Kofe — yaratiladigan narsa → MAKE" },
      { correct: "I need to do my homework.", wrong: "I need to make my homework.", explanation: "Uy vazifasi — bajariladigan ish → DO" },
      { correct: "She made a mistake.", wrong: "She did a mistake.", explanation: "Xato — 'make a mistake' (barqaror ibora)" },
      { correct: "He did his best.", wrong: "He made his best.", explanation: "Harakatni bajarish → 'do your best'" },
    ],
  },
  {
    id: 'say-tell',
    words: ['say', 'tell'],
    uzTitle: 'Say vs Tell — Aytish va Gapirish',
    rule: "SAY + nima (what you say).\nTELL + kimga (who you tell).",
    memoryHook: "TELL = Tell has 'T' for 'To someone'.\nSAY = No person needed: say something.\nTell me (menga ayt). Say that (shuni ayt).",
    examples: [
      { correct: "She said she was tired.", wrong: "She told she was tired.", explanation: "Kimga emas, nima deyilgani muhim → SAY" },
      { correct: "Tell me the truth.", wrong: "Say me the truth.", explanation: "Kimga aytilayotgani bor → TELL + me" },
      { correct: "He said goodbye.", wrong: "He told goodbye.", explanation: "Goodbye — nima deyilgani → SAY" },
      { correct: "I told him to wait.", wrong: "I said him to wait.", explanation: "Kimga aytilgani bor (him) → TELL" },
    ],
  },
  {
    id: 'lend-borrow',
    words: ['lend', 'borrow'],
    uzTitle: 'Lend vs Borrow — Berish va Olish',
    rule: "LEND — siz berasiz (boshqa odamga).\nBORROW — siz olasiz (boshqa odamdan).",
    memoryHook: "LEND = Lend = Leave (ketishiga qo'yish — berish).\nBORROW = Bring to yourself (olish).\nIf you LEND, it leaves you. If you BORROW, it comes to you.",
    examples: [
      { correct: "Can you lend me your pen?", wrong: "Can you borrow me your pen?", explanation: "Siz so'rayapsiz, ular beradi → LEND" },
      { correct: "Can I borrow your car?", wrong: "Can I lend your car?", explanation: "Siz olasiz, ular beradi → BORROW" },
      { correct: "I lent him $50.", wrong: "I borrowed him $50.", explanation: "Siz berdiz → LENT (lendning o'tgan zamoni)" },
      { correct: "She borrowed a book from the library.", wrong: "She lent a book from the library.", explanation: "Kutubxonadan oldi → BORROWED" },
    ],
  },
  {
    id: 'much-many',
    words: ['much', 'many'],
    uzTitle: 'Much vs Many — Ko\'p miqdor',
    rule: "MUCH — sanalmaydigan otlar bilan (water, time, information).\nMANY — sanaladigan otlar bilan (books, people, cars).",
    memoryHook: "MANY = Many apples (sanash mumkin).\nMUCH = Much water (sanab bo'lmaydi).\nMUCH = Mass (massa). MANY = Countable (sanaluvchi).",
    examples: [
      { correct: "How much water do you drink?", wrong: "How many water do you drink?", explanation: "Water — sanalmaydi → MUCH" },
      { correct: "How many books do you have?", wrong: "How much books do you have?", explanation: "Books — sanaladi → MANY" },
      { correct: "There isn't much time.", wrong: "There isn't many time.", explanation: "Time — sanalmaydi → MUCH" },
      { correct: "Too many people came.", wrong: "Too much people came.", explanation: "People — sanaladi → MANY" },
    ],
  },
  {
    id: 'this-that',
    words: ['this', 'that'],
    uzTitle: 'This vs That — Yaqin va Uzoq',
    rule: "THIS — yaqin narsa (qo'lingizdagi).\nTHAT — uzoq narsa (ko'rsatib turganingiz).",
    memoryHook: "THIS = T for 'close to me'.\nTHAT = T for 'far from me' — yo'q, ikkalasi T bilan boshlanadi, esda qolmaydi.\nTHIS = Here (shu yerda). THAT = There (u yerda).\nTHIS = Barmoq yoningizda. THAT = Barmoq uzoqda.",
    examples: [
      { correct: "This is my phone. (in my hand)", wrong: "That is my phone. (when holding it)", explanation: "Qo'lingizda → THIS" },
      { correct: "That building over there is the museum.", wrong: "This building over there is the museum.", explanation: "Uzoqda → THAT" },
      { correct: "This pizza is delicious! (eating it now)", wrong: "That pizza is delicious! (eating it now)", explanation: "Hozir yeyotgan bo'lsangiz → THIS" },
    ],
  },
  {
    id: 'some-any',
    words: ['some', 'any'],
    uzTitle: 'Some vs Any — Bir qancha va Hech qanday',
    rule: "SOME — tasdiq gaplarda, taklif va iltimoslarda.\nANY — so'roq va inkor gaplarda.",
    memoryHook: "SOME = Positive (tasdiq). Any = Questions & Negatives (so'roq va inkor).\nOFFER: 'Would you like SOME tea?' — taklif qilayotganda SOME.",
    examples: [
      { correct: "I have some friends in London.", wrong: "I have any friends in London.", explanation: "Tasdiq gap → SOME" },
      { correct: "Do you have any questions?", wrong: "Do you have some questions?", explanation: "So'roq gap → ANY" },
      { correct: "I don't have any money.", wrong: "I don't have some money.", explanation: "Inkor gap → ANY" },
      { correct: "Would you like some coffee?", wrong: "Would you like any coffee?", explanation: "Taklif → SOME" },
    ],
  },
  {
    id: 'a-an-the',
    words: ['a', 'an', 'the'],
    uzTitle: 'A/An/The — Artikllar',
    rule: "A — undosh tovushdan oldin (a book).\nAN — unli tovushdan oldin (an apple).\nTHE — aniq, ma'lum narsa haqida (the book on the table).",
    memoryHook: "A/An = 'Bir' (noaniq). THE = 'O'sha' (aniq).\nAN = unlilar uchun: a+e+i+o+u → AN.\nTHE = barmoq bilan ko'rsatsangiz bo'ladigan narsa.",
    examples: [
      { correct: "I saw a dog in the park.", wrong: "I saw the dog in the park. (first mention)", explanation: "Birinchi marta aytilayotgan → A" },
      { correct: "The dog was brown. (the same dog)", wrong: "A dog was brown. (second mention)", explanation: "Avval aytilgan → THE" },
      { correct: "She is an engineer.", wrong: "She is a engineer.", explanation: "Engineer unli bilan boshlanadi → AN" },
      { correct: "The sun rises in the east.", wrong: "A sun rises in an east.", explanation: "Yagona narsalar → THE" },
    ],
  },
  {
    id: 'can-could-may',
    words: ['can', 'could', 'may'],
    uzTitle: 'Can/Could/May — Ruxsat va Iltimos',
    rule: "CAN — qobiliyat, ruxsat (norasmiy).\nCOULD — iltimos (muloyim), o'tgan zamon.\nMAY — ruxsat (rasmiy).",
    memoryHook: "CAN = I CAN do it (qila olaman).\nCOULD = Could you... (iltimos, muloyimroq).\nMAY = May I... (rasmiy ruxsat).\nRasmiylik darajasi: CAN (eng oddiy) < COULD < MAY (eng rasmiy).",
    examples: [
      { correct: "Can you help me?", wrong: "May you help me?", explanation: "Iltimos → CAN yoki COULD, MAY emas" },
      { correct: "May I come in?", wrong: "Can I come in? (too informal for formal setting)", explanation: "Rasmiy ruxsat → MAY" },
      { correct: "Could you pass the salt?", wrong: "Can you pass the salt? (less polite)", explanation: "Muloyim iltimos → COULD" },
      { correct: "I can swim.", wrong: "I may swim.", explanation: "Qobiliyat → CAN" },
    ],
  },
  {
    id: 'will-going-to',
    words: ['will', 'going to'],
    uzTitle: 'Will vs Going to — Kelasi zamon',
    rule: "WILL — spontan qarorlar, va'dalar, bashoratlar.\nGOING TO — oldindan o'ylangan rejalar, aniq dalillar.",
    memoryHook: "WILL = Hozir qaror qildim ⚡ (spontan).\nGOING TO = Allaqachon reja 📅 (oldindan).\n'Oh, I forgot! I WILL call her.' (hozir qaror)\n'I AM GOING TO visit Paris next year.' (reja)",
    examples: [
      { correct: "The phone is ringing. I'll get it!", wrong: "The phone is ringing. I'm going to get it!", explanation: "Hozirgi spontan qaror → WILL" },
      { correct: "We are going to buy a house next year.", wrong: "We will buy a house next year. (sounds less planned)", explanation: "Oldindan reja → GOING TO" },
      { correct: "I think it will rain tomorrow.", wrong: "I think it is going to rain tomorrow.", explanation: "Bashorat → WILL" },
      { correct: "Look at those clouds! It's going to rain.", wrong: "Look at those clouds! It will rain.", explanation: "Aniq dalil bor → GOING TO" },
    ],
  },
  {
    id: 'since-for',
    words: ['since', 'for'],
    uzTitle: 'Since vs For — Vaqt bildirish',
    rule: "SINCE + aniq vaqt (since 2020, since Monday).\nFOR + vaqt oralig'i (for 3 years, for 2 hours).",
    memoryHook: "SINCE = Specific (aniq nuqta). FOR = Duration (davomiylik).\nSince = nuqta 🎯. For = davr 📏.",
    examples: [
      { correct: "I have lived here since 2019.", wrong: "I have lived here for 2019.", explanation: "Aniq yil → SINCE" },
      { correct: "She has studied for 3 hours.", wrong: "She has studied since 3 hours.", explanation: "Vaqt oralig'i → FOR" },
      { correct: "He has been sleeping since 10 PM.", wrong: "He has been sleeping for 10 PM.", explanation: "Aniq vaqt → SINCE" },
    ],
  },
]

/** Berilgan so'z confusable pair dan biri ekanligini tekshiradi */
export function findConfusablePair(word: string): ConfusablePair | undefined {
  return CONFUSABLE_PAIRS.find(p => p.words.some(w => w.toLowerCase() === word.toLowerCase()))
}

/** Ikki so'z bir-biri bilan confusable pair ekanligini tekshiradi */
export function areConfusable(word1: string, word2: string): boolean {
  if (word1.toLowerCase() === word2.toLowerCase()) return false
  return CONFUSABLE_PAIRS.some(p =>
    p.words.some(w => w.toLowerCase() === word1.toLowerCase()) &&
    p.words.some(w => w.toLowerCase() === word2.toLowerCase())
  )
}

/**
 * Berilgan so'zning confusable pair'dagi sherik(lar)ini qaytaradi.
 * Masalan: 'make' -> ['do'], 'a' -> ['an', 'the']
 */
export function getConfusablePartnerWords(word: string): string[] {
  const pair = findConfusablePair(word)
  if (!pair) return []
  return pair.words.filter(w => w.toLowerCase() !== word.toLowerCase())
}
