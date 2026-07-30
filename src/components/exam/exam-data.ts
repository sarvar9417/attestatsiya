/**
 * exam-data.ts — Mock ma'lumotlar va TypeScript tiplari
 *
 * 50 ta savol, attestatsiya testi uchun.
 * 12-savol: "Quyidagi programmada sikl necha marta bajariladi?" (while loop)
 */

export type CognitiveLevel = 'knowledge' | 'application' | 'reasoning'

export interface ExamOption {
  id: string
  side: 'a' | 'b'
  content_md: string
}

export interface ExamQuestion {
  id: string
  number: number
  subject: string
  stem_md: string
  options: ExamOption[]
  cognitiveLevel: CognitiveLevel
  difficulty: number
}

export interface ExamState {
  questions: ExamQuestion[]
  currentIndex: number
  answers: Record<string, string>
  markedForReview: Set<string>
  saved: Set<string>
  startTime: number
  durationSec: number
}

export const LEVEL_LABELS: Record<CognitiveLevel, string> = {
  knowledge: 'Bilish',
  application: 'Qo‘llash',
  reasoning: 'Mulohaza',
}

export const LETTERS = ['A', 'B', 'C', 'D'] as const

export const CANDIDATE = {
  firstName: 'Sarvar',
  lastName: 'Murodullayev',
  initials: 'SM',
  id: '2024-AT-0158',
  subject: 'Informatika',
  group: '10-A',
}

// ─── 50 ta mock savol ──────────────────────────────────────────────────
const TOPICS = [
  'Informatika', 'Axborot nazariyasi', 'Axborot xossalari',
  'Kompyuter tuzilishi', 'Dasturiy ta\'minot', 'Tarmoq texnologiyalari',
  'Axborot xavfsizligi', 'Raqamli axborot', 'Ma\'lumotlar bazasi',
  'Algoritmlash',
]

function generateQuestions(): ExamQuestion[] {
  const qs: ExamQuestion[] = []

  const stems = [
    'Informatika atamasi qaysi tildan olingan?',
    '1 bayt necha bitga teng?',
    'Axborotning qaysi xossasi uning dolzarbligini ifodalaydi?',
    'Qaysi biri axborot xossasi EMAS?',
    'Internetda maʼlumot uzatishda asosiy protokol qaysi?',
    'Axborot xavfsizligining asosiy tamoyili qaysi?',
    'Qaysi biri dasturiy taʼminot turiga kiradi?',
    'Raqamli axborotning afzalligi EMAS?',
    'Axborotlashgan jamiyatning asosiy belgisi?',
    'MBBT deganda nima tushuniladi?',
    'Qaysi biri algoritmning xossasi EMAS?',
    'Quyidagi programmada sikl necha marta bajariladi?\n\n```c\nint i = 1;\nwhile(i <= 16) {\n  i = i * 2;\n}\n```',
    'Fayl hajmi 2 MB. Bu necha KB ga teng?',
    'ASCII kodlashda nechta belgi bor?',
    'Unicode kodlashning afzalligi?',
    'Rastr va vektor grafikani farqlovchi asosiy belgi?',
    'RGB rang modelida nechta asosiy rang bor?',
    'Audio namunalash chastotasi qanday o‘lchanadi?',
    'Bit chuqurligi 16 bit bo‘lgan audio sifat darajasi?',
    'Video fayl hajmiga ta’sir qiluvchi omil EMAS?',
    'Qaysi biri yo‘qotishli siqish algoritmi?',
    'TCP va UDP protokollari orasidagi asosiy farq?',
    'IP manzil necha baytdan iborat?',
    'Qaysi biri bulutli hisoblash turi EMAS?',
    'Maʼlumotlar bazasida PRIMARY KEY nima uchun ishlatiladi?',
    'SQL so‘rovida maʼlumotlarni tanlash uchun qaysi buyruq ishlatiladi?',
    'Operatsion tizimning asosiy vazifasi?',
    'Qaysi biri operatsion tizim EMAS?',
    'Fayl sistemasi nima uchun kerak?',
    'Qaysi biri fayl kengaytmasi EMAS?',
    'Elektron pochta protokoli qaysi?',
    'URL manzilining to‘liq ko‘rinishi?',
    'Qaysi biri brauzer EMAS?',
    'Kiberxavfsizlikning asosiy maqsadi?',
    'Phishing nima?',
    'Antivirus dasturining vazifasi?',
    'Qaysi biri autentifikatsiya usuli EMAS?',
    'Simmetrik shifrlashda ...?',
    'Raqamli imzo nima uchun ishlatiladi?',
    'Blockchain texnologiyasining asosiy xususiyati?',
    'Sunʼiy intellektning qo‘llanilish sohasi EMAS?',
    'Neyron tarmoq nima?',
    'Qaysi biri mashina o‘qitishi turi EMAS?',
    'Big Data ning asosiy xarakteristikasi?',
    'IoT (Internet of Things) nima?',
    'Bulutli texnologiyalarning afzalligi EMAS?',
    'Virtualizatsiya nima?',
    'Qaysi biri container texnologiyasi?',
    'Open Source litsenziyasining xususiyati?',
    'Agile metodologiyasining asosiy tamoyili?',
  ]

  const opts: [string, string, string, string][] = [
    ['Ingliz tili', 'Fransuz tili', 'Nemis tili', 'Rus tili'],
    ['4 bit', '8 bit', '16 bit', '32 bit'],
    ['To‘liqlik', 'Aniqlik', 'O‘z vaqtidalik', 'Ishonchlilik'],
    ['Aniqlik', 'Ishonchlilik', 'Og‘irlik', 'To‘liqlik'],
    ['FTP', 'TCP/IP', 'HTTP', 'SMTP'],
    ['Maxfiylik', 'Tezkorlik', 'Arzonlik', 'Qulaylik'],
    ['Monitor', 'Operatsion tizim', 'Klaviatura', 'Printer'],
    ['Aniq nusxalash', 'Tez uzatish', 'Hech qachon eskimaydi', 'Avtomatik qayta ishlash'],
    ['Yozma hujjatlar', 'Raqamli xizmatlar', 'Telefon aloqasi', 'Qo‘lda hisob-kitob'],
    ['Fayllarni saqlash dasturi', 'Maʼlumotlarni yaratish va boshqarish dasturi', 'Internet brauzer', 'Grafik muharrir'],
    ['Aniqlik', 'Ommaviylik', 'Diskretlik', 'Tushunarlilik'],
    ['3 marta', '4 marta', '5 marta', '6 marta'],
    ['2000 KB', '2048 KB', '1000 KB', '1024 KB'],
    ['128 ta', '256 ta', '512 ta', '1024 ta'],
    ['Ko‘p tillarni qo‘llaydi', 'Tez ishlaydi', 'Arzon', 'Kichik hajmli'],
    ['Piksellar soni', 'Ranglar soni', 'Masshtablash usuli', 'Fayl hajmi'],
    ['2 ta', '3 ta', '4 ta', '5 ta'],
    ['Hz', 'dB', 'bit/s', 'samp/s'],
    ['Telefon sifati', 'Radio sifati', 'CD sifati', 'DVD sifati'],
    ['Rang chuqurligi', 'Kadrlar chastotasi', 'Ovoz balandligi', 'Ekran o‘lchami'],
    ['JPEG', 'PNG', 'ZIP', 'FLAC'],
    ['TCP ishonchli, UDP ishonchsiz', 'TCP tez, UDP sekin', 'TCP xavfsiz, UDP xavfli', 'TCP arzon, UDP qimmat'],
    ['2 bayt', '4 bayt', '6 bayt', '8 bayt'],
    ['IaaS', 'PaaS', 'SaaS', 'DaaS'],
    ['Takrorlanmaslikni taʼminlash', 'Tezlikni oshirish', 'Hajmni kamaytirish', 'Xavfsizlikni taʼminlash'],
    ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
    ['Dasturlarni ishga tushirish', 'Resurslarni boshqarish', 'Internetga ulash', 'Virusdan himoyalash'],
    ['Windows', 'Linux', 'macOS', 'Microsoft Word'],
    ['Fayllarni tartibli saqlash', 'Internetga ulash', 'Virusdan himoyalash', 'Tezlikni oshirish'],
    ['.txt', '.docx', '.jpg', '.excel'],
    ['SMTP', 'POP3/IMAP', 'HTTP', 'FTP'],
    ['https://example.com/page', 'example.com', 'www.example.com', 'http://example'],
    ['Google Chrome', 'Mozilla Firefox', 'Microsoft Edge', 'Microsoft Word'],
    ['Maʼlumotlarni himoyalash', 'Tezlikni oshirish', 'Arzonlashtirish', 'Qulaylashtirish'],
    ['Parolni o‘g‘irlash usuli', 'Virus turi', 'Tarmoq protokoli', 'Dasturlash tili'],
    ['Viruslarni topish va yo‘q qilish', 'Internetni tezlashtirish', 'Fayllarni tartiblash', 'Dasturlarni ishga tushirish'],
    ['Biometriya', 'Parol', 'Captcha', 'Smart-karta'],
    ['Kalit bir xil', 'Kalitlar har xil', 'Kalit kerak emas', 'Kalit ochiq'],
    ['Hujjatni tasdiqlash', 'Maʼlumotni shifrlash', 'Tezlikni oshirish', 'Hajmni kamaytirish'],
    ['Markazlashganlik', 'O‘zgarmaslik', 'Tezlik', 'Arzonlik'],
    ['Rasm tanib olish', 'Nutqni tushunish', 'Ovqat pishirish', 'Maʼlumot tahlili'],
    ['Inson miyasiga o‘xshash tarmoq', 'Dasturlash tili', 'Maʼlumotlar bazasi', 'Operatsion tizim'],
    ['Boshqariladigan', 'Boshqarilmaydigan', 'Mustahkamlangan', 'Kuchsizlantirilgan'],
    ['Hajmning kattaligi', 'Tezlikning yuqoriligi', 'Xilma-xillik', 'Barcha javoblar to‘g‘ri'],
    ['Narsalarning interneti', 'Dasturlar tarmog‘i', 'Sensorlar tizimi', 'Bulutli hisoblash'],
    ['Istalgan joydan kirish', 'Yuqori xavfsizlik', 'Arzon narx', 'Cheksiz resurs'],
    ['Bitta kompyuterda ko‘p tizim', 'Tarmoq ulash', 'Maʼlumot saqlash', 'Dastur yaratish'],
    ['Docker', 'VirtualBox', 'VMware', 'Hyper-V'],
    ['Bepul tarqatish', 'Kodni ochiq qilish', 'Mualliflik huquqini saqlash', 'Barcha javoblar to‘g‘ri'],
    ['Moslashuvchanlik', 'Qat\'iy rejalashtirish', 'Hujjatlashtirish', 'Nazorat'],
  ]

  for (let i = 0; i < 50; i++) {
    const stem = stems[i % stems.length]
    const optArr = opts[i % opts.length]
    const topic = TOPICS[i % TOPICS.length]
    const level: CognitiveLevel = i < 15 ? 'knowledge' : i < 35 ? 'application' : 'reasoning'
    const diff = (i % 5) + 1

    qs.push({
      id: `q${i + 1}`,
      number: i + 1,
      subject: topic,
      stem_md: stem,
      options: [
        { id: `q${i + 1}_a`, side: 'a' as const, content_md: optArr[0] },
        { id: `q${i + 1}_b`, side: 'a' as const, content_md: optArr[1] },
        { id: `q${i + 1}_c`, side: 'a' as const, content_md: optArr[2] },
        { id: `q${i + 1}_d`, side: 'a' as const, content_md: optArr[3] },
      ],
      cognitiveLevel: level,
      difficulty: diff,
    })
  }

  return qs
}

export const MOCK_QUESTIONS: ExamQuestion[] = generateQuestions()
