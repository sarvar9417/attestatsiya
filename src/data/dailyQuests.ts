export interface QuestTask {
  type: 'lesson' | 'vocabulary' | 'reading' | 'writing' | 'speaking' | 'listening' | 'drill'
  count: number
  label: string
}

export interface DailyQuest {
  dayRange: [number, number]
  mainQuest: { narrative: string; task: QuestTask; xpReward: number }
  sideQuest: { narrative: string; task: QuestTask; xpReward: number }
  challenge:  { narrative: string; task: QuestTask; xpReward: number }
}

export const DAILY_QUESTS: DailyQuest[] = [
  {
    dayRange: [1, 4],
    mainQuest:  { narrative: "Bugun ingliz tilini birinchi marta o'rganasiz.", task: { type: 'lesson', count: 1, label: 'Birinchi darsni tugatish' }, xpReward: 50 },
    sideQuest:  { narrative: "Yangi so'zlar eslab qolish.", task: { type: 'vocabulary', count: 5, label: "5 ta so'z o'rganish" }, xpReward: 20 },
    challenge:  { narrative: "Grammatikani sinab ko'rish.", task: { type: 'drill', count: 10, label: '10 ta mashq bajarish' }, xpReward: 30 },
  },
  {
    dayRange: [5, 8],
    mainQuest:  { narrative: "Endi oddiy gaplar tuza boshladingiz.", task: { type: 'lesson', count: 1, label: 'Navbatdagi darsni olish' }, xpReward: 50 },
    sideQuest:  { narrative: "Eshitish qobiliyatini rivojlantirish.", task: { type: 'listening', count: 1, label: '1 ta listening bajarish' }, xpReward: 20 },
    challenge:  { narrative: "Ko'proq so'z o'rganish.", task: { type: 'vocabulary', count: 10, label: "10 ta so'z o'rganish" }, xpReward: 30 },
  },
  {
    dayRange: [9, 12],
    mainQuest:  { narrative: "Endi o'zingiz haqingizda gapira olasiz.", task: { type: 'lesson', count: 1, label: 'Darsni tugatish' }, xpReward: 55 },
    sideQuest:  { narrative: "O'qish ko'nikmasini mustahkamlash.", task: { type: 'reading', count: 1, label: '1 ta matn o\'qish' }, xpReward: 25 },
    challenge:  { narrative: "Grammatikani chuqurlashtirish.", task: { type: 'drill', count: 15, label: '15 ta mashq bajarish' }, xpReward: 35 },
  },
  {
    dayRange: [13, 16],
    mainQuest:  { narrative: "Yangi mavzu bilan tanishyapsiz.", task: { type: 'lesson', count: 1, label: 'Yangi darsni boshlash' }, xpReward: 55 },
    sideQuest:  { narrative: "Yozma mashq qilish.", task: { type: 'writing', count: 1, label: '1 ta writing bajarish' }, xpReward: 25 },
    challenge:  { narrative: "So'z boyligini oshirish.", task: { type: 'vocabulary', count: 15, label: "15 ta so'z o'rganish" }, xpReward: 35 },
  },
  {
    dayRange: [17, 20],
    mainQuest:  { narrative: "Birinchi haftalik testga tayyorsiz.", task: { type: 'lesson', count: 1, label: 'Review darsini tugatish' }, xpReward: 60 },
    sideQuest:  { narrative: "Gapirishni mashq qilish.", task: { type: 'speaking', count: 1, label: '1 ta speaking mashqi' }, xpReward: 25 },
    challenge:  { narrative: "Eshitishni yaxshilash.", task: { type: 'listening', count: 2, label: '2 ta listening bajarish' }, xpReward: 40 },
  },
  {
    dayRange: [21, 24],
    mainQuest:  { narrative: "O'zingizni ishonchli his qilyapsiz.", task: { type: 'lesson', count: 1, label: "Haftaning birinchi darsi" }, xpReward: 60 },
    sideQuest:  { narrative: "So'zlarni takrorlash.", task: { type: 'vocabulary', count: 10, label: "10 ta eski so'zni takrorlash" }, xpReward: 20 },
    challenge:  { narrative: "Mashqlarni ko'paytirish.", task: { type: 'drill', count: 20, label: '20 ta mashq bajarish' }, xpReward: 40 },
  },
  {
    dayRange: [25, 28],
    mainQuest:  { narrative: "B1 darajasiga yaqinlashyapsiz.", task: { type: 'lesson', count: 1, label: 'Murakkab darsni tugatish' }, xpReward: 65 },
    sideQuest:  { narrative: "Writing ko'nikmasini oshirish.", task: { type: 'writing', count: 1, label: '1 ta writing bajarish' }, xpReward: 30 },
    challenge:  { narrative: "Ko'p o'qish.", task: { type: 'reading', count: 2, label: '2 ta matn o\'qish' }, xpReward: 40 },
  },
  {
    dayRange: [29, 33],
    mainQuest:  { narrative: "B1 ga yetdingiz! Endi murakkab grammatika.", task: { type: 'lesson', count: 1, label: 'B1 darsini boshlash' }, xpReward: 70 },
    sideQuest:  { narrative: "Gapirishni davom ettirish.", task: { type: 'speaking', count: 1, label: '1 ta speaking mashqi' }, xpReward: 30 },
    challenge:  { narrative: "So'z boyligini B1 darajasiga ko'tarish.", task: { type: 'vocabulary', count: 20, label: "20 ta B1 so'z o'rganish" }, xpReward: 45 },
  },
  {
    dayRange: [34, 37],
    mainQuest:  { narrative: "Conditionals ni o'rganyapsiz.", task: { type: 'lesson', count: 1, label: 'Conditionals darsini tugatish' }, xpReward: 70 },
    sideQuest:  { narrative: "Listeningni mustahkamlash.", task: { type: 'listening', count: 1, label: "1 ta B1 listening" }, xpReward: 30 },
    challenge:  { narrative: "Grammatikani chuqur o'rganish.", task: { type: 'drill', count: 25, label: '25 ta mashq bajarish' }, xpReward: 45 },
  },
  {
    dayRange: [38, 41],
    mainQuest:  { narrative: "Passive voice ni o'rganyapsiz.", task: { type: 'lesson', count: 1, label: 'Passive voice darsi' }, xpReward: 75 },
    sideQuest:  { narrative: "Yozishni mashq qilish.", task: { type: 'writing', count: 1, label: '1 ta essay yozish' }, xpReward: 35 },
    challenge:  { narrative: "O'qish va tahlil qilish.", task: { type: 'reading', count: 2, label: '2 ta B1 matn o\'qish' }, xpReward: 45 },
  },
  {
    dayRange: [42, 45],
    mainQuest:  { narrative: "Reported speech ni o'zlashtiryapsiz.", task: { type: 'lesson', count: 1, label: 'Reported speech darsi' }, xpReward: 75 },
    sideQuest:  { narrative: "Eski so'zlarni takrorlash.", task: { type: 'vocabulary', count: 15, label: "15 ta so'zni takrorlash" }, xpReward: 25 },
    challenge:  { narrative: "Speaking amaliyoti.", task: { type: 'speaking', count: 2, label: '2 ta speaking mashqi' }, xpReward: 50 },
  },
  {
    dayRange: [46, 49],
    mainQuest:  { narrative: "Yo'lning yarmiga yetdingiz!", task: { type: 'lesson', count: 1, label: 'Review darsini tugatish' }, xpReward: 80 },
    sideQuest:  { narrative: "Listeningni oshirish.", task: { type: 'listening', count: 2, label: '2 ta listening bajarish' }, xpReward: 35 },
    challenge:  { narrative: "Mashqlarni ko'paytirish.", task: { type: 'drill', count: 30, label: '30 ta mashq bajarish' }, xpReward: 55 },
  },
  {
    dayRange: [50, 53],
    mainQuest:  { narrative: "B1+ ga ko'tarilyapsiz.", task: { type: 'lesson', count: 1, label: "B1+ darsini boshlash" }, xpReward: 80 },
    sideQuest:  { narrative: "Writingni rivojlantirish.", task: { type: 'writing', count: 1, label: '1 ta argumentative essay' }, xpReward: 40 },
    challenge:  { narrative: "So'z boyligini kengaytirish.", task: { type: 'vocabulary', count: 20, label: "20 ta B1+ so'z o'rganish" }, xpReward: 55 },
  },
  {
    dayRange: [54, 57],
    mainQuest:  { narrative: "Murakkab grammar tuzilmalarni o'rganyapsiz.", task: { type: 'lesson', count: 1, label: 'Grammar deep dive darsi' }, xpReward: 85 },
    sideQuest:  { narrative: "Speaking mashqi.", task: { type: 'speaking', count: 1, label: '1 ta speaking mashqi' }, xpReward: 35 },
    challenge:  { narrative: "Reading comprehension.", task: { type: 'reading', count: 2, label: '2 ta B1+ matn o\'qish' }, xpReward: 55 },
  },
  {
    dayRange: [58, 61],
    mainQuest:  { narrative: "Conditional va wish gaplarni o'rganyapsiz.", task: { type: 'lesson', count: 1, label: 'Wish/if only darsi' }, xpReward: 85 },
    sideQuest:  { narrative: "Listeningni oshirish.", task: { type: 'listening', count: 2, label: '2 ta murakkab listening' }, xpReward: 35 },
    challenge:  { narrative: "Grammatik drill.", task: { type: 'drill', count: 30, label: '30 ta mashq bajarish' }, xpReward: 60 },
  },
  {
    dayRange: [62, 65],
    mainQuest:  { narrative: "Writing workshopda qatnashyapsiz.", task: { type: 'lesson', count: 1, label: 'Writing workshop darsi' }, xpReward: 90 },
    sideQuest:  { narrative: "So'zlarni mustahkamlash.", task: { type: 'vocabulary', count: 15, label: "15 ta so'zni takrorlash" }, xpReward: 30 },
    challenge:  { narrative: "Essay yozish.", task: { type: 'writing', count: 2, label: '2 ta writing bajarish' }, xpReward: 65 },
  },
  {
    dayRange: [66, 69],
    mainQuest:  { narrative: "Mock testga tayyorlanyapsiz.", task: { type: 'lesson', count: 1, label: 'Mock test prep darsi' }, xpReward: 90 },
    sideQuest:  { narrative: "Speaking amaliyoti.", task: { type: 'speaking', count: 2, label: '2 ta speaking mashqi' }, xpReward: 40 },
    challenge:  { narrative: "Ko'p o'qish.", task: { type: 'reading', count: 3, label: '3 ta matn o\'qish' }, xpReward: 65 },
  },
  {
    dayRange: [70, 73],
    mainQuest:  { narrative: "B2 ga yaqinsiz! Inversions ni o'rganyapsiz.", task: { type: 'lesson', count: 1, label: 'Inversions darsi' }, xpReward: 95 },
    sideQuest:  { narrative: "Listeningni mukammallashtirish.", task: { type: 'listening', count: 2, label: '2 ta advanced listening' }, xpReward: 40 },
    challenge:  { narrative: "Grammatik drill.", task: { type: 'drill', count: 35, label: '35 ta mashq bajarish' }, xpReward: 70 },
  },
  {
    dayRange: [74, 77],
    mainQuest:  { narrative: "Subjunctive mood ni o'rganyapsiz.", task: { type: 'lesson', count: 1, label: 'Subjunctive mood darsi' }, xpReward: 95 },
    sideQuest:  { narrative: "Writing murakkab mavzularda.", task: { type: 'writing', count: 1, label: '1 ta B2 essay' }, xpReward: 45 },
    challenge:  { narrative: "Speaking fluently.", task: { type: 'speaking', count: 2, label: '2 ta fluent speaking' }, xpReward: 70 },
  },
  {
    dayRange: [78, 81],
    mainQuest:  { narrative: "B2 darajasiga yaqinlashdingiz!", task: { type: 'lesson', count: 1, label: 'B2 darsini boshlash' }, xpReward: 100 },
    sideQuest:  { narrative: "So'z boyligini B2 ga ko'tarish.", task: { type: 'vocabulary', count: 20, label: "20 ta B2 so'z o'rganish" }, xpReward: 35 },
    challenge:  { narrative: "Reading advanced texts.", task: { type: 'reading', count: 2, label: '2 ta B2 matn o\'qish' }, xpReward: 75 },
  },
  {
    dayRange: [82, 85],
    mainQuest:  { narrative: "Advanced grammar ni o'zlashtiryapsiz.", task: { type: 'lesson', count: 1, label: 'Advanced grammar darsi' }, xpReward: 100 },
    sideQuest:  { narrative: "Listening natives.", task: { type: 'listening', count: 2, label: '2 ta native listening' }, xpReward: 40 },
    challenge:  { narrative: "Mashqlarni eng yuqori darajada.", task: { type: 'drill', count: 40, label: '40 ta mashq bajarish' }, xpReward: 80 },
  },
  {
    dayRange: [86, 89],
    mainQuest:  { narrative: "Final sprintga tayyorsiz.", task: { type: 'lesson', count: 1, label: 'Final sprint darsi' }, xpReward: 110 },
    sideQuest:  { narrative: "Writing final essay.", task: { type: 'writing', count: 1, label: '1 ta final essay' }, xpReward: 50 },
    challenge:  { narrative: "Speaking final practice.", task: { type: 'speaking', count: 2, label: '2 ta final speaking' }, xpReward: 85 },
  },
  {
    dayRange: [90, 96],
    mainQuest:  { narrative: "B1+ ni yakunlayapsiz — professional til mustahkamlanmoqda.", task: { type: 'lesson', count: 1, label: 'B1+ yakuniy darsi' }, xpReward: 115 },
    sideQuest:  { narrative: "Professional lug'atni mustahkamlash.", task: { type: 'vocabulary', count: 20, label: "20 ta B1+ so'z" }, xpReward: 45 },
    challenge:  { narrative: "Yig'ilish va prezentatsiya amaliyoti.", task: { type: 'speaking', count: 2, label: '2 ta speaking' }, xpReward: 85 },
  },
  {
    dayRange: [97, 104],
    mainQuest:  { narrative: "B2 boshlandi! Murakkab muhokamalar va akademik til.", task: { type: 'lesson', count: 1, label: 'B2 darsi' }, xpReward: 120 },
    sideQuest:  { narrative: "Akademik so'z boyligini oshirish.", task: { type: 'vocabulary', count: 20, label: "20 ta B2 so'z" }, xpReward: 50 },
    challenge:  { narrative: "Argumentli yozish amaliyoti.", task: { type: 'writing', count: 1, label: '1 ta argumentli matn' }, xpReward: 60 },
  },
  {
    dayRange: [105, 112],
    mainQuest:  { narrative: "B2 — murakkab grammatik tuzilmalarni egallayapsiz.", task: { type: 'lesson', count: 1, label: 'B2 grammatika darsi' }, xpReward: 125 },
    sideQuest:  { narrative: "Idiomalar va kollokatsiyalar.", task: { type: 'vocabulary', count: 20, label: "20 ta ibora" }, xpReward: 50 },
    challenge:  { narrative: "Murakkab mavzularda gapirish.", task: { type: 'speaking', count: 2, label: '2 ta speaking' }, xpReward: 90 },
  },
  {
    dayRange: [113, 120],
    mainQuest:  { narrative: "B2 — akademik mahoratni sayqallayapsiz.", task: { type: 'lesson', count: 1, label: 'B2 darsi' }, xpReward: 125 },
    sideQuest:  { narrative: "Tinglab tushunish amaliyoti.", task: { type: 'listening', count: 1, label: '1 ta listening' }, xpReward: 45 },
    challenge:  { narrative: "Esse yozish — IELTS uslubida.", task: { type: 'writing', count: 1, label: '1 ta esse' }, xpReward: 70 },
  },
  {
    dayRange: [121, 125],
    mainQuest:  { narrative: "Yakuniy sprint! B2 imtihoniga tayyorgarlik.", task: { type: 'lesson', count: 1, label: 'B2 takror darsi' }, xpReward: 130 },
    sideQuest:  { narrative: "Barcha qiyin so'zlarni takrorlash.", task: { type: 'vocabulary', count: 25, label: "25 ta so'z" }, xpReward: 55 },
    challenge:  { narrative: "Final speaking amaliyoti.", task: { type: 'speaking', count: 3, label: '3 ta speaking' }, xpReward: 95 },
  },
  {
    dayRange: [126, 126],
    mainQuest:  { narrative: "126 kun yakunlandi! B2 imtihoniga tayyorsiz! 🎉", task: { type: 'lesson', count: 1, label: "Yakuniy darsni tugatish" }, xpReward: 200 },
    sideQuest:  { narrative: "Barcha so'zlarni yakuniy takrorlash.", task: { type: 'vocabulary', count: 30, label: "30 ta so'zni takrorlash" }, xpReward: 50 },
    challenge:  { narrative: "Final mock test.", task: { type: 'drill', count: 50, label: '50 ta yakuniy mashq' }, xpReward: 100 },
  },
]

export function getTodayQuest(day: number): DailyQuest {
  return DAILY_QUESTS.find(q => day >= q.dayRange[0] && day <= q.dayRange[1])
    ?? DAILY_QUESTS[0]
}
