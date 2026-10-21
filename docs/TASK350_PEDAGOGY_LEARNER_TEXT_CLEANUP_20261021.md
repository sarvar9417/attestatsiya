# TASK-350 — Nazariya darslarida Telegram import izohlarini tozalash

## Muammo

M14 «O‘quv jarayonini rejalashtirish» darsida
`## Telegram manbasidan: kasbiy standartning 7 sohasini ajratish` sarlavhasi,
«Kanal muallifining...» kirish jumlasi, takroriy qisqa 1–7 ro‘yxat
va `*Telegramdagi manba:* .../15293` texnik havolasi o‘quvchiga
dars mazmunining bir qismi sifatida ko‘rinadi. Shunday import yorliqlari
M14/M15dagi boshqa bir nechta nazariya boblarida ham mavjud.

## Tekshirilgan faktlar

- Supabase `public.lessons`da asosiy namuna: `slug=oquv-jarayonini-rejalashtirish`, `status=published`, `blocks_kind=chapter`.
- `Telegram manbasidan:` sarlavhali 5 ta published dars (M14/M15).
- `Telegramdagi manba` iborasi uchraydigan 10 ta published dars; PDF manba va boshqa darslik havolalari alohida.
- `[THEORY-CORPUS-...]` kabi tahririy heading teglar 18 published darsda topilgan.
- `AGENTS.md` talabiga ko‘ra published dars body versiyasi immutable; manbani SQL bilan joyida yozish mumkin emas.

## Yechim

- `src/features/content/learnerPedagogyTextCleanup.ts` — M14/M15 uchun faqat learner BookReader proyeksiyasi. U published DB mazmunini **o‘zgartirmaydi**, original manba izi va Telegram URLni audit uchun saqlaydi.
- Yetti kasbiy standart sohasini vaziyatdagi asosiy harakat, o‘qituvchi maqsadi va chalg‘ituvchi chegaralar orqali tushuntiradigan **7 qatorli jadval** bilan almashtiradi.
- `Telegram manbasidan:`, `Pedmahorat|Guli manbasidan:`, `Telegram qo‘llanmasi:`, `[THEORY-CORPUS-...]` va `[PEDGULI-STUDY-...]` kabi sarlavha import belgilarini olib tashlaydi.
- Alohida turuvchi `*Telegramdagi manba:* [kanal URL]` ko‘rinishidagi editorial satrlarni o‘quvchi nazariyasidan yashiradi; **PDF kasb standarti va darslik manbalari saqlanadi**.
- Boshqa modullarning (M02/M16 va hokazo) mavjud kanonik darslariga tegmaydi.
- `src/features/content/professionalLessonTheory.ts` dagi reader birlashtirish bosqichiga ulangan.
- `src/tests/task350PedagogyLessonCleanup.test.ts`: 7 soha va jadvallar, original publish ma’lumotlari o‘zgarmasligi, review to‘sig‘i, boshqa manbalar, takroriy qo‘llanganda idempotentlik, boshqa modulga ta’sir yo‘qligi.

## Release

Bunda database migration talab etilmaydi: read-only UI projection.
Qo‘lda production deploy bajarilmaydi. Github PR merge bo‘lgach,
foydalanuvchiga ko‘rinadigan yangi web build (tegishli deployment workflow ishga tushganda)
tahririy import yorliqlarini yashiradi. Imtihon kalitlari, quiz formatlari
va o‘quvchilar tarixi o‘zgarmaydi.
