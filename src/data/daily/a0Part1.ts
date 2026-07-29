import type { DailyLesson } from '../dailyLessons'

export const greetingsAndNames: DailyLesson = {
  id: 'greetings-names',
  reading: {
    title: 'Hello!',
    passage: "Hello! My name is Anvar. I am from Uzbekistan. I am a student. This is my friend. Her name is Dilnoza. She is from Tashkent. Nice to meet you!",
    vocabulary: [
      { word: 'name', definition: 'ism' },
      { word: 'friend', definition: "do'st" },
      { word: 'student', definition: 'talaba, o\'quvchi' },
    ],
    questions: [
      { id: 93001, type: 'multiple-choice', question: "What is the boy's name?", options: ['Dilnoza', 'Anvar', 'Aziz', 'Bek'], correctIndex: 1, explanation: "'My name is Anvar.'" },
      { id: 93002, type: 'multiple-choice', question: "Where is Anvar from?", options: ['Tashkent', 'Uzbekistan', 'Russia', 'England'], correctIndex: 1, explanation: "'I am from Uzbekistan.'" },
      { id: 93003, type: 'multiple-choice', question: "What is his friend's name?", options: ['Dilnoza', 'Nigora', 'Malika', 'Zebo'], correctIndex: 0, explanation: "'Her name is Dilnoza.'" },
    ],
  },
  writing: {
    prompt: "Write three short sentences. Say hello, tell your name, and say where you are from.",
    wordLimit: 30,
    tips: [
      "'Hello! My name is ...'",
      "'I am from ...'",
      "'Nice to meet you!'",
    ],
    modelAnswer: "Hello! My name is Aziz. I am from Uzbekistan. Nice to meet you!",
  },
  speaking: {
    prompt: "Introduce yourself. Say hello, tell your name, where you are from, and ask someone their name. Speak for about 30-60 seconds.",
    tips: [
      "'Hello! My name is...'",
      "'I am from...'",
      "'Nice to meet you.'",
      "'What is your name?'",
    ],
    sampleAnswer: "Hello! My name is Dilnoza. Nice to meet you. I am from Uzbekistan. I am a student. What is your name? Where are you from? I am very happy to meet you. Goodbye, see you later!",
  },
  title: 'Salomlashish va ismlar',
  subtitle: 'Hello, My name is... — Birinchi qadamlar',
  level: 'A0',
  category: 'Salomlashish',
  day: 1,
  formulas: [
    { label: 'Salomlashish', structure: 'Hello! / Hi!\nGood morning! / Good evening!', explanation: "Salom berish iboralari.", whenToUse: "Kimnidir uchratganda.", example: "Hello! Good morning!", color: 'green' },
    { label: "O'zini tanishtirish", structure: "My name is ...\nI am ...", explanation: "O'zini tanishtirish iboralari.", whenToUse: "Yangi odam bilan tanishganda.", example: "My name is Ali.", color: 'blue' },
    { label: 'Xayrlashish', structure: 'Goodbye! / Bye!\nSee you!', explanation: "Xayrlashish iboralari.", whenToUse: "Ketayotganda.", example: "Goodbye! See you!", color: 'orange' },
  ],
  rules: [
    "1️⃣ HELLO — eng oddiy salom. Har qanday vaziyatda ishlatiladi.\nHello! My name is Ali. (Salom! Mening ismim Ali.)\n\n2️⃣ HI — biroz norasmiyroq. Do'stlarga.\nHi! How are you? (Salom! Qandaysan?)\n\n3️⃣ GOOD MORNING — ertalab (06:00-12:00).\nGood morning, teacher! (Xayrli tong, o'qituvchi!)\n\n4️⃣ GOOD EVENING — kechqurun (18:00+).\nGood evening! How are you? (Xayrli kech! Qandaysiz?)",
    "5️⃣ MY NAME IS ... — Mening ismim ...\nMy name is Bobur.\nMy name is Dilfuza.\n\n6️⃣ I AM ... — Men ... man\nI am a student. (Men talabaman.)\nI am from Tashkent. (Men Toshkentdanman.)\n\n7️⃣ GOODBYE — Xayr!\nBye! — Xayr! (norasmiy)\nSee you later! — Keyin ko'rishguncha!",
    "8️⃣ O'ZBEKCHA XATOLAR:\n\n❌ What is ismingiz?\n✅ What is your name?\n\n❌ I am Ali ismim.\n✅ My name is Ali.\n\n❌ Good night! — ertalab\n✅ Good morning! — ertalab",
  ],
  vocabulary: [
    { en: 'hello', uz: 'salom', example: 'Hello! My name is Ali.', rule: 'greeting' },
    { en: 'hi', uz: 'salom (norasmiy)', example: 'Hi! How are you?', rule: 'informal' },
    { en: 'goodbye', uz: 'xayr', example: 'Goodbye! See you!', rule: 'farewell' },
    { en: 'morning', uz: 'ertalab', example: 'Good morning!', rule: 'time' },
    { en: 'evening', uz: 'kechqurun', example: 'Good evening!', rule: 'time' },
    { en: 'name', uz: 'ism', example: 'My name is Ali.', rule: 'noun' },
    { en: 'student', uz: 'talaba', example: 'I am a student.', rule: 'noun' },
    { en: 'teacher', uz: "o'qituvchi", example: 'She is a teacher.', rule: 'noun' },
    { en: 'from', uz: 'dan', example: 'I am from Tashkent.', rule: 'preposition' },
    { en: 'thank', uz: 'rahmat', example: 'Thank you!', rule: 'verb' },
  ],
  examples: [
    { en: 'Hello! My name is Ali. What is your name?', uz: 'Salom! Mening ismim Ali. Ismingiz nima?' },
    { en: 'Good morning, teacher! How are you?', uz: "Xayrli tong, o'qituvchi! Qandaysiz?" },
    { en: 'I am from Tashkent. I am a student.', uz: 'Men Toshkentdanman. Men talabaman.' },
    { en: 'Goodbye! See you later!', uz: "Xayr! Keyinroq ko'rishguncha!" },
  ],
  specialCases: [],
  exercises: [
    { id: 100001, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Siz do'stingizga norasmiy salom ayting. Qaysi?", blanks: ["Hi"], explanation: "Hi — norasmiy salom. Do'stlarga ishlatiladi." },
    { id: 100002, type: 'fill-blank', instruction: "Bo'sh joyni to'ldiring:", question: "My ___ is Ali.", blanks: ['name'], explanation: "My name is Ali — Mening ismim Ali." },
    { id: 100003, type: 'fill-blank', instruction: "So'zni tarjima qiling:", question: 'Translate: Student = ___', blanks: ['talaba'], explanation: 'Student = talaba — "Student" so\'zining tarjimasi' },
    { id: 100004, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "It is 9 AM. You say:", blanks: ["Good morning"], explanation: "9 AM = morning — Good morning!" },
    { id: 100005, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Qaysi jumla to'g'ri?", options: ["My name is Ali.", "My name Ali.", "I name is Ali.", "My am Ali."], correct: "My name is Ali.", explanation: "To'g'ri: My name is Ali." },
  ],
  exerciseSections: [
    { title: 'Salomlashish', desc: "Salomlashish usullarini sinab ko'ring", color: 'green', icon: '👋', ids: [100001, 100002, 100003, 100004, 100005] },
  ],
  tests: [
    { id: 200001, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which greeting is correct for 8 AM?", options: ["Good morning", "Good afternoon", "Good evening", "Good night"], correct: "Good morning", explanation: "8 AM = Good morning!" },
    { id: 200002, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "My name is Ali. — bu nima?", blanks: ["O'zini tanishtirish"], explanation: "My name is = Mening ismim" },
  ],
  testSections: [
    { title: 'Test', desc: 'Bilimingizni tekshiring', color: 'purple', icon: '📝', ids: [200001, 200002] },
  ],
}

export const numbersAndAlphabet: DailyLesson = {
  id: 'numbers-alphabet',
  reading: {
    title: 'My Numbers',
    passage: "My name is Bek. B-E-K. I am ten years old. I have two cats and three dogs. I have five books. My favourite number is seven. I like numbers!",
    vocabulary: [
      { word: 'number', definition: 'raqam, son' },
      { word: 'old', definition: 'yosh (necha yoshda)' },
      { word: 'favourite', definition: 'sevimli' },
    ],
    questions: [
      { id: 93004, type: 'multiple-choice', question: "How old is Bek?", options: ['Seven', 'Ten', 'Five', 'Two'], correctIndex: 1, explanation: "'I am ten years old.'" },
      { id: 93005, type: 'multiple-choice', question: "How many cats does Bek have?", options: ['Two', 'Three', 'Five', 'Ten'], correctIndex: 0, explanation: "'I have two cats.'" },
      { id: 93006, type: 'multiple-choice', question: "What is his favourite number?", options: ['Five', 'Ten', 'Seven', 'Two'], correctIndex: 2, explanation: "'My favourite number is seven.'" },
    ],
  },
  writing: {
    prompt: "Write about numbers. How old are you? How many books do you have? Write your name letter by letter.",
    wordLimit: 30,
    tips: [
      "'I am ... years old.'",
      "'I have ... books.'",
      "Spell your name: A-Z-I-Z.",
    ],
    modelAnswer: "My name is Aziz. A-Z-I-Z. I am nine years old. I have five books and two pens.",
  },
  speaking: {
    prompt: "Count from one to ten, spell your name, and say your age. Speak for about 30-60 seconds.",
    tips: [
      "'One, two, three...'",
      "Spell: 'My name is Ali — A, L, I.'",
      "'I am ... years old.'",
      "Alifboni ayting: A, B, C, D...",
    ],
    sampleAnswer: "Let me count: one, two, three, four, five, six, seven, eight, nine, ten. My name is Ali — A, L, I. I am nineteen years old. My favourite number is seven. Let me say the alphabet: A, B, C, D, E, F, G. That is easy! Thank you.",
  },
  title: 'Raqamlar va alifbo',
  subtitle: '1, 2, 3... A, B, C... — Asosiy bilimlar',
  level: 'A0',
  category: 'Raqamlar',
  day: 2,
  formulas: [
    { label: 'Raqamlar 1-10', structure: '1 one, 2 two, 3 three\n4 four, 5 five, 6 six\n7 seven, 8 eight, 9 nine, 10 ten', explanation: "1 dan 10 gacha sonlar.", whenToUse: "Sanaganda.", example: "I have three books.", color: 'green' },
    { label: 'Alifbo', structure: '26 letters: A-Z\n5 vowels: A, E, I, O, U\n21 consonants', explanation: "Ingliz alifbosi (26 harf).", whenToUse: "So'zni harflab aytganda.", example: "How do you spell your name?", color: 'blue' },
  ],
  rules: [
    "1️⃣ RAQAMLAR 1-10:\n1 = one (uan)\n2 = two (tu)\n3 = three (sri)\n4 = four (for)\n5 = five (fayv)\n6 = six (siks)\n7 = seven (sevn)\n8 = eight (eyt)\n9 = nine (nayn)\n10 = ten (ten)\n\n2️⃣ MUHIM: O'zbek tilida '3' — 'uch', ingliztilida 'three' — 'sri'. O'xshamaydi!",
    "3️⃣ ALIFBO:\nIngliz tilida 26 ta harf bor.\n5 ta UNLI (vowel): A, E, I, O, U\n21 ta UNDOSH (consonant): qolganlari\n\n4️⃣ UNLILAR MUHIM:\n'a' — apple (olma)\n'e' — elephant (fil)\n'i' — ice (muz)\n'o' — orange (apelsin)\n'u' — umbrella (soya)",
    "5️⃣ O'ZBEKCHA XATOLAR:\n\n❌ 'tree' (daraxt) — 'three' (3) ga o'xshab ketishi mumkin!\n❌ 'fif' — 'five' (5) to'g'ri\n❌ 'seks' — 'six' (6) to'g'ri, 'seven' (7) emas!",
  ],
  vocabulary: [
    { en: 'one', uz: 'bitta', example: 'I have one cat.', rule: 'number' },
    { en: 'two', uz: 'ikkita', example: 'I have two hands.', rule: 'number' },
    { en: 'three', uz: 'uchta', example: 'I have three books.', rule: 'number' },
    { en: 'four', uz: "to'rtta", example: 'Four seasons in a year.', rule: 'number' },
    { en: 'five', uz: 'beshita', example: 'I have five fingers.', rule: 'number' },
    { en: 'six', uz: 'oltita', example: 'Six apples on the table.', rule: 'number' },
    { en: 'seven', uz: 'yetita', example: 'Seven days in a week.', rule: 'number' },
    { en: 'eight', uz: 'sakkizta', example: 'Eight hours of sleep.', rule: 'number' },
    { en: 'nine', uz: "to'qqizta", example: 'Nine months in a year.', rule: 'number' },
    { en: 'ten', uz: "o'nita", example: 'I have ten toes.', rule: 'number' },
  ],
  examples: [
    { en: 'I have one brother and two sisters.', uz: "Bir aka-ukam va ikki opa-singlim bor." },
    { en: 'There are seven days in a week.', uz: 'Haftada yeti kun bor.' },
    { en: 'A, E, I, O, U are vowels.', uz: 'A, E, I, O, U — unli harflar.' },
  ],
  specialCases: [],
  exercises: [
    { id: 100010, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "How do you write 3 in English?", blanks: ["three"], explanation: "3 soni ingliz tilida three deb yoziladi." },
    { id: 100011, type: 'multiple-choice', instruction: "'Seven' — bu nechchi?", question: "What number is 'seven'?", options: ['5', '6', '7', '8'], correct: '7', explanation: "Seven ingliz tilida 7 sonini bildiradi." },
    { id: 100012, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "How many letters are in the English alphabet?", blanks: ["26"], explanation: "Ingliz alifbosida 26 ta harf bor." },
    { id: 100013, type: 'multiple-choice', instruction: "Qaysi harf UNLI?", question: 'Which letter is a vowel?', options: ['B', 'E', 'F', 'G'], correct: 'E', explanation: 'E — unli harf (A, E, I, O, U).' },
    { id: 100014, type: 'fill-blank', instruction: "Bo'sh joyni to'ldiring:", question: "There are ___ days in a week.", blanks: ['seven'], explanation: "Seven days = yeti kun (dushanba-yakshanba)." },
  ],
  exerciseSections: [
    { title: 'Raqamlar', desc: "Raqamlarni sinab ko'ring", color: 'green', icon: '🔢', ids: [100010, 100011, 100012, 100013, 100014] },
  ],
  tests: [
    { id: 200010, type: 'multiple-choice', instruction: "'Five' nechchi?", question: "What is 'five' in numbers?", options: ['4', '5', '6', '7'], correct: '5', explanation: "Five soni 5 ni anglatadi." },
    { id: 200011, type: 'multiple-choice', instruction: "Qaysi harf undosh?", question: 'Which letter is a consonant?', options: ['A', 'I', 'O', 'B'], correct: 'B', explanation: 'B — undosh. A, I, O — unli.' },
  ],
  testSections: [
    { title: 'Test', desc: 'Bilimingizni tekshiring', color: 'purple', icon: '📝', ids: [200010, 200011] },
  ],
}

export const familyAndMe: DailyLesson = {
  id: 'family-me',
  reading: {
    title: 'My Family',
    passage: "This is my family. My father is Bobur. My mother is Nigora. I have one sister. Her name is Malika. She is seven years old. I love my family very much.",
    vocabulary: [
      { word: 'family', definition: 'oila' },
      { word: 'father', definition: 'ota' },
      { word: 'sister', definition: 'opa/singil' },
    ],
    questions: [
      { id: 93007, type: 'multiple-choice', question: "Who is the father?", options: ['Nigora', 'Bobur', 'Malika', 'Anvar'], correctIndex: 1, explanation: "'My father is Bobur.'" },
      { id: 93008, type: 'multiple-choice', question: "What is the sister's name?", options: ['Nigora', 'Malika', 'Dilnoza', 'Zebo'], correctIndex: 1, explanation: "'Her name is Malika.'" },
      { id: 93009, type: 'multiple-choice', question: "How old is the sister?", options: ['Five', 'Seven', 'Ten', 'Nine'], correctIndex: 1, explanation: "'She is seven years old.'" },
    ],
  },
  writing: {
    prompt: "Write about your family. Write the names of your mother, father, and one more person.",
    wordLimit: 35,
    tips: [
      "'This is my family.'",
      "'My father is ... My mother is ...'",
      "'I have one brother/sister.'",
    ],
    modelAnswer: "This is my family. My father is Aziz. My mother is Zebo. I have one brother. His name is Sardor. I love my family.",
  },
  speaking: {
    prompt: "Talk about your family. Say who is in your family and their names. Speak for about 30-60 seconds.",
    tips: [
      "'I have a mother, a father...'",
      "'This is my mother.'",
      "'Her name is... / His name is...'",
      "'I love my family.'",
    ],
    sampleAnswer: "I want to tell you about my family. I have a mother, a father, and two sisters. My mother's name is Nigora, and my father's name is Bobur. My sisters are Malika and Zilola. I love my family very much. We live in a small house. My family is happy. This is my family!",
  },
  title: "Oilam va men",
  subtitle: "Family, mother, father — Mening oilam",
  level: 'A0',
  category: 'Ranglar va narsalar',
  day: 3,
  formulas: [
    { label: 'Oila a\'zolari', structure: "mother (ona)\nfather (ota)\nbrother (aka/uka)\nsister (opa/singil)\ngrandmother (bobo/buvi)\ngrandfather (bobo/dada)", explanation: "Oila a'zolari nomlari.", whenToUse: "Oilangiz haqida gapirganda.", example: "This is my mother.", color: 'green' },
    { label: 'I have ...', structure: "I have a brother.\nI have two sisters.\nI don't have a pet.", explanation: "'have' bilan egalik.", whenToUse: "Nima borligini aytganda.", example: "I have a brother.", color: 'blue' },
    { label: "She is ... / He is ...", structure: "She is my mother.\nHe is my father.\nShe is a teacher.", explanation: "'be' bilan tanishtirish.", whenToUse: "Kimnidir tanishtirganda.", example: "She is my sister.", color: 'orange' },
  ],
  rules: [
    "1️⃣ OILA A'ZOLARI:\n\n mother — ona ( mama )\n father — ota ( papa )\n brother — aka, uka\n sister — opa, singil\n grandmother — buvi, boba\n grandfather — boba, dada\n\n2️⃣ MUHIM: Ingliztilida 'brother' — aka HAM, uka HAM. 'Sister' — opa HAM, singil HAM. Farq yo'q!",
    "3️⃣ I HAVE ... — Mening ... bor\nI have a brother. (Mening aka-ukam bor.)\nI have two sisters. (Mening ikki opa-singlim bor.)\n\n4️⃣ I DON'T HAVE ... — Mening ... yo'q\nI don't have a pet. (Mening uy hayvonim yo'q.)\n\n5️⃣ SHE IS / HE IS — U (ayol) / U (erkak)\nShe is my mother. (U mening onam.)\nHe is my father. (U mening otam.)",
    "6️⃣ O'ZBEKCHA XATOLAR:\n\n❌ I have brother.\n✅ I have a brother. (ARTIKL kerak!)\n\n❌ She is mother.\n✅ She is my mother. (POSESSIV kerak!)\n\n❌ He is father mine.\n✅ He is my father.",
  ],
  vocabulary: [
    { en: 'mother', uz: 'ona, mama', example: 'My mother is a doctor.', rule: 'family' },
    { en: 'father', uz: 'ota, papa', example: 'My father works hard.', rule: 'family' },
    { en: 'brother', uz: 'aka, uka', example: 'I have one brother.', rule: 'family' },
    { en: 'sister', uz: 'opa, singil', example: 'My sister is tall.', rule: 'family' },
    { en: 'grandmother', uz: 'buvi, boba', example: 'My grandmother cooks well.', rule: 'family' },
    { en: 'grandfather', uz: 'bobo, dada', example: 'My grandfather tells stories.', rule: 'family' },
    { en: 'family', uz: 'oila', example: 'I love my family.', rule: 'noun' },
    { en: 'have', uz: 'ega bo\'lmoq', example: 'I have a big family.', rule: 'verb' },
    { en: 'big', uz: 'katta', example: 'I have a big family.', rule: 'adjective' },
    { en: 'small', uz: 'kichik', example: 'I have a small cat.', rule: 'adjective' },
  ],
  examples: [
    { en: 'I have a big family. My mother is a teacher.', uz: 'Mening katta oilam bor. Onam o\'qituvchi.' },
    { en: 'She is my sister. She is 10 years old.', uz: 'U mening opam. U 10 yoshda.' },
    { en: 'My father works in an office.', uz: "Otam idorada ishlaydi." },
    { en: 'I don\'t have a brother.', uz: "Mening aka-ukam yo'q." },
  ],
  specialCases: [],
  exercises: [
    { id: 100020, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "What does 'mother' mean?", blanks: ["Ona"], explanation: 'Mother = ona (ingliz tilida "ona" degan ma\'no)' },
    { id: 100021, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is correct?", options: ["I have a brother.", "I have brother.", "I have a brothers.", "I have the brother."], correct: "I have a brother.", explanation: "Artikl 'a' kerak: I have a brother." },
    { id: 100022, type: 'fill-blank', instruction: '\'She is my ___\' (ona):', question: 'She is my ___. (ona)', blanks: ['mother'], explanation: 'mother = ona (ingliz tilida "ona" degan ma\'no)' },
    { id: 100023, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "'Brother' = ?", blanks: ["Aka yoki uka"], explanation: "Ingliztilida brother = aka HAM, uka HAM." },
    { id: 100024, type: 'fill-blank', instruction: "Bo'sh joyni to'ldiring:", question: "I ___ two sisters.", blanks: ['have'], explanation: "I have two sisters — Mening ikki opa-singlim bor." },
  ],
  exerciseSections: [
    { title: 'Oila', desc: "Oila a'zolarini sinab ko'ring", color: 'blue', icon: '👨‍👩‍👧‍👦', ids: [100020, 100021, 100022, 100023, 100024] },
  ],
  tests: [
    { id: 200020, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "What does 'father' mean?", blanks: ["Ota"], explanation: 'Father = ota (ingliz tilida "ota" degan ma\'no)' },
    { id: 200021, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is correct?", options: ["She is my mother.", "She is my mothers.", "She am my mother.", "She is mine mother."], correct: "She is my mother.", explanation: "To'g'ri: She is my mother." },
  ],
  testSections: [
    { title: 'Test', desc: 'Bilimingizni tekshiring', color: 'purple', icon: '📝', ids: [200020, 200021] },
  ],
}
