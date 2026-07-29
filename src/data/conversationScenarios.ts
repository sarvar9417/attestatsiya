// ═══════════════════════════════════════════════════════════════════════════
// AI Suhbat Hamrohi — real hayotiy stsenariylar (roleplay).
// Foydalanuvchi Claude bilan real vaziyatda rol o'ynaydi: Claude bir personaj,
// foydalanuvchi — o'zi. Maqsadga erishishi kerak. Oxirida AI hisobot beradi.
// ═══════════════════════════════════════════════════════════════════════════

export interface ConversationScenario {
  id:        string
  emoji:     string
  title:     string          // inglizcha sarlavha
  titleUz:   string          // o'zbekcha
  category:  'kundalik' | 'sayohat' | 'ish' | 'ijtimoiy'
  /** AI qaysi rolni o'ynaydi (masalan: "a friendly waiter") */
  aiRole:    string
  /** Foydalanuvchining vaziyatdagi roli */
  userRole:  string
  /** Foydalanuvchining maqsadi (o'zbekcha — UI da ko'rsatiladi) */
  goalUz:    string
  /** Suhbatning birinchi vaziyati (Claude shu yerdan boshlaydi) */
  opening:   string
  /** Foydalanuvchiga yordam: foydali iboralar */
  hints:     string[]
  /** Minimal tavsiya etilgan daraja */
  minLevel:  'A1' | 'A2' | 'B1' | 'B2'
}

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: 'restaurant',
    emoji: '🍽️',
    title: 'Ordering at a Restaurant',
    titleUz: 'Restoranda buyurtma berish',
    category: 'kundalik',
    aiRole: 'a friendly, patient waiter at a nice restaurant',
    userRole: 'a customer who wants to order a meal',
    goalUz: "Stol so'rang, menyuni ko'ring, ovqat va ichimlik buyurtma qiling, hisobni so'rang.",
    opening: "Good evening! Welcome to our restaurant. Do you have a reservation, or would you like a table for how many?",
    hints: ["I'd like a table for two, please.", "Could I see the menu?", "I'll have the...", "Can I get the bill, please?"],
    minLevel: 'A1',
  },
  {
    id: 'coffee-shop',
    emoji: '☕',
    title: 'At the Coffee Shop',
    titleUz: 'Kafeda',
    category: 'kundalik',
    aiRole: 'a cheerful barista at a busy coffee shop',
    userRole: 'a customer ordering a drink and a snack',
    goalUz: "Ichimlik buyurtma qiling, hajmini tanlang, narxini so'rang, to'lang.",
    opening: "Hi there! What can I get started for you today?",
    hints: ["Can I have a medium latte, please?", "How much is that?", "Do you have any pastries?", "I'll pay by card."],
    minLevel: 'A1',
  },
  {
    id: 'shopping',
    emoji: '🛍️',
    title: 'Shopping for Clothes',
    titleUz: 'Kiyim xarid qilish',
    category: 'kundalik',
    aiRole: 'a helpful shop assistant in a clothing store',
    userRole: 'a customer looking for a specific item of clothing',
    goalUz: "Kiyim toping, o'lcham va rang so'rang, kiyib ko'ring, narxini bilib oling.",
    opening: "Hello! Welcome in. Are you looking for anything in particular today?",
    hints: ["I'm looking for a jacket.", "Do you have this in a larger size?", "Can I try it on?", "How much does it cost?"],
    minLevel: 'A2',
  },
  {
    id: 'airport',
    emoji: '✈️',
    title: 'At the Airport Check-in',
    titleUz: 'Aeroportda ro\'yxatdan o\'tish',
    category: 'sayohat',
    aiRole: 'a professional airline check-in agent',
    userRole: 'a passenger checking in for an international flight',
    goalUz: "Reysga ro'yxatdan o'ting, chemodaningizni topshiring, o'rindiq tanlang, chiqish darvozasini so'rang.",
    opening: "Good morning! May I see your passport and ticket, please? Where are you flying to today?",
    hints: ["I'm flying to London.", "I'd like a window seat, please.", "I have one bag to check in.", "Which gate is it?"],
    minLevel: 'A2',
  },
  {
    id: 'hotel',
    emoji: '🏨',
    title: 'Checking into a Hotel',
    titleUz: 'Mehmonxonaga joylashish',
    category: 'sayohat',
    aiRole: 'a polite hotel receptionist',
    userRole: 'a guest with a reservation checking in',
    goalUz: "Bron qilingan xonangizni oling, narx va nonushtani aniqlang, Wi-Fi va xona haqida so'rang.",
    opening: "Welcome to the Grand Hotel! Do you have a reservation with us?",
    hints: ["I have a reservation under...", "Is breakfast included?", "What time is check-out?", "Could I have the Wi-Fi password?"],
    minLevel: 'A2',
  },
  {
    id: 'doctor',
    emoji: '🩺',
    title: 'At the Doctor\'s',
    titleUz: 'Shifokorda',
    category: 'kundalik',
    aiRole: 'a kind, careful doctor at a clinic',
    userRole: 'a patient who is feeling unwell',
    goalUz: "Shikoyatingizni tushuntiring, savollarga javob bering, maslahat va retsept oling.",
    opening: "Hello, please come in and have a seat. So, what seems to be the problem today?",
    hints: ["I have a headache and a sore throat.", "It started two days ago.", "Is it serious?", "What should I do?"],
    minLevel: 'B1',
  },
  {
    id: 'taxi',
    emoji: '🚕',
    title: 'Taking a Taxi',
    titleUz: 'Taksida',
    category: 'sayohat',
    aiRole: 'a chatty taxi driver',
    userRole: 'a passenger going to a specific destination',
    goalUz: "Manzilni ayting, narxni so'rang, yo'lda suhbatlashing, to'lang.",
    opening: "Hop in! Where are you headed today?",
    hints: ["Could you take me to the city centre, please?", "How long will it take?", "How much will it be?", "You can stop here, thanks."],
    minLevel: 'A2',
  },
  {
    id: 'job-interview',
    emoji: '💼',
    title: 'A Job Interview',
    titleUz: 'Ish suhbati',
    category: 'ish',
    aiRole: 'a professional but friendly hiring manager',
    userRole: 'a candidate interviewing for a job you want',
    goalUz: "O'zingizni tanishtiring, tajribangiz haqida gapiring, savollar bering, ishni oling!",
    opening: "Thanks for coming in today. Please, take a seat. To start, could you tell me a little about yourself?",
    hints: ["I have three years of experience in...", "My biggest strength is...", "Why is this role available?", "When can I expect to hear back?"],
    minLevel: 'B1',
  },
  {
    id: 'making-friends',
    emoji: '🤝',
    title: 'Making a New Friend',
    titleUz: 'Yangi do\'st orttirish',
    category: 'ijtimoiy',
    aiRole: 'a friendly person at a social event who wants to chat',
    userRole: 'someone meeting a new person for the first time',
    goalUz: "Tanishing, qiziqishlaringiz haqida gapiring, savollar bering, aloqa almashing.",
    opening: "Hi! I don't think we've met. I'm Alex — are you enjoying the party?",
    hints: ["Nice to meet you, I'm...", "What do you do?", "I'm really into...", "We should keep in touch!"],
    minLevel: 'A2',
  },
]

export function getScenario(id: string): ConversationScenario | undefined {
  return CONVERSATION_SCENARIOS.find(s => s.id === id)
}
