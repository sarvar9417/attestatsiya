export interface Subtopic {
  id: string
  title: string
  description?: string
}

export interface Module {
  id: string
  code: string
  title: string
  description: string
  section: 'specialty' | 'professional_standard' | 'pedagogy' | 'methodology'
  examQuestionCount: number
  subtopics: Subtopic[]
}

export const MODULES: Module[] = [
  {
    id: 'M01', code: 'M01',
    title: 'Axborot va raqamli savodxonlik',
    description: 'Informatika, axborot, ma\'lumot va bilim. Axborot turlari va manbalari, raqamli texnologiyalar, axborotni kodlash, o\'lchov birliklari, axborot hajmi va uzatish tezligi.',
    section: 'specialty', examQuestionCount: 3,
    subtopics: [
      { id: 'M01.01', title: 'Informatika, axborot, ma\'lumot va bilim' },
      { id: 'M01.02', title: 'Axborot turlari va manbalari' },
      { id: 'M01.03', title: 'Axborot va raqamli texnologiyalar' },
      { id: 'M01.04', title: 'Axborotni kodlash' },
      { id: 'M01.05', title: 'Axborot o\'lchov birliklari' },
      { id: 'M01.06', title: 'Axborot hajmi va uzatish tezligi' },
      { id: 'M01.07', title: 'Matn, grafika, audio va videoni kodlash' },
      { id: 'M01.08', title: 'Raqamli axloq va mualliflik huquqi' },
      { id: 'M01.09', title: 'Axborotni saralash, tekshirish va xulosa chiqarish' },
    ],
  },
  {
    id: 'M02', code: 'M02',
    title: 'Kompyuter tizimlari va dasturiy muhit',
    description: 'Kompyuterlar rivojlanish tarixi, tuzilishi, ichki va tashqi qurilmalar, xotira, mobil qurilmalar, dasturiy ta\'minot turlari, operatsion tizimlar, fayl va papkalar.',
    section: 'specialty', examQuestionCount: 2,
    subtopics: [
      { id: 'M02.01', title: 'Kompyuterlarning rivojlanish tarixi' },
      { id: 'M02.02', title: 'Kompyuter tuzilishi va ichki qurilmalar' },
      { id: 'M02.03', title: 'Tashqi va qo\'shimcha qurilmalar' },
      { id: 'M02.04', title: 'Xotira va saqlash qurilmalari' },
      { id: 'M02.05', title: 'Mobil qurilmalar' },
      { id: 'M02.06', title: 'Dasturiy ta\'minot turlari' },
      { id: 'M02.07', title: 'Operatsion tizimlar' },
      { id: 'M02.08', title: 'Xizmat ko\'rsatuvchi dasturlar' },
      { id: 'M02.09', title: 'Fayl va papkalar' },
    ],
  },
  {
    id: 'M03', code: 'M03',
    title: 'Microsoft Office',
    description: 'Word interfeysi, formatlash, obyektlar; Excel formulalar, filtrlash, diagramma; PowerPoint dizayn, multimedia, animatsiya.',
    section: 'specialty', examQuestionCount: 5,
    subtopics: [
      { id: 'M03.01', title: 'Word interfeysi, yaratish va tahrirlash' },
      { id: 'M03.02', title: 'Word formatlash vositalari' },
      { id: 'M03.03', title: 'Word obyektlari' },
      { id: 'M03.04', title: 'Excel vazifalari va elementlari' },
      { id: 'M03.05', title: 'Excel formulalari va funksiyalari' },
      { id: 'M03.06', title: 'Excel filtrlash va saralash' },
      { id: 'M03.07', title: 'Excel diagramma va grafiklari' },
      { id: 'M03.08', title: 'PowerPoint interfeysi va dizayni' },
      { id: 'M03.09', title: 'PowerPoint obyektlari va multimedia' },
      { id: 'M03.10', title: 'Animatsiya va o\'tish effektlari' },
    ],
  },
  {
    id: 'M04', code: 'M04',
    title: 'Mantiqiy fikrlash va modellashtirish',
    description: 'Mantiq asoslari, mulohazalar, mantiqiy amallar va ifodalar, rostlik jadvallari, mantiqiy sxemalar, masalani kompyuterda yechish bosqichlari, model turlari.',
    section: 'specialty', examQuestionCount: 3,
    subtopics: [
      { id: 'M04.01', title: 'Mantiq asoslari va mulohazalar' },
      { id: 'M04.02', title: 'Mantiqiy amallar va ifodalar' },
      { id: 'M04.03', title: 'Rostlik jadvallari' },
      { id: 'M04.04', title: 'Mantiqiy sxemalar' },
      { id: 'M04.05', title: 'Masalani kompyuterda yechish bosqichlari' },
      { id: 'M04.06', title: 'Model va model turlari' },
    ],
  },
  {
    id: 'M05', code: 'M05',
    title: 'Sanoq sistemalari',
    description: 'Sanoq sistemalari asoslari, ular orasida o\'tkazish, turli sanoq sistemalarida arifmetik amallar.',
    section: 'specialty', examQuestionCount: 2,
    subtopics: [
      { id: 'M05.01', title: 'Sanoq sistemalari asoslari' },
      { id: 'M05.02', title: 'Sanoq sistemalari orasida o\'tkazish' },
      { id: 'M05.03', title: 'Turli sanoq sistemalarida arifmetika' },
    ],
  },
  {
    id: 'M06', code: 'M06',
    title: 'Algoritmlash',
    description: 'Algoritm tushunchasi, xossalari, turlari, blok-sxema va psevdokodda tasvirlash, algoritmni tekshirish va tahlil qilish.',
    section: 'specialty', examQuestionCount: 3,
    subtopics: [
      { id: 'M06.01', title: 'Algoritm tushunchasi va xossalari' },
      { id: 'M06.02', title: 'Algoritm turlari' },
      { id: 'M06.03', title: 'Algoritmni blok-sxema va psevdokodda tasvirlash' },
      { id: 'M06.04', title: 'Algoritmni tekshirish, tahlil qilish va eng maqbulini tanlash' },
    ],
  },
  {
    id: 'M07', code: 'M07',
    title: 'Scratch va LOGO',
    description: 'Scratch muhiti, sprayt va koordinatalar, bloklar, o\'zgaruvchi, shart va sikllar, Pen grafikasi, LOGO va Toshbaqa grafikasi.',
    section: 'specialty', examQuestionCount: 3,
    subtopics: [
      { id: 'M07.01', title: 'Scratch muhiti, sprayt va koordinatalar' },
      { id: 'M07.02', title: 'Scratch bloklari va hodisalar' },
      { id: 'M07.03', title: 'Scratch o\'zgaruvchi va ro\'yxatlari' },
      { id: 'M07.04', title: 'Scratch shart va sikllari' },
      { id: 'M07.05', title: 'Scratch Pen, shakl va animatsiya' },
      { id: 'M07.06', title: 'LOGO va Toshbaqa grafikasi' },
    ],
  },
  {
    id: 'M08', code: 'M08',
    title: 'Python va JavaScript',
    description: 'Dasturlash tillari, Python sintaksisi, o\'zgaruvchilar, operatorlar, shartlar, sikllar, funksiyalar, ro\'yxatlar, kutubxonalar, JavaScript asoslari.',
    section: 'specialty', examQuestionCount: 3,
    subtopics: [
      { id: 'M08.01', title: 'Dastur va dasturlash tillari' },
      { id: 'M08.02', title: 'Python sintaksisi va muhiti' },
      { id: 'M08.03', title: 'Python o\'zgaruvchilari va ma\'lumot turlari' },
      { id: 'M08.04', title: 'Python xatolari, operatorlari va satrlari' },
      { id: 'M08.05', title: 'Python shartlari' },
      { id: 'M08.06', title: 'Python sikllari' },
      { id: 'M08.07', title: 'Python funksiyalari va o\'zgaruvchi sohasi' },
      { id: 'M08.08', title: 'Python ro\'yxat va massivlari' },
      { id: 'M08.09', title: 'Python kutubxona, fayl, GUI va OOP' },
      { id: 'M08.10', title: 'Python va sun\'iy intellekt' },
      { id: 'M08.11', title: 'JavaScript sintaksisi va ma\'lumotlari' },
      { id: 'M08.12', title: 'JavaScript shart, sikl, funksiya va massivlari' },
    ],
  },
  {
    id: 'M09', code: 'M09',
    title: 'Ma\'lumotlar bazasi, MS Access va SQL',
    description: 'Ma\'lumotlar bazasi tushunchasi, jadvallar, kalitlar, MS Access forma va so\'rovlar, SQL SELECT, INSERT, UPDATE, DELETE.',
    section: 'specialty', examQuestionCount: 2,
    subtopics: [
      { id: 'M09.01', title: 'Ma\'lumotlar bazasi va MBBT' },
      { id: 'M09.02', title: 'Baza turlari, jadvallar va ma\'lumot turlari' },
      { id: 'M09.03', title: 'Kalitlar va jadvallarni bog\'lash' },
      { id: 'M09.04', title: 'MS Access forma, so\'rov va hisobotlari' },
      { id: 'M09.05', title: 'Import va eksport' },
      { id: 'M09.06', title: 'SQL SELECT, INSERT, UPDATE, DELETE' },
    ],
  },
  {
    id: 'M10', code: 'M10',
    title: 'Kompyuter grafikasi va media',
    description: 'Grafika turlari, rang modellari, Paint va Photoshop, 3D modellashtirish, animatsiya, audio va video tahrirlash.',
    section: 'specialty', examQuestionCount: 2,
    subtopics: [
      { id: 'M10.01', title: 'Grafika turlari, rang modellari va formatlar' },
      { id: 'M10.02', title: 'Paint va Photoshop interfeysi' },
      { id: 'M10.03', title: 'Belgilash, kesish, rang va qatlamlar' },
      { id: 'M10.04', title: 'Matn, foto va rasmlarni tahrirlash' },
      { id: 'M10.05', title: '3D modellashtirish' },
      { id: 'M10.06', title: 'Animatsiya va Adobe Animate' },
      { id: 'M10.07', title: 'Audio va video tahrirlash' },
    ],
  },
  {
    id: 'M11', code: 'M11',
    title: 'HTML va CSS',
    description: 'Veb va HTML asoslari, matn, ro\'yxat, rasm, jadval, forma, havola, iframe, CSS asoslari, ranglar, matn, bloklar, veb-sayt loyihalash.',
    section: 'specialty', examQuestionCount: 3,
    subtopics: [
      { id: 'M11.01', title: 'Veb va HTML asoslari' },
      { id: 'M11.02', title: 'HTML matn, fon, ro\'yxat va rasm' },
      { id: 'M11.03', title: 'HTML jadval va forma' },
      { id: 'M11.04', title: 'HTML havola, iframe, audio va video' },
      { id: 'M11.05', title: 'CSS asoslari va ranglar' },
      { id: 'M11.06', title: 'CSS matn, ro\'yxat, blok, jadval va forma' },
      { id: 'M11.07', title: 'Veb-sayt loyihalash va tekshirish' },
    ],
  },
  {
    id: 'M12', code: 'M12',
    title: 'Kompyuter tarmoqlari va internet',
    description: 'Tarmoq tushunchasi, turlari, komponentlar, arxitektura, topologiyalar, IP manzil, internet, brauzer, elektron pochta, bulutli texnologiyalar, IoT.',
    section: 'specialty', examQuestionCount: 2,
    subtopics: [
      { id: 'M12.01', title: 'Tarmoq tushunchasi va turlari' },
      { id: 'M12.02', title: 'Komponentlar, qurilmalar va aloqa vositalari' },
      { id: 'M12.03', title: 'Arxitektura va topologiyalar' },
      { id: 'M12.04', title: 'Tarmoq ishlash prinsipi' },
      { id: 'M12.05', title: 'IP manzil, maska va tarmoq hisobi' },
      { id: 'M12.06', title: 'Internet, brauzer va qidiruv' },
      { id: 'M12.07', title: 'Elektron pochta' },
      { id: 'M12.08', title: 'Bulutli texnologiyalar' },
      { id: 'M12.09', title: 'IoT, VR, AR va mobil texnologiyalar' },
    ],
  },
  {
    id: 'M13', code: 'M13',
    title: 'Axborot xavfsizligi va raqamli xizmatlar',
    description: 'Axborot xavfsizligi tahdidlari, zararli dasturlar, antivirus, shifrlash, elektron imzo, elektron tijorat, SMM, CMS, LMS.',
    section: 'specialty', examQuestionCount: 2,
    subtopics: [
      { id: 'M13.01', title: 'Axborot xavfsizligi tahdidlari' },
      { id: 'M13.02', title: 'Zararli dastur va phishing' },
      { id: 'M13.03', title: 'Antivirus va himoya vositalari' },
      { id: 'M13.04', title: 'Zaxiralash va shifrlash' },
      { id: 'M13.05', title: 'Elektron imzo, hujjat va hukumat' },
      { id: 'M13.06', title: 'Elektron tijorat, to\'lov va blockchain' },
      { id: 'M13.07', title: 'SMM va auditoriya' },
      { id: 'M13.08', title: 'CMS' },
      { id: 'M13.09', title: 'LMS' },
      { id: 'M13.10', title: 'MOOC' },
      { id: 'M13.11', title: 'Web-freelance' },
    ],
  },
  {
    id: 'M14', code: 'M14',
    title: 'Kasb standarti',
    description: 'O\'quv jarayonini rejalashtirish, ta\'lim samaradorligi, baholash, tarbiyaviy faoliyat, xavfsiz muhit, kasbiy o\'sish, hamkorlik.',
    section: 'professional_standard', examQuestionCount: 5,
    subtopics: [
      { id: 'M14.01', title: 'O\'quv jarayonini rejalashtirish' },
      { id: 'M14.02', title: 'Ta\'lim samaradorligini ta\'minlash' },
      { id: 'M14.03', title: 'Baholash va qayta aloqa' },
      { id: 'M14.04', title: 'Tarbiyaviy faoliyat' },
      { id: 'M14.05', title: 'Xavfsiz rivojlantiruvchi muhit' },
      { id: 'M14.06', title: 'Kasbiy o\'sish' },
      { id: 'M14.07', title: 'Hamkasb va ota-onalar bilan hamkorlik' },
    ],
  },
  {
    id: 'M15', code: 'M15',
    title: 'Umumiy pedagogika',
    description: 'Pedagogika, didaktika, yosh psixologiyasi, ta\'lim tamoyillari, tarbiya turlari, dars turlari, sinf boshqaruvi, pedagogik etika.',
    section: 'pedagogy', examQuestionCount: 7,
    subtopics: [
      { id: 'M15.01', title: 'Pedagogika, didaktika va yosh psixologiyasi' },
      { id: 'M15.02', title: 'Ta\'lim tamoyillari' },
      { id: 'M15.03', title: 'Tarbiya va uning turlari' },
      { id: 'M15.04', title: 'Dars turlari, rejalashtirish va sinfni boshqarish' },
      { id: 'M15.05', title: 'Sinf rahbari va ota-onalar bilan ish' },
      { id: 'M15.06', title: 'Pedagogik etika, nutq va refleksiya' },
      { id: 'M15.07', title: 'Pedagogik qobiliyatlar' },
      { id: 'M15.08', title: 'Ta\'lim texnologiyalari' },
    ],
  },
  {
    id: 'M16', code: 'M16',
    title: 'Informatika o\'qitish metodikasi',
    description: 'Fan mazmunini o\'qitish yondashuvlari, o\'qitish usul va metodlari, ta\'limiy vaziyatdagi qarorlarni baholash.',
    section: 'methodology', examQuestionCount: 3,
    subtopics: [
      { id: 'M16.01', title: 'Fan mazmunini o\'qitish yondashuvlari' },
      { id: 'M16.02', title: 'O\'qitish usul va metodlari' },
      { id: 'M16.03', title: 'Ta\'limiy vaziyatdagi qarorlarni baholash' },
    ],
  },
]

export const BLUEPRINT = {
  totalQuestions: 50,
  durationMinutes: 120,
  pointsPerQuestion: 2,
  maxPoints: 100,
  sections: {
    specialty: { label: 'Informatika mutaxassisligi', count: 35 },
    professional_standard: { label: 'Kasb standarti', count: 5 },
    pedagogy: { label: 'Umumiy pedagogika', count: 7 },
    methodology: { label: 'Informatika o\'qitish metodikasi', count: 3 },
  } as const,
  cognitive: {
    knowledge: 8,
    application: 35,
    reasoning: 7,
  } as const,
  moduleQuestionCount: {
    M01: 3, M02: 2, M03: 5, M04: 3, M05: 2,
    M06: 3, M07: 3, M08: 3, M09: 2, M10: 2,
    M11: 3, M12: 2, M13: 2, M14: 5, M15: 7, M16: 3,
  } as const,
} as const

export function getModuleByCode(code: string): Module | undefined {
  return MODULES.find(m => m.code === code)
}

export function getSubtopicById(id: string): (Subtopic & { moduleCode: string }) | undefined {
  for (const mod of MODULES) {
    const st = mod.subtopics.find(s => s.id === id)
    if (st) return { ...st, moduleCode: mod.code }
  }
  return undefined
}
