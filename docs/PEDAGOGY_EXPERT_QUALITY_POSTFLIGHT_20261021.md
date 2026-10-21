# Pedagogika — ekspert sifat nazorati, 2026-10-21

Bu tekshiruv mavjud savollarni foydalanuvchidan qo‘shimcha qaror talab qilmasdan tahrirlash va mustaqil QA yuritish tartibini hujjatlashtiradi. Ekspert sifatida nazariy taqqoslash, variantlar balansini tekshirish va javob kalitlari bog‘lanishini tekshirish amalga oshirilgan; mualliflik yoki mustaqil shaxs tasdig‘i soxtalashtirilmaydi.

## Masalaga doir tahrirlar

- `7782afd8-62e4-4acc-bbf5-2e9e2946f649` — musiqa savolida o‘qituvchi noto‘g‘ri ijroni *ataylab rejalashtirgani* aniq bayon qilindi. Didaktik o‘yin variantining mantig‘i mustahkamlandi, javobdagi Telegram suv belgisi olib tashlangan.
- `679b577c-45e9-4c09-be34-848716432319` — to‘g‘ri javob qisqartirilib, mazmun «xavfsiz va inklyuziv ta’lim muhitini yaratish» shaklida saqlandi.
- `f12016dc-14df-4c3e-9b51-59850e5ecf99` — demokratik muloqotning to‘g‘ri varianti qisqaroq va tabiiyroq shaklga keltirildi.
- `3950058d-23bb-4d5b-8ce8-5e97fc3d3d36` — chalg‘ituvchi «Fanlararo integratsiya» ixchamlashtirildi.
- `862757b6-cf66-47fb-ad12-2d7b17ce71b5` — «Mimika» o‘rniga «Yuz mimikasi», «Didaktika» o‘rniga «Didaktik metod» yozilib, atamalar orasidagi sun’iy uzunlik tafovuti kamaytirildi.
- `08d075ec-c50f-4740-968f-12094a594cee` — «Deduksiya», «Induksiya» variantlari «Deduktiv yondashuv», «Induktiv yondashuv» ko‘rinishida tenglashtirildi.
- `2e8798a8-259d-406b-8239-37e07e2521db` — loyihaviy, muammoli, hamkorlikdagi va differensial ta’limni farqlash izohi o‘zbekcha yozildi.
- `8c95856e-4af4-48a1-99ea-bcfe42cd7132` — diagnostika, monitoring, qayta aloqa va yakuniy baholash mosligini tushuntiruvchi o‘zbekcha izoh yozildi.

Mavjud variant UUIDlari va to‘g‘ri kalitlar o‘zgartirilmadi. O‘zgarishlar faqat `status='review'` holatidagi qatorlarga shartlangan, tarixiy nashrlar mutatsiya qilinmadi.

## Supabase postflight

Pedagogika guruhlari `KS`, `PM.GEN`, `PM.MET`da hozir faol tahrir holatidagi `Y1` savollar bo‘yicha:

| Ko‘rsatkich | Natija |
|---|---:|
| Tekshirilgan Y1 | 114 |
| Noto‘g‘ri variant soni | 0 |
| Takroriy variantlar | 0 |
| To‘g‘ri javob uzunligi eng qisqa variantdan 1.6x katta | 0 |
| Eng uzun variant eng qisqasidan 2x katta | 0 |

Ikkita `Y2` savolining `a` va `b` tomonlari 4 tadan noyob elementga ega, `pairs` kalitidagi 4 ta moslik haqiqiy IDlarga bog‘langan. `supabase/tests/pedagogy_y1_y2_content_integrity_qa.sql` testini real bazada bajarishda xatolik qaytmadi.

## Tekshiruv doirasi

Bu tekshiruv *avtomatik strukturaviy sifat* va ko‘rsatilgan sakkizta savolning tahririni tasdiqlaydi. U har bir savolning barcha pedagogik tasniflari yoki mualliflik huquqi hujjatlari mutlaq tekshirilganini bildirmaydi. Yangi nashrlarni bazaning himoya mexanizmidan chetlab o‘tib yoqish mumkin emas; tahrirlangan ma’lumotlar qanchalik to‘g‘ri bo‘lmasin, tarixiy test javoblari buzilmasligi kerak.

## Tekshiruvni qayta ishga tushirish

- `supabase/tests/pedagogy_y1_y2_content_integrity_qa.sql`
- `supabase/tests/pedagogy_option_provenance_leak_qa.sql`
- `supabase/tests/pedagogy_case_based_second_generation_qa.sql`

Yozuvlarning asl manbalarga aloqasi metama’lumotda saqlangan, savol matnida yashirin tashqi manba yorlig‘i ishlatilmasligi lozim.
