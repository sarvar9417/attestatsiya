/**
 * Learner-only presentation cleanup of imported M14/M15 pedagogy notes.
 *
 * A published lesson is immutable; keep the original DB body (including source
 * evidence) intact. Only the BookReader projection hides editorial import
 * labels. This must not rewrite question keys or change learning objectives.
 */

const SEVEN_AREAS_HEADING = /^##\s+Telegram manbasidan:\s*kasbiy standartning 7 sohasini ajratish\s*$/i

const SEVEN_AREAS_LESSON = [
  '## Kasb standartining yetti sohasini farqlash',
  '',
  'Attestatsiya vaziyatida sohani aniqlash uchun faqat biror kalit so‘zga emas, **pedagogning asosiy maqsadi va qilayotgan ishiga** qarang.',
  '',
  '| Kasbiy soha | Pedagogning asosiy harakati | Vaziyat belgisi |',
  '| --- | --- | --- |',
  '| O‘quv jarayonini rejalashtirish | Dars maqsadi, reja va topshiriqlarni dastur hamda DTSga mos oldindan tuzish | Darsdan oldin maqsad, vaqt, resurs va baholash usuli belgilanadi |',
  '| Ta’lim samaradorligini ta’minlash | Dars davomida metod, ko‘rgazma, tabaqalashtirish, guruh va loyiha ishlarini tashkil etish | O‘quvchilarning bilimni egallashi uchun ta’lim usuli qo‘llanadi |',
  '| O‘zlashtirishni baholash va qayta aloqa | Mezon asosida natijani aniqlash, xatoni tahlil qilish va keyingi qadamni tushuntirish | O‘quvchining natijasi baholanadi yoki unga tavsiya beriladi |',
  '| Tarbiyaviy faoliyatni tashkil etish | Xulq, odob, mas’uliyat va ijtimoiy munosabatni rivojlantirish | Tarbiyaviy suhbat, hurmat va munosabat madaniyati asosiy maqsad |',
  '| Xavfsiz rivojlantiruvchi ta’lim muhitini yaratish | O‘quvchi sha’ni, ruhiy va jismoniy xavfsizligi, huquq hamda manfaatini himoya qilish | Xavf, zo‘ravonlik, himoyaga ehtiyoj yoki favqulodda vaziyat mavjud |',
  '| O‘z-o‘zini rivojlantirish va kasbiy o‘sish | O‘z darsini tahlil qilish, yangi bilim va metodlarni egallash | Pedagog o‘z kasbiy malakasini oshirmoqda |',
  '| Hamkorlik | Hamkasblar, ota-onalar va jamoa bilan birgalikda vazifani bajarish | Turli ishtirokchilar o‘rtasida maqsadli aloqa va hamkorlik tashkil etiladi |',
  '',
  '**Vaziyatni farqlash:** o‘qituvchi baholash natijasini keyingi dars rejasiga kiritgan bo‘lsa, asosiy ish — **rejalashtirish**; natijani tahlil qilib o‘quvchiga qanday tuzatishni aytgan bo‘lsa — **baholash va qayta aloqa**. Oddiy xulqiy suhbat tarbiyaga, o‘quvchini bevosita tahdiddan himoya qilish xavfsiz muhitga yaqin.',
  '',
  '**Xulosa:** ushbu belgilar yodlash uchun qo‘llanma, kasb standarti ta’riflarining o‘rnini bosmaydi.',
  '',
].join('\n')

/**
 * Apply only to the public reading view for canonical M14/M15 lessons.
 * Source links and original author notes remain untouched in the database.
 */
export function cleanLearnerPedagogyText(markdown: string): string {
  if (!markdown) return markdown
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const section = lines.findIndex(line => SEVEN_AREAS_HEADING.test(line.trim()))
  if (section !== -1) {
    const next = lines.findIndex((line, index) => index > section && /^##\s+[^#]/.test(line))
    lines.splice(
      section,
      (next === -1 ? lines.length : next) - section,
      ...SEVEN_AREAS_LESSON.split('\n'),
    )
  }

  const cleaned = lines.flatMap(line => {
    const trimmed = line.trim()
    // A reference to a Telegram post is editorial provenance, not an explanation.
    // Keep the raw link in the immutable lesson record for audit/source verification.
    if (/^\*{1,2}Telegramdagi manba(?:lar)?:\*{1,2}\s+.+$/i.test(trimmed)) return []

    const heading = /^(#{2,4})\s+(.*)$/.exec(line)
    if (heading) {
      const editorialPrefix = /^(?:(?:Telegram manbasidan|Pedmahorat\|Guli manbasidan|Telegram qo‘llanmasi|Pedmahorat\|Guli):\s*)/i
      const cleanHeading = heading[2]
        .replace(editorialPrefix, '')
        .replace(/\s+\[(?:THEORY-CORPUS|PEDGULI-STUDY)[^\]]+\]\s*$/i, '')
      return [heading[1] + ' ' + cleanHeading]
    }

    return [
      line
        .replace(/Kanal muallifining eslatmasiga ko‘ra, o‘qituvchi:/i, 'Baholash jarayonida o‘qituvchi:')
        .replace(/Kanal muallifining ixcham atamalarini vaziyat orqali eslab qolish mumkin:/i, 'Quyidagi qobiliyatlarni vaziyatga qarab farqlang:')
        .replace(/Kanal muallifining tezkor eslatmasida yangilikka munosabat shunday farqlanadi:/i, 'Yangilikka munosabatni quyidagi bosqichlarda farqlash mumkin:'),
    ]
  })

  return cleaned.join('\n')
}
