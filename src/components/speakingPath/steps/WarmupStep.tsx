// Speaking Path — Qadam 1: Warm-up (qisqa tayyorgarlik)
// Reja: docs/speaking-path-roadmap.md (3.1-bo'lim)
// ListenStep dan oldin: kun mavzusiga kirish, savol bilan tayyorlash

import { Clock, Zap, Volume2 } from 'lucide-react'
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis'
import type { SpeakingDay } from '../../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  onNext: () => void
}

/** Each pattern: keywords to match -> warm-up content */
const WARMUP_PATTERNS = [
  { keywords: ['introduction', 'meet', 'name', 'hello', 'greeting'], emoji: '👋', question: 'O\'zingizni ingliz tilida tanishtira olasizmi?', tip: 'Ism, yosh va qayerdanligingizni ayting — bugun aynan shuni o\'rganamiz!' },
  { keywords: ['age', 'old', 'year'], emoji: '🎂', question: 'Yoshingizni ingliz tilida ayta olasizmi?', tip: 'Raqamlar va yosh haqida gapirishni o\'rganamiz — kundalik hayotda eng kerakli mavzu!' },
  { keywords: ['family', 'mother', 'father', 'parent', 'sister', 'brother'], emoji: '👨‍👩‍👧‍👦', question: 'Oilangiz haqida ingliz tilida gapira olasizmi?', tip: 'Oila a\'zolarining ismlarini va ular haqida gapirishni o\'rganamiz.' },
  { keywords: ['order', 'coffee', 'tea', 'restaurant', 'cafe', 'food', 'drink', 'menu', 'eat'], emoji: '☕', question: 'Kafeda ingliz tilida buyurtma bera olasizmi?', tip: 'Qahva, choy yoki ovqat buyurtma qilishni o\'rganamiz — sayohatda eng kerakli narsa!' },
  { keywords: ['direction', 'lost', 'street', 'map', 'way', 'turn', 'straight'], emoji: '🗺️', question: 'Yo\'l so\'rash va ko\'rsatishni bilasizmi?', tip: 'Ko\'chada yo\'nalishni so\'rash va tushunish — sayohat qilganingizda eng muhim ko\'nikma!' },
  { keywords: ['shop', 'buy', 'price', 'size', 'clothes', 'store', 'market'], emoji: '🛍️', question: 'Do\'konda ingliz tilida muloqot qila olasizmi?', tip: 'Narx so\'rash, o\'lcham tanlash va xarid qilishni o\'rganamiz.' },
  { keywords: ['weather', 'rain', 'sun', 'cold', 'hot', 'season', 'temperature'], emoji: '🌤️', question: 'Ob-havo haqida ingliz tilida gapira olasizmi?', tip: 'Ob-havo — inglizlarning eng sevimli suhbat mavzusi!' },
  { keywords: ['time', 'clock', 'late', 'hour', 'minute', 'schedule', 'appointment'], emoji: '⏰', question: 'Vaqtni ingliz tilida ayta olasizmi?', tip: 'Soat necha ekanligini aytish va uchrashuv belgilashni o\'rganamiz.' },
  { keywords: ['hobby', 'interest', 'free time', 'like', 'enjoy', 'sport', 'game'], emoji: '🎮', question: 'Sevimli mashg\'ulotingiz haqida gapira olasizmi?', tip: 'Qiziqishlar va hobbi haqida suhbatlashishni o\'rganamiz.' },
  { keywords: ['travel', 'trip', 'visit', 'holiday', 'vacation', 'tourist', 'abroad'], emoji: '✈️', question: 'Sayohat haqida ingliz tilida gapira olasizmi?', tip: 'Sayohat, mehmonxona va transport haqida suhbatlashishni o\'rganamiz.' },
  { keywords: ['health', 'doctor', 'hospital', 'pain', 'sick', 'medicine', 'pharmacy'], emoji: '🏥', question: 'Shifokor bilan ingliz tilida gaplasha olasizmi?', tip: 'Sog\'liq va shifokor bilan muloqot qilishni o\'rganamiz — favqulodda vaziyatda kerak!' },
  { keywords: ['job', 'work', 'profession', 'career', 'office', 'interview', 'meeting'], emoji: '💼', question: 'Ishingiz haqida ingliz tilida gapira olasizmi?', tip: 'Kasb va ish haqida suhbatlashish — ish topishda eng muhim ko\'nikma!' },
  { keywords: ['opinion', 'think', 'agree', 'disagree', 'believe', 'view', 'discuss'], emoji: '💭', question: 'Fikringizni ingliz tilida bildira olasizmi?', tip: 'Fikr bildirish, rozilik va e\'tirozni ifodalashni o\'rganamiz.' },
  { keywords: ['small talk', 'chat', 'conversation', 'talk', 'neighbour', 'neighbor'], emoji: '💬', question: 'Kichik suhbat (small talk) qila olasizmi?', tip: 'Qo\'shnilar va tanishlar bilan kundalik suhbatlashishni o\'rganamiz.' },
  { keywords: ['story', 'tell', 'happen', 'experience', 'event', 'remember'], emoji: '📖', question: 'Voqealarni ingliz tilida hikoya qila olasizmi?', tip: 'O\'tgan voqealarni hikoya qilishni o\'rganamiz — eng qiziqarli ko\'nikma!' },
  { keywords: ['advice', 'recommend', 'should', 'suggest', 'tip'], emoji: '💡', question: 'Maslahat bera olasizmi?', tip: 'Maslahat berish va tavsiya qilishni o\'rganamiz.' },
  { keywords: ['future', 'plan', 'hope', 'wish', 'dream', 'goal'], emoji: '🔮', question: 'Kelajak rejalaringiz haqida gapira olasizmi?', tip: 'Kelajak haqida gapirish va rejalar tuzishni o\'rganamiz.' },
  { keywords: ['past', 'yesterday', 'ago', 'memory', 'childhood'], emoji: '📅', question: 'O\'tgan voqealarni ingliz tilida tasvirlay olasizmi?', tip: 'O\'tgan zamon yordamida voqealarni hikoya qilishni o\'rganamiz.' },
  { keywords: ['transport', 'bus', 'train', 'taxi', 'plane', 'metro', 'subway', 'ticket', 'station'], emoji: '🚌', question: 'Transportda ingliz tilida muloqot qila olasizmi?', tip: 'Transport, chipta va yo\'nalish haqida gapirishni o\'rganamiz.' },
  { keywords: ['phone', 'call', 'message', 'text', 'mobile', 'number'], emoji: '📞', question: 'Telefon orqali ingliz tilida gaplasha olasizmi?', tip: 'Telefon qo\'ng\'irog\'i va xabar yozishni o\'rganamiz.' },
  { keywords: ['apolog', 'sorry', 'forgive', 'mistake', 'regret'], emoji: '🙏', question: 'Kechirim so\'rashni bilasizmi?', tip: 'Kechirim so\'rash va xatolarni tan olishni o\'rganamiz.' },
  { keywords: ['thank', 'grateful', 'appreciate', 'gratitude'], emoji: '🙌', question: 'Rahmat aytishning turli usullarini bilasizmi?', tip: 'Minnatdorchilik bildirishning turli usullarini o\'rganamiz.' },
  { keywords: ['invite', 'invitation', 'join', 'celebrate', 'party', 'wedding'], emoji: '🎉', question: 'Taklif qilish va taklifga javob berishni bilasizmi?', tip: 'Taklif qilish, qabul qilish va rad etishni o\'rganamiz.' },
  { keywords: ['formal', 'polite', 'respect', 'sir', 'madam', 'official'], emoji: '🎩', question: 'Rasmiy vaziyatlarda ingliz tilida muloqot qila olasizmi?', tip: 'Rasmiy muloqot va hurmatli nutqni o\'rganamiz.' },
]

/** Scenario topic asosida warm-up savol va maslahat */
function warmupContent(topic: string) {
  const lower = topic.toLowerCase()
  const match = WARMUP_PATTERNS.find(p => p.keywords.some(kw => lower.includes(kw)))
  if (match) {
    return { emoji: match.emoji, question: match.question, tip: match.tip }
  }
  // Fallback
  return {
    emoji: '🗣️',
    question: `"${topic}" mavzusida ingliz tilida gaplasha olasizmi?`,
    tip: 'Bugun aynan shu mavzuda suhbatlashishni o\'rganamiz. Tayyormisiz?',
  }
}

export default function WarmupStep({ day, onNext }: Props) {
  const { speak, supported } = useSpeechSynthesis()
  const content = warmupContent(day.scenario.topic)

  const handleSpeakTopic = () => {
    if (supported) {
      // Faqat inglizcha qismni o'qib beradi
      const text = `Today we will learn about ${day.scenario.topic}.`
      speak(text)
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800/50 text-center">
        <div className="text-5xl mb-3">{content.emoji}</div>
        <p className="font-black text-lg text-gray-900 dark:text-gray-100">
          {day.title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {day.subtitle}
        </p>

        <div className="mt-5 p-4 rounded-xl bg-white/70 dark:bg-gray-800/60 border border-amber-200 dark:border-amber-800/40">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {content.question}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            💡 {content.tip}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-amber-500" />
            {day.estMinutes} daqiqa
          </span>
          <span className="flex items-center gap-1">
            <Zap size={14} className="text-amber-500" />
            {day.chunks.length} ta ibora
          </span>
        </div>

        {supported && (
          <button
            onClick={handleSpeakTopic}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
          >
            <Volume2 size={13} /> Mavzuni tinglash
          </button>
        )}
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-sm hover:from-orange-600 hover:to-amber-700 active:scale-[0.98] transition-all shadow-md"
      >
        Tayyorman! Darsni boshlaymiz →
      </button>
    </div>
  )
}
