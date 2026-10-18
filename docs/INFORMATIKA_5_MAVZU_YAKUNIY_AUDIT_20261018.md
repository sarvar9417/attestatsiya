# Informatika: 5 mavzu bo‘yicha yakuniy tanqidiy audit

**Audit sanasi:** 2026-10-18  
**Audit obyekti:** kompyuter va uning qurilmalari (M02), mantiq (M04), sanoq sistemalari (M05), algoritmlar (M06), Scratch va LOGO (M07)  
**Repository snapshot:** `b1622d3c8c354e5b08b36ad99649034d02bad39a`  
**Production snapshot:** Supabase `plyqezulrfowyblsfpzy`, 2026-10-18  
**Audit turi:** read-only; production kontentiga o‘zgartirish kiritilmadi

## 1. Yakuniy hukm

**Umumiy holat: RELEASE-READY EMAS.**

Kontent hajmi katta va ko‘p savollar texnik jihatdan to‘liq: tekshirilgan besh guruhda 901 ta `published` savolning barchasida kalit, 4 ta variant, izoh, konstrukt va source-lesson bog‘lanishi mavjud. To‘liq savol+variant+kalit bo‘yicha aynan takrorlangan item topilmadi. Biroq bu raqamlar o‘quvchiga real yetib borayotgan sifatni ifodalamaydi.

Asosiy sabablar:

1. **P0 — M04, M06 va M07 integratsiyasi uzilgan.** Backend resolver ushbu modullarni kanonik `Mxx.yy` kodi orqali topmaydi. 16 ta published darsning 16 tasi resolverning mavjud strategiyalari bilan yechilmaydi. Natijada boy production bank o‘rniga frontenddagi juda kichik statik fallback ishlaydi yoki backend oqimi `not found` beradi.
2. **P0 — M06.03 bo‘yicha published savol yo‘q.** `S3.ALGO.03` konstruktida 0 ta published, 90 ta review savol bor. Bu obyektiv qamrov bo‘shlig‘i.
3. **P1 — ekspert tahrir izi yo‘q.** Beshta mavzudagi 901 ta published savolning 901 tasida `question_editorial_checks` yozuvi yo‘q; urinish statistikasi ham yo‘q. Demak, AI-draftdan keyingi majburiy mustaqil ekspert ko‘rigi va empirik item tahlili DB orqali isbotlanmagan.
4. **P1 — format xilma-xilligi yetarli emas.** Published bankning 871/901 qismi Y1. M05 va M07 dagi 20 item source metadata’da Y2/Y3 deb belgilangan, lekin DB da Y1 bo‘lib qolgan. Tarixiy testlarda esa matching, ordering, kod va grafik tahlil muntazam uchraydi.
5. **P1 — tasdiqlangan fakt/noaniqlik xatolari bor.** M02 dagi ENIAC raqamlari manba darslikka mos emas; M06 da algoritm xossalari va Big-O bo‘yicha noaniq/generalizatsiyalangan itemlar; M07 da Scratch boshlang‘ich koordinatasi va blok kategoriyalari soni bo‘yicha versiyaga bog‘liq holatlar mutlaq fakt sifatida berilgan.
6. **P1 — ayrim banklarda javob pozitsiyasi signali juda kuchli.** Published Y1 savollarda to‘g‘ri javob birinchi variant bo‘lishi M02 da 35/40 (87,5%), M06 da 35/41 (85,4%). Immediate-feedback dars endpointi variantlarni `order_idx` bo‘yicha qaytaradi; u yerda bu signal aralashtirilmaydi.
7. **P1 — vizual/kodli topshiriqlar production published bankida deyarli yo‘q.** 901 ta published itemning birortasida asset yoki embedded visual markup yo‘q. M04 dagi 52 ta grafik savol review holatida qolgan. Bu real attestatsiya materiallaridagi blok-sxema, LOGO/Turtle shakli va grafik sxemalarga yetarli tayyorgarlik bermaydi.

Shu sababli platformani “besh mavzu bo‘yicha to‘liq va attestatsiyaga tayyor” deb belgilash hozircha asossiz. **M05 eng tayyor**, M04 va M07 kontent jihatdan kuchli, lekin integratsiya bloklangan; M02 yangi banki review’da; M06 esa kontent, qamrov va integratsiya bo‘yicha eng katta xavfdir.

## 2. Audit qamrovi va manba ierarxiyasi

Audit quyidagi dalillarni o‘zaro solishtirdi:

1. **Rasmiy spetsifikatsiya:** `20-Informatika-Testlar-spesifikatsiyasi.pdf`, ayniqsa 3–4-betlar.
2. **Drive / Attestatsiya korpusi:** 5–11-sinf ICT va Cambridge+ darsliklari, 2025/2026 demo materiallari, `20000-LIK`, 07.04.2026 va 13.04.2026 tushgan savollar.
3. **Repository source-of-truth:** `informatika-attestatsiya-platform-spec/*`, `src/data/*`, `backend/src/*`, `supabase/migrations/*`, testlar va oldingi auditlar.
4. **Production DB holati:** published/review/draft darslar, savollar, formatlar, kalitlar, source metadata, editorial-check va asset jadvallari.
5. **Loyiha chatlarining kirish mumkin bo‘lgan konteksti:** avvalgi M02/M04/M05/M06/M07 natija da’volari, cheklovlar va deploy holatlari.

Manbalar ustuvorligi:

`Rasmiy spetsifikatsiya → rasmiy darslik → real o‘tgan yil testi → rasmiy/demo test → platforma mualliflik kontenti`.

### Cheklov

“Barcha chatlar” talabi tizim orqali qidirish mumkin bo‘lgan loyiha konteksti doirasida bajarildi; o‘chirilgan, ruxsatsiz yoki indekslanmagan chatlarni ko‘rish imkoni yo‘q. PDF skanlari OCR qilindi, ammo OCR matni yakka o‘zi fakt manbasi sifatida emas, sahifa tasviri/manba bilan birga ishlatildi. Ushbu hujjat pedagog-ekspert imzosini almashtirmaydi.

## 3. Rasmiy imtihon talabi

Rasmiy spetsifikatsiya bo‘yicha ushbu besh mavzu mutaxassislik blokining **13 ta savolini** tashkil qiladi:

| Mavzu | Savol soni |
|---|---:|
| Kompyuter va uning qurilmalari | 2 |
| Mantiq | 3 |
| Sanoq sistemalari | 2 |
| Algoritmlar | 3 |
| Scratch va LOGO | 3 |
| **Jami** | **13** |

Spetsifikatsiya Y1 (bitta javob), Y2 (moslashtirish) va Y3 (ketma-ketlik) formatlarini nazarda tutadi. Tarixiy/demo materiallarda quyidagilar tasdiqlandi:

- aralash sanoq sistemalarida hisoblash va tartiblash;
- mantiqiy ifoda qiymatini topish;
- qurilmalarni vazifa bilan moslashtirish;
- blok-sxema va algoritm turini aniqlash;
- Scratch kodi natijasini tahlil qilish;
- LOGO/Turtle `REPEAT`, `FD`, `RT` buyruqlari hosil qilgan shaklni topish;
- amallar yoki Windows jarayonlarini to‘g‘ri ketma-ketlikda joylash.

Shuning uchun faqat matnli, recall-uslubidagi Y1 bank rasmiy konstruktning to‘liq ifodasi emas.

## 4. Production holati — 2026-10-18 snapshot

### 4.1. Savollar va darslar

| Modul | Published dars | Published | Review | Draft | Published Y1/Y2/Y3 | Asosiy hukm |
|---|---:|---:|---:|---:|---:|---|
| M02 — kompyuter/qurilmalar | 4 | 43 | 528 | 0 | 40 / 2 / 1 | Yangi 528 bank review’da; published bank kichik va pozitsiya signalli |
| M04 — mantiq | 6 | 305 | 64 | 0 | 303 / 1 / 1 | Bank boy, ammo resolver sabab learner oqimiga ulanmagan |
| M05 — sanoq sistemalari | 3 | 303 | 0 | 0 | 285 / 2 / 16 | Eng tayyor modul; format metadata va ekspert review kamchiligi bor |
| M06 — algoritmlar | 4 | 45 | 234 | 12 | 41 / 2 / 2 | `S3.ALGO.03=0`; V2 asosan review/draft; resolver ham uzilgan |
| M07 — Scratch/LOGO | 6 | 205 | 0 | 0 | 202 / 2 / 1 | Kontent hajmi yaxshi, ammo resolver, format va vizual ijro dalili muammo |
| **Jami** | **23** | **901** | **826** | **12** | **871 / 9 / 21** | **Published sonning o‘zi release tayyorligini isbotlamaydi** |

### 4.2. Konstrukt bo‘yicha published qamrov

| Guruh | Konstruktlar | Published sonlar | Holat |
|---|---|---|---|
| S2.HW | `.01/.02/.03/.04` | 16 / 8 / 8 / 11 | Barcha konstrukt bor, lekin 20 savollik lesson targetidan kichik |
| S3.LOGIC | `.01/.02/.03/.04` | 30 / 117 / 60 / 98 | Son jihatdan yetarli |
| S3.NUM | `.01/.02/.03` | 116 / 108 / 79 | Son jihatdan yetarli |
| S3.ALGO | `.01/.02/.03/.04` | 8 / 14 / **0** / 23 | **.03 bloklovchi bo‘shliq** |
| S4.BLOCK | `.01/.02/.03/.04/.05` | 64 / 33 / 37 / 37 / 34 | Son jihatdan yetarli |

`topic_test_question_count` M02/M04/M05/M06 darslarida 20, M07 darslarida 30. Adaptive preview kichik poolga test hajmini kamaytirishi mumkin, ammo required objective bo‘shlig‘ini yumshatmaydi. Shu sabab M06.03 baribir fail-closed bo‘lishi kerak.

## 5. Ustuvor topilmalar

### P0-01. M04/M06/M07 kanonik dars kodlari backendda resolve bo‘lmaydi

`backend/src/lib/resolveIds.ts` dagi maxsus kanonik regex faqat `M02`, `M05`, `M14–M16` ni qamrab oladi:

```text
/^(M(?:02|05|1[456]))\.(0[1-9]|[1-9][0-9])$/
```

M04, M06 va M07 fallback strategiyalari esa:

- `m04-01` kabi exact slug;
- title `M04.01` bilan boshlanishi;
- slug `m04-01...` bilan boshlanishi

shartlariga tayangan. Production slugs esa `mantiqiy-mulohazalar`, `algoritm-va-turlari`, `scratch-...` kabi tavsifiy nomlarda; title ham kod bilan boshlanmaydi. Read-only SQL simulyatsiyasi bo‘yicha 16/16 dars resolve bo‘lmadi.

Ta’sir:

- M04 DB nazariyasi overlay qilinmaydi;
- M04/M06/M07 published savollari lesson endpointdan kelmaydi;
- frontend xatoni ushlab, statik fallback testga qaytadi;
- real learner ko‘radigan fallback taxminan M04=18, M06=12, M07=18 savol — DB dagi 305/45/205 emas;
- progress va preflight ham kanonik lesson UUID ga yetib bormaydi.

**Release gate:** resolver M04/M06/M07 ni modul+`order_idx`+`published` orqali qat’iy resolve qilishi va barcha 16 dars uchun backend/integration regressiya testi bo‘lishi shart.

### P0-02. Algoritmlarda majburiy obyektiv banki bo‘sh

`S3.ALGO.03` production holati:

- published: **0**;
- review: **90**;
- lesson: `M06.03 — masala algoritmini tuzish`;
- `lesson_constructs`: required, `min_questions=1`.

Bu faqat “kam savol” emas, obyektiv bo‘yicha mutlaq published bo‘shliq. Boshqa S3 savollari umumiy mock kvotasini to‘ldirishi mumkin, lekin bu M06.03 qamrovini isbotlamaydi.

**Release gate:** kamida talab etilgan miqdordagi ekspert-tasdiqlangan, source-backed, format jihatdan turli savollar published bo‘lishi va preflight `objective_gap` bermasligi kerak.

### P1-01. Human editorial review va item-statistika isbotlanmagan

Tekshirilgan 901 ta published item uchun:

- `question_editorial_checks`: 0/901;
- learner attempt/statistika: 0/901;
- asset: 0/901.

Bu “savollar xato” degani emas. Bu `CONTENT_AUTHORING_STANDARD.md` va AI kontenti haqidagi loyiha qarorlariga muvofiq mustaqil ekspert ko‘rigi **isbotlanmagan** degani. Oldingi chatlardagi “tayyor”, “DB ga kiritildi”, “published” da’volari ekspert tasdig‘i bilan tenglashtirilmasligi kerak.

**Release gate:** kamida correctness, ambiguity, source-page, format, distractor va language check natijalari yozilib, reviewer/vaqt bilan audit izi yaratilishi kerak.

### P1-02. Format va provenance parity buzilgan

Productionda M05 va M07 bo‘yicha jami 20 itemning source metadata’si ularni PDF-format Y2/Y3 deb ta’riflaydi, lekin real `questions.format` qiymati Y1:

- M05: 4 ta Y2 + 4 ta Y3 metadata → Y1;
- M07: 6 ta Y2 + 6 ta Y3 metadata → Y1.

Variant ichiga matching/ordering natijasini joylash texnik jihatdan bitta javobli savol yaratadi, ammo uni Y2/Y3 deb provenance’da ko‘rsatish noto‘g‘ri va format xilma-xilligini sun’iy oshirib ko‘rsatadi.

**Release gate:** metadata va real format bir xil bo‘lishi; haqiqiy Y2/Y3 renderer/answer model bilan sinovdan o‘tishi kerak.

### P1-03. Javob pozitsiyasi orqali topish mumkin

Published Y1 to‘g‘ri variant pozitsiyasi:

| Modul | 1-variant to‘g‘ri | Ulush |
|---|---:|---:|
| M02 | 35/40 | 87,5% |
| M06 | 35/41 | 85,4% |
| M04 | taxminan 25% | muvozanatli |
| M05 | 24–26% oralig‘i | muvozanatli |
| M07 | 31,7% | qisman og‘ish |

Topic/exam generator option tartibini aralashtiradi, ammo immediate-feedback lesson endpointi `order_idx` tartibini saqlaydi. Demak, ayniqsa resolver tuzatilgach M02/M06 dars mashqlarida mazmunsiz test-taking shortcut paydo bo‘ladi.

**Release gate:** import vaqtida to‘g‘ri variant pozitsiyasini balanslash yoki lesson endpointda deterministik-per-attempt shuffle; regressiya testida har bir modul uchun pozitsiya taqsimotini tekshirish.

### P1-04. Vizual va bajarib ko‘rilgan kod dalili yetishmaydi

Real savollarda LOGO/Turtle shakli, Scratch bloklari va blok-sxemalar uchraydi. Published 901 itemda asset yo‘q. M04 uchun tayyorlangan 52 grafik item review holatida. M07 oldingi ish xulosasida barcha skriptlar real Scratch/LOGO muhitida bajarib ko‘rilmagani qayd etilgan.

**Release gate:** kamida real spetsifikatsiya nisbatiga mos vizual/code-trace subset, alt-text, asset integrity va Scratch/LOGO execution log/screenshot dalili.

### P1-05. Production migration drift

Repositoryda `20261018131000_topic_test_preflight.sql` mavjud, ammo production `pg_proc` snapshotida `topic_test_preflight(uuid)` yo‘q; faqat `generate_topic_test(uuid)` va `topic_test_preview(uuid)` mavjud. Backend missing-RPC holatida legacy preflight + adaptive preview fallback ishlatadi, shuning uchun bu yakka o‘zi outage emas. Lekin repository va production drift release ishonchliligini pasaytiradi.

**Release gate:** migration inventari reconcile qilinishi va deployment proof saqlanishi kerak.

### P2-01. Izohlar juda qisqa va distractor feedback bermaydi

Published izoh medianlari:

| Modul | Median uzunlik | 80 belgidan qisqa |
|---|---:|---:|
| M02 | 73 | 28/43 |
| M04 | 109 | 62/305 |
| M05 | 58 | 238/303 |
| M06 | 64 | 35/45 |
| M07 | 39 | 200/205 |

Qisqa izoh avtomatik xato emas, lekin ko‘p holatda u faqat kalitni qaytaradi (`8−3=5`, `1→2→3`) va noto‘g‘ri variant nima uchun xato ekanini tushuntirmaydi. Bu mashqning o‘rgatuvchi qiymatini kamaytiradi.

## 6. Mavzu kesimidagi tanqidiy xulosa

### 6.1. M02 — kompyuter va uning qurilmalari

**Kuchli tomonlar**

- To‘rtta kanonik konstrukt productionda bor.
- Yangi KTD banki 528 ta itemdan iborat, kalit/variantlar struktura tekshiruvlaridan o‘tgan.
- Statik nazariya to‘qqiz eski bo‘limni to‘rtta kanonik darsga yo‘qotmasdan yig‘adi va source-hint beradi.

**Kamchiliklar**

- 528 yangi itemning barchasi review holatida; avvalgi chat xulosasida faqat 10/528 source-reverified, 518 tasi kutayotgan deb qayd etilgan.
- Learner uchun published bank 43 ta; darslar bo‘yicha 16/8/8/11, ya’ni 20 talik nominal targetdan past.
- Published Y1 javob pozitsiyasi juda notekis.
- Nazariyada tasdiqlangan manba qarama-qarshiligi bor: `src/data/topicContent.ts` dagi learner statik kontenti ENIAC uchun **30 tonna, 167 m²** deydi; `16-ICT-10_sinf-2021-1-.pdf`, PDF 5-bet esa **70 tonnaga yaqin, 120 m²** deydi.
- “V avlod: 2000–hozir, AI/kvant/neyro” kabi qat’iy periodizatsiya manba darslikdagi “izlanishlar olib borilmoqda” ifodasidan kuchliroq va versiya/manbaga bog‘liq.

**Hukm:** **shartli HOLD**. 528 bank source-verification va ekspert review’dan o‘tmaguncha published qilish mumkin emas; mavjud nazariya faktlari darslikka reconcile qilinishi kerak.

### 6.2. M04 — mantiq

**Kuchli tomonlar**

- 305 published item va to‘rtta mantiq konstrukti bo‘yicha kuchli sonli qamrov.
- To‘g‘ri javob pozitsiyalari yaxshi balanslangan.
- Nazariya 6 darsda mazmunan chuqur; truth table, amallar, sxema, model va yechish bosqichlari bor.
- 52 ta grafik savol uchun alohida review qatlam mavjud.

**Kamchiliklar**

- Resolver buzilishi sabab production boyligi learner oqimida ishlamaydi; frontend 18 ta statik savolga tushadi.
- Published format deyarli butunlay Y1: 303/305.
- 52 vizual item published emas; real tarixiy testdagi sxema/grafik talabi yopilmagan.
- DB rich theory faqat resolver orqali overlay qilinadi; resolver muammosi nazariyani ham chetlab o‘tadi.

**Hukm:** **kontent tayyorligiga yaqin, integratsiya sabab BLOCKED**.

### 6.3. M05 — sanoq sistemalari

**Kuchli tomonlar**

- 303 published item, barcha uch konstrukt bo‘yicha kuchli qamrov.
- To‘g‘ri javob pozitsiyasi balanslangan.
- 3 dars, 11 bobga yaqin boy nazariya, 151 structured block.
- Tekshirilgan arifmetik misollarda tasdiqlangan hisob xatosi topilmadi.
- Y3 ulushi boshqa modullarga qaraganda yuqori: 16 ta.

**Kamchiliklar**

- 8 ta source-format metadata mismatch (4 Y2 + 4 Y3 real DB da Y1).
- Ko‘p izohlar juda qisqa va yechim strategiyasini bermaydi.
- 303 item uchun editorial-check izi yo‘q.
- Published asset yo‘q; aralash-baza tartiblash va yechim bosqichlarini ko‘rsatadigan ko‘rgazmali ishlanmalar kam.

**Hukm:** **eng tayyor, lekin ekspert review va format parity sharti bilan CONDITIONAL PASS**.

### 6.4. M06 — algoritmlar

**Kuchli tomonlar**

- V2 paket katta: jami 240 item (review/draft qatlam), Y2/Y3 namunalar va boyroq nazariya tayyorlangan.
- Blok-sxema, psevdokod, konstruksiyalar va tahlil yo‘nalishlari rejalashtirilgan.

**Kamchiliklar**

- `S3.ALGO.03` published=0; 90 item review’da.
- Published bank atigi 45 ta; V2 learner uchun hali faol emas.
- 11 ta V2 lesson review holatida; published 4 lesson body qisqa, ko‘pchiligida worked example/common error/quick check yo‘q.
- Resolver sabab 45 published item ham kanonik learner oqimiga kelmaydi; frontend 12 statik itemga tushadi.
- Tasdiqlangan/noaniq kontent muammolari:
  - `M06.01-q1` “chekli qadamlardan iborat” iborasini `diskretlik` bilan bog‘laydi; qadamlarga bo‘linish — diskretlik, chekli qadamda natija — natijalilik. Savol ikki xossani aralashtiradi.
  - `M06.04-q2` “bitta sikl operatori qanday murakkablikka ega?” → `O(n)` deb mutlaq javob beradi. Sikl chegarasi va ichki amallariga qarab `O(1)`, `O(log n)`, `O(n)` va boshqacha bo‘lishi mumkin.
  - Big-O/search kabi material rasmiy maktab manbasida ushbu konstruktning asosiy talabi sifatida aniq dalillanmagan; avvalgi V2 xulosasida ham “extra” sifatida qayd etilgan.

**Hukm:** **BLOCKED; besh mavzu ichida eng past tayyorlik**.

### 6.5. M07 — Scratch va LOGO

**Kuchli tomonlar**

- 205 published item va besh konstrukt bo‘yicha yetarli sonli qamrov.
- 6 darsli nazariya; Scratch koordinata, hodisa, o‘zgaruvchi, shart/sikl, Pen va LOGO qamrab olingan.
- Tarixiy real testdagi `REPEAT/FD/RT` yo‘nalishi hisobga olingan.

**Kamchiliklar**

- Resolver sabab 205 item o‘rniga 18 statik savol ishlaydi.
- 202/205 published item Y1; 12 ta source-format mismatch mavjud.
- Published asset yo‘q; real testdagi Turtle/LOGO shakli matn bilan almashtirilgan yoki review darajasida qolgan.
- Oldingi ish xulosasida barcha Scratch/LOGO skriptlari real muhitda execute qilinmagani qayd etilgan.
- Tasdiqlangan/noaniq kontent muammolari:
  - `M07.01-q3`: “sprayt dastur ishga tushganda (0,0) ga joylashadi” — noto‘g‘ri umumlashtirish. Green flag sprite’ni avtomatik markazga qaytarmaydi; faqat yangi default loyiha/sprite konteksti shunday bo‘lishi mumkin.
  - `M07.02-q3`: “8 ta asosiy blok bo‘limi” deb `My Blocks` ni tashlab ketadi. Scratch 3 da `My Blocks` asosiy kategoriya sifatida mavjud; savol versiyani ko‘rsatmagan.
  - LOGO provenance ko‘p itemda `ATT-2026-04-13 PDF4; SPETS; klassik LOGO sintezi` tarzida umumiy. Tarixiy sahifa `REPEAT/FD/RT` ni dalillaydi, ammo `BK/PU/PD/HOME/CS` uchun aniq sahifa manbasi ko‘rsatilmagan.

**Hukm:** **kontent soni yaxshi, ammo integratsiya va amaliy verifikatsiya sabab BLOCKED**.

## 7. Nimalar xato deb belgilanmadi

Audit ortiqcha salbiy xulosa chiqarmaslik uchun quyidagilarni ajratdi:

- Bir xil umumiy stem bilan turli payload berilgan 8 klaster/29 item bor, ammo variant+kalit bilan to‘liq fingerprint bo‘yicha **0 exact duplicate**. Ular avtomatik dublikat deb belgilanmadi.
- 901 published savolda kalit, 4 variant, explanation, construct va source-lesson bog‘lanishi mavjud. Struktura yaxlitligi yaxshi.
- M05 arifmetik misollarida audit davomida tasdiqlangan hisob xatosi topilmadi.
- M04 banki son, javob pozitsiyasi va nazariya hajmi bo‘yicha kuchli; asosiy muammo kontentning mavjud emasligi emas, o‘quvchi oqimiga ulanmaganidir.
- `published_pool < topic_test_question_count` har doim hard failure emas: adaptive preview test hajmini mavjud poolga kamaytirishi mumkin. Required objective=0 holati esa baribir bloklovchi.

## 8. Majburiy tuzatish va qayta-audit tartibi

### Release oldidan P0

1. M04/M06/M07 ni kanonik resolverga qo‘shish; 16/16 lesson integration test.
2. M06.03 uchun expert-approved published bank yaratish; objective preflightni yashil qilish.
3. M02 ENIAC faktini rasmiy darslik bilan reconcile qilish.
4. M06.01-q1, M06.04-q2, M07.01-q3, M07.02-q3 ni tuzatish yoki arxivlash.
5. Production migration driftni reconcile qilish va deploy proof saqlash.

### Release oldidan P1

6. 901 published itemni risk-based editorial review’dan o‘tkazish; avvalo yuqoridagi xatolar, M02/M06 position-biased bank va source-format mismatchlar.
7. M05/M07 dagi 20 format/provenance mismatchni tuzatish; haqiqiy Y2/Y3 item modelini ishlatish.
8. M02/M06 variant pozitsiyasini balanslash/shuffle qilish.
9. Real test korpusiga mos vizual/code-trace savollarni published qilish; M04 review’dagi 52 grafik itemni ekspert ko‘rigidan keyin bosqichma-bosqich aktivlashtirish.
10. Scratch/LOGO skriptlarini real muhitda bajarib, expected output dalilini saqlash.

### Sifatni mustahkamlash P2

11. Qisqa izohlarni “nega to‘g‘ri + nega asosiy distractor xato” formatiga kengaytirish.
12. Har bir published bank uchun minimum sample emas, riskga mos ikki kishilik review va keyin item-statistika monitoringi.
13. Source reference’ni fayl+sahifa+qoida darajasiga aniqlashtirish; “klassik model sintezi” kabi noaniq provenance’ni kamaytirish.

## 9. Qayta-audit acceptance mezonlari

Quyidagi shartlarning barchasi bajarilmaguncha umumiy holat `RELEASE-READY` bo‘lmaydi:

- [ ] M04/M06/M07 16/16 darsi kanonik koddan UUID ga resolve bo‘ladi.
- [ ] Learner lesson testida DB bank keladi; fallback faqat haqiqiy offline holatda ishlaydi.
- [ ] `S3.ALGO.03` published pool required minimumdan kam emas.
- [ ] Yuqorida ko‘rsatilgan 4 ta kontent xatosi/noaniqligi yopilgan.
- [ ] M05/M07 20 ta metadata/format mismatch = 0.
- [ ] M02/M06 answer-position leakage belgilangan threshold ichida.
- [ ] Har bir modulda rasmiy format va real test uslubiga mos Y1/Y2/Y3/visual/code-trace qamrovi bor.
- [ ] Editorial-check audit izi mavjud va unresolved critical issue = 0.
- [ ] Scratch/LOGO execution proof mavjud.
- [ ] Production migration va repository migration inventari mos.
- [ ] Backend unit/integration, DB regressiya, frontend learner-flow E2E va build yashil.

## 10. Dalillar xaritasi

### Repository

- `informatika-attestatsiya-platform-spec/CONTENT_BLUEPRINT.md`
- `informatika-attestatsiya-platform-spec/CONTENT_AUTHORING_STANDARD.md`
- `informatika-attestatsiya-platform-spec/DOMAIN_RULES.md`
- `docs/QUESTION_BANK_SPEC_POLICY.md`
- `src/data/topicContent.ts`
- `src/data/topics/m02Canonical.ts`
- `src/data/topics/m02SourceTheory.ts`
- `src/pages/TopicView.tsx`
- `src/services/api.ts`
- `backend/src/lib/resolveIds.ts`
- `backend/src/services/content.service.ts`
- `supabase/migrations/20261018131000_topic_test_preflight.sql`
- `supabase/tests/*`

### Drive/PDF korpusi

- `20-Informatika-Testlar-spesifikatsiyasi.pdf`
- `06–11 Cambridge+ 5–11-sinf` darsliklari
- `12–18 ICT 5–11-sinf` darsliklari
- `21-20000-LIK-informatika.pdf`
- `22-Demo-2026-test-10-000-so-mlik.pdf`
- `23-Informatika-Demo-testi-.pdf`
- `24-13.04.2026-Attetasiya-Tushgan-savollar.pdf`
- `25-Tushgan-testlar-07.04.2026.pdf`

### Production read-only tekshiruvlari

- status/module/construct/format bo‘yicha savol sanog‘i;
- missing key/options/explanation/source link tekshiruvi;
- editorial check va attempt-statistika mavjudligi;
- answer-position va explanation-length taqsimoti;
- exact fingerprint duplicate tekshiruvi;
- asset/markup mavjudligi;
- lesson slug/title/order va resolver strategiyasi parity;
- `pg_proc` orqali preflight/generator funksiyalari inventari.

## 11. Umumiy xulosa

Jamoa besh mavzu bo‘yicha sezilarli kontent bazasi yaratgan: sanoq sistemalari va mantiq banklari ayniqsa kuchli, Scratch/LOGO qamrovi keng, M02 va M06 uchun katta review paketlari tayyorlangan. Ammo hozirgi tizimda “yaratildi”, “DB ga kiritildi” va “o‘quvchiga to‘liq, xatosiz ishlayapti” uch xil holat bo‘lib qolmoqda.

Eng katta xavf savollar sonida emas, **source → review → publish → resolver → learner UI** zanjirining uzilganida. M04/M06/M07 boy banklari learner oqimiga yetib bormaydi; M06 da bitta rasmiy obyektiv butunlay publishedsiz; human editorial proof yo‘q; real testdagi vizual va murakkab formatlar yetarli emas. Shu muammolar yopilgach, avvalo M05, keyin M04/M07, so‘ng M02 va M06 bosqichma-bosqich qayta-audit qilinishi kerak.

**Yakuniy status:** `NOT RELEASE-READY — P0/P1 remediation va mustaqil ekspert tasdig‘i talab etiladi`.
