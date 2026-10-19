# TASK-247 — pedagogika testlari uchun manbaviy tahrir va sifat mezonlari
**Sana:** 2026-10-19. **Status:** DRAFT / editorial checklist; production bankni o‘zgartirish yoki nashrga ruxsat EMAS.

## Manba

- **Jalilov K.** *Baholash nazariyasi asoslari* (Toshkent: Akademnashr, 2020). Barnoyevak `ChatExport_2026-10-19/files` papkasida ikki generik nomli PDF matni bilan aniqlandi: `1723545826.pdf` va `xrpt_uz6b84v91iitco6thk37r6vh4uya9xfskauh4fgtnocp69adi402yv9rfv.pdf`.
- Birinchi PDF matnida sarlavha/mundarija mavjud: **2-bob: validlik, bosma 37-betdan**; **3-bob: ishonchlilik, bosma 71-betdan**; **5-bob: topshiriq tahlili, bosma 182-betdan**; **5.2: qiyinlik (184), diskriminatsiya (186), distraktor tanlanishi (189), DIF (193)**. Bu **kitobning bosma sahifa raqamlari**, PDFning fizik bet indeksi emas; foto/diagrammalar ham alohida tekshiruvga muhtoj.
- **Tolipov O‘., Ro‘ziyeva D.** *Pedagogik texnologiyalar va pedagogik mahorat* (Toshkent: Innovatsiya-Ziyo, 2019). Generik `03ff4260-7061-49e2-a5d4-9f6ee74eebe7.pdf` faylining sarlavha va kirish matni bilan aniqlandi. Kitobda pedagogik jarayonni loyihalash, shaxsga yo‘naltirilgan va interfaol metodlar yoritiladi.
- Ushbu matnlar pedagogik-nazariy manbalar; tarixiy Telegram to‘plamidagi «to‘g‘ri javob» yoki «100% imtihon savoli» yorlig‘i baholashning ilmiy dalili emas.

## Muallif/editor har bir savol uchun to‘ldiradigan nazorat ro‘yxati

| Gate | Tekshiriladigan mezon | Dalil | Avtomatika yetadimi? |
|---|---|---|---|
| QA-01 | 2026 spetsifikatsiyasidagi aniq **KS / PM.GEN / PM.MET** konstruktiga bog‘langan | Objective kodi + kompetensiya + spetsifikatsiya sahifasi | Yo‘q: semantik tasdiq shart |
| QA-02 | Test o‘lchayotgan ko‘nikmaga aloqasiz bilim, til, tashqi fakt yoki texnik to‘siqdan xoli | Validlik mazmuni bo‘yicha ekspert xulosasi | Yo‘q |
| QA-03 | Savolda **yagona aniq to‘g‘ri** javob yoki formatga mos bir xil deterministik kalit bor | Darslikdagi fakt/bob/bet va independent editor bahosi | Yo‘q |
| QA-04 | Y1 uchun 4 ta tushunarli, grammatik muvofiq va mazmunan chalg‘ituvchi variant; Y2/Y3 uchun natural matching/ordering | Har bir variantni mazmunan tahlil qilish | Strukturani avtomatik, mazmunni ekspert |
| QA-05 | To‘g‘ri variant uzunlik, sintaksis, inkor, mutlaq so‘z yoki boshqa signallar orqali ajralib qolmagan | Distraktor audit/length flags va semantic review | Faqat evristika |
| QA-06 | Savolni javoblash uchun zarur vaziyat, shart, jadval, rasm, kontekst to‘liq keltirilgan | Stem + asset + mobil ekran + accessibility tekshiruvi | Qisman |
| QA-07 | Izoh nima uchun shu javob to‘g‘ri va qolganlari nega mos emasligini tushuntiradi | Source-backed rationale, no full-book copy | Yo‘q |
| QA-08 | Kognitiv murakkablik va qiyinlik darajasi tasnifdan aniq ajratilgan | Vaziyatdagi fikrlash amali; empirik natija bo‘lsa alohida | Qisman |
| QA-09 | Shaxs, imkoniyat va vaziyatga nisbatan adolatli, stereotipsiz, noaniq me’yoriy iddaosiz | Inclusive/fairness editorial check | Yo‘q |
| QA-10 | Bir xil yoki mazmunan takroriy savol boshqa PDF, variant va revisionda qayta import qilinmagan | Normalized stem + option fingerprints, semantik audit | Qisman |
| QA-11 | Manbasi, statusi, reviewer tahriri va revision tarixi aniq; private source key learnerga chiqmaydi | Audit/provenance va RLS/API testlari | Qisman |
| QA-12 | Ekspert tasdiqlamagan yoki manbasi ziddiyatli savollar `review/quarantine`da saqlanadi; `published`ga o‘tishdan oldin release gate bajariladi | Imzo/status/immutable revision/attempt snapshot | Ha — texnik gate + real review |

## Kitobdagi testologiya tushunchalarini to‘g‘ri talqin qilish

- **Validlik:** savol/test natijasidan chiqariladigan xulosa haqiqatan o‘lchanishi kerak bo‘lgan konstruktga bog‘liqmi? Chiroyli dizayn yoki 4 variant mavjudligi buni o‘zi isbotlamaydi.
- **Ishonchlilik:** baholashning izchilligi/barqarorligini tekshirishga oid alohida mezon; `validlik=ishonchlilik` emas.
- **Qiyinlik / diskriminatsiya / distraktor tanlanishi / DIF:** yetarli, maxfiylikka rioya qilgan haqiqiy sinov natijalari mavjud bo‘lganda statistika bilan o‘rganilishi mumkin. Matnni AI o‘qigani — empirik psixometrik tahlil emas.
- **Word-length evristikasi:** to‘g‘ri variant eng uzun emasligi yaxshi, ammo bu yagona javob yoki kuchli distraktor sifatini isbotlamaydi.
- **Y1/Y2/Y3:** faqat label orqali formatni «Y2/Y3» deyish mumkin emas; mos UI va server deterministik kaliti kerak.

## Joriy korpusga qo‘llanishi

1. 2025 bahor `Pedagogik mahorat to'plam 2025 (5)/(6)`da connector chiqargan 88 088 belgilik matn teng. Dublikat sifatida editorial navbatga ajratilsin; foydalanuvchiga dublikat savol sifatida berilmasin.
2. `pdf_6aa...pdf` va `pdf_69b...pdf` matnlarining boshlanishi test qatnashchilari ismlari, ballari va vaqtlarini o‘z ichiga oladi. Ularni **shaxsiy ma’lumot** sifatida ko‘rib, learner-facing darslik/test manbasi sifatida public repoga, DBga yoki hisobotga ko‘chirmaslik.
3. 2025 pedagogik mahorat spetsifikatsiyasi va 2026 informatika attestatsiya spetsifikatsiyasi turli hujjatlar: imtihon qamrovi uchun 2026 rasmiy spetsifikatsiya ustuvor.
4. **Hozirgi holat:** katalog + nazariya ayrim mavzularda yangilandi; yangi savollar productionga joylashtirilmadi, manbalarning barcha fizik betlari auditi yo‘q, yaxlit psixometrik analiz yo‘q.
5. Barcha source-bank uchun editor per-question checklist hamda 15/50 generator invariantlari to‘liq PASS bo‘lmaguncha release HOLD.

**Manba-chegara:** Ushbu ro‘yxat Jalilovning konseptlari asosida loyiha uchun ishlab chiqilgan qo‘shimcha ishchi standart; rasman tasdiqlangan attestatsiya mezoni yoki inson ekspertining yakuniy xulosasi deb ko‘rsatilmaydi.
