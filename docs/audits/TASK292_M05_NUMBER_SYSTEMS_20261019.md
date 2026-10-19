# TASK-292 — M05 sanoq tizimlari (2026-10-19)

## Sabab va qamrov

M05.01–M05.03 offline darslarida avval 5–6 blokli qisqa ta’rif va oddiy misollar mavjud bo‘lgan. Kirish uchun foydali bo‘lsa ham, qadamma-qadam hisob va mustaqil tekshiruvlarni yetarli ko‘rsatmagan.

| Mavzu | Yangi blok | Sarlavhali bo‘lim | Asosiy misollar |
|---|---:|---:|---|
| M05.01 Sanoq sistemalari asoslari | 41 | 9 | 2/8/10/16, razryad vazni, bit/bayt, 2F₁₆, rang kodlar |
| M05.02 Sanoq sistemalari orasida o‘tkazish | 48 | 11 | 45₁₀=101101₂, triada/tetrada, 0.625=0.101₂, cheksiz kasr |
| M05.03 Turli sanoq sistemalarida arifmetika | 47 | 10 | carry/borrow, ko‘paytirish, 255+1 overflow, signed/two’s complement |

**Jami: 136 blok va 30 sarlavhali bo‘lim.**

Yangi boblar yagona BookReader dastlabida; qisqa qayta konspekt alohida ko‘rsatilmaydi. Har uch darsning uchta asl savoli, ID va javob kaliti saqlanadi, qo‘shni M05 darslariga tegilmaydi.

## Manbalar va chegaralar

- [Cambridge+ «Informatika va axborot texnologiyalari», 9-sinf (2021)](https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view), 1-bob «Kompyuter tizimlarining turlari va komponentlari», bosma 3–4-betlarda ikkilik sanoq, bit, bayt va raqamli signal konsepsiyalari.
- Pozitsion sistemalarning matematik arifmetikasi, razryadlar, 8/16 lik konversiyalar, fractional conversion, overflow va two’s complement bo‘yicha qo‘shimcha misollar mustaqil yozilgan.
- Hex/bit, belgisiz va belgili sonlarning talqini ajratilgan. Cheksiz ikkilik kasrlar va cheklangan registr natijalarini cheksiz aniqlikdagi son bilan tenglashtirmang.
- Bu audit fizik PDF sahifalarining har birini va rasmlarni tekshirib 100% to‘liq qamrab oladi degani emas.

## Testlar

src/tests/TASK292NumberSystemsBooks.test.ts bob chuqurligi, sarlavha/manba va mashq-javob majmualarini; original savol IDs va kalitlarini; matematik misollarni mustaqil parseInt va bitli amallar bilan; qo‘shni darslarga o‘zgartirish kiritilmaganini tekshiradi.

**Yangi test savollari, DB migratsiyasi yoki deploy yo‘q.** Keyingi M05.04 va boshqa qisqa darslar alohida manba tekshiruvi bilan yopilishi kerak.
