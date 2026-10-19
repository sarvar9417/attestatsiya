# TASK-247 — barnoyevak pedagogika manbalari: ZIP intake va xavfsiz boshlang‘ich boyitish
**Sana:** 2026-10-19
**Branch:** `task/TASK-247-pedagogy-source-intake-20261019`
**Holat:** PARTIAL / SOURCE INVENTORY IN PROGRESS; **main merge, production deploy va DB write YO‘Q**

## 1. Arxiv va chiqarilgan manbalar: dastlabki inventar

- Maqsad akkaunt: **barnoyevak** Google Drive.
- Asosiy papka: https://drive.google.com/drive/folders/1XovTGCr2ELkRJJm_o7DQPnQoJsroSOoD
- Arxiv: `ChatExport_2026-10-19.zip` (Drive ID `1RyrFy-I-G2dKlvvgKkmshIVvTZgM1E1w`, **546831018 bayt**). Uni to‘g‘ridan-to‘g‘ri fetch qilish **413 / 268435456-byte limit** sababli imkonsiz edi.
- **Muammo yechildi:** foydalanuvchi arxivdan chiqarilgan fayllarni papkaga yuklamoqda.
- Extracted root: https://drive.google.com/drive/folders/1XryoV_toq5QDVfLBxhKnsa-jwbcmk-KS
- Pedagogika materiallari joylashgan `files` pastki papka: https://drive.google.com/drive/folders/1ERclL2nngkrPpSAtuHBBwemdw9zhFgw6
- **Hozirgi snapshot:** `files` ichida 104 ta obyekt: **59 PDF, 5 DOCX, 37 JPG, 1 PNG, 1 OGG, 1 MP3**. Yonidagi `photos`, `voice_messages` kataloglari va `result.json` chat eksportining alohida ma’lumotlari; ular foydalanuvchi ruxsatisiz pedagogika kontentiga ko‘chirilmaydi.
- **To‘liqlik chegarasi:** foydalanuvchi yuklashni davom ettiryapti; 104 soni yakuniy emas, har bir PDFning betlari/kalitlari hali tekshirilmagan.

### Dastlabki asosiy manbalar: fayl mavjudligi va matnli ochilishi tasdiqlangan

| Manba | Drive file ID | O‘rganish mavzusi | Joriy status |
|---|---|---|---|
| Xoliqov, «Pedagogik mahorat.pdf» | `1urZe1IJjLVco-KysxtIvg46Ej89XreuK` | M15.01, M15.06–07 | Matn ochildi; pedagogik mahoratning 4 komponenti aniqlandi; fizik sahifa auditi ochiq |
| «Pedagogning kasbiy standarti - qollanma.pdf» | `1BSndV9rDBv40mBcbTcZU3DxxZJJU5uH3` | M14.01–07 | Matn ochildi; 7 kompetensiya va sohalar ko‘rindi; sarlavhalar farqi alohida auditda |
| «Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf» | `1woZMas8dNbzk6yephzNH_XdmT19ess-l` | M15.01 | Matn ochildi; obyekt/predmet, fan vazifalari va tadqiqot usullari tasdiqlandi; M15.01 izohlari boyitildi |
| Qodirova, Pulatova, «4-Inklyuziv-talim-nazariya-va-metodika.pdf» | `1J67WL90Qh6uULzmI7yYIR0OJ6diTg3cX` | M14.05, M15.08 | 2022-yilgi  darslik matni ochildi; betma-bet mazmun auditi ochiq |

**Himoya:** arxivdagi fotosurat, audio, `result.json` yoki shaxsiy chat mazmunini o‘quv platformasiga ko‘chirmaslik. History/test source PDFdagi «100% original tushgan» degan gap mustaqil rasmiy isbot emas. Faqat manbasi va javobi tekshirilgan savol editorial reviewga o‘tishi mumkin; publishedga avtomatik emas.

## 2. Pedagogika audit xaritasi

Platformadagi 18 kanonik mavzu foydalanuvchiga o‘quv yo‘li sifatida ko‘rsatiladi; rasmiy sinovda savol taqsimoti **KS=5, PM.GEN=7, PM.MET=3** (jami 15) — 18 o‘quv mavzusi bilan aynan bir xil son emas.

| Modul | Mavzular | Kutilayotgan arxiv manbalari | Hozirgi dalil |
|---|---:|---|---|
| M14 | 7 | Pedagog kasb standarti, mehnat vazifalari va amaliy holatlar | Kasb standarti qo‘llanmasi ochildi; 7 soha manba bilan betma-bet solishtirish ochiq |
| M15 | 8 | Umumiy pedagogika, didaktika, tarbiya, etika, qobiliyatlar, inklyuziya, tarixiy testlar | Xoliqov, Mirzayeva, inklyuziv darsliklar ochildi; 8 mavzu manba-bet auditi ochiq |
| M16 | 3 | Informatika o‘qitish metodikasi, yondashuvlar, dars loyihalari | Yuklash va metodikaga oid fayllar inventari davom etadi; 3 mavzu auditi ochiq |

Har bir yangi manba uchun alohida `source_id`, fayl nomi, kitob muallifi/nashri, PDF fizik beti, mavzu kodi, mos ta’lim maqsadi, dalil turi, aniq tekshirilgan fakt, shubhali joy, ishlab chiqilgan savol va review holati yuritilishi kerak.

Tarixiy Telegram/test PDFdagi «to‘g‘ri javob» yorlig‘i mustaqil ekspert tekshiruvi yoki rasmiy sinov hujjati emas. Asl manba bilan tekshirilmagan itemlar **review/quarantine** holatidan nashrga avtomatik o‘tmaydi. Published revision/attemptlar joyida o‘zgartirilmaydi.

## 3. Shu branchda qilingan xavfsiz boshlang‘ich nazariya tuzatishi

**Qo‘shimcha, avvaldan mavjud alohida manba** (barnoyevak ZIP bilan adashtirilmasin):
- `Blum taskanomiyasi (2).pdf`, Sarvar Drive: https://drive.google.com/file/d/1vdzD1KgxOn651eAiJa8ztFdVtF9RCLYV/view . Unda 1956-yilgi 6 bosqich izohi mavjud; matnli o‘qish tasdiqlangan, fizik PDF bet lokatori **tekshirilmagan**. Bu ikkilamchi pedagogik o‘quv materiali, rasmiy spetsifikatsiya emas.
- Cornell University, Bloom's Taxonomy: https://teaching.cornell.edu/resource/blooms-taxonomy .
- University of Waterloo, Bloom's Taxonomy: https://uwaterloo.ca/centre-for-teaching-excellence/catalogs/tip-sheets/blooms-taxonomy .

**O‘zgarishlar:**
1. `src/data/pedagogyStudyNotes.ts`: M15.02 qo‘shimcha darsida 1956 **Bilish → Tushunish → Qo‘llash → Tahlil → Sintez → Baholash** va 2001 **Eslash → Tushunish → Qo‘llash → Tahlil → Baholash → Yaratish** talqinlari bo‘yicha taqqoslash, informatika vaziyatlari, testda adashmaslik izohi va source caveat.
2. `src/data/topicContent.ts`: M15.07da «Persiptiv» → «Perseptiv» terminologiyasi.
3. `src/tests/PedagogyBloomSource.test.ts`: ikki tarixiy talqin tartibi, informatika amaliy misoli, rasmiy kognitiv kvotadan farqi, ikkilamchi manba chegarasi va termin imlosi uchun Vitest regressiya.

**Aniq chegara:** Bu qo‘shimcha mavjud statik o‘quv izohini kuchaytiradi; barnoyevak ZIP ichidagi kitoblar hali ochilmagani sabab 18/18 manba tekshiruvi yoki test-bank qamrovi tugaganini bildirmaydi. M15 serverdagi published dars/tuzilish, backend scoring, answer key va production DBga tegilmadi.

## 4. Keyingi majburiy qadamlar va release gate

1. Foydalanuvchi tugatgach `files` katalogini qayta to‘liq ro‘yxatlash; dublikat va rasmlarni ajratish, faqat o‘quv manbalarini tasniflash.
2. Har bir PDFni betma-bet o‘rganish; spetsifikatsiya `M14.01–M16.03` ↔ learning objective ↔ manba sahifasi ↔ theory block ↔ test item izchilligini tekshirish.
3. Qarama-qarshi izoh/test kalitlarini alohida redaktsion navbatda ko‘rish; PDF tarixiy da’vosi bilan mustaqil tekshiruvni aralashtirmaslik.
4. 18/18 topic pool preflight, dedicated 15 va official 50, server key secrecy, 4 variant / Y1,Y2,Y3, mobile UI va oldingi attempt tarixini tekshirish.
5. Exact branch SHA uchun lint/typecheck/Vitest/E2E/SQL regressiya; **bu sessiyada full test suite ishga tushirilmadi**. PR/merge, production migration va deploy uchun alohida foydalanuvchi ruxsati zarur.

## 5. Handoff

- **Natija:** Arxiv va extracted `files` papkasi topildi; dastlabki 104 obyekt qayd etildi, 4 PDF matni o‘qildi. M15.01 obyekt/predmet/tadqiqot metodlari, M15.02 Bloom izohi boyitildi; M15.07 termin tuzatildi, 7 regression testi yozildi.
- **Migrations:** yo‘q.
- **Tests:** 7 ta Vitest testi yozildi; yakuniy exact SHA uchun CI va barcha regressiyalar hali tasdiqlanmagan.
- **Blocker:** ZIPni o‘zi o‘qilmaydi, ammo foydalanuvchi extracted `files` papkasini yuklayotgani tufayli manbalarga kirish mumkin. Qolgan xavf: yuklash tugamagan, barcha fayllar betma-bet tekshirilmagan.
- **Release:** HOLD; **merge/deploy yo‘q**.


## 6. Ikkinchi wave — ko‘rilgan manbalarni nazariyaga kiritish

- Faylma-fayl audit inventari: [TASK247_PDF_SOURCE_INVENTORY_20261019.md](TASK247_PDF_SOURCE_INVENTORY_20261019.md), barcha joriy 59 PDF ro‘yxatga olindi (to‘liq matn 2 qisqa konspekt; boshqa 8 manbadan parchalar o‘qildi; ikki PDF oddiy text fetch’da bo‘sh qaytdi; qolganlari navbatda). Bu snapshot yuklash davomida o‘zgaradi.
- **M15.04:** «Dars turlari.pdf» dagi oltita yetakchi didaktik maqsad bilan statik nazariya jadvali moslashtirildi. Laboratoriya/ekskursiya alohida didaktik maqsad sifatida tasniflanmadi. «dars tahlili turlari.pdf» dagi besh tahlil — didaktik, uslubiy, metodologik, psixologik, pedagogik — ajratildi.
- **M15.07:** «Pedagogik qobilyatlar umumiy.pdf» asosida perseptiv, empatik, kommunikativ va didaktik qobiliyatlar uchun farqlovchi vaziyatlar yozildi. «Avtoritar» tarixiy tasnifdagi termin o‘quvchini kamsitishni oqlamasligi tushuntirildi.
- **M15.08:** Qodirova/Pulatova (2022) darsligining kirish/ta’riflari bilan statik inklyuziya izohi kengaytirildi: ehtiyojga mos moslashtirish, teng imkoniyat, mazmunli ishtirok va vaziyatli misol.
- **Tarixiy testlar:** 2025 bahor (5)/(6) PDF connector o‘qigan **88 088 belgilik matn bo‘yicha aynan bir xil**; 2025 kuzgi asosiy/(1) esa faqat dastlabki 3000 belgi teng, to‘liq matn boshqa. Ularni avtomatik ikkita alohida bank deb import qilmaslik.
- **QA:** `src/tests/PedagogyBloomSource.test.ts`da 12 ta test yozildi. Human semantic source signoff, full test-suite exact SHA va 18/18 sahifa auditlari hali tugamagan.
- **Production:** faqat `task/TASK-247-pedagogy-source-intake-20261019`; merge/deploy/DB migration o‘zgarmadi.
