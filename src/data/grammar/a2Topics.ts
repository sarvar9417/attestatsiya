import type { GrammarTopic } from "./types"
// ─── Topic 4: Comparatives and Superlatives ──────────────────────────────────

export const comparativesSuperlatives: GrammarTopic = {
  id: 'comparatives-superlatives',
  title: 'Comparatives and Superlatives',
  subtitle: "Sifatlarning qiyosiy va ustun darajalari — taqqoslash va eng yaxshini aniqlash",
  level: 'A2',
  week: 2,
  tag: 'Comparatives',
  formula: 'Adj + -er / more + Adj (comparative) · the Adj + -est / the most + Adj (superlative)',
  formulaRows: [
    { label: "Qisqa (1 bo'g'in)",  structure: 'Adj + -er (comparative) · the Adj + -est (superlative)',        color: 'blue'   },
    { label: "Uzun (2+ bo'g'in)",  structure: 'more + Adj (comparative) · the most + Adj (superlative)',       color: 'purple' },
    { label: "-y bilan tugagan",   structure: 'Adj (-y → -i) + -er/-est',                                     color: 'green'  },
    { label: "Noto'g'ri (Irregular)", structure: 'good → better → the best · bad → worse → the worst · far → farther → the farthest', color: 'orange' },
  ],
  usedFor: [
    "Comparative: ikki narsa yoki odamni solishtirish uchun — 'than' bilan ishlatiladi",
    "Superlative: uch yoki undan ortiq narsa ichidan eng yuqori darajasini ko'rsatish uchun — 'the' bilan ishlatiladi",
    "Tenglikni ko'rsatish: 'as + adj + as' (bir xil daraja) yoki 'not as + adj + as' (teng emas)",
    "Kuchaytiruvchi so'zlar: 'much', 'a lot', 'far' comparative bilan; 'by far' superlative bilan ishlatiladi",
  ],
  examples: [
    { en: 'My house is bigger than yours.', uz: "Mening uyim siznikidan kattaroq." },
    { en: 'She runs faster than me.', uz: "U mendan tezroq yuguradi." },
    { en: 'This is the most beautiful city I have ever visited.', uz: "Bu men tashrif buyurgan eng chiroyli shahar." },
    { en: 'He is the best student in the class.', uz: "U sinfdagi eng yaxshi o'quvchi." },
    { en: 'Today is colder than yesterday.', uz: "Bugun kechagidan sovuqroq." },
    { en: 'This book is as interesting as that one.', uz: "Bu kitob o'shanchalik qiziqarli." },
    { en: 'She is happier now than before.', uz: "U avvalgidan hozir baxtliroq." },
    { en: 'This is the worst film I have ever seen.', uz: "Bu men ko'rgan eng yomon film." },
  ],
  exercises: [
    // ── Fill-blank (1–4) ──────────────────────────────────────────────────
    {
      id: 1, type: 'fill-blank',
      instruction: "Bo'sh joyni comparative yoki superlative bilan to'ldiring:",
      question: "A car is _____ (fast) than a bicycle.",
      blanks: ['faster'],
      explanation: "'Fast' qisqa sifat (1 bo'g'in) → comparative: 'faster'. 'Than' bilan solishtirish.",
    },
    {
      id: 2, type: 'fill-blank',
      instruction: "Bo'sh joyni comparative yoki superlative bilan to'ldiring:",
      question: "Mount Everest is _____ (high) mountain in the world.",
      blanks: ['the highest'],
      explanation: "'In the world' = eng yuqori → Superlative: 'the highest'.",
    },
    {
      id: 3, type: 'fill-blank',
      instruction: "Bo'sh joyni comparative yoki superlative bilan to'ldiring:",
      question: "This exercise is _____ (easy) than the last one.",
      blanks: ['easier'],
      explanation: "'Easy' → -y bilan tugagan → 'y' → 'i' + 'er': 'easier'. 'Than' = comparative.",
    },
    {
      id: 4, type: 'fill-blank',
      instruction: "Bo'sh joyni comparative yoki superlative bilan to'ldiring:",
      question: "She speaks English _____ (good) than me.",
      blanks: ['better'],
      explanation: "'Good' noto'g'ri shakl → 'better' (comparative). 'Gooder' deyilmaydi!",
    },
    // ── Multiple choice (5–9) ─────────────────────────────────────────────
    {
      id: 5, type: 'multiple-choice',
      instruction: "To'g'ri comparative shaklni tanlang:",
      question: "This book is ___ than that one.",
      options: ['more interesting', 'interesting', 'the most interesting', 'interestinger'],
      correct: 'more interesting',
      explanation: "'Interesting' uzun sifat (3 bo'g'in) → 'more + interesting'. 'Than' → comparative.",
    },
    {
      id: 6, type: 'multiple-choice',
      instruction: "To'g'ri superlative shaklni tanlang:",
      question: "She is ___ girl in our class.",
      options: ['the most tall', 'taller', 'the tallest', 'tallest'],
      correct: 'the tallest',
      explanation: "Superlative: 'the + tallest'. 'The' va '-est' qisqa sifatga qo'shiladi.",
    },
    {
      id: 7, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Who is ___ person in your family?",
      options: ['the most old', 'the oldest', 'older', 'oldest'],
      correct: 'the oldest',
      explanation: "'In your family' = guruh → Superlative: 'the oldest'.",
    },
    {
      id: 8, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "This is ___ book I have ever read. I love it!",
      options: ['the better', 'the goodest', 'the best', 'better'],
      correct: 'the best',
      explanation: "'Good' → superlative: 'the best'. 'Ever' = hozirgacha eng yaxshisi.",
    },
    {
      id: 9, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Which sentence is CORRECT?",
      options: [
        'She is more taller than me.',
        'She is taller than me.',
        'She is more tall than me.',
        'She is the most tallest.',
      ],
      correct: 'She is taller than me.',
      explanation: "'Taller' o'zi comparative. 'More taller' (double) xato.",
    },
    // ── Error correction (10–14) ──────────────────────────────────────────
    {
      id: 10, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "She is more taller than her sister.",
      errorPart: 'more taller',
      correct: 'She is taller than her sister.',
      explanation: "'Tall' qisqa → faqat '-er': 'taller'. 'More' qo'shilmaydi — double comparative xato.",
    },
    {
      id: 11, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "My English is getting gooder every day!",
      errorPart: 'gooder',
      correct: 'My English is getting better every day!',
      explanation: "'Good' noto'g'ri sifat — comparative: 'better'. 'Gooder' deyilmaydi.",
    },
    {
      id: 12, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "February is the most coldest month of the year.",
      errorPart: 'most coldest',
      correct: 'February is the coldest month of the year.',
      explanation: "'Cold' qisqa → 'the coldest'. 'Most' bilan '-est' birga ishlatilmaydi.",
    },
    {
      id: 13, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "She is taller then her brother.",
      errorPart: 'then',
      correct: 'She is taller than her brother.',
      explanation: "'Then' = 'keyin', 'than' = 'dan/ga qaraganda'. Comparative bilan 'than' ishlatiladi.",
    },
    {
      id: 14, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "This is the most easy test I have ever taken.",
      errorPart: 'most easy',
      correct: 'This is the easiest test I have ever taken.',
      explanation: "'Easy' -y bilan tugaydi → 'y' → 'i' + 'est': 'the easiest'. 'The most easy' xato.",
    },
    // ── Transformation (15–18) ────────────────────────────────────────────
    {
      id: 15, type: 'transformation',
      instruction: "Gapni Comparative shaklida qayta yozing:",
      question: "Russia is large. Canada is larger.",
      hint: "Canada is ...",
      correct: 'Canada is larger than Russia.',
      explanation: "Solishtirish → 'larger than'. 'Large' → 'larger' (e bilan → faqat '-r').",
    },
    {
      id: 16, type: 'transformation',
      instruction: "Superlative bilan gap tuzing:",
      question: "No other student in the class is as tall as him.",
      hint: "He is ...",
      correct: 'He is the tallest student in the class.',
      explanation: "Eng yuqori daraja → 'the + tallest'.",
    },
    {
      id: 17, type: 'transformation',
      instruction: "Gapni 'as ... as' yordamida qayta yozing:",
      question: "My car is faster than yours.",
      hint: "Your car is not ...",
      correct: "Your car is not as fast as mine.",
      explanation: "'Faster than' → 'not as fast as'. 'As + adj + as' tengsizlikni bildiradi.",
    },
    {
      id: 18, type: 'transformation',
      instruction: "Superlative bilan qayta yozing:",
      question: "I have never eaten a more delicious plov than this one.",
      hint: "This is ...",
      correct: 'This is the most delicious plov I have ever eaten.',
      explanation: "'Never ... more' → 'the most'. 'Delicious' uzun → 'the most delicious'.",
    },
    // ── Additional fill-blank (19–20) ─────────────────────────────────────
    {
      id: 19, type: 'fill-blank',
      instruction: "Comparative yoki Superlative bilan to'ldiring:",
      question: "This is _____ (bad) meal I have ever eaten. I can't eat it!",
      blanks: ['the worst'],
      explanation: "'Bad' → noto'g'ri: 'the worst' (superlative). 'Ever' = hozirgacha eng yomoni.",
    },
    {
      id: 20, type: 'fill-blank',
      instruction: "Comparative yoki Superlative bilan to'ldiring:",
      question: "Summer is _____ (hot) than spring in Uzbekistan.",
      blanks: ['hotter'],
      explanation: "'Hot' → qisqa, CVC (undosh+unli+undosh) → undosh ikki marta: 'hotter'.",
    },
  ],
}

// ─── Topic 5: Modal Verbs (A2) ────────────────────────────────────────────────

export const modalVerbsA2: GrammarTopic = {
  id: 'modal-verbs-a2',
  title: 'Modal Verbs',
  subtitle: "Can, must, should, might, have to — modal fe'llar",
  level: 'A2',
  week: 2,
  tag: 'Modals',
  formula: 'can / must / should / might / have to + V¹',
  formulaRows: [
    { label: 'Qobiliyat / ruxsat',  structure: 'Subject + can + V¹',         color: 'blue'   },
    { label: 'Majburiyat',          structure: 'Subject + must / have to + V¹', color: 'purple' },
    { label: 'Maslahat',            structure: 'Subject + should + V¹',       color: 'green'  },
    { label: 'Ehtimollik',          structure: 'Subject + might + V¹',        color: 'orange' },
  ],
  usedFor: [
    'Qobiliyat va ruxsatni ifodalash (can / can\'t)',
    'Majburiyat va zaruriyatni ifodalash (must / have to)',
    'Maslahat berish (should) va ehtimollik (might)',
  ],
  examples: [
    { en: 'I can swim very well.',                           uz: "Men juda yaxshi suza olaman." },
    { en: 'You must wear a seatbelt in a car.',              uz: "Mashinada kamar taqishingiz kerak." },
    { en: 'She should drink more water every day.',          uz: "U har kuni ko'proq suv ichishi kerak." },
    { en: 'They might visit us tomorrow.',                   uz: "Ular ertaga bizga kelishi mumkin." },
    { en: "You don't have to pay for this — it is free.",    uz: "Buning uchun to'lashingiz shart emas — bu bepul." },
  ],
  exercises: [
    {
      id: 21, type: 'fill-blank',
      instruction: "Modal fe'l bilan bo'sh joyni to'ldiring:",
      question: "She is only two years old but she _____ (can) read simple words.",
      blanks: ['can'],
      explanation: "'Can' qobiliyatni bildiradi: 'can + V¹' — qobiliyatni ifodalash uchun ishlatiladi.",
    },
    {
      id: 22, type: 'fill-blank',
      instruction: "Modal fe'l bilan bo'sh joyni to'ldiring:",
      question: "You _____ (must) brush your teeth before you go to bed every night.",
      blanks: ['must'],
      explanation: "'Must' kuchli majburiyatni bildiradi: 'must + V¹'.",
    },
    {
      id: 23, type: 'fill-blank',
      instruction: "Modal fe'l bilan bo'sh joyni to'ldiring:",
      question: "He _____ (should) eat less sugar because it is bad for his health.",
      blanks: ['should'],
      explanation: "'Should' maslahat berish uchun ishlatiladi: 'should + V¹'.",
    },
    {
      id: 24, type: 'fill-blank',
      instruction: "Modal fe'l bilan bo'sh joyni to'ldiring:",
      question: "We _____ (might) go to the park later if the weather is nice.",
      blanks: ['might'],
      explanation: "'Might' ehtimollikni bildiradi: 'might + V¹' — aniq emas, balki ehtimol.",
    },
    {
      id: 25, type: 'multiple-choice',
      instruction: "To'g'ri modal fe'lni tanlang:",
      question: "You ___ finish your homework before you go outside to play.",
      options: ['must', 'can', 'might', 'should'],
      correct: 'must',
      explanation: "'Must' kuchli majburiyat. 'Should' maslahat, 'can' qobiliyat, 'might' ehtimollik.",
    },
    {
      id: 26, type: 'multiple-choice',
      instruction: "To'g'ri modal fe'lni tanlang:",
      question: "She ___ speak three languages: English, Uzbek, and Russian.",
      options: ['can', 'must', 'should', 'might'],
      correct: 'can',
      explanation: "'Can' qobiliyatni bildiradi — uch tilda gapira oladi.",
    },
    {
      id: 27, type: 'multiple-choice',
      instruction: "To'g'ri modal fe'lni tanlang:",
      question: "You look very tired. You ___ see a doctor.",
      options: ['can', 'must', 'should', 'might'],
      correct: 'should',
      explanation: "'Should' maslahat uchun — shifokorga ko'rinishingiz kerak (maslahat).",
    },
    {
      id: 28, type: 'multiple-choice',
      instruction: "To'g'ri modal fe'lni tanlang:",
      question: "It is cloudy outside. It ___ rain this afternoon.",
      options: ['can', 'must', 'should', 'might'],
      correct: 'might',
      explanation: "'Might' ehtimollik — bulutli, yomg'ir yog'ishi mumkin, ammo aniq emas.",
    },
    {
      id: 29, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "He can to swim very fast across the pool.",
      errorPart: 'can to swim',
      correct: 'He can swim very fast across the pool.',
      explanation: "Modal fe'llardan keyin 'to' ISHLATILMAYDI: 'can swim' (can to swim emas).",
    },
    {
      id: 30, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "You should to study more for the final exam.",
      errorPart: 'should to study',
      correct: 'You should study more for the final exam.',
      explanation: "'Should' modal fe'li + V¹: 'should study'. 'To' infinitive bilan ishlatilmaydi.",
    },
    {
      id: 31, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "She musts wake up early every day for her new job.",
      errorPart: 'musts',
      correct: 'She must wake up early every day for her new job.',
      explanation: "Modal fe'llar 's' qo'shimchasini olmaydi (he/she/it bilan): 'must' — 'musts' emas.",
    },
    {
      id: 32, type: 'transformation',
      instruction: "Berilgan gapni 'can' bilan qayta yozing:",
      question: 'I am able to play the guitar very well.',
      hint: 'I can ...',
      correct: 'I can play the guitar very well.',
      explanation: "'Am able to' → 'can'. 'Can' qobiliyatni ifodalaydi va keyin V¹ keladi.",
    },
    {
      id: 33, type: 'transformation',
      instruction: "Berilgan gapni 'must' bilan qayta yozing:",
      question: "It is necessary for you to be on time for the meeting.",
      hint: 'You must ...',
      correct: 'You must be on time for the meeting.',
      explanation: "'It is necessary for you' → 'You must'. 'Must' kuchli majburiyatni bildiradi.",
    },
    {
      id: 34, type: 'transformation',
      instruction: "Berilgan gapni 'should' bilan qayta yozing:",
      question: "It is a good idea for you to drink more water every day.",
      hint: 'You should ...',
      correct: 'You should drink more water every day.',
      explanation: "'It is a good idea' → 'You should'. 'Should' maslahat bildiradi.",
    },
    {
      id: 35, type: 'transformation',
      instruction: "Berilgan gapni 'might' bilan qayta yozing:",
      question: "Perhaps they will come to the party tonight.",
      hint: 'They might ...',
      correct: 'They might come to the party tonight.',
      explanation: "'Perhaps they will' → 'They might'. 'Might' ehtimollikni bildiradi (balki).",
    },
  ],
}

// ─── Topic 6: Articles (A2) ────────────────────────────────────────────────────

export const articlesA2: GrammarTopic = {
  id: 'articles-a2',
  title: 'Articles',
  subtitle: "A/an, the va zero article — artikllar",
  level: 'A2',
  week: 2,
  tag: 'Grammar',
  formula: 'a / an (indefinite) · the (definite) · zero article (Ø)',
  formulaRows: [
    { label: 'a (undosh tovushdan oldin)',  structure: 'a + consonant sound',          color: 'blue'   },
    { label: 'an (unli tovushdan oldin)',   structure: 'an + vowel sound',            color: 'purple' },
    { label: 'the (aniq / ma\'lum)',        structure: 'the + noun',                   color: 'green'  },
    { label: 'Zero article (umumiy)',        structure: 'Ø + plural / uncountable noun', color: 'orange' },
  ],
  usedFor: [
    "'a/an': birinchi marta aytilgan narsa yoki kasb-kor nomi bilan",
    "'the': aniq, oldin aytilgan yoki yagona narsa haqida",
    "Zero article: umumiy ma'noda (I like cats, Water is life)",
  ],
  examples: [
    { en: 'I have a cat and a dog at home.',               uz: "Mening uyda mushuk va itim bor." },
    { en: 'She is an engineer at a big company.',           uz: "U katta kompaniyada muhandis." },
    { en: 'The cat that I found is very friendly.',         uz: "Men topgan mushuk juda do'stona." },
    { en: 'Cats are very popular pets in Uzbekistan.',      uz: "Mushuklar O'zbekistonda juda mashhur uy hayvonlari." },
    { en: "Can you close the door? It is cold outside.",  uz: "Eshikni yopa olasizmi? Tashqarida sovuq." },
  ],
  exercises: [
    {
      id: 36, type: 'fill-blank',
      instruction: "To'g'ri artiklni (a, an, the, —) qo'ying:",
      question: 'I saw ___ beautiful bird in ___ tree this morning.',
      blanks: ['a', 'the'],
      explanation: "Birinchi marta → 'a beautiful bird'; keyin ma'lum daraxt → 'the tree'.",
    },
    {
      id: 37, type: 'fill-blank',
      instruction: "To'g'ri artiklni (a, an, the, —) qo'ying:",
      question: "She is ___ honest person. Everyone trusts her completely.",
      blanks: ['an'],
      explanation: "'Honest' 'h' undosh bo'lsa-da, talaffuzi unli bilan boshlanadi (onest) → 'an'.",
    },
    {
      id: 38, type: 'fill-blank',
      instruction: "To'g'ri artiklni (a, an, the, —) qo'ying:",
      question: "___ sun rises in ___ east every morning.",
      blanks: ['The', 'the'],
      explanation: "Yagona narsalar (sun, east) 'the' bilan ishlatiladi: 'the sun', 'the east'.",
    },
    {
      id: 39, type: 'fill-blank',
      instruction: "To'g'ri artiklni (a, an, the, —) qo'ying:",
      question: 'I love ___ chocolate. It is my favourite food!',
      blanks: ['—'],
      explanation: "Umumiy ma'nodagi uncountable nouns → zero article: 'chocolate' artiklsiz.",
    },
    {
      id: 40, type: 'multiple-choice',
      instruction: "To'g'ri artiklni tanlang:",
      question: "I need ___ new phone. My old one is broken.",
      options: ['a', 'an', 'the', '—'],
      correct: 'a',
      explanation: "Birinchi marta → 'a new phone'. Aniq emas, shunchaki yangi telefon.",
    },
    {
      id: 41, type: 'multiple-choice',
      instruction: "To'g'ri artiklni tanlang:",
      question: "Can you pass me ___ salt, please?",
      options: ['a', 'an', 'the', '—'],
      correct: 'the',
      explanation: "Ma'lum narsa (stoldagi tuz) → 'the salt'. Suhbatdosh qaysi tuzni biladi.",
    },
    {
      id: 42, type: 'multiple-choice',
      instruction: "To'g'ri artiklni tanlang:",
      question: "My brother wants to be ___ doctor when he grows up.",
      options: ['a', 'an', 'the', '—'],
      correct: 'a',
      explanation: "Kasb nomi bilan 'a' ishlatiladi: 'a doctor'. 'An' — unli tovush oldin.",
    },
    {
      id: 43, type: 'multiple-choice',
      instruction: "To'g'ri artiklni tanlang:",
      question: "___ dogs are loyal and friendly animals.",
      options: ['A', 'An', 'The', '—'],
      correct: '—',
      explanation: "Umumiy ma'noda ko'plik → zero article: 'Dogs are...' (hamma itlar haqida).",
    },
    {
      id: 44, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: 'I saw a elephant at the zoo yesterday with my family.',
      errorPart: 'a elephant',
      correct: 'I saw an elephant at the zoo yesterday with my family.',
      explanation: "'Elephant' unli tovush bilan boshlanadi → 'an elephant', 'a elephant' emas.",
    },
    {
      id: 45, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "She is a best student in the whole class.",
      errorPart: 'a best',
      correct: 'She is the best student in the whole class.',
      explanation: "Superlative ('best') bilan 'the' ishlatiladi: 'the best', 'a best' emas.",
    },
    {
      id: 46, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: 'The water is very important for our health every day.',
      errorPart: 'The water',
      correct: 'Water is very important for our health every day.',
      explanation: "Umumiy ma'noda uncountable nouns → zero article: 'Water', 'The water' emas.",
    },
    {
      id: 47, type: 'transformation',
      instruction: "Kasb bilan gap tuzing va 'a/an' ishlating:",
      question: 'My sister works as a nurse. (write a sentence using "She is...")',
      hint: 'She is ...',
      correct: 'She is a nurse.',
      explanation: "Kasb nomlari 'a' bilan ishlatiladi: 'She is a nurse.'",
    },
    {
      id: 48, type: 'transformation',
      instruction: "Gapni 'the' bilan to'ldirib qayta yozing:",
      question: "I bought a book yesterday. The book is very interesting.",
      hint: "The book that ...",
      correct: "The book that I bought yesterday is very interesting.",
      explanation: "Birinchi 'a book' (yangi), keyin 'the book' (ma'lum) — bu article qoidasi.",
    },
    {
      id: 49, type: 'transformation',
      instruction: "Zero article bilan qayta yozing (umumiy ma'no):",
      question: "The apples are healthy fruits. (make it general)",
      hint: 'Apples ...',
      correct: 'Apples are healthy fruits.',
      explanation: "Umumiy ma'noda ko'plik otlar → zero article: 'Apples', 'The apples' emas.",
    },
    {
      id: 50, type: 'transformation',
      instruction: "Gapni 'an' ishlatib qayta yozing:",
      question: 'He is a university student.',
      hint: 'He is an ...',
      correct: 'He is an honest person.',
      explanation: "'Honest' (onest) unli tovush bilan boshlanadi → 'an honest'. 'University' 'yu' → 'a'.",
    },
  ],
}

// ─── Topic 7: Present Perfect (A2) ──────────────────────────────────────────────

export const presentPerfectA2: GrammarTopic = {
  id: 'present-perfect-a2',
  title: 'Present Perfect',
  subtitle: "Have/has + V³ — hayotiy tajriba va yaqin o'tmish",
  level: 'A2',
  week: 3,
  tag: 'Tenses',
  formula: 'have / has + Past Participle (V³)',
  formulaRows: [
    { label: 'Tasdiq',     structure: 'Subject + have/has + V³',              color: 'blue'   },
    { label: 'Inkor',      structure: "Subject + haven't/hasn't + V³",        color: 'purple' },
    { label: "So'roq",     structure: 'Have/Has + subject + V³?',             color: 'green'  },
    { label: "So'zlar",    structure: 'ever / never / just / already / yet',  color: 'orange' },
  ],
  usedFor: [
    "Hayotiy tajribalar (ever, never, before)",
    "Yaqinda tugallangan ishlar (just, already, yet)",
    "Hozirgi kungacha davom etgan holatlar (for, since)",
  ],
  examples: [
    { en: 'I have visited Bukhara three times.',              uz: "Men Buxoroga uch marta borganman." },
    { en: 'She has never eaten sushi before.',                 uz: "U hech qachon sushi yemagan." },
    { en: 'We have just finished our homework.',               uz: "Biz hozirgina uy vazifamizni tugatdik." },
    { en: 'Have you ever been to London?',                    uz: "Hech qachon Londonda bo'lganmisiz?" },
    { en: 'He hasn\'t called me yet today.',                  uz: "U bugun hali menga qo'ng'iroq qilmadi." },
  ],
  exercises: [
    {
      id: 51, type: 'fill-blank',
      instruction: "Present Perfect bilan to'ldiring:",
      question: 'I _____ (visit) the Registan in Samarkand many times.',
      blanks: ['have visited'],
      explanation: "'Many times' = tajriba → Present Perfect: 'have visited' (I + have + V³).",
    },
    {
      id: 52, type: 'fill-blank',
      instruction: "Present Perfect bilan to'ldiring:",
      question: 'She _____ (never / eat) traditional Uzbek plov before.',
      blanks: ['has never eaten'],
      explanation: "'Never' Present Perfect bilan: has + never + V³ (eaten).",
    },
    {
      id: 53, type: 'fill-blank',
      instruction: "Present Perfect bilan to'ldiring:",
      question: 'We _____ (just / finish) our English lesson for today.',
      blanks: ['have just finished'],
      explanation: "'Just' = hozirgina: have + just + V³ (finished).",
    },
    {
      id: 54, type: 'fill-blank',
      instruction: "Present Perfect bilan to'ldiring:",
      question: "He _____ (not / call) me yet today for some reason.",
      blanks: ["hasn't called"],
      explanation: "'Yet' = hali: hasn't + V³ (called). Inkor gapda 'yet' ishlatiladi.",
    },
    {
      id: 55, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: 'I ___ never been to Australia, but I want to go one day.',
      options: ['have', 'has', 'did', 'was'],
      correct: 'have',
      explanation: "'I' bilan 'have' ishlatiladi: 'I have never been'. 'Has' — he/she/it uchun.",
    },
    {
      id: 56, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "She ___ just left the office a few minutes ago.",
      options: ['has', 'have', 'did', 'is'],
      correct: 'has',
      explanation: "'She' (yakka) → 'has'. 'Has just left' — yaqinda tugallangan harakat.",
    },
    {
      id: 57, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: '___ you ever eaten Korean food before?',
      options: ['Have', 'Has', 'Did', 'Are'],
      correct: 'Have',
      explanation: "So'roq gap: 'Have you ever...'? 'You' bilan 'have' ishlatiladi.",
    },
    {
      id: 58, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: 'I ___ finished my work yet. I need more time.',
      options: ["haven't", "hasn't", 'didn\'t', 'wasn\'t'],
      correct: "haven't",
      explanation: "'Yet' bilan Present Perfect negative: I + haven't + V³. 'Hasn't' — he/she/it.",
    },
    {
      id: 59, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: 'I have saw that film last week with my friends.',
      errorPart: 'have saw',
      correct: 'I saw that film last week with my friends.',
      explanation: "'Last week' = aniq o'tmish → Past Simple ('saw'). Present Perfect aniq vaqt bilan ishlatilmaydi.",
    },
    {
      id: 60, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: 'She has went to the market this morning.',
      errorPart: 'has went',
      correct: 'She has gone to the market this morning.',
      explanation: "'Go' → 'gone' (V³). 'Went' — Past Simple, Present Perfect bilan ishlatilmaydi.",
    },
    {
      id: 61, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "He has live in Tashkent since 2020.",
      errorPart: 'has live',
      correct: "He has lived in Tashkent since 2020.",
      explanation: "'Since 2020' → Present Perfect: 'has + lived' (V³). 'Has live' xato — V³ kerak.",
    },
    {
      id: 62, type: 'transformation',
      instruction: "Present Perfect bilan qayta yozing:",
      question: "I started learning English in 2020 and I still learn it now.",
      hint: "I have learned ...",
      correct: "I have learned English since 2020.",
      explanation: "O'tmishdan hozirgacha → Present Perfect: 'have learned + since 2020'.",
    },
    {
      id: 63, type: 'transformation',
      instruction: "'Never' bilan Present Perfect gap tuzing:",
      question: "This is the first time I have eaten plov.",
      hint: "I have never ...",
      correct: "I have never eaten plov before.",
      explanation: "'First time' → 'have never + V³ + before'. Birinchi marta = ilgari hech qachon.",
    },
    {
      id: 64, type: 'transformation',
      instruction: "Present Perfect bilan so'roq gap tuzing:",
      question: "Have you visited Registan Square? (use 'ever')",
      hint: "Have you ever ...",
      correct: "Have you ever visited Registan Square?",
      explanation: "'Ever' so'roq gaplarda: 'Have you ever + V³?' — hayotiy tajriba haqida.",
    },
    {
      id: 65, type: 'transformation',
      instruction: "'Yet' bilan Present Perfect gap tuzing:",
      question: "I haven't finished my homework. It is still not done.",
      hint: "I haven't finished ...",
      correct: "I haven't finished my homework yet.",
      explanation: "'Yet' inkor gap oxirida: 'haven't + V³ + yet'. Hali tugallanmagan ish.",
    },
  ],
}

// ─── Topic 8: First Conditional (A2) ────────────────────────────────────────────

export const firstConditional: GrammarTopic = {
  id: 'first-conditional',
  title: 'First Conditional',
  subtitle: "Real shart — If + Present Simple, will + V¹",
  level: 'A2',
  week: 3,
  tag: 'Conditionals',
  formula: 'If + Present Simple , will + V¹',
  formulaRows: [
    { label: 'If clause (shart)',          structure: 'If + Subject + Present Simple',  color: 'blue'   },
    { label: 'Main clause (natija)',       structure: 'Subject + will + V¹',             color: 'purple' },
    { label: 'Inkor shakli',               structure: "If + Subject + don't/doesn't + V¹",  color: 'green'  },
    { label: 'Natija inkori',              structure: "Subject + won't + V¹",             color: 'orange' },
  ],
  usedFor: [
    'Kelajakda real bo\'lishi mumkin bo\'lgan vaziyatlar',
    'Natija va oqibatni ko\'rsatish uchun',
    "Vaqt bog'lovchilari bilan (when, as soon as, until)",
  ],
  examples: [
    { en: 'If it rains tomorrow, I will stay at home.',              uz: "Agar ertaga yomg'ir yog'sa, uyda qolaman." },
    { en: 'She will pass the exam if she studies hard enough.',      uz: "Agar u qattiq o'qisa, imtihondan o'tadi." },
    { en: 'If you don\'t hurry, you will miss the bus.',            uz: "Agar shoshilmasangiz, avtobusni o'tkazib yuborasiz." },
    { en: 'We will go to the park if the weather is nice tomorrow.', uz: "Agar ertaga ob-havo yaxshi bo'lsa, parkga boramiz." },
  ],
  exercises: [
    {
      id: 66, type: 'fill-blank',
      instruction: "First Conditional bilan to'ldiring:",
      question: 'If it _____ (rain) tomorrow, we _____ (stay) at home.',
      blanks: ['rains', 'will stay'],
      explanation: "'If' qismida Present Simple (rains), natija qismida 'will + V¹' (will stay).",
    },
    {
      id: 67, type: 'fill-blank',
      instruction: "First Conditional bilan to'ldiring:",
      question: 'She _____ (pass) the exam if she _____ (study) hard.',
      blanks: ['will pass', 'studies'],
      explanation: "Natija birinchi kelsa ham: 'will pass' (natija), 'if she studies' (shart — Present Simple).",
    },
    {
      id: 68, type: 'fill-blank',
      instruction: "First Conditional bilan to'ldiring:",
      question: "If you _____ (not / eat) breakfast, you _____ (feel) hungry later.",
      blanks: ["don't eat", 'will feel'],
      explanation: "Inkor shart: 'If you don't eat' (don't + V¹). Natija: 'will feel'.",
    },
    {
      id: 69, type: 'fill-blank',
      instruction: "First Conditional bilan to'ldiring:",
      question: "We _____ (not / go) to the beach if it _____ (be) too cold outside.",
      blanks: ["won't go", 'is'],
      explanation: "Natija inkori: 'won't go' (will not). Shart: 'if it is' (Present Simple).",
    },
    {
      id: 70, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: 'If you ___ water to 100°C, it boils.',
      options: ['heat', 'will heat', 'heated', 'would heat'],
      correct: 'heat',
      explanation: "Universal truth (Zero Conditional): 'if + Present Simple, Present Simple'. 'Heat' to'g'ri.",
    },
    {
      id: 71, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: 'If she studies hard, she ___ the exam easily.',
      options: ['will pass', 'passes', 'passed', 'would pass'],
      correct: 'will pass',
      explanation: "First Conditional: 'If + Present Simple, will + V¹'. 'Will pass' to'g'ri javob.",
    },
    {
      id: 72, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "What ___ you do if you miss the last bus home?",
      options: ['will', 'do', 'did', 'would'],
      correct: 'will',
      explanation: "Real kelajak sharti → 'will you do'. 'Would' — Second Conditional uchun.",
    },
    {
      id: 73, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: 'If we don\'t leave now, we ___ the beginning of the film.',
      options: ['will miss', 'miss', 'missed', 'would miss'],
      correct: 'will miss',
      explanation: "Real natija → 'will miss'. 'If + Present Simple, will + V¹'.",
    },
    {
      id: 74, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: 'If it will rain tomorrow, I will stay at home.',
      errorPart: 'will rain',
      correct: 'If it rains tomorrow, I will stay at home.',
      explanation: "'If' qismida 'will' ISHLATILMAYDI: 'if it rains' (Present Simple) to'g'ri.",
    },
    {
      id: 75, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: 'If she studies hard, she passes the exam.',
      errorPart: 'passes',
      correct: 'If she studies hard, she will pass the exam.',
      explanation: "First Conditional natija qismida 'will + V¹' kerak: 'will pass'. 'Passes' — Zero Conditional (haqiqat).",
    },
    {
      id: 76, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: 'If you won\'t study, you will fail the test.',
      errorPart: 'won\'t study',
      correct: "If you don't study, you will fail the test.",
      explanation: "'If' qismida 'won't' emas, 'don't' (Present Simple) ishlatiladi: 'if you don't study'.",
    },
    {
      id: 77, type: 'transformation',
      instruction: "First Conditional bilan qayta yozing:",
      question: 'Maybe it will rain. I will take an umbrella.',
      hint: 'If it rains, ...',
      correct: 'If it rains, I will take an umbrella.',
      explanation: "Ikki gapni birlashtirish: shart (rains) + natija (will take).",
    },
    {
      id: 78, type: 'transformation',
      instruction: "First Conditional bilan qayta yozing:",
      question: 'You should study harder, and you will get better marks.',
      hint: 'If you study ...',
      correct: 'If you study harder, you will get better marks.',
      explanation: "'If' bilan qayta yozish: 'If + Present Simple, will + V¹'.",
    },
    {
      id: 79, type: 'transformation',
      instruction: "Berilgan gapni First Conditional shaklida yozing:",
      question: 'No rain today. The garden will not grow well without rain.',
      hint: 'If it doesn\'t rain ...',
      correct: "If it doesn't rain, the garden will not grow well.",
      explanation: "Inkor shart: 'If it doesn't rain' + 'will not grow'.",
    },
    {
      id: 80, type: 'transformation',
      instruction: "'When' bilan First Conditional gap tuzing:",
      question: 'First she arrives. Then we will have dinner together.',
      hint: 'When she arrives, ...',
      correct: 'When she arrives, we will have dinner together.',
      explanation: "'When' (vaqt bog'lovchisi) 'if' kabi Present Simple oladi: 'When she arrives, we will have...'",
    },
  ],
}

// ─── Topic 9: Passive Voice (A2) ────────────────────────────────────────────────

export const passiveVoiceA2: GrammarTopic = {
  id: 'passive-voice-a2',
  title: 'Passive Voice',
  subtitle: "is/are/was/were + V³ — nima qilinayotganini aytish",
  level: 'A2',
  week: 4,
  tag: 'Grammar',
  formula: 'be (am / is / are / was / were) + V³',
  formulaRows: [
    { label: 'Present Simple Passive',  structure: 'am / is / are + V³',       color: 'blue'   },
    { label: 'Past Simple Passive',     structure: 'was / were + V³',          color: 'purple' },
    { label: 'Inkor shakli',            structure: "am / is / are / was / were + not + V³", color: 'green'  },
  ],
  usedFor: [
    "Harakat bajaruvchi noma'lum yoki muhim bo'lmaganda",
    "Rasmiy va umumiy ma'lumotlarni aytishda",
    "Diqqatni ob'ektga (natijaga) qaratish uchun",
  ],
  examples: [
    { en: 'English is spoken in many countries around the world.', uz: "Ingliz tili dunyoning ko'p davlatlarida gapiriladi." },
    { en: 'The letter was sent yesterday morning.',                 uz: "Maktub kecha ertalab yuborildi." },
    { en: 'Bread is made from flour, water, and yeast.',            uz: "Non un, suv va xamirturushdan tayyorlanadi." },
    { en: 'These books were written by Uzbek authors.',             uz: "Bu kitoblar o'zbek mualliflar tomonidan yozilgan." },
  ],
  exercises: [
    {
      id: 81, type: 'fill-blank',
      instruction: "Present Simple Passive bilan to'ldiring:",
      question: 'Tea _____ (drink) by many people in Uzbekistan every day.',
      blanks: ['is drunk'],
      explanation: "Present Simple Passive: is/are + V³. 'Tea' (yakka) → 'is drunk'.",
    },
    {
      id: 82, type: 'fill-blank',
      instruction: "Past Simple Passive bilan to'ldiring:",
      question: 'The famous Samarkand Registan _____ (build) many centuries ago.',
      blanks: ['was built'],
      explanation: "Past Simple Passive: was/were + V³. 'Registan' (yakka) → 'was built'.",
    },
    {
      id: 83, type: 'fill-blank',
      instruction: "Passive Voice bilan to'ldiring:",
      question: 'These books _____ (write) by famous Uzbek authors in the 20th century.',
      blanks: ['were written'],
      explanation: "'These books' (ko'plik) + 'were written'. Past Simple Passive: 'were + V³'.",
    },
    {
      id: 84, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: 'Plov ___ with rice, meat, and carrots in Uzbekistan.',
      options: ['is made', 'are made', 'was made', 'make'],
      correct: 'is made',
      explanation: "Umumiy haqiqat → Present Simple Passive. 'Plov' (yakka) → 'is made'.",
    },
    {
      id: 85, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: 'The windows ___ cleaned every week by the staff.',
      options: ['are', 'is', 'was', 'were'],
      correct: 'are',
      explanation: "'The windows' (ko'plik) + 'are cleaned' — Present Simple Passive.",
    },
    {
      id: 86, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: 'The novel "Days Gone By" ___ by Abdulla Qadiri.',
      options: ['was written', 'is written', 'wrote', 'has written'],
      correct: 'was written',
      explanation: "O'tmishda yozilgan → Past Simple Passive: 'was written by'.",
    },
    {
      id: 87, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: 'The homework is do by the students every evening.',
      errorPart: 'is do',
      correct: 'The homework is done by the students every evening.',
      explanation: "Passive Voice da V³ (Past Participle) kerak: 'do' → 'done'. 'Is do' xato.",
    },
    {
      id: 88, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: 'The Eiffel Tower was build in 1889 in Paris.',
      errorPart: 'was build',
      correct: 'The Eiffel Tower was built in 1889 in Paris.',
      explanation: "'Build' → V³: 'built'. Passive Voice: 'was + built', 'was + build' emas.",
    },
    {
      id: 89, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: 'The students are teached by the teacher every day.',
      errorPart: 'are teached',
      correct: 'The students are taught by the teacher every day.',
      explanation: "'Teach' → V³: 'taught' (noto'g'ri fe'l). 'Teached' deyilmaydi!",
    },
    {
      id: 90, type: 'transformation',
      instruction: "Active gapni Passive shakliga o'tkazing:",
      question: 'People grow rice in many parts of Uzbekistan.',
      hint: 'Rice is ...',
      correct: 'Rice is grown in many parts of Uzbekistan.',
      explanation: "Ob'ekt (rice) → subject. 'Grow' → 'is grown' (Present Simple Passive).",
    },
    {
      id: 91, type: 'transformation',
      instruction: "Active gapni Passive shakliga o'tkazing:",
      question: 'Navoi wrote "Khamsa" in the 15th century.',
      hint: '"Khamsa" was ...',
      correct: '"Khamsa" was written by Navoi in the 15th century.',
      explanation: "Ob'ekt (Khamsa) → subject. 'Wrote' → 'was written by'. Ijrochi qo'shiladi.",
    },
    {
      id: 92, type: 'transformation',
      instruction: "Active gapni Passive shakliga o'tkazing:",
      question: 'The chef makes delicious somsa every morning.',
      hint: 'Delicious somsa ...',
      correct: 'Delicious somsa is made by the chef every morning.',
      explanation: "Ob'ekt (somsa) → subject. 'Makes' → 'is made by'. Present Simple Passive.",
    },
  ],
}

export const presentContinuous: GrammarTopic = {
  "id": "present-continuous-a2",
  "title": "Present Continuous",
  "subtitle": "Hozir aynan sodir bo'layotgan harakat — am/is/are + V+ing",
  "level": "A2",
  "week": 2,
  "tag": "Tenses",
  "formula": "am / is / are + verb + -ing",
  "formulaRows": [
    {
      "label": "Tasdiq",
      "structure": "Subject + am/is/are + V+ing  (I am reading)",
      "color": "blue"
    },
    {
      "label": "Inkor",
      "structure": "Subject + am/is/are + not + V+ing  (She is not sleeping)",
      "color": "purple"
    },
    {
      "label": "So'roq",
      "structure": "Am/Is/Are + subject + V+ing?  (Are you coming?)",
      "color": "green"
    },
    {
      "label": "Hozirgi vaqt belgilari",
      "structure": "now / right now / at the moment / today",
      "color": "orange"
    }
  ],
  "usedFor": [
    "Hozir aynan shu vaqtda sodir bo'layotgan harakatlar",
    "Vaqtinchalik holat va tendensiyalar",
    "Kelajakdagi aniq rejalar (I am meeting friends tomorrow)",
    "Tez-tez takrorlanuvchi harakatlardan norozilik (always + V+ing)"
  ],
  "examples": [
    {
      "en": "I am reading an interesting book right now.",
      "uz": "Men hozir qiziqarli kitob o'qiyapman."
    },
    {
      "en": "She is not sleeping at the moment.",
      "uz": "U hozir uxlamayapti."
    },
    {
      "en": "Are you coming to the party tonight?",
      "uz": "Bugun kechqurun ziyofatga kelyapsizmi?"
    },
    {
      "en": "Why is the baby crying? Is he hungry?",
      "uz": "Nega chaqaloq yig'layapti? U ochmi?"
    },
    {
      "en": "He is always leaving his dirty dishes in the sink!",
      "uz": "U doim iflos idishlarini rakovinada qoldiradi!"
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "Present Continuous bilan to'ldiring:",
      "question": "She _____ (read) a book right now.",
      "blanks": [
        "is reading"
      ],
      "explanation": "'Right now' = hozir → Present Continuous: is + V+ing (reading).",
      "id": 267
    },
    {
      "type": "fill-blank",
      "instruction": "Present Continuous bilan to'ldiring:",
      "question": "They _____ (play) football in the yard at the moment.",
      "blanks": [
        "are playing"
      ],
      "explanation": "'At the moment' = hozir → 'are playing'. They (ko'plik) → are.",
      "id": 268
    },
    {
      "type": "fill-blank",
      "instruction": "Inkor shaklida yozing:",
      "question": "He _____ (not / sleep) right now. He is studying.",
      "blanks": [
        "isn't sleeping"
      ],
      "explanation": "Inkor: am/is/are + not + V+ing. 'He isn't sleeping'.",
      "id": 269
    },
    {
      "type": "fill-blank",
      "instruction": "So'roq shaklida yozing:",
      "question": "_____ she _____ (come) to the meeting tomorrow?",
      "blanks": [
        "Is",
        "coming"
      ],
      "explanation": "So'roq: Is + subject + V+ing. Present Continuous kelajak reja uchun ham ishlatiladi.",
      "id": 270
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "Listen! Someone ___ at the door.",
      "options": [
        "is knocking",
        "knocks",
        "knocked",
        "has knocked"
      ],
      "correct": "is knocking",
      "explanation": "'Listen!' = hozir sodir bo'layotgan harakat → Present Continuous: 'is knocking'.",
      "id": 271
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "I ___ a great time at the party tonight!",
      "options": [
        "am having",
        "have",
        "had",
        "has"
      ],
      "correct": "am having",
      "explanation": "Hozirgi vaqt → 'am having' (Present Continuous). 'I have' — odatdagidek.",
      "id": 272
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "She ___ English at the moment because she has an exam tomorrow.",
      "options": [
        "is studying",
        "studies",
        "studied",
        "has studied"
      ],
      "correct": "is studying",
      "explanation": "'At the moment' + hozirgi harakat → 'is studying'.",
      "id": 273
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "What ___ you doing right now?",
      "options": [
        "are",
        "is",
        "do",
        "have"
      ],
      "correct": "are",
      "explanation": "So'roq: 'What are you doing?' 'You' bilan 'are' ishlatiladi.",
      "id": 274
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "She is read a book in her room right now.",
      "errorPart": "is read",
      "correct": "She is reading a book in her room right now.",
      "explanation": "Present Continuous: 'is + V+ing' (reading), 'is read' — Passive Voice (boshqa ma'no).",
      "id": 275
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "They are play football in the yard at the moment.",
      "errorPart": "are play",
      "correct": "They are playing football in the yard at the moment.",
      "explanation": "'Are + V+ing' kerak: 'are playing'. 'Are play' — '-ing' qo'shimchasi yo'q.",
      "id": 276
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "He doesn't sleeping right now. He is studying.",
      "errorPart": "doesn't sleeping",
      "correct": "He isn't sleeping right now. He is studying.",
      "explanation": "Inkor: 'isn't + V+ing'. 'Doesn't' Present Simple uchun. Present Continuous da 'am/is/are + not'.",
      "id": 277
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "I am knowing the answer to this question.",
      "errorPart": "am knowing",
      "correct": "I know the answer to this question.",
      "explanation": "'Know' — stative verb (holat fe'li). Stative fe'llar Present Continuous da ishlatilmaydi. To'g'risi: 'I know'.",
      "id": 278
    },
    {
      "type": "transformation",
      "instruction": "Present Continuous bilan qayta yozing:",
      "question": "She is in the middle of cooking dinner.",
      "hint": "She is cooking ...",
      "correct": "She is cooking dinner.",
      "explanation": "'In the middle of cooking' → 'is cooking'. Present Continuous: am/is/are + V+ing.",
      "id": 279
    },
    {
      "type": "transformation",
      "instruction": "So'roq gap tuzing:",
      "question": "you / listen / to me / right now?",
      "hint": "Are you ...",
      "correct": "Are you listening to me right now?",
      "explanation": "So'roq: Are + you + V+ing. 'Are you listening to me right now?'",
      "id": 280
    },
    {
      "type": "transformation",
      "instruction": "Gapni 'always' bilan norozilik shaklida yozing:",
      "question": "My brother leaves his socks on the floor. (complain)",
      "hint": "My brother is always ...",
      "correct": "My brother is always leaving his socks on the floor.",
      "explanation": "'Always + Present Continuous' — takrorlanuvchi harakatdan norozilik: 'is always leaving'.",
      "id": 281
    }
  ]
}

export const pastSimple: GrammarTopic = {
  "id": "past-simple-a2",
  "title": "Past Simple",
  "subtitle": "O'tmishda tugallangan harakat — V₂ / did + V¹",
  "level": "A2",
  "week": 2,
  "tag": "Tenses",
  "formula": "Subject + V₂ (regular: -ed, irregular) / Subject + did not + V¹",
  "formulaRows": [
    {
      "label": "Regular fe'llar",
      "structure": "Subject + V + -ed  (I worked, She played)",
      "color": "blue"
    },
    {
      "label": "Irregular fe'llar",
      "structure": "Subject + V₂  (go → went, eat → ate, see → saw)",
      "color": "purple"
    },
    {
      "label": "Inkor",
      "structure": "Subject + didn't + V¹  (I didn't go)",
      "color": "green"
    },
    {
      "label": "So'roq",
      "structure": "Did + subject + V¹?  (Did you see?)",
      "color": "orange"
    }
  ],
  "usedFor": [
    "O'tmishda tugallangan harakat va hodisalar",
    "O'tmishdagi odat va takrorlanuvchi harakatlar",
    "Hikoya va voqealarni aytib berish",
    "'Yesterday, last week, ago, in 2010' kabi vaqt belgilari bilan"
  ],
  "examples": [
    {
      "en": "I visited my grandmother yesterday.",
      "uz": "Kecha buvimnikiga bordim."
    },
    {
      "en": "She didn't go to school last Monday.",
      "uz": "U o'tgan dushanba maktabga bormadi."
    },
    {
      "en": "Did you see the film last night?",
      "uz": "Kecha filmni ko'rdingizmi?"
    },
    {
      "en": "We ate plov at the restaurant yesterday.",
      "uz": "Kecha restoranda plov yedik."
    },
    {
      "en": "He bought a new car last week.",
      "uz": "U o'tgan hafta yangi mashina sotib oldi."
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "Past Simple bilan to'ldiring:",
      "question": "She _____ (visit) her grandmother yesterday.",
      "blanks": [
        "visited"
      ],
      "explanation": "'Yesterday' = o'tmish → Past Simple: 'visited' (-ed qo'shimchasi).",
      "id": 282
    },
    {
      "type": "fill-blank",
      "instruction": "Past Simple (irregular) bilan to'ldiring:",
      "question": "I _____ (go) to the market this morning.",
      "blanks": [
        "went"
      ],
      "explanation": "'Go' noto'g'ri fe'l → V₂: 'went'. 'Goed' deyilmaydi.",
      "id": 283
    },
    {
      "type": "fill-blank",
      "instruction": "Inkor shaklida yozing:",
      "question": "She _____ (not / like) the film last night.",
      "blanks": [
        "didn't like"
      ],
      "explanation": "Inkor: didn't + V¹. 'Didn't like'. 'Liked' emas, chunki 'did' allaqachon o'tgan zamon.",
      "id": 284
    },
    {
      "type": "fill-blank",
      "instruction": "So'roq shaklida yozing:",
      "question": "_____ you _____ (see) the accident yesterday?",
      "blanks": [
        "Did",
        "see"
      ],
      "explanation": "So'roq: Did + subject + V¹. 'Did you see?' 'Saw' emas, 'see'.",
      "id": 285
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "I ___ a great film last weekend.",
      "options": [
        "watched",
        "watch",
        "have watched",
        "am watching"
      ],
      "correct": "watched",
      "explanation": "'Last weekend' = aniq o'tmish → Past Simple: 'watched'.",
      "id": 286
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "She ___ to the party because she was ill.",
      "options": [
        "didn't come",
        "doesn't come",
        "isn't coming",
        "hasn't come"
      ],
      "correct": "didn't come",
      "explanation": "O'tmishda sodir bo'lmagan → 'didn't come'. 'Was ill' o'tmish → Past Simple.",
      "id": 287
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "What time ___ you arrive at the airport?",
      "options": [
        "did",
        "do",
        "were",
        "have"
      ],
      "correct": "did",
      "explanation": "So'roq: 'What time did you arrive?' 'Do' — Present Simple uchun.",
      "id": 288
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "He ___ to Tashkent three years ago.",
      "options": [
        "moved",
        "moves",
        "has moved",
        "is moving"
      ],
      "correct": "moved",
      "explanation": "'Three years ago' = aniq o'tmish → Past Simple: 'moved'.",
      "id": 289
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "I go to the cinema yesterday with my friends.",
      "errorPart": "go",
      "correct": "I went to the cinema yesterday with my friends.",
      "explanation": "'Yesterday' o'tmish → 'went' (go → went). 'Go' — hozirgi zamon.",
      "id": 290
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "She didn't went to school yesterday.",
      "errorPart": "didn't went",
      "correct": "She didn't go to school yesterday.",
      "explanation": "'Didn't' dan keyin V¹ (go) ishlatiladi, V₂ (went) emas. 'Didn't go' to'g'ri.",
      "id": 291
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "Did you saw the match last night?",
      "errorPart": "did you saw",
      "correct": "Did you see the match last night?",
      "explanation": "So'roq: 'Did + subject + V¹'. 'Did you see' (saw emas).",
      "id": 292
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "He studyed English for two hours last night.",
      "errorPart": "studyed",
      "correct": "He studied English for two hours last night.",
      "explanation": "'Study' → 'y' bilan tugagan fe'l: 'y' → 'i' + 'ed': 'studied'. 'Studyed' xato.",
      "id": 293
    },
    {
      "type": "transformation",
      "instruction": "Past Simple bilan qayta yozing:",
      "question": "She does not like the food at the restaurant. (yesterday)",
      "hint": "She did not ...",
      "correct": "She didn't like the food at the restaurant yesterday.",
      "explanation": "'Does not like' (Present) → 'didn't like' (Past). 'Yesterday' qo'shiladi.",
      "id": 294
    },
    {
      "type": "transformation",
      "instruction": "So'roq gap tuzing:",
      "question": "you / eat / breakfast / this morning?",
      "hint": "Did you ...",
      "correct": "Did you eat breakfast this morning?",
      "explanation": "So'roq: 'Did you eat...?' 'Eat' V¹ shaklida qoladi.",
      "id": 295
    },
    {
      "type": "transformation",
      "instruction": "Regular fe'l bilan gap tuzing:",
      "question": "They / play / football / yesterday.",
      "hint": "They played ...",
      "correct": "They played football yesterday.",
      "explanation": "'Play' → 'played'. Regular fe'lga '-ed' qo'shiladi.",
      "id": 296
    }
  ]
}

export const futureForms: GrammarTopic = {
  "id": "future-forms-a2",
  "title": "Future Forms",
  "subtitle": "will / going to — kelajak haqida gapirish",
  "level": "A2",
  "week": 3,
  "tag": "Tenses",
  "formula": "will + V¹ (qaror/bashorat) · am/is/are + going to + V¹ (reja/nuqta)",
  "formulaRows": [
    {
      "label": "Will (spontaneous decision)",
      "structure": "Subject + will + V¹  (I will help you)",
      "color": "blue"
    },
    {
      "label": "Will (prediction)",
      "structure": "Subject + will + V¹  (It will rain tomorrow)",
      "color": "purple"
    },
    {
      "label": "Going to (plan/intention)",
      "structure": "Subject + am/is/are + going to + V¹  (I am going to study)",
      "color": "green"
    },
    {
      "label": "Inkor va so'roq",
      "structure": "won't + V¹ · Will + subject + V¹? · Is/Are + subject + going to + V¹?",
      "color": "orange"
    }
  ],
  "usedFor": [
    "'Will': lahzalik qaror (The phone is ringing — I will answer it)",
    "'Will': bashorat (I think it will rain tomorrow)",
    "'Going to': oldindan rejalashtirilgan ishlar (I am going to visit my aunt)",
    "'Going to': dalilga asoslangan bashorat (Look at those clouds! It is going to rain)"
  ],
  "examples": [
    {
      "en": "I will help you with your homework. Don't worry!",
      "uz": "Men senga uy vazifangda yordam beraman. Xavotir olma!"
    },
    {
      "en": "She is going to study medicine at university.",
      "uz": "U universitetda tibbiyotni o'qimoqchi."
    },
    {
      "en": "It won't rain today. The sky is clear.",
      "uz": "Bugun yomg'ir yog'maydi. Osmon musaffo."
    },
    {
      "en": "Look at those dark clouds! It is going to rain.",
      "uz": "Ana u qora bulutlarga qara! Yomg'ir yog'adigan bo'ldi."
    },
    {
      "en": "What are you going to do this weekend?",
      "uz": "Bu hafta oxirida nima qilmoqchisiz?"
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "'Will' bilan to'ldiring (lahzalik qaror):",
      "question": "The phone is ringing. I _____ (answer) it.",
      "blanks": [
        "will answer"
      ],
      "explanation": "Lahzalik qaror → 'will answer'. 'I'll answer' qisqa shakli ham mumkin.",
      "id": 297
    },
    {
      "type": "fill-blank",
      "instruction": "'Going to' bilan to'ldiring (reja):",
      "question": "She _____ (study) medicine at university next year.",
      "blanks": [
        "is going to study"
      ],
      "explanation": "'Next year' = reja → 'is going to study'. 'She is going to study'.",
      "id": 298
    },
    {
      "type": "fill-blank",
      "instruction": "Inkor shaklida yozing (won't):",
      "question": "Don't worry! I _____ (not / forget) your birthday.",
      "blanks": [
        "won't forget"
      ],
      "explanation": "'Will not' = 'won't'. 'I won't forget' — unutmayman.",
      "id": 299
    },
    {
      "type": "fill-blank",
      "instruction": "To'g'ri shaklni tanlang (will/going to):",
      "question": "Look at those clouds! It _____ (rain).",
      "blanks": [
        "is going to rain"
      ],
      "explanation": "Dalilga asoslangan bashorat (bulutlar) → 'is going to rain'. 'Will rain' ham mumkin, lekin 'going to' kuchliroq.",
      "id": 300
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "I think it ___ tomorrow. Take an umbrella!",
      "options": [
        "will rain",
        "is raining",
        "rains",
        "rained"
      ],
      "correct": "will rain",
      "explanation": "Bashorat → 'will rain'. 'I think' + will.",
      "id": 301
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "A: I am thirsty. B: I ___ you a glass of water.",
      "options": [
        "will get",
        "am getting",
        "get",
        "am going to get"
      ],
      "correct": "will get",
      "explanation": "Lahzalik qaror (yordam taklifi) → 'will get'. 'I'll get you'.",
      "id": 302
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "We ___ to buy a new house next year.",
      "options": [
        "are going",
        "will",
        "go",
        "went"
      ],
      "correct": "are going",
      "explanation": "'Going to' reja uchun: 'are going to buy'. 'Are going' + 'to buy'.",
      "id": 303
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "She ___ be late. She always arrives on time.",
      "options": [
        "won't",
        "isn't going",
        "doesn't",
        "hasn't"
      ],
      "correct": "won't",
      "explanation": "'Will not' → 'won't'. Bashorat + inkor: 'She won't be late'.",
      "id": 304
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "I will going to visit my grandmother tomorrow.",
      "errorPart": "will going",
      "correct": "I am going to visit my grandmother tomorrow.",
      "explanation": "'Will' va 'going to' birga ishlatilmaydi. 'I am going to visit' yoki 'I will visit'.",
      "id": 305
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "She will not goes to the party tonight.",
      "errorPart": "will not goes",
      "correct": "She will not go to the party tonight.",
      "explanation": "'Will' dan keyin V¹ (go) ishlatiladi, 'goes' (V₁+s) emas.",
      "id": 306
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "I am going to buying a new phone next week.",
      "errorPart": "going to buying",
      "correct": "I am going to buy a new phone next week.",
      "explanation": "'Going to' dan keyin V¹ (buy): 'going to buy'. 'Going to buying' xato.",
      "id": 307
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "He wills call you later tonight.",
      "errorPart": "wills call",
      "correct": "He will call you later tonight.",
      "explanation": "'Will' fe'li shaxsga qarab o'zgarmaydi: 'he will', 'he wills' emas.",
      "id": 308
    },
    {
      "type": "transformation",
      "instruction": "'Will' bilan qayta yozing (bashorat):",
      "question": "I think it is going to be sunny tomorrow.",
      "hint": "I think it will ...",
      "correct": "I think it will be sunny tomorrow.",
      "explanation": "'Is going to be' → 'will be'. Ikkalasi ham bashorat uchun to'g'ri.",
      "id": 309
    },
    {
      "type": "transformation",
      "instruction": "'Going to' bilan qayta yozing (reja):",
      "question": "I plan to start a new job next month.",
      "hint": "I am going to ...",
      "correct": "I am going to start a new job next month.",
      "explanation": "'Plan to' → 'going to'. 'Going to' + V¹.",
      "id": 310
    },
    {
      "type": "transformation",
      "instruction": "So'roq gap tuzing:",
      "question": "you / will / come / to the party / tonight?",
      "hint": "Will you ...",
      "correct": "Will you come to the party tonight?",
      "explanation": "So'roq: 'Will + subject + V¹'. 'Will you come?'",
      "id": 311
    }
  ]
}

export const thereIsThereAre: GrammarTopic = {
  "id": "there-is-are-a2",
  "title": "There is / There are",
  "subtitle": "Biror narsaning mavjudligini aytish — bor/yo'q",
  "level": "A2",
  "week": 2,
  "tag": "Grammar",
  "formula": "There is + singular noun · There are + plural noun · There isn't / There aren't · Is there / Are there?",
  "formulaRows": [
    {
      "label": "Yakka (singular)",
      "structure": "There is + a/an + singular noun  (There is a book on the table)",
      "color": "blue"
    },
    {
      "label": "Ko'plik (plural)",
      "structure": "There are + plural noun  (There are three books)",
      "color": "purple"
    },
    {
      "label": "Inkor",
      "structure": "There isn't / There aren't  (There aren't any chairs)",
      "color": "green"
    },
    {
      "label": "So'roq",
      "structure": "Is there / Are there?  (Is there a bank near here?)",
      "color": "orange"
    }
  ],
  "usedFor": [
    "Biror narsaning mavjudligini aytish (There is a park near my house)",
    "Biror narsaning yo'qligini aytish (There isn't any milk)",
    "So'roq: biror narsa bormi/yo'qmi so'rash",
    "Joy va miqdor haqida gapirish"
  ],
  "examples": [
    {
      "en": "There is a supermarket near my house.",
      "uz": "Mening uyim yaqinida supermarket bor."
    },
    {
      "en": "There are two cats in the garden.",
      "uz": "Bog'da ikkita mushuk bor."
    },
    {
      "en": "There isn't any sugar in the cupboard.",
      "uz": "Shkafda shakar yo'q."
    },
    {
      "en": "Are there any good restaurants in this area?",
      "uz": "Bu hududda yaxshi restoranlar bormi?"
    },
    {
      "en": "There was a great film on TV last night.",
      "uz": "Kecha televizorda ajoyib film bor edi."
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "'There is' yoki 'There are' bilan to'ldiring:",
      "question": "_____ a supermarket near my house.",
      "blanks": [
        "There is"
      ],
      "explanation": "'A supermarket' = yakka → 'There is'.",
      "id": 312
    },
    {
      "type": "fill-blank",
      "instruction": "'There is' yoki 'There are' bilan to'ldiring:",
      "question": "_____ three books on the table.",
      "blanks": [
        "There are"
      ],
      "explanation": "'Three books' = ko'plik → 'There are'.",
      "id": 313
    },
    {
      "type": "fill-blank",
      "instruction": "Inkor shaklida yozing:",
      "question": "_____ any milk in the fridge.",
      "blanks": [
        "There isn't"
      ],
      "explanation": "Inkor: 'There isn't any milk'. 'Milk' uncountable → 'isn't'.",
      "id": 314
    },
    {
      "type": "fill-blank",
      "instruction": "So'roq shaklida yozing:",
      "question": "_____ a bank near here?",
      "blanks": [
        "Is there"
      ],
      "explanation": "So'roq: 'Is there a bank...?' Yakka ot → 'Is there'.",
      "id": 315
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "___ a post office near the station?",
      "options": [
        "Is there",
        "Are there",
        "There is",
        "There are"
      ],
      "correct": "Is there",
      "explanation": "'A post office' = yakka → 'Is there a post office?'",
      "id": 316
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "___ any students in the classroom right now.",
      "options": [
        "There aren't",
        "There isn't",
        "There are",
        "There is"
      ],
      "correct": "There aren't",
      "explanation": "'Students' = ko'plik → 'There aren't any students'.",
      "id": 317
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "___ a very interesting documentary on TV tonight.",
      "options": [
        "There is",
        "There are",
        "Is there",
        "Are there"
      ],
      "correct": "There is",
      "explanation": "'A documentary' = yakka → 'There is a very interesting documentary'.",
      "id": 318
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "How many chairs ___ in the room?",
      "options": [
        "are there",
        "is there",
        "there are",
        "there is"
      ],
      "correct": "are there",
      "explanation": "'How many' + ko'plik → 'are there'. 'How many chairs are there?'",
      "id": 319
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "There is three apples on the table.",
      "errorPart": "There is",
      "correct": "There are three apples on the table.",
      "explanation": "'Three apples' = ko'plik → 'There are'. 'There is' — yakka uchun.",
      "id": 320
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "There aren't no milk in the fridge.",
      "errorPart": "aren't no",
      "correct": "There isn't any milk in the fridge.",
      "explanation": "Qo'sh inkor (double negative) xato: 'aren't no' → 'isn't any'. 'Milk' uncountable → 'isn't'.",
      "id": 321
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "There are a big park near my house.",
      "errorPart": "There are",
      "correct": "There is a big park near my house.",
      "explanation": "'A big park' = yakka → 'There is'. 'There are' — ko'plik uchun.",
      "id": 322
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "Is there any students in the classroom?",
      "errorPart": "Is there",
      "correct": "Are there any students in the classroom?",
      "explanation": "'Students' = ko'plik → 'Are there any students?' 'Is there' — yakka uchun.",
      "id": 323
    },
    {
      "type": "transformation",
      "instruction": "'There is' bilan gap tuzing:",
      "question": "a / good restaurant / near the hotel",
      "hint": "There is ...",
      "correct": "There is a good restaurant near the hotel.",
      "explanation": "'There is + a + singular noun + place'. There is a good restaurant near the hotel.",
      "id": 324
    },
    {
      "type": "transformation",
      "instruction": "Inkor gap tuzing:",
      "question": "any / parks / in this neighbourhood",
      "hint": "There aren't ...",
      "correct": "There aren't any parks in this neighbourhood.",
      "explanation": "'There aren't any + plural noun'. Ko'plik → 'aren't'.",
      "id": 325
    },
    {
      "type": "transformation",
      "instruction": "'There was' bilan o'tmishda gap tuzing:",
      "question": "a / good film / on TV / last night",
      "hint": "There was ...",
      "correct": "There was a good film on TV last night.",
      "explanation": "O'tmish: 'There was + a + noun'. 'Last night' = o'tmish.",
      "id": 326
    }
  ]
}

export const possessives: GrammarTopic = {
  "id": "possessives-a2",
  "title": "Possessives",
  "subtitle": "Egalik bildirish — my, your, his, her, its, our, their, 's",
  "level": "A2",
  "week": 3,
  "tag": "Grammar",
  "formula": "Possessive adjective + noun · Noun + 's + noun · Whose + noun + is/are?",
  "formulaRows": [
    {
      "label": "Possessive adjectives",
      "structure": "my / your / his / her / its / our / their + noun",
      "color": "blue"
    },
    {
      "label": "Possessive 's (egasi)",
      "structure": "Noun + 's + noun  (John's car, my mother's house)",
      "color": "purple"
    },
    {
      "label": "Possessive 's (ko'plik)",
      "structure": "Plural noun + ' + noun  (the students' books)",
      "color": "green"
    },
    {
      "label": "So'roq",
      "structure": "Whose + noun + is/are?  (Whose phone is this?)",
      "color": "orange"
    }
  ],
  "usedFor": [
    "Egalikni ko'rsatish: my, your, his, her, its, our, their",
    "Odam va narsalarning egalik munosabati: John's car, the dog's tail",
    "Ko'plik egalik: the students' classroom",
    "'Whose' bilan egalik haqida so'rash"
  ],
  "examples": [
    {
      "en": "This is my book. That is your pen.",
      "uz": "Bu mening kitobim. Bu sening qalaming."
    },
    {
      "en": "John's car is parked outside.",
      "uz": "Jonning mashinasi tashqarida to'xtab turibdi."
    },
    {
      "en": "Whose phone is this? Is it your phone?",
      "uz": "Bu kimning telefoni? Bu sizning telefoningizmi?"
    },
    {
      "en": "The students' homework was excellent.",
      "uz": "Talabalarning uy vazifasi ajoyib edi."
    },
    {
      "en": "Her sister's friend lives in London.",
      "uz": "Uning singlisining do'sti Londonda yashaydi."
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "To'g'ri possessive adjective bilan to'ldiring:",
      "question": "This is _____ (I) book. It belongs to me.",
      "blanks": [
        "my"
      ],
      "explanation": "'I' → 'my'. 'My book' = mening kitobim.",
      "id": 327
    },
    {
      "type": "fill-blank",
      "instruction": "Possessive adjective bilan to'ldiring:",
      "question": "She loves _____ (she) cat very much.",
      "blanks": [
        "her"
      ],
      "explanation": "'She' → 'her'. 'Her cat' = uning mushugi.",
      "id": 328
    },
    {
      "type": "fill-blank",
      "instruction": "'s bilan to'ldiring:",
      "question": "This is _____ car. (John)",
      "blanks": [
        "John's"
      ],
      "explanation": "John + 's → 'John's car'. Jonning mashinasi.",
      "id": 329
    },
    {
      "type": "fill-blank",
      "instruction": "So'roq shaklida yozing:",
      "question": "_____ phone is this? (ask about the owner)",
      "blanks": [
        "Whose"
      ],
      "explanation": "'Whose' = kimning? 'Whose phone is this?'",
      "id": 330
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "This is ___ umbrella. It belongs to me.",
      "options": [
        "my",
        "mine",
        "I",
        "me"
      ],
      "correct": "my",
      "explanation": "'My' + noun (umbrella). 'Mine' — pronounsiz ishlatiladi: 'This is mine'.",
      "id": 331
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "___ mother is a doctor at the local hospital.",
      "options": [
        "His",
        "He",
        "Him",
        "He's"
      ],
      "correct": "His",
      "explanation": "'His' + noun (mother). 'He' — subject pronoun.",
      "id": 332
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "The ___ toys are all over the floor.",
      "options": [
        "children's",
        "childrens'",
        "childrens",
        "children"
      ],
      "correct": "children's",
      "explanation": "'Children' — noto'g'ri ko'plik → 's qo'shiladi: 'children's toys'.",
      "id": 333
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "Is this ___ pen or ___ pen?",
      "options": [
        "your / my",
        "you / me",
        "yours / mine",
        "you / my"
      ],
      "correct": "your / my",
      "explanation": "Possessive adjective + noun: 'your pen / my pen'.",
      "id": 334
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "This is she book. It belongs to her.",
      "errorPart": "she book",
      "correct": "This is her book. It belongs to her.",
      "explanation": "'She' → 'her' (possessive adjective). 'She book' xato, 'her book' to'g'ri.",
      "id": 335
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "Whose this book? Is it yours?",
      "errorPart": "Whose this book",
      "correct": "Whose book is this? Is it yours?",
      "explanation": "'Whose + noun + be?' → 'Whose book is this?' 'Whose this book' — fe'l yo'q.",
      "id": 336
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "The students books are on the desk.",
      "errorPart": "students books",
      "correct": "The students' books are on the desk.",
      "explanation": "Ko'plik ('students') → ' + apostrophe: 'students' books'.",
      "id": 337
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "This is mine book, not your book.",
      "errorPart": "mine book",
      "correct": "This is my book, not your book.",
      "explanation": "'Mine' noun'siz ishlatiladi: 'This is mine'. Noun bilan: 'my book'.",
      "id": 338
    },
    {
      "type": "transformation",
      "instruction": "Possessive adjective bilan qayta yozing:",
      "question": "I have a dog. The dog's name is Rex.",
      "hint": "My dog's ...",
      "correct": "My dog's name is Rex.",
      "explanation": "'I have a dog' → 'my dog'. 'My dog's name'.",
      "id": 339
    },
    {
      "type": "transformation",
      "instruction": "'Whose' bilan so'roq gap tuzing:",
      "question": "this / coat / who / belongs to?",
      "hint": "Whose coat ...",
      "correct": "Whose coat is this?",
      "explanation": "'Whose + noun + is this?' 'Whose coat is this?'",
      "id": 340
    },
    {
      "type": "transformation",
      "instruction": "'s bilan egalik bildiring:",
      "question": "the bag / my mother",
      "hint": "my mother's ...",
      "correct": "my mother's bag",
      "explanation": "Ega ('my mother') + 's + narsa ('bag') → 'my mother's bag'.",
      "id": 341
    }
  ]
}

export const someAnyNoEvery: GrammarTopic = {
  "id": "some-any-no-a2",
  "title": "Some / Any / No / Every",
  "subtitle": "Some, any, no, every — miqdor va aniqlik bildiruvchi so'zlar",
  "level": "A2",
  "week": 3,
  "tag": "Grammar",
  "formula": "some (+), any (?/-), no (-), every (general)",
  "formulaRows": [
    {
      "label": "Some (tasdiq)",
      "structure": "some + noun  (I have some friends)",
      "color": "blue"
    },
    {
      "label": "Any (so'roq / inkor)",
      "structure": "any + noun  (Do you have any? / I don't have any)",
      "color": "purple"
    },
    {
      "label": "No (inkor)",
      "structure": "no + noun = not any  (I have no money)",
      "color": "green"
    },
    {
      "label": "Bileşik so'zlar",
      "structure": "somebody/anybody/nobody · something/anything/nothing · somewhere/anywhere/nowhere",
      "color": "orange"
    }
  ],
  "usedFor": [
    "'Some': tasdiq gaplarda — biror miqdor (some water, some friends)",
    "'Any': so'roq va inkor gaplarda — hech qanday (any questions, not any money)",
    "'No': inkorni kuchaytirish — hech qanday ... yo'q (no time, no idea)",
    "Qo'shma so'zlar: somebody, anything, nowhere, everywhere"
  ],
  "examples": [
    {
      "en": "I have some friends in Tashkent.",
      "uz": "Mening Toshkentda bir qancha do'stlarim bor."
    },
    {
      "en": "Do you have any questions about the lesson?",
      "uz": "Dars haqida savollaringiz bormi?"
    },
    {
      "en": "I don't have any money right now.",
      "uz": "Hozir menda pul yo'q."
    },
    {
      "en": "There is nothing in the fridge. We need to go shopping.",
      "uz": "Muzlatkichda hech narsa yo'q. Bozorga borishimiz kerak."
    },
    {
      "en": "Someone is knocking at the door. Can you open it?",
      "uz": "Kimdir eshikni taqillatyapti. Ocha olasizmi?"
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "Some yoki Any bilan to'ldiring:",
      "question": "I have _____ friends in this city.",
      "blanks": [
        "some"
      ],
      "explanation": "Tasdiq → 'some'. 'Some friends' = bir qancha do'stlar.",
      "id": 342
    },
    {
      "type": "fill-blank",
      "instruction": "Some yoki Any bilan to'ldiring:",
      "question": "Do you have _____ questions about the homework?",
      "blanks": [
        "any"
      ],
      "explanation": "So'roq → 'any'. 'Any questions'?",
      "id": 343
    },
    {
      "type": "fill-blank",
      "instruction": "Some yoki Any bilan to'ldiring:",
      "question": "There isn't _____ milk in the fridge.",
      "blanks": [
        "any"
      ],
      "explanation": "Inkor → 'any'. 'Isn't any milk'.",
      "id": 344
    },
    {
      "type": "fill-blank",
      "instruction": "No bilan to'ldiring:",
      "question": "I have _____ idea what you are talking about.",
      "blanks": [
        "no"
      ],
      "explanation": "'No + noun' = not any. 'I have no idea' = I don't have any idea.",
      "id": 345
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "Would you like ___ tea? Yes, please.",
      "options": [
        "some",
        "any",
        "no",
        "every"
      ],
      "correct": "some",
      "explanation": "Taklif (offer) → 'some'. 'Would you like some tea?' — 'any' emas.",
      "id": 346
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "I looked everywhere but I found ___ interesting.",
      "options": [
        "nothing",
        "anything",
        "something",
        "everything"
      ],
      "correct": "nothing",
      "explanation": "'But' = zid ma'no → hech narsa topmadim: 'found nothing'.",
      "id": 347
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "___ left the door open. I can feel the wind.",
      "options": [
        "Someone",
        "Anyone",
        "Everyone",
        "No one"
      ],
      "correct": "Someone",
      "explanation": "Tasdiq → 'Someone' kimdir eshikni ochiq qoldirgan.",
      "id": 348
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "Is there ___ in the classroom? I need to talk to you.",
      "options": [
        "anyone",
        "someone",
        "no one",
        "everyone"
      ],
      "correct": "anyone",
      "explanation": "So'roq → 'anyone'. 'Is there anyone in the classroom?'",
      "id": 349
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "I don't have some money in my wallet.",
      "errorPart": "some",
      "correct": "I don't have any money in my wallet.",
      "explanation": "Inkor gapda 'some' emas, 'any' ishlatiladi: 'don't have any money'.",
      "id": 350
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "There isn't no milk in the fridge.",
      "errorPart": "isn't no",
      "correct": "There isn't any milk in the fridge. / There is no milk in the fridge.",
      "explanation": "Qo'sh inkor (double negative) xato: 'isn't no' → 'isn't any' yoki 'is no'.",
      "id": 351
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "Anybody called while I was out. The phone rang.",
      "errorPart": "Anybody",
      "correct": "Somebody called while I was out.",
      "explanation": "Tasdiq gapda 'anybody' emas, 'somebody' ishlatiladi: 'Somebody called'.",
      "id": 352
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "I looked for my keys everywhere but I found something.",
      "errorPart": "something",
      "correct": "I looked for my keys everywhere but I found nothing.",
      "explanation": "'Something' = biror narsa, 'nothing' = hech narsa. Topa olmadi → 'nothing'.",
      "id": 353
    },
    {
      "type": "transformation",
      "instruction": "'No' bilan qayta yozing:",
      "question": "I don't have any money with me.",
      "hint": "I have no ...",
      "correct": "I have no money with me.",
      "explanation": "'Don't have any' → 'have no'. 'No + noun' = not any.",
      "id": 354
    },
    {
      "type": "transformation",
      "instruction": "'Any' bilan so'roq gap tuzing:",
      "question": "There is milk in the fridge. (question about existence)",
      "hint": "Is there any ...",
      "correct": "Is there any milk in the fridge?",
      "explanation": "So'roq: 'Is there any + noun?'",
      "id": 355
    },
    {
      "type": "transformation",
      "instruction": "'Something' bilan gap tuzing:",
      "question": "I want to eat. (unnamed thing)",
      "hint": "I want ...",
      "correct": "I want something to eat.",
      "explanation": "'Something' = biror narsa (nima ekanligi aniq emas).",
      "id": 356
    }
  ]
}


