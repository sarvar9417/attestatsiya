# Pedmahorat | Guli: pedagogik mahorat va kasb standarti manbalari

**Status:** ochiq postlar asosida mavzular identifikatsiyasi; to‘liq Telegram eksporti olinmagan; materiallarni nusxalab qayta nashr qilish uchun muallif ruxsati mavjud emas. **Production deployment taqiqlangan — foydalanuvchi alohida tasdiqlamaguncha.**

## Identifikatsiya va kirish imkoniyati

- Asl kanal: **Pedmahorat | Guli** — [@PedMahoratGuli](https://t.me/PedMahoratGuli); muallif bilan aloqa [@Guli_Eshnazarova](https://t.me/Guli_Eshnazarova).
- Ochiq indeks: [Telemetr kanal arxivi](https://telemetr.io/uz/channels/2340756863-pedmahoratguli) va [postlar arxivi](https://telemetr.io/uz/channels/2340756863-pedmahoratguli/posts). Indeks to‘liq kanal eksporti emas; undan ko‘rinmagan hujjat, ovozli dars yoki bot ichidagi savollar o‘qib chiqilgan deb bo‘lmaydi.
- Ilova: [pedguli.uz](https://pedguli.uz/), Telegram test boti: [@PedGuli_bot](https://t.me/PedGuli_bot). Ilova/botdagi materiallar Telegram ochiq postlari bilan bir xil manba emas; foydalanishga ochiq va huquqiy kirish alohida ko‘rib chiqiladi.

## Ochiq postlardan aniqlangan aniq mavzular

| Asl kanalda kuzatilgan motiv | Asosiy spetsifikatsiya konstruktlari | Platformada qanday qo‘llanadi |
|---|---|---|
| **Akvarium**: ichki guruhning fikr almashishi, tashqi guruhning kuzatishi, rollar almashishi | PM.GEN.04; PM.GEN.08; PM.MET.02 | Mustaqil tuzilgan vaziyatli savollar va taqqoslash darsi |
| **Asalari galasi**: kichik guruhda qisqa tezkor muhokama | PM.GEN.04; PM.GEN.08 | Metodni belgilaridan tanish; metodni boshqa usullar bilan farqlash |
| **Ajurli arra (jigsaw)**, guruhlarning o‘zaro o‘qitishi | PM.GEN.08; PM.MET.02 | Ekspert va asosiy guruh vazifalarini taqqoslash |
| **Loyiha asosida** va **individual ta’lim** texnologiyalari | PM.GEN.08; KS.02; KS.01 | Metod afzalliklarini o‘quvchi ehtiyojiga mos tanlash |
| **Muammoli vaziyat**, faol izlanish | PM.GEN.01; PM.GEN.08; PM.MET.01 | Turli fanlar uchun original keyslar, algoritmli vaziyatlar |
| **Pedagogik xayol**, dars jarayonini oldindan ko‘ra olish | PM.GEN.07; KS.01 | Qobiliyatni didaktik, perseptiv va texnik qobiliyatlardan farqlash |
| **Nazariya–amaliyot birligi** | PM.GEN.02 | Konkret vaziyatda tamoyilni aniqlash |
| **Xavfsiz rivojlantiruvchi muhit** va kasb standarti vazifalari | KS.05; KS.03; KS.04 | Xavfsizlik, baholash va tarbiyani rollarga ko‘ra farqlash |
| **Individual qayta aloqa, kamsitmaslik** | KS.03; PM.GEN.06 | O‘quvchini himoya qiluvchi, tashxisga asoslangan tavsiyalar |

Manba: [@PedMahoratGuli](https://t.me/PedMahoratGuli) kanali bilan bog‘liq ochiq postlarning Telemetr indeksida ko‘rinadigan matnlari, 2026-yil sentyabr–oktyabr oylari atrofidagi arxiv oynalari. **Bu kanalda aytilgan “#tushgan_test” tegi savolning rasmiy imtihonda tushganini mustaqil isbotlamaydi.** Alohida tekshirilmagan javoblar import qilinmaydi.

## Birlamchi me’yoriy va ilmiy nazorat

1. [2026-yilgi rasmiy Informatika attestatsiya spetsifikatsiyasi](https://api-portal.gov.uz/uploads/9/2026/03/11/1953c171-e0b5-1f19-d100-8ac82077bcfa_media_.pdf), 2-jadval. KS 5; pedagogika 7; informatika metodikasi 3. Manba kanaldan ustun turadi.
2. M14 darslari — pedagoglarning kasb standarti va A/01.6–A/05.6/B/01.6/B/02.6 mehnat vazifalari.
3. M15 darslari — Umumiy pedagogika (Mavlonova va boshqalar, 2018); Pedagogik texnologiyalar va pedagogik mahorat (Tolipov va Ro‘ziyeva, 2019).
4. M16 darslari — Informatika o‘qitish metodikasi (Mamarajabov, Toshtemirov, Yuldashev, 2023).
5. “Akvarium” usulining tashqi tasdiqlovchi pedagogik tavsifi: [ochiq metodika bayoni](https://t.me/s/mahoratlipedagog/36073).

## Kontentni qayta ishlashning majburiy chegaralari

**Kanalning mualliflik matnlari, kitob fayllari, audio, yopiq guruh yoki bot savollari ruxsatsiz ommaviy nusxalanmaydi.** Quyidagi bosqichlar ruxsat etilgan: metod nomi va ta’limiy konseptni qayd etish; birlamchi manba bilan tasdiqlash; **mutlaqo yangi savol vaziyati va variantlarni yozish**; javobni dalillash; qayta tekshirish; dars va testga havola berish.

Agar muallif litsenziya yoki yozma ruxsat bersa, asl testlarni ham keyingi bosqichda individual post URL, huquq, yil, format, kalit va tasdiq holati bilan import qilish mumkin. Qo‘shilgan yangi savollar **“original — Pedmahorat Guli mavzularidan ilhomlangan”**, **“o‘tgan yilning asl testi” emas**.

## Tekshiruvlar va deploy chegarasi

- Bir konstrukt uchun kamida bir nechta mustaqil savol, to‘g‘ri kalit, to‘rtta farqli variant, pedagogik izoh, qonuniy source reference.
- 15 ta savolli sessiya serverda KS 5 + PM.GEN 7 + PM.MET 3 bo‘lib qoladi.
- Mahsulotning 50 savollik va 120 daqiqalik rasmiy mock rejimi o‘zgartirilmaydi.
- Bu branchdagi migratsiyalarni hozir **Attestatsiya production Supabase**ga ham, Vercel production’ga ham qo‘llamang. Yakuniy ruxsatni foydalanuvchi beradi.
