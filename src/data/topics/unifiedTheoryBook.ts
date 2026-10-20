/** TASK-344: one readable book contract for previously uneven source notes. */
import type { TestQuestion, TheoryBlock, TopicContent } from '../topicContent'

function correctAnswer(question: TestQuestion): string {
  return question.options[question.correctIndex] ?? 'Javob mavzu mezoni bo‘yicha tekshiriladi.'
}

function conciseKeywords(title: string): string {
  return title
    .replace(/[',:()]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !['bilan', 'uchun', 'hamda', 'uning'].includes(word.toLowerCase()))
    .slice(0, 8)
    .join(' • ')
}

/**
 * Preserve every reviewed source block while adding the common learner-book
 * spine around short legacy notes. Question objects are read only to derive
 * worked examples and self-checks; their IDs and answer keys are never changed.
 */
export function buildUnifiedTheoryBook(
  topic: Pick<TopicContent, 'title' | 'theory' | 'questions'>,
  fallbackSource?: string,
): TheoryBlock[] {
  const examples = topic.questions.slice(0, 3)
  const practices = topic.questions.slice(0, 6)

  const scaffold: TheoryBlock[] = [
    {
      type: 'goal',
      content: `“${topic.title}” mavzusining asosiy tushuncha va qoidalarini izohlash, ularni vaziyatda qo‘llash, javobni dalil bilan tekshirish hamda attestatsiya topshirig‘ida yaqin tushunchalarni farqlash.`,
    },
    {
      type: 'intro',
      content: `Bu bob **${topic.title}** bo‘yicha mavjud darslik konspektini bir yo‘nalishda o‘qitadi: avval tayanch mazmun, keyin bog‘lanish va qo‘llash tartibi, undan so‘ng ishlangan misol, mustaqil mashq va javoblar. Manbadagi mazmun saqlangan, o‘quv yo‘li esa bir xil kitob shakliga keltirilgan.`,
    },
    { type: 'keywords', content: conciseKeywords(topic.title) },
    { type: 'heading', content: '1. Mavzuga kirish va tayanch savollar' },
    {
      type: 'note',
      content: `Bobni o‘qishdan oldin “${topic.title}” atamasini o‘z so‘zingiz bilan izohlang, bitta qo‘llash vaziyatini ayting va aniqlashtirmoqchi bo‘lgan savolingizni yozing. Keyingi darslik bloklarida shu dastlabki javobni dalil bilan tekshirasiz.`,
    },
    {
      type: 'heading',
      content: '2. Tushunchalarni bog‘lash',
    },
    {
      type: 'note',
      content: `Mavzuni yodlashdan oldin har bir atama uchun uch savolga javob bering: **bu nima**, **qanday ishlaydi**, **qaysi vaziyatda qo‘llanadi**. “${topic.title}” doirasidagi jadval, formula, buyruq yoki qoida aynan shu uch bog‘lanish bilan qayta o‘qiladi.`,
    },
    {
      type: 'task',
      content: 'Tayanch nazariyadan 5–8 asosiy atamani tanlang. Har biri uchun bir jumlalik ta’rif, bitta misol va u bilan adashishi mumkin bo‘lgan yaqin tushunchani yozing.',
    },
    {
      type: 'heading',
      content: '3. Qo‘llash va tekshirish tartibi',
    },
    {
      type: 'text',
      content: 'Topshiriqni bajarishda: 1) savol talabini va inkor so‘zini belgilang; 2) berilgan ma’lumotni mavzu atamalariga aylantiring; 3) tegishli qoida yoki amallar ketma-ketligini tanlang; 4) natijani chegara holati yoki qarshi misol bilan tekshiring; 5) javobni qisqa sabab bilan yozing.',
    },
    {
      type: 'trap',
      content: 'Faqat kalit so‘zga qarab variant tanlash, qoida amal qiladigan shartni tekshirmaslik va “qaysi biri emas?” kabi inkorli talabni o‘tkazib yuborish eng ko‘p uchraydigan xatolardir.',
    },
    {
      type: 'heading',
      content: '4. Bosqichma-bosqich ishlangan misollar',
    },
    ...(examples.length > 0
      ? examples.map((question, index): TheoryBlock => ({
        type: 'solved',
        content: `**${index + 1}-misol.** ${question.text}\n\n**Javob:** ${correctAnswer(question)}. **Asos:** ${question.explanation}`,
      }))
      : [{
        type: 'case' as const,
        content: `Mavzu vaziyatini tahlil qiling: “${topic.title}” bo‘yicha qaror chiqarishda avval fakt, so‘ng tegishli qoida, undan keyin natija va tekshiruv mezoni yoziladi. Javob faqat yakuniy hukm emas, shu mantiqiy zanjir bilan baholanadi.`,
      }]),
    {
      type: 'heading',
      content: '5. Mustaqil mashqlar',
    },
    ...(practices.length > 0
      ? practices.map((question, index): TheoryBlock => ({
        type: 'task',
        content: `**${index + 1}-mashq.** ${question.text} Variantlarga qaramasdan javob yozing va tanlovingizni bitta qoida yoki dalil bilan asoslang.`,
      }))
      : [{
        type: 'task' as const,
        content: `“${topic.title}” bo‘yicha bitta ta’rif savoli, bitta amaliy vaziyat va bitta xato fikr tuzing. Har biriga mezonli javob yozing, so‘ng darslikdagi tayanch matn bilan tekshiring.`,
      }]),
    {
      type: 'quickcheck',
      content: 'O‘zingizni tekshiring: atamani ta’rifsiz misolda taniy olasizmi; qoidaning amal qilish shartini ayta olasizmi; noto‘g‘ri javob nega noto‘g‘riligini tushuntira olasizmi?',
    },
    {
      type: 'heading',
      content: '6. Javoblar, xulosa va manba izi',
    },
    {
      type: 'answers',
      content: practices.length > 0
        ? practices.map((question, index) => `${index + 1}) **${correctAnswer(question)}** — ${question.explanation}`).join('\n\n')
        : 'Javob rubrikasi: ta’rif mazmunan aniq; vaziyatdagi qoida va shart ko‘rsatilgan; xato fikr qarshi misol yoki manbadagi qoida bilan rad etilgan bo‘lishi kerak.',
    },
    {
      type: 'summary',
      content: `Bob yakunida “${topic.title}” bo‘yicha atama, qoida, qo‘llash vaziyati va tekshiruv usuli bitta tizimga birlashtiriladi. Mavzuni o‘zlashtirish mezoni — ta’rifni takrorlash emas, yangi vaziyatda to‘g‘ri qoida tanlash va natijani asoslash.`,
    },
  ]

  if (fallbackSource) scaffold.push({ type: 'source', content: fallbackSource })

  // Historical source-fidelity tests and downstream readers rely on every
  // reviewed block retaining object identity, order and suffix position.
  // Therefore the new book spine is prepended; the verified source corpus is
  // never filtered, moved or reconstructed.
  return [...scaffold, ...topic.theory]
}
